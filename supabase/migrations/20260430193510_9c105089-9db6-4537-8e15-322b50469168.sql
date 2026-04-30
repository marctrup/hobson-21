CREATE OR REPLACE FUNCTION public.crm_list_audit_log(
  p_limit  integer DEFAULT 50,
  p_offset integer DEFAULT 0,
  p_action text    DEFAULT NULL,
  p_from   timestamptz DEFAULT NULL,
  p_to     timestamptz DEFAULT NULL,
  p_search text    DEFAULT NULL
)
RETURNS TABLE(
  id           uuid,
  created_at   timestamptz,
  user_id      uuid,
  actor_email  text,
  actor_display_name text,
  action       text,
  table_name   text,
  record_id    uuid,
  old_values   jsonb,
  new_values   jsonb,
  total_count  bigint
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_limit integer := LEAST(GREATEST(COALESCE(p_limit, 50), 1), 100);
  v_offset integer := GREATEST(COALESCE(p_offset, 0), 0);
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  RETURN QUERY
  WITH filtered AS (
    SELECT sal.*
      FROM public.security_audit_log sal
     WHERE (p_action IS NULL OR sal.action = p_action)
       AND (p_from   IS NULL OR sal.created_at >= p_from)
       AND (p_to     IS NULL OR sal.created_at <  p_to)
       AND (p_search IS NULL OR sal.action ILIKE '%' || p_search || '%')
  )
  SELECT
    f.id,
    f.created_at,
    f.user_id,
    au.email::text                                 AS actor_email,
    COALESCE(p.display_name, au.email::text)       AS actor_display_name,
    f.action,
    f.table_name,
    f.record_id,
    f.old_values,
    f.new_values,
    COUNT(*) OVER ()                               AS total_count
  FROM filtered f
  LEFT JOIN auth.users    au ON au.id      = f.user_id
  LEFT JOIN public.profiles p ON p.user_id = f.user_id
  ORDER BY f.created_at DESC
  LIMIT v_limit
  OFFSET v_offset;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.crm_list_audit_log(integer, integer, text, timestamptz, timestamptz, text) FROM public, anon;
GRANT  EXECUTE ON FUNCTION public.crm_list_audit_log(integer, integer, text, timestamptz, timestamptz, text) TO authenticated;

CREATE OR REPLACE FUNCTION public.crm_list_audit_log_actions()
RETURNS TABLE(action text)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  RETURN QUERY
    SELECT DISTINCT sal.action
      FROM public.security_audit_log sal
     ORDER BY sal.action;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.crm_list_audit_log_actions() FROM public, anon;
GRANT  EXECUTE ON FUNCTION public.crm_list_audit_log_actions() TO authenticated;