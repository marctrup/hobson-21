// Iteration 5C: illustrative tenancy decisions for the example batch. Local state only;
// nothing is filed. Puig's lease and Feelunique's Sublease are always two legal relationships.

export type TenancyAnswer = "current" | "ended" | "unsure";
export type Management = "both" | "puig" | "unsure";
export type TenancyStep = "checking" | "puigStatus" | "puigEnd" | "subMgmt" | "subStatus" | "subEnd" | "comparing" | "licence" | "deed" | "wayleave" | "wayleaveDate" | "wayleaveCopy" | "wayleaveBelongs" | "done";
export type Completion = "completed" | "another" | "notCompleted" | "unsure";
/** Completion and tenancy relationship are separate questions; the paper's printed date (none on this copy) is never replaced by a user-confirmed completion date. */
export type WayleaveState = { completion: Completion | null; completedOn: string | null; dateAsked: boolean; belongs: Belongs | null };
/** Which legal agreement a supporting paper affects — independent of how histories are grouped on screen. */
export type Belongs = "puig" | "sub" | "unsure";
export type SupportId = "example-2" | "example-4";
export type Tenancies = {
  step: TenancyStep;
  puig: TenancyAnswer | null; puigEnd: string | null;
  mgmt: Management | null;
  sub: TenancyAnswer | null; subEnd: string | null;
  compared: boolean;
  belongs: Record<SupportId, Belongs | null>;
  wayleave: WayleaveState;
};
export const startTenancies = (): Tenancies => ({ step: "checking", puig: null, puigEnd: null, mgmt: null, sub: null, subEnd: null, compared: false, belongs: { "example-2": null, "example-4": null }, wayleave: { completion: null, completedOn: null, dateAsked: false, belongs: null } });

export const PAPER_DATES: Record<string, string> = {
  "example-1": "16 December 2016", "example-2": "16 December 2016", "example-4": "23 April 2020", "example-5": "29 April 2024",
};

export const Q = {
  puigIntro: "The 2016 Business Lease is between the landlord and Puig UK Limited for the Fifth Floor at Russell Square House.\n\nI think this establishes Puig's tenancy history.",
  puigStatus: "Is Puig's tenancy still current, or has it ended?",
  subIntro: "I can see that Puig granted a Sublease to Feelunique.",
  subMgmt: "Do you manage Feelunique's tenancy as well, or do you only manage Puig's?",
  subStatus: "Is Feelunique's Sublease still current, or has it ended?",
  endDate: "Do you know the date it ended? Type it below, or carry on without one.",
  done: "I've established how the two leases should be presented, or left the parts you're unsure about open.",
  next: "I'll check where the other papers belong.",
  wayleave: "I've checked the Wayleave. It names Puig and BT and refers to Puig's Business Lease dated 16 December 2016, so I think it belongs with that tenancy.\n\nHowever, the copy doesn't appear to be dated, and Puig's signature space looks blank.\n\nWas this agreement completed, or is this an unsigned copy?",
  wayleaveDate: "Do you know when it was completed? Type the date below, or choose Not sure.",
  wayleaveCopy: "Send it over and I'll compare the two copies.",
  wayleaveBelongs: "I think this Wayleave belongs with Puig's Business Lease. Is that right?",
  supportsDone: "That's where the papers stand. I've kept what you've confirmed and left only the open details for later.",
} as const;

export const MGMT_REPLY: Record<Management, string> = {
  both: "Understood. I'll show the two tenancy histories separately.",
  puig: "Understood. I'll keep Feelunique's Sublease within Puig's managed tenancy history, so you can see how it relates.",
  unsure: "I'll leave how the Sublease should be presented unconfirmed for now.",
};
export const MGMT_LABEL: Record<Management, string> = { both: "I manage both tenancies", puig: "I only manage Puig's tenancy", unsure: "Not sure" };
export const STATUS_LABEL: Record<TenancyAnswer, string> = { current: "This is current", ended: "This has ended", unsure: "Not sure" };

