// Prototype Status: local portfolio signals. Unoccupied findings are derived from
// papers; tenancy, availability and compliance warnings remain separate facts.

export const REASONS = ["No papers", "No new occupancy"] as const;
export type UnoccupiedReason = (typeof REASONS)[number];
export type MapFilter = UnoccupiedReason | "Tenancy ending" | "Available to let" | "Compliance warning" | "All";

export type StatusPlace = { id: string; name: string; town: string; coords: [number, number]; units: string[] };
/** Hobson's reading of why a Unit is Unoccupied. `detail` names the ended chain. */
export type Finding = { reason: UnoccupiedReason; detail?: string };
/** Keyed `${placeId}::${unit}`; Units absent from the book have a current chain. */
export type FindingBook = Record<string, Finding>;
/** A confirmed future legal ending — never inferred from contractual term expiry. */
export type TenancyEnding = { date: string; detail: string };
export type EndingBook = Record<string, TenancyEnding>;
/** An agent's own listing page, so a letting can be checked at source. */
export type Listing = { agency: string; url: string };
/** A marketing instruction, independent of occupation and tenancy state. */
export type Availability = { detail: string; listing?: Listing };
export type AvailabilityBook = Record<string, Availability>;
/** Document-level detail stays in chat; the map aggregates these to one warning. */
export type ComplianceIssue = {
  kind: "Expired document" | "Missing document" | "Expiring soon";
  document: string;
  date?: string;
};
export type ComplianceBook = Record<string, ComplianceIssue[]>;

function floors(n: number) {
  return Array.from({ length: n }, (_, i) => (i === 0 ? "Ground Floor" : `${i}${["st", "nd", "rd"][i - 1] ?? "th"} Floor`));
}

