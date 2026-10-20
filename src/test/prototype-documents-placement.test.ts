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
