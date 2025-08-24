-- Remove the unique constraint on email only
DROP INDEX IF EXISTS newsletter_subscriptions_email_key;

-- Add a unique constraint on the combination of email and subscription_type
ALTER TABLE newsletter_subscriptions 
ADD CONSTRAINT newsletter_subscriptions_email_subscription_type_key 
UNIQUE (email, subscription_type);