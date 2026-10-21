import { Check, Circle, CircleHelp, Clock, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { roofActivityJourney, type RoofEvidence } from "./roofActivityJourney";
import type { RoofActivityId } from "./roofLeakWork";
import type { RoofWorkState } from "./roofWorkLifecycle";

export function RoofActivityJourney({ activity, work, onEvidence, showTitle = true }: { activity: RoofActivityId; work: RoofWorkState; onEvidence: (evidence: RoofEvidence) => void; showTitle?: boolean }) {
  const plan = roofActivityJourney(activity, work);
  return <section aria-label={`${plan.title} activity journey`}>
    {showTitle && <h4 className="text-lg font-semibold leading-snug">{plan.title}</h4>}
    <h5 className="mt-5 text-xs font-semibold text-muted-foreground">What I'm planning</h5>
    <p className="mt-2 text-sm leading-relaxed">{plan.intent}</p>
    {plan.changes.length > 0 && <aside aria-label="Current instructions" className="mt-4 border-l-2 border-ring pl-3">{plan.changes.map(change => <p key={change} className="mt-2 text-xs leading-relaxed text-muted-foreground">{change}</p>)}</aside>}
    <h5 className="mt-6 text-xs font-semibold text-muted-foreground">{work.scenario ? "My progress" : "The journey"}</h5>
    <ol className="mt-4 space-y-0">
      {plan.steps.map((step, index) => {
        const Icon = step.state === "done" ? Check : step.state === "needs-you" ? CircleHelp : step.state === "waiting" ? Clock : work.paused && step.state === "reviewing" ? Pause : Circle;
        return <li key={step.id} className="relative flex gap-3 pb-5 last:pb-0">
          {index < plan.steps.length - 1 && <span aria-hidden="true" className="absolute bottom-0 left-2 top-5 border-l border-border" />}
          <Icon aria-hidden="true" className={`relative mt-0.5 h-4 w-4 shrink-0 ${step.state === "needs-you" || step.state === "reviewing" ? "text-ring" : "text-muted-foreground"}`} strokeWidth={1.6} />
          <div className="min-w-0 flex-1">
            {step.evidence ? <Button variant="ghost" onClick={() => { if (step.evidence) onEvidence(step.evidence); }} className="h-auto max-w-full justify-start whitespace-normal p-0 text-left text-sm font-medium">{step.title}</Button> : <p className="text-sm font-medium leading-snug">{step.title}</p>}
            <p className="mt-1 text-xs font-medium text-muted-foreground">{step.position}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.outcome}</p>
            {step.id === "approval" && step.state === "needs-you" && <Button size="sm" className="mt-3" onClick={() => onEvidence("notification")}>Review notification</Button>}
            {step.id === "clarify" && step.state === "needs-you" && <Button size="sm" className="mt-3" onClick={() => onEvidence("clarification")}>Review suggestion</Button>}
          </div>
        </li>;
      })}
    </ol>
    <div className="mt-6 border-t border-border pt-4"><h5 className="text-xs font-semibold text-muted-foreground">Where things stand</h5><p className="mt-2 text-sm leading-relaxed">{plan.position}</p></div>
  </section>;
}