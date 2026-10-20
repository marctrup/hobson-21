import { describe, expect, it } from "vitest";
import { answerMgmt, answerStatus, giveEndDate, nextStep, openDecisions, reopen, startTenancies } from "./prototypeDocumentsTenancies";

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
    expect(openDecisions(t)).toBe(3); // Puig + presentation + Wayleave
  });
  it("changing one answer keeps the others", () => {
    const done = { ...answerStatus(answerMgmt(answerStatus(base, "puig", "current"), "both"), "sub", "current"), compared: true };
    const changed = answerMgmt(reopen(done, "mgmt"), "puig");
    expect(changed).toMatchObject({ puig: "current", sub: "current", mgmt: "puig", step: "done" });
    expect(nextStep(changed)).toBe("done");
  });
});
