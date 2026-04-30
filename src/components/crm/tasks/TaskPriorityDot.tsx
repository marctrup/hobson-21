import { cn } from "@/lib/utils";
import {
  TASK_PRIORITY_DOT,
  TASK_PRIORITY_LABELS,
  type TaskPriority,
} from "@/lib/crm/tasksLabels";

export const TaskPriorityDot = ({
  priority,
  className,
  withLabel = false,
}: {
  priority: TaskPriority;
  className?: string;
  withLabel?: boolean;
}) => (
  <span className={cn("inline-flex items-center gap-1.5", className)}>
    <span
      aria-hidden
      className={cn("size-2 rounded-full", TASK_PRIORITY_DOT[priority])}
    />
    {withLabel && (
      <span className="text-xs text-slate-700">
        {TASK_PRIORITY_LABELS[priority]}
      </span>
    )}
  </span>
);
