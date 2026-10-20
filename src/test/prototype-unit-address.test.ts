import { describe, expect, it } from "vitest";
import { discoverAddress } from "@/pages/prototypeUnitAddress";

describe("Illustrative address discovery", () => {
  it("proposes the full Finchley building address without requiring London", () => {
    expect(discoverAddress("Stanley House 1115 Finchley Road NW11 0QD").records.map(r => r.id)).toEqual(["stanley-finchley"]);
  });
  it("requests the missing postcode and combines the next reply", () => {
    const partial = discoverAddress("Stanley House Finchley Road");
    expect(partial.outcome).toBe("missing-postcode");
    const completed = discoverAddress("NW11 0QD", partial.parts);
    expect(completed.parts).toMatchObject({ building: "Stanley House", street: "Finchley Road", postcode: "NW11 0QD" });
    expect(completed.records.map(r => r.id)).toEqual(["stanley-finchley", "stanley-flat-1", "stanley-flat-2", "stanley-flat-3"]);
  });
  it("returns the six specified simulated addresses for the postcode alone", () => {
    expect(discoverAddress("NW11 0QD").records.map(r => `${r.name}, ${r.line}`)).toEqual([
      "Stanley House, 1115 Finchley Road, London, NW11 0QD",
      "Flat 1, Stanley House, 1115 Finchley Road, London, NW11 0QD",
      "Flat 2, Stanley House, 1115 Finchley Road, London, NW11 0QD",
      "Flat 3, Stanley House, 1115 Finchley Road, London, NW11 0QD",
      "1113 Finchley Road, London, NW11 0QD",
      "1117 Finchley Road, London, NW11 0QD",
    ]);
  });
  it("filters a building name and postcode to the building and its three flats", () => {
    expect(discoverAddress("Stanley House NW11 0QD").records.map(r => r.id)).toEqual(["stanley-finchley", "stanley-flat-1", "stanley-flat-2", "stanley-flat-3"]);
  });
  it("can narrow a supplied flat or neighbouring street number without inventing others", () => {
    expect(discoverAddress("Flat 2 Stanley House NW11 0QD").records.map(r => r.id)).toEqual(["stanley-flat-2"]);
    expect(discoverAddress("1117 Finchley Road NW11 0QD").records.map(r => r.id)).toEqual(["finchley-1117"]);
  });
  it("resolves a complete address to one proposal", () => {
    expect(discoverAddress("Stanley House, 1115 Finchley Road, London, NW11 0QD").records.map(r => r.id)).toEqual(["stanley-finchley"]);
  });
  it("does not fabricate an unknown address or a mismatching street number", () => {
    expect(discoverAddress("22 Example Road, Manchester").records).toHaveLength(0);
    expect(discoverAddress("Stanley House 999 Finchley Road NW11 0QD").records).toHaveLength(0);
    expect(discoverAddress("Stanley House 1115 Finchley Road Manchester NW11 0QD").records).toHaveLength(0);
    const unknown = discoverAddress("22 Example Road, Manchester");
    expect(discoverAddress("NW11 0QD", unknown.parts).records).toHaveLength(0);
  });
  it("does not carry the old postcode into a newly supplied address", () => {
    const old = discoverAddress("Stanley House 1115 Finchley Road NW11 0QD");
    expect(discoverAddress("Stanley House Bedford Square", old.parts).records).toHaveLength(0);
  });
});