/** Next unanswered question, in fixed order: Puig's status, Sublease presentation, Sublease status. */
export function nextStep(t: Tenancies): TenancyStep {
  if (t.puig === null) return "puigStatus";
  if (t.mgmt === null) return "subMgmt";
  if (t.sub === null) return "subStatus";
  if (!t.compared) return "comparing";
  if (t.belongs["example-2"] === null) return "licence";
  if (t.belongs["example-4"] === null) return "deed";
  if (t.wayleave.completion === null) return "wayleave";
  if (t.wayleave.completion === "completed" && !t.wayleave.dateAsked) return "wayleaveDate";
  if (t.wayleave.belongs === null) return "wayleaveBelongs";
  return "done";
}

export function answerStatus(t: Tenancies, who: "puig" | "sub", a: TenancyAnswer): Tenancies {
  const u = who === "puig" ? { ...t, puig: a, puigEnd: null } : { ...t, sub: a, subEnd: null };
  if (a === "ended") return { ...u, step: who === "puig" ? "puigEnd" : "subEnd" };
  return { ...u, step: nextStep(u) };
}
export function giveEndDate(t: Tenancies, date: string | null): Tenancies {
  const u = t.step === "puigEnd" ? { ...t, puigEnd: date } : { ...t, subEnd: date };
  return { ...u, step: nextStep(u) };
}
export function answerMgmt(t: Tenancies, m: Management): Tenancies {
  const u = { ...t, mgmt: m };
  return { ...u, step: nextStep(u) };
}
export function answerBelongs(t: Tenancies, b: Belongs): Tenancies {
  const id: SupportId = t.step === "licence" ? "example-2" : "example-4";
  const u = { ...t, belongs: { ...t.belongs, [id]: b } };
  return { ...u, step: nextStep(u) };
}
/** Reopen one decision without losing the others. */
export type Reopenable = "puig" | "mgmt" | "sub" | "licence" | "deed" | "wayleave" | "wayleaveBelongs";
export function reopen(t: Tenancies, which: Reopenable): Tenancies {
  const step = ({ puig: "puigStatus", mgmt: "subMgmt", sub: "subStatus", licence: "licence", deed: "deed", wayleave: "wayleave", wayleaveBelongs: "wayleaveBelongs" } as const)[which];
  return { ...t, step };
}

/** Decisions still open: "Not sure" never counts as settled. The Wayleave stays open in this iteration. */
export function openDecisions(t: Tenancies): number {
  return [t.puig, t.mgmt, t.sub, t.belongs["example-2"], t.belongs["example-4"]].filter((v) => v === null || v === "unsure").length + wayleaveOpen(t.wayleave).length;
}

// Stage 3 relationship confirmation for the batch, using the shared rule (no Puig-specific matching logic).
import { answerReply, proposalChoices, proposalQuestion, proposeRelationship, type PaperEvidence, type Relationship } from "./prototypeDocumentsRelationships";
export const RELATIONSHIPS: Relationship[] = [
  { id: "puig", name: "Puig's lease", parties: ["Puig UK Limited", "Landlord"], agreementDate: "16 December 2016" },
  { id: "sub", name: "Feelunique's Sublease", parties: ["Puig UK Limited", "Feelunique International Limited"], agreementDate: "29 April 2024" },
];
export const SUPPORT_EVIDENCE: Record<SupportId, PaperEvidence> = {
  "example-2": { noun: "This licence", parties: ["Puig UK Limited"], refersTo: { date: "16 December 2016", description: "Business Lease" } },
  "example-4": { noun: "This deed", parties: ["Puig UK Limited"], refersTo: { date: "16 December 2016", description: "Business Lease" } },
};
export const supportProposal = (id: SupportId) => proposeRelationship(SUPPORT_EVIDENCE[id], RELATIONSHIPS);
export const supportQuestion = (id: SupportId) => proposalQuestion(supportProposal(id));
export const supportChoices = (id: SupportId) => proposalChoices(supportProposal(id));
export const supportReply = (id: SupportId, a: string) => answerReply(a, supportProposal(id));

