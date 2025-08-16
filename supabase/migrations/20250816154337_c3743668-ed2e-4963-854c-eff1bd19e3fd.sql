-- Create table for feature request survey responses
CREATE TABLE public.feature_request_surveys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  feature_request_id UUID NOT NULL,
  user_id UUID NOT NULL,
  importance INTEGER NOT NULL CHECK (importance BETWEEN 1 AND 4),
  timing INTEGER NOT NULL CHECK (timing BETWEEN 1 AND 4), 
  frequency INTEGER NOT NULL CHECK (frequency BETWEEN 1 AND 4),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(feature_request_id, user_id)
);

-- Enable RLS
ALTER TABLE public.feature_request_surveys ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view survey responses" 
ON public.feature_request_surveys 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create survey responses" 
ON public.feature_request_surveys 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own survey responses" 
ON public.feature_request_surveys 
FOR SELECT 
USING (auth.uid() = user_id OR true);

-- Add trigger for timestamps
CREATE TRIGGER update_feature_request_surveys_updated_at
BEFORE UPDATE ON public.feature_request_surveys
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();