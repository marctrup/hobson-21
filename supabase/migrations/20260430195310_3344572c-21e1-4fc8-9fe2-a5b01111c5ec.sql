-- Drop FK from email_send_log first; this preserves the table and all its rows.
ALTER TABLE public.email_send_log
  DROP CONSTRAINT IF EXISTS email_send_log_application_id_fkey;

-- Drop legacy tables. CASCADE removes dependent objects like the
-- audit_contact_access trigger that was attached to contact_messages_encrypted.
DROP TABLE IF EXISTS public.contact_messages_encrypted CASCADE;
DROP TABLE IF EXISTS public.pilot_applications CASCADE;

-- Drop orphaned helper functions that referenced the dropped tables.
DROP FUNCTION IF EXISTS public.check_contact_email_exists(text);
DROP FUNCTION IF EXISTS public.insert_encrypted_contact_message(text, text, text, text);
DROP FUNCTION IF EXISTS public.get_decrypted_contact_messages();
DROP FUNCTION IF EXISTS public.audit_contact_access();