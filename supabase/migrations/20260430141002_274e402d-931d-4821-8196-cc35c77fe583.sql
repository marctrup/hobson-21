-- 1. Enforce single primary contact per client (mirror of platform-user trigger)
CREATE OR REPLACE FUNCTION public.crm_enforce_single_primary_contact()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  IF NEW.is_primary THEN
    UPDATE public.crm_contacts
       SET is_primary = false
     WHERE client_id = NEW.client_id
       AND id <> NEW.id
       AND is_primary = true;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS crm_contacts_single_primary ON public.crm_contacts;
CREATE TRIGGER crm_contacts_single_primary
BEFORE INSERT OR UPDATE OF is_primary ON public.crm_contacts
FOR EACH ROW
EXECUTE FUNCTION public.crm_enforce_single_primary_contact();

-- 2. Zero-admin safeguard: prevent the workspace from ending up with zero admins
CREATE OR REPLACE FUNCTION public.prevent_zero_admins()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  remaining_admins integer;
BEGIN
  IF TG_OP = 'DELETE' THEN
    IF OLD.role = 'admin'::public.app_role THEN
      SELECT count(*) INTO remaining_admins
        FROM public.user_roles
       WHERE role = 'admin'::public.app_role
         AND id <> OLD.id;
      IF remaining_admins = 0 THEN
        RAISE EXCEPTION 'Cannot remove the last admin. Grant admin to another user first.'
          USING ERRCODE = 'check_violation';
      END IF;
    END IF;
    RETURN OLD;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    IF OLD.role = 'admin'::public.app_role AND NEW.role <> 'admin'::public.app_role THEN
      SELECT count(*) INTO remaining_admins
        FROM public.user_roles
       WHERE role = 'admin'::public.app_role
         AND id <> OLD.id;
      IF remaining_admins = 0 THEN
        RAISE EXCEPTION 'Cannot demote the last admin. Grant admin to another user first.'
          USING ERRCODE = 'check_violation';
      END IF;
    END IF;
    RETURN NEW;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS user_roles_prevent_zero_admins ON public.user_roles;
CREATE TRIGGER user_roles_prevent_zero_admins
BEFORE UPDATE OR DELETE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_zero_admins();