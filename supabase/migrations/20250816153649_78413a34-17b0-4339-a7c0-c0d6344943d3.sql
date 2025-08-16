-- Clean up orphaned comments that reference non-existent parent comments
UPDATE feature_request_comments 
SET parent_comment_id = NULL 
WHERE parent_comment_id IS NOT NULL 
  AND parent_comment_id NOT IN (
    SELECT id FROM feature_request_comments WHERE id IS NOT NULL
  );

-- Now add the foreign key constraint with CASCADE delete
ALTER TABLE feature_request_comments 
ADD CONSTRAINT feature_request_comments_parent_comment_id_fkey 
FOREIGN KEY (parent_comment_id) 
REFERENCES feature_request_comments(id) 
ON DELETE CASCADE;