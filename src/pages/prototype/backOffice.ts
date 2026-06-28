// Hobson's Back Office — helper config (extensible)
// Adding/removing entries here adds/removes a door + room with no other code changes.
import characterProfessor from "@/assets/prototype/character-professor.png";
import characterArchitectAsset from "@/assets/prototype/character-architect.png.asset.json";
const characterArchitect = characterArchitectAsset.url;
import { INSPECTOR_CHARACTER } from "./Inspector";

export type BackOfficeHelperId =
  | "professor"
  | "inspector"
  | "broker"
  | "magician"
  | "keeper"
  | "architect"
  | string; // extensible: any future helper id

export type BackOfficeHelper = {
  id: BackOfficeHelperId;
  name: string;
  src: string;
  domain: string;       // e.g. "Documents & Knowledge"
  tagline: string;      // hallway one-liner
  roleTitle: string;    // job title under the portrait (e.g. "Knowledge & Memory")
  contributionLine: string; // "so I can…" line tying them back to Hobson
  footerLine: string;   // credit line on the team card
  triggers: string[];   // lowercase phrases that route Hobson here
  narration: string;    // Hobson's line when entering this room
  themeAccent: string;  // tailwind text/border accent
  status: "ready" | "started" | "joining-soon";
};

export const BACK_OFFICE_HELPERS: BackOfficeHelper[] = [
  {
    id: "professor",
    name: "The Professor",
    src: characterProfessor,
    domain: "Documents & Knowledge",
    tagline: "Reads and remembers every document.",
    roleTitle: "Knowledge & Memory",
    contributionLine: "Maintains everything I know from your documents, including leases, licences, plans, reports and every other record you entrust to me.",
    footerLine: "Maintains my knowledge of your portfolio.",
    triggers: ["document", "documents", "lease", "library", "upload", "read", "certificate", "notice", "correspondence", "knowledge", "professor"],
    narration: "Of course — let me take you to the Professor's library.",
    themeAccent: "text-amber-700 border-amber-200",
    status: "started",
  },
  {
    id: "inspector",
    name: INSPECTOR_CHARACTER.name,
    src: INSPECTOR_CHARACTER.src,
    domain: "Compliance",
    tagline: "Watches what the law and your business require.",
    roleTitle: "Compliance & Protection",
    contributionLine: "Maintains my understanding of your compliance position by assessing your documents against legal, regulatory and business requirements.",
    footerLine: "Maintains my understanding of your compliance position.",
    triggers: ["compliance", "comply", "compliant", "regulation", "legal", "inspector", "safety", "fire", "gas safety", "eicr", "re-check", "audit-trail"],
    narration: "Right away — let me bring up your compliance register.",
    themeAccent: "text-rose-700 border-rose-200",
    status: "joining-soon",
  },
  {
    id: "architect",
    name: "The Architect",
    src: characterArchitect,
    domain: "Properties & Units",
    tagline: "Designs, organises and evolves your portfolio structure.",
    roleTitle: "Properties & Units",
    contributionLine: "Maintains the structure of your portfolio, organising units into properties and keeping your Portfolio → Property → Unit hierarchy accurate as your estate evolves.",
    footerLine: "Maintains the structure of your portfolio.",
    triggers: ["property", "properties", "unit", "units", "portfolio structure", "add property", "add unit", "architect"],
    narration: "The Architect is just unrolling his plans — that room is being prepared.",
    themeAccent: "text-violet-700 border-violet-200",
    status: "started",
  },
  {
    id: "broker",
    name: "The Broker",
    src: characterBroker,
    domain: "Contacts & Relationships",
    tagline: "Keeps your black book of people.",
    roleTitle: "Relationships & Contacts",
    contributionLine: "Maintains my understanding of the people and organisations connected to your portfolio, including landlords, tenants, agents, contractors and professional advisers.",
    footerLine: "Maintains my understanding of your relationships.",
    triggers: ["contact", "contacts", "tenant", "tenants", "subcontractor", "supplier", "plumber", "electrician", "occupant", "staff", "black book", "relationship", "who do we use", "phone number", "broker"],
    narration: "Let me bring up your black book.",
    themeAccent: "text-slate-800 border-slate-300",
    status: "joining-soon",
  },
  {
    id: "researcher",
    name: "The Researcher",
    src: characterResearcher,
    domain: "Research & Intelligence",
    tagline: "Finds trusted information beyond your portfolio.",
    roleTitle: "Research & Intelligence",
    contributionLine: "Maintains my knowledge beyond your portfolio by researching trusted external sources, legislation, guidance, public records and comparable evidence whenever I need them.",
    footerLine: "Maintains my knowledge beyond your portfolio.",
    triggers: ["research", "researcher", "comparable", "comparables", "legislation", "guidance", "industry update"],
    narration: "The Researcher is out gathering sources — that room is being prepared.",
    themeAccent: "text-sky-700 border-sky-200",
    status: "joining-soon",
  },
  {
    id: "bookkeeper",
    name: "The Bookkeeper",
    src: characterBookkeeper,
    domain: "Calculations & Statements",
    tagline: "Looks after the numbers, calculations and statements.",
    roleTitle: "Calculations & Finance",
    contributionLine: "Maintains the financial understanding of your portfolio through calculations, reconciliations, statements and numerical analysis.",
    footerLine: "Maintains the financial position of your portfolio.",
    triggers: ["bookkeeper", "calculation", "calculations", "statement", "statements", "reconciliation", "ledger", "accounts"],
    narration: "The Bookkeeper is balancing the books — that room is being prepared.",
    themeAccent: "text-purple-700 border-purple-200",
    status: "joining-soon",
  },
  {
    id: "communicator",
    name: "The Communicator",
    src: characterCommunicator,
    domain: "Systems & Integrations",
    tagline: "Connects me securely to your other systems.",
    roleTitle: "Systems & Integrations",
    contributionLine: "Maintains secure connections with your existing systems, allowing me to retrieve and synchronise authorised information whenever it is needed.",
    footerLine: "Maintains my connected systems.",
    triggers: ["integration", "integrations", "api", "connect", "system", "systems", "communicator"],
    narration: "The Communicator is wiring things up — that room is being prepared.",
    themeAccent: "text-indigo-700 border-indigo-200",
    status: "joining-soon",
  },
  {
    id: "magician",
    name: "The Magician",
    src: characterMagician,
    domain: "Automations & Workflows",
    tagline: "Builds the routines that watch your portfolio.",
    roleTitle: "Workflows & Automation",
    contributionLine: "Builds the routines that allow me to monitor your portfolio, prepare work and complete tasks on your behalf.",
    footerLine: "Maintains my workflows and automations.",
    triggers: ["workflow", "workflows", "automation", "automate", "routine", "schedule", "trigger", "build me", "rent review", "magician"],
    narration: "Let me take you to the Magician's workshop.",
    themeAccent: "text-violet-700 border-violet-200",
    status: "joining-soon",
  },
  {
    id: "keeper",
    name: "The Keeper",
    src: characterKeeper,
    domain: "Security & Access",
    tagline: "Looks after users, roles and access.",
    roleTitle: "Access & Security",
    contributionLine: "Maintains who can view, change and act on information, ensuring every request is handled securely and only by authorised people.",
    footerLine: "Maintains the security of your portfolio.",
    triggers: ["user", "users", "role", "permission", "access", "security", "keeper", "audit log", "sign in"],
    narration: "The Keeper hasn't moved in yet — that room is being prepared.",
    themeAccent: "text-emerald-700 border-emerald-200",
    status: "joining-soon",
  },
];

export function detectRoomFromMessage(text: string): BackOfficeHelper | null {
  const t = text.toLowerCase();
  for (const h of BACK_OFFICE_HELPERS) {
    if (h.triggers.some((tr) => t.includes(tr))) return h;
  }
  return null;
}

// Module-level session flag — NOT localStorage/sessionStorage.
// Persists for the tab session only.
let _hasEntered = false;
export const hasEnteredBackOffice = () => _hasEntered;
export const markBackOfficeEntered = () => { _hasEntered = true; };
