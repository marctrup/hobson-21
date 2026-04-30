-- 1. Add workspace_name column with 1-80 char check (after trim)
ALTER TABLE public.crm_workspace_settings
  ADD COLUMN workspace_name text NOT NULL DEFAULT 'My Workspace';

ALTER TABLE public.crm_workspace_settings
  ADD CONSTRAINT crm_workspace_settings_name_length_chk
  CHECK (char_length(btrim(workspace_name)) BETWEEN 1 AND 80);

-- 2. Seed default name on the existing row
UPDATE public.crm_workspace_settings
   SET workspace_name = 'Hobson''s Choice'
 WHERE singleton = true;

-- 3a. Read RPC — any CRM user, returns only the name
CREATE OR REPLACE FUNCTION public.crm_get_workspace_name()
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_name text;
BEGIN
  IF NOT public.has_crm_access(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. CRM access required.';
  END IF;

  SELECT workspace_name INTO v_name
    FROM public.crm_workspace_settings
   WHERE singleton = true
   LIMIT 1;

  RETURN v_name;
END;
$$;

-- 3b. Update RPC — admin only, trims input, enforces 1-80 chars
CREATE OR REPLACE FUNCTION public.crm_update_workspace_name(p_name text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_trimmed text;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  IF p_name IS NULL THEN
    RAISE EXCEPTION 'Workspace name is required';
  END IF;

  v_trimmed := btrim(p_name);

  IF char_length(v_trimmed) < 1 OR char_length(v_trimmed) > 80 THEN
    RAISE EXCEPTION 'Workspace name must be between 1 and 80 characters';
  END IF;

  UPDATE public.crm_workspace_settings
     SET workspace_name = v_trimmed,
         updated_at = now()
   WHERE singleton = true;

  RETURN v_trimmed;
END;
$$;