-- 1) Preview counts for client delete
CREATE OR REPLACE FUNCTION public.crm_get_client_delete_preview(p_client_id uuid)
RETURNS TABLE (
  client_name        text,
  contacts_count     integer,
  communications_count integer,
  issues_count       integer,
  issue_comments_count integer,
  tasks_count        integer,
  notes_count        integer,
  attachments_count  integer
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  RETURN QUERY
  SELECT
    (SELECT name FROM public.crm_clients WHERE id = p_client_id),
    (SELECT COUNT(*)::int FROM public.crm_contacts WHERE client_id = p_client_id),
    (SELECT COUNT(*)::int FROM public.communications WHERE client_id = p_client_id),
    (SELECT COUNT(*)::int FROM public.crm_issues WHERE client_id = p_client_id),
    (SELECT COUNT(*)::int FROM public.crm_issue_comments ic
       JOIN public.crm_issues i ON i.id = ic.issue_id
      WHERE i.client_id = p_client_id),
    (SELECT COUNT(*)::int FROM public.crm_tasks WHERE client_id = p_client_id),
    (SELECT COUNT(*)::int FROM public.crm_notes WHERE client_id = p_client_id),
    (SELECT COUNT(*)::int FROM public.communication_attachments ca
       JOIN public.communications c ON c.id = ca.communication_id
      WHERE c.client_id = p_client_id);
END;
$$;

REVOKE ALL ON FUNCTION public.crm_get_client_delete_preview(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.crm_get_client_delete_preview(uuid) TO authenticated;


-- 2) Delete a contact (manual cleanup of communication_participants)
CREATE OR REPLACE FUNCTION public.crm_delete_contact(p_contact_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_client_id uuid;
  v_full_name text;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  SELECT client_id, full_name INTO v_client_id, v_full_name
    FROM public.crm_contacts
   WHERE id = p_contact_id;

  IF v_client_id IS NULL THEN
    RAISE EXCEPTION 'Contact not found';
  END IF;

  DELETE FROM public.communication_participants WHERE contact_id = p_contact_id;
  DELETE FROM public.crm_contacts WHERE id = p_contact_id;

  INSERT INTO public.crm_activity_log (
    client_id, user_id, entity_type, entity_id, action_type, description, metadata
  ) VALUES (
    v_client_id, auth.uid(), 'contact', p_contact_id, 'deleted',
    'Contact deleted: ' || COALESCE(v_full_name, '(unknown)'),
    jsonb_build_object('contact_id', p_contact_id, 'full_name', v_full_name)
  );

  PERFORM public.log_security_event(
    'CRM_CONTACT_DELETED', 'crm_contacts', p_contact_id,
    jsonb_build_object('client_id', v_client_id, 'full_name', v_full_name),
    NULL
  );
END;
$$;

REVOKE ALL ON FUNCTION public.crm_delete_contact(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.crm_delete_contact(uuid) TO authenticated;


-- 3) Cascading client delete
CREATE OR REPLACE FUNCTION public.crm_delete_client(p_client_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_name text;
  v_storage_paths text[];
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  SELECT name INTO v_name FROM public.crm_clients WHERE id = p_client_id;
  IF v_name IS NULL THEN
    RAISE EXCEPTION 'Client not found';
  END IF;

  SELECT array_agg(ca.storage_path)
    INTO v_storage_paths
    FROM public.communication_attachments ca
    JOIN public.communications c ON c.id = ca.communication_id
   WHERE c.client_id = p_client_id
     AND ca.storage_path IS NOT NULL;

  IF v_storage_paths IS NOT NULL AND array_length(v_storage_paths, 1) > 0 THEN
    BEGIN
      DELETE FROM storage.objects
       WHERE bucket_id = 'crm-comm-attachments'
         AND name = ANY(v_storage_paths);
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END;
  END IF;

  DELETE FROM public.crm_issue_comments
   WHERE issue_id IN (SELECT id FROM public.crm_issues WHERE client_id = p_client_id);
  DELETE FROM public.crm_issues WHERE client_id = p_client_id;
  DELETE FROM public.crm_tasks  WHERE client_id = p_client_id;
  DELETE FROM public.communication_participants
   WHERE communication_id IN (SELECT id FROM public.communications WHERE client_id = p_client_id);
  DELETE FROM public.communication_attachments
   WHERE communication_id IN (SELECT id FROM public.communications WHERE client_id = p_client_id);
  DELETE FROM public.communications WHERE client_id = p_client_id;

  DELETE FROM public.crm_clients WHERE id = p_client_id;

  PERFORM public.log_security_event(
    'CRM_CLIENT_DELETED', 'crm_clients', p_client_id,
    jsonb_build_object('name', v_name),
    NULL
  );
END;
$$;

REVOKE ALL ON FUNCTION public.crm_delete_client(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.crm_delete_client(uuid) TO authenticated;