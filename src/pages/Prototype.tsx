import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import owlTalking from "@/assets/prototype/owl-talking.png";
import owlDefault from "@/assets/prototype/owl-default.png";
import owlReading from "@/assets/prototype/owl-reading.png";
import owlCovering from "@/assets/prototype/owl-covering.png";
import characterMagician from "@/assets/prototype/character-magician.png";
import characterProfessor from "@/assets/prototype/character-professor.png";
import characterBroker from "@/assets/prototype/character-broker.png";
import characterKeeper from "@/assets/prototype/character-keeper.png";
import { DocumentsLibrary } from "@/components/prototype/DocumentsLibrary";
import { CollapsibleSection } from "@/components/prototype/CollapsibleSection";
import { cn } from "@/lib/utils";
import SummaryCard, { SummaryActions } from "./prototype/SummaryCard";
import { summaryIntroFor, summaryQuestionFor, type SummaryScope } from "./prototype/summaryData";
import {
  INSPECTOR_CHARACTER,
  InspectorChat,
  InspectorComposer,
  InspectorWorkArea,
  DEFAULT_HS_REQUIREMENTS,
  DEFAULT_FINANCIAL_REQUIREMENTS,
  AREA_DEFS,
  RESEARCH_BY_AREA,
  augmentComplianceRows,
  type ComplianceArea,
  type ComplianceRequirement,
  type InspectorBuild,
  type InspectorEvent,
  type RequirementCategory,
  type DurationUnit,
} from "./prototype/Inspector";
import {
  BACK_OFFICE_HELPERS,
  detectRoomFromMessage,
  hasEnteredBackOffice,
  markBackOfficeEntered,
  type BackOfficeHelper,
} from "./prototype/backOffice";


type AdminCharacter = "magician" | "professor" | "broker" | "inspector";
const ADMIN_CHARACTERS: { id: AdminCharacter; name: string; src: string; tagline: string; greeting: string; workTitle: string; workIntro: string }[] = [
  {
    id: "magician",
    name: "The Magician",
    src: characterMagician,
    tagline: "Workflows & automations",
    greeting: "This is the Magician's workshop — where your workflows are composed and rehearsed before they go live. Tell me what you'd like me to keep on top of — rent reviews, compliance, notices — and I'll have him build it with you. Pick a starting point below.",
    workTitle: "The Magician's workshop",
    workIntro: "Where automations are composed and rehearsed before they go live.",
  },
  {
    id: "professor",
    name: "The Professor",
    src: characterProfessor,
    tagline: "Knowledge & research",
    greeting: "This is the Professor's library — where your documents are read and kept. Hand them over and I'll have him read and catalogue them for you — leases, certificates, notices, anything you keep. Upload one or several below.",
    workTitle: "The Professor's library",
    workIntro: "Where the knowledge base is curated, taught and consulted.",
  },
  {
    id: "broker",
    name: "The Broker",
    src: characterBroker,
    tagline: "Contacts & relationships",
    greeting: "This is the Broker's black book — where your contacts and relationships are kept. Add a contact one at a time, or hand me a spreadsheet and I'll have him read them all in — staff, subcontractors, occupants, anyone who matters. Pick how you'd like to start below.",
    workTitle: "The Broker's black book",
    workIntro: "Where contacts, relationships and their histories are kept — tenants, landlords, contractors, agents, solicitors, lenders, authorities.",

  },
  {
    id: "inspector",
    name: INSPECTOR_CHARACTER.name,
    src: INSPECTOR_CHARACTER.src,
    tagline: INSPECTOR_CHARACTER.tagline,
    greeting: "This is the Inspector's compliance board — where the rules are set that I watch every property against. Tell me which area of compliance to set up, and I'll have him find what the law requires.",
    workTitle: INSPECTOR_CHARACTER.workTitle,
    workIntro: INSPECTOR_CHARACTER.workIntro,
  },
];

type BrokerImportFlag = { name: string; reason: string };
type BrokerEvent =
  | { kind: "broker"; id: string; text: string }
  | { kind: "user"; id: string; text: string }
  | { kind: "summary"; id: string; name: string }
  | { kind: "importSummary"; id: string; total: number; byType: Record<BrokerContactType, number>; linkedProperties: number; flagged: BrokerImportFlag[]; filename: string };

type BrokerField = "name" | "type" | "role" | "email" | "phoneAndPref" | "address" | "relatedTo";

const BROKER_QUESTIONS: { ask: string; placeholder: string; field: BrokerField }[] = [
  { field: "name", ask: "Wonderful — let's get them in the book. What's their name?", placeholder: "e.g. Firewatch Ltd" },
  { field: "type", ask: "How do they relate to you — staff, subcontractor, occupant, or miscellaneous?", placeholder: "staff / subcontractor / occupant / misc" },
  { field: "role", ask: "What's their role, and is there a named person I should ask for?", placeholder: "e.g. Fire alarm engineer · contact: John Reed" },
  { field: "email", ask: "Best email for them?", placeholder: "name@example.com" },
  { field: "phoneAndPref", ask: "Phone number? Tell me how they prefer to be reached too — 'prefers email', 'no calls Mondays', etc.", placeholder: "020 7946 0321 · prefers email" },
  { field: "address", ask: "Address — business address for trades, or the unit address for occupants.", placeholder: "e.g. Unit 7, Park Royal Trade Park, London NW10" },
  { field: "relatedTo", ask: "Last one: who or what are they linked to? Properties, units, landlord, or who introduced them.", placeholder: "e.g. Linked to: 5 Nugent Terrace · introduced by Sarah Chen" },
];


type BrokerContactType = "staff" | "subcontractor" | "occupant" | "misc";
type BrokerContact = {
  id: string;
  name: string;
  type: BrokerContactType;
  role: string;                 // e.g. "Fire alarm engineer · contact: John Reed"
  initials: string;
  email: string;
  phone: string;
  contactPref: string;          // e.g. "prefers email", "no calls Mondays"
  address: string;              // unit address for occupants; business address otherwise
  relatedTo: string;            // linked properties / landlord / introduced by …
  flagged?: boolean;
  flagLabel?: string;
  imported?: boolean;
};

const BROKER_TYPE_META: Record<BrokerContactType, { label: string; plural: string; tone: string; ring: string; bg: string; text: string; iconPath: React.ReactNode }> = {
  staff: {
    label: "Staff", plural: "Staff",
    tone: "blue", ring: "ring-blue-200", bg: "bg-blue-50", text: "text-blue-700",
    iconPath: (<><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3 3-5 6-5s6 2 6 5"/><path d="M15 20c0-2 2-3.5 4-3.5s2.5 1 3 2"/></>),
  },
  subcontractor: {
    label: "Subcontractors", plural: "Subcontractors",
    tone: "teal", ring: "ring-teal-200", bg: "bg-teal-50", text: "text-teal-700",
    iconPath: (<><path d="M14 6l4 4-8 8-4-4 8-8z"/><path d="M3 21l3-3"/><path d="M17 3l4 4"/></>),
  },
  occupant: {
    label: "Occupants", plural: "Occupants",
    tone: "purple", ring: "ring-purple-200", bg: "bg-[#F5F3FF]", text: "text-[#7C3AED]",
    iconPath: (<><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/></>),
  },
  misc: {
    label: "Miscellaneous", plural: "Miscellaneous",
    tone: "slate", ring: "ring-slate-200", bg: "bg-slate-100", text: "text-slate-600",
    iconPath: (<><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></>),
  },
};

const SEED_BROKER_CONTACTS: BrokerContact[] = [
  {
    id: "bc-1", name: "Sarah Chen", type: "staff", initials: "SC",
    role: "Asset Manager · internal",
    email: "sarah.chen@yourco.co.uk",
    phone: "020 7946 0188",
    contactPref: "prefers email",
    address: "Head office · 14 Eastcastle St, London W1W",
    relatedTo: "Responsible for: 5 Nugent Terrace, Stanley House",
  },
  {
    id: "bc-2", name: "James Okoro", type: "staff", initials: "JO",
    role: "Lease Manager · internal",
    email: "james.okoro@yourco.co.uk",
    phone: "020 7946 0192",
    contactPref: "prefers phone",
    address: "Head office · 14 Eastcastle St, London W1W",
    relatedTo: "Responsible for: 5 Nugent Terrace, Cromwell Mews",
  },
  {
    id: "bc-3", name: "Firewatch Ltd", type: "subcontractor", initials: "FW",
    role: "Fire alarm engineer · contact: John Reed",
    email: "john.reed@firewatch.co.uk",
    phone: "020 7946 0321",
    contactPref: "prefers email",
    address: "Unit 7, Park Royal Trade Park, London NW10",
    relatedTo: "Linked to: 5 Nugent Terrace, Stanley House",
  },
  {
    id: "bc-4", name: "Voltedge", type: "subcontractor", initials: "VE",
    role: "Electrician / EICR · contact: Priya Shah",
    email: "priya@voltedge.uk",
    phone: "07700 900614",
    contactPref: "no calls Mondays",
    address: "22 Camden Road, London NW1",
    relatedTo: "Linked to: 5 Nugent Terrace · introduced by Sarah Chen",
  },
  {
    id: "bc-5", name: "M&S", type: "occupant", initials: "MS",
    role: "Tenant · Shop, 5 Nugent Terrace",
    email: "store.ops@marksandspencer.com",
    phone: "020 7946 0440",
    contactPref: "prefers email",
    address: "Shop, 5 Nugent Terrace, London NW8",
    relatedTo: "Landlord: you · Linked unit: Shop, 5 Nugent Terrace",
  },
  {
    id: "bc-6", name: "R. Turner", type: "occupant", initials: "RT", flagged: true, flagLabel: "Rent review due",
    role: "Tenant · Flat 2, 5 Nugent Terrace",
    email: "r.turner@gmail.com",
    phone: "07700 900221",
    contactPref: "prefers phone",
    address: "Flat 2, 5 Nugent Terrace, London NW8",
    relatedTo: "Landlord: you · Linked unit: Flat 2, 5 Nugent Terrace",
  },
  {
    id: "bc-7", name: "Hartwell & Co", type: "misc", initials: "HC",
    role: "Solicitors · property team · contact: Elena Marsh",
    email: "e.marsh@hartwell.co.uk",
    phone: "020 7100 4422",
    contactPref: "prefers email",
    address: "3 Lincoln's Inn Fields, London WC2A",
    relatedTo: "Acts on: lease renewals, Flat 2 rent review · introduced by James Okoro",
  },
];



/* ---------------- Professor library types & seed ---------------- */

type DocStatus = "pending" | "extracting" | "extracted";
type DocFamily = "rto" | "amd" | "acd";
type ProfDoc = {
  id: string;
  name: string;
  type?: string;
  family?: DocFamily;
  timeClass?: string;
  relatedUnit?: string;
  supersedes?: string;
  chainedTo?: string;
  status: DocStatus;
  effectiveDate?: string;
  uploadedAt: string;
  extractedAt?: string;
};

const PROF_DOC_TYPES: { label: string; family: DocFamily; timeClass: string }[] = [
  { label: "Lease", family: "rto", timeClass: "Long-dated" },
  { label: "Deed of Variation", family: "amd", timeClass: "Effective from date" },
  { label: "Licence to Alter", family: "amd", timeClass: "Effective from date" },
  { label: "Tenancy Agreement (AST)", family: "rto", timeClass: "Fixed term" },
  { label: "EICR Certificate", family: "acd", timeClass: "Valid 5 years" },
  { label: "Fire Alarm Certificate", family: "acd", timeClass: "Valid 12 months" },
  { label: "Gas Safety Record", family: "acd", timeClass: "Valid 12 months" },
  { label: "Insurance Policy", family: "acd", timeClass: "Annual" },
];

const SEED_PROF_DOCS: ProfDoc[] = [
  {
    id: "pd-1", name: "Lease — Flat 2, 5 Nugent Terrace.pdf",
    type: "Lease", family: "rto", timeClass: "Long-dated",
    relatedUnit: "Flat 2, 5 Nugent Terrace",
    status: "extracted",
    effectiveDate: "12 Jun 2014",
    uploadedAt: "21 Jun 2026", extractedAt: "21 Jun 2026",
  },
  {
    id: "pd-2", name: "Deed of Variation — Flat 2.pdf",
    type: "Deed of Variation", family: "amd", timeClass: "Effective from date",
    relatedUnit: "Flat 2, 5 Nugent Terrace",
    chainedTo: "Lease — Flat 2, 5 Nugent Terrace.pdf",
    status: "extracted",
    effectiveDate: "03 Mar 2019",
    uploadedAt: "21 Jun 2026", extractedAt: "21 Jun 2026",
  },
  {
    id: "pd-3", name: "Licence to Alter — Flat 2 kitchen.pdf",
    type: "Licence to Alter", family: "amd", timeClass: "Effective from date",
    relatedUnit: "Flat 2, 5 Nugent Terrace",
    chainedTo: "Lease — Flat 2, 5 Nugent Terrace.pdf",
    status: "extracted",
    effectiveDate: "14 Sep 2021",
    uploadedAt: "22 Jun 2026", extractedAt: "22 Jun 2026",
  },
  {
    id: "pd-4", name: "EICR — 5 Nugent Terrace.pdf",
    type: "EICR Certificate", family: "acd", timeClass: "Valid 5 years",
    relatedUnit: "5 Nugent Terrace (building)",
    status: "extracted",
    effectiveDate: "08 Jan 2024",
    uploadedAt: "23 Jun 2026", extractedAt: "23 Jun 2026",
  },
  {
    id: "pd-5", name: "Fire Alarm Certificate — 5 Nugent Terrace.pdf",
    type: "Fire Alarm Certificate", family: "acd", timeClass: "Valid 12 months",
    relatedUnit: "5 Nugent Terrace (building)",
    supersedes: "Fire Alarm Certificate (2025).pdf",
    status: "pending",
    effectiveDate: "—",
    uploadedAt: "25 Jun 2026",
  },
];

type ProfEvent =
  | { kind: "ask-type"; id: string; docIds: string[]; resolved?: { type: string; family: DocFamily } }
  | { kind: "professor"; id: string; text: string };

/* ---------------- Magician workshop types & seed ---------------- */

type WorkflowStatus = "built" | "draft";
type WorkflowIconKey = "calendar" | "shield" | "alert" | "bell" | "leaf" | "wand";
type WorkflowOwner =
  | { kind: "all_teams" }
  | { kind: "person"; name: string; role?: string; initials: string };

type Workflow = {
  id: string;
  name: string;
  purpose: string;
  icon: WorkflowIconKey;
  tone: "purple" | "teal" | "amber" | "slate";
  status: WorkflowStatus;
  trigger: string;     // "When ..."
  action: string;      // "I will ..."
  scopeLabel: string;  // short summary
  scopeDetail?: string[]; // long form on expand
  owner: WorkflowOwner;
  lastAdjusted?: string;
  stepCount?: number;
  justBuilt?: boolean;
  description?: string;
  whenLabel?: string;
  whenKey?: "6m" | "3m" | "on" | "always" | "custom";
  visibility?: "personal" | "company";
  draftState?: MagBuildState;
  stepTemplates?: Record<string, StepTemplate>; // keyed by step id; doc-producing steps may use the user's own template
  steps?: { id: string; label: string; phrase: string }[]; // assembled steps — used for "Run a simulation"
  // build-state echoes — kept so Adjust can re-walk the full build flow with the workflow's saved values
  watch?: "rent_reviews" | "compliance" | "notices" | "other";
  lead?: "6m" | "3m" | "on";
  leadLabel?: string;
  triggerPhrase?: string;
  scope?: "unit" | "property" | "portfolio";
  scopeSelection?: ScopeSelection;
  ownerLabel?: string;
  activity?: ActivityEntry[]; // attributed change log — most recent first
};

type ActivityActor = { name: string; initials: string; role?: string };
type ActivityEntry = {
  id: string;
  ts: number;       // epoch ms (for sort)
  tsLabel: string;  // formatted "27 Jun 2026, 08:38"
  actor: ActivityActor;
  action: string;   // "Built", "Scope changed to Whole portfolio", "Steps edited", "Paused", "Resumed"
};



type StepTemplate = { mode: "standard" | "own"; filename?: string };

type MagBuildStep = { id: string; label: string; phrase: string; uid: string; template?: StepTemplate };
type MagBuildStepKey = "intake" | "q1" | "q2" | "q3" | "q3b" | "q4" | "q5" | "q6";

// Steps that produce an output document — these get the "Template: standard / own" affordance.
const DOC_STEP_IDS = new Set(["section13", "email", "surveyor", "draft_notice", "access_notice", "summary_review"]);
const DOC_STEP_LABEL_RE = /\b(section\s*13|notice|letter|email|instruction|memorandum|report|draft|prepare|create)\b/i;
const NON_DOC_STEP_LABEL_RE = /\b(read|gather|audit|outline|notify|schedule|log|review|check|monitor|watch|confirm)\b/i;
function isDocStep(s: { id: string; label: string }): boolean {
  if (DOC_STEP_IDS.has(s.id)) return true;
  if (s.id === "custom") {
    return DOC_STEP_LABEL_RE.test(s.label) && !NON_DOC_STEP_LABEL_RE.test(s.label);
  }
  return false;
}
function templateOf(s: MagBuildStep): StepTemplate { return s.template ?? { mode: "standard" }; }
function collectStepTemplates(steps: MagBuildStep[]): Record<string, StepTemplate> | undefined {
  const out: Record<string, StepTemplate> = {};
  for (const s of steps) {
    if (isDocStep(s) && s.template && s.template.mode === "own") out[s.id] = s.template;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}
type MagEditField = "intake" | "watch" | "scope" | "scopeUnit" | "owner";

type ScopeLevel = "portfolio" | "properties" | "units";
type PropertyGranularity = "units" | "record" | "both";
type ScopeSelection = {
  level: ScopeLevel;
  propertyIds: string[];           // selected when level === "properties"
  unitIds: string[];               // selected when level === "units"
  propertyGranularity: PropertyGranularity; // applies when level === "properties"
};

type MagBuildState = {
  step: MagBuildStepKey;
  // intake (user-authored)
  title?: string;
  purpose?: string;
  description?: string;
  whenKey?: "6m" | "3m" | "on" | "always" | "custom";
  whenLabel?: string;
  visibility?: "personal" | "company";
  // build conversation
  watch?: "rent_reviews" | "compliance" | "notices" | "other";
  watchLabel?: string;
  lead?: "6m" | "3m" | "on";
  leadLabel?: string;
  triggerPhrase?: string;
  scope?: "unit" | "property" | "portfolio";
  scopeLabel?: string;
  scopeDetail?: string[];
  scopeSelection?: ScopeSelection;
  owner?: WorkflowOwner;
  ownerLabel?: string;
  steps: MagBuildStep[];
  addOpen?: boolean;
  customDraft?: string;
  // trace-back
  editing?: { field: MagEditField; returnStep: MagBuildStepKey };
  stepsTouched?: boolean; // user has personally tweaked steps — don't silently overwrite
  templateNarrated?: boolean; // Magician has explained the template option once already this build
};
type MagicianEvent =
  | { kind: "magician"; id: string; text: string }
  | { kind: "user"; id: string; text: string }
  | { kind: "built"; id: string; workflowId: string; name: string; stepCount: number }
  | { kind: "sim_header"; id: string; workflowName: string; trigger: string };

const MAG_DEFAULT_STEPS: { id: string; label: string; phrase: string }[] = [
  { id: "read_lease", label: "Read the lease and confirm the review basis & date", phrase: "read the lease" },
  { id: "comparables", label: "Gather comparable evidence", phrase: "gather comparables" },
  { id: "surveyor", label: "Prepare a surveyor instruction", phrase: "prepare the surveyor instruction" },
  { id: "section13", label: "Create the Section 13 notice", phrase: "create the Section 13 notice" },
  { id: "email", label: "Draft the covering email to the tenant", phrase: "draft the covering email" },
];
const MAG_ADD_OPTIONS: { id: string; label: string; phrase: string }[] = [
  { id: "comparables", label: "Gather comparables", phrase: "gather comparables" },
  { id: "surveyor", label: "Prepare surveyor instruction", phrase: "prepare the surveyor instruction" },
  { id: "section13", label: "Create Section 13 notice", phrase: "create the Section 13 notice" },
  { id: "email", label: "Draft covering email", phrase: "draft the covering email" },
  { id: "summary_review", label: "Prepare review summary", phrase: "prepare a review summary" },
  { id: "notify_owner", label: "Notify owner", phrase: "notify the owner" },
];

const MAG_DEFAULTS_BY_WATCH: Record<"rent_reviews" | "compliance" | "notices" | "other", { id: string; label: string; phrase: string }[]> = {
  rent_reviews: MAG_DEFAULT_STEPS,
  compliance: [
    { id: "cert_audit", label: "Audit current certificates and expiry dates", phrase: "audit certificates" },
    { id: "schedule_renewal", label: "Schedule renewal visits with contractors", phrase: "schedule renewal visits" },
    { id: "access_notice", label: "Draft tenant access notices", phrase: "draft access notices" },
    { id: "log_certs", label: "Log new certificates on the unit record", phrase: "log certificates" },
  ],
  notices: [
    { id: "read_lease", label: "Read the lease and confirm notice mechanics", phrase: "read the lease" },
    { id: "draft_notice", label: "Draft the notice", phrase: "draft the notice" },
    { id: "email", label: "Draft the covering email to the tenant", phrase: "draft the covering email" },
  ],
  other: [
    { id: "outline", label: "Outline the task in your words", phrase: "outline the task" },
  ],
};

const SEED_WORKFLOWS: Workflow[] = [];

// Current actor for prototype-attribution (in a real app this would come from auth).
const CURRENT_ACTOR: ActivityActor = { name: "Marc Trup", initials: "MT", role: "Owner" };

const formatActivityStamp = (d: Date = new Date()) => {
  const date = d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
  return { ts: d.getTime(), label: `${date}, ${time}` };
};
const makeActivity = (action: string, actor: ActivityActor = CURRENT_ACTOR): ActivityEntry => {
  const t = formatActivityStamp();
  return { id: `act-${t.ts}-${Math.random().toString(36).slice(2, 6)}`, ts: t.ts, tsLabel: t.label, actor, action };
};
const prependActivity = (existing: ActivityEntry[] | undefined, entries: ActivityEntry[]) =>
  [...entries, ...(existing ?? [])];

// Diff two build snapshots and return concise change descriptions for the activity log.
const diffWorkflowChanges = (prev: Workflow, b: MagBuildState): string[] => {
  const changes: string[] = [];
  const newName = (b.title?.trim() || prev.name);
  if (newName && newName !== prev.name) changes.push(`Title changed to "${newName}"`);
  const newScope = b.scopeLabel || prev.scopeLabel;
  if (newScope && newScope !== prev.scopeLabel) changes.push(`Scope changed to ${newScope}`);
  if (b.whenLabel && b.whenLabel !== prev.whenLabel) changes.push(`Timing changed to ${b.whenLabel}`);
  if (b.visibility && b.visibility !== prev.visibility) {
    changes.push(`Visibility changed to ${b.visibility === "company" ? "Company-wide" : "Personal"}`);
  }
  const prevOwner = prev.owner?.kind === "all_teams" ? "All teams" : prev.owner && "name" in prev.owner ? prev.owner.name : "";
  const newOwner = b.owner?.kind === "all_teams" ? "All teams" : b.owner && "name" in b.owner ? b.owner.name : "";
  if (newOwner && newOwner !== prevOwner) changes.push(`Owner changed to ${newOwner}`);
  const prevStepKey = (prev.steps ?? []).map((s) => `${s.id}:${s.label}`).join("|");
  const newStepKey = b.steps.map((s) => `${s.id}:${s.label}`).join("|");
  if (newStepKey !== prevStepKey) changes.push("Steps edited");
  const prevTpls = JSON.stringify(prev.stepTemplates ?? {});
  const newTpls = JSON.stringify(collectStepTemplates(b.steps) ?? {});
  if (prevTpls !== newTpls) changes.push("Templates updated");
  return changes;
};


const MAGICIAN_STAFF: { name: string; role: string; initials: string }[] = [
  { name: "Sarah Chen", role: "Asset Manager", initials: "SC" },
  { name: "James Okoro", role: "Lease Manager", initials: "JO" },
  { name: "Priya Shah", role: "Compliance Lead", initials: "PS" },
  { name: "Tom Whitfield", role: "Portfolio Analyst", initials: "TW" },
];




/* ---------------- Config ---------------- */

const FIRST_NAME = "Alex"; // easily-editable

const OWLS = {
  talking: owlTalking,
  default: owlDefault,
  reading: owlReading,
  covering: owlCovering,
} as const;
type OwlState = keyof typeof OWLS;

/* ---------------- Data ---------------- */

type ConfirmedEnding = "none" | "end_tenancy" | "replacement_chain" | "reversionary_started";
type ChainSignal = "notice_to_vacate" | "surrender_notice" | "break_notice";

type Unit = {
  id: string;
  label: string;
  status: "Let" | "Vacant"; // Let = occupied; Vacant = confirmed ended (re-lettable)
  termEndDate?: string;     // ISO date of current term end (optional)
  confirmedEnding?: ConfirmedEnding; // proof a tenancy has ended
  nextBreak?: string;       // ISO date
  nextReview?: string;      // ISO date
  chainSignals?: ChainSignal[];
  tenant?: string;
  rent?: string;
  leaseTo?: string;
  break?: string;
  review?: string;
  epc?: string;
  vacantSince?: string;
  lastTenant?: string;
  lastRent?: string;
};

type Confidence = "confirmed" | "inferred";

type PanelItem = {
  key: string;
  label: string;
  value?: string;
  confidence: Confidence;
  note?: string;
};

type UnitDerived = {
  items: PanelItem[];
  hasAlert: boolean;
  isVacantConfirmed: boolean;
  isEndingInferred: boolean;
  hasUpcomingBreakOrReview: boolean;
};

const TODAY = new Date("2026-06-24T00:00:00Z");

function formatUkDate(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso + "T00:00:00Z");
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

function isFuture(iso?: string): boolean {
  if (!iso) return false;
  return new Date(iso + "T00:00:00Z").getTime() > TODAY.getTime();
}
function isPast(iso?: string): boolean {
  if (!iso) return false;
  return new Date(iso + "T00:00:00Z").getTime() < TODAY.getTime();
}

const CHAIN_SIGNAL_LABEL: Record<ChainSignal, string> = {
  notice_to_vacate: "notice to vacate in chain",
  surrender_notice: "surrender notice in chain",
  break_notice: "break notice in chain",
};

function deriveUnit(u: Unit): UnitDerived {
  const items: PanelItem[] = [];
  const confirmedEnding = u.confirmedEnding && u.confirmedEnding !== "none";
  const isVacantConfirmed = u.status === "Vacant" || !!confirmedEnding;
  const termPassed = isPast(u.termEndDate);
  const chain = u.chainSignals ?? [];

  if (isVacantConfirmed) {
    items.push({
      key: "vacant",
      label: "Vacant",
      confidence: "confirmed",
      note: "tenancy confirmed ended — available to let",
    });
  } else {
    // Inferred endings (term passed OR a chain notice exists, with no confirmed ending)
    if (termPassed) {
      items.push({
        key: "ending-term",
        label: "Tenancy ending",
        value: `term ended ${formatUkDate(u.termEndDate)}`,
        confidence: "inferred",
        note: "not confirmed vacated — rent may still be due. Needs checking.",
      });
    } else if (chain.length > 0) {
      items.push({
        key: "ending-chain",
        label: "Tenancy ending",
        value: CHAIN_SIGNAL_LABEL[chain[0]],
        confidence: "inferred",
        note: "signal only — not a confirmed ending. Rent may still be due. Needs checking.",
      });
    }

    // Breaks and reviews are historical once term has passed
    if (!termPassed) {
      if (isFuture(u.nextBreak)) {
        items.push({
          key: "break",
          label: "Next break",
          value: formatUkDate(u.nextBreak) ?? "",
          confidence: "confirmed",
        });
      }
      if (isFuture(u.nextReview)) {
        items.push({
          key: "review",
          label: "Next review",
          value: formatUkDate(u.nextReview) ?? "",
          confidence: "confirmed",
        });
      }
    }
  }

  const isEndingInferred = items.some((i) => i.key === "ending-term" || i.key === "ending-chain");
  const hasUpcomingBreakOrReview = items.some((i) => i.key === "break" || i.key === "review");

  return {
    items,
    hasAlert: items.length > 0,
    isVacantConfirmed,
    isEndingInferred,
    hasUpcomingBreakOrReview,
  };
}

type Property = {
  id: string;
  name: string;
  area: string;        // short label (e.g. "NW11") used in compact subtitles
  address: string;     // full address line for hover / greeting
  postcode: string;
  lat: number;
  lng: number;
  units: Unit[];
  standalone?: boolean; // true = no Property layer; opens straight to its single unit
};

const PROPERTIES: Property[] = [
  {
    id: "stanley",
    name: "Stanley House",
    area: "1115 Finchley Road, NW11",
    address: "Stanley House — 1115 Finchley Road, London NW11",
    postcode: "NW11",
    lat: 51.583,
    lng: -0.197,
    units: [
      { id: "stanley-f1",  label: "Flat 1",  status: "Let", termEndDate: "2027-03-24" },
      { id: "stanley-f2",  label: "Flat 2",  status: "Let", termEndDate: "2026-09-15" },
      { id: "stanley-f3",  label: "Flat 3",  status: "Let", termEndDate: "2026-03-24", confirmedEnding: "none" },
      { id: "stanley-f4",  label: "Flat 4",  status: "Let", termEndDate: "2028-01-10" },
      { id: "stanley-f5",  label: "Flat 5",  status: "Let", termEndDate: "2026-08-30" },
      { id: "stanley-f6",  label: "Flat 6",  status: "Let", termEndDate: "2027-11-02", nextBreak: "2027-05-02", nextReview: "2027-03-01" },
      { id: "stanley-f7",  label: "Flat 7",  status: "Let", termEndDate: "2025-12-01", confirmedEnding: "none" },
      { id: "stanley-f8",  label: "Flat 8",  status: "Vacant", confirmedEnding: "end_tenancy" },
      { id: "stanley-f9",  label: "Flat 9",  status: "Let", termEndDate: "2027-05-20" },
      { id: "stanley-f10", label: "Flat 10", status: "Let", termEndDate: "2028-04-04", chainSignals: ["notice_to_vacate"] },
      { id: "stanley-f11", label: "Flat 11", status: "Let", termEndDate: "2027-02-18" },
      { id: "stanley-shop", label: "Shop",   status: "Vacant", confirmedEnding: "end_tenancy" },
    ],
  },
  {
    id: "nugent",
    name: "5 Nugent Terrace",
    area: "NW8",
    address: "5 Nugent Terrace, London NW8",
    postcode: "NW8",
    lat: 51.5325,
    lng: -0.1787,
    units: [
      { id: "nugent-f1",   label: "Flat 1", status: "Let", termEndDate: "2027-07-10" },
      { id: "nugent-f2",   label: "Flat 2", status: "Let", termEndDate: "2026-05-30", confirmedEnding: "none" },
      { id: "nugent-f3",   label: "Flat 3", status: "Vacant", confirmedEnding: "end_tenancy" },
      { id: "nugent-shop", label: "Shop",   status: "Let", termEndDate: "2026-08-20" },
    ],
  },
  {
    id: "hamilton",
    name: "32 Hamilton Gardens",
    area: "NW8",
    address: "32 Hamilton Gardens, London NW8",
    postcode: "NW8",
    lat: 51.5298,
    lng: -0.1758,
    standalone: true,
    units: [
      { id: "hamilton-unit", label: "32 Hamilton Gardens", status: "Let" },
    ],
  },
];

/* ---------- Scope picker helpers (reusable across all workflow builds) ---------- */

const EMPTY_SCOPE: ScopeSelection = {
  level: "portfolio",
  propertyIds: [],
  unitIds: [],
  propertyGranularity: "units",
};

function granularityWord(g: PropertyGranularity): string {
  return g === "units" ? "units" : g === "record" ? "record" : "units + record";
}

/** Concise summary used for "Applies to", SO FAR and built workflow cards. */
function summariseScope(sel: ScopeSelection): { label: string; detail?: string[] } {
  if (sel.level === "portfolio") return { label: "Whole portfolio" };

  if (sel.level === "properties") {
    const props = PROPERTIES.filter((p) => sel.propertyIds.includes(p.id));
    const g = granularityWord(sel.propertyGranularity);
    if (props.length === 0) return { label: "Properties · none selected yet" };
    if (props.length === 1) return { label: `Properties (${g}) · ${props[0].name}` };
    return {
      label: `Properties (${g}) · ${props[0].name} + ${props.length - 1} other${props.length - 1 > 1 ? "s" : ""}`,
      detail: props.map((p) => p.name),
    };
  }

  // units — grouped by property
  const groups = PROPERTIES
    .map((p) => ({ property: p, units: p.units.filter((u) => sel.unitIds.includes(u.id)) }))
    .filter((g) => g.units.length > 0);
  const total = groups.reduce((n, g) => n + g.units.length, 0);
  if (total === 0) return { label: "Units · none selected yet" };
  if (groups.length === 1) {
    const g = groups[0];
    if (g.units.length === 1) return { label: `Units · ${g.units[0].label}, ${g.property.name}` };
    if (g.units.length === 2) return { label: `Units · ${g.units[0].label} and ${g.units[1].label}, ${g.property.name}` };
    return { label: `Units · ${g.units.length} in ${g.property.name}`, detail: g.units.map((u) => `${u.label}, ${g.property.name}`) };
  }
  return {
    label: `Units · ${total} across ${groups.length} properties`,
    detail: groups.map((g) => `${g.property.name} — ${g.units.map((u) => u.label).join(", ")}`),
  };
}

/* ---------- Proactive Action cards (portfolio briefing) ---------- */


type Urgency = "now" | "week" | "watch";
type TriggerType = "review" | "break" | "compliance" | "notice" | "expiry";
type ApprovalState = "pending" | "in_progress" | "approved" | "deferred" | "dismissed";
type AnchorLevel = "unit" | "property";

type CardOrigin =
  | { kind: "hobson" }
  | { kind: "user"; name: string; initials: string };

type ActionCard = {
  id: string;
  propertyId: string;
  unitId?: string;               // present for unit-anchored cards
  unitLabel?: string;            // present for unit-anchored cards
  propertyName: string;
  anchorLevel: AnchorLevel;      // where the action lives / who owns it
  relevantUnitIds?: string[];    // for property-anchored: affected units (omitted = all units)
  triggerType: TriggerType;
  title: string;
  whyItMatters: string;          // confirmed/inferred prose, plain language
  confidence: Confidence;
  hobsonPrepared: string;        // what's already drafted
  proposedAction: string;        // primary button label for confirmed items
  urgency: Urgency;
  approvalState: ApprovalState;
  preparedDetail: string;        // what Hobson will do, on approve-expand
  addedBy: CardOrigin;           // who logged this card (Hobson proactively, or a user)
  workflowRef?: string;          // e.g. "PA-001" — links back to the Magician's workflow
  manualNote?: string;           // user-supplied note when handled manually
  manuallyCompleted?: boolean;   // true if user pressed "Let me handle this" → Complete
  reviewReady?: boolean;         // true once the Perform journey has reached its final approval gate
};

const INITIAL_ACTION_CARDS: ActionCard[] = [
  {
    id: "act-stanley-fra",
    propertyId: "stanley",
    propertyName: "Stanley House",
    anchorLevel: "property",
    triggerType: "compliance",
    title: "Fire alarm certification expiring — Stanley House",
    whyItMatters: "Annual fire alarm certificate for the building expires 12 July 2026 (confirmed from last year's certificate). Covers the whole property — every occupied unit needs access notice for the engineer's visit.",
    confidence: "confirmed",
    hobsonPrepared: "I've drafted one instruction to your usual fire alarm engineer, plus access notices for every current tenant — one per occupied unit.",
    proposedAction: "Review & approve",
    urgency: "now",
    approvalState: "in_progress",
    preparedDetail:
      "I'll email the engineer with building access notes, send each current tenant their access notice naming their unit, copy you on everything, and add the renewed certificate to the compliance calendar.",
    addedBy: { kind: "hobson" },
    workflowRef: "PA-001",
    reviewReady: true,
  },
  {
    id: "act-stanley-f8-review",
    propertyId: "stanley",
    unitId: "stanley-f8",
    unitLabel: "Flat 8",
    propertyName: "Stanley House",
    anchorLevel: "unit",
    triggerType: "review",
    title: "Rent review due — Flat 8, Stanley House",
    whyItMatters: "Review date confirmed for March 2027 in the lease.",
    confidence: "confirmed",
    hobsonPrepared: "I've reviewed the lease and drafted the review summary, with comparable evidence pulled from the last 12 months.",
    proposedAction: "Review & approve",
    urgency: "now",
    approvalState: "pending",
    preparedDetail:
      "I'll send the review notice to the tenant's registered address using your standard cover letter, attach the drafted summary and comparables, and log the served-on date in the unit record.",
    addedBy: { kind: "hobson" },
    workflowRef: "PA-004",
  },
  {
    id: "act-stanley-f3-holdover",
    propertyId: "stanley",
    unitId: "stanley-f3",
    unitLabel: "Flat 3",
    propertyName: "Stanley House",
    anchorLevel: "unit",
    triggerType: "expiry",
    title: "Term ended — Flat 3, Stanley House",
    whyItMatters:
      "Term ended 24 March 2026 and I can't see a confirmed vacation or renewal — so I'm treating this as still let. Rent may still be due. Worth checking.",
    confidence: "inferred",
    hobsonPrepared: "I haven't acted on this — only flagged it. I won't assume the tenancy has ended without evidence.",
    proposedAction: "Open unit to check",
    urgency: "week",
    approvalState: "pending",
    preparedDetail: "",
    addedBy: { kind: "hobson" },
  },
  {
    id: "act-nugent-f2-holdover",
    propertyId: "nugent",
    unitId: "nugent-f2",
    unitLabel: "Flat 2",
    propertyName: "5 Nugent Terrace",
    anchorLevel: "unit",
    triggerType: "expiry",
    title: "Term ended — Flat 2, 5 Nugent Terrace",
    whyItMatters:
      "Term ended 30 May 2026, no confirmed ending on file. Rent may still be due — worth a human eye.",
    confidence: "inferred",
    hobsonPrepared: "I haven't acted on this — flagged only.",
    proposedAction: "Open unit to check",
    urgency: "watch",
    approvalState: "pending",
    preparedDetail: "",
    addedBy: { kind: "hobson" },
  },
  {
    id: "act-stanley-f7-holdover",
    propertyId: "stanley",
    unitId: "stanley-f7",
    unitLabel: "Flat 7",
    propertyName: "Stanley House",
    anchorLevel: "unit",
    triggerType: "expiry",
    title: "Term ended — Flat 7, Stanley House",
    whyItMatters:
      "Term ended 1 December 2025, nothing confirmed since. Treating as still let until checked.",
    confidence: "inferred",
    hobsonPrepared: "Flagged only — no action taken.",
    proposedAction: "Open unit to check",
    urgency: "watch",
    approvalState: "pending",
    preparedDetail: "",
    addedBy: { kind: "hobson" },
  },
  {
    id: "act-nugent-shop-leak",
    propertyId: "nugent",
    unitId: "nugent-shop",
    unitLabel: "Shop",
    propertyName: "5 Nugent Terrace",
    anchorLevel: "unit",
    triggerType: "compliance",
    title: "Tenant reported small leak — Shop, 5 Nugent Terrace",
    whyItMatters: "M&S manager called Friday — slow leak under the back-of-house sink. Not urgent but needs a plumber visit and a follow-up on whose repair obligation this falls under.",
    confidence: "confirmed",
    hobsonPrepared: "Nothing prepared yet — I didn't log this one. Sarah added it after the phone call.",
    proposedAction: "Open unit",
    urgency: "week",
    approvalState: "pending",
    preparedDetail: "",
    addedBy: { kind: "user", name: "Sarah Chen", initials: "SC" },
  },
  {
    id: "act-stanley-f5-break",
    propertyId: "stanley",
    unitId: "stanley-f5",
    unitLabel: "Flat 5",
    propertyName: "Stanley House",
    anchorLevel: "unit",
    triggerType: "expiry",
    title: "Notice deadline approaching — Flat 5, Stanley House",
    whyItMatters: "The lease has a tenant break clause exercisable on 24 December 2026. Latest date to serve a valid landlord counter-notice is 24 September 2026 — about 90 days away. If you want to act, the window is still open.",
    confidence: "confirmed",
    hobsonPrepared: "I've identified the clause, the recipient details, and a compliant service method. Nothing has been served — only prepared.",
    proposedAction: "Review & approve",
    urgency: "week",
    approvalState: "pending",
    preparedDetail:
      "I'll prepare the notice on your standard template, addressed to the tenant at the lease service address, served by recorded delivery with a deemed-receipt date logged against the unit record.",
    addedBy: { kind: "hobson" },
    workflowRef: "PA-002",
  },
  {
    id: "act-nugent-shop-effect",
    propertyId: "nugent",
    unitId: "nugent-shop",
    unitLabel: "Shop",
    propertyName: "5 Nugent Terrace",
    anchorLevel: "unit",
    triggerType: "expiry",
    title: "Served notice about to take effect — Shop, 5 Nugent Terrace",
    whyItMatters: "The Section 25 notice served on M&S on 14 March 2026 takes effect on 28 September 2026 — 28 days away. Tenancy ends on that date unless renewal terms are agreed first.",
    confidence: "confirmed",
    hobsonPrepared: "Nothing needs serving — this is informational. I can prepare the follow-on work (end-of-tenancy checklist or renewal pack) if you want.",
    proposedAction: "Review & approve",
    urgency: "now",
    approvalState: "pending",
    preparedDetail:
      "I'll assemble the end-of-tenancy checklist (keys, meter readings, dilapidations schedule, final account) or a renewal pack with revised heads of terms — your call inside the flow.",
    addedBy: { kind: "hobson" },
    workflowRef: "PA-003",
  },
];

/** Workflow reference labels (link back to the Magician's workshop). */
const WORKFLOW_REF_NAMES: Record<string, string> = {
  "PA-001": "Compliance renewals",
  "PA-002": "Notice deadlines (break)",
  "PA-003": "Notice deadlines (expiry)",
  "PA-004": "Rent review watch",
};

/** Selects the action cards relevant at a given vantage point. Same objects — no duplication. */
function selectActionsForScope(
  cards: ActionCard[],
  scope: { level: "portfolio" } | { level: "property"; propertyId: string } | { level: "unit"; propertyId: string; unitId: string }
): ActionCard[] {
  if (scope.level === "portfolio") return cards;
  if (scope.level === "property") return cards.filter((c) => c.propertyId === scope.propertyId);
  // unit: this unit's own actions + property-anchored actions relevant to it
  return cards.filter((c) => {
    if (c.propertyId !== scope.propertyId) return false;
    if (c.anchorLevel === "unit") return c.unitId === scope.unitId;
    // property-anchored: relevant if relevantUnitIds omitted OR includes this unit
    return !c.relevantUnitIds || c.relevantUnitIds.includes(scope.unitId);
  });
}

/** Vantage-appropriate location label (e.g. "Flat 8" at property; "Property-wide" for property-anchored). */
function locationLabelForCard(card: ActionCard, level: "portfolio" | "property" | "unit"): string {
  if (card.anchorLevel === "property") return "Property-wide";
  // unit-anchored
  if (level === "portfolio") return `${card.unitLabel} · ${card.propertyName}`;
  if (level === "property") return card.unitLabel ?? "Unit";
  return card.unitLabel ?? "This unit";
}



/* ---------------- Onboarding script ---------------- */

type Beat = {
  owl: OwlState;
  lines: string[];
  prefill: string;
  mapAction:
    | "none"
    | "pulse-one"
    | "pulse-one-doc"
    | "pulse-all"
    | "spread"
    | "check-one";
};

const BEATS: Beat[] = [
  {
    owl: "talking",
    lines: [
      `Good morning, ${FIRST_NAME}. I am Hobson — a colleague entrusted with the care of your portfolio.`,
      "If I may, I should like to explain how I work.",
    ],
    prefill: "Please do.",
    mapAction: "none",
  },
  {
    owl: "default",
    lines: [
      "Your assets — your properties and units — are what I seek to understand. Your documents are how I come to understand them.",
    ],
    prefill: "How do you see my portfolio?",
    mapAction: "none",
  },
  {
    owl: "default",
    lines: [
      "I regard your portfolio as a collection of units — some gathered under one roof as a Property, others standing alone. The unit is the occupiable space, and it sits at the very heart of how I see things.",
    ],
    prefill: "And where do documents come in?",
    mapAction: "pulse-one",
  },
  {
    owl: "reading",
    lines: [
      "I read two families of document: those that describe the occupation, and those that describe the asset itself — the property and its units.",
    ],
    prefill: "How does your reading become knowledge?",
    mapAction: "pulse-one-doc",
  },
  {
    owl: "default",
    lines: [
      "Seldom does one document tell the whole story. I build understanding by drawing the connections between them — a lease, the variation that altered its rent, the assignment that brought in a new tenant. From those connections I form Unit and Property Knowledge, and together they build your Portfolio Knowledge.",
    ],
    prefill: "What does that let you do for me?",
    mapAction: "pulse-all",
  },
  {
    owl: "talking",
    lines: [
      "For now, I answer your questions and keep your information organised, connected, and current. As my knowledge grows, I shall do more: read the documents, gather what is needed, and prepare the work — then bring it to you for approval. The decision is always yours; the preparation is mine.",
      "That is the essence of it. Whenever you are ready, choose a property or unit and we shall begin.",
    ],
    prefill: "",
    mapAction: "check-one",
  },
];

/* ---------------- Helpers ---------------- */

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type FeedbackGrade = "helpful" | "partly" | "not";
type FeedbackState = {
  grade?: FeedbackGrade;
  note?: string;
  chips?: string[];
  submitted?: boolean;
};
type ChatMsg = {
  id: string;
  role: "hobson" | "user";
  text: string;
  streaming?: boolean;
  rich?: "rentFlat2" | "summary";
  kind?: "feedback";
  feedback?: FeedbackState;
  /** Optional component-tag chips offered with the feedback ask (Helpful/Partly/Not). */
  feedbackChips?: string[];
  /** Payload for `rich: "summary"` bubbles. */
  summary?: { kind: "occupational" | "compliance"; scope: SummaryScope };
};

const CHAT_TURN_GAP_PX = 24;
const CHAT_GROUP_BUBBLE_GAP_PX = 8;
const CHAT_TOP_GAP_PX = 20;

type ChatMessageGroup = {
  id: string;
  role: ChatMsg["role"];
  messages: ChatMsg[];
};

function groupChatMessages(messages: ChatMsg[]): ChatMessageGroup[] {
  return messages.reduce<ChatMessageGroup[]>((groups, message) => {
    const last = groups[groups.length - 1];
    if (last && last.role === message.role) {
      last.messages.push(message);
      return groups;
    }

    groups.push({ id: message.id, role: message.role, messages: [message] });
    return groups;
  }, []);
}

const RENT_Q_PATTERNS = [
  /^\s*rent\s*\??\s*$/i,
  /^\s*rent\s+flat\s*2\s*\??\s*$/i,
  /^\s*rent\s+flat\s*2\s+nugent\s+terrace\s*\??\s*$/i,
  /^\s*what'?s?\s+the\s+current\s+rent\s*\??\s*$/i,
  /^\s*what\s+is\s+the\s+(current\s+)?rent\s*\??\s*$/i,
  /^\s*current\s+rent\s*\??\s*$/i,
  /^\s*current\s+rent\s+flat\s*2\s*\??\s*$/i,
];
const isRentFlat2Question = (q: string) => RENT_Q_PATTERNS.some((re) => re.test(q));
const rentPrefillFor = (view: string, propertyId: string | null, unitId: string | null): string => {
  if (view === "unit" && unitId === "nugent-f2") return "What is the rent?";
  if (view === "property" && propertyId === "nugent") return "rent flat 2?";
  if (view === "portfolio") return "rent flat 2 Nugent Terrace?";
  return "";
};


/* ---------------- Map ---------------- */

type UnitPin = { id: string; lat: number; lng: number; label: string; status: "Let" | "Vacant" };

type MapHighlight = {
  pulse: "none" | "one" | "all";
  pulseId?: string;
  showDoc?: boolean;
  spread?: boolean;
  check?: boolean;
  focus?: { lat: number; lng: number; zoom: number } | null;
  dimExcept?: string | null;
  activeUnitPropertyId?: string | null;
  matchIds?: string[] | null;
  fadeNonMatches?: boolean;
  hoverId?: string | null;
  unitPins?: UnitPin[] | null;
  activeUnitId?: string | null;
};

function HobsonMap({
  onPropertyClick,
  highlight,
  onPinHover,
  onUnitClick,
}: {
  onPropertyClick: (id: string) => void;
  highlight: MapHighlight;
  onPinHover?: (id: string | null) => void;
  onUnitClick?: (unitId: string) => void;
}) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const unitMarkersRef = useRef<Record<string, L.Marker>>({});
  const connectorsRef = useRef<Record<string, L.Polyline>>({});

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    const reduced = prefersReducedMotion();
    const map = L.map(mapRef.current, {
      center: [51.555, -0.185],
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
      zoomAnimation: !reduced,
      fadeAnimation: !reduced,
      markerZoomAnimation: !reduced,
    });
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      { maxZoom: 19 }
    ).addTo(map);
    L.control.zoom({ position: "bottomright" }).addTo(map);
    mapInstance.current = map;

    PROPERTIES.forEach((p) => {
      const isCluster = !p.standalone && p.units.length > 1;
      const html = isCluster
        ? `<div class="hp-cluster" data-pid="${p.id}"><span>${p.units.length}</span></div>`
        : `<div class="hp-pin" data-pid="${p.id}"><div class="hp-pin-dot"></div></div>`;
      const icon = L.divIcon({
        html,
        className: "hp-marker",
        iconSize: isCluster ? [38, 38] : [28, 38],
        iconAnchor: isCluster ? [19, 19] : [14, 36],
      });
      const m = L.marker([p.lat, p.lng], { icon }).addTo(map);
      m.bindTooltip(p.address, {
        direction: "top",
        offset: [0, isCluster ? -18 : -34],
        className: "hp-tooltip",
      });
      m.on("click", () => onPropertyClick(p.id));
      m.on("mouseover", () => onPinHover?.(p.id));
      m.on("mouseout", () => onPinHover?.(null));
      // Double-click an overlap-spread pin → zoom to fit its collision group
      m.on("dblclick", (e) => {
        L.DomEvent.stopPropagation(e);
        const el = m.getElement();
        if (!el?.classList.contains("is-overlap-spread")) return;
        const groupIds = Object.keys(connectorsRef.current);
        if (!groupIds.length) return;
        const groupBounds = L.latLngBounds(
          PROPERTIES.filter((q) => groupIds.includes(q.id)).map((q) => [q.lat, q.lng] as [number, number])
        );
        map.flyToBounds(groupBounds, { padding: [80, 80], maxZoom: 17, duration: reduced ? 0 : 0.6 });
      });
      markersRef.current[p.id] = m;
    });

    /* ---- Collision / spiderfy: keep true count + identity, just visually fan out ---- */
    const recomputeOverlap = () => {
      // Reset markers to their true locations and clear connectors
      PROPERTIES.forEach((p) => {
        const m = markersRef.current[p.id];
        if (!m) return;
        m.setLatLng([p.lat, p.lng]);
        m.getElement()?.classList.remove("is-overlap-spread");
      });
      Object.values(connectorsRef.current).forEach((pl) => map.removeLayer(pl));
      connectorsRef.current = {};

      const points = PROPERTIES.map((p) => ({
        id: p.id,
        orig: L.latLng(p.lat, p.lng),
        pt: map.latLngToLayerPoint([p.lat, p.lng]),
      }));

      // Single-linkage proximity grouping in pixel space
      const COLLIDE_PX = 56;
      const assigned = new Array(points.length).fill(-1);
      const groups: number[][] = [];
      for (let i = 0; i < points.length; i++) {
        if (assigned[i] !== -1) continue;
        const g = [i];
        assigned[i] = groups.length;
        for (let j = i + 1; j < points.length; j++) {
          if (assigned[j] !== -1) continue;
          if (points[i].pt.distanceTo(points[j].pt) < COLLIDE_PX) {
            g.push(j);
            assigned[j] = groups.length;
          }
        }
        groups.push(g);
      }

      groups.forEach((g) => {
        if (g.length < 2) return;
        const cx = g.reduce((s, k) => s + points[k].pt.x, 0) / g.length;
        const cy = g.reduce((s, k) => s + points[k].pt.y, 0) / g.length;
        const R = 40;
        g.forEach((k, idx) => {
          const angle = (idx / g.length) * Math.PI * 2 - Math.PI / 2;
          const nx = cx + R * Math.cos(angle);
          const ny = cy + R * Math.sin(angle);
          const newLatLng = map.layerPointToLatLng(L.point(nx, ny));
          const id = points[k].id;
          const m = markersRef.current[id];
          if (!m) return;
          m.setLatLng(newLatLng);
          m.getElement()?.classList.add("is-overlap-spread");
          try {
            const line = L.polyline([points[k].orig, newLatLng], {
              color: "#94A3B8",
              weight: 1,
              opacity: 0.65,
              interactive: false,
              dashArray: "2,3",
            }).addTo(map);
            connectorsRef.current[id] = line;
          } catch { /* renderer pane not ready — connector will appear on next moveend */ }
        });
      });
    };

    map.on("zoomend moveend", recomputeOverlap);

    // Keep map sized to its container as the divider/window resizes.
    let rafId: number | null = null;
    const ro = new ResizeObserver(() => {
      if (rafId != null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        rafId = null;
        try {
          if (!mapInstance.current) return;
          mapInstance.current.invalidateSize({ animate: false, pan: false });
          recomputeOverlap();
        } catch { /* container detached mid-resize — safe to ignore */ }
      });
    });
    if (mapRef.current) ro.observe(mapRef.current);

    // Fit to all property pins, then run overlap pass
    const bounds = L.latLngBounds(PROPERTIES.map((p) => [p.lat, p.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 13, animate: !reduced });
    setTimeout(recomputeOverlap, 0);

    return () => {
      map.off("zoomend moveend", recomputeOverlap);
      Object.values(connectorsRef.current).forEach((pl) => map.removeLayer(pl));
      connectorsRef.current = {};
      ro.disconnect();
      if (rafId != null) cancelAnimationFrame(rafId);
      map.remove();
      mapInstance.current = null;
      markersRef.current = {};
      unitMarkersRef.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply highlight changes
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    // reset classes
    Object.entries(markersRef.current).forEach(([id, m]) => {
      const el = m.getElement();
      if (!el) return;
      el.classList.remove("is-pulse", "is-dim", "is-check", "has-doc", "is-spread", "is-match", "is-fade", "is-hover");
      if (highlight.pulse === "all") el.classList.add("is-pulse");
      if (highlight.pulse === "one" && highlight.pulseId === id) el.classList.add("is-pulse");
      if (highlight.showDoc && highlight.pulseId === id) el.classList.add("has-doc");
      if (highlight.spread) el.classList.add("is-spread");
      if (highlight.check && highlight.pulseId === id) el.classList.add("is-check");
      if (highlight.dimExcept && highlight.dimExcept !== id) el.classList.add("is-dim");
      if (highlight.activeUnitPropertyId === id) el.classList.add("is-pulse");
      if (highlight.matchIds && highlight.matchIds.length) {
        if (highlight.matchIds.includes(id)) el.classList.add("is-match");
        else if (highlight.fadeNonMatches) el.classList.add("is-fade");
      }
      if (highlight.hoverId === id) el.classList.add("is-hover");
    });

    if (highlight.focus) {
      map.flyTo([highlight.focus.lat, highlight.focus.lng], highlight.focus.zoom, {
        duration: 0.8,
      });
    } else {
      const bounds = L.latLngBounds(PROPERTIES.map((p) => [p.lat, p.lng] as [number, number]));
      map.flyToBounds(bounds, { padding: [60, 60], maxZoom: 13, duration: 0.8 });
    }
  }, [highlight]);

  // Sync unit markers (property view)
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;
    const wanted = highlight.unitPins ?? [];
    const wantedIds = new Set(wanted.map((u) => u.id));

    // remove stale
    Object.entries(unitMarkersRef.current).forEach(([id, m]) => {
      if (!wantedIds.has(id)) {
        map.removeLayer(m);
        delete unitMarkersRef.current[id];
      }
    });

    // add new
    wanted.forEach((u) => {
      if (unitMarkersRef.current[u.id]) return;
      const statusClass = u.status === "Let" ? "is-let" : "is-vacant";
      const html = `<div class="hp-unit ${statusClass}" data-uid="${u.id}"><span>${u.label.replace(/[<>&]/g, "")}</span></div>`;
      const icon = L.divIcon({
        html,
        className: "hp-unit-marker",
        iconSize: [80, 22],
        iconAnchor: [40, 11],
      });
      const m = L.marker([u.lat, u.lng], { icon, zIndexOffset: 500 }).addTo(map);
      m.on("click", () => onUnitClick?.(u.id));
      unitMarkersRef.current[u.id] = m;
    });

    // active highlight
    Object.entries(unitMarkersRef.current).forEach(([id, m]) => {
      const el = m.getElement();
      if (!el) return;
      el.classList.toggle("is-active", highlight.activeUnitId === id);
    });
  }, [highlight, onUnitClick]);

  return <div ref={mapRef} className="absolute inset-0" aria-label="London property map" />;
}

/* ---------------- Page ---------------- */

type View = "onboarding" | "portfolio" | "property" | "unit";

const Prototype: React.FC<{ testerMode?: boolean }> = ({ testerMode = false }) => {
  const [view, setView] = useState<View>("onboarding");
  const [beatIdx, setBeatIdx] = useState(0);
  const [lineIdx, setLineIdx] = useState(0); // line within beat
  const [owl, setOwl] = useState<OwlState>("talking");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [typing, setTyping] = useState(false);
  const [chipVisible, setChipVisible] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [input, setInput] = useState("");
  // Staged tour: every load starts at Meet Hobson. No returning-user state.
  const [searchQuery, setSearchQuery] = useState("");
  const [searchActiveIdx, setSearchActiveIdx] = useState(0);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  const [showUnitPicker, setShowUnitPicker] = useState(false);
  const [showPropertyList, setShowPropertyList] = useState(false);
  const [portfolioChip, setPortfolioChip] = useState<string | null>(null);
  const [actionCards, setActionCards] = useState<ActionCard[]>(INITIAL_ACTION_CARDS);
  const [briefingChoice, setBriefingChoice] = useState<null | "all" | "urgent" | "browse">(null);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [hoveredCardPropertyId, setHoveredCardPropertyId] = useState<string | null>(null);
  const [actionToast, setActionToast] = useState<string | null>(null);
  const [showDocuments, setShowDocuments] = useState(false);
  const [showWhatIveDone, setShowWhatIveDone] = useState(false);
  // "Meet my team" — user-summonable team wall overlay on the right stage.
  // In-memory only (no localStorage/sessionStorage); does not disturb the chat.
  const [showTeamWall, setShowTeamWall] = useState(false);
  const [carriedCardId, setCarriedCardId] = useState<string | null>(null);
  const [performingCardId, setPerformingCardId] = useState<string | null>(null);
  const [reviewingCardId, setReviewingCardId] = useState<string | null>(null);
  // chatExpanded removed — the draggable divider now handles full-width expansion in both directions.
  const chatExpanded = false;
  const setChatExpanded = (_: boolean | ((v: boolean) => boolean)) => {};
  // Stateless demo: divider and collapse states always start at their seeded defaults on every mount/reload.
  const CHAT_DEFAULT_WIDTH = 480;
  const [chatWidth, setChatWidth] = useState<number>(CHAT_DEFAULT_WIDTH);
  const [chatCollapsed, setChatCollapsed] = useState<boolean>(false);
  const [chatDropOver, setChatDropOver] = useState(false);
  const CHAT_MIN_WIDTH = 240;
  const CHAT_COLLAPSE_THRESHOLD = 200;
  const CHAT_COLLAPSED_WIDTH = 44;
  const MAIN_MIN_WIDTH = 420;
  const MAIN_COLLAPSE_THRESHOLD = 200;
  const MAIN_COLLAPSED_WIDTH = 44;
  const lastExpandedWidthRef = useRef<number>(CHAT_DEFAULT_WIDTH);
  const [mainCollapsed, setMainCollapsed] = useState<boolean>(false);
  const collapseChat = () => {
    if (!chatCollapsed) lastExpandedWidthRef.current = chatWidth;
    setMainCollapsed(false);
    setChatCollapsed(true);
  };
  const expandChat = () => {
    setChatCollapsed(false);
    setChatWidth(Math.max(CHAT_MIN_WIDTH, lastExpandedWidthRef.current || CHAT_DEFAULT_WIDTH));
  };
  const toggleChatCollapsed = () => (chatCollapsed ? expandChat() : collapseChat());
  const collapseMain = () => {
    setChatCollapsed(false);
    setMainCollapsed(true);
  };
  const expandMain = () => setMainCollapsed(false);
  const toggleMainCollapsed = () => (mainCollapsed ? expandMain() : collapseMain());
  const isLayoutDefault = !chatCollapsed && !mainCollapsed && chatWidth === CHAT_DEFAULT_WIDTH;
  const resetLayout = () => {
    setChatCollapsed(false);
    setMainCollapsed(false);
    setChatWidth(CHAT_DEFAULT_WIDTH);
    lastExpandedWidthRef.current = CHAT_DEFAULT_WIDTH;
  };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.altKey || e.metaKey) && e.key === "0") {
        e.preventDefault();
        resetLayout();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [adminMode, setAdminMode] = useState(false);
  const [adminCharacter, setAdminCharacter] = useState<AdminCharacter | null>(null);

  // Back Office: hallway-vs-home (in-memory module flag, not localStorage)
  const [boFirstEntry, setBoFirstEntry] = useState<boolean>(false);
  const [boShowHallway, setBoShowHallway] = useState<boolean>(false);
  // Global Hobson narration thread for the Back Office (persists across room switches)
  const [boEvents, setBoEvents] = useState<{ kind: "user" | "hobson" | "jobs"; id: string; text?: string }[]>([]);

  const enterAdmin = () => {
    setShowDocuments(false);
    setShowWhatIveDone(false);
    setPerformingCardId(null);
    setReviewingCardId(null);
    setChatExpanded(false);
    setAdminCharacter(null);
    // Ensure Meet Hobson onboarding state is fully cleared — Admin and onboarding are mutually exclusive.
    if (view === "onboarding") {
      setView("portfolio");
      setChipVisible(false);
      setTyping(false);
      setMessages([]);
    }
    const first = !hasEnteredBackOffice();
    setBoFirstEntry(first);
    setBoShowHallway(true);
    setBoEvents([]);
    if (first) markBackOfficeEntered();
    setAdminMode(true);
  };
  const exitAdmin = () => {
    setAdminMode(false);
    setAdminCharacter(null);
    setBoShowHallway(false);
  };
  const selectAdminCharacter = (c: AdminCharacter) => {
    setAdminCharacter(c);
    setBoShowHallway(false);
    setMagicianEvents([]);
    setMagBuild(null);
    setMagStreamingId(null);
  };

  // Workbench jump signal — expand & scroll the matching section in place.
  const [boJumpSectionId, setBoJumpSectionId] = useState<string | null>(null);
  const helperToSection: Record<string, string> = {
    professor: "documents",
    inspector: "compliance",
    broker: "people",
    magician: "workflows",
    architect: "structure",
  };

  // Free-text "Ask Hobson" from the Back Office.
  const boAskHobson = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const baseId = `bo-${Date.now()}`;
    setBoEvents((arr) => [...arr, { kind: "user", id: baseId, text: trimmed }]);
    const room = detectRoomFromMessage(trimmed);
    setTimeout(() => {
      if (room) {
        setBoEvents((arr) => [...arr, { kind: "hobson", id: `${baseId}-r`, text: room.narration }]);
        const sec = helperToSection[room.id];
        if (sec) setTimeout(() => setBoJumpSectionId(sec), 250);
      } else {
        setBoEvents((arr) => [...arr, { kind: "hobson", id: `${baseId}-r`, text: "Of course. Which would you like — documents, compliance, contacts, workflows or structure?" }]);
      }
    }, 250);
  };

  // Entering a "room" — now expands the relevant section of the unified workbench.
  const boEnterRoom = (h: BackOfficeHelper) => {
    const id = `bo-enter-${Date.now()}`;
    setBoEvents((arr) => [...arr, { kind: "hobson", id, text: h.narration }]);
    const sec = helperToSection[h.id];
    if (sec) setTimeout(() => setBoJumpSectionId(sec), 250);
  };

  const [comingSoonHelperId] = useState<string | null>(null);

  const boReturnToHallway = () => {
    setAdminCharacter(null);
    setBoShowHallway(true);
    setBoEvents([]);
  };

  // Picking a job from the chat grid — reads as the user asking Hobson for that thing.
  const boPickJob = (h: BackOfficeHelper) => {
    const id = `bo-job-${Date.now()}`;
    const label = JOB_CATALOGUE[h.id]?.offer ? "Yes please." : h.name;
    setBoEvents((arr) => [...arr, { kind: "user", id, text: label }]);
    setTimeout(() => boEnterRoom(h), 220);
  };
  // Recall the job grid into the conversation.
  const boShowJobs = () => {
    setBoEvents((arr) => [...arr, { kind: "jobs", id: `bo-jobs-${Date.now()}` }]);
  };


  // ----- Professor library state -----
  const [profDocs, setProfDocs] = useState<ProfDoc[]>(SEED_PROF_DOCS);
  const [profEvents, setProfEvents] = useState<ProfEvent[]>([]);
  // Summary visibility — both summaries are available by default everywhere.
  // (Access/permissions for hiding summaries will belong to a future security character; not the Professor's job.)
  const summaryVisibility = { occupational: true, compliance: true } as const;

  // Pinned Quick bar (Quick overviews / Open a unit) — sits at the top of the chat column.
  const [pinnedQuickOpen, setPinnedQuickOpen] = useState(false);
  const [openUnitsSignal, setOpenUnitsSignal] = useState(0);




  // ----- Magician workshop state -----
  const [workflows, setWorkflows] = useState<Workflow[]>(SEED_WORKFLOWS);
  const [adjustingWorkflowId, setAdjustingWorkflowId] = useState<string | null>(null);
  const [viewingWorkflowId, setViewingWorkflowId] = useState<string | null>(null);

  // ----- Broker black-book state -----
  const [contacts, setContacts] = useState<BrokerContact[]>(SEED_BROKER_CONTACTS);
  const [brokerEvents, setBrokerEvents] = useState<BrokerEvent[]>([]);
  const [brokerFlow, setBrokerFlow] = useState<{ step: number; draft: Partial<BrokerContact> } | null>(null);

  // ----- Inspector compliance-setup state (list-first, consent-and-describe) -----
  const [inspectorEvents, setInspectorEvents] = useState<InspectorEvent[]>([]);
  const [inspectorBuild, setInspectorBuild] = useState<InspectorBuild | null>(null);
  const [inspectorConfirmed, setInspectorConfirmed] = useState<ComplianceRequirement[]>([]);

  const inspNewId = (p: string) => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  /** Step 1–2: user picks an area from the compliance list. */
  const inspectorPickArea = (a: ComplianceArea, label: string) => {
    setInspectorEvents((e) => [...e, { kind: "user", id: inspNewId("iu"), text: label }]);
    setInspectorBuild({ step: "consent", area: a, areaLabel: label, researched: [], additions: [] });
  };

  /** Step 3: consent to legal research. */
  const inspectorConsent = (yes: boolean) => {
    setInspectorBuild((b) => {
      if (!b) return b;
      const userText = yes ? "Yes — check the law" : "No — I'll define it myself";
      setInspectorEvents((e) => [
        ...e,
        { kind: "user", id: inspNewId("iu"), text: userText },
        {
          kind: "inspector",
          id: inspNewId("in"),
          text: yes
            ? `Good. Before I do — describe the area you want me to look for. A short line is plenty.`
            : `Understood. I'll skip the legal check — you can build ${b.areaLabel.toLowerCase()} as your own standard. Add what you need below; each one will be marked as a business requirement.`,
        },
      ]);
      return { ...b, step: yes ? "describe" : "build" };
    });
  };

  /** Step 4–6: describe → simulate research → return sourced legal items. */
  const inspectorDescribe = (text: string) => {
    setInspectorEvents((e) => [...e, { kind: "user", id: inspNewId("iu"), text }]);
    setInspectorBuild((b) => (b ? { ...b, description: text, step: "researching" } : b));

    const researchId = inspNewId("ir");
    setInspectorEvents((e) => [
      ...e,
      { kind: "inspector", id: inspNewId("in"), text: `Right — checking gov.uk and HSE guidance for "${text}".` },
      { kind: "researching", id: researchId },
    ]);

    setTimeout(() => {
      setInspectorEvents((e) => e.filter((ev) => ev.id !== researchId));
      setInspectorBuild((b) => {
        if (!b) return b;
        const found = (RESEARCH_BY_AREA[b.area] ?? []).map((r) => ({
          ...r,
          id: `${r.id}-${Math.random().toString(36).slice(2, 5)}`,
          areaId: b.area,
        }));
        setInspectorEvents((ev) => [...ev, {
          kind: "inspector",
          id: inspNewId("in"),
          text: found.length
            ? `Here's what's legally required for "${text}". Each one shows the source so you can see why it's law. Edit the frequencies if your standard is stricter, then add anything else you want to track — those will be saved as your business requirements.`
            : `I couldn't find any specific legal requirements for "${text}" in my sources. Add what you need below — they'll be saved as business requirements.`,
        }]);
        return { ...b, step: "build", researched: found };
      });
    }, 1600);
  };

  /** Edits — researched (legal) side. */
  const inspectorUpdateResearched = (id: string, patch: Partial<ComplianceRequirement>) =>
    setInspectorBuild((b) => b ? { ...b, researched: b.researched.map((r) => r.id === id ? { ...r, ...patch } : r) } : b);
  const inspectorRemoveResearched = (id: string) =>
    setInspectorBuild((b) => b ? { ...b, researched: b.researched.filter((r) => r.id !== id) } : b);

  /** Edits — additions (business) side. */
  const inspectorUpdateAddition = (id: string, patch: Partial<ComplianceRequirement>) =>
    setInspectorBuild((b) => b ? { ...b, additions: b.additions.map((r) => r.id === id ? { ...r, ...patch } : r) } : b);
  const inspectorRemoveAddition = (id: string) =>
    setInspectorBuild((b) => b ? { ...b, additions: b.additions.filter((r) => r.id !== id) } : b);
  const inspectorAddAddition = (name: string, value: number, unit: DurationUnit) =>
    setInspectorBuild((b) => {
      if (!b) return b;
      const newReq: ComplianceRequirement = {
        id: `req-biz-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
        docType: name,
        matchTerms: [name.toLowerCase()],
        basis: "business",
        durationValue: value,
        durationUnit: unit,
        anchor: "certificate date",
        appliesTo: "unit",
        category: "certification",
        areaId: b.area,
      };
      return { ...b, additions: [...b.additions, newReq] };
    });

  const inspectorConfirm = () => {
    setInspectorBuild((b) => {
      if (!b) return b;
      const merged = [...b.researched, ...b.additions].map((r) => ({ ...r, areaId: b.area }));
      setInspectorConfirmed((prev) => {
        const keep = prev.filter((r) => (r.areaId ?? "health_safety") !== b.area);
        return [...keep, ...merged];
      });
      setInspectorEvents((e) => [
        ...e,
        { kind: "user", id: inspNewId("iu"), text: `Confirm ${b.areaLabel} list` },
        { kind: "inspector", id: inspNewId("in"), text: `Recorded. ${b.areaLabel} is now on your board on the right. I'll re-check the sourced items on your schedule. The Compliance summary will start flagging any of these that aren't held.` },
        { kind: "confirmed", id: inspNewId("ic"), count: merged.length },
      ]);
      return null;
    });
  };

  const inspectorCancel = () => {
    setInspectorBuild(null);
    setInspectorEvents((e) => [...e, {
      kind: "inspector",
      id: inspNewId("in"),
      text: "No bother — nothing recorded. Pick another area whenever you're ready.",
    }]);
  };



  const inspectorShowMe = (areaId: ComplianceArea, group: RequirementCategory) => {
    setInspectorEvents((e) => [...e, {
      kind: "show_me",
      id: inspNewId("sm"),
      areaId,
      group,
    }]);
  };

  const inspectorUpdateConfirmed = (id: string, patch: Partial<ComplianceRequirement>) => {
    setInspectorConfirmed((arr) => arr.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const inspectorAddConfirmed = (req: Omit<ComplianceRequirement, "id">) => {
    setInspectorConfirmed((arr) => [...arr, { ...req, id: `req-manual-${Date.now()}` }]);
  };

  // Note: area creation is conversational — the chat AreaPickCard reappears whenever
  // there's no active build, so no "set up another area" affordance is needed in the
  // right-hand output panel.



  const augmentCompliance = useMemo(() => {
    if (inspectorConfirmed.length === 0) return undefined;
    return (rows: any[], scope: SummaryScope) => augmentComplianceRows(rows as any, scope, inspectorConfirmed) as any;
  }, [inspectorConfirmed]);

  // ----- Magician build conversation state -----
  const [magicianEvents, setMagicianEvents] = useState<MagicianEvent[]>([]);
  const [magBuild, setMagBuild] = useState<MagBuildState | null>(null);
  const [magStreamingId, setMagStreamingId] = useState<string | null>(null);
  const [adjustingId, setAdjustingId] = useState<string | null>(null);
  const magSimQueueRef = useRef<string[]>([]); // queued simulation bubble texts
  const adjustOriginalRef = useRef<Workflow | null>(null); // snapshot of workflow before Adjust began (for activity diffs)



  const magNewId = (p: string) => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const magAsk = (text: string) => {
    const id = magNewId("mag");
    setMagicianEvents((e) => [...e, { kind: "magician", id, text }]);
    setMagStreamingId(id);
  };
  const magUserEcho = (text: string) => {
    const id = magNewId("mu");
    setMagicianEvents((e) => [...e, { kind: "user", id, text }]);
  };

  const handleCreateWorkflow = () => {
    setMagicianEvents([]);
    magSimQueueRef.current = [];
    setMagBuild({ step: "intake", steps: MAG_DEFAULT_STEPS.map((s, i) => ({ ...s, uid: `${s.id}-${i}` })) });
    setTimeout(() => magAsk("Let's build this together. First, tell me a little about it."), 250);
  };

  // ----- Run a simulation of a built workflow -----
  const magSimulate = (id: string) => {
    const wf = workflows.find((w) => w.id === id);
    if (!wf || wf.status !== "built") return;
    const steps = wf.steps && wf.steps.length > 0 ? wf.steps : MAG_DEFAULT_STEPS;
    const lines: string[] = [];
    lines.push(`Let's see it in action. Here's what I'd do when ${wf.trigger}.`);
    steps.forEach((s, i) => {
      const isDoc = isDocStep({ id: s.id, label: s.label });
      const tpl = wf.stepTemplates?.[s.id];
      let tail = "";
      if (isDoc) {
        if (tpl && tpl.mode === "own") {
          tail = ` — using your template${tpl.filename ? ` (${tpl.filename})` : ""}.`;
        } else {
          tail = " — using our standard template.";
        }
      } else {
        tail = ".";
      }
      lines.push(`Step ${i + 1} — I ${s.phrase}${tail.startsWith(" —") ? "" : ""}${tail}`);
    });
    lines.push("Then I bring it to you for approval — that's the gate where you decide.");
    lines.push("That's how it runs. Nothing was sent — it's yours to set live when you're ready.");

    setMagicianEvents((e) => [
      ...e,
      { kind: "sim_header", id: magNewId("simhdr"), workflowName: wf.name, trigger: wf.trigger },
    ]);
    magSimQueueRef.current = lines.slice(1);
    setTimeout(() => magAsk(lines[0]), 250);
  };

  const handleSaveWorkflow = (next: Workflow) => {
    setWorkflows((arr) => arr.map((w) => w.id === next.id ? next : w));
    setAdjustingWorkflowId(null);
  };

  // ----- Magician answer handlers -----
  const magPhraseFor = (k: string, label: string) => {
    if (k === "6m") return "6 months away";
    if (k === "3m") return "3 months away";
    if (k === "on") return "on the date";
    if (k === "always") return "approaching (always visible)";
    return (label || "").toLowerCase();
  };
  const watchLabelFor = (k: "rent_reviews" | "compliance" | "notices" | "other") =>
    k === "rent_reviews" ? "Rent reviews"
      : k === "compliance" ? "Compliance certificates"
      : k === "notices" ? "Notice deadlines"
      : "Other";
  const triggerSentenceFor = (watch: MagBuildState["watch"], whenPhrase: string) => {
    const subject = watch === "compliance" ? "a certificate is due"
      : watch === "notices" ? "a notice deadline is approaching"
      : watch === "other" ? "the date is approaching"
      : "a rent review is";
    return `${subject} ${whenPhrase}`.trim();
  };

  const inferWatchFromIntake = (title: string, purpose: string): "rent_reviews" | "compliance" | "notices" | "other" => {
    const t = `${title} ${purpose}`.toLowerCase();
    if (/\brent\b|review|section\s*13/.test(t)) return "rent_reviews";
    if (/complian|certificat|gas|eicr|epc|fire|inspection/.test(t)) return "compliance";
    if (/notice|deadline|break|renewal|expir/.test(t)) return "notices";
    return "other";
  };
  const ackForWatch = (k: "rent_reviews" | "compliance" | "notices" | "other") =>
    k === "rent_reviews" ? "A rent-review watch — good, I know these well. A few details and I'll lay out how I'd handle it."
      : k === "compliance" ? "A compliance watch — familiar ground. A few details and I'll lay out how I'd handle it."
      : k === "notices" ? "A notice-deadline watch — understood. A few details and I'll lay out how I'd handle it."
      : "Understood. A few details and I'll lay out how I'd handle it.";

  const magSubmitIntake = (intake: {
    title: string;
    purpose: string;
    description: string;
    whenKey: "6m" | "3m" | "on" | "always" | "custom";
    whenLabel: string;
    visibility: "personal" | "company";
  }) => {
    const wasEditing = !!magBuild?.editing && magBuild.editing.field === "intake";
    magUserEcho(
      `${intake.title} — ${intake.purpose}\nShow: ${intake.whenLabel} · ${intake.visibility === "personal" ? "Personal" : "Company-wide"}${intake.description ? `\n${intake.description}` : ""}`
    );
    const inferred = inferWatchFromIntake(intake.title, intake.purpose);
    const prevWatch = magBuild?.watch;
    const watchChanged = wasEditing && !!prevWatch && prevWatch !== inferred;
    const stepsTouched = !!magBuild?.stepsTouched;
    const shouldRepropose = !wasEditing || (watchChanged && !stepsTouched);
    setMagBuild((b) => b ? {
      ...b,
      title: intake.title,
      purpose: intake.purpose,
      description: intake.description,
      whenKey: intake.whenKey,
      whenLabel: intake.whenLabel,
      visibility: intake.visibility,
      lead: (intake.whenKey === "6m" || intake.whenKey === "3m" || intake.whenKey === "on") ? intake.whenKey : undefined,
      leadLabel: intake.whenLabel,
      triggerPhrase: magPhraseFor(intake.whenKey, intake.whenLabel),
      watch: inferred,
      watchLabel: watchLabelFor(inferred),
      steps: shouldRepropose
        ? MAG_DEFAULTS_BY_WATCH[inferred].map((s, i) => ({ ...s, uid: `${s.id}-${Date.now()}-${i}` }))
        : b.steps,
      step: wasEditing ? (b.editing!.returnStep) : "q3",
      editing: undefined,
    } : b);
    setTimeout(() => {
      if (wasEditing && watchChanged && !stepsTouched) {
        magAsk(`That changes the shape of it — here's how I'd handle ${watchLabelFor(inferred).toLowerCase()} instead. Adjust as you like.`);
      } else if (wasEditing) {
        magAsk("Updated.");
      } else {
        magAsk(ackForWatch(inferred));
        setTimeout(() => magAsk("Where should this apply?"), 1400);
      }
    }, 400);
  };

  const magAnswerQ1 = (key: "rent_reviews" | "compliance" | "notices" | "other", label: string) => {
    magUserEcho(label);
    setMagBuild((b) => {
      if (!b) return b;
      const editing = b.editing;
      const watchChanged = !!editing && editing.field === "watch" && b.watch && b.watch !== key;
      const shouldRepropose = watchChanged && !b.stepsTouched;
      const nextSteps = shouldRepropose
        ? MAG_DEFAULTS_BY_WATCH[key].map((s, i) => ({ ...s, uid: `${s.id}-${Date.now()}-${i}` }))
        : b.steps;
      return {
        ...b,
        watch: key,
        watchLabel: watchLabelFor(key),
        steps: nextSteps,
        step: editing ? editing.returnStep : "q3",
        editing: undefined,
      };
    });
    const editing = magBuild?.editing;
    const watchChanged = !!editing && editing.field === "watch" && magBuild?.watch && magBuild.watch !== key;
    const reproposed = watchChanged && !magBuild?.stepsTouched;
    setTimeout(() => {
      if (reproposed) {
        magAsk(`That changes the steps — here's how I'd handle ${watchLabelFor(key).toLowerCase()} instead. Adjust as you like.`);
      } else if (editing) {
        magAsk("Updated.");
      } else {
        magAsk(key === "rent_reviews" ? "Good — rent reviews. Where does this apply?" : `Noted — ${watchLabelFor(key).toLowerCase()}. Where does this apply?`);
      }
    }, 400);
  };

  const magAnswerQ2 = (lead: "6m" | "3m" | "on", label: string, phrase: string) => {
    magUserEcho(label);
    setMagBuild((b) => b ? { ...b, lead, leadLabel: label, triggerPhrase: phrase, step: "q3", editing: undefined } : b);
    setTimeout(() => magAsk("Where does this apply?"), 400);
  };

  const magAnswerQ3Scope = (sel: ScopeSelection) => {
    const { label, detail } = summariseScope(sel);
    magUserEcho(label);
    const wasEditing = !!magBuild?.editing && (magBuild.editing.field === "scope" || magBuild.editing.field === "scopeUnit");
    const scopeShort: "unit" | "property" | "portfolio" =
      sel.level === "portfolio" ? "portfolio" : sel.level === "properties" ? "property" : "unit";
    setMagBuild((b) => b ? {
      ...b,
      scope: scopeShort,
      scopeLabel: label,
      scopeDetail: detail,
      scopeSelection: sel,
      step: wasEditing ? b.editing!.returnStep : "q4",
      editing: undefined,
    } : b);
    setTimeout(() => magAsk(wasEditing ? "Updated." : "And who should own it?"), 400);
  };


  const magAnswerQ4 = (owner: WorkflowOwner, label: string) => {
    magUserEcho(label);
    const wasEditing = !!magBuild?.editing && magBuild.editing.field === "owner";
    setMagBuild((b) => b ? { ...b, owner, ownerLabel: label, step: wasEditing ? b.editing!.returnStep : "q5", editing: undefined } : b);
    setTimeout(() => magAsk(wasEditing ? "Updated." : "Here's how I'd handle it. Tap to keep, remove, reorder, rename — or add a step."), 400);
  };

  const magAddStep = (opt: { id: string; label: string; phrase: string }) => {
    setMagBuild((b) => {
      if (!b) return b;
      const uid = `${opt.id}-${Date.now()}`;
      return { ...b, steps: [...b.steps, { ...opt, uid }], addOpen: false, stepsTouched: true };
    });
    setTimeout(() => magAsk("Added — anything else?"), 200);
  };
  const magAddCustomStep = (label: string) => {
    if (!label.trim()) return;
    const uid = `custom-${Date.now()}`;
    setMagBuild((b) => b ? { ...b, steps: [...b.steps, { id: "custom", label: label.trim(), phrase: label.trim().toLowerCase(), uid }], addOpen: false, customDraft: "", stepsTouched: true } : b);
    setTimeout(() => magAsk("Added — anything else?"), 200);
  };
  const magRemoveStep = (uid: string) => {
    setMagBuild((b) => b ? { ...b, steps: b.steps.filter((s) => s.uid !== uid), stepsTouched: true } : b);
    setTimeout(() => magAsk("Removed — anything else?"), 200);
  };
  const magMoveStep = (uid: string, dir: -1 | 1) => {
    setMagBuild((b) => {
      if (!b) return b;
      const i = b.steps.findIndex((s) => s.uid === uid);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= b.steps.length) return b;
      const next = [...b.steps];
      [next[i], next[j]] = [next[j], next[i]];
      return { ...b, steps: next, stepsTouched: true };
    });
  };
  const magRenameStep = (uid: string, label: string) => {
    if (!label.trim()) return;
    setMagBuild((b) => b ? {
      ...b,
      steps: b.steps.map((s) => s.uid === uid ? { ...s, label: label.trim(), phrase: label.trim().toLowerCase() } : s),
      stepsTouched: true,
    } : b);
  };

  // Set a document-producing step's template (Hobson's standard vs. user's own upload).
  const magSetStepTemplate = (uid: string, mode: "standard" | "own", filename?: string) => {
    let shouldNarrateIntro = false;
    let kindLabel = "your document";
    setMagBuild((b) => {
      if (!b) return b;
      const target = b.steps.find((s) => s.uid === uid);
      if (target && /section\s*13/i.test(target.label)) kindLabel = "your Section 13";
      else if (target && /email|letter/i.test(target.label)) kindLabel = "your covering email";
      else if (target && /surveyor|instruction/i.test(target.label)) kindLabel = "your surveyor instruction";
      else if (target && /notice/i.test(target.label)) kindLabel = "your notice";
      shouldNarrateIntro = !b.templateNarrated && mode === "own";
      return {
        ...b,
        templateNarrated: b.templateNarrated || mode === "own",
        steps: b.steps.map((s) => s.uid === uid ? { ...s, template: mode === "standard" ? undefined : { mode, filename } } : s),
      };
    });
    setTimeout(() => {
      if (mode === "own" && shouldNarrateIntro) {
        magAsk(`If you have ${kindLabel}, hand it to me and I'll fill it in. Otherwise I'll use a standard one.`);
      } else if (mode === "own") {
        magAsk(`Noted — I'll use your template for that step and fill in the details.`);
      } else {
        magAsk(`Back to the standard for that step.`);
      }
    }, 200);
  };
  const magBeginEdit = (field: MagEditField) => {
    setMagBuild((b) => {
      if (!b) return b;
      const returnStep: MagBuildStepKey = b.step === "intake" ? "q3" : b.step;
      const stepFor: Record<MagEditField, MagBuildStepKey> = {
        intake: "intake",
        watch: "q1",
        scope: "q3",
        scopeUnit: "q3",
        owner: "q4",
      };
      return { ...b, step: stepFor[field], editing: { field, returnStep } };
    });
    setTimeout(() => magAsk("Of course — let's change that."), 250);
  };

  const magCancelEdit = () => {
    setMagBuild((b) => b && b.editing ? { ...b, step: b.editing.returnStep, editing: undefined } : b);
  };

  // ← Back at each question.
  const magGoBack = () => {
    setMagBuild((b) => {
      if (!b) return b;
      const order: MagBuildStepKey[] = ["intake", "q3", "q4", "q5", "q6"];
      const i = order.indexOf(b.step);
      const prev = i > 0 ? order[i - 1] : "intake";
      return { ...b, step: prev, editing: undefined };
    });
  };

  const magFinishStepsToQ6 = () => {
    setMagBuild((b) => b ? { ...b, step: "q6", editing: undefined } : b);
    setTimeout(() => magAsk("I'll prepare all of this and bring it to you for approval — I never act on my own. Shall I build it?"), 400);
  };
  const magAnswerQ6KeepEditing = () => {
    magUserEcho("Keep editing");
    setMagBuild((b) => b ? { ...b, step: "q5" } : b);
    setTimeout(() => magAsk("Of course — adjust as you like, and tell me when you're ready."), 400);
  };
  const magAnswerQ6Build = () => {
    magUserEcho(adjustingId ? "Save changes" : "Build it");
    const b = magBuild;
    if (!b) return;
    const phrases = b.steps.map((s) => s.phrase);
    const actionSummary = phrases.length === 0
      ? "bring it to you for approval"
      : `${phrases.slice(0, -1).join(", ")}${phrases.length > 1 ? " and " : ""}${phrases[phrases.length - 1]} — then bring it to you for approval`;
    const trigger = triggerSentenceFor(b.watch, b.triggerPhrase || "approaching");
    const persistedBuild = {
      whenKey: b.whenKey,
      watch: b.watch,
      lead: b.lead, leadLabel: b.leadLabel,
      triggerPhrase: b.triggerPhrase,
      scope: b.scope,
      scopeSelection: b.scopeSelection,
      ownerLabel: b.ownerLabel,
    };
    if (adjustingId) {
      const targetId = adjustingId;
      const original = adjustOriginalRef.current;
      const changes = original ? diffWorkflowChanges(original, b) : [];
      const wasDraft = original?.status === "draft";
      const activityEntries: ActivityEntry[] = [];
      if (wasDraft) {
        activityEntries.push(makeActivity(changes.length > 0 ? `Set live — ${changes.join("; ")}` : "Set live"));
      } else if (changes.length === 0) {
        activityEntries.push(makeActivity("Adjusted (no changes)"));
      } else {
        for (const c of changes) activityEntries.push(makeActivity(c));
      }
      setWorkflows((arr) => arr.map((w) => w.id === targetId ? {
        ...w,
        name: b.title?.trim() || w.name,
        purpose: b.purpose?.trim() || w.purpose,
        description: b.description?.trim() || undefined,
        whenLabel: b.whenLabel ?? w.whenLabel,
        visibility: b.visibility || w.visibility,
        icon: b.watch === "compliance" ? "shield" : b.watch === "notices" ? "bell" : "calendar",
        tone: "purple", status: "built",
        trigger,
        action: actionSummary,
        scopeLabel: b.scopeLabel || w.scopeLabel,
        scopeDetail: b.scopeDetail ?? w.scopeDetail,
        owner: b.owner || w.owner,
        lastAdjusted: "just now",
        stepCount: b.steps.length,
        justBuilt: true,
        draftState: undefined,
        stepTemplates: collectStepTemplates(b.steps),
        steps: b.steps.map((s) => ({ id: s.id, label: s.label, phrase: s.phrase })),
        ...persistedBuild,
        activity: prependActivity(w.activity, activityEntries),
      } : { ...w, justBuilt: false }));
      const name = b.title?.trim() || "this workflow";
      adjustOriginalRef.current = null;
      setMagBuild(null);
      setAdjustingId(null);
      const builtId = magNewId("mb");
      setMagicianEvents((e) => [...e, { kind: "built", id: builtId, workflowId: targetId, name, stepCount: b.steps.length }]);
      setTimeout(() => magAsk(`Adjusted — '${name}' updated. The card on the right reflects your changes, and the activity log captures who changed what.`), 500);
      return;
    }
    const id = `wf-${Date.now()}`;
    const wf: Workflow = {
      id,
      name: b.title?.trim() || "New workflow",
      purpose: b.purpose?.trim() || "Watches the portfolio and prepares the work for your approval.",
      description: b.description?.trim() || undefined,
      whenLabel: b.whenLabel,
      visibility: b.visibility || "personal",
      icon: b.watch === "compliance" ? "shield" : b.watch === "notices" ? "bell" : "calendar",
      tone: "purple", status: "built",
      trigger,
      action: actionSummary,
      scopeLabel: b.scopeLabel || "Not yet set",
      scopeDetail: b.scopeDetail,
      owner: b.owner || { kind: "all_teams" },
      lastAdjusted: "just now",
      stepCount: b.steps.length,
      justBuilt: true,
      stepTemplates: collectStepTemplates(b.steps),
      steps: b.steps.map((s) => ({ id: s.id, label: s.label, phrase: s.phrase })),
      ...persistedBuild,
      activity: [makeActivity("Built")],
    };
    setMagBuild(null);
    setWorkflows((arr) => [wf, ...arr.map((w) => ({ ...w, justBuilt: false }))]);
    const builtId = magNewId("mb");
    setMagicianEvents((e) => [...e, { kind: "built", id: builtId, workflowId: id, name: wf.name, stepCount: b.steps.length }]);
    setTimeout(() => magAsk(`Built — '${wf.name}', a ${b.steps.length}-step workflow ending in your approval. You'll find it pinned on the right.`), 500);
  };


  // ----- Pause / cancel / resume a workflow build -----
  const magPauseSave = () => {
    const currentAdjustingId = adjustingId;
    const original = adjustOriginalRef.current;
    setMagBuild((b) => {
      if (!b) return b;
      const phrases = b.steps.map((s) => s.phrase);
      const actionSummary = phrases.length === 0
        ? "bring it to you for approval"
        : `${phrases.slice(0, -1).join(", ")}${phrases.length > 1 ? " and " : ""}${phrases[phrases.length - 1]} — then bring it to you for approval`;
      const id = `wf-draft-${Date.now()}`;
      const trigger = b.triggerPhrase ? triggerSentenceFor(b.watch, b.triggerPhrase) : "When this is ready to watch";
      const wf: Workflow = {
        id,
        name: b.title?.trim() || "Untitled workflow",
        purpose: b.purpose?.trim() || "Draft — picked up from where you left off.",
        description: b.description?.trim() || undefined,
        whenLabel: b.whenLabel,
        visibility: b.visibility || "personal",
        icon: b.watch === "compliance" ? "shield" : b.watch === "notices" ? "bell" : "calendar",
        tone: "slate", status: "draft",
        trigger,
        action: actionSummary,
        scopeLabel: b.scopeLabel || "Not yet set",
        scopeDetail: b.scopeDetail,
        owner: b.owner || { kind: "all_teams" },
        lastAdjusted: "just now",
        stepCount: b.steps.length,
        justBuilt: true,
        draftState: b,
        stepTemplates: collectStepTemplates(b.steps),
        steps: b.steps.map((s) => ({ id: s.id, label: s.label, phrase: s.phrase })),
        activity: [makeActivity("Paused — saved as draft")],
      };
      // If pausing during an Adjust, update the existing workflow in place as a draft (no duplicate).
      if (currentAdjustingId) {
        const targetId = currentAdjustingId;
        const changes = original ? diffWorkflowChanges(original, b) : [];
        const entries: ActivityEntry[] = changes.length > 0
          ? [...changes.map((c) => makeActivity(c)), makeActivity("Paused — saved as draft")]
          : [makeActivity("Paused — saved as draft")];
        setWorkflows((arr) => arr.map((w) => w.id === targetId ? { ...wf, id: targetId, activity: prependActivity(w.activity, entries) } : w));
        setAdjustingId(null);
        adjustOriginalRef.current = null;
      } else {
        setWorkflows((arr) => [wf, ...arr.map((w) => ({ ...w, justBuilt: false }))]);
      }
      setTimeout(() => magAsk("Saved — we'll pick this up whenever you're ready."), 350);
      return null;
    });
  };

  const magCancelBuild = () => {
    const wasAdjusting = !!adjustingId;
    setMagBuild(null);
    setAdjustingId(null);
    adjustOriginalRef.current = null;
    setTimeout(() => magAsk(wasAdjusting ? "Of course — changes discarded. The workflow is unchanged." : "Of course — discarded."), 250);
  };

  // Open the FULL build flow pre-filled with a workflow's saved configuration.
  // Adjust = Create-a-workflow, started from the workflow's current values; finish updates in place.
  const magAdjustWorkflow = (id: string) => {
    const wf = workflows.find((w) => w.id === id);
    if (!wf) return;
    setMagicianEvents([]);
    magSimQueueRef.current = [];
    adjustOriginalRef.current = wf;
    // If a paused draft is being adjusted, prefer the saved live build state.
    if (wf.draftState) {
      setAdjustingId(id);
      setMagBuild({ ...wf.draftState, step: "intake", editing: undefined });
      setTimeout(() => magAsk(`Let's adjust '${wf.name}' together — change anything you like. I'll walk you through it; keep what's right, change what isn't.`), 300);
      return;
    }
    const watch: "rent_reviews" | "compliance" | "notices" | "other" =
      wf.watch ?? (wf.icon === "shield" ? "compliance" : wf.icon === "bell" ? "notices" : "rent_reviews");
    const baseSteps = wf.steps && wf.steps.length > 0 ? wf.steps : MAG_DEFAULT_STEPS;
    const steps: MagBuildStep[] = baseSteps.map((s, i) => ({
      id: s.id,
      label: s.label,
      phrase: s.phrase,
      uid: `${s.id}-${i}-${Date.now()}`,
      template: wf.stepTemplates?.[s.id],
    }));
    const state: MagBuildState = {
      step: "intake",
      title: wf.name,
      purpose: wf.purpose,
      description: wf.description,
      whenKey: wf.whenKey,
      whenLabel: wf.whenLabel,
      visibility: wf.visibility ?? "company",
      watch,
      watchLabel: watchLabelFor(watch),
      lead: wf.lead,
      leadLabel: wf.leadLabel,
      triggerPhrase: wf.triggerPhrase,
      scope: wf.scope,
      scopeLabel: wf.scopeLabel,
      scopeDetail: wf.scopeDetail,
      scopeSelection: wf.scopeSelection,
      owner: wf.owner,
      ownerLabel: wf.ownerLabel,
      steps,
      stepsTouched: true,
      templateNarrated: true,
    };
    setAdjustingId(id);
    setMagBuild(state);
    setTimeout(() => magAsk(`Let's adjust '${wf.name}' together — change anything you like. I'll walk you through it; keep what's right, change what isn't.`), 300);
  };

  const magResumeDraft = (id: string) => {
    const wf = workflows.find((w) => w.id === id);
    if (!wf || !wf.draftState) return;
    setMagicianEvents([]);
    // Keep the existing card in place and treat resume as an in-place adjust so activity history is preserved.
    adjustOriginalRef.current = wf;
    setAdjustingId(id);
    setMagBuild(wf.draftState);
    setWorkflows((arr) => arr.map((w) => w.id === id ? { ...w, activity: prependActivity(w.activity, [makeActivity("Resumed editing")]) } : w));
    setTimeout(() => magAsk(`Picking up '${wf.name}' where we left off — change anything you like.`), 300);
  };

  const magDiscardDraft = (id: string) => {
    const wf = workflows.find((w) => w.id === id);
    if (!wf) return;
    setWorkflows((arr) => arr.filter((w) => w.id !== id));
    setTimeout(() => magAsk(`Of course — '${wf.name}' discarded.`), 250);
  };








  const initialsFromName = (name: string) => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "NC";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const parseBrokerType = (raw: string): BrokerContactType => {
    const s = raw.toLowerCase();
    if (/(subcontract|trade|contractor|engineer|electric|fire|plumb)/.test(s)) return "subcontractor";
    if (/(occup|tenant|resident|leaseholder)/.test(s)) return "occupant";
    if (/(staff|internal|colleague|team|employee)/.test(s)) return "staff";
    return "misc";
  };

  const splitPhonePref = (raw: string): { phone: string; pref: string } => {
    const parts = raw.split(/·|—|–|-|\||,/);
    const phone = (parts[0] || raw).trim() || "—";
    const pref = parts.slice(1).join(" · ").trim() || "no preference noted";
    return { phone, pref };
  };

  const handleAddBrokerContact = () => {
    if (brokerFlow) return;
    setBrokerFlow({ step: 0, draft: {} });
    setBrokerEvents((arr) => [
      ...arr,
      { kind: "broker", id: `bk-${Date.now()}-q0`, text: BROKER_QUESTIONS[0].ask },
    ]);
  };

  const cancelBrokerFlow = () => {
    setBrokerFlow(null);
    setBrokerEvents((arr) => [...arr, { kind: "broker", id: `bk-${Date.now()}-cx`, text: "No bother — the book stays as it is. Press 'Add a contact' whenever you're ready." }]);
  };

  const submitBrokerAnswer = (answer: string) => {
    if (!brokerFlow) return;
    const text = answer.trim();
    if (!text) return;
    const ts = Date.now();
    const q = BROKER_QUESTIONS[brokerFlow.step];
    const draft = { ...brokerFlow.draft };
    if (q.field === "type") draft.type = parseBrokerType(text);
    else if (q.field === "phoneAndPref") {
      const { phone, pref } = splitPhonePref(text);
      draft.phone = phone;
      draft.contactPref = pref;
    } else if (q.field === "name") {
      draft.name = text;
      draft.initials = initialsFromName(text);
    } else {
      (draft as Record<BrokerField, string>)[q.field] = text;
    }

    const newEvents: BrokerEvent[] = [{ kind: "user", id: `bk-${ts}-u`, text }];
    const nextStep = brokerFlow.step + 1;

    if (nextStep < BROKER_QUESTIONS.length) {
      newEvents.push({ kind: "broker", id: `bk-${ts}-q${nextStep}`, text: BROKER_QUESTIONS[nextStep].ask });
      setBrokerFlow({ step: nextStep, draft });
      setBrokerEvents((arr) => [...arr, ...newEvents]);
    } else {
      // Finalise
      const contact: BrokerContact = {
        id: `bc-new-${ts}`,
        name: draft.name || "New contact",
        type: (draft.type as BrokerContactType) || "misc",
        role: draft.role || "Unspecified",
        initials: draft.initials || initialsFromName(draft.name || "NC"),
        email: draft.email || "—",
        phone: draft.phone || "—",
        contactPref: draft.contactPref || "no preference noted",
        address: draft.address || "—",
        relatedTo: draft.relatedTo || "—",
      };
      setContacts((arr) => [contact, ...arr]);
      newEvents.push({
        kind: "broker",
        id: `bk-${ts}-done`,
        text: `Done — ${contact.name} is in the book under ${BROKER_TYPE_META[contact.type].label.toLowerCase()}. I'll remember them and link them as we go.`,
      });
      newEvents.push({ kind: "summary", id: `bk-${ts}-sum`, name: contact.name });
      setBrokerFlow(null);
      setBrokerEvents((arr) => [...arr, ...newEvents]);
    }
  };

  const handleUploadBrokerContacts = (filename: string = "contacts-export.csv") => {
    if (brokerFlow) return;
    const ts = Date.now();
    // Placeholder import: 24 contacts — 14 occupants, 6 subcontractors, 4 misc.
    // Three flagged: 2 missing email, 1 duplicate of M&S.
    const imports: BrokerContact[] = [
      // 14 occupants/tenants
      ...Array.from({ length: 14 }).map((_, i) => {
        const names = ["A. Patel","B. Nguyen","C. Hughes","D. Romero","E. Walsh","F. Adeyemi","G. Lindqvist","H. Bauer","I. Costa","J. Park","K. Moreau","L. Singh","M. Ortiz","N. Rashid"];
        const units = ["Flat 1, 5 Nugent Terrace","Flat 3, 5 Nugent Terrace","Flat 4, 5 Nugent Terrace","Unit 2, Stanley House","Unit 5, Stanley House","Unit 7, Stanley House","Mews 1, Cromwell Mews","Mews 3, Cromwell Mews","Mews 4, Cromwell Mews","Mews 2, Beaufort Mews","Mews 5, Beaufort Mews","Mews 6, Beaufort Mews","Flat 6, 5 Nugent Terrace","Unit 9, Stanley House"];
        const name = names[i];
        const unit = units[i];
        const missingEmail = i === 4 || i === 9; // 2 missing emails
        return {
          id: `bc-imp-${ts}-o${i}`,
          name,
          type: "occupant" as BrokerContactType,
          role: `Tenant · ${unit}`,
          initials: name.split(/\s+/).map((p) => p[0]).join("").toUpperCase(),
          email: missingEmail ? "—" : `${name.replace(/[^a-z]/gi, "").toLowerCase()}@example.com`,
          phone: `07700 900${(100 + i).toString()}`,
          contactPref: "no preference noted",
          address: `${unit}, London`,
          relatedTo: `Linked unit: ${unit}`,
          imported: true,
          flagged: missingEmail || false,
          flagLabel: missingEmail ? "Missing email" : undefined,
        };
      }),
      // 6 subcontractors
      ...Array.from({ length: 6 }).map((_, i) => {
        const names = ["Northgate Plumbing","Kingsley Glazing","Atrium Cleaning","Beacon Roofing","Linnet Locksmiths","Heron Gardens"];
        const roles = ["Plumber","Glazier","Cleaning contractor","Roofing","Locksmith","Grounds maintenance"];
        const name = names[i];
        return {
          id: `bc-imp-${ts}-s${i}`,
          name,
          type: "subcontractor" as BrokerContactType,
          role: `${roles[i]} · imported`,
          initials: name.split(/\s+/).map((p) => p[0]).join("").slice(0,2).toUpperCase(),
          email: `office@${name.split(" ")[0].toLowerCase()}.co.uk`,
          phone: `020 7946 0${(500 + i).toString()}`,
          contactPref: "prefers email",
          address: "—",
          relatedTo: "Linked to: portfolio (general)",
          imported: true,
        };
      }),
      // 4 misc — one is a duplicate of M&S
      ...["M&S","Greenfield Surveyors","Aldgate Insurance","Beacon Accountants"].map((name, i) => ({
        id: `bc-imp-${ts}-m${i}`,
        name,
        type: "misc" as BrokerContactType,
        role: i === 0 ? "Tenant · Shop, 5 Nugent Terrace (from import)" : "Imported · type to confirm",
        initials: name.replace(/[^A-Za-z]/g,"").slice(0,2).toUpperCase(),
        email: i === 0 ? "store.ops@marksandspencer.com" : `contact@${name.split(" ")[0].toLowerCase()}.co.uk`,
        phone: "—",
        contactPref: "no preference noted",
        address: "—",
        relatedTo: i === 0 ? "Linked unit: Shop, 5 Nugent Terrace" : "Linked to: portfolio (general)",
        imported: true,
        flagged: i === 0,
        flagLabel: i === 0 ? "Possible duplicate" : undefined,
      })),
    ];

    setContacts((arr) => [...imports, ...arr]);

    const byType: Record<BrokerContactType, number> = { staff: 0, subcontractor: 0, occupant: 0, misc: 0 };
    imports.forEach((c) => { byType[c.type] += 1; });
    const linkedProps = new Set<string>();
    imports.forEach((c) => {
      const m = c.relatedTo.match(/(5 Nugent Terrace|Stanley House|Cromwell Mews|Beaufort Mews)/g) || [];
      m.forEach((s) => linkedProps.add(s));
    });
    const flaggedFlags: BrokerImportFlag[] = imports
      .filter((c) => c.flagged)
      .map((c) => ({ name: c.name, reason: c.flagLabel === "Possible duplicate" ? "looks like a duplicate of M&S already on file" : "missing email" }));

    setBrokerEvents((arr) => [
      ...arr,
      { kind: "user", id: `bk-${ts}-u-upload`, text: `Uploaded ${filename}` },
      { kind: "broker", id: `bk-${ts}-b-upload-1`, text: `Got the spreadsheet — reading it in now. One moment.` },
      { kind: "broker", id: `bk-${ts}-b-upload-2`, text: `I've read in ${imports.length} contacts — ${byType.occupant} tenants, ${byType.subcontractor} contractors, ${byType.staff + byType.misc} others. I've linked them to their properties where the address gave me enough to go on. ${flaggedFlags.length > 0 ? `${flaggedFlags.length} I couldn't place cleanly — two are missing an email, and one looks like a duplicate of M&S already on file. I've left them flagged rather than guess — shall we run through them?` : "All placed cleanly."}` },
      { kind: "importSummary", id: `bk-${ts}-imp`, total: imports.length, byType, linkedProperties: linkedProps.size, flagged: flaggedFlags, filename },
    ]);
  };





  const handleProfessorUpload = (count: number = 3) => {
    const ts = Date.now();
    const stubs = ["Tenancy Agreement.pdf", "Lease — Flat 4.pdf", "EICR Report.pdf", "Insurance Schedule.pdf", "Gas Safety Record.pdf"];
    const newDocs: ProfDoc[] = Array.from({ length: count }).map((_, i) => ({
      id: `pd-${ts}-${i}`,
      name: stubs[i % stubs.length],
      status: "pending" as DocStatus,
      uploadedAt: "Today",
    }));
    setProfDocs((arr) => [...newDocs, ...arr]);
    const batchId = `ev-${ts}`;
    setProfEvents((arr) => [
      ...arr,
      { kind: "professor", id: `${batchId}-q`, text: `I've taken in ${count} document${count === 1 ? "" : "s"}. What type are these?` },
      { kind: "ask-type", id: batchId, docIds: newDocs.map((d) => d.id) },
    ]);
  };

  const assignProfessorType = (batchId: string, typeLabel: string) => {
    const meta = PROF_DOC_TYPES.find((t) => t.label === typeLabel);
    if (!meta) return;
    const ev = profEvents.find((e) => e.kind === "ask-type" && e.id === batchId) as Extract<ProfEvent, { kind: "ask-type" }> | undefined;
    if (!ev) return;
    setProfEvents((arr) => arr.map((e) => e.kind === "ask-type" && e.id === batchId ? { ...e, resolved: { type: typeLabel, family: meta.family } } : e));
    setProfDocs((arr) => arr.map((d) => ev.docIds.includes(d.id) ? { ...d, type: typeLabel, family: meta.family, timeClass: meta.timeClass, status: "extracting" } : d));
    setProfEvents((arr) => [...arr, { kind: "professor", id: `${batchId}-r`, text: `Marked as ${typeLabel}. I'll read them now and let you know what I find.` }]);
    // simulate extraction
    window.setTimeout(() => {
      setProfDocs((arr) => arr.map((d) => ev.docIds.includes(d.id) ? { ...d, status: "extracted", extractedAt: "Just now" } : d));
      setProfEvents((arr) => [...arr, { kind: "professor", id: `${batchId}-done`, text: `Done. ${ev.docIds.length} document${ev.docIds.length === 1 ? "" : "s"} read and filed in the library.` }]);
    }, 2800);
  };


  const performCard = (id: string) => {
    setReviewingCardId(null);
    setPerformingCardId(id);
    setExpandedCardId(null);
    setActionCards((arr) => arr.map((x) => x.id === id ? { ...x, approvalState: x.approvalState === "approved" ? "approved" : "in_progress" } : x));
  };
  const reviewCard = (id: string) => {
    setPerformingCardId(null);
    setReviewingCardId(id);
    setExpandedCardId(null);
  };
  const resetToMap = () => {
    // Single, predictable reset — always lands on the map.
    // NOTE: do NOT clear approvalState — pausing leaves the journey resumable ("Resume" on card).
    setPerformingCardId(null);
    setReviewingCardId(null);
    setShowDocuments(false);
    setShowWhatIveDone(false);
    setChatExpanded(false);
  };

  const markReviewReady = (id: string) => {
    setActionCards((arr) => arr.map((x) => x.id === id ? { ...x, reviewReady: true } : x));
  };


  const cancelPerform = resetToMap;
  const cancelReview = resetToMap;

  const completePerform = (summary: string) => {
    const activeId = performingCardId ?? reviewingCardId;
    if (activeId) {
      const card = actionCards.find((x) => x.id === activeId);
      setActionCards((arr) => arr.map((x) => x.id === activeId ? { ...x, approvalState: "approved" } : x));
      if (card) {
        setActionToast(`Done — ${card.title} · ${summary}`);
        window.setTimeout(() => setActionToast(null), 4500);
      }
    }
    setPerformingCardId(null);
    setReviewingCardId(null);
  };

  const manualHandleCard = (id: string, note: string) => {
    const card = actionCards.find((x) => x.id === id);
    setActionCards((arr) =>
      arr.map((x) =>
        x.id === id
          ? { ...x, approvalState: "approved", manuallyCompleted: true, manualNote: note }
          : x,
      ),
    );
    setExpandedCardId(null);
    if (card) {
      setActionToast(`Recorded — you handled "${card.title}".`);
      window.setTimeout(() => setActionToast(null), 3000);
    }
  };

  const openWorkflowFromCard = (_ref: string) => {
    // Open the Magician's workshop where this workflow lives.
    enterAdmin();
    setAdminCharacter("magician");
  };
  const chatBodyRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const reduced = prefersReducedMotion();
  const [owlsReady, setOwlsReady] = useState(false);
  // Preload owl images so the avatar appears before the chat starts streaming.
  useEffect(() => {
    let cancelled = false;
    const sources = Object.values(OWLS);
    let remaining = sources.length;
    if (remaining === 0) {
      setOwlsReady(true);
      return;
    }
    const done = () => {
      remaining -= 1;
      if (remaining <= 0 && !cancelled) setOwlsReady(true);
    };
    sources.forEach((src) => {
      const img = new Image();
      img.onload = done;
      img.onerror = done;
      img.src = src;
    });
    // Safety fallback: never block more than 1.5s
    const fallback = window.setTimeout(() => { if (!cancelled) setOwlsReady(true); }, 1500);
    return () => { cancelled = true; window.clearTimeout(fallback); };
  }, []);
  // Stateless demo reset: clear any persisted prototype keys on mount so every reload / re-entry
  // returns to the seeded Meet Hobson starting state with no residue from a prior session.
  useEffect(() => {
    try {
      localStorage.removeItem("hobsonPrototype.hasVisited");
      const ss = window.sessionStorage;
      ["hobson:chatWidth", "hobson:chatCollapsed", "hobson:mainCollapsed"].forEach((k) => ss.removeItem(k));
      // Clear any other hobson:* residue defensively.
      for (let i = ss.length - 1; i >= 0; i--) {
        const key = ss.key(i);
        if (key && key.startsWith("hobson:")) ss.removeItem(key);
      }
    } catch {}
  }, []);



  const selectedProperty = useMemo(
    () => PROPERTIES.find((p) => p.id === selectedPropertyId) || null,
    [selectedPropertyId]
  );
  const selectedUnit = useMemo(() => {
    if (!selectedProperty || !selectedUnitId) return null;
    return selectedProperty.units.find((u) => u.id === selectedUnitId) || null;
  }, [selectedProperty, selectedUnitId]);

  const selectedPropertyUnitCounts = useMemo(() => {
    if (!selectedProperty) return null;
    let alerts = 0, vacant = 0;
    selectedProperty.units.forEach((u) => {
      const d = deriveUnit(u);
      if (d.hasAlert) alerts += 1;
      if (d.isVacantConfirmed) vacant += 1;
    });
    return { total: selectedProperty.units.length, let: selectedProperty.units.length - vacant, vacant, alerts };
  }, [selectedProperty]);

  const messageGroups = useMemo(() => groupChatMessages(messages), [messages]);

  /* ----- scroll behaviour: pin to top when entering a property/unit so the
     owl intro, tiles, and intelligent actions are visible from the top.
     Once the user sends a message in that context, resume auto-scroll-to-bottom. ----- */
  const pinTopRef = useRef(false);
  useEffect(() => {
    const el = chatBodyRef.current;
    if (view === "property" || view === "unit") {
      pinTopRef.current = true;
      if (el) el.scrollTop = 0;
    } else {
      pinTopRef.current = false;
      if (el) el.scrollTop = el.scrollHeight;
    }
  }, [view, selectedPropertyId, selectedUnitId]);

  useEffect(() => {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (lastUser) pinTopRef.current = false;
    const el = chatBodyRef.current;
    if (!el) return;
    if (pinTopRef.current) {
      el.scrollTop = 0;
    } else {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, typing, chipVisible]);

  /* ----- keep the chat pinned to the bottom while content height grows
     (covers feedback-bubble staged reveals, typed-text streams, late-arriving
     rich answers, and any other in-place DOM growth that doesn't re-run the
     messages effect above). ----- */
  useEffect(() => {
    const el = chatBodyRef.current;
    if (!el) return;
    let lastHeight = el.scrollHeight;
    const ro = new ResizeObserver(() => {
      if (pinTopRef.current) return;
      const h = el.scrollHeight;
      if (h === lastHeight) return;
      lastHeight = h;
      // Only auto-stick if the user is already near the bottom — don't yank
      // them down if they've scrolled up to read something.
      const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      if (distanceFromBottom < 240) {
        el.scrollTop = el.scrollHeight;
      }
    });
    ro.observe(el);
    // Also observe the inner content so child growth is detected reliably.
    const inner = el.firstElementChild as HTMLElement | null;
    if (inner) ro.observe(inner);
    return () => ro.disconnect();
  }, []);

  /* ----- Admin (Magician) chat: keep pinned to bottom as the build progresses
     so the user never has to chase new questions/bubbles with the scrollbar. ----- */
  useEffect(() => {
    if (!adminMode) return;
    const el = chatBodyRef.current;
    if (!el) return;
    // Respect the user — only auto-follow if they're near the bottom.
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distanceFromBottom > 240) return;
    const id = requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
    return () => cancelAnimationFrame(id);
  }, [adminMode, adminCharacter, magicianEvents, magBuild?.step, magBuild?.steps?.length, magStreamingId, brokerEvents, profEvents]);

  /* ----- pre-fill demo rent question per level ----- */
  useEffect(() => {
    const pre = rentPrefillFor(view, selectedPropertyId, selectedUnitId);
    setInput(pre);
  }, [view, selectedPropertyId, selectedUnitId]);

  /* ----- pre-fill the next onboarding question into the chat box ----- */
  useEffect(() => {
    if (view !== "onboarding") return;
    if (chipVisible) {
      setInput(BEATS[beatIdx]?.prefill ?? "");
    } else {
      setInput("");
    }
  }, [view, chipVisible, beatIdx]);

  /* ----- onboarding line streaming ----- */
  useEffect(() => {
    if (view !== "onboarding") return;
    if (!owlsReady) return;
    const beat = BEATS[beatIdx];
    if (!beat) return;
    if (lineIdx >= beat.lines.length) {
      if (beatIdx === BEATS.length - 1) {
        const t2 = setTimeout(() => goPortfolio(true), reduced ? 600 : 1800);
        return () => clearTimeout(t2);
      }
      setChipVisible(true);
      return;
    }
    setOwl(beat.owl);
    setChipVisible(false);
    setTyping(true);
    const text = beat.lines[lineIdx];
    const preDelay = reduced ? 200 : 550;
    const t = setTimeout(() => {
      setTyping(false);
      if (reduced) {
        setMessages((m) => [
          ...m,
          { id: `${beatIdx}-${lineIdx}-${Date.now()}`, role: "hobson", text },
        ]);
        setLineIdx((i) => i + 1);
      } else {
        streamHobsonMessage(text, () => setLineIdx((i) => i + 1));
      }
    }, preDelay);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beatIdx, lineIdx, view, owlsReady]);

  const appendFeedbackPrompt = (chips?: string[]) => {
    const fid = `fb-${Date.now()}-${Math.random()}`;
    const text = "Was that helpful?";
    if (reduced) {
      setMessages((m) => [...m, { id: fid, role: "hobson", text, kind: "feedback", feedback: {}, feedbackChips: chips }]);
      return;
    }
    setMessages((m) => [...m, { id: fid, role: "hobson", text: "", streaming: true, kind: "feedback", feedback: {}, feedbackChips: chips }]);
    const words = text.split(" ");
    let i = 0;
    const step = () => {
      i += 1;
      const partial = words.slice(0, i).join(" ");
      setMessages((m) => m.map((x) => (x.id === fid ? { ...x, text: partial } : x)));
      if (i < words.length) setTimeout(step, 45 + Math.random() * 30);
      else setMessages((m) => m.map((x) => (x.id === fid ? { ...x, streaming: false } : x)));
    };
    setTimeout(step, 350);
  };

  const updateFeedback = (id: string, patch: Partial<FeedbackState>) => {
    setMessages((m) => m.map((x) => (x.id === id ? { ...x, feedback: { ...(x.feedback || {}), ...patch } } : x)));
  };

  const streamHobsonMessage = (text: string, done: () => void, opts?: { askFeedback?: boolean; chips?: string[] }) => {
    const id = `m-${Date.now()}-${Math.random()}`;
    setMessages((m) => [...m, { id, role: "hobson", text: "", streaming: true }]);
    const words = text.split(" ");
    let i = 0;
    const step = () => {
      i += 1;
      const partial = words.slice(0, i).join(" ");
      setMessages((m) => m.map((x) => (x.id === id ? { ...x, text: partial } : x)));
      if (i < words.length) {
        setTimeout(step, 45 + Math.random() * 35);
      } else {
        setMessages((m) => m.map((x) => (x.id === id ? { ...x, streaming: false } : x)));
        done();
        if (opts?.askFeedback) setTimeout(() => appendFeedbackPrompt(opts.chips), 1200);
      }
    };
    setTimeout(step, 60);
  };


  /* ----- send the pre-filled question during onboarding ----- */
  const advanceBeat = (userText?: string) => {
    const beat = BEATS[beatIdx];
    const text = (userText && userText.trim()) || beat.prefill;
    setMessages((m) => [
      ...m,
      { id: `u-${Date.now()}`, role: "user", text },
    ]);
    setChipVisible(false);
    setInput("");
    if (beatIdx === BEATS.length - 1) {
      // go to portfolio
      setTimeout(() => goPortfolio(true), 350);
    } else {
      setBeatIdx((i) => i + 1);
      setLineIdx(0);
    }
  };

  const skipIntro = () => goPortfolio(false);

  /* ----- view transitions ----- */
  const goPortfolio = (fromOnboarding: boolean) => {
    setView("portfolio");
    setSelectedPropertyId(null);
    setSelectedUnitId(null);
    setOwl("default");
    setChipVisible(false);
    setTyping(false);
    setSearchQuery("");
    setShowUnitPicker(false);
    setShowPropertyList(false);
    setPortfolioChip(null);
    setBriefingChoice(null);
    setExpandedCardId(null);
    setMessages([]);

    void fromOnboarding;

    const pending = actionCards.filter((c) => c.approvalState === "pending" || c.approvalState === "in_progress");
    const urgent = pending.filter((c) => c.urgency === "now");

    const numberWord = (n: number) =>
      ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"][n - 1] ?? String(n);
    const mattersClause = pending.length === 1 ? "one matter I believe deserves" : "a few matters I believe deserve";
    const urgentClause = urgent.length
      ? urgent.length === 1
        ? ", and one is time-sensitive"
        : `, and ${numberWord(urgent.length)} are time-sensitive`
      : "";

    const greetLines: string[] = testerMode
      ? [
          `Good morning, ${FIRST_NAME}. For today's testing, go straight to your unit — by the map or the search. That is where I can answer your questions.`,
        ]
      : pending.length === 0
        ? [`Good morning, ${FIRST_NAME}. Your portfolio is quiet today — nothing requires your attention.`]
        : [`Good morning, ${FIRST_NAME}. Your portfolio is quiet for the most part — though there are ${mattersClause} your attention today${urgentClause}. Shall I take you through them?`];





    setTyping(true);
    const delay = reduced ? 200 : 450;
    const playLine = (i: number) => {
      if (i >= greetLines.length) return;
      setTyping(true);
      const gap = i === 0 ? delay : (reduced ? 80 : 500);
      window.setTimeout(() => {
        setTyping(false);
        if (reduced) {
          setMessages((m) => [...m, { id: `p-greet-${i}`, role: "hobson", text: greetLines[i] }]);
          playLine(i + 1);
        } else {
          streamHobsonMessage(greetLines[i], () => playLine(i + 1));
        }
      }, gap);
    };
    playLine(0);
  };

  const goProperty = (id: string, carryCardId?: string) => {
    const p = PROPERTIES.find((x) => x.id === id);
    if (!p) return;
    // Standalone "properties" (single independent unit) skip the Property layer entirely
    if (p.standalone) {
      goUnit(p.units[0].id, p.id, carryCardId);
      return;
    }
    setView("property");
    setSelectedPropertyId(id);
    setSelectedUnitId(null);
    setCarriedCardId(carryCardId ?? null);
    setOwl("talking");
    setShowUnitPicker(false);
    setShowPropertyList(false);
    setPortfolioChip(null);
    setSearchQuery("");
    setMessages([]);
    const carriedCard = carryCardId ? actionCards.find((x) => x.id === carryCardId) : null;
    const greet = `${p.name}. Choose a unit to open it — that is where we can speak.`;
    setTyping(true);
    const delay = reduced ? 200 : 500;
    window.setTimeout(() => {
      setTyping(false);
      if (reduced) {
        setMessages([{ id: `prop-${id}`, role: "hobson", text: greet }]);
      } else {
        streamHobsonMessage(greet, () => {});
      }
    }, delay);
  };

  const askPropertyPreview = (q: string) => {
    const p = selectedProperty;
    if (!p) return;
    setMessages((m) => [...m, { id: `u-${Date.now()}`, role: "user", text: q }]);
    setTyping(true);
    setOwl("default");
    const reply = `I can't answer for the whole building yet — I build that up from each unit first. Let's open one and I'll show you what I can already do.`;
    const delay = reduced ? 200 : 700;
    window.setTimeout(() => {
      setTyping(false);
      setOwl("talking");
      if (reduced) {
        setMessages((m) => [...m, { id: `a-${Date.now()}`, role: "hobson", text: reply }]);
      } else {
        streamHobsonMessage(reply, () => {});
      }
    }, delay);
  };

  const goUnit = (unitId: string, propertyId?: string, carryCardId?: string) => {
    const pid = propertyId ?? selectedPropertyId;
    const p = PROPERTIES.find((x) => x.id === pid);
    if (!p) return;
    const u = p.units.find((x) => x.id === unitId);
    if (!u) return;
    setSelectedPropertyId(p.id);
    setView("unit");
    setSelectedUnitId(unitId);
    setCarriedCardId(carryCardId ?? null);
    setOwl("talking");
    setShowUnitPicker(false);
    setShowPropertyList(false);
    setPortfolioChip(null);
    setSearchQuery("");
    const where = p.standalone ? p.address : `${p.name}`;
    const derived = deriveUnit(u);
    const lines = testerMode
      ? [`Here we are at ${u.label}, ${where}. This is where I can help — ask me whatever you need to know about this unit.`]
      : buildUnitOpeningLines(u, derived, where);
    if (!testerMode && carryCardId) {
      const card = actionCards.find((x) => x.id === carryCardId);
      if (card) {
        lines.unshift(`About that — ${card.title}. ${card.whyItMatters}`);
      }
    }
    setMessages([]);
    const playLine = (i: number) => {
      if (i >= lines.length) return;
      setTyping(true);
      const gap = reduced ? 80 : i === 0 ? 400 : 600;
      window.setTimeout(() => {
        setTyping(false);
        if (reduced) {
          setMessages((m) => [...m, { id: `unit-${unitId}-${i}`, role: "hobson", text: lines[i] }]);
          playLine(i + 1);
        } else {
          streamHobsonMessage(lines[i], () => playLine(i + 1));
        }
      }, gap);
    };
    playLine(0);
  };

  const replayOnboarding = () => {
    setMessages([]);
    setBeatIdx(0);
    setLineIdx(0);
    setChipVisible(false);
    setTyping(false);
    setOwl("talking");
    setView("onboarding");
    setSelectedPropertyId(null);
    setSelectedUnitId(null);
    setShowDocuments(false);
    setShowWhatIveDone(false);
  };

  /* ----- map highlight derived from view/beat ----- */
  const highlight: MapHighlight = useMemo(() => {
    if (view === "onboarding") {
      const beat = BEATS[beatIdx];
      const firstId = PROPERTIES[0].id;
      switch (beat?.mapAction) {
        case "pulse-one":
          return { pulse: "one", pulseId: firstId };
        case "pulse-one-doc":
          return { pulse: "one", pulseId: firstId, showDoc: true };
        case "pulse-all":
          return { pulse: "all" };
        case "spread":
          return { pulse: "all", spread: true };
        case "check-one":
          return { pulse: "none", check: true, pulseId: firstId };
        default:
          return { pulse: "none" };
      }
    }
    if (view === "portfolio") {
      const matchIds: string[] | null = null;
      const fadeNonMatches = false;
      void searchQuery;
      void briefingChoice;
      return { pulse: "none", matchIds, fadeNonMatches, hoverId: hoveredCardPropertyId ?? hoveredPropertyId };
    }

    if (view === "property" && selectedProperty) {
      // Units are NOT shown as map pins — the map only locates the building.
      return {
        pulse: "none",
        dimExcept: selectedProperty.id,
        activeUnitPropertyId: selectedProperty.id,
        focus: { lat: selectedProperty.lat, lng: selectedProperty.lng, zoom: 17 },
        unitPins: [],
      };
    }
    if (view === "unit" && selectedProperty) {
      return {
        pulse: "none",
        dimExcept: selectedProperty.id,
        activeUnitPropertyId: selectedProperty.id,
        focus: { lat: selectedProperty.lat, lng: selectedProperty.lng, zoom: 17 },
        unitPins: [],
      };
    }
    return { pulse: "none" };
  }, [view, beatIdx, selectedProperty, selectedUnitId, searchQuery, hoveredPropertyId, briefingChoice, actionCards, hoveredCardPropertyId]);

  /* ----- unit Q&A ----- */
  const answerForUnit = (q: string): string => {
    const u = selectedUnit;
    const p = selectedProperty;
    if (!u || !p) return "Open a unit first and I can answer.";
    // Tenant/lease/EPC data isn't loaded for these units yet — return a clear placeholder.
    const placeholder = `I don't have the details for ${u.label} on file yet. Once your lease, compliance and rent documents are uploaded for ${p.standalone ? p.name : `${p.name} — ${u.label}`}, I'll be able to answer this properly. (Placeholder response.)`;
    void q;
    return placeholder;
  };

  const sendRentAnswer = (q: string) => {
    if (!q.trim()) return;
    setMessages((m) => [...m, { id: `u-${Date.now()}`, role: "user", text: q }]);
    setInput("");
    setTyping(true);
    setOwl("reading");
    const delay = reduced ? 200 : 900;
    window.setTimeout(() => {
      setTyping(false);
      setOwl("talking");
      const id = `rent-${Date.now()}`;
      const chips = ["the figure", "the sources", "the explanation", "the format"];
      if (reduced) {
        setMessages((m) => [...m, { id, role: "hobson", text: RENT_BODY_TEXT, rich: "rentFlat2" }]);
        if (testerMode) setTimeout(() => appendFeedbackPrompt(chips), 1100);
        return;
      }
      // Stream the paragraph text inside a rich bubble, then settle.
      setMessages((m) => [...m, { id, role: "hobson", text: "", streaming: true, rich: "rentFlat2" }]);
      const words = RENT_BODY_TEXT.split(" ");
      let i = 0;
      const step = () => {
        i += 1;
        const partial = words.slice(0, i).join(" ");
        setMessages((m) => m.map((x) => (x.id === id ? { ...x, text: partial } : x)));
        if (i < words.length) {
          setTimeout(step, 40 + Math.random() * 30);
        } else {
          setMessages((m) => m.map((x) => (x.id === id ? { ...x, streaming: false } : x)));
          if (testerMode) setTimeout(() => appendFeedbackPrompt(chips), 1300);
        }
      };
      setTimeout(step, 60);
    }, delay);
  };



  /* ----- summary request (occupational / compliance) — same fn at every level ----- */
  const requestSummary = (kind: "occupational" | "compliance", scope: SummaryScope) => {
    const question = summaryQuestionFor(kind, scope);
    const intro = summaryIntroFor(kind, scope);
    setMessages((m) => [...m, { id: `u-${Date.now()}`, role: "user", text: question }]);
    setInput("");
    setTyping(true);
    setOwl("reading");
    const delay = reduced ? 150 : 700;
    window.setTimeout(() => {
      setTyping(false);
      setOwl("talking");
      const id = `sum-${Date.now()}`;
      if (reduced) {
        setMessages((m) => [...m, { id, role: "hobson", text: intro, rich: "summary", summary: { kind, scope } }]);
        return;
      }
      setMessages((m) => [...m, { id, role: "hobson", text: "", streaming: true, rich: "summary", summary: { kind, scope } }]);
      const words = intro.split(" ");
      let i = 0;
      const step = () => {
        i += 1;
        const partial = words.slice(0, i).join(" ");
        setMessages((m) => m.map((x) => (x.id === id ? { ...x, text: partial } : x)));
        if (i < words.length) {
          setTimeout(step, 35 + Math.random() * 25);
        } else {
          setMessages((m) => m.map((x) => (x.id === id ? { ...x, streaming: false } : x)));
        }
      };
      setTimeout(step, 50);
    }, delay);
  };



  const sendUnitQuestion = (q: string) => {
    if (!q.trim()) return;
    if (isRentFlat2Question(q)) { sendRentAnswer(q); return; }
    setMessages((m) => [...m, { id: `u-${Date.now()}`, role: "user", text: q }]);
    setInput("");
    setTyping(true);
    setOwl("reading");
    const delay = reduced ? 200 : 800;
    setTimeout(() => {
      setTyping(false);
      setOwl("talking");
      const ans = selectedUnit ? answerUnitQuestion(q, selectedUnit, deriveUnit(selectedUnit)) : answerForUnit(q);
      if (reduced) {
        setMessages((m) => [...m, { id: `a-${Date.now()}`, role: "hobson", text: ans }]);
        if (testerMode) setTimeout(() => appendFeedbackPrompt(), 1100);
      } else {
        streamHobsonMessage(ans, () => {}, { askFeedback: testerMode });
      }
    }, delay);
  };


  const showRoadmapToast = (label: string) => {
    setToast(`"${label}" is Portfolio Intelligence — coming soon. Open a unit and I can answer it today.`);
    window.setTimeout(() => setToast(null), 3500);
  };

  // First-visit preview question handler — posts as user msg, Hobson replies warmly, then shows chip
  const askPortfolioPreview = (q: string) => {
    setMessages((m) => [...m, { id: `u-${Date.now()}`, role: "user", text: q }]);
    setTyping(true);
    setOwl("default");
    const reply = `I can't answer across your whole portfolio yet — I build that understanding unit by unit first. Let's open a unit and I'll show you what I can already do.`;
    const delay = reduced ? 200 : 700;
    window.setTimeout(() => {
      setTyping(false);
      setOwl("talking");
      if (reduced) {
        setMessages((m) => [...m, { id: `a-${Date.now()}`, role: "hobson", text: reply }]);
      } else {
        streamHobsonMessage(reply, () => {});
      }
      setPortfolioChip("Go straight to a unit");
    }, delay);
  };

  const handlePortfolioChip = (label: string) => {
    setMessages((m) => [...m, { id: `u-${Date.now()}`, role: "user", text: label }]);
    setPortfolioChip(null);
    if (label === "Browse properties") {
      setShowPropertyList(true);
      setShowUnitPicker(false);
    } else if (label === "Go straight to a unit") {
      setShowUnitPicker(true);
      setShowPropertyList(false);
    }
  };

  /* ----- progress ----- */
  const progressPct =
    view !== "onboarding"
      ? 100
      : Math.round(((beatIdx + (chipVisible ? 0.9 : lineIdx / Math.max(1, BEATS[beatIdx]?.lines.length || 1))) / BEATS.length) * 100);

  /* ----- breadcrumbs (derived from nav state) ----- */
  const crumbs: { label: string; onClick?: () => void; title?: string }[] = useMemo(() => {
    if (view === "onboarding") return [{ label: "Meet Hobson" }];

    // No breadcrumbs in the Back Office — chat is the only navigation.
    if (adminMode) return [];

    // Build the asset-context trail (Portfolio › [Property] › [Unit])
    const base: { label: string; onClick?: () => void; title?: string }[] = [
      { label: "Portfolio", onClick: () => { setShowDocuments(false); setShowWhatIveDone(false); goPortfolio(false); } },
    ];
    if (selectedProperty && !selectedProperty.standalone) {
      base.push({
        label: selectedProperty.name,
        title: selectedProperty.name,
        onClick: () => { setShowDocuments(false); setShowWhatIveDone(false); goProperty(selectedProperty.id); },
      });
    }
    if (selectedUnit) {
      const label = selectedProperty?.standalone ? selectedProperty.name : selectedUnit.label;
      base.push({
        label,
        title: label,
        onClick: (showDocuments || showWhatIveDone)
          ? () => { setShowDocuments(false); setShowWhatIveDone(false); goUnit(selectedUnit.id, selectedProperty?.id); }
          : undefined,
      });
    }

    // Right-slot suffixes (Documents / What I've done) sit at the end of the current path
    if (showDocuments) base.push({ label: "Documents" });
    else if (showWhatIveDone) base.push({ label: "What I've done" });

    // Last item is the current location -> not clickable
    if (base.length > 0) base[base.length - 1] = { ...base[base.length - 1], onClick: undefined };
    return base;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, selectedProperty, selectedUnit, showDocuments, showWhatIveDone, adminMode, adminCharacter, comingSoonHelperId]);


  /* ============ Render ============ */

  // Map must stay visible during the onboarding tour (Step 5 uses map search).
  // Honour user preference otherwise.
  const hasRightOverlay = showDocuments || showWhatIveDone || showTeamWall || !!performingCardId || !!reviewingCardId || adminMode;
  const isExpanded = chatExpanded && view !== "onboarding" && !hasRightOverlay && !adminMode;

  return (
    <div className="hobson-proto fixed inset-0 flex bg-white text-[#1F2330]">

      <StyleTag />

      {/* Left nav rail */}
      <aside className="w-[68px] shrink-0 bg-white border-r border-slate-200 flex flex-col items-center py-4 gap-2">
        <button
          type="button"
          onClick={adminMode ? exitAdmin : undefined}
          aria-label={adminMode ? "Exit Admin" : "Hobson"}
          title={adminMode ? "Exit Admin" : "Hobson"}
          className={`w-10 h-10 rounded-xl overflow-hidden grid place-items-center mb-2 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40 ${adminMode ? "cursor-pointer hover:brightness-110" : "cursor-default"}`}
        >
          <img src={owlDefault} alt="" aria-hidden className="w-10 h-10 object-contain" />
        </button>
        {adminMode ? (
          <>
            {/* Back Office: no specialist nav. Rooms + conversation are the navigation. */}
            <div className="mt-3 flex flex-col items-center gap-1">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Back office</span>
            </div>
            <button
              type="button"
              onClick={exitAdmin}
              aria-label="Exit Back Office and return to main menu"
              title="Exit Back Office"
              className="mt-6 w-[56px] flex flex-col items-center gap-1 py-1.5 rounded-lg text-slate-500 hover:text-[#7C3AED] hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M15 18l-6-6 6-6"/>
              </svg>
              <span className="text-[10px] leading-tight text-center">Exit</span>
            </button>
            <div className="mt-auto flex flex-col items-center gap-3 pb-2">
              <div className="w-9 h-9 rounded-full bg-slate-200 grid place-items-center text-xs font-semibold text-slate-700">MT</div>
            </div>
          </>



        ) : (
          <>
            <RailItem icon="pin" label="Portfolio" active={view !== "onboarding" && !showDocuments && !showWhatIveDone} onClick={() => { setShowDocuments(false); setShowWhatIveDone(false); goPortfolio(false); }} />
            <RailItem icon="doc" label="Documents" active={view !== "onboarding" && showDocuments} onClick={() => { setShowWhatIveDone(false); setShowDocuments(true); }} />
            {!testerMode && <RailItem icon="clock" label={"What I've done"} active={view !== "onboarding" && showWhatIveDone} onClick={() => { setShowDocuments(false); setShowWhatIveDone(true); }} />}
            <RailItem icon="chat" label="Chat History" />
            <div className="mt-auto flex flex-col items-center gap-3 pb-2">
              <button className="w-11 h-11 rounded-full bg-[#7C3AED] text-white grid place-items-center shadow-md hover:bg-[#6D28D9] transition" aria-label="New chat">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
              </button>
              <span className="text-[10px] text-slate-500">New chat</span>
              {!testerMode && <RailItem icon="gear" label="Admin" onClick={enterAdmin} />}
              <div className="w-9 h-9 rounded-full bg-slate-200 grid place-items-center text-xs font-semibold text-slate-700">MT</div>
            </div>
          </>
        )}
      </aside>


      {/* Chat panel */}
      <section
        className={`${isExpanded || mainCollapsed ? "flex-1" : "shrink-0"} relative bg-white border-r border-slate-200 flex flex-col ${chatCollapsed ? "overflow-hidden" : ""}`}
        style={isExpanded || mainCollapsed ? undefined : { width: chatCollapsed ? CHAT_COLLAPSED_WIDTH : chatWidth }}
        aria-hidden={chatCollapsed ? true : undefined}
        onDragOver={(e) => {
          if (!chatCollapsed && adminMode && adminCharacter === "professor") { e.preventDefault(); setChatDropOver(true); }
        }}
        onDragLeave={(e) => {
          if (e.currentTarget.contains(e.relatedTarget as Node)) return;
          setChatDropOver(false);
        }}
        onDrop={(e) => {
          if (!chatCollapsed && adminMode && adminCharacter === "professor") {
            e.preventDefault();
            const n = e.dataTransfer?.files?.length ?? 0;
            setChatDropOver(false);
            handleProfessorUpload(n || 3);
          }
        }}
      >
        {chatCollapsed && (
          <button
            type="button"
            onClick={expandChat}
            aria-label="Expand chat panel"
            title="Expand chat"
            className="absolute inset-0 z-40 flex flex-col items-center justify-start pt-4 gap-3 bg-white border-r border-slate-200 hover:bg-[#F5F3FF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M9 6l6 6-6 6"/>
            </svg>
            <span
              className="text-[10px] font-semibold tracking-wide text-[#7C3AED] uppercase"
              style={{ writingMode: "vertical-rl" as const, transform: "rotate(180deg)" }}
            >
              Expand chat
            </span>
          </button>
        )}
        {!chatCollapsed && chatDropOver && adminMode && adminCharacter === "professor" && (
          <div className="absolute inset-0 z-30 grid place-items-center bg-[#F5F3FF]/95 border-2 border-dashed border-[#7C3AED] rounded-none pointer-events-none">
            <div className="text-center px-6">
              <div className="text-[#7C3AED] text-3xl mb-2" aria-hidden>↑</div>
              <div className="text-sm font-semibold text-[#5B21B6]">Drop documents for the Professor to read</div>
              <div className="text-[12px] text-slate-600 mt-1">Leases, certificates, correspondence — one or many</div>
            </div>
          </div>
        )}
        {/* Header */}
        <header className="h-14 px-5 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2">
            {/* Owl avatar removed with returning-user mode */}

            <h1 className="font-semibold text-[15px] text-slate-900">Chat with Hobson</h1>
            {view !== "onboarding" && (
              <button
                onClick={replayOnboarding}
                className="ml-2 text-[11px] text-[#7C3AED] hover:underline focus:outline-none focus:ring-2 focus:ring-[#7C3AED] rounded"
              >
                Meet Hobson
              </button>
            )}
          </div>
          {/* Top-right pair to "Meet Hobson" on the left: a persistent, header-fixed
              affordance to re-summon the team wall on the right-hand stage.
              Lives in the chat header (does not scroll with messages).
              Hidden during the Meet Hobson onboarding to keep that flow focused. */}
          {view !== "onboarding" && (
            <button
              type="button"
              onClick={() => setShowTeamWall((v) => !v)}
              aria-pressed={showTeamWall}
              aria-label={showTeamWall ? "Hide my team" : "Meet my team"}
              title={showTeamWall ? "Hide my team" : "Meet my team"}
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium text-[#5B21B6] hover:text-[#4C1D95] hover:bg-[#F5F3FF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] transition-colors motion-reduce:transition-none"
            >
              {/* Small team/trio icon — visually distinct from the text-only "Meet Hobson" */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="9" cy="8" r="3" />
                <circle cx="17" cy="9" r="2.2" />
                <path d="M3 19c0-3 3-5 6-5s6 2 6 5" />
                <path d="M15 19c0-2 2-3.5 4-3.5s2.5 1 2.5 2.5" />
              </svg>
              <span>Meet my team</span>
            </button>
          )}
        </header>

        {/* Onboarding progress / breadcrumb */}
        {view === "onboarding" && !adminMode ? (
          <div className="px-5 pt-3 pb-2 border-b border-slate-100">
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
              <span className="font-medium text-slate-700">Meet Hobson</span>
              <div className="flex items-center gap-3">
                <span>Step {Math.min(beatIdx + 1, BEATS.length)} of {BEATS.length}</span>
                <button
                  onClick={skipIntro}
                  className="text-[#7C3AED] hover:underline focus:outline-none focus:ring-2 focus:ring-[#7C3AED] rounded"
                >
                  Skip intro
                </button>
              </div>
            </div>
            <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-[#7C3AED] transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        ) : !adminMode ? (
          <nav
            aria-label="Breadcrumb"
            className="px-5 py-2.5 border-b border-slate-200 bg-white sticky top-0 z-10"
          >
            <ol className="flex items-center gap-1.5 text-[13px] flex-nowrap overflow-hidden">
              {crumbs.map((c, i) => {
                const isLast = i === crumbs.length - 1;
                return (
                  <React.Fragment key={i}>
                    {i > 0 && <li aria-hidden className="text-slate-400 shrink-0 select-none">›</li>}
                    <li className="min-w-0 shrink truncate" title={c.title || c.label}>
                      {c.onClick && !isLast ? (
                        <button
                          type="button"
                          onClick={c.onClick}
                          className="text-[#7C3AED] hover:underline hover:text-[#6D28D9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] rounded px-0.5 cursor-pointer truncate max-w-[180px] inline-block align-bottom"
                        >
                          {c.label}
                        </button>
                      ) : (
                        <span
                          aria-current={isLast ? "page" : undefined}
                          className="text-slate-900 font-semibold truncate max-w-[220px] inline-block align-bottom px-0.5"
                        >
                          {c.label}
                        </span>
                      )}
                    </li>
                  </React.Fragment>
                );
              })}
            </ol>
          </nav>
        ) : null}


        {/* Pinned Quick bar (Quick overviews + Open a unit).
            Lives OUTSIDE the scrolling message list as a sibling of chatBodyRef,
            so the conversation scrolls beneath it and the bar stays fixed at the
            top of the chat column at any scroll position. Collapsed by default. */}
        {!adminMode && view !== "onboarding" && (view === "portfolio" || (view === "property" && selectedProperty) || (view === "unit" && selectedUnit && selectedPropertyId)) && (
          <div className="shrink-0 z-30 px-5 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-slate-200 motion-reduce:bg-white">
            <div className={isExpanded ? "max-w-[820px] mx-auto" : ""}>
              <button
                type="button"
                onClick={() => setPinnedQuickOpen((v) => !v)}
                aria-expanded={pinnedQuickOpen}
                aria-controls="pinned-quick-panel"
                className="w-full flex items-center justify-between gap-3 py-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/40 rounded"
              >
                <span className="text-[11.5px] uppercase tracking-wide text-slate-500 font-semibold truncate">
                  Quick overviews{view === "property" ? " · Open a unit" : (view === "unit" && selectedProperty && !selectedProperty.standalone) ? " · Open a unit" : ""}
                </span>
                <span
                  aria-hidden
                  className={`flex items-center justify-center w-5 h-5 rounded-full border border-slate-300 text-slate-500 transition-transform motion-reduce:transition-none ${pinnedQuickOpen ? "rotate-180" : ""}`}
                  style={{ transitionDuration: "180ms" }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                </span>
              </button>
              {/* PERSISTENT inner content — rendered from props/static state, never
                  from the chat message list. Running a Quick overview or "Open a unit"
                  appends to the chat but does NOT remove, clear, or collapse this bar. */}
              {pinnedQuickOpen && (
                <div id="pinned-quick-panel" className="pb-3 pt-1 space-y-2">
                  {view === "portfolio" && (
                    <SummaryActions scope={{ level: "portfolio" }} onRequest={(k, s) => requestSummary(k, s)} enabledKinds={summaryVisibility} />
                  )}
                  {view === "property" && selectedProperty && selectedPropertyUnitCounts && (
                    <>
                      <SummaryActions
                        scope={{ level: "property", propertyId: selectedProperty.id }}
                        onRequest={(k, s) => requestSummary(k, s)}
                        enabledKinds={summaryVisibility}
                      />
                      <button
                        type="button"
                        onClick={() => setOpenUnitsSignal((n) => n + 1)}
                        className="w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl text-left cursor-pointer
                          bg-gradient-to-r from-[#F5F3FF] to-white
                          border-2 border-[#C4B5FD]
                          shadow-sm hover:shadow-md hover:border-[#7C3AED] hover:from-[#EDE9FE] hover:to-[#F5F3FF]
                          active:shadow-sm active:translate-y-px
                          transition-[box-shadow,border-color,background-color,transform] motion-reduce:transition-none
                          focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/40 focus-visible:ring-offset-2"
                      >
                        <span className="flex items-center gap-3 min-w-0">
                          <span
                            aria-hidden
                            className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#7C3AED] text-white shadow-sm"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M4 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17" />
                              <path d="M4 21h16" />
                              <path d="M19 21V9l-3-2" />
                              <circle cx="13" cy="13" r="0.8" fill="currentColor" />
                            </svg>
                          </span>
                          <span className="flex flex-col min-w-0">
                            <span className="text-[15px] font-semibold text-slate-900 leading-tight">Open a unit</span>
                            <span className="text-[12px] text-slate-600 truncate">
                              {selectedPropertyUnitCounts.total} units · {selectedPropertyUnitCounts.let} let · {selectedPropertyUnitCounts.vacant} vacant
                              {!testerMode && selectedPropertyUnitCounts.alerts > 0 && <> · <span className="text-amber-700 font-medium">{selectedPropertyUnitCounts.alerts} need attention</span></>}
                            </span>
                          </span>
                        </span>
                        <span className="flex items-center gap-2 shrink-0">
                          <span className="hidden sm:inline text-[11px] uppercase tracking-wide text-[#7C3AED] font-semibold">Tap to choose</span>
                          <span
                            aria-hidden
                            className="flex items-center justify-center w-6 h-6 rounded-full bg-white border border-[#C4B5FD] text-[#7C3AED]"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M6 9l6 6 6-6" />
                            </svg>
                          </span>
                        </span>
                      </button>
                    </>
                  )}
                  {view === "unit" && selectedUnit && selectedPropertyId && (
                    <>
                      <SummaryActions
                        scope={{ level: "unit", propertyId: selectedPropertyId, unitId: selectedUnit.id }}
                        onRequest={(k, s) => requestSummary(k, s)}
                        enabledKinds={summaryVisibility}
                      />
                      {selectedProperty && !selectedProperty.standalone && (
                        <button
                          type="button"
                          onClick={() => { const pid = selectedPropertyId; if (pid) goProperty(pid); }}
                          className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg border border-[#C4B5FD] bg-gradient-to-r from-[#F5F3FF] to-white text-left hover:border-[#7C3AED] hover:from-[#EDE9FE] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/40 transition motion-reduce:transition-none"
                        >
                          <span className="flex flex-col min-w-0">
                            <span className="text-[13px] font-semibold text-slate-900">Open another unit</span>
                            <span className="text-[11px] text-slate-600 truncate">
                              {selectedProperty.units.length} units in {selectedProperty.name}
                            </span>
                          </span>
                          <span aria-hidden className="text-[#7C3AED] text-[11px] uppercase tracking-wide font-semibold">Open ↓</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Body */}
        <div ref={chatBodyRef} className={`flex-1 overflow-y-auto px-5 pt-0 ${isExpanded ? "w-full" : ""}`} style={{ paddingBottom: 48, scrollPaddingBottom: 48 }}>
          <div
            className={`${isExpanded ? "max-w-[820px] mx-auto" : ""} flex flex-col`}
            style={{ gap: CHAT_TURN_GAP_PX, paddingTop: CHAT_TOP_GAP_PX }}
          >



          {adminMode ? (
            adminCharacter === "inspector" ? (
              <InspectorChat
                events={inspectorEvents}
                build={inspectorBuild}
                confirmed={inspectorConfirmed}
                onPickArea={inspectorPickArea}
                onConsent={inspectorConsent}
                onDescribe={inspectorDescribe}
                onUpdateResearched={inspectorUpdateResearched}
                onRemoveResearched={inspectorRemoveResearched}
                onUpdateAddition={inspectorUpdateAddition}
                onRemoveAddition={inspectorRemoveAddition}
                onAddAddition={inspectorAddAddition}
                onConfirm={inspectorConfirm}
                onCancel={inspectorCancel}
                onUpdateConfirmed={inspectorUpdateConfirmed}
                onAddConfirmed={inspectorAddConfirmed}
              />

            ) : (
            <AdminChat
              character={adminCharacter ? ADMIN_CHARACTERS.find((c) => c.id === adminCharacter)! : null}
              owl={owl}
              professorEvents={adminCharacter === "professor" ? profEvents : undefined}
              onAssignProfessorType={assignProfessorType}
              brokerEvents={adminCharacter === "broker" ? brokerEvents : undefined}
              brokerFlowActive={adminCharacter === "broker" && !!brokerFlow}
              magicianEvents={adminCharacter === "magician" ? magicianEvents : undefined}
              magBuild={adminCharacter === "magician" ? magBuild : null}
              magStreamingId={adminCharacter === "magician" ? magStreamingId : null}
              onMagStreamDone={(id) => {
                setMagStreamingId((cur) => (cur === id ? null : cur));
                if (magSimQueueRef.current.length > 0) {
                  const next = magSimQueueRef.current.shift()!;
                  setTimeout(() => magAsk(next), 450);
                }
              }}
              magHandlers={adminCharacter === "magician" ? {
                onIntakeSubmit: magSubmitIntake,
                onQ1: magAnswerQ1, onQ2: magAnswerQ2, onQ3Scope: magAnswerQ3Scope, onQ4: magAnswerQ4,
                onAddStep: magAddStep, onAddCustomStep: magAddCustomStep, onRemoveStep: magRemoveStep, onMoveStep: magMoveStep,
                onToggleAdd: (open: boolean) => setMagBuild((b) => b ? { ...b, addOpen: open } : b),
                onSetCustomDraft: (v: string) => setMagBuild((b) => b ? { ...b, customDraft: v } : b),
                onFinishSteps: magFinishStepsToQ6, onKeepEditing: magAnswerQ6KeepEditing, onBuild: magAnswerQ6Build,
                onOpenBuilt: (id: string) => setViewingWorkflowId(id),
                onRenameStep: magRenameStep,
                onBeginEdit: magBeginEdit,
                onCancelEdit: magCancelEdit,
                onGoBack: magGoBack,
                onPauseSave: magPauseSave,
                onCancelBuild: magCancelBuild,
                onSetStepTemplate: magSetStepTemplate,
              } : undefined}
              onCreateWorkflow={adminCharacter === "magician" ? handleCreateWorkflow : undefined}
              onAddContact={adminCharacter === "broker" ? handleAddBrokerContact : undefined}
              onUploadContacts={adminCharacter === "broker" ? handleUploadBrokerContacts : undefined}
              onUploadDocuments={adminCharacter === "professor" ? handleProfessorUpload : undefined}
              boEvents={!adminCharacter ? boEvents : undefined}
              helpers={!adminCharacter ? BACK_OFFICE_HELPERS : undefined}
              onPickJob={!adminCharacter ? boPickJob : undefined}
            />
            )

          ) : (<>





          {/* Unit-level briefing — pinned alert + on-this-unit action cards */}
          {!testerMode && view === "unit" && selectedUnit && selectedPropertyId && (
            <>
              <PinnedAlertCard
                unit={selectedUnit}
                derived={deriveUnit(selectedUnit)}
                propertyContextCards={selectActionsForScope(actionCards, {
                  level: "unit",
                  propertyId: selectedPropertyId,
                  unitId: selectedUnit.id,
                }).filter((c) => c.anchorLevel === "property" && (c.approvalState === "pending" || c.approvalState === "in_progress"))}
                onManageAtProperty={() => goProperty(selectedPropertyId)}
              />
              {(() => {
                const unitOwnCardsRaw = selectActionsForScope(actionCards, {
                  level: "unit",
                  propertyId: selectedPropertyId,
                  unitId: selectedUnit.id,
                }).filter((c) => c.anchorLevel === "unit" && (c.approvalState === "pending" || c.approvalState === "in_progress"));
                if (unitOwnCardsRaw.length === 0) return null;
                const unitOwnCards = carriedCardId
                  ? [...unitOwnCardsRaw].sort((a, b) => (a.id === carriedCardId ? -1 : b.id === carriedCardId ? 1 : 0))
                  : unitOwnCardsRaw;
                return (
                  <section aria-label={`Actions for ${selectedUnit.label}`} className="space-y-3">
                    <div className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">
                      On this unit's desk · {unitOwnCards.length}
                    </div>
                    {unitOwnCards.map((c) => (
                      <div key={c.id} className={c.id === carriedCardId ? "rounded-xl ring-2 ring-[#7C3AED]/50 ring-offset-2 ring-offset-white" : ""}>
                      <ActionCardItem
                        key={c.id}
                        card={c}
                        level="unit"
                        expanded={expandedCardId === c.id}
                        onToggleExpand={() => setExpandedCardId(expandedCardId === c.id ? null : c.id)}
                        onHover={() => {}}
                        onApprove={() => {
                          const card = actionCards.find((x) => x.id === c.id);
                          setActionCards((arr) => arr.map((x) => x.id === c.id ? { ...x, approvalState: "approved" } : x));
                          setExpandedCardId(null);
                          if (card) {
                            setActionToast(`Done — ${card.title} recorded.`);
                            window.setTimeout(() => setActionToast(null), 3000);
                          }
                        }}
                        onDefer={() => {
                          setActionCards((arr) => arr.map((x) => x.id === c.id ? { ...x, approvalState: "deferred" } : x));
                          setExpandedCardId(null);
                        }}
                        onDismiss={() => {
                          setActionCards((arr) => arr.map((x) => x.id === c.id ? { ...x, approvalState: "dismissed" } : x));
                          setExpandedCardId(null);
                        }}
                        onPerform={() => performCard(c.id)}
                        onReview={() => reviewCard(c.id)}
                        onManualComplete={(note) => manualHandleCard(c.id, note)}
                        onOpenWorkflow={openWorkflowFromCard}
                      />
                      </div>
                    ))}
                  </section>
                );
              })()}
            </>
          )}

          {/* Portfolio view (single state) — intelligent action briefing */}
          {!testerMode && view === "portfolio" && !typing && messages.length > 0 && (
            <PortfolioBriefing
              cards={actionCards}
              choice={briefingChoice}
              setChoice={setBriefingChoice}
              expandedCardId={expandedCardId}
              setExpandedCardId={setExpandedCardId}
              onHoverCard={setHoveredCardPropertyId}
              onOpenUnit={(propId, unitId, cardId) => goUnit(unitId, propId, cardId)}
              onOpenProperty={(propId, cardId) => goProperty(propId, cardId)}
              onApprove={(id) => {
                const c = actionCards.find((x) => x.id === id);
                setActionCards((arr) => arr.map((x) => x.id === id ? { ...x, approvalState: "approved" } : x));
                setExpandedCardId(null);
                if (c) {
                  setActionToast(`Done — ${c.title} recorded.`);
                  window.setTimeout(() => setActionToast(null), 3000);
                }
              }}
              onDefer={(id) => {
                setActionCards((arr) => arr.map((x) => x.id === id ? { ...x, approvalState: "deferred" } : x));
                setExpandedCardId(null);
              }}
              onDismiss={(id) => {
                setActionCards((arr) => arr.map((x) => x.id === id ? { ...x, approvalState: "dismissed" } : x));
                setExpandedCardId(null);
              }}
              onPerform={performCard}
              onReview={reviewCard}
              onManualComplete={manualHandleCard}
              onOpenWorkflow={openWorkflowFromCard}
            />
          )}

          {/* Property view */}
          {view === "property" && selectedProperty && (
            <PropertyContent
              property={selectedProperty}
              testerMode={testerMode}
              propertyActionCards={testerMode ? [] : selectActionsForScope(actionCards, { level: "property", propertyId: selectedProperty.id })}
              expandedCardId={expandedCardId}
              setExpandedCardId={setExpandedCardId}
              carriedCardId={carriedCardId}
              openUnitsSignal={openUnitsSignal}
              onOpenUnit={(uid, cardId) => goUnit(uid, selectedProperty.id, cardId)}
              onPreviewQuestion={askPropertyPreview}
              onApprove={(id) => {
                const c = actionCards.find((x) => x.id === id);
                setActionCards((arr) => arr.map((x) => x.id === id ? { ...x, approvalState: "approved" } : x));
                setExpandedCardId(null);
                if (c) {
                  setActionToast(`Done — ${c.title} recorded.`);
                  window.setTimeout(() => setActionToast(null), 3000);
                }
              }}
              onDefer={(id) => {
                setActionCards((arr) => arr.map((x) => x.id === id ? { ...x, approvalState: "deferred" } : x));
                setExpandedCardId(null);
              }}
              onDismiss={(id) => {
                setActionCards((arr) => arr.map((x) => x.id === id ? { ...x, approvalState: "dismissed" } : x));
                setExpandedCardId(null);
              }}
              onPerform={performCard}
              onReview={reviewCard}
              onManualComplete={manualHandleCard}
              onOpenWorkflow={openWorkflowFromCard}
            />
          )}

          {/* Messages render LAST so new content (summaries, answers, results of pinned-bar actions)
              always appears at the bottom of the chat where the user is looking. */}
          {(messageGroups.length > 0 || typing) && (
            <div
              className="flex flex-col"
              data-chat-turn-stack
              style={{ gap: CHAT_TURN_GAP_PX }}
            >
              {messageGroups.map((group) => (
                <div
                  key={group.id}
                  className="flex flex-col"
                  data-chat-message-group={group.role}
                  style={{ gap: CHAT_GROUP_BUBBLE_GAP_PX }}
                >
                  {group.messages.map((m, i) => (
                    m.role === "hobson" ? (
                      m.kind === "feedback" ? (
                        <FeedbackBubble
                          key={m.id}
                          owl={owl}
                          text={m.text}
                          streaming={!!m.streaming}
                          feedback={m.feedback || {}}
                          chips={m.feedbackChips}
                          showAvatar={true}
                          onGrade={(g) => updateFeedback(m.id, { grade: g })}
                          onToggleChip={(c) => {
                            const cur = m.feedback?.chips || [];
                            const next = cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c];
                            updateFeedback(m.id, { chips: next });
                          }}
                          onSubmitNote={(note) => updateFeedback(m.id, { note, submitted: true })}
                          onSkipNote={() => updateFeedback(m.id, { submitted: true })}
                        />
                      ) : m.rich === "summary" && m.summary ? (
                        <div key={m.id} className="flex items-start gap-2">
                          {i === 0 ? <OwlAvatar state={owl} /> : <div aria-hidden className="w-10 h-10 shrink-0" />}
                          <div className="flex-1 min-w-0 space-y-2">
                            {m.text && (
                              <div className="max-w-[420px] bg-[#EDE9FE] text-[#1F2330] text-sm leading-relaxed px-4 py-2.5 rounded-2xl rounded-bl-md">
                                {m.text}
                                {m.streaming && <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-[#7C3AED] align-middle animate-pulse" />}
                              </div>
                            )}
                            {!m.streaming && (
                              <SummaryCard
                                kind={m.summary.kind}
                                scope={m.summary.scope}
                                onOpenUnit={(pid, uid) => goUnit(uid, pid)}
                                augmentCompliance={augmentCompliance}
                              />
                            )}
                          </div>
                        </div>
                      ) : (
                        <HobsonBubble
                          key={m.id}
                          text={m.text}
                          owl={owl}
                          streaming={!!m.streaming}
                          rich={m.rich === "rentFlat2" ? "rentFlat2" : undefined}
                          onAskFollowUp={(q) => sendRentAnswer(q)}
                          showAvatar={i === 0}
                        />
                      )
                    ) : (
                      <UserBubble key={m.id} text={m.text} />
                    )
                  ))}
                </div>
              ))}
              {typing && (
                <div
                  className="flex flex-col"
                  data-chat-message-group="hobson"
                  style={{ gap: CHAT_GROUP_BUBBLE_GAP_PX }}
                >
                  <TypingBubble
                    owl={owl}
                    showAvatar={messages[messages.length - 1]?.role !== "hobson"}
                  />
                </div>
              )}
            </div>
          )}

          {/* Unit view starter chips removed — chat is locked in the prototype */}
          </>)}
          </div>

        </div>


        {/* Composer */}
        <div className={`px-5 pt-2 pb-4 border-t border-slate-100 bg-white ${isExpanded ? "w-full" : ""}`}>
         <div className={isExpanded ? "max-w-[820px] mx-auto" : ""}>

          {view === "onboarding" ? (
            <>
              {chipVisible && (
                <div className="mb-2 flex items-center justify-end gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#7C3AED] text-white text-[11px] font-semibold shadow-sm animate-[pulse_1.6s_ease-in-out_infinite]">
                    Press send to continue
                    <span aria-hidden className="animate-bounce">↓</span>
                  </span>
                </div>
              )}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const q = input.trim();
                  if (!q) return;
                  if (!chipVisible) return;
                  advanceBeat(q);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full border bg-white focus-within:border-[#7C3AED] focus-within:ring-2 focus-within:ring-[#7C3AED]/20 transition ${
                  chipVisible
                    ? "border-[#7C3AED] ring-2 ring-[#7C3AED]/40 bg-[#F5F3FF] shadow-[0_0_0_4px_rgba(124,58,237,0.12)] animate-[pulse_1.6s_ease-in-out_infinite]"
                    : "border-slate-200"
                }`}
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={() => { /* locked-but-sendable */ }}
                  onClick={() => { if (chipVisible) advanceBeat(input); }}
                  readOnly
                  placeholder={!chipVisible ? "Hobson is talking…" : "Ask Hobson…"}
                  className={`flex-1 outline-none text-sm bg-transparent placeholder:text-slate-400 cursor-text ${chipVisible ? "text-[#5B21B6] font-semibold" : ""}`}
                  aria-label="Ask Hobson"
                />
                <button
                  type="submit"
                  className={`flex items-center justify-center rounded-full transition ${
                    chipVisible
                      ? "h-9 w-9 bg-[#7C3AED] text-white hover:bg-[#6D28D9] shadow-md ring-2 ring-[#7C3AED]/30 animate-[pulse_1.6s_ease-in-out_infinite]"
                      : "h-8 w-8 text-[#7C3AED] hover:text-[#6D28D9] disabled:text-slate-300"
                  }`}
                  aria-label="Send to continue"
                  disabled={!input.trim() || !chipVisible}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6"/>
                  </svg>
                </button>
              </form>
            </>
          ) : adminMode ? (
            adminCharacter === "magician"
              ? (magBuild
                  ? <AdminBuildActiveBanner label="Building a workflow above — pause or cancel it to start another." />
                  : <LockedComposer view={view} />)
              : adminCharacter === "broker"
                ? (brokerFlow
                    ? <BrokerComposer
                        onAdd={handleAddBrokerContact}
                        onUpload={handleUploadBrokerContacts}
                        flow={brokerFlow}
                        onSubmitAnswer={submitBrokerAnswer}
                        onCancel={cancelBrokerFlow}
                      />
                    : <LockedComposer view={view} />)
                : adminCharacter === "inspector"
                  ? <InspectorComposer buildActive={inspectorBuild !== null} />
                  : !adminCharacter
                    ? (
                        <div className="flex flex-col gap-2">
                          {boEvents.length > 0 && (
                            <div className="flex justify-start">
                              <button
                                type="button"
                                onClick={boShowJobs}
                                aria-label="Show what Hobson can do"
                                className="inline-flex items-center gap-1.5 rounded-full border border-[#7C3AED]/25 bg-[#7C3AED]/5 px-3 py-1 text-[11.5px] text-[#5B21B6] hover:bg-[#7C3AED]/10 hover:border-[#7C3AED]/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/40 transition motion-reduce:transition-none"
                              >
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2.5-3 4.5"/><path d="M12 17.5h.01"/></svg>
                                <span>What can you do?</span>
                              </button>
                            </div>
                          )}
                          <BackOfficeComposer onSubmit={boAskHobson} />
                        </div>
                      )
                    : <LockedComposer view={view} />


          ) : testerMode && view === "unit" ? (

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const q = input.trim();
                if (!q) return;
                sendUnitQuestion(q);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-slate-200 bg-white focus-within:border-[#7C3AED] focus-within:ring-2 focus-within:ring-[#7C3AED]/20 transition"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Hobson about this unit…"
                className="flex-1 outline-none text-sm bg-transparent placeholder:text-slate-400"
                aria-label="Ask Hobson about this unit"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="flex items-center justify-center h-9 w-9 rounded-full bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition disabled:bg-slate-200 disabled:text-slate-400"
                aria-label="Send"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6"/>
                </svg>
              </button>
            </form>
          ) : (
            <LockedComposer view={view} />
          )}
         </div>
        </div>
      </section>

      {/* Resizable divider between chat (left) and right work area / map.
          Hidden when chat is expanded full-width (no right pane visible). */}
      {!isExpanded && (
        <ResizeDivider
          width={chatCollapsed ? CHAT_COLLAPSED_WIDTH : chatWidth}
          setWidth={setChatWidth}
          minLeft={CHAT_MIN_WIDTH}
          minRight={MAIN_MIN_WIDTH}
          collapsed={chatCollapsed}
          collapseThreshold={CHAT_COLLAPSE_THRESHOLD}
          onCollapse={collapseChat}
          onExpand={expandChat}
          onToggleCollapsed={toggleChatCollapsed}
          mainCollapsed={mainCollapsed}
          mainCollapseThreshold={MAIN_COLLAPSE_THRESHOLD}
          onCollapseMain={collapseMain}
          onExpandMain={expandMain}
          onReset={resetLayout}
          isDefault={isLayoutDefault}
        />
      )}
      {!isExpanded && !isLayoutDefault && (
        <button
          type="button"
          onClick={resetLayout}
          title="Reset layout (Alt+0)"
          aria-label="Reset layout to default"
          className="fixed bottom-4 right-4 z-[700] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#7C3AED]/30 text-[#7C3AED] text-xs font-medium shadow-md hover:bg-[#F5F3FF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] transition-opacity duration-200 motion-reduce:transition-none"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>
          </svg>
          Reset layout
        </button>
      )}

      {/* Map */}
      {(() => { const hasOverlay = hasRightOverlay; return (
      <main
        className={`${chatExpanded && view !== "onboarding" && !hasOverlay ? "hidden" : `relative ${mainCollapsed ? "shrink-0 overflow-hidden" : "flex-1 min-w-0"}`} bg-slate-100`}
        style={mainCollapsed ? { width: MAIN_COLLAPSED_WIDTH } : undefined}
        aria-hidden={mainCollapsed ? true : undefined}
      >
        {mainCollapsed && (
          <button
            type="button"
            onClick={expandMain}
            aria-label="Expand work area"
            title="Expand work area"
            className="absolute inset-0 z-[600] flex flex-col items-center justify-start pt-4 gap-3 bg-white border-l border-slate-200 hover:bg-[#F5F3FF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M15 6l-6 6 6 6"/>
            </svg>
            <span
              className="text-[10px] font-semibold tracking-wide text-[#7C3AED] uppercase"
              style={{ writingMode: "vertical-rl" as const, transform: "rotate(180deg)" }}
            >
              Expand work area
            </span>
          </button>
        )}




        {!adminMode && (
          <div
            aria-hidden={view === "onboarding" ? true : undefined}
            className={`absolute inset-0 ${view === "onboarding" ? "pointer-events-none pins-hidden" : ""} ${reduced ? "reduced-motion" : ""}`}
          >
            <HobsonMap
              onPropertyClick={(id) => {
                const p = PROPERTIES.find((x) => x.id === id);
                if (!p) return;
                // Single-unit property: drill straight to the unit
                if (p.units.length === 1) {
                  goUnit(p.units[0].id, p.id);
                } else {
                  goProperty(id);
                }
              }}
              onPinHover={setHoveredPropertyId}
              onUnitClick={(uid) => selectedPropertyId && goUnit(uid, selectedPropertyId)}
              highlight={highlight}
            />
          </div>
        )}



        {/* Global map search — persistent on every level (hidden during Meet Hobson and in the Back Office) */}
        {view !== "onboarding" && !adminMode && (
          <MapSearch
            query={searchQuery}
            setQuery={setSearchQuery}
            onOpenUnit={(propId, unitId) => goUnit(unitId, propId)}
            onOpenProperty={(id) => {
              const p = PROPERTIES.find((x) => x.id === id);
              if (!p) return;
              if (p.units.length === 1) {
                goUnit(p.units[0].id, p.id);
              } else {
                goProperty(id);
              }
            }}
            onHoverProperty={setHoveredPropertyId}
          />
        )}



        {/* Map/Satellite toggle — hidden in the Back Office */}
        {!adminMode && (
          <div className="absolute bottom-4 right-4 z-[400] bg-white rounded-md shadow-md text-xs font-medium flex">
            <button className="px-3 py-1.5 bg-slate-900 text-white rounded-l-md">Map</button>
            <button className="px-3 py-1.5 text-slate-600 rounded-r-md">Satellite</button>
          </div>
        )}


        {/* Dev toggle removed: staged tour always starts at Meet Hobson */}



        {toast && (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-8 z-[500] bg-slate-900 text-white text-sm px-4 py-2.5 rounded-lg shadow-lg max-w-md text-center">
            {toast}
          </div>
        )}

        {actionToast && (
          <div role="status" aria-live="polite" className="absolute left-1/2 -translate-x-1/2 bottom-20 z-[500] bg-emerald-700 text-white text-sm px-4 py-2.5 rounded-lg shadow-lg max-w-md text-center">
            {actionToast}
          </div>
        )}
        {showDocuments && (
          <DocumentsLibrary
            onClose={resetToMap}
            initialScope={{
              propertyId: view === "property" || view === "unit" ? selectedPropertyId ?? undefined : undefined,
              unitId: view === "unit" ? selectedUnitId ?? undefined : undefined,
            }}
            onNavigatePortfolio={() => { resetToMap(); goPortfolio(false); }}
            onNavigateProperty={(pid) => { resetToMap(); goProperty(pid); }}
          />
        )}
        {showWhatIveDone && (
          <WhatIveDonePanel
            actionCards={actionCards}
            onClose={resetToMap}
            onResume={(id) => { setShowWhatIveDone(false); performCard(id); }}
            onOpenProperty={(pid) => { setShowWhatIveDone(false); goProperty(pid); }}
            onOpenUnit={(uid, pid) => { setShowWhatIveDone(false); goUnit(uid, pid); }}
            reducedMotion={reduced}
          />
        )}
        {/* "Meet my team" — user-summoned team wall overlay on the right-hand stage.
            The conversation on the left is undisturbed (no reset, no navigation).
            Z-index sits above documents/what-I've-done so it overlays whatever is
            currently on the stage, including admin rooms. */}
        {showTeamWall && (
          <div className="absolute inset-0 z-[550] bg-white flex flex-col motion-reduce:transition-none">
            <div className="flex items-center justify-between px-5 h-14 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider text-[#7C3AED] font-semibold">Hobson's back office</span>
                <span aria-hidden className="text-slate-300">·</span>
                <h2 className="text-[15px] font-semibold text-slate-900">Meet My Team</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowTeamWall(false)}
                aria-label="Close team wall"
                className="inline-flex items-center justify-center w-8 h-8 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M6 6l12 12M18 6L6 18"/></svg>
              </button>
            </div>
            <div className="flex-1 relative">
              <BackOfficeStage
                mode="hallway"
                helpers={BACK_OFFICE_HELPERS}
                comingSoonId={null}
                onEnter={() => { /* purely cosmetic outside Back Office */ }}
                onReturnHallway={() => setShowTeamWall(false)}
              />
            </div>
          </div>
        )}
        {(performingCardId || reviewingCardId) && (() => {
          const activeId = performingCardId ?? reviewingCardId!;
          const card = actionCards.find((c) => c.id === activeId);
          if (!card) return null;
          const mode: "perform" | "review" = performingCardId ? "perform" : "review";
          return (
            <PerformWorkspace
              card={card}
              mode={mode}
              onCancel={mode === "perform" ? cancelPerform : cancelReview}
              onComplete={completePerform}
              onReachedFinalGate={() => markReviewReady(card.id)}
              reducedMotion={reduced}
              section13Template={(() => {
                if (card.id !== "act-stanley-f8-rent") return null;
                const w = workflows.find((w) => w.id === card.workflowRef)
                  ?? workflows.find((w) => /rent\s*review/i.test(w.name) && w.stepTemplates?.["section13"]);
                return w?.stepTemplates?.["section13"] ?? null;
              })()}
            />

          );
        })()}
        {adminMode && (
          <BackOfficeWorkbench
            helpers={BACK_OFFICE_HELPERS}
            scopeProperty={selectedProperty}
            scopeUnit={selectedUnit}
            onClearScope={() => { setSelectedPropertyId(null); setSelectedUnitId(null); setView("portfolio"); }}
            jumpSectionId={boJumpSectionId}
            onJumpHandled={() => setBoJumpSectionId(null)}
            renderDocuments={() => (
              <ProfessorWorkArea
                character={ADMIN_CHARACTERS.find((x) => x.id === "professor")!}
                docs={profDocs}
              />
            )}
            renderCompliance={() => (
              <InspectorWorkArea
                rules={inspectorConfirmed}
                onUpdateRules={setInspectorConfirmed}
                buildActive={inspectorBuild !== null}
                onShowMe={inspectorShowMe}
              />
            )}
            renderPeople={() => (
              <BrokerWorkArea
                character={ADMIN_CHARACTERS.find((x) => x.id === "broker")!}
                contacts={contacts}
                onAdd={handleAddBrokerContact}
              />
            )}
            renderWorkflows={() => (
              <MagicianWorkArea
                character={ADMIN_CHARACTERS.find((x) => x.id === "magician")!}
                workflows={workflows}
                onCreate={handleCreateWorkflow}
                onAdjust={magAdjustWorkflow}
                onView={(id) => setViewingWorkflowId(id)}
                onResume={magResumeDraft}
                onDiscard={magDiscardDraft}
                onSimulate={magSimulate}
              />
            )}
            counts={{
              documents: profDocs.length,
              documentsPending: profDocs.filter((d) => d.status === "pending").length,
              compliance: inspectorConfirmed.length,
              complianceToConfirm: 2,
              contacts: contacts.length,
              workflows: workflows.length,
              workflowsActive: workflows.filter((w) => w.status === "built").length,
              workflowsDraft: workflows.filter((w) => w.status === "draft").length,
              units: PROPERTIES.reduce((n, p) => n + p.units.length, 0),
              properties: PROPERTIES.filter((p) => !p.standalone).length,
            }}
          />
        )}

      </main>
      ); })()}


      {/* Magician — View dialog (Adjust opens the full build flow in the left chat) */}
      {viewingWorkflowId && (
        <WorkflowViewDialog
          workflow={workflows.find((w) => w.id === viewingWorkflowId)!}
          onClose={() => setViewingWorkflowId(null)}
          onAdjust={() => { const id = viewingWorkflowId; setViewingWorkflowId(null); if (id) magAdjustWorkflow(id); }}
        />
      )}
    </div>


  );
};


/* ---------------- Sub-components ---------------- */

function ResizeDivider({
  width,
  setWidth,
  minLeft,
  minRight,
  collapsed,
  collapseThreshold,
  onCollapse,
  onExpand,
  onToggleCollapsed,
  mainCollapsed,
  mainCollapseThreshold,
  onCollapseMain,
  onExpandMain,
  onReset,
  isDefault,
}: {
  width: number;
  setWidth: (n: number) => void;
  minLeft: number;
  minRight: number;
  collapsed: boolean;
  collapseThreshold: number;
  onCollapse: () => void;
  onExpand: () => void;
  onToggleCollapsed: () => void;
  mainCollapsed: boolean;
  mainCollapseThreshold: number;
  onCollapseMain: () => void;
  onExpandMain: () => void;
  onReset: () => void;
  isDefault: boolean;
}) {
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const startWRef = useRef(width);
  const [active, setActive] = useState(false);

  const railWidth = 68;
  const getMaxLeft = () => window.innerWidth - railWidth - minRight;

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!draggingRef.current) return;
      const dx = e.clientX - startXRef.current;
      const maxLeft = getMaxLeft();
      const raw = startWRef.current + dx;
      // Collapse chat to the left
      if (raw < collapseThreshold) {
        if (!collapsed) onCollapse();
        return;
      }
      // Collapse work area to the right
      const mainCollapsePoint = maxLeft + (minRight - mainCollapseThreshold);
      if (raw > mainCollapsePoint) {
        if (!mainCollapsed) onCollapseMain();
        return;
      }
      if (collapsed && raw >= collapseThreshold) onExpand();
      if (mainCollapsed && raw <= mainCollapsePoint) onExpandMain();
      const next = Math.max(minLeft, Math.min(maxLeft, raw));
      setWidth(next);
    };
    const onUp = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      setActive(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [minLeft, minRight, setWidth, collapsed, collapseThreshold, onCollapse, onExpand, mainCollapsed, mainCollapseThreshold, onCollapseMain, onExpandMain]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 48 : 16;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (mainCollapsed) { onExpandMain(); return; }
      if (collapsed) return;
      const next = width - step;
      if (next < collapseThreshold) onCollapse();
      else setWidth(Math.max(minLeft, next));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      if (collapsed) { onExpand(); return; }
      const maxLeft = getMaxLeft();
      const next = width + step;
      if (next > maxLeft) { onCollapseMain(); return; }
      setWidth(Math.min(maxLeft, next));
    } else if (e.key === "Home") {
      e.preventDefault();
      if (!collapsed) setWidth(minLeft);
    } else if (e.key === "End") {
      e.preventDefault();
      if (collapsed) onExpand();
      setWidth(getMaxLeft());
    } else if (e.key === "Enter" || e.key === " " || e.key.toLowerCase() === "c") {
      e.preventDefault();
      if (mainCollapsed) onExpandMain();
      else onToggleCollapsed();
    }
  };

  const label = collapsed
    ? "Chat collapsed — press Enter or drag right to expand"
    : mainCollapsed
    ? "Work area collapsed — press Enter or drag left to expand"
    : "Resize chat and work area (Enter to collapse)";

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={label}
      aria-valuenow={width}
      aria-valuemin={minLeft}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseDown={(e) => {
        draggingRef.current = true;
        startXRef.current = e.clientX;
        startWRef.current = collapsed
          ? collapseThreshold
          : mainCollapsed
          ? getMaxLeft()
          : width;
        setActive(true);
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";
      }}
      onDoubleClick={() => {
        onReset();
      }}
      title={
        collapsed
          ? "Drag right or double-click to expand chat"
          : mainCollapsed
          ? "Drag left or double-click to expand work area"
          : "Drag to resize · double-click to reset · Enter to collapse"
      }
      className={`group relative w-1.5 shrink-0 cursor-col-resize select-none focus:outline-none ${active ? "bg-[#7C3AED]/30" : "bg-slate-100 hover:bg-[#7C3AED]/20"} focus-visible:bg-[#7C3AED]/30`}
    >
      <div className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-px ${active ? "bg-[#7C3AED]" : "bg-slate-200 group-hover:bg-[#7C3AED]/60"}`} />
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-0.5 px-0.5 py-2 rounded ${active ? "bg-[#7C3AED] text-white" : "bg-white border border-slate-200 text-slate-400 group-hover:text-[#7C3AED]"}`}>
        {collapsed ? (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M9 6l6 6-6 6"/>
          </svg>
        ) : mainCollapsed ? (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M15 6l-6 6 6 6"/>
          </svg>
        ) : (
          <>
            <span className="block w-0.5 h-0.5 rounded-full bg-current" />
            <span className="block w-0.5 h-0.5 rounded-full bg-current" />
            <span className="block w-0.5 h-0.5 rounded-full bg-current" />
          </>
        )}
      </div>
      {!isDefault && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onReset(); }}
          onMouseDown={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
          aria-label="Reset layout to default"
          title="Reset layout (double-click divider or Alt+0)"
          className="absolute left-1/2 -translate-x-1/2 top-[calc(50%+28px)] opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus:outline-none transition-opacity duration-200 motion-reduce:transition-none w-6 h-6 rounded-full bg-white border border-[#7C3AED]/40 text-[#7C3AED] hover:bg-[#F5F3FF] shadow-sm flex items-center justify-center focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>
          </svg>
        </button>
      )}
    </div>
  );
}


function RailItem({ icon, label, active, onClick }: { icon: "pin" | "doc" | "chat" | "gear" | "clock"; label: string; active?: boolean; onClick?: () => void }) {
  const stroke = active ? "#7C3AED" : "#64748B";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-12 flex flex-col items-center gap-0.5 py-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40 ${
        active ? "bg-[#F5F3FF]" : "hover:bg-slate-50"
      }`}
      aria-current={active ? "page" : undefined}
      aria-label={label}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {icon === "pin" && (<><path d="M12 22s-7-6.5-7-12a7 7 0 1114 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="10" r="2.5"/></>)}
        {icon === "doc" && (<><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></>)}
        {icon === "chat" && (<><path d="M21 12a8 8 0 11-3-6.2L21 3v6h-6"/></>)}
        {icon === "clock" && (<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>)}
        {icon === "gear" && (<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-1.8-.3 1.6 1.6 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.6 1.6 0 00-1-1.5"/></>)}
      </svg>
      <span className={`text-[10px] text-center leading-tight ${active ? "text-[#7C3AED] font-medium" : "text-slate-500"}`}>{label}</span>
    </button>
  );
}

function CharacterRailItem({ name, src, active, onClick, disabled, disabledLabel }: { name: string; src: string; active?: boolean; onClick?: () => void; disabled?: boolean; disabledLabel?: string }) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      aria-current={active ? "page" : undefined}
      aria-label={disabled && disabledLabel ? `${name} — ${disabledLabel}` : name}
      title={disabled && disabledLabel ? `${name} — ${disabledLabel}` : undefined}
      className={`w-14 flex flex-col items-center gap-1 py-1.5 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40 ${
        disabled
          ? "cursor-not-allowed opacity-60"
          : active
            ? "bg-[#F5F3FF] ring-1 ring-[#7C3AED]/40"
            : "hover:bg-slate-50"
      }`}
    >
      <div className={`w-11 h-11 rounded-full overflow-hidden bg-[#F5F3FF] grid place-items-center ${active && !disabled ? "ring-2 ring-[#7C3AED]" : "ring-1 ring-slate-200"} ${disabled ? "grayscale" : ""}`}>
        <img src={src} alt="" aria-hidden className="w-[120%] h-[120%] object-contain object-center" />
      </div>
      <span className={`text-[10px] text-center leading-tight ${disabled ? "text-slate-400" : active ? "text-[#7C3AED] font-medium" : "text-slate-600"}`}>{name}</span>
      {disabled && disabledLabel && (
        <span className="text-[9px] leading-tight text-slate-400">{disabledLabel}</span>
      )}
    </button>
  );
}

// CharacterAvatar always renders Hobson's owl in the left chat —
// specialist owls appear only in their rooms on the right.
// The `src` prop is intentionally ignored to enforce the one-voice rule.
function CharacterAvatar({ src: _src }: { src: string }) {
  return <OwlAvatar state="default" />;
}

const HOBSON_ADMIN_INTRO = "Welcome to my back office. Here are a few things I could take care of for you — or just tell me what you need.";

// Curated jobs Hobson offers to do FOR the user (his voice, as questions).
// Keyed by helper id so adding a helper in BACK_OFFICE_HELPERS auto-extends the list (if an entry exists).
const JOB_CATALOGUE: Record<string, { offer: string }> = {
  professor: { offer: "Want me to get more of your documents processed?" },
  inspector: { offer: "Want me to make sure you stay compliant?" },
  broker:    { offer: "Want me to update or add to your related parties?" },
  magician:  { offer: "Want me to build or change how I handle your work?" },
  keeper:    { offer: "Want me to manage who can access what?" },
};

function JobGrid({ helpers, onPick }: { helpers: BackOfficeHelper[]; onPick: (h: BackOfficeHelper) => void }) {
  const items = helpers.filter((h) => JOB_CATALOGUE[h.id]);
  return (
    <div
      className="ml-12 max-w-[560px] flex flex-col gap-1.5"
      role="group"
      aria-label="Things Hobson is offering to do for you"
    >
      {items.map((h) => {
        const job = JOB_CATALOGUE[h.id];
        const disabled = h.status !== "ready";
        return (
          <button
            key={h.id}
            type="button"
            onClick={() => { if (!disabled) onPick(h); }}
            disabled={disabled}
            aria-label={disabled ? `${job.offer} (coming soon)` : job.offer}
            className={`group w-full text-left rounded-xl px-4 py-2.5 text-[13.5px] leading-snug transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] motion-reduce:transition-none ${
              disabled
                ? "bg-slate-50/70 text-slate-500 cursor-not-allowed italic"
                : "bg-[#7C3AED]/5 text-slate-800 hover:bg-[#7C3AED]/10"
            }`}
          >
            <span className="inline-flex items-center gap-2">
              <span>{job.offer}</span>
              {disabled && (
                <span className="text-[9px] uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium not-italic">
                  Soon
                </span>
              )}
            </span>
          </button>
        );
      })}
      <p className="text-[12px] text-slate-500 italic mt-1 pl-1">…or just tell me what you need.</p>
    </div>
  );
}

type MagHandlers = {
  onIntakeSubmit: (intake: { title: string; purpose: string; description: string; whenKey: "6m" | "3m" | "on" | "always" | "custom"; whenLabel: string; visibility: "personal" | "company" }) => void;
  onQ1: (k: "rent_reviews" | "compliance" | "notices" | "other", label: string) => void;
  onQ2: (k: "6m" | "3m" | "on", label: string, phrase: string) => void;
  onQ3Scope: (sel: ScopeSelection) => void;
  onQ4: (owner: WorkflowOwner, label: string) => void;
  onAddStep: (opt: { id: string; label: string; phrase: string }) => void;
  onAddCustomStep: (label: string) => void;
  onRemoveStep: (uid: string) => void;
  onMoveStep: (uid: string, dir: -1 | 1) => void;
  onToggleAdd: (open: boolean) => void;
  onSetCustomDraft: (v: string) => void;
  onFinishSteps: () => void;
  onKeepEditing: () => void;
  onBuild: () => void;
  onOpenBuilt: (id: string) => void;
  onRenameStep: (uid: string, label: string) => void;
  onBeginEdit: (field: MagEditField) => void;
  onCancelEdit: () => void;
  onGoBack: () => void;
  onPauseSave: () => void;
  onCancelBuild: () => void;
  onSetStepTemplate: (uid: string, mode: "standard" | "own", filename?: string) => void;
};

function AdminChat({ character, owl, professorEvents, onAssignProfessorType, brokerEvents, brokerFlowActive, magicianEvents, magBuild, magStreamingId, onMagStreamDone, magHandlers, onCreateWorkflow, onAddContact, onUploadContacts, onUploadDocuments, boEvents, helpers, onPickJob }: { character: { id: AdminCharacter; name: string; src: string; greeting: string } | null; owl: OwlState; professorEvents?: ProfEvent[]; onAssignProfessorType?: (batchId: string, type: string) => void; brokerEvents?: BrokerEvent[]; brokerFlowActive?: boolean; magicianEvents?: MagicianEvent[]; magBuild?: MagBuildState | null; magStreamingId?: string | null; onMagStreamDone?: (id: string) => void; magHandlers?: MagHandlers; onCreateWorkflow?: () => void; onAddContact?: () => void; onUploadContacts?: (filename: string) => void; onUploadDocuments?: (count: number) => void; boEvents?: { kind: "user" | "hobson" | "jobs"; id: string; text?: string }[]; helpers?: BackOfficeHelper[]; onPickJob?: (h: BackOfficeHelper) => void }) {
  const [phase, setPhase] = useState<"typing" | "streaming" | "done">("typing");
  const [shown, setShown] = useState("");
  const reducedMotion = typeof window !== "undefined"
    && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const text = character ? character.greeting : HOBSON_ADMIN_INTRO;
  const keyId = character ? character.id : "hobson-admin-intro";

  useEffect(() => {
    setPhase("typing");
    setShown("");
    if (reducedMotion) {
      const t = setTimeout(() => {
        setShown(text);
        setPhase("done");
      }, 250);
      return () => clearTimeout(t);
    }
    const typingTimer = setTimeout(() => {
      setPhase("streaming");
      const words = text.split(" ");
      let i = 0;
      let cancelled = false;
      const step = () => {
        if (cancelled) return;
        i += 1;
        setShown(words.slice(0, i).join(" "));
        if (i < words.length) {
          setTimeout(step, 45 + Math.random() * 35);
        } else {
          setPhase("done");
        }
      };
      setTimeout(step, 60);
      return () => { cancelled = true; };
    }, 700);
    return () => clearTimeout(typingTimer);
  }, [keyId, reducedMotion, text]);

  // One voice rule: Hobson is the only speaker in the left chat, in every room.
  // The specialist is seen working on the right but never speaks here.
  const Avatar = <OwlAvatar state={owl} />;

  return (
    <div className="flex flex-col" style={{ gap: CHAT_TURN_GAP_PX }}>
      {phase === "typing" && (
        <div key={`${keyId}-typing`} className="flex items-end gap-2" aria-live="polite" aria-label="Hobson is typing">
          {Avatar}
          <div className="bg-[#EDE9FE] px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1">
            <Dot delay={0} /><Dot delay={150} /><Dot delay={300} />
          </div>
        </div>
      )}
      {phase !== "typing" && (
        <div key={keyId} className="flex items-end gap-2" aria-live="polite">
          {Avatar}
          <div className="max-w-[420px] bg-[#EDE9FE] text-[#1F2330] text-sm leading-relaxed px-4 py-2.5 rounded-2xl rounded-bl-md whitespace-pre-line">
            {shown}
            {phase === "streaming" && (
              <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-[#7C3AED] align-middle animate-pulse" />
            )}
          </div>
        </div>
      )}
      {!character && phase === "done" && helpers && onPickJob && (!boEvents || boEvents.length === 0) && (
        <JobGrid helpers={helpers} onPick={onPickJob} />
      )}
      {!character && phase === "done" && boEvents && boEvents.map((ev) => {
        if (ev.kind === "user") {
          return (
            <div key={ev.id} className="flex justify-end">
              <div className="max-w-[420px] bg-[#7C3AED] text-white text-sm leading-relaxed px-4 py-2.5 rounded-2xl rounded-br-md">{ev.text}</div>
            </div>
          );
        }
        if (ev.kind === "jobs") {
          return helpers && onPickJob ? (
            <div key={ev.id} className="flex flex-col gap-1.5">
              <div className="flex items-end gap-2">
                <OwlAvatar state={owl} />
                <div className="max-w-[420px] bg-[#EDE9FE] text-[#1F2330] text-sm leading-relaxed px-4 py-2.5 rounded-2xl rounded-bl-md">
                  A few things I could take on for you —
                </div>
              </div>
              <JobGrid helpers={helpers} onPick={onPickJob} />
            </div>
          ) : null;
        }
        return (
          <div key={ev.id} className="flex items-end gap-2">
            <OwlAvatar state={owl} />
            <div className="max-w-[420px] bg-[#EDE9FE] text-[#1F2330] text-sm leading-relaxed px-4 py-2.5 rounded-2xl rounded-bl-md whitespace-pre-line">{ev.text}</div>
          </div>
        );
      })}
      {character?.id === "magician" && phase === "done" && (!magicianEvents || magicianEvents.length === 0) && !magBuild && (
        <MagicianBuildInviteCard onStart={() => onCreateWorkflow?.()} />
      )}
      {character?.id === "magician" && phase === "done" && magicianEvents && magicianEvents.length > 0 && (
        <div className="flex flex-col" style={{ gap: CHAT_TURN_GAP_PX }}>
          {magicianEvents.map((ev) => {
            if (ev.kind === "user") {
              return (
                <div key={ev.id} className="flex justify-end">
                  <div className="max-w-[420px] bg-[#7C3AED] text-white text-sm leading-relaxed px-4 py-2.5 rounded-2xl rounded-br-md">{ev.text}</div>
                </div>
              );
            }
            if (ev.kind === "built") {
              return (
                <div key={ev.id} className="ml-12 max-w-[460px] rounded-xl border border-[#7C3AED]/30 bg-[#F5F3FF] p-3">
                  <div className="text-[11px] uppercase tracking-wide text-[#7C3AED] font-semibold mb-1">Built into the workshop</div>
                  <div className="text-[12px] text-slate-700"><span className="font-semibold">{ev.name}</span> — {ev.stepCount}-step workflow, ending in your approval.</div>
                  <button type="button" onClick={() => magHandlers?.onOpenBuilt(ev.workflowId)} className="mt-2 text-[12px] font-semibold text-[#7C3AED] hover:underline focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40 rounded">View workflow →</button>
                </div>
              );
            }
            if (ev.kind === "sim_header") {
              return (
                <div
                  key={ev.id}
                  className="ml-12 max-w-[460px] rounded-xl border-2 border-dashed border-[#7C3AED]/40 bg-[#F5F3FF]/70 p-3"
                  role="status"
                  aria-label={`Simulation of ${ev.workflowName}`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#7C3AED] text-white">Simulation</span>
                    <span className="text-[11px] text-slate-500">safe preview · nothing is sent</span>
                  </div>
                  <div className="text-[12px] text-slate-700">
                    Dry-run of <span className="font-semibold">{ev.workflowName}</span> — what I'd do when {ev.trigger}.
                  </div>
                </div>
              );
            }
            // magician streaming bubble
            return (
              <MagicianStreamingBubble
                key={ev.id}
                id={ev.id}
                text={ev.text}
                src={character.src}
                stream={magStreamingId === ev.id}
                onDone={() => onMagStreamDone?.(ev.id)}
              />
            );
          })}
          {magBuild && !magStreamingId && magHandlers && (
            <>
              <MagicianBuildPanel build={magBuild} handlers={magHandlers} />
              <MagicianBuildSpacer />
            </>
          )}
        </div>
      )}
      {character?.id === "professor" && phase === "done" && (!professorEvents || professorEvents.length === 0) && (
        <ProfessorBuildInviteCard onUpload={(n) => onUploadDocuments?.(n)} />
      )}
      {character?.id === "professor" && phase === "done" && professorEvents && professorEvents.length > 0 && (
        <div className="flex flex-col" style={{ gap: CHAT_TURN_GAP_PX }}>
          {professorEvents.map((ev) => {
            if (ev.kind === "professor") {
              return (
                <div key={ev.id} className="flex items-end gap-2">
                  <OwlAvatar state={owl} />

                  <div className="max-w-[360px] bg-[#EDE9FE] text-[#1F2330] text-sm leading-relaxed px-4 py-2.5 rounded-2xl rounded-bl-md">
                    {ev.text}
                  </div>
                </div>
              );
            }
            // ask-type
            return (
              <div key={ev.id} className="ml-12 max-w-[420px] rounded-xl border border-[#7C3AED]/30 bg-white p-3 shadow-sm">
                <div className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold mb-2">
                  Assign document type · {ev.docIds.length} file{ev.docIds.length === 1 ? "" : "s"} · all the same type
                </div>
                {ev.resolved ? (
                  <div className="text-[12px] text-slate-700">
                    <span className="font-semibold">{ev.resolved.type}</span>
                    <span className="ml-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 text-[10px] uppercase tracking-wide text-slate-600">
                      {ev.resolved.family}
                    </span>
                  </div>
                ) : (
                  <ProfTypeAssigner onAssign={(t) => onAssignProfessorType?.(ev.id, t)} />
                )}
              </div>
            );
          })}
        </div>
      )}
      {character?.id === "broker" && phase === "done" && (!brokerEvents || brokerEvents.length === 0) && !brokerFlowActive && (
        <BrokerBuildInviteCard onAdd={() => onAddContact?.()} onUpload={(name) => onUploadContacts?.(name)} />
      )}
      {character?.id === "broker" && phase === "done" && brokerEvents && brokerEvents.length > 0 && (
        <div className="flex flex-col" style={{ gap: CHAT_TURN_GAP_PX }}>
          {brokerEvents.map((ev) => {
            if (ev.kind === "broker") {
              return (
                <div key={ev.id} className="flex items-end gap-2">
                  <OwlAvatar state={owl} />
                  <div className="max-w-[420px] bg-[#EDE9FE] text-[#1F2330] text-sm leading-relaxed px-4 py-2.5 rounded-2xl rounded-bl-md">
                    {ev.text}
                  </div>
                </div>
              );
            }
            if (ev.kind === "user") {
              return (
                <div key={ev.id} className="flex justify-end">
                  <div className="max-w-[420px] bg-[#7C3AED] text-white text-sm leading-relaxed px-4 py-2.5 rounded-2xl rounded-br-md">
                    {ev.text}
                  </div>
                </div>
              );
            }
            if (ev.kind === "summary") {
              return (
                <div key={ev.id} className="ml-12 max-w-[420px] rounded-xl border border-[#7C3AED]/30 bg-[#F5F3FF] p-3">
                  <div className="text-[11px] uppercase tracking-wide text-[#7C3AED] font-semibold mb-1">Added to the black book</div>
                  <div className="text-[12px] text-slate-700"><span className="font-semibold">{ev.name}</span> · pinned at the top of the book on the right.</div>
                </div>
              );
            }
            // importSummary
            const typeRows: { key: BrokerContactType; label: string }[] = [
              { key: "occupant", label: "Occupants / tenants" },
              { key: "subcontractor", label: "Subcontractors" },
              { key: "staff", label: "Staff" },
              { key: "misc", label: "Other" },
            ];
            return (
              <div key={ev.id} className="ml-12 max-w-[460px] rounded-xl border border-[#7C3AED]/30 bg-[#F5F3FF] p-3.5">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-[#7C3AED]/10 text-[#7C3AED]" aria-hidden>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7h18M3 12h18M3 17h18"/></svg>
                  </span>
                  <div className="text-[11px] uppercase tracking-wide text-[#7C3AED] font-semibold">Imported into the black book</div>
                </div>
                <div className="text-[12px] text-slate-700 mb-2">
                  Read <span className="font-semibold">{ev.total} contacts</span> from <span className="font-mono text-[11.5px]">{ev.filename}</span> · linked across <span className="font-semibold">{ev.linkedProperties}</span> propert{ev.linkedProperties === 1 ? "y" : "ies"}.
                </div>
                <dl className="text-[11.5px] text-slate-700 grid grid-cols-2 gap-x-3 gap-y-0.5 mb-2">
                  {typeRows.filter((r) => (ev.byType[r.key] || 0) > 0).map((r) => (
                    <div key={r.key} className="flex justify-between">
                      <dt className="text-slate-500">{r.label}</dt>
                      <dd className="font-semibold">{ev.byType[r.key]}</dd>
                    </div>
                  ))}
                </dl>
                {ev.flagged.length > 0 && (
                  <div className="mt-1 rounded-md border border-amber-200 bg-amber-50 p-2">
                    <div className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-wide font-semibold text-amber-700 mb-1">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M4 21V4h12l-2 4 2 4H4"/></svg>
                      {ev.flagged.length} need{ev.flagged.length === 1 ? "s" : ""} your confirmation
                    </div>
                    <ul className="text-[11.5px] text-slate-700 space-y-0.5">
                      {ev.flagged.map((f, i) => (
                        <li key={i}><span className="font-semibold">{f.name}</span> — {f.reason}</li>
                      ))}
                    </ul>
                    <div className="text-[11px] text-slate-500 mt-1.5">I've parked them flagged in the book rather than guess. Open the black book to confirm.</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


function MagicianStreamingBubble({ id, text, src, stream, onDone }: { id: string; text: string; src: string; stream: boolean; onDone: () => void }) {
  const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const [phase, setPhase] = useState<"typing" | "streaming" | "done">(stream ? "typing" : "done");
  const [shown, setShown] = useState(stream ? "" : text);
  useEffect(() => {
    if (!stream) { setShown(text); setPhase("done"); return; }
    setPhase("typing");
    setShown("");
    if (reduced) {
      const t = setTimeout(() => { setShown(text); setPhase("done"); onDone(); }, 200);
      return () => clearTimeout(t);
    }
    const typingTimer = setTimeout(() => {
      setPhase("streaming");
      const words = text.split(" ");
      let i = 0;
      let cancelled = false;
      const step = () => {
        if (cancelled) return;
        i += 1;
        setShown(words.slice(0, i).join(" "));
        if (i < words.length) setTimeout(step, 45 + Math.random() * 35);
        else { setPhase("done"); onDone(); }
      };
      setTimeout(step, 60);
      return () => { cancelled = true; };
    }, 500);
    return () => clearTimeout(typingTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  return (
    <>
      {phase === "typing" ? (
        <div className="flex items-end gap-2" aria-live="polite">
          <OwlAvatar state="talking" />
          <div className="bg-[#EDE9FE] px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1">
            <Dot delay={0} /><Dot delay={150} /><Dot delay={300} />
          </div>
        </div>
      ) : (
        <div className="flex items-end gap-2" aria-live="polite">
          <OwlAvatar state={phase === "streaming" ? "talking" : "default"} />
          <div className="max-w-[420px] bg-[#EDE9FE] text-[#1F2330] text-sm leading-relaxed px-4 py-2.5 rounded-2xl rounded-bl-md">
            {shown}
            {phase === "streaming" && <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-[#7C3AED] align-middle animate-pulse" />}
          </div>
        </div>
      )}
    </>
  );
}

function MagOptionButton({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="px-3 py-1.5 rounded-full border border-[#7C3AED]/40 bg-white text-[12.5px] font-medium text-[#1F2330] hover:bg-[#F5F3FF] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}

function MagicianIntake({ onSubmit, initial, onCancel }: { onSubmit: MagHandlers["onIntakeSubmit"]; initial?: Partial<{ title: string; purpose: string; description: string; whenKey: "6m" | "3m" | "on" | "always" | "custom"; whenLabel: string; visibility: "personal" | "company" }>; onCancel?: () => void }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [purpose, setPurpose] = useState(initial?.purpose ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [whenKey, setWhenKey] = useState<"6m" | "3m" | "on" | "always" | "custom" | null>(initial?.whenKey ?? null);
  const [whenCustom, setWhenCustom] = useState(initial?.whenKey === "custom" ? (initial?.whenLabel ?? "") : "");
  const [visibility, setVisibility] = useState<"personal" | "company" | null>(initial?.visibility ?? null);

  const whenOptions: { k: "6m" | "3m" | "on" | "always"; label: string }[] = [
    { k: "6m", label: "6 months ahead" },
    { k: "3m", label: "3 months ahead" },
    { k: "on", label: "On the date" },
    { k: "always", label: "Always visible" },
  ];

  const whenLabel = whenKey === "custom" ? whenCustom.trim() : whenOptions.find((o) => o.k === whenKey)?.label || "";
  const canSubmit = title.trim() !== "" && purpose.trim() !== "" && whenKey !== null && (whenKey !== "custom" || whenCustom.trim() !== "") && visibility !== null;

  const submit = () => {
    if (!canSubmit || !whenKey || !visibility) return;
    onSubmit({
      title: title.trim(),
      purpose: purpose.trim(),
      description: description.trim(),
      whenKey,
      whenLabel,
      visibility,
    });
  };

  const fieldLabel = "block text-[11px] uppercase tracking-wide text-[#5B21B6] font-semibold mb-1";
  const inputCls = "w-full text-[13px] border border-slate-200 rounded-md px-2.5 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40";

  return (
    <div className="space-y-3">
      <div>
        <label className={fieldLabel} htmlFor="mag-intake-title">Title <span className="text-rose-600">*</span></label>
        <input id="mag-intake-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Rent review" className={inputCls} autoFocus />
      </div>
      <div>
        <label className={fieldLabel} htmlFor="mag-intake-purpose">Purpose <span className="text-rose-600">*</span></label>
        <input id="mag-intake-purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="What is this workflow for?" className={inputCls} />
      </div>
      <div>
        <span className={fieldLabel}>When should it show on my dashboard? <span className="text-rose-600">*</span></span>
        <div className="flex flex-wrap gap-1.5">
          {whenOptions.map((o) => {
            const active = whenKey === o.k;
            return (
              <button
                key={o.k}
                type="button"
                onClick={() => setWhenKey(o.k)}
                aria-pressed={active}
                className={`px-3 py-1.5 rounded-full border text-[12.5px] font-medium focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40 ${
                  active ? "bg-[#7C3AED] text-white border-[#7C3AED]" : "bg-white text-[#1F2330] border-[#7C3AED]/40 hover:bg-[#F5F3FF]"
                }`}
              >
                {o.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setWhenKey("custom")}
            aria-pressed={whenKey === "custom"}
            className={`px-3 py-1.5 rounded-full border text-[12.5px] font-medium focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40 ${
              whenKey === "custom" ? "bg-[#7C3AED] text-white border-[#7C3AED]" : "bg-white text-[#1F2330] border-dashed border-[#7C3AED]/50 hover:bg-[#F5F3FF]"
            }`}
          >
            Custom…
          </button>
        </div>
        {whenKey === "custom" && (
          <input
            value={whenCustom}
            onChange={(e) => setWhenCustom(e.target.value)}
            placeholder="Type when it should appear (e.g. 9 months ahead)"
            className={`${inputCls} mt-1.5`}
            aria-label="Custom when"
          />
        )}
      </div>
      <div>
        <label className={fieldLabel} htmlFor="mag-intake-desc">
          Description <span className="text-slate-400 font-normal normal-case tracking-normal">(optional)</span>
        </label>
        <textarea id="mag-intake-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Any extra context — leave blank if you'd rather not." className={`${inputCls} min-h-[60px]`} />
      </div>
      <div>
        <span className={fieldLabel}>Visibility <span className="text-rose-600">*</span></span>
        <div className="inline-flex rounded-full border border-[#7C3AED]/40 p-0.5 bg-white" role="group" aria-label="Visibility">
          {([
            { k: "personal", label: "Personal" },
            { k: "company", label: "Company-wide" },
          ] as const).map((v) => {
            const active = visibility === v.k;
            return (
              <button
                key={v.k}
                type="button"
                onClick={() => setVisibility(v.k)}
                aria-pressed={active}
                className={`px-3 py-1.5 rounded-full text-[12.5px] font-medium focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40 ${
                  active ? "bg-[#7C3AED] text-white" : "text-[#1F2330] hover:bg-[#F5F3FF]"
                }`}
              >
                {v.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
        <span className="text-[11px] text-slate-500">Required fields marked <span className="text-rose-600">*</span></span>
        <div className="flex items-center gap-1.5">
          {onCancel && (
            <button type="button" onClick={onCancel} className="px-3 py-1.5 rounded-full text-[12.5px] text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40">Cancel</button>
          )}
          <button
            type="button"
            onClick={submit}
            disabled={!canSubmit}
            className="px-3.5 py-1.5 rounded-full bg-[#7C3AED] text-white text-[12.5px] font-semibold hover:bg-[#6D28D9] disabled:bg-slate-200 disabled:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40"
          >
            {initial ? "Save changes" : "Start building →"}
          </button>
        </div>
      </div>
    </div>
  );
}

function MagicianStepRow({ s, i, total, handlers }: { s: MagBuildStep; i: number; total: number; handlers: MagHandlers }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(s.label);
  if (editing) {
    return (
      <li className="flex items-start gap-2 rounded-md border border-[#7C3AED]/40 bg-[#F5F3FF] px-2 py-1.5">
        <span className="text-[11px] font-semibold text-slate-500 mt-1.5 w-4 text-right">{i + 1}.</span>
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); handlers.onRenameStep(s.uid, draft); setEditing(false); }
            if (e.key === "Escape") { setDraft(s.label); setEditing(false); }
          }}
          className="flex-1 text-[12.5px] border border-slate-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40"
          aria-label={`Edit step ${i + 1}`}
        />
        <button type="button" onClick={() => { handlers.onRenameStep(s.uid, draft); setEditing(false); }} className="px-2 py-1 rounded-md bg-[#7C3AED] text-white text-[11.5px] font-semibold hover:bg-[#6D28D9] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40">Save</button>
        <button type="button" onClick={() => { setDraft(s.label); setEditing(false); }} className="px-2 py-1 rounded-md text-[11.5px] text-slate-500 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40">Cancel</button>
      </li>
    );
  }
  const docStep = isDocStep(s);
  return (
    <li className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5">
      <div className="flex items-start gap-2">
        <span className="text-[11px] font-semibold text-slate-500 mt-0.5 w-4 text-right">{i + 1}.</span>
        <span className="flex-1 text-[12.5px] text-slate-800 leading-snug">{s.label}</span>
        <div className="flex items-center gap-0.5">
          <button type="button" aria-label={`Edit step ${i + 1}`} onClick={() => setEditing(true)} className="px-1.5 h-6 grid place-items-center rounded text-[11px] font-medium text-[#7C3AED] hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40">Edit</button>
          <button type="button" aria-label="Move up" disabled={i === 0} onClick={() => handlers.onMoveStep(s.uid, -1)} className="w-6 h-6 grid place-items-center rounded text-slate-500 hover:bg-white disabled:opacity-30 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40">↑</button>
          <button type="button" aria-label="Move down" disabled={i === total - 1} onClick={() => handlers.onMoveStep(s.uid, 1)} className="w-6 h-6 grid place-items-center rounded text-slate-500 hover:bg-white disabled:opacity-30 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40">↓</button>
          <button type="button" aria-label="Remove step" onClick={() => handlers.onRemoveStep(s.uid)} className="w-6 h-6 grid place-items-center rounded text-slate-500 hover:bg-white hover:text-rose-600 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40">×</button>
        </div>
      </div>
      {docStep && (
        <div className="mt-1.5 ml-6">
          <StepTemplatePicker s={s} onSet={(mode, filename) => handlers.onSetStepTemplate(s.uid, mode, filename)} />
        </div>
      )}
    </li>
  );
}

function StepTemplatePicker({ s, onSet }: { s: MagBuildStep; onSet: (mode: "standard" | "own", filename?: string) => void }) {
  const [open, setOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const tpl = templateOf(s);
  const onPick = () => fileRef.current?.click();
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onSet("own", f.name);
    e.target.value = "";
    setOpen(false);
  };
  return (
    <div className="inline-flex flex-wrap items-center gap-1.5 text-[11.5px]">
      <span className="text-slate-500">Template:</span>
      {tpl.mode === "standard" ? (
        <>
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={open}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-slate-300 bg-white text-slate-700 hover:border-[#7C3AED]/60 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40"
            >
              Hobson's standard <span aria-hidden>▾</span>
            </button>
            {open && (
              <div role="menu" className="absolute z-10 mt-1 left-0 w-[200px] rounded-md border border-slate-200 bg-white shadow-md p-1 text-[11.5px]">
                <button type="button" role="menuitem" onClick={() => { onSet("standard"); setOpen(false); }} className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-50 text-slate-700 flex items-center justify-between focus:outline-none focus:bg-slate-50">
                  Use Hobson's standard <span className="text-[#7C3AED]">✓</span>
                </button>
                <button type="button" role="menuitem" onClick={onPick} className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-50 text-slate-700 focus:outline-none focus:bg-slate-50">
                  Use my own…
                </button>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" className="sr-only" aria-label="Upload your template" onChange={onFile} />
        </>
      ) : (
        <>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-[#7C3AED]/40 bg-[#F5F3FF] text-[#5B21B6]" title={tpl.filename}>
            <svg aria-hidden width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/></svg>
            Using your template: <span className="font-medium truncate max-w-[140px] inline-block align-bottom">{tpl.filename}</span>
          </span>
          <button type="button" onClick={onPick} className="text-[#7C3AED] hover:underline focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40 rounded px-1">Replace</button>
          <button type="button" onClick={() => onSet("standard")} className="text-slate-500 hover:text-slate-700 hover:underline focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40 rounded px-1">Use standard instead</button>
          <input ref={fileRef} type="file" className="sr-only" aria-label="Replace your template" onChange={onFile} />
        </>
      )}
    </div>
  );
}

function MagicianSoFar({ build, handlers }: { build: MagBuildState; handlers: MagHandlers }) {
  // Hide during intake (nothing committed yet) and while editing intake.
  if (build.step === "intake") return null;
  const rows: { key: string; label: string; value?: string; field: MagEditField | null }[] = [
    { key: "title", label: "Title", value: build.title, field: "intake" },
    { key: "purpose", label: "Purpose", value: build.purpose, field: "intake" },
    { key: "when", label: "When", value: build.whenLabel, field: "intake" },
    { key: "visibility", label: "Visibility", value: build.visibility === "company" ? "Company-wide" : build.visibility === "personal" ? "Personal" : undefined, field: "intake" },
    { key: "scope", label: "Scope", value: build.scopeLabel, field: build.scope === "unit" ? "scopeUnit" : "scope" },
    { key: "owner", label: "Owner", value: build.ownerLabel, field: "owner" },
  ];
  const visible = rows.filter((r) => r.value);
  if (visible.length === 0) return null;
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50/70 p-2.5">
      <div className="flex items-center justify-between mb-1.5">
        <div className="text-[11px] uppercase tracking-wide text-[#5B21B6] font-semibold">So far</div>
        <div className="text-[10.5px] text-slate-500">Tap a line to change it</div>
      </div>
      <ul className="space-y-1">
        {visible.map((r) => (
          <li key={r.key} className="flex items-start gap-2 text-[12px]">
            <span className="text-slate-500 w-[68px] shrink-0">{r.label}</span>
            <span className="flex-1 text-slate-800">{r.value}</span>
            {r.field && (
              <button
                type="button"
                onClick={() => handlers.onBeginEdit(r.field!)}
                className="text-[11px] font-semibold text-[#7C3AED] hover:underline focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40 rounded px-1"
                aria-label={`Change ${r.label.toLowerCase()}`}
              >
                Change
              </button>
            )}
          </li>
        ))}
        {build.steps.length > 0 && (build.step === "q6" || build.step === "q5") && (() => {
          const ownTpls = build.steps.filter((s) => isDocStep(s) && templateOf(s).mode === "own");
          return (
            <li className="flex items-start gap-2 text-[12px] pt-1 border-t border-slate-200/70 mt-1">
              <span className="text-slate-500 w-[68px] shrink-0">Steps</span>
              <span className="flex-1 text-slate-800">
                {build.steps.length} · {build.steps.map((s) => s.phrase).join(" · ")}
                {ownTpls.length > 0 && (
                  <span className="block mt-0.5 text-[11px] text-[#5B21B6]">
                    {ownTpls.length === 1 ? "1 step using your template" : `${ownTpls.length} steps using your templates`}
                    {": "}
                    {ownTpls.map((s) => s.template?.filename).filter(Boolean).join(", ")}
                  </span>
                )}
              </span>
              {build.step === "q6" && (
                <button
                  type="button"
                  onClick={handlers.onKeepEditing}
                  className="text-[11px] font-semibold text-[#7C3AED] hover:underline focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40 rounded px-1"
                >
                  Change
                </button>
              )}
            </li>
          );
        })()}
      </ul>
    </div>
  );
}

function MagBackBar({ onBack, editing, onCancelEdit }: { onBack: () => void; editing?: boolean; onCancelEdit?: () => void }) {
  return (
    <div className="flex items-center justify-between -mt-0.5">
      <button
        type="button"
        onClick={onBack}
        className="text-[11.5px] text-slate-500 hover:text-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40 rounded px-1"
        aria-label="Back to previous question"
      >
        ← Back
      </button>
      {editing && onCancelEdit && (
        <button
          type="button"
          onClick={onCancelEdit}
          className="text-[11.5px] text-slate-500 hover:text-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40 rounded px-1"
        >
          Cancel change
        </button>
      )}
    </div>
  );
}

/* ---------- ScopePicker — reusable scope chooser (level + searchable multi-select) ---------- */

function ScopePicker({ initial, onCommit }: { initial?: ScopeSelection; onCommit: (sel: ScopeSelection) => void }) {
  const [sel, setSel] = useState<ScopeSelection>(initial ?? EMPTY_SCOPE);
  const [query, setQuery] = useState("");
  const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const setLevel = (level: ScopeLevel) => {
    setQuery("");
    setSel((s) => ({ ...s, level }));
  };

  const togglePropertyId = (id: string) =>
    setSel((s) => ({ ...s, propertyIds: s.propertyIds.includes(id) ? s.propertyIds.filter((x) => x !== id) : [...s.propertyIds, id] }));
  const toggleUnitId = (id: string) =>
    setSel((s) => ({ ...s, unitIds: s.unitIds.includes(id) ? s.unitIds.filter((x) => x !== id) : [...s.unitIds, id] }));

  const q = query.trim().toLowerCase();
  const matchProp = (p: Property) => !q || p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q) || p.postcode.toLowerCase().includes(q);
  const matchUnit = (p: Property, u: Unit) => !q || u.label.toLowerCase().includes(q) || p.name.toLowerCase().includes(q);

  const filteredProperties = PROPERTIES.filter(matchProp);
  const filteredGroups = PROPERTIES
    .map((p) => ({ p, units: p.units.filter((u) => matchUnit(p, u)) }))
    .filter((g) => g.units.length > 0);

  const selectedCount =
    sel.level === "portfolio" ? PROPERTIES.length :
    sel.level === "properties" ? sel.propertyIds.length :
    sel.unitIds.length;

  const totalUnitsForProperties = sel.propertyIds.reduce((n, pid) => {
    const p = PROPERTIES.find((x) => x.id === pid); return n + (p ? p.units.length : 0);
  }, 0);

  const countLine =
    sel.level === "portfolio" ? `Whole portfolio · ${PROPERTIES.length} properties · ${PROPERTIES.reduce((n, p) => n + p.units.length, 0)} units`
    : sel.level === "properties" ? `${sel.propertyIds.length} propert${sel.propertyIds.length === 1 ? "y" : "ies"} · ${totalUnitsForProperties} units`
    : `${new Set(PROPERTIES.filter((p) => p.units.some((u) => sel.unitIds.includes(u.id))).map((p) => p.id)).size} properties · ${sel.unitIds.length} units`;

  const canCommit =
    sel.level === "portfolio" ||
    (sel.level === "properties" && sel.propertyIds.length > 0) ||
    (sel.level === "units" && sel.unitIds.length > 0);

  const selectAllInProperty = (p: Property) => {
    const allIds = p.units.map((u) => u.id);
    const everySelected = allIds.every((id) => sel.unitIds.includes(id));
    setSel((s) => ({
      ...s,
      unitIds: everySelected
        ? s.unitIds.filter((id) => !allIds.includes(id))
        : Array.from(new Set([...s.unitIds, ...allIds])),
    }));
  };

  const selectAllProperties = () => {
    const allIds = filteredProperties.map((p) => p.id);
    const every = allIds.every((id) => sel.propertyIds.includes(id));
    setSel((s) => ({
      ...s,
      propertyIds: every ? s.propertyIds.filter((id) => !allIds.includes(id)) : Array.from(new Set([...s.propertyIds, ...allIds])),
    }));
  };

  const levelBtn = (key: ScopeLevel, label: string) => {
    const active = sel.level === key;
    return (
      <button
        type="button"
        onClick={() => setLevel(key)}
        aria-pressed={active}
        className={cn(
          "px-3 py-1.5 rounded-full border text-[12.5px] font-medium focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40",
          reduced ? "" : "transition-colors",
          active
            ? "bg-[#7C3AED] text-white border-[#7C3AED]"
            : "bg-white text-slate-700 border-slate-300 hover:border-[#7C3AED]/60 hover:text-[#5B21B6]",
        )}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="space-y-3">
      <div>
        <div className="text-[11px] uppercase tracking-wide text-[#7C3AED] font-semibold mb-2">Where should this apply?</div>
        <div className="text-[12px] text-slate-600 mb-2">Choose as many as you like.</div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Scope level">
          {levelBtn("portfolio", "The whole portfolio")}
          {levelBtn("properties", "Properties")}
          {levelBtn("units", "Units")}
        </div>
      </div>

      {sel.level !== "portfolio" && (
        <div className="rounded-md border border-slate-200 bg-white p-2 space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={sel.level === "properties" ? "Search properties…" : "Search units or properties…"}
              aria-label="Search"
              className="flex-1 h-8 rounded-md border border-slate-200 px-2 text-[12.5px] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40"
            />
            <button
              type="button"
              onClick={sel.level === "properties" ? selectAllProperties : () => {
                const allIds = filteredGroups.flatMap((g) => g.units.map((u) => u.id));
                const every = allIds.every((id) => sel.unitIds.includes(id));
                setSel((s) => ({
                  ...s,
                  unitIds: every ? s.unitIds.filter((id) => !allIds.includes(id)) : Array.from(new Set([...s.unitIds, ...allIds])),
                }));
              }}
              className="text-[11.5px] font-semibold text-[#7C3AED] hover:underline focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40 rounded px-1"
            >
              Select all{query ? " (matching)" : ""}
            </button>
          </div>

          <div className="max-h-[220px] overflow-y-auto rounded border border-slate-100 divide-y divide-slate-100" role="listbox" aria-multiselectable="true">
            {sel.level === "properties" && filteredProperties.map((p) => {
              const checked = sel.propertyIds.includes(p.id);
              return (
                <label key={p.id} className="flex items-center gap-2 px-2 py-1.5 text-[12.5px] hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => togglePropertyId(p.id)}
                    className="h-4 w-4 accent-[#7C3AED]"
                  />
                  <span className="flex-1 text-slate-800">{p.name}</span>
                  <span className="text-slate-400 text-[11px]">{p.units.length} units</span>
                </label>
              );
            })}
            {sel.level === "properties" && filteredProperties.length === 0 && (
              <div className="px-2 py-3 text-[12px] text-slate-500 italic">No properties match "{query}".</div>
            )}

            {sel.level === "units" && filteredGroups.map((g) => {
              const allIds = g.units.map((u) => u.id);
              const everySelected = allIds.every((id) => sel.unitIds.includes(id));
              return (
                <div key={g.p.id}>
                  <div className="flex items-center gap-2 px-2 py-1 bg-slate-50">
                    <span className="text-[11.5px] font-semibold text-slate-700 flex-1">{g.p.name}</span>
                    <button
                      type="button"
                      onClick={() => selectAllInProperty(g.p)}
                      className="text-[11px] text-[#7C3AED] hover:underline focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40 rounded px-1"
                    >
                      {everySelected ? "Clear" : `Select all in ${g.p.name}`}
                    </button>
                  </div>
                  {g.units.map((u) => {
                    const checked = sel.unitIds.includes(u.id);
                    return (
                      <label key={u.id} className="flex items-center gap-2 px-3 py-1.5 text-[12.5px] hover:bg-slate-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleUnitId(u.id)}
                          className="h-4 w-4 accent-[#7C3AED]"
                        />
                        <span className="flex-1 text-slate-800">{u.label}</span>
                        <span className="text-slate-400 text-[11px]">{u.status}</span>
                      </label>
                    );
                  })}
                </div>
              );
            })}
            {sel.level === "units" && filteredGroups.length === 0 && (
              <div className="px-2 py-3 text-[12px] text-slate-500 italic">No units match "{query}".</div>
            )}
          </div>

          {sel.level === "properties" && (
            <div className="rounded border border-slate-200 bg-slate-50/70 p-2">
              <div className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold mb-1.5">Apply to</div>
              <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Property granularity">
                {(["units", "record", "both"] as PropertyGranularity[]).map((g) => {
                  const active = sel.propertyGranularity === g;
                  const label = g === "units" ? "The property's units" : g === "record" ? "The property record" : "Both";
                  return (
                    <button
                      key={g}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setSel((s) => ({ ...s, propertyGranularity: g }))}
                      className={cn(
                        "px-2.5 py-1 rounded-full border text-[11.5px] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40",
                        active ? "bg-[#7C3AED] text-white border-[#7C3AED]" : "bg-white text-slate-700 border-slate-300 hover:border-[#7C3AED]/60",
                      )}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">"The property's units" suits most workflows. Switch if this watches the building itself.</p>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="text-[11.5px] text-slate-600" aria-live="polite">{countLine}</div>
        <button
          type="button"
          disabled={!canCommit}
          onClick={() => onCommit(sel)}
          className={cn(
            "px-3 py-1.5 rounded-full text-[12.5px] font-semibold focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40",
            canCommit ? "bg-[#7C3AED] text-white hover:bg-[#6D28D9]" : "bg-slate-200 text-slate-500 cursor-not-allowed",
          )}
        >
          Use this scope
        </button>
      </div>
    </div>
  );
}

function MagicianBuildPanel({ build, handlers }: { build: MagBuildState; handlers: MagHandlers }) {
  const usedStepIds = new Set(build.steps.map((s) => s.id));
  const isEditing = !!build.editing;
  const canBack = build.step !== "intake" && !isEditing;
  const [confirmCancel, setConfirmCancel] = useState(false);
  return (
    <div className="ml-12 max-w-[480px] rounded-xl border border-[#7C3AED]/30 bg-white p-3 shadow-sm space-y-3">

      {isEditing && build.editing?.field !== "intake" && (
        <div className="flex items-center justify-between rounded-md bg-[#F5F3FF] border border-[#7C3AED]/30 px-2.5 py-1.5">
          <span className="text-[11.5px] text-[#5B21B6] font-medium">Changing your earlier answer</span>
          <button type="button" onClick={handlers.onCancelEdit} className="text-[11.5px] text-[#7C3AED] hover:underline focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40 rounded px-1">Cancel</button>
        </div>
      )}

      <MagicianSoFar build={build} handlers={handlers} />

      {canBack && <MagBackBar onBack={handlers.onGoBack} />}

      {build.step === "intake" && (
        <MagicianIntake
          onSubmit={handlers.onIntakeSubmit}
          initial={build.title ? { title: build.title, purpose: build.purpose, description: build.description, whenKey: build.whenKey, whenLabel: build.whenLabel, visibility: build.visibility } : undefined}
          onCancel={isEditing ? handlers.onCancelEdit : undefined}
        />
      )}
      {build.step === "q1" && (
        <div>
          <div className="text-[11px] uppercase tracking-wide text-[#7C3AED] font-semibold mb-2">{isEditing ? "Change what I watch" : "Choose one"}</div>
          <div className="flex flex-wrap gap-2">
            <MagOptionButton onClick={() => handlers.onQ1("rent_reviews", "Rent reviews")}>Rent reviews</MagOptionButton>
            <MagOptionButton onClick={() => handlers.onQ1("compliance", "Compliance certificates")}>Compliance certificates</MagOptionButton>
            <MagOptionButton onClick={() => handlers.onQ1("notices", "Notice deadlines")}>Notice deadlines</MagOptionButton>
            <MagOptionButton onClick={() => handlers.onQ1("other", "Other")}>Other</MagOptionButton>
          </div>
        </div>
      )}
      {build.step === "q2" && (
        <div>
          <div className="text-[11px] uppercase tracking-wide text-[#7C3AED] font-semibold mb-2">How far ahead?</div>
          <div className="flex flex-wrap gap-2">
            <MagOptionButton onClick={() => handlers.onQ2("6m", "6 months ahead", "6 months away")}>6 months ahead</MagOptionButton>
            <MagOptionButton onClick={() => handlers.onQ2("3m", "3 months ahead", "3 months away")}>3 months ahead</MagOptionButton>
            <MagOptionButton onClick={() => handlers.onQ2("on", "On the date", "on the review date")}>On the date</MagOptionButton>
          </div>
        </div>
      )}
      {build.step === "q3" && (
        <ScopePicker
          initial={build.scopeSelection}
          onCommit={handlers.onQ3Scope}
        />
      )}

      {build.step === "q4" && (
        <div>
          <div className="text-[11px] uppercase tracking-wide text-[#7C3AED] font-semibold mb-2">Who should own it?</div>
          <div className="flex flex-wrap gap-2">
            <MagOptionButton onClick={() => handlers.onQ4({ kind: "all_teams" }, "All teams")}>All teams</MagOptionButton>
            <MagOptionButton onClick={() => handlers.onQ4({ kind: "person", name: "Sarah Chen", role: "Asset Manager", initials: "SC" }, "Sarah Chen · Asset Manager")}>Sarah Chen · Asset Manager</MagOptionButton>
            <MagOptionButton onClick={() => handlers.onQ4({ kind: "person", name: "James Okoro", role: "Lease Manager", initials: "JO" }, "James Okoro · Lease Manager")}>James Okoro · Lease Manager</MagOptionButton>
          </div>
        </div>
      )}
      {build.step === "q5" && (
        <div>
          <div className="text-[11px] uppercase tracking-wide text-[#7C3AED] font-semibold mb-2">Steps · {build.steps.length}</div>
          <ol className="space-y-1.5 mb-2">
            {build.steps.map((s, i) => (
              <MagicianStepRow key={s.uid} s={s} i={i} total={build.steps.length} handlers={handlers} />
            ))}
            {build.steps.length === 0 && (
              <li className="text-[12px] text-slate-500 italic px-2 py-1.5">No steps yet — add one below.</li>
            )}
          </ol>
          {!build.addOpen ? (
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => handlers.onToggleAdd(true)} className="px-3 py-1.5 rounded-full border border-dashed border-[#7C3AED]/50 text-[12.5px] font-medium text-[#7C3AED] hover:bg-[#F5F3FF] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40">+ Add a step</button>
              <button type="button" onClick={handlers.onFinishSteps} className="px-3 py-1.5 rounded-full bg-[#7C3AED] text-white text-[12.5px] font-semibold hover:bg-[#6D28D9] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40">Looks good — continue</button>
            </div>
          ) : (
            <div className="rounded-md border border-[#7C3AED]/30 bg-[#F5F3FF] p-2 space-y-2">
              <div className="text-[11px] uppercase tracking-wide text-[#7C3AED] font-semibold">Add a step</div>
              <div className="flex flex-wrap gap-1.5">
                {MAG_ADD_OPTIONS.map((o) => (
                  <button key={o.id} type="button" onClick={() => handlers.onAddStep(o)} className="px-2.5 py-1 rounded-full border border-[#7C3AED]/40 bg-white text-[12px] text-[#1F2330] hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40">
                    + {o.label}{usedStepIds.has(o.id) ? " (again)" : ""}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  value={build.customDraft || ""}
                  onChange={(e) => handlers.onSetCustomDraft(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handlers.onAddCustomStep(build.customDraft || ""); } }}
                  placeholder="Add custom step…"
                  className="flex-1 text-[12px] border border-slate-200 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40"
                />
                <button type="button" onClick={() => handlers.onAddCustomStep(build.customDraft || "")} className="px-2.5 py-1.5 rounded-md bg-[#7C3AED] text-white text-[12px] font-semibold hover:bg-[#6D28D9] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40">Add</button>
                <button type="button" onClick={() => handlers.onToggleAdd(false)} className="px-2 py-1.5 rounded-md text-[12px] text-slate-500 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40">Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}
      {build.step === "q6" && (
        <div>
          <div className="text-[11px] uppercase tracking-wide text-[#7C3AED] font-semibold mb-2">Ready when you are</div>
          <div className="text-[12px] text-slate-600 mb-2">Tap any line in “So far” above to change it before we build.</div>
          <div className="flex flex-wrap gap-2">
            <MagOptionButton onClick={handlers.onBuild}>Build it</MagOptionButton>
            <MagOptionButton onClick={handlers.onKeepEditing}>Keep editing steps</MagOptionButton>
          </div>
        </div>
      )}

      {/* Persistent build controls — breathing space above bottom buttons */}
      <div className="pt-6 mt-2 border-t border-slate-100">
        {confirmCancel ? (
          <div
            role="alertdialog"
            aria-label="Discard this workflow"
            className="rounded-md border border-rose-200 bg-rose-50/60 px-3 py-2.5"
          >
            <div className="text-[12.5px] text-slate-800 font-medium">Discard this workflow? This can't be undone.</div>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => { setConfirmCancel(false); handlers.onCancelBuild(); }}
                className="px-3 py-1.5 rounded-md bg-rose-600 text-white text-[12.5px] font-semibold hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-300"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={() => setConfirmCancel(false)}
                className="px-3 py-1.5 rounded-md border border-slate-200 bg-white text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40"
              >
                Keep building
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-[11px] text-slate-500">Nothing here is final until you press <span className="font-medium text-slate-700">Build it</span>.</div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handlers.onPauseSave}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#7C3AED]/40 bg-white text-[12.5px] font-semibold text-[#5B21B6] hover:bg-[#F5F3FF] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg>
                Pause &amp; save
              </button>
              <button
                type="button"
                onClick={() => setConfirmCancel(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 bg-white text-[12.5px] font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-300"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>
                Cancel &amp; delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* Vertical breathing room below the active build panel so the last line isn't
   flush against the chat composer. */
function MagicianBuildSpacer() {
  return <div aria-hidden style={{ height: 96 }} />;
}






function ProfTypeAssigner({ onAssign }: { onAssign: (type: string) => void }) {
  const [val, setVal] = useState("");
  return (
    <div className="flex items-center gap-2">
      <select
        value={val}
        onChange={(e) => setVal(e.target.value)}
        className="flex-1 text-[12px] border border-slate-200 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40"
        aria-label="Document type"
      >
        <option value="">Choose a type…</option>
        {PROF_DOC_TYPES.map((t) => (
          <option key={t.label} value={t.label}>{t.label}</option>
        ))}
      </select>
      <button
        type="button"
        disabled={!val}
        onClick={() => onAssign(val)}
        className="text-[12px] font-semibold px-3 py-1.5 rounded-md bg-[#7C3AED] text-white hover:bg-[#6D28D9] disabled:bg-slate-200 disabled:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40"
      >
        Assign
      </button>
    </div>
  );
}


function AdminWorkArea({ character }: { character: { id: AdminCharacter; name: string; src: string; tagline: string; workTitle: string; workIntro: string } }) {
  return (
    <div className="absolute inset-0 bg-white z-[450] flex flex-col">
      <header className="h-14 px-5 flex items-center border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-[#F5F3FF] ring-1 ring-slate-200 grid place-items-center">
            <img src={character.src} alt="" aria-hidden className="w-[120%] h-[120%] object-contain" />
          </div>
          <div>
            <div className="text-[13px] font-semibold text-slate-900">{character.workTitle}</div>
            <div className="text-[11px] text-slate-500">{character.tagline}</div>
          </div>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <div className="text-[13px] font-semibold text-slate-700 mb-1">{character.name}'s work area</div>
            <div className="text-[12px] text-slate-500">Coming soon in the live product. For now, this is where {character.name} would set up their work alongside you.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Character notes strip (shared pattern: recent / totals / issues) ---------- */
type CharacterNote = {
  id: string;
  kind: "recent" | "totals" | "issue" | "coverage";
  text: string;
  onClick?: () => void;
  ctaLabel?: string;
};

function CharacterNotesStrip({
  character,
  title,
  subtitle,
  tagline,
  badge,
  notes,
}: {
  character: { name: string; src: string };
  title: string;
  subtitle: string;
  /** Shown on the collapsed single-line strip (e.g. "observations from the catalogue"). Falls back to subtitle. */
  tagline?: string;
  /** Quiet attention badge on the collapsed strip — only set when there's genuine signal (e.g. "1 paused"). */
  badge?: string | null;
  notes: CharacterNote[];
}) {
  const [open, setOpen] = useState(false);
  const panelId = `notes-${title.replace(/\W+/g, "-").toLowerCase()}`;
  if (notes.length === 0) return null;


  return (
    <section
      className="border-b border-slate-100 bg-[#FAF8FF] shrink-0"
      aria-label={`${character.name}'s notes`}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-5 py-2 text-left hover:bg-[#F5F3FF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
      >
        <div className="w-6 h-6 rounded-full overflow-hidden bg-white ring-1 ring-[#7C3AED]/20 grid place-items-center shrink-0">
          <img src={character.src} alt="" aria-hidden className="w-[120%] h-[120%] object-contain" />
        </div>
        <h3 className="text-[12px] font-semibold uppercase tracking-wide text-[#5B21B6] shrink-0">{title}</h3>
        <span className="text-[11px] text-slate-500 truncate min-w-0">· {tagline ?? subtitle}</span>
        {badge && (
          <span className="ml-1 shrink-0 inline-flex items-center px-1.5 py-0.5 rounded-full bg-[#7C3AED]/10 text-[#5B21B6] text-[10px] font-semibold tracking-wide uppercase">
            {badge}
          </span>
        )}
        <span className="ml-auto shrink-0 text-[#5B21B6]" aria-hidden>
          <svg
            className={`w-4 h-4 transition-transform ${open ? "rotate-90" : ""}`}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
        </span>
      </button>
      {open && (
        <div id={panelId} className="px-5 pb-3">
          <ul className="grid gap-1.5 sm:grid-cols-2">
            {notes.map((n) => {
              const clickable = !!n.onClick;
              const Tag: any = clickable ? "button" : "div";
              return (
                <li key={n.id}>
                  <Tag
                    {...(clickable ? { onClick: n.onClick, type: "button" } : {})}
                    className={`w-full text-left flex items-start gap-2 px-3 py-2 rounded-md border border-[#7C3AED]/15 bg-white ${
                      clickable ? "hover:bg-[#F5F3FF] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]" : ""
                    }`}
                  >
                    <CharNoteIcon kind={n.kind} />
                    <div className="min-w-0">
                      <p className="text-[12px] text-slate-800 leading-snug">{n.text}</p>
                      {clickable && (
                        <span className="mt-0.5 inline-block text-[11px] text-[#7C3AED]">
                          {n.ctaLabel ?? "open →"}
                        </span>
                      )}
                    </div>
                  </Tag>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}


function CharNoteIcon({ kind }: { kind: CharacterNote["kind"] }) {
  const common = "w-4 h-4 shrink-0 mt-0.5";
  if (kind === "recent") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="#5B21B6" strokeWidth="2" aria-label="Recent activity">
        <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
      </svg>
    );
  }
  if (kind === "totals") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="#5B21B6" strokeWidth="2" aria-label="Totals">
        <rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v12h14V8"/><path d="M9 12h6M9 16h4"/>
      </svg>
    );
  }
  if (kind === "issue") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2" aria-label="Issue">
        <circle cx="12" cy="12" r="9"/><path d="M12 8v4"/><circle cx="12" cy="16" r="0.8" fill="#B45309"/>
      </svg>
    );
  }
  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" stroke="#0369A1" strokeWidth="2" aria-label="Coverage">
      <path d="M5 12l4 4 10-10"/>
    </svg>
  );
}

function ProfessorWorkArea({ character, docs }: { character: { id: AdminCharacter; name: string; src: string; tagline: string; workTitle: string }; docs: ProfDoc[] }) {
  const [search, setSearch] = useState("");
  const filtered = docs.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="absolute inset-0 bg-white z-[450] flex flex-col">
      <header className="h-14 px-5 flex items-center border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-[#F5F3FF] ring-1 ring-slate-200 grid place-items-center">
            <img src={character.src} alt="" aria-hidden className="w-[120%] h-[120%] object-contain" />
          </div>
          <div>
            <div className="text-[13px] font-semibold text-slate-900">{character.workTitle}</div>
            <div className="text-[11px] text-slate-500">{docs.length} document{docs.length === 1 ? "" : "s"} · uploaded, classified and read</div>
          </div>
        </div>
      </header>

      {(() => {
        const total = docs.length;
        const pending = docs.filter((d) => d.status === "pending").length;
        const extracted = docs.filter((d) => d.status === "extracted").length;
        const chains = new Set(docs.filter((d) => d.chainedTo).map((d) => d.chainedTo)).size;
        const recent = [...docs].sort((a, b) => (b.uploadedAt || "").localeCompare(a.uploadedAt || "")).slice(0, 3);
        const mostRecent = recent[0];
        const notes: CharacterNote[] = [];
        if (mostRecent) {
          notes.push({
            id: "pn-recent",
            kind: "recent",
            text: `I have read ${recent.length} new document${recent.length === 1 ? "" : "s"} this week — most recently the ${mostRecent.type ?? "document"} for ${mostRecent.relatedUnit ?? "the portfolio"}, catalogued ${mostRecent.uploadedAt}.`,
          });
        }
        notes.push({
          id: "pn-totals",
          kind: "totals",
          text: `${extracted} of ${total} documents read and indexed · ${chains} chained record${chains === 1 ? "" : "s"} · every item retained, nothing discarded.`,
        });
        if (pending > 0) {
          notes.push({
            id: "pn-issue",
            kind: "issue",
            text: `${pending} document${pending === 1 ? " awaits" : "s await"} classification — please confirm ${pending === 1 ? "its" : "their"} type so I can index ${pending === 1 ? "it" : "them"} in full.`,
          });
        } else {
          notes.push({
            id: "pn-classify",
            kind: "coverage",
            text: "No documents await classification — every item has a confirmed type.",
          });
        }
        return (
          <CharacterNotesStrip
            character={character}
            title="The Professor's notes"
            subtitle="recent reading & catalogue state"
            tagline="observations from the catalogue"
            notes={notes}
          />

        );
      })()}



      {/* Filters */}
      <div className="px-5 py-3 border-b border-slate-100 flex flex-wrap items-center gap-2 shrink-0">
        <div className="relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by document name"
            className="text-[12px] pl-7 pr-3 py-1.5 rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40 w-64"
            aria-label="Search by document name"
          />
          <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-2 top-1/2 -translate-y-1/2">
            <circle cx="11" cy="11" r="7"/><path d="M21 21l-3.5-3.5"/>
          </svg>
        </div>
        {["+ Document type", "+ Unit / Unit Group", "+ Status", "+ Effective date"].map((label) => (
          <button
            key={label}
            type="button"
            className="text-[11px] font-medium px-2.5 py-1.5 rounded-md border border-dashed border-slate-300 bg-white text-slate-600 hover:border-[#7C3AED]/50 hover:text-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-[12px] border-collapse">
          <thead className="bg-slate-50 text-slate-600 sticky top-0 z-10">
            <tr className="text-left">
              {["Document name", "Type", "Family", "Time class", "Related unit / group", "Supersedes", "Chained to", "Status", "Effective date", "Uploaded", "Extracted", ""].map((h) => (
                <th key={h} scope="col" className="px-3 py-2 font-semibold border-b border-slate-200 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((d) => (
              <tr key={d.id} className="border-b border-slate-100 hover:bg-slate-50 focus-within:bg-slate-50">
                <td className="px-3 py-2.5 font-medium text-slate-900 max-w-[260px] truncate" title={d.name}>{d.name}</td>
                <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap">{d.type ?? <span className="text-slate-400">—</span>}</td>
                <td className="px-3 py-2.5">
                  {d.family ? <FamilyChip family={d.family} /> : <span className="text-slate-400">—</span>}
                </td>
                <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap">{d.timeClass ?? <span className="text-slate-400">—</span>}</td>
                <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap">{d.relatedUnit ?? <span className="text-slate-400">—</span>}</td>
                <td className="px-3 py-2.5 text-slate-700 max-w-[180px] truncate" title={d.supersedes}>{d.supersedes ?? <span className="text-slate-400">—</span>}</td>
                <td className="px-3 py-2.5 text-slate-700 max-w-[180px] truncate" title={d.chainedTo}>{d.chainedTo ?? <span className="text-slate-400">—</span>}</td>
                <td className="px-3 py-2.5"><StatusChip status={d.status} /></td>
                <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap">{d.effectiveDate ?? <span className="text-slate-400">—</span>}</td>
                <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap">{d.uploadedAt}</td>
                <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap">{d.extractedAt ?? <span className="text-slate-400">—</span>}</td>
                <td className="px-3 py-2.5 whitespace-nowrap text-right">
                  <div className="inline-flex items-center gap-1">
                    {[
                      { label: "View extraction", icon: "👁" },
                      { label: "Re-extract", icon: "↻" },
                      { label: "Download", icon: "⤓" },
                      { label: "Edit", icon: "✎" },
                      { label: "Delete", icon: "🗑" },
                    ].map((a) => (
                      <button
                        key={a.label}
                        type="button"
                        title={a.label}
                        aria-label={`${a.label} — ${d.name}`}
                        className="h-7 w-7 grid place-items-center rounded text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40"
                      >
                        <span aria-hidden className="text-[12px]">{a.icon}</span>
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={12} className="px-3 py-8 text-center text-slate-500">No documents match.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}




function FamilyChip({ family }: { family: DocFamily }) {
  const map: Record<DocFamily, { label: string; cls: string }> = {
    rto: { label: "RTO", cls: "border-[#7C3AED]/40 text-[#5B21B6] bg-[#F5F3FF]" },
    amd: { label: "AMD", cls: "border-amber-300 text-amber-800 bg-amber-50" },
    acd: { label: "ACD", cls: "border-sky-300 text-sky-800 bg-sky-50" },
  };
  const m = map[family];
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded border text-[10px] font-semibold uppercase tracking-wide ${m.cls}`}>{m.label}</span>
  );
}

function StatusChip({ status }: { status: DocStatus }) {
  if (status === "extracted") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-emerald-300 bg-emerald-50 text-emerald-800 text-[11px] font-semibold">
        <span aria-hidden>●</span> Extracted
      </span>
    );
  }
  if (status === "extracting") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-[#7C3AED]/40 bg-[#F5F3FF] text-[#5B21B6] text-[11px] font-semibold">
        <span aria-hidden className="animate-pulse">◐</span> Extracting…
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-dashed border-slate-300 bg-white text-slate-600 text-[11px] font-semibold">
      <span aria-hidden>○</span> Pending extraction
    </span>
  );
}

function CharacterSpeechBubble({ name, src, text }: { name: string; src: string; text: string }) {
  const [phase, setPhase] = useState<"typing" | "streaming" | "done">("typing");
  const [shown, setShown] = useState("");
  const reducedMotion = typeof window !== "undefined"
    && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    setPhase("typing");
    setShown("");
    if (reducedMotion) {
      const t = setTimeout(() => { setShown(text); setPhase("done"); }, 200);
      return () => clearTimeout(t);
    }
    let cancelled = false;
    const typingTimer = setTimeout(() => {
      if (cancelled) return;
      setPhase("streaming");
      const words = text.split(" ");
      let i = 0;
      const step = () => {
        if (cancelled) return;
        i += 1;
        setShown(words.slice(0, i).join(" "));
        if (i < words.length) setTimeout(step, 45 + Math.random() * 35);
        else setPhase("done");
      };
      setTimeout(step, 60);
    }, 600);
    return () => { cancelled = true; clearTimeout(typingTimer); };
  }, [text, reducedMotion]);

  if (phase === "typing") {
    return (
      <div className="flex items-end gap-2" aria-live="polite" aria-label={`${name} is typing`}>
        <CharacterAvatar src={src} />
        <div className="bg-[#EDE9FE] px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1">
          <Dot delay={0} /><Dot delay={150} /><Dot delay={300} />
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-2" aria-live="polite">
      <CharacterAvatar src={src} />
      <div className="max-w-[560px] bg-white border border-slate-200 text-[#1F2330] text-sm leading-relaxed px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
        <div className="text-[12px] font-semibold text-slate-900 mb-1">{name}</div>
        {shown}
        {phase === "streaming" && (
          <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-[#7C3AED] align-middle animate-pulse" />
        )}
      </div>
    </div>
  );
}




function HobsonBubble({ text, owl, streaming, rich, onAskFollowUp, showAvatar = true }: { text: string; owl: OwlState; streaming?: boolean; rich?: "rentFlat2"; onAskFollowUp?: (q: string) => void; showAvatar?: boolean }) {
  const AvatarSlot = showAvatar
    ? <OwlAvatar state={owl} />
    : <div aria-hidden className="w-10 h-10 shrink-0" />;
  

  if (rich === "rentFlat2") {
    return (
      <div className="flex items-start gap-2">
        {AvatarSlot}
        <div className="max-w-[560px] w-full bg-white border border-slate-200 text-[#1F2330] text-sm leading-relaxed px-4 py-4 rounded-2xl rounded-bl-md shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-[12px]">
              <span className="font-semibold text-slate-900">Hobson</span>
              <span className="ml-2 italic text-slate-500">Thought for 4 seconds</span>
            </div>
            <button
              type="button"
              onClick={() => downloadRentCsv()}
              className="text-[12px] text-[#7C3AED] hover:underline inline-flex items-center gap-1"
            >
              ↓ Download as CSV
            </button>
          </div>
          {!streaming && <RentFlat2Answer onAskFollowUp={onAskFollowUp} bodyText={text} />}
          {streaming && (
            <div className="text-sm text-slate-700">
              {text}
              <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-[#7C3AED] align-middle animate-pulse" />
            </div>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-end gap-2">
      {AvatarSlot}
      <div className="max-w-[340px] bg-[#EDE9FE] text-[#1F2330] text-sm leading-relaxed px-4 py-2.5 rounded-2xl rounded-bl-md">
        {text}
        {streaming && <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-[#7C3AED] align-middle animate-pulse" />}
      </div>
    </div>
  );
}





function FeedbackBubble({
  owl,
  text,
  streaming,
  feedback,
  chips,
  showAvatar = true,
  onGrade,
  onToggleChip,
  onSubmitNote,
  onSkipNote,
}: {
  owl: OwlState;
  text: string;
  streaming?: boolean;
  feedback: FeedbackState;
  chips?: string[];
  showAvatar?: boolean;
  onGrade: (g: FeedbackGrade) => void;
  onToggleChip: (chip: string) => void;
  onSubmitNote: (note: string) => void;
  onSkipNote: () => void;
}) {
  const [note, setNote] = useState("");
  void showAvatar; // every Hobson turn in this exchange now renders its own owl avatar

  const graded = !!feedback.grade;
  const submitted = !!feedback.submitted;
  const ack =
    feedback.grade === "helpful" ? "I'm glad to hear it. Thank you."
    : feedback.grade === "partly" ? "Thank you. I shall see where it can be clearer."
    : feedback.grade === "not" ? "Thank you for telling me — I would rather know. What was missing?"
    : "";
  // When the per-grade reply already invites the detail (Not helpful → "What was missing?"),
  // suppress the separate note-prompt bubble so Hobson never repeats the same invitation.
  const replyAlreadyAsks = feedback.grade === "not";
  const noteAskText = feedback.grade === "not" ? "" : "Anything I might have done better?";
  const noteGiven = !!(feedback.note && feedback.note.trim().length > 0) || ((feedback.chips || []).length > 0);
  const noteAck = noteGiven ? "Thank you. Most helpful." : "Of course.";

  // Reduced motion check + staged reveal of follow-up bubbles.
  const reduceMotion = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const [showAck, setShowAck] = useState(false);
  const [showNoteAsk, setShowNoteAsk] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showNoteAck, setShowNoteAck] = useState(false);

  useEffect(() => {
    if (!graded) { setShowAck(false); setShowNoteAsk(false); return; }
    if (reduceMotion) { setShowAck(true); setShowNoteAsk(true); return; }
    const t1 = setTimeout(() => setShowAck(true), 250);
    const t2 = setTimeout(() => setShowNoteAsk(true), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [graded, reduceMotion]);

  useEffect(() => {
    if (!submitted) { setShowConfirm(false); setShowNoteAck(false); return; }
    if (reduceMotion) { setShowNoteAck(true); setShowConfirm(true); return; }
    const t1 = setTimeout(() => setShowNoteAck(true), 250);
    const t2 = setTimeout(() => setShowConfirm(true), noteGiven ? 1500 : 600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [submitted, reduceMotion, noteGiven]);

  // Tiny typewriter for Hobson's acknowledgement bubbles — matches the streaming feel of his other speech.
  function TypedText({ text, enabled }: { text: string; enabled: boolean }) {
    const [shown, setShown] = useState(enabled || reduceMotion ? 0 : 0);
    useEffect(() => {
      if (reduceMotion) { setShown(text.length); return; }
      setShown(0);
      let i = 0;
      const id = setInterval(() => {
        i += 2;
        if (i >= text.length) { setShown(text.length); clearInterval(id); }
        else setShown(i);
      }, 22);
      return () => clearInterval(id);
    }, [text]);
    const done = shown >= text.length;
    return (
      <>
        {text.slice(0, shown)}
        {!done && <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-[#7C3AED] align-middle animate-pulse" />}
      </>
    );
  }

  const GRADES: { id: FeedbackGrade; label: string; glyph: string; aria: string }[] = [
    { id: "helpful", label: "Helpful", glyph: "✓", aria: "Mark answer helpful" },
    { id: "partly", label: "Partly", glyph: "◐", aria: "Mark answer partly helpful" },
    { id: "not", label: "Not helpful", glyph: "✕", aria: "Mark answer not helpful" },
  ];

  const Bubble: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
    <div className={`max-w-[420px] bg-[#EDE9FE] text-[#1F2330] text-sm leading-relaxed px-4 py-2.5 rounded-2xl rounded-bl-md ${className}`}>
      {children}
    </div>
  );

  // Each Hobson "turn" in this exchange renders with its own owl avatar — never an avatar-less bubble.
  // items-start keeps the owl pinned to the top-left of the turn, beside the bubble (matching HobsonBubble layout).
  const Row: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
    <div className={`flex items-start gap-2 ${className}`}>
      <OwlAvatar state={owl} />
      <div className="flex flex-col gap-1.5 min-w-0">{children}</div>
    </div>
  );

  return (
    // Generous top margin separates the feedback ask from the preceding answer turn —
    // ~36px breathing room so it reads as a courteous, separate follow-up, not crowded.
    // Reduced-motion users get the same gap (no timed delay needed).
    <div className="flex flex-col gap-3 mt-9">
      {/* 1. Hobson asks — owl + lavender bubble, typed in */}
      <Row>
        <Bubble>
          {text}
          {streaming && <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-[#7C3AED] align-middle animate-pulse" />}
        </Bubble>
        {/* Inline reply: grade buttons sit immediately under his question */}
        {!streaming && (
          <div
            role="group"
            aria-label="Grade this answer"
            className="flex flex-wrap gap-1.5 pl-1 pt-0.5"
          >
            {GRADES.map((g) => {
              const selected = feedback.grade === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => !graded && onGrade(g.id)}
                  aria-pressed={selected}
                  aria-label={g.aria}
                  disabled={graded}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[12px] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-1 ${
                    selected
                      ? "bg-white border-[#7C3AED] text-[#4C1D95] font-medium shadow-sm"
                      : "bg-white border-slate-300 text-slate-700 hover:border-[#7C3AED] hover:text-[#4C1D95]"
                  } ${graded && !selected ? "opacity-50 cursor-default" : ""} ${graded ? "cursor-default" : ""}`}
                >
                  <span aria-hidden className="font-semibold leading-none">{g.glyph}</span>
                  <span>{g.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </Row>

      {/* 2. Hobson acknowledges — own owl + bubble, varied by grade */}
      {graded && showAck && (
        <Row className={reduceMotion ? "" : "animate-in fade-in slide-in-from-bottom-1 duration-300"}>
          <Bubble>
            <TypedText text={ack} enabled={showAck} />
          </Bubble>
        </Row>
      )}

      {/* 3. Note field. If the per-grade reply already invited the detail (Not helpful),
          show NO additional spoken prompt — just the field + chips, indented under the
          avatar column. Otherwise Hobson offers a single, distinct invitation. */}
      {graded && !submitted && showNoteAsk && (() => {
        const fieldBlock = (
          <div className="space-y-1.5">
            {chips && chips.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {chips.map((c) => {
                  const on = (feedback.chips || []).includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => onToggleChip(c)}
                      aria-pressed={on}
                      className={`text-[11px] px-2 py-0.5 rounded-full border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-1 ${
                        on
                          ? "bg-[#7C3AED] border-[#7C3AED] text-white"
                          : "bg-white border-slate-300 text-slate-700 hover:border-[#7C3AED]"
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            )}
            <div className="max-w-[420px]">
              <label htmlFor="fb-note" className="sr-only">Optional note to Hobson</label>
              <textarea
                id="fb-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="Optional — a line is fine"
                className="w-full text-[13px] rounded-xl border border-slate-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              />
              <div className="flex items-center gap-2 mt-1.5">
                <button
                  type="button"
                  onClick={() => onSubmitNote(note.trim())}
                  className="text-[12px] px-3 py-1 rounded-md bg-[#7C3AED] text-white hover:bg-[#6D28D9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-1"
                >
                  Send
                </button>
                <button
                  type="button"
                  onClick={() => onSkipNote()}
                  className="text-[12px] px-2 py-1 rounded-md text-slate-600 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-1"
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
        );
        if (replyAlreadyAsks) {
          return (
            <div className={`pl-12 ${reduceMotion ? "" : "animate-in fade-in slide-in-from-bottom-1 duration-300"}`}>
              {fieldBlock}
            </div>
          );
        }
        return (
          <Row className={reduceMotion ? "" : "animate-in fade-in slide-in-from-bottom-1 duration-300"}>
            <Bubble>
              <TypedText text={noteAskText} enabled={showNoteAsk} />
            </Bubble>
            <div className="pl-1 pt-0.5">{fieldBlock}</div>
          </Row>
        );
      })()}

      {/* 4. If they added a note/chips, Hobson acknowledges — own owl + bubble */}
      {submitted && showNoteAck && (
        <Row className={reduceMotion ? "" : "animate-in fade-in slide-in-from-bottom-1 duration-300"}>
          <Bubble>
            <TypedText text={noteAck} enabled={showNoteAck} />
          </Bubble>
        </Row>
      )}

      {/* 5. Quiet inline confirmation — subtle line, not a bubble */}
      {submitted && showConfirm && (
        <div
          role="status"
          aria-live="polite"
          className={`pl-12 text-[11px] text-slate-500 ${reduceMotion ? "" : "animate-in fade-in duration-300"}`}
        >
          Your feedback is recorded.
        </div>
      )}
    </div>
  );
}



const RENT_BODY_TEXT =
  "The current rent is set out in the tenancy paperwork and the later rent increase notice. The agreement also refers to annual reviews linked to RPI, with the notice saying the increase follows the agreed minimum adjustment.";

function downloadRentCsv() {
  const rows = [
    ["Current Rent", "Effective From", "Reliable"],
    ["£2,415 per month", "1 October 2025", "Yes"],
  ];
  const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "rent-flat-2-nugent-terrace.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function RentFlat2Answer({ onAskFollowUp, bodyText }: { onAskFollowUp?: (q: string) => void; bodyText: string }) {
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (s: string) => {
    setToast(s);
    window.setTimeout(() => setToast(null), 2200);
  };
  const related = [
    "Would you like the original rent amount as well?",
    "Do you want the source documents for this rent?",
    "Shall I check how the increase was calculated?",
  ];
  const sources = [
    "AST nt 2.pdf — referenced by the answer",
    "rent increase 2025-2026 NT2.pdf — referenced by the answer",
  ];
  const docs = [
    { name: "rent increase 2025-2026 NT2.pdf" },
    { name: "AST nt 2.pdf" },
  ];
  const copyAll = async () => {
    const text = `Current Rent: £2,415 per month\nEffective From: 1 October 2025\nReliable: Yes\n\n${bodyText}`;
    try { await navigator.clipboard.writeText(text); showToast("Copied"); } catch { showToast("Copy failed"); }
  };
  return (
    <div className="space-y-4">

      <div className="overflow-hidden rounded-lg border border-slate-200">
        <table className="w-full text-[13px]">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left font-medium px-3 py-2">Current Rent</th>
              <th className="text-left font-medium px-3 py-2">Effective From</th>
              <th className="text-left font-medium px-3 py-2">Reliable</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-slate-200">
              <td className="px-3 py-2 font-semibold text-slate-900">£2,415 per month</td>
              <td className="px-3 py-2 text-slate-700">1 October 2025</td>
              <td className="px-3 py-2 text-emerald-700">✓ Yes</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-slate-700">{bodyText}</p>
      <div>
        <div className="text-[11px] uppercase tracking-wide text-slate-400 font-medium mb-2">Sources</div>
        <ul className="list-disc pl-5 space-y-1 text-[13px] text-slate-700">
          {sources.map((s) => <li key={s}>{s}</li>)}
        </ul>
      </div>
      {/* Related questions removed — chat is locked in the prototype */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="text-[11px] uppercase tracking-wide text-slate-400 font-medium">Related documents</div>
          <span className="text-[9px] uppercase font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 tracking-wide">Beta</span>
        </div>
        <ul className="space-y-1.5">

          {docs.map((d) => (
            <li key={d.name}>
              <button
                onClick={() => showToast(`Opening ${d.name} (placeholder)`)}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded border border-slate-200 hover:border-[#7C3AED] hover:bg-[#F5F3FF] text-left transition"
              >
                <span aria-hidden className="w-5 h-5 rounded bg-rose-100 text-rose-700 text-[9px] font-bold grid place-items-center">PDF</span>
                <span className="text-[13px] text-slate-800 truncate">{d.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center gap-1 pt-1 border-t border-slate-100 text-[12px] text-slate-500">
        <button onClick={copyAll} className="px-2 py-1 rounded hover:bg-slate-100">Copy</button>
        <button onClick={() => showToast("Regenerating… (placeholder)")} className="px-2 py-1 rounded hover:bg-slate-100">Regenerate</button>
        
        <button onClick={() => showToast("Thanks for the rating")} className="px-2 py-1 rounded hover:bg-slate-100">Rate this</button>
      </div>
      {toast && (
        <div role="status" aria-live="polite" className="text-[11px] text-slate-500 italic">{toast}</div>
      )}
    </div>
  );
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[340px] bg-[#7C3AED] text-white text-sm leading-relaxed px-4 py-2.5 rounded-2xl rounded-br-md">
        {text}
      </div>
    </div>
  );
}

function TypingBubble({ owl, showAvatar = true }: { owl: OwlState; showAvatar?: boolean }) {
  const AvatarSlot = showAvatar
    ? <OwlAvatar state={owl} />
    : <div aria-hidden className="w-10 h-10 shrink-0" />;
  return (
    <div className="flex items-end gap-2">

      {AvatarSlot}
      <div className="bg-[#EDE9FE] px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1">
        <Dot delay={0} /><Dot delay={150} /><Dot delay={300} />
      </div>
    </div>
  );
}


function Dot({ delay }: { delay: number }) {
  return (
    <span
      className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]/70 animate-typing-bounce"
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}

function OwlAvatar({ state }: { state: OwlState }) {
  return (
    <div className="w-10 h-10 shrink-0 relative">
      {(Object.keys(OWLS) as OwlState[]).map((s) => (
        <img
          key={s}
          src={OWLS[s]}
          alt=""
          aria-hidden
          className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
            state === s ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}

function IntelligenceLadder({ view }: { view: View }) {
  const rows = [
    { label: "Unit Intelligence", status: "Available today", tone: "good" as const, upNext: view === "property" || view === "portfolio" ? false : false },
    { label: "Property Intelligence", status: "Coming soon", tone: "soon" as const, upNext: view === "property" },
    { label: "Portfolio Intelligence", status: "Coming soon", tone: "soon" as const, upNext: view === "portfolio" },
  ];
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2">
      <div className="text-[11px] uppercase tracking-wide text-slate-400 font-medium">Intelligence ladder</div>
      {rows.map((r) => (
        <div key={r.label} className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            {r.tone === "good" ? (
              <span className="w-4 h-4 rounded-full bg-emerald-500 text-white grid place-items-center text-[10px]">✓</span>
            ) : (
              <span className="w-4 h-4 rounded-full bg-slate-200" />
            )}
            <span className="text-slate-900">{r.label}</span>
            {r.upNext && (
              <span className="text-[10px] uppercase tracking-wide text-[#7C3AED] bg-[#EDE9FE] px-1.5 py-0.5 rounded">Up next</span>
            )}
          </div>
          <span className={`text-[11px] ${r.tone === "good" ? "text-emerald-600" : "text-slate-400"}`}>{r.status}</span>
        </div>
      ))}
    </div>
  );
}

function PortfolioContent({
  onOpenProperty,
  onPreviewQuestion,
}: {
  onOpenProperty: (id: string) => void;
  onPreviewQuestion: (q: string) => void;
}) {
  const questions = [
    "Which leases expire this year?",
    "What reviews are due?",
    "What is occupancy?",
    "Which assets carry risk?",
  ];
  return (
    <div className="space-y-3">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-base font-semibold text-slate-900">Portfolio Intelligence</h2>
          <span className="text-[10px] uppercase tracking-wide bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">Coming soon</span>
        </div>
        <p className="text-sm text-slate-600">
          Today I can answer questions about individual units. Soon I'll help you understand your entire portfolio.
        </p>
      </div>
      <div>
        <div className="text-[11px] uppercase tracking-wide text-slate-400 font-medium mb-1.5">Preview questions</div>
        <div className="flex flex-wrap gap-1.5">
          {questions.map((q) => (
            <button
              key={q}
              onClick={() => onPreviewQuestion(q)}
              className="text-xs px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="text-[11px] uppercase tracking-wide text-slate-400 font-medium mb-1.5 mt-2">Properties</div>
        <div className="space-y-1.5">
          {PROPERTIES.map((p) => (
            <button
              key={p.id}
              onClick={() => onOpenProperty(p.id)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-slate-200 hover:border-[#7C3AED] hover:bg-[#F5F3FF] transition text-left focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
            >
              <div>
                <div className="text-sm font-medium text-slate-900">{p.name}</div>
                <div className="text-[11px] text-slate-500">{p.area} · {p.units.length} units</div>
              </div>
              <span className="text-[#7C3AED] text-sm">→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

type UnitFilter = "all" | "alerts" | "vacant" | "ending_inferred" | "break_review" | "shops";

function unitSortKey(label: string): number {
  const lo = label.toLowerCase();
  if (lo.includes("shop")) return -1;
  const m = lo.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 999;
}

/** Confidence marker — solid filled tick for confirmed, dashed/hollow ring with "?" for inferred. */
function ConfidenceMark({ confidence }: { confidence: Confidence }) {
  if (confidence === "confirmed") {
    return (
      <span
        className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700"
        aria-label="Confirmed"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden className="text-emerald-600">
          <circle cx="12" cy="12" r="10" fill="currentColor" />
          <path d="M7 12.5l3 3 7-7" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Confirmed
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-amber-800"
      aria-label="Inferred — needs checking"
    >
      <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden className="text-amber-700">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 2" />
        <text x="12" y="16" textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor">?</text>
      </svg>
      Inferred · needs checking
    </span>
  );
}

function UnitDetailPanel({ unit, derived }: { unit: Unit; derived: UnitDerived }) {
  return (
    <div role="dialog" aria-label={`${unit.label} status`} className="text-left">
      <div className="text-[12px] font-semibold text-slate-900 mb-1.5">{unit.label}</div>
      {derived.items.length === 0 ? (
        <div className="text-[11px] text-slate-500">Let · nothing pending</div>
      ) : (
        <ul className="space-y-1.5">
          {derived.items.map((it) => (
            <li key={it.key} className="text-[11px] leading-snug">
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="font-medium text-slate-800">{it.label}</span>
                {it.value && <span className="text-slate-600">— {it.value}</span>}
              </div>
              <div className="mt-0.5"><ConfidenceMark confidence={it.confidence} /></div>
              {it.note && <div className="mt-0.5 text-[10.5px] text-slate-500">{it.note}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Spoken lines Hobson uses when opening a unit — preserves confirmed/inferred wording. */
function buildUnitOpeningLines(unit: Unit, derived: UnitDerived, propertyName: string): string[] {
  const where = `${unit.label}, ${propertyName}`;
  if (!derived.hasAlert) {
    return [`Here's ${where} — nothing pending right now. What would you like to know?`];
  }
  const lines: string[] = [`Here's ${where}. A couple of things stood out.`];
  const confirmed = derived.items.filter((i) => i.confidence === "confirmed");
  const inferred = derived.items.filter((i) => i.confidence === "inferred");
  confirmed.forEach((it) => {
    if (it.key === "vacant") {
      lines.push(`This unit is vacant — the tenancy is confirmed ended, so it's available to let.`);
    } else if (it.key === "break") {
      lines.push(`There's a break coming on ${it.value}.`);
    } else if (it.key === "review") {
      lines.push(`A rent review is due ${it.value}.`);
    }
  });
  inferred.forEach((it) => {
    if (it.key === "ending-term") {
      lines.push(`The contractual ${it.value}, but I can't see a confirmed ending — so I'm treating this as still let, and rent may still be due. Worth checking whether they've actually vacated.`);
    } else if (it.key === "ending-chain") {
      lines.push(`I've spotted a ${it.value}, but that's a signal — not a confirmed ending. I'm still treating this as let; rent may still be due. Worth checking.`);
    }
  });
  lines.push(`Want me to dig into any of these?`);
  return lines;
}

/** Starter chips driven by the alert items; falls back to generic prompts when nothing's pending. */
function buildUnitStarters(unit: Unit, derived: UnitDerived): string[] {
  if (!derived.hasAlert) {
    return unit.status === "Let"
      ? ["When does the lease expire?", "Any compliance issues?", "Summarise this unit"]
      : ["When did it become vacant?", "Who was the last tenant?", "Any compliance issues?"];
  }
  const chips: string[] = [];
  if (derived.items.some((i) => i.key === "ending-term" || i.key === "ending-chain")) {
    chips.push("Why do you think the tenancy is ending?");
    chips.push("Is rent still due?");
  }
  if (derived.items.some((i) => i.key === "break")) chips.push("When's the break?");
  if (derived.items.some((i) => i.key === "review")) chips.push("When's the review?");
  if (derived.items.some((i) => i.key === "vacant")) {
    chips.push("When did it become vacant?");
    chips.push("Who was the last tenant?");
  }
  chips.push("Summarise this unit");
  return chips;
}

/** Placeholder answer that preserves the confirmed/inferred distinction. */
function answerUnitQuestion(q: string, unit: Unit, derived: UnitDerived): string {
  const lo = q.toLowerCase();
  const inferredEnding = derived.items.find((i) => i.key === "ending-term" || i.key === "ending-chain");
  const breakItem = derived.items.find((i) => i.key === "break");
  const reviewItem = derived.items.find((i) => i.key === "review");
  if (lo.includes("why") && lo.includes("ending") && inferredEnding) {
    return `I haven't confirmed it — it's a signal, not a fact. ${inferredEnding.value ? inferredEnding.value.charAt(0).toUpperCase() + inferredEnding.value.slice(1) + ", " : ""}and I can't see an End-Tenancy, replacement chain or reversionary lease in place. Until one of those exists I'm treating this as still let. Worth a human eye.`;
  }
  if (lo.includes("rent") && inferredEnding) {
    return `I can't say rent has stopped. Because the ending isn't confirmed, the contractual rent may still be due — the term-end date alone doesn't switch it off. Please check before adjusting any ledger.`;
  }
  if (lo.includes("break") && breakItem) {
    return `The next break is ${breakItem.value}. That one's confirmed from the lease.`;
  }
  if (lo.includes("review") && reviewItem) {
    return `The next rent review is ${reviewItem.value}. That's confirmed from the lease.`;
  }
  if (lo.includes("vacant")) {
    return derived.isVacantConfirmed
      ? `Confirmed vacant — the tenancy has a confirmed ending, so it's available to let.`
      : `I don't have a confirmed vacancy for this unit. ${inferredEnding ? "There is an inferred ending signal — needs checking — but until it's confirmed I treat the unit as still let." : "I'd treat it as still let unless there's evidence otherwise."}`;
  }
  if (lo.includes("summar")) {
    const bits = derived.items.map((i) => `${i.label}${i.value ? " (" + i.value + ")" : ""} — ${i.confidence}`);
    return bits.length
      ? `${unit.label}: ${bits.join("; ")}. I'll keep confirmed and inferred items separate so you can act on the confirmed ones and check the inferred ones.`
      : `${unit.label}: nothing pending right now.`;
  }
  return `I'll learn the real answer once your documents are uploaded. For now, the confirmed and inferred items above are what I'd act on.`;
}

/** Persistent "What I've spotted" briefing card pinned at the top of the unit chat. */
function PinnedAlertCard({
  unit,
  derived,
  propertyContextCards = [],
  onManageAtProperty,
}: {
  unit: Unit;
  derived: UnitDerived;
  propertyContextCards?: ActionCard[];
  onManageAtProperty?: () => void;
}) {
  if (!derived.hasAlert && propertyContextCards.length === 0) return null;
  return (
    <div
      role="region"
      aria-label={`Alerts for ${unit.label}`}
      className="sticky top-0 z-10 -mx-5 px-5 py-2.5 bg-white/95 backdrop-blur border-b border-slate-200 space-y-2"
    >
      {derived.hasAlert && (
        <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-2.5">
          <div className="flex items-center gap-1.5 mb-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="text-amber-700">
              <path d="M12 2L1 21h22L12 2zm-1 6h2v8h-2V8zm0 9h2v2h-2v-2z" />
            </svg>
            <div className="text-[11px] uppercase tracking-wide font-semibold text-amber-800">What I've spotted</div>
          </div>
          <ul className="space-y-1.5">
            {derived.items.map((it) => (
              <li key={it.key} className="text-[12px] leading-snug">
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="font-medium text-slate-900">{it.label}</span>
                  {it.value && <span className="text-slate-700">— {it.value}</span>}
                  <ConfidenceMark confidence={it.confidence} />
                </div>
                {it.note && <div className="text-[11px] text-slate-600">{it.note}</div>}
              </li>
            ))}
          </ul>
        </div>
      )}
      {propertyContextCards.length > 0 && (
        <div className="rounded-lg border border-indigo-200 bg-indigo-50/40 p-2.5">
          <div className="flex items-center gap-1.5 mb-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="text-indigo-700">
              <path d="M3 3h18v4H3zM3 10h18v4H3zM3 17h18v4H3z" />
            </svg>
            <div className="text-[11px] uppercase tracking-wide font-semibold text-indigo-800">Property-wide (affects this unit)</div>
            <span className="text-[10px] px-1.5 py-0.5 rounded border border-slate-200 bg-white text-slate-500 font-medium ml-auto">
              Read-only here
            </span>
          </div>
          <ul className="space-y-1.5">
            {propertyContextCards.map((c) => (
              <li key={c.id} className="text-[12px] leading-snug">
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="font-medium text-slate-900">{c.title.replace(/ —.*$/, "")}</span>
                  <ConfidenceMark confidence={c.confidence} />
                </div>
                <div className="text-[11px] text-slate-600">{c.whyItMatters}</div>
              </li>
            ))}
          </ul>
          {onManageAtProperty && (
            <button
              onClick={onManageAtProperty}
              className="mt-1.5 text-[11px] text-indigo-700 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded"
            >
              Manage at property level →
            </button>
          )}
        </div>
      )}
    </div>
  );
}



function UnitTile({
  unit,
  derived,
  tabIx,
  onOpen,
  scrollRef,
  hideAlertBadge = false,
}: {
  unit: Unit;
  derived: UnitDerived;
  tabIx: 0 | -1;
  onOpen: () => void;
  scrollRef: React.RefObject<HTMLDivElement>;
  hideAlertBadge?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<"below" | "above">("below");
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const popRef = useRef<HTMLDivElement | null>(null);

  // Decide whether to flip to above when opening
  useEffect(() => {
    if (!open) return;
    const btn = btnRef.current;
    const scroller = scrollRef.current;
    if (!btn || !scroller) return;
    const br = btn.getBoundingClientRect();
    const sr = scroller.getBoundingClientRect();
    const spaceBelow = sr.bottom - br.bottom;
    const spaceAbove = br.top - sr.top;
    setPlacement(spaceBelow < 160 && spaceAbove > spaceBelow ? "above" : "below");
  }, [open, scrollRef]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (btnRef.current?.contains(t) || popRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const occupancyLabel = derived.isVacantConfirmed ? "Vacant (confirmed)" : "Let";
  const alertSummary = derived.hasAlert
    ? derived.items.map((i) => `${i.label}${i.value ? " " + i.value : ""} (${i.confidence})`).join("; ")
    : "nothing pending";

  const isVacant = derived.isVacantConfirmed;
  const isShop = /shop/i.test(unit.label);
  const contextLine = isVacant
    ? unit.vacantSince
      ? `Vacant since ${unit.vacantSince}`
      : "Awaiting let"
    : unit.tenant
      ? unit.tenant
      : "Currently let";

  return (
    <div
      className="relative group"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={btnRef}
        data-uchip
        tabIndex={tabIx}
        onClick={(e) => {
          void e;
          onOpen();
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`${unit.label}, ${occupancyLabel}. ${alertSummary}. Open unit.`}
        className={`relative w-full text-left p-3 rounded-xl border bg-gradient-to-br from-white to-[#FAF8FF] shadow-sm cursor-pointer transition-all duration-150 motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50 focus:border-[#7C3AED] ${
          isVacant
            ? "border-slate-200 hover:border-[#7C3AED] hover:shadow-md hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
            : "border-slate-200 hover:border-[#7C3AED] hover:shadow-md hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
        }`}
      >
        {/* top row: icon + name + alert */}
        <div className="flex items-start gap-2">
          <span
            aria-hidden
            className="mt-0.5 inline-flex items-center justify-center w-7 h-7 rounded-md bg-[#F5F3FF] text-[#7C3AED] border border-[#E9E2FB] group-hover:bg-[#EDE5FF] transition-colors motion-reduce:transition-none"
          >
            {isShop ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l1-5h16l1 5"/><path d="M4 9v11h16V9"/><path d="M9 22V12h6v10"/></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="3" width="14" height="18" rx="1"/><circle cx="15" cy="12" r="1" fill="currentColor"/></svg>
            )}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-slate-800 truncate">{unit.label}</span>
              {!hideAlertBadge && derived.hasAlert && (
                <span
                  aria-label="Needs attention"
                  title="Hobson has flagged items here"
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-50 border border-amber-300 text-[10px] font-medium text-amber-800"
                >
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 2L1 21h22L12 2zm-1 14h2v2h-2v-2zm0-7h2v5h-2V9z"/></svg>
                  Attention
                </span>
              )}
            </div>
            <div className="mt-0.5 text-[11px] text-slate-500 truncate">{contextLine}</div>
          </div>
        </div>

        {/* bottom row: status chip + open cue */}
        <div className="mt-2.5 flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded-full border text-[10px] font-medium ${
              isVacant
                ? "bg-slate-50 border-slate-300 text-slate-600"
                : "bg-emerald-50 border-emerald-300 text-emerald-700"
            }`}
          >
            <span
              aria-hidden
              className={`inline-block w-1.5 h-1.5 rounded-full ${isVacant ? "bg-slate-400" : "bg-emerald-500"}`}
            />
            {isVacant ? "Vacant" : "Let"}
          </span>
          <span
            aria-hidden
            className="text-[11px] font-medium text-[#7C3AED] opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity motion-reduce:transition-none"
          >
            Open →
          </span>
        </div>
      </button>

      {open && (
        <div
          ref={popRef}
          role="tooltip"
          className={`absolute left-1/2 -translate-x-1/2 z-20 w-56 p-2.5 rounded-md border border-slate-200 bg-white shadow-lg ${
            placement === "above" ? "bottom-full mb-1.5" : "top-full mt-1.5"
          }`}
        >
          <UnitDetailPanel unit={unit} derived={derived} />
        </div>
      )}
    </div>
  );
}


function PropertyContent({
  property,
  testerMode = false,
  propertyActionCards = [],
  expandedCardId,
  setExpandedCardId,
  carriedCardId,
  onOpenUnit,
  onPreviewQuestion,
  onApprove,
  onDefer,
  onDismiss,
  onPerform,
  onReview,
  onManualComplete,
  onOpenWorkflow,
  openUnitsSignal = 0,
}: {
  property: Property;
  testerMode?: boolean;
  propertyActionCards?: ActionCard[];
  expandedCardId?: string | null;
  setExpandedCardId?: (id: string | null) => void;
  carriedCardId?: string | null;
  onOpenUnit: (id: string, carryCardId?: string) => void;
  onPreviewQuestion: (q: string) => void;
  onApprove?: (id: string) => void;
  onDefer?: (id: string) => void;
  onDismiss?: (id: string) => void;
  onPerform?: (id: string) => void;
  onReview?: (id: string) => void;
  onManualComplete?: (id: string, note: string) => void;
  onOpenWorkflow?: (ref: string) => void;
  openUnitsSignal?: number;
}) {
  void onPreviewQuestion;
  const [filter, setFilter] = useState("");
  const [quick, setQuick] = useState<UnitFilter>("all");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [unitsOpen, setUnitsOpen] = useState(false);
  // Reset to collapsed on each fresh property arrival
  useEffect(() => { setUnitsOpen(false); }, [property.id]);
  // External trigger from the pinned Quick bar (parent increments the signal).
  useEffect(() => {
    if (openUnitsSignal && openUnitsSignal > 0) {
      setUnitsOpen(true);
      requestAnimationFrame(() => {
        const el = document.getElementById(`units-section-${property.id}`);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openUnitsSignal]);
  const gridWrapRef = useRef<HTMLDivElement | null>(null);

  const derivedByUnit = useMemo(() => {
    const map = new Map<string, UnitDerived>();
    property.units.forEach((u) => map.set(u.id, deriveUnit(u)));
    return map;
  }, [property.units]);

  const counts = useMemo(() => {
    let alerts = 0, vacant = 0, endingInferred = 0, breakReview = 0;
    property.units.forEach((u) => {
      const d = derivedByUnit.get(u.id)!;
      if (d.hasAlert) alerts += 1;
      if (d.isVacantConfirmed) vacant += 1;
      if (d.isEndingInferred) endingInferred += 1;
      if (d.hasUpcomingBreakOrReview) breakReview += 1;
    });
    const let_ = property.units.length - vacant;
    return { alerts, vacant, endingInferred, breakReview, let: let_ };
  }, [property.units, derivedByUnit]);

  const hasShops = property.units.some((u) => u.label.toLowerCase().includes("shop"));

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return property.units
      .filter((u) => {
        const d = derivedByUnit.get(u.id)!;
        if (quick === "alerts" && !d.hasAlert) return false;
        if (quick === "vacant" && !d.isVacantConfirmed) return false;
        if (quick === "ending_inferred" && !d.isEndingInferred) return false;
        if (quick === "break_review" && !d.hasUpcomingBreakOrReview) return false;
        if (quick === "shops" && !u.label.toLowerCase().includes("shop")) return false;
        if (!q) return true;
        if (q === "vac") return d.isVacantConfirmed;
        if (q === "let") return !d.isVacantConfirmed;
        return (
          u.label.toLowerCase().includes(q) ||
          (u.tenant ?? "").toLowerCase().includes(q)
        );
      })
      .sort((a, b) => unitSortKey(a.label) - unitSortKey(b.label));
  }, [property.units, derivedByUnit, filter, quick]);

  const grouped = useMemo(() => {
    const shops: Unit[] = [];
    const flats: Unit[] = [];
    const other: Unit[] = [];
    filtered.forEach((u) => {
      const lo = u.label.toLowerCase();
      if (lo.includes("shop")) shops.push(u);
      else if (lo.includes("flat")) flats.push(u);
      else other.push(u);
    });
    const groups: { key: string; units: Unit[] }[] = [];
    if (shops.length) groups.push({ key: "Shop", units: shops });
    if (flats.length) groups.push({ key: "Flats", units: flats });
    if (other.length) groups.push({ key: "Other", units: other });
    return groups;
  }, [filtered]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const keys = ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", "Home", "End"];
    if (!keys.includes(e.key)) return;
    const wrap = gridWrapRef.current;
    if (!wrap) return;
    const tiles = Array.from(wrap.querySelectorAll<HTMLButtonElement>("button[data-uchip]"));
    if (!tiles.length) return;
    const idx = tiles.findIndex((t) => t === document.activeElement);
    if (idx < 0) return;
    e.preventDefault();
    // Compute columns from first row's tiles sharing the same offsetTop
    const firstTop = tiles[0].offsetTop;
    let cols = tiles.findIndex((t) => t.offsetTop > firstTop);
    if (cols < 0) cols = tiles.length;
    let next = idx;
    if (e.key === "ArrowRight") next = Math.min(idx + 1, tiles.length - 1);
    else if (e.key === "ArrowLeft") next = Math.max(idx - 1, 0);
    else if (e.key === "ArrowDown") next = Math.min(idx + cols, tiles.length - 1);
    else if (e.key === "ArrowUp") next = Math.max(idx - cols, 0);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tiles.length - 1;
    tiles[next]?.focus();
  };

  const quickBtn = (key: UnitFilter, label: string) => (
    <button
      key={key}
      onClick={() => setQuick(key)}
      className={`text-[11px] px-2.5 py-1 rounded-full border transition focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 ${
        quick === key
          ? "bg-[#7C3AED] text-white border-[#7C3AED]"
          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
      }`}
      aria-pressed={quick === key}
    >
      {label}
    </button>
  );

  let tileIndex = 0;

  return (
    <div className="space-y-4">
      {/* Collapsible Units section (anchored, not pinned — the chat pinned bar handles always-on access) */}
      <section
        id={`units-section-${property.id}`}
        className="-mx-1 px-1"
        aria-label="Units"
      >
        <div
          id={`units-panel-${property.id}`}
          hidden={!unitsOpen}
          className="mt-2 px-3 pb-3 pt-3 space-y-3 bg-white border border-slate-200 rounded-xl shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-slate-700 uppercase tracking-wide">Units</span>
            <button
              type="button"
              onClick={() => setUnitsOpen(false)}
              className="text-[11px] font-medium text-[#7C3AED] hover:text-[#5B21B6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/40 rounded px-2 py-1"
              aria-label="Close unit picker"
            >
              Close
            </button>
          </div>
          {!testerMode && (
            <div className="text-[10.5px] text-slate-500 flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1">
                <svg width="10" height="10" viewBox="0 0 24 24" aria-hidden className="text-emerald-600">
                  <circle cx="12" cy="12" r="10" fill="currentColor" />
                  <path d="M7 12.5l3 3 7-7" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Confirmed = known fact
              </span>
              <span className="inline-flex items-center gap-1">
                <svg width="10" height="10" viewBox="0 0 24 24" aria-hidden className="text-amber-700">
                  <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 2" />
                  <text x="12" y="16" textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor">?</text>
                </svg>
                Inferred = needs checking
              </span>
            </div>
          )}

          {!testerMode && property.units.length > 8 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-white focus-within:border-[#7C3AED] focus-within:ring-2 focus-within:ring-[#7C3AED]/20 transition">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
                <circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" />
              </svg>
              <input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Find a unit…"
                className="flex-1 outline-none text-sm bg-transparent placeholder:text-slate-400"
                aria-label="Find a unit by name or tenant"
              />
              {filter && (
                <button
                  onClick={() => setFilter("")}
                  className="text-slate-400 hover:text-slate-700 text-base leading-none"
                  aria-label="Clear filter"
                >
                  ×
                </button>
              )}
            </div>
          )}

          {!testerMode && (
            <div className="flex flex-wrap gap-1.5">
              {quickBtn("all", `All (${property.units.length})`)}
              {counts.alerts > 0 && quickBtn("alerts", `Has alerts (${counts.alerts})`)}
              {quickBtn("vacant", `Vacant (${counts.vacant})`)}
              {counts.endingInferred > 0 && quickBtn("ending_inferred", `Ending (inferred) (${counts.endingInferred})`)}
              {counts.breakReview > 0 && quickBtn("break_review", `Break/review upcoming (${counts.breakReview})`)}
              {hasShops && quickBtn("shops", "Shops")}
            </div>
          )}

          <div
            ref={gridWrapRef}
            onKeyDown={onKeyDown}
            className="max-h-[420px] overflow-y-auto -mx-1 px-1"
          >
            {filtered.length === 0 ? (
              <div className="text-[12px] text-slate-500 py-6 text-center">No matching units</div>
            ) : (
              grouped.map((group) => {
                const isCollapsed = !!collapsed[group.key];
                return (
                  <div key={group.key} className="mb-3">
                    <button
                      type="button"
                      onClick={() =>
                        setCollapsed((c) => ({ ...c, [group.key]: !c[group.key] }))
                      }
                      className="sticky top-0 z-[1] w-full flex items-center justify-between bg-white/95 backdrop-blur px-1 py-1.5 text-[10px] uppercase tracking-wide text-slate-500 font-medium border-b border-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 rounded"
                      aria-expanded={!isCollapsed}
                    >
                      <span>
                        {group.key} · {group.units.length} {group.units.length === 1 ? "unit" : "units"}
                      </span>
                      <span aria-hidden className="text-slate-400">{isCollapsed ? "▸" : "▾"}</span>
                    </button>
                    {!isCollapsed && (
                      <div className="grid gap-1.5 pt-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))" }}>
                        {group.units.map((u) => {
                          const tabIx: 0 | -1 = tileIndex === 0 ? 0 : -1;
                          tileIndex += 1;
                          const d = derivedByUnit.get(u.id)!;
                          return (
                            <UnitTile
                              key={u.id}
                              unit={u}
                              derived={d}
                              tabIx={tabIx}
                              scrollRef={gridWrapRef}
                              hideAlertBadge={testerMode}
                              onOpen={() => onOpenUnit(u.id)}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Intelligent action cards — visible immediately because Units bar is collapsed */}
      {propertyActionCards.filter((c) => c.approvalState === "pending" || c.approvalState === "in_progress").length > 0 && (
        <PropertyActions
          cards={propertyActionCards.filter((c) => c.approvalState === "pending" || c.approvalState === "in_progress")}
          propertyName={property.name}
          expandedCardId={expandedCardId ?? null}
          setExpandedCardId={(id) => setExpandedCardId && setExpandedCardId(id)}
          carriedCardId={carriedCardId ?? null}
          onOpenUnit={(uid, cardId) => onOpenUnit(uid, cardId)}
          onApprove={(id) => onApprove && onApprove(id)}
          onDefer={(id) => onDefer && onDefer(id)}
          onDismiss={(id) => onDismiss && onDismiss(id)}
          onPerform={onPerform ? (id) => onPerform(id) : undefined}
          onReview={onReview ? (id) => onReview(id) : undefined}
          onManualComplete={onManualComplete}
          onOpenWorkflow={onOpenWorkflow}
        />
      )}
    </div>
  );
}


function UnitStarters({ unit, onAsk }: { unit: Unit; onAsk: (q: string) => void }) {
  const derived = useMemo(() => deriveUnit(unit), [unit]);
  const qs = useMemo(() => buildUnitStarters(unit, derived), [unit, derived]);
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-slate-400 font-medium mb-1.5">Try asking</div>
      <div className="flex flex-wrap gap-1.5">
        {qs.map((q) => (
          <button
            key={q}
            onClick={() => onAsk(q)}
            className="text-xs px-3 py-1.5 rounded-full bg-[#EDE9FE] text-[#5B21B6] hover:bg-[#DDD6FE] transition focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

function LockedComposer({ view }: { view: View }) {
  void view;
  const placeholder = "Chat is locked in this prototype";
  const helper = "Available in the live product";
  return (
    <>
      <div className="text-[11px] font-semibold text-[#7C3AED] mb-1 flex items-center gap-1">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
          <rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>
        </svg>
        Chat locked for the prototype
      </div>
      <div
        aria-disabled="true"
        tabIndex={-1}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-dashed border-[#7C3AED]/40 bg-[#F5F3FF] text-sm text-[#5B21B6]/70 select-none cursor-not-allowed"
        title={helper}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>
        </svg>
        <span className="flex-1 truncate">{placeholder}</span>
        <span className="text-[10px] uppercase tracking-wide hidden sm:inline">{helper}</span>
      </div>
    </>
  );
}

function BackOfficeComposer({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [val, setVal] = useState("");
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); const t = val.trim(); if (!t) return; onSubmit(t); setVal(""); }}
      className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-slate-200 bg-white focus-within:border-[#7C3AED] focus-within:ring-2 focus-within:ring-[#7C3AED]/20 transition"
    >
      <input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="Ask Hobson… (e.g. 'show me my contacts', 'set up compliance')"
        aria-label="Ask Hobson"
        className="flex-1 outline-none text-sm bg-transparent placeholder:text-slate-400"
      />
      <button
        type="submit"
        disabled={!val.trim()}
        aria-label="Send"
        className="flex items-center justify-center h-9 w-9 rounded-full bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition disabled:bg-slate-200 disabled:text-slate-400"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6"/>
        </svg>
      </button>
    </form>
  );
}

function PortraitTile({
  helper,
  compact = false,
}: {
  helper: BackOfficeHelper;
  compact?: boolean;
}) {
  const isNotReady = helper.status !== "ready";
  const badgeText = helper.status === "started" ? "Started" : "Joining soon";
  const badgeClasses = helper.status === "started"
    ? "bg-sky-50 text-sky-800 border-sky-200"
    : "bg-amber-50 text-amber-800 border-amber-200";
  return (
    <article
      className={`relative rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden ${isNotReady ? "opacity-70" : ""}`}
      aria-label={`${helper.name}, ${helper.roleTitle}. ${helper.contributionLine} One of Hobson's Specialists.${isNotReady ? ` ${badgeText}.` : ""}`}
    >
      <div className={`flex flex-col items-center text-center px-5 ${compact ? "pt-5 pb-3" : "pt-8 pb-4"}`}>
        <div className="relative">
          <div className={`rounded-full border-2 border-slate-100 bg-slate-50 grid place-items-center overflow-hidden ${compact ? "w-16 h-16" : "w-24 h-24"}`}>
            <img
              src={helper.src}
              alt=""
              aria-hidden
              className={`object-contain ${compact ? "w-14 h-14" : "w-20 h-20"}`}
            />
          </div>
          {isNotReady && (
            <span className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 text-[10px] px-2 py-0.5 rounded-full border font-medium whitespace-nowrap ${badgeClasses}`}>
              {badgeText}
            </span>
          )}
        </div>
        <h3 className={`font-semibold text-slate-900 mt-4 ${compact ? "text-[13px]" : "text-[15px]"}`}>
          {helper.name}
        </h3>
        <p className={`font-medium text-slate-500 mt-0.5 ${compact ? "text-[11px]" : "text-[12px]"}`}>
          {helper.roleTitle}
        </p>
      </div>

      <div className="mx-5 border-t border-slate-100" />

      <div className={`px-5 text-center ${compact ? "py-3" : "py-4"}`}>
        <p className={`text-slate-600 leading-relaxed ${compact ? "text-[12px]" : "text-[13px]"}`}>
          {helper.contributionLine}
        </p>
      </div>

      <div className={`px-5 text-center ${compact ? "pb-3" : "pb-5"}`}>
        <p className="text-[11px] text-slate-400 italic">One of Hobson's Specialists</p>
      </div>
    </article>
  );
}

function BackOfficeStage({
  mode,
  helpers,
  comingSoonId,
  onEnter: _onEnter,
  onReturnHallway,
}: {
  mode: "hallway" | "home" | "coming-soon";
  helpers: BackOfficeHelper[];
  comingSoonId: string | null;
  onEnter: (h: BackOfficeHelper) => void;
  onReturnHallway: () => void;
}) {
  if (mode === "coming-soon") {
    const h = helpers.find((x) => x.id === comingSoonId);
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white overflow-auto motion-reduce:transition-none">
        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
          <img src={h?.src} alt="" aria-hidden className="w-24 h-24 mx-auto opacity-60 mb-4" />
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">{h?.name}'s room</h2>
          <p className="text-sm text-slate-600 mb-1">{h?.domain}</p>
          <p className="text-sm text-slate-500 italic mb-6">{h?.tagline}</p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium mb-8">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 2"/></svg>
            Coming soon
          </div>
          <div>
            <button onClick={onReturnHallway} className="text-sm text-[#7C3AED] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] rounded px-2 py-1">
              ← Back to hallway
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "hallway") {
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7FF] via-white to-slate-50 overflow-auto">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-3">
              <OwlAvatar state="default" />
            </div>
            <p className="text-[11px] uppercase tracking-wider text-[#7C3AED] font-semibold mb-2">Hobson's back office</p>
            <h1 className="text-2xl font-semibold text-slate-900 mb-4">Meet My Team</h1>
            <div className="max-w-lg mx-auto text-sm text-slate-600 leading-relaxed space-y-3">
              <p>I may be the one you'll always speak to, but I don't work alone.</p>
              <p>Behind me is a team of specialists, each responsible for a different part of your organisation. Together they help me understand your portfolio, keep it organised, protect it and make sure the answers I give you are accurate.</p>
              <p><strong className="text-slate-800">You'll only ever speak to me.</strong> My team works quietly behind the scenes so I can give you one simple, personal service.</p>
            </div>
            <div className="mt-6 border-t border-slate-200 max-w-xs mx-auto" />
          </div>
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2" role="list" aria-label="Hobson's team">
            {helpers.map((h) => (
              <PortraitTile key={h.id} helper={h} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Returning view — compact team wall
  return (
    <div className="absolute inset-0 bg-white overflow-auto">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-1">Meet My Team</h2>
          <p className="text-[12px] text-slate-500 max-w-lg leading-relaxed">
            Each of them looks after one part of your portfolio, so I can give you a single, personal service. You only ever speak to me.
          </p>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2" role="list" aria-label="Hobson's team">
          {helpers.map((h) => (
            <PortraitTile key={h.id} helper={h} compact />
          ))}
        </div>
      </div>
    </div>
  );
}

type WorkbenchCounts = {
  documents: number;
  documentsPending: number;
  compliance: number;
  complianceToConfirm: number;
  contacts: number;
  workflows: number;
  workflowsActive: number;
  workflowsDraft: number;
  units: number;
  properties: number;
};

function BackOfficeWorkbench({
  helpers,
  scopeProperty,
  scopeUnit,
  onClearScope,
  jumpSectionId,
  onJumpHandled,
  renderDocuments,
  renderCompliance,
  renderPeople,
  renderWorkflows,
  counts,
}: {
  helpers: BackOfficeHelper[];
  scopeProperty: Property | null;
  scopeUnit: Unit | null;
  onClearScope: () => void;
  jumpSectionId: string | null;
  onJumpHandled: () => void;
  renderDocuments: () => React.ReactNode;
  renderCompliance: () => React.ReactNode;
  renderPeople: () => React.ReactNode;
  renderWorkflows: () => React.ReactNode;
  counts: WorkbenchCounts;
}) {
  const findHelper = (id: string) => helpers.find((h) => h.id === id);
  const professor = findHelper("professor");
  const inspector = findHelper("inspector");
  const broker = findHelper("broker");
  const architect = findHelper("architect");

  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const [notesOpen, setNotesOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    if (!jumpSectionId) return;
    setOpenIds((prev) => {
      const n = new Set(prev);
      n.add(jumpSectionId);
      return n;
    });
    const t = window.setTimeout(() => {
      const el = sectionRefs.current[jumpSectionId];
      if (el && containerRef.current) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      onJumpHandled();
    }, 80);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jumpSectionId]);

  const toggle = (id: string) =>
    setOpenIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const scopeChip = scopeUnit
    ? { kind: "unit", text: scopeUnit.label }
    : scopeProperty
    ? { kind: "property", text: scopeProperty.name }
    : null;

  const agentNotes: { id: string; src?: string; name: string; text: string; isHobson?: boolean }[] = [
    {
      id: "n-hobson",
      src: owlDefault,
      name: "Hobson",
      text: `${counts.workflowsActive} workflows running${counts.workflowsDraft > 0 ? ` · ${counts.workflowsDraft} in draft` : ""}`,
      isHobson: true,
    },
    professor && {
      id: "n-prof",
      src: professor.src,
      name: "Professor",
      text: `${counts.documents} documents read${counts.documentsPending > 0 ? ` · ${counts.documentsPending} awaiting classification` : " · catalogue current"}`,
    },
    inspector && {
      id: "n-insp",
      src: inspector.src,
      name: "Inspector",
      text: `rulebook current${counts.complianceToConfirm > 0 ? ` · ${counts.complianceToConfirm} changes to confirm` : ""}`,
    },
    broker && {
      id: "n-brk",
      src: broker.src,
      name: "Broker",
      text: `${counts.contacts} contacts · 1 missing details`,
    },
    architect && {
      id: "n-arch",
      src: architect.src,
      name: "Architect",
      text: `${counts.units} units across ${counts.properties} properties`,
    },
  ].filter(Boolean) as { id: string; src?: string; name: string; text: string; isHobson?: boolean }[];

  const totalToConfirm = counts.documentsPending + counts.complianceToConfirm + counts.workflowsDraft;

  type SectionDef = {
    id: string;
    name: string;
    summary: string;
    agentName: string;
    agentSrc?: string;
    icon: React.ReactNode;
    content: React.ReactNode;
  };

  const structureContent = (
    <div className="absolute inset-0 bg-white overflow-auto">
      <div className="px-5 py-4 space-y-3">
        <div className="text-[13px] font-semibold text-slate-900">Portfolio structure</div>
        <div className="text-[12px] text-slate-500">{counts.units} units across {counts.properties} properties — kept in shape by the Architect.</div>
        <div className="space-y-2 pt-2">
          {PROPERTIES.map((p) => (
            <div key={p.id} className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="flex items-center justify-between">
                <div className="text-[13px] font-semibold text-slate-900">{p.name}</div>
                <div className="text-[11px] text-slate-500">{p.area} · {p.standalone ? "single unit" : `${p.units.length} units`}</div>
              </div>
              {!p.standalone && (
                <ul className="mt-2 grid grid-cols-2 gap-1 text-[12px] text-slate-600">
                  {p.units.map((u) => (
                    <li key={u.id} className="flex items-center justify-between px-2 py-1 rounded bg-slate-50">
                      <span>{u.label}</span>
                      <span className={`text-[10px] uppercase ${u.status === "Let" ? "text-emerald-700" : "text-slate-500"}`}>{u.status}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const sections: SectionDef[] = [
    {
      id: "documents",
      name: "Documents",
      summary: `${counts.documents} documents · 4 tenancy chains`,
      agentName: "Professor",
      agentSrc: professor?.src,
      icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M9 3h7l4 4v14H9z"/><path d="M5 7h7v14H5z"/></svg>),
      content: renderDocuments(),
    },
    {
      id: "compliance",
      name: "Compliance",
      summary: `${counts.compliance} requirements${counts.complianceToConfirm > 0 ? ` · ${counts.complianceToConfirm} to confirm` : ""}`,
      agentName: "Inspector",
      agentSrc: inspector?.src,
      icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 3l8 4v5c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V7l8-4z"/></svg>),
      content: renderCompliance(),
    },
    {
      id: "people",
      name: "People & relationships",
      summary: `${counts.contacts} contacts`,
      agentName: "Broker",
      agentSrc: broker?.src,
      icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="11" r="2.5"/><path d="M5 18c.8-2 2.2-3 4-3s3.2 1 4 3"/><path d="M15 9h4M15 13h4"/></svg>),
      content: renderPeople(),
    },
    {
      id: "workflows",
      name: "Workflows",
      summary: `${counts.workflowsActive} running${counts.workflowsDraft > 0 ? ` · ${counts.workflowsDraft} draft` : ""}`,
      agentName: "Built by Hobson",
      agentSrc: owlDefault,
      icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M15 4l5 5-11 11H4v-5L15 4z"/><path d="M14 5l5 5"/></svg>),
      content: renderWorkflows(),
    },
    {
      id: "structure",
      name: "Structure",
      summary: `${counts.units} units · ${counts.properties} properties`,
      agentName: "Architect",
      agentSrc: architect?.src,
      icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 21h18"/><path d="M5 21V9l7-5 7 5v12"/><path d="M9 21v-6h6v6"/></svg>),
      content: structureContent,
    },
  ];

  const comingSoonTiles = [
    { id: "researcher", label: "Research", person: "Researcher", icon: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>) },
    { id: "bookkeeper", label: "Calculations", person: "Bookkeeper", icon: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h5"/></svg>) },
    { id: "communicator", label: "Connections", person: "Communicator", icon: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M5 12a7 7 0 0114 0"/><path d="M8 12a4 4 0 018 0"/><circle cx="12" cy="12" r="1.5"/></svg>) },
    { id: "keeper", label: "Access", person: "Keeper", icon: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>) },
  ];

  return (
    <div ref={containerRef} className="absolute inset-0 bg-[#FAF7F2] overflow-auto">
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-5">
        {/* Page header */}
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[22px] leading-tight font-semibold text-slate-900">Here's everything my team holds for you.</h1>
            {scopeChip && (
              <p className="text-[12.5px] text-slate-500 mt-1">Scoped to one {scopeChip.kind} · remove the chip for the whole portfolio</p>
            )}
          </div>
          {scopeChip && (
            <button
              type="button"
              onClick={onClearScope}
              aria-label={`Clear scope ${scopeChip.text}`}
              className="inline-flex items-center gap-1.5 text-[12px] px-2.5 py-1 rounded-full border border-slate-300 bg-white hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
            >
              <span className="text-slate-700">{scopeChip.text}</span>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden><path d="M6 6l12 12M18 6L6 18"/></svg>
            </button>
          )}
        </header>

        {/* Agents' notes (consolidated) */}
        <section className="rounded-2xl border border-slate-200 bg-white">
          <button
            type="button"
            aria-expanded={notesOpen}
            onClick={() => setNotesOpen((v) => !v)}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-slate-50 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" aria-hidden><circle cx="9" cy="8" r="3"/><circle cx="17" cy="10" r="2.5"/><path d="M3 20v-1a5 5 0 015-5h2a5 5 0 015 5v1"/><path d="M14 20v-.5a4 4 0 014-4h1a4 4 0 014 4V20"/></svg>
            <span className="text-[14px] font-semibold text-slate-900">Agents' notes</span>
            <span className="text-[12px] text-slate-500 hidden sm:inline">· what your team has been doing</span>
            <span className="ml-auto flex items-center gap-2">
              {totalToConfirm > 0 && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">{totalToConfirm} to confirm</span>
              )}
              <svg className={`w-4 h-4 text-slate-400 transition-transform ${notesOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M6 9l6 6 6-6"/></svg>
            </span>
          </button>
          {notesOpen && (
            <div className="px-4 pb-4 pt-2 border-t border-slate-100">
              <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2 text-[13px]">
                {agentNotes.map((n) => (
                  <React.Fragment key={n.id}>
                    <dt className="flex items-center gap-2 text-slate-700">
                      {n.src && <img src={n.src} alt="" aria-hidden className="w-5 h-5 object-contain" />}
                      <span className="font-medium">{n.name}</span>
                    </dt>
                    <dd className="text-slate-600">{n.text}</dd>
                  </React.Fragment>
                ))}
              </dl>
            </div>
          )}
        </section>

        <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold pt-1">Your team's work</div>

        {/* Work sections */}
        <div className="space-y-3">
          {sections.map((s) => {
            const open = openIds.has(s.id);
            return (
              <section
                key={s.id}
                ref={(el) => { sectionRefs.current[s.id] = el; }}
                className={`rounded-2xl border bg-white transition ${open ? "border-[#7C3AED]/50 shadow-sm" : "border-slate-200"}`}
              >
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`bo-sec-${s.id}`}
                  onClick={() => toggle(s.id)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-slate-50 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
                >
                  <span className="w-9 h-9 rounded-lg bg-slate-50 grid place-items-center text-slate-600 shrink-0">{s.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[15px] font-semibold text-slate-900">{s.name}</div>
                    <div className="text-[12px] text-slate-500 flex items-center gap-2 flex-wrap">
                      <span>{s.summary}</span>
                      <span aria-hidden>·</span>
                      <span className="inline-flex items-center gap-1.5">
                        {s.agentSrc && <img src={s.agentSrc} alt="" aria-hidden className="w-3.5 h-3.5 object-contain" />}
                        <span>{s.agentName}</span>
                      </span>
                    </div>
                  </div>
                  <svg className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M6 9l6 6 6-6"/></svg>
                </button>
                {open && (
                  <div id={`bo-sec-${s.id}`} className="border-t border-slate-100">
                    <div className="relative overflow-hidden rounded-b-2xl" style={{ height: "min(78vh, 880px)" }}>
                      {s.content}
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {/* Joining soon */}
        <div className="pt-2">
          <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Joining soon</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {comingSoonTiles.map((t) => (
              <div
                key={t.id}
                aria-label={`${t.label} — ${t.person} — joining soon`}
                className="rounded-xl border border-dashed border-slate-300 bg-slate-50/70 px-3 py-3"
              >
                <div className="flex items-center gap-2 text-[13px] font-medium text-slate-700">
                  <span className="text-slate-500">{t.icon}</span>
                  <span>{t.label}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">{t.person}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}



function AdminBuildActiveBanner({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-dashed border-[#7C3AED]/40 bg-[#F5F3FF] text-[12px] text-[#5B21B6]/80">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M12 6v6l4 2"/><circle cx="12" cy="12" r="9"/>
      </svg>
      <span className="flex-1 truncate">{label}</span>
    </div>
  );
}

function ChatInviteShell({ avatarSrc, children }: { avatarSrc: string; children: React.ReactNode }) {
  return (
    <div className="flex items-end gap-2">
      <CharacterAvatar src={avatarSrc} />
      <div className="max-w-[460px] bg-[#EDE9FE] text-[#1F2330] text-sm leading-relaxed px-4 py-3 rounded-2xl rounded-bl-md flex flex-col gap-2.5">
        {children}
      </div>
    </div>
  );
}

function MagicianBuildInviteCard({ onStart }: { onStart: () => void }) {
  const quickStarts: { label: string }[] = [
    { label: "Rent reviews" },
    { label: "Compliance checks" },
    { label: "Notices & deadlines" },
    { label: "Something else" },
  ];
  return (
    <ChatInviteShell avatarSrc={characterMagician}>
      <div>Tell me what you'd like me to keep on top of and I'll have the Magician build it with you — rent reviews, compliance checks, notices, anything that needs minding.</div>
      <button
        type="button"
        onClick={onStart}
        className="self-start inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#7C3AED] text-white text-[12.5px] font-semibold shadow-sm hover:bg-[#6D28D9] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M15 4l5 5-11 11H4v-5L15 4z"/><path d="M14 5l5 5"/></svg>
        Build a workflow
      </button>
    </ChatInviteShell>
  );
}


function ProfessorBuildInviteCard({ onUpload }: { onUpload: (count: number) => void }) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  return (
    <ChatInviteShell avatarSrc={characterProfessor}>
      <div>Hand me your documents and I shall read them — leases, certificates, notices. Upload one or several here and I'll tell you what each one is.</div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#7C3AED] text-white text-[12.5px] font-semibold shadow-sm hover:bg-[#6D28D9] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 16V4M6 10l6-6 6 6"/><path d="M4 20h16"/></svg>
          Upload documents
        </button>
        <span className="text-[11px] text-slate-500">or drop files anywhere on this chat</span>
        <input
          ref={fileRef}
          type="file"
          multiple
          className="sr-only"
          aria-label="Upload documents"
          onChange={(e) => {
            const n = e.target.files?.length ?? 0;
            if (n > 0) onUpload(Math.min(n, 8));
            if (fileRef.current) fileRef.current.value = "";
          }}
        />
      </div>
    </ChatInviteShell>
  );
}

function BrokerBuildInviteCard({ onAdd, onUpload }: { onAdd: () => void; onUpload: (name: string) => void }) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  return (
    <ChatInviteShell avatarSrc={characterBroker}>
      <div>Add a contact one at a time and I'll walk you through it — or hand me a spreadsheet and I'll read them all in. Either way I'll connect each one to the right properties and remember how they relate.</div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#7C3AED] text-white text-[12.5px] font-semibold shadow-sm hover:bg-[#6D28D9] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/></svg>
          Add a contact
        </button>
        <span className="text-[11px] text-slate-400">or</span>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#7C3AED]/60 bg-white text-[#7C3AED] text-[12.5px] font-semibold hover:bg-[#F5F3FF] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 7h6v4H3zM3 13h6v4H3zM11 7h10v10H11z"/></svg>
          Upload contacts
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          className="sr-only"
          aria-label="Upload contacts spreadsheet"
          onChange={(e) => {
            const f = e.target.files?.[0];
            onUpload(f?.name || "contacts-export.csv");
            if (fileRef.current) fileRef.current.value = "";
          }}
        />
      </div>
    </ChatInviteShell>
  );
}


function ProfessorComposer({ onUpload }: { onUpload: (count: number) => void }) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const handleFiles = (n: number) => {
    if (n > 0) onUpload(Math.min(n, 8));
  };
  return (
    <div className="flex flex-col gap-2">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const n = e.dataTransfer?.files?.length ?? 0;
          handleFiles(n || 3);
        }}
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 border-dashed transition ${
          dragOver ? "border-[#7C3AED] bg-[#F5F3FF]" : "border-[#7C3AED]/40 bg-white"
        }`}
      >
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#7C3AED] text-white text-[13px] font-semibold shadow-sm hover:bg-[#6D28D9] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 16V4M6 10l6-6 6 6"/><path d="M4 20h16"/>
          </svg>
          Upload documents
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-[12px] font-medium text-slate-800">Drop one or many — PDFs, leases, certificates</div>
          <div className="text-[11px] text-slate-500">Single or batch upload · multi-select supported</div>
        </div>
        <input
          ref={fileRef}
          type="file"
          multiple
          className="sr-only"
          aria-label="Upload documents"
          onChange={(e) => handleFiles(e.target.files?.length ?? 0)}
        />
      </div>
      <div
        aria-disabled="true"
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-slate-50 text-[12px] text-slate-500"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>
        </svg>
        Free-text chat with The Professor is coming in the live product — for now, hand him documents.
      </div>
    </div>
  );
}


/* ---------- Portfolio: first-visit guided ---------- */

function PortfolioFirstVisit({
  showPropertyList,
  showUnitPicker,
  onOpenProperty,
  onOpenUnit,
  onPreviewQuestion,
}: {
  showPropertyList: boolean;
  showUnitPicker: boolean;
  onOpenProperty: (id: string) => void;
  onOpenUnit: (propertyId: string, unitId: string) => void;
  onPreviewQuestion: (q: string) => void;
}) {
  const questions = [
    "Which leases expire this year?",
    "What reviews are due?",
    "What is occupancy?",
    "Which assets carry risk?",
  ];
  return (
    <div className="space-y-3">


      {showPropertyList && (
        <div>
          <div className="text-[11px] uppercase tracking-wide text-slate-400 font-medium mb-1.5 mt-2">Properties</div>
          <div className="space-y-1.5">
            {PROPERTIES.map((p) => (
              <button
                key={p.id}
                onClick={() => onOpenProperty(p.id)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-slate-200 hover:border-[#7C3AED] hover:bg-[#F5F3FF] transition text-left focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
              >
                <div>
                  <div className="text-sm font-medium text-slate-900">{p.name}</div>
                  <div className="text-[11px] text-slate-500">
                    {p.area} · {p.standalone ? "single unit" : `${p.units.length} units`}
                  </div>
                </div>
                <span className="text-[#7C3AED] text-sm">→</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {showUnitPicker && (
        <div>
          <div className="text-[11px] uppercase tracking-wide text-slate-400 font-medium mb-1.5 mt-2">All units</div>
          <div className="space-y-3">
            {PROPERTIES.map((p) => (
              <div key={p.id}>
                <div className="text-[11px] font-medium text-slate-500 mb-1">{p.name}</div>
                <div className="space-y-1">
                  {p.units.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => onOpenUnit(p.id, u.id)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-slate-200 hover:border-[#7C3AED] hover:bg-[#F5F3FF] transition text-left focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
                    >
                      <div>
                        <div className="text-sm font-medium text-slate-900">{u.label}</div>
                        <div className="text-[11px] text-slate-500">
                          {u.status === "Let" ? (u.tenant ?? "Let") : "Vacant"}
                        </div>
                      </div>
                      <span className={`text-[10px] uppercase font-medium px-1.5 py-0.5 rounded ${u.status === "Let" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                        {u.status}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Portfolio: returning launcher ---------- */

type SearchResult =
  | { type: "property"; property: Property }
  | { type: "unit"; property: Property; unit: Unit };

function buildSearchResults(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results: SearchResult[] = [];
  PROPERTIES.forEach((p) => {
    const propText = `${p.name} ${p.area} ${p.address} ${p.postcode}`.toLowerCase();
    const propMatch = !p.standalone && propText.includes(q);
    if (propMatch) results.push({ type: "property", property: p });
    p.units.forEach((u) => {
      const unitText = `${u.label} ${u.tenant ?? ""} ${p.name} ${p.address} ${p.postcode}`.toLowerCase();
      if (unitText.includes(q)) results.push({ type: "unit", property: p, unit: u });
    });
  });
  return results;
}

function ReturningSearchPanel({
  query,
  setQuery,
  activeIdx,
  setActiveIdx,
  onOpenUnit,
  onOpenProperty,
  onHoverProperty,
  searchRef,
}: {
  query: string;
  setQuery: (s: string) => void;
  activeIdx: number;
  setActiveIdx: (n: number) => void;
  onOpenUnit: (propertyId: string, unitId: string) => void;
  onOpenProperty: (id: string) => void;
  onHoverProperty: (id: string | null) => void;
  searchRef: React.RefObject<HTMLInputElement>;
}) {
  const results = useMemo(() => buildSearchResults(query), [query]);

  useEffect(() => {
    searchRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setActiveIdx(0);
  }, [query, setActiveIdx]);

  const openResult = (r: SearchResult) => {
    if (r.type === "unit") onOpenUnit(r.property.id, r.unit.id);
    else onOpenProperty(r.property.id);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx(Math.min(activeIdx + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx(Math.max(activeIdx - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const r = results[activeIdx];
      if (r) openResult(r);
    }
  };

  // group results by building
  const grouped = useMemo(() => {
    const map = new Map<string, SearchResult[]>();
    results.forEach((r) => {
      const key = r.property.name;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    });
    return Array.from(map.entries());
  }, [results]);

  const recents: { propertyId: string; unitId: string; label: string; sub: string }[] = [
    { propertyId: "stanley", unitId: "stanley-f3", label: "Stanley House — Flat 3", sub: "1115 Finchley Road, NW11" },
    { propertyId: "hamilton", unitId: "hamilton-unit", label: "32 Hamilton Gardens", sub: "NW8" },
  ];

  // flat index lookup for highlighting active row
  let runningIdx = -1;

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-full border border-slate-200 bg-white focus-within:border-[#7C3AED] focus-within:ring-2 focus-within:ring-[#7C3AED]/20 transition">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
            <circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" />
          </svg>
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search a unit, property or tenant…"
            className="flex-1 outline-none text-sm bg-transparent placeholder:text-slate-400"
            aria-label="Search a unit, property or tenant"
            autoComplete="off"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-slate-400 hover:text-slate-700 text-lg leading-none"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {query && (
          <div className="mt-1.5 rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
            {results.length === 0 ? (
              <div className="px-3 py-4 text-xs text-slate-500">No matches. Try a tenant, unit or building name.</div>
            ) : (
              grouped.map(([building, items]) => (
                <div key={building}>
                  <div className="px-3 pt-2 pb-1 text-[10px] uppercase tracking-wide text-slate-400 bg-slate-50">{building}</div>
                  {items.map((r) => {
                    runningIdx += 1;
                    const idx = runningIdx;
                    const isActive = idx === activeIdx;
                    return (
                      <button
                        key={`${r.type}-${r.type === "unit" ? r.unit.id : r.property.id}-${idx}`}
                        onMouseEnter={() => {
                          setActiveIdx(idx);
                          onHoverProperty(r.property.id);
                        }}
                        onMouseLeave={() => onHoverProperty(null)}
                        onClick={() => openResult(r)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-left transition focus:outline-none ${
                          isActive ? "bg-[#F5F3FF]" : "hover:bg-slate-50"
                        }`}
                      >
                        <div>
                          <div className="text-sm font-medium text-slate-900">
                            {r.type === "unit" ? r.unit.label : r.property.name}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {r.type === "unit"
                              ? `${r.property.standalone ? r.property.address : `${r.property.name} · ${r.property.postcode}`}`
                              : `${r.property.area} · ${r.property.units.length} units`}
                          </div>
                        </div>
                        {r.type === "unit" && (
                          <span className={`text-[10px] uppercase font-medium px-1.5 py-0.5 rounded ${r.unit.status === "Let" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                            {r.unit.status}
                          </span>
                        )}
                        {r.type === "property" && (
                          <span className="text-[10px] uppercase font-medium px-1.5 py-0.5 rounded bg-[#EDE9FE] text-[#5B21B6]">Building</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {!query && (
        <>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-slate-400 font-medium mb-1.5">Jump back in</div>
            <div className="space-y-1.5">
              {recents.map((r) => {
                const p = PROPERTIES.find((x) => x.id === r.propertyId);
                return (
                  <button
                    key={r.unitId}
                    onClick={() => onOpenUnit(r.propertyId, r.unitId)}
                    onMouseEnter={() => onHoverProperty(r.propertyId)}
                    onMouseLeave={() => onHoverProperty(null)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-slate-200 hover:border-[#7C3AED] hover:bg-[#F5F3FF] transition text-left focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
                  >
                    <div>
                      <div className="text-sm font-medium text-slate-900">{r.label}</div>
                      <div className="text-[11px] text-slate-500">{r.sub}</div>
                    </div>
                    <span className="text-[#7C3AED] text-sm">→</span>
                  </button>
                );
              })}
            </div>
          </div>
          <p className="text-[12px] text-slate-500">Search above, or pick a unit on the map.</p>
        </>
      )}
    </div>
  );
}



/* ---------------- Map search overlay ---------------- */

function MapSearch({
  query,
  setQuery,
  onOpenUnit,
  onOpenProperty,
  onHoverProperty,
}: {
  query: string;
  setQuery: (q: string) => void;
  onOpenUnit: (propertyId: string, unitId: string) => void;
  onOpenProperty: (id: string) => void;
  onHoverProperty: (id: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const reduced = prefersReducedMotion();
  const results = useMemo(() => buildSearchResults(query), [query]);

  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => inputRef.current?.focus(), reduced ? 0 : 180);
      return () => window.clearTimeout(t);
    }
  }, [open, reduced]);

  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  // Click outside / Escape to collapse
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const openResult = (r: SearchResult) => {
    if (r.type === "unit") onOpenUnit(r.property.id, r.unit.id);
    else onOpenProperty(r.property.id);
    setOpen(false);
    setQuery("");
  };

  const collapse = () => {
    setOpen(false);
    setQuery("");
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      collapse();
      return;
    }
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx(Math.min(activeIdx + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx(Math.max(activeIdx - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const r = results[activeIdx];
      if (r) openResult(r);
    }
  };

  const grouped = useMemo(() => {
    const map = new Map<string, SearchResult[]>();
    results.forEach((r) => {
      const key = r.property.name;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    });
    return Array.from(map.entries());
  }, [results]);

  let runningIdx = -1;

  // The pill: stays anchored top-right; width animates from 40px → 360px.
  // The leading magnifier icon is the persistent affordance.
  const pillWidth = open ? 360 : 40;
  const transition = reduced ? "none" : "width 220ms cubic-bezier(0.22,1,0.36,1)";

  return (
    <div
      ref={wrapRef}
      className="absolute top-4 right-4 z-[450]"
      style={{ width: pillWidth, transition }}
    >
      <div
        className={`flex items-center h-10 rounded-full bg-white shadow-md border border-slate-200 overflow-hidden ${
          open ? "pl-2.5 pr-1.5" : ""
        }`}
      >
        <button
          type="button"
          onClick={() => {
            if (open) collapse();
            else setOpen(true);
          }}
          className="shrink-0 w-10 h-10 flex items-center justify-center text-slate-700 hover:text-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40 rounded-full transition"
          aria-label={open ? "Close search" : "Search properties, units, addresses"}
          aria-expanded={open}
          style={open ? { width: 28, height: 28 } : undefined}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" />
          </svg>
        </button>

        {open && (
          <>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Search a unit, property, address or postcode…"
              className="flex-1 min-w-0 outline-none text-sm bg-transparent placeholder:text-slate-400 px-1"
              aria-label="Search a unit, property, address or postcode"
              autoComplete="off"
            />
            <button
              type="button"
              onClick={collapse}
              className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
              aria-label="Close search"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </>
        )}
      </div>

      {open && (query || results.length > 0) && (
        <div
          className={`mt-2 w-full bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden ${
            reduced ? "" : "animate-fade-in"
          }`}
        >
          <div className="max-h-[360px] overflow-y-auto">
            {query && results.length === 0 && (
              <div className="px-3 py-4 text-xs text-slate-500">
                No matches. Try a tenant, unit, postcode or building name.
              </div>
            )}
            {query && grouped.map(([building, items]) => (
              <div key={building}>
                <div className="px-3 pt-2 pb-1 text-[10px] uppercase tracking-wide text-slate-400 bg-slate-50">{building}</div>
                {items.map((r) => {
                  runningIdx += 1;
                  const idx = runningIdx;
                  const isActive = idx === activeIdx;
                  return (
                    <button
                      key={`${r.type}-${r.type === "unit" ? r.unit.id : r.property.id}-${idx}`}
                      onMouseEnter={() => { setActiveIdx(idx); onHoverProperty(r.property.id); }}
                      onMouseLeave={() => onHoverProperty(null)}
                      onClick={() => openResult(r)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left transition focus:outline-none ${
                        isActive ? "bg-[#F5F3FF]" : "hover:bg-slate-50"
                      }`}
                    >
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {r.type === "unit" ? r.unit.label : r.property.name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {r.type === "unit"
                            ? `${r.property.standalone ? r.property.address : `${r.property.name} · ${r.property.postcode}`}`
                            : `${r.property.area} · ${r.property.units.length} units`}
                        </div>
                      </div>
                      {r.type === "unit" && (
                        <span className={`text-[10px] uppercase font-medium px-1.5 py-0.5 rounded ${r.unit.status === "Let" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                          {r.unit.status}
                        </span>
                      )}
                      {r.type === "property" && (
                        <span className="text-[10px] uppercase font-medium px-1.5 py-0.5 rounded bg-[#EDE9FE] text-[#5B21B6]">Building</span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}



/* ---------- Portfolio briefing (returning) ---------- */

const URGENCY_LABEL: Record<Urgency, string> = {
  now: "Needs you now",
  week: "This week",
  watch: "Keeping an eye on",
};

const TRIGGER_ICON: Record<TriggerType, string> = {
  review: "💬",
  break: "⏸",
  compliance: "✓",
  notice: "✉",
  expiry: "⌛",
};

function PortfolioBriefing({
  cards,
  choice,
  setChoice,
  expandedCardId,
  setExpandedCardId,
  onHoverCard,
  onOpenUnit,
  onOpenProperty,
  onApprove,
  onDefer,
  onDismiss,
  onPerform,
  onReview,
  onManualComplete,
  onOpenWorkflow,
}: {
  cards: ActionCard[];
  choice: null | "all" | "urgent" | "browse";
  setChoice: (c: null | "all" | "urgent" | "browse") => void;
  expandedCardId: string | null;
  setExpandedCardId: (id: string | null) => void;
  onHoverCard: (propertyId: string | null) => void;
  onOpenUnit: (propertyId: string, unitId: string, carryCardId?: string) => void;
  onOpenProperty: (propertyId: string, carryCardId?: string) => void;
  onApprove: (id: string) => void;
  onDefer: (id: string) => void;
  onDismiss: (id: string) => void;
  onPerform?: (id: string) => void;
  onReview?: (id: string) => void;
  onManualComplete?: (id: string, note: string) => void;
  onOpenWorkflow?: (ref: string) => void;
}) {
  const pending = cards.filter((c) => c.approvalState === "pending" || c.approvalState === "in_progress");
  const urgent = pending.filter((c) => c.urgency === "now");


  // No pending — nothing to show in briefing
  if (pending.length === 0) {
    return (
      <div className="text-[12px] text-slate-500 italic">Nothing on your desk today.</div>
    );
  }

  // Initial chip choice
  if (choice === null) {
    const chips: { label: string; value: "all" | "urgent" | "browse" }[] = [
      { label: `Show me what needs me (${pending.length})`, value: "all" },
      ...(urgent.length ? [{ label: `Just the urgent ${urgent.length === 1 ? "one" : `${urgent.length}`}`, value: "urgent" as const }] : []),
    ];

    return (
      <div className="flex flex-col items-end gap-1.5">
        <span className="text-[11px] text-slate-500 flex items-center gap-1">
          Tap to reply <span aria-hidden>↓</span>
        </span>
        <div className="flex gap-1.5 flex-wrap justify-end">
          {chips.map((c, i) => (
            <button
              key={c.value}
              onClick={() => setChoice(c.value)}
              autoFocus={i === 0}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7C3AED] ${
                i === 0
                  ? "bg-[#7C3AED] text-white hover:bg-[#6D28D9] animate-[pulse_1.6s_ease-in-out_infinite]"
                  : "bg-[#EDE9FE] text-[#5B21B6] hover:bg-[#DDD6FE] border border-[#DDD6FE]"
              }`}
            >
              {c.label}
              {i === 0 && <span aria-hidden className="animate-bounce">↓</span>}
            </button>
          ))}
        </div>
      </div>
    );
  }


  // "Browse" branch removed — property list no longer rendered at portfolio level


  const visible = choice === "urgent" ? urgent : pending;
  const groups: { key: Urgency; cards: ActionCard[] }[] = (["now", "week", "watch"] as Urgency[])
    .map((u) => ({ key: u, cards: visible.filter((c) => c.urgency === u) }))
    .filter((g) => g.cards.length > 0);

  const restCount = pending.length - visible.length;
  const archived = cards.filter((c) => c.approvalState === "approved" || c.approvalState === "deferred" || c.approvalState === "dismissed").length;


  return (
    <div className="space-y-5">

      <div className="flex items-center justify-between">
        <div className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">On your desk</div>
        <div className="flex items-center gap-2">
          {choice === "urgent" && pending.length > urgent.length && (
            <button
              onClick={() => setChoice("all")}
              className="text-[11px] text-[#7C3AED] hover:underline focus:outline-none focus:ring-2 focus:ring-[#7C3AED] rounded"
            >
              Show all ({pending.length})
            </button>
          )}
          <button
            onClick={() => setChoice(null)}
            className="text-[11px] text-slate-500 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] rounded"
          >
            Reset
          </button>
        </div>
      </div>

      {groups.map((g) => (
        <div key={g.key} className="space-y-3">
          <div className="sticky top-0 z-[1] bg-white/95 backdrop-blur py-1 text-[10px] uppercase tracking-wide font-semibold text-slate-500 border-b border-slate-100">
            {URGENCY_LABEL[g.key]} · {g.cards.length}
          </div>
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
            {g.cards.map((c) => (
              <ActionCardItem
                key={c.id}
                card={c}
                level="portfolio"
                expanded={expandedCardId === c.id}
                onToggleExpand={() => setExpandedCardId(expandedCardId === c.id ? null : c.id)}
                onHover={(on) => onHoverCard(on ? c.propertyId : null)}
                onOpenUnit={c.anchorLevel === "unit" && c.unitId ? () => onOpenUnit(c.propertyId, c.unitId!, c.id) : undefined}
                onOpenProperty={c.anchorLevel === "property" ? () => onOpenProperty(c.propertyId, c.id) : undefined}
                onApprove={() => onApprove(c.id)}
                onDefer={() => onDefer(c.id)}
                onDismiss={() => onDismiss(c.id)}
                onPerform={onPerform ? () => onPerform(c.id) : undefined}
                onReview={onReview ? () => onReview(c.id) : undefined}
                onManualComplete={onManualComplete ? (note) => onManualComplete(c.id, note) : undefined}
                onOpenWorkflow={onOpenWorkflow}
              />
            ))}
          </div>
        </div>
      ))}

      {restCount > 0 && choice === "urgent" && (
        <button
          onClick={() => setChoice("all")}
          className="w-full text-left text-[12px] text-slate-500 px-3 py-2 rounded-lg border border-dashed border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
        >
          {restCount} more this week →
        </button>
      )}

      {archived > 0 && (
        <div className="text-[11px] text-slate-400 italic px-1">
          {archived} {archived === 1 ? "item" : "items"} handled today.
        </div>
      )}
    </div>
  );
}

/* ---------- Property-level actions (same objects as portfolio briefing) ---------- */

function PropertyActions({
  cards,
  propertyName,
  expandedCardId,
  setExpandedCardId,
  carriedCardId,
  onOpenUnit,
  onApprove,
  onDefer,
  onDismiss,
  onPerform,
  onReview,
  onManualComplete,
  onOpenWorkflow,
}: {
  cards: ActionCard[];
  propertyName: string;
  expandedCardId: string | null;
  setExpandedCardId: (id: string | null) => void;
  carriedCardId?: string | null;
  onOpenUnit: (unitId: string, carryCardId?: string) => void;
  onApprove: (id: string) => void;
  onDefer: (id: string) => void;
  onDismiss: (id: string) => void;
  onPerform?: (id: string) => void;
  onReview?: (id: string) => void;
  onManualComplete?: (id: string, note: string) => void;
  onOpenWorkflow?: (ref: string) => void;
}) {
  const sortCarried = (arr: ActionCard[]) =>
    carriedCardId
      ? [...arr].sort((a, b) => (a.id === carriedCardId ? -1 : b.id === carriedCardId ? 1 : 0))
      : arr;
  const groups: { key: Urgency; cards: ActionCard[] }[] = (["now", "week", "watch"] as Urgency[])
    .map((u) => ({ key: u, cards: sortCarried(cards.filter((c) => c.urgency === u)) }))
    .filter((g) => g.cards.length > 0);
  return (
    <section aria-label={`Actions for ${propertyName}`} className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">On this building's desk · {cards.length}</div>
      </div>
      {groups.map((g) => (
        <div key={g.key} className="space-y-2.5">

          <div className="text-[10px] uppercase tracking-wide font-semibold text-slate-400">
            {URGENCY_LABEL[g.key]} · {g.cards.length}
          </div>
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
            {g.cards.map((c) => (
              <div key={c.id} className={c.id === carriedCardId ? "rounded-xl ring-2 ring-[#7C3AED]/50 ring-offset-2 ring-offset-white" : ""}>
                <ActionCardItem
                  card={c}
                  level="property"
                  expanded={expandedCardId === c.id}
                  onToggleExpand={() => setExpandedCardId(expandedCardId === c.id ? null : c.id)}
                  onHover={() => { /* no map hover at property level */ }}
                  onOpenUnit={c.anchorLevel === "unit" && c.unitId ? () => onOpenUnit(c.unitId!, c.id) : undefined}
                  onApprove={() => onApprove(c.id)}
                  onDefer={() => onDefer(c.id)}
                  onDismiss={() => onDismiss(c.id)}
                  onPerform={onPerform ? () => onPerform(c.id) : undefined}
                  onReview={onReview ? () => onReview(c.id) : undefined}
                  onManualComplete={onManualComplete ? (note) => onManualComplete(c.id, note) : undefined}
                  onOpenWorkflow={onOpenWorkflow}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

const PERFORMABLE_CARD_IDS = new Set<string>([
  "act-stanley-f8-review",
  "act-stanley-fra",
  "act-stanley-f5-break",
  "act-nugent-shop-effect",
]);

/* ---------------- Perform workspace (PA-004) ---------------- */

type PerformAdvance = (
  jumpTo: number | "complete" | "exit" | undefined,
  gateLabel: string,
  kind: string,
) => void;
type PerformCtx = {
  chosenRent: number | null;
  setChosenRent: (n: number) => void;
  advance: PerformAdvance;
  section13Template?: StepTemplate | null;
};
type PerformBeat = {
  id: string;
  stepKey: string;            // which progress-rail step this beat belongs to
  text: string;               // narration line
  detail?: React.ReactNode;   // optional rendered block (summary, draft preview)
  detailFn?: (ctx: PerformCtx) => React.ReactNode; // dynamic detail (uses live state)
  flag?: string;              // amber honesty flag
  gate?: {
    label: string;
    options: { label: string; kind: "approve" | "skip" | "defer" | "cancel" | "modify" | "continue"; nextBeatIdx?: number | "complete" | "exit" }[];
  };
  gateFn?: (ctx: PerformCtx) => React.ReactNode; // custom inline decision UI
};

const PA004_STEPS: { key: string; label: string }[] = [
  { key: "identify", label: "Identify" },
  { key: "gather", label: "Gather" },
  { key: "summary", label: "Review summary" },
  { key: "actions", label: "Recommended actions" },
  { key: "record", label: "Record" },
];

function PA004Summary() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 space-y-2.5 text-[12.5px] text-slate-700">
      <div>
        <div className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold mb-0.5">Current Position</div>
        <p>Flat 8, Stanley House · current rent £48,000 p.a. · tenancy ongoing.</p>
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold mb-0.5">Review Mechanism</div>
        <p>Open Market Rent review, dated March 2027 (confirmed from lease).</p>
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold mb-0.5">Notice Requirements</div>
        <p className="text-amber-800"><span aria-hidden>⚠ </span>Trigger notice period unclear in the lease — <em>flagged for human eye</em>. Default working assumption: not less than 3 months before review date.</p>
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold mb-0.5">Previous Review History</div>
        <p>No prior review on file for this tenancy (initial term).</p>
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold mb-0.5">Supporting Information Required</div>
        <p>Open market comparable evidence — to be sourced from listings (Rightmove, Zoopla, OnTheMarket, Foxtons, LonRes).</p>
      </div>
    </div>
  );
}

function PreparedPreview({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-2.5 text-[12px] text-slate-700">
      <div className="text-[10px] uppercase tracking-wide text-emerald-800 font-semibold mb-1">Prepared — {title}</div>
      <p className="whitespace-pre-wrap leading-relaxed">{body}</p>
      <div className="mt-1 text-[10.5px] text-slate-500 italic">Draft preview · placeholder content for prototype.</div>
    </div>
  );
}

function ComparablesScrapePreview() {
  const sources = [
    { name: "Rightmove", host: "rightmove.co.uk", count: 3, dot: "bg-emerald-500" },
    { name: "Zoopla", host: "zoopla.co.uk", count: 2, dot: "bg-violet-500" },
    { name: "OnTheMarket", host: "onthemarket.com", count: 2, dot: "bg-sky-500" },
    { name: "Foxtons", host: "foxtons.co.uk", count: 1, dot: "bg-amber-500" },
    { name: "LonRes", host: "lonres.com", count: 1, dot: "bg-rose-500" },
  ];
  const rows = [
    { addr: "Flat 4, Stanley House, NW8", beds: "1 bed", sqft: 612, rent: 49400, term: "12m", cond: "Refurbished", src: "Rightmove", date: "Jun 2026" },
    { addr: "Apt 12, Nugent Terrace, NW8", beds: "1 bed", sqft: 598, rent: 48100, term: "12m", cond: "Good", src: "Zoopla", date: "May 2026" },
    { addr: "Flat 9, Hamilton Court, NW8", beds: "1 bed", sqft: 640, rent: 50700, term: "24m", cond: "Refurbished", src: "OnTheMarket", date: "Apr 2026" },
    { addr: "Flat 2, Cunningham Pl, NW8", beds: "1 bed", sqft: 585, rent: 46800, term: "12m", cond: "Good", src: "Foxtons", date: "Mar 2026" },
    { addr: "Flat 7, Aberdeen Place, NW8", beds: "1 bed", sqft: 605, rent: 47950, term: "12m", cond: "Good", src: "Rightmove", date: "Feb 2026" },
    { addr: "Flat 3, Cochrane St, NW8", beds: "1 bed", sqft: 620, rent: 49250, term: "12m", cond: "Refurbished", src: "LonRes", date: "Jan 2026" },
  ];
  const rents = rows.map(r => r.rent);
  const low = Math.min(...rents);
  const high = Math.max(...rents);
  const median = [...rents].sort((a,b)=>a-b)[Math.floor(rents.length/2)];
  const fmt = (n: number) => `£${n.toLocaleString()}`;
  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-2.5 text-[12px] text-slate-700">
      <div className="text-[10px] uppercase tracking-wide text-emerald-800 font-semibold mb-2">
        Retrieved — Open market comparables · Marylebone NW8 · last 12 months
      </div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {sources.map(s => (
          <span key={s.name} className="inline-flex items-center gap-1 rounded-full bg-white border border-slate-200 px-1.5 py-0.5 text-[10.5px] text-slate-600">
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} aria-hidden />
            <span className="font-medium text-slate-700">{s.name}</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500">{s.count}</span>
          </span>
        ))}
        <span className="inline-flex items-center gap-1 rounded-full bg-white border border-slate-200 px-1.5 py-0.5 text-[10.5px] text-slate-500">
          9 found · 6 like-for-like
        </span>
      </div>
      <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
        <table className="w-full text-[11px]">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="text-left font-medium px-2 py-1">Address</th>
              <th className="text-left font-medium px-2 py-1">Size</th>
              <th className="text-right font-medium px-2 py-1">Rent p.a.</th>
              <th className="text-left font-medium px-2 py-1">Term</th>
              <th className="text-left font-medium px-2 py-1">Condition</th>
              <th className="text-left font-medium px-2 py-1">Source</th>
              <th className="text-left font-medium px-2 py-1">Listed</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className={i % 2 ? "bg-slate-50/40" : ""}>
                <td className="px-2 py-1 text-slate-700">{r.addr}</td>
                <td className="px-2 py-1 text-slate-600">{r.sqft} sqft</td>
                <td className="px-2 py-1 text-right font-medium text-slate-800">{fmt(r.rent)}</td>
                <td className="px-2 py-1 text-slate-600">{r.term}</td>
                <td className="px-2 py-1 text-slate-600">{r.cond}</td>
                <td className="px-2 py-1 text-slate-600">{r.src}</td>
                <td className="px-2 py-1 text-slate-500">{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-600">
        <span><span className="text-slate-500">Range</span> <span className="font-medium text-slate-800">{fmt(low)} – {fmt(high)}</span></span>
        <span><span className="text-slate-500">Median</span> <span className="font-medium text-slate-800">{fmt(median)}</span></span>
        <span><span className="text-slate-500">Current passing</span> <span className="font-medium text-slate-800">£48,000</span></span>
        <span><span className="text-slate-500">Indicative suggestion</span> <span className="font-medium text-emerald-700">£49,000 – £50,000</span></span>
      </div>
      <div className="mt-1 text-[10.5px] text-slate-500 italic">
        Simulated retrieval · placeholder data from Rightmove, Zoopla, OnTheMarket, Foxtons, LonRes for prototype.
      </div>
    </div>
  );
}

function buildPA004Beats(section13Template: StepTemplate | null = null): PerformBeat[] {
  // Indexed linearly; gates jump by index to keep authoring simple.
  return [
    {
      id: "b1",
      stepKey: "identify",
      text: "A rent review is coming up on Flat 8 — about 180 days out (March 2027). Want me to prepare it?",
      gate: {
        label: "How would you like to proceed?",
        options: [
          { label: "Prepare review summary", kind: "approve", nextBeatIdx: 1 },
          { label: "Defer", kind: "defer", nextBeatIdx: "exit" },
          { label: "Cancel", kind: "cancel", nextBeatIdx: "exit" },
        ],
      },
    },
    { id: "b2", stepKey: "gather", text: "Pulling review details — review basis is Open Market Rent, dated March 2027." },
    { id: "b3", stepKey: "gather", text: "Current rent confirmed: £48,000 per annum (Flat 8)." },
    { id: "b4", stepKey: "gather", text: "Tenancy history: no prior review on file — this is the first scheduled review." },
    {
      id: "b5",
      stepKey: "gather",
      text: "Notice requirements: I can't confirm the precise trigger window from the lease wording.",
      flag: "Flagging notice period as unclear — needs your eye.",
    },
    { id: "b6", stepKey: "gather", text: "Parties confirmed: landlord and current tenant on file." },
    { id: "b7", stepKey: "gather", text: "Open market basis — comparable evidence will need to be sourced before any figure is proposed." },
    {
      id: "b8",
      stepKey: "summary",
      text: "Here's the assembled summary. Take a look.",
      detail: <PA004Summary />,
      gate: {
        label: "Review the summary",
        options: [
          { label: "Looks right, continue", kind: "continue", nextBeatIdx: 8 },
          { label: "Modify", kind: "modify", nextBeatIdx: 8 },
          { label: "Defer", kind: "defer", nextBeatIdx: "exit" },
        ],
      },
    },
    {
      id: "b10",
      stepKey: "actions",
      text: "Next: gather comparable evidence from the open market (last 12 months, like-for-like).",
      gate: {
        label: "Gather comparable evidence?",
        options: [
          { label: "Approve", kind: "approve", nextBeatIdx: 9 },
          { label: "Skip", kind: "skip", nextBeatIdx: 12 },
        ],
      },
    },
    {
      id: "b10b",
      stepKey: "actions",
      text: "Comparable search prepared — querying open market sources.",
      detail: <PreparedPreview title="Comparable evidence search" body={"Scope: Marylebone NW8, residential lets, 1-bed flats, last 12 months.\nSources: Rightmove, Zoopla, OnTheMarket, Foxtons, LonRes.\nDeliverable: shortlist of 5–8 comparables with rent, term, condition notes."} />,
    },
    {
      id: "b10c",
      stepKey: "actions",
      text: "Searching open sources now — Rightmove, Zoopla, OnTheMarket, Foxtons, LonRes.",
    },
    {
      id: "b10d",
      stepKey: "actions",
      text: "9 listings retrieved · 6 like-for-like after filtering (1-bed, NW8, last 12 months).",
      detail: <ComparablesScrapePreview />,
    },

    // ── Section 13 closing sequence ──────────────────────────────────────
    {
      id: "s13_intro",
      stepKey: "actions",
      text: "Based on the comparables, I'd suggest a new rent of £49,500 per annum — the market median, an uplift of £1,500 (+3.1%) on the current £48,000. Shall I prepare the Section 13 notice with that figure?",
      gateFn: (ctx) => <SuggestedRentGate ctx={ctx} yesIdx={14} noIdx={13} />,
    },
    {
      id: "s13_blank_ack",
      stepKey: "actions",
      text: "Understood. I'll prepare the Section 13 notice with the new rent left blank — you can write the figure in before it's served.",
    },
    {
      id: "s13_prepared",
      stepKey: "actions",
      text: section13Template && section13Template.mode === "own"
        ? `Prepared — using your template (${section13Template.filename ?? "your document"}), filled with the case details.`
        : "Prepared — using Hobson's standard Section 13.",
      detailFn: (ctx) => <Section13NoticePreview chosenRent={ctx.chosenRent} template={ctx.section13Template ?? null} />,
    },
    {
      id: "s13_delivery",
      stepKey: "actions",
      text: "Shall I email this, or save it to the file?",
      gate: {
        label: "How shall I deliver it?",
        options: [
          { label: "Email", kind: "approve", nextBeatIdx: 16 },
          { label: "Save to file", kind: "continue", nextBeatIdx: 18 },
        ],
      },
    },
    {
      id: "s13_email_prepared",
      stepKey: "actions",
      text: "Prepared.",
      detailFn: (ctx) => <Section13EmailPreview chosenRent={ctx.chosenRent} />,
      gateFn: (ctx) => <AddToOutlookGate advance={ctx.advance} nextIdx={17} />,
    },
    {
      id: "s13_close_email",
      stepKey: "record",
      text: "Done. The notice is prepared and ready to send.",
      gate: {
        label: "Finish",
        options: [{ label: "Record & close", kind: "continue", nextBeatIdx: "complete" }],
      },
    },
    {
      id: "s13_close_save",
      stepKey: "record",
      text: "Saved to the file. The Section 13 notice is on the Flat 8 record.",
      gate: {
        label: "Finish",
        options: [{ label: "Record & close", kind: "continue", nextBeatIdx: "complete" }],
      },
    },
  ];
}

/* ---------------- Suggested rent (Yes/No) gate ---------------- */
function SuggestedRentGate({ ctx, yesIdx, noIdx }: { ctx: PerformCtx; yesIdx: number; noIdx: number }) {
  const suggested = 49500;
  return (
    <div className="pl-[44px]">
      <div className="inline-block max-w-[640px] rounded-2xl border border-[#DDD6FE] bg-[#F5F3FF] px-3 py-2.5 space-y-2">
        <div className="text-[11px] uppercase tracking-wide text-[#5B21B6] font-semibold">
          Awaiting your instruction
        </div>
        <div className="text-[12px] text-slate-700">
          I won't prepare anything until you click Continue.
        </div>
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          <button
            autoFocus
            onClick={() => { ctx.setChosenRent(suggested); ctx.advance(yesIdx, `Continue — prepare at ${fmtGBP(suggested)}`, "approve"); }}
            className="text-xs px-3 py-1.5 rounded-full bg-[#7C3AED] text-white hover:bg-[#6D28D9] focus:outline-none focus:ring-2 focus:ring-[#7C3AED] transition"
          >
            Continue — prepare at £49,500
          </button>
          <button
            onClick={() => { ctx.setChosenRent(null); ctx.advance(noIdx, "Continue — leave new rent blank", "modify"); }}
            className="text-xs px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-[#7C3AED] hover:bg-[#FAF9FF] focus:outline-none focus:ring-2 focus:ring-[#7C3AED] transition"
          >
            Continue — leave it blank
          </button>
        </div>
      </div>
    </div>
  );
}


/* ---------------- PA-004 Section 13 components ---------------- */

const FLAT8_CURRENT_RENT = 48000;
const FLAT8_MIN_UPLIFT_PCT = 5;
const FLAT8_MIN_UPLIFT = Math.round(FLAT8_CURRENT_RENT * (1 + FLAT8_MIN_UPLIFT_PCT / 100));
const FLAT8_MARKET = 49500;
const FLAT8_LANDLORD = "James Okoro";
const FLAT8_TENANT = "Sarah Mitchell";
const FLAT8_ADDR = "Flat 8, Stanley House, 18 Cunningham Place, London NW8 7JX";
const FLAT8_EFFECTIVE = "25 March 2027";
const FLAT8_NOTICE_DATE = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
const fmtGBP = (n: number) => `£${n.toLocaleString("en-GB")}`;

function RentChoiceGate({ ctx, nextIdx }: { ctx: PerformCtx; nextIdx: number }) {
  const [customMode, setCustomMode] = useState(false);
  const [custom, setCustom] = useState<string>("");
  const choose = (amount: number, label: string) => {
    ctx.setChosenRent(amount);
    ctx.advance(nextIdx, label, "approve");
  };
  const submitCustom = () => {
    const n = Number(custom.replace(/[^0-9.]/g, ""));
    if (!n || n < FLAT8_CURRENT_RENT) return;
    choose(Math.round(n), `Custom amount ${fmtGBP(Math.round(n))}`);
  };
  const options = [
    {
      amount: FLAT8_MIN_UPLIFT,
      title: `${fmtGBP(FLAT8_MIN_UPLIFT)} per annum`,
      basis: `the agreed minimum uplift (${FLAT8_MIN_UPLIFT_PCT}% on the current ${fmtGBP(FLAT8_CURRENT_RENT)}).`,
    },
    {
      amount: FLAT8_MARKET,
      title: `${fmtGBP(FLAT8_MARKET)} per annum`,
      basis: "in line with the open-market comparables gathered (median £49,250).",
    },
  ];
  return (
    <div className="pl-[44px]">
      <div className="inline-block max-w-[640px] rounded-2xl border border-[#DDD6FE] bg-[#F5F3FF] px-3 py-2.5 space-y-2">
        <div className="text-[11px] uppercase tracking-wide text-[#5B21B6] font-semibold">Choose the new rent to propose</div>
        <div className="space-y-1.5">
          {options.map((o, i) => (
            <button
              key={o.amount}
              autoFocus={i === 0}
              onClick={() => choose(o.amount, `New rent ${fmtGBP(o.amount)}`)}
              className="w-full text-left px-3 py-2 rounded-lg bg-white border border-slate-200 hover:border-[#7C3AED] hover:bg-[#FAF9FF] focus:outline-none focus:ring-2 focus:ring-[#7C3AED] transition"
            >
              <div className="text-[13px] font-semibold text-slate-900">{o.title}</div>
              <div className="text-[11.5px] text-slate-600 mt-0.5">{o.basis}</div>
            </button>
          ))}
          {!customMode ? (
            <button
              onClick={() => setCustomMode(true)}
              className="w-full text-left px-3 py-2 rounded-lg bg-white border border-dashed border-slate-300 hover:border-[#7C3AED] hover:bg-[#FAF9FF] focus:outline-none focus:ring-2 focus:ring-[#7C3AED] transition"
            >
              <div className="text-[13px] font-semibold text-slate-900">A figure of your own</div>
              <div className="text-[11.5px] text-slate-600 mt-0.5">Enter a custom annual rent.</div>
            </button>
          ) : (
            <div className="px-3 py-2 rounded-lg bg-white border border-slate-200">
              <label htmlFor="custom-rent" className="block text-[11.5px] text-slate-600 mb-1">Custom annual rent (£)</label>
              <div className="flex gap-1.5">
                <input
                  id="custom-rent"
                  autoFocus
                  inputMode="decimal"
                  value={custom}
                  onChange={(e) => setCustom(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") submitCustom(); }}
                  placeholder="e.g. 51000"
                  className="flex-1 text-[13px] px-2 py-1.5 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                />
                <button
                  onClick={submitCustom}
                  className="text-xs px-3 py-1.5 rounded-full bg-[#7C3AED] text-white hover:bg-[#6D28D9] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                >
                  Use this
                </button>
                <button
                  onClick={() => { setCustomMode(false); setCustom(""); }}
                  className="text-xs px-2 py-1.5 rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Section13NoticePreview({ chosenRent, template }: { chosenRent: number | null; template?: StepTemplate | null }) {
  const hasRent = chosenRent !== null;
  const increase = hasRent ? (chosenRent as number) - FLAT8_CURRENT_RENT : 0;
  const pct = hasRent ? ((increase / FLAT8_CURRENT_RENT) * 100).toFixed(1) : "";
  const ownTpl = template && template.mode === "own";
  return (
    <div className={`rounded-lg border ${ownTpl ? "border-[#7C3AED]/40 bg-[#F5F3FF]" : "border-emerald-200 bg-emerald-50/60"} p-3 text-[12px] text-slate-700`}>
      <div className={`text-[10px] uppercase tracking-wide ${ownTpl ? "text-[#5B21B6]" : "text-emerald-800"} font-semibold mb-2 flex items-center justify-between gap-2`}>
        <span>Prepared — Section 13 Notice</span>
        {ownTpl && <span className="normal-case tracking-normal font-normal text-[10.5px]">from your template: <span className="font-medium">{template?.filename}</span></span>}
      </div>
      <div className="rounded-md bg-white border border-slate-200 p-3 space-y-2.5 text-[12px] leading-relaxed">
        <div className="text-center">
          <div className="text-[10.5px] uppercase tracking-wide text-slate-500 font-semibold">Form 4</div>
          <div className="font-semibold text-slate-900 text-[12.5px]">Landlord's Notice proposing a new rent</div>
          <div className="text-[11px] text-slate-600">under an Assured Periodic Tenancy or Assured Shorthold Periodic Tenancy</div>
          <div className="text-[10.5px] text-slate-500 mt-0.5">Section 13(2), Housing Act 1988</div>
        </div>
        <div className="grid grid-cols-[110px_1fr] gap-x-3 gap-y-1.5 text-[12px]">
          <div className="text-slate-500">1. Tenant(s)</div><div className="text-slate-800">{FLAT8_TENANT}</div>
          <div className="text-slate-500">2. Landlord</div><div className="text-slate-800">{FLAT8_LANDLORD}</div>
          <div className="text-slate-500">3. Property</div><div className="text-slate-800">{FLAT8_ADDR}</div>
          <div className="text-slate-500">4. Current rent</div><div className="text-slate-800">{fmtGBP(FLAT8_CURRENT_RENT)} per annum (payable monthly in advance)</div>
          <div className="text-slate-500">5. New rent</div>{hasRent ? (
            <div className="text-slate-900 font-semibold">{fmtGBP(chosenRent as number)} per annum <span className="text-slate-500 font-normal">(+{fmtGBP(increase)} / +{pct}%)</span></div>
          ) : (
            <div className="text-slate-900 font-semibold"><span className="inline-block min-w-[140px] border-b-2 border-dashed border-slate-400 text-slate-400">£ ______</span> per annum <span className="text-slate-500 font-normal italic">(to be entered before serving)</span></div>
          )}
          <div className="text-slate-500">6. Effective from</div><div className="text-slate-800">{FLAT8_EFFECTIVE} (start of the new rental period)</div>
          <div className="text-slate-500">7. Notice date</div><div className="text-slate-800">{FLAT8_NOTICE_DATE}</div>
        </div>
        <div className="text-[11.5px] text-slate-600 border-t border-slate-100 pt-2">
          The landlord proposes that the new rent shown at item 5 shall take effect from the date at item 6. If the tenant
          does not agree, the tenant may, before that date, refer this notice to the First-tier Tribunal (Property Chamber)
          for determination of a market rent in accordance with section 14 of the Housing Act 1988.
        </div>
        <div className="text-[11px] text-slate-500 grid grid-cols-2 gap-2 border-t border-slate-100 pt-2">
          <div><div className="text-slate-400">Signed (Landlord)</div><div className="italic text-slate-700">{FLAT8_LANDLORD}</div></div>
          <div><div className="text-slate-400">Date</div><div className="text-slate-700">{FLAT8_NOTICE_DATE}</div></div>
        </div>
      </div>
      <div className="mt-1.5 text-[10.5px] text-slate-500 italic">Draft preview · placeholder content for prototype.</div>
    </div>
  );
}

function Section13EmailPreview({ chosenRent }: { chosenRent: number | null }) {
  const rentPhrase = chosenRent !== null ? <><strong>{fmtGBP(chosenRent)} per annum</strong></> : <em className="text-slate-500">[new rent to be entered]</em>;
  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-3 text-[12px] text-slate-700">
      <div className="text-[10px] uppercase tracking-wide text-emerald-800 font-semibold mb-2">
        Prepared — Email
      </div>
      <div className="rounded-md bg-white border border-slate-200 text-[12px]">
        <div className="grid grid-cols-[60px_1fr] gap-x-3 gap-y-1 px-3 py-2 border-b border-slate-100">
          <div className="text-slate-500">To</div><div className="text-slate-800">{FLAT8_TENANT} &lt;s.mitchell@example.co.uk&gt;</div>
          <div className="text-slate-500">From</div><div className="text-slate-800">{FLAT8_LANDLORD} &lt;james@hobsonschoice.ai&gt;</div>
          <div className="text-slate-500">Subject</div><div className="text-slate-900 font-medium">Section 13 Notice — Flat 8, Stanley House</div>
        </div>
        <div className="px-3 py-2.5 leading-relaxed text-slate-700 space-y-2 text-[12px]">
          <p>Dear {FLAT8_TENANT.split(" ")[0]},</p>
          <p>Please find attached a Section 13 notice proposing a new rent of {rentPhrase} for Flat 8, Stanley House, taking effect from {FLAT8_EFFECTIVE}.</p>
          <p>Do let me know if you have any questions; I'm happy to discuss.</p>
          <p>Kind regards,<br/>{FLAT8_LANDLORD}</p>
        </div>
        <div className="px-3 py-2 border-t border-slate-100 bg-slate-50/60">
          <div className="text-[10.5px] uppercase tracking-wide text-slate-500 font-semibold mb-1">Attachment</div>
          <div className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-white border border-slate-200 text-[11.5px] text-slate-700">
            <span aria-hidden className="inline-flex items-center justify-center w-5 h-5 rounded bg-rose-100 text-rose-700 text-[9px] font-bold">PDF</span>
            <span>Section 13 Notice — Flat 8, Stanley House.pdf</span>
            <span className="text-slate-400">· 142 KB</span>
          </div>
        </div>
      </div>
      <div className="mt-1.5 text-[10.5px] text-slate-500 italic">Editable preview · placeholder content for prototype.</div>
    </div>
  );
}

function AddToOutlookGate({ advance, nextIdx }: { advance: PerformAdvance; nextIdx: number }) {
  const [queued, setQueued] = useState(false);
  if (queued) {
    return (
      <div className="pl-[44px]">
        <div className="inline-flex items-center gap-2 max-w-[640px] rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-[12px] text-emerald-900">
          <span aria-hidden>✓</span>
          <span>Queued to Outlook — open your draft to send.</span>
        </div>
      </div>
    );
  }
  return (
    <div className="pl-[44px]">
      <div className="inline-block max-w-[640px] rounded-2xl border border-[#DDD6FE] bg-[#F5F3FF] px-3 py-2.5 space-y-2">
        <div className="text-[11px] uppercase tracking-wide text-[#5B21B6] font-semibold">Send via Outlook</div>
        <div className="flex flex-wrap gap-1.5">
          <button
            autoFocus
            onClick={() => {
              setQueued(true);
              setTimeout(() => advance(nextIdx, "Add to Outlook", "approve"), 700);
            }}
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-[#7C3AED] text-white hover:bg-[#6D28D9] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M4 4h16v16H4z"/><path d="m4 7 8 6 8-6"/></svg>
            Add to Outlook
          </button>
          <button
            onClick={() => advance(nextIdx, "Skip Outlook", "skip")}
            className="text-xs px-3 py-1.5 rounded-full text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            Not now
          </button>
        </div>
        <div className="text-[10.5px] text-slate-500 italic">Prototype placeholder — would open a draft in Outlook with the notice attached.</div>
      </div>
    </div>
  );
}

/* ---------------- Perform workspace (PA-001 fire alarm) ---------------- */

const PA001_STEPS: { key: string; label: string }[] = [
  { key: "identify", label: "Identify" },
  { key: "gather", label: "Gather parties" },
  { key: "draft", label: "Draft notices" },
  { key: "send", label: "Send" },
  { key: "record", label: "Record" },
];

type FireAlarmTenant = {
  unitId: string;
  unitLabel: string;
  tenantName: string | null; // null = no contact on file
  email: string | null;
};

// Stanley House occupied units (Let). F8 and Shop are Vacant — excluded entirely.
// F7 deliberately has no contact on file — flagged, not invented.
const STANLEY_FIRE_ALARM_TENANTS: FireAlarmTenant[] = [
  { unitId: "stanley-f1",  unitLabel: "Flat 1",  tenantName: "A. Whitcombe",   email: "a.whitcombe@example.com" },
  { unitId: "stanley-f2",  unitLabel: "Flat 2",  tenantName: "R. Patel",       email: "r.patel@example.com" },
  { unitId: "stanley-f3",  unitLabel: "Flat 3",  tenantName: "M. Lindqvist",   email: "m.lindqvist@example.com" },
  { unitId: "stanley-f4",  unitLabel: "Flat 4",  tenantName: "J. & S. Okafor", email: "okafor.household@example.com" },
  { unitId: "stanley-f5",  unitLabel: "Flat 5",  tenantName: "D. Aronsson",    email: "d.aronsson@example.com" },
  { unitId: "stanley-f6",  unitLabel: "Flat 6",  tenantName: "K. Mendes",      email: "k.mendes@example.com" },
  { unitId: "stanley-f7",  unitLabel: "Flat 7",  tenantName: null,             email: null },
  { unitId: "stanley-f9",  unitLabel: "Flat 9",  tenantName: "P. Chaudhuri",   email: "p.chaudhuri@example.com" },
  { unitId: "stanley-f10", unitLabel: "Flat 10", tenantName: "L. Hartmann",    email: "l.hartmann@example.com" },
  { unitId: "stanley-f11", unitLabel: "Flat 11", tenantName: "T. Nguyen",      email: "t.nguyen@example.com" },
];
const STANLEY_VACANT_UNITS = ["Flat 8", "Shop"];

const FIRE_ALARM_CONTRACTOR = {
  name: "SafeGuard Fire & Alarm Ltd",
  contact: "Stuart Reilly",
  email: "stuart@safeguard-fa.co.uk",
  phone: "020 7946 0118",
};

const FIRE_ALARM_VISIT_WINDOW = "Tue 7 – Thu 9 July 2026, between 9am and 1pm";

function FireAlarmFinding() {
  const occupied = STANLEY_FIRE_ALARM_TENANTS.length;
  const withContact = STANLEY_FIRE_ALARM_TENANTS.filter((t) => t.email).length;
  const missing = STANLEY_FIRE_ALARM_TENANTS.filter((t) => !t.email);
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 space-y-2.5 text-[12.5px] text-slate-700">
      <div>
        <div className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold mb-0.5">Scope</div>
        <p>Building-wide. The fire alarm system serves Stanley House as a whole — one inspection covers every unit.</p>
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold mb-0.5">Due</div>
        <p>Certificate expires 12 July 2026 — about 18 days away (confirmed from last year's certificate).</p>
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold mb-0.5">Contractor</div>
        <p>{FIRE_ALARM_CONTRACTOR.name} · {FIRE_ALARM_CONTRACTOR.contact} · {FIRE_ALARM_CONTRACTOR.email} · {FIRE_ALARM_CONTRACTOR.phone}</p>
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold mb-0.5">Tenants to notify</div>
        <p>
          {occupied} occupied units across the building — I'll prepare an access notice for each current tenant.
          {" "}{STANLEY_VACANT_UNITS.length > 0 && <>Vacant units excluded: {STANLEY_VACANT_UNITS.join(", ")}.</>}
        </p>
        {missing.length > 0 && (
          <p className="mt-1 text-amber-800">
            <span aria-hidden>⚠ </span>
            {withContact} of {occupied} have a contact on file. Missing: {missing.map((m) => m.unitLabel).join(", ")} — I won't invent contacts; flagged for you.
          </p>
        )}
      </div>
    </div>
  );
}

function ContractorDraft() {
  return (
    <PreparedPreview
      title="Contractor email (1)"
      body={`To: ${FIRE_ALARM_CONTRACTOR.contact} <${FIRE_ALARM_CONTRACTOR.email}>\nSubject: Annual fire alarm inspection — Stanley House, 1115 Finchley Road, NW11\n\nHi ${FIRE_ALARM_CONTRACTOR.contact.split(" ")[0]},\n\nOur certificate for Stanley House expires on 12 July 2026. Please book the annual inspection within the window: ${FIRE_ALARM_VISIT_WINDOW}.\n\nBuilding access: main entrance on Finchley Road, concierge on the door 9am–5pm. 10 occupied units across Flats 1–11 plus the ground-floor Shop (currently vacant). We'll notify each tenant of the access window.\n\nThanks,\n[You]`}
    />
  );
}

function TenantNoticesGroup({ tenants }: { tenants: FireAlarmTenant[] }) {
  const withContact = tenants.filter((t) => t.email);
  const [openId, setOpenId] = useState<string | null>(null);
  const [sharedWindow, setSharedWindow] = useState<string>(FIRE_ALARM_VISIT_WINDOW);
  const [overrides, setOverrides] = useState<Record<string, string>>({});

  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-2.5 text-[12px] text-slate-700">
      <div className="text-[10px] uppercase tracking-wide text-emerald-800 font-semibold mb-1.5">
        Prepared — Tenant access notices ({withContact.length}) · one per occupied unit
      </div>

      <div className="mb-2 bg-white border border-slate-200 rounded-md p-2">
        <label className="block text-[10.5px] uppercase tracking-wide text-slate-500 font-semibold mb-1">
          Shared edit — visit window (applies to all notices)
        </label>
        <input
          type="text"
          value={sharedWindow}
          onChange={(e) => setSharedWindow(e.target.value)}
          className="w-full text-[12px] px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40"
          aria-label="Shared visit window"
        />
      </div>

      <ul className="divide-y divide-emerald-200/70 bg-white border border-slate-200 rounded-md">
        {withContact.map((t) => {
          const isOpen = openId === t.unitId;
          const body = overrides[t.unitId] ?? defaultTenantNoticeBody(t, sharedWindow);
          return (
            <li key={t.unitId}>
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : t.unitId)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-3 px-2.5 py-1.5 text-left hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40 rounded"
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold" aria-hidden>✓</span>
                  <span className="font-medium text-slate-800 truncate">{t.unitLabel}</span>
                  <span className="text-slate-500 truncate">· {t.tenantName} · {t.email}</span>
                </span>
                <span className="text-[11px] text-[#7C3AED]">{isOpen ? "Hide" : "View / edit"}</span>
              </button>
              {isOpen && (
                <div className="px-2.5 pb-2">
                  <textarea
                    value={body}
                    onChange={(e) => setOverrides((o) => ({ ...o, [t.unitId]: e.target.value }))}
                    rows={7}
                    className="w-full text-[12px] font-mono px-2 py-1.5 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40 whitespace-pre-wrap"
                    aria-label={`Notice body for ${t.unitLabel}`}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <div className="mt-1.5 text-[10.5px] text-slate-500 italic">Drafts grouped for review · individual edits allowed · shared edits apply to all.</div>
    </div>
  );
}

function defaultTenantNoticeBody(t: FireAlarmTenant, window: string): string {
  return `To: ${t.tenantName} <${t.email}>\nSubject: Access notice — annual fire alarm inspection, ${t.unitLabel}, Stanley House\n\nHi ${(t.tenantName ?? "").split(" ")[0] || "there"},\n\nWe're carrying out the annual fire alarm inspection at Stanley House. The engineer will need brief access to ${t.unitLabel} during the window: ${window}.\n\nThe visit takes around 15 minutes per unit. You don't need to be present if you're happy for the concierge to escort the engineer — just reply to let us know.\n\nThanks,\n[Your landlord]`;
}

function buildPA001Beats(): PerformBeat[] {
  const withContact = STANLEY_FIRE_ALARM_TENANTS.filter((t) => t.email);
  const missing = STANLEY_FIRE_ALARM_TENANTS.filter((t) => !t.email);
  return [
    {
      id: "fa1",
      stepKey: "identify",
      text: `The fire alarm certificate for Stanley House expires on 12 July 2026 — about 18 days away. It covers the whole building. Want me to prepare the inspection?`,
      gate: {
        label: "How would you like to proceed?",
        options: [
          { label: "Prepare", kind: "approve", nextBeatIdx: 1 },
          { label: "Defer", kind: "defer", nextBeatIdx: "exit" },
          { label: "Cancel", kind: "cancel", nextBeatIdx: "exit" },
        ],
      },
    },
    {
      id: "fa2",
      stepKey: "gather",
      text: `Gathering the parties. Contractor on file: ${FIRE_ALARM_CONTRACTOR.name} (${FIRE_ALARM_CONTRACTOR.contact}).`,
    },
    {
      id: "fa3",
      stepKey: "gather",
      text: `Stanley House has ${STANLEY_FIRE_ALARM_TENANTS.length} occupied units — I'll notify all current tenants about access. Vacant units (${STANLEY_VACANT_UNITS.join(", ")}) have no tenant to notify, so I'm skipping those.`,
      flag: missing.length > 0
        ? `I couldn't find access contacts for ${missing.map((m) => m.unitLabel).join(" and ")} — I'll draft for the ${withContact.length} I do have and flag the rest for you to handle separately.`
        : undefined,
    },
    {
      id: "fa4",
      stepKey: "gather",
      text: "Here's the building-wide finding.",
      detail: <FireAlarmFinding />,
      gate: {
        label: "Shall I draft the contractor request and the tenant access notices?",
        options: [
          { label: "Draft them", kind: "approve", nextBeatIdx: 4 },
          { label: "Defer", kind: "defer", nextBeatIdx: "exit" },
        ],
      },
    },
    {
      id: "fa5",
      stepKey: "draft",
      text: "Drafted — one contractor email, plus an access notice per occupied unit. Each notice names the unit and the same visit window.",
      detail: (
        <div className="space-y-2">
          <ContractorDraft />
          <TenantNoticesGroup tenants={STANLEY_FIRE_ALARM_TENANTS} />
        </div>
      ),
      gate: {
        label: `Send 1 contractor email and ${withContact.length} tenant notice${withContact.length === 1 ? "" : "s"}?`,
        options: [
          { label: `Send all (1 + ${withContact.length})`, kind: "approve", nextBeatIdx: 5 },
          { label: "Modify drafts", kind: "modify", nextBeatIdx: 4 },
          { label: "Defer", kind: "defer", nextBeatIdx: "exit" },
        ],
      },
    },
    {
      id: "fa6",
      stepKey: "send",
      text: `Sent. Contractor request to ${FIRE_ALARM_CONTRACTOR.contact} at ${FIRE_ALARM_CONTRACTOR.name}; access notices to all ${withContact.length} current tenants (${withContact.map((t) => t.unitLabel).join(", ")}).`,
      flag: missing.length > 0
        ? `${missing.map((m) => m.unitLabel).join(", ")} still need access notice — no contact on file. Handle separately?`
        : undefined,
    },

    {
      id: "fa7",
      stepKey: "record",
      text: `Recording against Stanley House: contractor instructed, ${withContact.length} tenants notified (with units), date sent today, approved by you. I'll set the next certificate alert so this doesn't re-trigger.`,
      gate: {
        label: "Record and finish",
        options: [{ label: "Record & close", kind: "continue", nextBeatIdx: "complete" }],
      },
    },
  ];
}

/* ─── PA-002 — Notice service window (prepare-and-serve) ─── */
const PA002_STEPS: { key: string; label: string }[] = [
  { key: "identify", label: "Identify" },
  { key: "prepare",  label: "Prepare" },
  { key: "serve",    label: "Serve" },
  { key: "record",   label: "Record" },
];

function buildPA002Beats(): PerformBeat[] {
  return [
    {
      id: "n2-1",
      stepKey: "identify",
      text: "A right could be lost. The tenant break in the Flat 5 lease is exercisable on 24 December 2026, but a valid landlord counter-notice must be served by 24 September 2026 — about 90 days from today. Want me to prepare it?",
      gate: {
        label: "How would you like to proceed?",
        options: [
          { label: "Prepare the notice", kind: "approve", nextBeatIdx: 1 },
          { label: "Remind me in 14 days", kind: "defer", nextBeatIdx: "exit" },
          { label: "Dismiss", kind: "cancel", nextBeatIdx: "exit" },
        ],
      },
    },
    {
      id: "n2-2",
      stepKey: "prepare",
      text: "Drafted. Recipient: the tenant at the contractual service address on the lease. Method: recorded delivery. Deemed receipt: 2 working days after posting. Effective date: 24 December 2026.",
      detail: (
        <PreparedPreview
          title="Landlord counter-notice — Flat 5, Stanley House"
          body={`To: [Tenant], Flat 5, Stanley House, 1115 Finchley Road, NW11\nMethod: Recorded delivery to lease service address\nDeemed receipt: +2 working days\n\nRe: Tenant break clause — Lease dated 24/12/2016\n\nWe acknowledge the break right exercisable on 24/12/2026. This counter-notice is served pursuant to clause 7.3 to preserve the landlord's position on outstanding sums, dilapidations and reinstatement obligations on the break date.\n\nSigned, [You]`}
        />
      ),
      flag: "Service method needs your call: the lease names recorded delivery, but the tenant's solicitor has previously asked for service by email + post. I'll default to the lease method and copy the solicitor unless you say otherwise.",
      gate: {
        label: "Serve the notice now, or adjust first?",
        options: [
          { label: "Serve notice", kind: "approve", nextBeatIdx: 2 },
          { label: "Edit method / recipient", kind: "modify", nextBeatIdx: 1 },
          { label: "Cancel", kind: "cancel", nextBeatIdx: "exit" },
        ],
      },
    },
    {
      id: "n2-3",
      stepKey: "serve",
      text: "Served. Recorded delivery slip logged; solicitor copied; deemed-receipt date 26 September 2026 calendared against the unit record.",
      gate: {
        label: "Record and finish",
        options: [{ label: "Record & close", kind: "continue", nextBeatIdx: "complete" }],
      },
    },
  ];
}

/* ─── PA-003 — Served notice taking effect (consequence + optional follow-on) ─── */
const PA003_STEPS: { key: string; label: string }[] = [
  { key: "inform",   label: "Inform" },
  { key: "choose",   label: "Next step" },
  { key: "prepare",  label: "Prepare" },
  { key: "record",   label: "Record" },
];

function buildPA003Beats(): PerformBeat[] {
  return [
    {
      id: "n3-1",
      stepKey: "inform",
      text: "Something is about to happen. The Section 25 notice served on M&S (Shop, 5 Nugent Terrace) on 14 March 2026 takes effect on 28 September 2026 — 28 days away. On that date the contractual tenancy ends; if no renewal is agreed the unit returns to you for re-letting.",
      gate: {
        label: "Acknowledge — no approval needed to be informed",
        options: [
          { label: "Got it — what's next?", kind: "continue", nextBeatIdx: 1 },
        ],
      },
    },
    {
      id: "n3-2",
      stepKey: "choose",
      text: "Two follow-on paths make sense. I can prepare either — your call.",
      gate: {
        label: "Choose a follow-on (or skip)",
        options: [
          { label: "Prepare end-of-tenancy checklist", kind: "approve", nextBeatIdx: 2 },
          { label: "Prepare renewal pack", kind: "approve", nextBeatIdx: 2 },
          { label: "Not now", kind: "defer", nextBeatIdx: "exit" },
        ],
      },
    },
    {
      id: "n3-3",
      stepKey: "prepare",
      text: "Prepared. Bundle ready for your review: keys & access, final meter readings, dilapidations schedule, final-account reconciliation, deposit return route, re-letting brief. (Renewal pack alternative includes revised heads of terms and a comparables note — switch any time.)",
      detail: (
        <PreparedPreview
          title="End-of-tenancy checklist — Shop, 5 Nugent Terrace"
          body={`1. Keys & access — recover sets, decommission codes\n2. Meter readings — gas/elec/water on effective date\n3. Dilapidations — Schedule of Condition v final inspection\n4. Final account — service charge, insurance, rent apportionment\n5. Deposit — assess deductions, return route\n6. Re-letting — instruct agent, marketing brief, photographs`}
        />
      ),
      gate: {
        label: "Confirm and record",
        options: [
          { label: "Confirm & record", kind: "approve", nextBeatIdx: 3 },
          { label: "Edit", kind: "modify", nextBeatIdx: 2 },
        ],
      },
    },
    {
      id: "n3-4",
      stepKey: "record",
      text: "Recorded against the unit: notice effective date noted, follow-on bundle prepared, owner informed. I'll re-surface this 7 days before effective date.",
      gate: {
        label: "Finish",
        options: [{ label: "Close", kind: "continue", nextBeatIdx: "complete" }],
      },
    },
  ];
}



function buildPerformConfig(card: ActionCard, section13Template: StepTemplate | null = null): {
  beats: PerformBeat[];
  steps: { key: string; label: string }[];
  headerKicker: string;
  headerTitle: string;
  headerSub: string;
} {
  if (card.id === "act-stanley-fra") {
    return {
      beats: buildPA001Beats(),
      steps: PA001_STEPS,
      headerKicker: "Performing action",
      headerTitle: `Fire alarm certification · ${card.propertyName}`,
      headerSub: "Building-wide · expires 12 July 2026 (≈18 days)",
    };
  }
  if (card.id === "act-stanley-f5-break") {
    return {
      beats: buildPA002Beats(),
      steps: PA002_STEPS,
      headerKicker: "Performing action",
      headerTitle: `Notice service · ${card.unitLabel}, ${card.propertyName}`,
      headerSub: "Latest service date: 24 September 2026 (≈90 days)",
    };
  }
  if (card.id === "act-nugent-shop-effect") {
    return {
      beats: buildPA003Beats(),
      steps: PA003_STEPS,
      headerKicker: "Performing action",
      headerTitle: `Notice takes effect · ${card.unitLabel}, ${card.propertyName}`,
      headerSub: "Effective date: 28 September 2026 (≈28 days)",
    };
  }
  return {
    beats: buildPA004Beats(section13Template),
    steps: PA004_STEPS,
    headerKicker: "Performing action",
    headerTitle: `Rent review · ${card.unitLabel ?? "Flat 8"}, ${card.propertyName}`,
    headerSub: "Due: March 2027 (≈180 days)",
  };
}


function finalGateBeatIdx(card: ActionCard, beats: PerformBeat[]): number {
  // Per-card final unapproved gate.
  if (card.id === "act-stanley-fra") {
    // PA-001 Gate B — "Send?" — beat id "fa5" (index 4)
    const idx = beats.findIndex((b) => b.id === "fa5");
    return idx >= 0 ? idx : 0;
  }
  if (card.id === "act-stanley-f5-break") {
    const idx = beats.findIndex((b) => b.id === "n2-2");
    return idx >= 0 ? idx : 0;
  }
  if (card.id === "act-nugent-shop-effect") {
    const idx = beats.findIndex((b) => b.id === "n3-3");
    return idx >= 0 ? idx : 0;
  }
  // Default: the last beat with a gate.
  for (let i = beats.length - 1; i >= 0; i--) {
    if (beats[i].gate) return i;
  }
  return 0;
}

function reviewRecapText(card: ActionCard): string {
  if (card.id === "act-stanley-fra") {
    const n = STANLEY_FIRE_ALARM_TENANTS.filter((t) => t.email).length;
    return `I've done the groundwork on the Stanley House fire alarm — confirmed it's due, found your contractor, and drafted access notices for all ${n} current tenants. It's ready to send — just needs your approval.`;
  }
  if (card.id === "act-stanley-f5-break") {
    return `I've drafted the landlord counter-notice for Flat 5 — recipient, service method and deemed-receipt date all set per the lease. It's ready to serve — just needs your sign-off.`;
  }
  if (card.id === "act-nugent-shop-effect") {
    return `I've put the follow-on bundle together for the Shop at 5 Nugent Terrace, ahead of the notice taking effect. It's ready — just needs you to confirm and record.`;
  }
  return "Here's what I've put together so far. Take a look at the final approval below — that's all that's left.";
}


function PerformWorkspace({
  card,
  mode = "perform",
  onCancel,
  onComplete,
  onReachedFinalGate,
  reducedMotion,
  section13Template,
}: {
  card: ActionCard;
  mode?: "perform" | "review";
  onCancel: () => void;
  onComplete: (summary: string) => void;
  onReachedFinalGate?: () => void;
  reducedMotion: boolean;
  section13Template?: StepTemplate | null;
}) {
  const { beats, steps, headerTitle, headerSub } = useMemo(() => buildPerformConfig(card, section13Template ?? null), [card, section13Template]);
  const isComplete = card.approvalState === "approved";
  const initialRevealed = useMemo(() => {
    if (mode === "review" && !isComplete) return finalGateBeatIdx(card, beats);
    if (isComplete) return beats.length - 1;
    return 0;
  }, [mode, isComplete, card, beats]);
  const initialCompleted = useMemo(() => {
    if (mode === "review" || isComplete) {
      const upto = initialRevealed;
      return Array.from(new Set(beats.slice(0, upto).map((b) => b.stepKey)));
    }
    return [];
  }, [mode, isComplete, beats, initialRevealed]);
  const headerKicker =
    isComplete ? "Recorded action" : mode === "review" ? "Reviewing prepared work" : "Performing action";

  const [revealed, setRevealed] = useState<number>(initialRevealed);
  const [streamingText, setStreamingText] = useState<string>("");
  const [streamingActive, setStreamingActive] = useState(false);
  const [approvedActions, setApprovedActions] = useState<string[]>([]);
  const [completed, setCompleted] = useState<string[]>(initialCompleted);
  const [chosenRent, setChosenRent] = useState<number | null>(null);
  const [recapOpen, setRecapOpen] = useState<boolean>(mode === "perform");
  const recapNarration = useMemo(() => reviewRecapText(card), [card]);
  const [recapStream, setRecapStream] = useState<string>("");
  const [recapStreaming, setRecapStreaming] = useState<boolean>(mode === "review" && !isComplete);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  // Stream the colleague-tone recap when entering review mode.
  useEffect(() => {
    if (!(mode === "review" && !isComplete)) return;
    if (reducedMotion) {
      setRecapStream(recapNarration);
      setRecapStreaming(false);
      return;
    }
    setRecapStreaming(true);
    setRecapStream("");
    const words = recapNarration.split(" ");
    let i = 0;
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      i += 1;
      setRecapStream(words.slice(0, i).join(" "));
      if (i < words.length) setTimeout(tick, 32 + Math.random() * 28);
      else setRecapStreaming(false);
    };
    const t = setTimeout(tick, 100);
    return () => { cancelled = true; clearTimeout(t); };
  }, [mode, isComplete, recapNarration, reducedMotion]);

  // Stream a beat's text into view (skip when entering at the parked gate or completed)
  useEffect(() => {
    if (revealed >= beats.length) return;
    const beat = beats[revealed];
    const skipStream = (mode === "review" || isComplete) && revealed === initialRevealed;
    if (reducedMotion || skipStream) {
      setStreamingText(beat.text);
      setStreamingActive(false);
      return;
    }
    setStreamingActive(true);
    setStreamingText("");
    const words = beat.text.split(" ");
    let i = 0;
    let cancelled = false;
    const step = () => {
      if (cancelled) return;
      i += 1;
      setStreamingText(words.slice(0, i).join(" "));
      if (i < words.length) setTimeout(step, 32 + Math.random() * 28);
      else setStreamingActive(false);
    };
    const t = setTimeout(step, 120);
    return () => { cancelled = true; clearTimeout(t); };
  }, [revealed, beats, reducedMotion, mode, isComplete, initialRevealed]);

  // Auto-follow the workspace journey as steps reveal and text streams.
  // Pause if the user has scrolled up to re-read; resume when they return.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distance > 240) return;
    const id = requestAnimationFrame(() => { el.scrollTop = el.scrollHeight; });
    return () => cancelAnimationFrame(id);
  }, [revealed, streamingText, recapStream, completed.length, approvedActions.length]);

  // Cover any late layout growth (rich previews, tables, embedded forms).
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
      if (distance < 240) el.scrollTop = el.scrollHeight;
    });
    ro.observe(el);
    const inner = el.firstElementChild as HTMLElement | null;
    if (inner) ro.observe(inner);
    return () => ro.disconnect();
  }, []);

  // Fire reviewReady once when the journey has revealed (or passed) its final approval gate.
  const finalIdx = useMemo(() => finalGateBeatIdx(card, beats), [card, beats]);
  const reachedFinalRef = useRef(false);
  useEffect(() => {
    if (!reachedFinalRef.current && revealed >= finalIdx) {
      reachedFinalRef.current = true;
      onReachedFinalGate?.();
    }
  }, [revealed, finalIdx, onReachedFinalGate]);



  const currentBeat = beats[revealed];
  const previousBeats = beats.slice(0, revealed);

  // Auto-advance narration: when the current beat has no gate and isn't the last,
  // move on automatically once streaming finishes. Hobson just keeps working.
  useEffect(() => {
    if (isComplete || mode === "review") return;
    if (!currentBeat || currentBeat.gate) return;
    if (revealed >= beats.length - 1) return;
    if (streamingActive) return;
    const delay = reducedMotion ? 0 : 650;
    const t = setTimeout(() => {
      setCompleted((c) => Array.from(new Set([...c, currentBeat.stepKey])));
      setRevealed((r) => Math.min(r + 1, beats.length));
    }, delay);
    return () => clearTimeout(t);
  }, [currentBeat, streamingActive, revealed, beats.length, isComplete, mode, reducedMotion]);


  const advance = (jumpTo: number | "complete" | "exit" | undefined, gateLabel: string, kind: string) => {
    // Track approved sub-actions for audit
    if (kind === "approve") setApprovedActions((a) => [...a, gateLabel]);
    // Mark current step as completed when we leave it
    const cur = beats[revealed];
    if (cur) setCompleted((c) => Array.from(new Set([...c, cur.stepKey])));

    if (jumpTo === "complete") {
      const summary = approvedActions.length + (kind === "approve" ? 1 : 0) > 0
        ? `summary prepared · ${[...approvedActions, ...(kind === "approve" ? [gateLabel] : [])].length} actions approved · recorded ${new Date().toLocaleDateString("en-GB")}`
        : `summary prepared · recorded ${new Date().toLocaleDateString("en-GB")}`;
      onComplete(summary);
      return;
    }
    if (jumpTo === "exit") { onCancel(); return; }
    if (typeof jumpTo === "number") setRevealed(jumpTo);
    else setRevealed((r) => Math.min(r + 1, beats.length));
  };

  const currentStepIdx = steps.findIndex((s) => s.key === currentBeat?.stepKey);

  return (
    <div className={`absolute inset-0 z-[600] bg-white flex flex-col ${reducedMotion ? "" : "animate-fade-in"}`}>
      {/* Header */}
      <header className="border-b border-slate-200 px-5 py-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold">{headerKicker}</div>
          <h2 className="text-[15px] font-semibold text-slate-900 leading-tight truncate">{headerTitle}</h2>
          <div className="text-[12px] text-slate-500 mt-0.5">{headerSub}</div>
        </div>
        <button
          onClick={onCancel}
          className="text-xs px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition focus:outline-none focus:ring-2 focus:ring-slate-300 inline-flex items-center gap-1"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back to map
        </button>
      </header>

      {/* Progress rail */}
      <nav aria-label="Progress" className="px-5 py-2.5 border-b border-slate-100 bg-slate-50">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px]">
          {steps.map((s, i) => {
            const isDone = completed.includes(s.key);
            const isCurrent = currentBeat?.stepKey === s.key;
            return (
              <li key={s.key} className="flex items-center gap-2">
                <span
                  aria-current={isCurrent ? "step" : undefined}
                  className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full border ${
                    isDone
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : isCurrent
                      ? "bg-[#7C3AED] border-[#7C3AED] text-white"
                      : "bg-white border-slate-200 text-slate-500"
                  }`}
                >
                  <span aria-hidden className="w-4 h-4 rounded-full grid place-items-center text-[10px] font-bold">
                    {isDone ? "✓" : i + 1}
                  </span>
                  {s.label}
                </span>
                {i < steps.length - 1 && <span aria-hidden className="text-slate-300">→</span>}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Beats scroller */}
      <div ref={scrollerRef} className="flex-1 overflow-auto px-5 py-5 space-y-5 bg-white" style={{ paddingBottom: 64, scrollPaddingBottom: 64 }}>
        {mode === "review" && !isComplete && (
          <div className="flex items-start gap-2">
            <OwlAvatar state={recapStreaming ? "talking" : "default"} />
            <div className="inline-block max-w-[640px] bg-[#EDE9FE] text-[#1F2330] text-sm leading-relaxed px-4 py-2.5 rounded-2xl rounded-bl-md">
              {recapStream || (reducedMotion ? recapNarration : "")}
              {recapStreaming && <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-[#7C3AED] align-middle animate-pulse" />}
            </div>
          </div>
        )}
        {(mode === "review" || isComplete) && previousBeats.length > 0 ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={() => setRecapOpen((o) => !o)}
              aria-expanded={recapOpen}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40 rounded-lg"
            >
              <span className="text-[12px] font-medium text-slate-700 inline-flex items-center gap-2">
                <span aria-hidden className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">✓</span>
                {isComplete
                  ? `Recorded — ${previousBeats.length + 1} steps complete`
                  : `Recap — ${previousBeats.length} steps already done, parked at the final approval`}
              </span>
              <span className="text-[11px] text-[#7C3AED]">{recapOpen ? "Hide details" : "Show details"}</span>
            </button>
            {recapOpen && (
              <div className="px-3 pb-3 pt-1 space-y-3 border-t border-slate-200">
                {previousBeats.map((b) => (
                  <BeatBubble key={b.id} beat={b} done detailOverride={b.detailFn ? b.detailFn({ chosenRent, setChosenRent, advance, section13Template: section13Template ?? null }) : undefined} />
                ))}
              </div>
            )}
          </div>
        ) : (
          previousBeats.map((b) => (
            <BeatBubble key={b.id} beat={b} done detailOverride={b.detailFn ? b.detailFn({ chosenRent, setChosenRent, advance, section13Template: section13Template ?? null }) : undefined} />
          ))
        )}
        {currentBeat && (
          <div className="space-y-2.5">
            <BeatBubble
              beat={currentBeat}
              streamingText={streamingActive ? streamingText : currentBeat.text}
              streaming={streamingActive}
              done={false}
              detailOverride={!streamingActive && currentBeat.detailFn ? currentBeat.detailFn({ chosenRent, setChosenRent, advance, section13Template: section13Template ?? null }) : undefined}
            />
            {/* Inline decisions — only at genuine gates (decision, approval, flagged show-stopper, or finish) */}
            {!streamingActive && !isComplete && currentBeat.gateFn && currentBeat.gateFn({ chosenRent, setChosenRent, advance, section13Template: section13Template ?? null })}
            {!streamingActive && !isComplete && !currentBeat.gateFn && currentBeat.gate && (
              <div className="pl-[44px]">
                <div className="inline-block max-w-[640px] rounded-2xl border border-[#DDD6FE] bg-[#F5F3FF] px-3 py-2.5 space-y-2">
                  <div className="text-[11px] uppercase tracking-wide text-[#5B21B6] font-semibold">{currentBeat.gate.label}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {currentBeat.gate.options.map((opt, idx) => {
                      const primary = opt.kind === "approve" || opt.kind === "continue";
                      const cls = primary
                        ? "bg-[#7C3AED] text-white hover:bg-[#6D28D9] focus:ring-[#7C3AED]"
                        : opt.kind === "cancel"
                        ? "text-slate-500 hover:text-slate-700 hover:bg-white border border-transparent focus:ring-slate-300"
                        : "text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 focus:ring-slate-300";
                      return (
                        <button
                          key={opt.label + idx}
                          autoFocus={idx === 0}
                          onClick={() => advance(opt.nextBeatIdx, opt.label, opt.kind)}
                          className={`text-xs px-3 py-1.5 rounded-full transition focus:outline-none focus:ring-2 ${cls}`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
        {isComplete && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[12px] text-emerald-900">
            This action is complete and recorded. Read-only summary above.
          </div>
        )}
      </div>

      {isComplete && (
        <footer className="border-t border-slate-200 px-5 py-3 bg-white flex justify-end">
          <button
            onClick={onCancel}
            className="text-xs px-3 py-1.5 rounded-full bg-[#7C3AED] text-white hover:bg-[#6D28D9] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          >
            Close
          </button>
        </footer>
      )}
    </div>
  );
}

function BeatBubble({ beat, streamingText, streaming, done, detailOverride }: { beat: PerformBeat; streamingText?: string; streaming?: boolean; done: boolean; detailOverride?: React.ReactNode }) {
  const text = streamingText ?? beat.text;
  return (
    <div className={`flex items-start gap-2 ${done ? "opacity-80" : ""}`}>
      <OwlAvatar state={streaming ? "talking" : "default"} />
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="inline-block max-w-[640px] bg-[#EDE9FE] text-[#1F2330] text-sm leading-relaxed px-4 py-2.5 rounded-2xl rounded-bl-md">
          {text}
          {streaming && <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-[#7C3AED] align-middle animate-pulse" />}
        </div>
        {!streaming && beat.flag && (
          <div className="inline-flex items-start gap-1.5 max-w-[640px] text-[12px] text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-1.5 rounded-lg">
            <span aria-hidden>⚠</span>
            <span>{beat.flag}</span>
          </div>
        )}
        {!streaming && (detailOverride ?? beat.detail) && <div className="max-w-[640px]">{detailOverride ?? beat.detail}</div>}
      </div>
    </div>
  );
}



function ActionCardItem({
  card,
  level,
  expanded,
  onToggleExpand,
  onHover,
  onOpenUnit,
  onOpenProperty,
  onApprove,
  onDefer,
  onDismiss,
  onManageAtProperty,
  onPerform,
  onReview,
  onManualComplete,
  onOpenWorkflow,
}: {
  card: ActionCard;
  level: "portfolio" | "property" | "unit";
  expanded: boolean;
  onToggleExpand: () => void;
  onHover: (on: boolean) => void;
  onOpenUnit?: () => void;
  onOpenProperty?: () => void;
  onApprove: () => void;
  onDefer: () => void;
  onDismiss: () => void;
  onManageAtProperty?: () => void;
  onPerform?: () => void;
  onReview?: () => void;
  onManualComplete?: (note: string) => void;
  onOpenWorkflow?: (ref: string) => void;
}) {
  const isInferred = card.confidence === "inferred";
  const readOnly = level === "unit" && card.anchorLevel === "property";
  const locationLabel = locationLabelForCard(card, level);
  const anchorChip =
    card.anchorLevel === "property"
      ? { label: "Property-anchored", cls: "bg-indigo-50 text-indigo-700 border-indigo-200" }
      : { label: "Unit-anchored", cls: "bg-slate-50 text-slate-600 border-slate-200" };

  const performable = PERFORMABLE_CARD_IDS.has(card.id);
  const state = card.approvalState;
  const isCompleted = state === "approved";

  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState("");

  // Tooltip messages
  const performTip = !performable
    ? "No automated workflow for this — review & approve, or handle it yourself"
    : isCompleted
    ? "Already completed"
    : state === "in_progress"
    ? "Resume the automated walkthrough"
    : "Run the automated walkthrough";
  // Review & approve is DISABLED until the Perform journey has reached its final approval gate
  // (or the card is complete). You can't review work that isn't ready.
  const reviewActuallyDisabled = !isCompleted && !card.reviewReady;
  const reviewTip = isCompleted
    ? "Open the recorded outcome"
    : reviewActuallyDisabled
    ? "Not ready to review — Perform the workflow first; this lights up at the final approval gate"
    : "Jump to the final approval gate";


  return (
    <article
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className={`rounded-xl border bg-white p-3 transition ${
        readOnly
          ? "border-indigo-200 bg-indigo-50/30"
          : isInferred ? "border-amber-200" : "border-slate-200 hover:border-[#7C3AED]/40"
      }`}
    >
      {/* Top row: location + anchor + origin marker */}
      <div className="flex flex-wrap items-center gap-1 mb-1.5">
        <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${anchorChip.cls}`}>
          {locationLabel}
        </span>
        <span className="text-[10px] text-slate-400">·</span>
        <span className="text-[10px] uppercase tracking-wide text-slate-400 font-medium">{anchorChip.label}</span>
        <span className="ml-auto inline-flex items-center gap-1.5">
          <OriginMarker origin={card.addedBy} />
          {readOnly && (
            <span className="text-[10px] px-1.5 py-0.5 rounded border border-slate-200 bg-white text-slate-500 font-medium">
              Read-only here
            </span>
          )}
        </span>
      </div>

      <header className="flex items-start gap-2 mb-1.5">
        <span aria-hidden className="text-base leading-none mt-0.5">{TRIGGER_ICON[card.triggerType]}</span>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-semibold text-slate-900 leading-snug">{card.title}</div>
          <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
            <ConfidenceMark confidence={card.confidence} />
            <WorkflowRefTag refId={card.workflowRef} onOpen={onOpenWorkflow} />
          </div>
        </div>
      </header>

      <p className="text-[12.5px] text-slate-700 leading-relaxed mb-1.5">{card.whyItMatters}</p>
      <p className="text-[12px] text-slate-500 leading-relaxed mb-2 italic">{card.hobsonPrepared}</p>

      {/* Manual-completion note shown on completed cards */}
      {isCompleted && card.manuallyCompleted && card.manualNote && (
        <div className="mb-2 rounded-lg border border-slate-200 bg-slate-50 p-2">
          <div className="text-[10px] uppercase tracking-wide text-slate-500 font-semibold mb-0.5">Your note</div>
          <p className="text-[12px] text-slate-700 leading-relaxed whitespace-pre-wrap">{card.manualNote}</p>
        </div>
      )}

      {readOnly ? (
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={onManageAtProperty}
            className="text-xs px-3 py-1.5 rounded-full bg-white text-indigo-700 border border-indigo-300 hover:bg-indigo-50 transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Manage at {card.propertyName} level →
          </button>
        </div>
      ) : (
        <>
          {/* Three consistent completion buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={performable && onPerform && !isCompleted ? onPerform : undefined}
              disabled={!performable || isCompleted}
              aria-disabled={!performable || isCompleted}
              title={performTip}
              className={`text-xs px-3 py-1.5 rounded-full transition inline-flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                !performable || isCompleted
                  ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
              }`}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polygon points="6 4 20 12 6 20 6 4" /></svg>
              {state === "in_progress" && performable ? "Resume" : "Perform"}
            </button>
            <button
              onClick={reviewActuallyDisabled ? undefined : (onReview ?? onToggleExpand)}
              disabled={reviewActuallyDisabled}
              aria-disabled={reviewActuallyDisabled}
              title={reviewTip}
              className={`text-xs px-3 py-1.5 rounded-full transition inline-flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] ${
                reviewActuallyDisabled
                  ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                  : isCompleted
                  ? "bg-white text-[#5B21B6] border border-[#7C3AED]/40 hover:bg-[#F5F3FF]"
                  : "bg-[#7C3AED] text-white hover:bg-[#6D28D9]"
              }`}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 13l4 4L19 7"/></svg>
              {isCompleted ? "View recorded outcome" : "Review & approve"}
            </button>
            <button
              onClick={isCompleted ? undefined : () => setNoteOpen((v) => !v)}
              disabled={isCompleted}
              aria-disabled={isCompleted}
              aria-expanded={noteOpen}
              title={isCompleted ? "Already completed" : "Mark this as handled by you, with a note for the record"}
              className={`text-xs px-3 py-1.5 rounded-full transition inline-flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-slate-400 ${
                isCompleted
                  ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                  : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
              }`}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              Let me handle this
            </button>
          </div>

          {/* Secondary actions */}
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {onOpenUnit && (
              <button
                onClick={onOpenUnit}
                className="text-xs px-2.5 py-1 rounded-full text-slate-600 border border-slate-200 hover:bg-slate-50 transition focus:outline-none focus:ring-2 focus:ring-slate-300"
              >
                Open unit
              </button>
            )}
            {onOpenProperty && (
              <button
                onClick={onOpenProperty}
                className="text-xs px-2.5 py-1 rounded-full text-slate-600 border border-slate-200 hover:bg-slate-50 transition focus:outline-none focus:ring-2 focus:ring-slate-300"
              >
                Open property
              </button>
            )}
            {!isCompleted && (
              <>
                <button
                  onClick={onDefer}
                  className="text-xs px-2.5 py-1 rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition focus:outline-none focus:ring-2 focus:ring-slate-300"
                >
                  Defer
                </button>
                <button
                  onClick={onDismiss}
                  className="text-xs px-2.5 py-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition focus:outline-none focus:ring-2 focus:ring-slate-300"
                >
                  Dismiss
                </button>
              </>
            )}
          </div>

          {/* "Let me handle this" note panel */}
          {noteOpen && !isCompleted && (
            <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-2.5 space-y-2">
              <label htmlFor={`note-${card.id}`} className="block text-[11px] uppercase tracking-wide text-slate-500 font-semibold">
                What did you do?
              </label>
              <textarea
                id={`note-${card.id}`}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="e.g. Called the tenant and agreed a renewal in principle — confirming by email."
                rows={3}
                className="w-full text-[12.5px] rounded-md border border-slate-300 bg-white p-2 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40"
              />
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    const note = noteText.trim();
                    if (!note) return;
                    onManualComplete?.(note);
                    setNoteOpen(false);
                    setNoteText("");
                  }}
                  disabled={!noteText.trim()}
                  className="text-xs px-3 py-1.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition focus:outline-none focus:ring-2 focus:ring-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Complete
                </button>
                <button
                  onClick={() => { setNoteOpen(false); setNoteText(""); }}
                  className="text-xs px-3 py-1.5 rounded-full text-slate-600 border border-slate-200 hover:bg-slate-100 transition focus:outline-none focus:ring-2 focus:ring-slate-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Existing inline approve-expand panel (kept for backwards compatibility) */}
          {expanded && !isInferred && (
            <div className="mt-2 rounded-lg border border-[#DDD6FE] bg-[#F5F3FF] p-2.5 space-y-2">
              <div>
                <div className="text-[10px] uppercase tracking-wide text-[#5B21B6] font-semibold mb-1">What I'll do</div>
                <p className="text-[12px] text-slate-700 leading-relaxed">{card.preparedDetail}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <button
                  onClick={onApprove}
                  autoFocus
                  className="text-xs px-3 py-1.5 rounded-full bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                >
                  Approve
                </button>
                <button
                  onClick={onToggleExpand}
                  className="text-xs px-3 py-1.5 rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition focus:outline-none focus:ring-2 focus:ring-slate-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </article>
  );
}

/* Origin marker — Hobson owl mark, or user initials avatar */
function OriginMarker({ origin }: { origin: CardOrigin }) {
  if (origin.kind === "hobson") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#5B21B6] bg-[#F5F3FF] border border-[#DDD6FE] rounded-full pl-0.5 pr-1.5 py-0.5">
        <img src={owlDefault} alt="" aria-hidden className="w-3.5 h-3.5 object-contain" />
        Added by Hobson
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-full pl-0.5 pr-1.5 py-0.5">
      <span aria-hidden className="w-3.5 h-3.5 rounded-full bg-slate-700 text-white text-[8px] font-semibold inline-flex items-center justify-center">
        {origin.initials}
      </span>
      Added by {origin.name}
    </span>
  );
}

/* PA workflow reference tag — links back to the Magician's workshop */
function WorkflowRefTag({ refId, onOpen }: { refId?: string; onOpen?: (ref: string) => void }) {
  if (!refId) {
    return (
      <span
        className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 border border-dashed border-slate-200 rounded-full px-1.5 py-0.5"
        title="No originating workflow — added manually"
      >
        Manual
      </span>
    );
  }
  const name = WORKFLOW_REF_NAMES[refId];
  return (
    <button
      onClick={() => onOpen?.(refId)}
      title={name ? `${refId} · ${name} — open in The Magician's workshop` : `Open ${refId} in The Magician's workshop`}
      className="inline-flex items-center gap-1 text-[10px] font-medium text-[#5B21B6] bg-white border border-[#DDD6FE] rounded-full px-1.5 py-0.5 hover:bg-[#F5F3FF] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40 transition"
    >
      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
      {refId}
    </button>
  );
}

/* ---------------- styles ---------------- */


function StyleTag() {
  return (
    <style>{`
      .hobson-proto { font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }

      /* Meet Hobson: hide all property pins; on exit, drop them in. */
      .hp-pin, .hp-cluster { transition: opacity .45s ease-out, transform .45s ease-out; }
      .pins-hidden .hp-pin, .pins-hidden .hp-cluster {
        opacity: 0; transform: translateY(-6px); pointer-events: none;
      }
      .reduced-motion .hp-pin, .reduced-motion .hp-cluster { transition: none; }


      @keyframes typingBounce {
        0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
        30% { transform: translateY(-3px); opacity: 1; }
      }
      .animate-typing-bounce { animation: typingBounce 1.1s infinite ease-in-out; }

      .hp-marker { background: transparent !important; border: none !important; }
      .leaflet-tooltip.hp-tooltip {
        background: #1F2330; color: #fff; border: none; border-radius: 6px;
        padding: 4px 8px; font-size: 11px; font-weight: 500; box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        white-space: nowrap;
      }
      .leaflet-tooltip.hp-tooltip::before { border-top-color: #1F2330; }

      /* Overlap spiderfy: pin keeps its true identity & count; thin connector shows true location */
      .hp-marker.is-overlap-spread .hp-cluster,
      .hp-marker.is-overlap-spread .hp-pin {
        box-shadow: 0 0 0 2px rgba(148,163,184,0.45), 0 2px 6px rgba(0,0,0,0.18);
      }
      .hp-pin {
        width: 28px; height: 38px; position: relative;
        filter: drop-shadow(0 2px 3px rgba(0,0,0,0.25));
        transition: transform .2s;
      }
      .hp-pin::before {
        content: ""; position: absolute; inset: 0;
        background: #111827;
        clip-path: path("M14 0C6.27 0 0 6.27 0 14c0 9.5 14 24 14 24s14-14.5 14-24C28 6.27 21.73 0 14 0z");
      }
      .hp-pin-dot {
        position: absolute; left: 50%; top: 11px; transform: translateX(-50%);
        width: 8px; height: 8px; border-radius: 999px; background: #fff;
      }
      .hp-cluster {
        width: 38px; height: 38px; border-radius: 999px;
        background: #7C3AED; color: #fff; display: grid; place-items: center;
        font-weight: 700; font-size: 14px; box-shadow: 0 2px 6px rgba(124,58,237,0.4);
        border: 3px solid #fff;
        transition: transform .2s;
      }
      .hp-marker.is-pulse .hp-pin,
      .hp-marker.is-pulse .hp-cluster {
        animation: pinPulse 1.4s ease-in-out infinite;
      }
      @keyframes pinPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.18); }
      }
      .hp-marker.is-dim { opacity: 0.35; }
      .hp-marker.is-spread .hp-pin,
      .hp-marker.is-spread .hp-cluster {
        animation: spreadPulse 1.8s ease-in-out infinite;
        box-shadow: 0 0 0 0 rgba(124,58,237,0.5);
      }
      @keyframes spreadPulse {
        0% { box-shadow: 0 0 0 0 rgba(124,58,237,0.55); }
        100% { box-shadow: 0 0 0 18px rgba(124,58,237,0); }
      }
      .hp-marker.has-doc::after {
        content: "📄"; position: absolute; top: -6px; right: -10px;
        background: #fff; border-radius: 999px; width: 22px; height: 22px;
        display: grid; place-items: center; font-size: 12px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        animation: docIn .4s ease-out;
      }
      .hp-marker.is-check::after {
        content: "✓"; position: absolute; top: -6px; right: -10px;
        background: #10b981; color:#fff; border-radius: 999px; width: 22px; height: 22px;
        display: grid; place-items: center; font-size: 13px; font-weight: 700;
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        animation: docIn .4s ease-out;
      }
      @keyframes docIn {
        from { transform: scale(0); }
        to { transform: scale(1); }
      }
      .hp-marker.is-fade { opacity: 0.25; transition: opacity .25s; }
      .hp-unit-marker { background: transparent !important; border: none !important; }
      .hp-unit {
        padding: 3px 8px; border-radius: 999px; font-size: 11px; font-weight: 600;
        color: #1F2330; background: #fff; border: 1.5px solid #7C3AED;
        box-shadow: 0 2px 4px rgba(0,0,0,0.12);
        white-space: nowrap; text-align: center;
        transition: transform .15s, box-shadow .15s, background .15s;
        cursor: pointer;
      }
      .hp-unit.is-vacant { border-color: #94a3b8; color: #475569; }
      .hp-unit:hover { transform: scale(1.08); box-shadow: 0 3px 8px rgba(124,58,237,0.35); }
      .hp-unit-marker.is-active .hp-unit {
        background: #7C3AED; color: #fff; border-color: #7C3AED;
        box-shadow: 0 0 0 4px rgba(124,58,237,0.25);
      }
      .hp-marker.is-match .hp-pin,
      .hp-marker.is-match .hp-cluster {
        filter: drop-shadow(0 0 6px rgba(124,58,237,0.55));
        transform: scale(1.12);
        transition: transform .2s, filter .2s;
      }
      .hp-marker.is-hover .hp-pin,
      .hp-marker.is-hover .hp-cluster {
        transform: scale(1.2);
        transition: transform .15s;
      }
      @media (prefers-reduced-motion: reduce) {
        .animate-typing-bounce, .hp-marker.is-pulse .hp-pin,
        .hp-marker.is-pulse .hp-cluster, .hp-marker.is-spread .hp-pin,
        .hp-marker.is-spread .hp-cluster { animation: none !important; }
        .hp-marker.is-match .hp-pin, .hp-marker.is-match .hp-cluster,
        .hp-marker.is-hover .hp-pin, .hp-marker.is-hover .hp-cluster { transform: none !important; }
      }
    `}</style>
  );
}


/* ---------------- What I've done panel ---------------- */

type WorkLogEntry = {
  id: string;
  cardId?: string;
  title: string;
  propertyId?: string;
  propertyName?: string;
  unitId?: string;
  unitLabel?: string;
  when: string;
  bucket: "Today" | "Yesterday" | "Last week" | "Earlier";
  statusLabel: string;
  statusKind: "waiting" | "in_progress" | "finished" | "paused";
  narration: string;
  approvals: string[];
  flags: string[];
  progressDone: number;
  progressTotal: number;
  dialogue: { role: "user" | "hobson"; text: string }[];
  hasSummary?: boolean;
  origin?: CardOrigin;       // who logged the source card
  workflowRef?: string;      // PA ref of the source card
  manualNote?: string;       // present when "Handled by you"
};

function buildWorkLog(actionCards: ActionCard[]): WorkLogEntry[] {
  const f8 = actionCards.find((c) => c.id === "act-stanley-f8-review");
  const f8State = f8?.approvalState ?? "pending";

  // Dynamic Flat 8 rent review entry — reflects card state
  let f8Entry: WorkLogEntry;
  if (f8State === "approved") {
    f8Entry = {
      id: "log-stanley-f8-review",
      cardId: "act-stanley-f8-review",
      title: "Rent review — Flat 8, Stanley House",
      propertyId: "stanley",
      propertyName: "Stanley House",
      unitId: "stanley-f8",
      unitLabel: "Flat 8",
      when: "Today, just now",
      bucket: "Today",
      statusLabel: "Finished",
      statusKind: "finished",
      narration:
        "I prepared the rent review for Flat 8, Stanley House. I read the lease, confirmed the Open Market basis and the March 2027 date, and gathered comparable evidence from the open market over the last 12 months. You approved the comparable search and the review notice — both are done and the file is updated.",
      approvals: ["Approved by you — comparable evidence search", "Approved by you — review notice to tenant"],
      flags: ["Notice period in the lease is ambiguous — I noted it on file so you have it next time."],
      progressDone: 4,
      progressTotal: 4,
      hasSummary: true,
      dialogue: [
        { role: "user", text: "Perform" },
        { role: "hobson", text: "I'll work through the Flat 8 rent review with you. First — the lease basis." },
        { role: "hobson", text: "Open Market review, confirmed in clause 5.2. Review date 25 March 2027." },
        { role: "user", text: "Approve — prepare review summary" },
        { role: "hobson", text: "Done. I've pulled six like-for-like comparables from Rightmove, Zoopla, OnTheMarket, Foxtons and LonRes — last 12 months, NW8, 1-bed flats." },
        { role: "user", text: "Approve comparable evidence" },
        { role: "hobson", text: "Drafting the review notice now — couldn't pin down the exact notice period, flagging that." },
        { role: "user", text: "Approve review notice" },
        { role: "hobson", text: "Notice prepared and recorded. I've saved everything to the Flat 8 file." },
      ],
    };
  } else if (f8State === "in_progress") {
    f8Entry = {
      id: "log-stanley-f8-review",
      cardId: "act-stanley-f8-review",
      title: "Rent review — Flat 8, Stanley House",
      propertyId: "stanley",
      propertyName: "Stanley House",
      unitId: "stanley-f8",
      unitLabel: "Flat 8",
      when: "Today, in progress",
      bucket: "Today",
      statusLabel: "Waiting on you — 2 of 4 steps complete",
      statusKind: "waiting",
      narration:
        "I started the rent review for Flat 8, Stanley House. I read the lease, confirmed the Open Market basis and the March 2027 date, and pulled comparable evidence from the open market over the last 12 months. I've paused at the review notice for your approval. I couldn't confirm the notice period, so I've flagged that for you.",
      approvals: [],
      flags: ["Notice period in the lease is ambiguous — needs your eye before I send the notice."],
      progressDone: 2,
      progressTotal: 4,
      dialogue: [
        { role: "user", text: "Perform" },
        { role: "hobson", text: "I'll work through the Flat 8 rent review with you. First — the lease basis." },
        { role: "hobson", text: "Open Market review, confirmed in clause 5.2. Review date 25 March 2027." },
        { role: "user", text: "Approve — prepare review summary" },
        { role: "hobson", text: "Done. I've pulled six like-for-like comparables from Rightmove, Zoopla, OnTheMarket, Foxtons and LonRes — ready for your eye." },
      ],
    };
  } else {
    f8Entry = {
      id: "log-stanley-f8-review",
      cardId: "act-stanley-f8-review",
      title: "Rent review — Flat 8, Stanley House",
      propertyId: "stanley",
      propertyName: "Stanley House",
      unitId: "stanley-f8",
      unitLabel: "Flat 8",
      when: "Today, ready when you are",
      bucket: "Today",
      statusLabel: "Waiting on you — not started",
      statusKind: "waiting",
      narration:
        "I've prepared the rent review for Flat 8, Stanley House — lease read, basis and date confirmed, comparables pulled. It's ready for you to walk through with me whenever you have a minute.",
      approvals: [],
      flags: ["Notice period in the lease looks ambiguous — I'll flag it again when we get there."],
      progressDone: 0,
      progressTotal: 4,
      dialogue: [
        { role: "hobson", text: "Flat 8 rent review is ready to perform when you are." },
      ],
    };
  }

  const epcEntry: WorkLogEntry = {
    id: "log-nugent-shop-epc",
    cardId: "act-nugent-shop-epc",
    title: "EPC instruction — Shop, 5 Nugent Terrace",
    propertyId: "nugent",
    propertyName: "5 Nugent Terrace",
    unitId: "nugent-shop",
    unitLabel: "Shop",
    when: "Yesterday, 4:12pm",
    bucket: "Yesterday",
    statusLabel: "Finished",
    statusKind: "finished",
    narration:
      "I drafted the EPC re-inspection instruction for the Shop at 5 Nugent Terrace, using your usual assessor and the previous rating for context. You approved it, I sent it, and I've put the re-inspection on the compliance calendar so the new certificate lands before the August expiry.",
    approvals: ["Approved by you — assessor instruction"],
    flags: [],
    progressDone: 3,
    progressTotal: 3,
    hasSummary: true,
    dialogue: [
      { role: "user", text: "Perform" },
      { role: "hobson", text: "EPC for the Shop expires 18 August. I've drafted the instruction to your usual assessor — want me to send?" },
      { role: "user", text: "Approve" },
      { role: "hobson", text: "Sent. I've copied you and added the re-inspection to the compliance calendar." },
    ],
  };

  const breakEntry: WorkLogEntry = {
    id: "log-stanley-f6-break",
    cardId: "act-stanley-f6-break",
    title: "Break review — Flat 6, Stanley House",
    propertyId: "stanley",
    propertyName: "Stanley House",
    unitId: "stanley-f6",
    unitLabel: "Flat 6",
    when: "Last week, Tue 16 June",
    bucket: "Last week",
    statusLabel: "Paused — you deferred this",
    statusKind: "paused",
    narration:
      "I prepared the break-review for Flat 6 — drafted the courtesy reminder for the tenant and a file note for you summarising the break terms. You deferred it; I'll bring it back closer to November when the notice window opens.",
    approvals: [],
    flags: [],
    progressDone: 1,
    progressTotal: 3,
    dialogue: [
      { role: "hobson", text: "Tenant break on 2 May 2027. I've drafted a courtesy reminder and a file note." },
      { role: "user", text: "Defer" },
      { role: "hobson", text: "No problem — I'll bring this back when the notice window opens in November." },
    ],
  };

  // Manually-handled cards → "Handled by you" entries
  const manualEntries: WorkLogEntry[] = actionCards
    .filter((c) => c.manuallyCompleted)
    .map((c) => ({
      id: `manual-${c.id}`,
      cardId: c.id,
      title: c.title,
      propertyId: c.propertyId,
      propertyName: c.propertyName,
      unitId: c.unitId,
      unitLabel: c.unitLabel,
      when: "Today",
      bucket: "Today" as const,
      statusLabel: "Handled by you",
      statusKind: "finished" as const,
      narration: `You handled this one yourself${c.manualNote ? ' — your note is on file.' : '.'}`,
      approvals: [],
      flags: [],
      progressDone: 1,
      progressTotal: 1,
      dialogue: [],
      hasSummary: false,
      origin: c.addedBy,
      workflowRef: c.workflowRef,
      manualNote: c.manualNote,
    }));

  // Waiting/in-progress first, then completed, then paused
  const order = (e: WorkLogEntry) => ({ waiting: 0, in_progress: 1, finished: 2, paused: 3 }[e.statusKind]);
  return [f8Entry, epcEntry, breakEntry, ...manualEntries].sort((a, b) => order(a) - order(b));
}

function WhatIveDonePanel({
  actionCards,
  onClose,
  onResume,
  onOpenProperty,
  onOpenUnit,
  reducedMotion,
}: {
  actionCards: ActionCard[];
  onClose: () => void;
  onResume: (cardId: string) => void;
  onOpenProperty: (propertyId: string) => void;
  onOpenUnit: (unitId: string, propertyId: string) => void;
  reducedMotion: boolean;
}) {
  const entries = useMemo(() => buildWorkLog(actionCards), [actionCards]);
  const [expandedId, setExpandedId] = useState<string | null>(entries[0]?.id ?? null);

  const grouped: Record<string, WorkLogEntry[]> = {};
  for (const e of entries) {
    (grouped[e.bucket] ||= []).push(e);
  }
  const order: WorkLogEntry["bucket"][] = ["Today", "Yesterday", "Last week", "Earlier"];

  return (
    <div
      className={`absolute inset-0 z-[600] bg-white flex flex-col ${reducedMotion ? "" : "animate-fade-in"}`}
      role="region"
      aria-label="What I've done"
    >
      <header className="border-b border-slate-200 px-6 py-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <img src={owlDefault} alt="" aria-hidden className="w-10 h-10 object-contain mt-0.5" />
          <div>
            <h2 className="text-[17px] font-semibold text-slate-900 leading-tight">What I've done</h2>
            <p className="text-[13px] text-slate-600 mt-0.5 max-w-xl">
              Here's what I've been getting through for you — and what's still waiting on you. Open any one to see the conversation we had.
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40 rounded-md p-1"
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-5 bg-slate-50/40">
        <div className="max-w-3xl mx-auto space-y-7">
          {order.map((bucket) => {
            const list = grouped[bucket];
            if (!list || list.length === 0) return null;
            return (
              <section key={bucket} aria-labelledby={`bucket-${bucket}`}>
                <h3 id={`bucket-${bucket}`} className="text-[11px] uppercase tracking-wide font-semibold text-slate-500 mb-2">
                  {bucket}
                </h3>
                <ul className="space-y-3">
                  {list.map((e) => (
                    <li key={e.id}>
                      <WorkLogCard
                        entry={e}
                        expanded={expandedId === e.id}
                        onToggle={() => setExpandedId(expandedId === e.id ? null : e.id)}
                        onResume={onResume}
                        onOpenProperty={onOpenProperty}
                        onOpenUnit={onOpenUnit}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatusPill({ kind, label }: { kind: WorkLogEntry["statusKind"]; label: string }) {
  // Status by label + shape, not colour alone
  const shape: Record<WorkLogEntry["statusKind"], { icon: React.ReactNode; cls: string }> = {
    waiting: {
      icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>,
      cls: "bg-amber-50 border-amber-300 text-amber-900",
    },
    in_progress: {
      icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M4 12a8 8 0 0114-5.3M20 12a8 8 0 01-14 5.3"/></svg>,
      cls: "bg-sky-50 border-sky-300 text-sky-900",
    },
    finished: {
      icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>,
      cls: "bg-emerald-50 border-emerald-300 text-emerald-900",
    },
    paused: {
      icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M8 5v14M16 5v14"/></svg>,
      cls: "bg-slate-100 border-slate-300 text-slate-700",
    },
  };
  const s = shape[kind];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full border ${s.cls}`}>
      {s.icon}
      {label}
    </span>
  );
}

function WorkLogCard({
  entry,
  expanded,
  onToggle,
  onResume,
  onOpenProperty,
  onOpenUnit,
}: {
  entry: WorkLogEntry;
  expanded: boolean;
  onToggle: () => void;
  onResume: (cardId: string) => void;
  onOpenProperty: (pid: string) => void;
  onOpenUnit: (uid: string, pid: string) => void;
}) {
  const canResume = entry.statusKind === "waiting" || entry.statusKind === "in_progress" || entry.statusKind === "paused";
  return (
    <article className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="px-4 py-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <StatusPill kind={entry.statusKind} label={entry.statusLabel} />
              <span className="text-[11px] text-slate-500">{entry.when}</span>
              {entry.origin && <OriginMarker origin={entry.origin} />}
              {entry.workflowRef && <WorkflowRefTag refId={entry.workflowRef} />}
            </div>
            <h4 className="mt-1.5 text-[14px] font-semibold text-slate-900 leading-snug">{entry.title}</h4>
            <p className="mt-1.5 text-[13px] text-slate-700 leading-relaxed">{entry.narration}</p>
            {entry.manualNote && (
              <div className="mt-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-[10px] uppercase tracking-wide font-semibold text-slate-500 mb-0.5">Your note</div>
                <p className="text-[12px] text-slate-700 leading-relaxed whitespace-pre-wrap">{entry.manualNote}</p>
              </div>
            )}

            {(entry.approvals.length > 0 || entry.flags.length > 0) && (
              <ul className="mt-2 space-y-1 text-[12px]">
                {entry.approvals.map((a, i) => (
                  <li key={`a-${i}`} className="flex items-start gap-1.5 text-emerald-800">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><path d="M5 13l4 4L19 7"/></svg>
                    <span>{a}</span>
                  </li>
                ))}
                {entry.flags.map((f, i) => (
                  <li key={`f-${i}`} className="flex items-start gap-1.5 text-amber-900">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><path d="M12 9v4M12 17h.01M10.3 3.86l-8.18 14.2A2 2 0 003.84 21h16.32a2 2 0 001.72-2.94L13.7 3.86a2 2 0 00-3.4 0z"/></svg>
                    <span>Flagged — {f}</span>
                  </li>
                ))}
              </ul>
            )}

            {entry.progressTotal > 0 && (
              <div className="mt-2.5 flex items-center gap-2">
                <div className="h-1.5 bg-slate-100 rounded-full flex-1 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${entry.statusKind === "finished" ? "bg-emerald-500" : entry.statusKind === "paused" ? "bg-slate-400" : "bg-[#7C3AED]"}`}
                    style={{ width: `${Math.round((entry.progressDone / entry.progressTotal) * 100)}%` }}
                  />
                </div>
                <span className="text-[11px] text-slate-500 whitespace-nowrap">
                  {entry.progressDone} of {entry.progressTotal} steps
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 flex-wrap">
          {canResume && entry.cardId && (
            <button
              onClick={() => onResume(entry.cardId!)}
              className="text-[12px] font-medium px-3 py-1.5 rounded-lg bg-[#7C3AED] text-white hover:bg-[#6D28D9] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40"
            >
              Resume
            </button>
          )}
          {entry.hasSummary && (
            <button
              className="text-[12px] font-medium px-3 py-1.5 rounded-lg border border-slate-300 text-slate-800 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40"
              onClick={() => { /* prepared output preview — placeholder for prototype */ }}
            >
              View summary
            </button>
          )}
          {entry.unitId && entry.propertyId && (
            <button
              onClick={() => onOpenUnit(entry.unitId!, entry.propertyId!)}
              className="text-[12px] font-medium px-3 py-1.5 rounded-lg border border-slate-300 text-slate-800 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40"
            >
              Open {entry.unitLabel ?? "unit"}
            </button>
          )}
          {entry.propertyId && !entry.unitId && (
            <button
              onClick={() => onOpenProperty(entry.propertyId!)}
              className="text-[12px] font-medium px-3 py-1.5 rounded-lg border border-slate-300 text-slate-800 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40"
            >
              Open property
            </button>
          )}
          <button
            onClick={onToggle}
            aria-expanded={expanded}
            className="ml-auto text-[12px] font-medium text-[#7C3AED] hover:underline focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40 rounded px-1"
          >
            {expanded ? "Hide our conversation" : "Show our conversation"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-3 space-y-2">
          {entry.dialogue.map((d, i) =>
            d.role === "user" ? (
              <div key={i} className="flex justify-end">
                <div className="max-w-[80%] bg-[#7C3AED] text-white text-[13px] leading-relaxed px-3 py-2 rounded-2xl rounded-br-md">
                  {d.text}
                </div>
              </div>
            ) : (
              <div key={i} className="flex items-start gap-2">
                <img src={owlDefault} alt="" aria-hidden className="w-6 h-6 object-contain mt-0.5" />
                <div className="max-w-[80%] bg-white border border-slate-200 text-slate-800 text-[13px] leading-relaxed px-3 py-2 rounded-2xl rounded-bl-md">
                  {d.text}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </article>
  );
}

/* ============================================================
   Magician — workshop UI
   ============================================================ */

function WorkflowIcon({ icon, tone }: { icon: WorkflowIconKey; tone: Workflow["tone"] }) {
  const toneCls: Record<Workflow["tone"], string> = {
    purple: "bg-[#F5F3FF] text-[#5B21B6] ring-[#7C3AED]/30",
    teal:   "bg-teal-50 text-teal-700 ring-teal-300/60",
    amber:  "bg-amber-50 text-amber-800 ring-amber-300/60",
    slate:  "bg-slate-50 text-slate-700 ring-slate-300/60",
  };
  const path: Record<WorkflowIconKey, JSX.Element> = {
    calendar: (<><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/><path d="M8 14h3v3H8z"/></>),
    shield:   (<><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/></>),
    alert:    (<><path d="M5 3h10l4 4v14H5z"/><path d="M12 9v4M12 17h.01"/></>),
    bell:     (<><path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8z"/><path d="M10 21a2 2 0 0 0 4 0"/></>),
    leaf:     (<><path d="M5 19c0-8 6-14 16-14 0 10-6 16-14 16-1 0-2-.2-2-2z"/><path d="M5 19c4-4 7-7 11-11"/></>),
    wand:     (<><path d="M15 4l5 5-11 11H4v-5L15 4z"/><path d="M14 5l5 5"/></>),
  };
  return (
    <div className={`w-10 h-10 rounded-lg ring-1 grid place-items-center ${toneCls[tone]}`}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {path[icon]}
      </svg>
    </div>
  );
}

function WorkflowStatusPill({ status, isPausedDraft }: { status: WorkflowStatus; isPausedDraft?: boolean }) {
  if (status === "built") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-[#7C3AED]/40 bg-[#F5F3FF] text-[#5B21B6] text-[11px] font-semibold">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M15 4l5 5-11 11H4v-5L15 4z"/><path d="M14 5l5 5"/></svg>
        Built
      </span>
    );
  }
  if (isPausedDraft) {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-dashed border-amber-400/70 bg-amber-50 text-amber-800 text-[11px] font-semibold"
        title="Paused build — not yet running"
      >
        <span className="relative inline-flex items-center justify-center w-2.5 h-2.5" aria-hidden>
          <span className="absolute inset-0 rounded-full bg-amber-400/40 motion-safe:animate-ping" />
          <span className="relative w-1.5 h-1.5 rounded-full bg-amber-500" />
        </span>
        Draft · in progress
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-dashed border-slate-300 bg-white text-slate-600 text-[11px] font-semibold">
      <span aria-hidden>○</span> Draft
    </span>
  );
}



function OwnerChip({ owner }: { owner: WorkflowOwner }) {
  if (owner.kind === "all_teams") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full border border-slate-200 bg-slate-50 text-[11px] text-slate-700">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3 3-5 6-5s6 2 6 5"/><path d="M14 20c0-2 2-3.5 4-3.5s4 1.5 4 3.5"/></svg>
        Owner: All teams
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full border border-slate-200 bg-white text-[11px] text-slate-700">
      <span className="w-5 h-5 rounded-full bg-[#EDE9FE] text-[#5B21B6] grid place-items-center text-[10px] font-semibold" aria-hidden>{owner.initials}</span>
      Owner: {owner.name}{owner.role ? <span className="text-slate-500"> · {owner.role}</span> : null}
    </span>
  );
}

function MagicianComposer({ onCreate, buildActive }: { onCreate: () => void; buildActive?: boolean }) {
  if (buildActive) {
    return (
      <div
        aria-live="polite"
        className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-dashed border-[#7C3AED]/30 bg-[#F5F3FF] text-[12px] text-[#5B21B6]"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M15 4l5 5-11 11H4v-5L15 4z"/><path d="M14 5l5 5"/></svg>
        <span>Building a workflow above — pause or cancel it to start another.</span>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border-2 border-dashed border-[#7C3AED]/40 bg-white">
        <button
          type="button"
          onClick={onCreate}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#7C3AED] text-white text-[13px] font-semibold shadow-sm hover:bg-[#6D28D9] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M15 4l5 5-11 11H4v-5L15 4z"/><path d="M14 5l5 5"/><path d="M5 3v2M3 4h2M19 16v2M18 17h2"/></svg>
          Create a workflow
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-[12px] font-medium text-slate-800">Build something that watches your portfolio</div>
          <div className="text-[11px] text-slate-500">I'll prepare the work — you approve it before anything leaves.</div>
        </div>
      </div>
      <div
        aria-disabled="true"
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-slate-50 text-[12px] text-slate-500"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>
        Free-text chat with The Magician is coming in the live product — for now, build via "Create a workflow".
      </div>
    </div>
  );
}


function MagicianWorkArea({ character, workflows, onCreate, onAdjust, onView, onResume, onDiscard, onSimulate }: {
  character: { id: AdminCharacter; name: string; src: string; tagline: string; workTitle: string };
  workflows: Workflow[];
  onCreate: () => void;
  onAdjust: (id: string) => void;
  onView: (id: string) => void;
  onResume?: (id: string) => void;
  onDiscard?: (id: string) => void;
  onSimulate?: (id: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [ownerFilter, setOwnerFilter] = useState<string>("all");      // "all" | "mine" | name
  const [statusFilter, setStatusFilter] = useState<"all" | WorkflowStatus>("all");
  const [scopeFilter, setScopeFilter] = useState<string>("all");      // "all" | "portfolio" | "property" | "unit"
  const [groupByOwner, setGroupByOwner] = useState(false);

  const filtered = useMemo(() => {
    return workflows.filter((w) => {
      if (search && !w.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== "all" && w.status !== statusFilter) return false;
      if (ownerFilter === "mine" && !(w.owner.kind === "person" && w.owner.name === "Sarah Chen")) return false;
      if (ownerFilter !== "all" && ownerFilter !== "mine") {
        if (ownerFilter === "__teams__" && w.owner.kind !== "all_teams") return false;
        if (ownerFilter !== "__teams__" && !(w.owner.kind === "person" && w.owner.name === ownerFilter)) return false;
      }
      if (scopeFilter === "portfolio" && !/all properties|all units/i.test(w.scopeLabel)) return false;
      if (scopeFilter === "property" && !/(House|Terrace|Mews)/.test(w.scopeLabel)) return false;
      if (scopeFilter === "unit" && !/Flat|Unit/i.test(w.scopeLabel)) return false;
      return true;
    });
  }, [workflows, search, statusFilter, ownerFilter, scopeFilter]);

  const groups: { label: string; items: Workflow[] }[] = useMemo(() => {
    if (!groupByOwner) return [{ label: "", items: filtered }];
    const byOwner = new Map<string, Workflow[]>();
    for (const w of filtered) {
      const key = w.owner.kind === "all_teams" ? "All teams" : w.owner.name;
      if (!byOwner.has(key)) byOwner.set(key, []);
      byOwner.get(key)!.push(w);
    }
    return Array.from(byOwner.entries()).map(([label, items]) => ({ label, items }));
  }, [filtered, groupByOwner]);

  const ownerOptions = useMemo(() => {
    const names = new Set<string>();
    workflows.forEach((w) => { if (w.owner.kind === "person") names.add(w.owner.name); });
    return Array.from(names);
  }, [workflows]);

  return (
    <div className="absolute inset-0 bg-white z-[450] flex flex-col">
      <header className="h-14 px-5 flex items-center justify-between border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-[#F5F3FF] ring-1 ring-slate-200 grid place-items-center">
            <img src={character.src} alt="" aria-hidden className="w-[120%] h-[120%] object-contain" />
          </div>
          <div>
            <div className="text-[13px] font-semibold text-slate-900">{character.workTitle}</div>
            <div className="text-[11px] text-slate-500">{workflows.length} workflow{workflows.length === 1 ? "" : "s"} you've built together</div>
          </div>
        </div>
      </header>

      {(() => {
        const built = workflows.filter((w) => w.status === "built");
        const drafts = workflows.filter((w) => w.status === "draft");
        const withDate = built.filter((w) => w.lastAdjusted);
        const newest = [...withDate].sort((a, b) => (b.lastAdjusted || "").localeCompare(a.lastAdjusted || ""))[0];
        const draftWf = drafts[0];
        const notes: CharacterNote[] = [];
        let magBadge: string | null = null;

        const justBuilt = workflows.find((w) => w.justBuilt);
        if (workflows.length === 0) {
          notes.push({
            id: "mn-empty",
            kind: "recent",
            text: "No workflows yet — let's build one. When you're ready, hit 'Create a workflow' and I'll walk you through it.",
          });
          notes.push({
            id: "mn-totals",
            kind: "totals",
            text: "0 workflows · 0 built and running · 0 in draft.",
          });
          notes.push({
            id: "mn-coverage",
            kind: "coverage",
            text: "The workshop is empty — a clean bench, ready for the first piece of work.",
          });
        } else {
          if (justBuilt) {
            notes.push({
              id: "mn-justbuilt",
              kind: "recent",
              text: `Built '${justBuilt.name}' just now — a ${justBuilt.stepCount ?? "multi"}-step workflow ending in your approval.`,
              onClick: () => onView(justBuilt.id),
              ctaLabel: "open workflow →",
            });
          } else if (newest) {
            notes.push({
              id: "mn-recent",
              kind: "recent",
              text: `Last adjusted '${newest.name}' on ${newest.lastAdjusted}.`,
              onClick: () => onView(newest.id),
              ctaLabel: "open workflow →",
            });
          }
          notes.push({
            id: "mn-totals",
            kind: "totals",
            text: `${workflows.length} workflow${workflows.length === 1 ? "" : "s"} · ${built.length} built and running · ${drafts.length} in draft.`,
          });
          const pausedDrafts = drafts.filter((w) => !!w.draftState);
          if (pausedDrafts.length > 0) {
            const pd = pausedDrafts[0];
            notes.push({
              id: "mn-paused",
              kind: "issue",
              text: `${pausedDrafts.length} workflow${pausedDrafts.length === 1 ? "" : "s"} paused — saved as ${pausedDrafts.length === 1 ? "a draft" : "drafts"}. '${pd.name}' is waiting for us to pick it back up; nothing is watching from it yet.`,
              onClick: () => onResume?.(pd.id),
              ctaLabel: "resume draft →",
            });
          } else if (draftWf) {
            notes.push({
              id: "mn-issue",
              kind: "issue",
              text: `'${draftWf.name}' is still a draft — it needs your sign-off before it can run.`,
              onClick: () => onView(draftWf.id),
              ctaLabel: "open draft →",
            });
          } else {
            notes.push({
              id: "mn-coverage",
              kind: "coverage",
              text: "All workflows built and ready.",
            });
          }
          magBadge = pausedDrafts.length > 0 ? `${pausedDrafts.length} paused` : null;
        }


        return (
          <CharacterNotesStrip
            character={character}
            title="The Magician's notes"
            subtitle="recent builds & workshop state"
            tagline="what's running & what's paused"
            badge={magBadge}
            notes={notes}
          />
        );
      })()}


      {/* Filters */}
      <div className="px-5 py-3 border-b border-slate-100 flex flex-wrap items-center gap-2 shrink-0">
        <div className="relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by workflow name"
            className="text-[12px] pl-7 pr-3 py-1.5 rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40 w-64"
            aria-label="Search by workflow name"
          />
          <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-2 top-1/2 -translate-y-1/2">
            <circle cx="11" cy="11" r="7"/><path d="M21 21l-3.5-3.5"/>
          </svg>
        </div>

        <label className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1.5 rounded-md border border-dashed border-slate-300 bg-white text-slate-600 focus-within:border-[#7C3AED]/50">
          + Owner
          <select
            value={ownerFilter}
            onChange={(e) => setOwnerFilter(e.target.value)}
            className="bg-transparent text-[11px] outline-none ml-1"
            aria-label="Filter by owner"
          >
            <option value="all">All</option>
            <option value="mine">Just mine</option>
            <option value="__teams__">All teams</option>
            {ownerOptions.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>

        <label className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1.5 rounded-md border border-dashed border-slate-300 bg-white text-slate-600 focus-within:border-[#7C3AED]/50">
          + Status
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | WorkflowStatus)}
            className="bg-transparent text-[11px] outline-none ml-1"
            aria-label="Filter by status"
          >
            <option value="all">All</option>
            <option value="built">Built</option>
            <option value="draft">Draft</option>
          </select>
        </label>

        <label className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1.5 rounded-md border border-dashed border-slate-300 bg-white text-slate-600 focus-within:border-[#7C3AED]/50">
          + Applies to
          <select
            value={scopeFilter}
            onChange={(e) => setScopeFilter(e.target.value)}
            className="bg-transparent text-[11px] outline-none ml-1"
            aria-label="Filter by scope"
          >
            <option value="all">Any scope</option>
            <option value="portfolio">Portfolio-wide</option>
            <option value="property">Specific properties</option>
            <option value="unit">Specific units</option>
          </select>
        </label>

        <label className="inline-flex items-center gap-2 text-[11px] font-medium ml-auto text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            checked={groupByOwner}
            onChange={(e) => setGroupByOwner(e.target.checked)}
            className="accent-[#7C3AED]"
          />
          Group by owner
        </label>
        <div className="text-[11px] text-slate-500 ml-1">{filtered.length} workflow{filtered.length === 1 ? "" : "s"}</div>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-auto px-5 py-5 bg-slate-50/40">
        {workflows.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-12">
            <div className="text-[14px] font-semibold text-slate-700 mb-1.5">No workflows yet</div>
            <div className="text-[12px] text-slate-500 leading-relaxed">
              The workshop is empty — nothing watches your portfolio until you set it loose.
            </div>
          </div>
        ) : (
          <>
            {filtered.length === 0 && (
              <div className="max-w-md mx-auto text-center text-[12px] text-slate-500 py-10">No workflows match these filters.</div>
            )}
            {groups.map((g) => (
              <div key={g.label || "all"} className="mb-6 last:mb-0">
                {g.label && (
                  <div className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold mb-2 px-1">{g.label}</div>
                )}
                <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))" }}>
                  {g.items.map((w) => {
                    const statusLabel = w.draftState ? "Draft · paused" : (w.status === "draft" ? "Draft" : "Built");
                    return (
                      <CollapsibleSection
                        key={w.id}
                        className="bg-white border border-slate-200/70 rounded-lg shadow-[0_0.5px_0_rgba(0,0,0,0.04)]"
                        headerClassName="w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] rounded-lg"
                        contentClassName="px-2 pb-2 pt-2 border-t border-slate-100"
                        ariaLabel={`Toggle ${w.name}`}
                        summary={
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="text-[13px] font-semibold text-slate-900 truncate">{w.name}</div>
                            <span className="text-slate-400 shrink-0">·</span>
                            <div className="text-[11.5px] text-slate-500 truncate">{w.scopeLabel}</div>
                            <span className="ml-auto shrink-0 inline-flex items-center px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold uppercase tracking-wide">
                              {statusLabel}
                            </span>
                          </div>
                        }
                      >
                        <WorkflowCard
                          w={w}
                          onAdjust={() => onAdjust(w.id)}
                          onView={() => onView(w.id)}
                          onResume={w.draftState && onResume ? () => onResume(w.id) : undefined}
                          onDiscard={w.draftState && onDiscard ? () => onDiscard(w.id) : undefined}
                          onSimulate={onSimulate ? () => onSimulate(w.id) : undefined}
                        />
                      </CollapsibleSection>
                    );
                  })}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function WorkflowCard({ w, onAdjust, onView, onResume, onDiscard, onSimulate }: { w: Workflow; onAdjust: () => void; onView: () => void; onResume?: () => void; onDiscard?: () => void; onSimulate?: () => void }) {
  const [scopeOpen, setScopeOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const isPausedDraft = !!w.draftState;
  const d = w.draftState;
  const activity = w.activity ?? [];
  const latest = activity[0];


  // Per-field "captured / not yet set" inventory for paused drafts
  const fieldStatus = (() => {
    if (!isPausedDraft || !d) return null;
    const hasTitle = !!(d.title && d.title.trim());
    const hasPurpose = !!(d.purpose && d.purpose.trim());
    const hasWhen = !!(d.whenLabel && d.whenLabel.trim());
    const hasScope = !!(d.scopeLabel && d.scopeLabel.trim());
    const stepCount = d.steps?.length ?? 0;
    const filled = [hasTitle, hasPurpose, hasWhen, hasScope, stepCount > 0].filter(Boolean).length;
    return { hasTitle, hasPurpose, hasWhen, hasScope, stepCount, filled, total: 5 };
  })();

  return (
    <article
      className={
        isPausedDraft
          ? "rounded-lg p-4 flex flex-col gap-3 border border-dashed border-slate-300 bg-slate-50/60"
          : "rounded-lg p-3 flex flex-col gap-3 bg-white"
      }
      aria-label={isPausedDraft ? `${w.name} — draft in progress, unfinished` : w.name}
    >
      <header className="flex items-start gap-3">
        <div className={isPausedDraft ? "opacity-70" : ""}>
          <WorkflowIcon icon={w.icon} tone={w.tone} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <div className={`text-[13px] font-semibold leading-tight ${isPausedDraft ? "text-slate-700" : "text-slate-900"}`}>
              {w.name}
            </div>
            {w.visibility && !isPausedDraft && (
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${
                w.visibility === "company"
                  ? "border-[#7C3AED]/40 bg-[#F5F3FF] text-[#5B21B6]"
                  : "border-slate-300 bg-slate-50 text-slate-600"
              }`}>
                {w.visibility === "company" ? "Company-wide" : "Personal"}
              </span>
            )}
          </div>
          <div className={`text-[11.5px] mt-0.5 ${isPausedDraft ? "text-slate-500 italic" : "text-slate-500"}`}>
            {w.purpose || (isPausedDraft ? "Purpose — not yet set" : "")}
          </div>
          {w.description && !isPausedDraft && (
            <div className="text-[11.5px] text-slate-500 mt-1 italic">{w.description}</div>
          )}
        </div>
        <WorkflowStatusPill status={w.status} isPausedDraft={isPausedDraft} />
      </header>

      {isPausedDraft && fieldStatus ? (
        <>
          <div className="rounded-md bg-white/70 border border-dashed border-slate-300 px-3 py-2 text-[12px] leading-snug">
            <div className="flex items-center justify-between mb-1.5">
              <div className="text-[10.5px] uppercase tracking-wide font-semibold text-slate-500">
                What's captured so far
              </div>
              <div className="text-[10.5px] font-semibold text-slate-500">
                {fieldStatus.filled} of {fieldStatus.total} parts filled
              </div>
            </div>
            <DraftFieldRow label="Title" value={fieldStatus.hasTitle ? d!.title! : null} />
            <DraftFieldRow label="Purpose" value={fieldStatus.hasPurpose ? d!.purpose! : null} />
            <DraftFieldRow label="When" value={fieldStatus.hasWhen ? d!.whenLabel! : null} />
            <DraftFieldRow label="Applies to" value={fieldStatus.hasScope ? d!.scopeLabel! : null} />
            <DraftFieldRow
              label="Steps"
              value={fieldStatus.stepCount > 0 ? `${fieldStatus.stepCount} added` : null}
              emptyLabel="none yet"
            />
            <div className="mt-2 h-1 rounded-full bg-slate-200 overflow-hidden" aria-hidden>
              <div
                className="h-full bg-slate-400"
                style={{ width: `${Math.round((fieldStatus.filled / fieldStatus.total) * 100)}%` }}
              />
            </div>
          </div>
        </>
      ) : (
        <dl className="text-[12px] leading-snug space-y-1.5">
          <div className="flex gap-2">
            <dt className="text-slate-500 font-medium shrink-0 w-[80px]">When</dt>
            <dd className="text-slate-800">{w.trigger}</dd>
          </div>
          {w.whenLabel && (
            <div className="flex gap-2">
              <dt className="text-slate-500 font-medium shrink-0 w-[80px]">Shows</dt>
              <dd className="text-slate-800">{w.whenLabel}</dd>
            </div>
          )}
          <div className="flex gap-2">
            <dt className="text-[#5B21B6] font-medium shrink-0 w-[80px]">I will</dt>
            <dd className="text-slate-800">{w.action}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-slate-500 font-medium shrink-0 w-[80px]">Applies to</dt>
            <dd className="text-slate-800">
              {w.scopeLabel}
              {w.scopeDetail && w.scopeDetail.length > 0 && (
                <button
                  type="button"
                  onClick={() => setScopeOpen((v) => !v)}
                  className="ml-2 text-[11px] text-[#7C3AED] hover:underline focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40 rounded"
                  aria-expanded={scopeOpen}
                >
                  {scopeOpen ? "hide" : "show all"}
                </button>
              )}
              {scopeOpen && w.scopeDetail && (
                <ul className="mt-1.5 list-disc pl-5 text-[11.5px] text-slate-600 space-y-0.5">
                  {w.scopeDetail.map((line, i) => <li key={i}>{line}</li>)}
                </ul>
              )}
            </dd>
          </div>
        </dl>
      )}

      {!isPausedDraft && w.stepTemplates && Object.keys(w.stepTemplates).length > 0 && (
        <div className="text-[11.5px] text-[#5B21B6] -mt-1 flex flex-wrap items-center gap-1.5">
          <span aria-hidden>📎</span>
          <span>Using your template{Object.keys(w.stepTemplates).length === 1 ? "" : "s"}:</span>
          {Object.entries(w.stepTemplates).map(([k, t]) => (
            <span key={k} className="inline-flex items-center px-1.5 py-0.5 rounded-full border border-[#7C3AED]/30 bg-[#F5F3FF]" title={`${k}: ${t.filename ?? "uploaded"}`}>
              {t.filename ?? "uploaded"}
            </span>
          ))}
        </div>
      )}

      <footer className={`flex items-center justify-between gap-2 pt-2 border-t ${isPausedDraft ? "border-slate-200" : "border-slate-100"}`}>
        <div className="flex items-center gap-2 min-w-0 flex-wrap">
          <OwnerChip owner={w.owner} />
          <span className="text-[11px] text-slate-500 inline-flex items-center gap-1.5 flex-wrap">
            {latest ? (
              <>
                <ActorAvatar actor={latest.actor} />
                <span>
                  Last {latest.action.split("—")[0].trim().toLowerCase()} by{" "}
                  <span className="font-medium text-slate-700">{latest.actor.name}</span>
                  {" · "}
                  <span title={latest.tsLabel}>{latest.tsLabel}</span>
                </span>
              </>
            ) : (
              <span>
                {isPausedDraft
                  ? "Paused — nothing is watching yet"
                  : w.status === "draft"
                    ? "Draft · not yet finished"
                    : `Last adjusted ${w.lastAdjusted ?? "—"}`}
              </span>
            )}
            {activity.length > 0 && (
              <button
                type="button"
                onClick={() => setActivityOpen((v) => !v)}
                className="text-[11px] text-[#7C3AED] hover:underline focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40 rounded px-1"
                aria-expanded={activityOpen}
                aria-controls={`activity-${w.id}`}
              >
                {activityOpen ? "Hide activity" : `Activity (${activity.length})`}
              </button>
            )}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {isPausedDraft ? (
            <>
              {onDiscard && (
                confirmDiscard ? (
                  <span
                    role="alertdialog"
                    aria-label="Discard this draft"
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-rose-200 bg-rose-50 text-[11.5px] text-slate-700"
                  >
                    <span>Discard draft?</span>
                    <button
                      type="button"
                      onClick={() => { setConfirmDiscard(false); onDiscard(); }}
                      className="px-2 py-0.5 rounded bg-rose-600 text-white font-semibold hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-300"
                    >
                      Discard
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDiscard(false)}
                      className="px-2 py-0.5 rounded border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40"
                    >
                      Keep
                    </button>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDiscard(true)}
                    className="text-[12px] px-2.5 py-1.5 rounded-md text-slate-600 hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-300"
                  >
                    Discard
                  </button>
                )
              )}
              {onResume && (
                <button
                  type="button"
                  onClick={onResume}
                  className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-md bg-[#7C3AED] text-white hover:bg-[#6D28D9] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M8 5v14l11-7z"/></svg>
                  Resume
                </button>
              )}
            </>
          ) : (
            <>
              {onSimulate && (
                <button
                  type="button"
                  onClick={onSimulate}
                  className="inline-flex items-center gap-1 text-[12px] px-2.5 py-1.5 rounded-md border border-[#7C3AED]/40 bg-white text-[#5B21B6] hover:bg-[#F5F3FF] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40"
                  title="Safe preview — plays the workflow out in chat. Nothing is sent."
                  aria-label={`Run a simulation of ${w.name} — safe preview, nothing is sent`}
                >
                  <span aria-hidden>▷</span> Run a simulation
                </button>
              )}
              <button
                type="button"
                onClick={onView}
                className="text-[12px] px-2.5 py-1.5 rounded-md text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40"
              >
                View
              </button>
              <button
                type="button"
                onClick={onAdjust}
                className="text-[12px] font-semibold px-3 py-1.5 rounded-md bg-[#7C3AED] text-white hover:bg-[#6D28D9] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40"
              >
                Adjust
              </button>
            </>
          )}
        </div>
      </footer>

      {activityOpen && activity.length > 0 && (
        <div
          id={`activity-${w.id}`}
          className="rounded-md border border-slate-200 bg-slate-50/60 px-3 py-2"
          role="region"
          aria-label={`Activity log for ${w.name}`}
        >
          <div className="text-[10.5px] uppercase tracking-wide font-semibold text-slate-500 mb-1.5">
            Activity — most recent first
          </div>
          <ul className="space-y-1.5 max-h-48 overflow-y-auto">
            {activity.map((e) => (
              <li key={e.id} className="flex items-start gap-2 text-[11.5px] leading-snug">
                <ActorAvatar actor={e.actor} />
                <div className="min-w-0 flex-1">
                  <span className="text-slate-800">{e.action}</span>
                  <span className="text-slate-500"> by </span>
                  <span className="font-medium text-slate-700">{e.actor.name}</span>
                  {e.actor.role && <span className="text-slate-400"> ({e.actor.role})</span>}
                  <span className="text-slate-500"> · </span>
                  <span className="text-slate-500">{e.tsLabel}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

function ActorAvatar({ actor }: { actor: ActivityActor }) {
  return (
    <span
      className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#EDE9FE] text-[9.5px] font-semibold text-[#5B21B6] shrink-0"
      aria-label={`${actor.name}${actor.role ? `, ${actor.role}` : ""}`}
      title={`${actor.name}${actor.role ? ` · ${actor.role}` : ""}`}
    >
      {actor.initials}
    </span>
  );
}



function DraftFieldRow({ label, value, emptyLabel = "not yet set" }: { label: string; value: string | null; emptyLabel?: string }) {
  const empty = !value;
  return (
    <div className="flex gap-2 py-0.5">
      <span className="text-slate-500 font-medium shrink-0 w-[80px]">{label}</span>
      <span className={empty ? "text-slate-400 italic" : "text-slate-800"}>
        {empty ? emptyLabel : value}
      </span>
    </div>
  );
}


function WorkflowViewDialog({ workflow, onClose, onAdjust }: { workflow: Workflow; onClose: () => void; onAdjust: () => void }) {
  return (
    <div className="fixed inset-0 z-[600] bg-slate-900/40 grid place-items-center p-4" role="dialog" aria-modal="true" aria-label="Workflow details">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">
        <div className="flex items-start gap-3 mb-4">
          <WorkflowIcon icon={workflow.icon} tone={workflow.tone} />
          <div className="flex-1">
            <div className="text-[15px] font-semibold text-slate-900">{workflow.name}</div>
            <div className="text-[12px] text-slate-500">{workflow.purpose}</div>
          </div>
          <WorkflowStatusPill status={workflow.status} />
        </div>
        <dl className="text-[13px] space-y-2 mb-4">
          <div><dt className="text-slate-500 text-[11px] uppercase tracking-wide">When</dt><dd className="text-slate-800">{workflow.trigger}</dd></div>
          <div><dt className="text-[#5B21B6] text-[11px] uppercase tracking-wide">I will</dt><dd className="text-slate-800">{workflow.action}</dd></div>
          <div><dt className="text-slate-500 text-[11px] uppercase tracking-wide">Applies to</dt><dd className="text-slate-800">{workflow.scopeLabel}{workflow.scopeDetail && <ul className="list-disc pl-5 mt-1 text-[12px] text-slate-600">{workflow.scopeDetail.map((l, i) => <li key={i}>{l}</li>)}</ul>}</dd></div>
          <div><dt className="text-slate-500 text-[11px] uppercase tracking-wide">Owner</dt><dd className="mt-1"><OwnerChip owner={workflow.owner} /></dd></div>
        </dl>
        <div className="flex items-center justify-end gap-2">
          <button type="button" onClick={onClose} className="text-[12px] px-3 py-1.5 rounded-md text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40">Close</button>
          <button type="button" onClick={onAdjust} className="text-[12px] font-semibold px-3.5 py-1.5 rounded-md bg-[#7C3AED] text-white hover:bg-[#6D28D9] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40">Adjust</button>
        </div>
      </div>
    </div>
  );
}

function WorkflowAdjustDialog({ workflow, staff, onClose, onSave }: {
  workflow: Workflow;
  staff: { name: string; role: string; initials: string }[];
  onClose: () => void;
  onSave: (w: Workflow) => void;
}) {
  const [draft, setDraft] = useState<Workflow>(workflow);
  const setOwnerKind = (kind: "all_teams" | "person") => {
    if (kind === "all_teams") setDraft({ ...draft, owner: { kind: "all_teams" } });
    else {
      const first = staff[0];
      setDraft({ ...draft, owner: { kind: "person", name: first.name, role: first.role, initials: first.initials } });
    }
  };
  return (
    <div className="fixed inset-0 z-[600] bg-slate-900/40 grid place-items-center p-4" role="dialog" aria-modal="true" aria-label="Adjust workflow">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl p-6">
        <div className="flex items-start gap-3 mb-4">
          <WorkflowIcon icon={draft.icon} tone={draft.tone} />
          <div className="flex-1">
            <input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              className="w-full text-[15px] font-semibold text-slate-900 border-b border-slate-200 focus:border-[#7C3AED] outline-none pb-0.5"
              aria-label="Workflow name"
            />
            <input
              value={draft.purpose}
              onChange={(e) => setDraft({ ...draft, purpose: e.target.value })}
              className="w-full text-[12px] text-slate-500 mt-1 outline-none"
              aria-label="Workflow purpose"
            />
          </div>
        </div>

        <div className="space-y-3 text-[12px]">
          <label className="block">
            <span className="text-slate-500 text-[11px] uppercase tracking-wide">When</span>
            <input
              value={draft.trigger}
              onChange={(e) => setDraft({ ...draft, trigger: e.target.value })}
              className="mt-1 w-full px-2.5 py-2 rounded-md border border-slate-200 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/30 outline-none"
              placeholder="a rent review is 6 months away"
            />
          </label>
          <label className="block">
            <span className="text-[#5B21B6] text-[11px] uppercase tracking-wide">I will</span>
            <textarea
              value={draft.action}
              onChange={(e) => setDraft({ ...draft, action: e.target.value })}
              rows={2}
              className="mt-1 w-full px-2.5 py-2 rounded-md border border-slate-200 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/30 outline-none"
              placeholder="prepare the work and bring it to you for approval"
            />
            <span className="text-[11px] text-slate-400">Always ends in bringing it to you for approval.</span>
          </label>
          <label className="block">
            <span className="text-slate-500 text-[11px] uppercase tracking-wide">Applies to (scope)</span>
            <input
              value={draft.scopeLabel}
              onChange={(e) => setDraft({ ...draft, scopeLabel: e.target.value })}
              className="mt-1 w-full px-2.5 py-2 rounded-md border border-slate-200 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/30 outline-none"
              placeholder="All units across the portfolio · or specific properties / units"
            />
            <span className="text-[11px] text-slate-400">Portfolio-wide, specific properties, specific units, or a mix. Long scopes will be summarised on the card.</span>
          </label>

          <fieldset className="space-y-2">
            <legend className="text-slate-500 text-[11px] uppercase tracking-wide">Owner</legend>
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-1.5 text-[12px]">
                <input type="radio" name="owner-kind" checked={draft.owner.kind === "all_teams"} onChange={() => setOwnerKind("all_teams")} className="accent-[#7C3AED]" />
                All teams
              </label>
              <label className="inline-flex items-center gap-1.5 text-[12px]">
                <input type="radio" name="owner-kind" checked={draft.owner.kind === "person"} onChange={() => setOwnerKind("person")} className="accent-[#7C3AED]" />
                A specific person
              </label>
            </div>
            {draft.owner.kind === "person" && (
              <select
                value={draft.owner.name}
                onChange={(e) => {
                  const s = staff.find((x) => x.name === e.target.value);
                  if (s) setDraft({ ...draft, owner: { kind: "person", name: s.name, role: s.role, initials: s.initials } });
                }}
                className="w-full px-2.5 py-2 rounded-md border border-slate-200 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/30 outline-none text-[12px]"
                aria-label="Owner"
              >
                {staff.map((s) => <option key={s.name} value={s.name}>{s.name} — {s.role}</option>)}
              </select>
            )}
          </fieldset>

          <label className="block">
            <span className="text-slate-500 text-[11px] uppercase tracking-wide">Status</span>
            <select
              value={draft.status}
              onChange={(e) => setDraft({ ...draft, status: e.target.value as WorkflowStatus })}
              className="mt-1 w-full px-2.5 py-2 rounded-md border border-slate-200 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/30 outline-none text-[12px]"
            >
              <option value="draft">Draft</option>
              <option value="built">Built</option>
            </select>
          </label>
        </div>

        <div className="flex items-center justify-end gap-2 mt-5">
          <button type="button" onClick={onClose} className="text-[12px] px-3 py-1.5 rounded-md text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40">Cancel</button>
          <button
            type="button"
            onClick={() => onSave({ ...draft, lastAdjusted: draft.status === "built" ? "Today" : draft.lastAdjusted })}
            className="text-[12px] font-semibold px-3.5 py-1.5 rounded-md bg-[#7C3AED] text-white hover:bg-[#6D28D9] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- The Broker — composer + black book ---------- */

function BrokerComposer({ onAdd, onUpload, flow, onSubmitAnswer, onCancel }: {
  onAdd: () => void;
  onUpload: (filename: string) => void;
  flow: { step: number; draft: Partial<BrokerContact> } | null;
  onSubmitAnswer: (answer: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const stepKey = flow?.step ?? -1;
  useEffect(() => {
    setValue("");
    if (flow) {
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [stepKey, flow]);

  if (!flow) {
    return (
      <div className="flex flex-col gap-2">
        <div className="px-4 py-3 rounded-2xl border-2 border-dashed border-[#7C3AED]/40 bg-white flex flex-col gap-2.5">
          <div className="text-[12px] text-slate-700 leading-snug">
            Add a contact and I'll take you through it — or hand me a spreadsheet of your contacts and I'll read them in. Either way, I'll connect each one to the right properties and remember how they relate.
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onAdd}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#7C3AED] text-white text-[13px] font-semibold shadow-sm hover:bg-[#6D28D9] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M19 8v6M22 11h-6"/>
              </svg>
              Add a contact
            </button>
            <span className="text-[11px] text-slate-400 px-0.5">or</span>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-[#7C3AED]/60 bg-white text-[#7C3AED] text-[13px] font-semibold hover:bg-[#F5F3FF] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M3 7h6v4H3zM3 13h6v4H3zM11 7h10v10H11z"/>
                <path d="M16 3v4M14 5h4"/>
              </svg>
              Upload contacts
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              className="sr-only"
              aria-label="Upload contacts spreadsheet"
              onChange={(e) => {
                const f = e.target.files?.[0];
                onUpload(f?.name || "contacts-export.csv");
                if (fileRef.current) fileRef.current.value = "";
              }}
            />
          </div>
          <div className="text-[11px] text-slate-500">
            One contact at a time, or a whole list (CSV / XLSX). I'll flag anything I can't place — I won't invent details or silently merge duplicates.
          </div>
        </div>
      </div>
    );
  }

  const q = BROKER_QUESTIONS[flow.step];
  const total = BROKER_QUESTIONS.length;
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = value.trim();
    if (!v) return;
    onSubmitAnswer(v);
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between px-1">
        <div className="text-[11px] uppercase tracking-wide font-semibold text-[#7C3AED]">
          The Broker · question {flow.step + 1} of {total}
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="text-[11px] font-medium text-slate-500 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 rounded px-1.5 py-0.5"
        >
          Cancel
        </button>
      </div>
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#7C3AED]/40 bg-white focus-within:border-[#7C3AED] focus-within:ring-2 focus-within:ring-[#7C3AED]/20 transition">
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={q.placeholder}
          className="flex-1 outline-none text-sm bg-transparent placeholder:text-slate-400"
          aria-label={q.ask}
        />
        <button
          type="submit"
          disabled={!value.trim()}
          className="flex items-center justify-center h-9 w-9 rounded-full bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition disabled:bg-slate-200 disabled:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40"
          aria-label="Send answer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6"/>
          </svg>
        </button>
      </div>
    </form>
  );
}

function BrokerWorkArea({ character, contacts, onAdd }: {
  character: { id: AdminCharacter; name: string; src: string; tagline: string; workTitle: string };
  contacts: BrokerContact[];
  onAdd: () => void;
}) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | BrokerContactType>("all");
  const [flaggedOnly, setFlaggedOnly] = useState(false);

  const filtered = contacts.filter((c) => {
    if (typeFilter !== "all" && c.type !== typeFilter) return false;
    if (flaggedOnly && !c.flagged) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q) || c.relatedTo.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  });

  const order: BrokerContactType[] = ["staff", "subcontractor", "occupant", "misc"];
  const groups = order.map((t) => ({ type: t, items: filtered.filter((c) => c.type === t) }));

  return (
    <div className="absolute inset-0 bg-white z-[450] flex flex-col">
      <header className="h-14 px-5 flex items-center border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-[#F5F3FF] ring-1 ring-slate-200 grid place-items-center">
            <img src={character.src} alt="" aria-hidden className="w-[120%] h-[120%] object-contain" />
          </div>
          <div>
            <div className="text-[13px] font-semibold text-slate-900">The Broker's black book</div>
            <div className="text-[11px] text-slate-500">{contacts.length} contact{contacts.length === 1 ? "" : "s"} across your portfolio</div>
          </div>
        </div>
      </header>

      {(() => {
        const linkedProperties = new Set<string>();
        contacts.forEach((c) => {
          const matches = c.relatedTo.match(/(5 Nugent Terrace|Stanley House|Cromwell Mews|Beaufort Mews)/g) || [];
          matches.forEach((m) => linkedProperties.add(m));
        });
        const flagged = contacts.filter((c) => c.flagged);
        const importedCount = contacts.filter((c) => c.imported).length;
        const importedFlagged = contacts.filter((c) => c.imported && c.flagged).length;
        const notes: CharacterNote[] = [];
        if (importedCount > 0) {
          notes.push({
            id: "bn-import",
            kind: "recent",
            text: `Added ${importedCount} contacts via import this week${importedFlagged > 0 ? ` · ${importedFlagged} need attention` : ""}.`,
          });
        } else {
          notes.push({
            id: "bn-recent",
            kind: "recent",
            text: "Added 2 contacts this week — Firewatch Ltd and Voltedge. Updated M&S's preferred contact.",
          });
        }
        notes.push({
          id: "bn-totals",
          kind: "totals",
          text: `${contacts.length} contact${contacts.length === 1 ? "" : "s"} · linked across ${linkedProperties.size} propert${linkedProperties.size === 1 ? "y" : "ies"}.`,
        });
        notes.push({
          id: "bn-issue",
          kind: "issue",
          text: "Several occupied units have no tenant contact on file yet — notices the Magician's workflows draft can't reach them until I've added one.",
        });
        if (flagged.length > 0) {
          notes.push({
            id: "bn-flagged",
            kind: "coverage",
            text: `${flagged.length} contact${flagged.length === 1 ? "" : "s"} flagged for your attention — ${flagged.map((c) => c.name).join(", ")}.`,
          });
        }
        return (
          <CharacterNotesStrip
            character={character}
            title="The Broker's notes"
            subtitle="recent additions & relationship gaps"
            tagline="the state of the black book"
            notes={notes}

          />
        );
      })()}

      {/* Filters */}
      <div className="px-5 py-3 border-b border-slate-100 flex flex-wrap items-center gap-2 shrink-0">
        <div className="relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by contact name"
            className="text-[12px] pl-7 pr-3 py-1.5 rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40 w-64"
            aria-label="Search by contact name"
          />
          <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-2 top-1/2 -translate-y-1/2">
            <circle cx="11" cy="11" r="7"/><path d="M21 21l-3.5-3.5"/>
          </svg>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {(["all", "staff", "subcontractor", "occupant", "misc"] as const).map((t) => {
            const active = typeFilter === t;
            const label = t === "all" ? "Type: All" : BROKER_TYPE_META[t].label;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTypeFilter(t)}
                aria-pressed={active}
                className={`text-[11px] font-medium px-2.5 py-1.5 rounded-full border focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 ${
                  active ? "border-[#7C3AED] bg-[#F5F3FF] text-[#7C3AED]" : "border-slate-200 bg-white text-slate-600 hover:border-[#7C3AED]/50 hover:text-[#7C3AED]"
                }`}
              >
                {label}
              </button>
            );
          })}
          <button
            type="button"
            aria-disabled="true"
            className="text-[11px] font-medium px-2.5 py-1.5 rounded-full border border-slate-200 bg-white text-slate-500 hover:border-[#7C3AED]/40 hover:text-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
            title="Filter by linked property or unit"
          >
            Linked property/unit
          </button>
          <button
            type="button"
            onClick={() => setFlaggedOnly((v) => !v)}
            aria-pressed={flaggedOnly}
            className={`text-[11px] font-medium px-2.5 py-1.5 rounded-full border focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 ${
              flaggedOnly ? "border-amber-400 bg-amber-50 text-amber-700" : "border-slate-200 bg-white text-slate-600 hover:border-amber-400/60 hover:text-amber-700"
            }`}
          >
            Flagged
          </button>
        </div>
      </div>

      {/* Groups */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {filtered.length === 0 && (
          <div className="max-w-md mx-auto text-center text-[12px] text-slate-500 py-10">No contacts match these filters.</div>
        )}
        {groups.map((g) => {
          if (g.items.length === 0) return null;
          const meta = BROKER_TYPE_META[g.type];
          return (
            <div key={g.type} className="mb-3 last:mb-0">
              <CollapsibleSection
                className="bg-white border border-slate-200 rounded-xl"
                headerClassName="w-full flex items-center gap-2.5 px-4 py-3 text-left hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] rounded-xl"
                contentClassName="px-4 pb-4 pt-3 border-t border-slate-100"
                ariaLabel={`Toggle ${meta.label}`}
                summary={
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md ${meta.bg} ${meta.text} ring-1 ${meta.ring} shrink-0`} aria-hidden>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{meta.iconPath}</svg>
                    </span>
                    <h3 className="text-[12px] uppercase tracking-wide font-semibold text-slate-700 truncate">{meta.label}</h3>
                    <span className="text-[11px] text-slate-500 shrink-0">· {g.items.length}</span>
                  </div>
                }
              >
                <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
                  {g.items.map((c) => (
                    <BrokerContactCard key={c.id} contact={c} />
                  ))}
                </div>
              </CollapsibleSection>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BrokerContactCard({ contact }: { contact: BrokerContact }) {
  const meta = BROKER_TYPE_META[contact.type];
  const stop = (e: React.SyntheticEvent) => e.stopPropagation();
  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-3.5 hover:border-[#7C3AED]/50 hover:shadow-sm transition focus-within:ring-2 focus-within:ring-[#7C3AED]/40">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-full grid place-items-center ${meta.bg} ${meta.text} ring-1 ${meta.ring} text-[12px] font-semibold shrink-0`} aria-hidden>
          {contact.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <div className="text-[13px] font-semibold text-slate-900 truncate">{contact.name}</div>
            <span className={`text-[10px] uppercase tracking-wide font-semibold px-1.5 py-0.5 rounded ${meta.bg} ${meta.text}`}>{meta.label}</span>
            {contact.flagged && (
              <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide font-semibold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 ring-1 ring-amber-200" aria-label={contact.flagLabel || "Flagged"}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M4 21V4h12l-2 4 2 4H4"/></svg>
                {contact.flagLabel || "Flagged"}
              </span>
            )}
          </div>
          <div className="text-[11.5px] text-slate-600 mt-0.5">{contact.role}</div>
        </div>
      </div>

      {/* Details */}
      <dl className="mt-3 space-y-1.5 text-[11.5px] text-slate-700">
        <div className="flex items-start gap-2">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0" aria-hidden><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>
          <a href={`mailto:${contact.email}`} onClick={stop} className="truncate text-slate-700 hover:text-[#7C3AED] hover:underline focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 rounded-sm">{contact.email}</a>
        </div>
        <div className="flex items-start gap-2">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0" aria-hidden><path d="M22 16.92V21a1 1 0 01-1.1 1A19 19 0 012 4.1 1 1 0 013 3h4.09a1 1 0 011 .75l1 4a1 1 0 01-.27 1L7 10.5a16 16 0 006.5 6.5l1.75-1.82a1 1 0 011-.27l4 1a1 1 0 01.75 1z"/></svg>
          <div className="min-w-0">
            <a href={`tel:${contact.phone.replace(/\s+/g, "")}`} onClick={stop} className="text-slate-700 hover:text-[#7C3AED] hover:underline focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 rounded-sm">{contact.phone}</a>
            <span className="text-slate-500"> · {contact.contactPref}</span>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0" aria-hidden><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span className="truncate">{contact.address}</span>
        </div>
        <div className="flex items-start gap-2">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0" aria-hidden><path d="M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1"/><path d="M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1"/></svg>
          <span className="text-slate-700"><span className="text-slate-500">Related: </span>{contact.relatedTo}</span>
        </div>
      </dl>

      {/* Footer */}
      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-end gap-1">
        <button
          type="button"
          onClick={stop}
          className="text-[11px] font-medium px-2 py-1 rounded-md text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={stop}
          className="text-[11px] font-medium px-2 py-1 rounded-md text-[#7C3AED] hover:bg-[#F5F3FF] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30"
        >
          Open →
        </button>
      </div>
    </div>
  );
}

export default Prototype;


