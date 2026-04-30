-- ===========================================================================
-- 1. New RPCs for Integration Settings
-- ===========================================================================

-- Read RPC: admin-only. Returns settings WITHOUT the secret hash.
CREATE OR REPLACE FUNCTION public.crm_get_integration_settings()
RETURNS TABLE (
  default_owner_id                 uuid,
  default_owner_email              text,
  default_owner_display_name       text,
  website_system_user_id           uuid,
  website_ingest_secret_rotated_at timestamptz,
  secret_configured                boolean
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  RETURN QUERY
    SELECT
      ws.default_owner_id,
      au.email::text                                    AS default_owner_email,
      COALESCE(p.display_name, au.email::text)          AS default_owner_display_name,
      ws.website_system_user_id,
      ws.website_ingest_secret_rotated_at,
      (ws.website_ingest_secret_hash IS NOT NULL)       AS secret_configured
    FROM public.crm_workspace_settings ws
    LEFT JOIN auth.users au   ON au.id = ws.default_owner_id
    LEFT JOIN public.profiles p ON p.user_id = ws.default_owner_id
    WHERE ws.singleton = true
    LIMIT 1;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.crm_get_integration_settings() FROM public, anon;
GRANT  EXECUTE ON FUNCTION public.crm_get_integration_settings() TO authenticated;

-- Write RPC: admin-only. NULL is allowed (clears the owner).
CREATE OR REPLACE FUNCTION public.crm_set_default_owner(p_user_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  IF p_user_id IS NOT NULL AND NOT public.has_crm_access(p_user_id) THEN
    RAISE EXCEPTION 'Selected user does not have CRM access';
  END IF;

  UPDATE public.crm_workspace_settings
     SET default_owner_id = p_user_id,
         updated_at       = now()
   WHERE singleton = true;

  RETURN p_user_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.crm_set_default_owner(uuid) FROM public, anon;
GRANT  EXECUTE ON FUNCTION public.crm_set_default_owner(uuid) TO authenticated;

-- ===========================================================================
-- 2. Tighten EXECUTE on existing caller-facing CRM RPCs
--    (Trigger functions are intentionally NOT touched.)
-- ===========================================================================

REVOKE EXECUTE ON FUNCTION public.crm_get_workspace_name()           FROM public, anon;
GRANT  EXECUTE ON FUNCTION public.crm_get_workspace_name()           TO authenticated;

REVOKE EXECUTE ON FUNCTION public.crm_update_workspace_name(text)    FROM public, anon;
GRANT  EXECUTE ON FUNCTION public.crm_update_workspace_name(text)    TO authenticated;

REVOKE EXECUTE ON FUNCTION public.crm_list_team_members()            FROM public, anon;
GRANT  EXECUTE ON FUNCTION public.crm_list_team_members()            TO authenticated;

REVOKE EXECUTE ON FUNCTION public.crm_find_user_id_by_email(text)    FROM public, anon;
GRANT  EXECUTE ON FUNCTION public.crm_find_user_id_by_email(text)    TO authenticated;

REVOKE EXECUTE ON FUNCTION public.crm_log_communication(jsonb)       FROM public, anon;
GRANT  EXECUTE ON FUNCTION public.crm_log_communication(jsonb)       TO authenticated;

REVOKE EXECUTE ON FUNCTION public.crm_log_role_action(uuid, text, uuid, public.app_role, public.app_role, jsonb)
  FROM public, anon;
GRANT  EXECUTE ON FUNCTION public.crm_log_role_action(uuid, text, uuid, public.app_role, public.app_role, jsonb)
  TO authenticated;