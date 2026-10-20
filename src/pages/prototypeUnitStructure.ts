export type ProposedUnit = { number: number; name: string; type: "Flat" | "Shop" | "Office" | "Unit"; classification: "Residential" | "Commercial"; location?: string };
type SpaceGroup = { count: number; type: ProposedUnit["type"]; location?: string };
export type BuildingUnderstanding =
  | { kind: "proposal"; units: ProposedUnit[] }
  | { kind: "clarify"; question: string; total?: number; floors?: string[]; groups?: SpaceGroup[]; choices?: string[]; mixture?: boolean };

const words: Record<string, number> = { a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12 };
const countPattern = "(?:\\d+|a|an|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)";
const countOf = (value: string) => words[value] ?? Number(value);
const typeOf = (value: string): ProposedUnit["type"] => /flat|apartment/.test(value) ? "Flat" : /shop/.test(value) ? "Shop" : "Office";

function propose(groups: SpaceGroup[], floors?: string[]): BuildingUnderstanding {
  const units: ProposedUnit[] = [];
  const names = { Flat: 0, Shop: 0, Office: 0, Unit: 0 };
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
  if (context?.floors && /(?:one|1|a single) (?:separate )?(?:space|unit|office|flat|shop)(?: on| per| to)? (?:each|every) floor|each floor (?:has|contains) (?:one|1)/.test(description)) {
    const type = description.match(/\b(flat|shop|office)\b/);
    if (type) return propose([{ count: context.floors.length, type: typeOf(type[1]) }], context.floors);
    return { kind: "clarify", total: context.floors.length, floors: context.floors, question: "What are those separate spaces used for?" };
  }
  if (context?.total && !context.floors) {
    const total = context.total;
    if (/^(?:they(?:'re| are) (?:all )?|all )?residential$/.test(description)) return propose([{ count: total, type: "Flat" }]);
    if (/^(?:they(?:'re| are) (?:all )?|all )?commercial$/.test(description)) return propose([{ count: total, type: "Unit" }]);
    if (/^(?:a )?mix(?:ture)?(?: of both)?$|^both$/.test(description)) return { kind: "clarify", total, mixture: true, question: `How many of the ${total} are residential, and how many are commercial?` };
    const res = description.match(new RegExp(`\\b(${countPattern}) (?:are )?residential`)), com = description.match(new RegExp(`\\b(${countPattern}) (?:are )?commercial`));
    if (res || com) {
      const r = res ? countOf(res[1]) : total - countOf(com![1]), c = com ? countOf(com[1]) : total - r;
      if (r >= 0 && c >= 0 && r + c === total) return propose([...(r ? [{ count: r, type: "Flat" as const }] : []), ...(c ? [{ count: c, type: "Unit" as const }] : [])]);
      return { kind: "clarify", total, mixture: true, question: `Those don't add up to ${total}. How many are residential, and how many are commercial?` };
    }
  }
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
  if (context?.total && /^(?:they(?:'re| are) (?:all )?|all |all of them are )?(?:flats|apartments|shops|offices)$/.test(description)) return propose([{ count: context.total, type: typeOf(description) }], context.floors);
  if (explicitTotal && explicitTotal > 0 && explicitTotal <= 100) return { kind: "clarify", total: explicitTotal, question: "Are they residential, commercial, or a mixture?", choices: ["Residential", "Commercial", "A mixture"] };
  return { ...(context ?? {}), kind: "clarify", question: context?.floors && !context.total ? "How many separate spaces are there on those floors, and what are they used for?" : context?.total ? `What kinds of spaces are the ${context.total} Units?` : "How many separate spaces are there, and what are they used for?" };
}

const plural = (n: number, one: string) => n === 1 ? `one ${one}` : `${n} ${one}s`;
const list = (parts: string[]) => parts.length <= 1 ? parts.join("") : `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;

// Names one group as "Flat 1 to Flat 11" or the single name.
function nameRun(units: ProposedUnit[]) {
  return units.length === 1 ? units[0].name : `${units[0].name} to ${units[units.length - 1].name}`;
}

export function summarise(units: ProposedUnit[]) {
  const residential = units.filter(u => u.classification === "Residential").length;
  return { total: units.length, residential, commercial: units.length - residential };
}

export function namingProposal(units: ProposedUnit[], building = "Stanley House") {
  const order: ProposedUnit["type"][] = ["Flat", "Shop", "Office", "Unit"];
  const label = { Flat: "residential flat", Shop: "commercial shop", Office: "commercial office", Unit: "commercial unit" };
  const groups = order.map(type => units.filter(u => u.type === type)).filter(g => g.length);
  return `I've laid out ${building} with ${units.length} Unit${units.length === 1 ? "" : "s"} — ${list(groups.map(g => plural(g.length, label[g[0].type])))}.\n\nI've called them ${list(groups.map(nameRun))} for now. Is that how you'd like them named?`;
}

export function numberUnits(units: ProposedUnit[]): ProposedUnit[] {
  let n = 0;
  return units.map(u => u.classification === "Residential" ? { ...u, name: String(++n) } : u);
}

const titleCase = (value: string) => value.replace(/\b\w/g, c => c.toUpperCase());

// Applies bulk naming instructions; returns null when nothing was understood. Never infers floors from names.
export function renameUnits(text: string, units: ProposedUnit[]): ProposedUnit[] | null {
  let next = units.map(u => ({ ...u }));
  let changed = false;
  const residential = () => next.filter(u => u.classification === "Residential");
  for (const raw of text.split(/[.;\n]+|\band\b(?=\s+(?:call|the|name))/i).map(p => p.trim()).filter(Boolean)) {
    const s = raw.toLowerCase();
    const range = s.match(/(?:call|name) (?:them|the flats|the residential units|the flats?) (?:as )?([a-z][a-z ]*?)s? (\d+) (?:to|-|through) (\d+)$/)
      ?? s.match(/(?:the flats|they|flats) are (?:numbered|called) ([a-z][a-z ]*?)?\s*(\d+) (?:to|-|through) (\d+)$/);
    if (range) {
      const start = Number(range[2]), end = Number(range[3]), targets = residential();
      if (end - start + 1 === targets.length && targets.length) {
        const word = range[1] ? titleCase(range[1].trim()) : "Flat";
        targets.forEach((u, i) => { u.name = `${word} ${start + i}`; });
        changed = true;
      }
      continue;
    }
    const shop = raw.match(/(?:call|name) the (shop|commercial unit|office) (?:as )?["']?(.+?)["']?$/i);
    if (shop) {
      const targets = next.filter(u => u.classification === "Commercial");
      if (targets.length === 1) { targets[0].name = titleCase(shop[2].trim()); changed = true; }
    }
  }
  return changed ? next : null;
}
