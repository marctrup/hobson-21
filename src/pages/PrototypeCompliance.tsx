import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, ChevronDown, FileText, Lightbulb, MessageCircle, Paperclip, RotateCcw, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import owlDefault from "@/assets/prototype/owl-default.png";
import {
  CATEGORIES, counts, daysUntil, fmt, GROUPS, INITIAL, interpret, POSITION_LABEL, positionOf, TIMING_LABEL, where,
  type Category, type Filter, type GroupId, type Pending, type Position, type Responsibility,
} from "./prototypeComplianceResponsibilities";

// Prototype Compliance: Hobson keeps track of compliance responsibilities through conversation.
// Shares styling with People We Know; never its data or state. Local demonstration state only.

type Message = { id: number; role: "user" | "hobson"; text: string; attachment?: string; choices?: string[] };
type Tab = "categories" | "places" | "calendar";

const OPENING = "Here is what I'm looking after across your portfolio. Ask me about a place, what's coming up, or anything you're unsure applies.";
const SCENARIOS: { label: string; text: string; attach?: string }[] = [
  { label: "Responsibilities at a place", text: "What are my compliance responsibilities at Stanley House?" },
  { label: "What's coming up", text: "What's coming up in the next few months?" },
  { label: "What needs attention", text: "What needs my attention?" },
  { label: "Supply missing evidence", text: "I've found the new electrical report for 5 Nugent Terrace.", attach: "EICR - 5 Nugent Terrace - Oct 2026.pdf" },
  { label: "An event-triggered notice", text: "We want to increase the rent at Flat 6." },
  { label: "A risk-based interval", text: "When should the Legionella assessment be reviewed?" },
  { label: "Does it apply?", text: "Does asbestos management apply at Burlington Gardens?" },
  { label: "A place with nothing recorded", text: "What about Stanley Mews?" },
  { label: "One kind of responsibility", text: "Where is gas safety recorded?" },
];

const DOT: Record<Position, string> = { attention: "bg-destructive", coming: "bg-primary", current: "bg-ink-muted/40", establish: "border border-dashed border-ink-muted bg-transparent" };

function Dot({ p }: { p: Position }) {
  return <span aria-hidden className={`inline-block h-2 w-2 shrink-0 rounded-full ${DOT[p]}`} />;
}

function Insight({ children }: { children: ReactNode }) {
  return <p className="mb-6 flex items-start gap-2.5 text-sm leading-relaxed text-ink"><img src={owlDefault} alt="" aria-hidden className="mt-[-2px] h-6 w-6 shrink-0 object-contain" /><span>{children}</span></p>;
}

const whenLine = (r: Responsibility) => {
  if (r.timing === "event") return r.frequency;
  if (!r.next) return r.frequency;
  const d = daysUntil(r.next);
  return `${r.timing === "expiry" ? "Expires" : "Next due"} ${fmt(r.next)}${d < 0 ? ` · ${-d} days ago` : d <= 90 ? ` · in ${d} days` : ""}`;
};

