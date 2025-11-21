import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LEGACY_FAQS = [
  // How Hobson works (1-20)
  { question: "How are units, groups, portfolios, and documents arranged in Hobson?", answer: "**How Spaces and Groups Are Defined:**\n• **Unit:** A single physical space, such as a flat, office, or piece of land.\n• **Unit Group:** A set of units linked either by a shared location (for example, flats in one block or offices on a single floor) or by a shared document (for example, one lease covering multiple units in one or more locations).\n• **Portfolio:** A collection of units grouped by ownership, management, or another organisational structure.\n\n**How Document Types Work:**\n• **Right-to-Occupy (RTO) Documents:** Documents that give an entity the right to use or occupy a space, such as a lease or a Land Registry Title.\n• **Amending Documents (AMDs):** Documents that modify, extend, or support an RTO. This includes formal amendments (deeds of variation, rent memorandums) and supporting documents (notices, identity documents, funding documents).\n• **Accompanying Documents (ACDs):** Documents linked to a specific unit or unit group, such as compliance certificates.", category: "How Hobson works", sort_order: 1 },
  { question: "Which file types are supported?", answer: "Hobson currently supports PDFs. Common text files, as well as CSV/Excel for tabular data, will be added in due course.", category: "How Hobson works", sort_order: 2 },
  { question: "What types of documents can Hobson read?", answer: "Hobson has been trained to understand a wide range of documents used across residential and commercial real estate. These fall into three main categories:\n• Right-to-Occupy (RTO) Documents: Residential leases, commercial leases, licences to occupy, title deeds\n• Amending Documents (AMDs): Deeds of variation, rent memorandums, notices, works agreements, deposit deeds, identity or supporting documents\n• Accompanying Documents (ACDs): Compliance certificates, works reports, funding agreements\n\nHobson continues to grow. We add new document types regularly.", category: "How Hobson works", sort_order: 3 },
  { question: "How to get documents to Hobson?", answer: "**For Today:** Hobson allows for batch uploads via our drag-and-drop upload feature.\n**In the Future:** Once we are happy that Hobson can access drives such as Dropbox and Google Drive, we will provide that feature.", category: "How Hobson works", sort_order: 4 },
  { question: "How long does Hobson take to read a document?", answer: "The time it takes to read depends on the type and size of the document:\n• High-complexity legal documents (e.g., leases): around 8-9 minutes\n• Medium-complexity legal documents (e.g., Deeds): around 2-3 minutes\n• Low-complexity documents (e.g., notices): around 30 seconds to 1 minute\n\nOnce processing is complete, your documents become fully searchable and ready to use.", category: "How Hobson works", sort_order: 5 },
  { question: "What happens technically when a document is uploaded?", answer: "When you upload a lease, deed, or notice, three things happen automatically:\n1. The system reads the whole document - The file is opened and its text is pulled out so the AI can understand it.\n2. The AI converts the document into structured data - It identifies critical information like rent, break dates, parties, addresses, and obligations.\n3. The system indexes the document for search - The entire document is made searchable by breaking it into smaller segments and creating an index.", category: "How Hobson works", sort_order: 6 },
  { question: "Why is extraction more expensive than retrieval?", answer: "**Extraction** (reading a document the first time) requires the AI to process the entire document, identify key legal clauses, extract structured data, and build searchable indexes. This is like reading and understanding a book for the first time—it takes effort.\n\n**Retrieval** (answering questions from already-processed documents) simply searches the indexed data, pulls the relevant passage, and formats the answer. This is like finding a specific chapter in a book you've already read—it's much faster.", category: "How Hobson works", sort_order: 7 },
  { question: "How does Hobson identify the newest information?", answer: "Hobson tracks document dates and amendment history to ensure you always get the most current information. When multiple documents reference the same topic, Hobson:\n1. Checks the effective date of each document\n2. Prioritizes the latest amendment or variation\n3. Shows you which document the answer came from", category: "How Hobson works", sort_order: 8 },
  { question: "Does Hobson work on mobile?", answer: "Yes. Hobson is accessible from any browser on mobile devices, though some features work best on larger screens.", category: "How Hobson works", sort_order: 9 },
  { question: "Who owns the data and outputs?", answer: "You do. All documents you upload, the data extracted from them, and the outputs Hobson generates belong to you. Hobson does not claim ownership of your content.", category: "How Hobson works", sort_order: 10 },
  { question: "How does Hobson use OpenAI?", answer: "Hobson uses OpenAI's API to read and extract information from your documents, answer questions based on the content, and generate summaries and reports. We do not use OpenAI for storage. Your documents are stored on secure UK/EU-based servers (OVH Cloud).", category: "How Hobson works", sort_order: 11 },
  { question: "Does OpenAI store my documents?", answer: "No. OpenAI does not retain your data. According to OpenAI's data usage policies for API customers, data sent via the API is not used to train their models and is not stored beyond the time needed to process your request.", category: "How Hobson works", sort_order: 12 },
  { question: "Does OpenAI use my data to train their models?", answer: "No. As an API customer, your data is not used to train OpenAI's models. This is guaranteed under OpenAI's API Terms of Service.", category: "How Hobson works", sort_order: 13 },
  { question: "What data does Hobson send to OpenAI?", answer: "Hobson sends only the minimum information required for the task. Examples include a small text segment from a document, a part of a lease needed for a query, or keywords from your question.\n\nWe never send complete documents unnecessarily, data unrelated to your query, or personal metadata unless essential for the answer.\n\nExample: If you ask \"What is the rent?\", we send only the relevant clause from the lease, not the entire document.", category: "How Hobson works", sort_order: 14 },
  { question: "Where are my documents actually stored?", answer: "Your documents are stored on OVH Cloud, a secure UK/EU-based cloud storage provider. OVH is designed to protect sensitive data and complies with European data protection standards. Hobson does not store your documents on OpenAI's servers.", category: "How Hobson works", sort_order: 15 },
  { question: "Why does Hobson need to send anything to OpenAI at all?", answer: "Hobson uses OpenAI's language models to understand complex legal language, extract structured information from documents, and answer questions accurately in plain English. OpenAI provides the AI capabilities, but your documents remain stored securely on OVH Cloud.", category: "How Hobson works", sort_order: 16 },
  { question: "Who can see my documents?", answer: "Only you and the users you invite to your workspace can see your documents. Hobson's team cannot access your documents unless you explicitly grant permission for support purposes.", category: "How Hobson works", sort_order: 17 },
  { question: "How does Hobson protect my data when using OpenAI?", answer: "Hobson minimizes data exposure by sending only the minimum required text to OpenAI, using encrypted connections (HTTPS/TLS), and ensuring OpenAI does not retain your data. Your full documents are never stored on OpenAI's servers—they remain on OVH Cloud.", category: "How Hobson works", sort_order: 18 },
  { question: "Does OpenAI know who I am or hold details of my property holdings?", answer: "No. Hobson does not send personal identifiers or metadata about you to OpenAI. The AI sees only the text snippets needed to answer your query, with no context about who you are or what properties you own.", category: "How Hobson works", sort_order: 19 },
  { question: "What happens when I ask a question?", answer: "When you ask Hobson a question:\n1. Hobson searches your indexed documents to find relevant passages\n2. The relevant text is sent to OpenAI for analysis\n3. OpenAI processes the text and generates an answer\n4. Hobson returns the answer to you, along with citations showing which document it came from", category: "How Hobson works", sort_order: 20 },
  
  // Getting the best out of Hobson (21-28)
  { question: "Can Hobson be trained on my company's information?", answer: "Yes. For enterprise clients, Hobson can be trained on your organisation's own documents, processes, and team details. We create a private knowledge base built from your company information, which Hobson uses to give personalised and context-aware answers. None of your company information is shared outside your private environment.", category: "Getting the best out of Hobson", sort_order: 21 },
  { question: "Can I end a tenancy agreement?", answer: "Yes. Enter \"End Tenancy agreement\" at the unit level.", category: "Getting the best out of Hobson", sort_order: 22 },
  { question: "Can I add a unit manually without uploading a document?", answer: "Yes. Just ask Hobson \"Add Unit\". Hobson will then prompt you to enter the full address, and the unit will be created without needing any documents.", category: "Getting the best out of Hobson", sort_order: 23 },
  { question: "Which level should I use when asking a question?", answer: "You can ask Hobson questions at three levels—Portfolio, Unit Group, and Unit. The higher the level, the broader the search. The lower the level, the more focused the answer.\n\n**To get the best results:**\n• Use Portfolio for broad questions that cover everything you manage\n• Use Unit Group when your question relates to a set of linked units\n• Use Unit when you need details about a specific space\n\nAsking your question at the right level matters for three reasons:\n1. You use fewer credits - Dropping down a level keeps the search small and saves credits\n2. You reduce the chance of errors - Focused questions give Hobson less to sift through\n3. You see the right context automatically - Hobson shows you the address, tenant names, and other details", category: "Getting the best out of Hobson", sort_order: 24 },
  { question: "What should I do if I get a poor answer?", answer: "If Hobson gives you an answer like \"No information is available\" but you know the information exists:\n1. Go back to the level you were on - Return to the Portfolio, Unit Group, or Unit level and ask the question again\n2. Check that the documents are actually uploaded - Open the Documents area in Admin and make sure the files you expect are there\n\nMost issues come from asking at too high a level or missing documents, and both are easy to correct.", category: "Getting the best out of Hobson", sort_order: 25 },
  { question: "How should I structure my prompts for the best results?", answer: "To get the best answers from Hobson:\n• Choose the right level first - Start at the Portfolio, Unit Group, or Unit level depending on how specific your question is\n• Be direct and clear - Ask for exactly what you need. Short, simple questions work better\n• Use names or addresses when needed - Adding the unit address or tenant name helps guide the search\n• Ask one thing at a time - If you have several questions, ask them separately", category: "Getting the best out of Hobson", sort_order: 26 },
  { question: "Can Hobson connect to our systems?", answer: "Currently, we don't offer bespoke integrations, but please talk to us so we can understand what you want to achieve and whether this will be possible at some point.", category: "Getting the best out of Hobson", sort_order: 27 },
  { question: "Can I control who has access?", answer: "Yes. Admin users can invite new users and choose exactly which units and which document classes they can access. This lets you control who sees what within Hobson.", category: "Getting the best out of Hobson", sort_order: 28 },
  
  // Hobson Credits (29-39)
  { question: "What is a HEU?", answer: "A HEU is the unit of energy measurement for using Hobson's AI features. Each message or action costs a certain number of HEUs based on its complexity.", category: "Hobson Credits", sort_order: 29 },
  { question: "How much do different tasks cost in HEUs?", answer: "Hobson uses a usage-based credit system called HEU (Hobson Energy Unit). Most messages cost less than 1 HEU, while more detailed tasks cost more.\n\n**Typical HEU costs:**\n• Reading a simple document (e.g. certificate): 0.5 HEU\n• Reading a medium document (e.g. deed): 1.4 HEU\n• Reading a complex document (e.g. lease): 16.9 HEU\n• Asking a simple question (\"What is the rent?\"): 0.05 HEU\n• Asking a medium question (\"List all rents\"): 0.26 HEU\n• Asking a complex question (\"Build a tenancy report\"): 0.54 HEU\n\nYou can check the HEU cost of any message by opening the menu (three dots) under the message in the chat.", category: "Hobson Credits", sort_order: 30 },
  { question: "How can I upgrade my subscription?", answer: "You can upgrade your subscription through your workspace settings or by contacting our support team.", category: "Hobson Credits", sort_order: 31 },
  { question: "How can I downgrade my subscription?", answer: "Subscription downgrades can be managed through your account settings or by reaching out to support.", category: "Hobson Credits", sort_order: 32 },
  { question: "How can I cancel my subscription?", answer: "You can cancel your subscription at any time through your account settings. Your access will continue until the end of the current billing period.", category: "Hobson Credits", sort_order: 33 },
  { question: "How can I change my billing information?", answer: "Billing information can be updated in your account settings under the billing section.", category: "Hobson Credits", sort_order: 34 },
  { question: "How do I download my invoices?", answer: "Invoices are available for download in your account settings under billing history.", category: "Hobson Credits", sort_order: 35 },
  { question: "How do I get more credits?", answer: "You can get more HEUs by upgrading your plan or purchasing Top-ups.", category: "Hobson Credits", sort_order: 36 },
  { question: "When does my credit limit reset?", answer: "Your credit limit resets at the beginning of each billing cycle based on your subscription plan.", category: "Hobson Credits", sort_order: 37 },
  { question: "How do I see the remaining credits in a workspace?", answer: "Click on your workspace name on the dashboard to view your remaining credits and usage statistics.", category: "Hobson Credits", sort_order: 38 },
  { question: "Can I get free credits?", answer: "Free credits are included with the free plan. Additional free credits may be available through promotional offers or referral programs.", category: "Hobson Credits", sort_order: 39 },
  
  // Hobson Technology (40-50)
  { question: "What technology platforms does Hobson use?", answer: "Hobson runs on trusted, industry-standard platforms:\n• **OVH Cloud** - Stores your uploaded files and documents (secure UK/EU-based cloud storage)\n• **Vercel** - Runs the Hobson web app (fast, stable interface)\n• **MongoDB** - Handles structured data such as units, portfolios, users, and document metadata\n• **Neo4j** - Used for knowledge-graph structures to understand relationships\n• **Pinecone** - Stores vector embeddings for quick document search\n• **Google Workspace (G Suite)** - Supports email delivery, team communication, and secure internal admin", category: "Hobson Technology", sort_order: 40 },
  { question: "How does the system decide which tools to run for a query?", answer: "It detects keywords in the user's question. Each keyword group maps to a specific tool. If the query contains more than one topic (for example, rent + break), all matching tools must run in the same turn.", category: "Hobson Technology", sort_order: 41 },
  { question: "What happens if a tool should have been run but wasn't?", answer: "This is a validation failure called EV-01 (missing fresh tool call). The model must produce the fallback message and cannot reuse earlier results.", category: "Hobson Technology", sort_order: 42 },
  { question: "What does the system do if a tool runs but the data is from a previous turn?", answer: "This triggers EV-02 (missing provenance). Each Answer line must link to a run_id from the current turn. If not, the system must discard the draft and return the fallback.", category: "Hobson Technology", sort_order: 43 },
  { question: "How does the system filter tool results before generating the Answer?", answer: "Filtering follows a strict order: Headlease-only rule, excluded-type removal, removal of superseded and reversionary records, ranking and time window filtering. Only valid records remaining after these steps can appear in the Answer block.", category: "Hobson Technology", sort_order: 44 },
  { question: "How does the model choose between a table, a list, or structured sections?", answer: "The choice depends on the number of records and question type:\n• 3+ records use a markdown table\n• 1–2 records use a short list\n• Rental history uses structured headings (rent, premium, review)\n• Unit or unit-group history uses grouped sections\n• Portfolio summaries use a table with totals", category: "Hobson Technology", sort_order: 45 },
  { question: "How does grouping work for units, unit groups, and portfolios?", answer: "Grouping follows query scope:\n• Unit queries group by tenancy, including historical and current\n• Unit group/building queries group by unit group → unit → tenancy\n• Portfolio queries group by property → unit\n\nWithin each group, sort by effective date (ascending). Groups get their own headers for clarity.", category: "Hobson Technology", sort_order: 46 },
  { question: "How are Follow-Up questions generated?", answer: "The system must output one Follow-Up. It chooses a template based on intent: Further detail, Comparative, Temporal, Document-related, Actionable, or Missing context.", category: "Hobson Technology", sort_order: 47 },
  { question: "How does the system handle missing or incomplete data?", answer: "It must not guess. Missing values are shown as \"—\" with a short note such as \"evidence incomplete\". If all context is missing, all three blocks must show \"No information available\". Debug or internal identifiers must never appear.", category: "Hobson Technology", sort_order: 48 },
  { question: "How does the system ensure plain-language compliance?", answer: "The Answer must avoid technical terms like \"rows\", \"objects\", \"arrays\", or references to JSON structure. If such terms appear, this triggers SV-Px (plain-language breach) and the response must be regenerated.", category: "Hobson Technology", sort_order: 49 },
  { question: "What must the system verify before returning the final response?", answer: "Before returning anything, the system checks:\n• All three blocks are present and in order\n• Only current-turn tool data is used\n• Headlease-only and tenant-specific rules are followed\n• Excluded/superseded/reversionary data is removed\n• No debug information appears\n• Formatting follows Section 7\n• Follow-Up is valid and unique\n\nIf any rule fails, the system outputs the fallback message instead.", category: "Hobson Technology", sort_order: 50 },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting FAQ import...');

    // Check if FAQs already exist
    const { data: existing, error: checkError } = await supabase
      .from('faq_items')
      .select('id')
      .limit(1);

    if (checkError) {
      throw checkError;
    }

    if (existing && existing.length > 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'FAQs already imported. Delete existing FAQs first if you want to re-import.'
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert all FAQs
    const { error: insertError } = await supabase
      .from('faq_items')
      .insert(LEGACY_FAQS);

    if (insertError) {
      throw insertError;
    }

    console.log(`Successfully imported ${LEGACY_FAQS.length} FAQs`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully imported ${LEGACY_FAQS.length} FAQs`,
        count: LEGACY_FAQS.length
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error('Error importing FAQs:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
