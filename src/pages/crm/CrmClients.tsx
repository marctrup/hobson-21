import { Helmet } from "react-helmet-async";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { Search, Plus } from "lucide-react";
import { useCrmAccess } from "@/hooks/crm/useCrmAccess";

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
  SEGMENT_KEYS,
  PIPELINE_STAGES,
  PIPELINE_STAGE_LABELS,
  CLIENT_STATUSES,
  CLIENT_STATUS_LABELS,
  formatDateUK,
} from "@/lib/crm/labels";
import { StageBadge } from "@/components/crm/StageBadge";
import { InterestBadge } from "@/components/crm/InterestBadge";
import { useSubSectors } from "@/hooks/crm/useSubSectors";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CrmClients() {
  // CrmLayout is the parent route — do NOT wrap children in <CrmLayout> here.
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [sector, setSector] = useState<string>("all");
  const [subSectorIds, setSubSectorIds] = useState<string[]>([]);
  const navigate = useNavigate();
  const { canWrite } = useCrmAccess();
  const { data: allSubSectors } = useSubSectors();

  // Reset selected sub-sectors when sector filter changes (other than "all").
  const onSectorChange = (next: string) => {
    setSector(next);
    if (next === "all") return;
    const valid = new Set(
      (allSubSectors ?? []).filter((s) => s.sector === next).map((s) => s.id),
    );
    setSubSectorIds((prev) => prev.filter((id) => valid.has(id)));
  };

  // Restrict the sub-sector filter options to those for the selected sector.
  // When sector === "all", show every sub-sector grouped by sector.
  const subSectorOptions = useMemo(() => {
    if (!allSubSectors) return [];
    return sector === "all"
      ? allSubSectors
      : allSubSectors.filter((s) => s.sector === sector);
  }, [allSubSectors, sector]);

  const { data: clients, isLoading } = useQuery({
    queryKey: ["crm-clients", search, stage, status, sector, subSectorIds.join(",")],
    queryFn: async () => {
      let q = supabase
        .from("crm_clients")
        .select(
          "id,name,segment,pipeline_stage,interest_level,status,last_contact_date,owner_id,crm_client_sub_sectors(sub_sector_id)",
        )
        .order("updated_at", { ascending: false });

      if (search.trim()) {
        const term = `%${search.trim()}%`;
        q = q.or(`name.ilike.${term},email.ilike.${term},primary_contact_email.ilike.${term}`);
      }
      if (stage !== "all") q = q.eq("pipeline_stage", stage);
      if (status !== "all") q = q.eq("status", status);
      if (sector !== "all") q = q.eq("segment", sector);

      const { data, error } = await q;
      if (error) throw error;

      // OR-semantics filter for sub-sectors (client matches if it has ANY of the picked ids).
      const filtered = subSectorIds.length
        ? (data ?? []).filter((c: any) => {
            const ids = (c.crm_client_sub_sectors ?? []).map(
              (l: { sub_sector_id: string }) => l.sub_sector_id,
            );
            return subSectorIds.some((id) => ids.includes(id));
          })
        : data;
      return filtered ?? [];
    },
  });

  // For rendering chips in the table.
  const subSectorById = useMemo(() => {
    const map = new Map<string, { label: string; sort_order: number }>();
    (allSubSectors ?? []).forEach((s) =>
      map.set(s.id, { label: s.label, sort_order: s.sort_order }),
    );
    return map;
  }, [allSubSectors]);

  return (
    <>
      <Helmet>
        <title>Clients | CRM</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Clients</h1>
            <p className="text-sm text-slate-500 mt-1 hidden md:block">
              Every business and individual you work with.
            </p>
          </div>
        </div>

        {/* ========== Mobile view ========== */}
        <MobileClientsList
          search={search}
          setSearch={setSearch}
          clients={clients ?? []}
          isLoading={isLoading}
          canWrite={canWrite}
          onNew={() => navigate("/crm/clients/new")}
        />

        {/* ========== Desktop view ========== */}
        <div className="hidden md:block">
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
                    ? "bg-primary/10 text-primary border-primary/30"
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
          <Select value={sector} onValueChange={onSectorChange}>
            <SelectTrigger className="w-[200px] bg-white">
              <SelectValue placeholder="Sector" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sectors</SelectItem>
              {SEGMENT_KEYS.map((k) => (
                <SelectItem key={k} value={k}>
                  {SEGMENT_LABELS[k]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <SubSectorFilter
            options={subSectorOptions}
            value={subSectorIds}
            onChange={setSubSectorIds}
            scopedToSector={sector !== "all"}
          />
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
                <th className="text-left px-4 py-2 font-medium">Sector</th>
                <th className="text-left px-4 py-2 font-medium">Sub-sectors</th>
                <th className="text-left px-4 py-2 font-medium">Stage</th>
                <th className="text-left px-4 py-2 font-medium">Interest</th>
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
                clients.map((c: any) => {
                  const ids: string[] = (c.crm_client_sub_sectors ?? []).map(
                    (l: { sub_sector_id: string }) => l.sub_sector_id,
                  );
                  const labels = ids
                    .map((id) => subSectorById.get(id))
                    .filter((v): v is { label: string; sort_order: number } => !!v)
                    .sort((a, b) => a.sort_order - b.sort_order || a.label.localeCompare(b.label))
                    .map((v) => v.label);
                  return (
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
                        {labels.length === 0 ? (
                          <span className="text-slate-400">—</span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {labels.map((l) => (
                              <span
                                key={l}
                                className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700"
                              >
                                {l}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <StageBadge stage={c.pipeline_stage} />
                      </td>
                      <td className="px-4 py-3">
                        <InterestBadge level={c.interest_level} />
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {formatDateUK(c.last_contact_date)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ------------------------ Sub-sector filter dropdown ------------------------ */

interface FilterProps {
  options: { id: string; sector: string; label: string; sort_order: number }[];
  value: string[];
  onChange: (next: string[]) => void;
  scopedToSector: boolean;
}

function SubSectorFilter({ options, value, onChange, scopedToSector }: FilterProps) {
  const selectedSet = new Set(value);
  const summary =
    value.length === 0
      ? "All sub-sectors"
      : value.length === 1
        ? options.find((o) => o.id === value[0])?.label ?? "1 selected"
        : `${value.length} selected`;

  // Group by sector when not scoped (i.e. "All sectors" filter).
  const grouped = scopedToSector
    ? [{ sector: options[0]?.sector ?? "", items: options }]
    : Array.from(
        options.reduce((map, o) => {
          if (!map.has(o.sector)) map.set(o.sector, []);
          map.get(o.sector)!.push(o);
          return map;
        }, new Map<string, typeof options>()),
      ).map(([sector, items]) => ({ sector, items }));

  const toggle = (id: string) => {
    if (selectedSet.has(id)) onChange(value.filter((v) => v !== id));
    else onChange([...value, id]);
  };

  const disabled = options.length === 0;

  return (
    <Popover>
      <PopoverTrigger asChild disabled={disabled}>
        <button
          type="button"
          className={cn(
            "flex h-10 w-[200px] items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm",
            "ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          <span className={cn("truncate text-left", value.length === 0 && "text-muted-foreground")}>
            {summary}
          </span>
          <ChevronDown className="ml-2 size-4 opacity-50 shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[260px] p-1" align="start">
        {options.length === 0 ? (
          <div className="px-3 py-2 text-sm text-muted-foreground">No sub-sectors.</div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {value.length > 0 && (
              <button
                type="button"
                onClick={() => onChange([])}
                className="w-full text-left px-2 py-1.5 text-xs text-slate-500 hover:bg-accent rounded-sm"
              >
                Clear selection
              </button>
            )}
            {grouped.map(({ sector, items }) => (
              <div key={sector} className="py-1">
                {!scopedToSector && (
                  <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    {SEGMENT_LABELS[sector] ?? sector}
                  </div>
                )}
                <ul>
                  {items.map((o) => {
                    const checked = selectedSet.has(o.id);
                    return (
                      <li key={o.id}>
                        <button
                          type="button"
                          onClick={() => toggle(o.id)}
                          className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent text-left"
                        >
                          <Checkbox checked={checked} className="pointer-events-none" />
                          <span className="flex-1">{o.label}</span>
                          {checked && <Check className="size-4 text-primary" />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
