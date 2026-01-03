import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Function to get the latest knowledge base from database
async function getKnowledgeBase(): Promise<string> {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    const { data, error } = await supabase
      .from('chatbot_knowledge_base')
      .select('content')
      .order('last_updated', { ascending: false })
      .limit(1)
      .single();
    
    if (error || !data) {
      console.error("Error fetching knowledge base:", error);
      // Fallback to basic content if database query fails
      return `# Hobson AI - Basic Knowledge
Visit https://hobsonschoice.ai/learn for more information.`;
    }
    
    return data.content;
  } catch (err) {
    console.error("Exception fetching knowledge base:", err);
    return `# Hobson AI - Basic Knowledge
Visit https://hobsonschoice.ai/learn for more information.`;
  }
}

// Simple function to detect if text is likely German
function isGermanText(text: string): boolean {
  const germanIndicators = [
    /\b(ich|du|er|sie|es|wir|ihr|Sie)\b/i,
    /\b(ist|sind|war|waren|habe|haben|wird|werden)\b/i,
    /\b(und|oder|aber|wenn|dass|weil|obwohl)\b/i,
    /\b(der|die|das|ein|eine|einer|einem|einen)\b/i,
    /\b(nicht|auch|nur|noch|schon|sehr|wie|was|wo|wer|wann|warum)\b/i,
    /\b(kann|können|möchte|möchten|muss|müssen|soll|sollen)\b/i,
    /[äöüß]/i,
  ];
  
  let matchCount = 0;
  for (const pattern of germanIndicators) {
    if (pattern.test(text)) {
      matchCount++;
    }
  }
  
  return matchCount >= 2;
}

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

    // Detect if user is writing in German by checking the last user message
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    const isGerman = lastUserMessage ? isGermanText(lastUserMessage.content) : false;
    
    console.log("Detected language:", isGerman ? "German" : "English");

    // Get the latest knowledge base content
    const WEBSITE_CONTENT = await getKnowledgeBase();
    
    // Add language instruction based on detection
    const languageInstruction = isGerman 
      ? `\n\nIMPORTANT LANGUAGE RULE: The user is writing in German. You MUST respond entirely in German (Deutsch). Translate your response to German while keeping all markdown links intact.`
      : '';
    
    const systemPrompt = `You are a helpful AI assistant for Hobson's Choice AI website. Your role is to help visitors understand what Hobson AI does, its features, pricing, and use cases.

CRITICAL RULES - NON-NEGOTIABLE:
1. SOURCE PREFERENCE - When using the knowledge base, prefer sources in this order:
   a) FAQ content first (from /learn/faq)
   b) Other Learn sections: Use Cases, Hobson Credits, Prompt Engineering, Glossary
   c) Only if the information is genuinely not found anywhere in the knowledge base should you use the fallback response

2. ACCURACY - Do not invent new facts that are not supported by the knowledge base. You may summarize, explain, and combine information as long as it's based on the content provided.

3. SCOPE - You are a specialist for Hobson AI only. If users ask questions outside the knowledge base (e.g., weather, unrelated tech topics), explain that you only have information about Hobson AI and suggest they visit [Contact Us](/contact) for other inquiries.

4. ANSWER FLOW - Follow this order when responding:
   a) First, try to find an answer in the knowledge base using the source preference above
   b) If the question is unclear or ambiguous, ask the user to clarify
   c) If the question is clear but the answer isn't in the knowledge base, use the fallback response below

RESPONSE GUIDELINES:
1. Be friendly, concise, and helpful
2. Follow the source preference strictly (FAQ first, then other sections)
3. If you find relevant information, provide a clear answer based on it
4. FALLBACK RESPONSE - Only if you truly cannot find ANY relevant information after checking all sections, respond with: "I apologize, but that specific information hasn't been made available to me in my knowledge base. Could you provide more details or rephrase your question? You can also visit [Learn page](/learn/welcome) to explore all available information."
5. ALWAYS include clickable markdown links using these EXACT path routes:
   
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
${languageInstruction}

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