export const STATUS_PLACES: StatusPlace[] = [
  { id: "st-pauls", name: "St Pauls House", town: "Leeds", coords: [53.7997, -1.5492], units: ["4th Floor", "5th Floor", "Part 2nd Floor", "Car Park"] },
  { id: "colmore", name: "Colmore Gate", town: "Birmingham", coords: [52.4831, -1.8990], units: ["Ground Floor Shop", "1st Floor", "2nd Floor", "3rd Floor"] },
  // A real building with a live agent listing, so a TO LET link opens genuine details.
  { id: "temple-row", name: "63 Temple Row", town: "Birmingham", coords: [52.4798, -1.8947], units: ["1st Floor", "2nd Floor", "3rd Floor"] },
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

export const unitListing = (placeId: string, unit: string, availability: AvailabilityBook): Listing | null =>
  availability[unitKey(placeId, unit)]?.listing ?? null;

/** Distinct agent listings for the given Units, in first-seen order. */
export function listingsForUnits(pairs: { placeId: string; unit: string }[], availability: AvailabilityBook): Listing[] {
  const seen = new Map<string, Listing>();
  pairs.forEach(({ placeId, unit }) => {
    const listing = unitListing(placeId, unit, availability);
    if (listing && !seen.has(listing.url)) seen.set(listing.url, listing);
  });
  return [...seen.values()];
}

/** One agent listing a place's available Units share; null when none, or when several compete. */
export function placeListing(place: StatusPlace, availability: AvailabilityBook): Listing | null {
  const found = listingsForUnits(place.units.map((unit) => ({ placeId: place.id, unit })), availability);
  return found.length === 1 ? found[0] : null;
}

/** Units matching a map lens, as place/unit pairs. */
export function matchingUnits(
  book: FindingBook,
  endings: EndingBook,
  availability: AvailabilityBook,
  places: StatusPlace[] = STATUS_PLACES,
  filter: MapFilter = "All",
  compliance: ComplianceBook = {},
): { placeId: string; unit: string }[] {
  return places.flatMap((p) => p.units
    .filter((u) => unitMatchesFilter(p.id, u, book, endings, availability, filter, compliance))
    .map((u) => ({ placeId: p.id, unit: u })));
}

export function placeFindings(book: FindingBook, place: StatusPlace) {
  return place.units.flatMap((u) => { const f = book[unitKey(place.id, u)]; return f ? [{ unit: u, ...f }] : []; });
}

/** Unoccupied Units across places, overall ("All") or for one derived reason. */
export function unitsMatching(book: FindingBook, places: StatusPlace[], filter: UnoccupiedReason | "All") {
  return places.reduce((n, p) => n + placeFindings(book, p).filter((f) => filter === "All" || f.reason === filter).length, 0);
}

export function reasonCounts(book: FindingBook, places: StatusPlace[] = STATUS_PLACES): Record<UnoccupiedReason, number> {
  return { "No papers": unitsMatching(book, places, "No papers"), "No new occupancy": unitsMatching(book, places, "No new occupancy") };
}

export function unitMatchesFilter(
  placeId: string,
  unit: string,
  book: FindingBook,
  endings: EndingBook,
  availability: AvailabilityBook,
  filter: MapFilter,
  compliance: ComplianceBook = {},
) {
  const key = unitKey(placeId, unit);
  if (filter === "All") return Boolean(book[key] || endings[key] || availability[key] || compliance[key]?.length);
  if (filter === "Tenancy ending") return Boolean(endings[key]);
  if (filter === "Available to let") return Boolean(availability[key]);
  if (filter === "Compliance warning") return Boolean(compliance[key]?.length);
  return book[key]?.reason === filter;
}

/** Unique Units matching a map lens; All counts each Unit once even with several signals. */
export function signalUnitsMatching(
  book: FindingBook,
  endings: EndingBook,
  availability: AvailabilityBook,
  places: StatusPlace[] = STATUS_PLACES,
  filter: MapFilter = "All",
  compliance: ComplianceBook = {},
) {
  return places.reduce((total, place) => total + place.units.filter((unit) =>
    unitMatchesFilter(place.id, unit, book, endings, availability, filter, compliance)).length, 0);
}

export function signalCounts(book: FindingBook, endings: EndingBook, availability: AvailabilityBook, places: StatusPlace[] = STATUS_PLACES, compliance: ComplianceBook = {}): Record<MapFilter, number> {
  return {
    All: signalUnitsMatching(book, endings, availability, places, "All", compliance),
    "No papers": signalUnitsMatching(book, endings, availability, places, "No papers", compliance),
    "No new occupancy": signalUnitsMatching(book, endings, availability, places, "No new occupancy", compliance),
    "Tenancy ending": signalUnitsMatching(book, endings, availability, places, "Tenancy ending", compliance),
    "Available to let": signalUnitsMatching(book, endings, availability, places, "Available to let", compliance),
    "Compliance warning": signalUnitsMatching(book, endings, availability, places, "Compliance warning", compliance),
  };
}

export const placeMatchesSignals = (book: FindingBook, endings: EndingBook, availability: AvailabilityBook, place: StatusPlace, filter: MapFilter, compliance: ComplianceBook = {}) =>
  signalUnitsMatching(book, endings, availability, [place], filter, compliance) > 0;

export function complianceAtPlace(book: ComplianceBook, place: StatusPlace) {
  return place.units.flatMap((unit) => (book[unitKey(place.id, unit)] ?? []).map((issue) => ({ unit, ...issue })));
}

export function complianceKindCounts(book: ComplianceBook, places: StatusPlace[] = STATUS_PLACES): Record<ComplianceIssue["kind"], number> {
  const counts: Record<ComplianceIssue["kind"], number> = { "Expired document": 0, "Missing document": 0, "Expiring soon": 0 };
  places.forEach((place) => complianceAtPlace(book, place).forEach((issue) => { counts[issue.kind] += 1; }));
  return counts;
}

export const listWords = (ls: string[]) => ls.length < 2 ? ls.join("") : `${ls.slice(0, -1).join(", ")} and ${ls[ls.length - 1]}`;

export type Intent =
  | { kind: "filter"; filter: MapFilter }
  | { kind: "place"; placeId: string }
  | { kind: "unknown" };

export function interpret(raw: string): Intent {
  const t = raw.toLowerCase();
  if (/complian|fire risk|electrical installation/.test(t)) return { kind: "filter", filter: "Compliance warning" };
  if (/available to let|available for letting|to let/.test(t)) return { kind: "filter", filter: "Available to let" };
  if (/tenanc(?:y|ies).*ending|ending soon|confirmed endings?/.test(t)) return { kind: "filter", filter: "Tenancy ending" };
  if (/no papers|without papers|missing papers|nothing assigned/.test(t)) return { kind: "filter", filter: "No papers" };
  if (/new occupancy|ended|expired|chain/.test(t)) return { kind: "filter", filter: "No new occupancy" };
  if (/unoccupied|vacant|empty/.test(t)) return { kind: "filter", filter: "All" };
  const place = STATUS_PLACES.find((p) => t.includes(p.name.toLowerCase()) || t.includes(p.town.toLowerCase()));
  if (place) return { kind: "place", placeId: place.id };
  if (/\b(everything|all|whole portfolio)\b/.test(t)) return { kind: "filter", filter: "All" };
  return { kind: "unknown" };
}

export type StatusInstruction =
  | { kind: "available"; placeId: string; unit: string }
  | { kind: "ending"; placeId: string; unit: string; date: string };

/** Parse the two deliberately supported illustrative recording instructions. */
export function parseStatusInstruction(raw: string): StatusInstruction | null {
  const t = raw.toLowerCase();
  const place = STATUS_PLACES.find((p) => t.includes(p.name.toLowerCase()));
  if (!place) return null;
  const unit = place.units.find((u) => t.includes(u.toLowerCase()));
  if (!unit) return null;
  if (/\b(mark|make|record|put)\b/.test(t) && /available to let/.test(t)) {
    return { kind: "available", placeId: place.id, unit };
  }
  if (/tenancy/.test(t) && /\bends?\b/.test(t)) {
    const date = raw.match(/\b(\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})\b/i)?.[1];
    if (date) return { kind: "ending", placeId: place.id, unit, date };
  }
  return null;
}
