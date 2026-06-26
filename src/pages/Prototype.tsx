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
import { DocumentsLibrary } from "@/components/prototype/DocumentsLibrary";

type AdminCharacter = "magician" | "professor" | "broker";
const ADMIN_CHARACTERS: { id: AdminCharacter; name: string; src: string; tagline: string; greeting: string; workTitle: string; workIntro: string }[] = [
  {
    id: "magician",
    name: "The Magician",
    src: characterMagician,
    tagline: "Workflows & automations",
    greeting: "This is where we make the magic together. Tell me what you'd like to keep on top of — rent reviews, compliance, notice deadlines — and I'll build a workflow that watches for it and prepares the work before you ask. Press \u201cCreate a workflow\u201d and we'll build one together.",
    workTitle: "The Magician's workshop",
    workIntro: "Where automations are composed and rehearsed before they go live.",
  },
  {
    id: "professor",
    name: "The Professor",
    src: characterProfessor,
    tagline: "Knowledge & research",
    greeting: "Good day. I am The Professor. I read every document in your portfolio and turn it into the knowledge Hobson relies upon.",
    workTitle: "The Professor's library",
    workIntro: "Where the knowledge base is curated, taught and consulted.",
  },
  {
    id: "broker",
    name: "The Broker",
    src: characterBroker,
    tagline: "Contacts & relationships",
    greeting: "I keep your black book — every contact tied to your portfolio, and the history between them. Staff, subcontractors, occupants, and anyone else who matters. Add a contact and I'll connect them to the right properties and remember how they've behaved.",
    workTitle: "The Broker's black book",
    workIntro: "Where contacts, relationships and their histories are kept — tenants, landlords, contractors, agents, solicitors, lenders, authorities.",

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
};

const SEED_WORKFLOWS: Workflow[] = [
  {
    id: "wf-1",
    name: "Rent review watch",
    purpose: "Spots rent reviews early and drafts the review summary.",
    icon: "calendar", tone: "purple", status: "built",
    trigger: "a rent review is 6 months away",
    action: "read the lease, prepare a review summary, and bring it to you for approval",
    scopeLabel: "Flat 8 and Flat 6, Stanley House",
    owner: { kind: "person", name: "Sarah Chen", role: "Asset Manager", initials: "SC" },
    lastAdjusted: "12 May 2026",
  },
  {
    id: "wf-2",
    name: "Compliance renewals",
    purpose: "Keeps certificates current across the portfolio.",
    icon: "shield", tone: "teal", status: "built",
    trigger: "a certificate nears its expiry window",
    action: "find your contractor, draft the inspection and access emails, and hold them for your approval",
    scopeLabel: "All properties",
    owner: { kind: "all_teams" },
    lastAdjusted: "3 Jun 2026",
  },
  {
    id: "wf-3",
    name: "Notice deadlines",
    purpose: "Catches break and notice dates before they slip.",
    icon: "alert", tone: "amber", status: "draft",
    trigger: "a break or notice deadline approaches",
    action: "prepare the notice in good time so the right is never lost, ready for you to serve",
    scopeLabel: "Stanley House (all units) + Flat 2, Nugent Terrace",
    owner: { kind: "person", name: "James Okoro", role: "Lease Manager", initials: "JO" },
  },
  {
    id: "wf-4",
    name: "Notice effect watch",
    purpose: "Anticipates what happens when a served notice lands.",
    icon: "bell", tone: "purple", status: "built",
    trigger: "a served notice is about to take effect",
    action: "explain what's about to happen and prepare the next step for your approval",
    scopeLabel: "3 properties \u00b7 14 units",
    scopeDetail: [
      "Stanley House — all 8 units",
      "5 Nugent Terrace — Flat 1, Flat 2, Flat 3, Flat 4",
      "Beaufort Mews — Unit A, Unit B",
    ],
    owner: { kind: "person", name: "Sarah Chen", role: "Asset Manager", initials: "SC" },
    lastAdjusted: "28 May 2026",
  },
  {
    id: "wf-5",
    name: "EPC renewals",
    purpose: "Keeps EPCs valid and bookings booked.",
    icon: "leaf", tone: "teal", status: "built",
    trigger: "an EPC nears expiry",
    action: "instruct an accredited assessor and prepare access notes for your approval",
    scopeLabel: "All properties",
    owner: { kind: "all_teams" },
    lastAdjusted: "1 Jun 2026",
  },
];

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
      `Good morning, ${FIRST_NAME}. I am Hobson — a colleague entrusted with helping you look after your portfolio.`,
      
      "If I may, I should like to explain how I work.",
    ],
    prefill: "Go ahead",
    mapAction: "none",
  },
  {
    owl: "default",
    lines: [
      
      "Your assets — your properties and units — are what I seek to understand. Your documents are how I come to understand them.",
      
    ],
    prefill: "How, do you visualise my portfolio?",
    mapAction: "none",
  },
  {
    owl: "default",
    lines: [
      "I regard your portfolio as a collection of units — some gathered together under one roof as a Property, others standing on their own. The unit is the occupiable space, and it sits at the very heart of how I view things.",
    ],
    prefill: "And where do documents belong in that?",
    mapAction: "pulse-one",
  },
  {
    owl: "reading",
    lines: [
      "I read two families of document: those that describe the occupation, and those that describe the asset itself — the property and units.",
      
    ],
    prefill: "How does your reading become knowledge?",
    mapAction: "pulse-one-doc",
  },
  {
    owl: "default",
    lines: [
      "Seldom does a single document tell the whole story. I build understanding by drawing connections between them — a lease, the variation that altered its rent, the assignment that brought in a new tenant.",
      "From those connections I form Unit and Property Knowledge — together they help me build the Portfolio Knowledge.",
    ],
    prefill: "What does that allow you to do on my behalf?",
    mapAction: "pulse-all",
  },
  {
    owl: "talking",
    lines: [
      "At present, I answer your questions and keep your information organised, connected and current.",
      "As my knowledge builds, I am able to do more for you. I shall read the documents, gather what is needed, and prepare the work — then bring it to you for approval. The decision is always yours; the preparation is mine.",
      
    ],
    prefill: "Yes — please show me around.",
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
  rich?: "rentFlat2";
  kind?: "feedback";
  feedback?: FeedbackState;
  /** Optional component-tag chips offered with the feedback ask (Helpful/Partly/Not). */
  feedbackChips?: string[];
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
          const line = L.polyline([points[k].orig, newLatLng], {
            color: "#94A3B8",
            weight: 1,
            opacity: 0.65,
            interactive: false,
            dashArray: "2,3",
          }).addTo(map);
          connectorsRef.current[id] = line;
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
    setAdminMode(true);
  };
  const exitAdmin = () => {
    setAdminMode(false);
    setAdminCharacter(null);
  };
  const selectAdminCharacter = (c: AdminCharacter) => setAdminCharacter(c);

  // ----- Professor library state -----
  const [profDocs, setProfDocs] = useState<ProfDoc[]>(SEED_PROF_DOCS);
  const [profEvents, setProfEvents] = useState<ProfEvent[]>([]);

  // ----- Magician workshop state -----
  const [workflows, setWorkflows] = useState<Workflow[]>(SEED_WORKFLOWS);
  const [adjustingWorkflowId, setAdjustingWorkflowId] = useState<string | null>(null);
  const [viewingWorkflowId, setViewingWorkflowId] = useState<string | null>(null);

  const handleCreateWorkflow = () => {
    const id = `wf-${Date.now()}`;
    const draft: Workflow = {
      id,
      name: "Untitled workflow",
      purpose: "Tell me what to watch for and I'll prepare it.",
      icon: "wand", tone: "slate", status: "draft",
      trigger: "—",
      action: "prepare the work and bring it to you for approval",
      scopeLabel: "Not yet set",
      owner: { kind: "all_teams" },
    };
    setWorkflows((arr) => [draft, ...arr]);
    setAdjustingWorkflowId(id);
  };

  const handleSaveWorkflow = (next: Workflow) => {
    setWorkflows((arr) => arr.map((w) => w.id === next.id ? next : w));
    setAdjustingWorkflowId(null);
  };



  // ----- Broker black-book state -----
  const [contacts, setContacts] = useState<BrokerContact[]>(SEED_BROKER_CONTACTS);
  const [brokerEvents, setBrokerEvents] = useState<BrokerEvent[]>([]);
  const [brokerFlow, setBrokerFlow] = useState<{ step: number; draft: Partial<BrokerContact> } | null>(null);

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
    const text = "Did that answer your question?";
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
          `Good morning, ${FIRST_NAME}. For the purpose of testing, please use the map or the search to go straight to your unit — that is where I can answer your questions today.`,
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
    const greet = testerMode
      ? `This is ${p.name}. Select a unit below to open it — that is where we can talk.`
      : carriedCard
        ? `Here's ${p.name}. ${carriedCard.title} is the one that needs you — and here's everything else on this building.`
        : `Here you are, ${FIRST_NAME} — ${p.name}, London ${p.postcode}. ${p.units.length} units. Pick one to open.`;
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

    // Admin trail
    if (adminMode) {
      const arr: { label: string; onClick?: () => void }[] = [
        { label: "Admin", onClick: adminCharacter ? () => setAdminCharacter(null) : undefined },
      ];
      if (adminCharacter) {
        const c = ADMIN_CHARACTERS.find((x) => x.id === adminCharacter);
        if (c) arr.push({ label: c.name });
      }
      return arr;
    }

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
  }, [view, selectedProperty, selectedUnit, showDocuments, showWhatIveDone, adminMode, adminCharacter]);


  /* ============ Render ============ */

  // Map must stay visible during the onboarding tour (Step 5 uses map search).
  // Honour user preference otherwise.
  const hasRightOverlay = showDocuments || showWhatIveDone || !!performingCardId || !!reviewingCardId || (adminMode && !!adminCharacter);
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
          className={`w-10 h-10 rounded-xl bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] grid place-items-center text-white font-bold mb-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40 ${adminMode ? "cursor-pointer hover:brightness-110" : "cursor-default"}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L22 12L12 22L2 12L12 2Z" fill="white" />
          </svg>
        </button>
        {adminMode ? (
          <>
            <div className="flex flex-col items-center w-full" style={{ gap: 24, marginTop: 40 }}>
              {ADMIN_CHARACTERS.map((c) => (
                <CharacterRailItem
                  key={c.id}
                  name={c.name}
                  src={c.src}
                  active={adminCharacter === c.id}
                  onClick={() => selectAdminCharacter(c.id)}
                />
              ))}
            </div>
            {/* Discreet way out of Admin, well below the characters */}
            <button
              type="button"
              onClick={exitAdmin}
              aria-label="Exit Admin and return to main menu"
              title="Exit Admin"
              className="mt-8 w-[56px] flex flex-col items-center gap-1 py-1.5 rounded-lg text-slate-500 hover:text-[#7C3AED] hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M15 18l-6-6 6-6"/>
              </svg>
              <span className="text-[10px] leading-tight text-center">Exit Admin</span>
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
          <div className="flex items-center gap-1 text-slate-400">
            <button className="p-1.5 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] rounded" aria-label="Close">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
            </button>
          </div>
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
        ) : (
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
        )}


        {/* Body */}
        <div ref={chatBodyRef} className={`flex-1 overflow-y-auto px-5 pb-5 pt-0 ${isExpanded ? "w-full" : ""}`}>
          <div
            className={`${isExpanded ? "max-w-[820px] mx-auto" : ""} flex flex-col`}
            style={{ gap: CHAT_TURN_GAP_PX, paddingTop: CHAT_TOP_GAP_PX }}
          >

          {adminMode ? (
            <AdminChat
              character={adminCharacter ? ADMIN_CHARACTERS.find((c) => c.id === adminCharacter)! : null}
              owl={owl}
              professorEvents={adminCharacter === "professor" ? profEvents : undefined}
              onAssignProfessorType={assignProfessorType}
              brokerEvents={adminCharacter === "broker" ? brokerEvents : undefined}
              brokerFlowActive={adminCharacter === "broker" && !!brokerFlow}
            />
          ) : (<>





          {/* Pinned alert briefing at the top of unit chat */}
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
                // Carried card surfaces first
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

          {/* Hobson messages render first so the greeting sits at the top */}
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
                      ) : (
                        <HobsonBubble
                          key={m.id}
                          text={m.text}
                          owl={owl}
                          streaming={!!m.streaming}
                          rich={m.rich}
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


          {/* (Global search/recents panel is intentionally NOT shown at property level — that belongs to Portfolio returning mode only.) */}




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
            adminCharacter === "professor"
              ? <ProfessorComposer onUpload={handleProfessorUpload} />
              : adminCharacter === "magician"
                ? <MagicianComposer onCreate={handleCreateWorkflow} />
                  : adminCharacter === "broker"
                    ? <BrokerComposer
                        onAdd={handleAddBrokerContact}
                        onUpload={handleUploadBrokerContacts}
                        flow={brokerFlow}
                        onSubmitAnswer={submitBrokerAnswer}
                        onCancel={cancelBrokerFlow}
                      />
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



        {/* Global map search — persistent on every level (hidden during Meet Hobson) */}
        {view !== "onboarding" && (
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



        {/* Map/Satellite toggle */}
        <div className="absolute bottom-4 right-4 z-[400] bg-white rounded-md shadow-md text-xs font-medium flex">
          <button className="px-3 py-1.5 bg-slate-900 text-white rounded-l-md">Map</button>
          <button className="px-3 py-1.5 text-slate-600 rounded-r-md">Satellite</button>
        </div>


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
            />

          );
        })()}
        {adminMode && adminCharacter && (() => {
          const c = ADMIN_CHARACTERS.find((x) => x.id === adminCharacter)!;
          if (c.id === "professor") {
            return <ProfessorWorkArea character={c} docs={profDocs} />;
          }
          if (c.id === "magician") {
            return (
              <MagicianWorkArea
                character={c}
                workflows={workflows}
                onCreate={handleCreateWorkflow}
                onAdjust={(id) => setAdjustingWorkflowId(id)}
                onView={(id) => setViewingWorkflowId(id)}
              />
            );
          }
          if (c.id === "broker") {
            return <BrokerWorkArea character={c} contacts={contacts} onAdd={handleAddBrokerContact} />;
          }
          return <AdminWorkArea character={c} />;

        })()}

      </main>
      ); })()}

      {/* Magician — Adjust / View dialogs */}
      {adjustingWorkflowId && (
        <WorkflowAdjustDialog
          workflow={workflows.find((w) => w.id === adjustingWorkflowId)!}
          staff={MAGICIAN_STAFF}
          onClose={() => setAdjustingWorkflowId(null)}
          onSave={handleSaveWorkflow}
        />
      )}
      {viewingWorkflowId && (
        <WorkflowViewDialog
          workflow={workflows.find((w) => w.id === viewingWorkflowId)!}
          onClose={() => setViewingWorkflowId(null)}
          onAdjust={() => { setViewingWorkflowId(null); setAdjustingWorkflowId(viewingWorkflowId); }}
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

function CharacterRailItem({ name, src, active, onClick }: { name: string; src: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      aria-label={name}
      className={`w-14 flex flex-col items-center gap-1 py-1.5 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40 ${
        active ? "bg-[#F5F3FF] ring-1 ring-[#7C3AED]/40" : "hover:bg-slate-50"
      }`}
    >
      <div className={`w-11 h-11 rounded-full overflow-hidden bg-[#F5F3FF] grid place-items-center ${active ? "ring-2 ring-[#7C3AED]" : "ring-1 ring-slate-200"}`}>
        <img src={src} alt="" aria-hidden className="w-[120%] h-[120%] object-contain object-center" />
      </div>
      <span className={`text-[10px] text-center leading-tight ${active ? "text-[#7C3AED] font-medium" : "text-slate-600"}`}>{name}</span>
    </button>
  );
}

