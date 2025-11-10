import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from "npm:resend@4.0.0";
import { pilotApplicationSchema, escapeHtml } from '../_shared/validation.ts';

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
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)
    
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

    // Save to database
    const { error: dbError } = await supabase
      .from('pilot_applications')
      .insert({
        name,
        company,
        role,
        email,
        phone,
        preferred_contact: preferredContact,
        business_types: businessTypes,
        website: formattedWebsite || null,
        help
      })

    if (dbError) {
      console.error('Database insert error:', dbError)
      if (dbError.code === '23505') { // Unique constraint violation
        return new Response(
          JSON.stringify({ success: false, error: 'This email has already been used for a pilot application.' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          },
        )
      }
      return new Response(
        JSON.stringify({ success: false, error: 'Unable to process your application. Please try again.' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        },
      )
    }

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
    <title>Welcome to the Hobson AI Pilot Program</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <div style="margin-bottom: 30px;">
        <p style="margin-bottom: 20px;">Hi ${firstName},</p>
        
        <p style="margin-bottom: 20px;">Thank you for applying to the Hobson AI Pilot Program! We're excited about your interest in our AI-powered document intelligence solution.</p>
        
        <p style="margin-bottom: 20px;">Our team will review your application and get back to you within 2-3 business days with next steps.</p>
        
        <p style="margin-bottom: 30px;">In the meantime, feel free to explore our website to learn more about how Hobson AI can transform your property management workflow.</p>
        
        <p style="margin-bottom: 10px;">— The Hobson AI Team</p>
        
        <p style="margin-bottom: 0;">
            <a href="https://www.hobsonschoice.ai" style="color: #007bff; text-decoration: none;">www.hobsonschoice.ai</a> | 
            <a href="mailto:info@hobsonschoice.ai" style="color: #007bff; text-decoration: none;">info@hobsonschoice.ai</a>
        </p>
    </div>
    
    <div style="border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #666; text-align: center;">
        <p>This is a confirmation email for your pilot program application.</p>
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
    const confirmationResponse = await resend.emails.send({
      from: "Hobson AI <noreply@hobsonschoice.ai>",
      to: [email],
      subject: "Welcome to the Hobson AI Pilot Program!",
      html: htmlTemplate,
    });

    console.log("Confirmation email sent successfully:", confirmationResponse);

    // For team notification, escape user inputs
    const emailContent = `
New Hobson AI Pilot Application

Name: ${escapeHtml(name)}
Company: ${escapeHtml(company)}
Role: ${escapeHtml(role)}
Email: ${escapeHtml(email)}
Phone: ${phone ? escapeHtml(phone) : 'Not provided'}
Preferred Contact: ${preferredContact ? escapeHtml(preferredContact) : 'Not specified'}
Business Types: ${businessTypes ? businessTypes.map(escapeHtml).join(', ') : 'Not specified'}
${formattedWebsite ? `Website: ${escapeHtml(formattedWebsite)}` : ''}
${help ? `\nWhat they'd like help with:\n${escapeHtml(help)}` : ''}

---
Submitted at: ${new Date().toISOString()}
    `.trim()

    // Send notification email to team
    const notificationResponse = await resend.emails.send({
      from: 'Hobson AI <noreply@hobsonschoice.ai>',
      to: ['info@hobsonschoice.ai'],
      subject: `New Pilot Application - ${escapeHtml(name)} from ${escapeHtml(company)}`,
      text: emailContent,
    });

    console.log("Notification email sent successfully:", notificationResponse);

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