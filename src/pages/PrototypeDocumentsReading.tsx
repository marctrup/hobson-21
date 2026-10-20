import { ArrowLeft, ExternalLink, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import PrototypeDocumentsPapers from "./PrototypeDocumentsPapers";
import { activeReadings, phraseFor, type Reading } from "./prototypeDocumentsReading";

type Props = { section: "reading" | "papers" | "conversations"; readings: Reading[]; onBack: () => void; onPreviewFinish: (id: number) => void; onViewPapers: () => void };

function Card({ r, onPreviewFinish, onViewPapers }: { r: Reading; onPreviewFinish: (id: number) => void; onViewPapers: () => void }) {
  return (
    <li className="rounded-lg border border-bone bg-background p-4" aria-label={r.title}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink">{r.title}</p>
          <p className="mt-0.5 text-xs text-ink-muted">{r.unit}</p>
          <p className="mt-2 flex items-center gap-1.5 break-words text-xs text-ink-muted"><FileText className="h-3.5 w-3.5 shrink-0" aria-hidden />{r.filename}</p>
        </div>
        {r.url && <Button variant="outline" size="sm" asChild><a href={r.url} target="_blank" rel="noreferrer">Original paper<ExternalLink className="ml-1.5 h-3.5 w-3.5" /></a></Button>}
      </div>
      <p className={`mt-3 text-sm italic text-ink-muted ${r.finished ? "" : "motion-safe:animate-pulse"}`}>{r.finished ? `Done. Added to ${r.unit.replace(" · ", ", ")}.` : phraseFor(r)}</p>
      {r.finished && <Button variant="outline" size="sm" className="mt-2" onClick={onViewPapers}>View in Papers</Button>}
      {!r.finished && <button type="button" onClick={() => onPreviewFinish(r.id)} className="mt-2 text-[11px] text-ink-muted underline-offset-2 hover:underline">Prototype only · Preview completion</button>}
    </li>
  );
}

export default function PrototypeDocumentsReading({ section, readings, onBack, onPreviewFinish, onViewPapers }: Props) {
  const active = activeReadings(readings);
  const finished = readings.filter((r) => r.finished);
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-bone bg-background px-5">
        <Button variant="ghost" size="sm" onClick={onBack}><ArrowLeft className="mr-1.5 h-3.5 w-3.5" />Back to this conversation</Button>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto bg-background px-6 py-5">
        {section === "reading" && <>
          <h2 className="text-base font-semibold text-ink">What I'm reading</h2>
          <p className="mt-1 text-xs text-ink-muted">I'll keep working through these while you carry on.</p>
          {active.length === 0 && finished.length === 0 && <p className="mt-6 text-sm text-ink-muted">I'm not reading anything just now.</p>}
          {active.length > 0 && <ul className="mt-5 space-y-3">{active.map((r) => <Card key={r.id} r={r} onPreviewFinish={onPreviewFinish} onViewPapers={onViewPapers} />)}</ul>}
          {finished.length > 0 && <><p className="mt-7 mb-2 text-[11px] font-medium uppercase tracking-wide text-ink-muted">Completed</p><ul className="space-y-3">{finished.map((r) => <Card key={r.id} r={r} onPreviewFinish={onPreviewFinish} onViewPapers={onViewPapers} />)}</ul></>}
        </>}
        {section === "papers" && (readings.length === 0
          ? <><h2 className="text-base font-semibold text-ink">Papers</h2><p className="mt-6 text-sm text-ink-muted">No papers have been added yet.</p></>
          : readings.map((r) => <div key={r.id} className="-mx-6 -my-5 flex"><PrototypeDocumentsPapers filed={r.finished} url={r.url} placement={r.placement} paperType={r.paperType} filename={r.filename} tenant={r.tenant} paperDate={r.paperDate} effective={r.effective} onOpenPaper={() => r.url && window.open(r.url, "_blank", "noreferrer")} /></div>))}
        {section === "conversations" && <>
          <h2 className="text-base font-semibold text-ink">Conversations</h2>
          <button type="button" onClick={onBack} className="mt-5 w-full rounded-lg border border-bone p-4 text-left hover:bg-secondary/40">
            <p className="text-sm font-medium text-ink">Adding papers</p>
            <p className="mt-0.5 text-xs text-ink-muted">This conversation</p>
          </button>
        </>}
      </div>
    </div>
  );
}
