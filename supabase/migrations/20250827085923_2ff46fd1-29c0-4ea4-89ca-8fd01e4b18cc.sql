-- Add video fields to blog_posts table
ALTER TABLE public.blog_posts 
ADD COLUMN video_url TEXT,
ADD COLUMN video_thumbnail_url TEXT,
ADD COLUMN video_thumbnail_alt TEXT;

-- Add a content_type column to distinguish between regular posts and videos
ALTER TABLE public.blog_posts 
ADD COLUMN content_type TEXT DEFAULT 'post';