import { describe, expect, it } from "vitest";
import { understandBuilding } from "@/pages/prototypeUnitStructure";

describe("Illustrative building understanding", () => {
  it.each(["Ground, First, Second and Third Floors.", "It has ground floor, first floor, second floor and third floor."])("proposes the four described floors for %s", description => {
    expect(understandBuilding(description)).toEqual({ kind: "proposal", units: ["Ground Floor", "First Floor", "Second Floor", "Third Floor"] });
  });
  it("includes the basement and only the two described upper floors", () => {
    expect(understandBuilding("There is a basement, ground floor and two upper floors.")).toEqual({ kind: "proposal", units: ["Basement", "Ground Floor", "First Floor", "Second Floor"] });
  });
  it("retains shops and flats as counts without inventing individual names or floor assignments", () => {
    expect(understandBuilding("There are two shops on the ground floor and three flats above.")).toEqual({ kind: "mixed", shops: 2, flats: 3 });
  });
  it.each(["Ground, First, Second and Third Floors, with six flats.", "Three floors", "The lease says there are four Units", "A shop spans two floors"])("requires clarification rather than treating floors or papers as Units: %s", description => {
    expect(understandBuilding(description)).toEqual({ kind: "clarify" });
  });
});