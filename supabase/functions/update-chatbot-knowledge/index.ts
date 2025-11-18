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

    // Fetch the Learn FAQ page to extract content
    const learnFaqUrl = `https://hobsonschoice.ai/learn/faq`;
    console.log(`Fetching content from: ${learnFaqUrl}`);
    
    let faqContent = "";
    try {
      const pageResponse = await fetch(learnFaqUrl);
      const htmlContent = await pageResponse.text();
      
      // Extract text content from FAQ sections
      const faqMatches = htmlContent.matchAll(/<AccordionTrigger[^>]*>([^<]+)<\/AccordionTrigger>[\s\S]*?<AccordionContent[^>]*>([\s\S]*?)<\/AccordionContent>/gi);
      
      const faqs: string[] = [];
      for (const match of faqMatches) {
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
          faqs.push(`### ${question}\n${answer}\n`);
        }
      }
      
      if (faqs.length > 0) {
        faqContent = faqs.join('\n');
        console.log(`Extracted ${faqs.length} FAQ items from live page`);
      }
    } catch (error) {
      console.error("Error fetching FAQ page:", error);
      faqContent = "FAQ content could not be fetched. Please visit https://hobsonschoice.ai/learn/faq";
    }

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

${faqContent || "Visit https://hobsonschoice.ai/learn/faq for frequently asked questions."}

## Plans & Credits

${plansCreditsContent || "Visit https://hobsonschoice.ai/learn/plans-credits for plans and credits information."}

## Prompt Engineering

${promptEngineeringContent || "Visit https://hobsonschoice.ai/learn/prompt-engineering to learn about effective prompting techniques."}

## Use Cases

${useCasesContent || "Visit https://hobsonschoice.ai/learn/use-cases to explore real-world applications."}

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
