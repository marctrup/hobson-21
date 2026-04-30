// Shared helper: post a website form submission to crm-ingest-website with HMAC.
// Fail-soft: never throws. Returns { ok: boolean }.

type FormType = "website";

interface IngestArgs {
  formType: FormType;
  contact: {
    name: string;
    email: string;
    phone?: string | null;
    company?: string | null;
    role?: string | null;
  };
  payload: Record<string, unknown>;
  confirmationEmail?: { sent: boolean; subject?: string; error?: string | null };
  idempotencyKey?: string;
}

async function hmacHex(secret: string, body: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false, ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(body));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function postToCrmIngest(args: IngestArgs): Promise<{ ok: boolean }> {
  try {
    const secret = Deno.env.get("WEBSITE_INGEST_SECRET");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    if (!secret || !supabaseUrl) {
      console.warn("CRM ingest skipped: missing env");
      return { ok: false };
    }

    const body = JSON.stringify({
      form_type: args.formType,
      submitted_at: new Date().toISOString(),
      idempotency_key: args.idempotencyKey ?? crypto.randomUUID(),
      contact: args.contact,
      payload: args.payload,
      confirmation_email: args.confirmationEmail,
    });

    const sig = await hmacHex(secret, body);
    const url = `${supabaseUrl}/functions/v1/crm-ingest-website`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Ingest-Signature": sig,
        // Service-role auth so the call is allowed even if the function ever requires JWT.
        "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""}`,
      },
      body,
    });

    if (!res.ok) {
      console.warn("CRM ingest non-OK:", res.status, await res.text().catch(() => ""));
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    console.error("CRM ingest threw:", err);
    return { ok: false };
  }
}
