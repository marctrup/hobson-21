import { useEffect, useRef, useState, type ReactNode } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ChevronDown, MessageCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import owlDefault from "@/assets/prototype/owl-default.png";
import { PLACE, type PlaceContext } from "./prototypeRecordsPlace";

// Shared shell for the two isolated record prototypes (/prototype-legal, /prototype-contacts).
// It never imports /prototype-unit state; each page owns its own records.

export type Choice = { label: string; primary?: boolean; onPick: () => Turn | null };
export type Turn = { text: string; choices?: Choice[] };
type Message = { id: number; role: "user" | "hobson"; text: string; choices?: Choice[] };

export type SectionKey = "about" | "legal" | "contacts";

function RecordsMap({ compact, onOpen }: { compact: boolean; onOpen: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const openRef = useRef(onOpen);
  openRef.current = onOpen;
  useEffect(() => {
    if (!ref.current) return;
    const map = L.map(ref.current, { center: PLACE.coordinates, zoom: 15, zoomControl: false });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap", maxZoom: 19 }).addTo(map);
    const icon = L.divIcon({ className: "", html: `<span class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-md ring-8 ring-primary/20"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 21V8l8-5 8 5v13"/><path d="M9 21v-6h6v6"/></svg></span>`, iconSize: [40, 40], iconAnchor: [20, 20] });
    L.marker(PLACE.coordinates, { icon, title: `${PLACE.name} — illustrative location`, keyboard: true }).addTo(map).on("click", () => openRef.current());
    const observer = new ResizeObserver(() => { map.invalidateSize({ animate: false }); map.panTo(PLACE.coordinates, { animate: false }); });
    observer.observe(ref.current);
    return () => { observer.disconnect(); map.remove(); };
  }, []);
  return (
    <div className={`relative w-full overflow-hidden rounded-lg border border-border transition-[height] duration-500 ease-out motion-reduce:transition-none ${compact ? "h-44" : "h-full min-h-[320px]"}`}>
      <div ref={ref} className="absolute inset-0 z-0" aria-label="Portfolio map" />
      {!compact && (
        <button type="button" onClick={onOpen} className="absolute bottom-4 left-4 z-[400] rounded-lg border border-border bg-background/95 px-3 py-2 text-left shadow-sm hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <span className="block text-sm font-semibold text-foreground">{PLACE.name}</span>
          <span className="block text-xs text-muted-foreground">{PLACE.line} · 2 Units</span>
        </button>
      )}
    </div>
  );
}

export function RecordSection({ title, count, open, onToggle, focus, onAsk, children }: { title: string; count?: number; open: boolean; onToggle: () => void; focus?: boolean; onAsk?: () => void; children: ReactNode }) {
  return (
    <section className={`rounded-lg border ${focus ? "border-primary/30 bg-background" : "border-border bg-background/60"}`}>
      <div className="flex items-center gap-2 px-3">
        <button type="button" onClick={onToggle} aria-expanded={open} className="flex min-h-11 flex-1 items-center gap-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "" : "-rotate-90"}`} aria-hidden />
          <span className={`text-sm ${focus ? "font-semibold text-foreground" : "font-medium text-muted-foreground"}`}>{title}</span>
          {count !== undefined && <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] text-secondary-foreground">{count}</span>}
        </button>
        {onAsk && <button type="button" onClick={onAsk} className="inline-flex min-h-9 items-center gap-1 rounded-full px-2.5 text-xs text-primary hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><MessageCircle className="h-3.5 w-3.5" aria-hidden />Ask Hobson</button>}
      </div>
      {open && <div className="border-t border-border px-3 py-3">{children}</div>}
    </section>
  );
}

export function RecordRow({ title, lines, tag }: { title: string; lines: (string | null | undefined)[]; tag?: string }) {
  return (
    <li className="rounded-md border border-border bg-secondary/20 px-3 py-2">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {tag && <span className="rounded-full border border-border bg-background px-2 py-0.5 text-[11px] text-muted-foreground">{tag}</span>}
      </div>
      {lines.filter(Boolean).map((l, i) => <p key={i} className="text-xs leading-relaxed text-muted-foreground">{l}</p>)}
    </li>
  );
}

export function GroupLabel({ children }: { children: ReactNode }) {
  return <p className="mb-1.5 mt-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground first:mt-0">{children}</p>;
}

type ShellProps = {
  focus: "legal" | "contacts";
  opening: string;
  suggestions: string[];
  respond: (text: string, place: PlaceContext) => Turn;
  onReset: () => void;
  sections?: SectionKey[];
  renderSection: (key: SectionKey, place: PlaceContext) => ReactNode;
  sectionCount: (key: SectionKey, place: PlaceContext) => number | undefined;
};

export function PrototypeRecordsShell({ focus, opening, suggestions, respond, onReset, sections = ["about", "legal", "contacts"], renderSection, sectionCount }: ShellProps) {
  const nextId = useRef(1);
  const [messages, setMessages] = useState<Message[]>([{ id: 0, role: "hobson", text: opening }]);
  const [input, setInput] = useState("");
  const [view, setView] = useState<"map" | "papers">("map");
  const [groupOpen, setGroupOpen] = useState(false);
  const [place, setPlace] = useState<PlaceContext>(null);
  const [open, setOpen] = useState<Record<SectionKey, boolean>>({ about: false, legal: focus === "legal", contacts: focus === "contacts" });
  const [mobilePane, setMobilePane] = useState<"chat" | "work">("work");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => { logRef.current?.scrollTo({ top: logRef.current.scrollHeight }); }, [messages]);

  const push = (m: Omit<Message, "id">) => setMessages(prev => [...prev, { ...m, id: nextId.current++ }]);
  const hobson = (turn: Turn) => push({ role: "hobson", text: turn.text, choices: turn.choices });

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    push({ role: "user", text });
    setInput("");
    hobson(respond(text, place));
  };

  const pick = (messageId: number, choice: Choice) => {
    // Choices are answered once; the message keeps its text but loses its buttons.
    setMessages(prev => prev.map(m => (m.id === messageId ? { ...m, choices: undefined } : m)));
    push({ role: "user", text: choice.label });
    const follow = choice.onPick();
    if (follow) hobson(follow);
  };

  const ask = () => { setMobilePane("chat"); requestAnimationFrame(() => inputRef.current?.focus()); };

  const reset = () => {
    onReset();
    setMessages([{ id: 0, role: "hobson", text: opening }]);
    setGroupOpen(false); setPlace(null); setView("map");
  };

  const placeLabel = groupOpen ? `${PLACE.name}${place !== null ? ` › ${PLACE.units.find(u => u.number === place)?.name}` : ""}` : "Portfolio";

  const sections = (ctx: PlaceContext) => (
    <div className="flex flex-col gap-2">
      {sections.map(key => (
        <RecordSection key={key} title={key === "about" ? "About" : key === "legal" ? "Legal responsibilities" : "Preferred contractors"} count={sectionCount(key, ctx)} open={open[key]} onToggle={() => setOpen(o => ({ ...o, [key]: !o[key] }))} focus={key === focus} onAsk={key === focus ? () => { setPlace(ctx); ask(); } : undefined}>
          {renderSection(key, ctx)}
        </RecordSection>
      ))}
    </div>
  );

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-bone-wash text-ink md:flex-row">
      <div className="flex border-b border-bone bg-white md:hidden" role="tablist" aria-label="Choose panel">
        {(["chat", "work"] as const).map(p => <button key={p} role="tab" aria-selected={mobilePane === p} onClick={() => setMobilePane(p)} className={`min-h-11 flex-1 text-sm ${mobilePane === p ? "border-b-2 border-primary font-semibold text-foreground" : "text-muted-foreground"}`}>{p === "chat" ? "Chat" : "Map"}</button>)}
      </div>

      <section aria-label="Chat with Hobson" className={`${mobilePane === "chat" ? "flex" : "hidden"} min-h-0 flex-1 flex-col border-r border-bone bg-white md:flex md:w-[380px] md:flex-none`}>
        <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-faint-rule px-5">
          <h1 className="text-[15px] font-semibold text-ink">Chat with Hobson</h1>
          <p aria-label="Hobson's current place" className="truncate text-xs text-ink-muted">{placeLabel}</p>
        </header>
        <div ref={logRef} role="log" aria-label="Conversation" className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-5 py-4">
          {messages.map((m, i) => m.role === "user" ? (
            <div key={m.id} className="max-w-full self-end rounded-xl bg-primary-light px-3.5 py-2.5 text-primary-foreground shadow-sm"><p className="break-words text-sm leading-relaxed">{m.text}</p></div>
          ) : (
            <div key={m.id} className="flex max-w-full items-start gap-2 self-start">
              {messages[i - 1]?.role !== "hobson" ? <img src={owlDefault} alt="" aria-hidden className="mt-0.5 h-8 w-8 shrink-0 object-contain" /> : <span aria-hidden className="w-8 shrink-0" />}
              <div className="min-w-0 flex-1 py-2">
                <p className="mb-1 text-xs font-semibold text-ink-muted">Hobson</p>
                <p className="whitespace-pre-line break-words text-sm leading-relaxed">{m.text}</p>
                {m.choices && <div className="mt-3 flex flex-wrap gap-2">{m.choices.map((c, ci) => <button key={c.label} type="button" onClick={() => pick(m.id, c)} className={`min-h-11 rounded-full border px-3.5 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${c.primary ?? ci === 0 ? "border-primary bg-primary font-semibold text-primary-foreground hover:bg-primary/90" : "border-border bg-secondary/40 text-foreground hover:bg-secondary"}`}>{c.label}</button>)}</div>}
              </div>
            </div>
          ))}
        </div>
        <div className="shrink-0 border-t border-faint-rule px-4 py-3">
          <p className="mb-2 text-[11px] text-muted-foreground">Things you might try</p>
          <div className="mb-3 flex max-h-28 flex-wrap gap-1.5 overflow-y-auto">
            {suggestions.map(s => <button key={s} type="button" onClick={() => send(s)} className="rounded-full border border-border bg-background px-2.5 py-1 text-left text-xs text-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{s}</button>)}
          </div>
          <form onSubmit={e => { e.preventDefault(); send(input); }} className="flex items-end gap-2">
            <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }} rows={2} aria-label="Message Hobson" placeholder={`Tell me about ${placeLabel === "Portfolio" ? PLACE.name : placeLabel.split(" › ").pop()}…`} className="min-h-11 flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            <Button type="submit" className="min-h-11">Send</Button>
          </form>
        </div>
      </section>

      <main className={`${mobilePane === "work" ? "flex" : "hidden"} min-h-0 flex-1 flex-col md:flex`}>
        <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-bone bg-white px-4">
          <nav aria-label="Place" className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
            <button type="button" onClick={() => { setGroupOpen(false); setPlace(null); }} className="rounded px-1 hover:text-foreground">Portfolio</button>
            {groupOpen && <><span aria-hidden>›</span><button type="button" onClick={() => setPlace(null)} className={`truncate rounded px-1 hover:text-foreground ${place === null ? "font-semibold text-foreground" : ""}`}>{PLACE.name}</button></>}
            {groupOpen && place !== null && <><span aria-hidden>›</span><span className="truncate font-semibold text-foreground">{PLACE.units.find(u => u.number === place)?.name}</span></>}
          </nav>
          <div className="flex items-center gap-2">
            <div role="tablist" aria-label="View" className="flex rounded-full border border-border p-0.5">
              {(["map", "papers"] as const).map(v => <button key={v} role="tab" aria-selected={view === v} onClick={() => setView(v)} className={`rounded-full px-3 py-1 text-xs ${view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>{v === "map" ? "Map" : "Papers"}</button>)}
            </div>
            <button type="button" onClick={reset} title="Reset the demonstration" aria-label="Reset the demonstration" className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"><RotateCcw className="h-4 w-4" aria-hidden /></button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {view === "papers" ? (
            <div className="rounded-lg border border-dashed border-border bg-background/60 p-6 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Papers — {placeLabel}</p>
              <p className="mt-1">Original papers live in Papers. They aren't part of this demonstration; switch back to Map to see what I know about this place.</p>
            </div>
          ) : (
            <div className={`flex flex-col gap-4 ${groupOpen ? "" : "h-full"}`}>
              <div className={groupOpen ? "" : "h-full"}>
                <RecordsMap compact={groupOpen} onOpen={() => setGroupOpen(true)} />
              </div>
              {groupOpen && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">{PLACE.name}</h2>
                      <p className="text-xs text-muted-foreground">{PLACE.line} · Illustrative prototype data</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => { setGroupOpen(false); setPlace(null); }}>Back to map</Button>
                  </div>
                  {sections(null)}
                  <ul aria-label="Units" className="divide-y divide-border rounded-lg border border-border bg-background">
                    {PLACE.units.map(u => (
                      <li key={u.number}>
                        <button type="button" aria-expanded={place === u.number} onClick={() => setPlace(p => (p === u.number ? null : u.number))} className={`flex min-h-12 w-full items-center justify-between px-3 py-2 text-left hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${place === u.number ? "bg-secondary/40" : ""}`}>
                          <span><span className="block text-sm font-medium text-foreground">{u.name}</span><span className="block text-xs text-muted-foreground">{u.classification} · {u.tenancy}</span></span>
                          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${place === u.number ? "" : "-rotate-90"}`} aria-hidden />
                        </button>
                        {place === u.number && <div className="border-t border-border bg-bone-wash/40 p-3">{sections(u.number)}</div>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export function AboutContent({ place }: { place: PlaceContext }) {
  if (place === null) return <p className="text-xs text-muted-foreground">{PLACE.name}, {PLACE.line}. Two Units: First Floor Gym and Second Floor Flat. Illustrative prototype data.</p>;
  const u = PLACE.units.find(x => x.number === place)!;
  return <p className="text-xs text-muted-foreground">{u.name} · {u.classification} · {u.tenancy}. Illustrative prototype data.</p>;
}

export function useSessionState<T>(key: string, initial: T): [T, (next: T | ((p: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    try { const raw = window.sessionStorage.getItem(key); return raw ? (JSON.parse(raw) as T) : initial; } catch { return initial; }
  });
  useEffect(() => { try { window.sessionStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ } }, [key, value]);
  return [value, setValue];
}
