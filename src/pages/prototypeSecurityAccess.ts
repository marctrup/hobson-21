// Prototype Security: pure, local simulation of who can reach what in Hobson.
// Information access is always the intersection of places, paper types and areas.
// Nothing here sends invitations or touches real security settings.

export type Level = "none" | "view" | "change";
export type AreaId = "papers" | "people" | "compliance" | "reading";
export type GroupScope = "all" | string[];
export type Access = { portfolio: boolean; groups: Record<string, GroupScope>; papers: "all" | string[]; areas: Record<AreaId, Level> };
export type Status = "active" | "suspended" | "invited";
export type Person = { id: string; name: string; role: string; email: string; superuser?: boolean; you?: boolean; status: Status; access: Access; note?: string };

export const GROUPS = [
  { id: "burlington", name: "Burlington Gardens", units: ["Unit 1", "Unit 2", "Unit 3", "Part Basement"] },
  { id: "stanley", name: "Stanley House", units: ["Flat 6", "Flat 8", "Communal Areas"] },
  { id: "nugent", name: "5 Nugent Terrace", units: ["Shop", "Flat 1", "Flat 2", "Flat 3"] },
];
export const groupName = (id: string) => GROUPS.find((g) => g.id === id)?.name ?? id;

export type PaperType = { id: string; label: string; plural: string; accounting?: boolean; compliance?: boolean; lease?: boolean };
export const FAMILIES: { id: string; code: string; label: string; types: PaperType[] }[] = [
  { id: "rto", code: "RTO", label: "Right to Occupy", types: [
    { id: "business-lease", label: "Business Lease", plural: "Business Leases", lease: true },
    { id: "residential-tenancy", label: "Residential Tenancy Agreement", plural: "Residential Tenancy Agreements", lease: true },
    { id: "underlease", label: "Underlease", plural: "Underleases", lease: true },
    { id: "licence-occupy", label: "Licence to Occupy", plural: "Licences to Occupy", lease: true },
  ] },
  { id: "amd", code: "AMD", label: "Accompany or Modify", types: [
    { id: "deed-variation", label: "Deed of Variation", plural: "Deeds of Variation" },
    { id: "rent-review", label: "Rent Review Memorandum", plural: "Rent Review Memoranda" },
    { id: "licence-alterations", label: "Licence for Alterations", plural: "Licences for Alterations" },
    { id: "rent-concession", label: "Rent Concession Letter", plural: "Rent Concession Letters" },
    { id: "assignment", label: "Assignment", plural: "Assignments" },
  ] },
  { id: "acd", code: "ACD", label: "Asset, Compliance and Description", types: [
    { id: "epc", label: "EPC", plural: "EPCs", compliance: true },
    { id: "gas", label: "Gas Safety Certificate", plural: "Gas Safety Certificates", compliance: true },
    { id: "eicr", label: "EICR", plural: "EICRs", compliance: true },
    { id: "insurance", label: "Insurance Schedule", plural: "Insurance Schedules" },
    { id: "asbestos", label: "Asbestos Survey", plural: "Asbestos Surveys", compliance: true },
    { id: "service-charge-accounts", label: "Service Charge Accounts", plural: "Service Charge Accounts", accounting: true },
    { id: "annual-accounts", label: "Annual Accounts", plural: "Annual Accounts", accounting: true },
  ] },
];
export const ALL_TYPES = FAMILIES.flatMap((f) => f.types);
export const typeById = (id: string) => ALL_TYPES.find((t) => t.id === id)!;
const ACCOUNTING = ALL_TYPES.filter((t) => t.accounting).map((t) => t.id);

export const AREAS: { id: AreaId; label: string; explain: string; levels: Level[] }[] = [
  { id: "papers", label: "Papers", explain: "Permitted papers belonging to the places they've been given.", levels: ["none", "view", "change"] },
  { id: "people", label: "People We Know", explain: "Landlords, tenants, lawyers, staff and preferred contractors, within their places.", levels: ["none", "view", "change"] },
  { id: "compliance", label: "My Compliance Responsibilities", explain: "Compliance requirements and responsibilities for their places.", levels: ["none", "view", "change"] },
  { id: "reading", label: "Reading", explain: "Add papers and follow their progress. This never opens papers they're otherwise not allowed to see.", levels: ["none", "change"] },
];
export const levelLabel = (a: AreaId, l: Level) => (l === "none" ? "No access" : l === "view" ? "View" : a === "reading" ? "Can add papers" : "Make changes");

const areas = (papers: Level, people: Level, compliance: Level, reading: Level) => ({ papers, people, compliance, reading });
export const FULL: Access = { portfolio: true, groups: {}, papers: "all", areas: areas("change", "change", "change", "change") };
const allBut = (ids: string[]) => ALL_TYPES.map((t) => t.id).filter((x) => !ids.includes(x));

