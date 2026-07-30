// Centralised display labels and colour tokens for the Tasks module.
// Mirrors the pattern in issuesLabels.ts.

export const TASK_STATUSES = [
  "todo",
  "in_progress",
  "done",
  "cancelled",
] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
  cancelled: "Cancelled",
};

// Active = neither done nor cancelled. Used for default filtering and counters.
export const TASK_ACTIVE_STATUSES: TaskStatus[] = ["todo", "in_progress"];

export const TASK_STATUS_COLOURS: Record<TaskStatus, string> = {
  todo: "bg-bone-wash text-ink border-bone",
  in_progress: "bg-bone-wash text-ink border-bone",
  done: "bg-success-bg text-success border-success-border",
  cancelled: "bg-bone-wash text-ink-muted border-bone",
};

export const TASK_PRIORITIES = ["low", "medium", "high", "urgent"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

// Numeric weight for sorting (urgent first).
export const TASK_PRIORITY_WEIGHT: Record<TaskPriority, number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export const TASK_PRIORITY_DOT: Record<TaskPriority, string> = {
  low: "bg-ink-faint",
  medium: "bg-ink-faint",
  high: "bg-warning",
  urgent: "bg-danger",
};

export const TASK_PRIORITY_PILL: Record<TaskPriority, string> = {
  low: "bg-bone-wash text-charcoal border-bone",
  medium: "bg-bone-wash text-ink border-bone",
  high: "bg-warning-bg text-warning border-warning-border",
  urgent: "bg-danger-bg text-danger border-danger-border",
};

// Saved-view shortcut keys used by the workspace page chips.
export const TASK_QUICK_VIEWS = [
  "my_open",
  "all_open",
  "due_today",
  "overdue",
  "unassigned",
  "standalone",
  "done",
] as const;
export type TaskQuickView = (typeof TASK_QUICK_VIEWS)[number];

export const TASK_QUICK_VIEW_LABELS: Record<TaskQuickView, string> = {
  my_open: "My open",
  all_open: "All open",
  due_today: "Due today",
  overdue: "Overdue",
  unassigned: "Unassigned",
  standalone: "Standalone (no client)",
  done: "Done",
};
