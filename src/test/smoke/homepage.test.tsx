import { describe, it, expect } from "vitest";
import { renderWithProviders } from "../utils";
import { Homepage } from "@/components/Homepage";

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

  it("shows both supplied remarks word for word", () => {
    const { container } = renderWithProviders(<Homepage />);
    expect(container.textContent).toContain(
      "I was very impressed by where you have got to."
    );
    expect(container.textContent).toContain(
      "Just used Hobson for the first time as I was updating a tenancy schedule and it was brilliant. Just a simple inquiry, but it means I don’t have to reopen the lease. It saves time."
    );
  });

  it("keeps the remarks to the two supplied attributions and nothing invented", () => {
    const { container } = renderWithProviders(<Homepage />);
    const captions = Array.from(container.querySelectorAll("figcaption")).map(
      (el) => el.textContent?.trim()
    );
    expect(captions).toEqual(["Early customer feedback", "CEO"]);
    expect(container.textContent).not.toMatch(/[★☆]/);
    expect(container.textContent).not.toMatch(/\b\d+(\.\d+)?\s*(out of|/)\s*5\b/i);
  });

  it("places the remarks after the benefits and before the closing invitation", () => {
    const { container } = renderWithProviders(<Homepage />);
    const text = container.textContent ?? "";
    const practical = text.indexOf("It saves time.");
    expect(text.indexOf("Evidence you can trust")).toBeLessThan(practical);
    expect(practical).toBeLessThan(text.indexOf("Unlimited capabilities."));
  });
});
