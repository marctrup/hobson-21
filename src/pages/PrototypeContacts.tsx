import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, Building2, ChevronLeft, FileSpreadsheet, Lightbulb, Mail, MessageCircle, Paperclip, Phone, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import owlDefault from "@/assets/prototype/owl-default.png";
import {
  applyBatch, BATCH_CHECKS, BATCH_STRAIGHT, BATCH_TOTAL, contactById, contactName, GROUPS, groupName, INITIAL_DIRECTORY, interpret, KIND_LABEL, relationsOf, scopeLabel, SPREADSHEET_NAME,
  type Contact, type Directory, type Draft, type GroupId, type Kind, type Pending, type Relation, type Resolution, type Tab,
} from "./prototypeContactsDirectory";

// Prototype Contacts: Hobson learns who helps look after the portfolio through conversation.
// Local demonstration state only; shares styling with Prototype Documents, never its state.

type Message = { id: number; role: "user" | "hobson"; text: string; attachment?: string; choices?: string[] };
type View = { tab: Tab; focusContact: string | null; focusGroup: GroupId | null; highlight: string[] };
type Batch = { stage: "looking" | "first" | "review" | "summary" | "done"; index: number; answers: Record<string, Resolution>; result?: { added: string[]; updated: string[]; unresolved: string[] } };

const OPENING = "These are the people I know who help look after your portfolio. Tell me about anyone new — as you would a colleague — or attach a spreadsheet and I'll go through it.";
const SCENARIOS: { label: string; text?: string; sheet?: true }[] = [
  { label: "Add a preferred contractor", text: "Add John Smith from Smith Plumbing. He's our preferred plumber for Stanley House." },
  { label: "Add a member of staff", text: "Add Sarah Jones. She's our portfolio manager. Her email is sarah@example.com." },
  { label: "Add a lawyer", text: "Add James Wilson at Wilson Legal. He handles our lease matters at Burlington Gardens." },
  { label: "Add a tenant", text: "Add Michael Brown as the tenant of Flat 6, Stanley House." },
  { label: "Reuse a known contractor", text: "Make Smith Plumbing the preferred plumber for 5 Nugent Terrace as well." },
  { label: "A Unit-specific contractor", text: "Use a different plumber for Flat 8." },
  { label: "Another responsibility", text: "Sarah is also the person we should contact about maintenance at Stanley House." },
  { label: "Upload a spreadsheet", sheet: true },
  { label: "Find a contractor", text: "Who is our preferred electrician at Stanley House?" },
  { label: "Contractors at a place", text: "Show me all the contractors at Burlington Gardens." },
  { label: "Add a phone number", text: "Add another phone number for Sarah." },
  { label: "Remove a preference", text: "Remove Smith Plumbing as preferred plumber for Stanley House." },
];
const LOOK_MS = 1600;

const initials = (c: Contact) => (c.person ?? c.org ?? "?").split(/\s+/).filter((w) => /^[A-Za-z]/.test(w)).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

function Avatar({ c, size = "md" }: { c: Contact; size?: "md" | "lg" }) {
  const org = !c.person;
  return <span aria-hidden className={`grid shrink-0 place-items-center font-semibold ${size === "lg" ? "h-14 w-14 text-lg" : "h-9 w-9 text-xs"} ${org ? "rounded-lg" : "rounded-full"} ${c.kind === "contractor" ? "bg-primary/10 text-primary" : "bg-secondary text-ink"}`}>{org ? <Building2 className={size === "lg" ? "h-6 w-6" : "h-4 w-4"} /> : initials(c)}</span>;
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">{children}</p>;
}

/** Place → role → service → contact, read left to right. */
function Chain({ r, c, proposed }: { r: Relation; c?: Contact; proposed?: boolean }) {
  const parts = [scopeLabel(r.scope), r.role, r.service && r.service !== r.role ? r.service : null].filter(Boolean) as string[];
  return (
    <div className={`flex flex-wrap items-center gap-1.5 text-xs ${proposed ? "text-ink" : "text-ink-muted"}`}>
      {parts.map((p, i) => <span key={i} className="flex items-center gap-1.5"><span className={`rounded-full px-2 py-0.5 ${i === 0 ? "bg-background font-medium text-ink ring-1 ring-bone" : "bg-secondary/60"} ${proposed ? "border border-dashed border-primary/40" : ""}`}>{p}</span><ArrowRight className="h-3 w-3 opacity-50" aria-hidden /></span>)}
      <span className="font-medium text-ink">{c ? contactName(c) : "To be named"}</span>
      {r.scope.kind === "unit" && r.role === "Preferred contractor" && <span className="ml-1 rounded-full border border-dashed border-ink-muted/40 px-2 py-0.5 text-[10px] uppercase tracking-wide">{r.scope.unit} only</span>}
    </div>
  );
}

