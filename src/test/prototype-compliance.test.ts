import { describe, expect, it } from "vitest";
import { INITIAL, interpret, positionOf } from "@/pages/prototypeComplianceResponsibilities";

describe("compliance responsibilities prototype", () => {
  it("never gives event-triggered responsibilities a calendar date", () => {
    INITIAL.filter((r) => r.timing === "event").forEach((r) => expect(r.next).toBeNull());
  });
  it("treats an unstated review interval as still to establish", () => {
    expect(positionOf(INITIAL.find((r) => r.id === "leg-bg")!)).toBe("establish");
  });
  it("flags a passed inspection date as needing attention", () => {
    expect(positionOf(INITIAL.find((r) => r.id === "eicr-nt")!)).toBe("attention");
  });
  it("records a Section 13 notice only after confirmation, without a date", () => {
    const ask = interpret(INITIAL, null, "We want to increase the rent at Flat 6.");
    expect(ask.items).toBeUndefined();
    const done = interpret(INITIAL, ask.pending, "Yes, record it");
    const added = done.items!.find((r) => r.name.includes("Flat 6"))!;
    expect(added.timing).toBe("event");
    expect(added.next).toBeNull();
  });
  it("assumes nothing for a place with no records", () => {
    const out = interpret(INITIAL, null, "What about Stanley Mews?");
    expect(out.items).toBeUndefined();
    expect(out.filter?.group).toBe("mews");
  });
});
