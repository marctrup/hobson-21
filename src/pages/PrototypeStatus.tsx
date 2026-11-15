// Prototype Status: derived Unoccupied findings, confirmed tenancy endings and
// availability to let remain separate facts. Illustrative changes happen in chat.

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ArrowRight, Building2, CalendarClock, Check, ChevronDown, ChevronRight, FileQuestion, FileText, FileX, Lightbulb, Map as MapIcon, MapPin, MessageSquare, Plus, RotateCcw, Search, SlidersHorizontal, StickyNote, Tag, TriangleAlert, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import * as Tooltip from "@radix-ui/react-tooltip";
import owlDefault from "@/assets/prototype/owl-default.png";
import {
  CURRENT, CURRENT_PLACE, STATUS_PLACES, complianceAtPlace, complianceKindCounts, interpret, listWords, parseStatusInstruction, placeMatchesSignals,
  signalCounts, signalUnitsMatching, unitKey, unitMatchesFilter,
  type AvailabilityBook, type ComplianceBook, type EndingBook, type FindingBook, type MapFilter, type StatusPlace, type StatusInstruction,
} from "./prototypeStatus";

type Signal = Exclude<MapFilter, "All">;
const TONE: Record<Signal, { color: string; Icon: typeof FileX; hint: string }> = {
  "No papers": { color: "hsl(var(--unoccupied-no-papers))", Icon: FileQuestion, hint: "No occupancy papers have been provided" },
  "No new occupancy": { color: "hsl(var(--unoccupied-chain-ended))", Icon: FileX, hint: "Its last occupancy has ended" },
  "Tenancy ending": { color: "hsl(var(--tenancy-ending))", Icon: CalendarClock, hint: "A confirmed legal ending is approaching" },
  "Available to let": { color: "hsl(var(--primary))", Icon: Tag, hint: "Being offered for a new occupier; not necessarily empty" },
  "Compliance warning": { color: "var(--warning)", Icon: TriangleAlert, hint: "Expired, missing or expiring documents; ask Hobson for detail" },
};
const FILTERS: MapFilter[] = ["All", "No papers", "Tenancy ending", "No new occupancy", "Available to let", "Compliance warning"];
type PaperFilter = Exclude<MapFilter, "Available to let">;
const PAPER_FILTERS: PaperFilter[] = ["All", "No papers", "Tenancy ending", "No new occupancy", "Compliance warning"];
const signalLabel = (signal: MapFilter) => signal === "Tenancy ending" ? "Occupancy ending" : signal;

type PendingAction = StatusInstruction;
type RecentChange = { placeId: string; unit: string; kind: "ending" | "available" };
type Message = { id: number; role: "user" | "hobson"; text: string; choices?: string[]; noteField?: boolean; action?: PendingAction };

const SEED: Message[] = [{
  id: 0, role: "hobson",
  text: `You're at the ${CURRENT.unit} at ${CURRENT_PLACE.name}, ${CURRENT_PLACE.town}.`,
}];

// Invented sample findings. Units not listed have a current chain.
const ended = (who: string, date: string) => ({ reason: "No new occupancy" as const, detail: `Lease to ${who} ended ${date}` });
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

const SAMPLE_ENDINGS: EndingBook = {
  [unitKey("exchange", "2nd Floor")]: { date: "31 March 2027", detail: "Confirmed deed of surrender, effective 31 March 2027" },
  [unitKey("soho", "3rd Floor")]: { date: "30 June 2027", detail: "Exercised break with conditions satisfied; effective 30 June 2027" },
};
const SAMPLE_AVAILABLE: AvailabilityBook = {
  [unitKey("colmore", "1st Floor")]: { detail: "Being offered for a new occupier" },
  [unitKey("paragon", "Unit 3")]: { detail: "Being offered for a new occupier" },
  [unitKey("exchange", "2nd Floor")]: { detail: "Being offered before the confirmed tenancy ending" },
  [unitKey("linear-park", "Ground Floor")]: { detail: "Being offered while the current chain continues" },
};
const SAMPLE_COMPLIANCE: ComplianceBook = {
  [unitKey("colmore", "2nd Floor")]: [{ kind: "Missing document", document: "Fire risk assessment" }],
  [unitKey("exchange", "Ground Floor")]: [{ kind: "Expired document", document: "Electrical installation condition report", date: "30 September 2026" }],
  [unitKey("exchange", "2nd Floor")]: [{ kind: "Expiring soon", document: "Fire alarm test certificate", date: "30 November 2026" }],
  [unitKey("paragon", "Unit 2")]: [{ kind: "Missing document", document: "Asbestos management survey" }],
  [unitKey("linear-park", "1st Floor")]: [{ kind: "Expiring soon", document: "Fire risk assessment", date: "30 November 2026" }],
  [unitKey("clyde", "Studio A")]: [{ kind: "Expired document", document: "Electrical installation condition report", date: "1 October 2026" }],
};

const SCENARIOS = [
  { label: "Show compliance warnings", text: "Which Units have compliance warnings?" },
  { label: "Ask about compliance at The Exchange", text: "Tell me about compliance at The Exchange" },
  { label: "Which tenancies are ending?", text: "Which tenancies are ending?" },
  { label: "Show Units available to let", text: "Which Units are available to let?" },
  { label: "Try confirming a tenancy ending", text: "The tenancy on the 1st Floor at The Exchange ends on 30 September 2027." },
  { label: "Try marking a Unit available to let", text: "Mark the 2nd Floor at 1 Linear Park as available to let." },
];

const placeById = (id: string | null) => STATUS_PLACES.find((p) => p.id === id) ?? null;

