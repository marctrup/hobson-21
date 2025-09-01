-- Add RLS policy audit trigger for privilege escalation monitoring
CREATE OR REPLACE FUNCTION public.validate_critical_role_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Only allow admin role assignment by existing admins or during initial user creation
  IF NEW.role = 'admin' AND TG_OP = 'INSERT' THEN
    -- Check if this is during initial user setup (no existing roles)
    IF EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = NEW.user_id AND role != 'user'
    ) THEN
      -- User already has roles, so this must be an admin assignment
      IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for critical role validation
DROP TRIGGER IF EXISTS validate_critical_roles_trigger ON public.user_roles;
CREATE TRIGGER validate_critical_roles_trigger
  BEFORE INSERT OR UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_critical_role_changes();

-- Add full-text search support for secure searching
ALTER TABLE public.feature_requests ADD COLUMN IF NOT EXISTS fts tsvector;

-- Create index for full-text search
DROP INDEX IF EXISTS idx_feature_requests_fts;
CREATE INDEX idx_feature_requests_fts ON public.feature_requests USING gin(fts);

-- Function to update full-text search vector
CREATE OR REPLACE FUNCTION public.update_feature_request_fts()
RETURNS TRIGGER AS $$
BEGIN
  NEW.fts := setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
            setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update FTS on changes
DROP TRIGGER IF EXISTS update_feature_request_fts_trigger ON public.feature_requests;
CREATE TRIGGER update_feature_request_fts_trigger
  BEFORE INSERT OR UPDATE ON public.feature_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_feature_request_fts();

-- Update existing records with FTS data
UPDATE public.feature_requests SET 
  fts = setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(description, '')), 'B')
WHERE fts IS NULL;

-- Enhanced rate limiting for contact submissions
CREATE TABLE IF NOT EXISTS public.security_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier text NOT NULL,
  action_type text NOT NULL,
  request_count integer DEFAULT 1,
  window_start timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT now() + interval '1 hour',
  created_at timestamptz DEFAULT now(),
  UNIQUE(identifier, action_type)
);

-- Enable RLS on rate limits table
ALTER TABLE public.security_rate_limits ENABLE ROW LEVEL SECURITY;

-- Only system functions can manage rate limits
CREATE POLICY "System only rate limit management" ON public.security_rate_limits
FOR ALL USING (false);

-- Function to check and update rate limits server-side
CREATE OR REPLACE FUNCTION public.check_server_rate_limit(
  p_identifier text,
  p_action_type text,
  p_max_requests integer DEFAULT 5,
  p_window_minutes integer DEFAULT 60
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;