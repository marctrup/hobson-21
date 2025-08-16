-- Create comments table for feature requests
CREATE TABLE public.feature_request_comments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  feature_request_id uuid NOT NULL,
  user_id uuid NOT NULL,
  author_name text NOT NULL,
  content text NOT NULL,
  parent_comment_id uuid DEFAULT NULL, -- For replies
  votes integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.feature_request_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for comments
CREATE POLICY "Anyone can view comments" 
ON public.feature_request_comments 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create comments" 
ON public.feature_request_comments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
ON public.feature_request_comments 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
ON public.feature_request_comments 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for timestamps
CREATE TRIGGER update_feature_request_comments_updated_at
BEFORE UPDATE ON public.feature_request_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();