-- Update blog posts to use local image URLs for better LCP performance
UPDATE blog_posts 
SET featured_image_url = '/blog-images/too-good-to-be-true.png'
WHERE slug = 'property-management-software';

UPDATE blog_posts 
SET featured_image_url = '/blog-images/boy-praying-with-bible.png'
WHERE slug = 'tenant-document';

UPDATE blog_posts 
SET featured_image_url = '/blog-images/deliveroo-bike.png'
WHERE slug = 'real-estate-ai';