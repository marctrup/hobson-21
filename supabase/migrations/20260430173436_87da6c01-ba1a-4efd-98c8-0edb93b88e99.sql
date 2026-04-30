-- 1. Add new communication channel value for website form submissions
ALTER TYPE public.comm_channel ADD VALUE IF NOT EXISTS 'website_form';

-- 2. CRM workspace settings (singleton row)
CREATE TABLE IF NOT EXISTS public.crm_workspace_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  singleton boolean NOT NULL DEFAULT true UNIQUE,
  default_owner_id uuid,
  website_system_user_id uuid NOT NULL DEFAULT gen_random_uuid(),
  website_ingest_secret_hash text,
  website_ingest_secret_rotated_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT crm_workspace_settings_singleton_chk CHECK (singleton = true)
);

ALTER TABLE public.crm_workspace_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view workspace settings"
  ON public.crm_workspace_settings FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can insert workspace settings"
  ON public.crm_workspace_settings FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update workspace settings"
  ON public.crm_workspace_settings FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TRIGGER crm_workspace_settings_set_updated_at
  BEFORE UPDATE ON public.crm_workspace_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed the singleton row so the system_user_id is stable from day one
INSERT INTO public.crm_workspace_settings (singleton)
VALUES (true)
ON CONFLICT (singleton) DO NOTHING;

-- 3. Idempotency keys (used by crm-website-ingest)
CREATE TABLE IF NOT EXISTS public.crm_idempotency_keys (
  scope text NOT NULL,
  key text NOT NULL,
  result jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (scope, key)
);

CREATE INDEX IF NOT EXISTS crm_idempotency_keys_created_at_idx
  ON public.crm_idempotency_keys (created_at);

ALTER TABLE public.crm_idempotency_keys ENABLE ROW LEVEL SECURITY;
-- No policies = no access for anon/authenticated. Service role bypasses RLS.

-- 4. Ingest failures (manual replay queue)
CREATE TABLE IF NOT EXISTS public.crm_ingest_failures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL,
  payload jsonb NOT NULL,
  error_message text,
  retry_count integer NOT NULL DEFAULT 0,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS crm_ingest_failures_unresolved_idx
  ON public.crm_ingest_failures (created_at DESC)
  WHERE resolved_at IS NULL;

ALTER TABLE public.crm_ingest_failures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view ingest failures"
  ON public.crm_ingest_failures FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update ingest failures"
  ON public.crm_ingest_failures FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
-- INSERT only via service role from edge functions (no policy needed).

CREATE TRIGGER crm_ingest_failures_set_updated_at
  BEFORE UPDATE ON public.crm_ingest_failures
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();