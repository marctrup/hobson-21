import { useState } from "react";
import { ChevronDown, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EXAMPLE_GROUP, EXAMPLE_UNITS, isSettled, statusText, type Placement } from "./prototypeDocumentsPlacement";

type Props = { placement: Placement; paperType: string; filename: string; tenant: string; paperDate: string; effective: string | null; onOpenPaper: () => void };

const ROLE_NOTE = { landlord: "Organised from the landlord's perspective", tenant: "Organised from Systemiq's perspective", track: "Kept for reference, acting for neither party" } as const;

function ProposedPaper({ placement, paperType, filename, tenant, paperDate, effective, onOpenPaper, awaiting }: Props & { awaiting: boolean }) {
  const role = placement.role ? (placement.role.kind === "other" ? placement.role.note ? `Your responsibility: ${placement.role.note}` : "Your responsibility not yet settled" : ROLE_NOTE[placement.role.kind]) : "Your responsibility not yet established";
  return (
    <article aria-label={`${paperType} — ${awaiting ? "awaiting placement" : "proposed"}`} className="rounded-lg border border-dashed border-primary/50 bg-secondary/40 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <h4 className="text-sm font-semibold text-ink">{paperType}</h4>
        <span className="rounded-full border border-primary/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary">{awaiting ? "Awaiting placement" : "Proposed"}</span>
      </div>
      <p className="mt-1 text-sm text-ink">{tenant}</p>
      <div className="mt-3 flex items-start justify-between gap-3 border-t border-faint-rule pt-3">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 break-words text-xs text-ink"><FileText className="h-3.5 w-3.5 shrink-0 text-ink-muted" aria-hidden />{filename}</p>
          <p className="mt-1 text-xs text-ink-muted">{paperDate}{effective ? ` · effective ${effective}` : ""}</p>
        </div>
        <Button variant="outline" size="sm" onClick={onOpenPaper}>View</Button>
      </div>
      <dl className="mt-3 space-y-1 text-xs text-ink-muted">
        <div><dt className="inline">Status: </dt><dd className="inline text-ink">{statusText(placement)}</dd></div>
        {placement.current === "ended" && <div>The term in the lease runs to 21 August 2035</div>}
        <div>{role}</div>
        {placement.relation === "earlier" && <div>Relationship with an earlier lease left open</div>}
        {placement.relation === "unsure" && <div>Tenancy relationship unconfirmed</div>}
        {placement.unitStatus === "unsure" && <div>Unit unconfirmed</div>}
      </dl>
    </article>
  );
}

export default function PrototypeDocumentsPapers(props: Props) {
  const { placement } = props;
  const [groupOpen, setGroupOpen] = useState(true);
  const settled = isSettled(placement);
  const placed = placement.step === "placed";
  return (
    <section aria-label="Proposed placement" className="min-h-0 flex-1 overflow-y-auto bg-background px-6 py-5">
      <h2 className="text-base font-semibold text-ink">{placed ? "Where this paper will go" : "Where I propose to put this paper"}</h2>
      <p className="mt-1 text-xs text-ink-muted">Nothing has been added to your papers yet.</p>
      {!settled && placement.step !== "checking" && <div className="mt-5"><p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-ink-muted">Kept separate for now</p><ProposedPaper {...props} awaiting /></div>}
      <div className="mt-5 rounded-lg border border-bone">
        <button type="button" aria-expanded={groupOpen} onClick={() => setGroupOpen((o) => !o)} className="flex w-full items-center justify-between px-4 py-3 text-left">
          <span className="text-sm font-semibold text-ink">{EXAMPLE_GROUP}</span>
          <ChevronDown className={`h-4 w-4 text-ink-muted transition ${groupOpen ? "rotate-180" : ""}`} aria-hidden />
        </button>
        {groupOpen && <ul className="border-t border-bone">
          {EXAMPLE_UNITS.map((u) => {
            const here = placement.unit === u && placement.unitStatus !== "unsure";
            return (
              <li key={u} className="border-b border-faint-rule px-4 py-3 last:border-0">
                <p className={`text-sm ${here ? "font-semibold text-ink" : "text-ink-muted"}`}>{u}{here && placement.unitStatus === "asking" && <span className="ml-2 text-xs font-normal text-ink-muted">· I think it belongs here</span>}</p>
                {here && settled && <div className="mt-3">
                  <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-ink-muted">Tenancy history</p>
                  <ProposedPaper {...props} awaiting={false} />
                </div>}
                {!(here && settled) && <p className="mt-0.5 text-xs text-ink-muted">No confirmed occupational papers</p>}
              </li>
            );
          })}
        </ul>}
      </div>
    </section>
  );
}
