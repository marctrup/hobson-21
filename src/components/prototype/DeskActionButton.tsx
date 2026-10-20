import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

/**
 * A small secondary action for Hobson's Desk: a bounded button with an icon,
 * a readable label and a hover/focus tooltip that explains the outcome.
 * `demo` marks prototype demonstration controls so they stay visually
 * subordinate to real findings and evidence.
 */
export function DeskActionButton({ icon, label, tooltip, demo = false, onClick, expanded }: {
  icon: ReactNode;
  label: string;
  tooltip: string;
  demo?: boolean;
  onClick: () => void;
  expanded?: boolean;
}) {
  return (
    <span className="group/desk-action relative inline-flex max-w-full">
      <Button
        variant="outline"
        size="sm"
        aria-expanded={expanded}
        onClick={onClick}
        className={`h-auto max-w-full gap-2 whitespace-normal px-3 py-1.5 text-left text-xs ${demo ? "border-dashed text-muted-foreground hover:text-foreground" : ""}`}
      >
        {icon}
        <span className="min-w-0">{label}</span>
      </Button>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-0 z-50 mb-1.5 w-56 max-w-[70vw] rounded-md border border-border bg-popover px-2.5 py-1.5 text-xs leading-snug text-popover-foreground opacity-0 shadow-md transition-opacity delay-300 duration-150 group-hover/desk-action:opacity-100 group-focus-within/desk-action:opacity-100"
      >
        {tooltip}
      </span>
    </span>
  );
}
