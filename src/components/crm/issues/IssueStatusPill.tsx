import { cn } from "@/lib/utils";
import {
  ISSUE_STATUS_COLOURS,
  ISSUE_STATUS_LABELS,
  type IssueStatus,
} from "@/lib/crm/issuesLabels";

export const IssueStatusPill = ({
  status,
  className,
}: {
  status: IssueStatus;
  className?: string;
}) => (
  <span
    className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] font-medium",
      ISSUE_STATUS_COLOURS[status],
      className,
    )}
  >
    {ISSUE_STATUS_LABELS[status]}
  </span>
);
