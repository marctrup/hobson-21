import { useState } from "react";
import { ArrowLeft, Check, ChevronDown, FileText, Hand, Mail, MessageCircle, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import owlReading from "@/assets/prototype/owl-reading.png";
import { roofLeakWork, type RoofActivityId, type RoofActivityState } from "./roofLeakWork";
import { SHOPFRONT_INSTRUCTION, type RoofGuidanceState, type RoofGuideScope } from "./roofGuidance";

type ActivityId = RoofActivityId;
type ActivityState = RoofActivityState;

const completed = roofLeakWork.completed;

const activities: { id: ActivityId; title: string; state: ActivityState; note: string }[] = roofLeakWork.activities;

const INSURER_TO = "insurer@example.com";
const INSURER_SUBJECT = "Burlington Gardens — Reported roof leak";
const INSURER_BODY = `Dear Sir or Madam,

I'm writing to notify you of a reported roof leak at Burlington Gardens, reported by the tenant.

A contractor inspection has been requested and we will share the report once received.

Kind regards,
Hobson`;

function stateDot(state: ActivityState) {
  if (state === "working") return <span aria-hidden="true" className="h-2 w-2 rounded-full bg-ring" />;
  if (state === "needs-you") return <Hand aria-hidden="true" className="h-3.5 w-3.5 text-ring" />;
  return <span aria-hidden="true" className="h-2 w-2 rounded-full border border-muted-foreground" />;
}

const stateLabel: Record<ActivityState, string> = { working: "Working", waiting: "Waiting", "needs-you": "Needs you" };

/** Illustrative parallel-activities demonstration only — no real work, approvals or integrations. */
export function RoofLeakJourney({ paused, onPauseChange, onBack, onGuide, initialActivity = "lease", guidance }: {
  paused: boolean;
  onPauseChange: (paused: boolean) => void;
  onBack: () => void;
  onGuide: (scope: RoofGuideScope) => void;
  initialActivity?: ActivityId;
  guidance: RoofGuidanceState;
}) {
  const [selected, setSelected] = useState<ActivityId | `done-${number}`>(initialActivity);
  const [paperOpen, setPaperOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const selectedActivity = activities.find((activity) => activity.id === selected);
  const selectedDone = typeof selected === "string" && selected.startsWith("done-") ? completed[Number(selected.slice(5))] : null;

  return (
    <div className="flex min-h-0 flex-1 flex-col" role="region" aria-label="Roof leak investigation work journey">
      <header className="shrink-0 border-b border-border px-5 pb-5 pt-4 sm:px-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="mb-4 gap-2 px-0 text-muted-foreground"><ArrowLeft className="h-4 w-4" />Back to What I've Done</Button>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1 basis-64">
            <p className="mb-2 text-xs text-muted-foreground">Burlington Gardens</p>
            <h2 className="text-2xl font-semibold leading-tight">Investigating the roof leak</h2>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onPauseChange(!paused)} className="shrink-0 gap-2">{paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}{paused ? "Resume work" : "Pause work"}</Button>
            <Button variant="secondary" size="sm" onClick={onGuide} className="gap-2"><MessageCircle className="h-4 w-4" />Guide Hobson</Button>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <img src={owlReading} alt="Hobson reading" className="h-10 w-10 shrink-0 object-contain" />
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{roofLeakWork.explanation}</p>
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed">{roofLeakWork.summary}</p>
        <p role="status" className="mt-3 flex items-center gap-2 text-xs font-medium"><span className={`h-1.5 w-1.5 rounded-full ${paused ? "bg-muted-foreground" : "bg-ring"}`} aria-hidden="true" />{paused ? "Work paused · What I've found is preserved" : "I'm working on this now"}</p>
      </header>

      <div className="hobson-scroll min-h-0 flex-1 overflow-y-auto">
        <div className="grid min-h-full grid-cols-[minmax(0,0.35fr)_minmax(0,0.65fr)] max-[640px]:grid-cols-1">
          <nav aria-label="The Journey" className="min-w-0 border-r border-border px-4 py-5 max-[640px]:border-b max-[640px]:border-r-0">
            <h3 className="mb-5 text-xs font-semibold text-muted-foreground">The Journey</h3>

            <p className="mb-2 text-xs font-medium text-muted-foreground">Happening now</p>
            <div>
              {activities.map((activity) => (
                <Button key={activity.id} variant="ghost" aria-current={selected === activity.id ? "step" : undefined} onClick={() => { setSelected(activity.id); setPaperOpen(false); }} className={`mb-2 h-auto w-full items-start justify-start gap-2 rounded-md border px-2 py-3 text-left whitespace-normal ${selected === activity.id ? "border-border bg-muted/70" : "border-transparent"}`}>
                  <span aria-hidden="true" className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">{stateDot(activity.state)}</span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold leading-snug">{activity.title}</span>
                    <span className="mt-1 block text-xs font-normal leading-relaxed text-muted-foreground">{stateLabel[activity.state]} · {activity.note}</span>
                  </span>
                </Button>
              ))}
            </div>

            <div className="mt-6 border-t border-border pt-4">
              <Button variant="ghost" size="sm" onClick={() => setHistoryOpen(!historyOpen)} aria-expanded={historyOpen} aria-controls="roof-history" className="mb-2 h-auto gap-2 px-0 text-xs font-medium text-muted-foreground">
                What I've done
                <span className="tabular-nums">{completed.length}</span>
                <ChevronDown aria-hidden="true" className={`h-3.5 w-3.5 transition-transform ${historyOpen ? "rotate-180" : ""}`} />
              </Button>
              {historyOpen && <div id="roof-history">
                {completed.map((item, index) => (
                  <Button key={item.label} variant="ghost" aria-current={selected === `done-${index}` ? "step" : undefined} onClick={() => { setSelected(`done-${index}`); setPaperOpen(false); }} className={`mb-1 h-auto w-full items-start justify-start gap-2 rounded-md border px-2 py-2 text-left whitespace-normal ${selected === `done-${index}` ? "border-border bg-muted/70" : "border-transparent"}`}>
                    <Check aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" strokeWidth={1.6} />
                    <span className="min-w-0 text-sm font-normal leading-relaxed text-muted-foreground">{item.label}</span>
                  </Button>
                ))}
              </div>}
            </div>
          </nav>

          <section aria-labelledby="desk-heading" className="min-w-0 px-5 py-5 sm:px-6">
            <h3 id="desk-heading" className="mb-5 text-xs font-semibold text-muted-foreground">On Hobson's Desk</h3>
            <div key={selected}>
              <h4 className="text-lg font-semibold leading-snug">{selectedDone ? selectedDone.label : selectedActivity?.title}</h4>

              {selectedDone && <>
                <p className="mt-2 flex items-center gap-2 text-xs font-medium text-muted-foreground"><Check className="h-3.5 w-3.5" aria-hidden="true" />Completed</p>
                <div className="mt-4 border-l-2 border-border pl-3">
                  <h5 className="text-xs font-semibold">Recorded outcome</h5>
                  <p className="mt-2 text-sm leading-relaxed">{selectedDone.outcome}</p>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-muted-foreground">This is part of the investigation's history. The current activities are above, under Happening now.</p>
              </>}

              {selected === "lease" && <>
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
                <div className="mt-4 border-l-2 border-border pl-3">
                  <h5 className="text-xs font-semibold">Not yet established</h5>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">I haven't finished reviewing the relevant repairing obligations.</p>
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
              </>}

              {selected === "contractor" && <>
                <div className="mt-4 border-l-2 border-border pl-3">
                  <h5 className="text-xs font-semibold">What I've done</h5>
                  <p className="mt-2 text-sm leading-relaxed">Requested an inspection from the contractor.</p>
                </div>
                <div className="mt-4 border-l-2 border-border pl-3">
                  <h5 className="text-xs font-semibold">Current position</h5>
                  <p className="mt-2 text-sm leading-relaxed">Waiting for the contractor's response.</p>
                </div>
                <div className="mt-4 border-l-2 border-border pl-3">
                  <h5 className="text-xs font-semibold">Still outstanding</h5>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">No inspection report has been received.</p>
                </div>
                <article aria-label="Inspection request record" className="mt-5 rounded-md border border-border bg-popover px-4 py-4">
                  <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground"><FileText className="h-3.5 w-3.5" aria-hidden="true" />Inspection request · Illustrative record</p>
                  <dl className="mt-3 space-y-2 text-sm">
                    <div className="flex gap-2"><dt className="w-24 shrink-0 text-xs text-muted-foreground">Requested</dt><dd className="font-medium">Contractor inspection of the reported roof leak</dd></div>
                    <div className="flex gap-2"><dt className="w-24 shrink-0 text-xs text-muted-foreground">Sent to</dt><dd className="font-medium">Example Contractor Ltd</dd></div>
                    <div className="flex gap-2"><dt className="w-24 shrink-0 text-xs text-muted-foreground">Status</dt><dd className="font-medium">Awaiting response</dd></div>
                  </dl>
                </article>
              </>}

              {selected === "insurer" && <>
                <div className="mt-4 border-l-2 border-border pl-3">
                  <h5 className="text-xs font-semibold">What I've prepared</h5>
                  <p className="mt-2 text-sm leading-relaxed">Draft notification to the insurer about the reported leak.</p>
                </div>
                <div className="mt-4 border-l-2 border-ring pl-3">
                  <h5 className="text-xs font-semibold">Current position</h5>
                  <p className="mt-2 text-sm leading-relaxed">Awaiting your approval. Nothing has been sent.</p>
                </div>
                <article aria-label="Draft insurer notification preview" className="mt-5 rounded-md border border-border bg-popover px-4 py-4">
                  <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground"><Mail className="h-3.5 w-3.5" aria-hidden="true" />Draft notification · not yet sent</p>
                  <dl className="mt-3 space-y-2 text-sm">
                    <div className="flex gap-2"><dt className="w-16 shrink-0 text-xs text-muted-foreground">To</dt><dd className="font-medium">{INSURER_TO}</dd></div>
                    <div className="flex gap-2"><dt className="w-16 shrink-0 text-xs text-muted-foreground">Subject</dt><dd className="font-medium">{INSURER_SUBJECT}</dd></div>
                  </dl>
                  <blockquote className="mt-4 whitespace-pre-line border-t border-border pt-4 text-sm leading-relaxed">{INSURER_BODY}</blockquote>
                </article>
                <Button size="sm" variant="outline" className="mt-4" disabled title="Approval review is demonstrated in the tenancy renewal journey">Review approval</Button>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">The approval flow itself is demonstrated in the tenancy renewal journey; this preview shows only what is waiting for you.</p>
              </>}
            </div>
          </section>
        </div>
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-4 sm:px-6">
          <p className="max-w-md text-xs leading-relaxed text-muted-foreground">Illustrative work and paper extracts only — no live work is running.</p>
        </footer>
      </div>
    </div>
  );
}
