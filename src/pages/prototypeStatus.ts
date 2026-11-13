// Prototype Status: pure, local simulation of user-recorded Unit situations
// shown on a map. Situations are the user's own record — never read from papers.

export const SITUATIONS = ["Vacant", "Available to let", "Being refurbished"] as const;
export type SituationLabel = (typeof SITUATIONS)[number];

export type StatusPlace = { id: string; name: string; town: string; coords: [number, number]; units: string[] };
export type Recorded = { labels: SituationLabel[]; by: string; date: string };
/** Keyed `${placeId}::${unit}` */
export type SituationBook = Record<string, Recorded>;

export const STATUS_PLACES: StatusPlace[] = [
  { id: "st-pauls", name: "St Pauls House", town: "Leeds", coords: [53.7997, -1.5492], units: ["4th Floor", "5th Floor", "Part 2nd Floor", "Car Park"] },
  { id: "colmore", name: "Colmore Gate", town: "Birmingham", coords: [52.4831, -1.8990], units: ["Ground Floor Shop", "1st Floor", "2nd Floor", "3rd Floor"] },
  { id: "exchange", name: "The Exchange", town: "Manchester", coords: [53.4808, -2.2426], units: ["Ground Floor", "1st Floor", "2nd Floor"] },
  { id: "linear-park", name: "1 Linear Park", town: "Bristol", coords: [51.4545, -2.5879], units: ["Ground Floor", "1st Floor", "2nd Floor", "3rd Floor"] },
  { id: "paragon", name: "Paragon Centre", town: "London", coords: [51.5155, -0.0922], units: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"] },
  { id: "harbour", name: "Harbour House", town: "Southampton", coords: [50.8998, -1.4044], units: ["Ground Floor", "Upper Floor"] },
  { id: "clyde", name: "Clyde Works", town: "Glasgow", coords: [55.8617, -4.2583], units: ["Studio A", "Studio B", "Workshop"] },
];

export const unitKey = (placeId: string, unit: string) => `${placeId}::${unit}`;

export function placeSituations(book: SituationBook, place: StatusPlace) {
  return place.units.flatMap((u) => { const r = book[unitKey(place.id, u)]; return r && r.labels.length ? [{ unit: u, ...r }] : []; });
}

/** Count of Units per label at a place (a Unit with two labels counts in both). */
export function labelCounts(book: SituationBook, place: StatusPlace): Record<SituationLabel, number> {
  const counts = { Vacant: 0, "Available to let": 0, "Being refurbished": 0 } as Record<SituationLabel, number>;
  placeSituations(book, place).forEach((r) => r.labels.forEach((l) => { counts[l] += 1; }));
  return counts;
}

export function placeMatches(book: SituationBook, place: StatusPlace, filter: SituationLabel | "All") {
  const rows = placeSituations(book, place);
  return filter === "All" ? rows.length > 0 : rows.some((r) => r.labels.includes(filter));
}

export const listWords = (ls: string[]) => ls.length < 2 ? ls.join("") : `${ls.slice(0, -1).join(", ")} and ${ls[ls.length - 1]}`;

export type Intent =
  | { kind: "record" }
  | { kind: "filter"; label: SituationLabel | "All" }
  | { kind: "place"; placeId: string }
  | { kind: "unknown" };

export function interpret(raw: string): Intent {
  const t = raw.toLowerCase();
  if (/\b(record|update|mark|set)\b/.test(t) && /(situation|status|vacant|refurb|let)/.test(t)) return { kind: "record" };
  const label: SituationLabel | null = /vacant|empty/.test(t) ? "Vacant" : /available|to let|marketing/.test(t) ? "Available to let" : /refurb|works|fit[- ]?out/.test(t) ? "Being refurbished" : null;
  if (label) return { kind: "filter", label };
  if (/\b(everything|all|whole portfolio|clear)\b/.test(t)) return { kind: "filter", label: "All" };
  const place = STATUS_PLACES.find((p) => t.includes(p.name.toLowerCase()) || t.includes(p.town.toLowerCase()));
  if (place) return { kind: "place", placeId: place.id };
  return { kind: "unknown" };
}
