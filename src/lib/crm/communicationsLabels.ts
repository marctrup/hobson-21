// Display labels and icon hints for the Communications module.
// Keep all enum -> human label mapping here so timeline/filters stay consistent.

export const COMM_CHANNELS = [
  "email",
  "call",
  "meeting",
  "video_call",
  "sms",
  "whatsapp",
  "linkedin_message",
  "letter",
  "other",
] as const;
export type CommChannel = (typeof COMM_CHANNELS)[number];

export const COMM_CHANNEL_LABELS: Record<CommChannel, string> = {
  email: "Email",
  call: "Call",
  meeting: "Meeting",
  video_call: "Video call",
  sms: "SMS",
  whatsapp: "WhatsApp",
  linkedin_message: "LinkedIn message",
  letter: "Letter",
  other: "Other",
};

export const COMM_DIRECTIONS = ["inbound", "outbound", "internal"] as const;
export type CommDirection = (typeof COMM_DIRECTIONS)[number];

export const COMM_DIRECTION_LABELS: Record<CommDirection, string> = {
  inbound: "Inbound",
  outbound: "Outbound",
  internal: "Internal",
};

export const COMM_DIRECTION_BADGE: Record<CommDirection, string> = {
  inbound: "bg-blue-100 text-blue-800 border-blue-200",
  outbound: "bg-emerald-100 text-emerald-800 border-emerald-200",
  internal: "bg-slate-100 text-slate-700 border-slate-200",
};

export const COMM_SENTIMENTS = ["positive", "neutral", "negative"] as const;
export type CommSentiment = (typeof COMM_SENTIMENTS)[number];

export const COMM_SENTIMENT_LABELS: Record<CommSentiment, string> = {
  positive: "Positive",
  neutral: "Neutral",
  negative: "Negative",
};

export const PARTICIPANT_ROLES = [
  "to",
  "from",
  "cc",
  "bcc",
  "attendee",
  "organiser",
] as const;
export type ParticipantRole = (typeof PARTICIPANT_ROLES)[number];

export const PARTICIPANT_ROLE_LABELS: Record<ParticipantRole, string> = {
  to: "To",
  from: "From",
  cc: "CC",
  bcc: "BCC",
  attendee: "Attendee",
  organiser: "Organiser",
};

export const PARTICIPANT_KINDS = [
  "contact",
  "platform_user",
  "workspace_member",
  "external",
] as const;
export type ParticipantKind = (typeof PARTICIPANT_KINDS)[number];

export const PARTICIPANT_KIND_LABELS: Record<ParticipantKind, string> = {
  contact: "Commercial contact",
  platform_user: "Platform user",
  workspace_member: "Team member",
  external: "External",
};

// Max attachment size — must match the bucket file_size_limit (52428800).
export const MAX_ATTACHMENT_BYTES = 50 * 1024 * 1024;

export const formatBytes = (bytes: number | null | undefined): string => {
  if (bytes == null) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};
