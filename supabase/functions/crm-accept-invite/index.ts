// Auth-required (any signed-in user): accept a CRM invitation.
// Validates token hash, confirms invited email matches caller's email,
// inserts the role into user_roles, marks the invite accepted.

import {
  corsHeaders,
  jsonResponse,
  getCaller,
  serviceClient,
  sha256Hex,
  logRoleAction,
} from "../_shared/crm-auth.ts";

interface AcceptBody {
  token?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const caller = await getCaller(req);
  if (!caller) {
    return jsonResponse(
      { error: "You must be signed in to accept an invitation." },
      401,
    );
  }

  let body: AcceptBody;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid request" }, 400);
  }

  const rawToken = (body.token ?? "").trim();
  if (!rawToken) {
    return jsonResponse({ error: "Missing invitation token" }, 400);
  }

  const tokenHash = await sha256Hex(rawToken);
  const svc = serviceClient();

  const { data: invite, error: lookupErr } = await svc
    .from("crm_invitations")
    .select("id, email, role, status, expires_at")
    .eq("token_hash", tokenHash)
    .maybeSingle();

  if (lookupErr) {
    console.error("Invite lookup failed", lookupErr);
    return jsonResponse({ error: "Could not validate invitation" }, 500);
  }
  if (!invite) {
    return jsonResponse(
      { error: "This invitation link is invalid or has already been used." },
      404,
    );
  }

  if (invite.status === "accepted") {
    return jsonResponse(
      { error: "This invitation has already been accepted." },
      409,
    );
  }
  if (invite.status === "revoked") {
    return jsonResponse(
      { error: "This invitation has been revoked." },
      410,
    );
  }
  if (new Date(invite.expires_at).getTime() < Date.now()) {
    await svc
      .from("crm_invitations")
      .update({ status: "expired" })
      .eq("id", invite.id);
    return jsonResponse(
      { error: "This invitation has expired. Please ask for a new one." },
      410,
    );
  }

  // Email-match check (case-insensitive)
  if (caller.email.toLowerCase() !== invite.email.toLowerCase()) {
    return jsonResponse(
      {
        error: "email_mismatch",
        invited_email: invite.email,
        message: `This invitation was sent to ${invite.email}. Please sign in or sign up with that email address.`,
      },
      403,
    );
  }

  // Replace any existing CRM role for this user with the invited role.
  // (Uses caller's id; the prevent_zero_admins trigger guards demotion.)
  const { error: deleteErr } = await svc
    .from("user_roles")
    .delete()
    .eq("user_id", caller.userId)
    .in("role", ["admin", "crm_write", "crm_read"]);
  if (deleteErr) {
    console.error("Failed to clear existing CRM role", deleteErr);
    return jsonResponse({ error: "Could not assign role" }, 500);
  }

  const { error: insertErr } = await svc
    .from("user_roles")
    .insert({ user_id: caller.userId, role: invite.role });
  if (insertErr) {
    // Possible if a duplicate (user_id, role) exists; treat as success.
    if (!insertErr.message?.toLowerCase().includes("duplicate")) {
      console.error("Failed to insert role", insertErr);
      return jsonResponse({ error: "Could not assign role" }, 500);
    }
  }

  const { error: markErr } = await svc
    .from("crm_invitations")
    .update({
      status: "accepted",
      accepted_by: caller.userId,
      accepted_at: new Date().toISOString(),
    })
    .eq("id", invite.id);
  if (markErr) {
    console.warn("Could not mark invite accepted", markErr);
  }

  // Audit: explicit actor (the accepting user themselves).
  await logRoleAction({
    actorUserId: caller.userId,
    action: "CRM_INVITE_ACCEPTED",
    targetUserId: caller.userId,
    newRole: invite.role,
    metadata: { invitation_id: invite.id, invited_email: invite.email },
  });

  return jsonResponse({ success: true, role: invite.role });
});
