import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FileText, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";

export type JobContext = "roof" | "renewal";
function JobMap({ job }: { job: JobContext }) {
  const element = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!element.current) return;
    const position: L.LatLngTuple = job === "roof" ? [51.5095, -0.1402] : [51.583, -0.197];
    const map = L.map(element.current).setView(position, 16);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: '&copy; OpenStreetMap contributors', maxZoom: 19 }).addTo(map);
    L.marker(position, { icon: L.divIcon({ className: "", html: '<span class="block h-5 w-5 rounded-full border-4 border-background bg-ring shadow-md"></span>', iconSize: [20, 20], iconAnchor: [10, 10] }) }).addTo(map).bindTooltip(job === "roof" ? "Burlington Gardens · Approximate location" : "Stanley House · Flat 6 · Approximate location").openTooltip();
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(element.current);
    return () => { observer.disconnect(); map.remove(); };
  }, [job]);
  return <div ref={element} role="img" aria-label={`${contexts[job].place} job map`} className="relative z-0 aspect-[4/3] w-full rounded-md border border-border" />;
}
const contexts = {
  roof: {
    place: "Burlington Gardens",
    map: "https://www.openstreetmap.org/export/embed.html?bbox=-0.144%2C51.507%2C-0.136%2C51.512&layer=mapnik&marker=51.5095%2C-0.1402",
    locationNote: "Illustrative street-level location — the example does not specify a building number.",
    papers: [
      { title: "Tenant's report", note: "Read", extract: "The tenant reported water coming through near the top-floor ceiling. The cause of the leak has not been established." },
      { title: "Business Lease", note: "Repairing obligations under review", extract: "The repairing obligations for the structure and roof are set out in this lease. The relevant clauses are still being reviewed; no conclusion on responsibility has been reached." },
    ],
  },
  renewal: {
    place: "Stanley House · Flat 6",
    map: "https://www.openstreetmap.org/export/embed.html?bbox=-0.201%2C51.580%2C-0.193%2C51.586&layer=mapnik&marker=51.583%2C-0.197",
    locationNote: "Stanley House — 1115 Finchley Road, London NW11 · Approximate location · Example portfolio location.",
    papers: [
      { title: "Business Lease", note: "Original terms read — current position still being checked", extract: "Original annual rent: £24,000. Tenancy term ends on 31 December 2026. These original terms are not confirmed current while later agreements are being considered." },
      { title: "Deed of Variation", note: "Checking", extract: "The check of this later paper is unfinished. No changes to rent or tenancy dates have been confirmed." },
    ],
  },
};

/** Context-only navigation: never changes work, approvals or the existing conversation. */
export function JobPapersMap({ job, sideLetterRequested = false }: { job: JobContext; sideLetterRequested?: boolean }) {
  const [view, setView] = useState<"papers" | "map" | null>(null);
  const [paper, setPaper] = useState<string | null>(null);
  const context = contexts[job];
  const controls = <div role="group" aria-label={`${context.place} Papers / Map`} className="inline-flex shrink-0 items-center rounded-md border border-border bg-background p-0.5">
    <Button variant={view === "papers" ? "secondary" : "ghost"} size="sm" aria-pressed={view === "papers"} onClick={() => { setView("papers"); setPaper(null); }} className="h-8 gap-1.5 px-3"><FileText className="h-3.5 w-3.5" aria-hidden="true" />Papers</Button>
    <Button variant={view === "map" ? "secondary" : "ghost"} size="sm" aria-pressed={view === "map"} onClick={() => setView("map")} className="h-8 gap-1.5 px-3"><MapPin className="h-3.5 w-3.5" aria-hidden="true" />Map</Button>
  </div>;
  return <>
    {controls}
    <Dialog open={view !== null} onOpenChange={open => { if (!open) setView(null); }}>
      <DialogPrimitive.Portal><DialogPrimitive.Overlay className="fixed inset-0 z-[1600] bg-background/80" /><DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-[1601] grid max-h-[85dvh] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 gap-4 overflow-y-auto rounded-md border border-border bg-background p-4 sm:p-6 shadow-lg">
        <DialogPrimitive.Close asChild><Button variant="ghost" size="icon" aria-label="Back to job" title="Back to job" className="absolute right-2 top-2 h-8 w-8"><X className="h-4 w-4" /></Button></DialogPrimitive.Close>
        <DialogHeader className="pr-8 text-left"><DialogTitle>{context.place}</DialogTitle><DialogDescription>{view === "papers" ? "Papers for this job · Illustrative examples only" : "Location for this job"}</DialogDescription></DialogHeader>
        {controls}
        {view === "papers" && <section aria-label="Job papers" className="divide-y divide-border border-y border-border">
          {context.papers.map(item => <article key={item.title} className="py-4"><Button variant="ghost" onClick={() => setPaper(paper === item.title ? null : item.title)} aria-expanded={paper === item.title} className="h-auto w-full justify-start gap-2 whitespace-normal px-0 text-left"><FileText className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" /><span><span className="block text-sm font-medium">{item.title}</span><span className="mt-1 block text-xs font-normal text-muted-foreground">{item.note}</span></span></Button>{paper === item.title && <aside aria-label={`${item.title} job paper preview`} className="mt-3 border-l-2 border-border pl-3"><p className="text-sm leading-relaxed">{item.extract}</p><p className="mt-2 text-xs text-muted-foreground">Illustrative extract — not an actual portfolio document.</p></aside>}</article>)}
          {job === "renewal" && sideLetterRequested && <article className="py-4"><p className="text-sm font-medium">Side Letter — 2024</p><p className="mt-1 text-xs text-muted-foreground">Awaiting paper</p><p className="mt-2 text-sm text-muted-foreground">You mentioned this paper. I haven't located it yet.</p></article>}
        </section>}
        {view === "map" && <section aria-label="Job location" className="min-w-0"><JobMap job={job} /><p className="mt-3 text-xs leading-relaxed text-muted-foreground">{context.locationNote}</p></section>}
      </DialogPrimitive.Content></DialogPrimitive.Portal>
    </Dialog>
  </>;
}