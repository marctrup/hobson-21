CREATE OR REPLACE FUNCTION public.check_server_rate_limit(
  p_identifier text,
  p_action_type text,
  p_max_requests integer DEFAULT 5,
  p_window_minutes integer DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  v_window_start timestamptz;
  v_current_count integer;
BEGIN
  v_window_start := now() - (p_window_minutes || ' minutes')::interval;

  -- Clear entries whose window has passed
  DELETE FROM public.security_rate_limits
  WHERE expires_at < now();

  SELECT request_count INTO v_current_count
  FROM public.security_rate_limits
  WHERE identifier = p_identifier
    AND action_type = p_action_type
    AND window_start > v_window_start;

  IF v_current_count IS NULL THEN
    -- First request in this window
    INSERT INTO public.security_rate_limits (
      identifier, action_type, request_count, window_start, expires_at
    ) VALUES (
      p_identifier, p_action_type, 1, now(), now() + (p_window_minutes || ' minutes')::interval
    )
    ON CONFLICT (identifier, action_type)
    DO UPDATE SET
      request_count = 1,
      window_start = now(),
      expires_at = now() + (p_window_minutes || ' minutes')::interval;
    RETURN true;
  ELSIF v_current_count >= p_max_requests THEN
    -- Too many attempts in this window
    RETURN false;
  ELSE
    UPDATE public.security_rate_limits
    SET request_count = request_count + 1
    WHERE identifier = p_identifier
      AND action_type = p_action_type
      AND window_start > v_window_start;
    RETURN true;
  END IF;
END;
$function$;

-- Keep the rule callable only by trusted server functions
REVOKE EXECUTE ON FUNCTION public.check_server_rate_limit(text, text, integer, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_server_rate_limit(text, text, integer, integer) TO service_role;