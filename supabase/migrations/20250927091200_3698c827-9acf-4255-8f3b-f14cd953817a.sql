-- Fix conflicting RLS policies on rewards table
-- The issue: Two conflicting SELECT policies where one denies all access (false) 
-- and another allows admin access, but since both are restrictive policies,
-- the "false" policy overrides the admin policy, making the table inaccessible even to admins.

-- Drop the conflicting "Deny anonymous select on rewards" policy
-- This policy is redundant since we have a specific admin-only policy
DROP POLICY IF EXISTS "Deny anonymous select on rewards" ON public.rewards;

-- The remaining "Strict admin only access to rewards" policy will now work correctly
-- It ensures only authenticated admins can view the sensitive email data

-- Verify the current policies are secure:
-- INSERT: Anyone can insert (for reward entries) ✓
-- SELECT: Only admins can view (protects email addresses) ✓  
-- UPDATE: No one can update ✓
-- DELETE: No one can delete ✓