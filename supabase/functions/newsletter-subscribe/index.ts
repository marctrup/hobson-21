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

    // Get the latest announcement
    const { data: latestAnnouncement } = await supabase
      .from('blog_posts')
      .select('slug')
      .eq('link_location', 'announcements')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    // Get the current domain from the request origin or default to production
    const origin = req.headers.get('origin') || 'https://hobsonschoice.ai';
    
    const announcementUrl = latestAnnouncement 
      ? `${origin}/announcement/${latestAnnouncement.slug}`
      : `${origin}/announcements`;
    
    console.log('Generated announcement URL:', announcementUrl);
    console.log('Latest announcement slug:', latestAnnouncement?.slug);

    // Send welcome email using HTML template
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    
    const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Hobson AI Updates</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <div style="margin-bottom: 30px;">
        <p style="margin-bottom: 20px;">Hi there,</p>
        
        <p style="margin-bottom: 20px;">Thanks for subscribing to Hobson AI Updates! You'll now be the first to hear about our latest announcement on AI-powered document intelligence.</p>
        
        <p style="margin-bottom: 20px;">
            👉 <a href="${announcementUrl}" style="color: #007bff; text-decoration: none; font-weight: 500;">Please see our latest announcement</a>
        </p>
        
        <p style="margin-bottom: 30px;">We're excited to share what's coming next.</p>
        
        <p style="margin-bottom: 10px;">— The Hobson AI Team</p>
        
        <p style="margin-bottom: 0;">
            <a href="https://www.hobsonschoice.ai" style="color: #007bff; text-decoration: none;">www.hobsonschoice.ai</a> | 
            <a href="mailto:info@hobsonschoice.ai" style="color: #007bff; text-decoration: none;">info@hobsonschoice.ai</a>
        </p>
    </div>
    
    <div style="border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #666; text-align: center;">
        <p>If you didn't subscribe to this newsletter, you can safely ignore this email.</p>
    </div>
    
</body>
</html>
    `;
    
    const { error: emailError } = await resend.emails.send({
      from: 'Hobson AI <info@hobsonschoice.ai>',
      to: [email],
      subject: 'Welcome to Hobson AI Updates 🚀',
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