function Detail({ icon, value, missing }: { icon: ReactNode; value: string | null; missing: string }) {
  return <p className="flex items-center gap-2 text-sm">{icon}{value ? <span className="text-ink">{value}</span> : <span className="rounded border border-dashed border-bone px-1.5 text-xs text-ink-muted">{missing}</span>}</p>;
}

const STAGES = ["Establishing the contact", "Checking the details", "Where they belong", "Added"];

function Proposal({ pending, d }: { pending: Pending; d: Directory }) {
  if (pending.kind === "who") {
    return (
      <section aria-label="Proposed arrangement" className="rounded-xl border border-dashed border-primary/40 bg-background p-5">
        <Eyebrow>Proposed — a Unit-specific contractor</Eyebrow>
        <Chain r={{ id: "", contactId: "", role: "Preferred contractor", service: pending.service, scope: { kind: "unit", group: pending.group, unit: pending.unit } }} proposed />
        <p className="mt-3 text-xs text-ink-muted">The rest of {groupName(pending.group)} keeps its current {pending.service.toLowerCase()} contractor.</p>
      </section>
    );
  }
  if (pending.kind === "phone") return null;
  const draft: Draft = pending.draft;
  const stageIndex = pending.kind === "details" ? 1 : pending.kind === "same" ? 0 : draft.stage === "details" ? 1 : 2;
  const c = draft.contact;
  const cand = pending.kind === "same" ? contactById(d, pending.candidateId) : undefined;
  const removing = (draft.removeRelationIds ?? []).map((id) => d.relations.find((r) => r.id === id)).filter(Boolean) as Relation[];
  return (
    <section aria-label="Proposed contact" className="rounded-xl border border-bone bg-background p-5 shadow-sm motion-safe:animate-in motion-safe:fade-in">
      <ol aria-label="Progress" className="mb-5 flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
        {STAGES.map((s, i) => <li key={s} aria-current={i === stageIndex ? "step" : undefined} className={`flex items-center gap-1.5 ${i === stageIndex ? "font-medium text-ink" : i < stageIndex ? "text-ink-muted" : "text-ink-muted/50"}`}><span className={`h-1.5 w-1.5 rounded-full ${i <= stageIndex ? "bg-primary" : "bg-bone"}`} />{s}</li>)}
      </ol>
      <div className="flex items-start gap-4">
        <Avatar c={c} size="lg" />
        <div className="min-w-0 flex-1">
          <p className="text-lg font-semibold leading-tight text-ink">{c.person ?? c.org}</p>
          {c.person && c.org && <p className="text-sm text-ink-muted">{c.org}</p>}
          <p className="mt-1 text-xs text-ink-muted">{draft.existing ? "Already known to me" : "New contact"} · {KIND_LABEL[c.kind].replace(/s$/, "").replace("Your team", "Your team")}</p>
          <div className="mt-3 grid gap-1.5">
            <Detail icon={<Phone className="h-3.5 w-3.5 text-ink-muted" />} value={c.phones.join(" · ") || null} missing={stageIndex < 2 ? "Not yet given" : "Not given"} />
            <Detail icon={<Mail className="h-3.5 w-3.5 text-ink-muted" />} value={c.email} missing={stageIndex < 2 ? "Not yet given" : "Not given"} />
          </div>
        </div>
      </div>
      {cand && (
        <div className="mt-5 rounded-lg bg-secondary/40 p-3">
          <Eyebrow>Already recorded — is this the same?</Eyebrow>
          <div className="flex items-center gap-3"><Avatar c={cand} /><div><p className="text-sm font-medium">{contactName(cand)}</p><p className="text-xs text-ink-muted">{relationsOf(d, cand.id).map((r) => `${r.service ?? r.role} · ${scopeLabel(r.scope)}`).join("; ")}</p></div></div>
        </div>
      )}
      {(draft.relations.length > 0 || removing.length > 0) && (
        <div className="mt-5 border-t border-faint-rule pt-4">
          <Eyebrow>{removing.length ? "Preference to remove" : "Where they belong"}</Eyebrow>
          <div className="grid gap-2">
            {draft.relations.map((r) => <Chain key={r.id} r={r} c={c} proposed />)}
            {removing.map((r) => <div key={r.id} className="line-through decoration-ink-muted/60"><Chain r={r} c={c} /></div>)}
          </div>
          {draft.existing && relationsOf(d, c.id).filter((r) => !draft.removeRelationIds?.includes(r.id)).length > 0 && (
            <div className="mt-3 grid gap-1.5 opacity-80"><p className="text-[11px] text-ink-muted">Stays as it is</p>{relationsOf(d, c.id).filter((r) => !draft.removeRelationIds?.includes(r.id)).map((r) => <Chain key={r.id} r={r} c={c} />)}</div>
          )}
          {draft.note && <p className="mt-3 text-xs italic text-ink-muted">{draft.note}</p>}
        </div>
      )}
    </section>
  );
}

