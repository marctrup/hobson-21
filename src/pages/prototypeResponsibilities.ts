// Illustrative, local-only model: master Skills (Hobson's), customer Responsibilities, and Jobs stay separate.
export type Skill = { id: string; name: string; description: string; version: string; capabilities: string[] };
export const SKILLS: Skill[] = [
  { id: "compliance", name: "Compliance assessment", description: "Establishes what is required and what evidence exists.", version: "3.2", capabilities: ["Read certificates", "Identify inspections due"] },
  { id: "communication", name: "Communication", description: "Contacts the relevant people and follows up.", version: "2.4", capabilities: ["Email contractors", "Notify occupants"] },
  { id: "inspection", name: "Inspection coordination", description: "Arranges appointments with contractors and occupants.", version: "1.8", capabilities: ["Book inspections"] },
  { id: "procurement", name: "Quotation comparison", description: "Requests and compares contractor quotations.", version: "1.1", capabilities: ["Request quotations", "Compare quotations"] },
  { id: "reporting", name: "Reporting", description: "Prepares clear summaries of completed and outstanding work.", version: "2.0", capabilities: ["Prepare reports"] },
  { id: "termination", name: "Termination assessment", description: "Reads break rights and notice requirements.", version: "2.6", capabilities: ["Identify break rights"] },
  { id: "deadlines", name: "Deadline monitoring", description: "Watches dates and notice windows.", version: "1.9", capabilities: ["Track deadlines"] },
  { id: "rent", name: "Rent review assessment", description: "Reads review mechanisms and dates.", version: "1.4", capabilities: ["Identify reviews"] },
  { id: "occupation", name: "Occupation assessment", description: "Understands occupancy and renewal position.", version: "2.1", capabilities: ["Assess renewals"] },
  { id: "documents", name: "Document preparation", description: "Prepares draft correspondence and papers.", version: "1.6", capabilities: ["Draft documents"] },
  { id: "repairs", name: "Repair responsibility assessment", description: "Establishes who is responsible for a repair.", version: "1.3", capabilities: ["Assess repair liability"] },
  { id: "contractors", name: "Contractor coordination", description: "Coordinates contractors and outstanding work.", version: "1.7", capabilities: ["Coordinate contractors"] },
];

export type Kind = "compliance" | "break" | "rent" | "report" | "renewal" | "maintenance";
export type Status = "Active" | "Paused" | "Stopped";
export type Activity = { id: string; when: string; text: string; detail?: string };
export type Instructions = { frequency: string; leadDays: number; followUpDays: number; notify: string; approval: string; quotations: boolean; periodMonths?: number; rights?: string; recipients?: string };
export type Responsibility = {
  id: string; kind: Kind; name: string; summary: string; description: string;
  creator: string; owner: string; authorised: string[]; access: "Full management" | "View and instruct";
  shared: boolean; establishedOn: string;
  scope: { label: string; groups: { name: string; units: number }[] };
  skills: string[]; instructions: Instructions; next?: string; status: Status; monthly: number;
  allowed: string[]; needsApproval: string[]; activity: Activity[]; procedure?: "Awaiting review";
};

const COMPLIANCE_ACTIVITY: Activity[] = [
  { id: "c0", when: "24 November — 10:15", text: "Took on this responsibility at your request.", detail: "Monthly review across 120 residential Units; approval required before any expenditure." },
  { id: "c1", when: "1 December — 09:00", text: "Completed the monthly compliance review.", detail: "Example of how the first review will appear." },
  { id: "c2", when: "1 December — 09:04", text: "Identified six inspections requiring attention.", detail: "Four gas safety, one electrical (EICR) and one fire risk assessment." },
  { id: "c3", when: "1 December — 09:08", text: "Contacted four preferred contractors." },
  { id: "c4", when: "2 December — 11:30", text: "Received a contractor quotation.", detail: "Electrical inspection at Stanley House, £180." },
  { id: "c5", when: "2 December — 11:32", text: "Requested approval for expenditure of £180." },
  { id: "c6", when: "8 December — 09:00", text: "Followed up on outstanding responses." },
];

const base = (r: Partial<Responsibility> & Pick<Responsibility, "id" | "kind" | "name" | "summary" | "description" | "scope" | "skills" | "monthly">): Responsibility => ({
  creator: "You", owner: "You", authorised: ["You"], access: "Full management", shared: false, establishedOn: "24 November 2026",
  instructions: { frequency: "Monthly", leadDays: 30, followUpDays: 7, notify: "Email", approval: "Before committing expenditure", quotations: false },
  status: "Active", allowed: [], needsApproval: [], activity: [{ id: `${r.id}-0`, when: "24 November — 10:15", text: "Took on this responsibility." }], ...r,
});

