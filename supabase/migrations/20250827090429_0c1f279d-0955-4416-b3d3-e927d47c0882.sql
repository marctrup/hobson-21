-- Add thumbnail fields to use_case_videos table
ALTER TABLE public.use_case_videos 
ADD COLUMN thumbnail_url TEXT,
ADD COLUMN thumbnail_alt TEXT;

-- Remove video fields from blog_posts table since we're not using them
ALTER TABLE public.blog_posts 
DROP COLUMN IF EXISTS video_url,
DROP COLUMN IF EXISTS video_thumbnail_url,
DROP COLUMN IF EXISTS video_thumbnail_alt,
DROP COLUMN IF EXISTS content_type;