function CharacterAvatar({ src }: { src: string }) {
  return (
    <div className="w-10 h-10 shrink-0 rounded-full overflow-hidden bg-[#F5F3FF] ring-1 ring-slate-200 grid place-items-center">
      <img src={src} alt="" aria-hidden className="w-[120%] h-[120%] object-contain object-center" />
    </div>
  );
}

const HOBSON_ADMIN_INTRO = "Welcome to Admin, where my colleagues can assist. Select one of them and they will assist you.";

function AdminChat({ character, owl, professorEvents, onAssignProfessorType, brokerEvents, brokerFlowActive }: { character: { id: AdminCharacter; name: string; src: string; greeting: string } | null; owl: OwlState; professorEvents?: ProfEvent[]; onAssignProfessorType?: (batchId: string, type: string) => void; brokerEvents?: BrokerEvent[]; brokerFlowActive?: boolean }) {
  const [phase, setPhase] = useState<"typing" | "streaming" | "done">("typing");
  const [shown, setShown] = useState("");
  const reducedMotion = typeof window !== "undefined"
    && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const speaker: "hobson" | "character" = character ? "character" : "hobson";
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

  const Avatar = speaker === "character" && character
    ? <CharacterAvatar src={character.src} />
    : <OwlAvatar state={owl} />;

  return (
    <div className="flex flex-col" style={{ gap: CHAT_TURN_GAP_PX }}>
      {phase === "typing" && (
        <div key={`${keyId}-typing`} className="flex items-end gap-2" aria-live="polite" aria-label={`${character?.name ?? "Hobson"} is typing`}>
          {Avatar}
          <div className="bg-[#EDE9FE] px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1">
            <Dot delay={0} /><Dot delay={150} /><Dot delay={300} />
          </div>
        </div>
      )}
      {phase !== "typing" && (
        <div key={keyId} className="flex items-end gap-2" aria-live="polite">
          {Avatar}
          <div className="max-w-[420px] bg-[#EDE9FE] text-[#1F2330] text-sm leading-relaxed px-4 py-2.5 rounded-2xl rounded-bl-md">
            {speaker === "hobson" && (
              <div className="text-[12px] font-semibold text-slate-900 mb-1">Hobson</div>
            )}
            {shown}
            {phase === "streaming" && (
              <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-[#7C3AED] align-middle animate-pulse" />
            )}
          </div>
        </div>
      )}
      {character?.id === "magician" && phase === "done" && (
        <div className="flex items-end gap-2">
          <CharacterAvatar src={character.src} />
          <div className="max-w-[420px] bg-[#EDE9FE] text-[#1F2330] text-sm leading-relaxed px-4 py-2.5 rounded-2xl rounded-bl-md">
            Press <span className="font-semibold">"Create a workflow"</span> below and we'll build one together — I'll ask the questions and you will provide the answers — Lets go!
          </div>
        </div>
      )}
      {character?.id === "professor" && phase === "done" && (
        <>
          <div className="flex items-end gap-2">
            <CharacterAvatar src={character.src} />
            <div className="max-w-[420px] bg-[#EDE9FE] text-[#1F2330] text-sm leading-relaxed px-4 py-2.5 rounded-2xl rounded-bl-md">
              Hand me a document and I shall read it for you — a lease, a certificate, a notice. Upload one or several, and I will tell you what each one is and what it means for your portfolio.
            </div>
          </div>
          <div className="flex items-end gap-2">
            <CharacterAvatar src={character.src} />
            <div className="max-w-[420px] bg-[#EDE9FE] text-[#1F2330] text-sm leading-relaxed px-4 py-2.5 rounded-2xl rounded-bl-md">
              Use <span className="font-semibold">"Upload documents"</span> below to begin — I'll take it from there.
            </div>
          </div>
        </>
      )}
      {character?.id === "professor" && phase === "done" && professorEvents && professorEvents.length > 0 && (
        <div className="flex flex-col" style={{ gap: CHAT_TURN_GAP_PX }}>
          {professorEvents.map((ev) => {
            if (ev.kind === "professor") {
              return (
                <div key={ev.id} className="flex items-end gap-2">
                  <CharacterAvatar src={character.src} />
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
      {character?.id === "broker" && phase === "done" && !brokerFlowActive && (!brokerEvents || brokerEvents.length === 0) && (
        <div className="flex items-end gap-2">
          <CharacterAvatar src={character.src} />
          <div className="max-w-[420px] bg-[#EDE9FE] text-[#1F2330] text-sm leading-relaxed px-4 py-2.5 rounded-2xl rounded-bl-md">
            Press <span className="font-semibold">"Add a contact"</span> below and we'll add one together — I'll ask the questions and you will provide the answers — Lets go!
          </div>
        </div>
      )}
      {character?.id === "broker" && phase === "done" && brokerEvents && brokerEvents.length > 0 && (
        <div className="flex flex-col" style={{ gap: CHAT_TURN_GAP_PX }}>
          {brokerEvents.map((ev) => {
            if (ev.kind === "broker") {
              return (
                <div key={ev.id} className="flex items-end gap-2">
                  <CharacterAvatar src={character.src} />
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
  notes,
}: {
  character: { name: string; src: string };
  title: string;
  subtitle: string;
  notes: CharacterNote[];
}) {
  if (notes.length === 0) return null;
  return (
    <section
      className="px-5 py-3 border-b border-slate-100 bg-[#FAF8FF] shrink-0"
      aria-label={`${character.name}'s notes`}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-full overflow-hidden bg-white ring-1 ring-[#7C3AED]/20 grid place-items-center shrink-0">
          <img src={character.src} alt="" aria-hidden className="w-[120%] h-[120%] object-contain" />
        </div>
        <h3 className="text-[12px] font-semibold uppercase tracking-wide text-[#5B21B6]">{title}</h3>
        <span className="text-[11px] text-slate-500 truncate">· {subtitle}</span>
      </div>
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
    feedback.grade === "helpful" ? "Good. That's the standard I hold to."
    : feedback.grade === "partly" ? "Noted. I'll see where it can be sharper."
    : feedback.grade === "not" ? "Understood. I'd rather know when I've fallen short than not."
    : "";
  const noteGiven = !!(feedback.note && feedback.note.trim().length > 0) || ((feedback.chips || []).length > 0);
  const noteAck = "Noted — that's useful.";

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

      {/* 3. Hobson invites a note — own owl + bubble, with optional chips/textarea below */}
      {graded && !submitted && showNoteAsk && (
        <Row className={reduceMotion ? "" : "animate-in fade-in slide-in-from-bottom-1 duration-300"}>
          <Bubble>
            If something was missing, tell me.
          </Bubble>
          <div className="pl-1 pt-0.5 space-y-1.5">
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
        </Row>
      )}

      {/* 4. If they added a note/chips, Hobson acknowledges — own owl + bubble */}
      {submitted && noteGiven && showNoteAck && (
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
}) {
  void onPreviewQuestion;
  const [filter, setFilter] = useState("");
  const [quick, setQuick] = useState<UnitFilter>("all");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [unitsOpen, setUnitsOpen] = useState(false);
  // Reset to collapsed on each fresh property arrival
  useEffect(() => { setUnitsOpen(false); }, [property.id]);
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
      {/* Pinned collapsible Units section */}
      <section
        className="sticky top-0 z-20 -mx-1 px-1"
        aria-label="Units"
      >
        <button
          type="button"
          onClick={() => setUnitsOpen((v) => !v)}
          aria-expanded={unitsOpen}
          aria-controls={`units-panel-${property.id}`}
          className={`group w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left rounded-xl cursor-pointer
            bg-gradient-to-r from-[#F5F3FF] to-white
            border-2 ${unitsOpen ? "border-[#7C3AED]" : "border-[#C4B5FD]"}
            shadow-sm hover:shadow-md hover:border-[#7C3AED] hover:from-[#EDE9FE] hover:to-[#F5F3FF]
            active:shadow-sm active:translate-y-px
            transition-[box-shadow,border-color,background-color,transform] motion-reduce:transition-none
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/40 focus-visible:ring-offset-2`}
        >
          <span className="flex items-center gap-3 min-w-0">
            <span
              aria-hidden
              className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#7C3AED] text-white shadow-sm group-hover:scale-[1.04] transition-transform motion-reduce:transition-none"
            >
              {/* door / unit icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17" />
                <path d="M4 21h16" />
                <path d="M19 21V9l-3-2" />
                <circle cx="13" cy="13" r="0.8" fill="currentColor" />
              </svg>
            </span>
            <span className="flex flex-col min-w-0">
              <span className="text-[15px] font-semibold text-slate-900 leading-tight">
                {unitsOpen ? "Choose a unit to open" : "Open a unit"}
              </span>
              <span className="text-[12px] text-slate-600 truncate">
                {property.units.length} units · {counts.let} let · {counts.vacant} vacant
                {!testerMode && counts.alerts > 0 && <> · <span className="text-amber-700 font-medium">{counts.alerts} need attention</span></>}
              </span>
            </span>
          </span>
          <span className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline text-[11px] uppercase tracking-wide text-[#7C3AED] font-semibold">
              {unitsOpen ? "Close" : "Tap to choose"}
            </span>
            <span
              aria-hidden
              className={`flex items-center justify-center w-6 h-6 rounded-full bg-white border border-[#C4B5FD] text-[#7C3AED] transition-transform motion-reduce:transition-none ${unitsOpen ? "rotate-180" : ""}`}
              style={{ transitionDuration: "220ms" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
          </span>
        </button>

        <div
          id={`units-panel-${property.id}`}
          hidden={!unitsOpen}
          className="mt-2 px-3 pb-3 pt-3 space-y-3 bg-white border border-slate-200 rounded-xl shadow-sm"
        >
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

type PerformBeat = {
  id: string;
  stepKey: string;            // which progress-rail step this beat belongs to
  text: string;               // narration line
  detail?: React.ReactNode;   // optional rendered block (summary, draft preview)
  flag?: string;              // amber honesty flag
  gate?: {
    label: string;
    options: { label: string; kind: "approve" | "skip" | "defer" | "cancel" | "modify" | "continue"; nextBeatIdx?: number | "complete" | "exit" }[];
  };
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
        <p>Open market comparable evidence — to be sourced. Surveyor instruction to be prepared.</p>
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

function buildPA004Beats(): PerformBeat[] {
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
      id: "b9",
      stepKey: "actions",
      text: "Recommended next: prepare surveyor instructions to obtain open-market evidence.",
      gate: {
        label: "Prepare surveyor instructions?",
        options: [
          { label: "Approve", kind: "approve", nextBeatIdx: 9 },
          { label: "Skip", kind: "skip", nextBeatIdx: 10 },
        ],
      },
    },
    {
      id: "b9b",
      stepKey: "actions",
      text: "Drafted.",
      detail: <PreparedPreview title="Surveyor instructions" body={"To: [Usual surveyor]\nSubject: Open market rent advice — Flat 8, Stanley House\n\nWe have a rent review falling due in March 2027. Please advise on open market evidence and a suggested range, with comparables for the last 12 months."} />,
      gate: {
        label: "Continue",
        options: [{ label: "Continue", kind: "continue", nextBeatIdx: 10 }],
      },
    },
    {
      id: "b10",
      stepKey: "actions",
      text: "Next: gather comparable evidence (last 12 months, like-for-like).",
      gate: {
        label: "Gather comparable evidence?",
        options: [
          { label: "Approve", kind: "approve", nextBeatIdx: 11 },
          { label: "Skip", kind: "skip", nextBeatIdx: 12 },
        ],
      },
    },
    {
      id: "b10b",
      stepKey: "actions",
      text: "Comparable search prepared — request queued for the surveyor and our market data source.",
      detail: <PreparedPreview title="Comparable evidence request" body={"Scope: Marylebone NW8, residential lets, 1-bed flats, last 12 months.\nDeliverable: shortlist of 5–8 comparables with rent, term, condition notes."} />,
      gate: {
        label: "Continue",
        options: [{ label: "Continue", kind: "continue", nextBeatIdx: 12 }],
      },
    },
    {
      id: "b11",
      stepKey: "actions",
      text: "Next: prepare the review notice ready to serve once the window opens.",
      gate: {
        label: "Prepare review notice?",
        options: [
          { label: "Approve", kind: "approve", nextBeatIdx: 13 },
          { label: "Skip", kind: "skip", nextBeatIdx: 14 },
        ],
      },
    },
    {
      id: "b11b",
      stepKey: "actions",
      text: "Draft notice prepared — held for service date.",
      detail: <PreparedPreview title="Review notice (draft)" body={"NOTICE OF RENT REVIEW\nProperty: Flat 8, Stanley House\nReview date: March 2027\nBasis: Open Market Rent (per lease)\n\nStatus: held — not yet served. Awaiting confirmed notice window."} />,
      gate: {
        label: "Continue",
        options: [{ label: "Continue", kind: "continue", nextBeatIdx: 14 }],
      },
    },
    {
      id: "b12",
      stepKey: "actions",
      text: "Last one: create a review task with the review date and your next checkpoint.",
      gate: {
        label: "Create a review task?",
        options: [
          { label: "Approve", kind: "approve", nextBeatIdx: 15 },
          { label: "Skip", kind: "skip", nextBeatIdx: 16 },
        ],
      },
    },
    {
      id: "b12b",
      stepKey: "actions",
      text: "Task created.",
      detail: <PreparedPreview title="Review task" body={"Title: Flat 8 rent review — checkpoint\nDue: 6 weeks before March 2027 review date\nOwner: you\nLinked: this action, surveyor instruction, draft notice."} />,
      gate: {
        label: "Continue",
        options: [{ label: "Continue", kind: "continue", nextBeatIdx: 16 }],
      },
    },
    {
      id: "b13",
      stepKey: "record",
      text: "All set. I'll record what we did and update the card.",
      gate: {
        label: "Record and finish",
        options: [{ label: "Record & close", kind: "continue", nextBeatIdx: "complete" }],
      },
    },
  ];
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
      gate: {
        label: "Continue",
        options: [{ label: "Continue", kind: "continue", nextBeatIdx: 6 }],
      },
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



function buildPerformConfig(card: ActionCard): {
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
    beats: buildPA004Beats(),
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
}: {
  card: ActionCard;
  mode?: "perform" | "review";
  onCancel: () => void;
  onComplete: (summary: string) => void;
  onReachedFinalGate?: () => void;
  reducedMotion: boolean;
}) {
  const { beats, steps, headerTitle, headerSub } = useMemo(() => buildPerformConfig(card), [card]);
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

  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [revealed, streamingText]);

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
      <div ref={scrollerRef} className="flex-1 overflow-auto px-5 py-5 space-y-5 bg-white">
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
                  <BeatBubble key={b.id} beat={b} done />
                ))}
              </div>
            )}
          </div>
        ) : (
          previousBeats.map((b) => <BeatBubble key={b.id} beat={b} done />)
        )}
        {currentBeat && (
          <div className="space-y-2.5">
            <BeatBubble
              beat={currentBeat}
              streamingText={streamingActive ? streamingText : currentBeat.text}
              streaming={streamingActive}
              done={false}
            />
            {/* Inline decisions — sit directly under the current step content */}
            {!streamingActive && !isComplete && (
              <div className="pl-[44px]">
                {currentBeat.gate ? (
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
                ) : (
                  <button
                    autoFocus
                    onClick={() => advance(undefined, "continue", "continue")}
                    className="text-xs px-3 py-1.5 rounded-full bg-[#7C3AED] text-white hover:bg-[#6D28D9] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  >
                    Continue
                  </button>
                )}
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

function BeatBubble({ beat, streamingText, streaming, done }: { beat: PerformBeat; streamingText?: string; streaming?: boolean; done: boolean }) {
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
        {!streaming && beat.detail && <div className="max-w-[640px]">{beat.detail}</div>}
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
        "I prepared the rent review for Flat 8, Stanley House. I read the lease, confirmed the Open Market basis and the March 2027 date, and pulled comparable evidence from the last 12 months. You approved the surveyor instructions and the review notice — both are out and the file is updated.",
      approvals: ["Approved by you — surveyor instructions", "Approved by you — review notice to tenant"],
      flags: ["Notice period in the lease is ambiguous — I noted it on file so you have it next time."],
      progressDone: 4,
      progressTotal: 4,
      hasSummary: true,
      dialogue: [
        { role: "user", text: "Perform" },
        { role: "hobson", text: "I'll work through the Flat 8 rent review with you. First — the lease basis." },
        { role: "hobson", text: "Open Market review, confirmed in clause 5.2. Review date 25 March 2027." },
        { role: "user", text: "Approve — prepare review summary" },
        { role: "hobson", text: "Done. I've pulled three comparables from the last 12 months and drafted surveyor instructions." },
        { role: "user", text: "Approve surveyor instructions" },
        { role: "hobson", text: "Sent. Drafting the review notice now — couldn't pin down the exact notice period, flagging that." },
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
        "I started the rent review for Flat 8, Stanley House. I read the lease, confirmed the Open Market basis and the March 2027 date, and pulled comparable evidence from the last 12 months. I've paused at the surveyor instructions for your approval. I couldn't confirm the notice period, so I've flagged that for you.",
      approvals: [],
      flags: ["Notice period in the lease is ambiguous — needs your eye before I send the notice."],
      progressDone: 2,
      progressTotal: 4,
      dialogue: [
        { role: "user", text: "Perform" },
        { role: "hobson", text: "I'll work through the Flat 8 rent review with you. First — the lease basis." },
        { role: "hobson", text: "Open Market review, confirmed in clause 5.2. Review date 25 March 2027." },
        { role: "user", text: "Approve — prepare review summary" },
        { role: "hobson", text: "Done. I've pulled three comparables and drafted surveyor instructions for you to approve." },
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

function WorkflowStatusPill({ status }: { status: WorkflowStatus }) {
  if (status === "built") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-[#7C3AED]/40 bg-[#F5F3FF] text-[#5B21B6] text-[11px] font-semibold">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M15 4l5 5-11 11H4v-5L15 4z"/><path d="M14 5l5 5"/></svg>
        Built
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

function MagicianComposer({ onCreate }: { onCreate: () => void }) {
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

function MagicianWorkArea({ character, workflows, onCreate, onAdjust, onView }: {
  character: { id: AdminCharacter; name: string; src: string; tagline: string; workTitle: string };
  workflows: Workflow[];
  onCreate: () => void;
  onAdjust: (id: string) => void;
  onView: (id: string) => void;
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
        const epc = workflows.find((w) => /EPC/i.test(w.name));
        const draftWf = drafts[0];
        const notes: CharacterNote[] = [];
        notes.push({
          id: "mn-recent",
          kind: "recent",
          text: `Built 1 new workflow this week${epc ? ` — '${epc.name}'` : ""}.${newest ? ` Last adjusted '${newest.name}' on ${newest.lastAdjusted}.` : ""}`,
          onClick: epc ? () => onView(epc.id) : (newest ? () => onView(newest.id) : undefined),
          ctaLabel: "open workflow →",
        });
        notes.push({
          id: "mn-totals",
          kind: "totals",
          text: `${workflows.length} workflow${workflows.length === 1 ? "" : "s"} · ${built.length} built and running · ${drafts.length} in draft.`,
        });
        if (draftWf) {
          notes.push({
            id: "mn-issue",
            kind: "issue",
            text: `'${draftWf.name}' is still a draft — it needs your sign-off before it can run, and it will lean on the Broker's book for tenant contacts once it's live.`,
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
        return (
          <CharacterNotesStrip
            character={character}
            title="The Magician's notes"
            subtitle="recent builds & workshop state"
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
        {filtered.length === 0 && (
          <div className="max-w-md mx-auto text-center text-[12px] text-slate-500 py-10">No workflows match these filters.</div>
        )}
        {groups.map((g) => (
          <div key={g.label || "all"} className="mb-6 last:mb-0">
            {g.label && (
              <div className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold mb-2 px-1">{g.label}</div>
            )}
            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))" }}>
              {g.items.map((w) => (
                <WorkflowCard key={w.id} w={w} onAdjust={() => onAdjust(w.id)} onView={() => onView(w.id)} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkflowCard({ w, onAdjust, onView }: { w: Workflow; onAdjust: () => void; onView: () => void }) {
  const [scopeOpen, setScopeOpen] = useState(false);
  return (
    <article className="bg-white border border-slate-200/70 rounded-lg p-4 shadow-[0_0.5px_0_rgba(0,0,0,0.04)] flex flex-col gap-3">
      <header className="flex items-start gap-3">
        <WorkflowIcon icon={w.icon} tone={w.tone} />
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold text-slate-900 leading-tight">{w.name}</div>
          <div className="text-[11.5px] text-slate-500 mt-0.5">{w.purpose}</div>
        </div>
        <WorkflowStatusPill status={w.status} />
      </header>

      <dl className="text-[12px] leading-snug space-y-1.5">
        <div className="flex gap-2">
          <dt className="text-slate-500 font-medium shrink-0 w-[80px]">When</dt>
          <dd className="text-slate-800">{w.trigger}</dd>
        </div>
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

      <footer className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2 min-w-0 flex-wrap">
          <OwnerChip owner={w.owner} />
          <span className="text-[11px] text-slate-400">
            {w.status === "draft" ? "Draft · not yet finished" : `Last adjusted ${w.lastAdjusted ?? "—"}`}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
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
        </div>
      </footer>
    </article>
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
            <section key={g.type} className="mb-6 last:mb-0">
              <div className="flex items-center gap-2 mb-2 px-1">
                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md ${meta.bg} ${meta.text} ring-1 ${meta.ring}`} aria-hidden>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{meta.iconPath}</svg>
                </span>
                <h3 className="text-[11px] uppercase tracking-wide font-semibold text-slate-600">{meta.label}</h3>
                <span className="text-[11px] text-slate-400">· {g.items.length}</span>
              </div>
              <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
                {g.items.map((c) => (
                  <BrokerContactCard key={c.id} contact={c} />
                ))}
              </div>
            </section>
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


