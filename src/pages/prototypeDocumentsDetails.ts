// Stage 2: what Hobson has read from the example lease. Values agree with the supplied PDF.
// The original reading is kept separately from any correction the user makes; the PDF is never altered.
export type DetailKey = "paperDate" | "effectiveDate" | "landlord" | "tenant" | "premises" | "unitDescription" | "termStart" | "termEnd" | "references";
export type EffectiveStatus = "asking" | "confirmed" | "other" | "unsure";
export type ReadDetail = { key: DetailKey; label: string; read: string; page: number; note?: string; corrected?: string };
export type DetailsReview = { details: ReadDetail[]; effective: EffectiveStatus; effectiveValue: string | null };

export const EXAMPLE_DETAILS: ReadDetail[] = [
  { key: "paperDate", label: "Date on the paper", read: "22 August 2025", page: 3 },
  { key: "effectiveDate", label: "Effective date", read: "Not separately specified", page: 45, note: "Clause 16: the lease does not take effect until it has been dated." },
  { key: "landlord", label: "Landlord", read: "VISTRA TRUST COMPANY (JERSEY) LIMITED and VISTRA (C.I.) LIMITED, as joint trustees of the Russell Square House Unit Trust", page: 3 },
  { key: "tenant", label: "Tenant", read: "SYSTEMIQ LIMITED", page: 3 },
  { key: "premises", label: "Premises", read: "Fourth Floor, Russell Square House, 10–12 Russell Square, London WC1", page: 7 },
  { key: "unitDescription", label: "Unit description", read: "Fourth Floor", page: 7, note: "As read from the lease; not yet matched to a Unit." },
  { key: "termStart", label: "Term start", read: "22 August 2025", page: 4, note: "Ten years from the date of the lease." },
  { key: "termEnd", label: "Term end", read: "21 August 2035", page: 4 },
  { key: "references", label: "Other papers referred to", read: "A notice and statutory declaration under the Landlord and Tenant Act 1954", page: 44, note: "Referred to in clauses 15.1–15.4; I don't hold these papers." },
];

export const emptyReview: DetailsReview = { details: EXAMPLE_DETAILS, effective: "asking", effectiveValue: null };

export const shownValue = (d: ReadDetail) => d.corrected ?? d.read;

export function answerEffective(review: DetailsReview, answer: "confirmed" | "other" | "unsure", date?: string): DetailsReview {
  if (answer === "confirmed") return { ...review, effective: "confirmed", effectiveValue: "22 August 2025" };
  if (answer === "unsure") return { ...review, effective: "unsure", effectiveValue: null };
  const value = date?.trim();
  if (!value) return review;
  return { ...review, effective: "other", effectiveValue: value };
}

export function correctDetail(review: DetailsReview, key: DetailKey, value: string): DetailsReview {
  const v = value.trim();
  if (!v) return review;
  if (key === "effectiveDate") return answerEffective(review, "other", v);
  return { ...review, details: review.details.map((d) => d.key === key ? { ...d, corrected: v === d.read ? undefined : v } : d) };
}
