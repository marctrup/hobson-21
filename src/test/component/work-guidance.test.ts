import { describe, expect, it } from "vitest";
import { applyWorkGuidance, initialWorkGuidance, SIDE_LETTER_INSTRUCTION } from "@/components/prototype/workGuidance";

describe("Illustrative tenancy guidance", () => {
  it("adds the requested 2024 side letter", () => {
    const result = applyWorkGuidance(initialWorkGuidance, "There's also a side letter from 2024. Please check that before preparing the renewal summary.");
    expect(result.state.sideLetterRequested).toBe(true);
    expect(initialWorkGuidance.sideLetterRequested).toBe(false);
  });
  it("keeps the mentioned 2024 paper awaiting access rather than found or reviewed", () => {
    const result = applyWorkGuidance(initialWorkGuidance, SIDE_LETTER_INSTRUCTION);
    expect(result.state.sideLetterStatus).toBe("awaiting-paper");
    const repeated = applyWorkGuidance(result.state, SIDE_LETTER_INSTRUCTION);
    expect(repeated.state.sideLetterStatus).toBe("awaiting-paper");
    expect(initialWorkGuidance.sideLetterStatus).toBeNull();
  });
  it("does not duplicate work for a repeated request", () => {
    const first = applyWorkGuidance(initialWorkGuidance, SIDE_LETTER_INSTRUCTION);
    const repeated = applyWorkGuidance(first.state, SIDE_LETTER_INSTRUCTION);
    expect(repeated.state).toBe(first.state);
    expect(Object.keys(repeated.state)).toEqual(["sideLetterRequested", "sideLetterStatus"]);
  });
  it("does not execute unrelated instructions", () => {
    const result = applyWorkGuidance(initialWorkGuidance, "Please send the renewal summary now.");
    expect(result.state).toBe(initialWorkGuidance);
    expect(result.state.sideLetterRequested).toBe(false);
  });
});