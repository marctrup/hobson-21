import { initialRoofGuidance, initialRoofHelp, type RoofGuidanceState, type RoofHelpState } from "./roofGuidance";
import { roofLeakWork } from "./roofLeakWork";
import { INSURER_BODY, INSURER_TO, INSURER_SUBJECT } from "./roofDrafts";
import { accomplished, decisions, lookingAfter } from "./workOverviewData";

export type RoofAttempt = {
  number: number;
  guidance: RoofGuidanceState;
  help: RoofHelpState;
  paused: boolean;
  insurerPrepared: boolean;
  insurerDraft: string;
  insurerSent: boolean;
  insurerApproval?: { to: string; subject: string; body: string; attachments: string[] };
  contractorRequestSent: boolean;
  history: typeof roofLeakWork.completed;
};
export type RoofWorkState = RoofAttempt & { ended: boolean; previous: RoofAttempt[] };

export function createRoofWork(): RoofWorkState {
  return { number: 1, guidance: { ...initialRoofGuidance }, help: { ...initialRoofHelp }, paused: false, insurerPrepared: true, insurerDraft: INSURER_BODY, insurerSent: false, contractorRequestSent: true, history: [...roofLeakWork.completed], ended: false, previous: [] };
}

/** Ending records a snapshot; nothing is sent, recalled or marked accomplished. */
export function endRoofWork(work: RoofWorkState): RoofWorkState {
  if (work.ended) return work;
  const { ended: _, previous, ...attempt } = work;
  return { ...work, ended: true, previous: [...previous, structuredClone(attempt)] };
}

/** A fresh attempt has no inherited instructions, approval, drafts or sent requests. */
export function restartRoofWork(work: RoofWorkState): RoofWorkState {
  if (!work.ended) return work;
  return { ...createRoofWork(), number: work.number + 1, insurerPrepared: false, contractorRequestSent: false, history: [], previous: work.previous };
}

export function roofAttention(work: RoofWorkState) {
  return {
    insurer: !work.ended && work.insurerPrepared && !work.insurerSent && !work.guidance.contactOnHold,
    help: !work.ended && work.help.shown && work.help.choice === null && !work.guidance.leasePlansRequested,
  };
}

export function roofOverviewCounts(work: RoofWorkState) {
  const attention = roofAttention(work);
  return { accomplished: accomplished.length, active: lookingAfter.filter(item => item.place !== roofLeakWork.place || !work.ended).length, needsYou: decisions.length + Number(attention.insurer) + Number(attention.help) };
}

/** Approval belongs only to this notification and exact version; it does not execute it. */
export function approveInsurerNotification(work: RoofWorkState): RoofWorkState {
  if (work.ended || work.paused || work.insurerSent || !work.insurerPrepared || work.guidance.contactOnHold) return work;
  if (work.insurerApproval?.body === work.insurerDraft) return work;
  const insurerApproval = { to: INSURER_TO, subject: INSURER_SUBJECT, body: work.insurerDraft, attachments: [] as string[] };
  return { ...work, insurerApproval, history: [...work.history, { label: "Approved this insurer notification.", outcome: `Authorised only this notification to ${INSURER_TO}, subject: ${INSURER_SUBJECT}. Attachments: None.\n\n${work.insurerDraft}` }] };
}

/** Simulated execution requires an unchanged, specifically approved notification. */
export function executeApprovedInsurerNotification(work: RoofWorkState): RoofWorkState {
  const approval = work.insurerApproval;
  if (work.ended || work.paused || work.insurerSent || !work.insurerPrepared || work.guidance.contactOnHold || !approval || approval.body !== work.insurerDraft || approval.to !== INSURER_TO || approval.subject !== INSURER_SUBJECT || approval.attachments.length !== 0) return work;
  return { ...work, insurerSent: true, history: [...work.history, { label: "Sent the insurer notification with your approval.", outcome: `Sent to ${approval.to}. Subject: ${approval.subject}. Attachments: None. Wording as approved:\n\n${approval.body}` }] };
}

/** Existing combined command records approval and execution separately; nothing leaves the browser. */
export function sendInsurerNotification(work: RoofWorkState): RoofWorkState {
  return executeApprovedInsurerNotification(approveInsurerNotification(work));
}

/** Restores the roof investigation's demonstration state for repeat testing. */
export function resetRoofDemo(): RoofWorkState { return createRoofWork(); }
