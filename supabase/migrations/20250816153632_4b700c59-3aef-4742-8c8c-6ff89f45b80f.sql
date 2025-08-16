-- Add foreign key constraint with CASCADE delete for comment replies
-- This ensures when a parent comment is deleted, all its replies are also deleted

-- First, let's check if the constraint already exists and drop it if needed
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name LIKE '%parent_comment%' 
        AND table_name = 'feature_request_comments'
    ) THEN
        ALTER TABLE feature_request_comments 
        DROP CONSTRAINT IF EXISTS feature_request_comments_parent_comment_id_fkey;
    END IF;
END $$;

-- Add the foreign key constraint with CASCADE delete
ALTER TABLE feature_request_comments 
ADD CONSTRAINT feature_request_comments_parent_comment_id_fkey 
FOREIGN KEY (parent_comment_id) 
REFERENCES feature_request_comments(id) 
ON DELETE CASCADE;