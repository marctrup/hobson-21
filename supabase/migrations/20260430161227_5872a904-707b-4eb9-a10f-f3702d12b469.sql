-- ============================================================
-- 1. ENUMS
-- ============================================================
CREATE TYPE public.issue_status AS ENUM (
  'open', 'in_progress', 'waiting_on_client', 'resolved', 'closed'
);

CREATE TYPE public.issue_priority AS ENUM (
  'low', 'medium', 'high', 'urgent'
);

CREATE TYPE public.issue_category AS ENUM (
  'bug', 'data_quality', 'billing', 'onboarding', 'feature_gap', 'support', 'other'
);

-- ============================================================
-- 2. TABLES
-- ============================================================
CREATE TABLE public.crm_issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  status public.issue_status NOT NULL DEFAULT 'open',
  priority public.issue_priority NOT NULL DEFAULT 'medium',
  category public.issue_category NOT NULL DEFAULT 'other',
  assignee_id uuid,
  reported_by uuid,
  reported_via_communication_id uuid,
  due_date date,
  resolved_at timestamptz,
  resolution_note text,
  tags text[] NOT NULL DEFAULT '{}'::text[],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.crm_issue_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id uuid NOT NULL,
  author_id uuid,
  body text NOT NULL,
  is_status_change boolean NOT NULL DEFAULT false,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- 3. crm_clients counter column
-- ============================================================
ALTER TABLE public.crm_clients
  ADD COLUMN IF NOT EXISTS open_issues_count integer NOT NULL DEFAULT 0;

-- ============================================================
-- 4. INDEXES
-- ============================================================
CREATE INDEX idx_crm_issues_client_status_updated
  ON public.crm_issues (client_id, status, updated_at DESC);

CREATE INDEX idx_crm_issues_assignee_open
  ON public.crm_issues (assignee_id)
  WHERE status NOT IN ('resolved', 'closed');

CREATE INDEX idx_crm_issues_status_priority
  ON public.crm_issues (status, priority);

CREATE INDEX idx_crm_issues_reported_via_comm
  ON public.crm_issues (reported_via_communication_id)
  WHERE reported_via_communication_id IS NOT NULL;

CREATE INDEX idx_crm_issue_comments_issue_created
  ON public.crm_issue_comments (issue_id, created_at);

-- ============================================================
-- 5. RLS — crm_issues
-- ============================================================
ALTER TABLE public.crm_issues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "CRM users can view issues"
  ON public.crm_issues
  FOR SELECT
  USING (public.has_crm_access(auth.uid()));

CREATE POLICY "CRM writers can insert issues"
  ON public.crm_issues
  FOR INSERT
  WITH CHECK (
    public.has_crm_write(auth.uid())
    AND auth.uid() = reported_by
  );

CREATE POLICY "CRM writers can update issues"
  ON public.crm_issues
  FOR UPDATE
  USING (public.has_crm_write(auth.uid()))
  WITH CHECK (public.has_crm_write(auth.uid()));

CREATE POLICY "Delete own issues or admin any"
  ON public.crm_issues
  FOR DELETE
  USING (
    (public.has_crm_write(auth.uid()) AND auth.uid() = reported_by)
    OR public.has_role(auth.uid(), 'admin'::public.app_role)
  );

-- ============================================================
-- 6. RLS — crm_issue_comments
-- ============================================================
ALTER TABLE public.crm_issue_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "CRM users can view issue comments"
  ON public.crm_issue_comments
  FOR SELECT
  USING (public.has_crm_access(auth.uid()));

CREATE POLICY "CRM writers can insert issue comments"
  ON public.crm_issue_comments
  FOR INSERT
  WITH CHECK (
    public.has_crm_write(auth.uid())
    AND auth.uid() = author_id
    AND is_status_change = false
  );

