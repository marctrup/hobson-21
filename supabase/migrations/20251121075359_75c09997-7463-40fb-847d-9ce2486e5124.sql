-- Create glossary_items table
CREATE TABLE public.glossary_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  term TEXT NOT NULL,
  definition TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  sort_order INTEGER NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.glossary_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active glossary items"
  ON public.glossary_items
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage all glossary items"
  ON public.glossary_items
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create updated_at trigger
CREATE TRIGGER update_glossary_items_updated_at
  BEFORE UPDATE ON public.glossary_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();