// Admin-only: replace a user's CRM role atomically (delete existing CRM
// roles for the user, insert the new one). The 'user' base role is left alone.

import {
  corsHeaders,
  jsonResponse,
  getCaller,
  isAdmin,
  serviceClient,
  logRoleAction,
} from "../_shared/crm-auth.ts";

const CRM_ROLES = ["admin", "crm_write", "crm_read"];

interface ChangeBody {
  user_id?: string;
  new_role?: string;
}

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
    return jsonResponse({ error: "Forbidden" }, 403);
  }

  let body: ChangeBody;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400);
  }

  const userId = (body.user_id ?? "").trim();
  const newRole = (body.new_role ?? "").trim();

  if (!userId) return jsonResponse({ error: "user_id is required" }, 400);
  if (!CRM_ROLES.includes(newRole)) {
    return jsonResponse(
      { error: "new_role must be admin, crm_write, or crm_read" },
      400,
    );
  }

  const svc = serviceClient();

  // Capture the user's existing CRM role (if any) for the audit log.
  const { data: existingRows } = await svc
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .in("role", CRM_ROLES);
  const oldRole =
    existingRows && existingRows.length > 0
      ? (existingRows[0] as { role: string }).role
      : null;

  // Insert the new role first if it's not already present, then delete the others.
  // Doing it in this order means the prevent_zero_admins trigger still sees a
  // valid admin while we delete the old admin row (if the caller is changing
  // themselves down — but DB will block that anyway if they're the last admin).
  const { error: insertErr } = await svc
    .from("user_roles")
    .insert({ user_id: userId, role: newRole });

  if (insertErr && !insertErr.message?.toLowerCase().includes("duplicate")) {
    console.error("Insert role failed", insertErr);
    return jsonResponse({ error: insertErr.message }, 400);
  }

  const { error: deleteErr } = await svc
    .from("user_roles")
    .delete()
    .eq("user_id", userId)
    .in("role", CRM_ROLES.filter((r) => r !== newRole));

  if (deleteErr) {
    // Likely the prevent_zero_admins trigger
    console.error("Delete old roles failed", deleteErr);
    // Roll back the insert we just did so we don't leave a duplicate.
    await svc
      .from("user_roles")
      .delete()
      .eq("user_id", userId)
      .eq("role", newRole);
    return jsonResponse(
      {
        error:
          deleteErr.message ||
          "Could not change role (you may be trying to demote the last admin).",
      },
      400,
    );
  }

  // Audit: explicit actor (the admin performing the change).
  await logRoleAction({
    actorUserId: caller.userId,
    action: oldRole ? "CRM_ROLE_CHANGED" : "CRM_ROLE_GRANTED",
    targetUserId: userId,
    newRole,
    oldRole,
  });

  return jsonResponse({ success: true });
});
