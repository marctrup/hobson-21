import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple in-memory rate limiting (resets on function cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + WINDOW_MS });
    return true;
  }
  
  if (record.count >= MAX_ATTEMPTS) {
    return false;
  }
  
  record.count++;
  return true;
}

// Simple SHA-256 hash for password comparison (for non-bcrypt hashes)
async function sha256Hash(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    
    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      console.log(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: 'Too many attempts. Please try again later.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 429 }
      );
    }

    const { password } = await req.json();

    if (!password) {
      return new Response(
        JSON.stringify({ error: 'Password is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Validate password length
    if (typeof password !== 'string' || password.length > 100) {
      return new Response(
        JSON.stringify({ error: 'Invalid password format' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch the stored password hash
    const { data, error } = await supabase
      .from('investment_page_settings')
      .select('password_hash')
      .single();

    if (error) {
      console.error('Error fetching password hash:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to verify password' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    if (!data?.password_hash) {
      console.error('No password hash found in database');
      return new Response(
        JSON.stringify({ error: 'Password not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const storedHash = data.password_hash;
    let isValid = false;

    // Check if it's a bcrypt hash (starts with $2a$, $2b$, or $2y$)
    if (storedHash.startsWith('$2a$') || storedHash.startsWith('$2b$') || storedHash.startsWith('$2y$')) {
      // For bcrypt hashes, we need to use a Deno-compatible approach
      // Import bcrypt with explicit worker disabled
      try {
        const { compareSync } = await import("https://deno.land/x/bcrypt@v0.4.1/mod.ts");
        isValid = compareSync(password, storedHash);
      } catch (bcryptError) {
        console.error('Bcrypt comparison failed:', bcryptError);
        // Fall back to plaintext comparison if bcrypt fails
        isValid = password === storedHash;
      }
    } else if (storedHash.length === 64) {
      // Looks like a SHA-256 hash (64 hex characters)
      const inputHash = await sha256Hash(password);
      isValid = inputHash === storedHash;
    } else {
      // Assume plaintext comparison (legacy)
      isValid = password === storedHash;
    }

    console.log(`Password verification attempt from ${clientIP}: ${isValid ? 'success' : 'failed'}`);

    return new Response(
      JSON.stringify({ valid: isValid }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Error in verify-investment-password function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
