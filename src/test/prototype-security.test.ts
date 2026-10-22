import { describe, expect, it } from "vitest";
import { setColleague, unreadablePapers, accessGroups, areaChips, canSeeUnit, groupKeyFor, initialState, interpret, isRestricted, paperChip, peopleForPlace, placeChips, setUnit, typesFor, visiblePeople, visiblePapers, INITIAL_PEOPLE, type Person } from "@/pages/prototypeSecurityAccess";

const say = (texts: string[]) => texts.reduce((s, t) => interpret(s, t).state, initialState());
const person = (s: ReturnType<typeof initialState>, id: string) => s.people.find((p) => p.id === id)!;

describe("prototype security", () => {
  it("opens with 8 people, 2 invitations and 3 restricted", () => {
    const s = initialState();
    expect(s.people.filter((p) => p.status !== "invited")).toHaveLength(8);
    expect(s.people.filter((p) => p.status === "invited")).toHaveLength(2);
    expect(s.people.filter((p) => p.status !== "invited" && isRestricted(p))).toHaveLength(3);
  });
  it("a single Unit never grants the rest of the building", () => {
    const a = setUnit({ portfolio: false, groups: {}, papers: "all", areas: { papers: "view", people: "none", compliance: "none", reading: "none" } }, "stanley", "Flat 6", true);
    expect(canSeeUnit(a, "stanley", "Flat 6")).toBe(true);
    expect(canSeeUnit(a, "stanley", "Flat 8")).toBe(false);
  });
  it("adding Flat 8 waits for confirmation, then saves", () => {
    const pending = say(["Give James access to Flat 8 at Stanley House."]);
    expect(canSeeUnit(person(pending, "james").access, "stanley", "Flat 8")).toBe(false);
    const saved = interpret(pending, "Save changes").state;
    expect(canSeeUnit(person(saved, "james").access, "stanley", "Flat 8")).toBe(true);
  });
  it("removing accounting papers removes only those", () => {
    const s = say(["Remove James's access to all accounting papers.", "Save changes"]);
    const t = typesFor(person(s, "james").access);
    expect(t).not.toContain("service-charge-accounts");
    expect(t).toContain("business-lease");
  });
  it("papers need both place and type; other Units are withheld", () => {
    const emily = INITIAL_PEOPLE.find((p) => p.id === "emily")!;
    const v = visiblePapers(emily.access);
    expect(v.some((x) => /Flat 6/.test(x.title))).toBe(false);
    const dov = v.find((x) => /Deed of Variation/.test(x.title))!;
    expect(dov.partial).toBe(true);
    expect(dov.title).not.toMatch(/Unit 3/);
  });
  it("suspension keeps permissions and can be restored", () => {
    const s = say(["Suspend Tom's access.", "Suspend access"]);
    expect(person(s, "tom").status).toBe("suspended");
    expect(person(s, "tom").access.groups.stanley).toEqual(["Flat 6", "Flat 8"]);
    expect(person(interpret(interpret(s, "Restore Tom's access").state, "Restore access").state, "tom").status).toBe("active");
  });
  it("cancelling an invitation removes it", () => {
    const s = say(["Cancel Mark's invitation.", "Cancel invitation"]);
    expect(s.people.some((p) => p.id === "mark")).toBe(false);
  });
  it("won't suspend your own access", () => {
    const s = say(["Suspend Sarah's access."]);
    expect(person(s, "sarah").status).toBe("active");
    expect(s.pending).toBeNull();
  });
  it("invites a contractor with view-only compliance at one building", () => {
    const s = say(["Invite a contractor", "Ben Hale", "ben@halefire.co.uk", "Give access to Stanley House", "Review the invitation", "Send invitation"]);
    const ben = s.people.find((p) => p.name === "Ben Hale")!;
    expect(ben.status).toBe("invited");
    expect(ben.access.areas.compliance).toBe("view");
    expect(ben.access.areas.papers).toBe("none");
    expect(Object.keys(ben.access.groups)).toEqual(["stanley"]);
  });
  it("invitations without places can't be sent", () => {
    const s = say(["Invite Ruth", "ruth@example.com", "Review the invitation"]);
    expect(s.pending).toBeNull();
  });
  it("lists who can access Burlington Gardens with scope", () => {
    const rows = peopleForPlace(initialState().people, "burlington");
    expect(rows.find((r) => r.person.id === "emily")!.scope).toBe("Unit 1 and Unit 2");
    expect(rows.find((r) => r.person.id === "james")!.scope).toBe("All 4 Units");
  });
  it("splits people into Superuser, Admin, Full Access and Limited Access", () => {
    const active = INITIAL_PEOPLE.filter((p) => p.status !== "invited");
    expect(accessGroups(active).map((g) => [g.key, g.title, g.people.length])).toEqual([["superuser", "Superuser", 1], ["admin", "Admin", 2], ["full", "Full Access", 1], ["limited", "Limited Access", 4]]);
    const nobody: Person = { id: "x", name: "New Contractor", role: "Contractor", email: "n@example.co.uk", status: "active", access: { portfolio: false, groups: {}, papers: [], areas: { papers: "none", people: "none", compliance: "none", reading: "none" } } };
    expect(groupKeyFor(nobody)).toBe("limited");
  });
  it("finds people by place, role or area without matching everyone", () => {
    const active = INITIAL_PEOPLE.filter((p) => p.status !== "invited");
    expect(accessGroups(active, "flat 8").flatMap((g) => g.people.map((p) => p.name))).toEqual(["Tom Walsh"]);
    expect(accessGroups(active, "solicitor").flatMap((g) => g.people.map((p) => p.name))).toEqual(["Emily Clarke"]);
    const compliance = accessGroups(active, "compliance").flatMap((g) => g.people.map((p) => p.id));
    expect(compliance).toEqual(expect.arrayContaining(["james", "hannah"]));
    expect(compliance).not.toContain("emily");
  });
  it("shows each place and paper remit as short chips", () => {
    const james = INITIAL_PEOPLE.find((p) => p.id === "james")!;
    expect(placeChips(james.access)).toEqual([{ label: "Burlington Gardens", detail: "All 4 Units" }, { label: "Stanley House", detail: "Flat 6" }]);
    expect(paperChip(INITIAL_PEOPLE.find((p) => p.id === "daniel")!.access).label).toBe("Accounting papers");
    expect(areaChips(james.access).map((x) => x.area)).toEqual(["papers", "people", "compliance", "reading"]);
  });
  it("keeps a large team scannable behind Show all", () => {
    const many: Person[] = Array.from({ length: 20 }, (_, i) => ({ id: `p${i}`, name: `Person ${i}`, role: "Manager", email: `p${i}@example.co.uk`, status: "active", access: { portfolio: false, groups: { nugent: ["Shop"] }, papers: [], areas: { papers: "view", people: "none", compliance: "none", reading: "none" } } }));
    expect(accessGroups(many).map((g) => g.people.length)).toEqual([20]);
    expect(visiblePeople(many, false, false)).toHaveLength(6);
    expect(visiblePeople(many, true, false)).toHaveLength(20);
    expect(visiblePeople(many, false, true)).toHaveLength(20);
  });
  it("only Superusers and Admins can read Valuation Reports and Loan Agreements", () => {
    const st = initialState();
    expect(unreadablePapers(person(st, "james"))).toEqual(expect.arrayContaining(["Valuation Reports", "Loan Agreements"]));
    expect(unreadablePapers(person(st, "oliver"))).toEqual([]);
    expect(unreadablePapers(person(st, "sarah"))).toEqual([]);
  });
  it("a Superuser can restrict an Admin from a colleague, but not a non-Admin", () => {
    const st = initialState();
    expect(setColleague(person(st, "priya"), "professor", false).blockedColleagues).toContain("professor");
    expect(setColleague(person(st, "oliver"), "professor", true).blockedColleagues).not.toContain("professor");
    expect(setColleague(person(st, "james"), "architect", false).blockedColleagues).toBeUndefined();
  });
});
