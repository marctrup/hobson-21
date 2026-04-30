CREATE OR REPLACE FUNCTION public.crm_log_role_action(
  p_actor       uuid,
  p_action      text,
  p_target_user uuid,
  p_new_role    public.app_role DEFAULT NULL,
  p_old_role    public.app_role DEFAULT NULL,
  p_metadata    jsonb           DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF p_action NOT IN (
    'CRM_ROLE_GRANTED',
    'CRM_ROLE_CHANGED',
    'CRM_ROLE_REVOKED',
    'CRM_INVITE_ACCEPTED'
  ) THEN
    RAISE EXCEPTION 'Invalid action for crm_log_role_action: %', p_action;
  END IF;

  INSERT INTO public.security_audit_log (
    user_id,
    action,
    table_name,
    record_id,
    old_values,
    new_values
  ) VALUES (
    p_actor,
    p_action,
    'user_roles',
    p_target_user,
    CASE WHEN p_old_role IS NOT NULL
         THEN jsonb_build_object('role', p_old_role, 'user_id', p_target_user)
         ELSE NULL END,
    jsonb_build_object(
      'role',     p_new_role,
      'user_id',  p_target_user,
      'metadata', p_metadata
    )
  );
END;
$$;

REVOKE ALL ON FUNCTION public.crm_log_role_action(uuid, text, uuid, public.app_role, public.app_role, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.crm_log_role_action(uuid, text, uuid, public.app_role, public.app_role, jsonb) TO service_role;