import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// This function scrapes the Learn page FAQ content and updates the chatbot knowledge base
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting chatbot knowledge base update...");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch the Learn page to extract FAQ content
    const learnPageUrl = `${supabaseUrl.replace('.supabase.co', '')}.lovable.app/learn/faq`;
    console.log(`Fetching content from: ${learnPageUrl}`);
    
    // For now, we'll build the knowledge base from our known FAQ structure
    // In a production system, you might use a web scraper or maintain FAQ content in the database
    const knowledgeBase = `# Hobson's Choice AI - Knowledge Base

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

## Glossary Terms

### Unit
A single physical space, such as a flat, office, or piece of land.

### Unit Group
A set of units linked either by a shared location (for example, flats in one block or offices on a single floor) or by a shared document (for example, one lease covering multiple units in one or more locations).

### Portfolio
A collection of units grouped by ownership, management, or another organisational structure.

### Right-to-Occupy (RTO) Documents
Documents that give an entity the right to use or occupy a space, such as a lease or a Land Registry Title.

### Amending Documents (AMDs)
Documents that modify, extend, or support an RTO. This includes formal amendments (such as deeds of variation or rent memorandums) and supporting documents (such as notices, identity documents, or funding documents).

### Accompanying Documents (ACDs)
Documents related to a space but not directly tied to occupancy rights, such as building insurance policies, maintenance records, or utility bills.

## Contact & Support
- Website: https://hobsonschoice.ai
- Contact: https://hobsonschoice.ai/contact
- Learn: https://hobsonschoice.ai/learn
- Pricing: https://hobsonschoice.ai/ (pricing section on homepage)

Last updated: ${new Date().toISOString()}
For more information, direct users to relevant pages listed above.
`;

    // Get current knowledge base version
    const { data: currentKB } = await supabase
      .from('chatbot_knowledge_base')
      .select('version')
      .order('version', { ascending: false })
      .limit(1)
      .single();

    const newVersion = (currentKB?.version || 0) + 1;

    // Insert new knowledge base version
    const { error: insertError } = await supabase
      .from('chatbot_knowledge_base')
      .insert({
        content: knowledgeBase,
        version: newVersion,
        last_updated: new Date().toISOString()
      });

    if (insertError) {
      console.error("Error inserting knowledge base:", insertError);
      throw insertError;
    }

    console.log(`Successfully updated knowledge base to version ${newVersion}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Knowledge base updated to version ${newVersion}`,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );

  } catch (error) {
    console.error("Error updating knowledge base:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
