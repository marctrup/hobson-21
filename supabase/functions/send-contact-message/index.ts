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

    // Insert into contact_messages table
    console.log('Attempting to insert contact message for:', email)
    const { error: dbError } = await supabase
      .from('contact_messages')
      .insert({
        name,
        email,
        phone: phone || null,
        message: reason
      })

    let isDuplicate = false;
    if (dbError) {
      console.error('Database insert error:', dbError)
      // If it's a unique constraint violation, handle it gracefully
      if (dbError.code === '23505') {
        console.log('Unique constraint violation detected - duplicate contact message')
        isDuplicate = true;
      } else {
        throw new Error(`Database error: ${dbError.message}`)
      }
    } else {
      console.log('New contact message saved to database')
    }

    // Read the HTML template
    const htmlTemplate = await fetch('https://hobsonschoice.ai/email-1.html').then(r => r.text());

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