export const INITIAL_PEOPLE: Person[] = [
  { id: "sarah", name: "Sarah Mitchell", role: "Portfolio Manager", email: "sarah@hobsonproperty.co.uk", superuser: true, you: true, status: "active", access: FULL },
  { id: "oliver", name: "Oliver Grant", role: "Director", email: "oliver@hobsonproperty.co.uk", superuser: true, status: "active", access: FULL },
  { id: "james", name: "James Carter", role: "Building Manager", email: "james@hobsonproperty.co.uk", status: "active", access: { portfolio: false, groups: { burlington: "all", stanley: ["Flat 6"] }, papers: allBut(ACCOUNTING), areas: areas("view", "view", "change", "change") } },
  { id: "emily", name: "Emily Clarke", role: "External Solicitor", email: "emily.clarke@clarkelaw.co.uk", status: "active", access: { portfolio: false, groups: { burlington: ["Unit 1", "Unit 2"] }, papers: ["business-lease", "deed-variation", "rent-review"], areas: areas("view", "none", "none", "none") } },
  { id: "daniel", name: "Daniel Reed", role: "Accounts", email: "daniel@hobsonproperty.co.uk", status: "active", access: { portfolio: true, groups: {}, papers: ACCOUNTING, areas: areas("view", "view", "none", "none") } },
  { id: "priya", name: "Priya Shah", role: "Asset Manager", email: "priya@hobsonproperty.co.uk", status: "active", access: { portfolio: true, groups: {}, papers: "all", areas: areas("change", "change", "view", "change") } },
  { id: "tom", name: "Tom Walsh", role: "Lettings", email: "tom@walshlettings.co.uk", status: "active", access: { portfolio: false, groups: { stanley: ["Flat 6", "Flat 8"] }, papers: ["residential-tenancy", "epc", "gas"], areas: areas("view", "view", "none", "change") } },
  { id: "hannah", name: "Hannah Brooks", role: "Facilities Coordinator", email: "hannah@hobsonproperty.co.uk", status: "active", access: { portfolio: false, groups: { nugent: "all" }, papers: ["epc", "gas", "eicr", "asbestos"], areas: areas("view", "view", "change", "none") } },
  { id: "lucy", name: "Lucy Bennett", role: "Managing Agent", email: "lucy@bennettmanagement.co.uk", status: "invited", access: { portfolio: false, groups: { stanley: "all" }, papers: allBut(ACCOUNTING), areas: areas("view", "view", "view", "none") } },
  { id: "mark", name: "Mark Owens", role: "Building Surveyor", email: "mark@owenssurveying.co.uk", status: "invited", access: { portfolio: false, groups: { burlington: "all" }, papers: ["asbestos", "eicr", "licence-alterations"], areas: areas("view", "none", "view", "none") } },
];

// ---------- Places ----------
export const unitsFor = (a: Access, gid: string): string[] => {
  const g = GROUPS.find((x) => x.id === gid)!;
  if (a.portfolio) return g.units;
  const s = a.groups[gid];
  return !s ? [] : s === "all" ? g.units : s;
};
export const canSeeUnit = (a: Access, gid: string, unit: string) => unitsFor(a, gid).includes(unit);
export const groupsWithAccess = (a: Access) => GROUPS.filter((g) => unitsFor(a, g.id).length > 0);
const list = (xs: string[]) => (xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);
export const scopeLabel = (a: Access, gid: string) => {
  const g = GROUPS.find((x) => x.id === gid)!;
  const u = unitsFor(a, gid);
  if (!u.length) return null;
  if (a.portfolio || a.groups[gid] === "all") return `All ${g.units.length} Units`;
  return u.length === 1 ? `${u[0]} only` : list(u);
};
export const placeLines = (a: Access) => (a.portfolio ? ["The whole portfolio"] : groupsWithAccess(a).map((g) => `${g.name} — ${scopeLabel(a, g.id)}`));

const clone = (a: Access): Access => ({ ...a, groups: { ...a.groups }, papers: a.papers === "all" ? "all" : [...a.papers], areas: { ...a.areas } });
const expand = (a: Access): Access => (a.portfolio ? { ...a, portfolio: false, groups: Object.fromEntries(GROUPS.map((g) => [g.id, "all" as GroupScope])) } : a);
export const setPortfolio = (a: Access, on: boolean): Access => ({ ...clone(a), portfolio: on, groups: on ? {} : {} });
export const setGroup = (a0: Access, gid: string, on: boolean): Access => {
  const a = clone(expand(a0));
  if (on) a.groups[gid] = "all"; else delete a.groups[gid];
  return a;
};
export const setUnit = (a0: Access, gid: string, unit: string, on: boolean): Access => {
  const a = clone(expand(a0));
  const g = GROUPS.find((x) => x.id === gid)!;
  const cur = new Set(unitsFor(a, gid));
  if (on) cur.add(unit); else cur.delete(unit);
  // Individual Units stay individual: adding Flat 6 never quietly grants the rest of the building.
  const chosen = g.units.filter((u) => cur.has(u));
  if (!chosen.length) delete a.groups[gid]; else a.groups[gid] = chosen;
  return a;
};

// ---------- Papers ----------
export const typesFor = (a: Access) => (a.papers === "all" ? ALL_TYPES.map((t) => t.id) : a.papers);
export const setAllPapers = (a: Access, all: boolean): Access => ({ ...clone(a), papers: all ? "all" : typesFor(a) });
export const setType = (a0: Access, id: string, on: boolean): Access => {
  const a = clone(a0);
  const cur = new Set(typesFor(a));
  if (on) cur.add(id); else cur.delete(id);
  return { ...a, papers: ALL_TYPES.map((t) => t.id).filter((t) => cur.has(t)) };
};
export const setFamily = (a: Access, fid: string, on: boolean) => FAMILIES.find((f) => f.id === fid)!.types.reduce((x, t) => setType(x, t.id, on), a);
export const setArea = (a: Access, area: AreaId, l: Level): Access => ({ ...clone(a), areas: { ...a.areas, [area]: l } });