export const COMPLETION_LABEL: Record<Completion, string> = { completed: "Yes, it was completed", another: "I have another copy", notCompleted: "It wasn't completed", unsure: "Not sure" };
export const COMPLETION_REPLY: Record<Completion, string> = {
  completed: "Thank you. I'll record it as completed.",
  another: "Send it over and I'll compare the two copies.",
  notCompleted: "Understood. I'll keep this copy, but I won't treat it as a completed agreement.",
  unsure: "That's fine. I'll leave its completion unconfirmed. We can come back to it.",
};
export function answerCompletion(t: Tenancies, c: Completion): Tenancies {
  const w = { ...t.wayleave, completion: c, completedOn: null, dateAsked: false };
  const u = { ...t, wayleave: w };
  return { ...u, step: c === "another" ? "wayleaveCopy" : nextStep(u) };
}
export function answerCompletionDate(t: Tenancies, date: string | null): Tenancies {
  const u = { ...t, wayleave: { ...t.wayleave, completedOn: date, dateAsked: true } };
  return { ...u, step: nextStep(u) };
}
/** The second copy is kept; no comparison is configured, so no findings are invented. */
export function receiveSecondCopy(t: Tenancies): Tenancies {
  return { ...t, step: nextStep(t) };
}
export function answerWayleaveBelongs(t: Tenancies, b: Belongs): Tenancies {
  const u = { ...t, wayleave: { ...t.wayleave, belongs: b } };
  return { ...u, step: nextStep(u) };
}
/** Outstanding Wayleave details, each independent. Empty means settled. */
export function wayleaveOpen(w: WayleaveState): ("completion" | "date" | "belongs")[] {
  const open: ("completion" | "date" | "belongs")[] = [];
  if (w.completion === null || w.completion === "unsure" || w.completion === "another") open.push("completion");
  if (w.completion === "completed" && !w.completedOn) open.push("date");
  if (w.belongs === null || w.belongs === "unsure") open.push("belongs");
  return open;
}
export const WAYLEAVE_EVIDENCE: PaperEvidence = { noun: "This Wayleave", parties: ["Puig UK Limited", "British Telecommunications"], refersTo: { date: "16 December 2016", description: "Business Lease" } };
export const wayleaveProposal = () => proposeRelationship(WAYLEAVE_EVIDENCE, RELATIONSHIPS);

// Iteration 5D: which papers are ready for full reading, derived from the user's actual decisions.
export type ReadyItem = { id: string; name: string; where: string };
export type HelpItem = { id: string; name: string; questions: string[] };
const whereFor = (b: Belongs | null | undefined) => b === "sub" ? "Feelunique's Sublease" : "Puig's lease";
export function batchReadiness(t: Tenancies): { ready: ReadyItem[]; help: HelpItem[] } {
  const ready: ReadyItem[] = [
    { id: "example-1", name: "Puig Business Lease", where: "Puig's lease" },
  ];
  const help: HelpItem[] = [];
  (["example-2", "example-4"] as const).forEach((id) => {
    const name = id === "example-2" ? "Licence to Alter" : "Deed of Variation";
    const b = t.belongs[id];
    if (b === "puig" || b === "sub") ready.push({ id, name, where: whereFor(b) });
    else help.push({ id, name, questions: ["Which tenancy does it affect: Puig's lease or Feelunique's Sublease?"] });
  });
  ready.push({ id: "example-5", name: "Feelunique Sublease", where: "Feelunique's Sublease" });
  const open = wayleaveOpen(t.wayleave);
  if (!open.length) ready.push({ id: "example-3", name: "BT & Puig Wayleave", where: whereFor(t.wayleave.belongs) });
  else help.push({ id: "example-3", name: "BT & Puig Wayleave", questions: open.map((o) =>
    o === "completion" ? "Was the agreement completed, or is this an unsigned copy?" :
    o === "date" ? "When was it completed? The copy itself isn't dated." :
    "Does it belong with Puig's Business Lease, as I think, or another tenancy?") });
  // Keep upload order for a familiar list.
  const order = ["example-1", "example-2", "example-3", "example-4", "example-5"];
  ready.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
  return { ready, help };
}
export const READY_INTRO = "I've worked out where the papers belong. Here's what I'm ready to read.";
export const READ_OFFER = (n: number, help: HelpItem[]) => help.length
  ? `I can get on with the ${n === 1 ? "one ready paper" : `${n} ready papers`} and leave ${help.length === 1 ? `the ${help[0].name.replace("BT & Puig ", "")}` : "the others"} until we've settled ${help.length === 1 ? "it" : "them"}.`
  : `All ${n} papers are settled. I can read and add them now.`;
export const READ_START = "That's all I need. I'll read these papers properly now. You can carry on with something else while I work through them.";
