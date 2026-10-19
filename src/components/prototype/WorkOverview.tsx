import { useEffect, useState } from "react";
import { ArrowUpRight, Check, CheckCheck, CircleDot, CornerDownRight, Hand, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import owlReading from "@/assets/prototype/owl-reading.png";
import { WorkJourney, type ApprovalStatus } from "./WorkJourney";

const renewalApproval = {
  place: "Stanley House · Flat 6",
  title: "Getting the tenancy renewal ready",
  prepared: "I've prepared an email asking the tenant to discuss the tenancy renewal.",
  decision: "May I send the renewal email to the tenant?",
};

const reviews = [
  {
    place: "Stanley House · Flat 8",
    title: "The rent review is ready for your eye",
    prepared: "I've read the lease, checked the review terms and brought together six comparable rents.",
    decision: "Would you like me to use these comparables to prepare the proposed rent?",
  },
  {
    place: "5 Nugent Terrace · Shop",
    title: "An assessor for the new EPC",
    prepared: "I've checked the existing certificate and prepared an instruction for your usual assessor.",
    decision: "Please confirm the assessor and the instruction before anything is sent.",
  },
];

const ongoing = [
  {
    place: "Stanley House · Flat 6",
    title: "Getting the tenancy renewal ready",
    recent: "I've confirmed the tenancy end date and read the renewal terms.",
    current: "I'm bringing the current rent and tenancy history together.",
    next: "I shall prepare a renewal summary for your review.",
  },
  {
    place: "Across your portfolio",
    title: "Putting the compliance papers in order",
    recent: "I've matched the gas safety certificates to their units.",
    current: "I'm checking which certificates are missing or out of date.",
    next: "I shall bring you a short list of gaps to check.",
  },
  {
    place: "5 Nugent Terrace · Flats 1–3",
    title: "Making sense of the service charges",
    recent: "I've read the apportionment terms in all three leases.",
    current: "I'm comparing the stated shares with the latest schedule.",
    next: "I shall set out any differences, with the clauses beside them.",
  },
  {
    place: "Stanley House · Communal areas",
    title: "Preparing the maintenance instruction",
    recent: "I've gathered the reported repairs and the contractor's quotation.",
    current: "I'm checking the proposed work against the outstanding repairs.",
    next: "I shall bring you the draft instruction before it goes out.",
  },
];

const completed = [
  {
    place: "Stanley House · Flat 3",
    title: "The lease, made clear",
    outcome: "I've prepared a cited summary of the rent, key dates and obligations. The answers are now together in one place.",
    when: "Today, 09:15",
  },
  {
    place: "Across your portfolio",
    title: "Your key dates are together",
    outcome: "I've gathered the review, break and expiry dates from your read papers, so you can see what is coming up.",
    when: "Yesterday, 16:40",
  },
  {
    place: "5 Nugent Terrace · Flat 2",
    title: "The deposit record is matched",
    outcome: "I've linked the protection certificate to the tenancy and noted the reference. You no longer need to search for it separately.",
    when: "Yesterday, 11:20",
  },
];

function SectionHeading({ id, title, count, icon: Icon }: {
  id: string;
  title: string;
  count: number;
  icon: typeof Hand;
}) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.6} />
      <h3 id={id} className="text-lg font-semibold text-foreground">{title}</h3>
      <span className="text-sm tabular-nums text-muted-foreground">{count}</span>
      <div className="ml-2 h-px flex-1 bg-border" aria-hidden="true" />
    </div>
  );
}

