-- Add email format validation and unique constraint to rewards table
ALTER TABLE public.rewards ADD CONSTRAINT rewards_email_format 
  CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Add unique constraint to prevent duplicate entries
ALTER TABLE public.rewards ADD CONSTRAINT rewards_unique_email_challenge 
  UNIQUE (email, challenge_type);