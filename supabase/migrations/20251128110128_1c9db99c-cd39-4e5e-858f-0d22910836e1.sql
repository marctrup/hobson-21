-- Create table to store investment page password
CREATE TABLE IF NOT EXISTS public.investment_page_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.investment_page_settings ENABLE ROW LEVEL SECURITY;

-- Allow admins to read the password hash
CREATE POLICY "Admins can read investment page settings"
  ON public.investment_page_settings
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to update the password
CREATE POLICY "Admins can update investment page settings"
  ON public.investment_page_settings
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to insert initial password
CREATE POLICY "Admins can insert investment page settings"
  ON public.investment_page_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_investment_page_settings_updated_at
  BEFORE UPDATE ON public.investment_page_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default password (hash of "investmentaccess")
-- In production, admin should change this immediately
INSERT INTO public.investment_page_settings (password_hash)
VALUES ('$2a$10$rKzqX5YQNx5CY8JQfH8X4.vC4h6qT9XW7oP2NxE3YbKm8sJ7L8vHC')
ON CONFLICT DO NOTHING;