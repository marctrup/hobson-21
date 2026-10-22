// Prototype Contacts: one typed, local demonstration directory.
// A contact is an identity; relations say what they do and where. Nothing here is saved anywhere.

export type GroupId = "stanley" | "nugent" | "burlington" | "mews";
export const GROUPS: { id: GroupId; name: string; units: string[] }[] = [
  { id: "stanley", name: "Stanley House", units: ["Flat 3", "Flat 6", "Flat 8"] },
  { id: "nugent", name: "5 Nugent Terrace", units: ["Shop", "Flat 1", "Flat 2"] },
  { id: "burlington", name: "Burlington Gardens", units: ["Ground Floor", "Upper Floors"] },
  { id: "mews", name: "Stanley Mews", units: ["No. 1", "No. 2"] },
];
export const groupName = (g: GroupId) => GROUPS.find((x) => x.id === g)!.name;

export type Scope = { kind: "portfolio" } | { kind: "group"; group: GroupId } | { kind: "unit"; group: GroupId; unit: string };
export type Kind = "contractor" | "legal" | "accounting" | "design" | "team" | "adviser" | "landlord" | "tenant" | "occupant" | "other";
export type Contact = { id: string; person: string | null; org: string | null; kind: Kind; phones: string[]; email: string | null };
/** service is the matter looked after (Plumbing, Legal advice…); role is how they relate (Preferred contractor, Tenant…). */
export type Relation = { id: string; contactId: string; role: string; service: string | null; scope: Scope };
export type Directory = { contacts: Contact[]; relations: Relation[] };

export const KIND_LABEL: Record<Kind, string> = { contractor: "Contractors", legal: "Legal services", accounting: "Accounting services", design: "Architectural and surveying services", team: "Staff", adviser: "Other advisers", landlord: "Landlords", tenant: "Tenants", occupant: "Occupants' contacts", other: "Others" };

const rel = (contactId: string, role: string, service: string | null, scope: Scope): Relation => ({ id: `${contactId}:${role}:${service ?? ""}:${scopeKey(scope)}`, contactId, role, service, scope });
export const scopeKey = (s: Scope) => (s.kind === "portfolio" ? "portfolio" : s.kind === "group" ? s.group : `${s.group}/${s.unit}`);
export const scopeLabel = (s: Scope) => (s.kind === "portfolio" ? "Whole portfolio" : s.kind === "group" ? groupName(s.group) : `${s.unit}, ${groupName(s.group)}`);

export const INITIAL_DIRECTORY: Directory = {
  contacts: [
    { id: "bright", person: "Dan Reeve", org: "Bright Electrical", kind: "contractor", phones: ["020 7946 0182"], email: "dan@brightelectrical.co.uk" },
    { id: "skyline", person: null, org: "Skyline Roofing", kind: "contractor", phones: ["020 7946 0447"], email: null },
    { id: "cleanwell", person: "Amy Fox", org: "Cleanwell Services", kind: "contractor", phones: [], email: "amy@cleanwell.co.uk" },
    { id: "pipeline", person: null, org: "Pipeline Plumbing", kind: "contractor", phones: ["020 7946 0730"], email: null },
    { id: "hammond-reed", person: "Claire Hammond", org: "Hammond & Reed Solicitors", kind: "legal", phones: ["020 7946 0310"], email: "claire@hammondreed.co.uk" },
    { id: "clarke-accountancy", person: "Raj Patel", org: "Clarke Accountancy", kind: "accounting", phones: ["020 7946 0588"], email: "raj@clarkeaccountancy.co.uk" },
    { id: "foster-architects", person: "Nina Foster", org: "Foster Architects", kind: "design", phones: ["020 7946 0264"], email: null },
    { id: "ruth-okoye", person: "Ruth Okoye", org: null, kind: "team", phones: ["07700 900271"], email: "ruth.okoye@example.com" },
    { id: "maya-singh", person: "Maya Singh", org: "Arden Studio", kind: "occupant", phones: ["07700 900318"], email: "office@ardenstudio.example" },
    { id: "leo-grant", person: "Leo Grant", org: null, kind: "occupant", phones: ["07700 900562"], email: null },
    { id: "ashdown", person: "Helen Carr", org: "Ashdown Estates", kind: "landlord", phones: [], email: "helen.carr@ashdownestates.co.uk" },
  ],
  relations: [
    rel("bright", "Preferred contractor", "Electrical", { kind: "group", group: "stanley" }),
    rel("bright", "Preferred contractor", "Electrical", { kind: "group", group: "nugent" }),
    rel("skyline", "Preferred contractor", "Roofing", { kind: "group", group: "burlington" }),
    rel("pipeline", "Preferred contractor", "Plumbing", { kind: "group", group: "burlington" }),
    rel("cleanwell", "Preferred contractor", "Cleaning", { kind: "group", group: "stanley" }),
    rel("hammond-reed", "Lawyer", "Legal advice", { kind: "group", group: "stanley" }),
    rel("clarke-accountancy", "Accountant", "Accounting", { kind: "portfolio" }),
    rel("foster-architects", "Architect", "Architecture", { kind: "group", group: "burlington" }),
    rel("ruth-okoye", "Property administrator", "Administration", { kind: "portfolio" }),
    rel("maya-singh", "Occupant contact", "Office manager", { kind: "unit", group: "burlington", unit: "Ground Floor" }),
    rel("leo-grant", "Occupant contact", "Day-to-day access", { kind: "unit", group: "nugent", unit: "Flat 2" }),
    rel("ashdown", "Landlord", null, { kind: "group", group: "burlington" }),
  ],
};

