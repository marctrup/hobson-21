import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Website content knowledge base for the AI
const WEBSITE_CONTENT = `
# Hobson's Choice AI - Website Content Knowledge Base

## About Hobson AI
Hobson's Choice AI is an AI-powered document intelligence platform for property management professionals. 
We transform property documents with intelligent analysis, automated insights, and instant answers to complex property questions.

## Key Features
- AI Document Analysis: Automatically extract key information from property documents
- Natural Language Query: Ask questions about your properties in plain English
- Property Intelligence: Get instant insights from leases, tenancy agreements, and more
- Automated Insights: Identify important dates, clauses, and obligations automatically
- Enterprise Security: Bank-level encryption and data protection
- 24/7 Availability: Access your property intelligence anytime, anywhere

## Supported Documents
Hobson AI can analyze:
- Tenancy agreements
- Leases
- Deeds of variation (12× in portfolio)
- Reversionary leases (3× in portfolio)
- Property schedules
- Rent review documentation
- Over 85 different review dates tracked automatically

## Pricing
- Free package available
- Monthly payments based on usage
- Contact us for detailed pricing: https://hobsonschoice.ai/contact

## Security & Data Protection
- Enterprise-grade security with encryption
- Secure data storage
- Compliance with data protection regulations
- All property documents handled with highest security standards

## Contact Information
- Website: https://hobsonschoice.ai
- Contact page: https://hobsonschoice.ai/contact
- Learn more: https://hobsonschoice.ai/learn
- Blog: https://hobsonschoice.ai/blog

## Use Cases
Property management professionals use Hobson AI to:
- Quickly find information in large document portfolios
- Track important dates and deadlines
- Understand complex lease clauses
- Answer tenant questions instantly
- Reduce manual document review time
- Ensure compliance with lease terms
`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      throw new Error("Invalid request: messages array required");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("AI service not configured");
    }

    const systemPrompt = `You are a helpful AI assistant for Hobson's Choice AI website. Your role is to help visitors understand what Hobson AI does, its features, pricing, and use cases.

IMPORTANT GUIDELINES:
1. Be friendly, concise, and helpful
2. Always reference the knowledge base below when answering questions
3. When relevant, include links to specific pages like:
   - Learn more: [Learn Page](/learn)
   - Contact us: [Contact](/contact)
   - Blog: [Blog](/blog)
4. If you don't know something, be honest and suggest contacting the team
5. Keep responses under 150 words unless more detail is specifically requested

KNOWLEDGE BASE:
${WEBSITE_CONTENT}

Remember: You're here to help visitors understand Hobson AI better, not to be pushy. Answer their questions clearly and point them to relevant resources.`;

    console.log("Processing chat request with", messages.length, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: "We're experiencing high traffic. Please try again in a moment." 
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ 
            error: "Service temporarily unavailable. Please try again later." 
          }),
          {
            status: 503,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      throw new Error("AI service error");
    }

    const data = await response.json();
    console.log("Successfully generated response");
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in hobson-chat function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "An unexpected error occurred" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
