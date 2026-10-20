// Illustrative occupational (RTO) chain relationships. Statuses come only from confirmed chain
// positions supplied here — never from lease text, names or expiry dates.
export type ChainPosition = "current" | "ended" | "unresolved";
export type OccupationalChain = { id: string; recordId: string; units: number[]; position: ChainPosition; relationshipConfirmed: boolean };
export type TenancyStatus = "Current tenancy recorded" | "Previous tenancies only" | "Tenancy status unconfirmed" | "No tenancy recorded";

// Simulated records for the demonstration, not verified findings. Keyed by place and Unit identity.
export const OCCUPATIONAL_CHAINS: OccupationalChain[] = [
  { id: "sh-f1", recordId: "stanley-finchley", units: [1], position: "current", relationshipConfirmed: true },
  { id: "sh-f2", recordId: "stanley-finchley", units: [2], position: "ended", relationshipConfirmed: true },
  { id: "sh-f3", recordId: "stanley-finchley", units: [3], position: "unresolved", relationshipConfirmed: true },
  { id: "pc-gym", recordId: "demo-paragon-centre", units: [1], position: "current", relationshipConfirmed: true },
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
