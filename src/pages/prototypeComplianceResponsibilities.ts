// Prototype Compliance: pure, illustrative compliance controls data and conversation interpreter.
// Local demonstration state only; never shares state with Contacts, Documents or Unit.

export type GroupId = "stanley" | "nugent" | "burlington" | "mews";
export const GROUPS: { id: GroupId; name: string; units: string[] }[] = [
  { id: "stanley", name: "Stanley House", units: ["Flats 1–8"] },
  { id: "nugent", name: "5 Nugent Terrace", units: ["Shop", "Flat 1", "Flat 2"] },
  { id: "burlington", name: "Burlington Gardens", units: ["Ground Floor", "Upper Floors"] },
  { id: "mews", name: "Stanley Mews", units: ["No. 1", "No. 2"] },
];
export const groupName = (g: GroupId) => GROUPS.find((x) => x.id === g)!.name;

export type Category = "health" | "licences" | "accounting" | "notices";
export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "health", label: "Health & Safety" },
  { id: "licences", label: "Licences" },
  { id: "accounting", label: "Accounting" },
  { id: "notices", label: "Notices" },
];

/** recurring: fixed interval; expiry: renew by a real expiry date; risk: interval set by assessment; event: arises when something happens. */
export type Timing = "recurring" | "expiry" | "risk" | "event";
export const TIMING_LABEL: Record<Timing, string> = { recurring: "Recurring", expiry: "Expiry or renewal", risk: "Risk-based", event: "Event-triggered" };

export type Position = "attention" | "coming" | "current" | "establish";
export const POSITION_LABEL: Record<Position, string> = { attention: "Needs attention", coming: "Coming up", current: "Recorded and current", establish: "Still to establish" };

export type Responsibility = {
  id: string;
  name: string;
  category: Category;
  timing: Timing;
  requirement: string;
  group: GroupId | "portfolio";
  appliesTo: string;
  frequency: string;
  last: string | null; // ISO date
  next: string | null; // ISO date; never invented for event-triggered or unestablished intervals
  responsible: string | null;
  evidence: string | null;
  source: string;
  note?: string; // what remains uncertain
  legalFrequency?: string; // the usual legal or standard interval; frequency is the business's own
  establish?: boolean; // applicability or interval not yet established
};

/** Fixed "today" so the demonstration reads the same each time. */
export const TODAY = "2026-10-22";
const DAY = 86_400_000;
export const daysUntil = (iso: string) => Math.round((Date.parse(iso) - Date.parse(TODAY)) / DAY);
export const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export function positionOf(r: Responsibility): Position {
  if (r.establish) return "establish";
  if (r.timing === "event") return r.note ? "attention" : "current";
  if (!r.next) return "establish";
  const d = daysUntil(r.next);
  if (d < 0 || !r.evidence) return "attention";
  if (d <= 90) return "coming";
  return "current";
}

