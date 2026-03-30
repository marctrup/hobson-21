
CREATE TABLE public.tier_usage_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tier integer NOT NULL,
  monthly_questions text NOT NULL DEFAULT '300',
  monthly_extractions text NOT NULL DEFAULT '3',
  overage_behaviour text NOT NULL DEFAULT 'charge',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tier)
);

ALTER TABLE public.tier_usage_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read tier usage limits"
  ON public.tier_usage_limits FOR SELECT
  TO public USING (true);

CREATE POLICY "Admins can manage tier usage limits"
  ON public.tier_usage_limits FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.tier_usage_limits (tier, monthly_questions, monthly_extractions, overage_behaviour)
VALUES
  (1, '300', '3', 'charge'),
  (2, 'Unlimited', 'Unlimited', 'none'),
  (3, 'Unlimited', 'Unlimited', 'none'),
  (4, 'Unlimited', 'Unlimited', 'none');
