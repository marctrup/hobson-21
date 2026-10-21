import { describe, expect, it } from "vitest";
import { createRoofWork, createUnstartedRoofWork, startRoofActivity, switchRoofScenario, endRoofWork, restartRoofWork, roofAttention, roofOverviewCounts } from "@/components/prototype/roofWorkLifecycle";
import { roofActivityJourney } from "@/components/prototype/roofActivityJourney";

describe("Roof investigation attempt safety", () => {
  it("starts the new scenario without contractor contact, insurer draft or pending approval", () => {
    const work = createUnstartedRoofWork();
    expect(work.contractorRequestSent).toBe(false);
    expect(work.insurerPrepared).toBe(false);
    expect(work.insurerDraft).toBe("");
    expect(work.insurerApproval).toBeUndefined();
    expect(work.history).toHaveLength(2);
    expect(roofOverviewCounts(work)).toEqual({ accomplished: 3, active: 7, needsYou: 2 });
    expect(roofActivityJourney("contractor", work).steps).toEqual([]);
    expect(roofActivityJourney("insurer", work).steps).toEqual([]);
  });
  it.each(["contractor", "insurer"] as const)("starting %s records internal work once, never contact or approval", activity => {
    const work = startRoofActivity(createUnstartedRoofWork(), activity);
    expect(activity === "contractor" ? work.contractorStarted : work.insurerStarted).toBe(true);
    expect(work.contractorRequestSent).toBe(false);
    expect(work.insurerSent).toBe(false);
    expect(work.insurerPrepared).toBe(false);
    expect(work.insurerApproval).toBeUndefined();
    expect(work.history).toHaveLength(3);
    expect(startRoofActivity(work, activity)).toBe(work);
    const steps = roofActivityJourney(activity, work).steps;
    expect(steps[0].state).toBe("reviewing");
    expect(steps.slice(1).every(step => step.state === "not-started")).toBe(true);
  });
  it("allows internal starts during a contact hold but not while paused or ended", () => {
    const work = createUnstartedRoofWork();
    work.guidance.contactOnHold = true;
    expect(startRoofActivity(work, "contractor").contractorStarted).toBe(true);
    const paused = { ...work, paused: true };
    expect(startRoofActivity(paused, "insurer")).toBe(paused);
    const ended = endRoofWork(work);
    expect(startRoofActivity(ended, "insurer")).toBe(ended);
  });
  it("retains each scenario's independent history and restores the earlier sent/prepared example", () => {
    const fresh = startRoofActivity(createUnstartedRoofWork(), "contractor");
    const earlier = switchRoofScenario(fresh);
    expect(earlier.contractorRequestSent).toBe(true);
    expect(earlier.insurerPrepared).toBe(true);
    expect(earlier.history).toHaveLength(3);
    const restored = switchRoofScenario({ ...earlier, paused: true });
    expect(restored.contractorStarted).toBe(true);
    expect(restored.contractorRequestSent).toBe(false);
    expect(restored.history).toEqual(fresh.history);
    expect(restored.paused).toBe(false);
    expect(switchRoofScenario(restored).paused).toBe(true);
  });
  it("retains three accomplishments, five ongoing jobs and three actionable decisions", () => {
    expect(roofOverviewCounts(createRoofWork())).toEqual({ accomplished: 3, active: 7, needsYou: 3 });
  });
  it("counts only actionable roof decisions without changing accomplishments", () => {
    const work = createRoofWork();
    work.guidance.contactOnHold = true;
    expect(roofOverviewCounts(work)).toEqual({ accomplished: 3, active: 7, needsYou: 2 });
    work.help.shown = true;
    expect(roofOverviewCounts(work)).toEqual({ accomplished: 3, active: 7, needsYou: 3 });
    expect(roofOverviewCounts(endRoofWork(work))).toEqual({ accomplished: 3, active: 6, needsYou: 2 });
  });
  it("counts two roof matters as one attention job, alongside a renewal job", () => {
    const work = createRoofWork();
    work.help.shown = true;
    expect(roofOverviewCounts(work)).toEqual({ accomplished: 3, active: 7, needsYou: 3 });
    expect(roofOverviewCounts(work, true)).toEqual({ accomplished: 3, active: 7, needsYou: 4 });
    expect(roofOverviewCounts(endRoofWork(work), true)).toEqual({ accomplished: 3, active: 6, needsYou: 3 });
  });
  it("closes an attempt and removes every pending attention request", () => {
    const work = createRoofWork();
    work.help.shown = true;
    expect(roofAttention(work)).toEqual({ insurer: true, help: true });
    const ended = endRoofWork(work);
    expect(ended.ended).toBe(true);
    expect(roofAttention(ended)).toEqual({ insurer: false, help: false });
    expect(endRoofWork(ended)).toBe(ended);
  });
  it("preserves sent communications, findings and unsent enquiry as an immutable snapshot", () => {
    const work = createRoofWork();
    work.help = { shown: true, choice: "enquiry" };
    work.guidance.contactOnHold = true;
    const ended = endRoofWork(work);
    expect(ended.previous[0].contractorRequestSent).toBe(true);
    expect(ended.previous[0].history).toHaveLength(3);
    expect(ended.previous[0].help.choice).toBe("enquiry");
    work.guidance.contactOnHold = false;
    expect(ended.previous[0].guidance.contactOnHold).toBe(true);
  });
  it("starts a distinct attempt without old holds, checks, drafts or repeated requests", () => {
    const work = createRoofWork();
    work.guidance = { contactOnHold: true, shopfrontRequested: true, leasePlansRequested: true, holdWasLifted: true };
    work.help = { shown: true, choice: "enquiry" };
    work.paused = true;
    const fresh = restartRoofWork(endRoofWork(work));
    expect(fresh.number).toBe(2);
    expect(fresh.ended).toBe(false);
    expect(fresh.paused).toBe(false);
    expect(fresh.guidance).toEqual({ contactOnHold: false, shopfrontRequested: false, leasePlansRequested: false, holdWasLifted: false });
    expect(fresh.help).toEqual({ shown: false, choice: null });
    expect(fresh.insurerPrepared).toBe(false);
    expect(fresh.contractorRequestSent).toBe(false);
    expect(fresh.history).toEqual([]);
    expect(fresh.previous).toHaveLength(1);
    expect(roofAttention(fresh)).toEqual({ insurer: false, help: false });
  });
  it("cannot restart active or merely paused work", () => {
    const work = createRoofWork();
    work.paused = true;
    expect(restartRoofWork(work)).toBe(work);
  });
});