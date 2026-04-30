// Admin-only: rotate the website ingest secret.
//
// 1. Generate a fresh URL-safe random secret (~256 bits)
// 2. Compute its SHA-256 hex hash
// 3. Update crm_workspace_settings: hash + rotated_at = now()
// 4. Return the plaintext secret to the caller EXACTLY ONCE so they
//    can paste it into Lovable Cloud's WEBSITE_INGEST_SECRET secret.
//
// The plaintext secret is NEVER stored in the database — only the hash.
// Forensic trail: this admin action is recorded in security_audit_log
// via crm_log_role_action with the synthetic action 'CRM_SECRET_ROTATED'
// — no, actually crm_log_role_action only accepts role-related actions.
// We instead record via log_security_event from the DB function, but
// since we run via service role here we'll write directly to
// security_audit_log so the actor is preserved.

import {
  corsHeaders,
  jsonResponse,
  getCaller,
  isAdmin,
  serviceClient,
  generateToken,
  sha256Hex,
} from "../_shared/crm-auth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const caller = await getCaller(req);
  if (!caller) return jsonResponse({ error: "Unauthorized" }, 401);
  if (!(await isAdmin(caller.userId))) {
    return jsonResponse({ error: "Forbidden — admin role required" }, 403);
  }

  // 1. Generate the new secret + hash
  const plaintext = generateToken(); // 43-char URL-safe, ~256 bits
  const hash = await sha256Hex(plaintext);
  const rotatedAt = new Date().toISOString();

  // 2. Update the singleton workspace settings row via service role
  const svc = serviceClient();
  const { error: updateErr } = await svc
    .from("crm_workspace_settings")
    .update({
      website_ingest_secret_hash: hash,
      website_ingest_secret_rotated_at: rotatedAt,
    })
    .eq("singleton", true);

  if (updateErr) {
    console.error("Failed to update workspace settings", updateErr);
    return jsonResponse(
      { error: "Failed to rotate secret. Please try again." },
      500,
    );
  }

  // 3. Audit log: write to security_audit_log directly so the acting
  //    admin's user_id is preserved (service role context has no auth.uid()).
  try {
    await svc.from("security_audit_log").insert({
      user_id: caller.userId,
      action: "CRM_WEBSITE_INGEST_SECRET_ROTATED",
      table_name: "crm_workspace_settings",
      new_values: {
        rotated_at: rotatedAt,
        actor_email: caller.email,
      },
    });
  } catch (e) {
    // Best-effort: don't fail the rotation if audit log write fails
    console.error("Audit log write failed (non-fatal)", e);
  }

  // 4. Return the plaintext secret. CALLER MUST DISPLAY IT EXACTLY ONCE.
  return jsonResponse({
    success: true,
    secret: plaintext,
    rotated_at: rotatedAt,
  });
});
