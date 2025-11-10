import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';
import { escapeHtml } from '../_shared/validation.ts';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface UnsubscribeRequest {
  email: string;
  token?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    let email: string;
    
    // Handle both GET (with query params) and POST requests
    if (req.method === "GET") {
      email = url.searchParams.get('email') || '';
    } else {
      const { email: bodyEmail }: UnsubscribeRequest = await req.json();
      email = bodyEmail || '';
    }

    console.log('Unsubscribe request for:', email);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Rate limiting check (5 unsubscribe requests per IP per hour)
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const { data: rateLimitOk, error: rateLimitError } = await supabase
      .rpc('check_server_rate_limit', {
        p_identifier: clientIp,
        p_action_type: 'newsletter_unsubscribe',
        p_max_requests: 5,
        p_window_minutes: 60
      });

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError);
    }

    if (rateLimitOk === false) {
      console.log(`Rate limit exceeded for IP: ${clientIp}`);
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Deactivate all subscriptions for this email
    const { error: updateError } = await supabase
      .from('newsletter_subscriptions')
      .update({ 
        is_active: false, 
        updated_at: new Date().toISOString() 
      })
      .eq('email', email)
      .eq('is_active', true);

    if (updateError) {
      console.error('Error unsubscribing:', updateError);
      throw updateError;
    }

    console.log('Successfully unsubscribed:', email);

    // Escape email for safe HTML rendering
    const safeEmail = escapeHtml(email);

    // Return HTML response for browser-friendly unsubscribe page
    const htmlResponse = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Unsubscribed - Hobson AI</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
            background-color: #f9f9f9;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
        }
        .success-icon {
            font-size: 48px;
            color: #28a745;
            margin-bottom: 20px;
        }
        h1 { color: #333; margin-bottom: 20px; }
        p { color: #666; margin-bottom: 30px; }
        .email { color: #007bff; font-weight: 500; }
        .footer { font-size: 14px; color: #999; margin-top: 30px; }
        .back-link {
            display: inline-block;
            background: #007bff;
            color: white;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 6px;
            margin-top: 20px;
        }
        .back-link:hover {
            background: #0056b3;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="success-icon">✓</div>
        <h1>Successfully Unsubscribed</h1>
        <p>The email address <span class="email">${safeEmail}</span> has been successfully unsubscribed from all Hobson AI updates.</p>
        <p>You will no longer receive announcements, newsletters, or promotional emails from us.</p>
        <p>If you change your mind, you can always subscribe again by visiting our website.</p>
        
        <a href="https://hobsonschoice.ai" class="back-link">Visit Hobson AI</a>
        
        <div class="footer">
            <p>Thank you for using Hobson AI</p>
        </div>
    </div>
</body>
</html>
    `;

    return new Response(htmlResponse, {
      status: 200,
      headers: { 
        "Content-Type": "text/html", 
        ...corsHeaders 
      },
    });

  } catch (error) {
    console.error('Error in newsletter-unsubscribe function:', error);
    
    const errorHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Unsubscribe Error - Hobson AI</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
            background-color: #f9f9f9;
            text-align: center;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .error-icon {
            font-size: 48px;
            color: #dc3545;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="error-icon">⚠</div>
        <h1>Unsubscribe Error</h1>
        <p>We encountered an error while processing your unsubscribe request. Please try again or contact us at info@hobsonschoice.ai</p>
        <a href="https://hobsonschoice.ai" style="color: #007bff;">Visit Hobson AI</a>
    </div>
</body>
</html>
    `;
    
    return new Response(errorHtml, {
      status: 500,
      headers: { 
        "Content-Type": "text/html", 
        ...corsHeaders 
      },
    });
  }
};

serve(handler);