export const paperLine = (a: Access): string => {
  if (a.papers === "all") return "All papers";
  if (!a.papers.length) return "No papers";
  const parts = FAMILIES.map((f) => {
    const ids = f.types.filter((t) => a.papers.includes(t.id));
    if (!ids.length) return null;
    if (ids.length === f.types.length) return `All ${f.label} papers`;
    return ids.map((t) => t.plural).join(", ");
  }).filter(Boolean) as string[];
  return parts.join(" · ");
};
const paperWords = (a: Access) => {
  if (a.papers === "all") return "all papers";
  const t = a.papers.map(typeById);
  const words: string[] = [];
  if (t.some((x) => x.lease)) words.push("leases and tenancies");
  if (t.some((x) => x.compliance)) words.push("compliance papers");
  if (t.some((x) => x.accounting)) words.push("accounting papers");
  const other = t.filter((x) => !x.lease && !x.compliance && !x.accounting);
  if (other.length) words.push(other.map((x) => x.plural.toLowerCase().replace(/^epcs$/, "EPCs")).join(", "));
  return words.length ? list(words) : "no papers";
};

// ---------- Plain-language summaries ----------
export const firstName = (p: Person) => p.name.split(" ")[0];
export type Summary = { can: string[]; cannot: string[] };
export function summarise(p: Person, a: Access = p.access): Summary {
  const n = firstName(p);
  if (p.superuser) return { can: ["Access the whole portfolio and every paper.", "Use every area of Hobson.", "Invite people and change their access."], cannot: [] };
  const can: string[] = [], cannot: string[] = [];
  const gs = groupsWithAccess(a);
  if (a.portfolio) can.push("Access the whole portfolio.");
  else if (gs.length) can.push(`Access ${list(gs.map((g) => (a.groups[g.id] === "all" ? g.name : `${list(unitsFor(a, g.id))} at ${g.name}`)))}.`);
  if (a.areas.papers !== "none" && typesFor(a).length) can.push(`${a.areas.papers === "change" ? "Work with" : "See"} the ${paperWords(a)} for ${a.portfolio || gs.length > 1 ? "those places" : "that place"}.`);
  if (a.areas.people !== "none") can.push(`${a.areas.people === "change" ? "View and update" : "View"} relevant contacts in People We Know.`);
  if (a.areas.compliance !== "none") can.push(a.areas.compliance === "change" ? "Review and update compliance responsibilities." : "Review compliance responsibilities.");
  if (a.areas.reading !== "none") can.push("Add permitted papers through Reading.");
  if (!can.length) can.push("Nothing yet.");
  if (!a.portfolio) {
    GROUPS.forEach((g) => {
      const u = unitsFor(a, g.id);
      if (!u.length) cannot.push(`Access ${g.name}.`);
      else if (u.length < g.units.length) cannot.push(`See the rest of ${g.name} (${list(g.units.filter((x) => !u.includes(x)))}).`);
    });
  }
  if (a.papers !== "all") {
    if (!a.papers.some((t) => ACCOUNTING.includes(t))) cannot.push("View accounting papers.");
    if (!a.papers.some((t) => typeById(t).lease)) cannot.push("View leases or tenancy agreements.");
  }
  if (a.areas.papers === "none") cannot.push("Open Papers.");
  if (a.areas.people === "none") cannot.push("See People We Know.");
  if (a.areas.compliance === "none") cannot.push("See compliance responsibilities.");
  cannot.push("Manage other people's access.");
  void n;
  return { can, cannot };
}

export function glance(p: Person, a: Access = p.access) {
  if (p.superuser) return { where: "The whole portfolio", what: "All papers", doing: "Everything, including Security" };
  const doing = AREAS.filter((x) => a.areas[x.id] !== "none").map((x) => `${a.areas[x.id] === "change" ? (x.id === "reading" ? "Add papers" : "Update") : "View"} ${x.id === "reading" ? "" : x.label.replace("My Compliance Responsibilities", "compliance").replace("People We Know", "contacts").replace("Papers", "papers")}`.trim());
  return { where: a.portfolio ? "The whole portfolio" : groupsWithAccess(a).map((g) => (a.groups[g.id] === "all" ? g.name : `${g.name} (${list(unitsFor(a, g.id))})`)).join(" · ") || "No places", what: paperLine(a), doing: doing.join(" · ") || "Nothing yet" };
}

export const isRestricted = (p: Person) => !p.superuser && !p.access.portfolio && Object.keys(p.access.groups).length <= 1;
export const cardLine = (p: Person) => {
  if (p.superuser) return "Access to all Units and areas";
  const a = p.access;
  const where = a.portfolio ? "All Units" : (() => { const gs = groupsWithAccess(a); return gs.length === 1 ? (a.groups[gs[0].id] === "all" ? gs[0].name : `${gs[0].name} · ${list(unitsFor(a, gs[0].id))}`) : `${gs.length} Unit Groups`; })();
  const what = a.papers === "all" ? "All papers" : a.papers.every((t) => ACCOUNTING.includes(t)) ? "Accounting papers" : "Selected papers";
  const areasOn = AREAS.filter((x) => x.id !== "papers" && a.areas[x.id] !== "none").map((x) => x.label.replace("My Compliance Responsibilities", "Compliance"));
  return [where, what, ...areasOn].join(" · ");
};

