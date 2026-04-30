-- 1. Enums
CREATE TYPE public.task_status   AS ENUM ('todo','in_progress','done','cancelled');
CREATE TYPE public.task_priority AS ENUM ('low','medium','high','urgent');

-- 2. Counter on crm_clients
ALTER TABLE public.crm_clients
  ADD COLUMN open_tasks_count integer NOT NULL DEFAULT 0;

-- 3. crm_tasks
CREATE TABLE public.crm_tasks (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id                uuid REFERENCES public.crm_clients(id) ON DELETE SET NULL,
  source_communication_id  uuid REFERENCES public.communications(id) ON DELETE SET NULL,
  linked_issue_id          uuid REFERENCES public.crm_issues(id) ON DELETE SET NULL,
  title                    text NOT NULL,
  notes                    text,
  status                   public.task_status   NOT NULL DEFAULT 'todo',
  priority                 public.task_priority NOT NULL DEFAULT 'medium',
  assignee_id              uuid,
  created_by               uuid NOT NULL,
  due_date                 date,
  completed_at             timestamptz,
  tags                     text[] NOT NULL DEFAULT '{}',
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_crm_tasks_client       ON public.crm_tasks(client_id);
CREATE INDEX idx_crm_tasks_assignee     ON public.crm_tasks(assignee_id);
CREATE INDEX idx_crm_tasks_status       ON public.crm_tasks(status);
CREATE INDEX idx_crm_tasks_due_date     ON public.crm_tasks(due_date);
CREATE INDEX idx_crm_tasks_source_comm  ON public.crm_tasks(source_communication_id);
CREATE INDEX idx_crm_tasks_linked_issue ON public.crm_tasks(linked_issue_id);

-- 4. RLS
ALTER TABLE public.crm_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "CRM users can view tasks"
  ON public.crm_tasks FOR SELECT
  USING (public.has_crm_access(auth.uid()));

CREATE POLICY "CRM writers can insert tasks"
  ON public.crm_tasks FOR INSERT
  WITH CHECK (public.has_crm_write(auth.uid()) AND auth.uid() = created_by);

CREATE POLICY "CRM writers can update tasks"
  ON public.crm_tasks FOR UPDATE
  USING (public.has_crm_write(auth.uid()))
  WITH CHECK (public.has_crm_write(auth.uid()));

CREATE POLICY "Delete own tasks or admin any"
  ON public.crm_tasks FOR DELETE
  USING (
    (public.has_crm_write(auth.uid()) AND auth.uid() = created_by)
    OR public.has_role(auth.uid(), 'admin'::public.app_role)
  );

-- 5a. completed_at trigger
CREATE OR REPLACE FUNCTION public.crm_tasks_set_completed_at()
RETURNS trigger LANGUAGE plpgsql SET search_path TO '' AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.status = 'done'::public.task_status AND NEW.completed_at IS NULL THEN
      NEW.completed_at := now();
    END IF;
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' AND NEW.status IS DISTINCT FROM OLD.status THEN
    IF NEW.status = 'done'::public.task_status AND NEW.completed_at IS NULL THEN
      NEW.completed_at := now();
    ELSIF NEW.status <> 'done'::public.task_status THEN
      NEW.completed_at := NULL;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_crm_tasks_set_completed_at
  BEFORE INSERT OR UPDATE ON public.crm_tasks
  FOR EACH ROW EXECUTE FUNCTION public.crm_tasks_set_completed_at();

-- 5b. counter trigger
CREATE OR REPLACE FUNCTION public.crm_tasks_maintain_client_counter()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '' AS $$
DECLARE
  v_was_open boolean;
  v_is_open  boolean;
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.client_id IS NOT NULL
       AND NEW.status NOT IN ('done'::public.task_status, 'cancelled'::public.task_status) THEN
      UPDATE public.crm_clients
        SET open_tasks_count = open_tasks_count + 1
        WHERE id = NEW.client_id;
    END IF;
    RETURN NEW;
  END IF;

  IF TG_OP = 'DELETE' THEN
    IF OLD.client_id IS NOT NULL
       AND OLD.status NOT IN ('done'::public.task_status, 'cancelled'::public.task_status) THEN
      UPDATE public.crm_clients
        SET open_tasks_count = GREATEST(open_tasks_count - 1, 0)
        WHERE id = OLD.client_id;
    END IF;
    RETURN OLD;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    v_was_open := OLD.client_id IS NOT NULL
                  AND OLD.status NOT IN ('done'::public.task_status, 'cancelled'::public.task_status);
    v_is_open  := NEW.client_id IS NOT NULL
                  AND NEW.status NOT IN ('done'::public.task_status, 'cancelled'::public.task_status);

    IF NEW.client_id IS DISTINCT FROM OLD.client_id THEN
      IF v_was_open THEN
        UPDATE public.crm_clients
          SET open_tasks_count = GREATEST(open_tasks_count - 1, 0)
          WHERE id = OLD.client_id;
      END IF;
      IF v_is_open THEN
        UPDATE public.crm_clients
          SET open_tasks_count = open_tasks_count + 1
          WHERE id = NEW.client_id;
      END IF;
    ELSIF v_was_open AND NOT v_is_open THEN
      UPDATE public.crm_clients
        SET open_tasks_count = GREATEST(open_tasks_count - 1, 0)
        WHERE id = NEW.client_id;
    ELSIF NOT v_was_open AND v_is_open THEN
      UPDATE public.crm_clients
        SET open_tasks_count = open_tasks_count + 1
        WHERE id = NEW.client_id;
    END IF;

    RETURN NEW;
  END IF;

  RETURN NULL;
END;
$$;

CREATE TRIGGER trg_crm_tasks_maintain_client_counter
  AFTER INSERT OR UPDATE OR DELETE ON public.crm_tasks
  FOR EACH ROW EXECUTE FUNCTION public.crm_tasks_maintain_client_counter();

-- 5c. updated_at
CREATE TRIGGER trg_crm_tasks_set_updated_at
  BEFORE UPDATE ON public.crm_tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Backfill from communications.pending_follow_up_note
WITH inserted AS (
  INSERT INTO public.crm_tasks (
    client_id, source_communication_id, title, notes,
    status, priority, assignee_id, created_by, due_date
  )
  SELECT
    c.client_id,
    c.id,
    LEFT(split_part(c.pending_follow_up_note, E'\n', 1), 200),
    CASE
      WHEN position(E'\n' IN c.pending_follow_up_note) > 0
        THEN c.pending_follow_up_note
      ELSE NULL
    END,
    'todo'::public.task_status,
    'medium'::public.task_priority,
    c.logged_by,
    c.logged_by,
    (c.occurred_at::date + INTERVAL '3 days')::date
  FROM public.communications c
  WHERE c.pending_follow_up_note IS NOT NULL
    AND c.pending_follow_up_note <> ''
    AND c.linked_task_id IS NULL
    AND c.logged_by IS NOT NULL
  RETURNING id, source_communication_id
)
UPDATE public.communications c
   SET linked_task_id = i.id,
       pending_follow_up_note = NULL
  FROM inserted i
 WHERE c.id = i.source_communication_id;