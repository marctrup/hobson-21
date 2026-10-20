import type { ProposedUnit } from "./prototypeUnitStructure";

// Optional Unit details. An absent value means "not supplied" — never zero, never "No".
export type AreaMeasure = "ft²" | "m²";
export type UnitDetails = {
  area?: number;
  areaUnit?: AreaMeasure;
  doubleBedrooms?: number;
  singleBedrooms?: number;
  bathrooms?: number;
  outsideSpace?: "Yes" | "No";
  description?: string;
};
export type DetailField = keyof UnitDetails;
export type DetailedUnit = ProposedUnit & { details?: UnitDetails };

export const RESIDENTIAL_FIELDS: DetailField[] = ["area", "doubleBedrooms", "singleBedrooms", "bathrooms", "outsideSpace", "description"];
export const COMMERCIAL_FIELDS: DetailField[] = ["area", "description"];
export const fieldsFor = (u: ProposedUnit) => u.classification === "Residential" ? RESIDENTIAL_FIELDS : COMMERCIAL_FIELDS;
export const FIELD_LABELS: Record<DetailField, string> = { area: "Floor area", areaUnit: "Area measurement", doubleBedrooms: "Double bedrooms", singleBedrooms: "Single bedrooms", bathrooms: "Bathrooms", outsideSpace: "Outside space", description: "Description" };

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

export function formatValue(field: DetailField, d: UnitDetails): string {
  if (field === "area") return d.area === undefined ? "" : `${d.area.toLocaleString("en-GB")} ${d.areaUnit ?? "ft²"}`;
  const v = d[field];
  return v === undefined ? "" : String(v);
}

// Compact list line: only known facts.
export function summaryLine(u: DetailedUnit): string {
  const d = u.details ?? {};
  const parts: string[] = [u.classification];
  if (u.classification === "Residential") {
    if (d.doubleBedrooms !== undefined) parts.push(plural(d.doubleBedrooms, "double bedroom"));
    if (d.singleBedrooms !== undefined) parts.push(plural(d.singleBedrooms, "single bedroom"));
    if (d.bathrooms !== undefined) parts.push(plural(d.bathrooms, "bathroom"));
  } else if (d.area !== undefined) parts.push(formatValue("area", d));
  return parts.join(" · ");
}

const numberWords: Record<string, number> = { no: 0, zero: 0, a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12 };
const N = "(\\d+|no|zero|an?|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)";
const num = (v: string) => numberWords[v] ?? Number(v);
const spell = (n: number) => ["no", "one", "two", "three", "four", "five", "six"][n] ?? String(n);

// Description built strictly from supplied facts — no sizes, views, condition or amenities invented.
export function suggestDescription(u: ProposedUnit, d: UnitDetails, feature?: string): string | null {
  const bits: string[] = [];
  if (u.classification === "Residential") {
    const lead = d.doubleBedrooms !== undefined && d.doubleBedrooms > 0 ? `${spell(d.doubleBedrooms)}-double-bedroom flat` : "Flat";
    bits.push(lead.charAt(0).toUpperCase() + lead.slice(1));
    const extras: string[] = [];
    if (d.singleBedrooms !== undefined && d.singleBedrooms > 0) extras.push(`${spell(d.singleBedrooms)} single bedroom${d.singleBedrooms === 1 ? "" : "s"}`);
    if (d.bathrooms !== undefined) extras.push(`${spell(d.bathrooms)} bathroom${d.bathrooms === 1 ? "" : "s"}`);
    if (d.outsideSpace === "Yes") extras.push(feature ? `a ${feature}` : "outside space");
    if (d.area !== undefined) extras.push(`about ${formatValue("area", d)}`);
    if (!extras.length && bits[0] === "Flat") return null;
    const joined = extras.length > 1 ? `${extras.slice(0, -1).join(", ")} and ${extras[extras.length - 1]}` : extras[0];
    return `${bits[0]}${joined ? ` with ${joined}` : ""}.`;
  }
  if (d.area === undefined) return null;
  return `${u.type === "Shop" ? "Shop" : "Commercial space"} of about ${formatValue("area", d)}.`;
}

export type DetailChange = { unit: number; name: string; field: DetailField; from?: string; to: string; replaces: boolean };

export function proposeChanges(units: DetailedUnit[], targets: number[], patch: UnitDetails): DetailChange[] {
  const changes: DetailChange[] = [];
  for (const u of units) {
    if (!targets.includes(u.number)) continue;
    const allowed = fieldsFor(u);
    for (const field of Object.keys(patch) as DetailField[]) {
      if (field === "areaUnit" || !allowed.includes(field) || patch[field] === undefined) continue;
      const current = u.details ?? {};
      const to = formatValue(field, { ...current, ...patch });
      const from = formatValue(field, current) || undefined;
      if (from === to) continue;
      changes.push({ unit: u.number, name: u.name, field, from, to, replaces: from !== undefined });
    }
  }
  return changes;
}

// Applies only the accepted changes; everything else on every Unit is left untouched.
export function applyChanges(units: DetailedUnit[], patch: UnitDetails, accepted: DetailChange[]): DetailedUnit[] {
  return units.map(u => {
    const mine = accepted.filter(c => c.unit === u.number);
    if (!mine.length) return u;
    const details = { ...(u.details ?? {}) } as UnitDetails;
    for (const c of mine) {
      if (c.field === "area") { details.area = patch.area; details.areaUnit = patch.areaUnit ?? details.areaUnit ?? "ft²"; }
      else (details as Record<string, unknown>)[c.field] = patch[c.field];
    }
    return { ...u, details };
  });
}

