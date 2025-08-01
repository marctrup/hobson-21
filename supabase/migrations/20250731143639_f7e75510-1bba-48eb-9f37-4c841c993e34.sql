-- First, let's upload the images to storage and update the blog posts to use local URLs

-- Update the blog posts to use the new local image URLs
UPDATE blog_posts 
SET featured_image_url = 'https://awfyhgeflakjhxtntokd.supabase.co/storage/v1/object/public/blog-images/too-good-to-be-true.png'
WHERE slug = 'property-management-software';

UPDATE blog_posts 
SET featured_image_url = 'https://awfyhgeflakjhxtntokd.supabase.co/storage/v1/object/public/blog-images/boy-praying-with-bible.png'
WHERE slug = 'tenant-document';

UPDATE blog_posts 
SET featured_image_url = 'https://awfyhgeflakjhxtntokd.supabase.co/storage/v1/object/public/blog-images/deliveroo-bike.png'
WHERE slug = 'real-estate-ai';