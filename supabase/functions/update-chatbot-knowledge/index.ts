import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// CRITICAL: Since the FAQ page is a React SPA, HTML scraping won't work.
// Instead, we'll maintain the FAQ content directly in this function.
// This content MUST be manually updated when FAQ changes are made to the Learn page.

const getFaqContent = () => {
  // This is a direct copy of the FAQ structure from Learn.tsx
  // Currently has 50 questions - Update this manually when FAQs change
  return `
## Frequently Asked Questions (50 Questions)

### How Hobson Works (Questions 1-20)

**1. How are units, groups, portfolios, and documents arranged in Hobson?**

**How Spaces and Groups Are Defined:**
• **Unit:** A single physical space, such as a flat, office, or piece of land.
• **Unit Group:** A set of units linked either by a shared location (for example, flats in one block or offices on a single floor) or by a shared document (for example, one lease covering multiple units in one or more locations).
• **Portfolio:** A collection of units grouped by ownership, management, or another organisational structure.

**How Document Types Work:**
• **Right-to-Occupy (RTO) Documents:** Documents that give an entity the right to use or occupy a space, such as a lease or a Land Registry Title.
• **Accompanying and Modification Documents (AMDs):** Documents that modify, extend, or support an RTO. This includes formal amendments (deeds of variation, rent memorandums) and supporting documents (notices, identity documents, funding documents).
• **Accompanying Documents (ACDs):** Documents linked to a specific unit or unit group, such as compliance certificates.

---

**2. Which file types are supported?**
Hobson currently supports PDFs. Common text files, as well as CSV/Excel for tabular data, will be added in due course.

---

**3. What types of documents can Hobson read?**
Hobson has been trained to understand a wide range of documents used across residential and commercial real estate. These fall into three main categories:
• Right-to-Occupy (RTO) Documents: Residential leases, commercial leases, licences to occupy, title deeds
• Accompanying and Modification Documents (AMDs): Deeds of variation, rent memorandums, notices, works agreements, deposit deeds, identity or supporting documents
• Accompanying Documents (ACDs): Compliance certificates, works reports, funding agreements

Hobson continues to grow. We add new document types regularly.

---

**4. How to get documents to Hobson?**
**For Today:** Hobson allows for batch uploads via our drag-and-drop upload feature.
**In the Future:** Once we are happy that Hobson can access drives such as Dropbox and Google Drive, we will provide that feature.

---

**5. How long does Hobson take to read a document?**
The time it takes to read depends on the type and size of the document:
• High-complexity legal documents (e.g., leases): around 8-9 minutes
• Medium-complexity legal documents (e.g., Deeds): around 2-3 minutes
• Low-complexity documents (e.g., notices): around 30 seconds to 1 minute

Once processing is complete, your documents become fully searchable and ready to use.

---

**6. What happens technically when a document is uploaded?**
When you upload a lease, deed, or notice, three things happen automatically:
1. The system reads the whole document - The file is opened and its text is pulled out so the AI can understand it.
2. The AI converts the document into structured data - It identifies critical information like rent, break dates, parties, addresses, and obligations.
3. The system indexes the document for search - The entire document is made searchable by breaking it into smaller segments and creating an index.

---

**7. Why is extraction more expensive than retrieval?**
**Extraction** (reading a document the first time) requires the AI to process the entire document, identify key legal clauses, extract structured data, and build searchable indexes. This is like reading and understanding a book for the first time—it takes effort.

**Retrieval** (answering questions from already-processed documents) simply searches the indexed data, pulls the relevant passage, and formats the answer. This is like finding a specific chapter in a book you've already read—it's much faster.

---

**8. How does Hobson identify the newest information?**
Hobson tracks document dates and amendment history to ensure you always get the most current information. When multiple documents reference the same topic, Hobson:
1. Checks the effective date of each document
2. Prioritizes the latest amendment or variation
3. Shows you which document the answer came from

---

**9. Does Hobson work on mobile?**
Yes. Hobson is accessible from any browser on mobile devices, though some features work best on larger screens.

---

**10. Who owns the data and outputs?**
You do. All documents you upload, the data extracted from them, and the outputs Hobson generates belong to you. Hobson does not claim ownership of your content.

---

**11. How does Hobson use OpenAI?**
Hobson uses OpenAI's API to read and extract information from your documents, answer questions based on the content, and generate summaries and reports. We do not use OpenAI for storage. Your documents are stored on secure UK/EU-based servers (OVH Cloud).

---

**12. Does OpenAI store my documents?**
No. OpenAI does not retain your data. According to OpenAI's data usage policies for API customers, data sent via the API is not used to train their models and is not stored beyond the time needed to process your request.

---

**13. Does OpenAI use my data to train their models?**
No. As an API customer, your data is not used to train OpenAI's models. This is guaranteed under OpenAI's API Terms of Service.

---

**14. What data does Hobson send to OpenAI?**
Hobson sends only the minimum information required for the task. Examples include a small text segment from a document, a part of a lease needed for a query, or keywords from your question.

We never send complete documents unnecessarily, data unrelated to your query, or personal metadata unless essential for the answer.

Example: If you ask "What is the rent?", we send only the relevant clause from the lease, not the entire document.

---

**15. Where are my documents actually stored?**
Your documents are stored on OVH Cloud, a secure UK/EU-based cloud storage provider. OVH is designed to protect sensitive data and complies with European data protection standards. Hobson does not store your documents on OpenAI's servers.

---

**16. Why does Hobson need to send anything to OpenAI at all?**
Hobson uses OpenAI's language models to understand complex legal language, extract structured information from documents, and answer questions accurately in plain English. OpenAI provides the AI capabilities, but your documents remain stored securely on OVH Cloud.

---

**17. Who can see my documents?**
Only you and the users you invite to your workspace can see your documents. Hobson's team cannot access your documents unless you explicitly grant permission for support purposes.

---

**18. How does Hobson protect my data when using OpenAI?**
Hobson minimizes data exposure by sending only the minimum required text to OpenAI, using encrypted connections (HTTPS/TLS), and ensuring OpenAI does not retain your data. Your full documents are never stored on OpenAI's servers—they remain on OVH Cloud.

---

**19. Does OpenAI know who I am or hold details of my property holdings?**
No. Hobson does not send personal identifiers or metadata about you to OpenAI. The AI sees only the text snippets needed to answer your query, with no context about who you are or what properties you own.

---

**20. What happens when I ask a question?**
When you ask Hobson a question:
1. Hobson searches your indexed documents to find relevant passages
2. The relevant text is sent to OpenAI for analysis
3. OpenAI processes the text and generates an answer
4. Hobson returns the answer to you, along with citations showing which document it came from

---

### Getting the Best Out of Hobson (Questions 21-28)

**21. Can Hobson be trained on my company's information?**
Yes. For enterprise clients, Hobson can be trained on your organisation's own documents, processes, and team details. We create a private knowledge base built from your company information, which Hobson uses to give personalised and context-aware answers. None of your company information is shared outside your private environment.

---

**22. Can I end a tenancy agreement?**
Yes. Enter "End Tenancy agreement" at the unit level.

---

**23. Can I add a unit manually without uploading a document?**
Yes. Just ask Hobson "Add Unit". Hobson will then prompt you to enter the full address, and the unit will be created without needing any documents.

---

**24. Which level should I use when asking a question?**
You can ask Hobson questions at three levels—Portfolio, Unit Group, and Unit. The higher the level, the broader the search. The lower the level, the more focused the answer.

**To get the best results:**
• Use Portfolio for broad questions that cover everything you manage
• Use Unit Group when your question relates to a set of linked units
• Use Unit when you need details about a specific space

Asking your question at the right level matters for three reasons:
1. You use fewer credits - Dropping down a level keeps the search small and saves credits
2. You reduce the chance of errors - Focused questions give Hobson less to sift through
3. You see the right context automatically - Hobson shows you the address, tenant names, and other details

---

**25. What should I do if I get a poor answer?**
If Hobson gives you an answer like "No information is available" but you know the information exists:
1. Go back to the level you were on - Return to the Portfolio, Unit Group, or Unit level and ask the question again
2. Check that the documents are actually uploaded - Open the Documents area in Admin and make sure the files you expect are there

Most issues come from asking at too high a level or missing documents, and both are easy to correct.

---

**26. How should I structure my prompts for the best results?**
To get the best answers from Hobson:
• Choose the right level first - Start at the Portfolio, Unit Group, or Unit level depending on how specific your question is
• Be direct and clear - Ask for exactly what you need. Short, simple questions work better
• Use names or addresses when needed - Adding the unit address or tenant name helps guide the search
• Ask one thing at a time - If you have several questions, ask them separately

---

**27. Can Hobson connect to our systems?**
Currently, we don't offer bespoke integrations, but please talk to us so we can understand what you want to achieve and whether this will be possible at some point.

---

**28. Can I control who has access?**
Yes. Admin users can invite new users and choose exactly which units and which document classes they can access. This lets you control who sees what within Hobson.

---

### Hobson Credits (Questions 29-39)

**29. What is a HEU?**
A HEU is the unit of energy measurement for using Hobson's AI features. Each message or action costs a certain number of HEUs based on its complexity.

---

**30. How much do different tasks cost in HEUs?**
Hobson uses a usage-based credit system called HEU (Hobson Energy Unit). Most messages cost less than 1 HEU, while more detailed tasks cost more.

**Typical HEU costs:**
• Reading a simple document (e.g. certificate): 0.5 HEU
• Reading a medium document (e.g. deed): 1.4 HEU
• Reading a complex document (e.g. lease): 16.9 HEU
• Asking a simple question ("What is the rent?"): 0.05 HEU
• Asking a medium question ("List all rents"): 0.26 HEU
• Asking a complex question ("Build a tenancy report"): 0.54 HEU

You can check the HEU cost of any message by opening the menu (three dots) under the message in the chat.

---

**31. How can I upgrade my subscription?**
You can upgrade your subscription through your workspace settings or by contacting our support team.

---

**32. How can I downgrade my subscription?**
Subscription downgrades can be managed through your account settings or by reaching out to support.

---

**33. How can I cancel my subscription?**
You can cancel your subscription at any time through your account settings. Your access will continue until the end of the current billing period.

---

**34. How can I change my billing information?**
Billing information can be updated in your account settings under the billing section.

---

**35. How do I download my invoices?**
Invoices are available for download in your account settings under billing history.

---

**36. How do I get more credits?**
You can get more HEUs by upgrading your plan or purchasing Top-ups.

---

**37. When does my credit limit reset?**
Your credit limit resets at the beginning of each billing cycle based on your subscription plan.

---

**38. How do I see the remaining credits in a workspace?**
Click on your workspace name on the dashboard to view your remaining credits and usage statistics.

---

**39. Can I get free credits?**
Free credits are included with the free plan. Additional free credits may be available through promotional offers or referral programs.

---

### Hobson Technology (Questions 40-50)

**40. What technology platforms does Hobson use?**
Hobson runs on trusted, industry-standard platforms:
• **OVH Cloud** - Stores your uploaded files and documents (secure UK/EU-based cloud storage)
• **Vercel** - Runs the Hobson web app (fast, stable interface)
• **MongoDB** - Handles structured data such as units, portfolios, users, and document metadata
• **Neo4j** - Used for knowledge-graph structures to understand relationships
• **Pinecone** - Stores vector embeddings for quick document search
• **Google Workspace (G Suite)** - Supports email delivery, team communication, and secure internal admin

---

**41. How does the system decide which tools to run for a query?**
It detects keywords in the user's question. Each keyword group maps to a specific tool. If the query contains more than one topic (for example, rent + break), all matching tools must run in the same turn.

---

**42. What happens if a tool should have been run but wasn't?**
This is a validation failure called EV-01 (missing fresh tool call). The model must produce the fallback message and cannot reuse earlier results.

---

**43. What does the system do if a tool runs but the data is from a previous turn?**
This triggers EV-02 (missing provenance). Each Answer line must link to a run_id from the current turn. If not, the system must discard the draft and return the fallback.

---

**44. How does the system filter tool results before generating the Answer?**
Filtering follows a strict order: Headlease-only rule, excluded-type removal, removal of superseded and reversionary records, ranking and time window filtering. Only valid records remaining after these steps can appear in the Answer block.

---

**45. How does the model choose between a table, a list, or structured sections?**
The choice depends on the number of records and question type:
• 3+ records use a markdown table
• 1–2 records use a short list
• Rental history uses structured headings (rent, premium, review)
• Unit or unit-group history uses grouped sections
• Portfolio summaries use a table with totals

---

**46. How does grouping work for units, unit groups, and portfolios?**
Grouping follows query scope:
• Unit queries group by tenancy, including historical and current
• Unit group/building queries group by unit group → unit → tenancy
• Portfolio queries group by property → unit

Within each group, sort by effective date (ascending). Groups get their own headers for clarity.

---

**47. How are Follow-Up questions generated?**
The system must output one Follow-Up. It chooses a template based on intent: Further detail, Comparative, Temporal, Document-related, Actionable, or Missing context.

---

**48. How does the system handle missing or incomplete data?**
It must not guess. Missing values are shown as "—" with a short note such as "evidence incomplete". If all context is missing, all three blocks must show "No information available". Debug or internal identifiers must never appear.

---

**49. How does the system ensure plain-language compliance?**
The Answer must avoid technical terms like "rows", "objects", "arrays", or references to JSON structure. If such terms appear, this triggers SV-Px (plain-language breach) and the response must be regenerated.

---

**50. What must the system verify before returning the final response?**
Before returning anything, the system checks:
• All three blocks are present and in order
• Only current-turn tool data is used
• Headlease-only and tenant-specific rules are followed
• Excluded/superseded/reversionary data is removed
• No debug information appears
• Formatting follows Section 7
• Follow-Up is valid and unique

If any rule fails, the system outputs the fallback message instead.
`.trim();
};

