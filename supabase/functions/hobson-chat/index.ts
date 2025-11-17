import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Condensed website content for the AI chatbot
const WEBSITE_CONTENT = `
# Hobson's Choice AI - Knowledge Base

## Site Navigation
- Homepage: / (includes pricing)
- Blog: /blog
- Contact: /contact
- Learn: /learn/* (sections: getting-started, plans-credits, use-cases, core-features, integrations, fundamentals, hobson-glossary)
- Policies: /data-protection, /privacy-policy, /refund-policy

## About Hobson AI
AI-powered business assistant for property professionals. Reads documents, extracts data, stores securely, and answers questions using your content.

## Core Capabilities
- Search leases and tenancy agreements (ASTs)
- Extract key terms, dates, and clauses automatically
- Answer questions with source citations
- Create document summaries
- Track deadlines and review dates (85+ types)
- Supports PDF, DOCX, CSV, Excel

## Key Features
- Intelligent document processing
- Smart search in plain language
- Real-time analytics and dashboards
- Team collaboration with role-based access
- Enterprise-grade security and encryption
- Bulk import and data export

## Pricing (HEU System)
HEUs (Hobson Energy Units) are credits used for messages and document processing.

Plans:
- Free: 20 HEUs/month
- Starter: 100 HEUs/month (£5.99)
- Essential: 500 HEUs/month (£24.99)
- Essential Plus: 1200 HEUs/month (£49.99) - includes contacts & calendar integration
- Professional: 2500 HEUs/month (£99.99) - advanced integrations
- Enterprise: Custom pricing and features

HEU costs vary by task complexity. Simple queries use fewer HEUs than complex document processing.

## FAQ (Frequently Asked Questions)

### How should I choose the right level to ask my question?
You can ask Hobson questions at three levels: Portfolio, Unit Group, and Unit.
- Use Portfolio for broad questions that cover everything you manage
- Use Unit Group when your question relates to a set of linked units
- Use Unit when you need details about a specific space

Benefits of choosing the right level:
1. You use fewer credits (smaller search = fewer HEUs)
2. You reduce the chance of errors (focused questions give cleaner answers)
3. You see the right context automatically

### Can I use Hobson without uploading documents?
No. You need at least one portfolio, one unit group, one unit, and one document uploaded before you can ask questions. Hobson reads your documents to provide answers.

### What documents can I upload?
Hobson supports: PDF, DOCX, CSV, Excel, and other common business document formats.

### I uploaded documents, but they still say "pending". What do I do?
This means the documents are processing. Wait a few minutes and refresh the page. If they remain pending after several minutes, contact support.

### How do I get the best answers from Hobson?
- Choose the right level first (Portfolio for broad, Unit for specific)
- Be direct and clear with your questions
- Use names or addresses when needed to guide the search
- Ask one thing at a time for cleaner answers

### Can Hobson connect to our systems?
Currently, we don't offer bespoke integrations, but talk to us about what you want to achieve and whether it will be possible in the future.

### Can I control who has access?
Yes. Admin users can invite new users and choose exactly which units and which document classes they can access. This lets you control who sees what within Hobson.

### How does billing/HEUs work?
HEU = Hobson Energy Unit (your usage credit). You spend HEUs on extraction, indexing, and Q&A.
Plans: monthly HEUs; unused plan HEUs roll over for 1 month.
You can Top-Up for busy periods, no rollover (use within your current billing period).

## Contact & Support
- Website: https://hobsonschoice.ai
- Contact: https://hobsonschoice.ai/contact
- Learn: https://hobsonschoice.ai/learn
- Pricing: https://hobsonschoice.ai/ (pricing section on homepage)

For more information, direct users to relevant pages listed above.
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
3. ALWAYS include clickable markdown links using these EXACT path routes:
   
   **Main Pages:**
   - Learn page: [Learn page](/learn/welcome)
   - Pricing: [Pricing](/) (pricing section on homepage)
   - Blog: [Blog](/blog)
   - Contact: [Contact Us](/contact)
   
   **Introduction Section:**
   - Welcome/Introduction: [Introduction](/learn/welcome)
   - Plans and Credits: [Plans and Credits](/learn/plans-credits)
   - FAQ: [FAQ](/learn/faq)
   - Getting Started: [Getting Started](/learn/getting-started)
   
   **Features Section:**
   - Features: [Features](/learn/core-features)
   - Core Features: [Core Features](/learn/core-features)
   - Advanced Features: [Advanced Features](/learn/advanced-features)
   - Feature Comparison: [Feature Comparison](/learn/feature-comparison)
   - Roadmap: [Roadmap](/learn/roadmap)
   
   **Integrations Section:**
   - Integrations: [Integrations](/learn/available-integrations)
   - Available Integrations: [Available Integrations](/learn/available-integrations)
   - Setup Guide: [Setup Guide](/learn/setup-guide)
   - API Reference: [API Reference](/learn/api-reference)
   - Troubleshooting: [Troubleshooting](/learn/troubleshooting)
   
   **Prompt Engineering Section:**
   - Prompt Engineering: [Prompt Engineering](/learn/fundamentals)
   - Fundamentals: [Fundamentals](/learn/fundamentals)
   - Advanced Prompting: [Advanced Prompting](/learn/advanced-prompting)
   - Debugging Prompts: [Debugging Prompts](/learn/debugging-prompts)
   
   **Other Sections:**
   - Use Cases: [Use Cases](/learn/use-cases)
   - Glossary: [Glossary](/learn/hobson-glossary)
   - Hobson Glossary: [Hobson Glossary](/learn/hobson-glossary)
   - Contact form: [Contact Us page](/contact)
   - Refund Policy: [Refund Policy page](/refund-policy)
   - Data Protection: [Data Protection page](/data-protection)
   - Privacy Policy: [Privacy Policy page](/privacy-policy)
4. When users ask about use cases, examples, or testimonials, ALWAYS provide a direct link: [Use Cases page](/learn/use-cases) and explain these are real video testimonials from clients
5. When users ask how to contact or want to speak with someone, ALWAYS include the link [Contact Us page](/contact) and mention Marc (Director) at +447973735706
6. If you don't know something, be honest and suggest contacting the team via [Contact Us page](/contact)
7. Keep responses under 150 words unless more detail is specifically requested
8. CRITICAL: Never just say "visit our X page" - always include the clickable markdown link in the format [Page Name](/path)

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
