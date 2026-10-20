import a1 from "@/assets/prototype/rsh-batch-1.pdf.asset.json";
import a2 from "@/assets/prototype/rsh-batch-2.pdf.asset.json";
import a3 from "@/assets/prototype/rsh-batch-3.pdf.asset.json";
import aWayleave from "@/assets/prototype/rsh-batch-wayleave.pdf.asset.json";
import a5 from "@/assets/prototype/rsh-batch-5.pdf.asset.json";

export const BATCH_LIMIT = 5;
export type BatchPaper = { id: string; filename: string; size: number; url: string; local?: boolean };
export type Batch = { papers: BatchPaper[]; started: boolean };

export const EXAMPLE_BATCH: BatchPaper[] = [
  ["RSH - Puig Lease - 16.12.2016.pdf", a1],
  ["5th Fl - RSH - Licence to Alter - Puig - 16.12.2016.pdf", a2],
  ["BT & Puig Wayleave - 20.04.2017 (1).pdf", aWayleave],
  ["2020.04.23 - 5th Fl, RSH - Puig Deed of Variation - Signed by Both Parties.pdf", a3],
  ["2024.04.29 - 5th Floor, RSH - Sublease.pdf", a5],
].map(([filename, a], i) => ({ id: `example-${i + 1}`, filename: filename as string, size: (a as typeof a1).size, url: (a as typeof a1).url }));

/** Adds papers up to the limit; reports how many could not fit. Never silently drops. */
export function addToBatch(current: BatchPaper[], incoming: BatchPaper[]): { papers: BatchPaper[]; overflow: number } {
  const fresh = incoming.filter((p) => !current.some((c) => c.filename === p.filename && c.size === p.size));
  const room = Math.max(0, BATCH_LIMIT - current.length);
  return { papers: [...current, ...fresh.slice(0, room)], overflow: Math.max(0, fresh.length - room) };
}

export function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export const BATCH_OVERFLOW_MESSAGE = "Let's start with these 5. You can add the rest straight afterwards.";
