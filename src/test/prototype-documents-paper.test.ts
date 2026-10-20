import { describe, expect, it } from "vitest";
import { confirmPaper, emptyPaperJourney, EXAMPLE_LEASE_FILENAME, proposePaper, receivePaper } from "@/pages/prototypeDocumentsPaper";

describe("Documents Stage 1", () => {
  it("proposes Business Lease only for the scripted example", () => {
    const received = receivePaper({ filename: EXAMPLE_LEASE_FILENAME, example: true });
    expect(received.stage).toBe("reading");
    expect(proposePaper(received).paperType).toBe("Business Lease");
  });
  it("does not recognise an arbitrary uploaded PDF", () => {
    const received = receivePaper({ filename: "other.pdf", example: false });
    expect(proposePaper(received).paperType).toBeNull();
    expect(received.stage).toBe("choosing");
  });
  it("stops at confirmation and cannot be confirmed again", () => {
    const proposed = proposePaper(receivePaper({ filename: EXAMPLE_LEASE_FILENAME, example: true }));
    const confirmed = confirmPaper(proposed, "Business Lease");
    expect(confirmed.stage).toBe("complete");
    expect(confirmPaper(confirmed, "Underlease")).toEqual(confirmed);
  });
  it("accepts an amended familiar or plain-language type", () => {
    const choosing = receivePaper({ filename: "paper.pdf", example: false });
    expect(confirmPaper(choosing, "Underlease").paperType).toBe("Underlease");
    expect(confirmPaper({ ...choosing, stage: "other" }, "  Insurance schedule  ").paperType).toBe("Insurance schedule");
  });
  it("does not confirm an empty paper or blank type", () => {
    expect(confirmPaper(emptyPaperJourney, "Business Lease")).toEqual(emptyPaperJourney);
    const choosing = receivePaper({ filename: "paper.pdf", example: false });
    expect(confirmPaper(choosing, " ")).toEqual(choosing);
  });
});