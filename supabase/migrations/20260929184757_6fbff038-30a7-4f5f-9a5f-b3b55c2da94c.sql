DROP POLICY IF EXISTS "Signed in users can view feature requests" ON public.feature_requests;
CREATE POLICY "Verified users can view feature requests"
ON public.feature_requests FOR SELECT TO authenticated
USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Signed in users can view comments" ON public.feature_request_comments;
CREATE POLICY "Verified users can view comments"
ON public.feature_request_comments FOR SELECT TO authenticated
USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Signed in users can view votes" ON public.feature_request_votes;
CREATE POLICY "Users can view their own votes"
ON public.feature_request_votes FOR SELECT TO authenticated
USING (auth.uid() = user_id);