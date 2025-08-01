import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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

    // Send email using Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY not found')
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Hobson AI <noreply@hobsonschoice.ai>',
        to: ['info@hobsonschoice.ai'],
        subject: `New Pilot Application - ${name} from ${company}`,
        text: emailContent,
      }),
    })

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text()
      throw new Error(`Failed to send email: ${errorText}`)
    }

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