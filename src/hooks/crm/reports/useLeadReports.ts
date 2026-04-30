// Lead acquisition hooks:
// - useNewEnquiriesOverTime (stacked by form_source)
// - useLeadSourceMix

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useReportsFilters } from "@/components/crm/reports/ReportsFiltersContext";
import { LEAD_SOURCE_LABELS } from "@/lib/crm/labels";

const FORM_SOURCE_LABELS: Record<string, string> = {
  website_application: "Website",
  manual: "Manual",
  imported: "Imported",
};

export interface EnquiryStackPoint {
  label: string;
  [key: string]: string | number;
}

export interface EnquiryStackResult {
  points: EnquiryStackPoint[];
  sources: { key: string; label: string }[];
}

export const useNewEnquiriesOverTime = () => {
  const { startDate, endDate, ownerId, buckets, bucket } = useReportsFilters();
  return useQuery({
    queryKey: [
      "report-new-enquiries",
      startDate.toISOString(),
      endDate.toISOString(),
      ownerId,
      bucket,
    ],
    queryFn: async (): Promise<EnquiryStackResult> => {
      let q = supabase
        .from("crm_clients")
        .select("created_at,form_source,owner_id")
        .gte("created_at", startDate.toISOString())
        .lt("created_at", endDate.toISOString())
        .limit(1000);
      if (ownerId !== "all") q = q.eq("owner_id", ownerId);
      const { data, error } = await q;
      if (error) throw error;

      const sourceSet = new Set<string>();
      for (const r of data ?? []) {
        sourceSet.add((r.form_source as string) ?? "manual");
      }
      const sources = Array.from(sourceSet)
        .sort()
        .map((k) => ({
          key: k,
          label: FORM_SOURCE_LABELS[k] ?? k,
        }));

      const points = buckets.map((b) => {
        const pt: EnquiryStackPoint = { label: b.label };
        for (const s of sources) pt[s.key] = 0;
        for (const r of data ?? []) {
          const t = new Date(r.created_at).getTime();
          if (t >= b.start.getTime() && t < b.end.getTime()) {
            const k = (r.form_source as string) ?? "manual";
            pt[k] = (Number(pt[k]) || 0) + 1;
          }
        }
        return pt;
      });

      return { points, sources };
    },
  });
};

export interface LeadSourceRow {
  key: string;
  label: string;
  count: number;
}

export const useLeadSourceMix = () => {
  const { startDate, endDate, ownerId } = useReportsFilters();
  return useQuery({
    queryKey: [
      "report-lead-source-mix",
      startDate.toISOString(),
      endDate.toISOString(),
      ownerId,
    ],
    queryFn: async (): Promise<LeadSourceRow[]> => {
      let q = supabase
        .from("crm_clients")
        .select("lead_source,owner_id,created_at")
        .gte("created_at", startDate.toISOString())
        .lt("created_at", endDate.toISOString())
        .limit(1000);
      if (ownerId !== "all") q = q.eq("owner_id", ownerId);
      const { data, error } = await q;
      if (error) throw error;

      const map = new Map<string, number>();
      for (const r of data ?? []) {
        const k = (r.lead_source as string) ?? "other";
        map.set(k, (map.get(k) ?? 0) + 1);
      }
      return Array.from(map.entries())
        .map(([k, c]) => ({
          key: k,
          label: LEAD_SOURCE_LABELS[k] ?? k,
          count: c,
        }))
        .sort((a, b) => b.count - a.count);
    },
  });
};
