import { useState } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RENEWAL_PAPER_PLACE, type PaperPlace, type PaperPlacementAction, type SuppliedPaper } from "./workGuidance";

export function SuppliedPaperDetails({ paper, places = [], onPlacement }: { paper: SuppliedPaper; places?: PaperPlace[]; onPlacement?: (id: string, action: PaperPlacementAction) => void }) {
  const [choosing, setChoosing] = useState(false);
  const [sourceOpen, setSourceOpen] = useState(false);
  const mismatch = paper.proposedPlace.id !== RENEWAL_PAPER_PLACE.id;
  return <article aria-label={`Supplied paper: ${paper.filename}`} className="min-w-0 border-b border-border py-4">
    <h5 className="flex items-start gap-2 text-sm font-semibold"><FileText className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />{paper.filename}</h5>
    <p className="mt-2 text-xs text-muted-foreground">Illustrative identification — not verified findings from a PDF.</p>
    <dl className="mt-3 space-y-2 text-sm">
      <div><dt className="inline text-muted-foreground">Identified as: </dt><dd className="inline">{paper.identifiedAs}</dd></div>
      <div><dt className="inline text-muted-foreground">Supplied by: </dt><dd className="inline">You</dd></div>
      <div><dt className="inline text-muted-foreground">{paper.filedPlace ? "Location" : "Suggested location"}: </dt><dd className="inline">{(paper.filedPlace ?? paper.proposedPlace).label}</dd></div>
      <div><dt className="inline text-muted-foreground">{paper.tenancyLinked ? "Linked to" : "Suggested relationship"}: </dt><dd className="inline">{paper.tenancyLinked ? "Existing Business Lease · tenancy history" : "Accompanies the existing tenancy — not established"}</dd></div>
      <div><dt className="inline font-medium">Paper: </dt><dd className="inline">{paper.filedPlace ? "Added to Papers" : "Awaiting placement confirmation"}</dd></div>
      <div><dt className="inline font-medium">Review: </dt><dd className="inline">Awaiting examination</dd></div>
    </dl>
    {!paper.filedPlace && onPlacement && <div className="mt-4 border-l-2 border-border pl-3">
      <p className="text-sm leading-relaxed">{mismatch ? "That is a different place from this renewal. I haven't moved the paper or linked it to the Flat 6 tenancy. Would you like me to file it there without that tenancy link, or keep it with Flat 6?" : "I believe this Side Letter belongs with the tenancy at Stanley House, Flat 6. I'll keep it with that tenancy's papers so I can consider it alongside the Business Lease."}</p>
      <p className="mt-3 text-xs font-semibold">This paper belongs with:</p>
      <p className="mt-1 text-sm">{paper.proposedPlace.label}</p>
      <p className="mt-1 text-xs text-muted-foreground">{mismatch ? `${paper.proposedPlace.kind} · No automatic link to the existing Business Lease` : "Existing Business Lease"}</p>
      {choosing && <div className="mt-3">
        <label htmlFor={`paper-place-${paper.id}`} className="text-xs font-medium">Choose a Unit or Unit Group</label>
        <select id={`paper-place-${paper.id}`} value={paper.proposedPlace.id} onChange={event => { const place = places.find(p => p.id === event.target.value); if (place) onPlacement(paper.id, { type: "propose", place }); }} className="mt-2 w-full min-w-0 rounded-md border border-border bg-background p-2 text-sm">
          {places.map(place => <option key={place.id} value={place.id}>{place.label} · {place.kind}</option>)}
        </select>
      </div>}
      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" className="h-auto whitespace-normal" onClick={() => { onPlacement(paper.id, { type: "confirm" }); setChoosing(false); }}>{mismatch ? "Add there without the tenancy link" : "Yes, add it here"}</Button>
        <Button size="sm" variant="outline" className="h-auto whitespace-normal" onClick={() => setChoosing(true)}>Choose somewhere else</Button>
        {mismatch && <Button size="sm" variant="ghost" className="h-auto whitespace-normal" onClick={() => onPlacement(paper.id, { type: "propose", place: RENEWAL_PAPER_PLACE })}>Keep with Flat 6 instead</Button>}
      </div>
    </div>}
    {paper.filedPlace && <p role="status" className="mt-3 text-sm leading-relaxed">{paper.tenancyLinked ? "I've added the Side Letter to the tenancy papers and linked it to this renewal. I'll now check whether it changes anything I've already established." : "Filed at your chosen place, without a link to the Flat 6 tenancy history. The original conversation attachment is retained."}</p>}
    <p className="mt-3 text-xs text-muted-foreground">Renewal reference: {paper.job} · {paper.place} · {paper.activity}</p>
    <div className="mt-3 border-l-2 border-border pl-3"><h6 className="text-xs font-semibold">What I'm checking</h6><p className="mt-1 text-sm leading-relaxed">Whether this Side Letter changes the rent position recorded in the Business Lease. Filing does not establish its contents or its relationship to the tenancy.</p></div>
    <Button variant="ghost" size="sm" className="mt-2 h-auto whitespace-normal px-0 text-xs text-muted-foreground" aria-expanded={sourceOpen} onClick={() => setSourceOpen(!sourceOpen)}>Source conversation · {sourceOpen ? "Hide attachment message" : "Show attachment message"}</Button>
    {sourceOpen && <blockquote className="mt-2 border-l-2 border-border pl-3 text-sm leading-relaxed">{paper.sourceInstruction}</blockquote>}
  </article>;
}