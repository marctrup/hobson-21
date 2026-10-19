import { describe, expect, it } from "vitest";
import { applyWorkGuidance, initialWorkGuidance, SIDE_LETTER_INSTRUCTION } from "@/components/prototype/workGuidance";
import { applyRoofGuidance, initialRoofGuidance, HOLD_CONTACT_INSTRUCTION, SHOPFRONT_INSTRUCTION } from "@/components/prototype/roofGuidance";

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

describe("Illustrative roof leak guidance", () => {
  it("adds the shopfront check only when scoped to the lease review", () => {
    const scoped = applyRoofGuidance(initialRoofGuidance, "lease", SHOPFRONT_INSTRUCTION);
    expect(scoped.state.shopfrontRequested).toBe(true);
    expect(scoped.state.contactOnHold).toBe(false);
    const wrongScope = applyRoofGuidance(initialRoofGuidance, "overall", SHOPFRONT_INSTRUCTION);
    expect(wrongScope.state).toBe(initialRoofGuidance);
    expect(initialRoofGuidance.shopfrontRequested).toBe(false);
  });
  it("holds external contact only for an investigation-wide instruction", () => {
    const scoped = applyRoofGuidance(initialRoofGuidance, "overall", HOLD_CONTACT_INSTRUCTION);
    expect(scoped.state.contactOnHold).toBe(true);
    expect(scoped.state.shopfrontRequested).toBe(false);
    const wrongScope = applyRoofGuidance(initialRoofGuidance, "lease", HOLD_CONTACT_INSTRUCTION);
    expect(wrongScope.state).toBe(initialRoofGuidance);
  });
  it("does not duplicate work for a repeated instruction", () => {
    const first = applyRoofGuidance(initialRoofGuidance, "overall", HOLD_CONTACT_INSTRUCTION);
    const repeated = applyRoofGuidance(first.state, "overall", HOLD_CONTACT_INSTRUCTION);
    expect(repeated.state).toBe(first.state);
  });
  it("does not pretend to understand other instructions", () => {
    const result = applyRoofGuidance(initialRoofGuidance, "overall", "Chase the contractor now.");
    expect(result.state).toBe(initialRoofGuidance);
    expect(result.reply).toContain("I haven't changed the work");
  });
});