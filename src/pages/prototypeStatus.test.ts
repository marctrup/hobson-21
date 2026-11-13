import { describe, expect, it } from "vitest";
import { STATUS_PLACES, interpret, labelCounts, placeMatches, unitKey, type SituationBook } from "./prototypeStatus";

const colmore = STATUS_PLACES.find((p) => p.id === "colmore")!;
const book: SituationBook = {
  [unitKey("colmore", "1st Floor")]: { labels: ["Vacant", "Available to let"], by: "Marc T", date: "13 November 2026" },
  [unitKey("colmore", "2nd Floor")]: { labels: ["Being refurbished"], by: "Marc T", date: "13 November 2026" },
};

describe("prototype status", () => {
  it("counts a Unit with two labels under both", () => {
    expect(labelCounts(book, colmore)).toEqual({ Vacant: 1, "Available to let": 1, "Being refurbished": 1 });
  });
  it("a place with no recorded situations never matches, even for All", () => {
    expect(placeMatches(book, STATUS_PLACES[0], "All")).toBe(false);
    expect(placeMatches(book, colmore, "Vacant")).toBe(true);
  });
  it("reads intents from plain words", () => {
    expect(interpret("Which units are vacant?")).toEqual({ kind: "filter", label: "Vacant" });
    expect(interpret("Record a unit's situation")).toEqual({ kind: "record" });
    expect(interpret("What's happening in Birmingham?")).toEqual({ kind: "place", placeId: "colmore" });
  });
});
