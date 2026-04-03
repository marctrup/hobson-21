DROP POLICY "System can insert extraction events" ON public.extraction_events;

CREATE POLICY "Service role can insert extraction events"
  ON public.extraction_events FOR INSERT
  TO authenticated
  WITH CHECK (auth.role() = 'service_role');