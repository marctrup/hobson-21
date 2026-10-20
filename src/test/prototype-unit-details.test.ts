import { describe, expect, it } from "vitest";
import { proposeCounts, type ProposedUnit } from "@/pages/prototypeUnitStructure";
import { applyChanges, interpretDetails, proposeChanges, setDetails, summaryLine, suggestDescription } from "@/pages/prototypeUnitDetails";

const base = () => { const p = proposeCounts(11, 1); if (p.kind !== "proposal") throw new Error(); return p.units as ProposedUnit[]; };

describe("Unit details", () => {
  it("Test A: keeps one Unit's details, including zero and No as real answers", () => {
    const u = setDetails(base(), 1, { doubleBedrooms: 2, bathrooms: 1, outsideSpace: "Yes", description: "Two-double-bedroom flat.", singleBedrooms: 0 });
    expect(u[0].details).toEqual({ doubleBedrooms: 2, bathrooms: 1, outsideSpace: "Yes", description: "Two-double-bedroom flat.", singleBedrooms: 0 });
    expect(u[1].details).toBeUndefined();
  });
  it("Test B: copies only the chosen facts to Flats 2–6 and leaves other details alone", () => {
    let u = setDetails(base(), 1, { doubleBedrooms: 2, bathrooms: 1, area: 700, outsideSpace: "Yes" });
    u = setDetails(u, 3, { description: "Corner flat" });
    const patch = { doubleBedrooms: 2, bathrooms: 1 };
    const changes = proposeChanges(u, [2, 3, 4, 5, 6], patch);
    u = applyChanges(u, patch, changes);
    for (const n of [2, 3, 4, 5, 6]) expect(u[n - 1].details).toMatchObject({ doubleBedrooms: 2, bathrooms: 1 });
    expect(u[2].details?.description).toBe("Corner flat");
    expect(u[1].details?.area).toBeUndefined();
    expect(u[1].details?.outsideSpace).toBeUndefined();
    expect(u[6].details).toBeUndefined();
  });
  it("flags values that would be replaced", () => {
    const u = setDetails(base(), 2, { bathrooms: 2 });
    const c = proposeChanges(u, [2], { bathrooms: 1 });
    expect(c).toEqual([{ unit: 2, name: "Flat 2", field: "bathrooms", from: "2", to: "1", replaces: true }]);
  });
  it("Test C: understands 'Flats 7 to 11 all have one double bedroom and one bathroom'", () => {
    const r = interpretDetails("Flats 7 to 11 all have one double bedroom and one bathroom.", base());
    if (r?.kind !== "proposal") throw new Error("no proposal");
    expect(r.targets).toEqual([7, 8, 9, 10, 11]);
    expect(r.patch).toEqual({ doubleBedrooms: 1, bathrooms: 1 });
    const u = applyChanges(base(), r.patch, r.changes);
    expect(u.slice(6, 11).every(x => x.details?.doubleBedrooms === 1 && x.details?.bathrooms === 1)).toBe(true);
  });
  it("reads one Unit's sentence without inventing single bedrooms, and suggests a factual description", () => {
    const r = interpretDetails("Flat 1 has two double bedrooms, one bathroom and a balcony.", base());
    if (r?.kind !== "proposal") throw new Error();
    expect(r.patch.doubleBedrooms).toBe(2);
    expect(r.patch.bathrooms).toBe(1);
    expect(r.patch.outsideSpace).toBe("Yes");
    expect(r.patch.singleBedrooms).toBeUndefined();
    expect(r.patch.description).toBe("Two-double-bedroom flat with one bathroom and a balcony.");
  });
  it("applies 'all the flats have outside space' only to residential Units", () => {
    const r = interpretDetails("All the flats have outside space", base());
    if (r?.kind !== "proposal") throw new Error();
    expect(r.targets).toHaveLength(11);
  });
  it("asks which description when none exists to share", () => {
    expect(interpretDetails("Give Flats 1 to 4 the same description", base())?.kind).toBe("question");
  });
  it("never offers bedrooms for commercial Units and won't describe without facts", () => {
    const shop = base()[11];
    expect(interpretDetails("The Shop has two bathrooms", base())?.kind).toBe("question");
    expect(suggestDescription(shop, {})).toBeNull();
    expect(summaryLine({ ...base()[0], details: { doubleBedrooms: 2, bathrooms: 1 } })).toBe("Residential · 2 double bedrooms · 1 bathroom");
  });
});

import { copyDescription, groupedNames, unitSpecificPhrases } from "@/pages/prototypeUnitDetails";
describe("Reusing a description", () => {
  const text = "Two-bedroom flat with a fitted kitchen, one bathroom and a separate living room.";
  it("copies the exact text to Flats 4, 6 and 8 only, leaving other details and later edits independent", () => {
    let u = setDetails(base(), 2, { description: text, bathrooms: 1 });
    u = copyDescription(u, text, [4, 6, 8], []);
    expect([4, 6, 8].map(n => u[n - 1].details)).toEqual([{ description: text }, { description: text }, { description: text }]);
    u = setDetails(u, 2, { description: "Changed" });
    expect(u[3].details?.description).toBe(text);
    expect(groupedNames(["Flat 4", "Flat 6", "Flat 8"])).toBe("Flats 4, 6 and 8");
  });
  it("never overwrites a different existing description without approval", () => {
    const u = setDetails(base(), 4, { description: "Mine" });
    expect(copyDescription(u, text, [4], [])[3].details?.description).toBe("Mine");
    expect(copyDescription(u, text, [4], [4])[3].details?.description).toBe(text);
  });
  it("flags floor positions and the Unit's own name", () => {
    expect(unitSpecificPhrases("Flat 2 is a first floor flat", base()[1])).toEqual(expect.arrayContaining(["Flat 2", "first floor"]));
  });
});
