import type { ReactNode } from "react";
import * as HoverCard from "@radix-ui/react-hover-card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Info } from "lucide-react";
import owlDefault from "@/assets/prototype/owl-default.png";
import { knowledgeFor } from "./prototypeUnitPapers";
import type { DetailedUnit } from "./prototypeUnitDetails";

type Props = { unit: DetailedUnit; groupId?: string | null; onViewPaper?: (paperId: string) => void; onAddDescription?: () => void; children: ReactNode };

function Preview({ unit, groupId, onViewPaper, onAddDescription }: Omit<Props, "children">) {
  const known = knowledgeFor(groupId, unit.number);
  const own = unit.details?.description;
  return (
    <div className="flex gap-2">
      <img src={owlDefault} alt="" aria-hidden className="mt-0.5 h-6 w-6 shrink-0 object-contain" />
      <div className="min-w-0 text-sm text-foreground">
        <p className="font-semibold">{unit.name}</p>
        {own ? <p className="mt-1 leading-relaxed">{own}</p> : <div className="mt-1">
          <p className="text-muted-foreground">No description recorded yet.</p>
          {onAddDescription && <button type="button" onClick={onAddDescription} className="mt-1 text-xs font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Add a description</button>}
        </div>}
        {known.map(({ paper, shared }) => (
          <div key={paper.id} className="mt-2 border-t border-border pt-2">
            {<p className="text-[11px] text-muted-foreground">From the papers</p>}
            <p className="leading-relaxed text-foreground/90">{shared ? `Covered by a paper that applies to several Units. ${paper.premises}` : paper.premises}</p>
            <p className="mt-1 text-xs text-muted-foreground">Source: {paper.kind} · {paper.dated}</p>
            {onViewPaper && <button type="button" onClick={() => onViewPaper(paper.id)} className="mt-1 text-xs font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">View supporting paper</button>}
          </div>
        ))}
      </div>
    </div>
  );
}

const panel = "z-[1000] w-72 rounded-md border border-border bg-background p-3 shadow-md motion-safe:animate-in motion-safe:fade-in motion-safe:duration-200";

// Hobson's quiet knowledge about a Unit: hover on desktop, an info control for touch and keyboard.
// Nothing shows when there is neither a user description nor a confirmed paper.
// The whole row is the hover/focus trigger; the floating preview is portalled so the scrolling panel never clips it.
export function UnitKnowledgeRow({ unit, groupId, onViewPaper, onAddDescription, children }: Props) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-1">
      <HoverCard.Root openDelay={200} closeDelay={300}>
        <HoverCard.Trigger asChild><div className="min-w-0 flex-1 self-stretch">{children}</div></HoverCard.Trigger>
        <HoverCard.Portal>
          <HoverCard.Content side="right" align="start" sideOffset={8} collisionPadding={12} avoidCollisions className={panel}>
            <Preview unit={unit} groupId={groupId} onViewPaper={onViewPaper} onAddDescription={onAddDescription} />
          </HoverCard.Content>
        </HoverCard.Portal>
      </HoverCard.Root>
      <Popover>
        <PopoverTrigger aria-label={`What Hobson knows about ${unit.name}`} className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [@media(hover:hover)]:opacity-60">
          <Info className="h-3.5 w-3.5" aria-hidden />
        </PopoverTrigger>
        <PopoverContent side="bottom" align="end" className={panel}>
          <Preview unit={unit} groupId={groupId} onViewPaper={onViewPaper} onAddDescription={onAddDescription} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
