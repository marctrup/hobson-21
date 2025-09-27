-- Fix function search path security issues
-- Update functions that use 'public' search path to use empty string for better security

-- Fix update_author_name_on_display_name_change function
CREATE OR REPLACE FUNCTION public.update_author_name_on_display_name_change()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
$function$;

-- Fix validate_display_name function
CREATE OR REPLACE FUNCTION public.validate_display_name()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
$function$;

-- Fix validate_critical_role_changes function
CREATE OR REPLACE FUNCTION public.validate_critical_role_changes()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  -- Only allow admin role assignment by existing admins or during initial user creation
  IF NEW.role = 'admin' AND TG_OP = 'INSERT' THEN
    -- Check if this is during initial user setup (no existing roles)
    IF EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = NEW.user_id AND role != 'user'
    ) THEN
      -- User already has roles, so this must be an admin assignment
      IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
        RAISE EXCEPTION 'Only admins can assign admin privileges to users';
      END IF;
    END IF;
  END IF;
  
  -- Log all admin role changes for security monitoring
  IF NEW.role = 'admin' OR (TG_OP = 'UPDATE' AND OLD.role = 'admin') THEN
    PERFORM public.log_security_event(
      CASE 
        WHEN TG_OP = 'INSERT' THEN 'ADMIN_ROLE_GRANTED'
        WHEN TG_OP = 'UPDATE' THEN 'ADMIN_ROLE_MODIFIED'
        ELSE 'ADMIN_ROLE_ACTION'
      END,
      'user_roles',
      NEW.id,
      CASE WHEN TG_OP = 'UPDATE' THEN to_jsonb(OLD) ELSE NULL END,
      to_jsonb(NEW)
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Fix check_server_rate_limit function
CREATE OR REPLACE FUNCTION public.check_server_rate_limit(p_identifier text, p_action_type text, p_max_requests integer DEFAULT 5, p_window_minutes integer DEFAULT 60)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  current_count integer;
  window_start timestamptz;
BEGIN
  window_start := now() - (p_window_minutes || ' minutes')::interval;
  
  -- Clean up expired entries
  DELETE FROM public.security_rate_limits 
  WHERE expires_at < now();
  
  -- Get current count within window
  SELECT request_count INTO current_count
  FROM public.security_rate_limits
  WHERE identifier = p_identifier 
    AND action_type = p_action_type
    AND window_start > window_start;
  
  IF current_count IS NULL THEN
    -- First request in window
    INSERT INTO public.security_rate_limits (
      identifier, action_type, request_count, window_start, expires_at
    ) VALUES (
      p_identifier, p_action_type, 1, now(), now() + (p_window_minutes || ' minutes')::interval
    );
    RETURN true;
  ELSIF current_count >= p_max_requests THEN
    -- Rate limit exceeded
    RETURN false;
  ELSE
    -- Increment counter
    UPDATE public.security_rate_limits 
    SET request_count = request_count + 1
    WHERE identifier = p_identifier AND action_type = p_action_type;
    RETURN true;
  END IF;
END;
$function$;