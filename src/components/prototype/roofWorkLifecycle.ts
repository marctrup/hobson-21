import { initialRoofGuidance, initialRoofHelp, type RoofGuidanceState, type RoofHelpState } from "./roofGuidance";
import { roofLeakWork } from "./roofLeakWork";
import { INSURER_BODY } from "./roofDrafts";
import { accomplished, decisions, lookingAfter } from "./workOverviewData";

export type RoofAttempt = {
  number: number;
  guidance: RoofGuidanceState;
  help: RoofHelpState;
  paused: boolean;
  insurerPrepared: boolean;
  insurerDraft: string;
  insurerSent: boolean;
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

/** Simulated only: records the exact wording as sent. Nothing leaves the browser. */
export function sendInsurerNotification(work: RoofWorkState): RoofWorkState {
  if (work.ended || work.insurerSent || !work.insurerPrepared || work.guidance.contactOnHold) return work;
  return { ...work, insurerSent: true, history: [...work.history, { label: "Sent the insurer notification with your approval.", outcome: `Sent to Insurer (illustrative recipient). Wording as approved:\n\n${work.insurerDraft}` }] };
}

/** Restores the roof investigation's demonstration state for repeat testing. */
export function resetRoofDemo(): RoofWorkState { return createRoofWork(); }
