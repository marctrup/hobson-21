import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, FileText, Pencil, Plus, Lightbulb, MessageCircle, Paperclip, RotateCcw, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import owlDefault from "@/assets/prototype/owl-default.png";
import {
  CATEGORIES, FREQUENCY_PRESETS, GROUPS, INITIAL, categoryLabel, interpret, isCustom, placeRows, where,
  type Category, type Filter, type GroupId, type Pending, type Responsibility,
} from "./prototypeComplianceResponsibilities";

// Prototype Compliance: Hobson keeps a repository of compliance controls through conversation.
// Shares styling with People We Know; never its data or state. Local demonstration state only.

type Message = { id: number; role: "user" | "hobson"; text: string; attachment?: string; choices?: string[] };
type Tab = "categories" | "places";

const OPENING = "This is where your compliance controls are kept, each with how often it must be renewed. For now you set each frequency by hand; in time I can keep them up to date automatically. If you want to know where you stand, just ask me here.";
const SCENARIOS: { label: string; text: string; attach?: string }[] = [
  { label: "Controls at a place", text: "What are my compliance controls at Stanley House?" },
  { label: "What's coming up", text: "What's coming up in the next few months?" },
  { label: "What needs attention", text: "What needs my attention?" },
  { label: "Supply missing evidence", text: "I've found the new electrical report for 5 Nugent Terrace.", attach: "EICR - 5 Nugent Terrace - Oct 2026.pdf" },
  { label: "An event-triggered notice", text: "We want to increase the rent at Flat 6." },
  { label: "A risk-based interval", text: "When should the Legionella assessment be reviewed?" },
  { label: "Does it apply?", text: "Does asbestos management apply at Burlington Gardens?" },
  { label: "A place with nothing recorded", text: "What about Stanley Mews?" },
  { label: "One kind of control", text: "Where is gas safety recorded?" },
];

function Insight({ children }: { children: ReactNode }) {
  return <p className="mb-6 flex items-start gap-2.5 text-sm leading-relaxed text-ink"><img src={owlDefault} alt="" aria-hidden className="mt-[-2px] h-6 w-6 shrink-0 object-contain" /><span>{children}</span></p>;
}

const field = "w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring";
const PLACES: { id: GroupId | "portfolio"; name: string }[] = [...GROUPS.map((g) => ({ id: g.id, name: g.name })), { id: "portfolio", name: "Across the portfolio" }];
const COLS = "[@container_comp_(min-width:44rem)]:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_auto]";