export const contactName = (c: Contact) => c.org ?? c.person ?? "Unnamed";
export const contactById = (d: Directory, id: string) => d.contacts.find((c) => c.id === id);
export const relationsOf = (d: Directory, id: string) => d.relations.filter((r) => r.contactId === id);
export const inGroup = (s: Scope, g: GroupId) => s.kind !== "portfolio" && s.group === g;

/** The preferred contractor that actually applies: a Unit's own preference, else its Unit Group's. */
export function effectivePreferred(d: Directory, group: GroupId, service: string, unit?: string): { relation: Relation; exception: boolean } | null {
  const pref = d.relations.filter((r) => r.role === "Preferred contractor" && r.service === service);
  const own = unit ? pref.find((r) => r.scope.kind === "unit" && r.scope.group === group && r.scope.unit === unit) : undefined;
  if (own) return { relation: own, exception: true };
  const g = pref.find((r) => r.scope.kind === "group" && r.scope.group === group);
  return g ? { relation: g, exception: false } : null;
}

export function applyDraft(d: Directory, draft: Draft): Directory {
  const exists = d.contacts.some((c) => c.id === draft.contact.id);
  const contacts = exists ? d.contacts.map((c) => (c.id === draft.contact.id ? draft.contact : c)) : [...d.contacts, draft.contact];
  let relations = d.relations.filter((r) => !(draft.removeRelationIds ?? []).includes(r.id));
  for (const r of draft.relations) if (!relations.some((x) => x.id === r.id)) relations = [...relations, r];
  return { contacts, relations };
}

// ---------- Conversation ----------

export type DraftStage = "establishing" | "details" | "belongs";
export type Draft = { contact: Contact; existing: boolean; relations: Relation[]; removeRelationIds?: string[]; stage: DraftStage; note?: string; done: string };
export type Pending =
  | { kind: "details"; draft: Draft; asking: string }
  | { kind: "confirm"; draft: Draft; question: string }
  | { kind: "same"; draft: Draft; candidateId: string }
  | { kind: "who"; group: GroupId; unit: string; service: string }
  | { kind: "phone"; contactId: string };
export type Tab = "people" | "places";
export type ViewChange = { tab?: Tab; focusContact?: string | null; focusGroup?: GroupId | null; highlight?: string[] };
export type Outcome = { reply: string; pending: Pending | null; directory?: Directory; view?: ViewChange; choices?: string[] };

