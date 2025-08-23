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

    // Send welcome email
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    
    const { error: emailError } = await resend.emails.send({
      from: 'Hobson AI <info@hobsonschoice.ai>',
      to: [email],
      subject: 'Welcome to Hobson AI Updates!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center;">Welcome to Hobson AI!</h1>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Thank you for subscribing to our ${subscriptionType} updates! 
            You'll now receive the latest news about Hobson AI's features, improvements, and announcements.
          </p>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            We're excited to keep you informed about our journey to build the most reliable AI assistant for property compliance and management.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://hobsonschoice.ai" 
               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Visit Hobson AI
            </a>
          </div>
          <p style="color: #999; font-size: 14px; text-align: center;">
            If you didn't subscribe to this newsletter, you can safely ignore this email.
          </p>
        </div>
      `,
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