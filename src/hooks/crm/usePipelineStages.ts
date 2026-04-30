import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PipelineStage {
  id: string;
  key: string;
  label: string;
  display_order: number;
  color: string;
  is_terminal: boolean;
  is_active: boolean;
}

// Maps the semantic-token name stored in DB onto Tailwind utility classes.
// Keep this in sync with index.css token definitions.
export const STAGE_COLOUR_CLASSES: Record<string, { header: string; badge: string }> = {
  muted:       { header: "bg-slate-100 border-slate-200",   badge: "bg-slate-200 text-slate-700" },
  secondary:   { header: "bg-blue-50 border-blue-200",      badge: "bg-blue-100 text-blue-800" },
  accent:      { header: "bg-purple-50 border-purple-200",  badge: "bg-purple-100 text-purple-800" },
  primary:     { header: "bg-amber-50 border-amber-200",    badge: "bg-amber-100 text-amber-900" },
  success:     { header: "bg-emerald-50 border-emerald-200",badge: "bg-emerald-100 text-emerald-800" },
  destructive: { header: "bg-rose-50 border-rose-200",      badge: "bg-rose-100 text-rose-800" },
};

export const stageColourClasses = (color: string) =>
  STAGE_COLOUR_CLASSES[color] ?? STAGE_COLOUR_CLASSES.muted;

export const usePipelineStages = () =>
  useQuery({
    queryKey: ["crm-pipeline-stages"],
    queryFn: async (): Promise<PipelineStage[]> => {
      const { data, error } = await supabase
        .from("crm_pipeline_stages")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as PipelineStage[];
    },
    staleTime: 5 * 60 * 1000, // stages rarely change
  });
