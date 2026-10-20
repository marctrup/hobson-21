// Iteration 4A: papers Hobson is reading properly after placement was confirmed.
// Each reading keeps its own placement snapshot; it never joins a confirmed history here.
import type { Placement } from "./prototypeDocumentsPlacement";

export const READING_PHRASES = ["Reviewing the lease…", "Checking the important terms…", "Preparing the tenancy history…", "Bringing everything together…"] as const;
export const READING_STEP_MS = 20000;

export type Reading = {
  id: number; title: string; unit: string; filename: string; url?: string;
  paperType: string; tenant: string; paperDate: string; effective: string | null;
  placement: Placement; step: number; finished: boolean;
};

export const activeReadings = (r: Reading[]) => r.filter((x) => !x.finished);
export const phraseFor = (r: Reading) => READING_PHRASES[Math.min(r.step, READING_PHRASES.length - 1)];

/** Advances illustrative activity; never marks a reading finished. */
export const advanceReadings = (r: Reading[]) => r.map((x) => x.finished ? x : { ...x, step: Math.min(x.step + 1, READING_PHRASES.length - 1) });

/** Prototype-only completion preview. */
export const previewFinish = (r: Reading[], id: number) => r.map((x) => x.id === id ? { ...x, finished: true } : x);
