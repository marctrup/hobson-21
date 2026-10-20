import { describe, expect, it } from "vitest";
import { namingProposal, numberUnits, renameUnits, understandBuilding } from "@/pages/prototypeUnitStructure";

describe("Illustrative building understanding", () => {
  it("proposes eleven residential flats and one commercial shop, named and numbered", () => {
    const result = understandBuilding("11 flats and a shop");
    expect(result.kind).toBe("proposal");
    if (result.kind !== "proposal") throw new Error("Missing proposal");
    expect(result.units).toHaveLength(12);
    expect(result.units.slice(0, 11)).toEqual(Array.from({ length: 11 }, (_, i) => ({ number: i + 1, name: `Flat ${i + 1}`, type: "Flat", classification: "Residential" })));
    expect(result.units[11]).toEqual({ number: 12, name: "Shop", type: "Shop", classification: "Commercial" });
  });
  it("proposes four named commercial offices", () => {
    const result = understandBuilding("4 offices");
    expect(result.kind).toBe("proposal");
    if (result.kind !== "proposal") throw new Error("Missing proposal");
    expect(result.units.map(u => [u.name, u.classification])).toEqual([["Office 1", "Commercial"], ["Office 2", "Commercial"], ["Office 3", "Commercial"], ["Office 4", "Commercial"]]);
  });
  it("retains a bare total while asking for kinds and accepts a short answer", () => {
    const partial = understandBuilding("12 units");
    expect(partial.kind).toBe("clarify");
    if (partial.kind !== "clarify") throw new Error("Missing clarification");
    expect(partial.total).toBe(12);
    const result = understandBuilding("They're all offices", partial);
    expect(result.kind).toBe("proposal");
    if (result.kind !== "proposal") throw new Error("Missing proposal");
    expect(result.units).toHaveLength(12);
    expect(result.units.every(u => u.type === "Office" && u.classification === "Commercial")).toBe(true);
  });
  it.each(["Ground, First, Second and Third Floors.", "ground floor and three upper floors", "There is a basement, ground floor and two upper floors."])("never turns floors into Units without division and use: %s", text => {
    const result = understandBuilding(text);
    expect(result.kind).toBe("clarify");
    if (result.kind !== "clarify") throw new Error("Unexpected Units");
    expect(result.floors).toHaveLength(4);
    const spaces = understandBuilding("One separate space on each floor", result);
    expect(spaces.kind).toBe("clarify");
    const complete = understandBuilding("Offices", spaces);
    expect(complete.kind).toBe("proposal");
    if (complete.kind !== "proposal") throw new Error("Missing proposal");
    expect(complete.units).toHaveLength(4);
    expect(complete.units.map(u => u.location)).toEqual(result.floors);
  });
  it("uses useful extra floor information without requesting individual names", () => {
    const result = understandBuilding("There are two shops on the ground floor and three flats above.");
    expect(result.kind).toBe("proposal");
    if (result.kind !== "proposal") throw new Error("Missing proposal");
    expect(result.units.map(u => [u.name, u.classification, u.location])).toEqual([
      ["Shop 1", "Commercial", "Ground Floor"], ["Shop 2", "Commercial", "Ground Floor"],
      ["Flat 1", "Residential", "Above ground floor"], ["Flat 2", "Residential", "Above ground floor"], ["Flat 3", "Residential", "Above ground floor"],
    ]);
  });
  it("uses explicit space counts rather than floor counts in a detailed answer", () => {
    const result = understandBuilding("Ground, First, Second and Third Floors, with six flats.");
    expect(result.kind).toBe("proposal");
    if (result.kind !== "proposal") throw new Error("Missing proposal");
    expect(result.units).toHaveLength(6);
    expect(result.units.every(u => !u.location)).toBe(true);
  });
  it("checks conflicting totals rather than dropping reported spaces", () => {
    expect(understandBuilding("11 flats and a shop", understandBuilding("12 units")).kind).toBe("proposal");
    expect(understandBuilding("11 flats", understandBuilding("12 units")).kind).toBe("clarify");
    expect(understandBuilding("11 flats and shops").kind).toBe("clarify");
  });
  it("treats one shop spanning two floors as one space, not two Units", () => {
    const result = understandBuilding("A shop spans two floors");
    expect(result.kind).toBe("proposal");
    if (result.kind !== "proposal") throw new Error("Missing proposal");
    expect(result.units).toEqual([{ number: 1, name: "Shop", type: "Shop", classification: "Commercial" }]);
  });
  it("uses a floor follow-up containing both the division and use", () => {
    const result = understandBuilding("One office on each floor", understandBuilding("ground floor and three upper floors"));
    expect(result.kind).toBe("proposal");
    if (result.kind !== "proposal") throw new Error("Missing proposal");
    expect(result.units).toHaveLength(4);
    expect(result.units[3]).toMatchObject({ name: "Office 4", location: "Third Floor" });
  });
  it.each(["Three floors", "The lease says there are four Units", "An unusual building"])("does not fabricate Units from unclear input: %s", text => {
    expect(understandBuilding(text).kind).toBe("clarify");
  });
  it("proposes names for 11 flats and a shop and accepts bulk renames", () => {
    const r = understandBuilding("It is 11 flats and a shop.");
    if (r.kind !== "proposal") throw new Error("Missing proposal");
    expect(namingProposal(r.units)).toContain("12 Units — 11 residential flats and one commercial shop");
    expect(numberUnits(r.units).map(u => u.name).slice(-2)).toEqual(["11", "Shop"]);
    expect(renameUnits("The flats are numbered 101 to 111.", r.units)?.[10].name).toBe("Flat 111");
    expect(renameUnits("Call the shop Ground Floor Shop.", r.units)?.[11]).toMatchObject({ name: "Ground Floor Shop" });
    expect(renameUnits("Call the shop Ground Floor Shop.", r.units)?.[11].location).toBeUndefined();
  });
  it("asks residential, commercial or mixture for a bare count, then counts", () => {
    const t = understandBuilding("There are 12 units.");
    expect(t).toMatchObject({ kind: "clarify", choices: ["Residential", "Commercial", "A mixture"] });
    const m = understandBuilding("A mixture", t);
    expect(m).toMatchObject({ kind: "clarify", mixture: true });
    const r = understandBuilding("9 residential and 3 commercial", m);
    if (r.kind !== "proposal") throw new Error("Missing proposal");
    expect(r.units.filter(u => u.classification === "Commercial")).toHaveLength(3);
  });
});
