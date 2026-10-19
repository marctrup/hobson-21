import { useEffect, useState } from "react";
import { ArrowUpRight, Check, CheckCheck, CircleDot, Hand, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import owlReading from "@/assets/prototype/owl-reading.png";
import { WorkJourney, type ApprovalStatus } from "./WorkJourney";
import { RoofLeakJourney } from "./RoofLeakJourney";

type ActivityState = "working" | "waiting" | "needs-you";
type Activity = { label: string; state: ActivityState };

const renewalDecision = {
  place: "Stanley House · Flat 6",
  title: "Getting the tenancy renewal ready",
  decision: "May I send the renewal email to the tenant?",
  why: "I've prepared an email asking the tenant to discuss the tenancy renewal. It proposes no terms, so I'd like your approval before anything is sent.",
};

const decisions = [
  {
    place: "Stanley House · Flat 8",
    title: "Rent review",
    decision: "Would you like me to use these comparables to prepare the proposed rent?",
    why: "I've reviewed the lease and comparable rents. I'd like you to check the proposed next step.",
  },
  {
    place: "5 Nugent Terrace · Shop",
    title: "An assessor for the new EPC",
    decision: "Please confirm the assessor and the instruction before anything is sent.",
    why: "I've checked the existing certificate and prepared an instruction for your usual assessor.",
  },
];

const lookingAfter: { place: string; title: string; aim: string; activities: Activity[] }[] = [
  {
    place: "Burlington Gardens",
    title: "Investigating the roof leak",
    aim: "I'm investigating the source of the leak, checking responsibility and arranging the next steps.",
    activities: [
      { label: "Reviewing the lease", state: "working" },
      { label: "Contractor inspection", state: "waiting" },
      { label: "Contact the insurer", state: "needs-you" },
    ],
  },
  {
    place: "Stanley House · Flat 6",
    title: "Getting the tenancy renewal ready",
    aim: "Confirm the current tenancy position and prepare a renewal summary for your review.",
    activities: [
      { label: "Tenancy end date confirmed and renewal terms read", state: "waiting" },
      { label: "Checking the rent and tenancy history", state: "working" },
    ],
  },
  {
    place: "Across your portfolio",
    title: "Putting the compliance papers in order",
    aim: "Match every certificate to its unit and bring you a short list of gaps.",
    activities: [
      { label: "Gas safety certificates matched to their units", state: "waiting" },
      { label: "Checking which certificates are missing or out of date", state: "working" },
    ],
  },
  {
    place: "5 Nugent Terrace · Flats 1–3",
    title: "Making sense of the service charges",
    aim: "Set out any differences between the leases and the latest schedule, with the clauses beside them.",
    activities: [
      { label: "Apportionment terms read in all three leases", state: "waiting" },
      { label: "Comparing the stated shares with the latest schedule", state: "working" },
    ],
  },
  {
    place: "Stanley House · Communal areas",
    title: "Preparing the maintenance instruction",
    aim: "Bring you the draft instruction before anything goes to the contractor.",
    activities: [
      { label: "Reported repairs and the contractor's quotation gathered", state: "waiting" },
      { label: "Checking the proposed work against the outstanding repairs", state: "working" },
    ],
  },
];

const accomplished = [
  {
    place: "Stanley House · Flat 3",
    title: "The lease, made clear",
    outcome: "I've prepared a cited summary of the rent, key dates and obligations. The answers are now together in one place.",
    when: "Today, 09:15",
  },
  {
    place: "Across your portfolio",
    title: "Your key dates are together",
    outcome: "I've brought together the relevant review, break and expiry dates from your read papers, so you can see what is coming up.",
    when: "Yesterday, 16:40",
  },
  {
    place: "5 Nugent Terrace · Flat 2",
    title: "The deposit record is matched",
    outcome: "I've linked the protection certificate to the tenancy and noted the reference. You no longer need to search for it separately.",
    when: "Yesterday, 11:20",
  },
];

function SectionHeading({ id, title, count, icon: Icon, quiet = false }: {
  id: string;
  title: string;
  count: number;
  icon: typeof Hand;
  quiet?: boolean;
}) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.6} />
      <h3 id={id} className={`text-lg font-semibold ${quiet ? "text-muted-foreground" : "text-foreground"}`}>{title}</h3>
      <span className="text-sm tabular-nums text-muted-foreground">{count}</span>
      <div className="ml-2 h-px flex-1 bg-border" aria-hidden="true" />
    </div>
  );
}

