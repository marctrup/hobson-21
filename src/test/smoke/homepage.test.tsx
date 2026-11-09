import { describe, it, expect } from "vitest";
import { renderWithProviders } from "../utils";
import { Homepage } from "@/components/Homepage";

const FAMILY_OFFICE_CEO =
  "Just used Hobson for the first time as I was updating a tenancy schedule and it was brilliant. Just a simple inquiry, but it means I don’t have to reopen the lease. It saves time.";

const FAMILY_OFFICE_COO = [
  "Last week I didn’t need to refer to any documentation so it was Friday pm until it was used.",
  "But that doesn’t diminish the value – it’s one of those things that you may not use everyday (although in larger clients you will) but when do use it – it’s wonderful.",
  "And having the documents all so well structured is very valuable too",
];

describe("Homepage", () => {
  it("renders without crashing", () => {
    const { container } = renderWithProviders(<Homepage />);
    expect(container).toBeTruthy();
    expect(container.textContent?.length ?? 0).toBeGreaterThan(0);
  });

  it("does not show the removed 'Start free — no card required' CTA", () => {
    const { container } = renderWithProviders(<Homepage />);
    expect(container.textContent).not.toMatch(/Start free\s*—\s*no card required/i);
  });

  it("shows all three supplied remarks word for word", () => {
    const { container } = renderWithProviders(<Homepage />);
    expect(container.textContent).toContain(
      "Walking down the street, I saw our building and wanted to know the next break. I used my phone. Amazing2"
    );
    expect(container.textContent).toContain(FAMILY_OFFICE_CEO);
    for (const paragraph of FAMILY_OFFICE_COO) {
      expect(container.textContent).toContain(paragraph);
    }
  });

  it("keeps the remarks to the three supplied attributions and nothing invented", () => {
    const { container } = renderWithProviders(<Homepage />);
    const captions = Array.from(container.querySelectorAll("figcaption")).map(
      (el) => el.textContent?.trim()
    );
    expect(captions).toEqual([
      "CEO of a large central London commercial agent",
      "CEO of a Family Office",
      "COO of a Family Office",
    ]);
    expect(container.textContent).not.toMatch(/[★☆]/);
    expect(container.textContent).not.toMatch(/\b\d+(\.\d+)?\s*(out of|\/)\s*5\b/i);
  });

  it("treats the three remarks alike: same blockquote style, no ranked weight", () => {
    const { container } = renderWithProviders(<Homepage />);
    const quotes = Array.from(container.querySelectorAll("blockquote"));
    expect(quotes).toHaveLength(3);
    expect(quotes[0].className).toBe(quotes[1].className);
    expect(quotes[1].className).toBe(quotes[2].className);
  });

  it("sets the longest remark as three paragraphs in the order it was given", () => {
    const { container } = renderWithProviders(<Homepage />);
    const quotes = Array.from(container.querySelectorAll("blockquote"));
    const cooParagraphs = Array.from(quotes[2].querySelectorAll("p")).map(
      (p) => p.textContent
    );
    expect(cooParagraphs).toEqual(FAMILY_OFFICE_COO);
  });

  it("places the remarks after the benefits and before the closing invitation", () => {
    const { container } = renderWithProviders(<Homepage />);
    const text = container.textContent ?? "";
    const practical = text.indexOf("It saves time.");
    expect(text.indexOf("Evidence you can trust")).toBeLessThan(practical);
    expect(practical).toBeLessThan(text.indexOf("Unlimited capabilities."));
  });
});
