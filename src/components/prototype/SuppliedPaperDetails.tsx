import { useState } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { applyPaperPlacement, initialWorkGuidance, RENEWAL_PAPER_PLACE, type PaperPlace, type PaperPlacementAction, type SuppliedPaper } from "./workGuidance";

export function SuppliedPaperDetails({ paper: currentPaper, places = [], onPlacement }: { paper: SuppliedPaper; places?: PaperPlace[]; onPlacement?: (id: string, action: PaperPlacementAction) => void }) {
  const [choosing, setChoosing] = useState(false);
  const [sourceOpen, setSourceOpen] = useState(false);
  // A separate illustrative exception; never unfiles or changes the shared happy-path paper.
  const [previewPaper, setPreviewPaper] = useState<SuppliedPaper | null>(null);
  const paper = previewPaper ?? currentPaper;
  const placePaper = (id: string, action: PaperPlacementAction) => {
    if (!previewPaper) return;
    const result = applyPaperPlacement({ ...initialWorkGuidance, suppliedPapers: [previewPaper] }, id, action);
    const next = result.state.suppliedPapers[0];
    if (next) setPreviewPaper(next);
  };
  const mismatch = paper.proposedPlace.id !== RENEWAL_PAPER_PLACE.id;
  return <article aria-label={`Supplied paper: ${paper.filename}`} className="min-w-0 border-b border-border py-4">
    <h5 className="flex items-start gap-2 text-sm font-semibold"><FileText className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />{paper.filename}</h5>
    <p className="mt-2 text-xs text-muted-foreground">{previewPaper ? "Uncertain placement preview · separate illustrative example" : "Illustrative context check — not extraction from a real PDF."}</p>
    <p role="status" className="mt-3 text-sm font-medium">{paper.progress === "received" ? "Checking where this paper belongs" : paper.progress === "identified-linked" ? "Identified and linked" : paper.progress === "uncertain" ? "Placement needs your decision" : "Checking its effect on the renewal"}</p>
    <dl className="mt-3 space-y-2 text-sm">
      {paper.progress !== "received" && <div><dt className="inline text-muted-foreground">Identified as: </dt><dd className="inline">{paper.identifiedAs}</dd></div>}
      <div><dt className="inline text-muted-foreground">Supplied by: </dt><dd className="inline">You</dd></div>
      <div><dt className="inline text-muted-foreground">{paper.filedPlace ? "Location" : "Suggested location"}: </dt><dd className="inline">{(paper.filedPlace ?? paper.proposedPlace).label}</dd></div>
      <div><dt className="inline text-muted-foreground">{paper.tenancyLinked ? "Linked to" : "Suggested relationship"}: </dt><dd className="inline">{paper.tenancyLinked ? "Existing Business Lease · tenancy history" : "Accompanies the existing tenancy — not established"}</dd></div>
      <div><dt className="inline font-medium">Paper: </dt><dd className="inline">{paper.filedPlace ? "Added to Papers" : "Supplied by you"}</dd></div>
      <div><dt className="inline font-medium">Review: </dt><dd className="inline">{paper.progress === "checking-effect" ? "In progress" : "Awaiting examination"}</dd></div>
    </dl>
    {paper.progress === "uncertain" && <div className="mt-4 border-l-2 border-border pl-3">
      <p className="text-sm leading-relaxed">{mismatch ? "That is a different place from this renewal. I haven't moved the paper or linked it to the Flat 6 tenancy. Would you like me to file it there without that tenancy link, or keep it with Flat 6?" : "In this example, I cannot establish whether the Side Letter applies to Flat 6 or another Unit. Which place should I keep it with?"}</p>
      <p className="mt-3 text-xs font-semibold">This paper belongs with:</p>
      <p className="mt-1 text-sm">{paper.proposedPlace.label}</p>
      <p className="mt-1 text-xs text-muted-foreground">{mismatch ? `${paper.proposedPlace.kind} · No automatic link to the existing Business Lease` : "Existing Business Lease"}</p>
      {choosing && <div className="mt-3">
        <label htmlFor={`paper-place-${paper.id}`} className="text-xs font-medium">Choose a Unit or Unit Group</label>
        <select id={`paper-place-${paper.id}`} value={paper.proposedPlace.id} onChange={event => { const place = places.find(p => p.id === event.target.value); if (place) placePaper(paper.id, { type: "propose", place }); }} className="mt-2 w-full min-w-0 rounded-md border border-border bg-background p-2 text-sm">
          {places.map(place => <option key={place.id} value={place.id}>{place.label} · {place.kind}</option>)}
        </select>
      </div>}
      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" className="h-auto whitespace-normal" onClick={() => { placePaper(paper.id, { type: "confirm" }); setChoosing(false); }}>{mismatch ? "Add there without the tenancy link" : "Keep with Flat 6"}</Button>
        <Button size="sm" variant="outline" className="h-auto whitespace-normal" onClick={() => setChoosing(true)}>Choose somewhere else</Button>
        {mismatch && <Button size="sm" variant="ghost" className="h-auto whitespace-normal" onClick={() => placePaper(paper.id, { type: "propose", place: RENEWAL_PAPER_PLACE })}>Keep with Flat 6 instead</Button>}
      </div>
    </div>}
    {paper.filedPlace && <p className="mt-3 text-sm leading-relaxed">{paper.tenancyLinked ? "Related to the existing Business Lease" : "Filed at your chosen place, without a link to the Flat 6 tenancy history. The original conversation attachment is retained."}</p>}
    <p className="mt-3 text-xs text-muted-foreground">Received → {paper.tenancyLinked ? "Identified and linked" : "Relationship not established"} → {paper.progress === "checking-effect" ? "Checking its effect" : "Effect check pending"}</p>
    <p className="mt-3 text-xs text-muted-foreground">Renewal reference: {paper.job} · {paper.place} · {paper.activity}</p>
    <div className="mt-3 border-l-2 border-border pl-3"><h6 className="text-xs font-semibold">{paper.progress === "checking-effect" ? "Checking the Side Letter" : "What I'm checking"}</h6><p className="mt-1 text-sm leading-relaxed">{paper.progress === "checking-effect" ? "I'm examining whether the Side Letter changes the rent recorded in the Business Lease. Its effect is not yet established" : "Whether this Side Letter changes the rent position recorded in the Business Lease. Its effect has not been established"}; the rent finding, renewal summary and draft email remain unchanged.</p></div>
    <Button variant="ghost" size="sm" className="mt-2 h-auto whitespace-normal px-0 text-xs text-muted-foreground" aria-expanded={sourceOpen} onClick={() => setSourceOpen(!sourceOpen)}>Source conversation · {sourceOpen ? "Hide attachment message" : "Show attachment message"}</Button>
    {sourceOpen && <blockquote className="mt-2 border-l-2 border-border pl-3 text-sm leading-relaxed">{paper.sourceInstruction}</blockquote>}
    {onPlacement && places.length > 0 && <Button variant="ghost" size="sm" className="mt-3 h-auto whitespace-normal text-xs text-muted-foreground" onClick={() => { setChoosing(false); setPreviewPaper(previewPaper ? null : { ...currentPaper, progress: "uncertain", filedPlace: null, tenancyLinked: false, proposedPlace: RENEWAL_PAPER_PLACE }); }}>{previewPaper ? "Return to investigation" : "Preview uncertain placement"}</Button>}
  </article>;
}