import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useCrmAccess } from "@/hooks/crm/useCrmAccess";
import NotFound from "@/pages/NotFound";
import { Users, Building2, ChevronRight } from "lucide-react";

export default function CrmSettings() {
  const { isAdmin, isLoading } = useCrmAccess();

  if (isLoading) {
    return <div className="p-6 text-sm text-slate-500">Loading…</div>;
  }
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

      <div className="mt-6 grid gap-3">
        <Link
          to="/crm/settings/team"
          className="bg-white border border-slate-200 rounded-lg p-5 flex items-center gap-4 hover:border-slate-300 hover:shadow-sm transition"
        >
          <Users className="size-5 text-slate-500" />
          <div className="flex-1">
            <div className="text-sm font-medium">Team & roles</div>
            <p className="text-sm text-slate-500 mt-0.5">
              Invite teammates, change roles, and revoke access.
            </p>
          </div>
          <ChevronRight className="size-4 text-slate-400" />
        </Link>

        <div className="bg-white border border-slate-200 rounded-lg p-5 flex items-center gap-4 opacity-60">
          <Building2 className="size-5 text-slate-500" />
          <div className="flex-1">
            <div className="text-sm font-medium">Workspace</div>
            <p className="text-sm text-slate-500 mt-0.5">
              Single-workspace mode. Multi-workspace support is planned.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
