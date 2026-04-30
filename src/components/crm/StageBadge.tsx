import { cn } from "@/lib/utils";
import { PIPELINE_STAGE_COLOURS, PIPELINE_STAGE_LABELS } from "@/lib/crm/labels";

interface StageBadgeProps {
  stage: string;
  className?: string;
}

export const StageBadge = ({ stage, className }: StageBadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md border",
      PIPELINE_STAGE_COLOURS[stage] ?? "bg-slate-100 text-slate-700 border-slate-200",
      className,
    )}
  >
    {PIPELINE_STAGE_LABELS[stage] ?? stage}
  </span>
);
