-- Fix the content formatting for the announcement post
UPDATE blog_posts 
SET content = 'We are proud to announce that Hobson now delivers answers with 98% accuracy across property and legal document queries.

This milestone reflects our commitment to rigorous extraction, validation, and compliance rules, ensuring that Hobson provides clients with consistent, trustworthy outputs.

For our clients, this means:

<ul><li>Greater confidence in every answer</li><li>Fewer re-checks and manual interventions</li><li>A clear foundation for scaling knowledge across portfolios</li></ul>

Thank you to our clients and pilot partners for helping us get here. This is an exciting step forward as we continue building the most reliable AI assistant for property compliance and management.'
WHERE id = '8d179dc0-bf28-459b-8ef3-4899677c6da6';