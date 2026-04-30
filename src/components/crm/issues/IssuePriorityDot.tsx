import { cn } from "@/lib/utils";
import {
  ISSUE_PRIORITY_DOT,
  ISSUE_PRIORITY_LABELS,
  ISSUE_PRIORITY_PILL,
  type IssuePriority,
} from "@/lib/crm/issuesLabels";

export const IssuePriorityDot = ({
  priority,
  className,
}: {
  priority: IssuePriority;
  className?: string;
}) => (
  <span
    title={`Priority: ${ISSUE_PRIORITY_LABELS[priority]}`}
    aria-label={`Priority ${ISSUE_PRIORITY_LABELS[priority]}`}
    className={cn(
      "inline-block size-2.5 rounded-full",
      ISSUE_PRIORITY_DOT[priority],
      className,
    )}
  />
);

export const IssuePriorityPill = ({
  priority,
  className,
}: {
  priority: IssuePriority;
  className?: string;
}) => (
  <span
    className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] font-medium",
      ISSUE_PRIORITY_PILL[priority],
      className,
    )}
  >
    {ISSUE_PRIORITY_LABELS[priority]}
  </span>
);
