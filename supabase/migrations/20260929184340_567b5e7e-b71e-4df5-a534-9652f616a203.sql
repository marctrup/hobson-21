-- Explicitly document and enforce server-only access to the idempotency table.
CREATE POLICY "Service role manages idempotency keys"
ON public.crm_idempotency_keys FOR ALL TO service_role
USING (true) WITH CHECK (true);
REVOKE ALL ON public.crm_idempotency_keys FROM anon, authenticated;
GRANT ALL ON public.crm_idempotency_keys TO service_role;

-- Public callers do not need privileged profile or role helpers.
REVOKE EXECUTE ON FUNCTION public.get_current_user_role() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_current_user_role() TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.get_safe_author_info(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_safe_author_info(uuid) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.get_safe_profile_data(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_safe_profile_data(uuid) TO authenticated, service_role;

-- These helpers are called only by trusted Edge Functions.
REVOKE EXECUTE ON FUNCTION public.crm_find_user_id_by_email(text) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.crm_log_role_action(uuid, text, uuid, public.app_role, public.app_role, jsonb) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.crm_find_user_id_by_email(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.crm_log_role_action(uuid, text, uuid, public.app_role, public.app_role, jsonb) TO service_role;