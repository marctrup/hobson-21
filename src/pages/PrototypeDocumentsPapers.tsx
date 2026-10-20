import { useState } from "react";
import { ChevronDown } from "lucide-react";
import PrototypeDocumentsChain, { type ChainMode, type ChainPaper, type ChainStatus } from "./PrototypeDocumentsChain";
import { EXAMPLE_GROUP, EXAMPLE_UNITS, isSettled, type Placement } from "./prototypeDocumentsPlacement";

type Props = { filed?: boolean; url?: string; placement: Placement; paperType: string; filename: string; tenant: string; paperDate: string; effective: string | null; onOpenPaper: () => void };

const ROLE_NOTE = { landlord: "Organised from the landlord's perspective", tenant: "Organised from Systemiq's perspective", track: "Kept for reference, acting for neither party" } as const;

export const LATER_EXAMPLE_PAPERS: ChainPaper[] = [
  { type: "Licence: Alteration", filename: "2025.08.22 - 4th Fl, RSH - Licence to Alter - Signed by Landlord.pdf", date: "22 August 2025", note: "Original not supplied in this demonstration" },
  { type: "Side Letter: Variation", filename: "4th floor RSH (Systemiq Limited) Side letter 04.09.2025.pdf", date: "4 September 2025", note: "Original not supplied in this demonstration" },
];

function chainStatus(p: Placement): ChainStatus {
  if (p.current === "current") return { kind: "current" };
  if (p.current === "ended") return { kind: "ended", date: p.endDate };
  return { kind: "unconfirmed" };
}

function ProposedPaper({ filed, placement, paperType, filename, tenant, paperDate, effective, onOpenPaper, awaiting, url }: Props & { awaiting: boolean }) {
  const role = placement.role ? (placement.role.kind === "other" ? placement.role.note ? `Your responsibility: ${placement.role.note}` : "Your responsibility not yet settled" : ROLE_NOTE[placement.role.kind]) : "Your responsibility not yet established";
  const mode: ChainMode = filed ? "confirmed" : awaiting ? "awaiting" : placement.step === "placed" ? "reading" : "proposed";
  const detail = [tenant, effective ? `Effective ${effective}` : "", placement.current === "ended" ? "The term in the lease runs to 21 August 2035" : "", role,
    placement.relation === "earlier" ? "Relationship with an earlier lease left open" : "", placement.relation === "unsure" ? "Tenancy relationship unconfirmed" : "", placement.unitStatus === "unsure" ? "Unit unconfirmed" : ""].filter(Boolean);
  const papers: ChainPaper[] = [{ type: paperType, filename, date: paperDate, url: url ?? "#", pending: !filed }, ...(filed ? LATER_EXAMPLE_PAPERS : [])];
  return <PrototypeDocumentsChain heading={paperType} status={chainStatus(placement)} mode={mode} papers={papers} detail={detail} onView={(p) => p.filename === filename && onOpenPaper()} />;
}

export default function PrototypeDocumentsPapers(props: Props) {
  const { placement } = props;
  const [groupOpen, setGroupOpen] = useState(true);
  const settled = isSettled(placement);
  const separate = placement.unitStatus === "unsure" || placement.relation === "earlier" || placement.relation === "unsure" || (["review", "change", "placed", "fits"].includes(placement.step) && placement.unitStatus !== "confirmed") || (["review", "change", "placed"].includes(placement.step) && !settled);
  const placed = placement.step === "placed";
  return (
    <section aria-label="Proposed placement" className="min-h-0 flex-1 overflow-y-auto bg-background px-6 py-5">
      <h2 className="text-base font-semibold text-ink">{props.filed ? "What I have for Russell Square House" : placed ? "Where this paper will go" : "Where I propose to put this paper"}</h2>
      {!props.filed && <p className="mt-1 text-xs text-ink-muted">Nothing has been added to your papers yet.</p>}
      {separate && <div className="mt-5"><p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-ink-muted">Kept separate for now</p><ProposedPaper {...props} awaiting /></div>}
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
                {here && !separate && <div className="mt-3">
                  <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-ink-muted">{props.filed ? "Tenancy history" : placement.relation === "new" ? "Tenancy history · new" : "Proposed paper · not yet in a tenancy history"}</p>
                  <div className="space-y-3"><ProposedPaper {...props} awaiting={false} /></div>
                </div>}
                {!(here && !separate) && <p className="mt-0.5 text-xs text-ink-muted">No confirmed occupational papers</p>}
              </li>
            );
          })}
        </ul>}
      </div>
    </section>
  );
}
