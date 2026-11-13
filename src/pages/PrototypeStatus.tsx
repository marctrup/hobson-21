// Prototype Status: Hobson marks on the map only the Units he reads as
// Unoccupied — no papers assigned, or the current chain has ended. Nobody records
// a situation by hand; the map is a statistic to investigate. Local state only.

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ArrowRight, FileQuestion, FileText, FileX, Lightbulb, Map as MapIcon, MapPin, MessageSquare, Plus, RotateCcw, Search, SlidersHorizontal, StickyNote, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import owlDefault from "@/assets/prototype/owl-default.png";
import {
  CURRENT, CURRENT_PLACE, REASONS, STATUS_PLACES, interpret, listWords, placeFindings, placeMatches, reasonCounts, unitKey, unitsMatching,
  type Filter, type FindingBook, type StatusPlace, type UnoccupiedReason,
} from "./prototypeStatus";

const TONE: Record<UnoccupiedReason, { color: string; Icon: typeof FileX; hint: string }> = {
  "No papers": { color: "var(--unoccupied-no-papers)", Icon: FileQuestion, hint: "No papers are assigned to the Unit" },
  "Chain ended": { color: "var(--unoccupied-chain-ended)", Icon: FileX, hint: "Its last chain of papers has ended" },
};

type Message = { id: number; role: "user" | "hobson"; text: string; choices?: string[]; noteField?: boolean };

const SEED: Message[] = [{
  id: 0, role: "hobson",
  text: `You're at the ${CURRENT.unit} at ${CURRENT_PLACE.name}, ${CURRENT_PLACE.town}.\n\nThe map marks every Unit I read as unoccupied — either no papers are assigned to it, or its current chain has ended. Those with no papers are worth checking first; once the papers are in, what remains should be genuinely ended chains.`,
}];

// Invented sample findings. Units not listed have a current chain.
const ended = (who: string, date: string) => ({ reason: "Chain ended" as const, detail: `Lease to ${who} ended ${date}` });
const none = { reason: "No papers" as const };
const SAMPLE: FindingBook = {
  [unitKey("colmore", "1st Floor")]: ended("Hartwell Partners LLP", "24 June 2025"),
  [unitKey("colmore", "2nd Floor")]: none,
  [unitKey("st-pauls", "5th Floor")]: ended("Northgate Media Limited", "28 September 2025"),
  [unitKey("st-pauls", "Car Park")]: none,
  [unitKey("paragon", "Unit 3")]: ended("Fern & Finch Limited", "25 March 2026"),
  [unitKey("paragon", "Unit 4")]: none,
  [unitKey("clyde", "Workshop")]: none,
  [unitKey("wharf", "3rd Floor")]: ended("Delta Freight Limited", "29 September 2025"),
  [unitKey("wharf", "4th Floor")]: none,
  [unitKey("wharf", "7th Floor")]: none,
  [unitKey("shoreditch", "Ground Floor")]: ended("Copper Pot Coffee Limited", "24 June 2026"),
  [unitKey("kings-cross", "2nd Floor")]: none,
  [unitKey("kings-cross", "5th Floor")]: none,
  [unitKey("southwark", "1st Floor")]: ended("Brightline Studios Limited", "25 December 2025"),
  [unitKey("camden", "Ground Floor")]: none,
  [unitKey("stratford", "3rd Floor")]: none,
  [unitKey("harbour", "Upper Floor")]: ended("Solent Marine Services Limited", "1 May 2026"),
};

const SCENARIOS = [
  { label: "Which Units have no papers?", text: "Which Units have no papers?" },
  { label: "Show ended chains", text: "Show me the ended chains" },
  { label: "Ask about a place", text: "What's unoccupied in Birmingham?" },
];

const placeById = (id: string | null) => STATUS_PLACES.find((p) => p.id === id) ?? null;

/** Complete ring: one reason fills it, two split it in half — never a part ring. */
function ringFor(places: StatusPlace[], book: FindingBook, filter: Filter) {
  const counts = reasonCounts(book, places);
  const labels = REASONS.filter((l) => counts[l] && (filter === "All" || filter === l));
  if (!labels.length) return null;
  const step = 360 / labels.length;
  const parts = labels.map((l, i) => `${TONE[l].color} ${i * step}deg ${(i + 1) * step}deg`);
  return `conic-gradient(${parts.join(", ")})`;
}