const BASE: Responsibility[] = [
  { id: "gas-sh", name: "Gas Safety", category: "health", timing: "recurring", requirement: "Annual gas safety inspection where gas appliances are provided.", group: "stanley", appliesTo: "Flats 1–8", frequency: "Every 12 months", last: "2026-03-15", next: "2027-03-15", responsible: "Landlord", evidence: "Gas Safety Record dated 15 March 2026", source: "Legislation" },
  { id: "gas-nt", name: "Gas Safety", category: "health", timing: "recurring", requirement: "Annual gas safety inspection where gas appliances are provided.", group: "nugent", appliesTo: "Flat 1, Flat 2", frequency: "Every 12 months", last: "2025-11-30", next: "2026-11-30", responsible: "Landlord", evidence: "Gas Safety Record dated 30 November 2025", source: "Legislation" },
  { id: "eicr-nt", name: "Electrical Safety — EICR", category: "health", timing: "recurring", requirement: "Electrical installation inspected and tested.", group: "nugent", appliesTo: "Whole building", frequency: "Normally within five years, or sooner if the report requires", last: "2021-09-10", next: "2026-09-10", responsible: "Landlord", evidence: "EICR dated 10 September 2021", source: "Legislation", note: "The recorded inspection date has passed and I have no newer report." },
  { id: "eicr-sh", name: "Electrical Safety — EICR", category: "health", timing: "recurring", requirement: "Electrical installation inspected and tested.", group: "stanley", appliesTo: "Flats 1–8", frequency: "Normally within five years, or sooner if the report requires", last: "2023-06-02", next: "2028-06-02", responsible: "Landlord", evidence: "EICR dated 2 June 2023", source: "Legislation" },
  { id: "leg-bg", name: "Legionella risk assessment", category: "health", timing: "risk", requirement: "Assess and control the risk from water systems.", group: "burlington", appliesTo: "Whole building", frequency: "Review according to the assessment and risks", last: "2024-05-20", next: null, responsible: "Landlord", evidence: "Assessment dated 20 May 2024", source: "Legislation", note: "The assessment doesn't state a review interval.", establish: true },
  { id: "fra-sh", name: "Fire risk assessment", category: "health", timing: "risk", requirement: "Assess fire risk in the common parts and keep it under review.", group: "stanley", appliesTo: "Common parts", frequency: "Review set by the assessment — currently 12 months", last: "2025-12-01", next: "2026-12-01", responsible: "Landlord", evidence: "Fire risk assessment dated 1 December 2025", source: "Legislation" },
  { id: "alarm-sh", name: "Fire alarm maintenance", category: "health", timing: "recurring", requirement: "Inspection and servicing of the fire alarm system.", group: "stanley", appliesTo: "Common parts", frequency: "Every 6 months", last: "2026-05-14", next: "2026-11-14", responsible: "Landlord", evidence: "Service report dated 14 May 2026", source: "Fire risk assessment" },
  { id: "eml-bg", name: "Emergency lighting", category: "health", timing: "recurring", requirement: "Annual full-duration test of emergency lighting.", group: "burlington", appliesTo: "Common parts", frequency: "Every 12 months", last: "2026-02-08", next: "2027-02-08", responsible: "Managing agent", evidence: "Test certificate dated 8 February 2026", source: "Contract — management agreement" },
  { id: "smoke-nt", name: "Smoke and carbon monoxide alarms", category: "health", timing: "event", requirement: "Alarms checked as working at the start of each new tenancy.", group: "nugent", appliesTo: "Flat 1, Flat 2", frequency: "At the start of each tenancy", last: "2025-08-01", next: null, responsible: "Landlord", evidence: "Check-in record, Flat 2, 1 August 2025", source: "Legislation" },
  { id: "epc-nt", name: "Energy Performance Certificate", category: "health", timing: "expiry", requirement: "A valid EPC when letting or selling.", group: "nugent", appliesTo: "Shop", frequency: "Valid for 10 years", last: "2016-12-12", next: "2026-12-12", responsible: "Landlord", evidence: "EPC dated 12 December 2016", source: "Legislation" },
  { id: "asb-bg", name: "Asbestos management", category: "health", timing: "risk", requirement: "Manage asbestos in non-domestic parts, where present.", group: "burlington", appliesTo: "Whole building", frequency: "Not yet established", last: null, next: null, responsible: null, evidence: null, source: "Legislation, where applicable", note: "I haven't established whether this applies — I have no survey on record.", establish: true },
  { id: "lift-bg", name: "Lift inspection", category: "health", timing: "recurring", requirement: "Thorough examination of the passenger lift.", group: "burlington", appliesTo: "Passenger lift", frequency: "Every 6 months", last: "2026-04-03", next: "2026-10-03", responsible: "Managing agent", evidence: "Report dated 3 April 2026", source: "Legislation", note: "The October examination was due and I have no report yet." },
  { id: "hmo-sh", name: "HMO licence", category: "licences", timing: "expiry", requirement: "Licence held for the house in multiple occupation.", group: "stanley", appliesTo: "Flats 1–8", frequency: "Renew by the expiry date", last: "2022-01-17", next: "2027-01-16", responsible: "Landlord", evidence: "Licence issued 17 January 2022", source: "Licence" },
  { id: "sel-nt", name: "Selective licence", category: "licences", timing: "expiry", requirement: "Selective licence under the local authority scheme.", group: "nugent", appliesTo: "Flat 1, Flat 2", frequency: "Renew by the expiry date", last: null, next: null, responsible: "Landlord", evidence: null, source: "Local authority scheme", note: "I don't know whether the local scheme covers this street.", establish: true },
  { id: "pav-bg", name: "Pavement licence", category: "licences", timing: "expiry", requirement: "Permission for tables outside the ground floor café.", group: "burlington", appliesTo: "Ground Floor", frequency: "Renew by the expiry date", last: "2026-04-01", next: "2027-03-31", responsible: "Tenant", evidence: "Licence copy supplied by the tenant", source: "Local authority permission" },
  { id: "acc", name: "Annual accounts", category: "accounting", timing: "recurring", requirement: "Company accounts prepared and filed.", group: "portfolio", appliesTo: "Portfolio company", frequency: "Every 12 months", last: "2025-12-18", next: "2026-12-31", responsible: "Clarke Accountancy", evidence: "Filed accounts, year to March 2025", source: "Legislation" },
  { id: "vat", name: "VAT return", category: "accounting", timing: "recurring", requirement: "Quarterly VAT return for opted commercial Units.", group: "portfolio", appliesTo: "Opted commercial Units", frequency: "Every quarter", last: "2026-08-07", next: "2026-11-07", responsible: "Clarke Accountancy", evidence: "Return for the June quarter", source: "Legislation" },
  { id: "sc-sh", name: "Service charge accounts", category: "accounting", timing: "recurring", requirement: "Year-end service charge statement to leaseholders.", group: "stanley", appliesTo: "Flats 1–8", frequency: "Within six months of year end", last: "2026-03-30", next: "2027-03-30", responsible: "Managing agent", evidence: "Statement issued 30 March 2026", source: "Leases" },
  { id: "rec", name: "Record keeping", category: "accounting", timing: "recurring", requirement: "Keep financial records for the required period.", group: "portfolio", appliesTo: "Portfolio", frequency: "Ongoing — at least six years", last: null, next: null, responsible: "Clarke Accountancy", evidence: "Engagement letter", source: "Legislation", note: undefined },
  { id: "s13-sh", name: "Section 13 rent increase notice", category: "notices", timing: "event", requirement: "Serve notice before a proposed rent increase under a periodic tenancy.", group: "stanley", appliesTo: "Any periodic tenancy", frequency: "Before each proposed increase", last: null, next: null, responsible: "Landlord", evidence: null, source: "Legislation" },
  { id: "s20-bg", name: "Section 20 consultation", category: "notices", timing: "event", requirement: "Consult leaseholders before qualifying works.", group: "burlington", appliesTo: "Upper Floors", frequency: "Before qualifying works", last: null, next: null, responsible: "Landlord", evidence: null, source: "Legislation", note: "The proposed roof works may need consultation before they're instructed." },
  { id: "s48-sh", name: "Section 48 landlord address notice", category: "notices", timing: "event", requirement: "Give tenants an address in England and Wales for notices.", group: "stanley", appliesTo: "Flats 1–8", frequency: "When a tenancy begins or the address changes", last: "2024-02-01", next: null, responsible: "Landlord", evidence: "Notices served 1 February 2024", source: "Legislation" },
];

