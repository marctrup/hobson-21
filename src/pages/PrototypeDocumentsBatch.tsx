import { useState } from "react";
import { ArrowLeft, FileText, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import PrototypeDocumentsPreview from "./PrototypeDocumentsPreview";
import { BATCH_LIMIT, formatSize, type Batch } from "./prototypeDocumentsBatch";

type Props = { batch: Batch; onRemove: (id: string) => void; onAddMore: () => void; onStart: () => void; onCancel: () => void };

export default function PrototypeDocumentsBatch({ batch, onRemove, onAddMore, onStart, onCancel }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
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
  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-6 py-8">
      <div className="mx-auto max-w-2xl">
        <h2 className="font-serif text-2xl text-ink">{n} {n === 1 ? "paper" : "papers"} {batch.started ? "with me" : "ready"}</h2>
        <p className="mt-1 text-sm text-ink-muted">{batch.started ? "I'm taking a first look at these papers." : "I'll first work out what each paper is."}</p>
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
