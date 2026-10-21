import type { PaperPlace, PaperPlacementAction, SuppliedPaper } from "./workGuidance";
import { useEffect, useState } from "react";
import { ArrowUpRight, Check, Hand, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import owlReading from "@/assets/prototype/owl-reading.png";
import { WorkJourney, type ApprovalStatus } from "./WorkJourney";
import { RoofLeakJourney } from "./RoofLeakJourney";
import { CompletedLeaseJourney } from "./CompletedLeaseJourney";
import { roofInsurerDecision, roofLeakWork, type RoofActivityId } from "./roofLeakWork";
import { createRoofWork, endRoofWork, restartRoofWork, roofAttention, type RoofWorkState } from "./roofWorkLifecycle";
import { accomplished, decisions, lookingAfter } from "./workOverviewData";
import { initialRoofGuidance, LEASE_PLANS_INSTRUCTION, type RoofGuidanceState, type RoofGuideScope, type RoofHelpState } from "./roofGuidance";

const roofHelpDecision = {
  place: "Burlington Gardens — Roof leak",
  title: "Clarify responsibility for the shopfront roof",
  why: "I haven't been able to establish which part of the roof the lease covers.",
  decision: "I have a suggested next step.",
};

const renewalDecision = {
  place: "Stanley House · Flat 6",
  title: "Getting the tenancy renewal ready",
  decision: "May I send the renewal email to the tenant?",
  why: "I've prepared an email asking the tenant to discuss the tenancy renewal. It proposes no terms, so I'd like your approval before anything is sent.",
};

type OverviewView = "needs-you" | "all" | "completed";

type NeedsYouItem = {
  key: string;
  place: string;
  jobTitle: string;
  matter: string;
  why: string;
  decision: string;
  actionLabel: string;
  open?: () => void;
};

const INITIAL_ROWS = 10;

const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);

