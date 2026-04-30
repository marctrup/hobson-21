import { cn } from "@/lib/utils";
import {
  TASK_STATUS_COLOURS,
  TASK_STATUS_LABELS,
  type TaskStatus,
} from "@/lib/crm/tasksLabels";

export const TaskStatusPill = ({
  status,
  className,
}: {
  status: TaskStatus;
  className?: string;
}) => (
  <span
    className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] font-medium",
      TASK_STATUS_COLOURS[status],
      className,
    )}
  >
    {TASK_STATUS_LABELS[status]}
  </span>
);
