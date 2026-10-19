import { useState } from "react";
import { ArrowLeft, Check, FileText, MessageCircle, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import owlReading from "@/assets/prototype/owl-reading.png";

function PaperReference({ extract, name = "Business Lease" }: { extract: string; name?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4">
      <Button variant="ghost" size="sm" onClick={() => setOpen(!open)} aria-expanded={open} className="h-auto max-w-full justify-start gap-2 whitespace-normal px-0 text-xs text-muted-foreground">
        <FileText className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {name} · {open ? "Hide paper" : "View paper"}
      </Button>
      {open && (
        <aside aria-label={`${name} illustrative extract`} className="mt-3 border-l-2 border-border bg-popover px-4 py-4">
          <p className="text-xs font-medium text-muted-foreground">{name} · Illustrative extract</p>
          <blockquote className="mt-3 text-sm leading-relaxed">{extract}</blockquote>
          <p className="mt-3 text-xs text-muted-foreground">Example paper only — not a document from your portfolio.</p>
        </aside>
      )}
    </div>
  );
}

export function WorkJourney({ paused, onPauseChange, onBack, onGuide }: {
  paused: boolean;
  onPauseChange: (paused: boolean) => void;
  onBack: () => void;
  onGuide: () => void;
}) {
  return (
    <div className="hobson-scroll min-h-0 flex-1 overflow-y-auto" role="region" aria-label="Tenancy renewal work journey">
      <div className="mx-auto w-full max-w-3xl px-5 pb-12 pt-6 sm:px-8">
        <Button variant="ghost" size="sm" onClick={onBack} className="mb-7 gap-2 px-0 text-muted-foreground"><ArrowLeft className="h-4 w-4" />Back to What I've Done</Button>
        <header className="mb-8">
          <p className="mb-2 text-xs text-muted-foreground">Stanley House · Flat 6</p>
          <h2 className="text-2xl font-semibold leading-tight sm:text-3xl">Getting the tenancy renewal ready</h2>
          <div className="mt-5 flex items-start gap-4">
            <img src={owlReading} alt="Hobson reading" className="h-14 w-14 shrink-0 object-contain" />
            <p className="text-sm leading-relaxed text-muted-foreground">I'm reviewing the existing tenancy and its history so I can prepare a renewal summary for you.</p>
          </div>
          <p role="status" className="mt-4 flex items-center gap-2 text-xs font-medium"><span className={`h-2 w-2 rounded-full ${paused ? "bg-muted-foreground" : "bg-ring motion-safe:animate-pulse"}`} aria-hidden="true" />{paused ? "Work paused · What I've found is preserved" : "I'm working on this now"}</p>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">Illustrative work — all names, dates, figures and paper extracts are examples.</p>
        </header>

        <section aria-labelledby="journey-done" className="mb-7">
          <h3 id="journey-done" className="mb-5 text-sm font-semibold">What I've done</h3>
          <div className="ml-2 border-l border-border pl-6">
            <article className="relative pb-7">
              <span className="absolute -left-9 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-background text-muted-foreground"><Check className="h-4 w-4" aria-hidden="true" /></span>
              <h4 className="text-base font-semibold">Read the existing tenancy</h4>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">I found the tenancy agreement and confirmed the current term.</p>
              <dl className="mt-4 grid gap-3 border-y border-border py-4 text-sm sm:grid-cols-2">
                <div><dt className="text-xs text-muted-foreground">Tenant</dt><dd className="mt-1 font-medium">Example Tenant Ltd</dd></div>
                <div><dt className="text-xs text-muted-foreground">Tenancy end date</dt><dd className="mt-1 font-medium">31 December 2026</dd></div>
              </dl>
              <PaperReference extract="Tenant: Example Tenant Ltd. The tenancy term ends on 31 December 2026." />
            </article>
            <article className="relative pb-2">
              <span className="absolute -left-9 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-background text-muted-foreground"><Check className="h-4 w-4" aria-hidden="true" /></span>
              <h4 className="text-base font-semibold">Reviewed the rent</h4>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">The lease records an annual rent of <span className="font-semibold text-foreground">£24,000</span>.</p>
              <PaperReference extract="Annual rent: £24,000, payable in accordance with the terms of this lease." />
            </article>
          </div>
        </section>

        <section aria-labelledby="journey-current" className="mb-7">
          <h3 id="journey-current" className="mb-4 text-sm font-semibold">What I'm doing now</h3>
          <div className="border-l-2 border-ring bg-muted/50 px-5 py-5">
            <h4 className="flex items-center gap-3 text-base font-semibold"><span className={`h-2 w-2 shrink-0 rounded-full ${paused ? "bg-muted-foreground" : "bg-ring motion-safe:animate-pulse"}`} aria-hidden="true" />Checking the tenancy history</h4>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{paused ? "I've paused here. The later papers still need checking for changes to the original terms." : "I'm checking the later papers to see whether anything has changed since the original tenancy agreement."}</p>

            <div className="mt-6">
              <h5 className="text-xs font-semibold">Papers I'm checking</h5>
              <p className="mt-2 text-xs text-muted-foreground">Illustrative papers — not from your live portfolio.</p>
              <div className="mt-4 divide-y divide-border">
                <div className="pb-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground"><Check className="h-3.5 w-3.5" aria-hidden="true" />Reviewed</div>
                  <PaperReference extract="Tenant: Example Tenant Ltd. Annual rent: £24,000. The tenancy term ends on 31 December 2026. These are the original lease terms; the effect of any later agreement has not yet been established." />
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">The original agreement records the tenancy terms and annual rent.</p>
                </div>
                <div className="pt-4">
                  <div className="flex items-center gap-2 text-xs font-medium"><span className={`h-1.5 w-1.5 shrink-0 rounded-full ${paused ? "bg-muted-foreground" : "bg-ring"}`} aria-hidden="true" />{paused ? "Checking paused" : "Checking"}</div>
                  <PaperReference name="Deed of Variation" extract="This illustrative later agreement refers to variations to the Business Lease. Its effect on the rent and tenancy term has not yet been established; no changed terms are confirmed in this preview." />
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{paused ? "I still need to examine whether this changes any of the original tenancy terms." : "I'm examining whether this changes any of the original tenancy terms."}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-border pt-5">
              <h5 className="text-xs font-semibold">What I've established so far</h5>
              <p className="mt-2 text-sm leading-relaxed">The original lease records an annual rent of £24,000 and a tenancy end date of 31 December 2026.</p>
              <div className="mt-4 border-l border-dashed border-border pl-3">
                <h5 className="text-xs font-medium text-muted-foreground">Still checking</h5>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Whether any later agreement changes these terms.</p>
              </div>
            </div>
            <p className="mt-5 border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">Once I've checked the later papers, I shall bring any changes into the renewal summary.</p>
          </div>
        </section>

        <section aria-labelledby="journey-next" className="mb-8">
          <h3 id="journey-next" className="mb-4 text-sm font-semibold">What's next</h3>
          <div className="border-l border-dashed border-border pl-5 text-muted-foreground">
            <h4 className="text-base font-medium">Prepare the renewal summary</h4>
            <p className="mt-2 text-sm leading-relaxed">I shall bring together the current terms and any changes I've found, ready for your review.</p>
            <p className="mt-2 text-xs">Not started</p>
          </div>
        </section>

        <footer className="border-t border-border pt-5">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" onClick={() => onPauseChange(!paused)} className="gap-2">{paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}{paused ? "Resume work" : "Pause work"}</Button>
            <Button variant="secondary" size="sm" onClick={onGuide} className="gap-2"><MessageCircle className="h-4 w-4" />Guide Hobson</Button>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">Illustrative controls only — no live work is running.</p>
        </footer>
      </div>
    </div>
  );
}