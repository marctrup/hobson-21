// CRM ingest endpoint for website form submissions.
// Called server-side by send-contact-message and send-pilot-application.
// Auth: HMAC-SHA256 of the raw body using WEBSITE_INGEST_SECRET, sent as X-Ingest-Signature header.
// Fail-soft: any internal failure logs to crm_ingest_failures and returns 200 so the website flow continues.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-ingest-signature, x-idempotency-key",
};

type FormType = "website";

interface IngestPayload {
  form_type: FormType;
  submitted_at: string;
  idempotency_key: string;
  contact: {
    name: string;
    email: string;
    phone?: string | null;
    company?: string | null;
    role?: string | null;
  };
  payload: Record<string, unknown>;
  confirmation_email?: {
    sent: boolean;
    subject?: string;
    error?: string | null;
  };
}

async function hmacHex(secret: string, body: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(body));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const rawBody = await req.text();
  const sigHeader = req.headers.get("x-ingest-signature") ?? "";
  const secret = Deno.env.get("WEBSITE_INGEST_SECRET");

  if (!secret) {
    console.error("WEBSITE_INGEST_SECRET not configured");
    return new Response(JSON.stringify({ error: "Server misconfigured" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const expected = await hmacHex(secret, rawBody);
  if (!timingSafeEqual(expected, sigHeader)) {
    console.warn("Invalid HMAC signature on ingest");
    return new Response(JSON.stringify({ error: "Invalid signature" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: IngestPayload;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Helper: log failure but always succeed back to caller.
  const logFailure = async (reason: string, err: unknown) => {
    console.error("CRM ingest failure:", reason, err);
    try {
      await supabase.from("crm_ingest_failures").insert({
        source: `website:${body?.form_type ?? "unknown"}`,
        payload: body as unknown as Record<string, unknown>,
        error_message: `${reason}: ${err instanceof Error ? err.message : String(err)}`,
      });
    } catch (logErr) {
      console.error("Could not even log failure:", logErr);
    }
  };

  try {
    // Idempotency: 5-minute window keyed by (scope, key)
    const idemScope = "website_ingest";
    if (body.idempotency_key) {
      const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const { data: existing } = await supabase
        .from("crm_idempotency_keys")
        .select("result, created_at")
        .eq("scope", idemScope)
        .eq("key", body.idempotency_key)
        .gt("created_at", fiveMinAgo)
        .maybeSingle();
      if (existing) {
        return new Response(JSON.stringify({ ok: true, deduplicated: true, ...(existing.result as object) }), {
          status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Workspace settings (system user + default owner)
    const { data: settings, error: settingsErr } = await supabase
      .from("crm_workspace_settings")
      .select("website_system_user_id, default_owner_id")
      .limit(1)
      .maybeSingle();
    if (settingsErr || !settings) throw settingsErr ?? new Error("Workspace settings missing");

    const email = body.contact.email.trim().toLowerCase();
    const name = body.contact.name?.trim() || email;
    const company = body.contact.company?.trim() || null;
    const clientType = company ? "business" : "individual";
    const displayName = company ?? name;

    // Find existing client by email (case-insensitive). Otherwise create one.
    const { data: existingClient, error: lookupErr } = await supabase
      .from("crm_clients")
      .select("id")
      .ilike("email", email)
      .limit(1)
      .maybeSingle();
    if (lookupErr) throw lookupErr;

    let clientId: string;
    if (existingClient) {
      clientId = existingClient.id;
    } else {
      const { data: newClient, error: createErr } = await supabase
        .from("crm_clients")
        .insert({
          name: displayName,
          client_type: clientType,
          email,
          phone: body.contact.phone ?? null,
          primary_contact_name: name,
          primary_contact_email: email,
          primary_contact_phone: body.contact.phone ?? null,
          primary_contact_role: body.contact.role ?? null,
          owner_id: settings.default_owner_id,
          form_source: "website_application",
          origin_metadata: body.payload,
          pipeline_stage: "new_enquiry",
          status: "active",
          priority: "medium",
          first_contact_date: new Date(body.submitted_at).toISOString().slice(0, 10),
          lead_source: "website",
          lead_source_detail: "Website application form",
        })
        .select("id")
        .single();
      if (createErr) throw createErr;
      clientId = newClient.id;
    }

    // Build communication body. Render payload as a readable summary.
    const subject = `Website enquiry from ${name}`;
    const summary = `Website application submitted by ${name} (${email}).`;

    const lines: string[] = [];
    for (const [k, v] of Object.entries(body.payload)) {
      if (v === undefined || v === null || v === "") continue;
      const val = Array.isArray(v) ? v.join(", ") : typeof v === "object" ? JSON.stringify(v) : String(v);
      lines.push(`${k}: ${val}`);
    }
    const bodyPlain = lines.join("\n");

    const needsReview = !(body.confirmation_email?.sent ?? true);

    // Insert communication directly (service role bypasses RLS).
    const { data: comm, error: commErr } = await supabase
      .from("communications")
      .insert({
        client_id: clientId,
        channel: "website_form",
        direction: "inbound",
        subject,
        summary,
        body_plain: bodyPlain,
        occurred_at: body.submitted_at,
        logged_by: settings.website_system_user_id,
        email_from: email,
        email_to: ["info@hobsonschoice.ai"],
        needs_review: needsReview,
        pending_follow_up_note: needsReview
          ? `Website confirmation email failed to send: ${body.confirmation_email?.error ?? "unknown"}`
          : null,
      })
      .select("id")
      .single();
    if (commErr) throw commErr;

    // Record outbound confirmation email as a separate communication if it was sent.
    if (body.confirmation_email?.sent) {
      await supabase.from("communications").insert({
        client_id: clientId,
        channel: "email",
        direction: "outbound",
        subject: body.confirmation_email.subject ?? "Website confirmation",
        summary: "Automated confirmation email sent in response to website form submission.",
        occurred_at: body.submitted_at,
        logged_by: settings.website_system_user_id,
        email_from: "noreply@hobsonschoice.ai",
        email_to: [email],
      });
    }

    // Idempotency record
    if (body.idempotency_key) {
      await supabase.from("crm_idempotency_keys").insert({
        scope: idemScope,
        key: body.idempotency_key,
        result: { client_id: clientId, communication_id: comm.id },
      });
    }

    return new Response(JSON.stringify({ ok: true, client_id: clientId, communication_id: comm.id }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    await logFailure("ingest_failed", err);
    // Fail-soft: still return 200 so the website form completes successfully for the user.
    return new Response(JSON.stringify({ ok: false, logged: true }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
