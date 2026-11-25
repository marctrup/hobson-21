import { describe, expect, it } from "vitest";
import { SKILLS, draftBreak, initialState, reducer, workflowFor } from "./prototypeResponsibilities";

describe("responsibilities", () => {
  it("personalising updates the responsibility and workflow, never the master skill", () => {
    const before = JSON.stringify(SKILLS);
    let s = reducer(initialState(), { type: "propose", proposal: { kind: "change", id: "compliance", leadDays: 60, followUpDays: 3 } });
    s = reducer(s, { type: "confirm" });
    const r = s.items.find((x) => x.id === "compliance")!;
    expect(r.instructions.leadDays).toBe(60);
    expect(workflowFor(r).some((st) => st.label === "Identify inspections due within 60 days")).toBe(true);
    expect(r.monthly).toBe(75);
    expect(JSON.stringify(SKILLS)).toBe(before);
  });
  it("extending adds quotation work and revises the subscription to £95", () => {
    let s = reducer(initialState(), { type: "propose", proposal: { kind: "extend", id: "compliance" } });
    s = reducer(s, { type: "confirm" });
    const r = s.items.find((x) => x.id === "compliance")!;
    expect(r.monthly).toBe(95);
    expect(r.skills).toContain("procurement");
    expect(workflowFor(r).some((st) => /three quotations/.test(st.label))).toBe(true);
  });
  it("view-and-instruct access cannot pause a shared responsibility", () => {
    const s = reducer(initialState(), { type: "propose", proposal: { kind: "pause", id: "renewal" } });
    expect(s.proposal).toBeNull();
  });
  it("confirming a new break responsibility adds it as Active at £25", () => {
    let s = reducer(initialState(), { type: "propose", proposal: { kind: "create", draft: draftBreak() } });
    s = reducer(s, { type: "confirm" });
    const r = s.items.find((x) => x.id === "weekly-break")!;
    expect(r.status).toBe("Active"); expect(r.monthly).toBe(25);
  });
  it("a procedure stays awaiting review", () => {
    const s = reducer(initialState(), { type: "procedure", id: "maintenance" });
    expect(s.items.find((x) => x.id === "maintenance")!.procedure).toBe("Awaiting review");
  });
});
