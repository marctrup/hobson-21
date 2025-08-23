import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SubscribeRequest {
  email: string;
  subscriptionType?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, subscriptionType = 'announcements' }: SubscribeRequest = await req.json();

    console.log('Newsletter subscription request for:', email);

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

    // Check if email already exists
    const { data: existingSubscription } = await supabase
      .from('newsletter_subscriptions')
      .select('*')
      .eq('email', email)
      .eq('subscription_type', subscriptionType)
      .single();

    if (existingSubscription) {
      // Reactivate if previously unsubscribed
      if (!existingSubscription.is_active) {
        await supabase
          .from('newsletter_subscriptions')
          .update({ is_active: true, updated_at: new Date().toISOString() })
          .eq('id', existingSubscription.id);
      }
      
      return new Response(
        JSON.stringify({ message: "Already subscribed!", alreadySubscribed: true }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Insert new subscription
    const { error: insertError } = await supabase
      .from('newsletter_subscriptions')
      .insert({
        email,
        subscription_type: subscriptionType,
        is_active: true
      });

    if (insertError) {
      console.error('Error inserting subscription:', insertError);
      throw insertError;
    }

    // Send welcome email using HTML template
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    
    // Read the HTML template
    const htmlTemplate = await fetch('https://hobsonschoice.ai/email-1.html').then(r => r.text());
    
    const { error: emailError } = await resend.emails.send({
      from: 'Hobson AI <info@hobsonschoice.ai>',
      to: [email],
      subject: 'Welcome to Hobson AI Updates!',
      html: htmlTemplate,
    });

    if (emailError) {
      console.error('Error sending welcome email:', emailError);
      // Don't fail the subscription if email fails
    }

    console.log('Newsletter subscription successful for:', email);

    return new Response(
      JSON.stringify({ message: "Successfully subscribed to updates!" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error) {
    console.error('Error in newsletter-subscribe function:', error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);