-- Fix search path security issue by recreating function and trigger properly
-- Drop trigger first, then function, then recreate both with proper security
DROP TRIGGER IF EXISTS update_pilot_applications_updated_at ON public.pilot_applications;
DROP FUNCTION IF EXISTS public.update_updated_at_column();

-- Recreate function with secure search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER update_pilot_applications_updated_at
BEFORE UPDATE ON public.pilot_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();