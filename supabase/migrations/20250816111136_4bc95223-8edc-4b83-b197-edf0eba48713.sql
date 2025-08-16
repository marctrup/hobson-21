-- Create enum for feature request categories
CREATE TYPE public.feature_request_category AS ENUM (
  'feedback',
  'feature-request',
  'integrations', 
  'questions',
  'bug-hunting',
  'lovable-project',
  'ama'
);

-- Create feature_requests table
CREATE TABLE public.feature_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category public.feature_request_category NOT NULL DEFAULT 'feature-request',
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  author_name TEXT NOT NULL,
  votes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.feature_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for feature requests
CREATE POLICY "Anyone can view feature requests" 
ON public.feature_requests 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create feature requests" 
ON public.feature_requests 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own feature requests" 
ON public.feature_requests 
FOR UPDATE 
TO authenticated
USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own feature requests" 
ON public.feature_requests 
FOR DELETE 
TO authenticated
USING (auth.uid() = author_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_feature_requests_updated_at
    BEFORE UPDATE ON public.feature_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create votes table for tracking user votes
CREATE TABLE public.feature_request_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  feature_request_id UUID REFERENCES public.feature_requests(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(feature_request_id, user_id)
);

-- Enable RLS on votes table
ALTER TABLE public.feature_request_votes ENABLE ROW LEVEL SECURITY;

-- Create policies for votes
CREATE POLICY "Anyone can view votes" 
ON public.feature_request_votes 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can vote" 
ON public.feature_request_votes 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes" 
ON public.feature_request_votes 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);