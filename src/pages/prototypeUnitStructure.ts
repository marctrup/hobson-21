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

export type UnitEdit = { kind: "changed"; units: ProposedUnit[]; reply: string; removed?: { unit: ProposedUnit; index: number } } | { kind: "question"; reply: string };

const reclassify = (u: ProposedUnit, c: ProposedUnit["classification"]): ProposedUnit =>
  ({ ...u, classification: c, type: c === "Residential" ? "Flat" : u.type === "Flat" ? "Unit" : u.type });

// Finds Units named in text; exact name match only, so Flat 1 never matches Flat 11.
function findUnit(name: string, units: ProposedUnit[]) {
  const n = name.trim().toLowerCase().replace(/^the /, "");
  const exact = units.filter(u => u.name.toLowerCase() === n);
  if (exact.length) return exact;
  return units.filter(u => u.name.toLowerCase().split(" ")[0] === n.replace(/s$/, "")) ;
}

// Conversational changes to the single shared proposal. Returns null when the text is not an edit.
export function editUnits(text: string, units: ProposedUnit[]): UnitEdit | null {
  const raw = text.trim().replace(/[.!?]+$/, "");
  const s = raw.toLowerCase();
  const bulk = renameUnits(raw, units);
  if (bulk) return { kind: "changed", units: bulk, reply: "Done. I've renamed them together." };
  let m = raw.match(/^(?:please )?rename (.+?) (?:to|as) ["']?(.+?)["']?$/i) ?? raw.match(/^(?:please )?call (.+?) ["']?(.+?)["']?$/i);
  if (m && /^rename/i.test(raw)) {
    const found = findUnit(m[1], units);
    if (found.length !== 1) return { kind: "question", reply: found.length ? `Which ${m[1].trim().replace(/^the /i, "")} would you like renamed — ${found.map(u => u.name).join(", ")}?` : `I can't see a Unit called ${m[1].trim()}. Which one did you mean?` };
    const name = titleCase(m[2].trim());
    if (units.some(u => u !== found[0] && u.name.toLowerCase() === name.toLowerCase())) return { kind: "question", reply: `There's already a Unit called ${name}. What would you like to call ${found[0].name} instead?` };
    return { kind: "changed", units: units.map(u => u === found[0] ? { ...u, name } : u), reply: `Done. I've renamed ${found[0].name} to ${name}.` };
  }
  m = raw.match(/^(?:please )?(?:change|make|mark|set) (.+?) (?:to|as) (residential|commercial)$/i);
  if (m) {
    const c = (m[2][0].toUpperCase() + m[2].slice(1).toLowerCase()) as ProposedUnit["classification"];
    const found = findUnit(m[1], units);
    if (!found.length) return { kind: "question", reply: `I can't see a Unit called ${m[1].trim()}. Which one did you mean?` };
    if (found.length > 1 && !/s$/.test(m[1].trim())) return { kind: "question", reply: `Which one should be ${c.toLowerCase()} — ${found.map(u => u.name).join(", ")}?` };
    return { kind: "changed", units: units.map(u => found.includes(u) ? reclassify(u, c) : u), reply: `Done. I've marked ${found.length === 1 ? found[0].name : list(found.map(u => u.name))} as ${c.toLowerCase()}.` };
  }
  m = s.match(new RegExp(`^(?:please )?add (another|${countPattern}|\\d+)(?: more)? (flats?|apartments?|shops?|offices?|units?)$`));
  if (m) {
    const count = m[1] === "another" ? 1 : countOf(m[1]);
    if (!Number.isInteger(count) || count < 1 || count > 50) return { kind: "question", reply: "How many would you like me to add?" };
    if (/^units?$/.test(m[2])) return { kind: "question", reply: "Should the new Unit be residential or commercial?" };
    const type = typeOf(m[2]);
    let next = units.map(u => ({ ...u }));
    let id = Math.max(0, ...units.map(u => u.number));
    const added: string[] = [];
    for (let i = 0; i < count; i++) {
      const same = next.filter(u => u.type === type);
      if (type === "Shop" && same.length === 1 && same[0].name === "Shop") same[0].name = "Shop 1";
      const used = new Set(next.map(u => u.name.toLowerCase()));
      let k = same.length + 1; while (used.has(`${type} ${k}`.toLowerCase())) k++;
      const name = `${type} ${k}`;
      next.push({ number: ++id, name, type, classification: type === "Flat" ? "Residential" : "Commercial" });
      added.push(name);
    }
    return { kind: "changed", units: next, reply: `Done. I've added ${list(added)}.` };
  }
  m = raw.match(/^(?:please )?(?:remove|delete|take out) (.+)$/i);
  if (m) {
    const found = findUnit(m[1], units);
    if (found.length !== 1) return { kind: "question", reply: found.length ? `Which one should I remove — ${found.map(u => u.name).join(", ")}?` : `I can't see a Unit called ${m[1].trim()}. Which one did you mean?` };
    if (units.length === 1) return { kind: "question", reply: "That's the only Unit in the proposal. What should take its place?" };
    const index = units.indexOf(found[0]);
    return { kind: "changed", units: units.filter(u => u !== found[0]), reply: `Done. I've removed ${found[0].name}. Say "undo" if that was a mistake.`, removed: { unit: found[0], index } };
  }
  return null;
}

export function restoreUnit(units: ProposedUnit[], removed: { unit: ProposedUnit; index: number }) {
  const next = [...units];
  next.splice(Math.min(removed.index, next.length), 0, removed.unit);
  return next;
}
