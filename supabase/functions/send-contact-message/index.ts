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