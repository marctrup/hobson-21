import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Open opportunities = stage NOT terminal AND status NOT IN ('won','lost','archived').
// Value = sum(estimated_deal_value_gbp * probability_to_close / 100).

const CLOSED_STATUSES = ["won", "lost", "archived"];

interface PipelineValueResult {
  mine: number;
  workspace: number;
  mineCount: number;
  workspaceCount: number;
}

export const usePipelineValue = (userId: string | null) =>
  useQuery({
    queryKey: ["crm-dashboard-pipeline-value", userId],
    queryFn: async (): Promise<PipelineValueResult> => {
      // Get terminal stage keys.
      const { data: stages, error: stagesErr } = await supabase
        .from("crm_pipeline_stages")
        .select("key,is_terminal");
      if (stagesErr) throw stagesErr;
      const terminalKeys = (stages ?? [])
        .filter((s) => s.is_terminal)
        .map((s) => s.key);

      let q = supabase
        .from("crm_clients")
        .select("estimated_deal_value_gbp,probability_to_close,owner_id,pipeline_stage,status")
        .not("status", "in", `(${CLOSED_STATUSES.join(",")})`);
      if (terminalKeys.length > 0) {
        q = q.not("pipeline_stage", "in", `(${terminalKeys.join(",")})`);
      }
      const { data, error } = await q;
      if (error) throw error;

      let mine = 0;
      let workspace = 0;
      let mineCount = 0;
      let workspaceCount = 0;

      for (const r of data ?? []) {
        const v = Number(r.estimated_deal_value_gbp ?? 0);
        const p = Number(r.probability_to_close ?? 0);
        const weighted = (v * p) / 100;
        workspace += weighted;
        workspaceCount += 1;
        if (userId && r.owner_id === userId) {
          mine += weighted;
          mineCount += 1;
        }
      }

      return { mine, workspace, mineCount, workspaceCount };
    },
  });