CREATE POLICY "Authors can update own issue comments"
  ON public.crm_issue_comments
  FOR UPDATE
  USING (
    public.has_crm_write(auth.uid())
    AND auth.uid() = author_id
    AND is_status_change = false
  )
  WITH CHECK (
    public.has_crm_write(auth.uid())
    AND auth.uid() = author_id
    AND is_status_change = false
  );

CREATE POLICY "Delete own issue comments or admin any"
  ON public.crm_issue_comments
  FOR DELETE
  USING (
    (public.has_crm_write(auth.uid()) AND auth.uid() = author_id)
    OR public.has_role(auth.uid(), 'admin'::public.app_role)
  );

-- ============================================================
-- 7. TRIGGER FUNCTIONS
-- ============================================================

-- 7a. Auto-set / clear resolved_at when status changes
CREATE OR REPLACE FUNCTION public.crm_issues_set_resolved_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO ''
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.status IN ('resolved'::public.issue_status, 'closed'::public.issue_status)
       AND NEW.resolved_at IS NULL THEN
      NEW.resolved_at := now();
    END IF;
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' AND NEW.status IS DISTINCT FROM OLD.status THEN
    IF NEW.status IN ('resolved'::public.issue_status, 'closed'::public.issue_status)
       AND NEW.resolved_at IS NULL THEN
      NEW.resolved_at := now();
    ELSIF NEW.status NOT IN ('resolved'::public.issue_status, 'closed'::public.issue_status) THEN
      NEW.resolved_at := NULL;
    END IF;
  END IF;

  RETURN NEW;
END;
$function$;

-- 7b. Auto-insert a system comment when status changes
--     SECURITY DEFINER bypasses the strict "author_id = auth.uid() AND is_status_change = false"
--     INSERT policy on crm_issue_comments.
CREATE OR REPLACE FUNCTION public.crm_issues_log_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.crm_issue_comments (
      issue_id, author_id, body, is_status_change, metadata
    ) VALUES (
      NEW.id,
      auth.uid(),
      'Status: ' || OLD.status || ' → ' || NEW.status,
      true,
      jsonb_build_object('from', OLD.status, 'to', NEW.status)
    );
  END IF;
  RETURN NEW;
END;
$function$;

-- 7c. Mirror issue events into crm_activity_log
CREATE OR REPLACE FUNCTION public.crm_issues_log_to_activity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.crm_activity_log (
      client_id, user_id, entity_type, entity_id, action_type, description, metadata
    ) VALUES (
      NEW.client_id, auth.uid(), 'issue', NEW.id, 'created',
      'Issue created: ' || NEW.title,
      jsonb_build_object('priority', NEW.priority, 'category', NEW.category)
    );
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    IF NEW.status IS DISTINCT FROM OLD.status THEN
      INSERT INTO public.crm_activity_log (
        client_id, user_id, entity_type, entity_id, action_type, description, metadata
      ) VALUES (
        NEW.client_id, auth.uid(), 'issue', NEW.id, 'status_changed',
        'Issue status: ' || OLD.status || ' → ' || NEW.status,
        jsonb_build_object('from', OLD.status, 'to', NEW.status, 'title', NEW.title)
      );
    END IF;
    IF NEW.assignee_id IS DISTINCT FROM OLD.assignee_id THEN
      INSERT INTO public.crm_activity_log (
        client_id, user_id, entity_type, entity_id, action_type, description, metadata
      ) VALUES (
        NEW.client_id, auth.uid(), 'issue', NEW.id, 'assigned',
        'Issue reassigned: ' || NEW.title,
        jsonb_build_object('from', OLD.assignee_id, 'to', NEW.assignee_id)
      );
    END IF;
    IF NEW.priority IS DISTINCT FROM OLD.priority THEN
      INSERT INTO public.crm_activity_log (
        client_id, user_id, entity_type, entity_id, action_type, description, metadata
      ) VALUES (
        NEW.client_id, auth.uid(), 'issue', NEW.id, 'priority_changed',
        'Issue priority: ' || OLD.priority || ' → ' || NEW.priority,
        jsonb_build_object('from', OLD.priority, 'to', NEW.priority, 'title', NEW.title)
      );
    END IF;
    RETURN NEW;
  END IF;

  RETURN NEW;
