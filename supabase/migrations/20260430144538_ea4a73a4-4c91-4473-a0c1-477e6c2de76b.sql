-- ============================================================
-- CRM Invitations table
-- ============================================================
CREATE TABLE public.crm_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  role public.app_role NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending',
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '7 days'),
  invited_by UUID,
  accepted_by UUID,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT crm_invitations_role_check CHECK (role IN ('admin'::public.app_role, 'crm_write'::public.app_role, 'crm_read'::public.app_role)),
  CONSTRAINT crm_invitations_status_check CHECK (status IN ('pending', 'accepted', 'revoked', 'expired'))
);

-- Only one pending invite per email at a time
CREATE UNIQUE INDEX crm_invitations_pending_email_idx
  ON public.crm_invitations (lower(email))
  WHERE status = 'pending';

CREATE INDEX crm_invitations_email_idx ON public.crm_invitations (lower(email));
CREATE INDEX crm_invitations_status_idx ON public.crm_invitations (status);

-- updated_at trigger
CREATE TRIGGER update_crm_invitations_updated_at
  BEFORE UPDATE ON public.crm_invitations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- RLS
-- ============================================================
ALTER TABLE public.crm_invitations ENABLE ROW LEVEL SECURITY;

-- Admins can view all invitations
CREATE POLICY "Admins can view invitations"
  ON public.crm_invitations
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Admins can create invitations (also enforced server-side in the edge function)
CREATE POLICY "Admins can create invitations"
  ON public.crm_invitations
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Admins can update invitations (revoke / resend)
CREATE POLICY "Admins can update invitations"
  ON public.crm_invitations
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- No DELETE policy on purpose — history is preserved by setting status='revoked'

-- ============================================================
-- Helper: list CRM team members (admin-only).
-- Combines auth.users + user_roles for users who hold any CRM role.
-- ============================================================
CREATE OR REPLACE FUNCTION public.crm_list_team_members()
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  display_name TEXT,
  role public.app_role,
  granted_at TIMESTAMPTZ
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  RETURN QUERY
    SELECT
      u.id AS user_id,
      u.email::text AS email,
      p.display_name,
      ur.role,
      ur.created_at AS granted_at
    FROM public.user_roles ur
    JOIN auth.users u ON u.id = ur.user_id
    LEFT JOIN public.profiles p ON p.user_id = ur.user_id
    WHERE ur.role IN ('admin'::public.app_role, 'crm_write'::public.app_role, 'crm_read'::public.app_role)
    ORDER BY ur.created_at DESC;
END;
$$;

-- ============================================================
-- Helper: look up user_id by email (admin-only, used by accept-invite to
-- detect "already a CRM member" and by invite to detect existing users).
-- ============================================================
CREATE OR REPLACE FUNCTION public.crm_find_user_id_by_email(p_email TEXT)
RETURNS UUID
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  SELECT id INTO v_user_id
  FROM auth.users
  WHERE lower(email) = lower(p_email)
  LIMIT 1;

  RETURN v_user_id;
END;
$$;