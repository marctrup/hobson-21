/** Local illustrative guidance only; never executes work or confirms paper terms. */
export const SIDE_LETTER_INSTRUCTION = "There's also a side letter from 2024. Please check that before preparing the renewal summary.";
export const SIDE_LETTER_ATTACHMENT_INSTRUCTION = "I've found the Side Letter from 2024. Please check whether it changes the rent before preparing the renewal.";
export const SIDE_LETTER_FILENAME = "Side Letter 2024.pdf";
/** Stable identity of the simulated attachment, so repeats never duplicate it but same-named unrelated papers would not match. */
export const SIDE_LETTER_ATTACHMENT_ID = "sim-side-letter-2024-flat6";

export type SuppliedPaper = {
  id: string;
  filename: string;
  job: "Getting the tenancy renewal ready";
  place: "Stanley House, Flat 6";
  activity: "Reviewing the rent";
  status: "awaiting-reading";
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
  const paper: SuppliedPaper = { id: attachmentId, filename: SIDE_LETTER_FILENAME, job: "Getting the tenancy renewal ready", place: "Stanley House, Flat 6", activity: "Reviewing the rent", status: "awaiting-reading" };
  return {
    state: { ...state, suppliedPapers: [...state.suppliedPapers, paper] },
    reply: "Thank you. I've received the Side Letter. I'll read it and check whether it changes the rent before continuing with the renewal.",
  };
}
