import { describe, expect, it } from "vitest";
import { STATUS_PLACES, interpret, placeFindings, reasonCounts, unitKey, unitsMatching, type FindingBook } from "./prototypeStatus";

const book: FindingBook = {
  [unitKey("colmore", "1st Floor")]: { reason: "Chain ended", detail: "Lease ended" },
  [unitKey("colmore", "2nd Floor")]: { reason: "No papers" },
  [unitKey("clyde", "Workshop")]: { reason: "No papers" },
};

describe("Unoccupied means no papers or an ended chain", () => {
  it("counts the two reasons separately and together", () => {
    expect(reasonCounts(book)).toEqual({ "No papers": 2, "Chain ended": 1 });
    expect(unitsMatching(book, STATUS_PLACES, "All")).toBe(3);
  });
  it("treats Units without a finding as occupied", () => {
    const colmore = STATUS_PLACES.find((p) => p.id === "colmore")!;
    expect(placeFindings(book, colmore).map((f) => f.unit)).toEqual(["1st Floor", "2nd Floor"]);
  });
  it("understands questions about each reason", () => {
    expect(interpret("Which Units have no papers?")).toEqual({ kind: "filter", filter: "No papers" });
    expect(interpret("Show me the ended chains")).toEqual({ kind: "filter", filter: "Chain ended" });
    expect(interpret("What's vacant?")).toEqual({ kind: "filter", filter: "All" });
    expect(interpret("Tell me about Glasgow")).toEqual({ kind: "place", placeId: "clyde" });
  });
});
