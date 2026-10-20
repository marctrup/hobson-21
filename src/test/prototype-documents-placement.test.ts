import { describe, expect, it } from "vitest";
import { chooseUnit, emptyPlacement, isSettled, statusText } from "@/pages/prototypeDocumentsPlacement";

describe("Documents Stage 3", () => {
  it("proposes the Fourth Floor but does not treat it as confirmed", () => {
    expect(emptyPlacement.unit).toBe("Fourth Floor");
    expect(emptyPlacement.unitStatus).toBe("asking");
  });
  it("Not sure leaves the Unit unattached", () => {
    const p = chooseUnit(emptyPlacement, "unsure");
    expect(p.unit).toBeNull();
    expect(isSettled({ ...p, role: { kind: "landlord" }, relation: "new" })).toBe(false);
  });
  it("never creates a Unit outside the example portfolio", () => {
    expect(chooseUnit(emptyPlacement, "Sixth Floor")).toBe(emptyPlacement);
  });
  it("joins a history only with Unit, responsibility and a new tenancy settled", () => {
    const p = { ...chooseUnit(emptyPlacement, "Fourth Floor"), role: { kind: "landlord" as const } };
    expect(isSettled({ ...p, relation: "new" })).toBe(true);
    expect(isSettled({ ...p, relation: "earlier" })).toBe(false);
  });
  it("does not infer current status from the lease dates", () => {
    expect(statusText(emptyPlacement)).toBe("Current status not yet established");
    expect(statusText({ ...emptyPlacement, current: "unsure" })).toBe("Current status unconfirmed");
    expect(statusText({ ...emptyPlacement, current: "ended", endDate: null })).toContain("ending date not given");
  });
});
describe("Documents Stage 3B", () => {
  it("shows current only as confirmed by the user", () => {
    expect(statusText({ ...emptyPlacement, current: "current" })).toBe("Current — Confirmed by you");
  });
});
import { advanceReadings, activeReadings, previewFinish, READING_PHRASES, type Reading } from "@/pages/prototypeDocumentsReading";
describe("Documents Reading", () => {
  const r = { id: 1, finished: false, step: 0 } as Reading;
  it("advancing activity never finishes a reading", () => {
    let list = [r]; for (let i = 0; i < 10; i++) list = advanceReadings(list);
    expect(list[0].finished).toBe(false);
    expect(list[0].step).toBe(READING_PHRASES.length - 1);
  });
  it("finished readings leave the Reading count", () => {
    expect(activeReadings(previewFinish([r, { ...r, id: 2 }], 1))).toHaveLength(1);
  });
});
import { statusLabel, shortDate } from "@/pages/PrototypeDocumentsChain";
describe("Tenancy history status wording", () => {
  it("uses Hobson's words, never back-end states", () => {
    expect(statusLabel({ kind: "current" })).toBe("Current");
    expect(statusLabel({ kind: "starts", date: "1 Jan 2026" })).toBe("Starts on 1 Jan 2026");
    expect(statusLabel({ kind: "ended", date: "30 Jun 2027" })).toBe("Ended on 30 Jun 2027");
    expect(statusLabel({ kind: "unconfirmed" })).toBe("Status unconfirmed");
    expect(shortDate("22 August 2025")).toBe("22 Aug 2025");
  });
});
