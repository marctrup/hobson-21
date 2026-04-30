-- Loosen crm_list_team_members so any CRM user can list workspace members.
-- Admins see role + granted_at; non-admin CRM users get NULLs for those sensitive fields.
CREATE OR REPLACE FUNCTION public.crm_list_team_members()
RETURNS TABLE (
  user_id uuid,
  email text,
  display_name text,
  role public.app_role,
  granted_at timestamptz
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_crm_access(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. CRM access required.';
  END IF;

  IF public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RETURN QUERY
    SELECT
      ur.user_id,
      au.email::text,
      COALESCE(p.display_name, au.email::text) AS display_name,
      ur.role,
      ur.created_at AS granted_at
    FROM public.user_roles ur
    JOIN auth.users au ON au.id = ur.user_id
    LEFT JOIN public.profiles p ON p.user_id = ur.user_id
    WHERE ur.role IN ('admin'::public.app_role, 'crm_write'::public.app_role, 'crm_read'::public.app_role)
    ORDER BY display_name;
  ELSE
    RETURN QUERY
    SELECT
      ur.user_id,
      au.email::text,
      COALESCE(p.display_name, au.email::text) AS display_name,
      NULL::public.app_role AS role,
      NULL::timestamptz AS granted_at
    FROM public.user_roles ur
    JOIN auth.users au ON au.id = ur.user_id
    LEFT JOIN public.profiles p ON p.user_id = ur.user_id
    WHERE ur.role IN ('admin'::public.app_role, 'crm_write'::public.app_role, 'crm_read'::public.app_role)
    ORDER BY display_name;
  END IF;
END;
$$;