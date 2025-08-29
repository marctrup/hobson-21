-- Drop existing table if it exists and recreate with proper structure
DROP TABLE IF EXISTS public.contact_messages_encrypted CASCADE;

-- Enable the pgsodium extension for encryption  
CREATE EXTENSION IF NOT EXISTS pgsodium;

-- Create a new encrypted contact_messages table with proper security
CREATE TABLE public.contact_messages_encrypted (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    name_encrypted BYTEA,
    email_encrypted BYTEA, 
    phone_encrypted BYTEA,
    message_encrypted BYTEA,
    -- Keep a hash of email for duplicate detection without exposing the actual email
    email_hash TEXT GENERATED ALWAYS AS (encode(digest(email_encrypted, 'sha256'), 'hex')) STORED
);

-- Enable RLS on the new table
ALTER TABLE public.contact_messages_encrypted ENABLE ROW LEVEL SECURITY;

-- Create policies for the encrypted table
CREATE POLICY "Anyone can insert encrypted contact messages" 
ON public.contact_messages_encrypted 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Only admins can view encrypted contact messages" 
ON public.contact_messages_encrypted 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create secure functions for inserting and retrieving encrypted contact data
CREATE OR REPLACE FUNCTION public.insert_encrypted_contact_message(
    p_name TEXT,
    p_email TEXT, 
    p_message TEXT,
    p_phone TEXT DEFAULT NULL
) 
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
    contact_id UUID;
    encryption_key BYTEA;
BEGIN
    -- For now, use a simple approach without vault dependency 
    -- In production, this should use proper key management
    encryption_key := decode('your-32-byte-base64-encoded-key-here-replace-this', 'base64');
    
    -- Insert encrypted contact message
    INSERT INTO public.contact_messages_encrypted (
        name_encrypted,
        email_encrypted,
        phone_encrypted, 
        message_encrypted
    ) VALUES (
        pgsodium.crypto_secretbox(p_name::BYTEA, encryption_key),
        pgsodium.crypto_secretbox(p_email::BYTEA, encryption_key),
        CASE WHEN p_phone IS NOT NULL THEN pgsodium.crypto_secretbox(p_phone::BYTEA, encryption_key) ELSE NULL END,
        pgsodium.crypto_secretbox(p_message::BYTEA, encryption_key)
    ) RETURNING id INTO contact_id;
    
    RETURN contact_id;
END;
$$;

-- Create function to decrypt contact messages for authorized admin access
CREATE OR REPLACE FUNCTION public.get_decrypted_contact_messages()
RETURNS TABLE (
    id UUID,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    name TEXT,
    email TEXT,
    phone TEXT,
    message TEXT
)
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
    encryption_key BYTEA;
BEGIN
    -- Check admin access
    IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
        RAISE EXCEPTION 'Access denied. Admin role required.';
    END IF;
    
    -- Use same key as insert function
    encryption_key := decode('your-32-byte-base64-encoded-key-here-replace-this', 'base64');
    
    -- Return decrypted data
    RETURN QUERY 
    SELECT 
        cm.id,
        cm.created_at,
        cm.updated_at,
        convert_from(pgsodium.crypto_secretbox_open(cm.name_encrypted, encryption_key), 'UTF8')::TEXT as name,
        convert_from(pgsodium.crypto_secretbox_open(cm.email_encrypted, encryption_key), 'UTF8')::TEXT as email,
        CASE 
            WHEN cm.phone_encrypted IS NOT NULL 
            THEN convert_from(pgsodium.crypto_secretbox_open(cm.phone_encrypted, encryption_key), 'UTF8')::TEXT 
            ELSE NULL 
        END as phone,
        convert_from(pgsodium.crypto_secretbox_open(cm.message_encrypted, encryption_key), 'UTF8')::TEXT as message
    FROM public.contact_messages_encrypted cm;
END;
$$;

-- Create updated timestamp trigger for encrypted table  
CREATE TRIGGER update_contact_messages_encrypted_updated_at
    BEFORE UPDATE ON public.contact_messages_encrypted
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create index on email_hash for efficient duplicate checking
CREATE INDEX idx_contact_messages_encrypted_email_hash ON public.contact_messages_encrypted(email_hash);

-- Add audit logging for contact message access
CREATE OR REPLACE FUNCTION public.audit_contact_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
    -- Log admin access to contact messages
    PERFORM public.log_security_event(
        'CONTACT_MESSAGE_ACCESS',
        'contact_messages_encrypted', 
        COALESCE(NEW.id, OLD.id),
        CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger for audit logging
CREATE TRIGGER audit_contact_messages_access
    AFTER INSERT OR UPDATE OR DELETE ON public.contact_messages_encrypted
    FOR EACH ROW
    EXECUTE FUNCTION public.audit_contact_access();