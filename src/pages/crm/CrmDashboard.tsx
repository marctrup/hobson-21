import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Users, TrendingUp, AlertCircle, Activity } from "lucide-react";
import { CrmLayout } from "@/components/crm/CrmLayout";
import { supabase } from "@/integrations/supabase/client";
import { formatDateUK } from "@/lib/crm/labels";
import { StageBadge } from "@/components/crm/StageBadge";

const SummaryCard = ({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Users;
  label: string;
  value: string | number;
  hint?: string;
}) => (
  <div className="bg-white border border-slate-200 rounded-lg p-4">
    <div className="flex items-center gap-2 text-slate-500 text-xs font-medium uppercase tracking-wide">
      <Icon className="size-4" />
      {label}
    </div>
    <div className="mt-2 text-2xl font-semibold text-slate-900">{value}</div>
    {hint && <div className="text-xs text-slate-500 mt-1">{hint}</div>}
  </div>
);

export default function CrmDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["crm-dashboard-summary"],
    queryFn: async () => {
      const [{ count: total }, { count: active }, { count: hot }, { data: recent }] =
        await Promise.all([
          supabase.from("crm_clients").select("*", { count: "exact", head: true }),
          supabase
            .from("crm_clients")
            .select("*", { count: "exact", head: true })
            .eq("status", "active"),
          supabase
            .from("crm_clients")
            .select("*", { count: "exact", head: true })
            .eq("interest_level", "hot"),
          supabase
            .from("crm_clients")
            .select("id, name, segment, pipeline_stage, updated_at")
            .order("updated_at", { ascending: false })
            .limit(8),
        ]);
      return {
        total: total ?? 0,
        active: active ?? 0,
        hot: hot ?? 0,
        recent: recent ?? [],
      };
    },
  });

  return (
    <CrmLayout>
      <Helmet>
        <title>CRM Dashboard | Hobson</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Snapshot of your client portfolio and recent activity.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <SummaryCard
            icon={Users}
            label="Total clients"
            value={isLoading ? "…" : data?.total ?? 0}
          />
          <SummaryCard
            icon={Activity}
            label="Active clients"
            value={isLoading ? "…" : data?.active ?? 0}
          />
          <SummaryCard
            icon={TrendingUp}
            label="Hot leads"
            value={isLoading ? "…" : data?.hot ?? 0}
          />
          <SummaryCard
            icon={AlertCircle}
            label="Open issues"
            value="—"
            hint="Coming next phase"
          />
        </div>

        <div className="mt-8 bg-white border border-slate-200 rounded-lg">
          <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-medium">Recently updated clients</h2>
            <Link to="/crm/clients" className="text-sm text-slate-600 hover:text-slate-900">
              View all →
            </Link>
          </div>
          {isLoading ? (
            <div className="p-6 text-sm text-slate-500">Loading…</div>
          ) : !data?.recent.length ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No clients yet.{" "}
              <Link to="/crm/clients/new" className="text-slate-900 underline">
                Add your first client
              </Link>
              .
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {data.recent.map((c) => (
                <li key={c.id}>
                  <Link
                    to={`/crm/clients/${c.id}`}
                    className="flex items-center justify-between px-4 py-3 hover:bg-slate-50"
                  >
                    <div>
                      <div className="font-medium text-sm">{c.name}</div>
                      <div className="text-xs text-slate-500">
                        Updated {formatDateUK(c.updated_at)}
                      </div>
                    </div>
                    <StageBadge stage={c.pipeline_stage} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </CrmLayout>
  );
}