/** Illustrative work only: deliberately independent of action-card state and approvals. */
export function WorkOverview({ onClose, onGuide, sideLetterRequested = false, onJourneyBack, focusNeedsYou = 0 }: { onClose: () => void; onGuide: () => void; sideLetterRequested?: boolean; onJourneyBack?: () => void; focusNeedsYou?: number }) {
  const [journeyOpen, setJourneyOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [approval, setApproval] = useState<ApprovalStatus>("idle");
  const [openAtApproval, setOpenAtApproval] = useState(false);
  const awaitingApproval = approval === "awaiting";
  const visibleReviews = awaitingApproval ? [renewalApproval, ...reviews] : reviews;
  const visibleOngoing = awaitingApproval ? ongoing.filter((work) => work.place !== "Stanley House · Flat 6") : ongoing;
  const openJourney = (atApproval: boolean) => { setOpenAtApproval(atApproval); setJourneyOpen(true); };
  useEffect(() => {
    if (focusNeedsYou > 0 && !journeyOpen) {
      document.getElementById("work-needs-you")?.scrollIntoView({ block: "start" });
    }
  }, [focusNeedsYou, journeyOpen]);
  return (
    <div className="absolute inset-0 z-[1200] flex flex-col bg-background text-foreground" role="region" aria-label="What I've Done">
      <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-3 sm:px-8">
        <span className="text-xs text-muted-foreground">Your portfolio · Work overview</span>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close work overview" title="Close work overview" className="h-8 w-8 text-muted-foreground">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {journeyOpen ? <WorkJourney paused={paused} onPauseChange={setPaused} onBack={() => { setJourneyOpen(false); setOpenAtApproval(false); onJourneyBack?.(); }} onGuide={onGuide} sideLetterRequested={sideLetterRequested} approval={approval} onApprovalChange={setApproval} approvalOpen={openAtApproval} /> : <div className="hobson-scroll min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-5xl px-5 pb-16 pt-8 sm:px-8 sm:pt-10">
          <header className="mb-10">
            <h2 className="text-3xl font-semibold leading-tight">What I've Done</h2>
            <div className="mt-5 flex items-center gap-4">
              <img src={owlReading} alt="Hobson reading" className="h-16 w-16 shrink-0 object-contain" />
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
                I've finished <span className="font-medium text-foreground">3 pieces of work</span>, I'm looking after <span className="font-medium text-foreground">{visibleOngoing.length} more</span>, and there are <span className="font-medium text-foreground">{visibleReviews.length} things I'd like you to review.</span>
              </p>
            </div>
          </header>

          <section aria-labelledby="work-needs-you" className="mb-10">
            <SectionHeading id="work-needs-you" title="Needs you" count={visibleReviews.length} icon={Hand} />
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-4">
              {visibleReviews.map((work) => (
                <article key={work.title} className="flex min-w-0 flex-col rounded-lg border border-border border-t-2 border-t-ring bg-popover p-5">
                  <p className="text-xs text-muted-foreground">{work.place}</p>
                  <h4 className="mt-2 text-base font-semibold leading-snug">{work.place === "Stanley House · Flat 6" ? <Button variant="link" onClick={() => openJourney(true)} className="h-auto max-w-full justify-start gap-2 whitespace-normal p-0 text-left text-base font-semibold leading-snug">{work.title}<ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" /></Button> : work.title}</h4>
                  <p className="mb-5 mt-3 text-sm leading-relaxed text-muted-foreground">{work.prepared}</p>
                  <div className="mt-auto border-t border-border pt-4">
                    <p className="mb-2 flex items-center gap-2 text-xs font-medium text-foreground"><CornerDownRight className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />Your decision</p>
                    <p className="text-sm font-medium leading-relaxed">{work.decision}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="work-in-progress" className="mb-10">
            <SectionHeading id="work-in-progress" title="In progress" count={visibleOngoing.length} icon={CircleDot} />
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-x-6 gap-y-7">
              {visibleOngoing.map((work) => (
                <article key={work.title} className="min-w-0 border-b border-border pb-6">
                  <p className="text-xs text-muted-foreground">{work.place}</p>
                  <h4 className="mt-2 text-base font-semibold leading-snug">{work.place === "Stanley House · Flat 6" ? <Button variant="link" onClick={() => openJourney(false)} className="h-auto max-w-full justify-start gap-2 whitespace-normal p-0 text-left text-base font-semibold leading-snug">{work.title}<ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" /></Button> : work.title}</h4>
                  <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"><Check className="mt-1 h-3.5 w-3.5 shrink-0" aria-hidden="true" />{work.recent}</p>
                  <div className="my-4 border-l-2 border-ring bg-muted/50 px-3 py-3">
                    <p className="mb-1.5 text-xs font-medium text-muted-foreground">Now</p>
                    <p className="text-sm font-medium leading-relaxed">{work.current}</p>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground"><span className="mr-1 font-medium">Next</span> {work.next}</p>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="work-completed">
            <SectionHeading id="work-completed" title="Completed" count={completed.length} icon={CheckCheck} />
            <div className="divide-y divide-border">
              {completed.map((work) => (
                <article key={work.title} className="flex items-start gap-3 py-5 first:pt-0">
                  <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.6} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h4 className="text-sm font-semibold">{work.title}</h4>
                      <p className="text-xs text-muted-foreground">{work.when}</p>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{work.place}</p>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{work.outcome}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>}
    </div>
  );
}