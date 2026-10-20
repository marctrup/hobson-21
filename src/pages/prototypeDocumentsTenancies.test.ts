import { describe, expect, it } from "vitest";
import { answerBelongs, answerMgmt, answerStatus, giveEndDate, nextStep, openDecisions, reopen, startTenancies } from "./prototypeDocumentsTenancies";

const base = { ...startTenancies(), step: "puigStatus" as const };

describe("Iteration 5C tenancy decisions", () => {
  it("asks Puig, then Sublease presentation, then Sublease status", () => {
    let t = answerStatus(base, "puig", "current");
    expect(t.step).toBe("subMgmt");
    t = answerMgmt(t, "both");
    expect(t.step).toBe("subStatus");
    t = answerStatus(t, "sub", "ended");
    expect(t.step).toBe("subEnd");
    t = giveEndDate(t, "1 May 2025");
    expect(t.step).toBe("comparing");
    expect(t.puig).toBe("current");
    expect(t.sub).toBe("ended");
  });
  it("records the two statuses independently", () => {
    const t = answerStatus(answerMgmt(answerStatus(base, "puig", "ended"), "puig"), "sub", "current");
    expect(t.puig).toBe("ended");
    expect(t.sub).toBe("current");
  });
  it("Not sure never counts as settled", () => {
    const t = answerStatus(answerMgmt(answerStatus(base, "puig", "unsure"), "unsure"), "sub", "current");
    expect(openDecisions(t)).toBe(5); // Puig + presentation + 2 unconfirmed papers + Wayleave
  });
  it("changing one answer keeps the others", () => {
    const settled = { ...answerStatus(answerMgmt(answerStatus(base, "puig", "current"), "both"), "sub", "current"), compared: true };
    const done = answerBelongs(answerBelongs({ ...settled, step: "licence" }, "puig"), "sub");
    const changed = answerMgmt(reopen(done, "mgmt"), "puig");
    expect(changed).toMatchObject({ puig: "current", sub: "current", mgmt: "puig", step: "done", belongs: { "example-2": "puig", "example-4": "sub" } });
    expect(nextStep(changed)).toBe("done");
  });
  it("after the leases, asks about the Licence then the Deed; Not sure keeps it open", () => {
    const settled = { ...answerStatus(answerMgmt(answerStatus(base, "puig", "current"), "puig"), "sub", "current"), compared: true };
    let t = { ...settled, step: nextStep(settled) };
    expect(t.step).toBe("licence");
    t = answerBelongs(t, "puig");
    expect(t.step).toBe("deed");
    t = answerBelongs(t, "unsure");
    expect(t.step).toBe("done");
    expect(openDecisions(t)).toBe(2); // the deed + Wayleave
  });
  it("a paper can belong to the Sublease even when shown inside Puig's history", () => {
    const settled = { ...answerStatus(answerMgmt(answerStatus(base, "puig", "current"), "puig"), "sub", "current"), compared: true, step: "licence" as const };
    expect(answerBelongs(settled, "sub").belongs["example-2"]).toBe("sub");
  });
});