function ActivityLine({ activity }: { activity: Activity }) {
  return (
    <li className="flex items-start gap-2 text-sm leading-relaxed">
      <span aria-hidden="true" className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${activity.state === "working" ? "bg-ring" : activity.state === "needs-you" ? "border border-ring bg-background" : "bg-muted-foreground/50"}`} />
      <span className={activity.state === "needs-you" ? "font-medium text-foreground" : "text-muted-foreground"}>{activity.label}</span>
    </li>
  );
}

/** Illustrative work only: deliberately independent of action-card state and approvals. */
export function WorkOverview({ onClose, onGuide, sideLetterRequested = false, onJourneyBack, focusNeedsYou = 0 }: { onClose: () => void; onGuide: () => void; sideLetterRequested?: boolean; onJourneyBack?: () => void; focusNeedsYou?: number }) {
  const [journey, setJourney] = useState<"renewal" | "roof" | null>(null);
  const [paused, setPaused] = useState(false);
  const [approval, setApproval] = useState<ApprovalStatus>("idle");
  const [openAtApproval, setOpenAtApproval] = useState(false);
  const awaitingApproval = approval === "awaiting";
  const sentApproval = approval === "sent";
  const visibleDecisions = awaitingApproval ? [renewalDecision, ...decisions] : decisions;
  const openJourney = (atApproval: boolean) => { setOpenAtApproval(atApproval); setJourney("renewal"); };
  const closeJourney = () => { setJourney(null); setOpenAtApproval(false); onJourneyBack?.(); };
  useEffect(() => {
    if (focusNeedsYou > 0 && !journey) {
      document.getElementById("work-needs-you")?.scrollIntoView({ block: "start" });
    }
  }, [focusNeedsYou, journey]);

  const activitiesFor = (work: (typeof lookingAfter)[number]): Activity[] => {
    if (work.place !== "Stanley House · Flat 6") return work.activities;
    if (awaitingApproval) return [...work.activities, { label: "Renewal email — your approval needed", state: "needs-you" }];
    if (sentApproval) return [...work.activities, { label: "Renewal email sent — awaiting the tenant's response", state: "waiting" }];
    return work.activities;
  };

  return (
    <div className="absolute inset-0 z-[1200] flex flex-col bg-background text-foreground" role="region" aria-label="What I've Done">
      <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-3 sm:px-8">
        <span className="text-xs text-muted-foreground">Your portfolio · Work overview</span>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close work overview" title="Close work overview" className="h-8 w-8 text-muted-foreground">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {journey === "renewal" ? <WorkJourney paused={paused} onPauseChange={setPaused} onBack={closeJourney} onGuide={onGuide} sideLetterRequested={sideLetterRequested} approval={approval} onApprovalChange={setApproval} approvalOpen={openAtApproval} /> : journey === "roof" ? <RoofLeakJourney paused={paused} onPauseChange={setPaused} onBack={closeJourney} onGuide={onGuide} /> : <div className="hobson-scroll min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-5xl px-5 pb-16 pt-8 sm:px-8 sm:pt-10">
          <header className="mb-10">
            <h2 className="text-3xl font-semibold leading-tight">What I've Done</h2>
            <div className="mt-5 flex items-center gap-4">
              <img src={owlReading} alt="Hobson reading" className="h-16 w-16 shrink-0 object-contain" />
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
                I've finished <span className="font-medium text-foreground">3 pieces of work</span>, I'm looking after <span className="font-medium text-foreground">5 more</span>, and there are <span className="font-medium text-foreground">{visibleDecisions.length} things I'd like you to review.</span>
              </p>
            </div>
          </header>

          <section aria-labelledby="work-needs-you" className="mb-10">
            <SectionHeading id="work-needs-you" title="Needs you" count={visibleDecisions.length} icon={Hand} />
            <div className="divide-y divide-border border-y border-border">
              {visibleDecisions.map((item) => (
                <article key={item.title} className="flex flex-wrap items-center gap-x-6 gap-y-2 py-4">
                  <div className="min-w-0 flex-1 basis-72">
                    <p className="text-xs text-muted-foreground">{item.place}</p>
                    <h4 className="mt-1 text-sm font-semibold leading-snug">{item.title}</h4>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.why}</p>
                    <p className="mt-1.5 text-sm font-medium leading-relaxed">{item.decision}</p>
                  </div>
                  {item.place === "Stanley House · Flat 6"
                    ? <Button variant="outline" size="sm" onClick={() => openJourney(true)} className="shrink-0 gap-2">Review decision<ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /></Button>
                    : <Button variant="ghost" size="sm" className="shrink-0 gap-2 text-muted-foreground" disabled>Review decision</Button>}
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="work-looking-after" className="mb-10">
            <SectionHeading id="work-looking-after" title="What I'm looking after" count={lookingAfter.length} icon={CircleDot} />
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-x-8 gap-y-8">
              {lookingAfter.map((work) => (
                <article key={work.title} className="min-w-0 border-b border-border pb-6">
                  <p className="text-xs text-muted-foreground">{work.place}</p>
                  <h4 className="mt-2 text-base font-semibold leading-snug">{work.place === "Stanley House · Flat 6" ? <Button variant="link" onClick={() => openJourney(false)} className="h-auto max-w-full justify-start gap-2 whitespace-normal p-0 text-left text-base font-semibold leading-snug">{work.title}<ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" /></Button> : work.place === "Burlington Gardens" ? <Button variant="link" onClick={() => setJourney("roof")} className="h-auto max-w-full justify-start gap-2 whitespace-normal p-0 text-left text-base font-semibold leading-snug">{work.title}<ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" /></Button> : work.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{work.aim}</p>
                  <ul className="mt-3 space-y-1.5">
                    {activitiesFor(work).map((activity) => <ActivityLine key={activity.label} activity={activity} />)}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="work-accomplished">
            <SectionHeading id="work-accomplished" title="What I've accomplished" count={accomplished.length} icon={CheckCheck} quiet />
            <div className="divide-y divide-border">
              {accomplished.map((work) => (
                <article key={work.title} className="flex items-start gap-3 py-5 first:pt-0">
                  <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.6} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h4 className="text-sm font-semibold text-muted-foreground">{work.title}</h4>
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