export const INITIAL: Responsibility[] = BASE.map((r) => ({ ...r, legalFrequency: r.frequency }));
export const FREQUENCY_PRESETS = ["Every 3 months", "Every 6 months", "Every 12 months", "Every 2 years", "Every 3 years", "Every 5 years", "Every 10 years", "When an event occurs"];
export const isCustom = (r: Responsibility) => !!r.legalFrequency && r.frequency !== r.legalFrequency;

export const where = (r: Responsibility) => (r.group === "portfolio" ? "Across the portfolio" : groupName(r.group));

export type Filter = { group: GroupId | null; position: Position | null };
export type Pending = { kind: "s13"; unit: string } | { kind: "evidence" } | null;
export type Out = { reply: string; choices?: string[]; items?: Responsibility[]; filter?: Partial<Filter>; highlight?: string[]; pending: Pending; open?: string | null };

const findGroup = (s: string): GroupId | null => {
  if (/mews/.test(s)) return "mews";
  if (/stanley/.test(s)) return "stanley";
  if (/nugent/.test(s)) return "nugent";
  if (/burlington/.test(s)) return "burlington";
  return null;
};

export const counts = (rs: Responsibility[]) => {
  const c: Record<Position, number> = { attention: 0, coming: 0, current: 0, establish: 0 };
  rs.forEach((r) => c[positionOf(r)]++);
  return c;
};

