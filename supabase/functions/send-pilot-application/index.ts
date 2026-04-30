import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from "npm:resend@4.0.0";
import { pilotApplicationSchema, escapeHtml } from '../_shared/validation.ts';
import { postToCrmIngest } from '../_shared/crm-ingest.ts';

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
    const validationResult = pilotApplicationSchema.safeParse(rawData)
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
    
    const { name, company, role, email, phone, preferredContact, businessTypes, website, help } = validationResult.data
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Rate limiting check (3 submissions per IP per hour)
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
        p_action_type: 'pilot_application',
        p_max_requests: 3,
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
    
    // Format website URL properly
    let formattedWebsite = '';
    if (website && website.trim()) {
      const trimmedWebsite = website.trim();
      if (trimmedWebsite.startsWith('http://') || trimmedWebsite.startsWith('https://')) {
        formattedWebsite = trimmedWebsite;
      } else {
        formattedWebsite = `https://${trimmedWebsite}`;
      }
    }

    // Cutover: legacy pilot_applications writes are disabled.
    // The CRM (crm-ingest-website) is now the system of record.
    const applicationId = crypto.randomUUID();

    // Parse name for React Email template (escape for security)
    const nameParts = name.split(' ');
    const firstName = escapeHtml(nameParts[0]);
    const safeEmail = escapeHtml(email)

    // Create HTML template with unsubscribe link
    const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thanks for your interest in Hobson AI</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <div style="margin-bottom: 30px;">
        <p style="margin-bottom: 20px;">Hi ${firstName},</p>
        
        <p style="margin-bottom: 20px;">Thank you for registering your interest in Hobson AI! We're thrilled you want to learn more about our AI-powered document intelligence solution for the property sector.</p>
        
        <p style="margin-bottom: 20px;">A member of our team will be in touch shortly to discuss how Hobson AI can help streamline your property workflow.</p>
        
        <p style="margin-bottom: 20px;">In the meantime, feel free to explore our website to learn more about what we do.</p>
        
        <p style="margin-bottom: 10px;">— The Hobson AI Team</p>
        
        <p style="margin-bottom: 0;">
            <a href="https://www.hobsonschoice.ai" style="color: #007bff; text-decoration: none;">www.hobsonschoice.ai</a> | 
            <a href="mailto:info@hobsonschoice.ai" style="color: #007bff; text-decoration: none;">info@hobsonschoice.ai</a>
        </p>
    </div>
    
    <div style="border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #666; text-align: center;">
        <p>This is a confirmation email from Hobson AI.</p>
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

    // Send confirmation email to the applicant
    const confirmationSubject = "Thanks for your interest in Hobson AI!";
    let confirmationStatus = 'sent';
    let confirmationError = null;
    try {
      const confirmationResponse = await resend.emails.send({
        from: "Hobson AI <noreply@hobsonschoice.ai>",
        to: [email],
        subject: confirmationSubject,
        html: htmlTemplate,
      });
      console.log("Confirmation email sent successfully:", confirmationResponse);
    } catch (emailErr: any) {
      confirmationStatus = 'failed';
      confirmationError = emailErr.message || 'Unknown error';
      console.error("Confirmation email failed:", emailErr);
    }

    // Log confirmation email
    await supabase.from('email_send_log').insert({
      application_id: applicationId,
      recipient_email: email,
      email_type: 'confirmation',
      subject: confirmationSubject,
      status: confirmationStatus,
      error_message: confirmationError,
    });

    // For team notification, escape user inputs
    const emailContent = `
New Hobson AI Enquiry

Name: ${escapeHtml(name)}
Company: ${escapeHtml(company)}
Source: ${escapeHtml(role)}
Email: ${escapeHtml(email)}
Phone: ${phone ? escapeHtml(phone) : 'Not provided'}
Preferred Contact: ${preferredContact ? escapeHtml(preferredContact) : 'Not specified'}
Business Types: ${businessTypes ? businessTypes.map(escapeHtml).join(', ') : 'Not specified'}
${formattedWebsite ? `Website: ${escapeHtml(formattedWebsite)}` : ''}
${help ? `\nMessage:\n${escapeHtml(help)}` : ''}

---
Submitted at: ${new Date().toISOString()}
    `.trim()

    // Send notification email to team
    const notificationSubject = `New Enquiry - ${escapeHtml(name)} from ${escapeHtml(company)}`;
    let notificationStatus = 'sent';
    let notificationError = null;
    try {
      const notificationResponse = await resend.emails.send({
        from: 'Hobson AI <noreply@hobsonschoice.ai>',
        to: ['info@hobsonschoice.ai'],
        subject: notificationSubject,
        text: emailContent,
      });
      console.log("Notification email sent successfully:", notificationResponse);
    } catch (emailErr: any) {
      notificationStatus = 'failed';
      notificationError = emailErr.message || 'Unknown error';
      console.error("Notification email failed:", emailErr);
    }

    // Log notification email
    await supabase.from('email_send_log').insert({
      application_id: applicationId,
      recipient_email: 'info@hobsonschoice.ai',
      email_type: 'notification',
      subject: notificationSubject,
      status: notificationStatus,
      error_message: notificationError,
    });

    // Forward to CRM (fail-soft)
    await postToCrmIngest({
      formType: 'website',
      idempotencyKey: applicationId,
      contact: { name, email, phone: phone ?? null, company, role },
      payload: {
        name, company, role, email, phone: phone ?? null,
        preferred_contact: preferredContact,
        business_types: businessTypes,
        website: formattedWebsite || null,
        help: help ?? null,
        client_ip: clientIP,
      },
      confirmationEmail: {
        sent: confirmationStatus === 'sent',
        subject: confirmationSubject,
        error: confirmationError,
      },
    });

    return new Response(
      JSON.stringify({ success: true, message: 'Application submitted successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error processing application:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Unable to process your application. Please try again.' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})