import type { RoofActivityId } from "./roofLeakWork";
import type { RoofWorkState } from "./roofWorkLifecycle";

export type RoofStepState = "done" | "reviewing" | "waiting" | "needs-you" | "not-started";
export type RoofEvidence = "paper" | "findings" | "request" | "notification" | "clarification";
export type RoofActivityStep = { id: string; title: string; state: RoofStepState; position: string; outcome: string; evidence?: RoofEvidence };
export type RoofActivityPlan = { title: string; intent: string; position: string; changes: string[]; steps: RoofActivityStep[] };

/** Presentation of recorded local events only. Selecting a step never performs work. */
export function roofActivityJourney(activity: RoofActivityId, work: RoofWorkState): RoofActivityPlan {
  const { guidance, help } = work;
  const changes: string[] = [];
  if (guidance.contactOnHold) changes.push("Further external contact is on hold at your request. Internal paper review can continue; already-sent requests remain recorded.");
  if (guidance.holdWasLifted && !guidance.contactOnHold) changes.push("Your contact hold was lifted. Any new external action still needs its own authority.");
  if (work.paused) changes.push("Work is paused at your request. The recorded steps are preserved; no new action will proceed until work resumes.");
  if (activity === "lease") {
    if (guidance.shopfrontRequested) changes.push("At your request, I am checking whether the shopfront roof falls within the tenant's premises. This has not been established.");
    if (guidance.leasePlansRequested) changes.push("You asked me to check the lease plans before contacting the surveyor. That check comes first; no plans finding has been recorded.");
    return {
      title: "Establish repairing responsibility",
      intent: "Review the relevant lease provisions and establish who is responsible for repairing the affected roof.",
      position: work.paused ? "The lease review is paused; repairing responsibility remains unresolved." : guidance.leasePlansRequested ? "I shall check the lease plans first; responsibility remains unresolved." : help.shown ? "The lease provisions are relevant, but I cannot establish whether they cover the affected roof." : "I am reviewing the lease; responsibility has not yet been established.",
      changes,
      steps: [
        { id: "found", title: "Found the Business Lease", state: work.number === 1 ? "done" : "reviewing", position: work.number === 1 ? "Done" : "Checking again", outcome: work.number === 1 ? "The relevant paper is available." : "The retained lease is available; earlier findings must be checked again.", evidence: "paper" },
        { id: "review", title: "Review repairing obligations", state: help.shown ? "done" : "reviewing", position: help.shown ? "Done" : work.paused ? "Paused" : "Reviewing", outcome: help.shown ? "The lease contains repairing obligations relevant to the premises; roof coverage remains uncertain." : "I am checking what the lease provides.", evidence: "findings" },
        ...(guidance.leasePlansRequested ? [{ id: "plans", title: "Check the lease plans first", state: "not-started" as const, position: "Not started", outcome: "Added at your request before any surveyor enquiry; what the plans show is not established.", evidence: "findings" as const }] : []),
        { id: "extent", title: "Establish whether the roof is included", state: "reviewing", position: "Not yet established", outcome: "The extent of the premises remains uncertain.", evidence: "findings" },
        { id: "clarify", title: "Consider whether clarification is needed", state: help.shown ? help.choice ? "waiting" : "needs-you" : "not-started", position: !help.shown ? "Not started" : help.choice === "enquiry" ? "Enquiry prepared — not sent" : help.choice === "unresolved" ? "Left open at your request" : "Needs you", outcome: !help.shown ? "If the papers do not resolve the issue, I shall explain what is missing and suggest how to establish it." : help.choice === "enquiry" ? "The surveyor enquiry is a separate draft and has no authority to send." : "The responsibility question remains open.", evidence: "clarification" },
      ],
    };
  }
  if (activity === "contractor") return {
    title: "Contractor inspection",
    intent: "Obtain the contractor's findings about the reported leak so we can decide what needs to happen next.",
    position: work.contractorRequestSent ? "The inspection request was sent; no contractor response has been recorded." : "No inspection request has been prepared or sent in this fresh attempt.", changes,
    steps: [
      { id: "prepare", title: "Prepared inspection request", state: work.contractorRequestSent ? "done" : "not-started", position: work.contractorRequestSent ? "Done" : "Not started", outcome: work.contractorRequestSent ? "The illustrative inspection request was prepared." : "Any new request needs its own authority." },
      { id: "send", title: "Sent inspection request", state: work.contractorRequestSent ? "done" : "not-started", position: work.contractorRequestSent ? "Done" : "Not started", outcome: work.contractorRequestSent ? "The illustrative request was sent to Example Contractor Ltd." : "The previous attempt's request has not been repeated.", evidence: work.contractorRequestSent ? "request" : undefined },
      { id: "response", title: "Await contractor response", state: work.contractorRequestSent ? "waiting" : "not-started", position: work.contractorRequestSent ? "Waiting" : "Not started", outcome: "No response has been recorded." },
      { id: "findings", title: "Review the findings", state: "not-started", position: "Not started", outcome: "When a response becomes available, I shall examine what it establishes." },
    ],
  };
  const prepared = work.insurerPrepared;
  const sent = work.insurerSent;
  const approved = work.insurerApproval?.body === work.insurerDraft;
  return {
    title: "Contact the insurer",
    intent: "Notify the insurer about the reported roof leak without presenting unresolved responsibility as established fact.",
    position: sent ? "The approved notification was sent in the simulation; no insurer response has been recorded." : guidance.contactOnHold ? "The notification is unsent; further contact is on hold at your request." : work.paused ? "Work is paused; the notification remains unsent." : prepared ? "The notification is prepared but unsent; your specific approval is required." : "No new notification has been prepared or sent.", changes,
    steps: [
      { id: "known", title: "Checked what's known", state: prepared ? "done" : "not-started", position: prepared ? "Done" : "Not started", outcome: prepared ? "The leak has been reported; inspection findings remain outstanding." : "Earlier findings must be checked again." },
      { id: "draft", title: "Prepared notification", state: prepared ? "done" : "not-started", position: prepared ? "Done" : "Not started", outcome: prepared ? sent ? "The exact approved wording remains in the record." : "The proposed notification is ready but unsent." : "The old draft carries no authority in this attempt.", evidence: prepared ? "notification" : undefined },
      { id: "approval", title: "Your approval", state: approved ? "done" : prepared && !guidance.contactOnHold && !work.paused ? "needs-you" : "not-started", position: approved ? "Approved this notification" : guidance.contactOnHold ? "On hold at your request" : work.paused ? "Paused — approval still required" : prepared ? "Needs you" : "Not started", outcome: approved ? "Authorised only this recipient, subject, exact message and no attachments. No later action is authorised." : "Approval applies only to this exact notification; it does not settle repairing responsibility.", evidence: prepared ? "notification" : undefined },
      { id: "send", title: "Send notification", state: sent ? "done" : "not-started", position: sent ? "Done" : "Not started", outcome: sent ? "The specifically approved notification was sent illustratively. No real email left the prototype." : "Only proceed after approval of the exact notification.", evidence: sent ? "notification" : undefined },
      { id: "response", title: "Await insurer response", state: sent ? "waiting" : "not-started", position: sent ? "Waiting" : "Not started", outcome: sent ? "No response has been recorded. Any later communication requires separate authority." : "This begins only after the notification has been sent." },
    ],
  };
}