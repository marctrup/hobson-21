GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.has_crm_access(uuid) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.has_crm_write(uuid) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_current_user_role() TO anon, authenticated, service_role;