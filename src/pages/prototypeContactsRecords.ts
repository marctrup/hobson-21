import { unitName, unitsMentioned, type PlaceContext } from "./prototypeRecordsPlace";

// One contractor identity; separate preferences say where and for which service it is preferred.
// Nothing here assumes a contractor belongs to a single building.

export type Contractor = { id: string; name: string; trade: string; phone: string | null; email: string | null };
export type PreferenceScope = { kind: "group" } | { kind: "shared-areas" } | { kind: "unit"; unit: number };
export type Preference = { id: string; contractorId: string; service: string; scope: PreferenceScope };
export type Exclusion = { service: string; unit: number };

export type ContactsState = { contractors: Contractor[]; preferences: Preference[]; exclusions: Exclusion[] };

export const INITIAL_CONTACTS: ContactsState = {
  contractors: [
    { id: "abc-plumbing", name: "ABC Plumbing Ltd", trade: "Plumbing", phone: null, email: null },
    { id: "example-electrical", name: "Example Electrical Ltd", trade: "Electrical", phone: null, email: null },
  ],
  preferences: [
    { id: "p-abc-group", contractorId: "abc-plumbing", service: "Plumbing", scope: { kind: "group" } },
    { id: "p-ee-flat", contractorId: "example-electrical", service: "Electrical", scope: { kind: "unit", unit: 2 } },
  ],
  exclusions: [],
};

export const contractorById = (s: ContactsState, id: string) => s.contractors.find(c => c.id === id)!;

export type EffectivePreference = { service: string; contractor: Contractor | null; origin: "From The Paragon Centre" | "Recorded for this Unit" | "Group default not used here" };

/** What a Unit uses per service: its own preference, else the group default unless excluded. Shared-area preferences never apply to Units. */
export function unitPreferences(s: ContactsState, unit: number): EffectivePreference[] {
  const services = Array.from(new Set(s.preferences.filter(p => p.scope.kind !== "shared-areas").map(p => p.service)));
  const out: EffectivePreference[] = [];
  for (const service of services) {
    const own = s.preferences.find(p => p.service === service && p.scope.kind === "unit" && p.scope.unit === unit);
    if (own) { out.push({ service, contractor: contractorById(s, own.contractorId), origin: "Recorded for this Unit" }); continue; }
    const group = s.preferences.find(p => p.service === service && p.scope.kind === "group");
    if (!group) continue;
    if (s.exclusions.some(e => e.service === service && e.unit === unit)) out.push({ service, contractor: null, origin: "Group default not used here" });
    else out.push({ service, contractor: contractorById(s, group.contractorId), origin: "From The Paragon Centre" });
  }
  return out;
}

/** Where a contractor is explicitly preferred — inherited Units are not counted as assignments. */
export function preferredAt(s: ContactsState, contractorId: string): string[] {
  return s.preferences.filter(p => p.contractorId === contractorId).map(p =>
    p.scope.kind === "group" ? `The Paragon Centre — Unit Group default (${p.service})`
      : p.scope.kind === "shared-areas" ? `The Paragon Centre — shared areas only (${p.service})`
        : `${unitName(p.scope.unit)} (${p.service})`);
}

export type ContactsAction =
  | { kind: "prefer"; contractor: Contractor; service: string; scopes: PreferenceScope[] }
  | { kind: "phone"; contractorId: string; phone: string }
  | { kind: "remove-unit"; contractorId: string; service: string; unit: number }
  | { kind: "exclude"; service: string; unit: number };

const scopeKey = (sc: PreferenceScope) => (sc.kind === "unit" ? `unit-${sc.unit}` : sc.kind);

export function applyContacts(s: ContactsState, a: ContactsAction): ContactsState {
  if (a.kind === "phone") return { ...s, contractors: s.contractors.map(c => (c.id === a.contractorId ? { ...c, phone: a.phone } : c)) };
  if (a.kind === "remove-unit") return { ...s, preferences: s.preferences.filter(p => !(p.contractorId === a.contractorId && p.service === a.service && p.scope.kind === "unit" && p.scope.unit === a.unit)) };
  if (a.kind === "exclude") {
    if (s.exclusions.some(e => e.service === a.service && e.unit === a.unit)) return s;
    return { ...s, preferences: s.preferences.filter(p => !(p.service === a.service && p.scope.kind === "unit" && p.scope.unit === a.unit && p.contractorId === s.preferences.find(g => g.service === a.service && g.scope.kind === "group")?.contractorId)), exclusions: [...s.exclusions, { service: a.service, unit: a.unit }] };
  }
  const contractors = s.contractors.some(c => c.id === a.contractor.id) ? s.contractors : [...s.contractors, a.contractor];
  let preferences = s.preferences;
  let exclusions = s.exclusions;
  for (const scope of a.scopes) {
    // One preference per service and place: a new choice replaces the old one there only.
    preferences = preferences.filter(p => !(p.service === a.service && scopeKey(p.scope) === scopeKey(scope)));
    preferences = [...preferences, { id: `p-${a.contractor.id}-${a.service.toLowerCase()}-${scopeKey(scope)}`, contractorId: a.contractor.id, service: a.service, scope }];
    if (scope.kind === "unit") exclusions = exclusions.filter(e => !(e.service === a.service && e.unit === scope.unit));
  }
  return { contractors, preferences, exclusions };
}

