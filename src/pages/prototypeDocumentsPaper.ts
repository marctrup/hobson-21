export const EXAMPLE_LEASE_FILENAME = "2025.08.22 - 4th Fl, RSH - Lease - Signed by Landlord.pdf";
export const PAPER_TYPES = ["Business Lease", "Underlease", "Licence to Occupy", "Deed of Variation", "Something else"] as const;
export type PaperStage = "empty" | "reading" | "proposed" | "choosing" | "other" | "complete";
export type PrototypePaper = { filename: string; url?: string; example: boolean };
export type PaperJourney = { stage: PaperStage; paper: PrototypePaper | null; paperType: string | null };
export const emptyPaperJourney: PaperJourney = { stage: "empty", paper: null, paperType: null };
export function receivePaper(paper: PrototypePaper): PaperJourney {
  return { paper, stage: paper.example ? "reading" : "choosing", paperType: null };
}
export function proposePaper(journey: PaperJourney): PaperJourney {
  if (journey.stage !== "reading" || !journey.paper?.example) return journey;
  return { ...journey, stage: "proposed", paperType: "Business Lease" };
}
export function confirmPaper(journey: PaperJourney, type: string): PaperJourney {
  if (!["proposed", "choosing", "other"].includes(journey.stage) || !journey.paper || !type.trim()) return journey;
  return { ...journey, stage: "complete", paperType: type.trim() };
}