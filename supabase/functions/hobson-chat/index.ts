import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Website content knowledge base for the AI
const WEBSITE_CONTENT = `
# Hobson's Choice AI - Website Content Knowledge Base

## About Hobson AI
Hobson's Choice AI is an AI-powered assistant that reads and understands property documents to deliver accurate, cited answers instantly.

## How Hobson Works - Step by Step

**1. Upload your documents**
Simply drag your property documents into Hobson. This is the first step to unlocking intelligent insights.

**2. Hobson reads and understands**
Hobson uses AI to carefully read through each document. This process takes some time depending on the size and complexity of your files. The information is securely stored on our servers so you can access it anytime.

**3. Get notified when ready**
Once Hobson has finished reading and understanding your documents, you'll receive an email notification letting you know everything is ready.

**4. Ask questions, get instant answers**
With your documents processed, you can ask Hobson anything. AI powers the entire process—from reading and extracting key information to delivering accurate, cited answers instantly.

**Coming soon:** Hobson will connect directly to Dropbox, Google Drive, and other cloud storage platforms, making it even easier to access your documents.

## Key Features
- AI Document Analysis: Automatically extract key information from property documents
- Natural Language Query: Ask questions about your properties in plain English
- Property Intelligence: Get instant insights from leases, tenancy agreements, and more
- Automated Insights: Identify important dates, clauses, and obligations automatically
- Enterprise Security: Bank-level encryption and data protection
- 24/7 Availability: Access your property intelligence anytime, anywhere
- Email Notifications: Get notified when your documents are ready

## Supported Documents
Hobson AI can analyze:
- Tenancy agreements
- Leases
- Deeds of variation (12× in portfolio)
- Reversionary leases (3× in portfolio)
- Property schedules
- Rent review documentation
- Over 85 different review dates tracked automatically

## HEUs (Hobson Energy Units) - Complete Guide

### What are HEUs?
HEU stands for "Hobson Energy Unit" - it's the currency/credit system used to buy effort in Hobson AI. You need HEUs to interact with Hobson, and they are deducted when you send messages or process documents. The cost depends on the complexity of the work being done.

### HEU Pricing by Plan
- **Free Plan**: 18 HEUs per month + Unlimited members + Unlimited documents
- **Essential Plan**: 275 HEUs per month + Everything in Free + Priority Support
- **Essential Plus**: 700 HEUs per month + Everything in Essential
- **Enterprise**: 2000 HEUs per month + Everything in Essential Plus + Support person + Business Knowledgebase + Bespoke integrations

### Starter Pack
- One-time bundle with 1000 HEUs to help load documents into the platform
- Covers document upload, extraction, and indexing
- Unspent HEUs roll over for two months
- Designed to handle the heavy initial processing costs

### Top-up Option
- £15 one-off purchase (no subscription required)
- Adds 150 HEUs to your balance instantly
- Works with any paid plan
- No rollover - unused HEUs expire at end of current billing period

### HEU Cost Examples
Understanding how much different tasks cost:

**Document Processing:**
- Simple document (certificate): 0.5 HEUs - Scans and summarises
- Medium document (deed): 1.4 HEUs - Reviews and extracts key info
- Complex document (lease): 16.9 HEUs - Full detailed review and breakdown

**Queries:**
- Simple query ("What is the rent?"): 0.05 HEUs - Finds and returns one fact
- Medium query ("List all rents"): 0.26 HEUs - Searches and compiles several data points
- Complex query ("Build a tenancy report"): 0.54 HEUs - Gathers multiple details and formats full report

**Key Point**: Many messages cost less than 1 HEU. The system charges based on actual complexity, so you only pay for what you use.

### Credit Rollovers
- Unused HEUs automatically roll over for active paid subscriptions
- **Monthly plans**: Rollover accumulates up to the monthly credit limit
- **Annual plans**: Rollover accumulates up to 12× monthly limit (annual limit)
- **Monthly plan expiration**: Rollover credits valid for 1 month after being added
- **Annual plan expiration**: Rollover credits valid for 12 months after being added
- **Upon cancellation**: All unused and rollover HEUs expire at end of billing period
- **Daily HEUs do NOT roll over** (applies to free tier)

### Viewing HEU Usage
- The HEU bar shows visual representation of usage:
  - Grey part: HEUs already used this billing period
  - Blue part: Remaining HEUs available
- Click the three dots (⋯) beneath any message in chat to see the exact HEU cost of that message

## Pricing & Plans
Hobson is subscription-based with a free plan and several paid options. When you upgrade, you get additional support and more HEUs.

## Security & Data Protection
- Enterprise-grade security with encryption
- Secure data storage
- Compliance with data protection regulations
- All property documents handled with highest security standards

## Refund Policy
Hobson AI is committed to customer satisfaction and fair treatment.

### Eligibility for Refunds
You may be eligible for a refund if you experience:
- Technical or Service Issues: A confirmed fault or persistent error that prevents normal use
- Duplicate Payments or Billing Errors: Accidental double billing or incorrect charges
- Early Cancellation: Cancel shortly after renewal without material use during new billing period
- Unsatisfactory Experience: Product doesn't meet reasonable expectations and we can't resolve it

Refunds are not normally granted for:
- Change of mind after use
- Minor dissatisfaction without an identifiable service issue
- Misuse or violation of terms of service

### How to Request a Refund
Contact support@hobsonschoice.ai with:
- Your full name and account email
- Date and amount of payment
- Brief explanation of the issue

Response time: Within 2 business days
Resolution time: Most refund requests within 5-10 business days

### Service Credits Alternative
We may offer service credits instead of cash refunds when:
- The issue is minor
- You prefer to continue using Hobson AI
- Credits never expire and can be used toward future subscriptions or document processing

### Contact for Refunds
Email: support@hobsonschoice.ai
Address: Hobson AI Limited, 5 Technology Park, Collindeep Lane, NW9 6BX

Full refund policy available at: https://hobsonschoice.ai/refund-policy

## Contact Information
- Website: https://hobsonschoice.ai
- Contact page: https://hobsonschoice.ai/contact
- Learn more: https://hobsonschoice.ai/learn
- Pricing details: https://hobsonschoice.ai/pricing

### How to Get in Touch
For those interested in learning more about Hobson AI:
- Fill out our contact form: [Contact Us](/contact)
- Speak directly with Marc, our Director: +447973735706
- We're happy to answer any questions and discuss how Hobson AI can help your property management needs

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
   - Refund Policy: [Refund Policy](/refund-policy)
   - Data Protection: [Data Protection](/data-protection)
4. When users ask how to contact or want to speak with someone, always mention:
   - The contact form at [Contact Us](/contact)
   - Marc (our Director) is available at +447973735706 for interested prospects
5. If you don't know something, be honest and suggest contacting the team
6. Keep responses under 150 words unless more detail is specifically requested

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
