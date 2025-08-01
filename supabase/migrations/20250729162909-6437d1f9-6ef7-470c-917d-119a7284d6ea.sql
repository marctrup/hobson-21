-- Update the "Property Management" category to "Business Updates"
UPDATE public.blog_categories 
SET 
  name = 'Business Updates',
  slug = 'business-updates',
  description = 'Latest company news, announcements, and business developments'
WHERE slug = 'property-management';