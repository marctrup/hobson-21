import { initialRoofGuidance, initialRoofHelp, type RoofGuidanceState, type RoofHelpState } from "./roofGuidance";
import { roofLeakWork } from "./roofLeakWork";

export type RoofAttempt = {
  number: number;
  guidance: RoofGuidanceState;
  help: RoofHelpState;
  paused: boolean;
  insurerPrepared: boolean;
  contractorRequestSent: boolean;
  history: typeof roofLeakWork.completed;
};
export type RoofWorkState = RoofAttempt & { ended: boolean; previous: RoofAttempt[] };

export function createRoofWork(): RoofWorkState {
  return { number: 1, guidance: { ...initialRoofGuidance }, help: { ...initialRoofHelp }, paused: false, insurerPrepared: true, contractorRequestSent: true, history: [...roofLeakWork.completed], ended: false, previous: [] };
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
    insurer: !work.ended && work.insurerPrepared && !work.guidance.contactOnHold,
    help: !work.ended && work.help.shown && work.help.choice === null && !work.guidance.leasePlansRequested,
  };
}