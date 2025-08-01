-- Add sort_order column to blog_posts table for custom ordering
ALTER TABLE public.blog_posts 
ADD COLUMN sort_order integer DEFAULT 0;

-- Create index for better performance on ordering
CREATE INDEX idx_blog_posts_sort_order ON public.blog_posts(sort_order DESC, updated_at DESC);

-- Set initial sort_order values based on current updated_at order
UPDATE public.blog_posts 
SET sort_order = (
  SELECT ROW_NUMBER() OVER (ORDER BY updated_at DESC) 
  FROM public.blog_posts bp2 
  WHERE bp2.id = blog_posts.id
);