const SERVICES: Record<string, string> = { plumb: "Plumbing", electric: "Electrical", roof: "Roofing", gym: "Gym equipment" };
function serviceIn(t: string): string | null {
  for (const key of Object.keys(SERVICES)) if (t.includes(key)) return SERVICES[key];
  return null;
}
function existingContractor(s: ContactsState, t: string): Contractor | null {
  return s.contractors.find(c => t.includes(c.name.toLowerCase().replace(/ ltd$/, ""))) ?? null;
}
function slug(name: string) { return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

export type ContactsReply = { text: string; action?: ContactsAction; confirm?: string[]; choices?: { label: string; action?: ContactsAction; next?: ContactsReply }[] };

export function interpretContacts(s: ContactsState, text: string, place: PlaceContext): ContactsReply {
  const t = text.toLowerCase();
  const known = existingContractor(s, t);
  const units = unitsMentioned(t);
  const unit = units[0] ?? place;

  // Updating shared contractor details never changes where they are preferred.
  const phone = text.match(/(\+?\d[\d ]{6,}\d)/);
  if (known && phone && /(number|phone|telephone)/.test(t)) {
    return { text: `I'll update ${known.name}'s telephone number to ${phone[1]}. It will change wherever ${known.name} appears; where they are preferred stays as it is.`, action: { kind: "phone", contractorId: known.id, phone: phone[1] }, confirm: ["Yes, update it", "Not now"] };
  }

  // Removing: establish whether this is a Unit preference or an exception to the group default.
  if (known && /(don'?t|do not|no longer|stop) us/.test(t) && unit !== null) {
    const service = known.trade;
    const own = s.preferences.find(p => p.contractorId === known.id && p.scope.kind === "unit" && p.scope.unit === unit);
    const isDefault = s.preferences.some(p => p.contractorId === known.id && p.scope.kind === "group");
    const choices: ContactsReply["choices"] = [];
    if (own) choices.push({ label: `Remove the preference recorded for ${unitName(unit)}`, action: { kind: "remove-unit", contractorId: known.id, service, unit } });
    if (isDefault) choices.push({ label: `Don't use the Unit Group default at ${unitName(unit)}`, action: { kind: "exclude", service, unit } });
    choices.push({ label: "Leave it as it is" });
    return { text: `Do you mean ${own ? `remove the preference recorded for ${unitName(unit)}` : "nothing recorded for the Unit itself"}${isDefault ? `, or stop ${unitName(unit)} using the Unit Group default` : ""}? ${known.name} stays in my records either way, and their other preferences are unaffected.`, choices };
  }

  // "For plumbing at Second Floor Flat, use Flat Plumbing Services instead."
  const swap = text.match(/for ([a-z ]+?) at ([a-z ]+?),?\s+use ([A-Za-z&' ]+?)(?: instead| as well)?[.!]?$/i)
    ?? text.match(/use ([A-Za-z&' ]+?) for ([a-z ]+?) at ([a-z ]+?)(?: instead| as well)?[.!]?$/i);
  if (swap && unit !== null) {
    const isFirst = /^for /i.test(swap[0]);
    const name = (isFirst ? swap[3] : swap[1]).trim();
    const service = serviceIn((isFirst ? swap[1] : swap[2]).toLowerCase()) ?? "Plumbing";
    const existing = existingContractor(s, name.toLowerCase());
    const contractor = existing ?? { id: slug(name), name, trade: service, phone: null, email: null };
    const groupDefault = s.preferences.find(p => p.service === service && p.scope.kind === "group");
    const defaultName = groupDefault ? contractorById(s, groupDefault.contractorId).name : null;
    const reuse = existing ? `${existing.name} is already in my records, so I'll add a preference rather than a second entry. ` : "";
    const keep = defaultName && defaultName !== contractor.name ? ` The Unit Group default stays ${defaultName}${PLACE_OTHER(unit) ? `, and ${PLACE_OTHER(unit)} keeps it` : ""}.` : "";
    return { text: `${reuse}That records ${contractor.name} for ${service.toLowerCase()} at ${unitName(unit)} only.${keep} Shall I record it?`, action: { kind: "prefer", contractor, service, scopes: [{ kind: "unit", unit }] }, confirm: ["Yes, record it", "Not now"] };
  }

  // "ABC Plumbing are our preferred plumbers for The Paragon Centre."
  if (known && /prefer/.test(t)) {
    const service = serviceIn(t) ?? known.trade;
    const pick = (scopes: PreferenceScope[]): ContactsAction => ({ kind: "prefer", contractor: known, service, scopes });
    return {
      text: `${known.name} is already in my records, so I won't create another entry. Shall I record them as your preferred ${service.toLowerCase()} contractor for the whole Unit Group, including its Units, or only for the shared areas?`,
      choices: [
        { label: "Whole Unit Group", action: pick([{ kind: "group" }]) },
        { label: "Shared areas only", action: pick([{ kind: "shared-areas" }]) },
        { label: "Selected Units", next: { text: "Which Units?", choices: [
          { label: "First Floor Gym", action: pick([{ kind: "unit", unit: 1 }]) },
          { label: "Second Floor Flat", action: pick([{ kind: "unit", unit: 2 }]) },
          { label: "Both Units", action: pick([{ kind: "unit", unit: 1 }, { kind: "unit", unit: 2 }]) },
        ] } },
      ],
    };
  }

  return { text: "I can record which contractor you prefer for a service — across The Paragon Centre, for shared areas only, or for a single Unit — and update a contractor's details. Arranging work stays here in our conversation." };
}

function PLACE_OTHER(unit: number): string | null {
  return unit === 1 ? unitName(2) : unit === 2 ? unitName(1) : null;
}
