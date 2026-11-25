/** Independent illustrative responsibilities. No scheduler, email or real permissions. */
export const DEMO_TIME = "24 November 2026 · 12:00";
export type AgentKind = "compliance" | "break" | "rent" | "report" | "renewal" | "maintenance";
export type AgentAccess = "Personal" | "View and instruct" | "Full management";
export type AgentActivity = { id: string; at: string; title: string; detail?: string };
export type Agent = {
  id: string; kind: AgentKind; name: string; description: string;
  creator: string; owner: string; shared: boolean; access: AgentAccess;
  scope: string; frequency: string; next: string; status: "Active" | "Paused";
  cost: number; created: string; last: string; leadDays: number; followUpDays: number;
  periodMonths: number; communication: string; recipients: string; rights: string;
  activity: AgentActivity[];
};
export type ProposedResponsibility = Pick<Agent, "kind" | "name" | "scope" | "frequency" | "next" | "cost" | "periodMonths" | "communication" | "recipients" | "rights" | "shared">;
export type AgentProposal =
  | { kind: "create"; draft: ProposedResponsibility }
  | { kind: "change"; agentId: string; leadDays: number }
  | { kind: "pause" | "resume"; agentId: string }
  | { kind: "access"; requested: boolean };
export type AgentsState = { agents: Agent[]; proposal: AgentProposal | null; serial: number };

const activity = (title: string, detail?: string): AgentActivity => ({ id: "created", at: "24 November · 09:00", title, detail });
const base = {
  creator: "You", owner: "You", shared: false, access: "Personal" as AgentAccess,
  status: "Active" as const, created: "24 November 2026", last: "Not yet run",
  leadDays: 30, followUpDays: 7, periodMonths: 6, communication: "Email summary",
  recipients: "You", rights: "Landlord and tenant", activity: [activity("Responsibility commissioned", "Confirmed by you. Scheduled reviews have not started yet.")],
};
export const SAMPLE_AGENTS: Agent[] = [
  { ...base, id: "compliance", kind: "compliance", name: "Compliance Management", description: "Looking after compliance across your residential properties.", scope: "120 residential Units", frequency: "Monthly", next: "1 December at 09:00", cost: 75 },
  { ...base, id: "break", kind: "break", name: "Break Monitoring", description: "Keeping track of landlord and tenant break notice deadlines.", scope: "48 commercial Units", frequency: "Every Monday", next: "30 November at 09:00", cost: 25 },
  { ...base, id: "rent", kind: "rent", name: "Rent Review Monitoring", description: "Keeping track of upcoming contractual rent reviews.", scope: "48 commercial Units", frequency: "First day of each month", next: "1 December at 09:00", cost: 25 },
  { ...base, id: "report", kind: "report", name: "Portfolio Reporting", description: "Preparing and distributing your monthly portfolio report.", scope: "Entire portfolio", frequency: "Last day of each month", next: "30 November at 09:00", status: "Paused", cost: 35, activity: [activity("Responsibility commissioned"), { id: "paused", at: "24 November · 10:00", title: "Paused by you", detail: "New scheduled reviews are paused. Outstanding work and the subscription remain in place." }] },
  { ...base, id: "renewal", kind: "renewal", name: "Tenancy Renewal Management", description: "Keeping upcoming residential renewals in hand.", creator: "Sarah Jones", owner: "Property Management Team", shared: true, access: "View and instruct", scope: "85 residential Units", frequency: "Weekly", next: "30 November at 09:00", cost: 75, activity: [activity("Responsibility commissioned by Sarah Jones")] },
  { ...base, id: "maintenance", kind: "maintenance", name: "Maintenance Coordination", description: "Coordinating repairs and keeping the team informed.", creator: "Alex Williams", owner: "Property Management Team", shared: true, access: "Full management", scope: "48 Units", frequency: "When required", next: "When required", cost: 100, activity: [activity("Responsibility commissioned by Alex Williams")] },
];
export const initialAgentsState = (empty = false): AgentsState => ({ agents: empty ? [] : structuredClone(SAMPLE_AGENTS), proposal: null, serial: 0 });
export const canManage = (agent: Agent) => !agent.shared || agent.access === "Full management";
export const pounds = (value: number) => `£${value.toFixed(2)}`;
export function agentOverview(agent: Agent): string {
  if (agent.kind === "compliance") return `I monitor compliance across your residential properties, contact preferred contractors ${agent.leadDays} days before inspections are due, notify occupants and follow up on unanswered communications after ${agent.followUpDays} days.`;
  if (agent.kind === "break") return `I review ${agent.rights.toLowerCase()} break notice deadlines within the next ${agent.periodMonths} months across ${agent.scope.toLowerCase()}, and prepare an ${agent.communication.toLowerCase()} for ${agent.recipients.toLowerCase()}.`;
  if (agent.kind === "rent") return "I review upcoming contractual rent reviews and prepare a summary of the dates and supporting documents for you.";
  if (agent.kind === "report") return "I prepare your portfolio report, bringing together the recorded occupancy, dates, compliance and outstanding work, and distribute the confirmed report to its recipients.";
  if (agent.kind === "renewal") return "I review approaching residential renewals and prepare the relevant papers and communications for the Property Management Team.";
  return "I coordinate maintenance requests, obtain preferred-contractor responses and prepare the arrangements for the Property Management Team. Expenditure and instructions for remedial works remain subject to approval.";
}
export function draftResponsibility(kind: AgentKind = "break"): ProposedResponsibility {
  if (kind === "report") return { kind, name: "Monthly Portfolio Report", scope: "Entire portfolio", frequency: "Last day of each month at 09:00", next: "30 November at 09:00", cost: 35, periodMonths: 6, communication: "Email summary", recipients: "You", rights: "Landlord and tenant", shared: false };
  if (kind === "compliance") return { kind, name: "Compliance Review", scope: "All authorised residential Units", frequency: "Monthly", next: "1 December at 09:00", cost: 75, periodMonths: 6, communication: "Email summary", recipients: "You", rights: "Landlord and tenant", shared: false };
  return { kind: "break", name: "Weekly Break Report", scope: "All authorised commercial Units", frequency: "Every Monday at 09:00", next: "30 November at 09:00", cost: 25, periodMonths: 6, communication: "Email summary", recipients: "You", rights: "Landlord and tenant", shared: false };
}
export type AgentAction =
  | { type: "propose"; proposal: AgentProposal }
  | { type: "discard" }
  | { type: "confirm" }
  | { type: "reset"; empty?: boolean };
