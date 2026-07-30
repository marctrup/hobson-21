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
  muted:       { header: "bg-bone-wash border-bone",   badge: "bg-bone text-charcoal" },
  secondary:   { header: "bg-paper border-bone",      badge: "bg-bone-wash text-ink" },
  accent:      { header: "bg-paper border-bone",  badge: "bg-bone-wash text-ink" },
  primary:     { header: "bg-warning-bg border-warning-border",    badge: "bg-warning-bg text-warning" },
  success:     { header: "bg-success-bg border-success-border",badge: "bg-success-bg text-success" },
  destructive: { header: "bg-danger-bg border-danger-border",      badge: "bg-danger-bg text-danger" },
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
