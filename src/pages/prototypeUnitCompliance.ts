// Simulated legal responsibilities and preferred contacts for the Map workspace.
// All records are illustrative, user-recorded information — never Hobson's legal
// assessment, never inferred from a Unit's classification, and never given
// statutory intervals, due dates, statuses or certificates.

// --- Legal responsibilities -------------------------------------------------

export type RequirementScope =
  | { kind: "group" } // recorded for the Unit Group itself (e.g. shared areas)
  | { kind: "unit"; unit: number } // recorded for one Unit
  | { kind: "units"; units: number[] }; // one record shared by selected Units

export type ComplianceRequirement = {
  id: string;
  recordId: string; // the Unit Group the record belongs to
  name: string;
  frequency?: string; // exactly as recorded; absent means "Frequency not recorded"
  scope: RequirementScope;
  note?: string; // discreet scope note, e.g. "Shared areas only"
  origin: "user-recorded";
};

// --- Contractors and preferences ---------------------------------------------

export type Contractor = {
  id: string;
  name: string;
  service: string;
  contact?: string; // recorded contact information only — never invented
};

export type PreferenceScope =
  | { kind: "group-default" } // applies to the Unit Group and its Units by default
  | { kind: "shared-areas" } // shared areas only — never an individual Unit preference
  | { kind: "units"; units: number[] }; // recorded for specific Units (an exception)

export type ContractorPreference = {
  id: string;
  recordId: string;
  contractorId: string;
  service: string;
  scope: PreferenceScope;
};

// --- Simulated records for The Paragon Centre --------------------------------

export const COMPLIANCE_REQUIREMENTS: ComplianceRequirement[] = [
  { id: "pc-legionella", recordId: "demo-paragon-centre", name: "Legionella", frequency: "Every 12 months", scope: { kind: "units", units: [1, 2] }, note: "Shared water system serving both Units", origin: "user-recorded" },
  { id: "pc-fire-alarm", recordId: "demo-paragon-centre", name: "Fire alarm servicing", frequency: "Quarterly", scope: { kind: "group" }, note: "Shared areas only", origin: "user-recorded" },
  { id: "pc-gas-safety", recordId: "demo-paragon-centre", name: "Gas Safety", frequency: "Every 12 months", scope: { kind: "unit", unit: 1 }, origin: "user-recorded" },
  { id: "pc-eicr", recordId: "demo-paragon-centre", name: "EICR", frequency: "Every 5 years", scope: { kind: "unit", unit: 2 }, origin: "user-recorded" },
];

export const CONTRACTORS: Contractor[] = [
  { id: "abc-plumbing", name: "ABC Plumbing Ltd", service: "Plumbing" },
  { id: "city-electrical", name: "City Electrical Services", service: "Electrical" },
  { id: "skyline-roofing", name: "Skyline Roofing Ltd", service: "Roofing" },
  { id: "gymcare", name: "GymCare Services", service: "Specialist maintenance" },
  { id: "flatflow", name: "FlatFlow Plumbing Ltd", service: "Plumbing" },
];

export const CONTRACTOR_PREFERENCES: ContractorPreference[] = [
  { id: "pref-pc-plumbing", recordId: "demo-paragon-centre", contractorId: "abc-plumbing", service: "Plumbing", scope: { kind: "group-default" } },
  { id: "pref-pc-electrical", recordId: "demo-paragon-centre", contractorId: "city-electrical", service: "Electrical", scope: { kind: "group-default" } },
  { id: "pref-pc-roofing", recordId: "demo-paragon-centre", contractorId: "skyline-roofing", service: "Roofing", scope: { kind: "shared-areas" } },
  { id: "pref-gym-maintenance", recordId: "demo-paragon-centre", contractorId: "gymcare", service: "Specialist maintenance", scope: { kind: "units", units: [1] } },
  { id: "pref-flat-plumbing", recordId: "demo-paragon-centre", contractorId: "flatflow", service: "Plumbing", scope: { kind: "units", units: [2] } },
];

export const contractorById = (id: string) => CONTRACTORS.find(c => c.id === id);

// --- Queries ------------------------------------------------------------------

const coversUnit = (scope: RequirementScope, unit: number) =>
  scope.kind === "unit" ? scope.unit === unit : scope.kind === "units" && scope.units.includes(unit);

// Requirements recorded at Unit Group level: the group's own records and any
// single record shared by selected Units. Records for one Unit stay with that Unit.
export const groupRequirements = (recordId: string | null | undefined) =>
  recordId ? COMPLIANCE_REQUIREMENTS.filter(r => r.recordId === recordId && r.scope.kind !== "unit") : [];

// What a Unit sees: its own records first, then shared records whose recorded
// scope explicitly covers it. Group-scoped (shared-area) records stay at group level.
export function unitRequirements(recordId: string | null | undefined, unit: number): { own: ComplianceRequirement[]; shared: ComplianceRequirement[] } {
  if (!recordId) return { own: [], shared: [] };
  const mine = COMPLIANCE_REQUIREMENTS.filter(r => r.recordId === recordId && coversUnit(r.scope, unit));
  return {
    own: mine.filter(r => r.scope.kind === "unit"),
    shared: mine.filter(r => r.scope.kind === "units"),
  };
}

export type PreferenceView = { preference: ContractorPreference; contractor: Contractor; origin: string };

const view = (p: ContractorPreference, origin: string): PreferenceView | null => {
  const contractor = contractorById(p.contractorId);
  return contractor ? { preference: p, contractor, origin } : null;
};

// Group-level view: shared preferences (defaults and shared-areas), then the
// Unit-specific exceptions so the group can be understood at a glance.
export function groupPreferences(recordId: string | null | undefined, groupName: string): { shared: PreferenceView[]; unitSpecific: PreferenceView[] } {
  if (!recordId) return { shared: [], unitSpecific: [] };
  const all = CONTRACTOR_PREFERENCES.filter(p => p.recordId === recordId);
  return {
    shared: all.filter(p => p.scope.kind !== "units").map(p => view(p, p.scope.kind === "shared-areas" ? "Shared areas only" : "Unit Group default")).filter((v): v is PreferenceView => Boolean(v)),
    unitSpecific: all.filter(p => p.scope.kind === "units").map(p => view(p, "Recorded for the Unit")).filter((v): v is PreferenceView => Boolean(v)),
  };
}

// What a Unit prefers: its own recorded preferences take precedence over the
// Unit Group default for the same service; shared-areas-only records never appear.
export function unitPreferences(recordId: string | null | undefined, unit: number, groupName: string): PreferenceView[] {
  if (!recordId) return [];
  const all = CONTRACTOR_PREFERENCES.filter(p => p.recordId === recordId);
  const own = all.filter(p => p.scope.kind === "units" && p.scope.units.includes(unit));
  const ownServices = new Set(own.map(p => p.service));
  const defaults = all.filter(p => p.scope.kind === "group-default" && !ownServices.has(p.service));
  return [
    ...own.map(p => view(p, "Recorded for this Unit")),
    ...defaults.map(p => view(p, `From ${groupName}`)),
  ].filter((v): v is PreferenceView => Boolean(v));
}
