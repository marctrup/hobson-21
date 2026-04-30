import { Helmet } from "react-helmet-async";
import { useCrmAccess } from "@/hooks/crm/useCrmAccess";
import NotFound from "@/pages/NotFound";
import { ShieldAlert } from "lucide-react";

export default function CrmSettings() {
  const { isAdmin, isLoading } = useCrmAccess();

  if (isLoading) {
    return (
      <div className="p-6 text-sm text-slate-500">Loading…</div>
    );
  }

  // Settings is admin-only. Non-admin CRM users see 404 (we don't reveal existence).
  if (!isAdmin) return <NotFound />;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Helmet>
        <title>CRM Settings | Hobson</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <p className="text-sm text-slate-500 mt-1">
        Workspace and team management.
      </p>

      <div className="mt-6 grid gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center gap-2 text-sm font-medium">
            <ShieldAlert className="size-4 text-slate-500" />
            Team & roles
          </div>
          <p className="text-sm text-slate-500 mt-2">
            Invite teammates and manage CRM roles. Coming next phase.
          </p>
          <div className="mt-3 text-xs text-slate-500">
            For now, grant CRM roles via SQL:
            <pre className="mt-2 bg-slate-50 border border-slate-200 rounded p-3 overflow-x-auto text-[11px]">
{`INSERT INTO public.user_roles (user_id, role)
SELECT id, 'crm_write'::public.app_role
  FROM auth.users WHERE email = 'writer@example.com'
ON CONFLICT (user_id, role) DO NOTHING;`}
            </pre>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="text-sm font-medium">Workspace</div>
          <p className="text-sm text-slate-500 mt-2">
            Single-workspace mode. Multi-workspace support is planned.
          </p>
        </div>
      </div>
    </div>
  );
}