// ---------- Differences and consequences ----------
export function diff(before: Access, after: Access): string[] {
  const out: string[] = [];
  GROUPS.forEach((g) => {
    const b = unitsFor(before, g.id), c = unitsFor(after, g.id);
    const added = c.filter((u) => !b.includes(u)), removed = b.filter((u) => !c.includes(u));
    if (added.length) out.push(`Adds ${added.length === g.units.length ? `all of ${g.name}` : `${list(added)} at ${g.name}`}`);
    if (removed.length) out.push(`Removes ${removed.length === b.length && !c.length ? g.name : `${list(removed)} at ${g.name}`}`);
  });
  const bt = typesFor(before), ct = typesFor(after);
  const addT = ct.filter((t) => !bt.includes(t)), remT = bt.filter((t) => !ct.includes(t));
  if (addT.length) out.push(`Adds ${list(addT.map((t) => typeById(t).plural))}`);
  if (remT.length) out.push(remT.length && remT.every((t) => ACCOUNTING.includes(t)) && ACCOUNTING.every((t) => remT.includes(t)) ? "Removes accounting papers" : `Removes ${list(remT.map((t) => typeById(t).plural))}`);
  AREAS.forEach((x) => { if (before.areas[x.id] !== after.areas[x.id]) out.push(`${x.label}: ${levelLabel(x.id, before.areas[x.id])} → ${levelLabel(x.id, after.areas[x.id])}`); });
  return out;
}

// Illustrative papers, used to show the intersection rule in previews.
export const PAPERS: { title: string; type: string; units: [string, string][] }[] = [
  { title: "Lease — Unit 1, Burlington Gardens", type: "business-lease", units: [["burlington", "Unit 1"]] },
  { title: "Lease — Unit 2, Burlington Gardens", type: "business-lease", units: [["burlington", "Unit 2"]] },
  { title: "Deed of Variation — Units 2 and 3", type: "deed-variation", units: [["burlington", "Unit 2"], ["burlington", "Unit 3"]] },
  { title: "Rent Review Memorandum — Unit 1", type: "rent-review", units: [["burlington", "Unit 1"]] },
  { title: "Asbestos Survey — Burlington Gardens", type: "asbestos", units: [["burlington", "Part Basement"], ["burlington", "Unit 3"]] },
  { title: "Tenancy Agreement — Flat 6, Stanley House", type: "residential-tenancy", units: [["stanley", "Flat 6"]] },
  { title: "Tenancy Agreement — Flat 8, Stanley House", type: "residential-tenancy", units: [["stanley", "Flat 8"]] },
  { title: "Gas Safety Certificate — Flats 6 and 8", type: "gas", units: [["stanley", "Flat 6"], ["stanley", "Flat 8"]] },
  { title: "Service Charge Accounts 2025 — Stanley House", type: "service-charge-accounts", units: [["stanley", "Flat 6"], ["stanley", "Flat 8"], ["stanley", "Communal Areas"]] },
  { title: "Lease — Shop, 5 Nugent Terrace", type: "business-lease", units: [["nugent", "Shop"]] },
  { title: "EICR — 5 Nugent Terrace", type: "eicr", units: [["nugent", "Shop"], ["nugent", "Flat 1"], ["nugent", "Flat 2"], ["nugent", "Flat 3"]] },
];
export type Visible = { title: string; partial: boolean };
/** A paper is visible only if its type and Papers area are permitted and at least one linked Unit is; anything about other Units is withheld. */
export function visiblePapers(a: Access): Visible[] {
  if (a.areas.papers === "none") return [];
  const types = typesFor(a);
  return PAPERS.filter((p) => types.includes(p.type) && p.units.some(([g, u]) => canSeeUnit(a, g, u)))
    .map((p) => ({ title: p.units.every(([g, u]) => canSeeUnit(a, g, u)) ? p.title : `${typeById(p.type).label} — ${list(p.units.filter(([g, u]) => canSeeUnit(a, g, u)).map(([, u]) => u))}`, partial: !p.units.every(([g, u]) => canSeeUnit(a, g, u)) }));
}
export function losses(a: Access, gid: string): string[] {
  const without = setGroup(a, gid, false);
  const lost = visiblePapers(a).filter((v) => !visiblePapers(without).some((w) => w.title === v.title)).map((v) => v.title);
  return [`${list(unitsFor(a, gid))} at ${groupName(gid)}`, ...lost.map((t) => `Paper: ${t}`), ...(a.areas.people !== "none" ? [`Contacts for ${groupName(gid)}`] : []), ...(a.areas.compliance !== "none" ? [`Compliance responsibilities for ${groupName(gid)}`] : [])];
}

export const peopleForPlace = (people: Person[], gid: string) => people.filter((p) => p.status !== "invited" && unitsFor(p.access, gid).length).map((p) => ({ person: p, scope: scopeLabel(p.access, gid)! }));
export const peopleForArea = (people: Person[], area: AreaId, atLeast: Level) => people.filter((p) => p.status !== "invited" && (atLeast === "change" ? p.access.areas[area] === "change" : p.access.areas[area] !== "none")).map((p) => ({ person: p, scope: `${levelLabel(area, p.access.areas[area])} · ${placeLines(p.access).join("; ")}` }));

