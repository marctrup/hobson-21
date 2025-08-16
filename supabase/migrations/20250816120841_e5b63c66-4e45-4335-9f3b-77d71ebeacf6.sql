-- Add unique constraint to display_name in profiles table
ALTER TABLE public.profiles ADD CONSTRAINT profiles_display_name_unique UNIQUE (display_name);

-- Create function to update author names when display name changes
CREATE OR REPLACE FUNCTION public.update_author_name_on_display_name_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Update author_name in feature_requests table
  UPDATE public.feature_requests 
  SET author_name = NEW.display_name 
  WHERE author_id = NEW.user_id;
  
  -- Update author_name in feature_request_comments table
  UPDATE public.feature_request_comments 
  SET author_name = NEW.display_name 
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically update author names when display name changes
CREATE TRIGGER trigger_update_author_name_on_display_name_change
  AFTER UPDATE OF display_name ON public.profiles
  FOR EACH ROW
  WHEN (OLD.display_name IS DISTINCT FROM NEW.display_name)
  EXECUTE FUNCTION public.update_author_name_on_display_name_change();