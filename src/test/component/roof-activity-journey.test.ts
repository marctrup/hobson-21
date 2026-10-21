import { describe, expect, it } from "vitest";
import { roofActivityJourney } from "@/components/prototype/roofActivityJourney";
import { approveInsurerNotification, createRoofWork, endRoofWork, executeApprovedInsurerNotification, restartRoofWork, roofAttention, sendInsurerNotification } from "@/components/prototype/roofWorkLifecycle";
import { INSURER_SUBJECT, INSURER_TO } from "@/components/prototype/roofDrafts";

describe("Independent roof activity event records", () => {
  it("keeps roof inclusion unresolved and clarification unstarted until demonstrated", () => {
    const plan = roofActivityJourney("lease", createRoofWork());
    expect(plan.steps.map(step => [step.id, step.state])).toEqual([["found", "done"], ["review", "reviewing"], ["extent", "reviewing"], ["clarify", "not-started"]]);
  });
  it("records the sent inspection but never invents a response or findings", () => {
    expect(roofActivityJourney("contractor", createRoofWork()).steps.map(step => step.state)).toEqual(["done", "done", "waiting", "not-started"]);
  });
  it("records specific approval without marking sending complete or awaiting a response", () => {
    const work = approveInsurerNotification(createRoofWork());
    expect(work.insurerApproval).toEqual({ to: INSURER_TO, subject: INSURER_SUBJECT, body: work.insurerDraft, attachments: [] });
    expect(work.insurerSent).toBe(false);
    expect(roofActivityJourney("insurer", work).steps.map(step => step.state)).toEqual(["done", "done", "done", "not-started", "not-started"]);
  });
  it("requires recorded authority before execution", () => {
    const work = createRoofWork();
    expect(executeApprovedInsurerNotification(work)).toBe(work);
    expect(work.history).toHaveLength(3);
  });
  it("executes the exact authorised notification once and clears only insurer attention", () => {
    const sent = sendInsurerNotification(createRoofWork());
    expect(sent.history.slice(3).map(item => item.label)).toEqual(["Approved this insurer notification.", "Sent the insurer notification with your approval."]);
    expect(roofActivityJourney("insurer", sent).steps.map(step => step.state)).toEqual(["done", "done", "done", "done", "waiting"]);
    expect(roofAttention(sent).insurer).toBe(false);
    expect(sent.ended).toBe(false);
    expect(sendInsurerNotification(sent)).toBe(sent);
  });
  it("refuses to execute a materially changed version under old approval", () => {
    const changed = { ...approveInsurerNotification(createRoofWork()), insurerDraft: "Different notification" };
    expect(executeApprovedInsurerNotification(changed)).toBe(changed);
    expect(changed.insurerSent).toBe(false);
    expect(roofActivityJourney("insurer", changed).steps[2].state).toBe("needs-you");
  });
  it("does not extend authority to changed attachments or recipient", () => {
    const approved = approveInsurerNotification(createRoofWork());
    if (!approved.insurerApproval) throw new Error("Approval missing");
    for (const patch of [{ attachments: ["extra.pdf"] }, { to: "Another recipient" }, { subject: "New subject" }]) {
      const changed = { ...approved, insurerApproval: { ...approved.insurerApproval, ...patch } };
      expect(executeApprovedInsurerNotification(changed)).toBe(changed);
    }
  });
  it("contact hold prevents external execution without blocking internal review", () => {
    const held = approveInsurerNotification(createRoofWork());
    held.guidance.contactOnHold = true;
    expect(executeApprovedInsurerNotification(held)).toBe(held);
    expect(roofActivityJourney("lease", held).steps[1].state).toBe("reviewing");
    expect(roofActivityJourney("contractor", held).steps[2].state).toBe("waiting");
  });
  it("pause prevents new actions and preserves existing records", () => {
    const paused = { ...approveInsurerNotification(createRoofWork()), paused: true };
    expect(executeApprovedInsurerNotification(paused)).toBe(paused);
    expect(paused.history).toHaveLength(4);
  });
  it("retains instructions and completed records when lease plans revise the approach", () => {
    const work = createRoofWork();
    work.guidance.shopfrontRequested = true;
    work.guidance.leasePlansRequested = true;
    const plan = roofActivityJourney("lease", work);
    expect(plan.steps.map(step => step.id)).toEqual(["found", "review", "plans", "extent", "clarify"]);
    expect(plan.steps[2].state).toBe("not-started");
    expect(work.history).toHaveLength(3);
    expect(work.guidance.shopfrontRequested).toBe(true);
  });
  it("snapshots exact approval but inherits no authority or sent steps on restart", () => {
    const ended = endRoofWork(approveInsurerNotification(createRoofWork()));
    expect(executeApprovedInsurerNotification(ended)).toBe(ended);
    const fresh = restartRoofWork(ended);
    expect(fresh.insurerApproval).toBeUndefined();
    expect(fresh.previous[0].insurerApproval?.body).toBe(ended.insurerDraft);
    expect(roofActivityJourney("contractor", fresh).steps.every(step => step.state === "not-started")).toBe(true);
    expect(roofActivityJourney("insurer", fresh).steps.every(step => step.state === "not-started")).toBe(true);
  });
});