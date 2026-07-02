// Hobson's Back Office — helper config (extensible)
// Adding/removing entries here adds/removes a door + room with no other code changes.
import characterProfessor from "@/assets/prototype/character-professor.png";
import characterArchitectAsset from "@/assets/prototype/character-architect.png.asset.json";
const characterArchitect = characterArchitectAsset.url;
import characterInspector from "@/assets/prototype/character-inspector.png";
import characterBroker from "@/assets/prototype/character-broker.png";
import characterResearcherAsset from "@/assets/prototype/character-researcher.png.asset.json";
const characterResearcher = characterResearcherAsset.url;
import characterBookkeeperAsset from "@/assets/prototype/character-bookkeeper.png.asset.json";
const characterBookkeeper = characterBookkeeperAsset.url;
import characterCommunicatorAsset from "@/assets/prototype/character-communicator.png.asset.json";
const characterCommunicator = characterCommunicatorAsset.url;
import characterKeeperAsset from "@/assets/prototype/character-keeper.png.asset.json";
const characterKeeper = characterKeeperAsset.url;
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
    narration: "Of course — let me open the document library.",
    themeAccent: "text-amber-700 border-amber-200",
    status: "ready",
  },
  {
    id: "inspector",
    name: "The Inspector",
    src: characterInspector,
    domain: "Compliance & Protection",
    tagline: "Checks your portfolio against every rule.",
    roleTitle: "Compliance & Protection",
    contributionLine: "Maintains my understanding of your compliance position by assessing your information against legal, regulatory and business requirements.",
    footerLine: "Maintains my understanding of compliance.",
    triggers: ["compliance", "regulation", "legal", "requirement", "inspect", "inspector", "rules"],
    narration: "Let me take you to the Inspector's compliance board.",
    themeAccent: "text-rose-700 border-rose-200",
    status: "ready",
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
    status: "ready",
  },
  {
    id: "broker",
    name: "The Broker",
    src: characterBroker,
    domain: "Relationships & Contacts",
    tagline: "Knows every relationship that matters.",
    roleTitle: "Relationships & Contacts",
    contributionLine: "Maintains my understanding of the people and organisations connected to your portfolio, including landlords, tenants, agents and contractors.",
    footerLine: "Maintains my understanding of your relationships.",
    triggers: ["contact", "contacts", "people", "relationship", "tenant", "landlord", "contractor", "agent", "broker"],
    narration: "Let me take you to the Broker's black book.",
    themeAccent: "text-emerald-700 border-emerald-200",
    status: "ready",
  },
  {
    id: "researcher",
    name: "The Researcher",
    src: characterResearcher,
    domain: "Research & Intelligence",
    tagline: "Finds the facts I need, when I need them.",
    roleTitle: "Research & Intelligence",
    contributionLine: "Finds trusted information beyond your portfolio whenever I need it, including legislation, public records, market evidence and industry guidance.",
    footerLine: "Finds trusted information whenever I need it.",
    triggers: [],
    narration: "The Researcher is standing by whenever I need evidence.",
    themeAccent: "text-cyan-700 border-cyan-200",
    status: "ready",
  },
  {
    id: "bookkeeper",
    name: "The Bookkeeper",
    src: characterBookkeeper,
    domain: "Calculations & Finance",
    tagline: "Runs the numbers so I don't have to.",
    roleTitle: "Calculations & Finance",
    contributionLine: "Performs calculations, reconciliations and financial analysis whenever I need accurate figures or statements.",
    footerLine: "Performs calculations whenever I need them.",
    triggers: [],
    narration: "The Bookkeeper has his ledger ready.",
    themeAccent: "text-blue-700 border-blue-200",
    status: "ready",
  },
  {
    id: "communicator",
    name: "The Communicator",
    src: characterCommunicator,
    domain: "Systems & Integrations",
    tagline: "Speaks to your systems so I don't have to.",
    roleTitle: "Systems & Integrations",
    contributionLine: "Connects securely to your existing systems, retrieving and synchronising authorised information whenever it is required.",
    footerLine: "Connects to your systems whenever required.",
    triggers: [],
    narration: "The Communicator is watching the connections.",
    themeAccent: "text-indigo-700 border-indigo-200",
    status: "ready",
  },
  {
    id: "keeper",
    name: "The Keeper",
    src: characterKeeper,
    domain: "Access & Security",
    tagline: "Guards every door and every permission.",
    roleTitle: "Access & Security",
    contributionLine: "Protects your information by verifying permissions and ensuring every request is carried out securely and only by authorised people.",
    footerLine: "Protects your information and permissions.",
    triggers: [],
    narration: "The Keeper is at his post.",
    themeAccent: "text-stone-700 border-stone-200",
    status: "ready",
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
