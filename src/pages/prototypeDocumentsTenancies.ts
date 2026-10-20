// Iteration 5C: illustrative tenancy decisions for the example batch. Local state only;
// nothing is filed. Puig's lease and Feelunique's Sublease are always two legal relationships.

export type TenancyAnswer = "current" | "ended" | "unsure";
export type Management = "both" | "puig" | "unsure";
export type TenancyStep = "checking" | "puigStatus" | "puigEnd" | "subMgmt" | "subStatus" | "subEnd" | "comparing" | "licence" | "deed" | "done";
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
};
export const startTenancies = (): Tenancies => ({ step: "checking", puig: null, puigEnd: null, mgmt: null, sub: null, subEnd: null, compared: false, belongs: { "example-2": null, "example-4": null } });

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
  supportsDone: "That's where the supporting papers stand. The Wayleave still needs checking before I can say where it belongs.",
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
export type Reopenable = "puig" | "mgmt" | "sub" | "licence" | "deed";
export function reopen(t: Tenancies, which: Reopenable): Tenancies {
  const step = ({ puig: "puigStatus", mgmt: "subMgmt", sub: "subStatus", licence: "licence", deed: "deed" } as const)[which];
  return { ...t, step };
}

/** Decisions still open: "Not sure" never counts as settled. The Wayleave stays open in this iteration. */
export function openDecisions(t: Tenancies): number {
  return [t.puig, t.mgmt, t.sub, t.belongs["example-2"], t.belongs["example-4"]].filter((v) => v === null || v === "unsure").length + 1;
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
