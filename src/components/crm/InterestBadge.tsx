import { cn } from "@/lib/utils";
import { INTEREST_LEVEL_COLOURS, INTEREST_LEVEL_LABELS } from "@/lib/crm/labels";

interface InterestBadgeProps {
  level: string;
  className?: string;
}

export const InterestBadge = ({ level, className }: InterestBadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md border",
      INTEREST_LEVEL_COLOURS[level] ?? "bg-slate-100 text-slate-700 border-slate-200",
      className,
    )}
  >
    <span className="size-1.5 rounded-full bg-current opacity-70" />
    {INTEREST_LEVEL_LABELS[level] ?? level}
  </span>
);
