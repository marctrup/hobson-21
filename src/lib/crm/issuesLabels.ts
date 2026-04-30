// Centralised display labels and colour tokens for the Issues module.
// Mirrors the pattern in communicationsLabels.ts.

export const ISSUE_STATUSES = [
  "open",
  "in_progress",
  "waiting_on_client",
  "resolved",
  "closed",
] as const;
export type IssueStatus = (typeof ISSUE_STATUSES)[number];

export const ISSUE_STATUS_LABELS: Record<IssueStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  waiting_on_client: "Waiting on client",
  resolved: "Resolved",
  closed: "Closed",
};

// Active = not resolved and not closed; used for default filtering.
export const ISSUE_ACTIVE_STATUSES: IssueStatus[] = [
  "open",
  "in_progress",
  "waiting_on_client",
];

export const ISSUE_STATUS_COLOURS: Record<IssueStatus, string> = {
  open: "bg-rose-100 text-rose-800 border-rose-200",
  in_progress: "bg-blue-100 text-blue-800 border-blue-200",
  waiting_on_client: "bg-amber-100 text-amber-900 border-amber-200",
  resolved: "bg-emerald-100 text-emerald-800 border-emerald-200",
  closed: "bg-slate-100 text-slate-700 border-slate-200",
};

export const ISSUE_PRIORITIES = ["low", "medium", "high", "urgent"] as const;
export type IssuePriority = (typeof ISSUE_PRIORITIES)[number];

export const ISSUE_PRIORITY_LABELS: Record<IssuePriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

// Solid dot colours (foreground only) for compact priority indicators.
export const ISSUE_PRIORITY_DOT: Record<IssuePriority, string> = {
  low: "bg-slate-400",
  medium: "bg-blue-500",
  high: "bg-amber-500",
  urgent: "bg-rose-600",
};

export const ISSUE_PRIORITY_PILL: Record<IssuePriority, string> = {
  low: "bg-slate-100 text-slate-700 border-slate-200",
  medium: "bg-blue-100 text-blue-800 border-blue-200",
  high: "bg-amber-100 text-amber-900 border-amber-200",
  urgent: "bg-rose-100 text-rose-800 border-rose-200",
};

export const ISSUE_CATEGORIES = [
  "bug",
  "data_quality",
  "billing",
  "onboarding",
  "feature_gap",
  "support",
  "other",
] as const;
export type IssueCategory = (typeof ISSUE_CATEGORIES)[number];

export const ISSUE_CATEGORY_LABELS: Record<IssueCategory, string> = {
  bug: "Bug",
  data_quality: "Data quality",
  billing: "Billing",
  onboarding: "Onboarding",
  feature_gap: "Feature gap",
  support: "Support",
  other: "Other",
};

// Saved-view shortcut keys used by the workspace page chips.
export const ISSUE_QUICK_VIEWS = [
  "open_all",
  "my_open",
  "urgent",
  "overdue",
] as const;
export type IssueQuickView = (typeof ISSUE_QUICK_VIEWS)[number];

export const ISSUE_QUICK_VIEW_LABELS: Record<IssueQuickView, string> = {
  open_all: "Open",
  my_open: "My open",
  urgent: "Urgent",
  overdue: "Overdue",
};