export function agentsReducer(state: AgentsState, action: AgentAction): AgentsState {
  if (action.type === "reset") return initialAgentsState(action.empty);
  if (action.type === "discard") return { ...state, proposal: null };
  if (action.type === "propose") {
    const p = action.proposal;
    if (p.kind !== "create" && p.kind !== "access") {
      const a = state.agents.find((a) => a.id === p.agentId);
      if (!a || !canManage(a) || (p.kind === "change" && (!Number.isInteger(p.leadDays) || p.leadDays < 1 || p.leadDays > 365))) return state;
    }
    return { ...state, proposal: p };
  }
  const p = state.proposal;
  if (!p) return state;
  const serial = state.serial + 1;
  const event = (title: string, detail: string): AgentActivity => ({ id: `event-${serial}`, at: `24 November · 12:${String(serial).padStart(2, "0")}`, title, detail });
  if (p.kind === "access") return { ...state, proposal: { kind: "access", requested: true } };
  if (p.kind === "create") {
    if (state.agents.some((a) => a.name === p.draft.name)) return { ...state, proposal: null };
    const a: Agent = { ...base, ...p.draft, id: `commissioned-${serial}`, creator: "You", owner: p.draft.shared ? "Property Management Team" : "You", access: p.draft.shared ? "Full management" : "Personal", status: "Active", description: p.draft.kind === "break" ? "Your weekly summary of approaching break notice deadlines." : p.draft.kind === "report" ? "Your monthly portfolio report." : "Looking after your ongoing compliance reviews.", activity: [event("Responsibility commissioned", `Confirmed by you. ${p.draft.frequency}; ${p.draft.scope}. ${pounds(p.draft.cost)} monthly subscription. No email has been sent.`)] };
    return { agents: [...state.agents, a], proposal: null, serial };
  }
  const a = state.agents.find((a) => a.id === p.agentId);
  if (!a || !canManage(a)) return { ...state, proposal: null };
  const updated: Agent = p.kind === "change" ? {
    ...a, leadDays: p.leadDays,
    description: `Looking after compliance, with contractor contact ${p.leadDays} days before expiry.`,
    activity: [...a.activity, event("Instruction changed", `Contractor contact changed from ${a.leadDays} to ${p.leadDays} days before expiry. Everything else, including the subscription, is unchanged.`)],
  } : {
    ...a, status: p.kind === "pause" ? "Paused" : "Active",
    activity: [...a.activity, event(p.kind === "pause" ? "Paused by you" : "Resumed by you", p.kind === "pause" ? "New scheduled reviews stopped. Outstanding work remains visible; the subscription is unchanged." : `Scheduled reviews restored. Next review: ${a.next}. No review has run or communication been sent by this action.`)],
  };
  return { ...state, agents: state.agents.map((item) => item.id === a.id ? updated : item), proposal: null, serial };
}

