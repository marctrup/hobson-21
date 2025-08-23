-- Add link_location field to blog_posts table to specify where posts are linked from
ALTER TABLE public.blog_posts 
ADD COLUMN link_location text DEFAULT 'blog' NOT NULL;

-- Add check constraint to ensure valid link locations
ALTER TABLE public.blog_posts 
ADD CONSTRAINT blog_posts_link_location_check 
CHECK (link_location IN ('blog', 'announcements'));

-- Create index for better query performance
CREATE INDEX idx_blog_posts_link_location ON public.blog_posts(link_location);