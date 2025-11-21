import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Legacy glossary content from Learn page
const LEGACY_GLOSSARY = [
  { term: "HEU", definition: "Hobson Energy Unit - A unit used to measure AI processing. Different tasks use different amounts of HEU, depending on complexity.", category: "General", sort_order: 1 },
  { term: "Unit", definition: "A single physical space, such as a flat, office, or piece of land.", category: "Property Types", sort_order: 2 },
  { term: "Unit Group", definition: "A set of units linked either by a shared location (e.g., flats in one block or offices on a single floor) or by a shared document (e.g., one lease covering multiple units in one or more locations).", category: "Property Types", sort_order: 3 },
  { term: "Portfolio", definition: "A collection of units grouped by ownership, management, or another organisational structure.", category: "Property Types", sort_order: 4 },
  { term: "RTO (Right-to-Occupy) Document", definition: "Documents that give an entity the right to use or occupy a space, such as a lease or a Land Registry Title.", category: "Document Types", sort_order: 5 },
  { term: "AMD (Amending Document)", definition: "Documents that modify, extend, or support an RTO. This includes formal amendments (deeds of variation, rent memorandums) and supporting documents (notices, identity documents, funding documents).", category: "Document Types", sort_order: 6 },
  { term: "ACD (Accompanying Document)", definition: "Documents linked to a specific unit or unit group, such as compliance certificates.", category: "Document Types", sort_order: 7 },
  { term: "Lease", definition: "A legal document that gives a tenant the right to occupy a property for a specified period in exchange for rent.", category: "Legal Terms", sort_order: 8 },
  { term: "Deed of Variation", definition: "A legal document that modifies the terms of an existing lease or agreement.", category: "Legal Terms", sort_order: 9 },
  { term: "Break Clause", definition: "A provision in a lease that allows either the landlord or tenant to end the lease early under specified conditions.", category: "Legal Terms", sort_order: 10 },
  { term: "Service Charge", definition: "A charge paid by tenants to cover the cost of maintaining and servicing common areas of a property.", category: "Legal Terms", sort_order: 11 },
  { term: "Rent Review", definition: "A periodic reassessment of rent levels, typically upward, as specified in a lease agreement.", category: "Legal Terms", sort_order: 12 },
  { term: "Ground Rent", definition: "A regular payment made by a leaseholder to the freeholder, typically for long leasehold properties.", category: "Legal Terms", sort_order: 13 },
  { term: "Title Deed", definition: "A legal document proving ownership of a property or land.", category: "Legal Terms", sort_order: 14 },
  { term: "Land Registry", definition: "The UK government body that records ownership and rights over land and property in England and Wales.", category: "Legal Terms", sort_order: 15 },
  { term: "Extraction", definition: "The process of reading a document for the first time, where the AI processes the entire document, identifies key legal clauses, extracts structured data, and builds searchable indexes.", category: "Technical Terms", sort_order: 16 },
  { term: "Retrieval", definition: "The process of answering questions from already-processed documents by searching the indexed data, pulling the relevant passage, and formatting the answer.", category: "Technical Terms", sort_order: 17 },
  { term: "Embedding", definition: "A mathematical representation of text that captures its meaning, used for semantic search and similarity matching.", category: "Technical Terms", sort_order: 18 },
  { term: "Vector Search", definition: "A search method that finds documents based on meaning rather than exact keyword matches, using embeddings.", category: "Technical Terms", sort_order: 19 },
  { term: "RAG (Retrieval Augmented Generation)", definition: "An AI technique that combines retrieving relevant documents with generating responses, ensuring answers are grounded in your actual data.", category: "Technical Terms", sort_order: 20 },
  { term: "Token", definition: "A unit of text processed by AI models. Roughly 4 characters or 0.75 words. Processing cost is calculated based on tokens.", category: "Technical Terms", sort_order: 21 },
  { term: "Context Window", definition: "The maximum amount of text (measured in tokens) that an AI model can process in a single request.", category: "Technical Terms", sort_order: 22 },
  { term: "OVH Cloud", definition: "A secure UK/EU-based cloud storage provider where Hobson stores your uploaded documents.", category: "Technical Terms", sort_order: 23 },
  { term: "OpenAI API", definition: "The service Hobson uses to read and extract information from documents, answer questions, and generate summaries.", category: "Technical Terms", sort_order: 24 },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting glossary import...');

    // Insert all glossary items
    const { error: insertError } = await supabase
      .from('glossary_items')
      .insert(LEGACY_GLOSSARY);

    if (insertError) {
      console.error('Error inserting glossary items:', insertError);
      throw insertError;
    }

    console.log(`Successfully imported ${LEGACY_GLOSSARY.length} glossary terms`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully imported ${LEGACY_GLOSSARY.length} glossary terms`,
        count: LEGACY_GLOSSARY.length
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error in import-legacy-glossary function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
