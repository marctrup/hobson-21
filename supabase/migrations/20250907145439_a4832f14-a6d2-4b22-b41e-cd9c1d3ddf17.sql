-- Create rewards table to store successful challenge completions
CREATE TABLE public.rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  challenge_type TEXT NOT NULL DEFAULT 'property_quiz',
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can insert reward entries" 
ON public.rewards 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Only admins can view reward entries" 
ON public.rewards 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_rewards_updated_at
BEFORE UPDATE ON public.rewards
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for email lookups
CREATE INDEX idx_rewards_email ON public.rewards(email);
CREATE INDEX idx_rewards_challenge_type ON public.rewards(challenge_type);
CREATE INDEX idx_rewards_created_at ON public.rewards(created_at DESC);