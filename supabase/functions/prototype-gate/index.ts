import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_ATTEMPTS = 5;
const WINDOW_MINUTES = 15;
const MAX_PASSPHRASE_LENGTH = 80;

function json(payload: unknown, status: number): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// Compare without leaking how much of the phrase matched.
function constantTimeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const clientIP =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: rateLimitOk, error: rateLimitError } = await supabase.rpc(
      "check_server_rate_limit",
      {
        p_identifier: clientIP,
        p_action_type: "prototype_gate",
        p_max_requests: MAX_ATTEMPTS,
        p_window_minutes: WINDOW_MINUTES,
      },
    );

    if (rateLimitError) {
      console.error("Rate limit check failed:", rateLimitError);
      return json({ error: "Unable to verify the pass phrase" }, 503);
    }

    if (rateLimitOk === false) {
      return json({ error: "Too many attempts. Please try again later." }, 429);
    }

    let passphrase = "";
    try {
      const body = await req.json();
      passphrase = typeof body?.passphrase === "string" ? body.passphrase : "";
    } catch {
      return json({ error: "Pass phrase is required" }, 400);
    }

    passphrase = passphrase.trim();

    if (!passphrase) {
      return json({ error: "Pass phrase is required" }, 400);
    }

    if (passphrase.length > MAX_PASSPHRASE_LENGTH) {
      return json({ error: "Invalid pass phrase format" }, 400);
    }

    const expected = Deno.env.get("PROTOTYPE_PASS_PHRASE");
    if (!expected) {
      // Fail closed: without a configured phrase nobody is admitted.
      console.error("PROTOTYPE_PASS_PHRASE is not configured");
      return json({ error: "Pass phrase not configured" }, 503);
    }

    const valid = constantTimeEqual(passphrase, expected);
    console.log(`Prototype gate attempt from ${clientIP}: ${valid ? "admitted" : "refused"}`);

    return json({ valid }, 200);
  } catch (error) {
    console.error("Error in prototype-gate function:", error);
    return json({ error: "Internal server error" }, 500);
  }
});
