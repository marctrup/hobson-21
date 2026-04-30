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
  todo: "bg-slate-100 text-slate-800 border-slate-200",
  in_progress: "bg-blue-100 text-blue-800 border-blue-200",
  done: "bg-emerald-100 text-emerald-800 border-emerald-200",
  cancelled: "bg-slate-100 text-slate-500 border-slate-200",
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
  low: "bg-slate-400",
  medium: "bg-blue-500",
  high: "bg-amber-500",
  urgent: "bg-rose-600",
};

export const TASK_PRIORITY_PILL: Record<TaskPriority, string> = {
  low: "bg-slate-100 text-slate-700 border-slate-200",
  medium: "bg-blue-100 text-blue-800 border-blue-200",
  high: "bg-amber-100 text-amber-900 border-amber-200",
  urgent: "bg-rose-100 text-rose-800 border-rose-200",
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