const YES = /^(yes|yep|yeah|correct|that's right|go ahead|please do|ok|okay)\b/i;
const NO = /^(no|not now|cancel|leave it|don't)\b/i;
const PHONE = /(\+?\d[\d ]{8,}\d)/g;
const EMAIL = /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/;

const SERVICES: [RegExp, string, string][] = [
  [/plumb/, "Plumbing", "plumber"], [/electric/, "Electrical", "electrician"], [/roof/, "Roofing", "roofer"],
  [/clean/, "Cleaning", "cleaner"], [/garden/, "Gardening", "gardener"], [/build/, "Building", "builder"],
];
const serviceIn = (t: string) => SERVICES.find(([re]) => re.test(t.toLowerCase()));
export const tradeWord = (service: string) => SERVICES.find(([, s]) => s === service)?.[2] ?? `${service.toLowerCase()} contractor`;

export function groupIn(t: string): GroupId | null {
  const s = t.toLowerCase();
  if (/stanley mews/.test(s)) return "mews";
  if (/stanley/.test(s)) return "stanley";
  if (/nugent/.test(s)) return "nugent";
  if (/burlington/.test(s)) return "burlington";
  return null;
}
export function unitIn(t: string, group?: GroupId | null): { group: GroupId; unit: string } | null {
  const s = t.toLowerCase();
  for (const g of GROUPS) {
    if (group && g.id !== group) continue;
    const u = g.units.find((u) => new RegExp(`\\b${u.toLowerCase().replace(".", "\\.")}\\b`).test(s));
    if (u) return { group: g.id, unit: u };
  }
  return null;
}
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const clean = (s: string) => s.trim().replace(/[.!?]+$/, "");
const first = (c: Contact) => (c.person ?? contactName(c)).split(" ")[0];

export function findContact(d: Directory, t: string): Contact | null {
  const s = t.toLowerCase();
  return d.contacts.find((c) => (c.org && s.includes(c.org.toLowerCase())) || (c.person && s.includes(c.person.toLowerCase())))
    ?? d.contacts.find((c) => c.person && new RegExp(`\\b${c.person.split(" ")[0].toLowerCase()}\\b`).test(s))
    ?? null;
}
/** A near match: same leading word but not the same name — never merged without asking. */
export function similarOrg(d: Directory, org: string): Contact | null {
  const lead = org.toLowerCase().split(/\s+/)[0];
  if (lead.length < 4) return null;
  return d.contacts.find((c) => c.org && c.org.toLowerCase() !== org.toLowerCase() && c.org.toLowerCase().split(/\s+/)[0] === lead) ?? null;
}

function withDetails(c: Contact, text: string): Contact {
  const phones = [...(text.match(PHONE) ?? [])].map((p) => p.trim()).filter((p) => !c.phones.includes(p));
  const email = text.match(EMAIL)?.[0] ?? null;
  return { ...c, phones: [...c.phones, ...phones], email: email ?? c.email };
}

function confirm(draft: Draft, question: string, lead?: string): Outcome {
  return { reply: `${lead ? `${lead}\n\n` : ""}${question}`, pending: { kind: "confirm", draft: { ...draft, stage: "belongs" }, question }, choices: ["Yes", "Not now"], view: { focusContact: null } };
}

export const HELP = "I can add someone you work with, note who looks after what and where, find who you prefer for a service, or change what I have. Tell me as you would a colleague, or attach a spreadsheet.";

export function interpret(d: Directory, pending: Pending | null, raw: string): Outcome {
  const text = raw.trim();
  const t = text.toLowerCase();

  if (pending?.kind === "confirm") {
    if (YES.test(text)) {
      const directory = applyDraft(d, pending.draft);
      return { reply: pending.draft.done, pending: null, directory, view: { focusContact: pending.draft.contact.id, highlight: pending.draft.relations.map((r) => r.id) } };
    }
    if (NO.test(text)) return { reply: "Very well. I've left everything as it was.", pending: null };
  }
  if (pending?.kind === "details") {
    const contact = withDetails(pending.draft.contact, text);
    const got = contact.phones.length !== pending.draft.contact.phones.length || contact.email !== pending.draft.contact.email;
    if (got || NO.test(text) || /don't have|not to hand|later/.test(t)) {
      const draft = { ...pending.draft, contact };
      const who = draft.contact.person ? `${first(draft.contact)}'s` : `${contactName(draft.contact)}'s`;
      return confirm(draft, `${pending.asking}\n\nIs that right?`, got ? `I have ${who} details.` : "I'll leave the details blank for now.");
    }
  }
  if (pending?.kind === "same") {
    const cand = contactById(d, pending.candidateId)!;
    if (YES.test(text)) {
      const contact = withDetails(cand, [...pending.draft.contact.phones, pending.draft.contact.email ?? ""].join(" "));
      const relations = pending.draft.relations.map((r) => rel(cand.id, r.role, r.service, r.scope));
      const draft: Draft = { ...pending.draft, contact: { ...contact, person: contact.person ?? pending.draft.contact.person }, existing: true, relations, done: `Done. ${cand.org} is now also recorded for ${relations.map((r) => scopeLabel(r.scope)).join(", ")}.` };
      return confirm(draft, `I'll add this to ${cand.org} rather than create a second entry. Is that right?`, "Good.");
    }
    if (NO.test(text)) return confirm(pending.draft, "Then I'll keep them as a separate company. Is that right?");
  }
  if (pending?.kind === "who") {
    const existing = findContact(d, text);
    const org = existing ? contactName(existing) : clean(text.split(/[,;]|\s+on\s+|\s+-\s+/)[0].replace(/^(use|it's|it is|try)\s+/i, ""));
    const base: Contact = existing ?? { id: slug(org), person: null, org, kind: "contractor", phones: [], email: null };
    const contact = withDetails(base, text);
    const r = rel(contact.id, "Preferred contractor", pending.service, { kind: "unit", group: pending.group, unit: pending.unit });
    const groupPref = effectivePreferred(d, pending.group, pending.service);
    const keep = groupPref ? ` ${contactName(contactById(d, groupPref.relation.contactId)!)} stays the preferred ${tradeWord(pending.service)} for the rest of ${groupName(pending.group)}.` : "";
    const draft: Draft = { contact, existing: !!existing, relations: [r], stage: "belongs", done: `Done. ${contactName(contact)} is recorded for ${pending.unit} specifically.` };
    return confirm(draft, `I'll associate ${contactName(contact)} with ${pending.unit} specifically for ${pending.service.toLowerCase()}.${keep}\n\nIs that right?`, existing ? `I already have ${contactName(existing)}, so I'll use that entry.` : undefined);
  }
  if (pending?.kind === "phone") {
    const c = contactById(d, pending.contactId)!;
    const next = withDetails(c, text);
    if (next.phones.length > c.phones.length) {
      const draft: Draft = { contact: next, existing: true, relations: [], stage: "details", done: `Done. ${first(c)} now has ${next.phones.length} telephone numbers.` };
      return { ...confirm(draft, `I'll add ${next.phones[next.phones.length - 1]} alongside ${c.phones.length ? c.phones.join(", ") : "what I have"}. Is that right?`), pending: { kind: "confirm", draft: { ...draft, stage: "details" }, question: "" } };
    }
  }

  // ---- Fresh instructions ----

  // Remove a preference, never the contact.
  let m = text.match(/remove (.+?) as (?:the |our )?preferred (\w+) (?:for|at) (.+)/i);
  if (m) {
    const c = findContact(d, m[1]); const g = groupIn(m[3]); const svc = serviceIn(m[2]);
    const r = c && g && svc && d.relations.find((x) => x.contactId === c.id && x.service === svc[1] && x.scope.kind === "group" && x.scope.group === g);
    if (!c || !g || !svc || !r) return { reply: `I don't have ${clean(m[1])} recorded as the preferred ${clean(m[2])} for ${clean(m[3])}, so there's nothing to remove.`, pending: null };
    const others = relationsOf(d, c.id).filter((x) => x.id !== r.id);
    const draft: Draft = { contact: c, existing: true, relations: [], removeRelationIds: [r.id], stage: "belongs", done: `Done. ${contactName(c)} is no longer the preferred ${tradeWord(svc[1])} for ${groupName(g)}.` };
    return { ...confirm(draft, `I'll stop treating ${contactName(c)} as the preferred ${tradeWord(svc[1])} for ${groupName(g)}. I'll keep their details${others.length ? ` and their ${others.length === 1 ? "other association" : `${others.length} other associations`}` : ""}.\n\nShall I?`), view: { focusContact: c.id, highlight: [r.id] } };
  }

  // Who is our preferred X at G?
  m = text.match(/who(?:'s| is) (?:our |the )?preferred (\w+)(?: (?:at|for) (.+))?/i);
  if (m) {
    const svc = serviceIn(m[1]); const g = groupIn(m[2] ?? ""); const u = unitIn(m[2] ?? "", g);
    if (svc && (g || u)) {
      const group = (u?.group ?? g)!;
      const eff = effectivePreferred(d, group, svc[1], u?.unit);
      if (!eff) return { reply: `I don't have a preferred ${svc[2]} recorded for ${groupName(group)}.`, pending: null, view: { tab: "places", focusGroup: group, focusContact: null } };
      const c = contactById(d, eff.relation.contactId)!;
      return { reply: `${contactName(c)}${c.person && c.org ? `, through ${c.person}` : ""}. I have them recorded for ${eff.exception ? `${u!.unit} specifically` : groupName(group)}.`, pending: null, view: { tab: "places", focusGroup: group, focusContact: null, highlight: [eff.relation.id] } };
    }
  }

  // Show contractors / contacts at G.
  m = text.match(/show (?:me )?(?:all )?(?:the |our )?(contractors|contacts|people)(?: (?:at|for) (.+))?/i);
  if (m) {
    const g = groupIn(m[2] ?? "");
    if (!g) return { reply: "Here is everyone I know, by who they are.", pending: null, view: { tab: "people", focusContact: null, focusGroup: null } };
    const rs = d.relations.filter((r) => inGroup(r.scope, g) && (m![1].toLowerCase() !== "contractors" || r.role === "Preferred contractor"));
    return { reply: rs.length ? `At ${groupName(g)} I have ${new Set(rs.map((r) => r.contactId)).size} ${m[1].toLowerCase() === "contractors" ? "contractors" : "people and organisations"}. They're on the right.` : `I have no ${m[1].toLowerCase()} recorded at ${groupName(g)} yet.`, pending: null, view: { tab: "places", focusGroup: g, focusContact: null, highlight: rs.map((r) => r.id) } };
  }

  // Add another phone number for X.
  m = text.match(/add (?:another|a second|a new) (?:phone|telephone) number for (.+)/i);
  if (m) {
    const c = findContact(d, m[1]);
    if (!c) return { reply: `I don't have ${clean(m[1])} yet. Shall we add them first?`, pending: null };
    const inline = withDetails(c, m[1]);
    if (inline.phones.length > c.phones.length) return interpret(d, { kind: "phone", contactId: c.id }, m[1]);
    return { reply: `Of course. What is ${first(c)}'s other number?`, pending: { kind: "phone", contactId: c.id }, view: { focusContact: c.id } };
  }

  // X is also the person we should contact about Y at G.
  m = text.match(/^(.+?) is also (?:the person|who) we should (?:contact|call|speak to) (?:about|for) (.+?) (?:at|for) (.+)$/i);
  if (m) {
    const c = findContact(d, m[1]); const g = groupIn(m[3]);
    if (!c) return { reply: `I don't have ${clean(m[1])} yet. Shall we add them first?`, pending: null };
    if (!g) return { reply: "Which Unit Group do you mean?", pending: null };
    const service = clean(m[2]).replace(/^\w/, (x) => x.toUpperCase());
    const r = rel(c.id, `${service} contact`, service, { kind: "group", group: g });
    const draft: Draft = { contact: c, existing: true, relations: [r], stage: "belongs", done: `Done. ${first(c)} is now also your ${service.toLowerCase()} contact for ${groupName(g)}.` };
    return confirm(draft, `I'll add that to ${c.person ?? contactName(c)}'s existing record: ${service.toLowerCase()} contact for ${groupName(g)}. Everything else I have for ${first(c)} stays as it is.\n\nIs that right?`);
  }

  // Make X the preferred Y for G (as well).
  m = text.match(/make (.+?) (?:the |our )?preferred (\w+) (?:for|at) (.+?)(?: as well| too)?[.!]?$/i);
  if (m) {
    const c = findContact(d, m[1]); const svc = serviceIn(m[2]); const u = unitIn(m[3]); const g = u?.group ?? groupIn(m[3]);
    if (!svc || !g) return { reply: HELP, pending: null };
    if (!c) {
      const near = similarOrg(d, clean(m[1]));
      if (near) return { reply: `I don't have ${clean(m[1])} by that name. Do you mean ${near.org}?`, pending: null, choices: [`Make ${near.org} the preferred ${svc[2]} for ${clean(m[3])}`] };
      return { reply: `I don't have ${clean(m[1])} yet. Tell me who they are and I'll add them.`, pending: null };
    }
    const scope: Scope = u ? { kind: "unit", ...u } : { kind: "group", group: g };
    const r = rel(c.id, "Preferred contractor", svc[1], scope);
    const already = relationsOf(d, c.id).filter((x) => x.role === "Preferred contractor");
    const draft: Draft = { contact: c, existing: true, relations: [r], stage: "belongs", done: `Done. ${contactName(c)} is now also your preferred ${tradeWord(svc[1])} for ${scopeLabel(scope)}.` };
    return { ...confirm(draft, `Shall I add ${scopeLabel(scope)} to ${contactName(c)}'s existing entry?`, `I have ${contactName(c)} recorded${already.length ? ` for ${already.map((x) => scopeLabel(x.scope)).join(" and ")}` : ""}. I won't create a second entry.`) };
  }

  // Use a different Y for U.
  m = text.match(/use a different (\w+) (?:for|at) (.+)/i);
  if (m) {
    const svc = serviceIn(m[1]); const u = unitIn(m[2], groupIn(m[2]));
    if (svc && u) {
      const eff = effectivePreferred(d, u.group, svc[1]);
      const now = eff ? `${contactName(contactById(d, eff.relation.contactId)!)} looks after ${svc[1].toLowerCase()} for the whole of ${groupName(u.group)}. ` : "";
      return { reply: `${now}I'll keep that for the rest of the building and record a different ${svc[2]} for ${u.unit} specifically.\n\nWho should it be?`, pending: { kind: "who", group: u.group, unit: u.unit, service: svc[1] }, view: { tab: "places", focusGroup: u.group, focusContact: null, highlight: eff ? [eff.relation.id] : [] } };
    }
    if (svc) return { reply: `Which Unit do you mean? For example, Flat 8 at Stanley House.`, pending: null };
  }

  // Add X as the tenant of U.
  m = text.match(/add (.+?) as (?:the |a )?tenant (?:of|at) (.+)/i);
  if (m) {
    const u = unitIn(m[2], groupIn(m[2]));
    if (!u) return { reply: `Which Unit is that? I'd rather not guess.`, pending: null };
    const name = clean(m[1]);
    const existing = findContact(d, name);
    const contact: Contact = existing ?? { id: slug(name), person: name, org: null, kind: "tenant", phones: [], email: null };
    const r = rel(contact.id, "Tenant", null, { kind: "unit", ...u });
    const draft: Draft = { contact, existing: !!existing, relations: [r], stage: "belongs", note: "Recording the person only. The tenancy agreement itself stays with Papers.", done: `Done. ${name} is recorded as the tenant of ${u.unit}, ${groupName(u.group)}.` };
    return confirm(draft, `I'll record ${name} as the tenant of ${u.unit} at ${groupName(u.group)}. I'll note the person only — I won't treat this as a tenancy agreement until I've seen the paper.\n\nIs that right?`);
  }

  // Add X from O. He's our preferred Y for G.
  m = text.match(/add (.+?) (?:from|of) (.+?)[.,]\s*(?:he|she|they)(?:'s| is| are) (?:our )?preferred (\w+) (?:for|at) (.+?)[.!]?$/i);
  if (m) {
    const person = clean(m[1]); const org = clean(m[2]); const svc = serviceIn(m[3]); const u = unitIn(m[4]); const g = u?.group ?? groupIn(m[4]);
    if (svc && g) {
      const scope: Scope = u ? { kind: "unit", ...u } : { kind: "group", group: g };
      const exact = d.contacts.find((c) => c.org?.toLowerCase() === org.toLowerCase());
      const contact: Contact = exact ? { ...exact, person: exact.person ?? person } : { id: slug(org), person, org, kind: "contractor", phones: [], email: null };
      const r = rel(contact.id, "Preferred contractor", svc[1], scope);
      const asking = `I'll associate ${org} with ${scopeLabel(scope)} for ${svc[1].toLowerCase()} work.`;
      const draft: Draft = { contact, existing: !!exact, relations: [r], stage: "establishing", done: `Done. ${org} is now recorded as your preferred ${svc[1].toLowerCase()} contractor for ${scopeLabel(scope)}.` };
      const near = !exact && similarOrg(d, org);
      if (near) return { reply: `Let me check whether I already have this contact. I have ${near.org}${near.person ? ` (${near.person})` : ""}. Is this the same company?`, pending: { kind: "same", draft, candidateId: near.id }, choices: ["Yes, the same company", "No, a different company"], view: { focusContact: null } };
      if (exact) return confirm(draft, `${asking}\n\nIs that right?`, `I already have ${org}, so I'll add ${person} to that entry rather than create another.`);
      return { reply: `Certainly. I'll add ${org} as your preferred ${svc[1].toLowerCase()} contractor for ${scopeLabel(scope)}.\n\nDo you have ${person.split(" ")[0]}'s telephone number or email address?`, pending: { kind: "details", draft: { ...draft, stage: "details" }, asking }, view: { focusContact: null }, choices: ["I don't have them to hand"] };
    }
  }

  // Add X at O. He handles our Y at G.
  m = text.match(/add (.+?) (?:at|from) (.+?)[.,]\s*(?:he|she|they) (?:handles?|looks? after|deals? with) (?:our |all our )?(.+?) (?:at|for) (.+?)[.!]?$/i);
  if (m) {
    const person = clean(m[1]); const org = clean(m[2]); const g = groupIn(m[4]); const matter = clean(m[3]);
    if (g) {
      const legal = /lease|legal|lawyer|solicitor|conveyanc/i.test(matter + org);
      const exact = d.contacts.find((c) => c.org?.toLowerCase() === org.toLowerCase());
      const contact: Contact = exact ?? { id: slug(org), person, org, kind: legal ? "legal" : "adviser", phones: [], email: null };
      const r = rel(contact.id, legal ? "Lawyer" : "Adviser", legal ? "Legal advice" : matter.replace(/^\w/, (x) => x.toUpperCase()), { kind: "group", group: g });
      const draft: Draft = { contact, existing: !!exact, relations: [r], stage: "belongs", note: `Handles ${matter}.`, done: `Done. ${person} at ${org} is recorded for ${matter} at ${groupName(g)}.` };
      return confirm(draft, `I'll add ${person} at ${org} as your ${legal ? "lawyer" : "adviser"} for ${matter} at ${groupName(g)}. I don't have a telephone number or email yet, so I'll leave those blank.\n\nIs that right?`);
    }
  }

  // Add X. She's our <role>. (email…)
  m = text.match(/add ([A-Z][\w'-]+(?: [A-Z][\w'-]+)+)[.,]\s*(?:he|she|they)(?:'s| is| are) (?:our |the )?(.+?)[.!](.*)$/i);
  if (m) {
    const person = clean(m[1]); const role = clean(m[2]).replace(/^\w/, (x) => x.toUpperCase());
    const existing = findContact(d, person);
    const contact = withDetails(existing ?? { id: slug(person), person, org: null, kind: "team", phones: [], email: null }, m[3]);
    const g = groupIn(m[3]);
    const scope: Scope = g ? { kind: "group", group: g } : { kind: "portfolio" };
    const r = rel(contact.id, role, /portfolio/i.test(role) ? "Portfolio management" : role, scope);
    const draft: Draft = { contact, existing: !!existing, relations: [r], stage: "belongs", done: `Done. ${person} is recorded as your ${role.toLowerCase()}.` };
    return confirm(draft, `I'll add ${person} as your ${role.toLowerCase()}, across ${g ? groupName(g) : "the whole portfolio"}${contact.email ? `, with ${contact.email}` : ""}.\n\nIs that right?`);
  }

  if (/^(hello|hi|help|what can you do)/i.test(t)) return { reply: HELP, pending: null };
  return { reply: `I'm not sure I've understood. ${HELP}`, pending };
}

// ---------- Spreadsheet ----------

export type BatchEntry = { contact: Contact; relations: Relation[] };
const entry = (contact: Contact, role: string, service: string | null, scope: Scope): BatchEntry => ({ contact, relations: [rel(contact.id, role, service, scope)] });
const C = (id: string, person: string | null, org: string | null, kind: Kind, phone: string | null, email: string | null): Contact => ({ id, person, org, kind, phones: phone ? [phone] : [], email });

export const SPREADSHEET_NAME = "Portfolio contacts 2026.xlsx";

export const BATCH_STRAIGHT: BatchEntry[] = [
  entry(C("hale", "Tom Hale", "Hale Building Services", "contractor", "020 7946 0611", "tom@halebuilding.co.uk"), "Preferred contractor", "Building", { kind: "group", group: "burlington" }),
  entry(C("brightside", "Rita Kowalski", "Brightside Cleaning", "contractor", "07700 900311", null), "Preferred contractor", "Cleaning", { kind: "group", group: "nugent" }),
  entry(C("price-locks", "Owen Price", "Price Locksmiths", "contractor", "020 7946 0254", null), "Preferred contractor", "Locksmith", { kind: "portfolio" }),
  entry(C("fiona-grant", "Fiona Grant", null, "team", null, "fiona.grant@example.com"), "Accounts assistant", "Accounts", { kind: "portfolio" }),
  entry(C("ben-adeyemi", "Ben Adeyemi", null, "team", "07700 900402", "ben.adeyemi@example.com"), "Property manager", "Property management", { kind: "group", group: "stanley" }),
  entry(C("moss", "Clara Moss", "Moss & Partners", "accounting", "020 7946 0918", "clara@mosspartners.co.uk"), "Accountant", "Accounting", { kind: "portfolio" }),
  entry(C("safegas", "Ian Fletcher", "SafeGas Heating", "contractor", "07700 900127", null), "Preferred contractor", "Gas & heating", { kind: "group", group: "stanley" }),
  entry(C("liftcare", "Nadia Rahman", "LiftCare UK", "contractor", "020 7946 0377", "service@liftcare.example"), "Preferred contractor", "Lift maintenance", { kind: "group", group: "burlington" }),
  entry(C("whitaker", "Hugh Whitaker", "Whitaker Surveyors", "design", "020 7946 0860", null), "Surveyor", "Surveying", { kind: "portfolio" }),
  entry(C("ella-turner", "Ella Turner", null, "tenant", "07700 900588", null), "Tenant", null, { kind: "unit", group: "nugent", unit: "Flat 1" }),
  entry(C("george-lim", "George Lim", null, "tenant", null, "george.lim@example.com"), "Tenant", null, { kind: "unit", group: "stanley", unit: "Flat 8" }),
  entry(C("pemberton", "Alice Pemberton", "Pemberton Estates", "landlord", "020 7946 0145", null), "Landlord", null, { kind: "group", group: "nugent" }),
  entry(C("firesafe", "Sam Ortiz", "FireSafe Systems", "contractor", "020 7946 0503", null), "Preferred contractor", "Fire safety", { kind: "group", group: "burlington" }),
  entry(C("mensah", "Joy Mensah", "Mensah Pest Control", "contractor", "07700 900650", null), "Preferred contractor", "Pest control", { kind: "portfolio" }),
  entry(C("doyle", "Kieran Doyle", "Doyle Glazing", "contractor", "020 7946 0721", null), "Preferred contractor", "Glazing", { kind: "group", group: "stanley" }),
  entry(C("hart", "Lucy Hart", "Hart Insurance Brokers", "adviser", "020 7946 0699", "lucy@hartbrokers.co.uk"), "Insurance broker", "Insurance", { kind: "portfolio" }),
  entry(C("webbs-deli", "Marcus Webb", "Webb's Deli", "tenant", "07700 900733", null), "Tenant", null, { kind: "unit", group: "nugent", unit: "Shop" }),
];

export type Resolution = { kind: "new"; entry: BatchEntry } | { kind: "merge"; targetId: string; phones: string[]; email: string | null; relations: Relation[] } | { kind: "unsure" };
export type BatchCheck = { id: string; row: string; group: "duplicate" | "check"; issue: string; question: string; options: { label: string; resolution: Resolution }[] };

const ex = (id: string, person: string | null, org: string | null, kind: Kind, phone: string | null, role: string, service: string | null, scope: Scope) => entry(C(id, person, org, kind, phone, null), role, service, scope);

export const BATCH_CHECKS: BatchCheck[] = [
  { id: "d-bright", row: "Bright Electrical Services Ltd — 020 7946 0199 — electrician, 5 Nugent Terrace", group: "duplicate", issue: "Very like Bright Electrical, already recorded", question: "I already have Bright Electrical as your electrician at 5 Nugent Terrace. This row says Bright Electrical Services Ltd, with another number. I think it's the same company. Shall I add the number to the entry I have?",
    options: [{ label: "Yes, the same company", resolution: { kind: "merge", targetId: "bright", phones: ["020 7946 0199"], email: null, relations: [] } }, { label: "No, a different company", resolution: { kind: "new", entry: ex("bright-services", null, "Bright Electrical Services Ltd", "contractor", "020 7946 0199", "Contractor", "Electrical", { kind: "group", group: "nugent" }) } }] },
  { id: "d-skyline", row: "Skyline Roofing & Building — Rob Kerr — 07700 900214 — Burlington Gardens", group: "duplicate", issue: "May be Skyline Roofing, already recorded", question: "This looks like Skyline Roofing, your roofer at Burlington Gardens, now listing Rob Kerr. Is it the same company?",
    options: [{ label: "Yes, the same company", resolution: { kind: "merge", targetId: "skyline", phones: ["07700 900214"], email: null, relations: [] } }, { label: "No, a different company", resolution: { kind: "new", entry: ex("skyline-building", "Rob Kerr", "Skyline Roofing & Building", "contractor", "07700 900214", "Contractor", "Building", { kind: "group", group: "burlington" }) } }] },
  { id: "c-ellis", row: "Mark Ellis, Ellis Decorating — decorator — “Stanley”", group: "check", issue: "“Stanley” could be two places", question: "Mark Ellis is listed against “Stanley”. You have Stanley House and Stanley Mews. I'd suggest Stanley House, where most of the decorating rows sit. Which is it?",
    options: [{ label: "Stanley House", resolution: { kind: "new", entry: ex("ellis", "Mark Ellis", "Ellis Decorating", "contractor", "07700 900845", "Preferred contractor", "Decorating", { kind: "group", group: "stanley" }) } }, { label: "Stanley Mews", resolution: { kind: "new", entry: ex("ellis", "Mark Ellis", "Ellis Decorating", "contractor", "07700 900845", "Preferred contractor", "Decorating", { kind: "group", group: "mews" }) } }] },
  { id: "c-priya", row: "Priya Shah — “Facilities” — priya.shah@example.com", group: "check", issue: "Role unclear", question: "Priya Shah is down as “Facilities” with a company-style email. I think she's your facilities manager rather than a contractor. Is that right?",
    options: [{ label: "Our facilities manager", resolution: { kind: "new", entry: { contact: C("priya-shah", "Priya Shah", null, "team", null, "priya.shah@example.com"), relations: [rel("priya-shah", "Facilities manager", "Facilities", { kind: "portfolio" })] } } }, { label: "A facilities contractor", resolution: { kind: "new", entry: { contact: C("priya-shah", "Priya Shah", null, "contractor", null, "priya.shah@example.com"), relations: [rel("priya-shah", "Contractor", "Facilities", { kind: "portfolio" })] } } }] },
  { id: "c-greenleaf", row: "Greenleaf Gardens — 020 7946 0262 — “Nugent Terrace – Shop garden”", group: "check", issue: "Whole building or one Unit?", question: "Greenleaf Gardens is preferred for “Nugent Terrace – Shop garden”. Should they be the gardener for the whole of 5 Nugent Terrace, or for the Shop only?",
    options: [{ label: "The Shop only", resolution: { kind: "new", entry: ex("greenleaf", null, "Greenleaf Gardens", "contractor", "020 7946 0262", "Preferred contractor", "Gardening", { kind: "unit", group: "nugent", unit: "Shop" }) } }, { label: "The whole of 5 Nugent Terrace", resolution: { kind: "new", entry: ex("greenleaf", null, "Greenleaf Gardens", "contractor", "020 7946 0262", "Preferred contractor", "Gardening", { kind: "group", group: "nugent" }) } }] },
  { id: "c-harris", row: "Harris & Co — “Agent” — Burlington Gardens", group: "check", issue: "What kind of agent?", question: "Harris & Co are listed simply as “Agent” for Burlington Gardens. Are they your managing agent or your letting agent?",
    options: [{ label: "Managing agent", resolution: { kind: "new", entry: ex("harris", null, "Harris & Co", "adviser", "020 7946 0412", "Managing agent", "Property management", { kind: "group", group: "burlington" }) } }, { label: "Letting agent", resolution: { kind: "new", entry: ex("harris", null, "Harris & Co", "adviser", "020 7946 0412", "Letting agent", "Lettings", { kind: "group", group: "burlington" }) } }] },
  { id: "c-okafor", row: "D. Okafor — tenant — “Flat 3”", group: "check", issue: "No building given", question: "D. Okafor is a tenant of “Flat 3”, with no building named. The only Flat 3 I know is at Stanley House. Shall I put them there?",
    options: [{ label: "Yes, Flat 3, Stanley House", resolution: { kind: "new", entry: ex("d-okafor", "D. Okafor", null, "tenant", null, "Tenant", null, { kind: "unit", group: "stanley", unit: "Flat 3" }) } }] },
];
export const BATCH_TOTAL = BATCH_STRAIGHT.length + BATCH_CHECKS.length;

export function applyBatch(d: Directory, answers: Record<string, Resolution>): { directory: Directory; added: string[]; updated: string[]; unresolved: string[] } {
  let directory = d; const added: string[] = []; const updated: string[] = []; const unresolved: string[] = [];
  const add = (e: BatchEntry) => { directory = applyDraft(directory, { contact: e.contact, existing: false, relations: e.relations, stage: "belongs", done: "" }); added.push(contactName(e.contact)); };
  BATCH_STRAIGHT.forEach(add);
  for (const c of BATCH_CHECKS) {
    const r = answers[c.id];
    if (!r || r.kind === "unsure") { unresolved.push(c.row.split(" — ")[0]); continue; }
    if (r.kind === "new") add(r.entry);
    else {
      const target = contactById(directory, r.targetId)!;
      directory = applyDraft(directory, { contact: { ...target, phones: [...target.phones, ...r.phones.filter((p) => !target.phones.includes(p))], email: target.email ?? r.email }, existing: true, relations: r.relations, stage: "belongs", done: "" });
      updated.push(contactName(target));
    }
  }
  return { directory, added, updated, unresolved };
}
