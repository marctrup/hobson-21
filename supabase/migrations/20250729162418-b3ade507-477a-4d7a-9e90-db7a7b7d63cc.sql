-- Add foreign key constraint for author_id to profiles table instead of auth.users
ALTER TABLE public.blog_posts 
DROP CONSTRAINT blog_posts_author_id_fkey;

ALTER TABLE public.blog_posts 
ADD CONSTRAINT blog_posts_author_id_fkey 
FOREIGN KEY (author_id) REFERENCES public.profiles(user_id);