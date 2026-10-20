import { describe, expect, it } from "vitest";
import { addToBatch, EXAMPLE_BATCH, FIRST_LOOK, isExampleBatch, needsYou, type BatchPaper } from "./prototypeDocumentsBatch";

const p = (n: number): BatchPaper => ({ id: `p${n}`, filename: `p${n}.pdf`, size: n, url: "" });

describe("batch upload limit", () => {
  it("example batch has five papers, including the Wayleave", () => {
    expect(EXAMPLE_BATCH).toHaveLength(5);
    expect(EXAMPLE_BATCH.some((x) => x.filename.startsWith("BT & Puig Wayleave"))).toBe(true);
    expect(EXAMPLE_BATCH.some((x) => x.filename.includes("Underlease"))).toBe(false);
  });
  it("caps a batch at five and reports the rest", () => {
    const r = addToBatch([], [1, 2, 3, 4, 5, 6, 7].map(p));
    expect(r.papers).toHaveLength(5);
    expect(r.overflow).toBe(2);
  });
  it("adding more fills only the remaining room", () => {
    const r = addToBatch([p(1), p(2), p(3)], [p(4), p(5), p(6)]);
    expect(r.papers.map((x) => x.id)).toEqual(["p1", "p2", "p3", "p4", "p5"]);
    expect(r.overflow).toBe(1);
  });
});

describe("first look", () => {
  it("sorts the example into 2 ready, 2 to check, 1 unplaced", () => {
    const groups = EXAMPLE_BATCH.map((x) => FIRST_LOOK[x.id].group);
    expect(groups.filter((g) => g === "ready")).toHaveLength(2);
    expect(groups.filter((g) => g === "check")).toHaveLength(2);
    expect(groups.filter((g) => g === "unplaced")).toHaveLength(1);
  });
  it("3 need you, and removing one updates the count", () => {
    expect(needsYou(EXAMPLE_BATCH)).toBe(3);
    expect(needsYou(EXAMPLE_BATCH.filter((x) => FIRST_LOOK[x.id].group !== "unplaced"))).toBe(2);
  });
  it("the Wayleave gets no invented date", () => {
    expect(FIRST_LOOK[EXAMPLE_BATCH.find((x) => x.filename.startsWith("BT"))!.id].name).not.toMatch(/\d{4}/);
  });
  it("own uploads are not given the example first look", () => expect(isExampleBatch([p(1)])).toBe(false));
});
