// Admin-only: create a CRM invitation, email it, return the invite id.
// Verifies JWT in code, checks admin role, stores SHA-256 token hash only.

import {
  corsHeaders,
  jsonResponse,
  getCaller,
  isAdmin,
  serviceClient,
  sha256Hex,
  generateToken,
} from "../_shared/crm-auth.ts";

const ALLOWED_ROLES = new Set(["admin", "crm_write", "crm_read"]);
const APP_ORIGIN = "https://hobsonschoice.ai";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

interface InviteBody {
  email?: string;
  role?: string;
}

async function sendInviteEmail(
  toEmail: string,
  role: string,
  acceptUrl: string,
  inviterEmail: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!RESEND_API_KEY) {
    return { ok: false, error: "RESEND_API_KEY not configured" };
  }

  const roleLabel =
    role === "admin"
      ? "Admin"
      : role === "crm_write"
      ? "Editor (read & write)"
      : "Viewer (read-only)";

  const subject = `You've been invited to the Hobson AI CRM`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #0f172a;">
      <h1 style="font-size: 22px; margin: 0 0 16px;">You've been invited to the Hobson AI CRM</h1>
      <p style="font-size: 15px; line-height: 1.6;">
        ${inviterEmail} has invited you to join the Hobson AI CRM as
        <strong>${roleLabel}</strong>.
      </p>
      <p style="margin: 24px 0;">
        <a href="${acceptUrl}"
           style="background: #0f172a; color: #ffffff; padding: 12px 20px;
                  border-radius: 6px; text-decoration: none; display: inline-block;
                  font-weight: 600;">
          Accept invitation
        </a>
      </p>
      <p style="font-size: 13px; color: #64748b; line-height: 1.6;">
        This invitation expires in 7 days. If the button doesn't work, paste
        this link into your browser:<br>
        <span style="word-break: break-all;">${acceptUrl}</span>
      </p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
      <p style="font-size: 12px; color: #94a3b8;">
        If you weren't expecting this invitation you can safely ignore this email.
      </p>
    </div>
  `;

  const senders = [
    "Hobson AI Team <team@hobsonschoice.ai>",
    "Hobson AI <noreply@hobsonschoice.ai>",
  ];
  let lastError = "";
  for (const from of senders) {
    try {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [toEmail],
          reply_to: "info@hobsonschoice.ai",
          subject,
          html,
        }),
      });
      if (r.ok) return { ok: true };
      lastError = `${r.status}: ${await r.text()}`;
      console.warn(`Resend send failed via ${from}:`, lastError);
    } catch (e) {
      lastError = e instanceof Error ? e.message : String(e);
      console.warn(`Resend send threw via ${from}:`, lastError);
    }
  }
  return { ok: false, error: lastError };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  // Auth + admin check
  const caller = await getCaller(req);
  if (!caller) return jsonResponse({ error: "Unauthorized" }, 401);
  if (!(await isAdmin(caller.userId))) {
    return jsonResponse({ error: "Forbidden" }, 403);
  }

  let body: InviteBody;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400);
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const role = (body.role ?? "").trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonResponse({ error: "A valid email is required" }, 400);
  }
  if (!ALLOWED_ROLES.has(role)) {
    return jsonResponse(
      { error: "Role must be admin, crm_write, or crm_read" },
      400,
    );
  }

  const svc = serviceClient();

  // Already a CRM member? Block — admin should use change-role instead.
  const { data: existingUserId } = await svc.rpc("crm_find_user_id_by_email", {
    p_email: email,
  });
  if (existingUserId) {
    const { data: existingRoles } = await svc
      .from("user_roles")
      .select("role")
      .eq("user_id", existingUserId)
      .in("role", ["admin", "crm_write", "crm_read"]);
    if (existingRoles && existingRoles.length > 0) {
      return jsonResponse(
        {
          error:
            "This user is already a CRM member. Use Change role instead of inviting them again.",
        },
        409,
      );
    }
  }

  // Supersede any existing pending invite for the same email.
  await svc
    .from("crm_invitations")
    .update({ status: "revoked" })
    .eq("status", "pending")
    .ilike("email", email);

  // Generate token + hash
  const rawToken = generateToken();
  const tokenHash = await sha256Hex(rawToken);

  const { data: insertRow, error: insertErr } = await svc
    .from("crm_invitations")
    .insert({
      email,
      role,
      token_hash: tokenHash,
      invited_by: caller.userId,
      status: "pending",
    })
    .select("id, email, role, expires_at")
    .single();

  if (insertErr || !insertRow) {
    console.error("Failed to insert invitation", insertErr);
    return jsonResponse({ error: "Failed to create invitation" }, 500);
  }

  const acceptUrl = `${APP_ORIGIN}/crm/accept-invite?token=${encodeURIComponent(rawToken)}`;

  const sendResult = await sendInviteEmail(
    email,
    role,
    acceptUrl,
    caller.email || "An admin",
  );

  // Best-effort logging (non-fatal)
  try {
    await svc.from("email_send_log").insert({
      recipient_email: email,
      email_type: "crm_invitation",
      subject: "You've been invited to the Hobson AI CRM",
      status: sendResult.ok ? "sent" : "failed",
      error_message: sendResult.ok ? null : sendResult.error ?? null,
    });
  } catch (e) {
    console.warn("email_send_log insert failed", e);
  }

  return jsonResponse({
    success: true,
    invitation: insertRow,
    email_sent: sendResult.ok,
    email_error: sendResult.ok ? null : sendResult.error ?? null,
  });
});