/** Pure conversation interpreter. Adding a record only happens on explicit confirmation. */
export function interpret(rs: Responsibility[], pending: Pending, raw: string): Out {
  const s = raw.toLowerCase().trim();
  if (pending?.kind === "s13") {
    if (/^(yes|record|add|please)/.test(s)) {
      const item: Responsibility = { id: `s13-${Date.now()}`, name: `Section 13 notice — ${pending.unit}`, category: "notices", timing: "event", requirement: "Serve notice before the proposed rent increase takes effect.", group: "stanley", appliesTo: pending.unit, frequency: "Once, before the proposed increase", last: null, next: null, responsible: "Landlord", evidence: null, source: "Legislation", note: "Proposed increase — no date set yet. I'll work back from the date you choose." };
      return { reply: "Done. I've recorded it under Notices. I haven't set a date — that follows from when you'd like the increase to take effect.", items: [...rs, item], highlight: [item.id], pending: null, filter: { group: "stanley", position: null } };
    }
    return { reply: "Very well. I've recorded nothing.", pending: null };
  }
  if (pending?.kind === "evidence") {
    if (/^(yes|update|please)/.test(s)) {
      const items = rs.map((r) => (r.id === "eicr-nt" ? { ...r, last: "2026-10-15", next: "2031-10-15", evidence: "EICR dated 15 October 2026 (Satisfactory)", note: undefined } : r));
      return { reply: "Done. 5 Nugent Terrace's EICR is now recorded as current, next due 15 October 2031. I've kept the 2021 report in its history.", items, highlight: ["eicr-nt"], pending: null, open: "eicr-nt" };
    }
    return { reply: "Very well. I've left the record as it was.", pending: null };
  }
  const g = findGroup(s);
  if (/flat\s*6/.test(s) && /rent|section 13|increase/.test(s)) {
    return { reply: "A rent increase on a periodic tenancy at Flat 6 would need a Section 13 notice served before it takes effect. This arises from the event, not a calendar — so I wouldn't give it an annual date.\n\nShall I record it as something to prepare?", choices: ["Yes, record it", "Not now"], pending: { kind: "s13", unit: "Flat 6, Stanley House" } };
  }
  if (/coming up|next|due soon|this (month|quarter)/.test(s)) {
    const n = rs.filter((r) => positionOf(r) === "coming").length;
    return { reply: `${n} things fall due in the next three months. I've put them in date order.`, filter: { position: "coming", group: null }, pending: null };
  }
  if (/attention|overdue|worry|wrong|problem/.test(s)) {
    const a = rs.filter((r) => positionOf(r) === "attention");
    return { reply: `${a.length} need attention:\n${a.map((r) => `• ${r.name} — ${where(r)}`).join("\n")}`, filter: { position: "attention", group: null }, pending: null };
  }
  if (/asbestos/.test(s)) {
    return { reply: "I haven't established whether asbestos management applies at Burlington Gardens. It's a pre-2000 building with common parts, so it may — but I have no survey on record. If you have a survey or a management plan, attach it and I'll read it. I won't treat it as applicable or not until we know.", filter: { group: "burlington", position: null }, open: "asb-bg", pending: null };
  }
  if (/legionella/.test(s)) {
    return { reply: "The 2024 Legionella assessment for Burlington Gardens doesn't state when it should be reviewed, so I haven't invented a date. The usual approach is to review it when the assessment says, or when the water system or occupation changes. Shall I ask the assessor what interval they intended?", filter: { group: "burlington", position: null }, open: "leg-bg", choices: ["Ask the assessor", "Leave it"], pending: null };
  }
  if (/ask the assessor/.test(s)) return { reply: "I'll prepare a short note for you to send — I won't contact anyone on your behalf.", pending: null };
  if (/eicr|electrical/.test(s) && /attach|found|report|upload/.test(s)) {
    return { reply: "I've read the report. EICR for 5 Nugent Terrace, dated 15 October 2026, classed Satisfactory, recommending the next inspection within five years.\n\nShall I update the record?", choices: ["Yes, update it", "Not now"], pending: { kind: "evidence" }, filter: { group: "nugent", position: null }, open: "eicr-nt" };
  }
  if (/gas/.test(s)) {
    return { reply: "Gas Safety is recorded at Stanley House and 5 Nugent Terrace. Stanley House is current until 15 March 2027; 5 Nugent Terrace falls due on 30 November 2026.", filter: { position: null, group: null }, highlight: rs.filter((r) => r.name === "Gas Safety").map((r) => r.id), pending: null };
  }
  if (g) {
    const mine = rs.filter((r) => r.group === g);
    if (!mine.length) return { reply: `I have nothing recorded for ${groupName(g)} yet. I won't assume what applies from the type of building — tell me how it's used, or attach any certificates, and I'll work it out with you.`, filter: { group: g, position: null }, pending: null };
    const c = counts(mine);
    return { reply: `I'll bring together the requirements that appear relevant to ${groupName(g)} and check what I have recorded.\n\n${mine.length} controls: ${c.attention} need attention, ${c.coming} coming up, ${c.current} current, ${c.establish} still to establish.`, filter: { group: g, position: null }, pending: null };
  }
  if (/all|everything|portfolio|clear|reset/.test(s)) return { reply: "Here is everything across the portfolio.", filter: { group: null, position: null }, pending: null };
  return { reply: "I'm not sure I follow. You could ask about a place, what's coming up, what needs attention, or a particular control such as gas safety.", pending: null };
}

