import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ArrowRight, Building2, FileText, Hammer, Home, KeyRound, Layers, Lightbulb, Map as MapIcon, MapPin, MessageSquare, Plus, RotateCcw, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import owlDefault from "@/assets/prototype/owl-default.png";
import {
  SITUATIONS, STATUS_PLACES, interpret, labelCounts, listWords, placeMatches, placeSituations, unitKey,
  type SituationBook, type SituationLabel, type StatusPlace,
} from "./prototypeStatus";

// Prototype Status: the user records each Unit's current situation in the chat
// and the map comes alive with it. Local demonstration state only.

const AUTHOR = "Marc T";
const TODAY = "13 November 2026";

const TONE: Record<SituationLabel, { color: string; Icon: typeof Home; hint: string }> = {
  Vacant: { color: "var(--situation-vacant)", Icon: Home, hint: "No one is in occupation" },
  "Available to let": { color: "var(--situation-let)", Icon: KeyRound, hint: "Being marketed or ready to let" },
  "Being refurbished": { color: "var(--situation-refurb)", Icon: Hammer, hint: "Works are under way" },
};

type Message = { id: number; role: "user" | "hobson"; text: string; choices?: string[]; situationField?: boolean };
type Step = null | "place" | "unit" | "labels";
type Filter = SituationLabel | "All";

const SEED: Message[] = [{
  id: 0, role: "hobson",
  text: "Here are your places on the map.\n\nI've nothing recorded yet about how any Unit stands today — whether it's vacant, being let or being refurbished. Tell me, and I'll show it on the map as we go.",
  choices: ["Record a Unit's current situation"],
}];

const SAMPLE: SituationBook = {
  [unitKey("colmore", "1st Floor")]: { labels: ["Vacant", "Available to let"], by: AUTHOR, date: TODAY },
  [unitKey("colmore", "2nd Floor")]: { labels: ["Being refurbished"], by: AUTHOR, date: TODAY },
  [unitKey("colmore", "Ground Floor Shop")]: { labels: ["Available to let", "Being refurbished"], by: AUTHOR, date: TODAY },
  [unitKey("st-pauls", "5th Floor")]: { labels: ["Vacant"], by: AUTHOR, date: TODAY },
  [unitKey("paragon", "Unit 3")]: { labels: ["Available to let"], by: AUTHOR, date: TODAY },
  [unitKey("paragon", "Unit 4")]: { labels: ["Being refurbished"], by: AUTHOR, date: TODAY },
  [unitKey("clyde", "Workshop")]: { labels: ["Vacant"], by: AUTHOR, date: TODAY },
};

const SCENARIOS = [
  { label: "Fill in a sample portfolio", text: "Fill in a sample portfolio" },
  { label: "Find what's vacant", text: "Which Units are vacant?" },
  { label: "Ask about a place", text: "What's happening in Birmingham?" },
];

const lower = (ls: string[]) => listWords(ls.map((l) => l.toLowerCase()));
const placeById = (id: string | null) => STATUS_PLACES.find((p) => p.id === id) ?? null;

function ring(book: SituationBook, place: StatusPlace) {
  const counts = labelCounts(book, place);
  const total = SITUATIONS.reduce((n, l) => n + counts[l], 0);
  if (!total) return null;
  let at = 0;
  return `conic-gradient(${SITUATIONS.filter((l) => counts[l]).map((l) => { const from = at; at += (counts[l] / total) * 360; return `${TONE[l].color} ${from}deg ${at}deg`; }).join(", ")})`;
}

