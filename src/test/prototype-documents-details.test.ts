import { describe, expect, it } from "vitest";
import { answerEffective, correctDetail, emptyReview, shownValue } from "@/pages/prototypeDocumentsDetails";

const get = (r: typeof emptyReview, k: string) => r.details.find((d) => d.key === k)!;

describe("Documents Stage 2", () => {
  it("reads the lease's actual dates and parties", () => {
    expect(get(emptyReview, "paperDate").read).toBe("22 August 2025");
    expect(get(emptyReview, "termEnd").read).toBe("21 August 2035");
    expect(get(emptyReview, "tenant").read).toBe("SYSTEMIQ LIMITED");
  });
  it("never treats the effective date as established until asked", () => {
    expect(emptyReview.effective).toBe("asking");
    expect(emptyReview.effectiveValue).toBeNull();
  });
  it("Not sure leaves the effective date unconfirmed", () => {
    const r = answerEffective(emptyReview, "unsure");
    expect(r.effective).toBe("unsure");
    expect(r.effectiveValue).toBeNull();
  });
  it("another effective date keeps the paper date separate", () => {
    const r = answerEffective(emptyReview, "other", "1 September 2025");
    expect(r.effectiveValue).toBe("1 September 2025");
    expect(shownValue(get(r, "paperDate"))).toBe("22 August 2025");
  });
  it("a correction keeps what the paper says", () => {
    const r = correctDetail(emptyReview, "tenant", "Systemiq Ltd");
    expect(shownValue(get(r, "tenant"))).toBe("Systemiq Ltd");
    expect(get(r, "tenant").read).toBe("SYSTEMIQ LIMITED");
    expect(correctDetail(r, "tenant", "  ")).toBe(r);
  });
});
