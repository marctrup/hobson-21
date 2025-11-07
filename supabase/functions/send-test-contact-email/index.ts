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
} from 'npm:@react-email/components@0.0.22';

// Inline contact email template
const ContactEmail = ({
  name,
  message,
}: {
  name: string;
  message: string;
}) => (
  React.createElement(Html, null,
    React.createElement(Head),
    React.createElement(Preview, null, "Thank you for contacting Hobson AI - We'll be in touch soon!"),
    React.createElement(Body, { style: main },
      React.createElement(Container, { style: container },
        React.createElement(Img, {
          src: "https://hobsonschoice.ai/lovable-uploads/hobson-new-logo.png",
          alt: "Hobson AI Logo",
          style: logo
        }),
        
        React.createElement(Heading, { style: h1 }, `Thank you for reaching out, ${name}!`),
        
        React.createElement(Text, { style: text },
          "We've received your message and our team will review it carefully. We typically respond within 24 hours during business days."
        ),
        
        React.createElement(Container, { style: messageContainer },
          React.createElement(Text, { style: messageLabel }, "Your message:"),
          React.createElement(Text, { style: messageText }, `"${message}"`)
        ),
        
        React.createElement(Text, { style: text },
          "In the meantime, feel free to explore our AI-powered property intelligence platform and see how we're revolutionizing document analysis for the property industry."
        ),
        
        React.createElement(Link, {
          href: "https://hobsonschoice.ai/features",
          target: "_blank",
          style: button
        }, "Explore Our Features"),
        
        React.createElement(Text, { style: text },
          "Have questions? Simply reply to this email or visit our website."
        ),
        
        React.createElement(Text, { style: footer },
          "Best regards,",
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
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 24px 0',
  textAlign: 'center' as const,
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

const messageContainer = {
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const messageLabel = {
  color: '#6b7280',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 8px 0',
};

const messageText = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0',
  fontStyle: 'italic',
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
    console.log("Sending test contact email...");

    // Test data
    const testData = {
      name: "Marc",
      message: "This is a test message to verify the contact email template is working correctly."
    };

    // Render the email template
    const emailHtml = await renderAsync(
      React.createElement(ContactEmail, testData)
    );

    console.log("Contact email template rendered successfully");

    // Send the email
    const emailResponse = await resend.emails.send({
      from: "Hobson AI <noreply@hobsonschoice.ai>",
      to: ["marctrup@gmail.com"],
      subject: "Test: Thank you for contacting Hobson AI",
      html: emailHtml,
    });

    console.log("Test contact email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Test contact email sent successfully",
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
    console.error("Error sending test contact email:", error);
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