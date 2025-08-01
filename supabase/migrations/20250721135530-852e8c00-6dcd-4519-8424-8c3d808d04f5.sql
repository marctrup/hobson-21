-- Create table for pilot applications
CREATE TABLE public.pilot_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  preferred_contact TEXT,
  business_types TEXT[],
  website TEXT,
  help TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.pilot_applications ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a contact form)
CREATE POLICY "Anyone can insert pilot applications" 
ON public.pilot_applications 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view pilot applications" 
ON public.pilot_applications 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_pilot_applications_updated_at
BEFORE UPDATE ON public.pilot_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();