/** Inline editor: every business may keep its own frequency, so each repository field can be changed by hand. */
function Editor({ r, save, cancel, remove }: { r: Responsibility; save: (r: Responsibility) => void; cancel: () => void; remove?: () => void }) {
  const [d, setD] = useState<Responsibility>(r);
  const [custom, setCustom] = useState(!FREQUENCY_PRESETS.includes(r.frequency));
  const set = <K extends keyof Responsibility>(k: K, v: Responsibility[K]) => setD((x) => ({ ...x, [k]: v }));
  const event = /event/i.test(d.frequency);
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (d.name.trim() && d.frequency.trim()) save({ ...d, timing: event ? "event" : d.timing === "event" ? "recurring" : d.timing, next: event ? null : d.next }); }} className="grid gap-3 px-2 pb-4 pt-2 text-xs [@container_comp_(min-width:44rem)]:grid-cols-2">
      <label className="grid gap-1"><span className="text-ink-muted">Control</span><input className={field} value={d.name} onChange={(e) => set("name", e.target.value)} required /></label>
      <label className="grid gap-1"><span className="text-ink-muted">Category</span><select className={field} value={d.category} onChange={(e) => set("category", e.target.value as Category)}>{CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}</select></label>
      <div className="grid gap-1 [@container_comp_(min-width:44rem)]:col-span-2">
        <span className="text-ink-muted">Your renewal frequency</span>
        <div className="flex flex-wrap gap-2">
          <select aria-label="Renewal frequency" className={`${field} w-auto`} value={custom ? "custom" : d.frequency} onChange={(e) => { if (e.target.value === "custom") setCustom(true); else { setCustom(false); set("frequency", e.target.value); } }}>{FREQUENCY_PRESETS.map((f) => <option key={f}>{f}</option>)}<option value="custom">Your own wording…</option></select>
          {custom && <input aria-label="Your own frequency" className={`${field} min-w-0 flex-1`} value={d.frequency} onChange={(e) => set("frequency", e.target.value)} required />}
        </div>
        {d.legalFrequency && <span className="text-ink-muted">Usual legal or standard frequency: {d.legalFrequency}{d.frequency !== d.legalFrequency && <> · <button type="button" className="text-primary hover:underline" onClick={() => { set("frequency", d.legalFrequency!); setCustom(!FREQUENCY_PRESETS.includes(d.legalFrequency!)); }}>use this</button></>}</span>}
      </div>
      <label className="grid gap-1"><span className="text-ink-muted">Place</span><select className={field} value={d.group} onChange={(e) => set("group", e.target.value as GroupId | "portfolio")}>{PLACES.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
      <label className="grid gap-1"><span className="text-ink-muted">Applies to</span><input className={field} value={d.appliesTo} onChange={(e) => set("appliesTo", e.target.value)} /></label>
      <label className="grid gap-1"><span className="text-ink-muted">Last renewed</span><input type="date" className={field} value={d.last ?? ""} onChange={(e) => set("last", e.target.value || null)} /></label>
      <label className="grid gap-1"><span className="text-ink-muted">Next renewal</span><input type="date" className={field} value={event ? "" : d.next ?? ""} disabled={event} onChange={(e) => set("next", e.target.value || null)} /></label>
      <label className="grid gap-1"><span className="text-ink-muted">Responsible</span><input className={field} value={d.responsible ?? ""} onChange={(e) => set("responsible", e.target.value || null)} /></label>
      <label className="grid gap-1"><span className="text-ink-muted">Arises from</span><input className={field} value={d.source} onChange={(e) => set("source", e.target.value)} /></label>
      <div className="flex flex-wrap items-center gap-2 [@container_comp_(min-width:44rem)]:col-span-2">
        <Button type="submit" size="sm">Save</Button>
        <Button type="button" size="sm" variant="ghost" onClick={cancel}>Cancel</Button>
        {remove && <Button type="button" size="sm" variant="ghost" className="ml-auto text-ink-muted" onClick={remove}>Remove item</Button>}
      </div>
    </form>
  );
}

function Row({ r, open, toggle, lit, save, remove }: { r: Responsibility; open: boolean; toggle: () => void; lit: boolean; save: (r: Responsibility) => void; remove: () => void }) {
  return (
    <li className={`rounded-md transition ${lit ? "bg-primary/[0.06]" : ""} ${open ? "bg-background ring-1 ring-bone" : ""}`}>
      <button type="button" onClick={toggle} aria-expanded={open} aria-label={`Edit ${r.name}, ${where(r)}`} className={`grid w-full grid-cols-[1fr_auto] items-center gap-x-3 px-2 py-2.5 text-left hover:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${COLS}`}>
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-ink">{r.name}</span>
          <span className="block truncate text-xs text-ink-muted [@container_comp_(min-width:44rem)]:hidden">{r.frequency}</span>
        </span>
        <span className="hidden min-w-0 items-center gap-2 text-xs text-ink [@container_comp_(min-width:44rem)]:flex"><span className="truncate">{r.frequency}</span>{isCustom(r) && <span className="shrink-0 rounded-full bg-secondary px-1.5 text-[10px] uppercase tracking-wide text-ink-muted">Your own</span>}</span>
        <Pencil className={`h-3.5 w-3.5 ${open ? "text-primary" : "text-ink-muted"}`} aria-hidden />
      </button>
      {open && <Editor r={r} save={save} cancel={toggle} remove={remove} />}
    </li>
  );
}

