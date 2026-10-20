import { Button } from "@/components/ui/button";
import PrototypeDocumentsChain, { type ChainPaper, type ChainStatus } from "./PrototypeDocumentsChain";
import { openDecisions, PAPER_DATES, type Belongs, type Reopenable, type SupportId, type TenancyAnswer, type Tenancies } from "./prototypeDocumentsTenancies";
import type { BatchPaper } from "./prototypeDocumentsBatch";

type Props = { t: Tenancies; papers: BatchPaper[]; onView: (id: string) => void; onChange: (which: Reopenable) => void };

const status = (a: TenancyAnswer | null, end: string | null): ChainStatus =>
  a === "current" ? { kind: "current" } : a === "ended" ? { kind: "ended", date: end } : { kind: "unconfirmed" };
const statusText = (a: TenancyAnswer | null, end: string | null) => a === "current" ? "Current" : a === "ended" ? (end ? `Ended on ${end}` : "Ended · date not given") : "Status unconfirmed";

export default function PrototypeDocumentsTenancies({ t, papers, onView, onChange }: Props) {
  const byId = (id: string) => papers.find((p) => p.id === id);
  const paper = (id: string, type: string, extra: Partial<ChainPaper> = {}): ChainPaper | null => {
    const p = byId(id);
    return p ? { type, filename: p.filename, date: PAPER_DATES[id] ?? "", url: p.url, pending: true, ...extra } : null;
  };
  const viewByName = (cp: ChainPaper) => { const p = papers.find((x) => x.filename === cp.filename); if (p) onView(p.id); };
  const showSub = !!t.mgmt || ["subMgmt", "subStatus", "subEnd", "comparing", "done"].includes(t.step);
  // Supporting papers: one paper each, shown only where the user has placed it (or where Hobson proposes it).
  const SUPPORT: { id: SupportId; type: string; step: "licence" | "deed" }[] = [
    { id: "example-2", type: "Licence: Alteration", step: "licence" },
    { id: "example-4", type: "Deed of Variation", step: "deed" },
  ];
  const supportNote = (id: SupportId, step: string, b: Belongs | null) => {
    const considering = t.step === step;
    if (b === null) return considering ? "Proposed here · I'm asking you about this now" : "Likely accompanying paper · not yet confirmed";
    if (b === "sub") return "Affects Feelunique's Sublease · confirmed by you · not yet read";
    return "Confirmed by you · not yet read";
  };
  const supportsFor = (where: Belongs) => (t.compared ? SUPPORT : [])
    .filter((x) => (t.belongs[x.id] ?? "puig") === where)
    .map((x) => paper(x.id, x.type, { note: supportNote(x.id, x.step, t.belongs[x.id]) }));
  const accompanying = supportsFor("puig");
  const subSupports = supportsFor("sub");
  const keptApart = supportsFor("unsure").filter(Boolean) as ChainPaper[];
  const lease = paper("example-1", "Business Lease");
  const subAsRelated = paper("example-5", "Related Sublease", { note: `Separate legal agreement · Feelunique International Limited · ${statusText(t.sub, t.subEnd)}` });
  const subOwn = paper("example-5", "Sublease");
  const puigPapers = [lease, ...accompanying, ...(t.mgmt === "puig" ? [subAsRelated, ...subSupports] : [])].filter(Boolean) as ChainPaper[];
  const puigDetail = ["Puig UK Limited", ...(showSub && t.mgmt !== "puig" ? ["Superior lease to the Feelunique Sublease"] : [])];
  const subDetail = ["Feelunique International Limited", "Granted by Puig under the 2016 Business Lease"];
  const wayleave = byId("example-3");
  const decisions = [
    { key: "puig" as const, label: "Puig's tenancy", value: t.puig ? statusText(t.puig, t.puigEnd) : null },
    { key: "mgmt" as const, label: "How the Sublease is shown", value: t.mgmt === "both" ? "Its own history" : t.mgmt === "puig" ? "Within Puig's history" : t.mgmt === "unsure" ? "Not settled" : null },
    { key: "sub" as const, label: "Feelunique's Sublease", value: t.sub ? statusText(t.sub, t.subEnd) : null },
    ...(t.compared ? (["licence", "deed"] as const).map((k) => {
      const b = t.belongs[k === "licence" ? "example-2" : "example-4"];
      return { key: k, label: k === "licence" ? "Licence to Alter" : "Deed of Variation", value: b === "puig" ? "With Puig's lease" : b === "sub" ? "With Feelunique's Sublease" : b === "unsure" ? "Not settled" : null };
    }) : []),
  ];
  const asking = ["puigStatus", "puigEnd", "subMgmt", "subStatus", "subEnd", "licence", "deed"].includes(t.step);

  return (
    <section aria-label="Proposed tenancy histories" className="min-h-0 flex-1 overflow-y-auto bg-background px-6 py-5">
      <h2 className="text-base font-semibold text-ink">Where I propose to put these papers</h2>
      <p className="mt-1 text-xs text-ink-muted">Proposed · nothing has been added to your papers yet · {openDecisions(t)} {openDecisions(t) === 1 ? "decision" : "decisions"} still open</p>
      {t.step === "checking" ? <p className="mt-6 text-sm italic text-ink-muted motion-safe:animate-pulse" aria-live="polite">Checking the tenancy papers…</p> : <>
        <div className="mt-5 rounded-lg border border-bone">
          <p className="border-b border-faint-rule px-4 py-2.5 text-sm font-semibold text-ink">Russell Square House</p>
          <div className="space-y-3 px-4 py-3">
            <p className="text-sm font-medium text-ink">Fifth Floor</p>
            <PrototypeDocumentsChain heading="Business Lease" status={status(t.puig, t.puigEnd)} mode="proposed" papers={puigPapers} detail={puigDetail} onView={viewByName} />
            {showSub && t.mgmt === "both" && subOwn && <PrototypeDocumentsChain heading="Sublease" status={status(t.sub, t.subEnd)} mode="proposed" papers={[subOwn, ...subSupports].filter(Boolean) as ChainPaper[]} detail={subDetail} onView={viewByName} />}
            {showSub && t.mgmt !== "both" && t.mgmt !== "puig" && subOwn && <div>
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-ink-muted">Presentation not yet settled</p>
              <PrototypeDocumentsChain heading="Sublease" status={status(t.sub, t.subEnd)} mode="awaiting" papers={[subOwn, ...subSupports].filter(Boolean) as ChainPaper[]} detail={subDetail} onView={viewByName} />
            </div>}
          </div>
        </div>
        {keptApart.length > 0 && <div className="mt-4"><p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-ink-muted">Kept separate for now</p>
          <PrototypeDocumentsChain heading="Agreement not yet established" status={{ kind: "unconfirmed" }} mode="awaiting" papers={keptApart} onView={viewByName} /></div>}
        {t.compared && wayleave && <div className="mt-4 rounded-lg border border-bone bg-secondary/40 px-4 py-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-ink-muted">Still to check</p>
          <button type="button" onClick={() => onView(wayleave.id)} className="mt-1 text-left text-sm font-medium text-ink hover:underline">BT &amp; Puig Wayleave</button>
          <p className="text-xs text-ink-muted">Not placed under either tenancy yet.</p>
        </div>}
        {t.step === "comparing" && <p className="mt-4 text-sm italic text-ink-muted motion-safe:animate-pulse" aria-live="polite">Comparing the remaining papers…</p>}
        <dl className="mt-6 divide-y divide-faint-rule border-t border-faint-rule text-sm">
          {decisions.map((d) => (
            <div key={d.key} className="flex items-center justify-between gap-3 py-2">
              <dt className="text-ink-muted">{d.label}</dt>
              <dd className="flex items-center gap-2 text-ink">{d.value ?? <span className="text-ink-muted">Not yet asked</span>}
                {d.value && !asking && <Button size="sm" variant="ghost" onClick={() => onChange(d.key)} aria-label={`Change ${d.label}`}>Change</Button>}
              </dd>
            </div>
          ))}
        </dl>
      </>}
    </section>
  );
}
