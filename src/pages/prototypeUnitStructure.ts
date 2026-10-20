export type ProposedUnit = { number: number; name: string; type: "Flat" | "Shop" | "Office"; classification: "Residential" | "Commercial"; location?: string };
type SpaceGroup = { count: number; type: ProposedUnit["type"]; location?: string };
export type BuildingUnderstanding =
  | { kind: "proposal"; units: ProposedUnit[] }
  | { kind: "clarify"; question: string; total?: number; floors?: string[]; groups?: SpaceGroup[] };

const words: Record<string, number> = { a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12 };
const countPattern = "(?:\\d+|a|an|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)";
const countOf = (value: string) => words[value] ?? Number(value);
const typeOf = (value: string): ProposedUnit["type"] => /flat|apartment/.test(value) ? "Flat" : /shop/.test(value) ? "Shop" : "Office";

function propose(groups: SpaceGroup[], floors?: string[]): BuildingUnderstanding {
  const units: ProposedUnit[] = [];
  const names = { Flat: 0, Shop: 0, Office: 0 };
  const shopCount = groups.filter(g => g.type === "Shop").reduce((n, g) => n + g.count, 0);
  for (const group of groups) for (let i = 0; i < group.count; i++) {
    names[group.type]++;
    const location = group.location ?? floors?.[units.length];
    units.push({ number: units.length + 1, name: group.type === "Shop" && shopCount === 1 ? "Shop" : `${group.type} ${names[group.type]}`, type: group.type, classification: group.type === "Flat" ? "Residential" : "Commercial", ...(location ? { location } : {}) });
  }
  return { kind: "proposal", units };
}

// Bounded local interpretation; no records, AI calls or inferred floor divisions.
export function understandBuilding(text: string, previous?: BuildingUnderstanding | null): BuildingUnderstanding {
  const description = text.toLowerCase().replace(/[.,;!]/g, " ").replace(/\s+/g, " ").trim();
  const context = previous?.kind === "clarify" ? previous : undefined;
  const groups: SpaceGroup[] = [];
  const matches = [...description.matchAll(new RegExp(`\\b(${countPattern})\\s+(flats?|apartments?|shops?|offices?)\\b([\\s\\S]*?)(?=\\b${countPattern}\\s+(?:flats?|apartments?|shops?|offices?)\\b|$)`, "g"))];
  for (const match of matches) {
    const count = countOf(match[1]);
    if (!Number.isInteger(count) || count < 1 || count > 100) return { kind: "clarify", question: "How many separate spaces are there, and what are they used for?" };
    const location = /on the ground floor/.test(match[3]) ? "Ground Floor" : /above|upper floors/.test(match[3]) ? "Above ground floor" : undefined;
    groups.push({ count, type: typeOf(match[2]), ...(location ? { location } : {}) });
  }
  const totalMatch = description.match(new RegExp(`\\b(${countPattern})\\s+(?:units?|spaces?)\\b`));
  const explicitTotal = totalMatch ? countOf(totalMatch[1]) : undefined;
  if (groups.length) {
    const total = groups.reduce((n, group) => n + group.count, 0);
    const expected = explicitTotal ?? context?.total;
    const leftover = description.replace(new RegExp(`\\b${countPattern}\\s+(?:flats?|apartments?|shops?|offices?)\\b`, "g"), "");
    if (/\b(?:flat|apartment|shop|office)s?\b/.test(leftover) || (expected !== undefined && expected !== total)) {
      return { kind: "clarify", question: expected ? `How are the ${expected} separate spaces split between flats, shops and offices?` : "How many of each kind of separate space are there?", ...(expected ? { total: expected } : {}), groups };
    }
    return propose(groups);
  }
  const floors: string[] = [];
  if (/basement/.test(description)) floors.push("Basement");
  if (/ground/.test(description) && /floor/.test(description)) floors.push("Ground Floor");
  for (const floor of ["First", "Second", "Third"]) if (description.includes(floor.toLowerCase())) floors.push(`${floor} Floor`);
  const upper = description.match(/\b(two|three|2|3) upper floors?\b/);
  if (upper) for (const floor of ["First", "Second", "Third"].slice(0, countOf(upper[1]))) if (!floors.includes(`${floor} Floor`)) floors.push(`${floor} Floor`);
  if (floors.length && /floor/.test(description)) return { kind: "clarify", floors, ...(context?.total ? { total: context.total } : {}), question: "Does each floor contain one separate space, or several?" };
  if (context?.floors && /(?:one|1|a single) (?:separate )?(?:space|unit|office|flat|shop)(?: on| per| to)? (?:each|every) floor|each floor (?:has|contains) (?:one|1)/.test(description)) {
    const type = description.match(/\b(flat|shop|office)\b/);
    if (type) return propose([{ count: context.floors.length, type: typeOf(type[1]) }], context.floors);
    return { kind: "clarify", total: context.floors.length, floors: context.floors, question: "What are those separate spaces used for?" };
  }
  if (context?.total && /^(?:they(?:'re| are) (?:all )?|all |all of them are )?(?:flats|apartments|shops|offices)$/.test(description)) return propose([{ count: context.total, type: typeOf(description) }], context.floors);
  if (explicitTotal && explicitTotal > 0 && explicitTotal <= 100) return { kind: "clarify", total: explicitTotal, question: `What kinds of spaces are the ${explicitTotal} Units?` };
  return { ...(context ?? {}), kind: "clarify", question: context?.floors && !context.total ? "How many separate spaces are there on those floors, and what are they used for?" : context?.total ? `What kinds of spaces are the ${context.total} Units?` : "How many separate spaces are there, and what are they used for?" };
}
