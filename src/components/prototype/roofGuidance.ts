/** Local illustrative guidance for the roof leak investigation only; never executes work,
 *  sends messages or confirms paper terms. Two supported demonstration instructions:
 *  one scoped to the lease-review activity, one applying across the investigation. */

export const SHOPFRONT_INSTRUCTION = "Check whether the roof above the shopfront forms part of the tenant's premises.";
export const HOLD_CONTACT_INSTRUCTION = "Don't contact anyone else until I've spoken to the tenant.";
export const LIFT_HOLD_INSTRUCTION = "You can contact people again.";

export type RoofGuideScope = "overall" | "lease";

export type RoofGuidanceState = {
  /** The user asked for the shopfront roof check (lease-review activity). */
  shopfrontRequested: boolean;
  /** The user asked Hobson to hold all further external contact. */
  contactOnHold: boolean;
  /** A contact hold was applied and later lifted — the record of both is preserved. */
  holdWasLifted: boolean;
};

export const initialRoofGuidance: RoofGuidanceState = { shopfrontRequested: false, contactOnHold: false, holdWasLifted: false };

const normalise = (text: string) =>
  text.trim().replace(/[’‘]/g, "'").replace(/\s+/g, " ").replace(/[.!]+$/, "").toLowerCase();

export function applyRoofGuidance(
  state: RoofGuidanceState,
  scope: RoofGuideScope,
  instruction: string,
): { state: RoofGuidanceState; reply: string } {
  const text = normalise(instruction);

  if (scope === "lease" && text === normalise(SHOPFRONT_INSTRUCTION)) {
    return {
      state: state.shopfrontRequested ? state : { ...state, shopfrontRequested: true },
      reply: state.shopfrontRequested
        ? "The shopfront roof question is already part of my lease review. I haven't reached a conclusion yet."
        : "Of course. I'll check how the premises are described in the lease before reaching a conclusion about responsibility.",
    };
  }

  if (scope === "overall" && text === normalise(HOLD_CONTACT_INSTRUCTION)) {
    return {
      state: state.contactOnHold ? state : { ...state, contactOnHold: true },
      reply: state.contactOnHold
        ? "I'm already holding off on any further contact. I'll continue reviewing the papers in the meantime."
        : "Of course. I'll hold off on any further contact. I'll continue reviewing the papers, and I'll wait for you before contacting anyone.",
    };
  }

  if (scope === "overall" && text === normalise(LIFT_HOLD_INSTRUCTION)) {
    return {
      state: state.contactOnHold ? { ...state, contactOnHold: false, holdWasLifted: true } : state,
      reply: state.contactOnHold
        ? "Of course. I've lifted your hold on further contact. I'll continue under the existing instructions, and I'll still ask for approval before sending anything that needs your permission."
        : "There's no hold in place at present — I'm continuing under the existing instructions, and I'll still ask for approval before sending anything that needs your permission.",
    };
  }

  const example = scope === "lease" ? SHOPFRONT_INSTRUCTION : HOLD_CONTACT_INSTRUCTION;
  return {
    state,
    reply: `For this demonstration, I can take three instructions: one about the shopfront roof while we're looking at the lease review, and two about holding or resuming further contact for the investigation as a whole. I haven't changed the work. You can ask: “${example}”`,
  };
}
