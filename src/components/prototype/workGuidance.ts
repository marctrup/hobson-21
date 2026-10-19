/** Local illustrative guidance only; never executes work or confirms paper terms. */
export const SIDE_LETTER_INSTRUCTION = "There's also a side letter from 2024. Please check that before preparing the renewal summary.";

export type WorkGuidanceState = { sideLetterRequested: boolean; sideLetterStatus: "awaiting-paper" | null };
export const initialWorkGuidance: WorkGuidanceState = { sideLetterRequested: false, sideLetterStatus: null };

export function applyWorkGuidance(state: WorkGuidanceState, instruction: string) {
  const normalise = (text: string) => text.trim().replace(/[’‘]/g, "'").replace(/\s+/g, " ").replace(/[.!]+$/, "").toLowerCase();
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