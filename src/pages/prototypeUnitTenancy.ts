// Illustrative occupational (RTO) chain relationships. Statuses come only from confirmed chain
// positions supplied here — never from lease text, names or expiry dates.
export type ChainPosition = "current" | "ended" | "unresolved";
// Terms recorded from a confirmed paper. Anything absent is "Not recorded" — never inferred.
export type OccupationTerms = { occupant?: string; landlord?: string; commenced?: string; rent?: { amount: number; frequency: "per month" | "per year" }; breakDate?: string; sourcePaperId?: string };
export type OccupationalChain = { id: string; recordId: string; units: number[]; position: ChainPosition; relationshipConfirmed: boolean; terms?: OccupationTerms };
export type TenancyStatus = "Current tenancy recorded" | "Previous tenancies only" | "Tenancy status unconfirmed" | "No tenancy recorded";

// Simulated records for the demonstration, not verified findings. Keyed by place and Unit identity.
export const OCCUPATIONAL_CHAINS: OccupationalChain[] = [
  { id: "sh-f1", recordId: "stanley-finchley", units: [1], position: "current", relationshipConfirmed: true },
  { id: "sh-f2", recordId: "stanley-finchley", units: [2], position: "ended", relationshipConfirmed: true },
  { id: "sh-f3", recordId: "stanley-finchley", units: [3], position: "unresolved", relationshipConfirmed: true },
  { id: "pc-gym", recordId: "demo-paragon-centre", units: [1], position: "current", relationshipConfirmed: true, terms: { occupant: "Handhs Limited", landlord: "Rotch Property Group Limited", commenced: "1 December 2005", sourcePaperId: "paragon-gym-lease-2005" } },
];

export function tenancyStatus(chains: Pick<OccupationalChain, "position" | "relationshipConfirmed">[]): TenancyStatus {
  const applicable = chains.filter(c => c.relationshipConfirmed);
  if (!applicable.length) return "No tenancy recorded";
  if (applicable.some(c => c.position === "current")) return "Current tenancy recorded";
  if (applicable.every(c => c.position === "ended")) return "Previous tenancies only";
  return "Tenancy status unconfirmed";
}

export const chainsFor = (recordId: string | null | undefined, unit: number) =>
  recordId ? OCCUPATIONAL_CHAINS.filter(c => c.recordId === recordId && c.units.includes(unit)) : [];

export const statusFor = (recordId: string | null | undefined, unit: number) => tenancyStatus(chainsFor(recordId, unit));

// Every confirmed relationship is kept separately — several current ones are never collapsed into one.
export const occupationsFor = (recordId: string | null | undefined, unit: number) => chainsFor(recordId, unit).filter(c => c.relationshipConfirmed);

export const formatRent = (r?: OccupationTerms["rent"]) => r ? `£${r.amount.toLocaleString("en-GB")} ${r.frequency}` : undefined;