const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;");

function summaryLine(places: StatusPlace[], book: FindingBook) {
  const c = reasonCounts(book, places);
  const bits = REASONS.filter((l) => c[l]).map((l) => `<span class="inline-flex items-center gap-1"><span class="h-2 w-2 rounded-full" style="background:${TONE[l].color}"></span>${c[l]} ${l.toLowerCase()}</span>`);
  return bits.length ? `<div class="mt-1.5 flex flex-wrap gap-x-2.5 gap-y-1 text-[11px]">${bits.join("")}</div>` : `<div class="mt-1 text-[11px] text-muted-foreground">Nothing unoccupied</div>`;
}

const CLUSTER_PX = 64;

function StatusMap({ book, filter, selectedId, onPick }: {
  book: FindingBook; filter: Filter; selectedId: string | null; onPick: (id: string) => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const layer = useRef<L.LayerGroup | null>(null);
  const pick = useRef(onPick);
  pick.current = onPick;
  const hasAny = true;
  const [zoom, setZoom] = useState(0);

  useEffect(() => {
    if (!box.current) return;
    // The map may mount hidden (zero size on phones), so only fit once it has room.
    const m = L.map(box.current, { zoomControl: false, attributionControl: true }).setView([54, -3], 5);
    const fitAll = () => { const s = m.getSize(); if (s.x > 0 && s.y > 0) m.fitBounds(STATUS_PLACES.map((p) => p.coords), { padding: [Math.min(60, s.x / 4), Math.min(60, s.y / 4)] }); };
    fitAll();
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap contributors", maxZoom: 19 }).addTo(m);
    L.control.zoom({ position: "bottomright" }).addTo(m);
    layer.current = L.layerGroup().addTo(m);
    map.current = m;
    setZoom(m.getZoom());
    m.on("zoomend", () => setZoom(m.getZoom()));
    let fitted = m.getSize().x > 0;
    const ro = new ResizeObserver(() => { m.invalidateSize({ animate: false }); if (!fitted && m.getSize().x > 0) { fitted = true; fitAll(); } });
    ro.observe(box.current);
    return () => { ro.disconnect(); m.remove(); map.current = null; };
  }, []);

  useEffect(() => {
    const g = layer.current;
    const m = map.current;
    if (!g || !m) return;
    g.clearLayers();

    // Group places that would sit on top of each other at this zoom.
    const groups: { pt: L.Point; places: StatusPlace[] }[] = [];
    STATUS_PLACES.forEach((p) => {
      const pt = m.project(p.coords, zoom);
      const near = groups.find((gr) => gr.pt.distanceTo(pt) < CLUSTER_PX && !gr.places.some((x) => x.id === selectedId) && p.id !== selectedId);
      if (near) near.places.push(p); else groups.push({ pt, places: [p] });
    });

    groups.forEach(({ places }) => {
      if (places.length > 1) {
        const total = places.reduce((n, p) => n + p.units.length, 0);
        const matching = unitsMatching(book, places, filter);
        const bg = ringFor(places, book, filter);
        const towns = [...new Set(places.map((p) => p.town))];
        const title = towns.length === 1 ? towns[0] : `${towns.length} towns`;
        const shown = filter === "All" ? total : matching;
        const size = 58;
        const html = `<span class="relative block cursor-pointer transition-opacity duration-500 ${bg ? "" : "opacity-50"}">
          <span style="background:${bg ?? "hsl(var(--border))"}" class="grid h-[58px] w-[58px] place-items-center rounded-full shadow-lg ${bg ? "status-breathe" : ""}">
            <span class="grid h-[44px] w-[44px] place-items-center rounded-full bg-background leading-none">
              <span class="text-base font-semibold text-foreground">${shown}</span>
              <span class="-mt-2 text-[9px] uppercase tracking-wide text-muted-foreground">${filter === "All" ? "Units" : "match"}</span>
            </span>
          </span>
          ${matching ? `<span class="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full border-2 border-background bg-primary px-1 text-[10px] font-bold text-primary-foreground">${matching}</span>` : ""}
        </span>`;
        const tip = `<div class="min-w-[190px]"><div class="text-xs font-semibold">${esc(title)}</div><div class="text-[11px] text-muted-foreground">${total} Units in ${places.length} places</div>${summaryLine(places, book)}<div class="mt-2 text-[11px] font-medium text-primary">Click to zoom in</div></div>`;
        L.marker(m.unproject(places.reduce((acc, p) => acc.add(m.project(p.coords, zoom)), L.point(0, 0)).divideBy(places.length), zoom), {
          icon: L.divIcon({ className: "", html, iconSize: [size, size], iconAnchor: [size / 2, size / 2] }), keyboard: true, title: `${title}: ${total} Units`,
        })
          .bindTooltip(tip, { direction: "top", offset: [0, -30], className: "status-tip" })
          .on("click", () => m.flyToBounds(places.map((p) => p.coords), { padding: [80, 80], maxZoom: 15, duration: 0.9 }))
          .addTo(g);
        return;
      }

      const p = places[0];
      const bg = ringFor([p], book, filter);
      const recorded = unitsMatching(book, [p], filter);
      const dim = hasAny && filter !== "All" && !placeMatches(book, p, filter);
      const selected = p.id === selectedId;
      const here = p.id === CURRENT.placeId;
      const size = bg ? 46 : 32;
      const core = bg
        ? `<span style="background:${bg}" class="relative grid h-[46px] w-[46px] place-items-center rounded-full shadow-lg"><span class="grid h-[34px] w-[34px] place-items-center rounded-full bg-background text-sm font-semibold text-foreground">${recorded}</span></span>`
        : `<span class="grid h-8 w-8 place-items-center rounded-full border-2 ${here ? "border-primary text-primary" : "border-background text-muted-foreground"} bg-background text-xs font-semibold shadow-md ${!hasAny && here ? "status-breathe" : ""}">${p.units.length}</span>`;
      const bloom = "";
      const label = selected || here
        ? `<span class="absolute left-full top-1/2 ml-2 -translate-y-1/2 whitespace-nowrap rounded-full ${selected ? "bg-primary text-primary-foreground" : "bg-background text-foreground"} px-2.5 py-0.5 text-xs font-medium shadow">${here ? `You are here · ${p.name}` : p.name}</span>`
        : "";
      const badge = "";
      const html = `<span class="relative block cursor-pointer transition-opacity duration-500 ${dim ? "opacity-30" : ""} ${selected ? "scale-110" : ""}">${bloom}${core}${badge}${label}</span>`;
      L.marker(p.coords, { icon: L.divIcon({ className: "", html, iconSize: [size, size], iconAnchor: [size / 2, size / 2] }), keyboard: true, title: `${p.name}, ${p.town}`, zIndexOffset: selected ? 1000 : 0 })
        .on("click", () => {
          pick.current(p.id);
        }).addTo(g);
    });
  }, [book, filter, selectedId, hasAny, zoom]);

  useEffect(() => {
    const m = map.current;
    if (!m) return;
    const sz = m.getSize();
    if (sz.x <= 0 || sz.y <= 0) return; // hidden map: nothing to fly
    const p = placeById(selectedId);
    if (p) { m.flyTo(p.coords, p.town === "London" ? 14 : 11, { duration: 1.1 }); return; }
    const pts = filter === "All" ? STATUS_PLACES : STATUS_PLACES.filter((x) => placeMatches(book, x, filter));
    if (pts.length) m.flyToBounds(pts.map((x) => x.coords), { padding: [Math.min(90, sz.x / 4), Math.min(90, sz.y / 4)], maxZoom: 9, duration: 1.1 });
  }, [selectedId, filter, book]);

  return <div ref={box} aria-label="Map of your places" className="status-map absolute inset-0 z-0" />;
}

function NoteField({ onSave }: { onSave: (t: string) => void }) {
  const [text, setText] = useState("");
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (text.trim()) onSave(text.trim()); }} className="mt-3 grid gap-2">
      <textarea autoFocus value={text} onChange={(e) => setText(e.target.value)} aria-label="Your note" rows={3}
        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (text.trim()) onSave(text.trim()); } }}
        className="w-full rounded-md border border-primary/20 bg-background px-3 py-2 text-sm outline-none focus:border-primary/50" />
      <Button type="submit" size="sm" disabled={!text.trim()} className="w-fit">Save note</Button>
    </form>
  );
}

