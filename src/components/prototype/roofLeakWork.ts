/** Shared illustrative data for the Burlington Gardens roof leak investigation.
 *  One source of truth: the overview, the Needs you section and the Work Surface
 *  all read from here so they can never disagree. */

export type RoofActivityState = "working" | "waiting" | "needs-you";
export type RoofActivityId = "lease" | "contractor" | "insurer";

export const roofLeakWork = {
  place: "Burlington Gardens",
  title: "Investigating the roof leak",
  aim: "I'm investigating the source of the leak, checking responsibility and arranging the next steps.",
  activities: [
    { id: "lease" as RoofActivityId, label: "Reviewing the lease", title: "Reviewing repairing obligations", state: "working" as RoofActivityState, note: "I'm checking the lease to establish who is responsible for the affected roof." },
    { id: "contractor" as RoofActivityId, label: "Contractor inspection", title: "Contractor inspection", state: "waiting" as RoofActivityState, note: "I've requested an inspection and I'm waiting for the contractor to respond." },
    { id: "insurer" as RoofActivityId, label: "Contact the insurer", title: "Contact the insurer", state: "needs-you" as RoofActivityState, note: "I've prepared a notification to the insurer. I need your approval before sending it." },
  ],
  completed: [
    { label: "Read the tenant's report.", outcome: "The tenant reported water coming through near the top-floor ceiling. The report is read and noted; the cause of the leak is not yet established." },
    { label: "Identified the relevant Business Lease.", outcome: "I found the Business Lease for Burlington Gardens — the paper that sets out the repairing obligations. Its relevant clauses are now under review." },
    { label: "Requested a contractor inspection.", outcome: "I asked Example Contractor Ltd to inspect the reported leak. The request is recorded under Contractor inspection while I await their response." },
  ],
  summary: "I'm continuing my review of the lease, waiting for the contractor and need your approval before contacting the insurer.",
  explanation: "I'm looking into the reported leak, establishing responsibility and arranging what needs to happen next.",
};

/** The outstanding decision within the investigation — a reference, not a separate job. */
export const roofInsurerDecision = {
  place: roofLeakWork.place,
  title: "Contact the insurer",
  decision: "May I send the notification to the insurer?",
  why: "I've prepared a notification about the reported roof leak. I'd like your approval before sending it.",
  activity: "insurer" as RoofActivityId,
};
