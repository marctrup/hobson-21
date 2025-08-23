-- Add priority column to blog_posts table
ALTER TABLE public.blog_posts 
ADD COLUMN priority TEXT DEFAULT 'medium';