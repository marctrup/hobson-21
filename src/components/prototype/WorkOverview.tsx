import { useEffect, useState } from "react";
import { Activity as ActivityIcon, ArrowUpRight, Check, CheckCheck, CircleDot, CircleHelp, Clock, Hand, Pause, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import owlReading from "@/assets/prototype/owl-reading.png";
import { WorkJourney, type ApprovalStatus } from "./WorkJourney";
import { RoofLeakJourney } from "./RoofLeakJourney";
import { roofInsurerDecision, roofLeakWork, type RoofActivityId } from "./roofLeakWork";
import { createRoofWork, endRoofWork, restartRoofWork, roofAttention, type RoofWorkState } from "./roofWorkLifecycle";
import { initialRoofGuidance, LEASE_PLANS_INSTRUCTION, type RoofGuidanceState, type RoofGuideScope, type RoofHelpState } from "./roofGuidance";

const roofHelpDecision = {
  place: "Burlington Gardens — Roof leak",
  title: "Clarify responsibility for the shopfront roof",
  why: "I haven't been able to establish which part of the roof the lease covers.",
  decision: "I have a suggested next step.",
};

type ActivityState = "working" | "waiting" | "needs-you" | "on-hold" | "needs-clarification";
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
    place: roofLeakWork.place,
    title: roofLeakWork.title,
    aim: roofLeakWork.aim,
    activities: roofLeakWork.activities.map(({ label, state }) => ({ label, state })),
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

const stateIcon: Record<ActivityState, { icon: typeof Clock; label: string }> = {
  working: { icon: ActivityIcon, label: "Working" },
  waiting: { icon: Clock, label: "Waiting" },
  "needs-you": { icon: Hand, label: "Needs you" },
  "on-hold": { icon: Pause, label: "On hold at your request" },
  "needs-clarification": { icon: CircleHelp, label: "Needs clarification" },
};

function ActivityLine({ activity }: { activity: Activity }) {
  const { icon: Icon, label } = stateIcon[activity.state];
  return (
    <li className="flex items-start gap-2 text-sm leading-relaxed">
      <Icon aria-hidden="true" className={`mt-1 h-3.5 w-3.5 shrink-0 ${activity.state === "needs-you" ? "text-ring" : "text-muted-foreground"}`} strokeWidth={1.6} />
      <span className={activity.state === "needs-you" ? "font-medium text-foreground" : "text-muted-foreground"}>{activity.label} <span className="text-xs font-normal text-muted-foreground">— {label}</span></span>
    </li>
  );
}

/** Illustrative work only: deliberately independent of action-card state and approvals. */
export function WorkOverview({ onClose, onGuide, sideLetterRequested = false, onJourneyBack, focusNeedsYou = 0, roofGuidance: suppliedRoofGuidance = initialRoofGuidance, roofWork, onRoofWorkChange }: { onClose: () => void; onGuide: (scope: "renewal" | RoofGuideScope, suggestion?: string) => void; sideLetterRequested?: boolean; onJourneyBack?: () => void; focusNeedsYou?: number; roofGuidance?: RoofGuidanceState; roofWork?: RoofWorkState; onRoofWorkChange?: (work: RoofWorkState) => void }) {
  const [journey, setJourney] = useState<"renewal" | "roof" | null>(null);
  const [paused, setPaused] = useState(false);
  const [approval, setApproval] = useState<ApprovalStatus>("idle");
  const [openAtApproval, setOpenAtApproval] = useState(false);
  const awaitingApproval = approval === "awaiting";
  const sentApproval = approval === "sent";
  const [roofActivity, setRoofActivity] = useState<RoofActivityId>("lease");
  const [localRoofWork, setLocalRoofWork] = useState(createRoofWork);
  const storedRoofWork = roofWork ?? localRoofWork;
  const roofGuidance = roofWork || storedRoofWork.number > 1 ? storedRoofWork.guidance : suppliedRoofGuidance;
  const currentRoofWork = { ...storedRoofWork, guidance: roofGuidance };
  const updateRoofWork = (next: RoofWorkState) => { if (onRoofWorkChange) onRoofWorkChange(next); else setLocalRoofWork(next); };
  const roofHelp = currentRoofWork.help;
  const setRoofHelp = (help: RoofHelpState) => { if (!currentRoofWork.ended) updateRoofWork({ ...currentRoofWork, help }); };
  const { help: helpAwaitingDirection, insurer: insurerActionable } = roofAttention(currentRoofWork);
  const activeWork = lookingAfter.filter(work => work.place !== roofLeakWork.place || !currentRoofWork.ended);
  const visibleDecisions = [
    ...(awaitingApproval ? [renewalDecision] : []),
    ...(helpAwaitingDirection ? [roofHelpDecision] : []),
    ...(insurerActionable ? [roofInsurerDecision] : []),
    ...decisions,
  ];
  const openJourney = (atApproval: boolean) => { setOpenAtApproval(atApproval); setJourney("renewal"); };
  const openRoofJourney = (activity: RoofActivityId) => { setRoofActivity(activity); setJourney("roof"); };
  const closeJourney = () => { setJourney(null); setOpenAtApproval(false); onJourneyBack?.(); };
  useEffect(() => {
    if (focusNeedsYou > 0 && !journey) {
      document.getElementById("work-needs-you")?.scrollIntoView({ block: "start" });
    }
  }, [focusNeedsYou, journey]);

  const activitiesFor = (work: (typeof lookingAfter)[number]): Activity[] => {
    if (work.place === roofLeakWork.place) {
      return work.activities.map((activity) =>
        currentRoofWork.number > 1 && activity.label !== "Reviewing the lease"
          ? { ...activity, label: activity.label === "Contractor inspection" ? "Contractor inspection — no new request" : "Insurer notification — not prepared", state: "waiting" as ActivityState }
          :         activity.label === "Contact the insurer" && roofGuidance.contactOnHold
          ? { ...activity, state: "on-hold" as ActivityState }
          : activity.label === "Reviewing the lease" && roofHelp.shown
            ? { ...activity, state: "needs-clarification" as ActivityState }
            : activity,
      );
    }
    if (work.place !== "Stanley House · Flat 6") return work.activities;
    if (awaitingApproval) return [...work.activities, { label: "Renewal email — your approval needed", state: "needs-you" }];
    if (sentApproval) return [...work.activities, { label: "Renewal email sent — awaiting the tenant's response", state: "waiting" }];
    return work.activities;
  };

  return (
    <div className="absolute inset-0 z-[1200] flex flex-col bg-background text-foreground" role="region" aria-label="What I'm Up To">
      <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-3 sm:px-8">
        <span className="text-xs text-muted-foreground">Your portfolio · Work overview</span>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close work overview" title="Close work overview" className="h-8 w-8 text-muted-foreground">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {journey === "renewal" ? <WorkJourney paused={paused} onPauseChange={setPaused} onBack={closeJourney} onGuide={() => onGuide("renewal")} sideLetterRequested={sideLetterRequested} approval={approval} onApprovalChange={setApproval} approvalOpen={openAtApproval} /> : journey === "roof" ? <RoofLeakJourney key={currentRoofWork.number} work={currentRoofWork} onEnd={() => updateRoofWork(endRoofWork(currentRoofWork))} onRestart={() => updateRoofWork(restartRoofWork(currentRoofWork))} paused={currentRoofWork.paused} onPauseChange={(paused) => { if (!currentRoofWork.ended) updateRoofWork({ ...currentRoofWork, paused }); }} onBack={closeJourney} onGuide={(scope) => { if (!currentRoofWork.ended) onGuide(scope, scope === "lease" && roofHelp.shown ? LEASE_PLANS_INSTRUCTION : undefined); }} initialActivity={roofActivity} guidance={roofGuidance} help={roofHelp} onHelpChange={setRoofHelp} /> : <div className="hobson-scroll min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-5xl px-5 pb-16 pt-8 sm:px-8 sm:pt-10">
          <header className="mb-10">
            <h2 className="text-3xl font-semibold leading-tight">What I'm Up To</h2>
            <div className="mt-5 flex items-center gap-4">
              <img src={owlReading} alt="Hobson reading" className="h-16 w-16 shrink-0 object-contain" />
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
                I've finished <span className="font-medium text-foreground">3 pieces of work</span>, I'm looking after <span className="font-medium text-foreground">{activeWork.length} more</span>, and there are <span className="font-medium text-foreground">{visibleDecisions.length} things I'd like you to review.</span>
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
                  {item.title === roofHelpDecision.title
                    ? <Button variant="outline" size="sm" onClick={() => openRoofJourney("lease")} className="shrink-0 gap-2">Review suggestion<ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /></Button>
                    : item.place === "Stanley House · Flat 6"
                    ? <Button variant="outline" size="sm" onClick={() => openJourney(true)} className="shrink-0 gap-2">Review decision<ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /></Button>
                    : item.place === roofLeakWork.place
                      ? <Button variant="outline" size="sm" onClick={() => openRoofJourney("insurer")} className="shrink-0 gap-2">Review decision<ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /></Button>
                      : <Button variant="ghost" size="sm" className="shrink-0 gap-2 text-muted-foreground" disabled>Review decision</Button>}
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="work-looking-after" className="mb-10">
            <SectionHeading id="work-looking-after" title="What I'm looking after" count={activeWork.length} icon={CircleDot} />
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-x-8 gap-y-8">
              {activeWork.map((work) => (
                <article key={work.title} className="min-w-0 border-b border-border pb-6">
                  <p className="text-xs text-muted-foreground">{work.place}</p>
                  <h4 className="mt-2 text-base font-semibold leading-snug">{work.place === "Stanley House · Flat 6" ? <Button variant="link" onClick={() => openJourney(false)} className="h-auto max-w-full justify-start gap-2 whitespace-normal p-0 text-left text-base font-semibold leading-snug">{work.title}<ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" /></Button> : work.place === roofLeakWork.place ? <Button variant="link" onClick={() => openRoofJourney("lease")} className="h-auto max-w-full justify-start gap-2 whitespace-normal p-0 text-left text-base font-semibold leading-snug">{work.title}<ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" /></Button> : work.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{work.aim}</p>
                  <ul className="mt-3 space-y-1.5">
                    {activitiesFor(work).map((activity) => <ActivityLine key={activity.label} activity={activity} />)}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          {currentRoofWork.ended && <section aria-label="Ended work" className="mb-10 border-t border-border pt-5"><h3 className="text-sm font-semibold text-muted-foreground">Ended work</h3><p className="mt-3 text-xs text-muted-foreground">Burlington Gardens · Ended by you</p><Button variant="link" onClick={() => openRoofJourney("lease")} className="mt-1 h-auto max-w-full gap-2 whitespace-normal p-0 text-left text-sm">Investigating the roof leak<ArrowUpRight className="h-3.5 w-3.5" /></Button><p className="mt-2 text-sm text-muted-foreground">The record remains available. No further steps will be taken.</p></section>}

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