function ContactRow({ c, d, onOpen, lit }: { c: Contact; d: Directory; onOpen: () => void; lit: boolean }) {
  const rs = relationsOf(d, c.id);
  const summary = Array.from(new Set(rs.map((r) => r.service ?? r.role))).join(" · ");
  const places = Array.from(new Set(rs.map((r) => scopeLabel(r.scope))));
  return (
    <li>
      <button type="button" onClick={onOpen} className={`flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${lit ? "bg-primary/5 ring-1 ring-primary/25" : ""}`}>
        <Avatar c={c} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-ink">{contactName(c)}</span>
          <span className="block truncate text-xs text-ink-muted">{[c.org && c.person, summary].filter(Boolean).join(" — ")}</span>
          {places.length > 0 && <span className="mt-1 block truncate text-[11px] text-ink-muted/80">{places.join(", ")}</span>}
        </span>
        <span className="hidden shrink-0 text-right text-[11px] text-ink-muted @md:block">{c.phones[0] ?? c.email ?? ""}</span>
      </button>
    </li>
  );
}

function People({ d, open, lit }: { d: Directory; open: (id: string) => void; lit: Set<string> }) {
  const kinds: Kind[] = ["contractor", "team", "adviser", "landlord", "tenant", "other"];
  return (
    <div className="grid gap-8 @3xl:grid-cols-2">
      {kinds.map((k) => { const cs = d.contacts.filter((c) => c.kind === k); if (!cs.length) return null; return (
        <section key={k} aria-label={KIND_LABEL[k]}>
          <Eyebrow>{KIND_LABEL[k]} · {cs.length}</Eyebrow>
          <ul className="-mx-3 grid gap-0.5">{cs.map((c) => <ContactRow key={c.id} c={c} d={d} onOpen={() => open(c.id)} lit={relationsOf(d, c.id).some((r) => lit.has(r.id))} />)}</ul>
        </section>
      ); })}
    </div>
  );
}

function Services({ d, open, lit }: { d: Directory; open: (id: string) => void; lit: Set<string> }) {
  const withService = d.relations.filter((r) => r.service);
  const services = Array.from(new Set(withService.map((r) => r.service!)));
  const contractorServices = services.filter((s) => withService.some((r) => r.service === s && r.role === "Preferred contractor")).sort();
  const others = services.filter((s) => !contractorServices.includes(s)).sort();
  const Card = ({ s }: { s: string }) => {
    const rs = withService.filter((r) => r.service === s).sort((a, b) => (a.scope.kind === "unit" ? 1 : 0) - (b.scope.kind === "unit" ? 1 : 0));
    return (
      <section aria-label={s} className="rounded-xl border border-bone bg-background p-4">
        <h3 className="mb-3 text-sm font-semibold text-ink">{s}</h3>
        <ul className="grid gap-2">{rs.map((r) => { const c = contactById(d, r.contactId)!; const ex = r.scope.kind === "unit"; return (
          <li key={r.id} className={`${ex ? "ml-3 border-l border-dashed border-primary/40 pl-3" : ""}`}>
            <button type="button" onClick={() => open(c.id)} className={`flex w-full items-baseline justify-between gap-3 rounded px-1.5 py-1 text-left text-sm hover:bg-paper ${lit.has(r.id) ? "bg-primary/5 ring-1 ring-primary/25" : ""}`}>
              <span className="text-xs text-ink-muted">{ex ? `${scopeLabel(r.scope)} — instead` : scopeLabel(r.scope)}</span>
              <span className="truncate font-medium text-ink">{contactName(c)}</span>
            </button>
          </li>); })}</ul>
      </section>
    );
  };
  return (
    <div className="grid gap-8">
      <div><Eyebrow>Preferred contractors</Eyebrow><div className="grid gap-3 @2xl:grid-cols-2">{contractorServices.map((s) => <Card key={s} s={s} />)}</div></div>
      {others.length > 0 && <div><Eyebrow>Other responsibilities</Eyebrow><div className="grid gap-3 @2xl:grid-cols-2">{others.map((s) => <Card key={s} s={s} />)}</div></div>}
    </div>
  );
}

