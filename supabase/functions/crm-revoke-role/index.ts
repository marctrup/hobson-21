// Admin-only: remove all CRM roles from a user. The base 'user' role stays.
// The prevent_zero_admins trigger blocks revoking the last admin.

import {
  corsHeaders,
  jsonResponse,
  getCaller,
  isAdmin,
  serviceClient,
  logRoleAction,
} from "../_shared/crm-auth.ts";

const CRM_ROLES = ["admin", "crm_write", "crm_read"];

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

  let body: { user_id?: string };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400);
  }

  const userId = (body.user_id ?? "").trim();
  if (!userId) return jsonResponse({ error: "user_id is required" }, 400);

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

  const { error } = await svc
    .from("user_roles")
    .delete()
    .eq("user_id", userId)
    .in("role", CRM_ROLES);

  if (error) {
    console.error("Revoke failed", error);
    return jsonResponse(
      {
        error:
          error.message ||
          "Could not revoke access (you may be trying to revoke the last admin).",
      },
      400,
    );
  }

  // Audit: explicit actor (the admin performing the revocation).
  await logRoleAction({
    actorUserId: caller.userId,
    action: "CRM_ROLE_REVOKED",
    targetUserId: userId,
    oldRole,
  });

  return jsonResponse({ success: true });
});
