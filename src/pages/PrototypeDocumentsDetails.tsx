import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { shownValue, type DetailKey, type DetailsReview, type ReadDetail } from "./prototypeDocumentsDetails";

type Props = {
  review: DetailsReview;
  collapsible: boolean;
  onShow: (page: number) => void;
  onCorrect: (key: DetailKey, value: string) => void;
  canChangeEffective: boolean;
};

function EffectiveValue({ review }: { review: DetailsReview }) {
  if (review.effective === "confirmed") return <span className="flex items-center gap-1.5">{review.effectiveValue}<Check className="h-3.5 w-3.5 text-primary" aria-label="Confirmed by you" /></span>;
  if (review.effective === "other") return <span className="flex items-center gap-1.5">{review.effectiveValue}<Check className="h-3.5 w-3.5 text-primary" aria-label="Given by you" /></span>;
  if (review.effective === "unsure") return <span className="text-ink-muted">Unconfirmed</span>;
  return <span className="text-ink-muted">Not separately specified — I've asked you about this</span>;
}

function Row({ d, review, onShow, onCorrect, canChange }: { d: ReadDetail; review: DetailsReview; onShow: (p: number) => void; onCorrect: Props["onCorrect"]; canChange: boolean }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const isEffective = d.key === "effectiveDate";
  const start = () => { setDraft(isEffective ? review.effectiveValue ?? "" : shownValue(d)); setEditing(true); };
  const save = () => { if (draft.trim()) { onCorrect(d.key, draft); setEditing(false); } };
  return (
    <li className="border-b border-faint-rule py-3 last:border-0" aria-label={d.label}>
      <p className="text-xs text-ink-muted">{d.label}</p>
      {editing ? (
        <form className="mt-1.5 flex flex-col gap-2" onSubmit={(e) => { e.preventDefault(); save(); }}>
          <input autoFocus value={draft} onChange={(e) => setDraft(e.target.value)} aria-label={`New ${d.label.toLowerCase()}`} className="rounded-md border border-input bg-background px-2.5 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
          <div className="flex gap-1"><Button type="submit" size="sm" variant="outline" disabled={!draft.trim()}>Save</Button><Button type="button" size="sm" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button></div>
        </form>
      ) : (
        <div className="mt-0.5 break-words text-sm text-ink">{isEffective ? <EffectiveValue review={review} /> : shownValue(d)}</div>
      )}
      {!isEffective && d.corrected && <p className="mt-1 text-xs text-ink-muted">Corrected by you · the paper reads “{d.read}”</p>}
      {isEffective && review.effective !== "asking" && <p className="mt-1 text-xs text-ink-muted">Kept separate from the date on the paper</p>}
      {d.note && <p className="mt-1 text-xs text-ink-muted">{d.note}</p>}
      {!editing && <div className="mt-1 flex gap-3 text-xs">
        <button type="button" className="text-primary underline-offset-2 hover:underline disabled:text-ink-muted disabled:no-underline" disabled={!canChange} onClick={start} aria-label={`Change ${d.label.toLowerCase()}`}>Change</button>
        <button type="button" className="text-primary underline-offset-2 hover:underline" onClick={() => onShow(d.page)} aria-label={`Show ${d.label.toLowerCase()} in paper`}>Show in paper</button>
      </div>}
    </li>
  );
}

export default function PrototypeDocumentsDetails({ review, collapsible, onShow, onCorrect, canChangeEffective }: Props) {
  const [open, setOpen] = useState(true);
  return (
    <section aria-label="What I've read" className={`flex min-h-0 flex-col bg-background ${collapsible ? "max-h-[45%] shrink-0 border-b border-bone" : "w-[340px] shrink-0 border-r border-bone"}`}>
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <h2 className="text-sm font-semibold text-ink">What I've read</h2>
        {collapsible && <Button variant="ghost" size="sm" aria-expanded={open} onClick={() => setOpen((o) => !o)}>{open ? "Hide" : "Show"}<ChevronDown className={`ml-1 h-3.5 w-3.5 transition ${open ? "rotate-180" : ""}`} /></Button>}
      </div>
      {(open || !collapsible) && <ul className="min-h-0 flex-1 overflow-y-auto px-5 pb-3">
        {review.details.map((d) => <Row key={d.key} d={d} review={review} onShow={onShow} onCorrect={onCorrect} canChange={d.key !== "effectiveDate" || canChangeEffective} />)}
      </ul>}
    </section>
  );
}
