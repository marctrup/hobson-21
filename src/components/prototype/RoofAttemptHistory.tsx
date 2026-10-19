import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import type { RoofAttempt } from "./roofWorkLifecycle";
import { HOLD_CONTACT_INSTRUCTION, LEASE_PLANS_INSTRUCTION, LIFT_HOLD_INSTRUCTION, SHOPFRONT_INSTRUCTION } from "./roofGuidance";
import { INSURER_BODY, INSURER_SUBJECT, INSURER_TO, SURVEYOR_BODY, SURVEYOR_SUBJECT, SURVEYOR_TO } from "./roofDrafts";

/** Read-only ended position: background, never permission for a new attempt. */
export function RoofAttemptHistory({ attempt }: { attempt: RoofAttempt }) {
  const [paperOpen, setPaperOpen] = useState(false);
  return <section aria-label="Recorded investigation history" className="mt-4 space-y-5">
    <p className="text-sm font-medium">Ended by you.</p>
    <p className="text-xs leading-relaxed text-muted-foreground">Earlier attempt · Background only. Findings have not been verified again; old instructions and approvals do not apply to fresh work.</p>
    <dl className="space-y-3 text-sm">
      <div><dt className="font-semibold">Reviewing repairing obligations</dt><dd className="mt-1 text-muted-foreground">Ended — Responsibility not established.</dd></div>
      <div><dt className="font-semibold">Contractor inspection</dt><dd className="mt-1 text-muted-foreground">{attempt.contractorRequestSent ? "Request previously sent — No response recorded." : "No new inspection requested."}</dd></div>
      <div><dt className="font-semibold">Contact the insurer</dt><dd className="mt-1 text-muted-foreground">Not sent.</dd></div>
    </dl>
    <div><h5 className="text-xs font-semibold">Recorded history</h5>{attempt.history.length ? <ul className="mt-3 space-y-3">{attempt.history.map(item => <li key={item.label}><p className="text-sm font-medium">{item.label}</p><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.outcome}</p></li>)}</ul> : <p className="mt-2 text-sm text-muted-foreground">No further actions were recorded in this attempt.</p>}</div>
    <div><h5 className="text-xs font-semibold">Business Lease findings</h5><p className="mt-2 text-sm leading-relaxed text-muted-foreground">The relevant Business Lease was identified. Repairing responsibility was not established.</p>
      {attempt.help.shown && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">The lease contains repairing obligations relevant to the premises, but whether the shopfront roof falls within the tenant's premises remained uncertain.</p>}
      <Button variant="ghost" size="sm" onClick={() => setPaperOpen(!paperOpen)} aria-expanded={paperOpen} className="mt-2 h-auto gap-2 whitespace-normal px-0 text-xs text-muted-foreground"><FileText className="h-3.5 w-3.5" />Business Lease · {paperOpen ? "Hide paper" : "View paper"}</Button>
      {paperOpen && <aside aria-label="Business Lease illustrative extract" className="mt-3 border-l-2 border-border pl-3"><p className="text-sm leading-relaxed">The repairing obligations for the structure and roof are set out in this lease. No conclusion on responsibility was reached.</p><p className="mt-2 text-xs text-muted-foreground">Example paper only — not a document from your portfolio.</p></aside>}
    </div>
    {(attempt.guidance.shopfrontRequested || attempt.guidance.contactOnHold || attempt.guidance.holdWasLifted || attempt.guidance.leasePlansRequested || attempt.help.choice) && <div><h5 className="text-xs font-semibold">Your instructions and decisions</h5><ul className="mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground">
      {attempt.guidance.shopfrontRequested && <li>{SHOPFRONT_INSTRUCTION}</li>}
      {(attempt.guidance.contactOnHold || attempt.guidance.holdWasLifted) && <li>{HOLD_CONTACT_INSTRUCTION}</li>}
      {attempt.guidance.holdWasLifted && <li>{LIFT_HOLD_INSTRUCTION}</li>}
      {attempt.guidance.leasePlansRequested && <li>{LEASE_PLANS_INSTRUCTION}</li>}
      {attempt.help.choice === "enquiry" && <li>You asked me to prepare the surveyor enquiry. It was not sent.</li>}
      {attempt.help.choice === "unresolved" && <li>You chose to leave the responsibility question unresolved.</li>}
    </ul></div>}
    {attempt.insurerPrepared && <HistoricalDraft title="Insurer notification" to={INSURER_TO} subject={INSURER_SUBJECT} body={INSURER_BODY} />}
    {attempt.help.choice === "enquiry" && <HistoricalDraft title="Surveyor enquiry" to={SURVEYOR_TO} subject={SURVEYOR_SUBJECT} body={SURVEYOR_BODY} />}
    <p className="text-xs leading-relaxed text-muted-foreground">Unsent proposals are cancelled for this attempt. These drafts cannot be approved or dispatched.</p>
  </section>;
}

function HistoricalDraft({ title, to, subject, body }: { title: string; to: string; subject: string; body: string }) {
  return <article aria-label={`${title} historical draft`} className="border-y border-border py-4"><h5 className="text-sm font-semibold">{title} · Unsent historical draft</h5><dl className="mt-3 space-y-2 text-sm"><div><dt className="text-xs text-muted-foreground">To</dt><dd>{to}</dd></div><div><dt className="text-xs text-muted-foreground">Subject</dt><dd>{subject}</dd></div></dl><blockquote className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{body}</blockquote></article>;
}