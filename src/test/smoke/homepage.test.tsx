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
});