/** Complete ring for data/tenancy facts. Availability and compliance stay separate. */
function ringFor(places: StatusPlace[], book: FindingBook, endings: EndingBook, availability: AvailabilityBook, compliance: ComplianceBook, filter: MapFilter) {
  const counts = signalCounts(book, endings, availability, places, compliance);
  const labels = (["No papers", "No new occupancy", "Tenancy ending"] as const).filter((l) => counts[l] && (filter === "All" || filter === l));
  if (!labels.length) return null;
  const step = 360 / labels.length;
  const parts = labels.map((l, i) => `${TONE[l].color} ${i * step}deg ${(i + 1) * step}deg`);
  return `conic-gradient(${parts.join(", ")})`;
}

const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;");

function summaryLine(places: StatusPlace[], book: FindingBook, endings: EndingBook, availability: AvailabilityBook, compliance: ComplianceBook) {
  const c = signalCounts(book, endings, availability, places, compliance);
  const bits = (["No papers", "Tenancy ending", "No new occupancy", "Available to let", "Compliance warning"] as Signal[]).filter((l) => c[l]).map((l) =>
    `<span class="inline-flex items-center gap-1"><span class="h-2 w-2 rounded-full" style="background:${TONE[l].color}"></span>${c[l]} ${signalLabel(l).toLowerCase()}</span>`);
  return bits.length ? `<div class="mt-1.5 flex flex-wrap gap-x-2.5 gap-y-1 text-[11px]">${bits.join("")}</div>` : `<div class="mt-1 text-[11px] text-muted-foreground">No map signals</div>`;
}

/** One quiet aggregate warning; document-level detail belongs in conversation. */
function complianceBadge(count: number) {
  if (!count) return "";
  return `<span class="absolute right-full top-1/2 mr-2 flex -translate-y-1/2 items-center gap-1 whitespace-nowrap rounded-full border bg-background px-1.5 py-1 text-[10px] font-bold shadow-md" style="color:${TONE["Compliance warning"].color};border-color:${TONE["Compliance warning"].color}" title="Compliance warnings — ask Hobson for document details"><span class="grid h-4 w-4 place-items-center rounded-full text-[11px]" style="background:${TONE["Compliance warning"].color};color:hsl(var(--background))">!</span>${count}</span>`;
}

const CLUSTER_PX = 70;

