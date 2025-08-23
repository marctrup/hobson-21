-- Fix security vulnerability in feature_request_surveys table
-- Remove overly permissive policies and create secure ones

-- Drop the existing problematic policies
DROP POLICY IF EXISTS "Anyone can view survey responses" ON public.feature_request_surveys;
DROP POLICY IF EXISTS "Users can view their own survey responses" ON public.feature_request_surveys;

-- Create secure policy: users can only view their own survey responses
CREATE POLICY "Users can view their own survey responses only" 
ON public.feature_request_surveys 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create admin policy: admins can view all survey responses for analytics
CREATE POLICY "Admins can view all survey responses" 
ON public.feature_request_surveys 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Verify that only INSERT is allowed for authenticated users (this policy was correct)
-- "Authenticated users can create survey responses" already exists with proper check