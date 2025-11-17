-- Create table to store chatbot knowledge base
CREATE TABLE IF NOT EXISTS public.chatbot_knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  version INTEGER DEFAULT 1
);

-- Enable RLS (but allow public read access for the chatbot)
ALTER TABLE public.chatbot_knowledge_base ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to read the knowledge base
CREATE POLICY "Anyone can read knowledge base"
  ON public.chatbot_knowledge_base
  FOR SELECT
  USING (true);

-- Policy to allow service role to update
CREATE POLICY "Service role can update knowledge base"
  ON public.chatbot_knowledge_base
  FOR ALL
  USING (auth.role() = 'service_role');

-- Insert initial knowledge base content
INSERT INTO public.chatbot_knowledge_base (content) VALUES ('# Hobson AI Knowledge Base
Initial content - will be updated by automated script');

-- Enable pg_cron extension for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;