function Row({ r, open, toggle, lit }: { r: Responsibility; open: boolean; toggle: () => void; lit: boolean }) {
  const p = positionOf(r);
  const facts: [string, string | null][] = [
    ["Requirement", r.requirement], ["Applies to", `${where(r)} — ${r.appliesTo}`], ["Timing", `${TIMING_LABEL[r.timing]} · ${r.frequency}`],
    ["Last", r.last ? fmt(r.last) : null], ["Next", r.next ? fmt(r.next) : r.timing === "event" ? "When the event arises" : null],
    ["Responsible", r.responsible], ["Evidence", r.evidence], ["Arises from", r.source],
  ];
  return (
    <li className={`rounded-md transition ${lit ? "bg-primary/[0.06]" : ""} ${open ? "bg-background ring-1 ring-bone" : ""}`}>
      <button type="button" onClick={toggle} aria-expanded={open} className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-x-3 px-2 py-2.5 text-left hover:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring [@container_comp_(min-width:44rem)]:grid-cols-[auto_minmax(0,1.2fr)_minmax(0,1.3fr)_minmax(0,0.9fr)_auto]">
        <Dot p={p} />
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-ink">{r.name}</span>
          <span className="block truncate text-xs text-ink-muted [@container_comp_(min-width:44rem)]:hidden">{whenLine(r)} · {where(r)}</span>
          <span className="hidden truncate text-xs text-ink-muted [@container_comp_(min-width:44rem)]:block">{TIMING_LABEL[r.timing]}</span>
        </span>
        <span className={`hidden min-w-0 truncate text-xs [@container_comp_(min-width:44rem)]:block ${p === "attention" ? "font-medium text-destructive" : p === "coming" ? "font-medium text-ink" : "text-ink-muted"}`}>{whenLine(r)}</span>
        <span className="hidden min-w-0 truncate text-xs text-ink-muted [@container_comp_(min-width:44rem)]:block">{where(r)}</span>
        <ChevronDown className={`h-4 w-4 text-ink-muted transition ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      {open && (
        <div className="px-7 pb-4 pt-1">
          <p className="mb-3 text-xs font-medium text-ink"><Dot p={p} /> <span className="ml-1">{POSITION_LABEL[p]}</span>{r.note && <span className="font-normal text-ink-muted"> — {r.note}</span>}</p>
          <dl className="grid gap-x-6 gap-y-1.5 text-xs [@container_comp_(min-width:44rem)]:grid-cols-2">
            {facts.map(([k, v]) => <div key={k} className="flex gap-3"><dt className="w-24 shrink-0 text-ink-muted">{k}</dt><dd className="min-w-0 text-ink">{v ?? <span className="rounded border border-dashed border-bone px-1.5 text-ink-muted">Not yet established</span>}</dd></div>)}
          </dl>
        </div>
      )}
    </li>
  );
}

function Overview({ rs, active, set }: { rs: Responsibility[]; active: Position | null; set: (p: Position | null) => void }) {
  const c = counts(rs);
  return (
    <div className="mb-8 grid grid-cols-2 gap-2 [@container_comp_(min-width:40rem)]:grid-cols-4">
      {(Object.keys(POSITION_LABEL) as Position[]).map((p) => (
        <button key={p} type="button" aria-pressed={active === p} onClick={() => set(active === p ? null : p)} className={`rounded-lg px-4 py-3 text-left ring-1 transition hover:bg-background ${active === p ? "bg-background ring-primary/40" : "ring-bone"}`}>
          <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.1em] text-ink-muted"><Dot p={p} />{POSITION_LABEL[p]}</span>
          <span className="mt-1 block font-serif text-2xl tabular-nums text-ink">{c[p]}</span>
        </button>
      ))}
    </div>
  );
}

function ByCategory({ rs, openId, setOpen, lit }: { rs: Responsibility[]; openId: string | null; setOpen: (id: string | null) => void; lit: Set<string> }) {
  const order: Position[] = ["attention", "coming", "establish", "current"];
  return (
    <div className="grid gap-9 [@container_comp_(min-width:44rem)]:grid-cols-[11rem_minmax(0,1fr)] [@container_comp_(min-width:44rem)]:gap-x-8">
      <nav aria-label="Categories" className="flex flex-wrap gap-1.5 [@container_comp_(min-width:44rem)]:sticky [@container_comp_(min-width:44rem)]:top-0 [@container_comp_(min-width:44rem)]:flex-col [@container_comp_(min-width:44rem)]:self-start">
        {CATEGORIES.map((c) => { const n = rs.filter((r) => r.category === c.id); return (
          <button key={c.id} type="button" onClick={() => document.getElementById(`cat-${c.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" })} className="flex items-center justify-between gap-3 rounded-full px-3 py-1 text-xs text-ink ring-1 ring-bone hover:bg-paper [@container_comp_(min-width:44rem)]:rounded-md [@container_comp_(min-width:44rem)]:ring-0">
            <span>{c.label}</span><span className="flex items-center gap-1.5 tabular-nums text-ink-muted">{n.some((r) => positionOf(r) === "attention") && <Dot p="attention" />}{n.length}</span>
          </button>); })}
      </nav>
      <div className="grid gap-8">
        {rs.length === 0 && <p className="text-sm text-ink-muted">Nothing matches. Ask me in the conversation.</p>}
        {CATEGORIES.map((c) => {
          const items = rs.filter((r) => r.category === c.id).sort((a, b) => order.indexOf(positionOf(a)) - order.indexOf(positionOf(b)));
          if (!items.length) return null;
          return (
            <section key={c.id} id={`cat-${c.id}`} aria-label={c.label} className="scroll-mt-4">
              <div className="mb-1 flex items-baseline justify-between border-b border-faint-rule pb-1.5">
                <h3 className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">{c.label}</h3>
                <span className="hidden gap-16 pr-10 text-[10px] uppercase tracking-wider text-ink-muted/70 [@container_comp_(min-width:44rem)]:flex"><span>When</span><span>Where</span></span>
              </div>
              <ul className="-mx-2 grid gap-0.5">{items.map((r) => <Row key={r.id} r={r} open={openId === r.id} toggle={() => setOpen(openId === r.id ? null : r.id)} lit={lit.has(r.id)} />)}</ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}

/** Chart in the Services style: categories down the side, places across the top. */
function ByPlace({ rs, pick }: { rs: Responsibility[]; pick: (g: GroupId | null, c: Category) => void }) {
  const cols: (GroupId | "portfolio")[] = [...GROUPS.map((g) => g.id), "portfolio"];
  const label = (g: GroupId | "portfolio") => (g === "portfolio" ? "Portfolio" : GROUPS.find((x) => x.id === g)!.name);
  const empty = GROUPS.filter((g) => !rs.some((r) => r.group === g.id));
  return (
    <div>
      <Insight>Each cell shows what I'm keeping track of for that place.{empty.length ? <> I have nothing recorded for <b className="font-semibold">{empty.map((g) => g.name).join(", ")}</b> — shown with a dashed line; I won't assume what applies.</> : ""}</Insight>
      <div className="-mx-1 overflow-x-auto px-1">
        <table className="w-full min-w-[40rem] border-separate border-spacing-0 text-left">
          <thead><tr><th className="sticky left-0 bg-bone-wash pb-2 pr-3 text-[10px] font-medium uppercase tracking-wider text-ink-muted">Category</th>{cols.map((g) => <th key={g} className="pb-2 pr-2 text-[11px] font-medium text-ink">{label(g)}</th>)}</tr></thead>
          <tbody>{CATEGORIES.map((c) => (
            <tr key={c.id}>
              <th scope="row" className="sticky left-0 border-t border-faint-rule bg-bone-wash py-2.5 pr-3 align-top text-sm font-medium text-ink">{c.label}</th>
              {cols.map((g) => { const items = rs.filter((r) => r.category === c.id && r.group === g); return (
                <td key={g} className="border-t border-faint-rule py-2 pr-2 align-top">
                  {items.length ? items.map((r) => <button key={r.id} type="button" onClick={() => pick(g === "portfolio" ? null : g, c.id)} className="flex max-w-full items-center gap-1.5 rounded px-1 py-0.5 text-left text-xs text-ink hover:bg-paper"><Dot p={positionOf(r)} /><span className="truncate">{r.name}</span></button>)
                    : g !== "portfolio" && empty.some((e) => e.id === g) ? <span className="inline-block rounded border border-dashed border-ink-muted/40 px-1.5 text-[11px] text-ink-muted">Not established</span>
                    : <span className="px-1 text-xs text-ink-muted/40" aria-label="Nothing recorded">·</span>}
                </td>); })}
            </tr>))}</tbody>
        </table>
      </div>
    </div>
  );
}

function Calendar({ rs, setOpen }: { rs: Responsibility[]; setOpen: (id: string) => void }) {
  const dated = rs.filter((r) => r.next && r.timing !== "event").sort((a, b) => a.next!.localeCompare(b.next!));
  const months = Array.from(new Set(dated.map((r) => r.next!.slice(0, 7))));
  const undated = rs.filter((r) => !r.next || r.timing === "event");
  return (
    <div className="grid gap-8">
      <Insight>Dates come only from what I have recorded. Event-triggered and unestablished responsibilities sit apart, without invented dates.</Insight>
      <ol className="relative grid gap-6 border-l border-bone pl-6">
        {months.map((m) => (
          <li key={m}>
            <span className="absolute -left-[5px] mt-1.5 h-2.5 w-2.5 rounded-full bg-bone" aria-hidden />
            <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">{new Date(`${m}-01`).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</p>
            <ul className="grid gap-1">{dated.filter((r) => r.next!.startsWith(m)).map((r) => (
              <li key={r.id}><button type="button" onClick={() => setOpen(r.id)} className="flex w-full items-center gap-3 rounded px-2 py-1.5 text-left text-sm hover:bg-background"><Dot p={positionOf(r)} /><span className="w-14 shrink-0 tabular-nums text-xs text-ink-muted">{new Date(r.next!).getDate()} {new Date(r.next!).toLocaleDateString("en-GB", { month: "short" })}</span><span className="min-w-0 flex-1 truncate text-ink">{r.name}</span><span className="hidden truncate text-xs text-ink-muted [@container_comp_(min-width:36rem)]:block">{where(r)}</span></button></li>
            ))}</ul>
          </li>
        ))}
      </ol>
      {undated.length > 0 && (
        <div>
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">When something happens, or still to establish</p>
          <ul className="grid gap-1 [@container_comp_(min-width:44rem)]:grid-cols-2">{undated.map((r) => <li key={r.id}><button type="button" onClick={() => setOpen(r.id)} className="flex w-full items-center gap-3 rounded border border-dashed border-bone px-3 py-2 text-left text-sm hover:bg-background"><Dot p={positionOf(r)} /><span className="min-w-0 flex-1 truncate">{r.name}</span><span className="truncate text-xs text-ink-muted">{where(r)}</span></button></li>)}</ul>
        </div>
      )}
    </div>
  );
}

export default function PrototypeCompliance() {
  const [rs, setRs] = useState<Responsibility[]>(INITIAL);
  const [pending, setPending] = useState<Pending>(null);
  const [filter, setFilter] = useState<Filter>({ group: null, position: null });
  const [tab, setTab] = useState<Tab>("categories");
  const [openId, setOpenId] = useState<string | null>(null);
  const [highlight, setHighlight] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([{ id: 0, role: "hobson", text: OPENING }]);
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [tryOpen, setTryOpen] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const nextId = useRef(1);
  const logEnd = useRef<HTMLDivElement>(null);
  useEffect(() => { logEnd.current?.scrollIntoView?.({ block: "end" }); }, [messages]);

  const say = (role: Message["role"], text: string, choices?: string[], attachment?: string) => setMessages((m) => [...m.map((x) => ({ ...x, choices: undefined })), { id: nextId.current++, role, text, choices, attachment }]);

  const send = (raw: string, attachment?: string) => {
    const text = raw.trim();
    if (!text) return;
    setInput(""); setTryOpen(false);
    say("user", text, undefined, attachment);
    const out = interpret(rs, pending, attachment ? `${text} attach` : text);
    setTimeout(() => {
      if (out.items) setRs(out.items);
      setPending(out.pending);
      if (out.filter) { setFilter((f) => ({ ...f, ...out.filter })); setQuery(""); }
      if (out.filter?.position === "coming") setTab("calendar"); else if (out.filter) setTab("categories");
      if (out.open !== undefined) setOpenId(out.open);
      setHighlight(out.highlight ?? []);
      say("hobson", out.reply, out.choices);
    }, 350);
  };

  const restart = () => {
    setRs(INITIAL); setPending(null); setFilter({ group: null, position: null }); setTab("categories"); setOpenId(null); setHighlight([]); setQuery("");
    nextId.current = 1; setMessages([{ id: 0, role: "hobson", text: OPENING }]);
  };

  const q = query.toLowerCase().trim();
  const scoped = rs.filter((r) => !filter.group || r.group === filter.group);
  const shown = scoped.filter((r) => (!filter.position || positionOf(r) === filter.position) && (!q || [r.name, where(r), r.appliesTo, r.responsible, r.source].join(" ").toLowerCase().includes(q)));
  const lit = new Set(highlight);
  const groupLabel = filter.group ? GROUPS.find((g) => g.id === filter.group)!.name : null;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bone-wash text-ink">
      <aside className="flex w-[68px] shrink-0 flex-col items-center gap-2 border-r border-bone bg-background py-4">
        <div className="mb-2 grid h-10 w-10 place-items-center" aria-hidden><img src={owlDefault} alt="" className="h-10 w-10 object-contain" /></div>
        {[["Portfolio", false], ["Papers", false], ["People We Know", false], ["My compliance responsibilities", true], ["Conversations", false]].map(([label, active]) => (
          <button key={label as string} type="button" aria-current={active ? "page" : undefined} className={`w-12 rounded-lg py-2 text-center text-[10px] leading-tight ${active ? "bg-secondary font-medium text-ink" : "text-ink-muted hover:bg-paper"}`}>{label as string}</button>
        ))}
        <div className="mt-auto grid h-9 w-9 place-items-center rounded-full bg-bone text-xs font-semibold text-charcoal">MT</div>
      </aside>

      <section aria-label="Chat with Hobson" className={`relative z-20 w-full shrink-0 flex-col border-r border-bone bg-background max-md:absolute max-md:inset-y-0 max-md:left-[68px] max-md:w-[calc(100%-68px)] md:w-[380px] ${showChat ? "flex" : "hidden md:flex"}`}>
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-faint-rule px-5">
          <h1 className="text-[15px] font-semibold">Chat with Hobson</h1>
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setShowChat(false)}>View responsibilities</Button>
        </header>
        <div role="log" aria-label="Conversation" className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-5 py-4">
          {messages.map((m, i) => {
            const cont = i > 0 && messages[i - 1].role === "hobson" && m.role === "hobson";
            return (
              <div key={m.id} className={`flex min-w-0 flex-col gap-2 ${m.role === "user" ? "items-end" : "items-start"}`}>
                <div className="flex min-w-0 gap-2">
                  {m.role === "hobson" && (cont ? <span className="w-10 shrink-0" /> : <img src={owlDefault} alt="Hobson" className="h-10 w-10 shrink-0 object-contain" />)}
                  <div className={`min-w-0 rounded-lg px-3.5 py-2.5 ${m.role === "user" ? "bg-secondary" : ""}`}>
                    {m.attachment && <p className="mb-2 flex items-center gap-2 rounded-md bg-background px-2 py-1.5 text-xs ring-1 ring-bone" aria-label={`Attached: ${m.attachment}`}><FileText className="h-4 w-4 text-primary" />{m.attachment}</p>}
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
              {SCENARIOS.map((s) => <button key={s.label} type="button" onClick={() => send(s.text, s.attach)} className="block w-full rounded-md px-2 py-1.5 text-left hover:bg-paper"><span className="block text-sm text-ink">{s.label}</span><span className="block truncate text-xs text-ink-muted">“{s.text}”</span></button>)}
            </div>
          )}
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-1 rounded-full border border-input bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-ring">
            <Button type="button" variant="ghost" size="icon" aria-label="Attach a paper (example)" title="Attach an example electrical report" onClick={() => send(SCENARIOS[3].text, SCENARIOS[3].attach)} className="h-9 w-9 shrink-0"><Paperclip className="h-5 w-5" /></Button>
            <Button type="button" variant="ghost" size="icon" aria-label="Things you might try" aria-expanded={tryOpen} onClick={() => setTryOpen((o) => !o)} className="h-9 w-9 shrink-0"><Lightbulb className="h-5 w-5" /></Button>
            <input value={input} onChange={(e) => setInput(e.target.value)} aria-label="Ask Hobson" placeholder="Ask Hobson about a responsibility…" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
            <Button type="submit" size="icon" variant="ghost" disabled={!input.trim()} aria-label="Send message" className="h-8 w-8 shrink-0"><ArrowRight className="h-5 w-5" /></Button>
          </form>
        </div>
      </section>

      <main aria-label="My compliance responsibilities" className="[container-type:inline-size] [container-name:comp] flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-bone bg-background px-5">
          <div className="min-w-0"><p className="text-sm font-medium">My compliance responsibilities</p><p className="hidden truncate text-[11px] text-ink-muted [@container_comp_(min-width:28rem)]:block">Illustrative examples · demonstration only, nothing is saved</p></div>
          <div className="flex shrink-0 items-center gap-1">
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Chat with Hobson" onClick={() => setShowChat(true)}><MessageCircle className="h-4 w-4" /></Button>
            <Button variant="ghost" size="sm" aria-label="Restart demo" onClick={restart}><RotateCcw className="h-3.5 w-3.5 [@container_comp_(min-width:28rem)]:mr-2" /><span className="hidden [@container_comp_(min-width:28rem)]:inline">Restart demo</span></Button>
          </div>
        </header>
        <div role="tablist" aria-label="Ways of seeing your responsibilities" className="flex shrink-0 flex-wrap items-center gap-1 border-b border-bone bg-background px-5 py-2">
          {([["categories", "By category"], ["places", "By place"], ["calendar", "Calendar"]] as [Tab, string][]).map(([k, l]) => (
            <Button key={k} role="tab" size="sm" aria-selected={tab === k} variant={tab === k ? "secondary" : "ghost"} onClick={() => setTab(k)}>{l}</Button>
          ))}
          <label className="ml-auto flex min-w-0 items-center gap-2 rounded-full bg-secondary/50 px-3 focus-within:ring-2 focus-within:ring-ring">
            <Search className="h-3.5 w-3.5 shrink-0 text-ink-muted" aria-hidden />
            <input value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Find a responsibility or place" placeholder="Find a responsibility or place" className="w-full min-w-0 bg-transparent py-1.5 text-xs outline-none placeholder:text-ink-muted [@container_comp_(min-width:44rem)]:w-56" />
            {query && <button type="button" aria-label="Clear search" onClick={() => setQuery("")}><X className="h-3.5 w-3.5 text-ink-muted" /></button>}
          </label>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 [@container_comp_(min-width:42rem)]:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-serif text-2xl text-ink">{groupLabel ? `${groupLabel}` : "My compliance responsibilities"}</h2>
            <p className="mb-5 mt-1 text-sm text-ink-muted">{groupLabel ? `What I'm looking after at ${groupLabel}.` : "Here is what I'm looking after across your portfolio."}</p>
            {(filter.group || filter.position) && (
              <div className="mb-4 flex flex-wrap gap-2">
                {filter.group && <button type="button" onClick={() => setFilter((f) => ({ ...f, group: null }))} className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs">{groupLabel}<X className="h-3 w-3" aria-label="Show all places" /></button>}
                {filter.position && <button type="button" onClick={() => setFilter((f) => ({ ...f, position: null }))} className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs">{POSITION_LABEL[filter.position]}<X className="h-3 w-3" aria-label="Show every position" /></button>}
              </div>
            )}
            <Overview rs={scoped} active={filter.position} set={(p) => setFilter((f) => ({ ...f, position: p }))} />
            {tab === "categories" && <ByCategory rs={shown} openId={openId} setOpen={setOpenId} lit={lit} />}
            {tab === "places" && <ByPlace rs={shown} pick={(g) => { setFilter((f) => ({ ...f, group: g })); setTab("categories"); }} />}
            {tab === "calendar" && <Calendar rs={shown} setOpen={(id) => { setOpenId(id); setTab("categories"); }} />}
          </div>
        </div>
      </main>
    </div>
  );
}
