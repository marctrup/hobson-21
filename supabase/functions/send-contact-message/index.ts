import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from "npm:resend@4.0.0";
import React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { ContactEmail } from './_templates/contact-email.tsx';

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
    const { name, email, phone, reason } = await req.json()
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)
    
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

    // Insert into encrypted contact_messages table using secure function
    console.log('Attempting to insert encrypted contact message for:', email)
    const { data: contactId, error: dbError } = await supabase
      .rpc('insert_encrypted_contact_message', {
        p_name: name,
        p_email: email,
        p_message: reason,
        p_phone: phone || null
      })

    let isDuplicate = false;
    if (dbError) {
      console.error('Database insert error:', dbError)
      // Handle encryption key not configured error gracefully
      if (dbError.message && dbError.message.includes('Encryption key not configured')) {
        console.log('Encryption not configured - falling back to unencrypted storage')
        // Fallback to original table for now
        const { error: fallbackError } = await supabase
          .from('contact_messages')
          .insert({
            name,
            email,
            phone: phone || null,
            message: reason
          })
        
        if (fallbackError && fallbackError.code === '23505') {
          isDuplicate = true;
        } else if (fallbackError) {
          throw new Error(`Database error: ${fallbackError.message}`)
        }
      } else {
        throw new Error(`Database error: ${dbError.message}`)
      }
    } else {
      console.log('New encrypted contact message saved to database with ID:', contactId)
    }

    // Create HTML template with unsubscribe link
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
        <p style="margin-bottom: 20px;">Hi ${name},</p>
        
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

    const emailContent = `
New Contact Message from Hobson AI Website

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Reason for Enquiry: ${reason}${emailExistsMessage}

---
Submitted at: ${new Date().toISOString()}
    `.trim()

    // Send notification email to team
    const notificationResponse = await resend.emails.send({
      from: 'Hobson AI <noreply@hobsonschoice.ai>',
      to: ['info@hobsonschoice.ai'],
      subject: `Contact Message - ${name}`,
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
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})