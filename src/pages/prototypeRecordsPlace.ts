// Shared illustrative place for /prototype-legal and /prototype-contacts.
// Independent of /prototype-unit: neither prototype reads or writes its state.

export type PlaceUnit = { number: number; name: string; classification: "Commercial" | "Residential"; tenancy: string };

export const PLACE = {
  id: "records-paragon-centre",
  name: "The Paragon Centre",
  line: "3 Reading Lane, London E8 1GQ",
  coordinates: [51.5465, -0.0553] as [number, number],
  units: [
    { number: 1, name: "First Floor Gym", classification: "Commercial", tenancy: "Current tenancy recorded" },
    { number: 2, name: "Second Floor Flat", classification: "Residential", tenancy: "No tenancy recorded" },
  ] as PlaceUnit[],
};

export function unitName(n: number): string {
  return PLACE.units.find(u => u.number === n)?.name ?? `Unit ${n}`;
}

/** Units named in a message, in order. "both Units" means every Unit. */
export function unitsMentioned(text: string): number[] {
  const t = text.toLowerCase();
  if (/\bboth (units|of them)\b|\ball units\b|\beach unit\b/.test(t)) return PLACE.units.map(u => u.number);
  const found: number[] = [];
  if (/\bgym\b|first floor/.test(t)) found.push(1);
  if (/\bflat\b|second floor/.test(t)) found.push(2);
  return found;
}

/** Current place context: null is the Unit Group; a number is a selected Unit. */
export type PlaceContext = number | null;
