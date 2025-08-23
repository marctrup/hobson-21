-- Remove test feature request
DELETE FROM feature_requests 
WHERE title = 'testing' AND author_name = 'marct2025';