import { useState } from "react";
import { ArrowLeft, Check, FileText, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import owlReading from "@/assets/prototype/owl-reading.png";
import { completedLease, completedLeasePaper, type CompletedLeaseActivity } from "./completedLease";

/** Read-only delivered summary; browsing never starts work or changes portfolio state. */
export function CompletedLeaseJourney({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState<CompletedLeaseActivity>("summary");
  const [evidence, setEvidence] = useState<string | null>(null);
  const [context, setContext] = useState<"papers" | "map">("papers");
  const activity = completedLease.activities.find(item => item.id === selected);
  const findings = selected === "dates" ? completedLease.findings.filter(item => ["Rent", "Term start", "Term end"].includes(item.label)) : completedLease.findings;
  const references = [...new Set(findings.map(item => item.reference))];
  return <div role="region" aria-label="Completed lease work journey" className="flex min-h-0 flex-1 flex-col">
    <header className="shrink-0 border-b border-border px-5 pb-5 pt-4 sm:px-6">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-4 gap-2 px-0 text-muted-foreground"><ArrowLeft className="h-4 w-4" />Back to What I'm Up To</Button>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1 basis-64"><p className="mb-2 text-xs text-muted-foreground">{completedLease.place}</p><h2 className="text-2xl font-semibold leading-tight">{completedLease.title}</h2></div>
        <div role="group" aria-label="Stanley House · Flat 3 Papers / Map" className="inline-flex shrink-0 items-center rounded-md border border-border bg-background p-0.5">
          <Button variant={context === "papers" ? "secondary" : "ghost"} size="sm" aria-pressed={context === "papers"} onClick={() => setContext("papers")} className="h-8 gap-1.5 px-3"><FileText className="h-3.5 w-3.5" aria-hidden="true" />Papers</Button>
          <Button variant={context === "map" ? "secondary" : "ghost"} size="sm" aria-pressed={context === "map"} onClick={() => setContext("map")} className="h-8 gap-1.5 px-3"><MapPin className="h-3.5 w-3.5" aria-hidden="true" />Map</Button>
        </div>
      </div>
      <p role="status" className="mt-3 flex items-center gap-2 text-xs font-medium"><Check className="h-3.5 w-3.5 text-muted-foreground" />Completed</p>
      <div className="mt-3 flex items-start gap-3"><img src={owlReading} alt="Hobson reading" className="h-10 w-10 shrink-0 object-contain" /><p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{completedLease.explanation}</p></div>
    </header>
    <div className="hobson-scroll min-h-0 flex-1 overflow-y-auto">
      <div className="grid min-h-full grid-cols-[minmax(0,0.35fr)_minmax(0,0.65fr)] max-[640px]:grid-cols-1">
        <nav aria-label="The completed lease journey" className="min-w-0 border-r border-border px-4 py-5 max-[640px]:border-b max-[640px]:border-r-0">
          <h3 className="mb-5 text-xs font-semibold text-muted-foreground">The Journey</h3>
          {completedLease.activities.map(item => <Button key={item.id} variant="ghost" onClick={() => { setSelected(item.id); setEvidence(null); }} aria-current={selected === item.id ? "step" : undefined} className={`mb-2 h-auto w-full items-start justify-start gap-2 whitespace-normal rounded-md border px-2 py-3 text-left ${selected === item.id ? "border-border bg-muted/70" : "border-transparent"}`}><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" /><span className="text-sm leading-relaxed">{item.title}</span></Button>)}
        </nav>
        <section aria-labelledby="lease-desk-heading" className="min-w-0 px-5 py-5 sm:px-6">
          <h3 id="lease-desk-heading" className="mb-5 text-xs font-semibold text-muted-foreground">On Hobson's Desk</h3>
          <h4 className="text-lg font-semibold">{selected === "summary" ? "Your lease summary is ready" : activity?.title}</h4>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{activity?.note}</p>
          <p className="mt-3 text-xs text-muted-foreground">Illustrative information only — not findings from an actual portfolio lease.</p>
          {selected !== "review" && <dl className="mt-5 divide-y divide-border border-y border-border">{findings.map(item => <div key={item.label} className="py-3"><dt className="text-xs font-semibold text-muted-foreground">{item.label}</dt><dd className="mt-1 text-sm leading-relaxed">{item.value}<span className="mt-1 block text-xs text-muted-foreground">Business Lease · {item.reference}</span></dd></div>)}</dl>}
          {selected === "review" && <div className="mt-5"><h5 className="text-xs font-semibold">Areas examined</h5><ul className="mt-2 space-y-2 text-sm text-muted-foreground"><li>Named parties and the unit described.</li><li>Rent and payment arrangements.</li><li>Term start and end dates.</li><li>Interior condition, repair reporting and alterations.</li></ul></div>}
          <div className="mt-5 border-y border-border py-4"><h5 className="text-xs font-semibold">Supporting paper and wording</h5>
            <Button variant="ghost" size="sm" onClick={() => setEvidence(evidence === "paper" ? null : "paper")} aria-expanded={evidence === "paper"} className="mt-3 h-auto max-w-full justify-start gap-2 whitespace-normal px-0 text-left text-sm text-muted-foreground"><FileText className="h-3.5 w-3.5 shrink-0" />Business Lease · View paper</Button>
            {evidence === "paper" && <aside aria-label="Flat 3 Business Lease illustrative preview" className="mt-3 border-l-2 border-border bg-popover px-3 py-3"><blockquote className="whitespace-pre-line text-sm leading-relaxed">{completedLeasePaper}</blockquote><p className="mt-2 text-xs text-muted-foreground">Example paper only — not an actual portfolio document.</p></aside>}
            {references.map(reference => <div key={reference}><Button variant="link" size="sm" onClick={() => setEvidence(evidence === reference ? null : reference)} aria-expanded={evidence === reference} className="mt-3 h-auto max-w-full whitespace-normal p-0 text-left text-xs">Business Lease · {reference}</Button>{evidence === reference && <aside aria-label={`${reference} illustrative extract`} className="mt-3 border-l-2 border-border bg-popover px-3 py-3"><p className="text-xs font-semibold">Illustrative Business Lease · {reference}</p><blockquote className="mt-2 text-sm leading-relaxed">{completedLease.findings.filter(item => item.reference === reference).map(item => item.value).join(". ")}</blockquote><p className="mt-2 text-xs text-muted-foreground">Sample wording only — not genuine evidence or a legal conclusion.</p></aside>}</div>)}
          </div>
          {selected === "summary" && <p className="mt-5 text-sm leading-relaxed text-muted-foreground">I've delivered the requested lease summary. No further activity is pending within this job.</p>}
        </section>
      </div>
      <footer className="border-t border-border px-5 py-4"><p className="text-xs text-muted-foreground">Illustrative completed work and sample paper references only — no live work is running.</p></footer>
    </div>
  </div>;
}
