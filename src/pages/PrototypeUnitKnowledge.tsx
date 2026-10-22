import type { ReactNode } from "react";
import * as HoverCard from "@radix-ui/react-hover-card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Info } from "lucide-react";
import { knowledgeFor, paperById } from "./prototypeUnitPapers";
import { fieldsFor, FIELD_LABELS, formatValue, type DetailedUnit } from "./prototypeUnitDetails";
import { formatRent, occupationsFor, statusFor } from "./prototypeUnitTenancy";

type Props = { unit: DetailedUnit; groupId?: string | null; onViewPaper?: (paperId: string) => void; onAddDescription?: () => void; children: ReactNode };

const NOT = <span className="text-muted-foreground">Not recorded</span>;

function Row({ label, children }: { label: string; children: ReactNode }) {
  return <div className="flex gap-2 py-0.5"><dt className="w-24 shrink-0 text-muted-foreground">{label}</dt><dd className="min-w-0 flex-1">{children}</dd></div>;
}

// Two clearly separate things: what the Unit is, and who occupies it on what recorded terms.
function Preview({ unit, groupId, onViewPaper, onAddDescription }: Omit<Props, "children">) {
  const d = unit.details ?? {};
  const physical = fieldsFor(unit).filter(f => f !== "description" && d[f] !== undefined);
  const occupations = occupationsFor(groupId, unit.number);
  const status = statusFor(groupId, unit.number);
  const premises = knowledgeFor(groupId, unit.number);
  return (
    <div className="text-xs text-foreground">
      <p className="text-sm font-semibold">{unit.name}</p>
      <p className="text-muted-foreground">{unit.classification}</p>

      <section aria-label="The Unit" className="mt-2 border-t border-border pt-2">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">The Unit</p>
        {d.description ? <p className="mt-1 text-sm leading-relaxed">{d.description}</p> : <div className="mt-1">
          <p className="text-muted-foreground">No description recorded yet.</p>
          {onAddDescription && <button type="button" onClick={onAddDescription} className="mt-1 font-medium underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Add a description</button>}
        </div>}
        {physical.length > 0 && <dl className="mt-1.5">{physical.map(f => <Row key={f} label={f === "area" ? "Size" : FIELD_LABELS[f]}>{formatValue(f, d)}</Row>)}</dl>}
        {premises.map(({ paper }) => <p key={paper.id} className="mt-1.5 text-muted-foreground">From the papers: {paper.premises}</p>)}
      </section>

      <section aria-label="The occupation" className="mt-2 border-t border-border pt-2">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">The occupation</p>
        <p className="mt-1 font-medium">{status}</p>
        {occupations.map((o, i) => {
          const t = o.terms ?? {};
          const source = t.sourcePaperId ? paperById(t.sourcePaperId) : null;
          return (
            <div key={o.id} className={i ? "mt-2 border-t border-dashed border-border pt-2" : "mt-1"}>
              {occupations.length > 1 && <p className="text-muted-foreground">Relationship {i + 1}</p>}
              <dl>
                <Row label="Occupant">{t.occupant ?? NOT}</Row>
                <Row label="Landlord">{t.landlord ?? NOT}</Row>
                <Row label="Started">{t.commenced ?? NOT}</Row>
                <Row label="Rent">{formatRent(t.rent) ?? NOT}</Row>
                <Row label="Break option">{t.breakDate ? `${t.breakDate} (contractual break option, not an end date)` : NOT}</Row>
              </dl>
              {source && <p className="mt-1 text-muted-foreground">Source: {source.kind} · {source.dated}{onViewPaper && <> · <button type="button" onClick={() => onViewPaper(source.id)} className="font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">View supporting paper</button></>}</p>}
            </div>
          );
        })}
        <p className="mt-1.5 text-[10px] text-muted-foreground">Recorded relationships, not proof of physical occupation.</p>
      </section>
    </div>
  );
}

const panel = "z-[1000] w-80 rounded-md border border-border bg-background p-3 shadow-md motion-safe:animate-in motion-safe:fade-in motion-safe:duration-200";

// Hover on desktop; the info control gives the same panel for touch and keyboard.
// The floating preview is portalled and sits to the side so the list stays readable.
export function UnitKnowledgeRow({ unit, groupId, onViewPaper, onAddDescription, children }: Props) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-1">
      <HoverCard.Root openDelay={250} closeDelay={250}>
        <HoverCard.Trigger asChild><div className="min-w-0 flex-1 self-stretch">{children}</div></HoverCard.Trigger>
        <HoverCard.Portal>
          <HoverCard.Content side="right" align="start" sideOffset={8} collisionPadding={12} avoidCollisions className={panel}>
            <Preview unit={unit} groupId={groupId} onViewPaper={onViewPaper} onAddDescription={onAddDescription} />
          </HoverCard.Content>
        </HoverCard.Portal>
      </HoverCard.Root>
      <Popover>
        <PopoverTrigger aria-label={`What Hobson knows about ${unit.name}`} className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Info className="h-3.5 w-3.5" aria-hidden />
        </PopoverTrigger>
        <PopoverContent side="left" align="start" className={panel}>
          <Preview unit={unit} groupId={groupId} onViewPaper={onViewPaper} onAddDescription={onAddDescription} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
