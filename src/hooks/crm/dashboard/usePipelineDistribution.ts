import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface StageSlice {
  key: string;
  label: string;
  color: string;
  display_order: number;
  count: number;
}

export const usePipelineDistribution = () =>
  useQuery({
    queryKey: ["crm-dashboard-pipeline-distribution"],
    queryFn: async (): Promise<StageSlice[]> => {
      const [{ data: stages, error: sErr }, { data: clients, error: cErr }] =
        await Promise.all([
          supabase
            .from("crm_pipeline_stages")
            .select("key,label,color,display_order")
            .eq("is_active", true)
            .order("display_order", { ascending: true }),
          supabase.from("crm_clients").select("pipeline_stage"),
        ]);
      if (sErr) throw sErr;
      if (cErr) throw cErr;

      const counts = new Map<string, number>();
      for (const c of clients ?? []) {
        const key = c.pipeline_stage as string;
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }

      return (stages ?? []).map((s) => ({
        key: s.key,
        label: s.label,
        color: s.color,
        display_order: s.display_order,
        count: counts.get(s.key) ?? 0,
      }));
    },
  });
