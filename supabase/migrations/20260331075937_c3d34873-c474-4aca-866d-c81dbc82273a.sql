CREATE POLICY "Admins can delete pilot applications"
ON public.pilot_applications
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));