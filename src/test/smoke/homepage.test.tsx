import { describe, it, expect } from "vitest";
import { renderWithProviders } from "../utils";
import { Homepage } from "@/components/Homepage";

const FAMILY_OFFICE_CEO =
  "Just used Hobson for the first time as I was updating a tenancy schedule and it was brilliant. Just a simple inquiry, but it means I don’t have to reopen the lease. It saves time.";

const REMOVED_COO_REMARK =
  "Last week I didn’t need to refer to any documentation";

const ASSET_MANAGEMENT_COO =
  "If Hobson stayed as it was it would be bloody helpful - Cant wait to see what’s next";

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
      "Walking down the street, I saw our building and wanted to know the next break. I used my phone and asked Hobson. Amazing"
    );
    expect(container.textContent).toContain(FAMILY_OFFICE_CEO);
    expect(container.textContent).toContain(ASSET_MANAGEMENT_COO);
  });

  it("keeps the remarks to the three supplied attributions and nothing invented", () => {
    const { container } = renderWithProviders(<Homepage />);
    const captions = Array.from(container.querySelectorAll("figcaption")).map(
      (el) => el.textContent?.trim()
    );
    expect(captions).toEqual([
      "CEO of an Asset Management company",
      "CEO of a Family Office",
      "COO of Asset Management company",
    ]);
    expect(container.textContent).not.toContain(REMOVED_COO_REMARK);
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

  it("places the remarks after the benefits and before the closing invitation", () => {
    const { container } = renderWithProviders(<Homepage />);
    const text = container.textContent ?? "";
    const practical = text.indexOf("It saves time.");
    expect(text.indexOf("Evidence you can trust")).toBeLessThan(practical);
    expect(practical).toBeLessThan(text.indexOf("Unlimited capabilities."));
  });
});
