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
    expect(openDecisions(t)).toBe(6); // Puig + presentation + 2 unconfirmed papers + Wayleave completion and tenancy
  });
  it("changing one answer keeps the others", () => {
    const settled = { ...answerStatus(answerMgmt(answerStatus(base, "puig", "current"), "both"), "sub", "current"), compared: true };
    const done = answerBelongs(answerBelongs({ ...settled, step: "licence" }, "puig"), "sub");
    const changed = answerMgmt(reopen(done, "mgmt"), "puig");
    expect(changed).toMatchObject({ puig: "current", sub: "current", mgmt: "puig", step: "wayleave", belongs: { "example-2": "puig", "example-4": "sub" } });
    expect(nextStep(changed)).toBe("wayleave");
  });
  it("after the leases, asks about the Licence then the Deed; Not sure keeps it open", () => {
    const settled = { ...answerStatus(answerMgmt(answerStatus(base, "puig", "current"), "puig"), "sub", "current"), compared: true };
    let t = { ...settled, step: nextStep(settled) };
    expect(t.step).toBe("licence");
    t = answerBelongs(t, "puig");
    expect(t.step).toBe("deed");
    t = answerBelongs(t, "unsure");
    expect(t.step).toBe("wayleave");
    expect(openDecisions(t)).toBe(3); // the deed + Wayleave completion and tenancy
  });
  it("a paper can belong to the Sublease even when shown inside Puig's history", () => {
    const settled = { ...answerStatus(answerMgmt(answerStatus(base, "puig", "current"), "puig"), "sub", "current"), compared: true, step: "licence" as const };
    expect(answerBelongs(settled, "sub").belongs["example-2"]).toBe("sub");
  });
});

import { answerCompletion, answerCompletionDate, answerWayleaveBelongs, receiveSecondCopy, wayleaveOpen } from "./prototypeDocumentsTenancies";
describe("Wayleave: explain what needs checking", () => {
  const atWayleave = () => {
    const s = { ...answerStatus(answerMgmt(answerStatus({ ...startTenancies(), step: "puigStatus" }, "puig", "current"), "both"), "sub", "current"), compared: true };
    return answerBelongs(answerBelongs({ ...s, step: "licence" }, "puig"), "puig");
  };
  it("asks completion after the deed, then the date, then the tenancy", () => {
    let t = atWayleave();
    expect(t.step).toBe("wayleave");
    t = answerCompletion(t, "completed");
    expect(t.step).toBe("wayleaveDate");
    t = answerCompletionDate(t, null);
    expect(t.step).toBe("wayleaveBelongs");
    t = answerWayleaveBelongs(t, "puig");
    expect(t.step).toBe("done");
    expect(wayleaveOpen(t.wayleave)).toEqual(["date"]); // tenancy kept; only the date stays open
  });
  it("never takes 20 April 2017 from the filename", () => {
    const t = answerCompletionDate(answerCompletion(atWayleave(), "completed"), null);
    expect(t.wayleave.completedOn).toBeNull();
  });
  it("a second copy keeps completion open", () => {
    let t = answerCompletion(atWayleave(), "another");
    expect(t.step).toBe("wayleaveCopy");
    t = receiveSecondCopy(t);
    expect(t.step).toBe("wayleaveBelongs");
    expect(wayleaveOpen(t.wayleave)).toContain("completion");
  });
  it("not completed + confirmed tenancy is fully settled", () => {
    const t = answerWayleaveBelongs(answerCompletion(atWayleave(), "notCompleted"), "puig");
    expect(wayleaveOpen(t.wayleave)).toEqual([]);
  });
  it("Not sure on completion still lets the review continue", () => {
    expect(answerCompletion(atWayleave(), "unsure").step).toBe("wayleaveBelongs");
  });
});
