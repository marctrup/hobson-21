import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import React from "npm:react@18.3.1";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Img,
  Hr,
} from 'npm:@react-email/components@0.0.22';

// Inline email template
const PilotEmail = ({
  firstName,
  lastName,
  company,
}: {
  firstName: string;
  lastName: string;
  company: string;
}) => (
  React.createElement(Html, null,
    React.createElement(Head),
    React.createElement(Preview, null, "Welcome to the Hobson AI Pilot Program - Let's revolutionize your property workflow!"),
    React.createElement(Body, { style: main },
      React.createElement(Container, { style: container },
        React.createElement(Img, {
          src: "https://hobsonschoice.ai/lovable-uploads/0fa56bb9-7c7d-4f95-a81f-36a7f584ed7a.png",
          alt: "Hobson AI Logo",
          style: logo
        }),
        
        React.createElement(Heading, { style: h1 }, "Welcome to the Hobson AI Pilot Program!"),
        
        React.createElement(Text, { style: welcomeText },
          `${firstName}, Thank you for your interest in our exclusive pilot program at ${company}! We're excited that you want to be part of the future of AI-powered property intelligence.`
        ),
        
        React.createElement(Text, { style: text },
          "A member of our team will be in touch soon to chat. As places are limited, we may not be able to offer you a spot right away. If we can't accommodate you this time, don't worry — we'll make sure you're first in line for the next round."
        ),
        
        React.createElement(Container, { style: highlightBox },
          React.createElement(Text, { style: highlightText },
            React.createElement("strong", null, "What's Next?")
          ),
          React.createElement(Text, { style: text },
            "Our team will be in touch within 2 business days to:"
          ),
          React.createElement(Text, { style: listItem }, "✓ Learn more about your business"),
          React.createElement(Text, { style: listItem }, "✓ Schedule a detailed discovery call to learn about your workflows and your pain points. (if we can accommodate you in this cycle)"),
          React.createElement(Text, { style: listItem }, "✓ Set up document processing tailored to you"),
          React.createElement(Text, { style: listItem }, "✓ Share exclusive resources from the pilot program")
        ),
        
        React.createElement(Text, { style: text },
          "During the pilot, you'll have access to:"
        ),
        
        React.createElement(Container, { style: featureBox },
          React.createElement(Text, { style: featureTitle }, "🧠 Intelligent Document Analysis"),
          React.createElement(Text, { style: featureDesc }, "AI that understands your property documents"),
          
          React.createElement(Text, { style: featureTitle }, "⚡ Lightning-Fast Insights"),
          React.createElement(Text, { style: featureDesc }, "Get answers to complex questions in seconds"),
          
          React.createElement(Text, { style: featureTitle }, "👥 Dedicated Support"),
          React.createElement(Text, { style: featureDesc }, "Direct access to our team")
        ),
        
        React.createElement(Hr, { style: hr }),
        
        React.createElement(Text, { style: text },
          "Feel free to email ",
          React.createElement(Link, { href: "mailto:info@hobsonschoice.ai", style: link }, "info@hobsonschoice.ai"),
          " or explore our platform:"
        ),
        
        React.createElement(Link, {
          href: "https://hobsonschoice.ai/features",
          target: "_blank",
          style: button
        }, "Explore Features"),
        
        React.createElement(Text, { style: footer },
          "Welcome aboard!",
          React.createElement("br"),
          React.createElement("strong", null, "The Hobson AI Team"),
          React.createElement("br"),
          React.createElement(Link, {
            href: "https://hobsonschoice.ai",
            target: "_blank",
            style: { ...link, color: '#666666' }
          }, "hobsonschoice.ai")
        )
      )
    )
  )
);

// Styles
const main = {
  backgroundColor: '#f6f6f6',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  padding: '40px 20px',
  margin: '0 auto',
  maxWidth: '600px',
  borderRadius: '8px',
};

const logo = {
  height: '48px',
  width: 'auto',
  margin: '0 auto 32px auto',
  display: 'block',
};

const h1 = {
  color: '#1f2937',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 24px 0',
  textAlign: 'center' as const,
};

const welcomeText = {
  color: '#374151',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 16px 0',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

const highlightBox = {
  backgroundColor: '#f0f9ff',
  border: '2px solid #0ea5e9',
  borderRadius: '12px',
  padding: '24px',
  margin: '32px 0',
};

const highlightText = {
  color: '#0c4a6e',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
};

const listItem = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '8px 0',
  paddingLeft: '8px',
};

const featureBox = {
  backgroundColor: '#fafafa',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
};

const featureTitle = {
  color: '#1f2937',
  fontSize: '16px',
  fontWeight: '600',
  margin: '16px 0 4px 0',
};

const featureDesc = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 12px 0',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
};

const button = {
  backgroundColor: '#8b5cf6',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  margin: '24px 0',
};

const link = {
  color: '#8b5cf6',
  textDecoration: 'underline',
};

const footer = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '22px',
  marginTop: '32px',
  textAlign: 'center' as const,
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Sending test pilot email...");

    // Test data
    const testData = {
      firstName: "Marc",
      lastName: "Trup",
      company: "Test Company"
    };

    // Render the email template
    const emailHtml = await renderAsync(
      React.createElement(PilotEmail, testData)
    );

    console.log("Email template rendered successfully");

    // Send the email
    const emailResponse = await resend.emails.send({
      from: "Hobson AI <onboarding@resend.dev>",
      to: ["marctrup@gmail.com"],
      subject: "Test: Welcome to the Hobson AI Pilot Program!",
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Test email sent successfully",
        emailId: emailResponse.data?.id 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error sending test email:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);