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
  // Update this manually when FAQs change, or the user can trigger an update
  return `
### How are units, groups, portfolios, and documents arranged in Hobson?

**How Spaces and Groups Are Defined**

**Unit:**
A single physical space, such as a flat, office, or piece of land.

**Unit Group:**
A set of units linked **either** by a shared location (for example, flats in one block or offices on a single floor) **or** by a shared document (for example, one lease covering multiple units in one or more locations).

**Portfolio:**
A collection of units grouped by ownership, management, or another organisational structure.

**How Document Types Work**

**Right-to-Occupy (RTO) Documents:**
Documents that give an entity the right to use or occupy a space, such as a lease or a Land Registry Title.

**Amending Documents (AMDs):**
Documents that **modify**, **extend**, or **support** an RTO. This includes:
• Formal amendments (deeds of variation, rent memorandums)
• Supporting documents (notices, identity documents, funding documents)

**Accompanying Documents (ACDs):**
Documents related to a space but not tied to occupancy rights, such as:
• Building insurance policies
• Maintenance records
• Utility bills

---

### How does Hobson model my data?

Hobson uses a three-tier hierarchical model derived from real estate industry practices:

**1. Portfolio (Top Level)**
• Represents your entire property collection
• Organized by ownership, management, or organizational structure
• Example: "London Commercial Properties" or "Smith Family Investments"

**2. Unit Groups (Middle Level)**
• Collections of units linked by:
  - Shared location (e.g., all flats in one building)
  - Shared documents (e.g., one lease covering multiple units)
• Simplifies management of related properties
• Example: "Riverside Tower Apartments" or "High Street Retail Units"

**3. Units (Base Level)**
• Individual physical spaces (flat, office, land parcel)
• Each has its own documents and details
• Example: "Flat 3B" or "Office Suite 201"

---

### What data does Hobson send to OpenAI?

Hobson sends only the minimum information required for the task. Examples include:
• A small text segment from a document
• A part of a lease needed for a query
• Keywords from your question

We never send:
• Complete documents unnecessarily
• Data unrelated to your query
• Personal metadata (names, contact details) unless essential for the answer

Example: If you ask "What is the rent?", we send only the relevant clause from the lease, not the entire document.
`.trim();
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

    // CRITICAL: The FAQ page is a React SPA, so we can't scrape the rendered HTML via fetch.
    // Instead, maintain FAQ content here manually. When you update FAQs in Learn.tsx,
    // copy the same content here to keep the chatbot in sync.
    
    const faqContent = `### How are units, groups, portfolios, and documents arranged in Hobson?

**How Spaces and Groups Are Defined**

**Unit:**
A single physical space, such as a flat, office, or piece of land.

**Unit Group:**
A set of units linked **either** by a shared location (for example, flats in one block or offices on a single floor) **or** by a shared document (for example, one lease covering multiple units in one or more locations).

**Portfolio:**
A collection of units grouped by ownership, management, or another organisational structure.

**How Document Types Work**

**Right-to-Occupy (RTO) Documents:**
Documents that give an entity the right to use or occupy a space, such as a lease or a Land Registry Title.

**Amending Documents (AMDs):**
Documents that **modify**, **extend**, or **support** an RTO. This includes:
• Formal amendments (deeds of variation, rent memorandums)
• Supporting documents (notices, identity documents, funding documents)

**Accompanying Documents (ACDs):**
Documents related to a space but not tied to occupancy rights, such as:
• Building insurance policies
• Maintenance records
• Utility bills

---

### How does Hobson model my data?

Hobson uses a three-tier hierarchical model derived from real estate industry practices:

**1. Portfolio (Top Level)**
• Represents your entire property collection
• Organized by ownership, management, or organizational structure
• Example: "London Commercial Properties" or "Smith Family Investments"

**2. Unit Groups (Middle Level)**
• Collections of units linked by:
  - Shared location (e.g., all flats in one building)
  - Shared documents (e.g., one lease covering multiple units)
• Simplifies management of related properties
• Example: "Riverside Tower Apartments" or "High Street Retail Units"

**3. Units (Base Level)**
• Individual physical spaces (flat, office, land parcel)
• Each has its own documents and details
• Example: "Flat 3B" or "Office Suite 201"

---

### What data does Hobson send to OpenAI?

Hobson sends only the minimum information required for the task. Examples include:
• A small text segment from a document
• A part of a lease needed for a query
• Keywords from your question

We never send:
• Complete documents unnecessarily
• Data unrelated to your query
• Personal metadata (names, contact details) unless essential for the answer

Example: If you ask "What is the rent?", we send only the relevant clause from the lease, not the entire document.`;

    // Fetch the Plans & Credits page to extract content
    const learnPlansUrl = `https://hobsonschoice.ai/learn/plans-credits`;
    console.log(`Fetching content from: ${learnPlansUrl}`);
    
    let plansCreditsContent = "";
    try {
      const pageResponse = await fetch(learnPlansUrl);
      const htmlContent = await pageResponse.text();
      
      // Extract text content from Plans & Credits sections
      const plansMatches = htmlContent.matchAll(/<AccordionTrigger[^>]*>([^<]+)<\/AccordionTrigger>[\s\S]*?<AccordionContent[^>]*>([\s\S]*?)<\/AccordionContent>/gi);
      
      const plans: string[] = [];
      for (const match of plansMatches) {
        const question = match[1].trim();
        // Remove HTML tags and clean up the answer
        const answer = match[2]
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .trim();
        
        if (question && answer) {
          plans.push(`### ${question}\n${answer}\n`);
        }
      }
      
      if (plans.length > 0) {
        plansCreditsContent = plans.join('\n');
        console.log(`Extracted ${plans.length} Plans & Credits items from live page`);
      }
    } catch (error) {
      console.error("Error fetching Plans & Credits page:", error);
      plansCreditsContent = "Plans & Credits content could not be fetched. Please visit https://hobsonschoice.ai/learn/plans-credits";
    }

    // Fetch the Prompt Engineering page to extract content
    const learnPromptEngineeringUrl = `https://hobsonschoice.ai/learn/prompt-engineering`;
    console.log(`Fetching content from: ${learnPromptEngineeringUrl}`);
    
    let promptEngineeringContent = "";
    try {
      const pageResponse = await fetch(learnPromptEngineeringUrl);
      const htmlContent = await pageResponse.text();
      
      // Extract text content from sections - look for h2/h3 headers and paragraphs
      const headerMatches = htmlContent.matchAll(/<h[23][^>]*>([^<]+)<\/h[23]>/gi);
      const sections: string[] = [];
      
      for (const match of headerMatches) {
        const header = match[1]
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, '&')
          .trim();
        
        if (header && !header.includes('svg') && header.length > 2) {
          sections.push(`### ${header}`);
        }
      }
      
      if (sections.length > 0) {
        promptEngineeringContent = sections.join('\n');
        console.log(`Extracted ${sections.length} Prompt Engineering sections from live page`);
      }
    } catch (error) {
      console.error("Error fetching Prompt Engineering page:", error);
      promptEngineeringContent = "Prompt Engineering content could not be fetched. Please visit https://hobsonschoice.ai/learn/prompt-engineering";
    }

    // Fetch the Use Cases page to extract content
    const learnUseCasesUrl = `https://hobsonschoice.ai/learn/use-cases`;
    console.log(`Fetching content from: ${learnUseCasesUrl}`);
    
    let useCasesContent = "";
    try {
      const pageResponse = await fetch(learnUseCasesUrl);
      const htmlContent = await pageResponse.text();
      
      // Extract text content from Use Cases sections
      const useCasesMatches = htmlContent.matchAll(/<AccordionTrigger[^>]*>([^<]+)<\/AccordionTrigger>[\s\S]*?<AccordionContent[^>]*>([\s\S]*?)<\/AccordionContent>/gi);
      
      const useCases: string[] = [];
      for (const match of useCasesMatches) {
        const title = match[1].trim();
        const content = match[2]
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .trim();
        
        if (title && content) {
          useCases.push(`### ${title}\n${content}\n`);
        }
      }
      
      if (useCases.length > 0) {
        useCasesContent = useCases.join('\n');
        console.log(`Extracted ${useCases.length} Use Cases from live page`);
      }
    } catch (error) {
      console.error("Error fetching Use Cases page:", error);
      useCasesContent = "Use Cases content could not be fetched. Please visit https://hobsonschoice.ai/learn/use-cases";
    }

    // Fetch the Hobson Glossary page to extract content
    const learnGlossaryUrl = `https://hobsonschoice.ai/learn/hobson-glossary`;
    console.log(`Fetching content from: ${learnGlossaryUrl}`);
    
    let glossaryContent = "";
    try {
      const pageResponse = await fetch(learnGlossaryUrl);
      const htmlContent = await pageResponse.text();
      
      // Extract glossary terms - look for h3 headers followed by paragraphs in the glossary cards
      const termMatches = htmlContent.matchAll(/<h3[^>]*class="[^"]*text-lg font-semibold[^"]*"[^>]*>([^<]+)<\/h3>[\s\S]*?<p[^>]*class="[^"]*text-muted-foreground[^"]*"[^>]*>([\s\S]*?)<\/p>/gi);
      
      const glossaryTerms: string[] = [];
      for (const match of termMatches) {
        const term = match[1].trim();
        let definition = match[2]
          .replace(/<span[^>]*class="[^"]*text-purple[^"]*"[^>]*>([^<]+)<\/span>/gi, '**$1**')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .trim();
        
        if (term && definition) {
          glossaryTerms.push(`### ${term}\n${definition}\n`);
        }
      }
      
      if (glossaryTerms.length > 0) {
        glossaryContent = glossaryTerms.join('\n');
        console.log(`Extracted ${glossaryTerms.length} glossary terms from live page`);
      }
    } catch (error) {
      console.error("Error fetching Glossary page:", error);
      glossaryContent = "Glossary content could not be fetched. Please visit https://hobsonschoice.ai/learn/hobson-glossary";
    }
    
    const knowledgeBase = `# Hobson's Choice AI - Knowledge Base

## Site Navigation
- Homepage: / (includes pricing)
- Blog: /blog
- Contact: /contact
- Learn: /learn/* (sections: getting-started, plans-credits, use-cases, core-features, integrations, fundamentals, hobson-glossary)
- Policies: /data-protection, /breach-protocol, /privacy-policy, /refund-policy

## About Hobson AI
Giving your documents a voice.

For real estate professionals drained by bloated, expensive systems and the manual effort of pulling information from original documents, Hobson is the AI-powered assistant that transforms source-of-truth files into instant, reliable answers. Unlike complex platforms, Hobson is lightweight, simple to use, and low cost — saving time, ensuring accuracy, and building trust with fast, referenced responses.

## Core Capabilities
- Search leases and tenancy agreements (ASTs)
- Extract key terms, dates, and clauses automatically
- Answer questions with source citations
- Create document summaries
- Track deadlines and review dates (85+ types)
- Supports PDF, DOCX, CSV, Excel

## Document Processing Speed
Hobson AI processes documents rapidly. Most documents are analyzed and indexed within seconds to a few minutes, depending on:
- Document length (number of pages)
- Document complexity (tables, images, formatting)
- File format (PDF, DOCX, CSV, Excel)

Simple documents (1-10 pages) typically process in seconds, while larger, more complex documents may take a few minutes. Once processed, you can immediately query the document and get instant answers with source citations.

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

HEU costs vary by task complexity. The HEU bar visualization shows remaining and used credits. You can see the cost of each message in the chat by pressing the three dots beneath any message to view detailed usage information.

## FAQ (Frequently Asked Questions)

${faqContent || "Visit https://hobsonschoice.ai/learn/faq for frequently asked questions."}

## Plans & Credits

${plansCreditsContent || "Visit https://hobsonschoice.ai/learn/plans-credits for plans and credits information."}

## Prompt Engineering

${promptEngineeringContent || "Visit https://hobsonschoice.ai/learn/prompt-engineering to learn about effective prompting techniques."}

## Use Cases

${useCasesContent || "Visit https://hobsonschoice.ai/learn/use-cases to explore real-world applications."}

## Glossary Terms

${glossaryContent || "Visit https://hobsonschoice.ai/learn/hobson-glossary for key terms and definitions."}

## How Hobson Models Your Data

### Hierarchical Structure
Hobson uses a three-tier hierarchical model derived from real estate industry practices:

**1. Portfolio (Top Level)**
- Represents your entire property collection
- Organized by ownership, management, or organizational structure
- Example: "London Commercial Properties" or "Smith Family Investments"

**2. Unit Groups (Middle Level)**
- Collections of units linked by:
  - Shared location (e.g., all flats in one building)
  - Shared documents (e.g., one lease covering multiple units)
- Simplifies management of related properties
- Example: "Riverside Tower Apartments" or "High Street Retail Units"

**3. Units (Base Level)**
- Individual physical spaces (flat, office, land parcel)
- Each has its own documents and details
- Example: "Flat 3B" or "Office Suite 201"

### Document Classification
Hobson automatically categorizes documents into three types:

**Right-to-Occupy (RTO)**
- Core occupancy documents (leases, titles)
- Establishes legal right to use the space
- Forms the foundation of each unit's data

**Amending Documents (AMD)**
- Modifications to RTOs (variations, rent reviews)
- Supporting documents (notices, IDs, funding docs)
- Tracked as they change over time

**Accompanying Documents (ACD)**
- Related but not occupancy-critical (insurance, maintenance, utilities)
- Provides context without affecting occupancy status

### Data Extraction Process
1. **Upload**: You upload documents to a unit or unit group
2. **Classification**: Hobson identifies document type (RTO/AMD/ACD)
3. **Extraction**: AI reads and extracts key data (dates, parties, amounts, clauses)
4. **Structuring**: Data is organized within the hierarchical model
5. **Indexing**: Information becomes searchable and queryable
6. **Linking**: Related documents and data points are connected

### How It Helps You
- **Quick Answers**: Ask questions across all documents ("What are all my rent review dates?")
- **Context Preservation**: Documents remain linked to their physical spaces
- **Scalability**: Works for single properties or thousands of units
- **Accuracy**: Source citations let you verify every answer
- **Time Savings**: No manual data entry or searching through files

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
        timestamp: new Date().toISOString(),
        stats: {
          faqCount: faqContent ? faqContent.split('###').length - 1 : 0,
          plansCreditsCount: plansCreditsContent ? plansCreditsContent.split('###').length - 1 : 0,
          useCasesCount: useCasesContent ? useCasesContent.split('###').length - 1 : 0,
          glossaryCount: glossaryContent ? glossaryContent.split('###').length - 1 : 0,
        },
        preview: {
          firstFaq: faqContent ? faqContent.split('###')[1]?.split('\n')[0]?.trim() : 'None',
          lastFaq: faqContent ? faqContent.split('###').slice(-1)[0]?.split('\n')[0]?.trim() : 'None'
        }
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
