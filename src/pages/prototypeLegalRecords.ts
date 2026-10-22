import { PLACE, unitName, unitsMentioned, type PlaceContext } from "./prototypeRecordsPlace";

// Illustrative records of matters to consider. They are never legal findings:
// applicability and responsible party stay unresolved until the user supplies them.

export type ResponsibilityScope = { kind: "group"; area: string } | { kind: "units"; units: number[] };

export type Responsibility = {
  id: string;
  name: string;
  scope: ResponsibilityScope;
  applicability: "Applicability to establish" | "Applicability not established";
  party: string | null;
  notes?: string;
  source: "Illustrative example" | "Supplied by you" | "Supported by a confirmed Paper";
};

export type LegalState = { records: Responsibility[]; lastTouched: string | null };

export const INITIAL_LEGAL: LegalState = {
  lastTouched: null,
  records: [
    { id: "fire", name: "Shared fire safety", scope: { kind: "group", area: "Common areas" }, applicability: "Applicability to establish", party: null, source: "Illustrative example" },
    { id: "legionella", name: "Legionella risk management", scope: { kind: "group", area: "Shared water system" }, applicability: "Applicability to establish", party: null, source: "Illustrative example" },
    { id: "gas", name: "Gas safety", scope: { kind: "units", units: [2] }, applicability: "Applicability not established", party: null, notes: "Recorded as a question to consider, not an obligation.", source: "Illustrative example" },
  ],
};

export function groupRecords(s: LegalState) {
  return s.records.filter(r => r.scope.kind === "group");
}
export function unitScopedRecords(s: LegalState) {
  return s.records.filter(r => r.scope.kind === "units");
}
/** Recorded for this Unit alone. */
export function recordedForUnit(s: LegalState, unit: number) {
  return s.records.filter(r => r.scope.kind === "units" && r.scope.units.length === 1 && r.scope.units[0] === unit);
}
/** One record referencing this Unit and others. */
export function sharedWithUnit(s: LegalState, unit: number) {
  return s.records.filter(r => r.scope.kind === "units" && r.scope.units.length > 1 && r.scope.units.includes(unit));
}

export function scopeLabel(scope: ResponsibilityScope): string {
  if (scope.kind === "group") return scope.area;
  return scope.units.length === PLACE.units.length ? "Both Units" : scope.units.map(unitName).join(", ");
}

export type LegalAction =
  | { kind: "add"; record: Responsibility }
  | { kind: "rescope"; id: string; units: number[] };

export function applyLegal(s: LegalState, a: LegalAction): LegalState {
  if (a.kind === "add") {
    if (s.records.some(r => r.id === a.record.id)) return { ...s, lastTouched: a.record.id };
    return { records: [...s.records, a.record], lastTouched: a.record.id };
  }
  return { records: s.records.map(r => (r.id === a.id ? { ...r, scope: { kind: "units", units: a.units } } : r)), lastTouched: a.id };
}

export type LegalReply = { text: string; action?: LegalAction; confirm?: string[] };

function slug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function titleCase(s: string) {
  const t = s.trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/** Understands the demonstration instructions in the context of the current place. */
export function interpretLegal(s: LegalState, text: string, place: PlaceContext): LegalReply {
  const t = text.toLowerCase();
  const units = unitsMentioned(t);

  // Changing the scope of an existing record — never creates a replacement.
  if (/\bonly (concerns|applies|affects)|\bjust (concerns|applies|affects)|\bactually\b/.test(t) && units.length === 1) {
    const target = s.records.find(r => r.id === s.lastTouched && r.scope.kind === "units") ?? [...unitScopedRecords(s)].reverse().find(r => r.scope.kind === "units" && r.scope.units.length > 1);
    if (!target) return { text: "I can't tell which responsibility you mean. Could you name it?" };
    const other = target.scope.kind === "units" ? target.scope.units.filter(u => u !== units[0]) : [];
    return {
      text: `I'll change ${target.name.toLowerCase()} so it concerns ${unitName(units[0])} only.${other.length ? ` It will no longer appear against ${other.map(unitName).join(" or ")}.` : ""} The record itself stays the same.`,
      action: { kind: "rescope", id: target.id, units },
      confirm: ["Yes, change it", "Leave it as it is"],
    };
  }

  if (/\broof\b/.test(t)) {
    return {
      text: "I'll record roof responsibility against The Paragon Centre, with the responsible party still to be established.",
      action: { kind: "add", record: { id: "roof", name: "Shared roof", scope: { kind: "group", area: "Shared roof" }, applicability: "Applicability to establish", party: null, source: "Supplied by you" } },
      confirm: ["Yes, record it", "Not now"],
    };
  }

  const named = t.match(/record (?:an?|the)?\s*([a-z ]+?) (?:safety )?responsibility/);
  if (named || /\belectrical\b/.test(t)) {
    const base = /\belectrical\b/.test(t) ? "Electrical safety" : titleCase(named![1]);
    const scopeUnits = units.length ? units : place !== null ? [place] : [];
    const record: Responsibility = scopeUnits.length
      ? { id: slug(base), name: base, scope: { kind: "units", units: scopeUnits }, applicability: "Applicability to establish", party: null, source: "Supplied by you" }
      : { id: slug(base), name: base, scope: { kind: "group", area: "The Unit Group" }, applicability: "Applicability to establish", party: null, source: "Supplied by you" };
    const where = scopeUnits.length === PLACE.units.length ? "both Units" : scopeUnits.length ? scopeUnits.map(unitName).join(" and ") : "The Paragon Centre";
    return {
      text: `Shall I record this against ${where}, with applicability and the responsible party still to be established?${scopeUnits.length > 1 ? " It will be one record that both Units refer to." : ""}`,
      action: { kind: "add", record },
      confirm: ["Yes, record it", "Not now"],
    };
  }

  return { text: "I can record a responsibility against The Paragon Centre or either Unit, and change which places it concerns. I won't decide whether it legally applies — that stays open until you tell me." };
}
