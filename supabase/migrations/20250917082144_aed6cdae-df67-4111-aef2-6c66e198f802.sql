-- Ensure the rewards table has proper RLS protection for email addresses
-- First, let's make sure RLS is enabled (it should already be)
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them with stronger protection
DROP POLICY IF EXISTS "Anyone can insert reward entries" ON public.rewards;
DROP POLICY IF EXISTS "Only admins can view reward entries" ON public.rewards;

-- Recreate INSERT policy - allow anyone to insert their reward entries
CREATE POLICY "Allow reward entry insertion"
ON public.rewards
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- Create a strict admin-only SELECT policy
CREATE POLICY "Strict admin only access to rewards"
ON public.rewards
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL AND 
  has_role(auth.uid(), 'admin'::app_role) = true
);

-- Explicitly deny SELECT access to anonymous users
CREATE POLICY "Deny anonymous select on rewards"
ON public.rewards
FOR SELECT
TO anon
USING (false);

-- Prevent UPDATE and DELETE operations (emails should be immutable for audit purposes)
CREATE POLICY "Prevent updates to rewards"
ON public.rewards
FOR UPDATE
TO authenticated, anon
USING (false);

CREATE POLICY "Prevent deletes from rewards"
ON public.rewards
FOR DELETE
TO authenticated, anon
USING (false);