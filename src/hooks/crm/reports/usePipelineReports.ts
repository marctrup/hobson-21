// Hooks for the Pipeline health section (3 reports + 1 addition):
// - usePipelineValueOverTime
// - useWonLostRatio
// - useStageConversionFunnel (current-stage-only fallback)
// - usePipelineValueByStage (addition)

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useReportsFilters } from "@/components/crm/reports/ReportsFiltersContext";

const TERMINAL_WON = ["won", "closed_won"];
const TERMINAL_LOST = ["lost", "closed_lost"];

export interface PipelineValuePoint {
  label: string;
  weighted_value: number;
}

export const usePipelineValueOverTime = () => {
  const { startDate, endDate, ownerId, buckets, bucket } = useReportsFilters();
  return useQuery({
    queryKey: [
      "report-pipeline-value-over-time",
      startDate.toISOString(),
      endDate.toISOString(),
      ownerId,
      bucket,
    ],
    queryFn: async (): Promise<PipelineValuePoint[]> => {
      let q = supabase
        .from("crm_clients")
        .select(
          "id,estimated_deal_value_gbp,probability_to_close,owner_id,created_at",
        )
        .gte("created_at", startDate.toISOString())
        .lt("created_at", endDate.toISOString())
        .limit(1000);
      if (ownerId !== "all") q = q.eq("owner_id", ownerId);
      const { data, error } = await q;
      if (error) throw error;

      return buckets.map((b) => {
        let total = 0;
        for (const c of data ?? []) {
          const t = new Date(c.created_at).getTime();
          if (t >= b.start.getTime() && t < b.end.getTime()) {
            const v = Number(c.estimated_deal_value_gbp ?? 0);
            const p = Number(c.probability_to_close ?? 0);
            total += (v * p) / 100;
          }
        }
        return { label: b.label, weighted_value: Math.round(total) };
      });
    },
  });
};

export interface WonLostBucket {
  won: number;
  lost: number;
  open: number;
  total: number;
}

export const useWonLostRatio = () => {
  const { startDate, endDate, ownerId } = useReportsFilters();
  return useQuery({
    queryKey: [
      "report-won-lost-ratio",
      startDate.toISOString(),
      endDate.toISOString(),
      ownerId,
    ],
    queryFn: async (): Promise<WonLostBucket> => {
      let q = supabase
        .from("crm_clients")
        .select("pipeline_stage,status,owner_id,created_at")
        .gte("created_at", startDate.toISOString())
        .lt("created_at", endDate.toISOString())
        .limit(1000);
      if (ownerId !== "all") q = q.eq("owner_id", ownerId);
      const { data, error } = await q;
      if (error) throw error;

      let won = 0;
      let lost = 0;
      let open = 0;
      for (const r of data ?? []) {
        const stage = r.pipeline_stage as string;
        const status = r.status as string;
        if (TERMINAL_WON.includes(stage) || status === "won") won += 1;
        else if (TERMINAL_LOST.includes(stage) || status === "lost") lost += 1;
        else open += 1;
      }
      return { won, lost, open, total: won + lost + open };
    },
  });
};

export interface FunnelStep {
  key: string;
  label: string;
  count: number;
  display_order: number;
}

export const useStageConversionFunnel = () => {
  const { startDate, endDate, ownerId } = useReportsFilters();
  return useQuery({
    queryKey: [
      "report-stage-funnel",
      startDate.toISOString(),
      endDate.toISOString(),
      ownerId,
    ],
    queryFn: async (): Promise<FunnelStep[]> => {
      const [{ data: stages, error: sErr }, clientsRes] = await Promise.all([
        supabase
          .from("crm_pipeline_stages")
          .select("key,label,display_order,is_terminal")
          .eq("is_active", true)
          .order("display_order", { ascending: true }),
        (() => {
          let q = supabase
            .from("crm_clients")
            .select("pipeline_stage,owner_id,created_at")
            .gte("created_at", startDate.toISOString())
            .lt("created_at", endDate.toISOString())
            .limit(1000);
          if (ownerId !== "all") q = q.eq("owner_id", ownerId);
          return q;
        })(),
      ]);
      if (sErr) throw sErr;
      if (clientsRes.error) throw clientsRes.error;

      const counts = new Map<string, number>();
      for (const c of clientsRes.data ?? []) {
        const k = c.pipeline_stage as string;
        counts.set(k, (counts.get(k) ?? 0) + 1);
      }
      return (stages ?? [])
        .filter((s) => !s.is_terminal)
        .map((s) => ({
          key: s.key,
          label: s.label,
          display_order: s.display_order,
          count: counts.get(s.key) ?? 0,
        }));
    },
  });
};

export interface StageValueRow {
  key: string;
  label: string;
  color: string;
  weighted_value: number;
  count: number;
}

export const usePipelineValueByStage = () => {
  const { ownerId } = useReportsFilters();
  return useQuery({
    queryKey: ["report-pipeline-value-by-stage", ownerId],
    queryFn: async (): Promise<StageValueRow[]> => {
      const [{ data: stages, error: sErr }, clientsRes] = await Promise.all([
        supabase
          .from("crm_pipeline_stages")
          .select("key,label,color,display_order,is_terminal")
          .eq("is_active", true)
          .order("display_order", { ascending: true }),
        (() => {
          let q = supabase
            .from("crm_clients")
            .select(
              "pipeline_stage,estimated_deal_value_gbp,probability_to_close,owner_id",
            )
            .limit(1000);
          if (ownerId !== "all") q = q.eq("owner_id", ownerId);
          return q;
        })(),
      ]);
      if (sErr) throw sErr;
      if (clientsRes.error) throw clientsRes.error;

      const valueByStage = new Map<string, { v: number; c: number }>();
      for (const c of clientsRes.data ?? []) {
        const k = c.pipeline_stage as string;
        const v = Number(c.estimated_deal_value_gbp ?? 0);
        const p = Number(c.probability_to_close ?? 0);
        const w = (v * p) / 100;
        const cur = valueByStage.get(k) ?? { v: 0, c: 0 };
        valueByStage.set(k, { v: cur.v + w, c: cur.c + 1 });
      }
      return (stages ?? [])
        .filter((s) => !s.is_terminal)
        .map((s) => {
          const cur = valueByStage.get(s.key) ?? { v: 0, c: 0 };
          return {
            key: s.key,
            label: s.label,
            color: s.color,
            weighted_value: Math.round(cur.v),
            count: cur.c,
          };
        });
    },
  });
};
