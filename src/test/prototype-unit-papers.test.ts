import { describe, expect, it } from "vitest";
import { knowledgeFor, PARAGON_GROUP_ID } from "@/pages/prototypeUnitPapers";

describe("Unit knowledge from confirmed papers", () => {
  it("describes First Floor Gym from its confirmed lease, without rent, term or parties", () => {
    const [k] = knowledgeFor(PARAGON_GROUP_ID, 1);
    expect(k.paper.premises).toBe("Identified in the lease as the 1st Floor Gym at The Paragon Centre, 3 Reading Lane, London E8 1GQ.");
    expect(`${k.paper.kind} · ${k.paper.dated}`).toBe("Business Lease · 29 November 2005");
    expect(k.paper.premises).not.toMatch(/rent|term|Rotch|Handhs/i);
  });
  it("never links the lease to Stanley House or unconfirmed Units", () => {
    expect(knowledgeFor("stanley-finchley-1", 1)).toEqual([]);
    expect(knowledgeFor(PARAGON_GROUP_ID, 2)).toEqual([]);
  });
});
