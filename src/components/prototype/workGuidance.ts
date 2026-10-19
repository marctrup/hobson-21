/** Local illustrative guidance only; never executes work or confirms paper terms. */
export const SIDE_LETTER_INSTRUCTION = "There's also a side letter from 2024. Please check that before preparing the renewal summary.";

export type WorkGuidanceState = { sideLetterRequested: boolean };
export const initialWorkGuidance: WorkGuidanceState = { sideLetterRequested: false };

export function applyWorkGuidance(state: WorkGuidanceState, instruction: string) {
  const normalise = (text: string) => text.trim().replace(/[’‘]/g, "'").replace(/\s+/g, " ").replace(/[.!]+$/, "").toLowerCase();
  if (normalise(instruction) !== normalise(SIDE_LETTER_INSTRUCTION)) {
    return {
      state,
      reply: "For this demonstration, I can only take the sample instruction about the 2024 side letter. I haven't changed the work. You can ask: “There's also a side letter from 2024. Please check that before preparing the renewal summary.”",
    };
  }
  return {
    state: state.sideLetterRequested ? state : { ...state, sideLetterRequested: true },
    reply: state.sideLetterRequested
      ? "The 2024 side letter is already included in the tenancy history check. It still needs checking before I prepare your summary."
      : "Of course. I'll check the side letter as part of the tenancy history before preparing your summary.",
  };
}