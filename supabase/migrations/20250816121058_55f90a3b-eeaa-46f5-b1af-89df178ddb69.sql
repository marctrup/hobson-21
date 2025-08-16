-- Fix all existing mismatched author names in feature_requests
UPDATE public.feature_requests 
SET author_name = p.display_name
FROM public.profiles p
WHERE feature_requests.author_id = p.user_id 
AND feature_requests.author_name != p.display_name;

-- Fix all existing mismatched author names in feature_request_comments  
UPDATE public.feature_request_comments
SET author_name = p.display_name
FROM public.profiles p
WHERE feature_request_comments.user_id = p.user_id
AND feature_request_comments.author_name != p.display_name;