export function setDetails(units: DetailedUnit[], number: number, details: UnitDetails): DetailedUnit[] {
  const clean = Object.fromEntries(Object.entries(details).filter(([, v]) => v !== undefined && v !== "")) as UnitDetails;
  if (clean.area === undefined) delete clean.areaUnit;
  return units.map(u => u.number === number ? { ...u, details: clean } : u);
}

export type DetailInstruction =
  | { kind: "proposal"; targets: number[]; patch: UnitDetails; changes: DetailChange[]; reply: string }
  | { kind: "question"; reply: string };

function findTargets(text: string, units: DetailedUnit[]): number[] | null {
  const range = text.match(/\b(flats?|offices?|units?|apartments?)\s+(\d+)\s*(?:to|-|–|through)\s*(\d+)/);
  if (range) {
    const kind = range[1].replace(/s$/, "");
    const [a, b] = [Number(range[2]), Number(range[3])].sort((x, y) => x - y);
    const picked = units.filter(u => { const m = u.name.toLowerCase().match(new RegExp(`^${kind}\\s+(\\d+)$`)); return m && Number(m[1]) >= a && Number(m[1]) <= b; }).map(u => u.number);
    return picked.length ? picked : null;
  }
  if (/\ball (?:of )?(?:the )?flats\b/.test(text)) { const r = units.filter(u => u.classification === "Residential").map(u => u.number); return r.length ? r : null; }
  if (/\ball (?:of )?(?:the )?units\b/.test(text)) return units.map(u => u.number);
  const named = units.filter(u => new RegExp(`\\b${u.name.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(text)).map(u => u.number);
  if (named.length) return named;
  return null;
}

export function interpretDetails(raw: string, units: DetailedUnit[]): DetailInstruction | null {
  const text = raw.toLowerCase().replace(/[.!?]+$/, "").replace(/\s+/g, " ").trim();
  const patch: UnitDetails = {};
  let feature: string | undefined;
  const dbl = text.match(new RegExp(`\\b${N} double(?:[- ]bed(?:room)?s?)?\\b`));
  if (dbl) patch.doubleBedrooms = num(dbl[1]);
  const sgl = text.match(new RegExp(`\\b${N} single(?:[- ]bed(?:room)?s?)?\\b`));
  if (sgl) patch.singleBedrooms = num(sgl[1]);
  const bath = text.match(new RegExp(`\\b${N} bathrooms?\\b`));
  if (bath) patch.bathrooms = num(bath[1]);
  if (/\bno (?:outside space|balcony|garden|terrace)\b/.test(text)) patch.outsideSpace = "No";
  else { const o = text.match(/\b(outside space|balcony|garden|terrace|patio)\b/); if (o) { patch.outsideSpace = "Yes"; if (o[1] !== "outside space") feature = o[1]; } }
  const area = text.match(/\b(\d[\d,]*(?:\.\d+)?)\s*(sq ?ft|ft²|ft2|square feet|sq ?m|sqm|m²|m2|square metres|square meters)\b/);
  if (area) { patch.area = Number(area[1].replace(/,/g, "")); patch.areaUnit = /ft|feet/.test(area[2]) ? "ft²" : "m²"; }
  const sameDescription = /\bsame description\b/.test(text);
  const hasFacts = Object.keys(patch).length > 0;
  if (!hasFacts && !sameDescription) return null;

  const targets = findTargets(text, units);
  if (!targets) return { kind: "question", reply: "Which Units does that apply to? You could say 'Flats 1 to 6' or 'all the flats'." };
  const picked = units.filter(u => targets.includes(u.number));

  if (sameDescription) {
    const source = picked.find(u => u.details?.description);
    if (!source?.details?.description) return { kind: "question", reply: `None of those Units has a description yet. What would you like them to share?` };
    patch.description = source.details.description;
  }

  const residentialOnly = (["doubleBedrooms", "singleBedrooms", "bathrooms", "outsideSpace"] as DetailField[]).some(f => patch[f] !== undefined);
  if (residentialOnly && picked.every(u => u.classification === "Commercial")) return { kind: "question", reply: "Those are commercial Units, so I don't record bedrooms, bathrooms or outside space for them. Did you mean some of the flats?" };

  // A single Unit described in a sentence: offer a description drawn only from what was said.
  if (picked.length === 1 && hasFacts && !patch.description && !picked[0].details?.description) {
    const merged = { ...(picked[0].details ?? {}), ...patch };
    const suggestion = suggestDescription(picked[0], merged, feature);
    if (suggestion) patch.description = suggestion;
  }

  const changes = proposeChanges(units, targets, patch);
  if (!changes.length) return { kind: "question", reply: "Those details are already recorded, so there's nothing to change." };
  const names = picked.length === 1 ? picked[0].name : picked.length <= 3 ? picked.map(u => u.name).join(", ") : `${picked.length} Units (${picked[0].name} to ${picked[picked.length - 1].name})`;
  const replacing = changes.filter(c => c.replaces).length;
  const reply = `Here's what I'd record for ${names}. Nothing changes until you say so.${replacing ? ` ${replacing === 1 ? "One value" : `${replacing} values`} would replace what's already there.` : ""}`;
  return { kind: "proposal", targets, patch, changes, reply };
}