export const SAMPLE: Responsibility[] = [
  base({ id: "compliance", kind: "compliance", name: "Compliance Management", monthly: 75,
    summary: "I’m looking after compliance across your residential properties, including arranging inspections and following up with contractors.",
    description: "I monitor compliance across your residential properties, identify inspections requiring attention, contact preferred contractors, notify occupants and follow up on outstanding responses.",
    scope: { label: "120 residential Units", groups: [{ name: "Russell Square House", units: 40 }, { name: "Stanley House", units: 32 }, { name: "Paragon Court", units: 48 }] },
    skills: ["compliance", "communication", "inspection", "reporting"], next: "1 December at 09:00",
    allowed: ["Contact preferred contractors", "Notify occupants", "Coordinate inspection appointments", "Follow up on outstanding responses"],
    needsApproval: ["Committing any expenditure", "Instructing remedial works"], activity: COMPLIANCE_ACTIVITY }),
  base({ id: "break", kind: "break", name: "Break Monitoring", monthly: 25,
    summary: "I’m keeping track of upcoming landlord and tenant break notice deadlines.",
    description: "I review landlord and tenant break rights and tell you which notice deadlines are approaching.",
    scope: { label: "48 commercial Units", groups: [{ name: "Linear Park", units: 18 }, { name: "Temple Row", units: 30 }] },
    skills: ["termination", "deadlines", "reporting"], next: "Monday 30 November at 09:00",
    instructions: { frequency: "Every Monday at 09:00", leadDays: 0, followUpDays: 0, notify: "Email summary", approval: "Never serves notices", quotations: false, periodMonths: 6, rights: "Landlord and tenant", recipients: "You" },
    allowed: ["Read break clauses", "Email you a summary"], needsApproval: ["Serving or responding to any notice"] }),
  base({ id: "rent", kind: "rent", name: "Rent Review Monitoring", monthly: 25,
    summary: "I’m monitoring upcoming rent reviews and will advise you when action is required.",
    description: "I watch rent review dates and mechanisms, and advise you when action is required.",
    scope: { label: "48 commercial Units", groups: [{ name: "Linear Park", units: 18 }, { name: "Temple Row", units: 30 }] },
    skills: ["rent", "deadlines", "reporting"], next: "1 December at 09:00",
    allowed: ["Read review provisions", "Advise you"], needsApproval: ["Any correspondence with occupiers"] }),
  base({ id: "report", kind: "report", name: "Portfolio Reporting", monthly: 35, status: "Paused",
    summary: "I’m preparing and distributing your monthly portfolio report.",
    description: "I prepare and distribute a monthly report on your portfolio.",
    scope: { label: "Entire portfolio", groups: [] }, skills: ["reporting"],
    allowed: ["Prepare the report", "Send it to you"], needsApproval: ["Sending to anyone else"] }),
  base({ id: "renewal", kind: "renewal", name: "Tenancy Renewal Management", monthly: 75, shared: true, creator: "Sarah Jones", owner: "Sarah Jones", authorised: ["Sarah Jones", "You"], access: "View and instruct",
    summary: "I’m coordinating upcoming tenancy renewals and communicating with occupants.",
    description: "I coordinate upcoming tenancy renewals, prepare papers and communicate with occupants.",
    scope: { label: "85 residential Units", groups: [{ name: "Paragon Court", units: 48 }, { name: "Russell Square House", units: 37 }] },
    skills: ["occupation", "communication", "documents"], next: "Thursday 26 November at 09:00",
    instructions: { frequency: "Weekly", leadDays: 90, followUpDays: 7, notify: "Email", approval: "Before issuing renewal terms", quotations: false },
    allowed: ["Communicate with occupants", "Prepare renewal papers"], needsApproval: ["Issuing renewal terms"] }),
  base({ id: "maintenance", kind: "maintenance", name: "Maintenance Coordination", monthly: 100, shared: true, creator: "Alex Williams", owner: "Alex Williams", authorised: ["Alex Williams", "You"],
    summary: "I’m coordinating contractors, occupants and outstanding maintenance work.",
    description: "I coordinate contractors, occupants and outstanding maintenance work.",
    scope: { label: "48 Units", groups: [{ name: "Stanley House", units: 32 }, { name: "Linear Park", units: 16 }] },
    skills: ["repairs", "contractors", "communication"],
    instructions: { frequency: "When required", leadDays: 0, followUpDays: 3, notify: "Email", approval: "Above £250", quotations: false },
    allowed: ["Coordinate contractors", "Update occupants"], needsApproval: ["Expenditure above £250"] }),
];