/** Illustrative work only: deliberately independent of action-card state and approvals. */
export function WorkOverview({ onClose, onGuide, sideLetterRequested = false, suppliedPapers = [], paperPlaces = [], onPaperPlacement, onJourneyBack, focusNeedsYou = 0, roofGuidance: suppliedRoofGuidance = initialRoofGuidance, roofWork, onRoofWorkChange }: { onClose: () => void; onGuide: (scope: "renewal" | RoofGuideScope, suggestion?: string) => void; sideLetterRequested?: boolean; suppliedPapers?: SuppliedPaper[]; paperPlaces?: PaperPlace[]; onPaperPlacement?: (id: string, action: PaperPlacementAction) => void; onJourneyBack?: () => void; focusNeedsYou?: number; roofGuidance?: RoofGuidanceState; roofWork?: RoofWorkState; onRoofWorkChange?: (work: RoofWorkState) => void }) {
  const [journey, setJourney] = useState<"renewal" | "roof" | "completed-lease" | null>(null);
  const [paused, setPaused] = useState(false);
  const [approval, setApproval] = useState<ApprovalStatus>("idle");
  const [openAtApproval, setOpenAtApproval] = useState(false);
  const awaitingApproval = approval === "awaiting";
  const sentApproval = approval === "sent";
  const [roofActivity, setRoofActivity] = useState<RoofActivityId>("lease");
  const [roofEntry, setRoofEntry] = useState<"briefing" | "detail">("briefing");
  const [view, setView] = useState<OverviewView>("all");
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [localRoofWork, setLocalRoofWork] = useState(createRoofWork);
  const storedRoofWork = roofWork ?? localRoofWork;
  const roofGuidance = roofWork || storedRoofWork.number > 1 ? storedRoofWork.guidance : suppliedRoofGuidance;
  const currentRoofWork = { ...storedRoofWork, guidance: roofGuidance };
  const updateRoofWork = (next: RoofWorkState) => { if (onRoofWorkChange) onRoofWorkChange(next); else setLocalRoofWork(next); };
  const roofHelp = currentRoofWork.help;
  const setRoofHelp = (help: RoofHelpState) => { if (!currentRoofWork.ended) updateRoofWork({ ...currentRoofWork, help }); };
  const { help: helpAwaitingDirection, insurer: insurerActionable } = roofAttention(currentRoofWork);

  const openJourney = (atApproval: boolean) => { setOpenAtApproval(atApproval); setJourney("renewal"); };
  const openRoofJourney = (activity: RoofActivityId, entry: "briefing" | "detail" = "briefing") => { setRoofActivity(activity); setRoofEntry(entry); setJourney("roof"); };
  const closeJourney = () => { setJourney(null); setOpenAtApproval(false); onJourneyBack?.(); };
  useEffect(() => {
    if (focusNeedsYou > 0 && !journey) setView("needs-you");
  }, [focusNeedsYou, journey]);

  // One collection of jobs; the three views are different ways of looking at the same records.
  const activeWork = lookingAfter.filter(work => work.place !== roofLeakWork.place || !currentRoofWork.ended);

  const needsYouItems: NeedsYouItem[] = [
    ...(awaitingApproval ? [{ key: "renewal", place: renewalDecision.place, jobTitle: renewalDecision.title, matter: "Renewal email", why: renewalDecision.why, decision: renewalDecision.decision, actionLabel: "Review decision", open: () => openJourney(true) }] : []),
    ...(helpAwaitingDirection ? [{ key: "roof-help", place: roofHelpDecision.place, jobTitle: roofLeakWork.title, matter: roofHelpDecision.title, why: roofHelpDecision.why, decision: roofHelpDecision.decision, actionLabel: "Review suggestion", open: () => openRoofJourney("lease", "detail") }] : []),
    ...(insurerActionable ? [{ key: "roof-insurer", place: roofInsurerDecision.place, jobTitle: roofLeakWork.title, matter: roofInsurerDecision.title, why: roofInsurerDecision.why, decision: roofInsurerDecision.decision, actionLabel: "Review notification", open: () => openRoofJourney("insurer", "detail") }] : []),
    ...decisions.map((item) => ({
      key: item.place,
      place: item.place,
      jobTitle: lookingAfter.find((work) => work.place === item.place)?.title ?? item.title,
      matter: item.title,
      why: item.why,
      decision: item.decision,
      actionLabel: item.place === "Stanley House · Flat 8" ? "Review proposed rent" : "Review assessor instruction",
    })),
  ];

  const attentionFor = (work: (typeof lookingAfter)[number]): string | null => {
    if (work.place === roofLeakWork.place) {
      if (insurerActionable) return "Needs you — Insurer notification";
      if (helpAwaitingDirection) return "Needs you — Responsibility question";
      if (roofGuidance.contactOnHold && !currentRoofWork.insurerSent) return "On hold at your request";
      return null;
    }
    if (work.place === "Stanley House · Flat 6") return awaitingApproval ? "Needs you — Renewal email" : null;
    if (work.place === "Stanley House · Flat 8") return "Needs you — Proposed rent";
    if (work.place === "5 Nugent Terrace · Shop") return "Needs you — Assessor instruction";
    return null;
  };

  const openWork = (work: (typeof lookingAfter)[number]) => {
    if (work.place === roofLeakWork.place) openRoofJourney("lease");
    else if (work.place === "Stanley House · Flat 6") openJourney(false);
  };
  const isOpenable = (work: (typeof lookingAfter)[number]) => work.place === roofLeakWork.place || work.place === "Stanley House · Flat 6";

  const matches = (text: string[]) => {
    const q = query.trim().toLowerCase();
    return !q || text.some((t) => t.toLowerCase().includes(q));
  };

  const filteredNeedsYou = needsYouItems.filter((item) => matches([item.place, item.jobTitle, item.decision]));
  const sortedWork = [...activeWork].sort((a, b) => Number(attentionFor(b) !== null) - Number(attentionFor(a) !== null));
  const filteredWork = sortedWork.filter((work) => matches([work.place, work.title, work.summary]));
  const filteredAccomplished = accomplished.filter((work) => matches([work.place, work.title, work.outcome]));

  const visibleWork = showAll ? filteredWork : filteredWork.slice(0, INITIAL_ROWS);
  const visibleNeedsYou = showAll ? filteredNeedsYou : filteredNeedsYou.slice(0, INITIAL_ROWS);
  const visibleAccomplished = showAll ? filteredAccomplished : filteredAccomplished.slice(0, INITIAL_ROWS);

  const tabs: { id: OverviewView; label: string; count: number }[] = [
    { id: "needs-you", label: "Needs you", count: needsYouItems.length },
    { id: "all", label: "All work", count: activeWork.length },
    { id: "completed", label: "Completed", count: accomplished.length },
  ];

  return (
    <div className="absolute inset-0 z-[1200] flex min-w-0 flex-col [container-type:inline-size] [container-name:work] [overflow-wrap:anywhere] bg-background text-foreground" role="region" aria-label="What I'm Up To">
      <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-3 [@container_work_(min-width:40rem)]:px-8">
        <span className="text-xs text-muted-foreground">Your portfolio · Work overview</span>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close work overview" title="Close work overview" className="h-8 w-8 text-muted-foreground">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {journey === "completed-lease" ? <CompletedLeaseJourney onBack={closeJourney} /> : journey === "renewal" ? <WorkJourney paused={paused} onPauseChange={setPaused} onBack={closeJourney} onGuide={() => onGuide("renewal")} sideLetterRequested={sideLetterRequested} suppliedPapers={suppliedPapers} paperPlaces={paperPlaces} onPaperPlacement={onPaperPlacement} approval={approval} onApprovalChange={setApproval} approvalOpen={openAtApproval} /> : journey === "roof" ? <RoofLeakJourney key={currentRoofWork.number} work={currentRoofWork} onEnd={() => updateRoofWork(endRoofWork(currentRoofWork))} onRestart={() => updateRoofWork(restartRoofWork(currentRoofWork))} paused={currentRoofWork.paused} onPauseChange={(paused) => { if (!currentRoofWork.ended) updateRoofWork({ ...currentRoofWork, paused }); }} onBack={closeJourney} onGuide={(scope) => { if (!currentRoofWork.ended) onGuide(scope, scope === "lease" && roofHelp.shown ? LEASE_PLANS_INSTRUCTION : undefined); }} initialActivity={roofActivity} initialView={roofEntry} guidance={roofGuidance} help={roofHelp} onHelpChange={setRoofHelp} onWorkUpdate={(next) => { if (!currentRoofWork.ended) updateRoofWork(next); }} /> : <div className="hobson-scroll min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-4xl px-3 pb-16 pt-8 [@container_work_(min-width:40rem)]:px-8 [@container_work_(min-width:40rem)]:pt-10">
          <header className="mb-8">
            <h2 className="text-3xl font-semibold leading-tight">What I'm Up To</h2>
            <div className="mt-5 flex items-center gap-3 [@container_work_(min-width:40rem)]:gap-4">
              <img src={owlReading} alt="Hobson reading" className="h-12 w-12 shrink-0 [@container_work_(min-width:40rem)]:h-16 [@container_work_(min-width:40rem)]:w-16 object-contain" />
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
                I'm looking after <span className="font-medium text-foreground">{activeWork.length} {plural(activeWork.length, "piece", "pieces")} of work</span>. <span className="font-medium text-foreground">{needsYouItems.length} {plural(needsYouItems.length, "decision needs", "decisions need")} your attention</span>, and I've completed <span className="font-medium text-foreground">{accomplished.length} {plural(accomplished.length, "piece", "pieces")} of work</span>.
              </p>
            </div>
          </header>

          <div role="tablist" aria-label="Work views" className="mb-5 flex items-center gap-1 border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={view === tab.id}
                onClick={() => { setView(tab.id); setShowAll(false); }}
                className={`-mb-px border-b-2 px-3 pb-2.5 pt-1 text-sm transition-colors ${view === tab.id ? "border-foreground font-medium text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
              >
                {tab.label} <span className="ml-1 tabular-nums text-xs text-muted-foreground">{tab.count}</span>
              </button>
            ))}
          </div>

          <div className="relative mb-6">
            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.6} />
            <input
              type="search"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setShowAll(false); }}
              placeholder="Find a job or place..."
              aria-label="Find a job or place"
              className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          {view === "needs-you" && (
            <section aria-label="Needs you">
              {visibleNeedsYou.length === 0 ? <p className="py-8 text-sm text-muted-foreground">{query ? "Nothing needing you matches that search." : "Nothing needs your attention just now."}</p> : (
                <div className="divide-y divide-border">
                  {visibleNeedsYou.map((item) => (
                    <article key={item.key} className="flex flex-wrap items-center gap-x-6 gap-y-2 py-4">
                      <div className="min-w-0 flex-1 basis-72">
                        <p className="text-xs text-muted-foreground">{item.place}</p>
                        <h3 className="mt-1 text-sm font-semibold leading-snug">{item.jobTitle}</h3>
                        <p className="mt-1 text-sm font-medium leading-snug">{item.matter}</p>
                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.why}</p>
                        <p className="mt-1.5 text-sm font-medium leading-relaxed">{item.decision}</p>
                      </div>
                      {item.open
                        ? <Button variant="outline" size="sm" onClick={item.open} className="shrink-0 gap-2">{item.actionLabel}<ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /></Button>
                        : <Button variant="ghost" size="sm" className="shrink-0 gap-2 text-muted-foreground" disabled>{item.actionLabel}</Button>}
                    </article>
                  ))}
                </div>
              )}
              {!showAll && filteredNeedsYou.length > INITIAL_ROWS && <Button variant="link" size="sm" onClick={() => setShowAll(true)} className="mt-2 h-auto p-0 text-sm">Show all {filteredNeedsYou.length}</Button>}
            </section>
          )}

          {view === "all" && (
            <section aria-label="All work">
              {visibleWork.length === 0 ? <p className="py-8 text-sm text-muted-foreground">No ongoing work matches that search.</p> : (
                <div className="divide-y divide-border">
                  {visibleWork.map((work) => {
                    const attention = attentionFor(work);
                    const openable = isOpenable(work);
                    return (
                      <article key={work.title} className="flex flex-wrap items-center gap-x-6 gap-y-1.5 py-4">
                        <div className="min-w-0 flex-1 basis-72">
                          <p className="text-xs text-muted-foreground">{work.place}</p>
                          <h3 className="mt-1 text-sm font-semibold leading-snug">
                            {openable
                              ? <Button variant="link" onClick={() => openWork(work)} className="h-auto max-w-full justify-start gap-2 whitespace-normal p-0 text-left text-sm font-semibold leading-snug">{work.title}<ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /></Button>
                              : work.title}
                          </h3>
                          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{work.summary}</p>
                        </div>
                        {attention && (
                          <p className={`flex shrink-0 items-center gap-1.5 text-xs ${attention.startsWith("Needs you") ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                            <Hand aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.6} />
                            {attention}
                          </p>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
              {!showAll && filteredWork.length > INITIAL_ROWS && <Button variant="link" size="sm" onClick={() => setShowAll(true)} className="mt-2 h-auto p-0 text-sm">Show all {filteredWork.length} jobs</Button>}

              {currentRoofWork.ended && (
                <section aria-label="Ended work" className="mt-8 border-t border-border pt-5">
                  <h3 className="text-sm font-semibold text-muted-foreground">Ended work</h3>
                  <p className="mt-3 text-xs text-muted-foreground">Burlington Gardens · Ended by you</p>
                  <Button variant="link" onClick={() => openRoofJourney("lease")} className="mt-1 h-auto max-w-full gap-2 whitespace-normal p-0 text-left text-sm">Investigating the roof leak<ArrowUpRight className="h-3.5 w-3.5" /></Button>
                  <p className="mt-2 text-sm text-muted-foreground">The record remains available. No further steps will be taken.</p>
                </section>
              )}
            </section>
          )}

          {view === "completed" && (
            <section aria-label="Completed">
              {visibleAccomplished.length === 0 ? <p className="py-8 text-sm text-muted-foreground">No completed work matches that search.</p> : (
                <div className="divide-y divide-border">
                  {visibleAccomplished.map((work) => (
                    <article key={work.title} className="flex items-start gap-3 py-5 first:pt-0">
                      <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.6} />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                          <h3 className="text-sm font-semibold text-muted-foreground">{work.place === "Stanley House · Flat 3" ? <Button variant="link" onClick={() => setJourney("completed-lease")} className="h-auto max-w-full whitespace-normal p-0 text-left text-sm">{work.title}</Button> : work.title}</h3>
                          <p className="text-xs text-muted-foreground">{work.when}</p>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{work.place}</p>
                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{work.outcome}</p>
                      </div>
                    </article>
                  ))}
                </div>
              )}
              {!showAll && filteredAccomplished.length > INITIAL_ROWS && <Button variant="link" size="sm" onClick={() => setShowAll(true)} className="mt-2 h-auto p-0 text-sm">Show all {filteredAccomplished.length}</Button>}
            </section>
          )}
        </div>
      </div>}
    </div>
  );
}
