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
  open: "bg-danger-bg text-danger border-danger-border",
  in_progress: "bg-bone-wash text-ink border-bone",
  waiting_on_client: "bg-warning-bg text-warning border-warning-border",
  resolved: "bg-success-bg text-success border-success-border",
  closed: "bg-bone-wash text-charcoal border-bone",
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
  low: "bg-ink-faint",
  medium: "bg-ink-faint",
  high: "bg-warning",
  urgent: "bg-danger",
};

export const ISSUE_PRIORITY_PILL: Record<IssuePriority, string> = {
  low: "bg-bone-wash text-charcoal border-bone",
  medium: "bg-bone-wash text-ink border-bone",
  high: "bg-warning-bg text-warning border-warning-border",
  urgent: "bg-danger-bg text-danger border-danger-border",
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
