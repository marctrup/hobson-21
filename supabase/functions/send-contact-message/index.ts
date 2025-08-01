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
    const { name, email, phone, reason } = await req.json()
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    console.log('Checking for existing email:', email)
    
    // Check if email already exists in pilot_applications
    const { data: existingApplication, error: checkError } = await supabase
      .from('pilot_applications')
      .select('email')
      .eq('email', email)
      .maybeSingle()

    console.log('Existing application check result:', { existingApplication, checkError })

    let emailExistsMessage = ''
    let shouldInsert = true

    if (existingApplication) {
      emailExistsMessage = '\n\nNote: This email has previously submitted a pilot application.'
      shouldInsert = false
      console.log('Email already exists in database, skipping insert but sending notification')
    } else {
      console.log('Email not found in database, will insert new record')
    }

    // Only save to database if email doesn't already exist
    if (shouldInsert) {
      console.log('Attempting to insert new record for:', email)
      const { error: dbError } = await supabase
        .from('pilot_applications')
        .insert({
          name,
          company: 'Contact Form Submission',
          role: 'Contact Inquiry',  
          email,
          phone: phone || null,
          preferred_contact: 'email',
          help: reason
        })

      if (dbError) {
        console.error('Database insert error:', dbError)
        // If it's a unique constraint violation, handle it gracefully
        if (dbError.code === '23505') {
          console.log('Unique constraint violation detected, treating as duplicate')
          emailExistsMessage = '\n\nNote: This email has previously submitted a pilot application.'
          shouldInsert = false
        } else {
          throw new Error(`Database error: ${dbError.message}`)
        }
      } else {
        console.log('New contact form submission saved to database')
      }
    } else {
      console.log('Skipping database insert due to existing email')
    }

    const emailContent = `
New Contact Message from Hobson AI Website

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Reason for Enquiry: ${reason}${emailExistsMessage}

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
        subject: `Contact Message - ${name}`,
        text: emailContent,
      }),
    })

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text()
      throw new Error(`Failed to send email: ${errorText}`)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Message sent successfully',
        emailExists: !!existingApplication,
        isDuplicate: !!existingApplication && !shouldInsert
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