/** Customer instructions in plain English — generated from the record, never stored separately. */
export function instructionsFor(r: Responsibility): string[] {
  const i = r.instructions;
  if (r.kind === "compliance") return [
    `Review compliance ${i.frequency.toLowerCase()}.`,
    `Contact contractors ${i.leadDays} days before expiry.`,
    `Follow up after ${words(i.followUpDays)} days.`,
    "Notify occupants by email.",
    ...(i.quotations ? ["Obtain three quotations and compare them before asking for approval."] : []),
    "Request approval before committing expenditure.",
  ];
  if (r.kind === "break") return [`Review ${i.frequency.toLowerCase()}.`, `Look ${i.periodMonths} months ahead.`, `Include ${i.rights?.toLowerCase()} break rights.`, `Email a summary to ${i.recipients}.`];
  return [`Review ${i.frequency.toLowerCase()}.`, `Request approval ${i.approval.toLowerCase()}.`];
}

export type Step = { label: string; branch?: { question: string; yes: string; no: string } };
/** The visual workflow is derived from the approved configuration, so changes to instructions redraw it. */
export function workflowFor(r: Responsibility): Step[] {
  const i = r.instructions;
  if (r.kind === "compliance") return [
    { label: `${i.frequency} review` },
    { label: "Review compliance requirements and existing evidence" },
    { label: `Identify inspections due within ${i.leadDays} days`, branch: { question: `Are any inspections due within ${i.leadDays} days?`, yes: "contact the preferred contractor.", no: "continue monitoring." } },
    { label: "Establish responsible parties and preferred contractors" },
    ...(i.quotations ? [{ label: "Request three quotations from approved contractors" }, { label: "Monitor responses and compare quotations" }, { label: "Present a recommendation" }] : []),
    { label: "Contact contractors and notify occupants" },
    { label: "Monitor responses" },
    { label: `Follow up after ${words(i.followUpDays)} days where necessary`, branch: { question: "Has the contractor replied?", yes: "arrange the inspection.", no: `follow up after ${words(i.followUpDays)} days.` } },
    { label: i.quotations ? "Request approval before instructing work" : "Request approval where required" },
    { label: "Coordinate inspections" },
    { label: "Receive and read replacement certificates" },
    { label: "Update compliance intelligence" },
    { label: "Report completed and outstanding work" },
  ];
  if (r.kind === "break") return [
    { label: i.frequency },
    { label: `Review ${i.rights?.toLowerCase()} break rights` },
    { label: `Identify notice deadlines within the next ${i.periodMonths} months`, branch: { question: `Any deadlines within ${i.periodMonths} months?`, yes: "include them in the summary.", no: "continue monitoring." } },
    { label: `Email a summary to ${i.recipients}` },
  ];
  return [{ label: `${i.frequency} review` }, { label: r.description }, { label: `Request approval ${i.approval.toLowerCase()}` }, { label: "Report completed and outstanding work" }];
}

