import { describe, expect, it } from "vitest";
import {
  COMPLIANCE_REQUIREMENTS, CONTRACTOR_PREFERENCES,
  groupPreferences, groupRequirements, unitPreferences, unitRequirements,
} from "../pages/prototypeUnitCompliance";

const PARAGON = "demo-paragon-centre";
const NAME = "The Paragon Centre";

describe("legal responsibilities", () => {
  it("shows the two recorded requirements at Unit Group level", () => {
    const rows = groupRequirements(PARAGON);
    expect(rows.map(r => `${r.name} — ${r.frequency}`)).toEqual(["Legionella — Every 12 months", "Fire alarm servicing — Quarterly"]);
    expect(rows[1].note).toBe("Shared areas only");
    expect(rows.some(r => r.name === "Gas Safety" || r.name === "EICR")).toBe(false);
  });

  it("keeps Legionella as one shared record covering both Units", () => {
    const legionella = COMPLIANCE_REQUIREMENTS.filter(r => r.name === "Legionella");
    expect(legionella).toHaveLength(1);
    expect(legionella[0].scope).toEqual({ kind: "units", units: [1, 2] });
  });

  it("gives First Floor Gym its own Gas Safety plus the shared Legionella", () => {
    const { own, shared } = unitRequirements(PARAGON, 1);
    expect(own.map(r => `${r.name} — ${r.frequency}`)).toEqual(["Gas Safety — Every 12 months"]);
    expect(shared.map(r => r.name)).toEqual(["Legionella"]);
    expect([...own, ...shared].some(r => r.name === "Fire alarm servicing")).toBe(false);
  });

  it("gives Second Floor Flat its own EICR plus the shared Legionella", () => {
    const { own, shared } = unitRequirements(PARAGON, 2);
    expect(own.map(r => `${r.name} — ${r.frequency}`)).toEqual(["EICR — Every 5 years"]);
    expect(shared.map(r => r.name)).toEqual(["Legionella"]);
  });

  it("never adds requirements from classification alone — no HMO licence exists", () => {
    expect(COMPLIANCE_REQUIREMENTS.some(r => r.name === "HMO licence")).toBe(false);
  });

  it("returns nothing for places without records", () => {
    expect(groupRequirements("stanley-finchley")).toEqual([]);
    expect(unitRequirements("stanley-finchley", 1)).toEqual({ own: [], shared: [] });
  });
});

describe("preferred contacts", () => {
  it("shows three shared preferences at Unit Group level, with two Unit-specific exceptions", () => {
    const { shared, unitSpecific } = groupPreferences(PARAGON, NAME);
    expect(shared.map(v => `${v.preference.service}: ${v.contractor.name} (${v.origin})`)).toEqual([
      "Plumbing: ABC Plumbing Ltd (Unit Group default)",
      "Electrical: City Electrical Services (Unit Group default)",
      "Roofing: Skyline Roofing Ltd (Shared areas only)",
    ]);
    expect(unitSpecific.map(v => v.contractor.name)).toEqual(["GymCare Services", "FlatFlow Plumbing Ltd"]);
  });

  it("gives First Floor Gym the group defaults plus its own specialist maintenance", () => {
    const views = unitPreferences(PARAGON, 1, NAME);
    expect(views.map(v => `${v.preference.service}: ${v.contractor.name} (${v.origin})`)).toEqual([
      "Specialist maintenance: GymCare Services (Recorded for this Unit)",
      "Plumbing: ABC Plumbing Ltd (From The Paragon Centre)",
      "Electrical: City Electrical Services (From The Paragon Centre)",
    ]);
    expect(views.some(v => v.contractor.name === "Skyline Roofing Ltd")).toBe(false);
  });

  it("lets the Flat's plumbing exception replace the group default without changing it for the Gym", () => {
    const flat = unitPreferences(PARAGON, 2, NAME);
    expect(flat.map(v => `${v.preference.service}: ${v.contractor.name} (${v.origin})`)).toEqual([
      "Plumbing: FlatFlow Plumbing Ltd (Recorded for this Unit)",
      "Electrical: City Electrical Services (From The Paragon Centre)",
    ]);
    expect(flat.some(v => v.contractor.name === "ABC Plumbing Ltd")).toBe(false);
    const gym = unitPreferences(PARAGON, 1, NAME);
    expect(gym.find(v => v.preference.service === "Plumbing")?.contractor.name).toBe("ABC Plumbing Ltd");
  });

  it("keeps one identity per contractor, referenced by every preference", () => {
    const ids = CONTRACTOR_PREFERENCES.map(p => p.contractorId);
    expect(new Set(ids).size).toBe(5); // five preferences, five distinct contractor identities
    const abc = CONTRACTOR_PREFERENCES.filter(p => p.contractorId === "abc-plumbing");
    expect(abc).toHaveLength(1); // one preference record, one contractor identity
  });
});
