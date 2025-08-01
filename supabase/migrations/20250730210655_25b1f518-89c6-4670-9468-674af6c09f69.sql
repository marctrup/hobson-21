-- Update the existing blog post slug to use URL-safe format
UPDATE blog_posts 
SET slug = 'ai-changes-property-management-software' 
WHERE slug = 'AI changes property management software';

-- Update the other blog post slug to ensure it's also URL-safe
UPDATE blog_posts 
SET slug = 'never-too-old-to-get-back-on-the-bike' 
WHERE slug = 'never-to-old-to-get-back-on-the-bike';