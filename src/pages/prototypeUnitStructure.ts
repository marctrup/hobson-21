export type BuildingUnderstanding =
  | { kind: "proposal"; units: string[] }
  | { kind: "mixed"; shops: number; flats: number }
  | { kind: "clarify" };

// Bounded illustrative descriptions, not a general-purpose building parser.
// Whole-sentence matching prevents extra or contradictory details being discarded.
export function understandBuilding(text: string): BuildingUnderstanding {
  const description = text.toLowerCase().replace(/[.,;!]/g, " ").replace(/\s+/g, " ").trim();
  if (/^(?:(?:there are|there is|it has|the building has) )?(?:a )?ground(?: floor)? (?:and )?first(?: floor)? (?:and )?second(?: floor)? and third floors?$/.test(description)) {
    return { kind: "proposal", units: ["Ground Floor", "First Floor", "Second Floor", "Third Floor"] };
  }
  if (/^(?:(?:there is|there are|it has|the building has) )?(?:a )?basement (?:a )?ground floor and (?:two|2) upper floors?$/.test(description)) {
    return { kind: "proposal", units: ["Basement", "Ground Floor", "First Floor", "Second Floor"] };
  }
  if (/^(?:(?:there are|it has|the building has) )?(?:two|2) shops on the ground floor and (?:three|3) flats above$/.test(description)) {
    return { kind: "mixed", shops: 2, flats: 3 };
  }
  return { kind: "clarify" };
}