
CREATE TABLE public.onboarding_pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cost_per_lease numeric(10,2) NOT NULL DEFAULT 2.00,
  cost_per_document numeric(10,2) NOT NULL DEFAULT 0.20,
  minimum_fee numeric(10,2) NOT NULL DEFAULT 5.00,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.onboarding_pricing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read onboarding pricing"
  ON public.onboarding_pricing FOR SELECT
  TO public USING (true);

CREATE POLICY "Admins can manage onboarding pricing"
  ON public.onboarding_pricing FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Insert default row
INSERT INTO public.onboarding_pricing (cost_per_lease, cost_per_document, minimum_fee)
VALUES (2.00, 0.20, 5.00);
