import { JourneyNavigation } from "./JourneyNavigation";
import { RoofActivityJourney } from "./RoofActivityJourney";
import type { RoofEvidence } from "./roofActivityJourney";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, Check, ChevronDown, CircleHelp, FileText, Hand, HelpCircle, Mail, MessageCircle, Pause, Play, Undo2, X, MoreHorizontal } from "lucide-react";
import { DeskActionButton } from "./DeskActionButton";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { AlertDialog, AlertDialogPortal, AlertDialogOverlay, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { RoofAttemptHistory, RoofClosingSummary } from "./RoofAttemptHistory";
import { resetRoofDemo, sendInsurerNotification, type RoofWorkState } from "./roofWorkLifecycle";
import { INSURER_TO, INSURER_SUBJECT, INSURER_BODY, SURVEYOR_TO, SURVEYOR_SUBJECT, SURVEYOR_BODY } from "./roofDrafts";
import { Button } from "@/components/ui/button";
import { JobPapersMap } from "./JobPapersMap";
import owlReading from "@/assets/prototype/owl-reading.png";
import { roofLeakWork, roofSummary, type RoofActivityId, type RoofActivityState } from "./roofLeakWork";
import { LEASE_PLANS_INSTRUCTION, type RoofGuidanceState, type RoofGuideScope, type RoofHelpState } from "./roofGuidance";

type ActivityId = RoofActivityId;
type ActivityState = RoofActivityState;

const activities: { id: ActivityId; title: string; state: ActivityState; note: string }[] = roofLeakWork.activities;

function stateDot(state: ActivityState) {
  if (state === "working") return <span aria-hidden="true" className="h-2 w-2 rounded-full bg-ring" />;
  if (state === "needs-you") return <Hand aria-hidden="true" className="h-3.5 w-3.5 text-ring" />;
  return <span aria-hidden="true" className="h-2 w-2 rounded-full border border-muted-foreground" />;
}

const stateLabel: Record<ActivityState, string> = { working: "Working", waiting: "Waiting", "needs-you": "Needs you" };

/** Illustrative parallel-activities demonstration only — no real work, approvals or integrations. */
export function RoofLeakJourney({ paused, onPauseChange, onBack, onGuide, initialActivity = "lease", initialView = "briefing", guidance, help, onHelpChange, work, onEnd, onRestart, onWorkUpdate }: {
  work: RoofWorkState;
  onWorkUpdate: (work: RoofWorkState) => void;
  onEnd: () => void;
  onRestart: () => void;
  paused: boolean;
  onPauseChange: (paused: boolean) => void;
  onBack: () => void;
  onGuide: (scope: RoofGuideScope) => void;
  initialActivity?: ActivityId;
  /** "briefing" opens the calm job overview; "detail" opens the two-panel Work Surface at initialActivity. */
  initialView?: "briefing" | "detail";
  guidance: RoofGuidanceState;
  help: RoofHelpState;
  onHelpChange: (help: RoofHelpState) => void;
}) {
  const [selected, setSelected] = useState<ActivityId | "closing" | `done-${number}` | `previous-${number}`>(work.ended ? "closing" : initialActivity);
  const [briefing, setBriefing] = useState(initialView === "briefing" && !work.ended);
  const [evidence, setEvidence] = useState<RoofEvidence | null>(initialView === "detail" ? initialActivity === "insurer" ? "notification" : initialActivity === "lease" && help.shown ? "clarification" : null : null);
  useEffect(() => { if (work.ended) setSelected("closing"); }, [work.ended]);
  useEffect(() => { if (work.ended) setBriefing(false); }, [work.ended]);
  const completed = work.history;
  const [confirmation, setConfirmation] = useState<"end" | "restart" | null>(null);
  const previousAttempt = selected.startsWith("previous-") ? work.previous[Number(selected.slice(9))] : undefined;
  const endedAttempt = work.ended ? work.previous[work.previous.length - 1] : undefined;
  const recordedAttempt = previousAttempt ?? endedAttempt;
  const endedPosition = { lease: "Ended — Responsibility not established.", contractor: work.contractorRequestSent ? "Request previously sent — No response recorded." : "No new inspection requested.", insurer: work.insurerSent ? "Sent — awaiting response." : "Not sent." };
  const [paperOpen, setPaperOpen] = useState(false);
  const [insurerEditing, setInsurerEditing] = useState(false);
  const [insurerEditText, setInsurerEditText] = useState("");
  const [insurerNotice, setInsurerNotice] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const selectedActivity = activities.find((activity) => activity.id === selected);
  const selectedDone = typeof selected === "string" && selected.startsWith("done-") ? completed[Number(selected.slice(5))] : null;

  /** The calm opening briefing — every line is derived from the live illustrative state. */
  const doneItems = work.number > 1
    ? work.history.map((item) => item.label)
    : ["Received the report of the leak.", "Found the relevant Business Lease.", "Sent the contractor inspection request.", ...work.history.slice(3).map((item) => item.label)];
  const outstanding: { id: ActivityId; title: string; status: string }[] = [
    { id: "lease", title: "Establish repairing responsibility", status: help.shown ? "Needs your help — I can't establish whether the affected roof forms part of the tenant's premises." : "Reviewing the lease — responsibility not yet established." },
    { id: "contractor", title: "Contractor inspection", status: work.contractorRequestSent ? `Request sent — awaiting a response.${guidance.contactOnHold ? " Further contact is on hold at your request." : ""}` : "No inspection requested yet in this investigation." },
    { id: "insurer", title: "Contact the insurer", status: work.insurerSent ? "Sent — awaiting a response." : !work.insurerPrepared ? "No notification prepared yet." : guidance.contactOnHold ? "On hold at your request — the prepared notification has not been sent." : "Notification prepared but not sent — needs your approval." },
  ];
  const openActivity = (id: ActivityId) => { setSelected(id); setPaperOpen(false); setEvidence(null); setBriefing(false); };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto [@container_work_(min-width:48rem)]:overflow-hidden" role="region" aria-label="Roof leak investigation work journey">
      <header className="shrink-0 border-b border-border px-5 pb-5 pt-4 [@container_work_(min-width:40rem)]:px-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="mb-4 gap-2 px-0 text-muted-foreground"><ArrowLeft className="h-4 w-4" />Back to What I'm Up To</Button>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1 basis-64">
            <p className="mb-2 text-xs text-muted-foreground">Burlington Gardens</p>
            <h2 className="text-2xl font-semibold leading-tight">Investigating the roof leak</h2>
          </div>
          <div className="flex min-w-0 w-full flex-wrap items-center gap-2 [@container_work_(min-width:48rem)]:w-auto [@container_work_(min-width:48rem)]:shrink-0">
            <JobPapersMap job="roof" />
            {!work.ended && <><Button variant="secondary" size="sm" onClick={() => onGuide("overall")} className="gap-2"><MessageCircle className="h-4 w-4" />Guide Hobson</Button>
            <DropdownMenu.Root modal={false}><DropdownMenu.Trigger asChild><Button variant="ghost" size="icon" aria-label="More work options" title="More work options" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenu.Trigger><DropdownMenu.Portal><DropdownMenu.Content align="end" className="z-[1500] min-w-36 rounded-md border border-border bg-popover p-1 shadow-md"><DropdownMenu.Item asChild onSelect={() => onPauseChange(!paused)}><Button variant="ghost" size="sm" className="w-full justify-start gap-2">{paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}{paused ? "Resume work" : "Pause work"}</Button></DropdownMenu.Item><DropdownMenu.Item asChild onSelect={() => setConfirmation("end")}><Button variant="ghost" size="sm" className="w-full justify-start">End work</Button></DropdownMenu.Item></DropdownMenu.Content></DropdownMenu.Portal></DropdownMenu.Root></>}
            {work.ended && <Button variant="outline" size="sm" onClick={() => setConfirmation("restart")}>Start again</Button>}
          </div>
        </div>
        {!briefing && <div className="mt-3 flex items-center gap-3">
          <img src={owlReading} alt="Hobson reading" className="h-10 w-10 shrink-0 object-contain" />
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{work.ended ? "The papers, findings and earlier actions remain available below." : roofLeakWork.explanation}</p>
        </div>}
        {!briefing && !work.ended && <p className="mt-3 max-w-2xl text-sm leading-relaxed">{work.number > 1 ? "I've started a fresh investigation. I still have the lease, the tenant's report and the record of the contractor inspection request. I'll check the earlier findings before deciding what needs doing next. I won't repeat external actions without the required authority." : roofSummary(guidance)}</p>}
        <p role="status" className="mt-3 flex items-center gap-2 text-xs font-medium"><span className={`h-1.5 w-1.5 rounded-full ${paused || work.ended ? "bg-muted-foreground" : "bg-ring"}`} aria-hidden="true" />{work.ended ? "Ended by you" : paused ? "Work paused · What I've found is preserved" : "I'm working on this now"}</p>
      </header>
      <AlertDialog open={confirmation !== null} onOpenChange={(open) => { if (!open) setConfirmation(null); }}>
        <AlertDialogPortal><AlertDialogOverlay className="z-[1500] bg-background/80" /><AlertDialogPrimitive.Content className="fixed left-1/2 top-1/2 z-[1501] w-[calc(100%_-_2rem)] max-w-lg max-h-[85dvh] overflow-y-auto -translate-x-1/2 -translate-y-1/2 space-y-4 rounded-md border border-border bg-background p-4 [@container_work_(min-width:40rem)]:p-6 shadow-lg">
          <AlertDialogTitle>{confirmation === "end" ? "End this investigation?" : "Start a fresh investigation?"}</AlertDialogTitle>
          <AlertDialogDescription>{confirmation === "end" ? "I'll stop working on the roof leak investigation. Everything I've done will remain available, but I won't take any further steps." : "I can begin a fresh investigation using the papers and information already available. I'll review the earlier findings before deciding what needs to be done next. Your previous investigation will remain in the history."}</AlertDialogDescription>
          <AlertDialogFooter><AlertDialogCancel>{confirmation === "end" ? "Keep working" : "Cancel"}</AlertDialogCancel><AlertDialogAction onClick={() => { if (confirmation === "end") onEnd(); else onRestart(); setConfirmation(null); }}>{confirmation === "end" ? "End work" : "Start again"}</AlertDialogAction></AlertDialogFooter>
        </AlertDialogPrimitive.Content></AlertDialogPortal>
      </AlertDialog>

      <div className="hobson-scroll min-h-0 shrink-0 [@container_work_(min-width:48rem)]:flex-1 [@container_work_(min-width:48rem)]:overflow-y-auto">
        {briefing && !work.ended ? (
        <div className="mx-auto w-full max-w-3xl px-5 pb-12 pt-8 [@container_work_(min-width:40rem)]:px-8 [@container_work_(min-width:40rem)]:pt-10">
          {paused && <p role="status" className="mb-8 flex items-center gap-2 text-sm leading-relaxed text-muted-foreground"><Pause aria-hidden="true" className="h-3.5 w-3.5 shrink-0" strokeWidth={1.6} />I've paused this investigation at your request. What I've found is preserved.</p>}
          <section aria-labelledby="briefing-plan" className="mb-10">
            <h3 id="briefing-plan" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">The plan</h3>
            <p className="mt-3 max-w-xl text-lg leading-relaxed">Establish who's responsible for the affected roof, arrange an inspection and decide what needs to happen next.</p>
          </section>
          <section aria-labelledby="briefing-done" className="mb-10">
            <h3 id="briefing-done" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">What's been done</h3>
            {doneItems.length > 0 ? <ul className="mt-4 space-y-2.5">
              {doneItems.map((label) => <li key={label} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground"><Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.6} />{label}</li>)}
            </ul> : <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Nothing yet in this fresh investigation. The earlier attempt remains in the history.</p>}
          </section>
          <section aria-labelledby="briefing-left">
            <h3 id="briefing-left" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">What's left</h3>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">These can move forward in any order. Select one to see the detail.</p>
            <div className="mt-2 divide-y divide-border">
              {outstanding.map((item) => (
                <Button key={item.id} variant="ghost" onClick={() => openActivity(item.id)} className="h-auto w-full items-start justify-between gap-4 whitespace-normal rounded-none px-1 py-4 text-left">
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold leading-snug">{item.title}</span>
                    <span className="mt-1 block text-sm font-normal leading-relaxed text-muted-foreground">{item.status}</span>
                  </span>
                  <ArrowUpRight aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                </Button>
              ))}
            </div>
          </section>
        </div>
        ) : (
        <div className="grid grid-cols-1 items-stretch gap-3 p-3 [@container_work_(min-width:40rem)]:p-5 [@container_work_(min-width:48rem)]:min-h-full [@container_work_(min-width:48rem)]:grid-cols-[minmax(0,0.35fr)_minmax(0,0.65fr)] [@container_work_(min-width:48rem)]:gap-0">
          <JourneyNavigation label="The Journey" selectedTitle={selected === "closing" ? "Closing summary" : previousAttempt ? "Previous attempt" : selectedDone ? selectedDone.label : selectedActivity?.title}>
  
  
  
            {work.ended && <Button variant="ghost" size="sm" onClick={() => setSelected("closing")} aria-current={selected === "closing" ? "step" : undefined} className="mb-4 h-auto max-w-full whitespace-normal px-0 text-left text-xs text-muted-foreground">Closing summary</Button>}

            <p className="mb-2 text-xs font-medium text-muted-foreground">{work.ended ? "Where we stopped" : "Happening now"}</p>
            <div>
              {activities.map((activity) => (
                <Button key={activity.id} variant="ghost" aria-current={selected === activity.id ? "step" : undefined} onClick={() => { setSelected(activity.id); setPaperOpen(false); setEvidence(null); }} className={`mb-2 h-auto w-full items-start justify-start gap-2 rounded-md border px-2 py-3 text-left whitespace-normal ${selected === activity.id ? "border-border bg-card shadow-sm [@container_work_(min-width:48rem)]:w-[calc(100%+17px)] [@container_work_(min-width:48rem)]:max-w-none [@container_work_(min-width:48rem)]:rounded-r-none [@container_work_(min-width:48rem)]:border-r-card relative z-10" : "border-transparent hover:bg-background/60"}`}>
                  <span aria-hidden="true" className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">{!work.ended && activity.id === "lease" && help.shown ? <CircleHelp aria-hidden="true" className="h-3.5 w-3.5 text-foreground" strokeWidth={1.6} /> : stateDot(work.ended || (work.number > 1 && activity.id !== "lease") ? "waiting" : activity.id === "insurer" && (guidance.contactOnHold || work.insurerSent) ? "waiting" : activity.state)}</span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold leading-snug">{activity.title}</span>
                    <span className="mt-1 block text-xs font-normal leading-relaxed text-muted-foreground">{work.ended ? endedPosition[activity.id] : work.number > 1 && activity.id !== "lease" ? "Not started · Fresh approval required before any new contact." : activity.id === "lease" && help.shown ? <><span className="font-medium text-foreground">Needs clarification</span> · Unable to establish whether the affected roof forms part of the tenant's premises.</> : activity.id === "insurer" && work.insurerSent ? "Sent — awaiting response" : <>{activity.id === "insurer" && guidance.contactOnHold ? "On hold at your request" : stateLabel[activity.state]} · {activity.note}</>}</span>
                    {!work.ended && <>
                    {activity.id === "lease" && help.shown && help.choice === "enquiry" && <span className="mt-1 block text-xs font-normal leading-relaxed text-muted-foreground">Surveyor enquiry prepared — not sent.</span>}
                    {activity.id === "lease" && help.shown && help.choice === "unresolved" && <span className="mt-1 block text-xs font-normal leading-relaxed text-muted-foreground">Question left open for now.</span>}
                    {activity.id === "lease" && guidance.leasePlansRequested && <span className="mt-1 block text-xs font-normal leading-relaxed text-muted-foreground">Lease plans to be checked first.</span>}
                    {activity.id === "lease" && guidance.shopfrontRequested && <span className="mt-1 block text-xs font-normal leading-relaxed text-muted-foreground">Shopfront roof added to the review.</span>}
                    {activity.id === "contractor" && guidance.contactOnHold && <span className="mt-1 block text-xs font-normal leading-relaxed text-muted-foreground">Awaiting reply · Further contact on hold.</span>}
                    {activity.id === "contractor" && guidance.holdWasLifted && !guidance.contactOnHold && <span className="mt-1 block text-xs font-normal leading-relaxed text-muted-foreground">Further contact permitted again.</span>}
                    {activity.id === "insurer" && guidance.contactOnHold && <span className="mt-1 block text-xs font-normal leading-relaxed text-muted-foreground">Contact on hold at your request.</span>}
                    {activity.id === "insurer" && !work.insurerSent && guidance.holdWasLifted && !guidance.contactOnHold && <span className="mt-1 block text-xs font-normal leading-relaxed text-muted-foreground">Further contact permitted again · Approval still required.</span>}
                    </>}
                  </span>
                </Button>
              ))}
            </div>

            <div className="mt-6 border-t border-border pt-4">
              <Button variant="ghost" size="sm" onClick={() => setHistoryOpen(!historyOpen)} aria-expanded={historyOpen} aria-controls="roof-history" className="mb-2 h-auto gap-2 px-0 text-xs font-medium text-muted-foreground">
                What I've done
                <span className="tabular-nums">{completed.length + work.previous.length}</span>
                <ChevronDown aria-hidden="true" className={`h-3.5 w-3.5 transition-transform ${historyOpen ? "rotate-180" : ""}`} />
              </Button>
              {historyOpen && <div id="roof-history">
                {work.previous.map((attempt, index) => <Button key={attempt.number} variant="ghost" onClick={() => setSelected(`previous-${index}`)} className="mb-2 h-auto w-full flex-col items-start whitespace-normal text-left"><span className="text-sm">Previous attempt</span><span className="text-xs text-muted-foreground">Ended by you.</span></Button>)}
                {completed.map((item, index) => (
                  <Button key={item.label} variant="ghost" aria-current={selected === `done-${index}` ? "step" : undefined} onClick={() => { setSelected(`done-${index}`); setPaperOpen(false); }} className={`mb-1 h-auto w-full items-start justify-start gap-2 rounded-md border px-2 py-2 text-left whitespace-normal ${selected === `done-${index}` ? "border-border bg-card shadow-sm [@container_work_(min-width:48rem)]:w-[calc(100%+17px)] [@container_work_(min-width:48rem)]:max-w-none [@container_work_(min-width:48rem)]:rounded-r-none [@container_work_(min-width:48rem)]:border-r-card relative z-10" : "border-transparent hover:bg-background/60"}`}>
                    <Check aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" strokeWidth={1.6} />
                    <span className="min-w-0 text-sm font-normal leading-relaxed text-muted-foreground">{item.label}</span>
                  </Button>
                ))}
              </div>}
            </div>
          </JourneyNavigation>

          <section aria-labelledby="desk-heading" className="relative min-w-0 rounded-2xl border border-border bg-card px-5 py-5 shadow-sm [@container_work_(min-width:48rem)]:-ml-px [@container_work_(min-width:40rem)]:px-7">
            {!work.ended && <Button variant="ghost" size="sm" onClick={() => setBriefing(true)} className="mb-4 h-auto gap-2 px-0 text-xs text-muted-foreground"><ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />Back to job overview</Button>}
            <h3 id="desk-heading" className="mb-5 text-xs font-semibold text-muted-foreground">On Hobson's Desk</h3>
            <div key={selected}>
              {(!selectedActivity || work.ended || previousAttempt) && <h4 className="text-lg font-semibold leading-snug">{selected === "closing" ? "Investigation ended by you" : previousAttempt ? "Previous attempt" : selectedDone ? selectedDone.label : selectedActivity?.title}</h4>}

              {selected === "closing" && endedAttempt && <RoofClosingSummary attempt={endedAttempt} />}
              {selected !== "closing" && recordedAttempt && <RoofAttemptHistory key={selected} attempt={recordedAttempt} activity={work.ended && !previousAttempt ? selectedActivity?.id : undefined} doneIndex={work.ended && selectedDone ? Number(selected.slice(5)) : undefined} />}
              {!previousAttempt && !work.ended && <>
              {selectedDone && <>
                <p className="mt-2 flex items-center gap-2 text-xs font-medium text-muted-foreground"><Check className="h-3.5 w-3.5" aria-hidden="true" />Completed</p>
                <div className="mt-4 border-l-2 border-border pl-3">
                  <h5 className="text-xs font-semibold">Recorded outcome</h5>
                  <p className="mt-2 text-sm leading-relaxed">{selectedDone.outcome}</p>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-muted-foreground">This is part of the investigation's history. The current activities are above, under Happening now.</p>
              </>}

              {selectedActivity && <>
                <RoofActivityJourney activity={selectedActivity.id} work={{ ...work, paused, guidance, help }} onEvidence={(item) => { setEvidence(item); setPaperOpen(item === "paper"); }} />
                {selected === "lease" && !evidence && <div className="mt-4 flex flex-wrap gap-3">
                  <Button variant="ghost" size="sm" className="px-0 text-xs text-muted-foreground" onClick={() => onGuide("lease")}>Guide this activity</Button>
                  <Button variant="ghost" size="sm" className="px-0 text-xs text-muted-foreground" onClick={() => { onHelpChange({ ...help, shown: !help.shown }); setEvidence("clarification"); }}>{help.shown ? "Return to investigation" : "Preview needs help"}</Button>
                </div>}
                {evidence && <Button variant="ghost" size="sm" className="mt-5 px-0 text-xs text-muted-foreground" onClick={() => setEvidence(null)}>Hide supporting detail</Button>}
              </>}
              {selectedActivity && (evidence || (selected === "insurer" && !work.insurerPrepared)) && <div aria-label="Activity supporting detail" className="mt-4 border-t border-border pt-4">
              {selected === "lease" && <>
                {work.number > 1 && <div className="mt-4 space-y-4 border-y border-border py-4">
                  <div><h5 className="text-xs font-semibold">Information already available</h5><ul className="mt-2 space-y-1 text-sm leading-relaxed text-muted-foreground"><li>Tenant's report.</li><li>Business Lease.</li><li>Record of the previous contractor inspection request.</li></ul></div>
                  <div><h5 className="text-xs font-semibold">What I'm checking again</h5><ul className="mt-2 space-y-1 text-sm leading-relaxed text-muted-foreground"><li>The relevant repairing obligations.</li><li>Whether the earlier findings remain applicable.</li></ul></div>
                </div>}
                <article className="mt-4 border-y border-border py-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h5 className="flex items-center gap-2 text-sm font-semibold"><FileText className="h-4 w-4 text-muted-foreground" />Business Lease</h5>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${paused ? "bg-muted-foreground" : "bg-ring"}`} />{paused ? "Review paused" : "Reviewing"}</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">What I'm examining</p>
                </article>
                <div className="mt-5 border-l-2 border-ring pl-3">
                  <h5 className="text-xs font-semibold">What I'm trying to establish</h5>
                  <p className="mt-2 text-sm leading-relaxed">Who is responsible for repairing the affected roof?</p>
                </div>
                {!help.shown && <div className="mt-4 border-l-2 border-border pl-3">
                  <h5 className="text-xs font-semibold">Not yet established</h5>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">I haven't finished reviewing the relevant repairing obligations.</p>
                </div>}
                {help.shown && <section aria-label="Hobson needs your help" className="relative mt-5 rounded-md border border-border bg-muted/40 px-4 py-4">
                  <Button variant="ghost" size="icon" onClick={() => onHelpChange({ ...help, shown: false })} aria-label="Close this demonstration" title="Close this demonstration" className="absolute right-1.5 top-1.5 h-7 w-7 text-muted-foreground"><X className="h-4 w-4" aria-hidden="true" /></Button>
                  <h5 className="flex items-center gap-2 text-sm font-semibold"><CircleHelp className="h-4 w-4" aria-hidden="true" strokeWidth={1.6} />Hobson needs your help</h5>
                  <p className="mt-2 text-sm leading-relaxed">I've reviewed the relevant lease provisions, but I can't establish whether the roof above the shopfront forms part of the tenant's premises.</p>
                  <dl className="mt-4 space-y-3 text-sm">
                    <div><dt className="text-xs font-semibold">What I've established</dt><dd className="mt-1 leading-relaxed text-muted-foreground">The lease contains repairing obligations relevant to the premises.</dd></div>
                    <div><dt className="text-xs font-semibold">What I haven't established</dt><dd className="mt-1 leading-relaxed text-muted-foreground">I cannot confirm whether the affected shopfront roof falls within the tenant's premises.</dd></div>
                    <div><dt className="text-xs font-semibold">Why it matters</dt><dd className="mt-1 leading-relaxed text-muted-foreground">Without establishing which area the lease covers, I cannot reliably determine who is responsible for these repairs.</dd></div>
                  </dl>
                  <p className="mt-3 text-xs text-muted-foreground">Illustrative unresolved finding — not a legal conclusion.</p>
                </section>}
                {help.shown && help.choice !== "enquiry" && <div className="mt-4 border-l-2 border-ring pl-3">
                  <h5 className="text-xs font-semibold">What I suggest</h5>
                  <p className="mt-2 text-sm leading-relaxed">I suggest asking the surveyor to clarify whether the affected roof forms part of the tenant's premises. I can prepare the enquiry for your approval.</p>
                  {help.choice === "unresolved" && <p role="status" className="mt-3 text-sm leading-relaxed text-muted-foreground">I'll leave the responsibility question open for now and continue with the other parts of the investigation. The question remains open.</p>}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => onHelpChange({ ...help, choice: "enquiry" })}>Prepare the enquiry</Button>
                    <Button size="sm" variant="ghost" onClick={() => onGuide("lease")} className="gap-2"><MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />Guide Hobson</Button>
                    {help.choice !== "unresolved" && <Button size="sm" variant="ghost" onClick={() => onHelpChange({ ...help, choice: "unresolved" })} className="text-muted-foreground">Leave unresolved</Button>}
                  </div>
                </div>}
                {help.shown && help.choice === "enquiry" && <div className="mt-4">
                  <p role="status" className="text-sm font-semibold">Enquiry prepared — Not sent</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">The draft asks the surveyor to clarify which area the lease covers. The responsibility question stays open until that's established.</p>
                  <article aria-label="Draft surveyor enquiry preview" className="mt-3 rounded-md border border-border bg-popover px-4 py-4">
                    <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground"><Mail className="h-3.5 w-3.5" aria-hidden="true" />Draft enquiry · not yet sent</p>
                    <dl className="mt-3 space-y-2 text-sm">
                      <div className="flex gap-2"><dt className="w-16 shrink-0 text-xs text-muted-foreground">To</dt><dd className="min-w-0 break-words font-medium">{SURVEYOR_TO}</dd></div>
                      <div className="flex gap-2"><dt className="w-16 shrink-0 text-xs text-muted-foreground">Subject</dt><dd className="min-w-0 break-words font-medium">{SURVEYOR_SUBJECT}</dd></div>
                    </dl>
                    <blockquote className="mt-4 whitespace-pre-line border-t border-border pt-4 text-sm leading-relaxed">{SURVEYOR_BODY}</blockquote>
                  </article>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{guidance.contactOnHold ? "On hold at your request. I've prepared the enquiry, but I can't send it while your hold on further contact stands." : "Still required: Your approval. Preparing a message is not the same as sending it; I won't send this without your approval."}</p>
                </div>}
                {guidance.leasePlansRequested && <div className="mt-4 border-l-2 border-ring pl-3">
                  <h5 className="text-xs font-semibold">Added at your request</h5>
                  <p className="mt-2 text-sm leading-relaxed">{LEASE_PLANS_INSTRUCTION}</p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">I haven't reviewed the plans yet. The responsibility question stays open until I've established what they show.</p>
                </div>}
                {guidance.shopfrontRequested && <div className="mt-4 border-l-2 border-ring pl-3">
                  <h5 className="text-xs font-semibold">Added at your request</h5>
                  <p className="mt-2 text-sm leading-relaxed">Check whether the shopfront roof forms part of the tenant's premises.</p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">I'll check how the premises are described in the lease before reaching a conclusion. The check hasn't been completed, and the roof isn't assumed to be included.</p>
                </div>}
                <div className="mt-4">
                  <Button variant="ghost" size="sm" onClick={() => onGuide("lease")} className="h-auto gap-2 px-0 text-xs text-muted-foreground">
                    <MessageCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />Guide this activity
                  </Button>
                </div>
                <div className="mt-3">
                  <Button variant="ghost" size="sm" onClick={() => setPaperOpen(!paperOpen)} aria-expanded={paperOpen} className="h-auto max-w-full justify-start gap-2 whitespace-normal px-0 text-xs text-muted-foreground">
                    <FileText className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />Business Lease · {paperOpen ? "Hide paper" : "View paper"}
                  </Button>
                  {paperOpen && <aside aria-label="Business Lease illustrative extract" className="mt-3 border-l-2 border-border bg-popover px-3 py-3">
                    <p className="text-xs font-medium text-muted-foreground">Business Lease · Illustrative extract</p>
                    <blockquote className="mt-2 text-sm leading-relaxed">The repairing obligations for the structure and roof are set out in this lease. The relevant clauses are still being reviewed; no conclusion on responsibility has been reached.</blockquote>
                    <p className="mt-2 text-xs text-muted-foreground">Example paper only — not a document from your portfolio.</p>
                  </aside>}
                </div>
                <div className="mt-5 border-t border-dashed border-border pt-3">
                  <p className="text-xs font-semibold text-muted-foreground">Related actions</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {help.shown
                      ? <DeskActionButton icon={<Undo2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />} label="Return to investigation" tooltip="Close this example and return to the investigation as it was." onClick={() => onHelpChange({ ...help, shown: false })} />
                      : <DeskActionButton demo icon={<HelpCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />} label="Preview needs help" tooltip="See how Hobson explains what is missing and asks for your help." onClick={() => onHelpChange({ ...help, shown: true })} />}
                  </div>
                </div>
              </>}

              {selected === "contractor" && !work.contractorRequestSent && <p className="mt-4 text-sm leading-relaxed text-muted-foreground">No new inspection has been requested. The earlier request remains recorded in Previous attempt; it has not been repeated.</p>}
              {selected === "contractor" && work.contractorRequestSent && <>
                <div className="mt-4 border-l-2 border-border pl-3">
                  <h5 className="text-xs font-semibold">What I've done</h5>
                  <p className="mt-2 text-sm leading-relaxed">Requested an inspection from the contractor.</p>
                </div>
                <div className="mt-4 border-l-2 border-border pl-3">
                  <h5 className="text-xs font-semibold">Current position</h5>
                  <p className="mt-2 text-sm leading-relaxed">The inspection request has already been sent. I'm awaiting a response.</p>
                </div>
                {guidance.contactOnHold && <div className="mt-4 border-l-2 border-ring pl-3">
                  <h5 className="text-xs font-semibold">At your request</h5>
                  <p className="mt-2 text-sm leading-relaxed">Further contact on hold at your request. The inspection request has already been sent and can't be recalled, but I won't send any follow-up while your instruction stands.</p>
                </div>}
                {guidance.holdWasLifted && !guidance.contactOnHold && <div className="mt-4 border-l-2 border-border pl-3">
                  <h5 className="text-xs font-semibold">At your request</h5>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Further contact permitted again. I won't send a follow-up unless it's needed.</p>
                </div>}
                <div className="mt-4 border-l-2 border-border pl-3">
                  <h5 className="text-xs font-semibold">Still outstanding</h5>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">No inspection report has been received.</p>
                </div>
                <article aria-label="Inspection request record" className="mt-5 rounded-md border border-border bg-popover px-4 py-4">
                  <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground"><FileText className="h-3.5 w-3.5" aria-hidden="true" />Inspection request · Illustrative record</p>
                  <dl className="mt-3 space-y-2 text-sm">
                    <div className="flex gap-2"><dt className="w-16 shrink-0 [@container_work_(min-width:40rem)]:w-24 text-xs text-muted-foreground">Requested</dt><dd className="min-w-0 break-words font-medium">Contractor inspection of the reported roof leak</dd></div>
                    <div className="flex gap-2"><dt className="w-16 shrink-0 [@container_work_(min-width:40rem)]:w-24 text-xs text-muted-foreground">Sent to</dt><dd className="min-w-0 break-words font-medium">Example Contractor Ltd</dd></div>
                    <div className="flex gap-2"><dt className="w-16 shrink-0 [@container_work_(min-width:40rem)]:w-24 text-xs text-muted-foreground">Status</dt><dd className="min-w-0 break-words font-medium">Awaiting response</dd></div>
                  </dl>
                </article>
              </>}

              {selected === "insurer" && !work.insurerPrepared && <><p className="mt-4 text-sm leading-relaxed text-muted-foreground">No new notification has been prepared or sent. The old draft remains in Previous attempt and carries no permission to send.</p><p className="mt-3 text-xs text-muted-foreground">Any new message will require a fresh review and your specific approval.</p><Button variant="outline" size="sm" disabled className="mt-4">Review approval</Button></>}
              {selected === "insurer" && work.insurerPrepared && work.insurerSent && <>
                <p role="status" className="mt-3 flex items-center gap-2 text-sm font-medium"><Check className="h-4 w-4 text-muted-foreground" aria-hidden="true" />Sent — awaiting response</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">I've sent the illustrative notification with your approval. No responsibility has been suggested, and no real message has left this prototype.</p>
                <article aria-label="Sent insurer notification" className="mt-5 rounded-md border border-border bg-popover px-4 py-4">
                  <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground"><Mail className="h-3.5 w-3.5" aria-hidden="true" />Sent notification · illustrative prototype data</p>
                  <dl className="mt-3 space-y-2 text-sm">
                    <div className="flex gap-2"><dt className="w-16 shrink-0 text-xs text-muted-foreground">To</dt><dd className="min-w-0 break-words font-medium">{INSURER_TO}</dd></div>
                    <div className="flex gap-2"><dt className="w-16 shrink-0 text-xs text-muted-foreground">Subject</dt><dd className="min-w-0 break-words font-medium">{INSURER_SUBJECT}</dd></div>
                  </dl>
                  <blockquote className="mt-4 whitespace-pre-line border-t border-border pt-4 text-sm leading-relaxed">{work.insurerDraft}</blockquote>
                </article>
                <div className="mt-5 border-l-2 border-ring pl-3"><h5 className="text-xs font-semibold">What happens next</h5><p className="mt-2 text-sm leading-relaxed">I'll bring you the insurer's response when it arrives.</p></div>
              </>}
              {selected === "insurer" && work.insurerPrepared && !work.insurerSent && <>
                <p className="mt-3 text-xs font-medium text-muted-foreground">{guidance.contactOnHold ? "On hold at your request" : "Needs your approval"}</p>
                <p className="mt-3 text-sm leading-relaxed">I've prepared a notification about the reported roof leak at Burlington Gardens. Nothing has been sent. Please check the details before deciding.</p>
                {guidance.contactOnHold && <div className="mt-4 border-l-2 border-ring pl-3">
                  <h5 className="text-xs font-semibold">At your request</h5>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">You asked me not to contact anyone. The draft remains here to inspect, but the contact restriction must be lifted before approval can proceed. Lifting it will not send the notification or count as approval.</p>
                </div>}
                {insurerNotice && <p role="status" className="mt-4 text-sm leading-relaxed text-muted-foreground">{insurerNotice}</p>}
                <article aria-label="Draft insurer notification preview" className="mt-5 rounded-md border border-border bg-popover px-4 py-4">
                  <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground"><Mail className="h-3.5 w-3.5" aria-hidden="true" />Draft notification · not yet sent · illustrative prototype data</p>
                  <dl className="mt-3 space-y-2 text-sm">
                    <div className="flex gap-2"><dt className="w-16 shrink-0 text-xs text-muted-foreground">To</dt><dd className="min-w-0 break-words font-medium">{INSURER_TO}</dd></div>
                    <div className="flex gap-2"><dt className="w-16 shrink-0 text-xs text-muted-foreground">Subject</dt><dd className="min-w-0 break-words font-medium">{INSURER_SUBJECT}</dd></div>
                  </dl>
                  {insurerEditing ? <div className="mt-4">
                    <label htmlFor="insurer-draft-edit" className="text-xs font-medium text-muted-foreground">Edit the notification</label>
                    <textarea id="insurer-draft-edit" value={insurerEditText} onChange={(event) => setInsurerEditText(event.target.value)} rows={9} className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm leading-relaxed" />
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button size="sm" onClick={() => { onWorkUpdate({ ...work, insurerDraft: insurerEditText, insurerApproval: undefined }); setInsurerEditing(false); setInsurerNotice("Your revised version is shown below. It has not been sent — please approve it explicitly if you're content."); }}>Keep this version</Button>
                      <Button size="sm" variant="ghost" onClick={() => setInsurerEditing(false)}>Discard changes</Button>
                    </div>
                  </div> : <blockquote className="mt-4 whitespace-pre-line border-t border-border pt-4 text-sm leading-relaxed">{work.insurerDraft}</blockquote>}
                  <p className="mt-4 border-t border-border pt-3 text-sm"><span className="min-w-0 break-words font-medium">Attachments:</span> None currently selected.</p>
                </article>
                <div className="mt-5 border-l-2 border-border pl-3">
                  <h5 className="text-xs font-semibold">Still to establish</h5>
                  <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm leading-relaxed">
                    <li>Whether the roof forms part of the tenant's premises.</li>
                    <li>Who is responsible for repairs.</li>
                    <li>The contractor's inspection findings.</li>
                  </ul>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">These remain unresolved, so the notification reports the incident as a fact and does not present any of them as confirmed.</p>
                </div>
                {!insurerEditing && <div className="mt-5 flex flex-wrap gap-2">
                  <Button size="sm" disabled={guidance.contactOnHold || paused} onClick={() => { onWorkUpdate(sendInsurerNotification({ ...work, paused })); setInsurerNotice(null); }}>Approve and send</Button>
                  <Button size="sm" variant="outline" onClick={() => { setInsurerEditText(work.insurerDraft); setInsurerEditing(true); setInsurerNotice(null); }}>Change before sending</Button>
                  <Button size="sm" variant="ghost" onClick={() => { setInsurerNotice(null); setEvidence(null); }}>Not now</Button>
                </div>}
                {guidance.contactOnHold && <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Approve and send is unavailable while contact is on hold at your request.</p>}
              </>}
              {selected === "insurer" && !work.ended && <div className="mt-6 border-t border-dashed border-border pt-3"><Button size="sm" variant="ghost" onClick={() => { onWorkUpdate(resetRoofDemo()); setInsurerEditing(false); setInsurerNotice(null); }} className="h-auto px-0 text-xs text-muted-foreground">Reset this demonstration</Button></div>}
              </div>}
              </>}
            </div>
          </section>
        </div>
        )}
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-4 [@container_work_(min-width:40rem)]:px-6">
          <p className="max-w-md text-xs leading-relaxed text-muted-foreground">Illustrative work and paper extracts only — no live work is running.</p>
        </footer>
      </div>
    </div>
  );
}
