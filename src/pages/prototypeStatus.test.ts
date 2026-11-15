import { describe, expect, it } from "vitest";
import {
  STATUS_PLACES, complianceKindCounts, interpret, parseStatusInstruction, placeFindings, reasonCounts, signalCounts, signalUnitsMatching, unitKey, unitsMatching,
  type AvailabilityBook, type ComplianceBook, type EndingBook, type FindingBook,
} from "./prototypeStatus";

const book: FindingBook = {
  [unitKey("colmore", "1st Floor")]: { reason: "No new occupancy", detail: "Lease ended" },
  [unitKey("colmore", "2nd Floor")]: { reason: "No papers" },
  [unitKey("clyde", "Workshop")]: { reason: "No papers" },
};
const endings: EndingBook = {
  [unitKey("exchange", "2nd Floor")]: { date: "31 March 2027", detail: "Confirmed surrender" },
};
const availability: AvailabilityBook = {
  [unitKey("colmore", "1st Floor")]: { detail: "Being offered" },
  [unitKey("exchange", "2nd Floor")]: { detail: "Being offered before ending" },
};
const compliance: ComplianceBook = {
  [unitKey("colmore", "1st Floor")]: [{ kind: "Expired document", document: "Fire risk assessment", date: "1 October 2026" }],
  [unitKey("exchange", "Ground Floor")]: [{ kind: "Missing document", document: "Asbestos management survey" }],
  [unitKey("exchange", "2nd Floor")]: [{ kind: "Expiring soon", document: "Fire alarm test certificate", date: "30 November 2026" }],
};

describe("Unoccupied means no papers or an ended chain", () => {
  it("counts the two reasons separately and together", () => {
    expect(reasonCounts(book)).toEqual({ "No papers": 2, "No new occupancy": 1 });
    expect(unitsMatching(book, STATUS_PLACES, "All")).toBe(3);
  });
  it("treats Units without a finding as having a current chain", () => {
    const colmore = STATUS_PLACES.find((p) => p.id === "colmore")!;
    expect(placeFindings(book, colmore).map((f) => f.unit)).toEqual(["1st Floor", "2nd Floor"]);
  });
});

describe("Independent map signals", () => {
  it("counts each Unit once in All even when it has several signals", () => {
    expect(signalCounts(book, endings, availability, STATUS_PLACES, compliance)).toEqual({
      All: 5,
      "No papers": 2,
      "No new occupancy": 1,
      "Tenancy ending": 1,
      "Available to let": 2,
      "Compliance warning": 3,
    });
  });
  it("does not turn availability into an Unoccupied finding", () => {
    expect(signalUnitsMatching(book, endings, availability, STATUS_PLACES, "Available to let", compliance)).toBe(2);
    expect(unitsMatching(book, STATUS_PLACES, "All")).toBe(3);
  });
  it("keeps a confirmed future ending separate from no new occupancy", () => {
    expect(signalUnitsMatching(book, endings, availability, STATUS_PLACES, "Tenancy ending", compliance)).toBe(1);
    expect(signalUnitsMatching(book, endings, availability, STATUS_PLACES, "No new occupancy", compliance)).toBe(1);
  });
  it("aggregates document warnings without adding another tenancy or occupancy signal", () => {
    expect(complianceKindCounts(compliance)).toEqual({ "Expired document": 1, "Missing document": 1, "Expiring soon": 1 });
    expect(signalUnitsMatching(book, endings, availability, STATUS_PLACES, "Compliance warning", compliance)).toBe(3);
    expect(unitsMatching(book, STATUS_PLACES, "All")).toBe(3);
  });
});

describe("Questions and illustrative recording instructions", () => {
  it("understands questions about every map lens", () => {
    expect(interpret("Which Units have no papers?")).toEqual({ kind: "filter", filter: "No papers" });
    expect(interpret("Show me the ended chains")).toEqual({ kind: "filter", filter: "No new occupancy" });
    expect(interpret("Which tenancies are ending?")).toEqual({ kind: "filter", filter: "Tenancy ending" });
    expect(interpret("Which Units are available to let?")).toEqual({ kind: "filter", filter: "Available to let" });
    expect(interpret("Which Units have compliance warnings?")).toEqual({ kind: "filter", filter: "Compliance warning" });
    expect(interpret("What's vacant?")).toEqual({ kind: "filter", filter: "All" });
    expect(interpret("Tell me about Glasgow")).toEqual({ kind: "place", placeId: "clyde" });
  });
  it("parses the supplied Unit, place and confirmed-ending date", () => {
    expect(parseStatusInstruction("The tenancy on the 1st Floor at The Exchange ends on 30 September 2027.")).toEqual({
      kind: "ending", placeId: "exchange", unit: "1st Floor", date: "30 September 2027",
    });
    expect(parseStatusInstruction("Mark the 2nd Floor at 1 Linear Park as available to let.")).toEqual({
      kind: "available", placeId: "linear-park", unit: "2nd Floor",
    });
  });
});
