/** Local illustrative guidance only; never executes work or confirms paper terms. */
export const SIDE_LETTER_INSTRUCTION = "There's also a side letter from 2024. Please check that before preparing the renewal summary.";
export const SIDE_LETTER_ATTACHMENT_INSTRUCTION = "I've found the Side Letter from 2024. Please check whether it changes the rent before preparing the renewal.";
export const SIDE_LETTER_FILENAME = "Side Letter 2024.pdf";
/** Stable identity of the simulated attachment, so repeats never duplicate it but same-named unrelated papers would not match. */
export const SIDE_LETTER_ATTACHMENT_ID = "sim-side-letter-2024-flat6";

export type PaperPlace = { id: string; label: string; kind: "Unit" | "Unit Group"; propertyId: string; unitId?: string };
export const RENEWAL_PAPER_PLACE: PaperPlace = { id: "stanley-f6", label: "Stanley House · Flat 6", kind: "Unit", propertyId: "stanley", unitId: "stanley-f6" };
export type PaperPlacementAction = { type: "propose"; place: PaperPlace } | { type: "confirm" };

export type SuppliedPaper = {
  id: string;
  filename: string;
  job: "Getting the tenancy renewal ready";
  place: "Stanley House, Flat 6";
  activity: "Reviewing the rent";
  status: "awaiting-reading";
  identifiedAs: "Side Letter";
  proposedPlace: PaperPlace;
  filedPlace: PaperPlace | null;
  tenancyLinked: boolean;
  sourceInstruction: string;
  review: "awaiting-examination";
};

export type WorkGuidanceState = { sideLetterRequested: boolean; sideLetterStatus: "awaiting-paper" | null; suppliedPapers: SuppliedPaper[] };
export const initialWorkGuidance: WorkGuidanceState = { sideLetterRequested: false, sideLetterStatus: null, suppliedPapers: [] };

const normalise = (text: string) => text.trim().replace(/[’‘]/g, "'").replace(/\s+/g, " ").replace(/[.!]+$/, "").toLowerCase();

export function applyWorkGuidance(state: WorkGuidanceState, instruction: string, attachmentId?: string) {
  if (attachmentId) return applyPaperAttachment(state, instruction, attachmentId);
  if (normalise(instruction) !== normalise(SIDE_LETTER_INSTRUCTION)) {
    return {
      state,
      reply: "For this demonstration, I can only take the sample instruction about the 2024 side letter. I haven't changed the work. You can ask: “There's also a side letter from 2024. Please check that before preparing the renewal summary.”",
    };
  }
  return {
    state: state.sideLetterRequested ? state : { ...state, sideLetterRequested: true, sideLetterStatus: "awaiting-paper" as const },
    reply: state.sideLetterRequested
      ? "The 2024 side letter is already included in the investigation. I'm still awaiting the paper."
      : "Of course. I've added the 2024 side letter to the investigation. I haven't located the paper yet.",
  };
}

/** Receipt only: the paper is attached to the conversation and associated with the job, never read, filed or verified here. */
export function applyPaperAttachment(state: WorkGuidanceState, instruction: string, attachmentId: string) {
  if (attachmentId !== SIDE_LETTER_ATTACHMENT_ID || normalise(instruction) !== normalise(SIDE_LETTER_ATTACHMENT_INSTRUCTION)) {
    return {
      state,
      reply: `For this demonstration, I can only take the sample Side Letter with the instruction: “${SIDE_LETTER_ATTACHMENT_INSTRUCTION}” I haven't kept the attachment or changed the work.`,
    };
  }
  if (state.suppliedPapers.some((paper) => paper.id === attachmentId)) {
    return { state, reply: "I already have this Side Letter with the renewal. It's still awaiting reading; I haven't added a second copy." };
  }
  const paper: SuppliedPaper = { id: attachmentId, filename: SIDE_LETTER_FILENAME, job: "Getting the tenancy renewal ready", place: "Stanley House, Flat 6", activity: "Reviewing the rent", status: "awaiting-reading", identifiedAs: "Side Letter", proposedPlace: RENEWAL_PAPER_PLACE, filedPlace: null, tenancyLinked: false, sourceInstruction: instruction, review: "awaiting-examination" };
  return {
    state: { ...state, suppliedPapers: [...state.suppliedPapers, paper] },
    reply: "Thank you. I've received the Side Letter. I'll read it and check whether it changes the rent before continuing with the renewal.",
  };
}

/** Filing is a user decision, never examination or a change to tenancy terms. */
export function applyPaperPlacement(state: WorkGuidanceState, id: string, action: PaperPlacementAction) {
  const paper = state.suppliedPapers.find(p => p.id === id);
  if (!paper || paper.filedPlace) return { state, reply: null };
  const next = action.type === "propose"
    ? { ...paper, proposedPlace: action.place }
    : { ...paper, filedPlace: paper.proposedPlace, tenancyLinked: paper.proposedPlace.id === RENEWAL_PAPER_PLACE.id };
  return {
    state: { ...state, suppliedPapers: state.suppliedPapers.map(p => p.id === id ? next : p) },
    reply: action.type === "propose" ? null : next.tenancyLinked
      ? "I've added the Side Letter to the tenancy papers and linked it to this renewal. I'll now check whether it changes anything I've already established."
      : `I've added the Side Letter to Papers at ${next.proposedPlace.label}. I've kept your conversation attachment and renewal reference, but haven't linked it to the Flat 6 tenancy history. Its contents are still awaiting examination.`,
  };
}
