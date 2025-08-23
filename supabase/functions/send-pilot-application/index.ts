import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from "npm:resend@4.0.0";
import React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { PilotEmail } from './_templates/pilot-email.tsx';

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
    const { name, company, role, email, phone, preferredContact, businessTypes, website, help } = await req.json()
    
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
      if (dbError.code === '23505') { // Unique constraint violation
        return new Response(
          JSON.stringify({ success: false, error: 'This email has already been used for a pilot application.' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          },
        )
      }
      throw new Error(`Database error: ${dbError.message}`)
    }

    // Parse name for React Email template
    const nameParts = name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    // Read the HTML template  
    const htmlTemplate = await fetch('https://hobsonschoice.ai/email-1.html').then(r => r.text());

    // Send confirmation email to the applicant
    const confirmationResponse = await resend.emails.send({
      from: "Hobson AI <noreply@hobsonschoice.ai>",
      to: [email],
      subject: "Welcome to the Hobson AI Pilot Program!",
      html: htmlTemplate,
    });

    console.log("Confirmation email sent successfully:", confirmationResponse);

    const emailContent = `
New Hobson AI Pilot Application

Name: ${name}
Company: ${company}
Role: ${role}
Email: ${email}
Phone: ${phone || 'Not provided'}
Preferred Contact: ${preferredContact || 'Not specified'}
Business Types: ${businessTypes ? businessTypes.join(', ') : 'Not specified'}
${formattedWebsite ? `Website: ${formattedWebsite}` : ''}
${help ? `\nWhat they'd like help with:\n${help}` : ''}

---
Submitted at: ${new Date().toISOString()}
    `.trim()

    // Send notification email to team
    const notificationResponse = await resend.emails.send({
      from: 'Hobson AI <noreply@hobsonschoice.ai>',
      to: ['info@hobsonschoice.ai'],
      subject: `New Pilot Application - ${name} from ${company}`,
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
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})