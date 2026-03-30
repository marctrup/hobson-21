
-- Document classification settings table (singleton)
CREATE TABLE public.document_classification_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  simple_document_threshold integer NOT NULL DEFAULT 50000,
  lease_threshold integer NOT NULL DEFAULT 50001,
  reclassification_behaviour text NOT NULL DEFAULT 'flag_review',
  reclassification_message text NOT NULL DEFAULT 'One or more documents you uploaded as standard documents were identified as leases based on their content. The difference in extraction cost has been applied. Leases: £[lease_price]. Standard documents: £[doc_price].',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.document_classification_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage classification settings"
  ON public.document_classification_settings FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can read classification settings"
  ON public.document_classification_settings FOR SELECT
  TO public
  USING (true);

-- Seed default row
INSERT INTO public.document_classification_settings (id) VALUES (gen_random_uuid());

-- Extraction events reporting table
CREATE TABLE public.extraction_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email text,
  document_name text NOT NULL,
  declared_type text NOT NULL,
  actual_tokens integer NOT NULL,
  charged_type text NOT NULL,
  amount_charged numeric NOT NULL DEFAULT 0,
  reclassified boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.extraction_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view extraction events"
  ON public.extraction_events FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert extraction events"
  ON public.extraction_events FOR INSERT
  TO authenticated
  WITH CHECK (true);
