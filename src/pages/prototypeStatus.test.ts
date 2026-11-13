import { describe, expect, it } from "vitest";
import { CURRENT, STATUS_PLACES, interpret, labelCounts, placeMatches, situationOf, unitKey, withoutLabel, type SituationBook } from "./prototypeStatus";

const colmore = STATUS_PLACES.find((p) => p.id === "colmore")!;
const book: SituationBook = {
  [unitKey("colmore", "1st Floor")]: { labels: ["Unoccupied", "Available to let"], by: "Marc T", date: "13 November 2026" },
  [unitKey("colmore", "2nd Floor")]: { labels: ["Available to let"], by: "Marc T", date: "13 November 2026" },
};

describe("prototype status", () => {
  it("counts a Unit with two labels under both", () => {
    expect(labelCounts(book, colmore)).toEqual({ Unoccupied: 1, "Available to let": 2 });
  });
  it("a place with no recorded situations never matches, even for All", () => {
    expect(placeMatches(book, STATUS_PLACES[0], "All")).toBe(false);
    expect(placeMatches(book, colmore, "Unoccupied")).toBe(true);
  });
  it("reads intents from plain words", () => {
    expect(interpret("Which units are unoccupied?")).toEqual({ kind: "filter", label: "Unoccupied" });
    expect(interpret("Which units are vacant?")).toEqual({ kind: "filter", label: "Unoccupied" });
    expect(interpret("What's available to let?")).toEqual({ kind: "filter", label: "Available to let" });
    expect(interpret("Record a unit's situation")).toEqual({ kind: "record" });
    expect(interpret("What's happening in Birmingham?")).toEqual({ kind: "place", placeId: "colmore" });
  });
  it("keeps a situation asked about here with the Unit we are standing at", () => {
    expect(interpret("What's the situation here?")).toEqual({ kind: "here" });
    expect(interpret("What's the situation with the 1st Floor?")).toEqual({ kind: "here" });
    expect(interpret("How does this Unit stand?")).toEqual({ kind: "here" });
  });
  it("removes one label at a time, and the record goes with its last label", () => {
    const key = unitKey("colmore", "1st Floor");
    const one = withoutLabel(book, key, "Unoccupied");
    expect(one[key].labels).toEqual(["Available to let"]);
    expect(one[key].by).toBe("Marc T");
    const none = withoutLabel(one, key, "Available to let");
    expect(none[key]).toBeUndefined();
    // other Units are untouched, and an unknown key changes nothing
    expect(none[unitKey("colmore", "2nd Floor")].labels).toEqual(["Available to let"]);
    expect(withoutLabel(book, "nowhere::nothing", "Unoccupied")).toBe(book);
  });
  it("holds one record for the Unit we are standing at", () => {
    expect(situationOf({})).toBeNull();
    const here: SituationBook = { [unitKey(CURRENT.placeId, CURRENT.unit)]: { labels: ["Unoccupied"], by: "Marc T", date: "13 November 2026" } };
    expect(situationOf(here)?.labels).toEqual(["Unoccupied"]);
    expect(situationOf({ [unitKey("colmore", "1st Floor")]: { labels: ["Unoccupied"], by: "Marc T", date: "13 November 2026" } })).toBeNull();
  });
});

import { portfolioCounts as pc, unitsMatching as um, unitKey as uk, STATUS_PLACES as SP } from "./prototypeStatus";
describe("filter counts", () => {
  it("counts a Unit under every label it carries, and once under All", () => {
    const book = { [uk("wharf", "3rd Floor")]: { labels: ["Unoccupied", "Available to let"] as any, by: "M", date: "d" } };
    expect(pc(book).Unoccupied).toBe(1);
    expect(pc(book)["Available to let"]).toBe(1);
    expect(um(book, SP, "All")).toBe(1);
  });
});