function StatusMap({ book, endings, availability, compliance, filter, selectedId, recentChange, onPick }: {
  book: FindingBook; endings: EndingBook; availability: AvailabilityBook; compliance: ComplianceBook; filter: MapFilter; selectedId: string | null;
  recentChange: RecentChange | null; onPick: (id: string) => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const layer = useRef<L.LayerGroup | null>(null);
  const pick = useRef(onPick);
  pick.current = onPick;
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
        const matching = signalUnitsMatching(book, endings, availability, places, filter, compliance);
        const available = signalUnitsMatching(book, endings, availability, places, "Available to let", compliance);
        const ending = signalUnitsMatching(book, endings, availability, places, "Tenancy ending", compliance);
        const warnings = signalUnitsMatching(book, endings, availability, places, "Compliance warning", compliance);
        const bg = ringFor(places, book, endings, availability, compliance, filter);
        const towns = [...new Set(places.map((p) => p.town))];
        const title = towns.length === 1 ? towns[0] : `${towns.length} towns`;
        const html = `<span class="relative block cursor-pointer transition-opacity duration-500 ${bg || available || warnings ? "" : "opacity-50"}">
          <span style="background:${bg ?? "hsl(var(--border))"}" class="grid h-[58px] w-[58px] place-items-center rounded-full shadow-lg">
            <span class="grid h-[44px] w-[44px] place-items-center rounded-full bg-background leading-none">
              <span class="text-base font-semibold text-foreground">${matching}</span>
              <span class="-mt-2 text-[9px] uppercase tracking-wide text-muted-foreground">Units</span>
            </span>
          </span>
          ${ending ? `<span class="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded-full border-2 border-background px-2 py-0.5 text-[9px] font-bold tracking-wide text-primary-foreground shadow-md" style="background:${TONE["Tenancy ending"].color}">ENDING · ${ending}</span>` : ""}
          ${available ? `<span class="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-full border-2 border-background bg-primary px-2 py-0.5 text-[9px] font-bold tracking-wide text-primary-foreground shadow-md">TO LET · ${available}</span>` : ""}
          ${complianceBadge(warnings)}
        </span>`;
        const tip = `<div class="min-w-[200px]"><div class="text-xs font-semibold">${esc(title)}</div><div class="text-[11px] text-muted-foreground">${total} Units in ${places.length} places</div>${summaryLine(places, book, endings, availability, compliance)}<div class="mt-2 text-[11px] font-medium text-primary">Click to zoom in</div></div>`;
        L.marker(m.unproject(places.reduce((acc, p) => acc.add(m.project(p.coords, zoom)), L.point(0, 0)).divideBy(places.length), zoom), {
          icon: L.divIcon({ className: "", html, iconSize: [64, 64], iconAnchor: [32, 32] }), keyboard: true, title: `${title}: ${matching} Units with map signals`,
        })
          .bindTooltip(tip, { direction: "top", offset: [0, -30], className: "status-tip" })
          .on("click", () => m.flyToBounds(places.map((p) => p.coords), { padding: [80, 80], maxZoom: 15, duration: 0.9 }))
          .addTo(g);
        return;
      }

      const p = places[0];
      const bg = ringFor([p], book, endings, availability, compliance, filter);
      const recorded = signalUnitsMatching(book, endings, availability, [p], filter, compliance);
      const available = signalUnitsMatching(book, endings, availability, [p], "Available to let", compliance);
      const ending = signalUnitsMatching(book, endings, availability, [p], "Tenancy ending", compliance);
      const warnings = signalUnitsMatching(book, endings, availability, [p], "Compliance warning", compliance);
      const dim = filter !== "All" && !placeMatchesSignals(book, endings, availability, p, filter, compliance);
      const selected = p.id === selectedId;
      const here = p.id === CURRENT.placeId;
      const recent = recentChange?.placeId === p.id;
      const size = bg ? 48 : 34;
      const displayCount = filter === "All" && !bg && !available && !warnings ? p.units.length : recorded;
      const core = bg
        ? `<span style="background:${bg}" class="relative grid h-12 w-12 place-items-center rounded-full shadow-lg"><span class="grid h-[34px] w-[34px] place-items-center rounded-full bg-background text-sm font-semibold text-foreground">${displayCount}</span></span>`
        : `<span class="grid h-[34px] w-[34px] place-items-center rounded-full border-2 ${available ? "border-primary text-primary" : here ? "border-primary text-primary" : "border-background text-muted-foreground"} bg-background text-xs font-semibold shadow-md">${displayCount}</span>`;
      const bloom = recent ? `<span class="status-change-bloom absolute inset-0 rounded-full"></span>` : "";
      const label = selected || here
        ? `<span class="absolute left-full top-1/2 ml-2 -translate-y-1/2 whitespace-nowrap rounded-full ${selected ? "bg-primary text-primary-foreground" : "bg-background text-foreground"} px-2.5 py-0.5 text-xs font-medium shadow">${here ? `You are here · ${p.name}` : p.name}</span>`
        : "";
      const endingBadge = ending ? `<span class="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded-full border-2 border-background px-2 py-0.5 text-[9px] font-bold tracking-wide text-primary-foreground shadow-md" style="background:${TONE["Tenancy ending"].color}">ENDING${ending > 1 ? ` · ${ending}` : ""}</span>` : "";
      const badge = available ? `<span class="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-full border-2 border-background bg-primary px-2 py-0.5 text-[9px] font-bold tracking-wide text-primary-foreground shadow-md">TO LET${available > 1 ? ` · ${available}` : ""}</span>` : "";
      const html = `<span class="relative block cursor-pointer transition-all duration-500 ${dim ? "opacity-25" : ""} ${selected ? "scale-110" : ""} ${recent ? "status-just-changed" : ""}">${bloom}${core}${endingBadge}${badge}${complianceBadge(warnings)}${label}</span>`;
      L.marker(p.coords, { icon: L.divIcon({ className: "", html, iconSize: [size, size], iconAnchor: [size / 2, size / 2] }), keyboard: true, title: `${p.name}, ${p.town}`, zIndexOffset: selected ? 1000 : 0 })
        .on("click", () => pick.current(p.id))
        .addTo(g);
    });
  }, [book, endings, availability, compliance, filter, selectedId, recentChange, zoom]);

  useEffect(() => {
    const m = map.current;
    if (!m) return;
    const sz = m.getSize();
    if (sz.x <= 0 || sz.y <= 0) return; // hidden map: nothing to fly
    const p = placeById(selectedId);
    if (p) { m.flyTo(p.coords, p.town === "London" ? 14 : 12, { duration: 1.1 }); return; }
    const pts = filter === "All" ? STATUS_PLACES : STATUS_PLACES.filter((x) => placeMatchesSignals(book, endings, availability, x, filter, compliance));
    if (pts.length) m.flyToBounds(pts.map((x) => x.coords), { padding: [Math.min(90, sz.x / 4), Math.min(90, sz.y / 4)], maxZoom: 9, duration: 1.1 });
  }, [selectedId, filter, book, endings, availability, compliance]);

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

function Chip({ signal }: { signal: Signal }) {
  const { Icon, color } = TONE[signal];
  return (
    <span style={{ color, borderColor: color }} className="inline-flex items-center gap-1 rounded-full border bg-background px-2 py-0.5 text-[11px] font-medium">
      <Icon className="h-3 w-3" aria-hidden />{signalLabel(signal)}
    </span>
  );
}

