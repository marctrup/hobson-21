import { describe, expect, it } from "vitest";
import { proposalChoices, proposeRelationship, UNSURE, type Relationship } from "./prototypeDocumentsRelationships";
import { answerBelongs, answerMgmt, answerStatus, RELATIONSHIPS, startTenancies, supportChoices, supportProposal } from "./prototypeDocumentsTenancies";

const two: Relationship[] = [
  { id: "a", name: "Acme's lease", parties: ["Acme Limited"], agreementDate: "1 May 2019", reference: "L-100" },
  { id: "b", name: "Beta's lease", parties: ["Beta Limited"], agreementDate: "3 June 2021" },
];

describe("Stage 3: confirm paper relationships", () => {
  it("1. single upload with two existing tenancies proposes one and asks", () => {
    const p = proposeRelationship({ noun: "This side letter", parties: ["Beta Ltd"], refersTo: { date: "3 June 2021", description: "lease" } }, two);
    expect(p.proposed).toBe("b");
    expect(p.needsConfirmation).toBe(true);
  });
  it("reference numbers outweigh shared parties", () => {
    const p = proposeRelationship({ noun: "This deed", parties: ["Beta Limited"], refersTo: { reference: "L-100" } }, two);
    expect(p.proposed).toBe("a");
  });
  it("only one evidenced relationship needs no question", () => {
    expect(proposeRelationship({ noun: "This deed", parties: ["Acme Limited"] }, [two[0]]).needsConfirmation).toBe(false);
  });
  it("no evidence means no proposal", () => {
    expect(proposeRelationship({ noun: "This paper", parties: ["Gamma Limited"] }, two).proposed).toBeNull();
  });
  it("2. batch: each supporting paper gets a proposal against both tenancies", () => {
    for (const id of ["example-2", "example-4"] as const) {
      const p = supportProposal(id);
      expect(p.proposed).toBe("puig");
      expect(p.needsConfirmation).toBe(true);
    }
  });
  it("3 & 4. choosing another tenancy or Not sure changes only the proposal", () => {
    const t = { ...answerStatus(answerMgmt(answerStatus({ ...startTenancies(), step: "puigStatus" }, "puig", "current"), "both"), "sub", "current"), compared: true, step: "licence" as const };
    expect(answerBelongs(t, "sub").belongs["example-2"]).toBe("sub");
    const unsure = answerBelongs(t, UNSURE);
    expect(unsure.belongs["example-2"]).toBe("unsure");
  });
  it("5. Sublease shown under Puig is still independently selectable", () => {
    const answers = supportChoices("example-4").map((c) => c.answer);
    expect(answers).toEqual(["puig", "sub", UNSURE]);
    expect(proposalChoices(proposeRelationship({ noun: "x", parties: [] }, RELATIONSHIPS)).map((c) => c.answer)).toContain("sub");
  });
});