function Chip({ reason }: { reason: UnoccupiedReason }) {
  const { Icon, color } = TONE[reason];
  return (
    <span style={{ color, borderColor: color }} className="inline-flex items-center gap-1 rounded-full border bg-background px-2 py-0.5 text-xs font-medium">
      <Icon className="h-3 w-3" aria-hidden />{reason}
    </span>
  );
}

export default function PrototypeStatus() {
  const [messages, setMessages] = useState<Message[]>(SEED);
  const book = SAMPLE;
  const [noting, setNoting] = useState(false);
  const [placeId, setPlaceId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("All");
  const [input, setInput] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [tryOpen, setTryOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const nextId = useRef(1);
  const logEnd = useRef<HTMLDivElement>(null);
  const place = placeById(placeId);

  useEffect(() => { logEnd.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [messages]);

  const say = (role: Message["role"], text: string, extra: Partial<Message> = {}) =>
    setMessages((ms) => [...ms, { id: nextId.current++, role, text, ...extra }]);

  const startNote = () => {
    setMenuOpen(false); setNoting(true);
    say("user", "Add a Note");
    say("hobson", `Please provide the note for the ${CURRENT.unit}, which I will keep on file for you.`, { noteField: true });
  };

  const saveNote = (text: string) => {
    setNoting(false);
    say("user", text);
    say("hobson", `Noted. I've kept that on file for the ${CURRENT.unit}.`);
  };

  const showFilter = (f: Filter) => {
    setFilter(f); setPlaceId(null);
    const rows = STATUS_PLACES.flatMap((p) => placeFindings(book, p).filter((r) => f === "All" || r.reason === f).map((r) => `${r.unit} at ${p.name}`));
    const c = reasonCounts(book);
    if (f === "All") { say("hobson", `${rows.length} Units read as unoccupied: ${c["No papers"]} with no papers and ${c["Chain ended"]} whose chain has ended.\n\nThe ones with no papers may simply be awaiting their papers — worth checking first.`, { choices: ["Which Units have no papers?", "Show me the ended chains"] }); return; }
    say("hobson", f === "No papers"
      ? `${rows.length} Units have no papers assigned to them: ${listWords(rows)}.\n\nIf any of these is let, its papers haven't reached me yet — once they do, I'll read it afresh.`
      : `${rows.length} Units have a chain that has ended: ${listWords(rows)}.\n\nThese are the ones that should genuinely be unoccupied.`,
      { choices: ["Show everything unoccupied"] });
  };

  const describePlace = (id: string) => {
    const p = placeById(id)!;
    setPlaceId(id); setFilter("All");
    const rows = placeFindings(book, p);
    say("hobson", rows.length
      ? `${p.name}, ${p.town}. ${rows.length} of its ${p.units.length} Units read as unoccupied:\n${rows.map((r) => `• ${r.unit} — ${r.reason === "No papers" ? "no papers" : r.detail}`).join("\n")}`
      : `${p.name}, ${p.town} — every one of its ${p.units.length} Units has a current chain.`,
      { choices: ["Show everything unoccupied"] });
  };

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    setInput(""); setTryOpen(false); setNoting(false);
    say("user", text);
    if (text === "Show everything unoccupied") return showFilter("All");
    const intent = interpret(text);
    if (intent.kind === "filter") return showFilter(intent.filter);
    if (intent.kind === "place") return describePlace(intent.placeId);
    say("hobson", "In this demonstration I show which Units I read as unoccupied — no papers, or an ended chain. Ask me which have no papers, which chains have ended, or about a place.");
  };

  const restart = () => {
    setMessages(SEED); setNoting(false); setPlaceId(null); setFilter("All"); setInput(""); nextId.current = 1;
  };

  // One card per place: every Unit listed, unoccupied ones with Hobson's reason.
  const cardRows = place ? place.units.map((u) => ({ unit: u, finding: book[unitKey(place.id, u)] ?? null })) : [];

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
          <p className="truncate text-sm"><span className="font-medium text-primary">Portfolio</span><span className="text-ink-muted"> › </span><span className="font-semibold">{CURRENT_PLACE.name}</span><span className="text-ink-muted"> › </span><span className="font-semibold">{CURRENT.unit}</span></p>
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
                    {m.noteField && last && noting && <NoteField onSave={saveNote} />}
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
                <Button type="button" variant="ghost" onClick={startNote} className="w-full justify-start gap-3 px-3 font-normal"><StickyNote className="h-4 w-4 text-primary" aria-hidden />Add a Note</Button>
                <Button type="button" variant="ghost" disabled className="h-auto w-full items-start justify-start gap-3 px-3 py-2 text-left font-normal opacity-50"><Upload className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /><span><span className="block">Upload papers</span><span className="block text-xs text-muted-foreground">Coming soon</span></span></Button>
              </PopoverContent>
            </Popover>
            <Button type="button" variant="ghost" size="icon" aria-label="Things you might try" aria-expanded={tryOpen} onClick={() => setTryOpen((o) => !o)} className="h-8 w-8 shrink-0"><Lightbulb className="h-4 w-4" /></Button>
            <input value={input} onChange={(e) => setInput(e.target.value)} aria-label="Ask Hobson" placeholder="Ask me what's unoccupied" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
            <Button type="submit" size="icon" variant="ghost" disabled={!input.trim()} aria-label="Send message" className="h-8 w-8 shrink-0"><ArrowRight className="h-5 w-5" /></Button>
          </form>
        </div>
      </section>

      <section aria-label="Map" className="relative min-w-0 flex-1 max-md:hidden">
        <StatusMap book={book} filter={filter} selectedId={placeId} onPick={(id) => { setFilter("All"); setPlaceId(id); }} />

        <div className="pointer-events-none absolute inset-x-4 top-4 z-[500] flex items-start justify-end gap-2">
          <div className="pointer-events-auto flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Search your places"
                aria-expanded={searchOpen}
                onClick={() => { setSearchOpen((o) => !o); setFiltersOpen(false); }}
                className="grid h-11 w-11 place-items-center rounded-full border border-bone bg-background/95 shadow-md backdrop-blur transition-transform hover:scale-105"
              >
                <Search className="h-5 w-5 text-primary" aria-hidden />
              </button>
              {(
                <button
                  type="button"
                  aria-label="Unoccupied filters"
                  aria-expanded={filtersOpen}
                  onClick={() => { setFiltersOpen((o) => !o); setSearchOpen(false); }}
                  style={filter !== "All" && !filtersOpen ? { color: TONE[filter].color, borderColor: TONE[filter].color } : undefined}
                  className="grid h-11 w-11 place-items-center rounded-full border border-bone bg-background/95 shadow-md backdrop-blur transition-transform hover:scale-105"
                >
                  {filter !== "All" && !filtersOpen
                    ? (() => { const { Icon } = TONE[filter]; return <Icon className="h-5 w-5" aria-hidden />; })()
                    : <SlidersHorizontal className="h-5 w-5 text-primary" aria-hidden />}
                </button>
              )}
              <span className="flex items-center gap-1 rounded-full border border-bone bg-background/95 p-1 text-sm shadow-sm">
                <span className="flex items-center gap-1.5 px-3 py-1 text-ink-muted"><FileText className="h-4 w-4" aria-hidden />Papers</span>
                <span className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 font-medium text-primary"><MapIcon className="h-4 w-4" aria-hidden />Map</span>
              </span>
            </div>
            {searchOpen && (
              <div role="search" aria-label="Search your places" className="w-[300px] rounded-2xl border border-bone bg-background/95 p-2 shadow-md backdrop-blur animate-in fade-in slide-in-from-top-2 duration-300">
                <input
                  autoFocus
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  aria-label="Search places"
                  placeholder="Search a place or town…"
                  className="w-full rounded-full border border-bone bg-background px-3 py-1.5 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/50"
                />
                <ul className="mt-1.5 max-h-56 overflow-y-auto">
                  {STATUS_PLACES.filter((p) => {
                    const t = searchText.trim().toLowerCase();
                    return !t || p.name.toLowerCase().includes(t) || p.town.toLowerCase().includes(t);
                  }).map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => { setPlaceId(p.id); setSearchOpen(false); setSearchText(""); }}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm hover:bg-secondary"
                      >
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                        <span className="min-w-0 flex-1 truncate font-medium">{p.name}</span>
                        <span className="shrink-0 text-xs text-ink-muted">{p.town}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {filtersOpen && (
              <div role="group" aria-label="Unoccupied" className="rounded-2xl border border-bone bg-background/95 p-1.5 shadow-md backdrop-blur animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex flex-wrap items-center justify-end gap-1.5">
                {(["All", ...REASONS] as Filter[]).map((f) => {
                  const on = filter === f;
                  const n = f === "All" ? unitsMatching(book, STATUS_PLACES, "All") : reasonCounts(book)[f];
                  const tone = f === "All" ? null : TONE[f];
                  return (
                    <button key={f} type="button" aria-pressed={on} onClick={() => { setPlaceId(null); setFilter(f); setFiltersOpen(false); }}
                      style={on && tone ? { background: tone.color, borderColor: tone.color } : undefined}
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors ${on ? "border-primary bg-primary text-primary-foreground" : "border-bone bg-background hover:border-primary/40"}`}>
                      {tone && <tone.Icon className="h-3.5 w-3.5" style={on ? undefined : { color: tone.color }} aria-hidden />}{f === "All" ? "All unoccupied" : f}
                      <span className={`ml-0.5 rounded-full px-1.5 text-xs font-semibold tabular-nums ${on ? "bg-background/25" : "bg-secondary text-foreground"}`}>{n}</span>
                    </button>
                  );
                })}
                </div>
                <div className="mt-1.5 border-t border-bone px-2 pt-1.5">
                  {REASONS.map((l) => { const { Icon, color, hint } = TONE[l]; return (
                    <p key={l} className="flex items-center gap-2 py-0.5 text-xs"><Icon className="h-3.5 w-3.5" style={{ color }} aria-hidden /><span className="font-medium">{l}</span><span className="text-ink-muted">{hint}</span></p>
                  ); })}
                </div>
              </div>
            )}
          </div>
        </div>

        {place && (
          <div role="region" aria-label={`${place.name} unoccupied Units`} className="absolute right-4 top-20 z-[500] flex max-h-[calc(100%-7rem)] w-[340px] flex-col rounded-2xl border border-bone bg-background shadow-xl animate-in fade-in slide-in-from-right-2">
            <div className="flex items-start justify-between gap-2 p-4 pb-0">
              <div>
                <p className="flex items-center gap-1.5 font-semibold"><MapPin className="h-4 w-4 text-primary" aria-hidden />{place.name}{place.id === CURRENT.placeId && <span className="text-xs font-normal text-ink-muted">· you are here</span>}</p>
                <p className="text-xs text-ink-muted">{place.units.length} Units · {place.town}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Close place" onClick={() => setPlaceId(null)}><X className="h-4 w-4" /></Button>
            </div>
            <ul className="mt-2 min-h-0 flex-1 overflow-y-auto p-2">
              {cardRows.map(({ unit, finding }) => (
                <li key={unit} className={`rounded-lg px-2.5 py-2 ${finding ? "" : "opacity-70"}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className={`truncate text-sm ${finding ? "font-medium" : "text-ink-muted"}`}>{unit}</span>
                    {finding ? <Chip reason={finding.reason} /> : <span className="text-xs text-ink-muted">current chain</span>}
                  </div>
                  {finding && <p className="mt-1 text-[11px] text-ink-muted">{finding.detail ?? "Nothing assigned yet — worth checking whether papers are missing."}</p>}
                </li>
              ))}
            </ul>
            <p className="border-t border-bone px-4 py-2.5 text-[11px] text-ink-muted">Read from the papers I hold — not recorded by hand.</p>
          </div>
        )}
      </section>
    </div>
  );
}
