import { useContext, useEffect, useState } from "react";
import { PaperPreviewContext } from "./paperPreviewContext";
import { ChevronDown, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SIDE_LETTER_RENT, applyPaperPlacement, initialWorkGuidance, RENEWAL_PAPER_PLACE, type PaperPlace, type PaperPlacementAction, type SuppliedPaper } from "./workGuidance";

export function SuppliedPaperDetails({ paper: currentPaper, places = [], onPlacement }: { paper: SuppliedPaper; places?: PaperPlace[]; onPlacement?: (id: string, action: PaperPlacementAction) => void }) {
  const [choosing, setChoosing] = useState(false);
  const [sourceOpen, setSourceOpen] = useState(false);
  const [rentEvidence, setRentEvidence] = useState<"lease" | "side-letter" | null>(null);
  // A separate illustrative exception; never unfiles or changes the shared happy-path paper.
  const [previewPaper, setPreviewPaper] = useState<SuppliedPaper | null>(null);
  const setPreviewActive = useContext(PaperPreviewContext);
  useEffect(() => { setPreviewActive(!!previewPaper); }, [previewPaper, setPreviewActive]);
  useEffect(() => () => setPreviewActive(false), [setPreviewActive]);
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
    <p className="mt-2 text-xs text-muted-foreground">{previewPaper ? "Uncertain placement preview · a separate illustrative scenario in which this paper's relationship has not been established. The real Side Letter record and its review are unchanged." : "Illustrative context check — not extraction from a real PDF."}</p>
    <p role="status" className="mt-3 text-sm font-medium">{paper.progress === "received" ? "Checking where this paper belongs" : paper.progress === "identified-linked" ? "Identified and linked" : paper.progress === "uncertain" ? "Placement needs your decision" : paper.progress === "effect-found" ? "Checking the Side Letter · Completed" : "Checking its effect on the renewal"}</p>
    <dl className="mt-3 space-y-2 text-sm">
      {paper.progress !== "received" && <div><dt className="inline text-muted-foreground">Identified as: </dt><dd className="inline">{paper.identifiedAs}</dd></div>}
      <div><dt className="inline text-muted-foreground">Supplied by: </dt><dd className="inline">You</dd></div>
      <div><dt className="inline text-muted-foreground">{paper.filedPlace ? "Location" : "Suggested location"}: </dt><dd className="inline">{(paper.filedPlace ?? paper.proposedPlace).label}</dd></div>
      <div><dt className="inline text-muted-foreground">{paper.tenancyLinked ? "Linked to" : "Suggested relationship"}: </dt><dd className="inline">{paper.tenancyLinked ? "Existing Business Lease · tenancy history" : "Accompanies the existing tenancy — not established"}</dd></div>
      <div><dt className="inline font-medium">Paper: </dt><dd className="inline">{paper.filedPlace ? "Added to Papers" : "Supplied by you"}</dd></div>
      <div><dt className="inline font-medium">Review: </dt><dd className="inline">{paper.progress === "effect-found" ? "Completed" : paper.progress === "checking-effect" ? "In progress" : "Awaiting examination"}</dd></div>
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
    <p className="mt-3 text-xs text-muted-foreground">Received → {paper.tenancyLinked ? "Identified and linked" : "Relationship not established"} → {paper.progress === "effect-found" ? "Effect checked" : paper.progress === "checking-effect" ? "Checking its effect" : "Effect check pending"}</p>
    <p className="mt-3 text-xs text-muted-foreground">Renewal reference: {paper.job} · {paper.place} · {paper.activity}</p>
    {paper.progress === "effect-found" && !previewPaper ? <section aria-label="What the papers record" className="mt-3 border-l-2 border-ring pl-3">
      <h6 className="text-xs font-semibold">What the papers record</h6>
      <p className="mt-1 text-xs text-muted-foreground">Illustrative demonstration figures — not a real finding about Stanley House.</p>
      <div className="mt-2 divide-y divide-border border-y border-border">
        {[
            { id: "lease" as const, paper: "Business Lease", amount: "£24,000", from: "Original lease position", extract: "Annual rent: £24,000, payable in accordance with the terms of this lease." },
            { id: "side-letter" as const, paper: "Side Letter 2024", amount: SIDE_LETTER_RENT.amount, from: SIDE_LETTER_RENT.from, extract: SIDE_LETTER_RENT.extract },
          ].map(row => <div key={row.id}>
          <Button variant="ghost" aria-expanded={rentEvidence === row.id} onClick={() => setRentEvidence(rentEvidence === row.id ? null : row.id)} className={`h-auto w-full justify-between gap-3 whitespace-normal rounded-sm px-2 py-2 text-left ${rentEvidence === row.id ? "bg-muted/70" : ""}`}>
            <span className="min-w-0"><span className="block text-xs font-normal text-muted-foreground">{row.paper}</span><span className="block text-sm font-medium">{row.amount} <span className="font-normal text-muted-foreground">· {row.from}</span></span></span>
            <ChevronDown aria-hidden="true" className={`h-3.5 w-3.5 shrink-0 text-muted-foreground ${rentEvidence === row.id ? "rotate-180" : ""}`} />
          </Button>
          {rentEvidence === row.id && <aside role="region" aria-label={`${row.paper} rent evidence`} className="mb-2 border-l-2 border-border bg-popover px-3 py-3">
            <p className="text-xs font-semibold">Supporting paper · {row.paper}</p>
            <p className="mt-2 text-xs font-medium text-muted-foreground">Demonstration wording · illustrative extract</p>
            <blockquote className="mt-1 text-sm leading-relaxed">{row.extract}</blockquote>
            <p className="mt-2 text-xs text-muted-foreground">Example wording only — not a quotation from your portfolio papers.</p>
          </aside>}
        </div>)}
      </div>
      <h6 className="mt-3 text-xs font-semibold">What changed</h6><p className="mt-1 text-sm leading-relaxed">The Side Letter records a later rent position for this tenancy.</p>
      <h6 className="mt-3 text-xs font-semibold">What remains to check</h6><p className="mt-1 text-sm leading-relaxed">Whether any other later papers affect that position.</p>
    </section> : <div className="mt-3 border-l-2 border-border pl-3"><h6 className="text-xs font-semibold">{paper.progress === "checking-effect" ? "Checking the Side Letter" : "What I'm checking"}</h6><p className="mt-1 text-sm leading-relaxed">{paper.progress === "checking-effect" ? "I'm examining whether the Side Letter changes the rent recorded in the Business Lease. Its effect is not yet established" : "Whether this Side Letter changes the rent position recorded in the Business Lease. Its effect has not been established"}; the rent finding, renewal summary and draft email remain unchanged.</p></div>}
    <Button variant="ghost" size="sm" className="mt-2 h-auto whitespace-normal px-0 text-xs text-muted-foreground" aria-expanded={sourceOpen} onClick={() => setSourceOpen(!sourceOpen)}>Source conversation · {sourceOpen ? "Hide attachment message" : "Show attachment message"}</Button>
    {sourceOpen && <blockquote className="mt-2 border-l-2 border-border pl-3 text-sm leading-relaxed">{paper.sourceInstruction}</blockquote>}
    {onPlacement && !previewPaper && currentPaper.progress === "checking-effect" && currentPaper.tenancyLinked && <Button variant="ghost" size="sm" className="mt-3 h-auto whitespace-normal text-xs text-muted-foreground" onClick={() => onPlacement(currentPaper.id, { type: "examine" })}>Preview Side Letter finding</Button>}
    {onPlacement && places.length > 0 && <Button variant="ghost" size="sm" className="mt-3 h-auto whitespace-normal text-xs text-muted-foreground" onClick={() => { setChoosing(false); setPreviewPaper(previewPaper ? null : { ...currentPaper, progress: "uncertain", filedPlace: null, tenancyLinked: false, proposedPlace: RENEWAL_PAPER_PLACE }); }}>{previewPaper ? "Return to investigation" : "Preview uncertain placement"}</Button>}
  </article>;
}