// ---------- Overview presentation: grouping, chips and search ----------
export type Chip = { label: string; detail?: string; title?: string };
export type GroupKey = "superuser" | "portfolio" | "places" | "none";
export const GROUP_META: { key: GroupKey; title: string; explain: string }[] = [
  { key: "superuser", title: "Superusers", explain: "The whole portfolio, every paper, every area — and Security itself." },
  { key: "portfolio", title: "The whole portfolio", explain: "Every place, but only the papers and areas their work needs." },
  { key: "places", title: "Certain places", explain: "Only the buildings or Units you've chosen — never the rest of the portfolio." },
  { key: "none", title: "No places yet", explain: "Set up, but nothing to open until you choose a place for them." },
];
export const AREA_SHORT: Record<AreaId, string> = { papers: "Papers", people: "People", compliance: "Compliance", reading: "Reading" };
export const initials = (p: Person) => p.name.split(/\s+/).filter(Boolean).slice(0, 2).map((x) => x[0]!.toUpperCase()).join("");
export const groupKeyFor = (p: Person): GroupKey => (p.superuser ? "superuser" : p.access.portfolio ? "portfolio" : groupsWithAccess(p.access).length ? "places" : "none");

export const placeChips = (a: Access): Chip[] =>
  a.portfolio
    ? [{ label: "The whole portfolio" }]
    : groupsWithAccess(a).map((g) => {
        const u = unitsFor(a, g.id);
        const detail = a.groups[g.id] === "all" || u.length === g.units.length ? `All ${g.units.length} Units` : u.length <= 2 ? list(u) : `${u.length} Units`;
        return { label: g.name, detail };
      });

export const paperChip = (a: Access): Chip => {
  if (a.papers === "all") return { label: "All papers", title: paperLine(a) };
  if (!a.papers.length) return { label: "No papers" };
  if (a.papers.every((t) => ACCOUNTING.includes(t))) return { label: "Accounting papers", detail: `${a.papers.length} types`, title: paperLine(a) };
  return { label: "Selected papers", detail: `${a.papers.length} of ${ALL_TYPES.length}`, title: paperLine(a) };
};
export const areaChips = (a: Access): { area: AreaId; level: Level }[] => AREAS.filter((x) => a.areas[x.id] !== "none").map((x) => ({ area: x.id, level: a.areas[x.id] }));

const haystack = (p: Person) =>
  [
    p.name, p.role, p.email,
    p.superuser ? "superuser" : "",
    p.status === "suspended" ? "suspended" : p.status === "invited" ? "invited awaiting acceptance" : "active",
    p.access.portfolio ? `the whole portfolio ${GROUPS.map((g) => g.name).join(" ")}` : groupsWithAccess(p.access).map((g) => `${g.name} ${unitsFor(p.access, g.id).join(" ")}`).join(" "),
    paperChip(p.access).label,
    ...areaChips(p.access).map((x) => `${AREA_SHORT[x.area]} ${x.level === "change" ? "make changes" : "view"}`),
  ].join(" ").toLowerCase();

export const matchesQuery = (p: Person, q: string) => {
  const t = q.trim().toLowerCase();
  return !t || t.split(/\s+/).every((w) => haystack(p).includes(w));
};
export const accessGroups = (people: Person[], query = "") =>
  GROUP_META.map((meta) => ({ ...meta, people: people.filter((p) => groupKeyFor(p) === meta.key && matchesQuery(p, query)) })).filter((g) => g.people.length > 0);

export const PAGE = 6;
/** A group longer than PAGE shows only its first PAGE until asked, so a large team stays scannable. */
export const visiblePeople = (people: Person[], showAll: boolean, expand: boolean) => (showAll || expand || people.length <= PAGE ? people : people.slice(0, PAGE));

// ---------- Presets for invitations (editable starting points, never unrestricted by default) ----------
export const PRESETS: { id: string; label: string; access: Access }[] = [
  { id: "custom", label: "Custom access", access: { portfolio: false, groups: {}, papers: [], areas: areas("none", "none", "none", "none") } },
  { id: "full", label: "Full access", access: { ...FULL } },
  { id: "building", label: "Building manager", access: { portfolio: false, groups: {}, papers: allBut(ACCOUNTING), areas: areas("view", "view", "change", "change") } },
  { id: "accounts", label: "Accounts", access: { portfolio: true, groups: {}, papers: ACCOUNTING, areas: areas("view", "view", "none", "none") } },
  { id: "legal", label: "Legal adviser", access: { portfolio: false, groups: {}, papers: [...FAMILIES[0].types, ...FAMILIES[1].types].map((t) => t.id), areas: areas("view", "none", "none", "none") } },
  { id: "contractor", label: "Contractor", access: { portfolio: false, groups: {}, papers: [], areas: areas("none", "none", "view", "none") } },
];

// ---------- Conversation ----------
export type View = { kind: "overview" } | { kind: "person"; id: string } | { kind: "place"; gid: string } | { kind: "area"; area: AreaId; level: Level } | { kind: "invite" } | { kind: "preview"; id: string };
export type Invite = { step: "name" | "email" | "access" | "review"; name: string; email: string; role: string; access: Access; editingId?: string };
export type Pending = null | { kind: "save" | "suspend" | "restore" | "cancelInvite" | "resend" | "superuser" | "send"; id: string };
export type SecState = { people: Person[]; view: View; draft: { id: string; access: Access } | null; pending: Pending; invite: Invite | null; lit: string[] };
export const initialState = (): SecState => ({ people: INITIAL_PEOPLE, view: { kind: "overview" }, draft: null, pending: null, invite: null, lit: [] });
export type Out = { state: SecState; reply: string; choices?: string[] };