function words(n: number) { return ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"][n] ?? String(n); }

export const draftBreak = (): Responsibility => base({ id: "weekly-break", kind: "break", name: "Weekly Break Monitoring", monthly: 25,
  summary: "I’m keeping track of upcoming break notice deadlines and emailing you a summary every Monday.",
  description: "I monitor landlord and tenant break notice deadlines and email you a weekly summary.",
  scope: { label: "All authorised commercial Units", groups: [{ name: "Linear Park", units: 18 }, { name: "Temple Row", units: 30 }] },
  skills: ["termination", "deadlines", "reporting"], next: "Monday 30 November at 09:00",
  instructions: { frequency: "Every Monday at 09:00", leadDays: 0, followUpDays: 0, notify: "Email summary", approval: "Never serves notices", quotations: false, periodMonths: 6, rights: "Landlord and tenant", recipients: "You" },
  allowed: ["Read break clauses", "Email you a summary"], needsApproval: ["Serving or responding to any notice"],
  activity: [{ id: "wb0", when: "25 November — 09:00", text: "Took on this responsibility at your request." }] });

export type Proposal =
  | { kind: "create"; draft: Responsibility }
  | { kind: "change"; id: string; leadDays: number; followUpDays: number }
  | { kind: "extend"; id: string }
  | { kind: "pause" | "resume" | "stop"; id: string };
export type State = { items: Responsibility[]; proposal: Proposal | null; approved: string[] };
export type Action = { type: "propose"; proposal: Proposal } | { type: "discard" } | { type: "confirm" } | { type: "procedure"; id: string } | { type: "approve"; jobId: string } | { type: "reset"; empty?: boolean };

export const initialState = (empty = false): State => ({ items: empty ? [] : SAMPLE.map((r) => ({ ...r })), proposal: null, approved: [] });
export const canManage = (r: Responsibility) => r.access === "Full management";
const log = (r: Responsibility, text: string, detail?: string): Responsibility => ({ ...r, activity: [{ id: `${r.id}-${r.activity.length}`, when: "25 November — 09:30", text, detail }, ...r.activity] });

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "reset": return initialState(action.empty);
    case "discard": return { ...state, proposal: null };
    case "propose": {
      const p = action.proposal;
      if (p.kind !== "create") { const r = state.items.find((x) => x.id === p.id); if (!r || !canManage(r)) return state; }
      return { ...state, proposal: p };
    }
    case "approve": return state.approved.includes(action.jobId) ? state : { ...state, approved: [...state.approved, action.jobId] };
    case "procedure": return { ...state, items: state.items.map((r) => r.id === action.id ? log({ ...r, procedure: "Awaiting review" }, "Received your contractor procurement procedure.", "Awaiting review — not yet adopted.") : r) };
    case "confirm": {
      const p = state.proposal; if (!p) return state;
      if (p.kind === "create") return state.items.some((r) => r.id === p.draft.id) ? { ...state, proposal: null } : { ...state, proposal: null, items: [...state.items, { ...p.draft, status: "Active" }] };
      const items = state.items.map((r) => {
        if (r.id !== p.id) return r;
        if (p.kind === "change") return log({ ...r, instructions: { ...r.instructions, leadDays: p.leadDays, followUpDays: p.followUpDays } }, "Changed your instructions.", `Contact contractors ${r.instructions.leadDays} → ${p.leadDays} days before expiry; follow up after ${r.instructions.followUpDays} → ${p.followUpDays} days.`);
        if (p.kind === "extend") return log({ ...r, monthly: 95, skills: [...new Set([...r.skills, "procurement"])], instructions: { ...r.instructions, quotations: true }, allowed: [...r.allowed, "Request and compare quotations"] }, "Extended this responsibility to obtain and compare quotations.", "Monthly subscription £75.00 → £95.00 (illustrative).");
        if (p.kind === "pause") return log({ ...r, status: "Paused" }, "Paused at your request.");
        if (p.kind === "resume") return log({ ...r, status: "Active" }, "Resumed at your request.");
        return log({ ...r, status: "Stopped", next: undefined }, "Stopped at your request.");
      });
      return { ...state, items, proposal: null };
    }
  }
}

export type JobStatus = "Needs you" | "Looking after" | "Accomplished";
export type Job = { id: string; responsibilityId: string | null; place: string; description: string; status: JobStatus; approval?: string; outcome?: string };
export const JOBS: Job[] = [
  { id: "j-eicr", responsibilityId: "compliance", place: "Flat 12, Stanley House", description: "Obtain electrical inspection quotation", status: "Needs you", approval: "Approve £180 for the electrical inspection" },
  { id: "j-gas", responsibilityId: "compliance", place: "Flat 4, Russell Square House", description: "Arrange gas safety inspection", status: "Looking after" },
  { id: "j-chase", responsibilityId: "compliance", place: "Paragon Court", description: "Chase contractor response", status: "Looking after" },
  { id: "j-cert", responsibilityId: "compliance", place: "Flat 7, Russell Square House", description: "Read replacement certificate", status: "Accomplished", outcome: "Gas safety certificate read; valid until November 2027." },
  { id: "j-break", responsibilityId: "break", place: "Unit 3, Linear Park", description: "Tenant break notice deadline in four months", status: "Looking after" },
  { id: "j-rent", responsibilityId: "rent", place: "63 Temple Row", description: "Rent review summary sent", status: "Accomplished", outcome: "Advised that the review falls on 24 March 2027." },
  { id: "f-papers", responsibilityId: null, place: "Portfolio", description: "Discovering new property papers", status: "Looking after" },
  { id: "f-units", responsibilityId: null, place: "Portfolio", description: "Establishing proposed Units and Unit Groups", status: "Looking after" },
  { id: "f-reg", responsibilityId: null, place: "Portfolio", description: "Reviewing applicable compliance requirements", status: "Accomplished", outcome: "No regulatory changes affect your Units this month." },
];

export const AVAILABLE = [
  { name: "Break Monitoring", from: "£25" }, { name: "Rent Review Monitoring", from: "£25" }, { name: "Portfolio Reporting", from: "£35" },
  { name: "Compliance Management", from: "£75" }, { name: "Tenancy Renewal Management", from: "£75" }, { name: "Maintenance Coordination", from: "£100" },
  { name: "Bespoke Responsibilities", from: "From £150" },
];

export const SKILLS_ANSWER = "I use my compliance knowledge to establish what is required, my communication capabilities to contact the relevant people and my coordination capabilities to arrange inspections and follow up.";
export const money = (n: number) => `£${n.toFixed(2)}`;
