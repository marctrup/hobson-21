import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface RewardEmailRequest {
  email: string;
  challengeType?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

  try {
    const { email, challengeType = "property_quiz" }: RewardEmailRequest = await req.json();

    if (!email || !email.includes("@")) {
      return new Response(
        JSON.stringify({ error: "Valid email is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get client info from headers
    const userAgent = req.headers.get("user-agent") || null;
    const clientIP = req.headers.get("x-forwarded-for") || 
                    req.headers.get("x-real-ip") || 
                    "unknown";

    console.log(`Storing reward email: ${email} for challenge: ${challengeType}`);

    // Check if email already exists for this challenge type
    const { data: existing, error: checkError } = await supabase
      .from("rewards")
      .select("id")
      .eq("email", email)
      .eq("challenge_type", challengeType)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking existing email:", checkError);
      throw checkError;
    }

    if (existing) {
      console.log(`Email ${email} already exists for challenge ${challengeType}`);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Email already registered for this challenge",
          alreadyExists: true 
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Insert the reward email
    const { data, error } = await supabase
      .from("rewards")
      .insert({
        email,
        challenge_type: challengeType,
        user_agent: userAgent,
        ip_address: clientIP,
      })
      .select()
      .single();

    if (error) {
      console.error("Error inserting reward email:", error);
      throw error;
    }

    console.log("Successfully stored reward email:", data.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        id: data.id,
        message: "Email successfully registered for rewards"
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in store-reward-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to store reward email",
        details: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);