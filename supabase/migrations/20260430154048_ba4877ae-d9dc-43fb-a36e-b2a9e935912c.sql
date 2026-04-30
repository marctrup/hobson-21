-- ============================================================================
-- crm_pipeline_stages
-- Configurable kanban columns for the CRM pipeline. crm_clients.pipeline_stage
-- references stages by `key` (slug) — no FK so legacy values fall into an
-- "Uncategorised" virtual column in the UI rather than blocking writes.
-- ============================================================================

CREATE TABLE public.crm_pipeline_stages (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key           text NOT NULL UNIQUE,
  label         text NOT NULL,
  display_order integer NOT NULL,
  color         text NOT NULL DEFAULT 'muted',
  is_terminal   boolean NOT NULL DEFAULT false,
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT crm_pipeline_stages_key_format CHECK (key ~ '^[a-z][a-z0-9_]*$'),
  CONSTRAINT crm_pipeline_stages_display_order_nonneg CHECK (display_order >= 0)
);

CREATE UNIQUE INDEX crm_pipeline_stages_active_order_uniq
  ON public.crm_pipeline_stages (display_order)
  WHERE is_active = true;

CREATE INDEX crm_pipeline_stages_active_order_idx
  ON public.crm_pipeline_stages (is_active, display_order);

CREATE TRIGGER trg_crm_pipeline_stages_updated_at
  BEFORE UPDATE ON public.crm_pipeline_stages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.crm_pipeline_stages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "CRM users can view pipeline stages"
  ON public.crm_pipeline_stages
  FOR SELECT
  USING (public.has_crm_access(auth.uid()));

CREATE POLICY "Admins can insert pipeline stages"
  ON public.crm_pipeline_stages
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update pipeline stages"
  ON public.crm_pipeline_stages
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can delete pipeline stages"
  ON public.crm_pipeline_stages
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

INSERT INTO public.crm_pipeline_stages (key, label, display_order, color, is_terminal) VALUES
  ('new_enquiry',   'New enquiry',   0, 'muted',       false),
  ('contacted',     'Contacted',     1, 'secondary',   false),
  ('in_discussion', 'In discussion', 2, 'accent',      false),
  ('proposal_sent', 'Proposal sent', 3, 'primary',     false),
  ('won',           'Won',           4, 'success',     true),
  ('lost',          'Lost',          5, 'destructive', true),
  ('on_hold',       'On hold',       6, 'muted',       false);