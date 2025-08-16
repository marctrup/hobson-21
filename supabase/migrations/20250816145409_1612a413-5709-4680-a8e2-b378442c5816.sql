-- Drop the existing SELECT policy for profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create a more restrictive SELECT policy that explicitly prevents email harvesting
CREATE POLICY "Users can only view their own profile data" 
ON public.profiles 
FOR SELECT 
USING (user_id = auth.uid());

-- Create a secure function to get safe profile data without exposing emails
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

-- Ensure user_id is not nullable to prevent RLS bypass attacks
ALTER TABLE public.profiles ALTER COLUMN user_id SET NOT NULL;

-- Add unique constraint to prevent duplicate profiles
ALTER TABLE public.profiles ADD CONSTRAINT IF NOT EXISTS profiles_user_id_unique UNIQUE (user_id);