/** The usual label for a category. */
export const categoryLabel = (c: Category) => CATEGORIES.find((x) => x.id === c)!.label;

/** Scopes that cover every unit at a place rather than one named unit. */
const GROUP_WIDE = ["whole building", "common parts", "portfolio", "any periodic tenancy", "all units"];
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Does a recorded control's scope cover this unit? */
function covers(appliesTo: string, unit: string): boolean {
  const a = appliesTo.toLowerCase();
  if (GROUP_WIDE.some((w) => a.includes(w))) return true;
  if (new RegExp(`\\b${escapeRe(unit.toLowerCase())}\\b`).test(a)) return true;
  const range = /flats?\s*(\d+)[–-](\d+)/i.exec(unit);
  const flat = /flat\s*(\d+)/i.exec(appliesTo);
  return !!range && !!flat && +flat[1] >= +range[1] && +flat[1] <= +range[2];
}

/** Simple list of places — each Unit Group, its Units, then the portfolio — with the categories each needs. */
export type PlaceRow = { id: string; label: string; level: "group" | "unit" | "portfolio"; categories: Category[]; items: { category: Category; names: string[] }[] };

export function placeRows(rs: Responsibility[], only: GroupId | null = null): PlaceRow[] {
  const build = (id: string, label: string, level: PlaceRow["level"], pred: (r: Responsibility) => boolean): PlaceRow => {
    const items = CATEGORIES.map((c) => ({
      category: c.id,
      names: [...new Set(rs.filter((r) => r.category === c.id && pred(r)).map((r) => r.name))],
    })).filter((x) => x.names.length);
    return { id, label, level, categories: items.map((x) => x.category), items };
  };
  const rows: PlaceRow[] = [];
  for (const g of GROUPS) {
    if (only && g.id !== only) continue;
    rows.push(build(g.id, g.name, "group", (r) => r.group === g.id));
    for (const u of g.units)
      rows.push(build(`${g.id}-${u}`, u, "unit", (r) => r.group === g.id && covers(r.appliesTo, u)));
  }
  if (!only) rows.push(build("portfolio", "Portfolio", "portfolio", (r) => r.group === "portfolio"));
  return rows;
}

/**
 * Coverage matrix per Unit Group: one row per compliance item (grouped by category),
 * one column for shared parts plus one per Unit. Derived only from the records, so any
 * automated feed that updates records updates this view with no layout change.
 */
export type MatrixRow = { key: string; name: string; category: Category; controlIds: string[]; shared: boolean; units: Record<string, boolean> };
export type PlaceMatrix = { id: string; name: string; columns: string[]; rows: MatrixRow[] };

export function placeMatrix(rs: Responsibility[], only: GroupId | null = null): PlaceMatrix[] {
  const blocks: { id: string; name: string; units: string[] }[] = GROUPS.filter((g) => !only || g.id === only);
  if (!only) blocks.push({ id: "portfolio", name: "Portfolio", units: [] });
  return blocks.map((b) => {
    const mine = rs.filter((r) => r.group === b.id);
    const rows: MatrixRow[] = [];
    for (const c of CATEGORIES) {
      for (const name of [...new Set(mine.filter((r) => r.category === c.id).map((r) => r.name))]) {
        const recs = mine.filter((r) => r.category === c.id && r.name === name);
        const units = Object.fromEntries(b.units.map((u) => [u, recs.some((r) => covers(r.appliesTo, u))]));
        const shared = recs.some((r) => GROUP_WIDE.some((w) => r.appliesTo.toLowerCase().includes(w)) || !b.units.some((u) => covers(r.appliesTo, u)));
        rows.push({ key: `${b.id}:${c.id}:${name}`, name, category: c.id, controlIds: recs.map((r) => r.id), shared, units });
      }
    }
    return { id: b.id, name: b.name, columns: b.units, rows };
  });
}