function Places({ d, open, lit, focus, clearFocus }: { d: Directory; open: (id: string) => void; lit: Set<string>; focus: GroupId | null; clearFocus: () => void }) {
  const Line = ({ r }: { r: Relation }) => { const c = contactById(d, r.contactId)!; return (
    <li><button type="button" onClick={() => open(c.id)} className={`flex w-full items-baseline justify-between gap-3 rounded px-1.5 py-1 text-left hover:bg-paper ${lit.has(r.id) ? "bg-primary/5 ring-1 ring-primary/25" : ""}`}>
      <span className="text-xs text-ink-muted">{r.role === "Preferred contractor" ? `Preferred ${r.service?.toLowerCase()}` : r.role}</span>
      <span className="truncate text-sm font-medium text-ink">{contactName(c)}</span>
    </button></li>); };
  const groups = GROUPS.filter((g) => !focus || g.id === focus);
  const portfolio = d.relations.filter((r) => r.scope.kind === "portfolio");
  return (
    <div className="grid gap-4">
      {focus && <button type="button" onClick={clearFocus} className="flex w-fit items-center gap-1 text-xs text-ink-muted hover:text-ink"><ChevronLeft className="h-3.5 w-3.5" />All places</button>}
      <div className="grid gap-4 @3xl:grid-cols-2">
        {groups.map((g) => {
          const whole = d.relations.filter((r) => r.scope.kind === "group" && r.scope.group === g.id);
          const units = g.units.map((u) => ({ u, rs: d.relations.filter((r) => r.scope.kind === "unit" && r.scope.group === g.id && r.scope.unit === u) })).filter((x) => x.rs.length);
          return (
            <section key={g.id} aria-label={g.name} className="rounded-xl border border-bone bg-background p-5">
              <h3 className="text-base font-semibold text-ink">{g.name}</h3>
              <p className="mb-3 text-[11px] text-ink-muted">{g.units.length} Units</p>
              {whole.length ? <ul className="grid gap-0.5">{whole.map((r) => <Line key={r.id} r={r} />)}</ul> : <p className="text-xs text-ink-muted">No one recorded for the whole building.</p>}
              {units.map(({ u, rs }) => (
                <div key={u} className="mt-3 border-t border-faint-rule pt-3">
                  <p className="mb-1 text-xs font-medium text-ink">{u}</p>
                  <ul className="grid gap-0.5 border-l border-dashed border-primary/40 pl-2">{rs.map((r) => <Line key={r.id} r={r} />)}</ul>
                </div>
              ))}
            </section>
          );
        })}
        {!focus && portfolio.length > 0 && (
          <section aria-label="Whole portfolio" className="rounded-xl border border-bone bg-secondary/30 p-5">
            <h3 className="text-base font-semibold text-ink">Across the portfolio</h3>
            <p className="mb-3 text-[11px] text-ink-muted">Not tied to one place</p>
            <ul className="grid gap-0.5">{portfolio.map((r) => <Line key={r.id} r={r} />)}</ul>
          </section>
        )}
      </div>
    </div>
  );
}

