// Stage 3: where the paper belongs. A controlled example portfolio, never derived from the lease.
// Unit, client responsibility, tenancy relationship and current status are separate decisions;
// "Not sure" never attaches the paper to a Unit or history.
export const EXAMPLE_GROUP = "Russell Square House";
export const EXAMPLE_UNITS = ["Third Floor", "Fourth Floor", "Fifth Floor"] as const;
export const PROPOSED_UNIT = "Fourth Floor";

export type PlaceStep = "none" | "checking" | "unit" | "unitChoose" | "role" | "roleOther" | "relation" | "current" | "endDate" | "review" | "change" | "placed";
export type RoleKind = "landlord" | "tenant" | "track" | "other";
export type Placement = {
  step: PlaceStep;
  unit: string | null; unitStatus: "asking" | "confirmed" | "unsure";
  role: { kind: RoleKind; note?: string } | null;
  relation: "asking" | "new" | "earlier" | "unsure";
  current: "asking" | "current" | "ended" | "unsure";
  endDate: string | null;
  revisiting: boolean;
};

export const emptyPlacement: Placement = { step: "none", unit: PROPOSED_UNIT, unitStatus: "asking", role: null, relation: "asking", current: "asking", endDate: null, revisiting: false };

export const ROLE_LABELS: Record<RoleKind, string> = {
  landlord: "I manage it for the landlord",
  tenant: "I represent Systemiq",
  track: "I only need to keep track of it",
  other: "Something else / Not sure",
};

export function chooseUnit(p: Placement, unit: string | "unsure"): Placement {
  if (unit === "unsure") return { ...p, unitStatus: "unsure", unit: null };
  if (!(EXAMPLE_UNITS as readonly string[]).includes(unit)) return p;
  return { ...p, unitStatus: "confirmed", unit };
}

/** The paper joins a history only when the Unit, responsibility and a new tenancy are all settled. */
export const isSettled = (p: Placement) => p.unitStatus === "confirmed" && !!p.role && p.relation === "new";

export function statusText(p: Placement): string {
  if (p.current === "current") return "Current — confirmed by you";
  if (p.current === "ended") return `Ended — confirmed by you${p.endDate ? ` · ended ${p.endDate}` : " · ending date not given"}`;
  if (p.current === "unsure") return "Current status unconfirmed";
  return "Current status not yet established";
}