const findPerson = (people: Person[], t: string) => people.find((p) => new RegExp(`\\b${p.name.split(" ")[0]}\\b`, "i").test(t));
const ALIASES: Record<string, RegExp> = { burlington: /burlington/i, stanley: /stanley/i, nugent: /nugent/i };
const findGroup = (t: string) => GROUPS.find((g) => ALIASES[g.id].test(t));
const findUnit = (t: string, gid?: string) => {
  for (const g of GROUPS.filter((x) => !gid || x.id === gid)) for (const u of g.units) if (new RegExp(`\\b${u.replace(/ /g, "\\s*")}\\b`, "i").test(t)) return { gid: g.id, unit: u };
  return null;
};
const findTypes = (t: string): string[] => {
  if (/accounting|accounts/i.test(t)) return ACCOUNTING;
  const fam = FAMILIES.find((f) => new RegExp(`\\b${f.code}\\b|${f.label}`, "i").test(t));
  if (fam) return fam.types.map((x) => x.id);
  return ALL_TYPES.filter((x) => t.toLowerCase().includes(x.label.toLowerCase()) || t.toLowerCase().includes(x.plural.toLowerCase())).map((x) => x.id);
};
const findArea = (t: string): AreaId | null => (/compliance/i.test(t) ? "compliance" : /people we know|contacts/i.test(t) ? "people" : /reading/i.test(t) ? "reading" : /\bpapers area\b/i.test(t) ? "papers" : null);
const replace = (people: Person[], p: Person) => people.map((x) => (x.id === p.id ? p : x));

/** Prepare an edit to someone's access as a draft; nothing is saved until confirmed. */
export function propose(s: SecState, p: Person, next: Access): Out {
  const before = p.access;
  const changes = diff(before, next);
  if (!changes.length) return { state: { ...s, view: { kind: "person", id: p.id } }, reply: `${firstName(p)} already has that.` };
  return { state: { ...s, view: { kind: "person", id: p.id }, draft: { id: p.id, access: next }, pending: { kind: "save", id: p.id } }, reply: "", choices: ["Save changes", "Keep reviewing"] };
}

export function saveDraft(s: SecState): SecState {
  if (!s.draft) return s;
  const p = s.people.find((x) => x.id === s.draft!.id)!;
  return { ...s, people: replace(s.people, { ...p, access: s.draft.access }), draft: null, pending: null };
}

