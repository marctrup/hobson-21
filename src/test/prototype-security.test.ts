import { describe, expect, it } from "vitest";
import { canSeeUnit, initialState, interpret, isRestricted, peopleForPlace, setUnit, visiblePapers, typesFor, INITIAL_PEOPLE } from "@/pages/prototypeSecurityAccess";

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
    const s = say(["Remove Priya's access to all accounting papers.", "Save changes"]);
    const t = typesFor(person(s, "priya").access);
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
});
