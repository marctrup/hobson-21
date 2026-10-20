import { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronRight, FileText, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import PrototypeDocumentsPreview from "./PrototypeDocumentsPreview";
import PrototypeDocumentsTenancies from "./PrototypeDocumentsTenancies";
import type { Tenancies } from "./prototypeDocumentsTenancies";
import { BATCH_LIMIT, FIRST_LOOK, formatSize, needsYou, type Batch, type BatchPaper, type LookGroup } from "./prototypeDocumentsBatch";

type Props = {
  batch: Batch; lookPhrase?: string;
  onRemove: (id: string) => void; onAddMore: () => void; onStart: () => void; onCancel: () => void;
  onReview?: () => void; onLeave?: () => void;
  tenancies?: Tenancies | null; onChangeTenancy?: (which: "puig" | "mgmt" | "sub") => void;
};

const GROUPS: { key: LookGroup; title: string; tone: string }[] = [
  { key: "check", title: "Need a quick check", tone: "border-primary/40 bg-background" },
  { key: "unplaced", title: "Couldn't place yet", tone: "border-bone bg-secondary/40" },
  { key: "ready", title: "Ready", tone: "border-faint-rule bg-background/60" },
];

export default function PrototypeDocumentsBatch({ batch, lookPhrase, onRemove, onAddMore, onStart, onCancel, onReview, onLeave, tenancies, onChangeTenancy }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [readyOpen, setReadyOpen] = useState(false);
  const open = batch.papers.find((p) => p.id === openId);
  const n = batch.papers.length;
  if (open) return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center gap-2 border-b border-bone bg-background px-5 py-2">
        <Button size="sm" variant="ghost" onClick={() => setOpenId(null)}><ArrowLeft className="mr-2 h-4 w-4" />Back to the papers</Button>
        <span className="truncate text-sm text-ink-muted">{open.filename}</span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col"><PrototypeDocumentsPreview paper={{ filename: open.filename, url: open.url, example: false }} /></div>
    </div>
  );

  if (batch.look === "handoff" && tenancies) return <PrototypeDocumentsTenancies t={tenancies} papers={batch.papers} onView={setOpenId} onChange={(w) => onChangeTenancy?.(w)} />;
  const sorted = batch.look === "sorted" || batch.look === "handoff";
  if (sorted) {
    const outstanding = needsYou(batch.papers);
    const row = (p: BatchPaper) => {
      const e = FIRST_LOOK[p.id];
      return (
        <li key={p.id}>
          <button type="button" onClick={() => setOpenId(p.id)} aria-label={`Open ${e.name}`} className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-secondary/40">
            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-ink">{e.name}</span>
              {e.reason && <span className="mt-0.5 block text-sm text-ink-muted">{e.reason}</span>}
            </span>
          </button>
        </li>
      );
    };
    return (
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-serif text-2xl text-ink">I've taken a first look</h2>
          <p className="mt-1 text-sm text-ink-muted">{n} papers · {outstanding} need your help</p>
          <div className="mt-6 space-y-4">
            {GROUPS.map((g) => {
              const items = batch.papers.filter((p) => FIRST_LOOK[p.id]?.group === g.key);
              if (!items.length) return null;
              if (g.key === "ready") return (
                <section key={g.key} aria-label={`${g.title} — ${items.length}`} className={`rounded-xl border ${g.tone}`}>
                  <button type="button" aria-expanded={readyOpen} onClick={() => setReadyOpen((o) => !o)} className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-ink-muted">
                    {readyOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}{g.title} — {items.length}
                  </button>
                  {readyOpen && <ul className="divide-y divide-faint-rule border-t border-faint-rule">{items.map(row)}</ul>}
                </section>
              );
              return (
                <section key={g.key} aria-label={`${g.title} — ${items.length}`} className={`rounded-xl border ${g.tone}`}>
                  <h3 className="px-4 pt-3 text-xs font-medium uppercase tracking-wide text-ink-muted">{g.title} — {items.length}</h3>
                  <ul className="divide-y divide-faint-rule">{items.map(row)}</ul>
                </section>
              );
            })}
          </div>
          {batch.look === "sorted" && <div className="mt-8 flex flex-wrap gap-2">
            <Button onClick={onReview}>Review the {outstanding} that need you</Button>
            <Button variant="ghost" onClick={onLeave}>Leave for now</Button>
          </div>}
          {batch.look === "handoff" && <p className="mt-8 text-sm text-ink-muted">Starting with the leases.</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-6 py-8">
      <div className="mx-auto max-w-2xl">
        <h2 className="font-serif text-2xl text-ink">{n} {n === 1 ? "paper" : "papers"} {batch.started ? "with me" : "ready"}</h2>
        <p className="mt-1 text-sm text-ink-muted" aria-live="polite">{batch.look === "looking" ? lookPhrase : batch.started ? "I'm taking a first look at these papers." : "I'll first work out what each paper is."}</p>
        <ul className="mt-6 divide-y divide-bone rounded-xl border border-bone bg-background" aria-label="Papers in this batch">
          {batch.papers.map((p) => (
            <li key={p.id} className="flex items-center gap-3 px-4 py-3">
              <FileText className="h-5 w-5 shrink-0 text-primary" aria-hidden />
              <button type="button" className="min-w-0 flex-1 text-left" onClick={() => setOpenId(p.id)} aria-label={`Open ${p.filename}`}>
                <span className="block truncate text-sm font-medium text-ink hover:underline">{p.filename}</span>
                <span className="block text-xs text-ink-muted">PDF · {formatSize(p.size)}</span>
              </button>
              {!batch.started && <Button size="icon" variant="ghost" aria-label={`Remove ${p.filename}`} title="Remove" onClick={() => onRemove(p.id)}><X className="h-4 w-4" /></Button>}
            </li>
          ))}
        </ul>
        {!batch.started && <>
          {n < BATCH_LIMIT && <Button variant="ghost" className="mt-3" onClick={onAddMore}><Plus className="mr-2 h-4 w-4" />Add more papers</Button>}
          <div className="mt-8 flex flex-wrap gap-2">
            <Button disabled={n === 0} onClick={onStart}>Start with these papers</Button>
            <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          </div>
        </>}
      </div>
    </div>
  );
}
