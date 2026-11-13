// Prototype Status: pure, local simulation of Units Hobson derives as Unoccupied
// from their papers. Nobody records a situation by hand: a Unit is Unoccupied when
// no papers are assigned to it, or when its current chain has ended. The map turns
// that into a statistic to investigate — what should remain are genuinely ended chains.

export const REASONS = ["No papers", "Chain ended"] as const;
export type UnoccupiedReason = (typeof REASONS)[number];

export type StatusPlace = { id: string; name: string; town: string; coords: [number, number]; units: string[] };
/** Hobson's reading of why a Unit is Unoccupied. `detail` names the ended chain. */
export type Finding = { reason: UnoccupiedReason; detail?: string };
/** Keyed `${placeId}::${unit}`; Units absent from the book are occupied by a current chain. */
export type FindingBook = Record<string, Finding>;

function floors(n: number) {
  return Array.from({ length: n }, (_, i) => (i === 0 ? "Ground Floor" : `${i}${["st", "nd", "rd"][i - 1] ?? "th"} Floor`));
}

export const STATUS_PLACES: StatusPlace[] = [
  { id: "st-pauls", name: "St Pauls House", town: "Leeds", coords: [53.7997, -1.5492], units: ["4th Floor", "5th Floor", "Part 2nd Floor", "Car Park"] },
  { id: "colmore", name: "Colmore Gate", town: "Birmingham", coords: [52.4831, -1.8990], units: ["Ground Floor Shop", "1st Floor", "2nd Floor", "3rd Floor"] },
  { id: "exchange", name: "The Exchange", town: "Manchester", coords: [53.4808, -2.2426], units: ["Ground Floor", "1st Floor", "2nd Floor"] },
  { id: "linear-park", name: "1 Linear Park", town: "Bristol", coords: [51.4545, -2.5879], units: ["Ground Floor", "1st Floor", "2nd Floor", "3rd Floor"] },
  { id: "paragon", name: "Paragon Centre", town: "London", coords: [51.5155, -0.0922], units: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"] },
  { id: "harbour", name: "Harbour House", town: "Southampton", coords: [50.8998, -1.4044], units: ["Ground Floor", "Upper Floor"] },
  { id: "clyde", name: "Clyde Works", town: "Glasgow", coords: [55.8617, -4.2583], units: ["Studio A", "Studio B", "Workshop"] },
  { id: "wharf", name: "Wharf Point", town: "London", coords: [51.5054, -0.0235], units: floors(8) },
  { id: "shoreditch", name: "Tea Yard", town: "London", coords: [51.5262, -0.0786], units: floors(5) },
  { id: "soho", name: "Dean Street Studios", town: "London", coords: [51.5136, -0.1325], units: floors(4) },
  { id: "kings-cross", name: "Granary Row", town: "London", coords: [51.5338, -0.1248], units: floors(7) },
  { id: "southwark", name: "Borough Works", town: "London", coords: [51.5025, -0.0905], units: floors(6) },
  { id: "kensington", name: "Abingdon Court", town: "London", coords: [51.4988, -0.1949], units: floors(5) },
  { id: "hammersmith", name: "Riverside Yard", town: "London", coords: [51.4907, -0.2290], units: floors(4) },
  { id: "camden", name: "Lock House", town: "London", coords: [51.5410, -0.1446], units: floors(5) },
  { id: "stratford", name: "Carpenters Quay", town: "London", coords: [51.5416, -0.0034], units: floors(6) },
];

/** The Unit this demonstration stands at. */
export const CURRENT = { placeId: "linear-park", unit: "1st Floor" } as const;
export const CURRENT_PLACE = STATUS_PLACES.find((p) => p.id === CURRENT.placeId)!;

export const unitKey = (placeId: string, unit: string) => `${placeId}::${unit}`;

export function placeFindings(book: FindingBook, place: StatusPlace) {
  return place.units.flatMap((u) => { const f = book[unitKey(place.id, u)]; return f ? [{ unit: u, ...f }] : []; });
}

export type Filter = UnoccupiedReason | "All";

/** Unoccupied Units across places, overall ("All") or for one reason. */
export function unitsMatching(book: FindingBook, places: StatusPlace[], filter: Filter) {
  return places.reduce((n, p) => n + placeFindings(book, p).filter((f) => filter === "All" || f.reason === filter).length, 0);
}

export function reasonCounts(book: FindingBook, places: StatusPlace[] = STATUS_PLACES): Record<UnoccupiedReason, number> {
  return { "No papers": unitsMatching(book, places, "No papers"), "Chain ended": unitsMatching(book, places, "Chain ended") };
}

export const placeMatches = (book: FindingBook, place: StatusPlace, filter: Filter) => unitsMatching(book, [place], filter) > 0;

export const listWords = (ls: string[]) => ls.length < 2 ? ls.join("") : `${ls.slice(0, -1).join(", ")} and ${ls[ls.length - 1]}`;

export type Intent =
  | { kind: "filter"; filter: Filter }
  | { kind: "place"; placeId: string }
  | { kind: "unknown" };

export function interpret(raw: string): Intent {
  const t = raw.toLowerCase();
  if (/no papers|without papers|missing papers|nothing assigned/.test(t)) return { kind: "filter", filter: "No papers" };
  if (/ended|expired|chain/.test(t)) return { kind: "filter", filter: "Chain ended" };
  if (/unoccupied|vacant|empty/.test(t)) return { kind: "filter", filter: "All" };
  const place = STATUS_PLACES.find((p) => t.includes(p.name.toLowerCase()) || t.includes(p.town.toLowerCase()));
  if (place) return { kind: "place", placeId: place.id };
  if (/\b(everything|all|whole portfolio)\b/.test(t)) return { kind: "filter", filter: "All" };
  return { kind: "unknown" };
}