END;
$function$;

-- 7d. Maintain crm_clients.open_issues_count
CREATE OR REPLACE FUNCTION public.crm_issues_maintain_client_counter()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  v_was_open boolean;
  v_is_open  boolean;
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.status NOT IN ('resolved'::public.issue_status, 'closed'::public.issue_status) THEN
      UPDATE public.crm_clients
        SET open_issues_count = open_issues_count + 1
        WHERE id = NEW.client_id;
    END IF;
    RETURN NEW;
  END IF;

  IF TG_OP = 'DELETE' THEN
    IF OLD.status NOT IN ('resolved'::public.issue_status, 'closed'::public.issue_status) THEN
      UPDATE public.crm_clients
        SET open_issues_count = GREATEST(open_issues_count - 1, 0)
        WHERE id = OLD.client_id;
    END IF;
    RETURN OLD;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    v_was_open := OLD.status NOT IN ('resolved'::public.issue_status, 'closed'::public.issue_status);
    v_is_open  := NEW.status NOT IN ('resolved'::public.issue_status, 'closed'::public.issue_status);

    -- Issue moved between clients (rare but possible) — adjust both sides
    IF NEW.client_id IS DISTINCT FROM OLD.client_id THEN
      IF v_was_open THEN
        UPDATE public.crm_clients
          SET open_issues_count = GREATEST(open_issues_count - 1, 0)
          WHERE id = OLD.client_id;
      END IF;
      IF v_is_open THEN
        UPDATE public.crm_clients
          SET open_issues_count = open_issues_count + 1
          WHERE id = NEW.client_id;
      END IF;
    ELSIF v_was_open AND NOT v_is_open THEN
      UPDATE public.crm_clients
        SET open_issues_count = GREATEST(open_issues_count - 1, 0)
        WHERE id = NEW.client_id;
    ELSIF NOT v_was_open AND v_is_open THEN
      UPDATE public.crm_clients
        SET open_issues_count = open_issues_count + 1
        WHERE id = NEW.client_id;
    END IF;

    RETURN NEW;
  END IF;

  RETURN NULL;
END;
$function$;

-- ============================================================
-- 8. TRIGGERS
-- ============================================================

-- BEFORE INSERT/UPDATE: set/clear resolved_at
CREATE TRIGGER trg_crm_issues_set_resolved_at
  BEFORE INSERT OR UPDATE ON public.crm_issues
  FOR EACH ROW
  EXECUTE FUNCTION public.crm_issues_set_resolved_at();

-- BEFORE UPDATE: standard updated_at
CREATE TRIGGER trg_crm_issues_updated_at
  BEFORE UPDATE ON public.crm_issues
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- AFTER UPDATE: log status change as a system comment in the thread
CREATE TRIGGER trg_crm_issues_log_status_change
  AFTER UPDATE ON public.crm_issues
  FOR EACH ROW
  EXECUTE FUNCTION public.crm_issues_log_status_change();

-- AFTER INSERT/UPDATE: mirror to crm_activity_log
CREATE TRIGGER trg_crm_issues_log_to_activity
  AFTER INSERT OR UPDATE ON public.crm_issues
  FOR EACH ROW
  EXECUTE FUNCTION public.crm_issues_log_to_activity();

-- AFTER INSERT/UPDATE/DELETE: keep crm_clients.open_issues_count in sync
CREATE TRIGGER trg_crm_issues_maintain_client_counter
  AFTER INSERT OR UPDATE OR DELETE ON public.crm_issues
  FOR EACH ROW
  EXECUTE FUNCTION public.crm_issues_maintain_client_counter();
