import { describe, expect, it } from "vitest";
import { applyBatch, BATCH_CHECKS, BATCH_STRAIGHT, BATCH_TOTAL, effectivePreferred, INITIAL_DIRECTORY, interpret, relationsOf, type Directory, type Pending } from "@/pages/prototypeContactsDirectory";

function talk(lines: string[], d: Directory = INITIAL_DIRECTORY) {
  let pending: Pending | null = null; let last = "";
  for (const l of lines) { const o = interpret(d, pending, l); if (o.directory) d = o.directory; pending = o.pending; last = o.reply; }
  return { d, pending, last };
}
const addSmith = ["Add John Smith from Smith Plumbing. He's our preferred plumber for Stanley House.", "07700 900123. His email is john@smithplumbing.co.uk.", "Yes"];

describe("Prototype Contacts directory", () => {
  it("adds one contractor with details only after confirmation", () => {
    const before = talk(addSmith.slice(0, 2));
    expect(before.d.contacts.some((c) => c.org === "Smith Plumbing")).toBe(false);
    const { d, last } = talk(addSmith);
    const smith = d.contacts.find((c) => c.org === "Smith Plumbing")!;
    expect(smith.phones).toEqual(["07700 900123"]);
    expect(smith.email).toBe("john@smithplumbing.co.uk");
    expect(effectivePreferred(d, "stanley", "Plumbing")?.relation.contactId).toBe(smith.id);
    expect(last).toMatch(/^Done\./);
  });

  it("reuses a known contractor for another Unit Group instead of duplicating it", () => {
    const { d } = talk([...addSmith, "Make Smith Plumbing the preferred plumber for 5 Nugent Terrace as well.", "Yes"]);
    expect(d.contacts.filter((c) => c.org === "Smith Plumbing")).toHaveLength(1);
    expect(relationsOf(d, "smith-plumbing").map((r) => r.scope)).toEqual([{ kind: "group", group: "stanley" }, { kind: "group", group: "nugent" }]);
  });

  it("records a Unit-specific plumber without replacing the Unit Group's", () => {
    const { d } = talk([...addSmith, "Use a different plumber for Flat 8.", "FlowFix Plumbing, 020 7946 0555", "Yes"]);
    expect(effectivePreferred(d, "stanley", "Plumbing")?.relation.contactId).toBe("smith-plumbing");
    const flat8 = effectivePreferred(d, "stanley", "Plumbing", "Flat 8")!;
    expect(flat8.exception).toBe(true);
    expect(flat8.relation.contactId).toBe("flowfix-plumbing");
    expect(effectivePreferred(d, "stanley", "Plumbing", "Flat 6")?.relation.contactId).toBe("smith-plumbing");
  });

  it("removes a preference but keeps the contact and its other associations", () => {
    const { d } = talk([...addSmith, "Make Smith Plumbing the preferred plumber for 5 Nugent Terrace as well.", "Yes", "Remove Smith Plumbing as preferred plumber for Stanley House.", "Yes"]);
    expect(d.contacts.some((c) => c.id === "smith-plumbing")).toBe(true);
    expect(relationsOf(d, "smith-plumbing").map((r) => r.scope)).toEqual([{ kind: "group", group: "nugent" }]);
  });

  it("gives Sarah a second responsibility on the same record", () => {
    const { d } = talk(["Add Sarah Jones. She's our portfolio manager. Her email is sarah@example.com.", "Yes", "Sarah is also the person we should contact about maintenance at Stanley House.", "Yes"]);
    expect(d.contacts.filter((c) => c.person === "Sarah Jones")).toHaveLength(1);
    expect(relationsOf(d, "sarah-jones")).toHaveLength(2);
  });

  it("records a tenant against the Unit without claiming a tenancy agreement", () => {
    const { d } = talk(["Add Michael Brown as the tenant of Flat 6, Stanley House.", "Yes"]);
    expect(relationsOf(d, "michael-brown")).toEqual([expect.objectContaining({ role: "Tenant", scope: { kind: "unit", group: "stanley", unit: "Flat 6" } })]);
  });

  it("asks before merging a near-matching company", () => {
    const o = interpret(INITIAL_DIRECTORY, null, "Add Tom Lee from Bright Electric. He's our preferred electrician for Burlington Gardens.");
    expect(o.pending?.kind).toBe("same");
    expect(o.directory).toBeUndefined();
  });

  it("spreadsheet: 24 contacts, 17 straightforward, 5 checks, 2 possible duplicates; unsure rows stay out", () => {
    expect(BATCH_TOTAL).toBe(24);
    expect(BATCH_STRAIGHT).toHaveLength(17);
    expect(BATCH_CHECKS.filter((c) => c.group === "check")).toHaveLength(5);
    expect(BATCH_CHECKS.filter((c) => c.group === "duplicate")).toHaveLength(2);
    const answers = Object.fromEntries(BATCH_CHECKS.map((c) => [c.id, c.id === "c-okafor" ? { kind: "unsure" as const } : c.options[0].resolution]));
    const r = applyBatch(INITIAL_DIRECTORY, answers);
    expect(r.added).toHaveLength(21);
    expect(r.updated).toEqual(["Bright Electrical", "Skyline Roofing"]);
    expect(r.unresolved).toEqual(["D. Okafor"]);
    expect(r.directory.contacts.find((c) => c.id === "bright")!.phones).toContain("020 7946 0199");
    expect(r.directory.contacts.some((c) => c.id === "d-okafor")).toBe(false);
  });
});