// This function updates the chatbot knowledge base - requires admin authentication
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate the request - require admin role
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Create a client with the user's auth token to verify identity
    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await authClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.claims.sub;

    // Check admin role
    const { data: hasAdminRole } = await authClient.rpc('has_role', {
      _user_id: userId,
      _role: 'admin'
    });

    if (!hasAdminRole) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use service role client for the actual data operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting knowledge base update...');

    // Fetch FAQ content from database
    const { data: faqData, error: faqError } = await supabase
      .from('faq_items')
      .select('*')
      .eq('is_active', true)
      .order('category')
      .order('sort_order');

    if (faqError) {
      console.error('Error fetching FAQs:', faqError);
      throw faqError;
    }

    // Format FAQ content
    const faqsByCategory = (faqData || []).reduce((acc: any, faq: any) => {
      if (!acc[faq.category]) acc[faq.category] = [];
      acc[faq.category].push(faq);
      return acc;
    }, {});

    let faqContent = `## Frequently Asked Questions (${faqData?.length || 0} Questions)\n\n`;
    
    Object.entries(faqsByCategory).forEach(([category, faqs]: [string, any]) => {
      faqContent += `### ${category}\n\n`;
      faqs.forEach((faq: any) => {
        faqContent += `**${faq.sort_order}. ${faq.question}**\n\n${faq.answer}\n\n---\n\n`;
      });
    });

    console.log(`FAQ content loaded with ${faqData?.length || 0} questions`);

    // Fetch the Plans & Credits page to extract content
    const learnPlansUrl = `https://hobsonschoice.ai/learn/plans-credits`;
    console.log(`Fetching content from: ${learnPlansUrl}`);
    
    let plansCreditsContent = "";
    try {
      const plansResponse = await fetch(learnPlansUrl);
      const plansHtml = await plansResponse.text();
      
      // Extract Plans & Credits content - looking for specific sections
      const plansMatches = plansHtml.match(/<h2[^>]*>Plans and Credits<\/h2>([\s\S]*?)<\/section>/i);
      if (plansMatches && plansMatches[1]) {
        // Strip HTML tags to get plain text
        plansCreditsContent = plansMatches[1]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        console.log(`Extracted Plans & Credits content: ${plansCreditsContent.length} characters`);
      }
    } catch (error) {
      console.error('Error fetching Plans & Credits content:', error);
      plansCreditsContent = "Plans & Credits information not available";
    }

    // Fetch Use Cases page
    const useCasesUrl = `https://hobsonschoice.ai/learn/use-cases`;
    console.log(`Fetching content from: ${useCasesUrl}`);
    
    let useCasesContent = "";
    try {
      const useCasesResponse = await fetch(useCasesUrl);
      const useCasesHtml = await useCasesResponse.text();
      
      // Extract Use Cases content
      const useCasesMatches = useCasesHtml.match(/<h1[^>]*>Use Cases<\/h1>([\s\S]*?)<\/div>/i);
      if (useCasesMatches && useCasesMatches[1]) {
        useCasesContent = useCasesMatches[1]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        console.log(`Extracted Use Cases content: ${useCasesContent.length} characters`);
      }
    } catch (error) {
      console.error('Error fetching Use Cases content:', error);
      useCasesContent = "Use Cases information not available";
    }

    // Fetch Glossary content from database
    const { data: glossaryData, error: glossaryError } = await supabase
      .from('glossary_items')
      .select('*')
      .eq('is_active', true)
      .order('category')
      .order('sort_order');

    if (glossaryError) {
      console.error('Error fetching glossary:', glossaryError);
    }

    // Format Glossary content
    const glossaryByCategory = (glossaryData || []).reduce((acc: any, item: any) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});

    let glossaryContent = `## Hobson Glossary (${glossaryData?.length || 0} Terms)\n\n`;
    
    Object.entries(glossaryByCategory).forEach(([category, items]: [string, any]) => {
      glossaryContent += `### ${category}\n\n`;
      items.forEach((item: any) => {
        glossaryContent += `**${item.term}:** ${item.definition}\n\n`;
      });
    });

    console.log(`Glossary content loaded with ${glossaryData?.length || 0} terms`);

    // Count items for the response
    const plansCreditsCount = plansCreditsContent.length > 100 ? 1 : 0;
    const useCasesCount = useCasesContent.length > 100 ? 1 : 0;
    const glossaryTermCount = glossaryData?.length || 0;

    // Pricing page FAQ content — kept in sync with src/pages/Pricing.tsx faqGroups[]
    const pricingFaqContent = `
## Pricing Page FAQs

### Getting Started & Trials

**Is there a free trial?**
Yes. Tier 1 comes with a free 3-day trial — no credit card required. You can upload your first document and start asking questions about it within minutes of signing up. Tier 2, 3 and 4 are available to join the waitlist ahead of their launch later this year, with founding member pricing locked in for early signups.

**When will Tiers 2, 3 and 4 be available?**
Tiers 2, 3 and 4 — which unlock the full Knowledge Base platform, workflow automation and action memory — are launching later this year. Join the waitlist now to be notified first and to lock in founding member pricing before public launch.

**Can I start on Tier 1 and upgrade later?**
Yes. When you upgrade to Tier 2 or above, everything you have already taught Hobson stays. Your documents remain in your account. Your Knowledge Base carries over. There is no reset, no re-upload and no loss of work. Upgrading simply unlocks the next layer of capability on top of what you have already built.

**Can I use Hobson on my phone?**
Yes. Hobson has a mobile version available on Tier 1, giving you access to your portfolio documents and AI query capability from anywhere. No desktop required to get started.

### Understanding The Tiers

**What is the difference between Tier 1 and Tiers 2, 3 and 4?**
Tier 1 gives you Hobson's AI document reasoning — ask anything across your leases, contracts and compliance documents and get instant, sourced, auditable answers. What it does not have is the Knowledge Base. Hobson on Tier 1 knows your documents. It does not yet know your business. Tiers 2, 3 and 4 unlock the full platform — the Knowledge Base, workflow automation, action memory, monthly impact summaries and personal shortcuts. Every feature and capability is identical across Tiers 2, 3 and 4. The only difference is how many seats you need. Same Hobson, more people, better value per seat as you scale.

**What is the Knowledge Base?**
The Knowledge Base is Hobson's persistent memory about your business. You tell Hobson who your contractors are, how you handle rent arrears, what your approval thresholds are, how you like your reports formatted — and it remembers permanently. Every answer and every action it takes reflects what it knows about how your business operates. It is what transforms Hobson from a smart document tool into an AI that behaves like an informed member of your team. The Knowledge Base is included in Tiers 2, 3 and 4 and becomes more valuable the longer you use it.

**What happens to my Knowledge Base if I leave?**
Your data belongs to you and can be exported at any time. However it is worth understanding what leaving means in practice — the institutional memory Hobson has built about your business, your contractors, your preferences and your compliance history does not transfer to another tool. That knowledge lives in Hobson because Hobson built it. The longer you use Hobson at Tier 2 or above, the more valuable that memory becomes.

**What if I need more than 10 seats?**
Enterprise pricing is available for organisations with more than 10 users. Enterprise packages are based on usage and portfolio size rather than headcount, and include bespoke onboarding and dedicated support. Contact the team at rochelle.t@hobsonschoice.ai to discuss your requirements.

### Pricing & Billing

**What does annual billing mean and how does the 20% saving work?**
Annual billing means you pay for twelve months upfront in a single payment. The saving versus monthly billing is 20% across all tiers. Monthly billing is available at the standard rate if you prefer flexibility.

**What if I need more documents or questions than my tier includes?**
No problem. Additional document ingestion is available at £0.30 per document, charged once only — the same document is never charged twice. Once Hobson has read and understood a document it stays in your account permanently at no further cost. For additional questions during busy periods, top-up packs are available at £7.50 per 100 questions. You are always in control of what you spend.

**Do I need technical skills to set up or use Hobson?**
No. Hobson is designed to be used in plain English. You ask questions the way you would ask a colleague and Hobson answers directly from your documents and Knowledge Base. No technical training, no complex interfaces, no specialist knowledge required.

### Who It Is For & Trust

**We are not a property management company — we are a retailer or hospitality business with leases. Is Hobson for us?**
Yes — and this is one of the most important things to understand about Hobson. It is built for any business where property is a material operating cost, not just businesses whose primary activity is property management. A retailer with 30 store leases, a restaurant group with 15 sites, or a corporate with a regional office estate all face exactly the same obligations.

**We already use property management software. Do we need to replace it?**
No. Hobson is designed to work alongside your existing systems, not replace them. Your current software stores and organises information. Hobson reasons across it, acts on it and delivers the work your team currently does manually. There is no rip-and-replace requirement.

**Does Hobson help with Building Safety Act and EPC compliance?**
Yes. Hobson reads your compliance certificates, builds a live register, flags upcoming deadlines at 90, 60 and 30 days, instructs contractors, verifies completed certificates and files the outcome automatically.

**How does Hobson handle documents it cannot find an answer in?**
Hobson never guesses. If the information you are asking about does not exist in your documents or Knowledge Base, Hobson tells you clearly rather than generating a plausible but potentially incorrect answer. Every answer Hobson provides is sourced and auditable.

**Where is my data stored and is it secure?**
All data is encrypted and UK-hosted. Hobson is aligned to ISO 27001 standards. Your data is never used to train AI models. Your documents, your Knowledge Base and your business information remain entirely within your account and are never shared with or visible to other clients.

## Pricing Tiers
- Tier 1 (Entry): £19.50/month (£15.60/month annual), 1 seat, 3-day free trial, no Knowledge Base — multi-document AI reasoning, plain English queries, real estate domain accuracy, sourced auditable answers.
- Tier 2 (Professional): £165.00/month (£132.00/month annual), 2 seats (£82.50/seat monthly), full platform including Knowledge Base, workflow automation, action memory.
- Tier 3 (Team): £250.00/month (£200.00/month annual), 5 seats (£50.00/seat monthly), identical features to Tier 2.
- Tier 4 (Scale): £450.00/month (£360.00/month annual), 10 seats (£45.00/seat monthly), identical features to Tier 2. Best per-seat value.
- Enterprise: Usage-based pricing, not headcount-based. Contact sales for 10+ users.
All paid plans include every feature. You are choosing your team size, not your capability.

## Why the big jump in pricing? — The Knowledge Base
Tier 1 answers your questions. Tier 2 - 4 knows your business.
The Knowledge Base is the difference between an AI that retrieves information from your documents and one that understands how you work — your contractors, your contacts, your policies, your obligations, your preferences. Every answer shaped by your business. Every action reflecting how you operate.
    `.trim();

    // Features page content — kept in sync with src/pages/Features.tsx
    const featuresPageContent = `
## Features Page (/features)

Every feature below is live in Phase 1 today. No waitlist. No setup. No technical knowledge required. Just add your first document and start asking questions.

### Document Intelligence

How Hobson reads, connects and reasons across your property documents — not one at a time, but as a complete picture.

**Multi-Document Reasoning**
Most property questions cannot be answered from a single document. Hobson reads multiple documents simultaneously and reasons across them as a connected set. Ask a question that spans three documents and Hobson draws the answer from all three — identifying where the relevant information sits, how the documents relate to each other, and what the combined position means.
WHY IT MATTERS: Property decisions are never made from a single document. Hobson is built for the way property work actually happens — across a stack of connected documents.

**Document Hierarchy Understanding**
Hobson understands document hierarchy. When multiple documents relate to the same property or obligation, Hobson identifies which are original and which are subsequent, reads them in the correct legal sequence, and returns the current position — not the historical one. If a deed of variation changes a repair obligation, Hobson applies the variation. If a rent memorandum confirms a reviewed rent, Hobson uses that figure.
WHY IT MATTERS: This is one of the hardest things to get right in property AI and one of the most consequential to get wrong. A generic AI tool reads documents. Hobson understands the relationship between them.

**Plain English Querying**
Hobson accepts questions in plain English and returns answers in plain English. There is no query language to learn, no search syntax to master and no training required. Ask the way you would ask a colleague and Hobson answers directly from the document.
WHY IT MATTERS: The value of property documents should not be locked behind legal expertise. Hobson makes every clause in every document accessible to everyone in the business who needs to act on it.

**Sourced and Auditable Answers**
Every answer Hobson provides is referenced to the exact document and clause it came from. Hobson never generates an answer from general knowledge or makes an inference without telling you it has done so. If the information is in your documents, Hobson cites it precisely. If it is not, Hobson tells you clearly rather than guessing.
WHY IT MATTERS: In property, wrong answers have financial and legal consequences. Sourced answers are not a nice-to-have — they are the minimum standard for decisions that matter.
Hobson always knows which part of your portfolio it is reading from. Learn how Smart Navigation works at /learn/smart-navigation.

### Portfolio Tools

Ask one question. Get the answer across every document in your portfolio.

**Cross-Portfolio Questioning**
Hobson answers questions across your entire portfolio simultaneously. Every lease in your account is available as a single queryable dataset. Ask one question and Hobson returns the answer from every relevant document at once — listing which units have break clauses, what the dates are, what the notice periods are and what the pre-conditions are.
WHY IT MATTERS: Portfolio-level insight is where Hobson delivers its most immediate time saving. Questions that previously took days take minutes.

**Document Type Breadth**
Hobson is trained to read and reason across the full range of property documents — original leases and residential tenancy agreements, deeds of variation and supplemental deeds, licences to alter, rent memorandums, authorised guarantee agreements, EPC certificates, gas safety certificates, EICR reports, fire safety assessments, surveys and planning documents.
WHY IT MATTERS: Property obligations do not live only in leases. Hobson reads the full document set that defines what your business is actually required to do.

### Trust & Security

Domain-specific accuracy, zero integration friction and enterprise-grade data protection.

**98% Accuracy on Real Estate Datasets**
Hobson is fine-tuned on proprietary real estate datasets — not adapted from a general-purpose language model. It is trained specifically for the language, structure and conventions of commercial and residential property documents in the UK. The result is 98% accuracy on industry-specific document reasoning tasks.
WHY IT MATTERS: The difference between a general AI tool and a domain-specific one is not a matter of degree. For regulated property decisions, it is the difference between an answer you can act on and one you cannot.

**No Integration Required**
Hobson requires no integration with your existing systems to deliver value. Add your documents directly to Hobson and start asking questions. It works alongside whatever property management system, CRM or document storage you currently use.
WHY IT MATTERS: The fastest route to value is no friction at all. Hobson is useful from the moment your first document is added.

**UK-Hosted, Encrypted and ISO 27001 Aligned**
All data is encrypted in transit and at rest. Hobson is hosted entirely within the UK — no data leaves UK jurisdiction. Hobson is aligned to ISO 27001 standards for information security management. Your documents, your Knowledge Base and your business information are never used to train any AI model.
WHY IT MATTERS: The organisations that trust Hobson with their most sensitive property documents need to know those documents are protected to the highest standard. That is not negotiable.

### What Hobson Is Building Next

**Phase 2 — The Knowledge Base (coming later this year)**
Hobson learns how your business operates. Your contractors, contacts, policies, approval thresholds and communication preferences — stored permanently and applied to every answer. Every feature above becomes more powerful when Hobson knows your business, not just your documents.

**Phase 3 — The Application Layer (coming later this year)**
Built on the accuracy of Phase 1 and the business context of Phase 2, Hobson executes workflows autonomously. Rent reviews triggered. Compliance deadlines actioned. Lease events managed end-to-end. The work gets done.
    `.trim();

    // In Practice page content — kept in sync with src/pages/InPractice.tsx
    const inPracticeContent = `
## In Practice Page (/in-practice)

Phase 1 of Hobson is live now. It reads your leases, compliance documents and property contracts — and makes every clause, obligation and date instantly queryable in plain English. No legal training required. No hours of manual review. Just answers.

### What Hobson Does Today
- Reads any property document: Leases, licences, deeds, compliance certificates, EPCs, surveys — Hobson ingests them and understands them.
- Answers questions instantly: Ask anything in plain English. Hobson answers from the document, with the source referenced.
- Understands what supersedes what: Hobson reads the full document stack and understands the current legal position — not just what the original lease said.
- Every answer is sourced and auditable: Hobson never guesses. Every answer references the exact clause it came from.

### Who Uses Hobson

**Sarah — Portfolio Manager** (Residential and commercial property management firm, 340 units across 12 landlord clients)
"Before Hobson, answering a simple question about a lease meant finding the document, opening it, searching through it and hoping you found the right clause. Multiply that by 340 units and you understand why my team spent more time reading documents than managing property."
Her most asked question: "What is the current rent review mechanism and notice period on this lease — taking into account any rent memorandums or deeds of variation?"

**James — Head of Property** (Regional retail operator, 47 stores across the UK)
"I am not a property lawyer. I am a retailer. But I am responsible for 47 leases and the obligations in them. Before Hobson, getting an answer to a basic lease question meant calling a solicitor and waiting two days. Now I ask Hobson."
His most asked question: "Which of my leases have a break clause in the next 18 months and what are the pre-conditions for each?"

**Priya — Operations Director** (Hospitality group, 23 restaurant and bar sites)
"Every one of our sites has a commercial lease. I needed to know what our repair obligations were across all 23 before our annual board review."
Her most asked question: "What are our tenant repair obligations across all sites and which leases have full repairing and insuring terms?"

**David — COO** (Professional services firm, 8 regional offices)
"We were acquiring a smaller firm with 6 office leases. We needed to understand what we were taking on within 10 days. Hobson gave us the picture in 24 hours."
His most asked question: "What are the material obligations and restrictions across these leases and are there any upcoming critical dates?"

### Real Scenarios, Real Answers

**01. Lease Review Before Signing**
A property manager was asked to review a new management instruction for a commercial portfolio with 8 leases. All 8 leases were added to Hobson. The manager asked plain English questions across the portfolio — rent review mechanisms, break clause dates, repair obligations, alienation restrictions. A summary was produced within three hours instead of two to three days.

**02. Acquisition Due Diligence**
A professional services firm was acquiring a competitor with 6 office leases across 4 cities within a 10-day due diligence window. All 6 leases were added to Hobson. Hobson identified that one lease contained a keep-open obligation and another had a personal guarantee clause requiring novation on acquisition. Both were flagged clearly with the relevant clause referenced.

**03. Portfolio Question Across Multiple Leases**
A retail property manager needed to answer which units had rent reviews due in the next 12 months and what the review mechanism was for each across 22 units. Hobson answered across all 22 leases simultaneously, listing each unit, the review date, the mechanism and the relevant notice period.

**04. Understanding Compliance Obligations From Leases**
A hospitality group operations director needed to understand EPC compliance obligations across 23 sites. Hobson identified 14 where the tenant carried the EPC obligation and 9 where it sat with the landlord — each referenced to the specific lease clause.

**05. When The Lease Is Not The Whole Story**
A property manager inherited a portfolio of 18 commercial units with years of subsequent documents. Hobson understood which documents superseded which and answered based on the current legal position, not the original one. This is one of the most important things Hobson does — understanding the legal hierarchy across a stack of documents.
    `.trim();

    // Learn page content — kept in sync with src/pages/Learn.tsx navigation
    const learnPageContent = `
## Learn Page (/learn)

The Learn section contains four core areas accessible via sidebar navigation:

### Smart Navigation (/learn/smart-navigation)
Hobson uses a three-level navigation model — Portfolio, Unit Group, and Unit — that mirrors how property portfolios are actually structured. Users can ask questions at any level: Portfolio for broad questions across everything managed, Unit Group for questions about linked units, and Unit for specific space details. Asking at the right level saves credits, reduces errors, and shows the right context automatically.

### FAQ (/learn/faq)
Contains 50 frequently asked questions organised into categories: How Hobson Works, Getting the Best Out of Hobson, Hobson Credits, and Hobson Technology. All FAQ content is managed from the database.

### Integrations (/learn/available-integrations)
Information about planned integrations and the integration roadmap. Hobson currently does not offer bespoke integrations but is building towards connecting with external systems.

### Glossary (/learn/hobson-glossary)
A comprehensive glossary of Hobson-specific terms and property terminology, managed from the database.
    `.trim();

    // Construct comprehensive knowledge base
    const knowledgeBase = `
# Hobson AI Knowledge Base

## Site Navigation
The Hobson AI website has the following main sections:
- Features (/features) — What Hobson does, how it works, why it matters
- Pricing (/pricing) — Plans for operators, occupiers and owners of real estate
- In Practice (/in-practice) — Real property work, real results
- Learn (/learn) — Smart Navigation, FAQ, Integrations, Glossary
- Blog (/blog)
- Status (/status)
- Contact Us (/contact)

## Core Capabilities
Hobson is an AI-powered assistant that reads and understands property documents to deliver accurate, cited answers instantly. It is built for any business where property is a material operating cost.

${faqContent}

${pricingFaqContent}

${featuresPageContent}

${inPracticeContent}

${learnPageContent}

## Plans & Credits Information

${plansCreditsContent}

## Hobson Glossary

${glossaryContent}

## Data Modeling
Hobson uses a three-tier hierarchical model:
1. Portfolio (top level) - represents your entire property collection
2. Unit Groups (middle level) - collections of units linked by shared location or documents
3. Units (base level) - individual physical spaces

## Document Processing
When a document is uploaded, Hobson:
1. Reads the entire document and extracts text
2. Converts it into structured data (identifying rent, dates, parties, obligations)
3. Indexes it for searchable queries

The system processes documents using OpenAI's API but stores them securely on OVH Cloud (UK/EU-based).
    `.trim();

    console.log('Knowledge base constructed, inserting into database...');

    // Get the latest version number
    const { data: latestKB } = await supabase
      .from('chatbot_knowledge_base')
      .select('version')
      .order('version', { ascending: false })
      .limit(1)
      .single();

    const newVersion = (latestKB?.version || 0) + 1;

    // Insert the new knowledge base
    const { error: insertError } = await supabase
      .from('chatbot_knowledge_base')
      .insert({
        content: knowledgeBase,
        version: newVersion,
        last_updated: new Date().toISOString()
      });

    if (insertError) {
      throw insertError;
    }

    console.log(`Knowledge base updated successfully to version ${newVersion}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Knowledge base updated to version ${newVersion}`,
        stats: {
          faqCount: faqData?.length || 0,
          plansCreditsCount: plansCreditsCount,
          useCasesCount: useCasesCount,
          glossaryCount: glossaryTermCount,
          featuresPage: true,
          inPracticePage: true,
          pricingPage: true,
          learnPage: true,
        },
        preview: {
          firstFaq: faqContent.match(/\*\*1\.\s+([^\*]+)\*\*/)?.[1] || 'Not found'
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error updating knowledge base:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
