import { describe, expect, it } from "vitest";
import { AGENT_JOBS, AGENT_SCOPE_GROUPS, agentOverview, agentWorkflow, agentsReducer, draftResponsibility, initialAgentsState } from "./prototypeAgents";

describe("Delegated responsibilities — illustrative rules", () => {
  it.each([["compliance", 75], ["break", 25], ["rent", 25], ["report", 35], ["renewal", 75], ["maintenance", 100]])("keeps the supplied monthly subscription for %s", (id, cost) => {
    expect(initialAgentsState().agents.find((a) => a.id === id)?.cost).toBe(cost);
  });
  it("looks after exactly 120 residential Units across the example scope", () => {
    expect(AGENT_SCOPE_GROUPS.reduce((sum, g) => sum + g.total, 0)).toBe(120);
    expect(initialAgentsState().agents.find((a) => a.id === "compliance")?.scope).toBe("120 residential Units");
  });
  it("does not create a responsibility until confirmed", () => {
    const s = initialAgentsState();
    const prepared = agentsReducer(s, { type: "propose", proposal: { kind: "create", draft: draftResponsibility() } });
    expect(prepared.agents).toHaveLength(6);
    const confirmed = agentsReducer(prepared, { type: "confirm" });
    const a = confirmed.agents.find((a) => a.name === "Weekly Break Report");
    expect(a).toMatchObject({ status: "Active", cost: 25, periodMonths: 6, frequency: "Every Monday at 09:00", scope: "All authorised commercial Units", shared: false });
    expect(a?.activity).toHaveLength(1);
    expect(agentsReducer(confirmed, { type: "confirm" }).agents).toHaveLength(7);
  });
  it("keeps unconfirmed 60-day instructions out of the record", () => {
    const s = agentsReducer(initialAgentsState(), { type: "propose", proposal: { kind: "change", agentId: "compliance", leadDays: 60 } });
    expect(s.agents.find((a) => a.id === "compliance")?.leadDays).toBe(30);
    const next = agentsReducer(s, { type: "confirm" });
    const a = next.agents.find((a) => a.id === "compliance");
    if (!a) throw new Error("Missing compliance agent");
    expect(a.leadDays).toBe(60);
    expect(a.cost).toBe(75);
    expect(a.followUpDays).toBe(7);
    expect(agentWorkflow(a).find((n) => n.id === "due")?.label).toContain("60 days");
    expect(agentOverview(a)).toContain("60 days");
    expect(a.activity).toHaveLength(2);
  });
  it("cancelling a change keeps the 30-day arrangement", () => {
    const s = agentsReducer(initialAgentsState(), { type: "propose", proposal: { kind: "change", agentId: "compliance", leadDays: 60 } });
    expect(agentsReducer(s, { type: "discard" }).agents.find((a) => a.id === "compliance")?.leadDays).toBe(30);
  });
  it("pausing stops scheduled reviews but does not cancel the £75 subscription or jobs", () => {
    const s = agentsReducer(initialAgentsState(), { type: "propose", proposal: { kind: "pause", agentId: "compliance" } });
    expect(s.agents.find((a) => a.id === "compliance")?.status).toBe("Active");
    const paused = agentsReducer(s, { type: "confirm" });
    expect(paused.agents.find((a) => a.id === "compliance")).toMatchObject({ status: "Paused", cost: 75 });
    expect(AGENT_JOBS.filter((j) => j.agentId === "compliance")).toHaveLength(6);
    const resumed = agentsReducer(agentsReducer(paused, { type: "propose", proposal: { kind: "resume", agentId: "compliance" } }), { type: "confirm" });
    expect(resumed.agents.find((a) => a.id === "compliance")).toMatchObject({ status: "Active", next: "1 December at 09:00", last: "Not yet run" });
  });
  it.each(["pause", "resume", "change"] as const)("view-and-instruct access cannot %s a shared agent", (kind) => {
    const s = initialAgentsState();
    const next = agentsReducer(s, { type: "propose", proposal: kind === "change" ? { kind, agentId: "renewal", leadDays: 60 } : { kind, agentId: "renewal" } });
    expect(next).toBe(s);
  });
  it("full management access can pause the shared maintenance agent", () => {
    const s = agentsReducer(agentsReducer(initialAgentsState(), { type: "propose", proposal: { kind: "pause", agentId: "maintenance" } }), { type: "confirm" });
    expect(s.agents.find((a) => a.id === "maintenance")?.status).toBe("Paused");
  });
  it("an overlap request grants no access and creates no duplicate agent", () => {
    const s = agentsReducer(agentsReducer(initialAgentsState(), { type: "propose", proposal: { kind: "access", requested: false } }), { type: "confirm" });
    expect(s.agents).toHaveLength(6);
    expect(s.proposal).toEqual({ kind: "access", requested: true });
  });
  it("keeps the electrical quotation at £180 and linked to its originating responsibility", () => {
    expect(AGENT_JOBS.find((j) => j.id === "quotation")).toMatchObject({ amount: 180, agentId: "compliance", category: "Needs you" });
  });
  it("has no future activity before the first December review", () => {
    const a = initialAgentsState().agents.find((a) => a.id === "compliance");
    expect(a?.created).toBe("24 November 2026");
    expect(a?.next).toBe("1 December at 09:00");
    expect(a?.last).toBe("Not yet run");
    expect(a?.activity.every((e) => e.at.startsWith("24 November"))).toBe(true);
  });
});