function ContactDetail({ c, d, lit, back }: { c: Contact; d: Directory; lit: Set<string>; back: () => void }) {
  const rs = relationsOf(d, c.id);
  return (
    <div className="mx-auto max-w-2xl">
      <button type="button" onClick={back} className="mb-5 flex items-center gap-1 text-xs text-ink-muted hover:text-ink"><ChevronLeft className="h-3.5 w-3.5" />All contacts</button>
      <div className="flex items-start gap-4">
        <Avatar c={c} size="lg" />
        <div className="min-w-0">
          <h2 className="text-xl font-semibold leading-tight text-ink">{contactName(c)}</h2>
          {c.person && c.org && <p className="text-sm text-ink-muted">{c.person}</p>}
          <p className="mt-1 text-xs text-ink-muted">{KIND_LABEL[c.kind]}</p>
        </div>
      </div>
      <div className="mt-6 grid gap-2 rounded-xl border border-bone bg-background p-4">
        {c.phones.length ? c.phones.map((p) => <Detail key={p} icon={<Phone className="h-3.5 w-3.5 text-ink-muted" />} value={p} missing="" />) : <Detail icon={<Phone className="h-3.5 w-3.5 text-ink-muted" />} value={null} missing="No telephone recorded" />}
        <Detail icon={<Mail className="h-3.5 w-3.5 text-ink-muted" />} value={c.email} missing="No email recorded" />
      </div>
      <div className="mt-6">
        <Eyebrow>What they do, and where</Eyebrow>
        {rs.length ? <ul className="grid gap-2">{rs.map((r) => <li key={r.id} className={`rounded-lg px-3 py-2 ${lit.has(r.id) ? "bg-primary/5 ring-1 ring-primary/25" : "bg-background ring-1 ring-bone"}`}><Chain r={r} c={c} /></li>)}</ul> : <p className="text-sm text-ink-muted">No responsibilities recorded at present. I've kept their details.</p>}
      </div>
    </div>
  );
}

function BatchView({ batch }: { batch: Batch }) {
  const dupes = BATCH_CHECKS.filter((c) => c.group === "duplicate");
  const checks = BATCH_CHECKS.filter((c) => c.group === "check");
  const current = batch.stage === "review" ? BATCH_CHECKS[batch.index] : null;
  const status = (id: string) => { const a = batch.answers[id]; return !a ? null : a.kind === "unsure" ? "Left for later" : a.kind === "merge" ? "Same as existing" : "Settled"; };
  const Item = ({ c }: { c: (typeof BATCH_CHECKS)[number] }) => { const s = status(c.id); const on = current?.id === c.id; return (
    <li className={`rounded-lg px-3 py-2.5 transition ${on ? "bg-background shadow-sm ring-1 ring-primary/40" : "bg-background/60 ring-1 ring-bone"}`}>
      <p className="text-sm text-ink">{c.row}</p>
      <p className="mt-0.5 flex items-center justify-between gap-2 text-xs text-ink-muted"><span>{c.issue}</span>{s && <span className={`rounded-full px-2 py-0.5 text-[10px] ${s === "Left for later" ? "border border-dashed border-ink-muted/40" : "bg-primary/10 text-primary"}`}>{s}</span>}</p>
    </li>); };
  return (
    <div className="mx-auto grid max-w-3xl gap-6">
      <div className="flex items-center gap-3 rounded-xl border border-bone bg-background p-4">
        <FileSpreadsheet className="h-8 w-8 text-primary" aria-hidden />
        <div><p className="text-sm font-medium text-ink">{SPREADSHEET_NAME}</p><p className="text-xs text-ink-muted">{BATCH_TOTAL} rows · example spreadsheet</p></div>
      </div>
      {batch.stage === "looking" ? <p role="status" className="text-sm italic text-ink-muted motion-safe:animate-pulse">Checking whether any are already recorded…</p> : (
        <>
          <section aria-label="May already be recorded"><Eyebrow>May already be recorded · {dupes.length}</Eyebrow><ul className="grid gap-2">{dupes.map((c) => <Item key={c.id} c={c} />)}</ul></section>
          <section aria-label="Need a quick check"><Eyebrow>Need a quick check · {checks.length}</Eyebrow><ul className="grid gap-2">{checks.map((c) => <Item key={c.id} c={c} />)}</ul></section>
          <section aria-label="Look straightforward">
            <Eyebrow>Look straightforward · {BATCH_STRAIGHT.length}</Eyebrow>
            <ul className="flex flex-wrap gap-1.5">{BATCH_STRAIGHT.map((e) => <li key={e.contact.id} className="rounded-full bg-background px-2.5 py-1 text-xs text-ink ring-1 ring-bone">{contactName(e.contact)}<span className="text-ink-muted"> · {e.relations[0].service ?? e.relations[0].role}</span></li>)}</ul>
          </section>
        </>
      )}
    </div>
  );
}

export default function PrototypeContacts() {
  const [d, setD] = useState<Directory>(INITIAL_DIRECTORY);
  const [pending, setPending] = useState<Pending | null>(null);
  const [messages, setMessages] = useState<Message[]>([{ id: 0, role: "hobson", text: OPENING }]);
  const [view, setView] = useState<View>({ tab: "people", focusContact: null, focusGroup: null, highlight: [] });
  const [batch, setBatch] = useState<Batch | null>(null);
  const [input, setInput] = useState("");
  const [tryOpen, setTryOpen] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const nextId = useRef(1);
  const logEnd = useRef<HTMLDivElement>(null);

  useEffect(() => { logEnd.current?.scrollIntoView?.({ block: "end" }); }, [messages]);
  useEffect(() => {
    if (batch?.stage !== "looking") return;
    const t = setTimeout(() => {
      setBatch((b) => (b ? { ...b, stage: "first" } : b));
      say("hobson", `I've taken a first look at ${BATCH_TOTAL} contacts.\n\n• ${BATCH_STRAIGHT.length} look straightforward.\n• ${BATCH_CHECKS.filter((c) => c.group === "check").length} need a quick check.\n• ${BATCH_CHECKS.filter((c) => c.group === "duplicate").length} may already be recorded.\n\nShall we go through the ${BATCH_CHECKS.length} that need you?`, ["Go through them", "Leave it for now"]);
    }, LOOK_MS);
    return () => clearTimeout(t);
  }, [batch?.stage]);

  const say = (role: Message["role"], text: string, choices?: string[], attachment?: string) => setMessages((m) => [...m.map((x) => ({ ...x, choices: undefined })), { id: nextId.current++, role, text, choices, attachment }]);
  const lit = new Set(view.highlight);

  const askCheck = (i: number) => { const c = BATCH_CHECKS[i]; say("hobson", c.question, [...c.options.map((o) => o.label), "Not sure"]); };

  const handleBatch = (text: string): boolean => {
    if (!batch || batch.stage === "done" || batch.stage === "looking") return false;
    const t = text.toLowerCase();
    if (batch.stage === "first") {
      if (/leave|not now/.test(t)) { setBatch(null); say("hobson", "Very well. I've added nothing from the spreadsheet; attach it again whenever suits."); return true; }
      setBatch({ ...batch, stage: "review", index: 0 }); askCheck(0); return true;
    }
    if (batch.stage === "review") {
      const c = BATCH_CHECKS[batch.index];
      const opt = c.options.find((o) => o.label.toLowerCase() === t) ?? (/^(yes|same)/.test(t) ? c.options[0] : /^(no|different)/.test(t) && c.options[1] ? c.options[1] : undefined);
      const res: Resolution | null = opt ? opt.resolution : /not sure|don't know|unsure/.test(t) ? { kind: "unsure" } : null;
      if (!res) { say("hobson", "I'm not sure which you mean. Choose one of the answers, or say you're not sure.", [...c.options.map((o) => o.label), "Not sure"]); return true; }
      const answers = { ...batch.answers, [c.id]: res };
      if (res.kind === "unsure") say("hobson", "I'll keep that one aside.");
      if (batch.index + 1 < BATCH_CHECKS.length) { setBatch({ ...batch, answers, index: batch.index + 1 }); askCheck(batch.index + 1); return true; }
      const n = Object.values(answers);
      const fresh = BATCH_STRAIGHT.length + n.filter((a) => a.kind === "new").length; const merged = n.filter((a) => a.kind === "merge").length; const aside = n.filter((a) => a.kind === "unsure").length;
      setBatch({ ...batch, answers, stage: "summary" });
      say("hobson", `I've checked the contacts and their relationships with your portfolio.\n\n• ${fresh} new contacts\n• ${merged} existing contact${merged === 1 ? "" : "s"} brought up to date\n• ${aside} left unresolved\n\nShall I add the confirmed contacts?`, ["Yes, add them", "Not now"]);
      return true;
    }
    if (batch.stage === "summary") {
      if (/^(yes|add)/.test(t)) {
        const r = applyBatch(d, batch.answers);
        setD(r.directory);
        setBatch({ ...batch, stage: "done", result: r });
        setView({ tab: "people", focusContact: null, focusGroup: null, highlight: r.directory.relations.filter((x) => !d.relations.some((y) => y.id === x.id)).map((x) => x.id) });
        say("hobson", `Done. I've added ${r.added.length} and brought ${r.updated.length} up to date.${r.unresolved.length ? ` I've kept ${r.unresolved.join(" and ")} aside until you're sure.` : ""}`);
        return true;
      }
      setBatch(null); say("hobson", "Very well. Nothing from the spreadsheet has been added."); return true;
    }
    return false;
  };

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    setInput(""); setTryOpen(false);
    say("user", text);
    if (handleBatch(text)) return;
    if (batch?.stage === "done") setBatch(null);
    const out = interpret(d, pending, text);
    setTimeout(() => {
      if (out.directory) setD(out.directory);
      setPending(out.pending);
      if (out.view) setView((v) => ({ ...v, ...out.view, highlight: out.view!.highlight ?? (out.view!.focusContact !== undefined || out.view!.tab ? [] : v.highlight) }));
      say("hobson", out.reply, out.choices);
    }, 350);
  };

  const attachSheet = () => {
    setTryOpen(false); setPending(null);
    say("user", "Add these contacts.", undefined, SPREADSHEET_NAME);
    say("hobson", "I'll take a look at the contacts and check whether any are already recorded.");
    setBatch({ stage: "looking", index: 0, answers: {} });
    setView((v) => ({ ...v, focusContact: null }));
  };

  const restart = () => {
    setD(INITIAL_DIRECTORY); setPending(null); setBatch(null); setInput("");
    setView({ tab: "people", focusContact: null, focusGroup: null, highlight: [] });
    nextId.current = 1; setMessages([{ id: 0, role: "hobson", text: OPENING }]);
  };

  const open = (id: string) => setView((v) => ({ ...v, focusContact: id }));
  const focused = view.focusContact ? contactById(d, view.focusContact) : undefined;
  const showBatch = batch && batch.stage !== "done";
  const showProposal = pending && !showBatch;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bone-wash text-ink">
      <aside className="flex w-[68px] shrink-0 flex-col items-center gap-2 border-r border-bone bg-background py-4">
        <div className="mb-2 grid h-10 w-10 place-items-center" aria-hidden><img src={owlDefault} alt="" className="h-10 w-10 object-contain" /></div>
        {[["Portfolio", false], ["Papers", false], ["Contacts", true], ["Conversations", false]].map(([label, active]) => (
          <button key={label as string} type="button" aria-current={active ? "page" : undefined} className={`w-12 rounded-lg py-2 text-center text-[10px] leading-tight ${active ? "bg-secondary font-medium text-ink" : "text-ink-muted hover:bg-paper"}`}>{label as string}</button>
        ))}
        <div className="mt-auto grid h-9 w-9 place-items-center rounded-full bg-bone text-xs font-semibold text-charcoal">MT</div>
      </aside>

      <section aria-label="Chat with Hobson" className={`relative z-20 w-full shrink-0 flex-col border-r border-bone bg-background max-md:absolute max-md:inset-y-0 max-md:left-[68px] max-md:w-[calc(100%-68px)] md:w-[380px] ${showChat ? "flex" : "hidden md:flex"}`}>
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-faint-rule px-5">
          <h1 className="text-[15px] font-semibold">Chat with Hobson</h1>
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setShowChat(false)}>View contacts</Button>
        </header>
        <div role="log" aria-label="Conversation" className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-5 py-4">
          {messages.map((m, i) => {
            const cont = i > 0 && messages[i - 1].role === "hobson" && m.role === "hobson";
            return (
              <div key={m.id} className={`flex min-w-0 flex-col gap-2 ${m.role === "user" ? "items-end" : "items-start"}`}>
                <div className="flex min-w-0 gap-2">
                  {m.role === "hobson" && (cont ? <span className="w-10 shrink-0" /> : <img src={owlDefault} alt="Hobson" className="h-10 w-10 shrink-0 object-contain" />)}
                  <div className={`min-w-0 rounded-lg px-3.5 py-2.5 ${m.role === "user" ? "bg-secondary" : ""}`}>
                    {m.attachment && <p className="mb-2 flex items-center gap-2 rounded-md bg-background px-2 py-1.5 text-xs ring-1 ring-bone" aria-label={`Attached: ${m.attachment}`}><FileSpreadsheet className="h-4 w-4 text-primary" />{m.attachment}</p>}
                    <p className="whitespace-pre-line break-words text-sm leading-relaxed">{m.text}</p>
                  </div>
                </div>
                {m.choices && <div className="ml-12 flex flex-wrap gap-2">{m.choices.map((c, k) => <Button key={c} size="sm" variant={k === 0 ? "outline" : "ghost"} onClick={() => send(c)}>{c}</Button>)}</div>}
              </div>
            );
          })}
          <div ref={logEnd} />
        </div>
        <div className="border-t border-faint-rule px-5 pb-4 pt-2">
          {tryOpen && (
            <div role="group" aria-label="Things you might try" className="mb-3 max-h-64 overflow-y-auto border-b border-bone pb-3">
              <div className="flex items-center justify-between"><span className="text-xs text-ink-muted">Things you might try</span><Button variant="ghost" size="icon" aria-label="Close suggestions" onClick={() => setTryOpen(false)}><X className="h-4 w-4" /></Button></div>
              {SCENARIOS.map((s) => <button key={s.label} type="button" disabled={!!showBatch} onClick={() => (s.sheet ? attachSheet() : send(s.text!))} className="block w-full rounded-md px-2 py-1.5 text-left hover:bg-paper disabled:opacity-50"><span className="block text-sm text-ink">{s.label}</span>{s.text && <span className="block truncate text-xs text-ink-muted">“{s.text}”</span>}</button>)}
            </div>
          )}
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-1 rounded-full border border-input bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-ring">
            <Button type="button" variant="ghost" size="icon" aria-label="Attach a spreadsheet (example)" title="Attach a spreadsheet" disabled={!!showBatch} onClick={attachSheet} className="h-9 w-9 shrink-0"><Paperclip className="h-5 w-5" /></Button>
            <Button type="button" variant="ghost" size="icon" aria-label="Things you might try" aria-expanded={tryOpen} onClick={() => setTryOpen((o) => !o)} className="h-9 w-9 shrink-0"><Lightbulb className="h-5 w-5" /></Button>
            <input value={input} onChange={(e) => setInput(e.target.value)} aria-label="Ask Hobson" placeholder="Tell Hobson about someone…" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
            <Button type="submit" size="icon" variant="ghost" disabled={!input.trim()} aria-label="Send message" className="h-8 w-8 shrink-0"><ArrowRight className="h-5 w-5" /></Button>
          </form>
        </div>
      </section>

      <main aria-label="Contacts workspace" className="@container flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-bone bg-background px-5">
          <div className="min-w-0"><p className="text-sm font-medium">Contacts</p><p className="hidden truncate text-[11px] text-ink-muted @md:block">Who helps look after your portfolio · demonstration only, nothing is saved</p></div>
          <div className="flex shrink-0 items-center gap-1">
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Chat with Hobson" onClick={() => setShowChat(true)}><MessageCircle className="h-4 w-4" /></Button>
            <Button variant="ghost" size="sm" aria-label="Restart demo" onClick={restart}><RotateCcw className="h-3.5 w-3.5 @md:mr-2" /><span className="hidden @md:inline">Restart demo</span></Button>
          </div>
        </header>
        {!showBatch && !focused && (
          <div role="tablist" aria-label="Ways of seeing your contacts" className="flex shrink-0 gap-1 border-b border-bone bg-background px-5 py-2">
            {([["people", "People and organisations"], ["services", "Services and responsibilities"], ["places", "Places"]] as [Tab, string][]).map(([k, l]) => (
              <Button key={k} role="tab" size="sm" aria-selected={view.tab === k} variant={view.tab === k ? "secondary" : "ghost"} onClick={() => setView((v) => ({ ...v, tab: k }))}>{l}</Button>
            ))}
          </div>
        )}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 @2xl:px-8">
          {showProposal && <div className="mx-auto mb-8 max-w-2xl"><Proposal pending={pending!} d={d} /></div>}
          {showBatch ? <BatchView batch={batch!} /> : focused ? <ContactDetail c={focused} d={d} lit={lit} back={() => setView((v) => ({ ...v, focusContact: null }))} /> : (
            <div className={showProposal ? "opacity-60 transition-opacity" : ""}>
              {batch?.result && <p className="mb-6 rounded-lg bg-secondary/40 px-4 py-3 text-xs text-ink-muted">From the spreadsheet: {batch.result.added.length} new · {batch.result.updated.length} brought up to date ({batch.result.updated.join(", ") || "none"}) · {batch.result.unresolved.length} unresolved{batch.result.unresolved.length ? ` (${batch.result.unresolved.join(", ")})` : ""}</p>}
              {view.tab === "people" && <People d={d} open={open} lit={lit} />}
              {view.tab === "services" && <Services d={d} open={open} lit={lit} />}
              {view.tab === "places" && <Places d={d} open={open} lit={lit} focus={view.focusGroup} clearFocus={() => setView((v) => ({ ...v, focusGroup: null }))} />}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
