// Hobson's Back Office — helper config (extensible)
// Adding/removing entries here adds/removes a door + room with no other code changes.
import characterMagician from "@/assets/prototype/character-magician.png";
import characterProfessor from "@/assets/prototype/character-professor.png";
import characterBroker from "@/assets/prototype/character-broker.png";
import characterKeeper from "@/assets/prototype/character-keeper.png";
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
  triggers: string[];   // lowercase phrases that route Hobson here
  narration: string;    // Hobson's line when entering this room
  themeAccent: string;  // tailwind text/border accent
  status: "ready" | "coming-soon";
};

export const BACK_OFFICE_HELPERS: BackOfficeHelper[] = [
  {
    id: "architect",
    name: "The Architect",
    src: characterArchitect,
    domain: "Properties & Units",
    tagline: "Designs, organises and evolves your portfolio structure.",
    roleTitle: "Properties & Units",
    contributionLine: "Helps build your portfolio by asking the right questions, creating units, assembling them into properties where appropriate, checks planning and keeping everything organised as your estate evolves.",
    triggers: ["property", "properties", "unit", "units", "portfolio structure", "add property", "add unit", "architect"],
    narration: "The Architect is just unrolling his plans — that room is being prepared.",
    themeAccent: "text-violet-700 border-violet-200",
    status: "coming-soon",
  },
  {
    id: "professor",
    name: "The Professor",
    src: characterProfessor,
    domain: "Documents & Knowledge",
    tagline: "Reads and remembers every document.",
    roleTitle: "Knowledge & Memory",
    contributionLine: "Reads and organises your documents, helping me remember every lease, licence, report and record.",
    triggers: ["document", "documents", "lease", "library", "upload", "read", "certificate", "notice", "correspondence", "knowledge", "professor"],
    narration: "Of course — let me take you to the Professor's library.",
    themeAccent: "text-amber-700 border-amber-200",
    status: "ready",
  },
  {
    id: "inspector",
    name: INSPECTOR_CHARACTER.name,
    src: INSPECTOR_CHARACTER.src,
    domain: "Compliance",
    tagline: "Watches what the law and your business require.",
    roleTitle: "Compliance & Protection",
    contributionLine: "Understands legislation, compliance requirements and your internal policies, helping me keep your organisation protected.",
    triggers: ["compliance", "comply", "compliant", "regulation", "legal", "inspector", "safety", "fire", "gas safety", "eicr", "re-check", "audit-trail"],
    narration: "Right away — let me bring up your compliance register.",
    themeAccent: "text-rose-700 border-rose-200",
    status: "ready",
  },
  {
    id: "broker",
    name: "The Broker",
    src: characterBroker,
    domain: "Contacts & Relationships",
    tagline: "Keeps your black book of people.",
    roleTitle: "Relationships & Contacts",
    contributionLine: "Keeps your people, organisations and relationships organised, so I always know who I'm working with and who needs to be contacted.",
    triggers: ["contact", "contacts", "tenant", "tenants", "subcontractor", "supplier", "plumber", "electrician", "occupant", "staff", "black book", "relationship", "who do we use", "phone number", "broker"],
    narration: "Let me bring up your black book.",
    themeAccent: "text-slate-800 border-slate-300",
    status: "ready",
  },
  {
    id: "magician",
    name: "The Magician",
    src: characterMagician,
    domain: "Automations & Workflows",
    tagline: "Builds the routines that watch your portfolio.",
    roleTitle: "Workflows & Automation",
    contributionLine: "Builds the routines that allow me to monitor your portfolio, prepare work and complete tasks on your behalf.",
    triggers: ["workflow", "workflows", "automation", "automate", "routine", "schedule", "trigger", "build me", "rent review", "magician"],
    narration: "Let me take you to the Magician's workshop.",
    themeAccent: "text-violet-700 border-violet-200",
    status: "ready",
  },
  {
    id: "keeper",
    name: "The Keeper",
    src: characterKeeper,
    domain: "Security & Access",
    tagline: "Looks after users, roles and access.",
    roleTitle: "Access & Security",
    contributionLine: "Controls who can see what, ensuring your information stays secure and is only available to the right people.",
    triggers: ["user", "users", "role", "permission", "access", "security", "keeper", "audit log", "sign in"],
    narration: "The Keeper hasn't moved in yet — that room is being prepared.",
    themeAccent: "text-emerald-700 border-emerald-200",
    status: "coming-soon",
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
