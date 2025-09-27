-- Fix function search path security issues
-- Set search_path for functions that don't have it configured properly

-- Update functions without proper security definer settings
CREATE OR REPLACE FUNCTION public.update_feature_request_fts()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  NEW.fts := setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
            setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B');
  RETURN NEW;
END;
$function$;