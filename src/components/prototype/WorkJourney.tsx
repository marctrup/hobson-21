import { useState } from "react";
import { ArrowLeft, Check, FileText, MessageCircle, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import owlReading from "@/assets/prototype/owl-reading.png";

type Step = "tenancy" | "rent" | "history" | "summary";
const steps: { id: Step; title: string; note: string; group?: string }[] = [
  { id: "tenancy", title: "Read the existing tenancy", note: "Confirmed the parties and end date.", group: "Completed" },
  { id: "rent", title: "Reviewed the rent", note: "Found £24,000 annually in the original lease." },
  { id: "history", title: "Checking the tenancy history", note: "Looking for changes in later papers.", group: "Working now" },
  { id: "summary", title: "Prepare renewal summary", note: "Not started.", group: "Next" },
];

function PaperReference({ extract, name = "Business Lease" }: { extract: string; name?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-3">
      <Button variant="ghost" size="sm" onClick={() => setOpen(!open)} aria-expanded={open} className="h-auto max-w-full justify-start gap-2 whitespace-normal px-0 text-xs text-muted-foreground">
        <FileText className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />{name} · {open ? "Hide paper" : "View paper"}
      </Button>
      {open && <aside aria-label={`${name} illustrative extract`} className="mt-3 border-l-2 border-border bg-popover px-3 py-3">
        <p className="text-xs font-medium text-muted-foreground">{name} · Illustrative extract</p>
        <blockquote className="mt-2 text-sm leading-relaxed">{extract}</blockquote>
        <p className="mt-2 text-xs text-muted-foreground">Example paper only — not a document from your portfolio.</p>
      </aside>}
    </div>
  );
}

export function WorkJourney({ paused, onPauseChange, onBack, onGuide }: {
  paused: boolean;
  onPauseChange: (paused: boolean) => void;
  onBack: () => void;
  onGuide: () => void;
}) {
  const [selected, setSelected] = useState<Step>("history");
  const selectedStep = steps.find((step) => step.id === selected);
  return (
    <div className="flex min-h-0 flex-1 flex-col" role="region" aria-label="Tenancy renewal work journey">
      <header className="shrink-0 border-b border-border px-5 pb-5 pt-4 sm:px-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="mb-4 gap-2 px-0 text-muted-foreground"><ArrowLeft className="h-4 w-4" />Back to What I've Done</Button>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1 basis-64">
            <p className="mb-2 text-xs text-muted-foreground">Stanley House · Flat 6</p>
            <h2 className="text-2xl font-semibold leading-tight">Getting the tenancy renewal ready</h2>
          </div>
          <Button variant="outline" size="sm" onClick={() => onPauseChange(!paused)} className="shrink-0 gap-2">{paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}{paused ? "Resume work" : "Pause work"}</Button>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <img src={owlReading} alt="Hobson reading" className="h-10 w-10 shrink-0 object-contain" />
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">I'm reviewing the existing tenancy and its history so I can prepare a renewal summary for you.</p>
        </div>
        <p role="status" className="mt-3 flex items-center gap-2 text-xs font-medium"><span className={`h-1.5 w-1.5 rounded-full ${paused ? "bg-muted-foreground" : "bg-ring"}`} aria-hidden="true" />{paused ? "Work paused · What I've found is preserved" : "I'm working on this now"}</p>
      </header>

      <div className="hobson-scroll min-h-0 flex-1 overflow-y-auto">
        <div className="grid min-h-full grid-cols-[minmax(0,0.35fr)_minmax(0,0.65fr)] max-[640px]:grid-cols-1">
          <nav aria-label="The Journey" className="min-w-0 border-r border-border px-4 py-5 max-[640px]:border-b max-[640px]:border-r-0">
            <h3 className="mb-5 text-xs font-semibold text-muted-foreground">The Journey</h3>
            <div className="relative">
              <div aria-hidden="true" className="absolute bottom-7 left-3 top-8 w-px bg-border" />
              {steps.map((step) => <div key={step.id}>
                {step.group && <p className="relative mb-2 mt-4 bg-background text-xs font-medium text-muted-foreground first:mt-0">{step.id === "history" && paused ? "Paused here" : step.group}</p>}
                <Button variant="ghost" aria-current={selected === step.id ? "step" : undefined} onClick={() => setSelected(step.id)} className={`relative mb-2 h-auto w-full items-start justify-start gap-2 rounded-md border px-2 py-3 text-left whitespace-normal ${selected === step.id ? "border-border bg-muted/70" : "border-transparent"}`}>
                  <span aria-hidden="true" className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center bg-background">{step.id === "tenancy" || step.id === "rent" ? <Check className="h-3.5 w-3.5 text-muted-foreground" /> : <span className={`h-2 w-2 rounded-full ${step.id === "history" ? paused ? "bg-muted-foreground" : "bg-ring" : "border border-muted-foreground"}`} />}</span>
                  <span className="min-w-0"><span className="block text-sm font-semibold leading-snug">{step.title}</span><span className="mt-1 block text-xs font-normal leading-relaxed text-muted-foreground">{step.note}</span></span>
                </Button>
              </div>)}
            </div>
          </nav>

          <section aria-labelledby="desk-heading" className="min-w-0 px-5 py-5 sm:px-6">
            <h3 id="desk-heading" className="mb-5 text-xs font-semibold text-muted-foreground">On Hobson's Desk</h3>
            <div key={selected}>
              <h4 className="text-lg font-semibold leading-snug">{selectedStep?.title}</h4>
              {selected === "history" && <>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{paused ? "I've paused the check of later papers against the original tenancy terms." : "I'm checking whether later papers have changed the original tenancy terms."}</p>
                <article className="mt-5 border-y border-border py-4">
                  <div className="flex flex-wrap items-center justify-between gap-2"><h5 className="flex items-center gap-2 text-sm font-semibold"><FileText className="h-4 w-4 text-muted-foreground" />Business Lease</h5><span className="flex items-center gap-1 text-xs text-muted-foreground"><Check className="h-3 w-3" />Reviewed</span></div>
                  <dl className="mt-3 space-y-2 text-sm"><div><dt className="text-xs text-muted-foreground">Original annual rent</dt><dd className="mt-1 font-medium">£24,000</dd></div><div><dt className="text-xs text-muted-foreground">Tenancy end date</dt><dd className="mt-1 font-medium">31 December 2026</dd></div></dl>
                  <PaperReference extract="Tenant: Example Tenant Ltd. Annual rent: £24,000. The tenancy term ends on 31 December 2026. These are the original lease terms; the effect of any later agreement has not yet been established." />
                </article>
                <article className="border-b border-border py-4">
                  <div className="flex flex-wrap items-center justify-between gap-2"><h5 className="flex items-center gap-2 text-sm font-semibold"><FileText className="h-4 w-4 text-muted-foreground" />Deed of Variation</h5><span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${paused ? "bg-muted-foreground" : "bg-ring"}`} />{paused ? "Checking paused" : "Checking"}</span></div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Examining whether it changes the original tenancy terms.</p>
                  <p className="mt-1 text-xs text-muted-foreground">No conclusion reached yet.</p>
                  <PaperReference name="Deed of Variation" extract="This illustrative later agreement refers to variations to the Business Lease. Its effect on the rent and tenancy term has not yet been established; no changed terms are confirmed in this preview." />
                </article>
                <div className="mt-5 border-l-2 border-ring pl-3"><h5 className="text-xs font-semibold">What I'm trying to establish</h5><p className="mt-2 text-sm leading-relaxed">Have any later papers changed the rent, tenancy end date or other relevant terms?</p></div>
              </>}
              {selected === "tenancy" && <>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">I found the tenancy agreement and confirmed the parties and end date recorded in it.</p>
                <dl className="mt-5 space-y-4 border-y border-border py-5 text-sm"><div><dt className="text-xs text-muted-foreground">Tenant</dt><dd className="mt-1 font-medium">Example Tenant Ltd</dd></div><div><dt className="text-xs text-muted-foreground">Tenancy end date in the original lease</dt><dd className="mt-1 font-medium">31 December 2026</dd></div></dl>
                <PaperReference extract="Tenant: Example Tenant Ltd. The tenancy term ends on 31 December 2026." />
                <p className="mt-5 text-xs leading-relaxed text-muted-foreground">Later papers are still being checked for changes to these terms.</p>
              </>}
              {selected === "rent" && <>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">The lease records this annual rent.</p>
                <dl className="mt-5 border-y border-border py-5"><dt className="text-xs text-muted-foreground">Original annual rent</dt><dd className="mt-2 text-2xl font-semibold">£24,000</dd></dl>
                <PaperReference extract="Annual rent: £24,000, payable in accordance with the terms of this lease." />
                <p className="mt-5 text-xs leading-relaxed text-muted-foreground">This is the original lease figure, not a confirmed current rent. Later agreements are still being checked.</p>
              </>}
              {selected === "summary" && <>
                <p className="mt-3 text-xs font-medium text-muted-foreground">Not started</p>
                <p className="mt-5 text-sm leading-relaxed">I shall bring together the current terms and any changes I've found, ready for your review.</p>
                <p className="mt-4 border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">The later papers need checking before I prepare the renewal summary.</p>
              </>}
            </div>
          </section>
        </div>
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-4 sm:px-6">
          <p className="max-w-md text-xs leading-relaxed text-muted-foreground">Illustrative work and paper extracts only — no live work is running.</p>
          <Button variant="secondary" size="sm" onClick={onGuide} className="gap-2"><MessageCircle className="h-4 w-4" />Guide Hobson</Button>
        </footer>
      </div>
    </div>
  );
}
