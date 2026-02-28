import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from "npm:resend@4.0.0";
import { contactFormSchema, escapeHtml } from '../_shared/validation.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const rawData = await req.json()
    
    // Validate input
    const validationResult = contactFormSchema.safeParse(rawData)
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid input data',
          details: validationResult.error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }
    
    const { name, email, phone, reason } = validationResult.data
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Rate limiting check (5 submissions per IP per hour)
    const forwardedFor = req.headers.get("x-forwarded-for");
    const realIP = req.headers.get("x-real-ip");
    let clientIP = "unknown";
    if (forwardedFor) {
      clientIP = forwardedFor.split(",")[0].trim();
    } else if (realIP) {
      clientIP = realIP.trim();
    }

    const { data: rateLimitOk, error: rateLimitError } = await supabase
      .rpc('check_server_rate_limit', {
        p_identifier: clientIP,
        p_action_type: 'contact_submission',
        p_max_requests: 5,
        p_window_minutes: 60
      });

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError);
    }

    if (rateLimitOk === false) {
      console.log(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ success: false, error: 'Too many requests. Please try again later.' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 429,
        },
      )
    }
    
    console.log('Processing contact message for:', email)
    
    // Check if email already exists in pilot_applications (for cross-reference)
    const { data: existingPilotApp, error: pilotCheckError } = await supabase
      .from('pilot_applications')
      .select('email')
      .eq('email', email)
      .maybeSingle()

    console.log('Pilot application check result:', { existingPilotApp, pilotCheckError })

    let emailExistsMessage = ''
    if (existingPilotApp) {
      emailExistsMessage = '\n\nNote: This email has previously submitted a pilot application.'
    }

    // Try encrypted insert first, fall back to plaintext if encryption fails
    let isDuplicate = false;
    let insertSuccess = false;

    // Attempt encrypted storage via RPC
    console.log('Attempting encrypted contact message insert for:', email)
    const { data: contactId, error: encryptedError } = await supabase
      .rpc('insert_encrypted_contact_message', {
        p_name: name,
        p_email: email,
        p_phone: phone || null,
        p_message: reason
      })

    if (encryptedError) {
      if (encryptedError.code === '23505') {
        console.log('Duplicate contact message detected')
        isDuplicate = true;
        insertSuccess = true;
      } else {
        console.warn('Encrypted insert failed, falling back to plaintext storage:', encryptedError.message)
        
        // Fallback: insert into plaintext contact_messages table (protected by admin-only SELECT RLS)
        const { error: plaintextError } = await supabase
          .from('contact_messages')
          .insert({
            name: name,
            email: email,
            phone: phone || null,
            message: reason
          })

        if (plaintextError) {
          if (plaintextError.code === '23505') {
            console.log('Duplicate contact message detected (plaintext)')
            isDuplicate = true;
            insertSuccess = true;
          } else {
            console.error('Both encrypted and plaintext inserts failed:', plaintextError)
            return new Response(
              JSON.stringify({ success: false, error: 'Unable to process your request. Please try again.' }),
              {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 500,
              },
            )
          }
        } else {
          console.log('Contact message saved to plaintext storage (fallback)')
          insertSuccess = true;
        }
      }
    } else {
      console.log('Contact message saved with encryption')
      insertSuccess = true;
    }

    // Create HTML template with unsubscribe link (escape user input to prevent XSS)
    const safeName = escapeHtml(name)
    const safeEmail = escapeHtml(email)
    
    const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank you for contacting Hobson AI</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <div style="margin-bottom: 30px;">
        <p style="margin-bottom: 20px;">Hi ${safeName},</p>
        
        <p style="margin-bottom: 20px;">Thank you for contacting Hobson AI! We have received your message and will get back to you as soon as possible.</p>
        
        <p style="margin-bottom: 20px;">Our team typically responds within 24 hours during business days.</p>
        
        <p style="margin-bottom: 30px;">We're excited to help you with your property management and compliance needs.</p>
        
        <p style="margin-bottom: 10px;">— The Hobson AI Team</p>
        
        <p style="margin-bottom: 0;">
            <a href="https://www.hobsonschoice.ai" style="color: #007bff; text-decoration: none;">www.hobsonschoice.ai</a> | 
            <a href="mailto:info@hobsonschoice.ai" style="color: #007bff; text-decoration: none;">info@hobsonschoice.ai</a>
        </p>
    </div>
    
    <div style="border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #666; text-align: center;">
        <p>This is a confirmation email for your contact form submission.</p>
        <p style="margin-top: 15px;">
            <a href="https://hobsonschoice.ai/functions/v1/newsletter-unsubscribe?email=${encodeURIComponent(email)}" 
               style="color: #999; text-decoration: underline; font-size: 11px;">
                Unsubscribe from all Hobson AI emails
            </a>
        </p>
    </div>
    
</body>
</html>
    `;

    // Send confirmation email to the user
    const confirmationResponse = await resend.emails.send({
      from: "Hobson AI <noreply@hobsonschoice.ai>",
      to: [email],
      subject: "Thank you for contacting Hobson AI",
      html: htmlTemplate,
    });

    console.log("Confirmation email sent successfully:", confirmationResponse);

    // For team notification, escape user inputs
    const emailContent = `
New Contact Message from Hobson AI Website

Name: ${escapeHtml(name)}
Email: ${escapeHtml(email)}
Phone: ${phone ? escapeHtml(phone) : 'Not provided'}
Reason for Enquiry: ${escapeHtml(reason)}${emailExistsMessage}

---
Submitted at: ${new Date().toISOString()}
    `.trim()

    // Send notification email to team
    const notificationResponse = await resend.emails.send({
      from: 'Hobson AI <noreply@hobsonschoice.ai>',
      to: ['info@hobsonschoice.ai'],
      subject: `Contact Message - ${escapeHtml(name)}`,
      text: emailContent,
    });

    console.log("Notification email sent successfully:", notificationResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Message sent successfully',
        emailExists: !!existingPilotApp,
        isDuplicate: isDuplicate
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error processing contact message:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Unable to process your request. Please try again.' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})