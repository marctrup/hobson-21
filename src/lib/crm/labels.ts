// Centralised display labels and colour tokens for CRM enums.
// Keep all enum -> human label mapping here so badges stay consistent.

export const SEGMENT_LABELS: Record<string, string> = {
  property_asset_manager: "Property & asset manager",
  retail_operator: "Retail operator",
  hospitality: "Hospitality",
  corporate_occupier: "Corporate occupier",
  other: "Other",
};

export const PIPELINE_STAGES = [
  "new_enquiry",
  "contacted",
  "qualified",
  "in_discussion",
  "proposal_sent",
  "won",
  "lost",
  "on_hold",
] as const;

export const PIPELINE_STAGE_LABELS: Record<string, string> = {
  new_enquiry: "New enquiry",
  contacted: "Contacted",
  qualified: "Qualified",
  in_discussion: "In discussion",
  proposal_sent: "Proposal sent",
  won: "Won",
  lost: "Lost",
  on_hold: "On hold",
};

export const PIPELINE_STAGE_COLOURS: Record<string, string> = {
  new_enquiry: "bg-slate-100 text-slate-800 border-slate-200",
  contacted: "bg-blue-100 text-blue-800 border-blue-200",
  qualified: "bg-indigo-100 text-indigo-800 border-indigo-200",
  in_discussion: "bg-purple-100 text-purple-800 border-purple-200",
  proposal_sent: "bg-amber-100 text-amber-900 border-amber-200",
  won: "bg-emerald-100 text-emerald-800 border-emerald-200",
  lost: "bg-rose-100 text-rose-800 border-rose-200",
  on_hold: "bg-zinc-100 text-zinc-700 border-zinc-200",
};

export const INTEREST_LEVELS = ["cold", "warm", "hot"] as const;
export const INTEREST_LEVEL_LABELS: Record<string, string> = {
  cold: "Cold",
  warm: "Warm",
  hot: "Hot",
};
export const INTEREST_LEVEL_COLOURS: Record<string, string> = {
  cold: "bg-blue-100 text-blue-800 border-blue-200",
  warm: "bg-amber-100 text-amber-900 border-amber-200",
  hot: "bg-rose-100 text-rose-800 border-rose-200",
};

export const CLIENT_STATUSES = [
  "lead",
  "prospect",
  "active",
  "on_hold",
  "churned",
  "archived",
] as const;
export const CLIENT_STATUS_LABELS: Record<string, string> = {
  lead: "Lead",
  prospect: "Prospect",
  active: "Active",
  on_hold: "On hold",
  churned: "Churned",
  archived: "Archived",
};

export const PRIORITIES = ["low", "medium", "high"] as const;
export const PRIORITY_LABELS: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const SUBSCRIPTION_STATUSES = [
  "trial",
  "active",
  "paused",
  "cancelled",
  "not_subscribed",
] as const;
export const SUBSCRIPTION_STATUS_LABELS: Record<string, string> = {
  trial: "Trial",
  active: "Active",
  paused: "Paused",
  cancelled: "Cancelled",
  not_subscribed: "Not subscribed",
};

export const LEAD_SOURCES = [
  "website",
  "inbound_call",
  "referral_client",
  "referral_partner",
  "linkedin",
  "event_conference",
  "cold_outreach",
  "webinar_content",
  "pr_press",
  "other",
] as const;
export const LEAD_SOURCE_LABELS: Record<string, string> = {
  website: "Website",
  inbound_call: "Inbound call",
  referral_client: "Referral (client)",
  referral_partner: "Referral (partner)",
  linkedin: "LinkedIn",
  event_conference: "Event / conference",
  cold_outreach: "Cold outreach",
  webinar_content: "Webinar / content",
  pr_press: "PR / press",
  other: "Other",
};

export const STAFF_SIZE_BANDS = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1000+",
] as const;

export const REVENUE_BANDS = [
  "<£1M",
  "£1M-£5M",
  "£5M-£25M",
  "£25M-£100M",
  "£100M-£500M",
  "£500M+",
  "unknown",
] as const;

export const TENURE_MIX = [
  "all_leasehold",
  "mostly_leasehold",
  "mixed",
  "mostly_freehold",
  "all_freehold",
  "unknown",
] as const;
export const TENURE_MIX_LABELS: Record<string, string> = {
  all_leasehold: "All leasehold",
  mostly_leasehold: "Mostly leasehold",
  mixed: "Mixed",
  mostly_freehold: "Mostly freehold",
  all_freehold: "All freehold",
  unknown: "Unknown",
};

export const SENIORITY_LEVELS = [
  "c_suite",
  "director",
  "head_of",
  "senior_manager",
  "manager",
  "analyst_specialist",
  "associate",
  "other",
] as const;
export const SENIORITY_LABELS: Record<string, string> = {
  c_suite: "C-suite",
  director: "Director",
  head_of: "Head of",
  senior_manager: "Senior manager",
  manager: "Manager",
  analyst_specialist: "Analyst / specialist",
  associate: "Associate",
  other: "Other",
};

export const DEPARTMENTS = [
  "finance",
  "property_estates",
  "operations",
  "it_technology",
  "legal",
  "procurement",
  "asset_management",
  "leasing",
  "compliance",
  "executive",
  "hr",
  "marketing",
  "other",
] as const;
export const DEPARTMENT_LABELS: Record<string, string> = {
  finance: "Finance",
  property_estates: "Property & estates",
  operations: "Operations",
  it_technology: "IT / technology",
  legal: "Legal",
  procurement: "Procurement",
  asset_management: "Asset management",
  leasing: "Leasing",
  compliance: "Compliance",
  executive: "Executive",
  hr: "HR",
  marketing: "Marketing",
  other: "Other",
};

export const PLATFORM_ROLES = [
  "account_admin",
  "power_user",
  "standard_user",
  "viewer",
] as const;
export const PLATFORM_ROLE_LABELS: Record<string, string> = {
  account_admin: "Account admin",
  power_user: "Power user",
  standard_user: "Standard user",
  viewer: "Viewer",
};

export const BILLING_CYCLES = ["monthly", "quarterly", "annual", "custom"] as const;
export const BILLING_CYCLE_LABELS: Record<string, string> = {
  monthly: "Monthly",
  quarterly: "Quarterly",
  annual: "Annual",
  custom: "Custom",
};

export const formatGBP = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatDateUK = (value: string | Date | null | undefined): string => {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatDateTimeUK = (value: string | Date | null | undefined): string => {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatSqft = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return "—";
  return `${value.toLocaleString("en-GB")} sq ft`;
};
