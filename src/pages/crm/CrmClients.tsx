import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { CrmLayout } from "@/components/crm/CrmLayout";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import {
  SEGMENT_LABELS,
  PIPELINE_STAGES,
  PIPELINE_STAGE_LABELS,
  CLIENT_STATUSES,
  CLIENT_STATUS_LABELS,
  formatDateUK,
  formatGBP,
} from "@/lib/crm/labels";
import { StageBadge } from "@/components/crm/StageBadge";
import { InterestBadge } from "@/components/crm/InterestBadge";

export default function CrmClients() {
  // CrmLayout is the parent route — do NOT wrap children in <CrmLayout> here.
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");

  const { data: clients, isLoading } = useQuery({
    queryKey: ["crm-clients", search, stage, status],
    queryFn: async () => {
      let q = supabase
        .from("crm_clients")
        .select(
          "id,name,segment,pipeline_stage,interest_level,status,last_contact_date,estimated_deal_value_gbp,owner_id",
        )
        .order("updated_at", { ascending: false });

      if (search.trim()) {
        const term = `%${search.trim()}%`;
        q = q.or(`name.ilike.${term},email.ilike.${term},primary_contact_email.ilike.${term}`);
      }
      if (stage !== "all") q = q.eq("pipeline_stage", stage);
      if (status !== "all") q = q.eq("status", status);

      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });

  return (
    <CrmLayout>
      <Helmet>
        <title>Clients | CRM</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Clients</h1>
            <p className="text-sm text-slate-500 mt-1">
              Every business and individual you work with.
            </p>
          </div>
        </div>

        {/* Quick views */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {(
            [
              { key: "all", label: "All clients" },
              { key: "active", label: "Active" },
              { key: "on_hold", label: "On hold" },
            ] as const
          ).map((view) => {
            const active = status === view.key;
            return (
              <button
                key={view.key}
                type="button"
                onClick={() => setStatus(view.key)}
                className={
                  "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors " +
                  (active
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50")
                }
                aria-pressed={active}
              >
                {view.label}
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or email"
              className="pl-8 bg-white"
            />
          </div>
          <Select value={stage} onValueChange={setStage}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Pipeline stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All stages</SelectItem>
              {PIPELINE_STAGES.map((s) => (
                <SelectItem key={s} value={s}>
                  {PIPELINE_STAGE_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[160px] bg-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {CLIENT_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {CLIENT_STATUS_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4 bg-white border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Name</th>
                <th className="text-left px-4 py-2 font-medium">Segment</th>
                <th className="text-left px-4 py-2 font-medium">Stage</th>
                <th className="text-left px-4 py-2 font-medium">Interest</th>
                <th className="text-left px-4 py-2 font-medium">Deal value</th>
                <th className="text-left px-4 py-2 font-medium">Last contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-500">
                    Loading…
                  </td>
                </tr>
              ) : !clients?.length ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No clients match your filters.{" "}
                    <Link
                      to="/crm/clients/new"
                      className="text-slate-900 underline ml-1"
                    >
                      Add a client
                    </Link>
                    .
                  </td>
                </tr>
              ) : (
                clients.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <Link
                        to={`/crm/clients/${c.id}`}
                        className="font-medium text-slate-900 hover:underline"
                      >
                        {c.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {SEGMENT_LABELS[c.segment] ?? c.segment}
                    </td>
                    <td className="px-4 py-3">
                      <StageBadge stage={c.pipeline_stage} />
                    </td>
                    <td className="px-4 py-3">
                      <InterestBadge level={c.interest_level} />
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatGBP(c.estimated_deal_value_gbp)}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {formatDateUK(c.last_contact_date)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </CrmLayout>
  );
}
