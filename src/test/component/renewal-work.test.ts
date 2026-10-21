import { describe, expect, it } from "vitest";
import { createRenewalWork, startRenewalActivity } from "@/components/prototype/renewalWork";

describe("Renewal preparation authority", () => {
  it.each(["summary", "communication"] as const)("starting %s records preparation once, never approval or sending", activity => {
    const initial = createRenewalWork();
    const started = startRenewalActivity(initial, activity, false);
    expect(started[activity === "summary" ? "summaryStarted" : "communicationStarted"]).toBe(true);
    expect(started.approval).toBe("idle");
    expect(started.history).toHaveLength(1);
    expect(started.emailBody).toBe(initial.emailBody);
    expect(startRenewalActivity(started, activity, false)).toBe(started);
  });
  it("does not start preparation while paused", () => {
    const initial = createRenewalWork();
    expect(startRenewalActivity(initial, "summary", true)).toBe(initial);
    expect(startRenewalActivity(initial, "communication", true)).toBe(initial);
  });
});