import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FeatureRequestNotification {
  title: string;
  description: string;
  category: string;
  author_name: string;
  author_id: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, description, category, author_name, author_id }: FeatureRequestNotification = await req.json();

    console.log('Feature request notification for:', title);

    // Initialize Supabase client to get user email
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user profile for email
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('user_id', author_id)
      .single();

    const userEmail = profile?.email || 'Unknown';

    // Send notification email using Resend
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    
    const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Feature Request - Hobson AI</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h1 style="color: #007bff; margin: 0 0 10px 0; font-size: 24px;">🚀 New Feature Request</h1>
        <p style="margin: 0; color: #666;">A new feature request has been submitted on Hobson AI</p>
    </div>
    
    <div style="margin-bottom: 30px;">
        <div style="background: white; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h2 style="color: #333; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
                ${title}
            </h2>
            
            <div style="margin-bottom: 15px;">
                <strong style="color: #495057;">Category:</strong> 
                <span style="background: #007bff; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; text-transform: capitalize;">
                    ${category.replace('-', ' ')}
                </span>
            </div>
            
            <div style="margin-bottom: 15px;">
                <strong style="color: #495057;">Description:</strong>
                <p style="margin: 10px 0; padding: 15px; background: #f8f9fa; border-left: 4px solid #007bff; border-radius: 4px;">
                    ${description || 'No description provided'}
                </p>
            </div>
            
            <div style="margin-bottom: 15px;">
                <strong style="color: #495057;">Submitted by:</strong> ${author_name}
            </div>
            
            <div style="margin-bottom: 15px;">
                <strong style="color: #495057;">User email:</strong> ${userEmail}
            </div>
            
            <div style="margin-bottom: 0;">
                <strong style="color: #495057;">Submitted:</strong> ${new Date().toLocaleString()}
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
            <a href="https://hobsonschoice.ai/feature-requests" 
               style="background: #007bff; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; display: inline-block; font-weight: 500;">
                View All Feature Requests
            </a>
        </div>
    </div>
    
    <div style="border-top: 1px solid #eee; padding-top: 20px; font-size: 14px; color: #666; text-align: center;">
        <p>This notification was sent from your Hobson AI feature request system.</p>
        <p style="margin: 0;">
            <a href="https://www.hobsonschoice.ai" style="color: #007bff; text-decoration: none;">www.hobsonschoice.ai</a>
        </p>
    </div>
    
</body>
</html>
    `;
    
    const { error: emailError } = await resend.emails.send({
      from: 'Hobson AI <noreply@hobsonschoice.ai>',
      to: ['info@hobsonschoice.ai'],
      subject: `🚀 New Feature Request: ${title}`,
      html: htmlTemplate,
    });

    if (emailError) {
      console.error('Error sending feature request notification:', emailError);
      throw emailError;
    }

    console.log('Feature request notification sent successfully');

    return new Response(
      JSON.stringify({ message: "Notification sent successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error) {
    console.error('Error in notify-feature-request function:', error);
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