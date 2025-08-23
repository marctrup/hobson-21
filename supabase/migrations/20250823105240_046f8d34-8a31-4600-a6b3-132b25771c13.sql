-- Create newsletter subscriptions table
CREATE TABLE public.newsletter_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscription_type TEXT NOT NULL DEFAULT 'announcements',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can subscribe to newsletter" 
ON public.newsletter_subscriptions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Only admins can view subscriptions" 
ON public.newsletter_subscriptions 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_newsletter_subscriptions_updated_at
BEFORE UPDATE ON public.newsletter_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();