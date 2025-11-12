import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Website content knowledge base for the AI
const WEBSITE_CONTENT = `
# Hobson's Choice AI - Complete Knowledge Base

## Site Structure (from sitemap)
Available pages on the website:
- Homepage: /
- Pricing: /pricing
- Blog: /blog
- Contact: /contact
- Data Protection: /data-protection
- Privacy Policy: /privacy-policy
- Refund Policy: /refund-policy

## Learn Page Sections
All available /learn sections (path-based navigation with sidebar):
- Introduction: /learn/welcome (default), /learn/plans-credits, /learn/faq, /learn/getting-started
- Use Cases: /learn/use-cases (video testimonials from real clients showing real-world usage)
- Features: /learn/core-features (default), /learn/advanced-features, /learn/feature-comparison, /learn/roadmap
- Integrations: /learn/available-integrations, /learn/setup-guide, /learn/api-reference, /learn/troubleshooting
- Prompt Engineering: /learn/fundamentals, /learn/advanced-prompting, /learn/debugging-prompts
- Glossary: /learn/hobson-glossary (Hobson terminology and definitions)

## About Hobson AI
Hobson's Choice AI is an AI-powered business assistant designed for property professionals. It reads documents, extracts key data, stores it securely, and answers questions using your content.

## What Can Hobson Do?
- Search leases and tenancy agreements (ASTs)
- Pull key terms and dates automatically
- Answer clause questions with citations
- Create document summaries
- Spot renewals and break clauses
- Track important dates and deadlines (85+ review dates)
- Include contacts and schedule in answers (Essential Plus plan)

## How Hobson Works - Step by Step

**1. Upload your documents**
Simply drag your property documents into Hobson. Supports PDF, DOCX, and common text files. CSV/Excel for tabular data. Text-PDFs work best; scanned PDFs work if text is readable.

**2. Hobson reads and understands**
Hobson uses AI to carefully read through each document through extraction and indexing. Processing time depends on file size and complexity.

**3. Get notified when ready**
You'll receive an email notification when document processing is complete.

**4. Ask questions, get instant answers**
Ask Hobson anything in plain English. Get accurate, cited answers instantly from your documents.

**Coming soon:** Direct connection to Dropbox, Google Drive, OneDrive, and other cloud storage platforms.

## Key Features

### Core Features
**Intelligent Document Processing**
Automatically reads and extracts key details from leases, contracts, and reports. Removes need for manual searching.

**Smart Search & Insights**
Ask questions in plain language like "When is the rent review date?" and get instant answers with source citations.

**Real-Time Analytics**
Transform unstructured text into clear summaries and dashboards. Spot trends and compare clauses.

**Collaboration Ready**
- Invite teammates and set roles
- Share saved views and queries
- Role-based access control (admin/standard/view)
- Per-workspace permissions

**Security & Compliance**
- Enterprise-grade encryption
- Bank-level security standards
- Compliance with data protection regulations
- Audit logs for uploads, edits, and queries

### Advanced Features
- **AI-Powered Summarisation:** Transform lengthy documents into actionable summaries
- **Cross-Document Insights:** Compare terms and find connections across multiple documents
- **Automated Report Generation:** Create structured reports from document data
- **Clause & Obligation Tracking:** Automatically identify and track critical clauses, dates, and obligations
- **Bulk Import:** Upload from cloud drives or folder upload
- **Data Export:** Export extracted fields and logs (CSV/JSON)
- **Saved Prompts (Playbooks):** Reusable prompt sets for common tasks
- **Usage Analytics:** View HEU usage, document counts, and query history

## Document Support
- Tenancy agreements
- Leases
- Deeds of variation
- Reversionary leases
- Property schedules
- Rent review documentation
- Contracts and reports
- Text-PDFs and DOCX (best quality)
- Scanned PDFs (if text is readable)
- CSV/Excel for tabular data

## Getting Started

### No Coding Required
Upload documents and ask questions in plain English.

### Onboarding Process
1. (Optional) Buy Starter Pack to cover initial document processing costs
2. Upload your documents
3. Hobson extracts and indexes them
4. Ask questions and invite your team
5. On Essential Plus: connect contacts and calendar

### Onboarding Time
- Small document sets: Hours
- Large portfolios: A few days (depending on volume and file quality)

## Working with Hobson

### Efficient Workflow
- Batch document uploads for efficiency
- Occasionally check document labels are correct
- Ensure proper Geo Locations and document types

### Structuring Prompts for Best Results
**Be Specific:** Include property/tenant, date range, and the field you want.
**Example:** "For 12 King St, what's the break clause and notice period? Cite the clause."
**("Cite" = show the source text)**

**The C.L.E.A.R. Method for Prompting:**
- **Concise:** Be brief but direct
- **Logical:** Break requests down step by step  
- **Explicit:** Tell Hobson exactly what you want
- **Adaptive:** If answer isn't right, refine your question
- **Reflective:** Notice which questions work best and reuse that style

### When You Hit Errors
1. Retry once
2. Check file type and size
3. If persists, contact support with file name and timestamp

### Data Cleanup
Ensure correct Geo Locations and document type labels. These are extracted by Hobson but may need updating if source documents are poorly written.

### Improving Answer Quality
- Upload original text-PDFs (not photos/scans)
- Keep documents complete
- Ask focused questions
- Save frequent prompts for reuse
- Request citations for important information

## Integrations

### Current Status
**Integrations are not yet available** - all listed integrations are coming soon.

### Planned Integrations
- **Calendar:** Access calendar events and scheduling
- **Email:** Surface insights from email threads
- **Dropbox:** Direct document access
- **Google Drive:** Seamless cloud storage integration
- **OneDrive:** Microsoft cloud integration
- **CRM Systems:** Client and contract insights within CRM
- **API Access:** Custom workflows
- **Single Sign-On (SSO):** Secure, easy access

### Why Integrations Matter
Hobson will plug directly into existing tools so insights flow automatically without switching systems.

### Benefits
- Less manual exporting and importing
- Centralised insights across platforms
- Faster, more consistent decision-making
- Reduced risk of missed details

### API Reference (Coming Soon)
Future API will include:
- Document upload and analysis endpoints
- Natural language query interface
- Webhooks for processing notifications
- Rate limits by plan tier
- Full authentication and error handling

## Frequently Asked Questions

### Account Management
**Can I change my login email?** Yes, in Account Settings.
**Can I delete my account?** Yes, request deletion in Settings. Export data first.
**Can I change workspace owner?** Admins can transfer ownership in Workspace Settings.

### Features & Functionality
**Where are Company Settings?** In the app under Settings (company, users, billing, HEUs).
**Can I change data visibility?** Yes, control who can view, upload, and query per workspace.
**Can I duplicate saved views/queries?** Yes, duplicate saved filters and prompts.
**Can I delete documents or workspaces?** Yes, admins can delete; deletions are logged.
**What are Playbooks?** Reusable prompt sets for common tasks (e.g., renewal checks).
**Can my team collaborate?** Yes, invite teammates, set roles, share saved views.
**How do I share results?** Share within workspace, export tables, or copy cited answers.
**Can I connect Google Drive/SharePoint/Dropbox?** Yes, connectors available; Enterprise can add more.
**Do you show usage analytics?** Yes, view HEU usage, document counts, query history.
**Can I upload scans or images?** Text-PDFs best; scanned PDFs work if text readable.
**Can I bulk import from cloud drives?** Yes, via connected drives or folder upload.
**Can I export my data?** Yes, export extracted fields and logs (CSV/JSON).
**Can I see history/audit logs?** Yes, we log uploads, edits, and queries.

### Support & Policies
**How can I get support?** Use in-app chat or email support@hobsonschoice.ai
**Privacy Policy and Terms?** Available at https://hobsonschoice.ai/privacy-policy
**Refund policy?** See https://hobsonschoice.ai/refund-policy
**Is Hobson compliant?** Yes, adheres to data protection and security standards.
**Where is my data stored?** Securely stored with encryption and protection.
**Can I control what data Hobson can see?** Yes, per-workspace and role-based controls.

### Technical Questions  
**What file formats are supported?** PDF, DOCX, common text files, CSV/Excel for data.
**Does Hobson work on mobile?** Yes, runs in browser and works on mobile for core tasks.
**How does Hobson remember context?** Uses RAG (retrieval-augmented generation). On Essential Plus, can add contacts and schedule for richer context.

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

## Mobile Compatibility
Hobson AI works on mobile devices:
- **Current capability**: Hobson runs in the browser and works on mobile for core tasks
- **Future plans**: We will be implementing native mobile apps and the ability to access Hobson through WhatsApp and Microsoft Teams (on our wishlist)

## Product Roadmap

### Recently Launched
- AI-powered document summarisation: Transform lengthy documents into clear, actionable summaries
- Chat interface for natural-language queries: Ask questions in plain language and get instant answers
- Clause and obligation tracking: Automatically track key dates, deadlines, and obligations

### In Progress
- Smarter follow-up questioning in chat: Enhanced conversational AI with better context understanding
- Cross-document insights and comparisons: Compare terms across multiple documents simultaneously
- Improved accuracy for complex property documents: Enhanced AI models trained on property and legal documents

### Wish List
- Integrations with document management systems (DMS) and CRMs: Seamless connection to existing tools
- Predictive insights: Proactive alerts about potential issues and opportunities
- Expanded compliance automation: Automated compliance checks and reporting
- Mobile app and messaging platform integrations: Native mobile apps, WhatsApp, and Microsoft Teams access

## Use Cases
The Use Cases section is located at [Use Cases page](/learn/use-cases) and features **video testimonials from real clients** showing how they use Hobson AI in their daily work.

**Important:** Use case videos are stored dynamically in our database and managed by administrators. The number and content of videos changes over time as we add new client testimonials. When users ask about use cases:
- Always direct them to [Use Cases page](/learn/use-cases) to see the current video testimonials
- Explain that these are real client stories showing practical applications
- Note that every organization has unique needs, and the videos showcase different ways clients use Hobson AI

Example applications property management professionals use Hobson AI for:
- Quickly finding information in large document portfolios
- Tracking important dates and deadlines
- Understanding complex lease clauses
- Answering tenant questions instantly
- Reducing manual document review time
- Ensuring compliance with lease terms

## Learn Page - Complete Navigation Guide

The Learn page uses hash-based navigation. When users ask about any Learn topics, use these EXACT hash links:

**Introduction Section:**
- Welcome/Introduction: [/learn#introduction](/learn#introduction) - Overview and getting started (default view)
- Plans and Credits: [/learn#plans-credits](/learn#plans-credits) - Subscription tiers and HEU credit system
- FAQ: [/learn#faq](/learn#faq) - Frequently asked questions
- Getting Started: [/learn#getting-started](/learn#getting-started) - Platform setup and onboarding guide

**Features Section:**
- Features Overview: [/learn#features](/learn#features) - Main features page (shows core features by default)
- Core Features: [/learn#core-features](/learn#core-features) - Essential platform capabilities
- Advanced Features: [/learn#advanced-features](/learn#advanced-features) - Premium functionality
- Feature Comparison: [/learn#feature-comparison](/learn#feature-comparison) - Compare tiers and capabilities
- Roadmap: [/learn#roadmap](/learn#roadmap) - Development timeline and upcoming features

**Integrations Section:**
- Integrations Overview: [/learn#integrations](/learn#integrations) - All integrations info (shows available integrations by default)
- Available Integrations: [/learn#available-integrations](/learn#available-integrations) - Current and planned integrations
- Setup Guide: [/learn#setup-guide](/learn#setup-guide) - Integration configuration instructions
- API Reference: [/learn#api-reference](/learn#api-reference) - Developer documentation and endpoints
- Troubleshooting: [/learn#troubleshooting](/learn#troubleshooting) - Integration debugging and solutions

**Prompt Engineering Section:**
- Prompt Engineering Overview: [/learn#prompt-engineering](/learn#prompt-engineering) - All prompting info (shows fundamentals by default)
- Fundamentals: [/learn#fundamentals](/learn#fundamentals) - Basic prompting concepts and C.L.E.A.R. method
- Advanced Prompting: [/learn#advanced-prompting](/learn#advanced-prompting) - Advanced techniques and prompt library
- Debugging Prompts: [/learn#debugging-prompts](/learn#debugging-prompts) - Troubleshooting and optimizing prompts

**Other Sections:**
- Use Cases: [/learn/use-cases](/learn/use-cases) - Real-world applications with video testimonials
- Glossary: [/learn/hobson-glossary](/learn/hobson-glossary) - Hobson terminology and definitions

**IMPORTANT for chatbot responses:**
- When users ask about ANY Learn topic, ALWAYS provide the direct path link
- Use the format: [Topic Name](/learn/section-name) in your markdown responses
- All section names use lowercase and hyphens (kebab-case)
- The path navigation keeps the sidebar visible - users stay on the same page

**Key Methods to Improve Answer Quality:**
- **Upload Original Text-PDFs**: Use text-based PDFs instead of scanned images or photos of documents for better accuracy
- **Keep Documents Complete**: Ensure documents contain all relevant information
- **Ask Focused Questions**: Be specific and concise with prompts - the more focused the question, the better Hobson can pinpoint exact information
- **Save Frequent Prompts**: Use "Playbooks" to save and reuse common questions efficiently and consistently
- **Request Citations**: Include "Cite the clause" or similar in prompts to get source text for verification

**The C.L.E.A.R. Method for Effective Prompting:**
- **Concise**: Be brief but direct
- **Logical**: Break requests down step by step
- **Explicit**: Tell Hobson exactly what you want
- **Adaptive**: If answer isn't right, refine your question
- **Reflective**: Notice which questions work best and reuse that style

**Use Cases Section** ([/learn/use-cases](/learn/use-cases)):
- Real-world applications with video testimonials and examples

**Glossary Section** ([/learn/hobson-glossary](/learn/hobson-glossary)):
- Hobson Glossary: Definitions of platform-specific terms
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
   - Pricing: [Pricing](/pricing)
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
4. When users ask about use cases, examples, or testimonials, ALWAYS provide a direct link: [Use Cases page](/learn#use-cases) and explain these are real video testimonials from clients
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
