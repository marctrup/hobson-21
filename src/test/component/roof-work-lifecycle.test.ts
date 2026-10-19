import { describe, expect, it } from "vitest";
import { createRoofWork, endRoofWork, restartRoofWork, roofAttention } from "@/components/prototype/roofWorkLifecycle";

describe("Roof investigation attempt safety", () => {
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