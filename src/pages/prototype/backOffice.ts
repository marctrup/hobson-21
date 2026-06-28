// Hobson's Back Office — helper config (extensible)
// Adding/removing entries here adds/removes a door + room with no other code changes.
import characterProfessor from "@/assets/prototype/character-professor.png";
import characterArchitectAsset from "@/assets/prototype/character-architect.png.asset.json";
const characterArchitect = characterArchitectAsset.url;
export type BackOfficeHelperId =
  | "professor"
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