export type WorkflowNode = { id: string; label: string; note?: string; decision?: { yes: string; no: string }; parallel?: string[]; authority?: boolean };
export function agentWorkflow(a: Agent): WorkflowNode[] {
  if (a.kind === "compliance") return [
    { id: "start", label: "Monthly review begins" },
    { id: "review", label: "Review compliance requirements and existing certificates" },
    { id: "due", label: `Are any inspections due within ${a.leadDays} days?`, decision: { no: "Continue monitoring until the next review", yes: "Establish responsible parties, occupants and preferred contractors" } },
    { id: "contact", label: "Prepare both sides of the appointment", parallel: ["Contact preferred contractor", "Notify occupant"] },
    { id: "responses", label: "Monitor responses" },
    { id: "follow-up", label: `Has a response been received within ${a.followUpDays} days?`, decision: { no: "Follow up, then continue monitoring responses", yes: "Coordinate inspection" } },
    { id: "approval", label: "Is expenditure approval required?", decision: { yes: "Request your approval and wait", no: "Continue within the agreed authority" }, authority: true },
    { id: "arrange", label: "Proceed with inspection arrangements", note: "Only after any required approval has been received" },
    { id: "certificate", label: "Receive replacement certificate" },
    { id: "read", label: "Read certificate and update compliance intelligence" },
    { id: "report", label: "Report completed and outstanding work" },
  ];
  if (a.kind === "break") return [
    { id: "start", label: `${a.frequency} — review begins` },
    { id: "scope", label: `Review ${a.scope.toLowerCase()}` },
    { id: "rights", label: `Identify ${a.rights.toLowerCase()} break rights in the recorded papers` },
    { id: "period", label: `Are notice deadlines due within the next ${a.periodMonths} months?`, decision: { yes: "Prepare a summary with dates and source documents", no: "Prepare a summary confirming no recorded deadlines in this period" } },
    { id: "send", label: `${a.communication} to ${a.recipients.toLowerCase()}`, note: "No break notice is served and no break right is exercised" },
    { id: "complete", label: "Record the review and continue monitoring" },
  ];
  const middle: Record<Exclude<AgentKind, "compliance" | "break">, string[]> = {
    rent: ["Read recorded contractual rent review dates", "Identify approaching reviews and gather supporting documents", "Prepare a summary for you"],
    report: ["Gather recorded portfolio information", "Prepare the monthly report", "Check the agreed recipients", "Distribute the report within the confirmed authority"],
    renewal: ["Read approaching renewal dates and occupancy papers", "Prepare renewal options and communications", "Request approval before agreeing terms"],
    maintenance: ["Read the maintenance request and establish responsibility", "Contact preferred contractors and coordinate access", "Obtain quotations", "Request approval before committing expenditure or instructing works"],
  };
  return [{ id: "start", label: `${a.frequency} — responsibility begins` }, ...middle[a.kind].map((label, i) => ({ id: `step-${i}`, label })), { id: "complete", label: "Report completed and outstanding work" }];
}
export const AGENT_SCOPE_GROUPS = [
  { name: "Russell Square House", units: ["Flat 1", "Flat 2", "Flat 3", "Flat 4"], total: 40 },
  { name: "Stanley House", units: ["Flat 1", "Flat 2", "Flat 3", "Flat 4"], total: 32 },
  { name: "Paragon Court", units: ["Flat 1", "Flat 2", "Flat 3", "Flat 4"], total: 48 },
];
export type AgentJob = { id: string; agentId: string; category: "Needs you" | "What I’m looking after" | "What I’ve accomplished"; title: string; detail: string; amount?: number };
export const AGENT_JOBS: AgentJob[] = [
  { id: "quotation", agentId: "compliance", category: "Needs you", title: "Approve an electrical inspection quotation of £180", amount: 180, detail: "Stanley House · Flat 3. An illustrative quotation from the preferred contractor is ready for your decision. Approval covers this £180 inspection only; it does not instruct remedial works." },
  { id: "gas", agentId: "compliance", category: "What I’m looking after", title: "Arranging gas safety inspections across six Units", detail: "Six inspections identified during the initial handover. Proposed appointments remain outstanding; no inspection is recorded as completed." },
  { id: "responses", agentId: "compliance", category: "What I’m looking after", title: "Awaiting contractor responses", detail: "Four responses outstanding. Follow-up will be due seven days after the recorded initial communications." },
  { id: "access", agentId: "compliance", category: "What I’m looking after", title: "Coordinating access with occupants", detail: "Three occupants have been notified in the illustrative handover record. Their access arrangements still need confirmation." },
  { id: "review", agentId: "compliance", category: "What I’ve accomplished", title: "Completed the monthly compliance review", detail: "23 November · 09:00. Historical handover from the preceding arrangement, before this responsibility was commissioned. The new agent’s first scheduled review is 1 December." },
  { id: "certificates", agentId: "compliance", category: "What I’ve accomplished", title: "Received four replacement certificates", detail: "23 November · 11:00. Four certificates received in the preceding arrangement and included in the handover. No new certificates have been received by this prototype." },
];