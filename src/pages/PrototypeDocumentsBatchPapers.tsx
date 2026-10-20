import PrototypeDocumentsChain, { type ChainPaper, type ChainStatus } from "./PrototypeDocumentsChain";
import { batchReadiness, PAPER_DATES, type Tenancies, type TenancyAnswer } from "./prototypeDocumentsTenancies";
import type { BatchPaper } from "./prototypeDocumentsBatch";

// Iteration 5E: the histories Hobson built from the batch, in the existing Papers design.
// Only papers whose reading has finished appear as confirmed; nothing else is implied.
type Props = { t: Tenancies; papers: BatchPaper[]; finishedIds: string[] };

const status = (a: TenancyAnswer | null, end: string | null): ChainStatus =>
  a === "current" ? { kind: "current" } : a === "ended" ? { kind: "ended", date: end } : { kind: "unconfirmed" };
const TYPE: Record<string, string> = { "example-1": "Business Lease", "example-2": "Licence to Alter", "example-3": "Wayleave", "example-4": "Deed of Variation", "example-5": "Sublease" };

export default function PrototypeDocumentsBatchPapers({ t, papers, finishedIds }: Props) {
  const { ready, help } = batchReadiness(t);
  const done = ready.filter((r) => finishedIds.includes(r.id));
  const entry = (id: string, extra: Partial<ChainPaper> = {}): ChainPaper => {
    const p = papers.find((x) => x.id === id)!;
    return { type: TYPE[id], filename: p.filename, date: PAPER_DATES[id] ?? "Date not identified on this copy", url: p.url, ...extra };
  };
  const has = (id: string) => done.some((r) => r.id === id);
  const supportsFor = (where: string) => done.filter((r) => ["example-2", "example-3", "example-4"].includes(r.id) && r.where === where).map((r) => entry(r.id, r.id === "example-3" ? { note: t.wayleave.completion === "notCompleted" ? "Kept as an uncompleted copy" : undefined } : {}));
  const puigPapers = [...(has("example-1") ? [entry("example-1")] : []), ...supportsFor("Puig's lease")];
  const subPapers = [...(has("example-5") ? [entry("example-5")] : []), ...supportsFor("Feelunique's Sublease")];
  const open = (url: string) => window.open(url, "_blank", "noreferrer");
  const view = (p: ChainPaper) => p.url && open(p.url);
  const related = t.mgmt === "puig";
  return (
    <section aria-label="Papers for Russell Square House" className="mb-8">
      <h2 className="text-base font-semibold text-ink">What I have for Russell Square House</h2>
      <div className="mt-5 rounded-lg border border-bone">
        <p className="border-b border-faint-rule px-4 py-2.5 text-sm font-semibold text-ink">Russell Square House</p>
        <div className="space-y-3 px-4 py-3">
          <p className="text-sm font-medium text-ink">Fifth Floor</p>
          {puigPapers.length > 0 && <PrototypeDocumentsChain heading="Business Lease" status={status(t.puig, t.puigEnd)} mode="confirmed" detail={["Puig UK Limited"]}
            papers={related ? [...puigPapers, ...subPapers.map((p, i) => i === 0 && p.type === "Sublease" ? { ...p, type: "Related Sublease", note: "Separate legal agreement · Feelunique International Limited" } : p)] : puigPapers} onView={view} />}
          {!related && subPapers.length > 0 && (t.mgmt === "both"
            ? <PrototypeDocumentsChain heading="Sublease" status={status(t.sub, t.subEnd)} mode="confirmed" detail={["Feelunique International Limited"]} papers={subPapers} onView={view} />
            : <div><p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-ink-muted">How to show this is not yet settled</p>
              <PrototypeDocumentsChain heading="Sublease" status={status(t.sub, t.subEnd)} mode="awaiting" detail={["Feelunique International Limited"]} papers={subPapers} onView={view} /></div>)}
        </div>
      </div>
      {help.length > 0 && <div className="mt-4 rounded-lg border border-dashed border-primary/50 px-4 py-3">
        <p className="text-[11px] font-medium uppercase tracking-wide text-ink-muted">Kept separate for now</p>
        <ul className="mt-1 space-y-1.5 text-sm">{help.map((h) => <li key={h.id}><span className="text-ink">{h.name}</span>{h.questions.map((q) => <p key={q} className="text-xs text-ink-muted">{q}</p>)}</li>)}</ul>
      </div>}
    </section>
  );
}
