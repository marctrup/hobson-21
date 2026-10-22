import { describe, expect, it } from "vitest";
import { applyLegal, INITIAL_LEGAL, interpretLegal, recordedForUnit, sharedWithUnit } from "@/pages/prototypeLegalRecords";
import { applyContacts, INITIAL_CONTACTS, interpretContacts, unitPreferences } from "@/pages/prototypeContactsRecords";

describe("legal responsibilities prototype", () => {
  it("records the shared roof against the Unit Group", () => {
    const r = interpretLegal(INITIAL_LEGAL, "Record that we need to establish who is responsible for the shared roof at The Paragon Centre.", null);
    const s = applyLegal(INITIAL_LEGAL, r.action!);
    expect(s.records.find(x => x.id === "roof")?.scope).toEqual({ kind: "group", area: "Shared roof" });
  });

  it("records one electrical record for both Units, then rescopes it to the Flat without duplicating", () => {
    let s = applyLegal(INITIAL_LEGAL, interpretLegal(INITIAL_LEGAL, "Record an electrical safety responsibility for both Units, but we haven't established who is responsible yet.", null).action!);
    expect(s.records.filter(r => r.name === "Electrical safety")).toHaveLength(1);
    expect(sharedWithUnit(s, 1).map(r => r.id)).toContain("electrical-safety");
    s = applyLegal(s, interpretLegal(s, "Actually, that responsibility only concerns Second Floor Flat.", null).action!);
    expect(s.records.filter(r => r.name === "Electrical safety")).toHaveLength(1);
    expect(sharedWithUnit(s, 1)).toHaveLength(0);
    expect(recordedForUnit(s, 1)).toHaveLength(0);
    expect(recordedForUnit(s, 2).map(r => r.id)).toContain("electrical-safety");
  });
});

describe("preferred contractors prototype", () => {
  it("gives the Flat its own plumber while the Gym and group keep ABC", () => {
    const s = applyContacts(INITIAL_CONTACTS, interpretContacts(INITIAL_CONTACTS, "For plumbing at Second Floor Flat, use Flat Plumbing Services instead.", null).action!);
    expect(unitPreferences(s, 2).find(p => p.service === "Plumbing")?.contractor?.name).toBe("Flat Plumbing Services");
    expect(unitPreferences(s, 1).find(p => p.service === "Plumbing")?.contractor?.name).toBe("ABC Plumbing Ltd");
  });

  it("reuses ABC Plumbing rather than creating a second record", () => {
    const s = applyContacts(INITIAL_CONTACTS, interpretContacts(INITIAL_CONTACTS, "Use ABC Plumbing for plumbing at First Floor Gym as well.", null).action!);
    expect(s.contractors.filter(c => c.name.startsWith("ABC"))).toHaveLength(1);
  });

  it("updates the phone number without changing preferences", () => {
    const s = applyContacts(INITIAL_CONTACTS, interpretContacts(INITIAL_CONTACTS, "ABC Plumbing's telephone number is 020 7946 0321.", null).action!);
    expect(s.contractors.find(c => c.id === "abc-plumbing")?.phone).toBe("020 7946 0321");
    expect(s.preferences).toEqual(INITIAL_CONTACTS.preferences);
  });

  it("removing a Unit preference keeps the contractor and its group default", () => {
    let s = applyContacts(INITIAL_CONTACTS, interpretContacts(INITIAL_CONTACTS, "Use ABC Plumbing for plumbing at First Floor Gym as well.", null).action!);
    const reply = interpretContacts(s, "Don't use ABC Plumbing for First Floor Gym anymore.", null);
    s = applyContacts(s, reply.choices![0].action!);
    expect(s.contractors.some(c => c.id === "abc-plumbing")).toBe(true);
    expect(s.preferences.some(p => p.contractorId === "abc-plumbing" && p.scope.kind === "group")).toBe(true);
  });
});
