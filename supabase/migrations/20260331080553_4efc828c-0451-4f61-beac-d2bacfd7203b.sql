CREATE TABLE public.email_send_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid REFERENCES public.pilot_applications(id) ON DELETE SET NULL,
  recipient_email text NOT NULL,
  email_type text NOT NULL DEFAULT 'confirmation',
  subject text,
  status text NOT NULL DEFAULT 'sent',
  error_message text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.email_send_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view email send log"
ON public.email_send_log
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service can insert email send log"
ON public.email_send_log
FOR INSERT
TO public
WITH CHECK (true);