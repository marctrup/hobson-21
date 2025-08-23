-- Create use_case_videos table
CREATE TABLE public.use_case_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  vimeo_url TEXT NOT NULL,
  description TEXT,
  client_name TEXT,
  client_role TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.use_case_videos ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active use case videos" 
ON public.use_case_videos 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage use case videos" 
ON public.use_case_videos 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_use_case_videos_updated_at
BEFORE UPDATE ON public.use_case_videos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();