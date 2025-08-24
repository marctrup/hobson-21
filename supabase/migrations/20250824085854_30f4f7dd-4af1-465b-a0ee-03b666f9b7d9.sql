-- Create status_updates table to track system status changes
CREATE TABLE public.status_updates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_name TEXT NOT NULL,
  service_key TEXT NOT NULL UNIQUE, -- unique identifier for each service
  status TEXT NOT NULL CHECK (status IN ('operational', 'degraded', 'outage', 'maintenance')),
  description TEXT,
  icon TEXT, -- icon identifier
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.status_updates ENABLE ROW LEVEL SECURITY;

-- Create policies for status_updates
CREATE POLICY "Anyone can view status updates" 
ON public.status_updates 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage status updates" 
ON public.status_updates 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_status_updates_updated_at
BEFORE UPDATE ON public.status_updates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default service statuses
INSERT INTO public.status_updates (service_name, service_key, status, description, icon) VALUES
('Web Application', 'web_app', 'operational', 'Main application and user interface', 'Globe'),
('API Services', 'api_services', 'operational', 'Backend services and data processing', 'Server'),
('Database', 'database', 'operational', 'Data storage and retrieval systems', 'Database'),
('Authentication', 'authentication', 'operational', 'User login and security systems', 'Shield');