/** Papers reuses the map's findings, but availability remains a map-only signal. */
function PapersReview({ book, endings, compliance, filter, onFilter }: {
  book: FindingBook;
  endings: EndingBook;
  compliance: ComplianceBook;
  filter: PaperFilter;
  onFilter: (filter: PaperFilter) => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const counts = signalCounts(book, endings, {}, STATUS_PLACES, compliance);
  const rows = STATUS_PLACES.flatMap((place) => {
    const units = place.units.filter((unit) => unitMatchesFilter(place.id, unit, book, endings, {}, filter, compliance));
    return units.length ? [{ place, units }] : [];
  });
  const summary = filter === "All"
    ? `${counts.All} Units have something to review across your papers and occupancy records.`
    : `${counts[filter]} ${counts[filter] === 1 ? "Unit" : "Units"} · ${TONE[filter].hint}`;

  return (
    <div role="region" aria-label="Papers review" className="absolute inset-0 overflow-y-auto bg-background px-6 pb-8 pt-5">
      <header className="pr-56">
        <div className="flex items-center gap-3">
          <img src={owlDefault} alt="" aria-hidden className="h-10 w-10 object-contain" />
          <div>
            <h1 className="text-xl font-semibold text-foreground">Review</h1>
            <p className="mt-0.5 text-sm text-ink-muted">{summary}</p>
          </div>
        </div>
      </header>

      <div className="mt-5 flex items-center gap-2 border-b border-bone pb-3" role="tablist" aria-label="Papers views">
        <button type="button" role="tab" aria-selected="false" disabled className="flex items-center gap-2 rounded-full px-3.5 py-2 text-sm text-ink-muted opacity-55">
          <FileText className="h-4 w-4" aria-hidden />All Papers
        </button>
        <button type="button" role="tab" aria-selected="true" className="flex items-center gap-2 rounded-full bg-secondary px-3.5 py-2 text-sm font-medium text-primary">
          <FileQuestion className="h-4 w-4" aria-hidden />Review
        </button>
      </div>

      <Tooltip.Provider delayDuration={250} skipDelayDuration={100}>
        <div role="group" aria-label="Paper review filters" className="mt-4 flex flex-wrap gap-2 pb-2">
          {PAPER_FILTERS.map((f) => {
            const on = filter === f;
            const n = counts[f];
            const Icon = f === "All" ? FileText : TONE[f].Icon;
            const hint = f === "All" ? "Every Unit with a paper, occupancy or compliance signal to review" : TONE[f].hint;
            return (
              <Tooltip.Root key={f}>
                <Tooltip.Trigger asChild>
                  <button type="button" aria-label={`${f === "All" ? "All review" : signalLabel(f)} ${n}`} aria-pressed={on}
                    onClick={() => { onFilter(f); setExpanded(null); }}
                    className={`flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-colors ${on ? "border-primary/20 bg-secondary font-medium text-primary" : "border-bone bg-background text-foreground hover:bg-secondary/60"}`}>
                    <Icon className="h-4 w-4" style={f === "All" ? undefined : { color: TONE[f].color }} aria-hidden />
                    <span>{f === "All" ? "All review" : signalLabel(f)}</span>
                    <span className={`rounded-md px-1.5 py-0.5 text-xs font-semibold tabular-nums ${on ? "bg-background" : "bg-secondary"}`}>{n}</span>
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content side="bottom" align="start" sideOffset={8} collisionPadding={12}
                    className="z-[1000] max-w-[280px] rounded-lg border border-bone bg-background px-3 py-2 text-xs leading-5 text-foreground shadow-xl animate-in fade-in zoom-in-95">
                    {hint}
                    <Tooltip.Arrow className="fill-background" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            );
          })}
        </div>
      </Tooltip.Provider>

      <div className="mt-4 space-y-2" aria-live="polite">
        {rows.map(({ place, units }) => {
          const open = expanded === place.id;
          return (
            <section key={place.id} className="overflow-hidden rounded-xl border border-bone bg-background">
              <button type="button" aria-label={`${place.name}, ${place.town}: ${units.length} ${units.length === 1 ? "Unit" : "Units"} to review`} aria-expanded={open} onClick={() => setExpanded(open ? null : place.id)}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-secondary/45">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-secondary text-primary"><Building2 className="h-4 w-4" aria-hidden /></span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-foreground">{place.name}</span>
                  <span className="mt-0.5 block text-xs text-ink-muted">{place.town}</span>
                </span>
                <span className="shrink-0 text-xs text-ink-muted">{units.length} {units.length === 1 ? "Unit" : "Units"} to review</span>
                {open ? <ChevronDown className="h-4 w-4 shrink-0 text-primary" aria-hidden /> : <ChevronRight className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden />}
              </button>
              {open && (
                <ul className="border-t border-bone bg-secondary/25 px-4 py-2">
                  {units.map((unit) => {
                    const key = unitKey(place.id, unit);
                    const finding = book[key];
                    const ending = endings[key];
                    const issues = compliance[key] ?? [];
                    const signals: Signal[] = filter === "All" ? [
                      ...(finding ? [finding.reason] : []),
                      ...(ending ? ["Tenancy ending" as const] : []),
                      ...(issues.length ? ["Compliance warning" as const] : []),
                    ] : [filter];
                    const details = [
                      finding && signals.includes(finding.reason) ? (finding.reason === "No papers" ? TONE["No papers"].hint : finding.detail ?? TONE["No new occupancy"].hint) : null,
                      ending && signals.includes("Tenancy ending") ? ending.detail : null,
                      issues.length && signals.includes("Compliance warning") ? TONE["Compliance warning"].hint : null,
                    ].filter(Boolean).join(" ");
                    return (
                      <li key={unit} className="border-b border-bone py-3 last:border-b-0">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-sm font-medium text-foreground">{unit}</span>
                          <span className="flex flex-wrap justify-end gap-1.5">{signals.map((signal) => <Chip key={signal} signal={signal} />)}</span>
                        </div>
                        <p className="mt-1.5 text-xs leading-5 text-ink-muted">{details}</p>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

export default function PrototypeStatus() {
  const [messages, setMessages] = useState<Message[]>(SEED);
  const [book, setBook] = useState<FindingBook>(SAMPLE);
  const [endings, setEndings] = useState<EndingBook>(SAMPLE_ENDINGS);
  const [availability, setAvailability] = useState<AvailabilityBook>(SAMPLE_AVAILABLE);
  const [noting, setNoting] = useState(false);
  const [placeId, setPlaceId] = useState<string | null>(null);
  const [filter, setFilter] = useState<MapFilter>("All");
  const [workspace, setWorkspace] = useState<"map" | "papers">("map");
  const [paperFilter, setPaperFilter] = useState<PaperFilter>("All");
  const [input, setInput] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [tryOpen, setTryOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [endingCandidate, setEndingCandidate] = useState<Extract<StatusInstruction, { kind: "ending" }> | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [recentChange, setRecentChange] = useState<RecentChange | null>(null);
  const nextId = useRef(1);
  const logEnd = useRef<HTMLDivElement>(null);
  const place = placeById(placeId);

  useEffect(() => { logEnd.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [messages]);

  const say = (role: Message["role"], text: string, extra: Partial<Message> = {}) =>
    setMessages((ms) => [...ms, { id: nextId.current++, role, text, ...extra }]);

  const startNote = () => {
    setMenuOpen(false); setNoting(true); setPendingAction(null); setEndingCandidate(null);
    say("user", "Add a Note");
    say("hobson", `Please provide the note for the ${CURRENT.unit}, which I will keep on file for you.`, { noteField: true });
  };

  const saveNote = (text: string) => {
    setNoting(false);
    say("user", text);
    say("hobson", `Noted. I've kept that on file for the ${CURRENT.unit}.`);
  };

  const matchingRows = (f: MapFilter) => STATUS_PLACES.flatMap((p) => p.units.filter((u) =>
    signalUnitsMatching(book, endings, availability, [{ ...p, units: [u] }], f, SAMPLE_COMPLIANCE) === 1).map((u) => `${u} at ${p.name}`));

  const showFilter = (f: MapFilter) => {
    setFilter(f);
    if (f === "Available to let") setWorkspace("map"); else setPaperFilter(f);
    setPlaceId(null); setPendingAction(null); setEndingCandidate(null);
    const rows = matchingRows(f);
    const c = signalCounts(book, endings, availability, STATUS_PLACES, SAMPLE_COMPLIANCE);
    if (f === "All") {
      say("hobson", `${c.All} Units carry a map signal: ${c["No papers"]} with no papers, ${c["Tenancy ending"]} with a confirmed tenancy ending, ${c["No new occupancy"]} with no new occupancy, ${c["Available to let"]} available to let, and ${c["Compliance warning"]} with compliance warnings.\n\nA Unit can carry more than one signal. Ask me about compliance at a particular place for document details.`, { choices: ["Which Units have compliance warnings?", "Which tenancies are ending?", "Which Units are available to let?"] });
      return;
    }
    if (f === "No papers") {
      say("hobson", `${rows.length} Units have no papers assigned to them: ${listWords(rows)}.\n\nIf any of these is let, its papers haven't reached me yet — once they do, I'll read it afresh.`, { choices: ["Show all signals"] });
      return;
    }
    if (f === "No new occupancy") {
      say("hobson", `${rows.length} Units have no new occupancy — their last occupancy has ended: ${listWords(rows)}.\n\nThese remain findings to investigate, not a record of whether anybody has physically left.`, { choices: ["Show all signals"] });
      return;
    }
    if (f === "Tenancy ending") {
      say("hobson", `${rows.length} Units have a confirmed tenancy ending: ${listWords(rows)}.\n\nI show these only when the ending itself is confirmed — never merely because the contractual term end date is approaching.`, { choices: ["Show all signals", "Which Units are available to let?"] });
      return;
    }
    if (f === "Compliance warning") {
      const kinds = complianceKindCounts(SAMPLE_COMPLIANCE);
      const now = kinds["Expired document"] + kinds["Missing document"];
      say("hobson", `${rows.length} Units carry compliance warnings: ${listWords(rows)}.\n\n${now} documents need attention now because they are expired or missing; ${kinds["Expiring soon"]} are expiring soon. Forthcoming expiry is advance notice, not a statement that compliance has already ended.\n\nAsk me about compliance at a place and I'll give you the document names and dates.`, { choices: ["Tell me about compliance at The Exchange", "Show all signals"] });
      return;
    }
    say("hobson", `${rows.length} Units are available to let: ${listWords(rows)}.\n\nThe purple TO LET badge can sit beside a current occupancy or a confirmed ending; it does not mean the Unit is necessarily empty.`, { choices: ["Show all signals", "Which tenancies are ending?"] });
  };

  const describePlace = (id: string) => {
    const p = placeById(id)!;
    setWorkspace("map"); setPlaceId(id); setFilter("All"); setPendingAction(null); setEndingCandidate(null);
    const rows = p.units.flatMap((u) => {
      const key = unitKey(p.id, u);
      const signals = [
        book[key] ? (book[key].reason === "No papers" ? "no papers" : book[key].detail) : null,
        endings[key] ? `tenancy ending ${endings[key].date}` : null,
        availability[key] ? "available to let" : null,
        SAMPLE_COMPLIANCE[key]?.length ? "compliance warning — ask me for document details" : null,
      ].filter(Boolean);
      return signals.length ? [`• ${u} — ${signals.join("; ")}`] : [];
    });
    say("hobson", rows.length
      ? `${p.name}, ${p.town}:\n${rows.join("\n")}`
      : `${p.name}, ${p.town} — no map signals. Its Units have current chains, with no confirmed endings or letting instructions.`,
      { choices: ["Show all signals"] });
  };

  const describeCompliance = (id: string) => {
    const p = placeById(id)!;
    const rows = complianceAtPlace(SAMPLE_COMPLIANCE, p);
    setPlaceId(id); setFilter("Compliance warning"); setPaperFilter("Compliance warning"); setPendingAction(null); setEndingCandidate(null);
    if (!rows.length) {
      say("hobson", `${p.name}, ${p.town} — I hold no expired, missing or forthcoming-expiry document warnings in this demonstration.`, { choices: ["Show all signals"] });
      return;
    }
    const detail = rows.map((issue) => `• ${issue.unit} — ${issue.document}: ${issue.kind === "Missing document" ? "required but missing" : issue.kind === "Expired document" ? `expired ${issue.date}` : `expires ${issue.date}`}`);
    say("hobson", `${p.name}, ${p.town}:\n${detail.join("\n")}\n\nExpired and missing required documents need attention now. Expiring soon is advance notice so you can act before then.`, { choices: ["Which Units have compliance warnings?", "Show all signals"] });
  };

  const confirmAction = () => {
    const action = pendingAction;
    if (!action) return;
    const p = placeById(action.placeId)!;
    setPendingAction(null);
    setPlaceId(action.placeId);
    setRecentChange({ placeId: action.placeId, unit: action.unit, kind: action.kind });
    if (action.kind === "ending") {
      say("user", "Confirm tenancy ending");
      setEndings((current) => ({ ...current, [unitKey(action.placeId, action.unit)]: { date: action.date, detail: `Confirmed tenancy ending, effective ${action.date}` } }));
      setFilter("Tenancy ending");
      say("hobson", `Done — the ${action.unit} at ${p.name} now carries a confirmed tenancy ending on ${action.date}. The map has moved to it.\n\nThis records the legal ending only; it does not record physical departure.`, { choices: ["Show all signals", "Which Units are available to let?"] });
    } else {
      say("user", "Confirm available to let");
      setAvailability((current) => ({ ...current, [unitKey(action.placeId, action.unit)]: { detail: "Being offered for a new occupier" } }));
      setFilter("Available to let");
      say("hobson", `Done — the ${action.unit} at ${p.name} now carries a purple TO LET badge. The map has moved to it.\n\nIts tenancy and occupancy facts remain unchanged.`, { choices: ["Show all signals", "Which tenancies are ending?"] });
    }
  };

  const cancelAction = () => {
    setPendingAction(null);
    say("user", "Not now");
    say("hobson", "Of course. I haven't changed the map.");
  };

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    setInput(""); setTryOpen(false); setNoting(false);
    say("user", text);
    if (text === "Show all signals" || text === "Show everything unoccupied") return showFilter("All");
    if (text === "Confirmed tenancy ending" && endingCandidate) {
      const candidate = endingCandidate;
      const p = placeById(candidate.placeId)!;
      setEndingCandidate(null); setPendingAction(candidate);
      say("hobson", `Please confirm the precise record: ${candidate.unit} at ${p.name}; confirmed tenancy ending on ${candidate.date}. No physical departure will be recorded.`, { action: candidate });
      return;
    }
    if (text === "Only the contractual term end date") {
      setEndingCandidate(null); setPendingAction(null);
      say("hobson", "Thank you. A contractual term end date alone does not confirm that the tenancy has ended or will end. I haven't added a tenancy-ending signal or changed the map.");
      return;
    }
    const instruction = parseStatusInstruction(text);
    if (instruction?.kind === "ending") {
      const p = placeById(instruction.placeId)!;
      setEndingCandidate(instruction); setPendingAction(null);
      say("hobson", `Before I mark the ${instruction.unit} at ${p.name}, is ${instruction.date} a confirmed tenancy ending, or only the contractual term end date?`, { choices: ["Confirmed tenancy ending", "Only the contractual term end date"] });
      return;
    }
    if (instruction?.kind === "available") {
      const p = placeById(instruction.placeId)!;
      setEndingCandidate(null); setPendingAction(instruction);
      say("hobson", `Please confirm: mark the ${instruction.unit} at ${p.name} as Available to let. This adds a letting instruction only; it will not end the tenancy or record that anyone has left.`, { action: instruction });
      return;
    }
    if (/complian|fire risk|electrical installation/i.test(text)) {
      const p = STATUS_PLACES.find((candidate) => text.toLowerCase().includes(candidate.name.toLowerCase()) || text.toLowerCase().includes(candidate.town.toLowerCase()));
      if (p) return describeCompliance(p.id);
    }
    const intent = interpret(text);
    if (intent.kind === "filter") return showFilter(intent.filter);
    if (intent.kind === "place") return describePlace(intent.placeId);
    say("hobson", "Ask me about missing papers, confirmed tenancy endings, no new occupancy, Units available to let or compliance warnings. For document names and dates, ask about compliance at a particular place.");
  };

  const restart = () => {
    setMessages(SEED); setBook(SAMPLE); setEndings(SAMPLE_ENDINGS); setAvailability(SAMPLE_AVAILABLE);
    setNoting(false); setPlaceId(null); setFilter("All"); setWorkspace("map"); setPaperFilter("All"); setInput(""); setPendingAction(null); setEndingCandidate(null); setRecentChange(null); nextId.current = 1;
  };

  const cardRows = place ? place.units.map((u) => {
    const key = unitKey(place.id, u);
    return { unit: u, finding: book[key] ?? null, ending: endings[key] ?? null, available: availability[key] ?? null };
  }) : [];
  const placeCounts = place ? signalCounts(book, endings, availability, [place], SAMPLE_COMPLIANCE) : null;

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
                    {m.action && last && pendingAction && (
                      <div className="mt-3 flex flex-wrap gap-2 border-t border-primary/10 pt-3">
                        <Button type="button" size="sm" onClick={confirmAction}><Check className="mr-1.5 h-3.5 w-3.5" aria-hidden />{pendingAction.kind === "ending" ? "Confirm tenancy ending" : "Confirm available to let"}</Button>
                        <Button type="button" size="sm" variant="ghost" onClick={cancelAction}>Not now</Button>
                      </div>
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
                <Button type="button" variant="ghost" onClick={startNote} className="w-full justify-start gap-3 px-3 font-normal"><StickyNote className="h-4 w-4 text-primary" aria-hidden />Add a Note</Button>
                <Button type="button" variant="ghost" disabled className="h-auto w-full items-start justify-start gap-3 px-3 py-2 text-left font-normal opacity-50"><Upload className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /><span><span className="block">Upload papers</span><span className="block text-xs text-muted-foreground">Coming soon</span></span></Button>
              </PopoverContent>
            </Popover>
            <Button type="button" variant="ghost" size="icon" aria-label="Things you might try" aria-expanded={tryOpen} onClick={() => setTryOpen((o) => !o)} className="h-8 w-8 shrink-0"><Lightbulb className="h-4 w-4" /></Button>
            <input value={input} onChange={(e) => setInput(e.target.value)} aria-label="Ask Hobson" placeholder="Ask about your portfolio" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
            <Button type="submit" size="icon" variant="ghost" disabled={!input.trim()} aria-label="Send message" className="h-8 w-8 shrink-0"><ArrowRight className="h-5 w-5" /></Button>
          </form>
        </div>
      </section>

      <section aria-label={workspace === "map" ? "Map" : "Papers"} className="relative min-w-0 flex-1 max-md:hidden">
        <div className={workspace === "map" ? "absolute inset-0" : "hidden"}>
          <StatusMap book={book} endings={endings} availability={availability} compliance={SAMPLE_COMPLIANCE} filter={filter} selectedId={placeId} recentChange={recentChange} onPick={(id) => { setFilter("All"); setPlaceId(id); }} />
        </div>
        {workspace === "papers" && <PapersReview book={book} endings={endings} compliance={SAMPLE_COMPLIANCE} filter={paperFilter} onFilter={setPaperFilter} />}

        <div className="pointer-events-none absolute inset-x-4 top-4 z-[500] flex items-start justify-end gap-2">
          <div className="pointer-events-auto flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              {workspace === "map" && (
                <>
                  <button type="button" aria-label="Search your places" aria-expanded={searchOpen} onClick={() => { setSearchOpen((o) => !o); setFiltersOpen(false); }}
                    className="grid h-11 w-11 place-items-center rounded-full border border-bone bg-background/95 shadow-md backdrop-blur transition-transform hover:scale-105">
                    <Search className="h-5 w-5 text-primary" aria-hidden />
                  </button>
                  <button type="button" aria-label="Map filters" aria-expanded={filtersOpen} onClick={() => { setFiltersOpen((o) => !o); setSearchOpen(false); }}
                    style={filter !== "All" && !filtersOpen ? { color: TONE[filter].color, borderColor: TONE[filter].color } : undefined}
                    className="grid h-11 w-11 place-items-center rounded-full border border-bone bg-background/95 shadow-md backdrop-blur transition-transform hover:scale-105">
                    {filter !== "All" && !filtersOpen
                      ? (() => { const { Icon } = TONE[filter]; return <Icon className="h-5 w-5" aria-hidden />; })()
                      : <SlidersHorizontal className="h-5 w-5 text-primary" aria-hidden />}
                  </button>
                </>
              )}
              <span className="flex items-center gap-1 rounded-full border border-bone bg-background/95 p-1 text-sm shadow-sm">
                <button type="button" aria-label="Papers" aria-pressed={workspace === "papers"} onClick={() => { setWorkspace("papers"); setFiltersOpen(false); setSearchOpen(false); }}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 transition-colors ${workspace === "papers" ? "bg-secondary font-medium text-primary" : "text-ink-muted hover:bg-secondary/60"}`}>
                  <FileText className="h-4 w-4" aria-hidden />Papers
                </button>
                <button type="button" aria-label="Map" aria-pressed={workspace === "map"} onClick={() => setWorkspace("map")}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 transition-colors ${workspace === "map" ? "bg-secondary font-medium text-primary" : "text-ink-muted hover:bg-secondary/60"}`}>
                  <MapIcon className="h-4 w-4" aria-hidden />Map
                </button>
              </span>
            </div>
            {workspace === "map" && searchOpen && (
              <div role="search" aria-label="Search your places" className="w-[300px] rounded-2xl border border-bone bg-background/95 p-2 shadow-md backdrop-blur animate-in fade-in slide-in-from-top-2 duration-300">
                <input autoFocus value={searchText} onChange={(e) => setSearchText(e.target.value)} aria-label="Search places" placeholder="Search a place or town…"
                  className="w-full rounded-full border border-bone bg-background px-3 py-1.5 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/50" />
                <ul className="mt-1.5 max-h-56 overflow-y-auto">
                  {STATUS_PLACES.filter((p) => {
                    const t = searchText.trim().toLowerCase();
                    return !t || p.name.toLowerCase().includes(t) || p.town.toLowerCase().includes(t);
                  }).map((p) => (
                    <li key={p.id}>
                      <button type="button" onClick={() => { setPlaceId(p.id); setFilter("All"); setSearchOpen(false); setSearchText(""); }} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm hover:bg-secondary">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                        <span className="min-w-0 flex-1 truncate font-medium">{p.name}</span>
                        <span className="shrink-0 text-xs text-ink-muted">{p.town}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {workspace === "map" && filtersOpen && (
              <div role="group" aria-label="Map signals" className="w-[380px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-bone bg-background/95 shadow-xl backdrop-blur animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-start justify-between gap-3 border-b border-bone px-4 py-3.5">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Filter the map</p>
                    <p className="mt-0.5 text-xs text-ink-muted">Choose a signal to focus on</p>
                  </div>
                  <Button type="button" variant="ghost" size="icon" aria-label="Close map filters" onClick={() => setFiltersOpen(false)} className="-mr-1 -mt-1 h-8 w-8 shrink-0 text-ink-muted">
                    <X className="h-4 w-4" aria-hidden />
                  </Button>
                </div>
                <div className="p-2">
                  {FILTERS.slice(0, 1).map((f) => {
                    const on = filter === f;
                    const n = signalCounts(book, endings, availability, STATUS_PLACES, SAMPLE_COMPLIANCE)[f];
                    return (
                      <button key={f} type="button" aria-label={`All signals ${n}`} aria-pressed={on} onClick={() => { setPlaceId(null); setFilter(f); setFiltersOpen(false); }}
                        className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors ${on ? "border-primary/20 bg-secondary" : "border-transparent hover:bg-secondary/60"}`}>
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-secondary text-primary"><MapIcon className="h-4 w-4" aria-hidden /></span>
                        <span className="flex-1 text-sm font-medium">All signals</span>
                        <span className="min-w-7 rounded-md bg-secondary px-2 py-0.5 text-center text-xs font-semibold tabular-nums text-foreground">{n}</span>
                        <span className="grid w-4 place-items-center text-primary">{on && <Check className="h-4 w-4" aria-hidden />}</span>
                      </button>
                    );
                  })}
                  <p className="px-3 pb-1.5 pt-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Focus on one signal</p>
                  <div className="space-y-1">
                    {FILTERS.slice(1).map((f) => {
                      const signal = f as Signal;
                      const on = filter === f;
                      const n = signalCounts(book, endings, availability, STATUS_PLACES, SAMPLE_COMPLIANCE)[f];
                      const { Icon, color, hint } = TONE[signal];
                      return (
                        <button key={f} type="button" aria-label={`${signalLabel(f)} ${n}`} aria-pressed={on} onClick={() => { setPlaceId(null); setFilter(f); setFiltersOpen(false); }}
                          className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors ${on ? "border-primary/20 bg-secondary" : "border-transparent hover:bg-secondary/60"}`}>
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg" style={{ color, background: `color-mix(in srgb, ${color} 10%, transparent)` }}><Icon className="h-4 w-4" aria-hidden /></span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-medium text-foreground">{signalLabel(f)}</span>
                            <span className="mt-0.5 block text-[11px] leading-4 text-ink-muted">{hint}</span>
                          </span>
                          <span className="min-w-7 rounded-md bg-secondary px-2 py-0.5 text-center text-xs font-semibold tabular-nums text-foreground">{n}</span>
                          <span className="grid w-4 shrink-0 place-items-center text-primary">{on && <Check className="h-4 w-4" aria-hidden />}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <p className="border-t border-bone px-4 py-2.5 text-[11px] text-ink-muted">A Unit can appear in more than one filter.</p>
              </div>
            )}
          </div>
        </div>

        {workspace === "map" && place && placeCounts && (
          <div role="region" aria-label={`${place.name} Unit signals`} className="absolute right-4 top-20 z-[500] flex max-h-[calc(100%-7rem)] w-[360px] flex-col rounded-2xl border border-bone bg-background shadow-xl animate-in fade-in slide-in-from-right-2">
            <div className="flex items-start justify-between gap-2 p-4 pb-0">
              <div>
                <p className="flex items-center gap-1.5 font-semibold"><MapPin className="h-4 w-4 text-primary" aria-hidden />{place.name}{place.id === CURRENT.placeId && <span className="text-xs font-normal text-ink-muted">· you are here</span>}</p>
                <p className="text-xs text-ink-muted">{place.units.length} Units · {place.town}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Close place" onClick={() => setPlaceId(null)}><X className="h-4 w-4" /></Button>
            </div>
            <div className="mx-4 mt-3 flex flex-wrap gap-x-3 gap-y-1 border-y border-bone py-2 text-[11px] text-ink-muted">
              <span><strong className="font-semibold text-foreground">{placeCounts["Tenancy ending"]}</strong> ending</span>
              <span><strong className="font-semibold text-foreground">{placeCounts["No new occupancy"]}</strong> no new occupancy</span>
              <span><strong className="font-semibold text-primary">{placeCounts["Available to let"]}</strong> to let</span>
              <span><strong className="font-semibold text-foreground">{placeCounts["No papers"]}</strong> no papers</span>
              {placeCounts["Compliance warning"] > 0 && <span><strong className="font-semibold" style={{ color: TONE["Compliance warning"].color }}>{placeCounts["Compliance warning"]}</strong> compliance</span>}
            </div>
            <ul className="mt-1 min-h-0 flex-1 overflow-y-auto p-2">
              {cardRows.map(({ unit, finding, ending, available }) => {
                const recent = recentChange?.placeId === place.id && recentChange.unit === unit;
                return (
                  <li key={unit} className={`rounded-lg px-2.5 py-2.5 transition-colors ${recent ? "bg-primary/5 ring-1 ring-primary/20" : ""}`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium">{unit}</span>
                      {!finding && !ending && !available && <span className="text-xs text-ink-muted">current chain</span>}
                    </div>
                    {(finding || ending || available) && <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {finding && <Chip signal={finding.reason} />}
                      {ending && <Chip signal="Tenancy ending" />}
                      {available && <Chip signal="Available to let" />}
                    </div>}
                    {finding && <p className="mt-1.5 text-[11px] text-ink-muted">{finding.detail ?? "Nothing assigned yet — worth checking whether papers are missing."}</p>}
                    {ending && <p className="mt-1.5 text-[11px] text-ink-muted">{ending.detail}. No physical departure inferred.</p>}
                    {available && <p className="mt-1.5 text-[11px] text-ink-muted">{available.detail}.</p>}
                  </li>
                );
              })}
            </ul>
            <p className="border-t border-bone px-4 py-2.5 text-[11px] text-ink-muted">Unoccupied findings come from papers. Endings and letting instructions are confirmed in chat.{placeCounts["Compliance warning"] > 0 ? " Ask Hobson for compliance document details." : ""}</p>
          </div>
        )}
      </section>
    </div>
  );
}
