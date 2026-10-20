import { describe, expect, it } from "vitest";
import { discoverAddress } from "@/pages/prototypeUnitAddress";

describe("Illustrative address discovery", () => {
  it("keeps the natural Finchley address ambiguous", () => {
    expect(discoverAddress("Stanley House 1115 Finchley Road NW11 0QD").records.map(r => r.id)).toEqual(["stanley-finchley", "finchley-number"]);
  });
  it("requests the missing postcode and combines the next reply", () => {
    const partial = discoverAddress("Stanley House Finchley Road");
    expect(partial.outcome).toBe("missing-postcode");
    const completed = discoverAddress("NW11 0QD", partial.parts);
    expect(completed.parts).toEqual({ building: "Stanley House", street: "Finchley Road", postcode: "NW11 0QD", number: undefined, city: undefined });
    expect(completed.records).toHaveLength(2);
  });
  it("returns both illustrative records for the postcode alone", () => {
    expect(discoverAddress("NW11 0QD").records).toHaveLength(2);
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