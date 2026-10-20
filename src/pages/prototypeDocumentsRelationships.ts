// Permanent Stage 3 rule, shared by single-paper and batch journeys:
// propose which tenancy relationship a paper belongs to from documentary evidence
// (parties, referenced agreements, dates, reference numbers) and ask the user to confirm
// whenever more than one relationship could apply. Unit, filename and the paper's own date
// are deliberately not inputs. Nothing here attaches a paper; it only proposes.

export type Relationship = {
  id: string;
  /** Short name used in conversation, e.g. "Puig's lease". */
  name: string;
  parties: string[];
  agreementDate?: string;
  reference?: string;
};
export type PaperEvidence = {
  /** How Hobson refers to the paper, e.g. "This deed". */
  noun: string;
  parties: string[];
  refersTo?: { date?: string; reference?: string; description?: string };
};
export type Proposal = {
  proposed: string | null;
  /** True whenever another relationship could apply, or the evidence is weak. */
  needsConfirmation: boolean;
  reason: string;
  candidates: Relationship[];
};
export const UNSURE = "unsure" as const;
export type RelationshipAnswer = string; // a relationship id, or UNSURE

const norm = (s: string) => s.toLowerCase().replace(/\b(limited|ltd|plc|uk)\b/g, "").replace(/[^a-z0-9]+/g, " ").trim();
const sameParty = (a: string, b: string) => { const x = norm(a), y = norm(b); return !!x && !!y && (x.includes(y) || y.includes(x)); };

function score(e: PaperEvidence, r: Relationship): number {
  let s = 0;
  if (e.refersTo?.reference && r.reference && norm(e.refersTo.reference) === norm(r.reference)) s += 10;
  if (e.refersTo?.date && r.agreementDate && e.refersTo.date === r.agreementDate) s += 6;
  s += e.parties.filter((p) => r.parties.some((q) => sameParty(p, q))).length * 2;
  return s;
}

export function proposeRelationship(e: PaperEvidence, relationships: Relationship[]): Proposal {
  if (!relationships.length) return { proposed: null, needsConfirmation: true, reason: "", candidates: [] };
  const ranked = relationships.map((r) => ({ r, s: score(e, r) })).sort((a, b) => b.s - a.s);
  const best = ranked[0];
  if (best.s === 0) return { proposed: null, needsConfirmation: true, reason: `I can't tell from ${e.noun.toLowerCase()} which tenancy it belongs to.`, candidates: relationships };
  const named = e.parties.filter((p) => best.r.parties.some((q) => sameParty(p, q)));
  const ref = e.refersTo?.date && best.r.agreementDate === e.refersTo.date ? ` and refers to the ${e.refersTo.description ?? "agreement"} dated ${e.refersTo.date}` : "";
  const reason = `${e.noun} names ${named.join(" and ") || "the parties"}${ref}.`;
  // Ask whenever any competing relationship exists; only skip with a single, evidenced match.
  return { proposed: best.r.id, needsConfirmation: relationships.length > 1, reason, candidates: relationships };
}

export function proposalQuestion(p: Proposal): string {
  const r = p.candidates.find((c) => c.id === p.proposed);
  if (!r) return `${p.reason}\n\nWhich tenancy does it belong to?`;
  return `${p.reason}\n\nI think it belongs with ${r.name}. Is that right?`;
}

export type Choice = { answer: RelationshipAnswer; label: string };
/** Confirm, every other relationship (each independently selectable), then Not sure. */
export function proposalChoices(p: Proposal): Choice[] {
  const first = p.candidates.find((c) => c.id === p.proposed);
  const others = p.candidates.filter((c) => c.id !== p.proposed);
  return [
    ...(first ? [{ answer: first.id, label: `Yes, put it with ${first.name}` }] : []),
    ...others.map((c) => ({ answer: c.id, label: `It belongs with ${c.name}` })),
    { answer: UNSURE, label: first ? "Neither / Not sure" : "Not sure" },
  ];
}

export function answerReply(answer: RelationshipAnswer, p: Proposal): string {
  if (answer === UNSURE) return "I'll keep it separate until we can establish which agreement it affects.";
  const r = p.candidates.find((c) => c.id === answer);
  return answer === p.proposed ? `Very good. I'll keep it with ${r?.name}.` : `Understood. I'll show it with ${r?.name} instead.`;
}
