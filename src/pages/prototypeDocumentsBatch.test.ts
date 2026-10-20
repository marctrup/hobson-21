import { describe, expect, it } from "vitest";
import { addToBatch, EXAMPLE_BATCH, type BatchPaper } from "./prototypeDocumentsBatch";

const p = (n: number): BatchPaper => ({ id: `p${n}`, filename: `p${n}.pdf`, size: n, url: "" });

describe("batch upload limit", () => {
  it("example batch has five papers", () => expect(EXAMPLE_BATCH).toHaveLength(5));
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
