-- Fix the search_path security issue for the get_safe_profile_data function
CREATE OR REPLACE FUNCTION public.get_safe_profile_data(profile_user_id UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID, 
  display_name TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) 
LANGUAGE SQL 
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT 
    p.id,
    p.user_id,
    p.display_name,
    p.created_at,
    p.updated_at
  FROM public.profiles p
  WHERE p.user_id = profile_user_id;
$$;