function ByCategory({ rs, openId, setOpen, lit, save, remove }: { rs: Responsibility[]; openId: string | null; setOpen: (id: string | null) => void; lit: Set<string>; save: (r: Responsibility) => void; remove: (id: string) => void }) {
  return (
    <div className="grid gap-9 [@container_comp_(min-width:44rem)]:grid-cols-[11rem_minmax(0,1fr)] [@container_comp_(min-width:44rem)]:gap-x-8">
      <nav aria-label="Categories" className="flex flex-wrap gap-1.5 [@container_comp_(min-width:44rem)]:sticky [@container_comp_(min-width:44rem)]:top-0 [@container_comp_(min-width:44rem)]:flex-col [@container_comp_(min-width:44rem)]:self-start">
        {CATEGORIES.map((c) => (
          <button key={c.id} type="button" onClick={() => document.getElementById(`cat-${c.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" })} className="flex items-center justify-between gap-3 rounded-full px-3 py-1 text-xs text-ink ring-1 ring-bone hover:bg-paper [@container_comp_(min-width:44rem)]:rounded-md [@container_comp_(min-width:44rem)]:ring-0">
            <span>{c.label}</span><span className="tabular-nums text-ink-muted">{rs.filter((r) => r.category === c.id).length}</span>
          </button>))}
      </nav>
      <div className="grid gap-8">
        {rs.length === 0 && <p className="text-sm text-ink-muted">Nothing matches.</p>}
        {CATEGORIES.map((c) => {
          const items = rs.filter((r) => r.category === c.id).sort((a, b) => a.name.localeCompare(b.name));
          if (!items.length) return null;
          return (
            <section key={c.id} id={`cat-${c.id}`} aria-label={c.label} className="scroll-mt-4">
              <div className={`mb-1 grid grid-cols-[1fr] gap-x-3 border-b border-faint-rule pb-1.5 text-[10px] uppercase tracking-wider text-ink-muted/70 ${COLS}`}>
                <h3 className="text-[11px] font-medium tracking-[0.12em] text-ink-muted">{c.label}</h3>
                <span className="hidden [@container_comp_(min-width:44rem)]:block">Renewal frequency</span><span className="hidden w-3.5 [@container_comp_(min-width:44rem)]:block" />
              </div>
              <ul className="-mx-2 grid gap-0.5">{items.map((r) => <Row key={r.id} r={r} open={openId === r.id} toggle={() => setOpen(openId === r.id ? null : r.id)} lit={lit.has(r.id)} save={(x) => { save(x); setOpen(null); }} remove={() => remove(r.id)} />)}</ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}

/** Simple list: each place and the categories of compliance it needs. */
function ByPlace({ rs, only }: { rs: Responsibility[]; only: GroupId | null }) {
  const rows = placeRows(rs, only);
  return (
    <div>
      <Insight>A category appears against a place only where a control is recorded for it.</Insight>
      <ul className="grid">
        {rows.map((row) => (
          <li key={row.id} className={`grid gap-x-3 gap-y-0.5 border-b border-faint-rule py-2 [@container_comp_(min-width:44rem)]:grid-cols-[16rem_1fr] ${row.level === "unit" ? "pl-4" : "mt-1"}`}>
            <span className={row.level === "unit" ? "text-sm text-ink-muted" : "text-sm font-medium text-ink"}>{row.label}</span>
            <span className={row.categories.length ? "text-sm text-ink" : "text-sm italic text-ink-muted"}>{row.categories.length ? row.categories.map(categoryLabel).join(" · ") : "Nothing recorded yet"}</span>
          </li>
        ))}
      </ul>
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
      if (out.filter) setTab("categories");
      if (out.open !== undefined) setOpenId(out.open);
      setHighlight(out.highlight ?? []);
      say("hobson", out.reply, out.choices);
    }, 350);
  };

  const saveItem = (r: Responsibility) => { setRs((x) => x.map((y) => (y.id === r.id ? r : y))); setHighlight([r.id]); };
  const addItem = () => {
    const r: Responsibility = { id: `item-${Date.now()}`, name: "New control", category: "health", timing: "recurring", requirement: "", group: filter.group ?? "portfolio", appliesTo: "", frequency: "Every 12 months", last: null, next: null, responsible: null, evidence: null, source: "Your own arrangement" };
    setRs((x) => [...x, r]); setTab("categories"); setQuery(""); setOpenId(r.id);
  };

  const restart = () => {
    setRs(INITIAL); setPending(null); setFilter({ group: null, position: null }); setTab("categories"); setOpenId(null); setHighlight([]); setQuery("");
    nextId.current = 1; setMessages([{ id: 0, role: "hobson", text: OPENING }]);
  };

  const q = query.toLowerCase().trim();
  const scoped = rs.filter((r) => !filter.group || r.group === filter.group);
  const shown = scoped.filter((r) => (!q || [r.name, where(r), r.appliesTo, r.responsible, r.source].join(" ").toLowerCase().includes(q)));
  const lit = new Set(highlight);
  const groupLabel = filter.group ? GROUPS.find((g) => g.id === filter.group)!.name : null;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bone-wash text-ink">
      <aside className="flex w-[68px] shrink-0 flex-col items-center gap-2 border-r border-bone bg-background py-4">
        <div className="mb-2 grid h-10 w-10 place-items-center" aria-hidden><img src={owlDefault} alt="" className="h-10 w-10 object-contain" /></div>
        {[["Portfolio", false], ["Papers", false], ["People We Know", false], ["Compliance controls", true], ["Conversations", false]].map(([label, active]) => (
          <button key={label as string} type="button" aria-current={active ? "page" : undefined} className={`w-12 rounded-lg py-2 text-center text-[10px] leading-tight ${active ? "bg-secondary font-medium text-ink" : "text-ink-muted hover:bg-paper"}`}>{label as string}</button>
        ))}
        <div className="mt-auto grid h-9 w-9 place-items-center rounded-full bg-bone text-xs font-semibold text-charcoal">MT</div>
      </aside>

      <section aria-label="Chat with Hobson" className={`relative z-20 w-full shrink-0 flex-col border-r border-bone bg-background max-md:absolute max-md:inset-y-0 max-md:left-[68px] max-md:w-[calc(100%-68px)] md:w-[380px] ${showChat ? "flex" : "hidden md:flex"}`}>
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-faint-rule px-5">
          <h1 className="text-[15px] font-semibold">Chat with Hobson</h1>
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setShowChat(false)}>View controls</Button>
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

      <main aria-label="Compliance controls" className="[container-type:inline-size] [container-name:comp] flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-bone bg-background px-5">
          <div className="min-w-0"><p className="text-sm font-medium">Compliance controls</p><p className="hidden truncate text-[11px] text-ink-muted [@container_comp_(min-width:28rem)]:block">Repository of controls · frequencies set by hand for now · nothing is saved</p></div>
          <div className="flex shrink-0 items-center gap-1">
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Chat with Hobson" onClick={() => setShowChat(true)}><MessageCircle className="h-4 w-4" /></Button>
            <Button variant="ghost" size="sm" aria-label="Restart demo" onClick={restart}><RotateCcw className="h-3.5 w-3.5 [@container_comp_(min-width:28rem)]:mr-2" /><span className="hidden [@container_comp_(min-width:28rem)]:inline">Restart demo</span></Button>
          </div>
        </header>
        <div role="tablist" aria-label="Ways of seeing your controls" className="flex shrink-0 flex-wrap items-center gap-1 border-b border-bone bg-background px-5 py-2">
          {([["categories", "By category"], ["places", "By place"]] as [Tab, string][]).map(([k, l]) => (
            <Button key={k} role="tab" size="sm" aria-selected={tab === k} variant={tab === k ? "secondary" : "ghost"} onClick={() => setTab(k)}>{l}</Button>
          ))}
          <label className="ml-auto flex min-w-0 items-center gap-2 rounded-full bg-secondary/50 px-3 focus-within:ring-2 focus-within:ring-ring">
            <Search className="h-3.5 w-3.5 shrink-0 text-ink-muted" aria-hidden />
            <input value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Find a control or place" placeholder="Find a control or place" className="w-full min-w-0 bg-transparent py-1.5 text-xs outline-none placeholder:text-ink-muted [@container_comp_(min-width:44rem)]:w-56" />
            {query && <button type="button" aria-label="Clear search" onClick={() => setQuery("")}><X className="h-3.5 w-3.5 text-ink-muted" /></button>}
          </label>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 [@container_comp_(min-width:42rem)]:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-serif text-2xl text-ink">{groupLabel ? `${groupLabel}` : "Compliance controls"}</h2>
            <p className="mb-5 mt-1 text-sm text-ink-muted">{groupLabel ? `Controls held for ${groupLabel}.` : "Each control and how often it must be renewed. You set the frequency here; select any control to change it."}</p>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
              {filter.group ? <button type="button" onClick={() => setFilter((f) => ({ ...f, group: null }))} className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs">{groupLabel}<X className="h-3 w-3" aria-label="Show all places" /></button> : <span />}
              <Button size="sm" variant="outline" onClick={addItem}><Plus className="mr-1.5 h-3.5 w-3.5" />Add a control</Button>
            </div>
            {tab === "categories" && <ByCategory rs={shown} openId={openId} setOpen={setOpenId} lit={lit} save={saveItem} remove={(id) => { setRs((x) => x.filter((r) => r.id !== id)); setOpenId(null); }} />}
            {tab === "places" && <ByPlace rs={shown} only={filter.group} />}
          </div>
        </div>
      </main>
    </div>
  );
}
