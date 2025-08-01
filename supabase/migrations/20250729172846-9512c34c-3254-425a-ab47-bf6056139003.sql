-- Add featured image alt text column to blog_posts table
ALTER TABLE public.blog_posts 
ADD COLUMN featured_image_alt text;