function StatusMap({ book, filter, selectedId, picking, bloomId, onPick }: {
  book: SituationBook; filter: Filter; selectedId: string | null; picking: boolean; bloomId: string | null; onPick: (id: string) => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const layer = useRef<L.LayerGroup | null>(null);
  const pick = useRef(onPick);
  pick.current = onPick;
  const hasAny = Object.keys(book).length > 0;

  useEffect(() => {
    if (!box.current) return;
    const m = L.map(box.current, { zoomControl: false, attributionControl: true }).fitBounds(STATUS_PLACES.map((p) => p.coords), { padding: [60, 60] });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap contributors", maxZoom: 19 }).addTo(m);
    L.control.zoom({ position: "bottomright" }).addTo(m);
    layer.current = L.layerGroup().addTo(m);
    map.current = m;
    const ro = new ResizeObserver(() => m.invalidateSize({ animate: false }));
    ro.observe(box.current);
    return () => { ro.disconnect(); m.remove(); map.current = null; };
  }, []);

  useEffect(() => {
    const g = layer.current;
    if (!g) return;
    g.clearLayers();
    STATUS_PLACES.forEach((p) => {
      const bg = ring(book, p);
      const recorded = placeSituations(book, p).length;
      const dim = hasAny && filter !== "All" && !placeMatches(book, p, filter);
      const selected = p.id === selectedId;
      const size = bg ? 46 : 32;
      const core = bg
        ? `<span style="background:${bg}" class="relative grid h-[46px] w-[46px] place-items-center rounded-full shadow-lg"><span class="grid h-[34px] w-[34px] place-items-center rounded-full bg-background text-sm font-semibold text-foreground">${recorded}</span></span>`
        : `<span class="grid h-8 w-8 place-items-center rounded-full border-2 ${selected ? "border-primary text-primary" : "border-background text-muted-foreground"} bg-background text-xs font-semibold shadow-md ${picking ? "status-breathe" : ""}">${p.units.length}</span>`;
      const bloom = bloomId === p.id ? `<span class="status-bloom pointer-events-none absolute inset-0 rounded-full border-4 border-primary"></span>` : "";
      const label = selected || picking ? `<span class="absolute left-full top-1/2 ml-2 -translate-y-1/2 whitespace-nowrap rounded-full ${selected ? "bg-primary text-primary-foreground" : "bg-background text-foreground"} px-2.5 py-0.5 text-xs font-medium shadow">${p.name}</span>` : "";
      const html = `<span title="${p.name}, ${p.town}" class="relative block cursor-pointer transition-opacity duration-500 ${dim ? "opacity-30" : ""} ${selected ? "scale-110" : ""}">${bloom}${core}${label}</span>`;
      L.marker(p.coords, { icon: L.divIcon({ className: "", html, iconSize: [size, size], iconAnchor: [size / 2, size / 2] }), keyboard: true, title: p.name, zIndexOffset: selected ? 1000 : 0 })
        .on("click", () => pick.current(p.id)).addTo(g);
    });
  }, [book, filter, selectedId, picking, bloomId, hasAny]);

  useEffect(() => {
    const m = map.current;
    if (!m) return;
    const p = placeById(selectedId);
    if (p) { m.flyTo(p.coords, 9, { duration: 1.1 }); return; }
    const pts = filter === "All" ? STATUS_PLACES : STATUS_PLACES.filter((x) => placeMatches(book, x, filter));
    if (pts.length) m.flyToBounds(pts.map((x) => x.coords), { padding: [90, 90], maxZoom: 9, duration: 1.1 });
  }, [selectedId, filter, book]);

  return <div ref={box} aria-label="Map of your places" className="status-map absolute inset-0 z-0" />;
}

function SituationField({ initial, onConfirm }: { initial: SituationLabel[]; onConfirm: (l: SituationLabel[]) => void }) {
  const [picked, setPicked] = useState<SituationLabel[]>(initial);
  const toggle = (l: SituationLabel) => setPicked((p) => (p.includes(l) ? p.filter((x) => x !== l) : [...p, l]));
  return (
    <div role="group" aria-label="Current situation" className="mt-3 grid gap-1.5">
      {SITUATIONS.map((l) => {
        const { Icon, color } = TONE[l];
        const on = picked.includes(l);
        return (
          <button key={l} type="button" aria-pressed={on} onClick={() => toggle(l)}
            style={on ? { borderColor: color, color } : undefined}
            className={`flex items-center gap-2.5 rounded-full border bg-background px-3.5 py-2 text-left text-sm transition-colors ${on ? "font-medium" : "border-primary/20 text-ink hover:border-primary/50"}`}>
            <Icon className="h-4 w-4" style={{ color }} aria-hidden />{l}
          </button>
        );
      })}
      <Button type="button" size="sm" disabled={picked.length === 0 && initial.length === 0} onClick={() => onConfirm(SITUATIONS.filter((l) => picked.includes(l)))} className="mt-1 w-fit">
        {picked.length === 0 ? "Clear situation" : "Put it on the map"}
      </Button>
    </div>
  );
}

function Chip({ label }: { label: SituationLabel }) {
  const { Icon, color } = TONE[label];
  return (
    <span style={{ color, borderColor: color }} className="inline-flex items-center gap-1 rounded-full border bg-background px-2 py-0.5 text-xs font-medium">
      <Icon className="h-3 w-3" aria-hidden />{label}
    </span>
  );
}

export default function PrototypeStatus() {
  const [messages, setMessages] = useState<Message[]>(SEED);
  const [book, setBook] = useState<SituationBook>({});
  const [step, setStep] = useState<Step>(null);
  const [placeId, setPlaceId] = useState<string | null>(null);
  const [unit, setUnit] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("All");
  const [bloomId, setBloomId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [tryOpen, setTryOpen] = useState(false);
  const nextId = useRef(1);
  const logEnd = useRef<HTMLDivElement>(null);
  const hasAny = Object.keys(book).length > 0;
  const place = placeById(placeId);

  useEffect(() => { logEnd.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [messages]);
  useEffect(() => { if (!bloomId) return; const t = setTimeout(() => setBloomId(null), 3400); return () => clearTimeout(t); }, [bloomId]);

  const say = (role: Message["role"], text: string, extra: Partial<Message> = {}) =>
    setMessages((ms) => [...ms, { id: nextId.current++, role, text, ...extra }]);

  const startRecord = (at?: string) => {
    setMenuOpen(false); setFilter("All");
    if (at) return choosePlace(at);
    setStep("place"); setPlaceId(null);
    say("hobson", "Which place is it? Touch it on the map — I've lit them up — or choose one here.", { choices: STATUS_PLACES.map((p) => p.name) });
  };

  const choosePlace = (id: string) => {
    const p = placeById(id)!;
    setPlaceId(id); setStep("unit");
    say("hobson", `Which Unit at ${p.name}?`, { choices: p.units });
  };

  const chooseUnit = (u: string) => {
    setUnit(u); setStep("labels");
    say("hobson", `How does the ${u} stand today? Choose all that apply.`, { situationField: true });
  };

  const confirm = (labels: SituationLabel[]) => {
    if (!place || !unit) return;
    const first = !hasAny;
    say("user", labels.length ? labels.join(", ") : "Clear it");
    setBook((b) => {
      const n = { ...b };
      if (labels.length) n[unitKey(place.id, unit)] = { labels, by: AUTHOR, date: TODAY };
      else delete n[unitKey(place.id, unit)];
      return n;
    });
    setStep(null); setUnit(null); setBloomId(place.id);
    if (!labels.length) { say("hobson", `I've cleared the situation for the ${unit} at ${place.name}.`, { choices: ["Record another Unit"] }); return; }
    say("hobson", `Noted. The ${unit} at ${place.name} is ${lower(labels)} — recorded by you today.${first ? "\n\nYour map now shows how things stand. Each place wears a ring in the colours of its Units' situations." : ""}`,
      { choices: ["Record another Unit", ...labels.slice(0, 1).map((l) => `Show me everything ${l.toLowerCase()}`)] });
  };

  const showFilter = (label: Filter) => {
    setFilter(label); setPlaceId(null);
    if (label === "All") { say("hobson", hasAny ? "Here is everything you've recorded across your places." : "There's nothing recorded yet."); return; }
    const rows = STATUS_PLACES.flatMap((p) => placeSituations(book, p).filter((r) => r.labels.includes(label)).map((r) => `${r.unit} at ${p.name}`));
    say("hobson", rows.length ? `${rows.length === 1 ? "One Unit is" : `${rows.length} Units are`} recorded as ${label.toLowerCase()}: ${listWords(rows)}.\n\nI've faded the other places on the map.` : `Nothing is recorded as ${label.toLowerCase()} yet.`,
      rows.length ? { choices: ["Show everything"] } : { choices: ["Record a Unit's current situation"] });
  };

  const describePlace = (id: string) => {
    const p = placeById(id)!;
    setPlaceId(id); setFilter("All");
    const rows = placeSituations(book, p);
    say("hobson", rows.length
      ? `${p.name}, ${p.town}. ${rows.length} of its ${p.units.length} Units have a situation recorded:\n${rows.map((r) => `• ${r.unit} — ${lower(r.labels)}`).join("\n")}`
      : `${p.name}, ${p.town} — ${p.units.length} Units. Nothing is recorded yet about how they stand today.`,
      { choices: ["Record a situation here"] });
  };

  const onMapPick = (id: string) => {
    if (step === "place") { say("user", placeById(id)!.name); choosePlace(id); return; }
    describePlace(id);
  };

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    setInput(""); setTryOpen(false);
    say("user", text);
    if (step === "place") { const p = STATUS_PLACES.find((x) => x.name === text); if (p) return choosePlace(p.id); }
    if (step === "unit" && place?.units.includes(text)) return chooseUnit(text);
    setStep(null);
    if (text === "Record a Unit's current situation" || text === "Record another Unit") return startRecord();
    if (text === "Record a situation here" && placeId) return startRecord(placeId);
    if (text === "Show everything") return showFilter("All");
    if (text === "Fill in a sample portfolio") {
      setBook(SAMPLE); setFilter("All"); setPlaceId(null); setBloomId("colmore");
      say("hobson", "I've filled in seven sample situations across four places, so you can see the map come alive. These are invented for the demonstration.", { choices: ["Which Units are vacant?", "What's happening in Birmingham?"] });
      return;
    }
    const intent = interpret(text);
    if (intent.kind === "record") return startRecord();
    if (intent.kind === "filter") return showFilter(intent.label);
    if (intent.kind === "place") return describePlace(intent.placeId);
    say("hobson", "In this demonstration I can record how a Unit stands today and show it on the map. Use + to begin, or ask me what's vacant, available to let or being refurbished.");
  };

  const restart = () => {
    setMessages(SEED); setBook({}); setStep(null); setPlaceId(null); setUnit(null); setFilter("All"); setInput(""); nextId.current = 1;
  };

  const placeRows = place ? placeSituations(book, place) : [];

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-background text-ink">
      <aside className="flex w-[150px] shrink-0 flex-col gap-1 border-r border-bone bg-background px-3 py-4 max-md:hidden">
        <img src={owlDefault} alt="" aria-hidden className="mb-4 h-9 w-9 object-contain" />
        <span className="flex items-center gap-2 rounded-md bg-secondary px-2 py-1.5 text-sm font-medium"><MapPin className="h-4 w-4" aria-hidden />Portfolio</span>
        <span className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-ink-muted"><FileText className="h-4 w-4" aria-hidden />Papers</span>
        <span className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-ink-muted"><MessageSquare className="h-4 w-4" aria-hidden />Conversations</span>
        <div className="mt-auto grid h-9 w-9 place-items-center rounded-full bg-bone text-xs font-semibold text-charcoal">MT</div>
      </aside>

      <section aria-label="Chat with Hobson" className="flex w-[420px] min-w-0 shrink-0 flex-col border-r border-bone bg-background max-lg:w-[360px] max-md:w-full">
        <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-bone px-5">
          <p className="truncate text-sm"><span className="font-medium text-primary">Portfolio</span><span className="text-ink-muted"> › </span><span className="font-semibold">{place ? place.name : "Current situations"}</span></p>
          <Button variant="ghost" size="sm" aria-label="Restart demo" onClick={restart}><RotateCcw className="h-3.5 w-3.5 sm:mr-2" /><span className="max-sm:hidden">Restart</span></Button>
        </header>

        <div role="log" aria-label="Conversation" className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-5 py-4">
          {messages.map((m, i) => {
            const last = i === messages.length - 1;
            return (
              <div key={m.id} className={`flex min-w-0 flex-col gap-2 ${m.role === "user" ? "items-end" : "items-start"}`}>
                <div className="flex min-w-0 gap-2">
                  {m.role === "hobson" && <img src={owlDefault} alt="Hobson" className="h-9 w-9 shrink-0 object-contain" />}
                  <div className={`min-w-0 rounded-lg px-3.5 py-2.5 ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
                    <p className="whitespace-pre-line break-words text-sm leading-relaxed">{m.text}</p>
                    {m.situationField && last && step === "labels" && place && unit && (
                      <SituationField initial={book[unitKey(place.id, unit)]?.labels ?? []} onConfirm={confirm} />
                    )}
                  </div>
                </div>
                {m.choices && last && (
                  <div role="group" aria-label="Choose an answer" className="ml-11 flex flex-wrap gap-1.5">
                    {m.choices.map((c) => (
                      <button key={c} type="button" onClick={() => send(c)} className="group flex items-center gap-2 rounded-full border border-primary/25 bg-background px-3.5 py-1.5 text-left text-sm transition-colors hover:border-primary hover:bg-primary/5">
                        <span className="h-3 w-3 shrink-0 rounded-full border-2 border-primary/50 transition-colors group-hover:border-primary group-hover:bg-primary" aria-hidden />{c}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <div ref={logEnd} />
        </div>

        <div className="border-t border-faint-rule px-4 pb-4 pt-2">
          {tryOpen && (
            <div role="group" aria-label="Things you might try" className="mb-3 border-b border-bone pb-3">
              <div className="flex items-center justify-between"><span className="text-xs text-ink-muted">Things you might try</span><Button variant="ghost" size="icon" aria-label="Close suggestions" onClick={() => setTryOpen(false)}><X className="h-4 w-4" /></Button></div>
              {SCENARIOS.map((s) => <button key={s.label} type="button" onClick={() => send(s.text)} className="block w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-paper">{s.label}</button>)}
            </div>
          )}
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-1 rounded-full border border-input bg-background px-2 py-1.5 focus-within:ring-2 focus-within:ring-ring">
            <Popover open={menuOpen} onOpenChange={setMenuOpen}>
              <PopoverTrigger asChild>
                <Button type="button" variant="ghost" size="icon" aria-label="Chat actions" className="h-8 w-8 shrink-0 rounded-full text-primary hover:bg-primary/5 hover:text-primary"><Plus className="h-5 w-5" aria-hidden /></Button>
              </PopoverTrigger>
              <PopoverContent side="top" align="start" className="w-72 p-1.5" aria-label="Chat actions">
                <Button type="button" variant="ghost" onClick={() => { say("user", "Record a Unit's current situation"); startRecord(); }} className="w-full justify-start gap-3 px-3 font-normal"><Building2 className="h-4 w-4 text-primary" aria-hidden />Record a Unit's current situation</Button>
                <Button type="button" variant="ghost" disabled className="h-auto w-full items-start justify-start gap-3 px-3 py-2 text-left font-normal opacity-50"><Upload className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /><span><span className="block">Upload papers</span><span className="block text-xs text-muted-foreground">Coming soon</span></span></Button>
              </PopoverContent>
            </Popover>
            <Button type="button" variant="ghost" size="icon" aria-label="Things you might try" aria-expanded={tryOpen} onClick={() => setTryOpen((o) => !o)} className="h-8 w-8 shrink-0"><Lightbulb className="h-4 w-4" /></Button>
            <input value={input} onChange={(e) => setInput(e.target.value)} aria-label="Ask Hobson" placeholder="Ask me about your places" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
            <Button type="submit" size="icon" variant="ghost" disabled={!input.trim()} aria-label="Send message" className="h-8 w-8 shrink-0"><ArrowRight className="h-5 w-5" /></Button>
          </form>
        </div>
      </section>

      <section aria-label="Map" className="relative min-w-0 flex-1 max-md:hidden">
        <StatusMap book={book} filter={filter} selectedId={placeId} picking={step === "place"} bloomId={bloomId} onPick={onMapPick} />

        <div className="pointer-events-none absolute inset-x-4 top-4 z-[500] flex flex-wrap items-start justify-between gap-3">
          {hasAny ? (
            <div role="group" aria-label="Current situation" className="pointer-events-auto flex flex-wrap items-center gap-1.5 rounded-full border border-bone bg-background/95 p-1.5 shadow-md backdrop-blur animate-in fade-in slide-in-from-top-2 duration-500">
              <span className="px-2 text-sm font-semibold">Current situation</span>
              {(["All", ...SITUATIONS] as Filter[]).map((f) => {
                const on = filter === f;
                const tone = f === "All" ? null : TONE[f];
                return (
                  <button key={f} type="button" aria-pressed={on} onClick={() => { setPlaceId(null); setFilter(f); }}
                    style={on && tone ? { background: tone.color, borderColor: tone.color } : undefined}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors ${on ? "border-primary bg-primary text-primary-foreground" : "border-bone bg-background hover:border-primary/40"}`}>
                    {tone && <tone.Icon className="h-3.5 w-3.5" style={on ? undefined : { color: tone.color }} aria-hidden />}{f}
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="pointer-events-auto rounded-full border border-bone bg-background/95 px-4 py-2 text-sm text-ink-muted shadow-sm">
              {step === "place" ? "Touch a place to choose it" : `${STATUS_PLACES.length} places · nothing recorded yet about how they stand today`}
            </p>
          )}
          <span className="pointer-events-auto flex items-center gap-1 rounded-full border border-bone bg-background/95 p-1 text-sm shadow-sm">
            <span className="flex items-center gap-1.5 px-3 py-1 text-ink-muted"><FileText className="h-4 w-4" aria-hidden />Papers</span>
            <span className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 font-medium text-primary"><MapIcon className="h-4 w-4" aria-hidden />Map</span>
          </span>
        </div>

        {place && (
          <div role="region" aria-label={`${place.name} situations`} className="absolute right-4 top-20 z-[500] w-[340px] rounded-xl border border-bone bg-background p-4 shadow-xl animate-in fade-in slide-in-from-right-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="flex items-center gap-1.5 font-semibold"><MapPin className="h-4 w-4 text-primary" aria-hidden />{place.name}</p>
                <p className="text-xs text-ink-muted">{place.town} · {placeRows.length ? `${placeRows.length} of ${place.units.length} Units recorded` : `${place.units.length} Units`}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Close place" onClick={() => setPlaceId(null)}><X className="h-4 w-4" /></Button>
            </div>
            <ul className="mt-3 grid gap-1">
              {place.units.map((u) => {
                const r = book[unitKey(place.id, u)];
                return (
                  <li key={u} className={`flex flex-wrap items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm ${unit === u ? "bg-secondary" : ""}`}>
                    <span className={r ? "font-medium" : "text-ink-muted"}>{u}</span>
                    <span className="flex flex-wrap gap-1">{r ? r.labels.map((l) => <Chip key={l} label={l} />) : <span className="text-xs text-ink-muted">—</span>}</span>
                  </li>
                );
              })}
            </ul>
            {placeRows.length > 0 && <p className="mt-2 border-t border-bone pt-2 text-[11px] text-ink-muted">Recorded by you, not read from papers.</p>}
          </div>
        )}

        {hasAny && (
          <div aria-label="Legend" className="absolute bottom-4 left-4 z-[500] rounded-xl border border-bone bg-background/95 px-3 py-2.5 shadow-md animate-in fade-in duration-700">
            {SITUATIONS.map((l) => { const { Icon, color, hint } = TONE[l]; return (
              <p key={l} className="flex items-center gap-2 py-0.5 text-xs"><Icon className="h-3.5 w-3.5" style={{ color }} aria-hidden /><span className="font-medium">{l}</span><span className="text-ink-muted">{hint}</span></p>
            ); })}
            <p className="flex items-center gap-2 py-0.5 text-xs"><Layers className="h-3.5 w-3.5 text-primary" aria-hidden /><span className="font-medium">Ring</span><span className="text-ink-muted">shares of each place's situations</span></p>
          </div>
        )}
      </section>
    </div>
  );
}
