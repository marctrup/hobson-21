-- Add validation trigger for display names to prevent impersonation
-- This helps prevent users from setting display names that could be used to impersonate staff

CREATE OR REPLACE FUNCTION public.validate_display_name()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  forbidden_terms TEXT[] := ARRAY[
    'admin', 'administrator', 'mod', 'moderator', 'support', 'staff', 'team',
    'hobson', 'hobsons', 'hobsonschoice', 'hobson''s choice', 'official',
    'system', 'bot', 'ai', 'assistant', 'service', 'help', 'customer service',
    'root', 'superuser', 'owner', 'founder', 'ceo', 'manager'
  ];
  normalized_name TEXT;
  forbidden_term TEXT;
BEGIN
  -- Normalize the display name for comparison
  normalized_name := lower(trim(regexp_replace(NEW.display_name, '[\s\-_.]+', '', 'g')));
  
  -- Check against forbidden terms
  FOREACH forbidden_term IN ARRAY forbidden_terms LOOP
    IF normalized_name LIKE '%' || lower(regexp_replace(forbidden_term, '[\s\-_.]+', '', 'g')) || '%' THEN
      RAISE EXCEPTION 'Display name not allowed. Please choose a different name that doesn''t impersonate staff or system accounts.';
    END IF;
  END LOOP;
  
  RETURN NEW;
END;
$$;

-- Apply trigger to profiles table for display name validation
DROP TRIGGER IF EXISTS validate_display_name_trigger ON public.profiles;
CREATE TRIGGER validate_display_name_trigger
  BEFORE INSERT OR UPDATE OF display_name ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_display_name();