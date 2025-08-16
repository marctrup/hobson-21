-- Add foreign key constraints with cascade delete to clean up related records

-- Add foreign key for feature_request_comments
ALTER TABLE feature_request_comments 
ADD CONSTRAINT fk_feature_request_comments_feature_request_id 
FOREIGN KEY (feature_request_id) 
REFERENCES feature_requests(id) 
ON DELETE CASCADE;

-- Add foreign key for feature_request_votes  
ALTER TABLE feature_request_votes 
ADD CONSTRAINT fk_feature_request_votes_feature_request_id 
FOREIGN KEY (feature_request_id) 
REFERENCES feature_requests(id) 
ON DELETE CASCADE;

-- Add foreign key for feature_request_surveys
ALTER TABLE feature_request_surveys 
ADD CONSTRAINT fk_feature_request_surveys_feature_request_id 
FOREIGN KEY (feature_request_id) 
REFERENCES feature_requests(id) 
ON DELETE CASCADE;