export function interpret(s: SecState, raw: string): Out {
  const t = raw.trim();
  const yes = /^(yes|save( changes)?|confirm|send( invitation)?|go ahead|do it|suspend access|restore access|cancel invitation|resend invitation|make superuser)\b/i.test(t);
  const no = /^(no|keep reviewing|not now|change access|leave it|cancel$)/i.test(t);

  // Confirmations
  if (s.pending && (yes || no)) {
    const p = s.people.find((x) => x.id === s.pending!.id);
    const n = p ? firstName(p) : "";
    if (no) {
      if (s.pending.kind === "send") return { state: { ...s, pending: null, invite: s.invite && { ...s.invite, step: "access" } }, reply: "Of course. Adjust the access on the right and tell me when it's ready." };
      return { state: { ...s, pending: null }, reply: "Nothing has changed. Carry on when you're ready." };
    }
    switch (s.pending.kind) {
      case "save": return { state: { ...saveDraft(s), lit: [] }, reply: `Done. I've updated ${n}'s access.` };
      case "suspend": return { state: { ...s, pending: null, people: replace(s.people, { ...p!, status: "suspended" }) }, reply: `${n}'s access is suspended. Their permissions are kept, so I can restore them whenever you like.` };
      case "restore": return { state: { ...s, pending: null, people: replace(s.people, { ...p!, status: "active" }) }, reply: `${n} has access again, exactly as before.` };
      case "cancelInvite": return { state: { ...s, pending: null, view: { kind: "overview" }, people: s.people.filter((x) => x.id !== p!.id) }, reply: `I've cancelled ${n}'s invitation. The link will no longer work.` };
      case "resend": return { state: { ...s, pending: null, people: replace(s.people, { ...p!, note: "Resent today" }) }, reply: `I've prepared a fresh invitation for ${n}. In this demonstration nothing is actually sent.` };
      case "superuser": return { state: { ...s, pending: null, people: replace(s.people, { ...p!, superuser: true, access: FULL }) }, reply: `${n} is now a Superuser.` };
      case "send": return sendInvite(s);
    }
  }

  // Invitation in progress
  if (s.invite && s.invite.step === "name" && !/\b(invite|who|show|give|remove|suspend|restore|cancel)\b/i.test(t)) {
    return { state: { ...s, invite: { ...s.invite, name: t, step: "email" } }, reply: `What's ${t.split(" ")[0]}'s email address?` };
  }
  if (s.invite && s.invite.step === "email") {
    const m = t.match(/[\w.+-]+@[\w-]+\.[\w.]+/);
    if (m) return { state: { ...s, invite: { ...s.invite, email: m[0], step: "access" } }, reply: `Thank you. Where should ${s.invite.name.split(" ")[0]} have access, and what may they see? Pick a starting point on the right, or tell me.`, choices: PRESETS.map((p) => p.label) };
    if (!/\b(invite|who|show|give|remove)\b/i.test(t)) return { state: s, reply: "I'll need an email address to prepare the invitation." };
  }
  if (s.invite && s.invite.step === "access") {
    const preset = PRESETS.find((p) => p.label.toLowerCase() === t.toLowerCase());
    if (preset) {
      const inv = { ...s.invite, access: { ...preset.access, groups: { ...preset.access.groups } } };
      return { state: { ...s, invite: inv }, reply: preset.id === "full" ? "Full access gives every place, paper and area. Please make sure that's intended." : `I've started from ${preset.label.toLowerCase()}. ${inv.access.portfolio ? "" : "Now choose the places on the right — nothing is included until you do."}` };
    }
    const g = findGroup(t), u = findUnit(t, g?.id);
    if (g || u) {
      let a = s.invite.access;
      a = u ? setUnit(a, u.gid, u.unit, true) : setGroup(a, g!.id, true);
      if (/compliance/i.test(t) && !/paper/i.test(t)) a = setArea(a, "compliance", "view");
      return { state: { ...s, invite: { ...s.invite, access: a } }, reply: `Added ${u ? `${u.unit} at ${groupName(u.gid)}` : `all of ${g!.name}`}. Review the invitation when you're happy.`, choices: ["Review the invitation"] };
    }
    if (/review/i.test(t)) return reviewInvite(s);
  }
  if (s.invite && /review the invitation/i.test(t)) return reviewInvite(s);

  // New intents
  if (/\binvite\b/i.test(t) && !/cancel|resend/i.test(t)) {
    const m = t.match(/invite\s+(?:a\s+|an\s+)?([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/);
    const contractor = /contractor/i.test(t);
    const name = m && !/someone|to\b/i.test(m[1]) ? m[1] : "";
    const inv: Invite = { step: name ? "email" : "name", name, email: "", role: contractor ? "Contractor" : "", access: PRESETS[contractor ? 5 : 0].access };
    return { state: { ...s, view: { kind: "invite" }, invite: inv, draft: null, pending: null }, reply: name ? `Of course. What's ${name.split(" ")[0]}'s email address?` : contractor ? "Of course. What's the contractor's name? I've started with view-only compliance and no places." : "Of course. Who are we inviting?" };
  }
  if (/review (existing )?users|everyone|overview|back to security/i.test(t)) return { state: { ...s, view: { kind: "overview" } }, reply: `${s.people.filter((p) => p.status !== "invited").length} people have access. Select anyone to see what they can reach.` };

  if (/who (can|has)/i.test(t) || /users with access to|people with access to/i.test(t)) {
    const area = findArea(t);
    if (area) {
      const level: Level = /make changes|change|update|edit/i.test(t) ? "change" : "view";
      const ppl = peopleForArea(s.people, area, level);
      return { state: { ...s, view: { kind: "area", area, level } }, reply: `${ppl.length} ${ppl.length === 1 ? "person" : "people"} can ${level === "change" ? "make changes to" : "see"} ${AREAS.find((x) => x.id === area)!.label}.` };
    }
    const g = findGroup(t);
    if (g) { const ppl = peopleForPlace(s.people, g.id); return { state: { ...s, view: { kind: "place", gid: g.id } }, reply: `I've found ${ppl.length} people with access to ${g.name}. Some see the whole building, others only certain Units.` }; }
  }

  const p = findPerson(s.people, t);
  if (p) {
    const n = firstName(p);
    if (/view access as|see as|preview/i.test(t)) return { state: { ...s, view: { kind: "preview", id: p.id } }, reply: `Here's what ${n} would see. Nothing about your own view has changed.` };
    if (/cancel/i.test(t) && p.status === "invited") return { state: { ...s, view: { kind: "person", id: p.id }, pending: { kind: "cancelInvite", id: p.id } }, reply: `${n} hasn't accepted yet. Cancelling means the invitation link stops working. Shall I cancel it?`, choices: ["Cancel invitation", "Keep it"] };
    if (/resend/i.test(t) && p.status === "invited") return { state: { ...s, view: { kind: "person", id: p.id }, pending: { kind: "resend", id: p.id } }, reply: `Shall I send ${n}'s invitation again?`, choices: ["Resend invitation", "Not now"] };
    if (/suspend/i.test(t)) {
      if (p.you) return { state: s, reply: "I won't suspend your own access — you'd be locked out of Security." };
      return { state: { ...s, view: { kind: "person", id: p.id }, pending: { kind: "suspend", id: p.id } }, reply: `Suspending stops ${n} using Hobson straight away, but keeps everything set up so it can be restored. Shall I suspend access?`, choices: ["Suspend access", "Not now"] };
    }
    if (/restore|reinstate|unsuspend/i.test(t)) return { state: { ...s, view: { kind: "person", id: p.id }, pending: { kind: "restore", id: p.id } }, reply: `Shall I restore ${n}'s access as it was?`, choices: ["Restore access", "Not now"] };
    if (/superuser/i.test(t)) {
      if (p.superuser) return { state: { ...s, view: { kind: "person", id: p.id } }, reply: p.you ? "You're a Superuser, and I'll keep it that way — I won't let you remove your own access to Security." : `${n} is already a Superuser.` };
      return { state: { ...s, view: { kind: "person", id: p.id }, pending: { kind: "superuser", id: p.id } }, reply: `A Superuser sees the whole portfolio and every paper, uses every area, and can invite people and change anyone's access — including yours. Shall I make ${n} a Superuser?`, choices: ["Make Superuser", "Not now"] };
    }
    const give = /\b(give|add|grant|allow|let)\b/i.test(t), remove = /\b(remove|revoke|take away|stop|withdraw)\b/i.test(t);
    if ((give || remove) && p.superuser) return { state: { ...s, view: { kind: "person", id: p.id } }, reply: p.you ? "That's your own access — as a Superuser it stays complete." : `${n} is a Superuser, so has everything already.` };
    if (give || remove) {
      const base = s.draft?.id === p.id ? s.draft.access : p.access;
      const types = findTypes(t.replace(/papers?\b/i, (m) => m));
      const g = findGroup(t), u = findUnit(t, g?.id);
      const area = findArea(t);
      let next = base, msg = "";
      if (types.length && /paper|memorand|deed|lease|certificate|accounts|survey|eicr|epc|assignment|letter/i.test(t)) {
        next = types.reduce((a, id) => setType(a, id, give), base);
        const what = types === ACCOUNTING ? "accounting papers" : list(types.map((x) => typeById(x).plural));
        msg = give ? `I'll add ${what} to ${n}'s papers.` : `I'll remove ${n}'s access to ${what}.`;
      } else if (u) {
        if (give && canSeeUnit(base, u.gid, u.unit)) return { state: { ...s, view: { kind: "person", id: p.id } }, reply: `${n} already has access to ${u.unit}.` };
        next = setUnit(base, u.gid, u.unit, give);
        msg = give ? `I can add ${u.unit} to ${n}'s ${unitsFor(base, u.gid).length ? "existing access at" : "access at"} ${groupName(u.gid)}.` : `I'll remove ${u.unit} at ${groupName(u.gid)} from ${n}'s access.`;
      } else if (g) {
        if (!give) {
          const lost = losses(base, g.id);
          next = setGroup(base, g.id, false);
          const out = propose(s, p, next);
          return { ...out, reply: `${n} would lose access to:\n${lost.map((l) => `• ${l}`).join("\n")}\n\nShall I save that change?` };
        }
        next = setGroup(base, g.id, true); msg = `I'll give ${n} all ${g.units.length} Units at ${g.name}.`;
      } else if (area) {
        const lvl: Level = remove ? "none" : /change|update|edit/i.test(t) || area === "reading" ? "change" : "view";
        next = setArea(base, area, lvl); msg = `I'll set ${AREAS.find((x) => x.id === area)!.label} to ${levelLabel(area, lvl).toLowerCase()} for ${n}.`;
      } else return { state: { ...s, view: { kind: "person", id: p.id } }, reply: `Which place, paper type or area should I change for ${n}?` };
      const out = propose(s, p, next);
      return out.reply ? out : { ...out, reply: `${msg} Everything else stays as it is.\n\nShall I save that change?` };
    }
    return { state: { ...s, view: { kind: "person", id: p.id } }, reply: p.status === "invited" ? `${n} hasn't accepted the invitation yet. You can change the access, resend or cancel it.` : `Here's ${n}'s access.` };
  }
  const g = findGroup(t);
  if (g) { const ppl = peopleForPlace(s.people, g.id); return { state: { ...s, view: { kind: "place", gid: g.id } }, reply: `I've found ${ppl.length} people with access to ${g.name}.` }; }
  return { state: s, reply: "I can invite someone, review a person's access, or show who can reach a place or an area. Who would you like to look at?" };
}

export function reviewInvite(s: SecState): Out {
  const inv = s.invite!;
  if (!inv.name || !inv.email) return { state: s, reply: "I'll need a name and an email address first." };
  if (!inv.access.portfolio && !Object.keys(inv.access.groups).length) return { state: s, reply: `${inv.name.split(" ")[0]} has no places yet. Choose at least one before I prepare the invitation.` };
  const n = inv.name.split(" ")[0];
  const where = inv.access.portfolio ? "the whole portfolio" : list(placeLines(inv.access));
  const areasOn = AREAS.filter((a) => inv.access.areas[a.id] !== "none");
  return {
    state: { ...s, view: { kind: "invite" }, invite: { ...inv, step: "review" }, pending: { kind: "send", id: "invite" } },
    reply: `${n} will be able to reach ${where}${inv.access.areas.papers !== "none" ? `, seeing ${paperLine(inv.access).toLowerCase()}` : ""}. ${areasOn.length ? `Areas: ${areasOn.map((a) => `${a.label} (${levelLabel(a.id, inv.access.areas[a.id]).toLowerCase()})`).join(", ")}.` : "No areas of Hobson yet."} ${inv.access.portfolio ? "" : `${n} won't see your other places.`}\n\nShall I send the invitation?`,
    choices: ["Send invitation", "Change access"],
  };
}

export function sendInvite(s: SecState): Out {
  const inv = s.invite!;
  if (inv.editingId) {
    return { state: { ...s, invite: null, pending: null, view: { kind: "person", id: inv.editingId }, people: s.people.map((p) => (p.id === inv.editingId ? { ...p, access: inv.access } : p)) }, reply: "Done. The invitation now carries the new access." };
  }
  const id = `inv-${inv.name.toLowerCase().replace(/\W+/g, "-")}-${s.people.length}`;
  const person: Person = { id, name: inv.name, role: inv.role || "Invited", email: inv.email, status: "invited", access: inv.access, note: "Invited today" };
  return { state: { ...s, people: [...s.people, person], invite: null, pending: null, view: { kind: "overview" }, lit: [id] }, reply: `I've prepared ${inv.name.split(" ")[0]}'s invitation. It's waiting under invitations. In this demonstration nothing is actually emailed.` };
}
