CREATE POLICY "Admins can delete glossary items"
ON public.glossary_items
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));