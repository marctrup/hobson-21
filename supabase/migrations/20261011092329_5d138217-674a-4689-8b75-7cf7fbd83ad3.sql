GRANT SELECT ON public.blog_posts TO anon, authenticated;
GRANT ALL ON public.blog_posts TO service_role;
GRANT SELECT ON public.blog_categories TO anon, authenticated;
GRANT ALL ON public.blog_categories TO service_role;
GRANT SELECT ON public.blog_post_categories TO anon, authenticated;
GRANT ALL ON public.blog_post_categories TO service_role;