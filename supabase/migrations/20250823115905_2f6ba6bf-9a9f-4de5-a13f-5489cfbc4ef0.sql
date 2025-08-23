-- Remove specific test email subscriptions
DELETE FROM newsletter_subscriptions 
WHERE email IN ('marctrup+announcements@gmail.com', 'marctrup+3@gmail.com');