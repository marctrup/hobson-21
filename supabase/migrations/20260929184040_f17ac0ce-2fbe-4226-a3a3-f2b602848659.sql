-- Sensitive tables are accessed only through validated Edge Functions.
DROP POLICY IF EXISTS "Anyone can read knowledge base" ON public.chatbot_knowledge_base;
DROP POLICY IF EXISTS "Service role can update knowledge base" ON public.chatbot_knowledge_base;
CREATE POLICY "Service role manages knowledge base"
ON public.chatbot_knowledge_base FOR ALL TO service_role
USING (true) WITH CHECK (true);
REVOKE ALL ON public.chatbot_knowledge_base FROM anon, authenticated;
GRANT ALL ON public.chatbot_knowledge_base TO service_role;

DROP POLICY IF EXISTS "Service can insert email send log" ON public.email_send_log;
DROP POLICY IF EXISTS "Service role can insert email logs" ON public.email_send_log;
CREATE POLICY "Service role writes email log"
ON public.email_send_log FOR INSERT TO service_role
WITH CHECK (true);
REVOKE ALL ON public.email_send_log FROM anon, authenticated;
GRANT INSERT ON public.email_send_log TO service_role;

DROP POLICY IF EXISTS "Anyone can insert contact messages" ON public.contact_messages;
REVOKE ALL ON public.contact_messages FROM anon;
GRANT SELECT ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;

DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscriptions;
DROP POLICY IF EXISTS "Service role can manage subscriptions" ON public.newsletter_subscriptions;
CREATE POLICY "Service role manages subscriptions"
ON public.newsletter_subscriptions FOR ALL TO service_role
USING (true) WITH CHECK (true);
REVOKE ALL ON public.newsletter_subscriptions FROM anon, authenticated;
GRANT ALL ON public.newsletter_subscriptions TO service_role;

DROP POLICY IF EXISTS "Allow reward entry insertion" ON public.rewards;
DROP POLICY IF EXISTS "Anyone can insert rewards" ON public.rewards;
CREATE POLICY "Service role manages rewards"
ON public.rewards FOR ALL TO service_role
USING (true) WITH CHECK (true);
REVOKE ALL ON public.rewards FROM anon, authenticated;
GRANT ALL ON public.rewards TO service_role;

-- Feature collaboration requires a signed-in identity and row ownership.
DROP POLICY IF EXISTS "Anyone can view feature requests" ON public.feature_requests;
CREATE POLICY "Signed in users can view feature requests"
ON public.feature_requests FOR SELECT TO authenticated
USING (true);
REVOKE ALL ON public.feature_requests FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.feature_requests TO authenticated;
GRANT ALL ON public.feature_requests TO service_role;

DROP POLICY IF EXISTS "Anyone can view votes" ON public.feature_request_votes;
CREATE POLICY "Signed in users can view votes"
ON public.feature_request_votes FOR SELECT TO authenticated
USING (true);
REVOKE ALL ON public.feature_request_votes FROM anon;
GRANT SELECT, INSERT, DELETE ON public.feature_request_votes TO authenticated;
GRANT ALL ON public.feature_request_votes TO service_role;

DROP POLICY IF EXISTS "Anyone can view comments" ON public.feature_request_comments;
CREATE POLICY "Signed in users can view comments"
ON public.feature_request_comments FOR SELECT TO authenticated
USING (true);
REVOKE ALL ON public.feature_request_comments FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.feature_request_comments TO authenticated;
GRANT ALL ON public.feature_request_comments TO service_role;

-- These datasets are intentionally public configuration/status, with admin-only writes.
DROP POLICY IF EXISTS "Anyone can view status updates" ON public.status_updates;
CREATE POLICY "Public can view service status"
ON public.status_updates FOR SELECT TO anon, authenticated
USING (service_key IS NOT NULL AND service_name IS NOT NULL);
GRANT SELECT ON public.status_updates TO anon, authenticated;
GRANT ALL ON public.status_updates TO service_role;

DROP POLICY IF EXISTS "Anyone can read tier usage limits" ON public.tier_usage_limits;
CREATE POLICY "Public can read published tier limits"
ON public.tier_usage_limits FOR SELECT TO anon, authenticated
USING (tier BETWEEN 1 AND 4);
GRANT SELECT ON public.tier_usage_limits TO anon, authenticated;
GRANT ALL ON public.tier_usage_limits TO service_role;

DROP POLICY IF EXISTS "Anyone can read onboarding pricing" ON public.onboarding_pricing;
CREATE POLICY "Public can read published onboarding pricing"
ON public.onboarding_pricing FOR SELECT TO anon, authenticated
USING (cost_per_lease >= 0 AND cost_per_document >= 0 AND minimum_fee >= 0);
GRANT SELECT ON public.onboarding_pricing TO anon, authenticated;
GRANT ALL ON public.onboarding_pricing TO service_role;

-- Remove API execution rights from trigger-only and server-internal privileged functions.
REVOKE EXECUTE ON FUNCTION public.audit_user_roles_changes() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.crm_comm_update_last_contact_date() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.crm_communications_sanitise_html() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.crm_enforce_single_primary_admin() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.crm_enforce_single_primary_contact() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.crm_issues_log_status_change() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.crm_issues_log_to_activity() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.crm_issues_maintain_client_counter() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.crm_log_client_changes() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.crm_tasks_maintain_client_counter() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.prevent_zero_admins() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_author_name_on_display_name_change() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_feature_request_fts() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.validate_admin_action() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.validate_critical_role_changes() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.validate_display_name() FROM PUBLIC, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.make_user_admin(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.check_rate_limit(text, text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.check_server_rate_limit(text, text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_security_event(text, text, uuid, jsonb, jsonb) FROM PUBLIC, anon, authenticated;

-- Role predicates may be called only by signed-in users and trusted server code.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.has_crm_access(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.has_crm_write(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.has_crm_access(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.has_crm_write(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.check_server_rate_limit(text, text, integer, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.log_security_event(text, text, uuid, jsonb, jsonb) TO service_role;