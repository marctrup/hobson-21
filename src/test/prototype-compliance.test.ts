import { describe, expect, it } from "vitest";
import { INITIAL, interpret, positionOf } from "@/pages/prototypeComplianceResponsibilities";

describe("compliance controls prototype", () => {
  it("never gives an event-triggered control a calendar date", () => {
    INITIAL.filter((r) => r.timing === "event").forEach((r) => expect(r.next).toBeNull());
  });
  it("treats an unstated review interval as still to establish", () => {
    expect(positionOf(INITIAL.find((r) => r.id === "leg-bg")!)).toBe("establish");
  });
  it("flags a passed inspection date as needing attention", () => {
    expect(positionOf(INITIAL.find((r) => r.id === "eicr-nt")!)).toBe("attention");
  });
  it("records a Section 13 notice only after confirmation, without a date", () => {
    const ask = interpret(INITIAL, null, "We want to increase the rent at Flat 6.");
    expect(ask.items).toBeUndefined();
    const done = interpret(INITIAL, ask.pending, "Yes, record it");
    const added = done.items!.find((r) => r.name.includes("Flat 6"))!;
    expect(added.timing).toBe("event");
    expect(added.next).toBeNull();
  });
  it("assumes nothing for a place with no records", () => {
    const out = interpret(INITIAL, null, "What about Stanley Mews?");
    expect(out.items).toBeUndefined();
    expect(out.filter?.group).toBe("mews");
  });
});

import { isCustom } from "@/pages/prototypeComplianceResponsibilities";
describe("own renewal frequency", () => {
  it("keeps the legal frequency and marks a business's own change", () => {
    const r = INITIAL.find((x) => x.id === "gas-sh")!;
    expect(isCustom(r)).toBe(false);
    const edited = { ...r, frequency: "Every 6 months" };
    expect(isCustom(edited)).toBe(true);
    expect(edited.legalFrequency).toBe("Every 12 months");
  });
});

import { placeRows, categoryLabel } from "@/pages/prototypeComplianceResponsibilities";

describe("places listed by category", () => {
  const rows = placeRows(INITIAL);
  const cats = (label: string) => rows.find((r) => r.label === label)!.categories.map(categoryLabel);
  it("lists every Unit Group and Unit in order", () => {
    expect(rows.map((r) => r.label)).toEqual([
      "Stanley House", "Flats 1–8",
      "5 Nugent Terrace", "Shop", "Flat 1", "Flat 2",
      "Burlington Gardens", "Ground Floor", "Upper Floors",
      "Stanley Mews", "No. 1", "No. 2",
      "Portfolio",
    ]);
  });
  it("gives each place only the categories it needs", () => {
    expect(cats("Stanley House")).toEqual(["Health & Safety", "Licences", "Accounting", "Notices"]);
    expect(cats("5 Nugent Terrace")).toEqual(["Health & Safety", "Licences"]);
    expect(cats("Shop")).toEqual(["Health & Safety"]);
    expect(cats("Flat 1")).toEqual(["Health & Safety", "Licences"]);
    expect(cats("Ground Floor")).toEqual(["Health & Safety", "Licences"]);
    expect(cats("Upper Floors")).toEqual(["Health & Safety", "Notices"]);
    expect(cats("Portfolio")).toEqual(["Accounting"]);
  });
  it("shows nothing for a place with no controls recorded", () => {
    rows.filter((r) => r.id.startsWith("mews")).forEach((r) => expect(r.categories).toEqual([]));
  });
  it("counts a control for one flat against the block of flats it belongs to", () => {
    const base = INITIAL.find((r) => r.id === "hmo-sh")!;
    expect(placeRows([{ ...base, id: "hmo-6", appliesTo: "Flat 6" }]).find((r) => r.label === "Flats 1–8")!.categories.map(categoryLabel)).toEqual(["Licences"]);
    expect(placeRows([{ ...base, id: "hmo-9", appliesTo: "Flat 9" }]).find((r) => r.label === "Flats 1–8")!.categories.map(categoryLabel)).toEqual([]);
  });
  it("shows one Unit Group alone when one is selected", () => {
    const one = placeRows(INITIAL, "mews");
    expect(one.map((r) => r.label)).toEqual(["Stanley Mews", "No. 1", "No. 2"]);
  });
});

import { placeLiabilities, expandUnits } from "@/pages/prototypeComplianceResponsibilities";
describe("by place, per Unit", () => {
  it("lists Flats 1–8 as eight separate flats", () => {
    expect(expandUnits(["Flats 1–8"])).toEqual(["Flat 1","Flat 2","Flat 3","Flat 4","Flat 5","Flat 6","Flat 7","Flat 8"]);
  });
  it("gives each flat in the block its own HMO licence liability", () => {
    const sh = placeLiabilities(INITIAL).find((p) => p.id === "stanley")!;
    expect(sh.units).toHaveLength(8);
    sh.units.forEach((u) => expect(u.items.find((i) => i.category === "licences")?.names).toEqual(["HMO licence"]));
  });
  it("keeps the shop's EPC off the flats", () => {
    const nt = placeLiabilities(INITIAL).find((p) => p.id === "nugent")!;
    const has = (u: string) => nt.units.find((x) => x.unit === u)!.items.some((i) => i.names.includes("Energy Performance Certificate"));
    expect([has("Shop"), has("Flat 1"), has("Flat 2")]).toEqual([true, false, false]);
  });
});
