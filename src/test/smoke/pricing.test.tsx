import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../utils";
import Pricing from "@/pages/Pricing";

describe("Pricing page", () => {
  it("renders the hero headline", async () => {
    renderWithProviders(<Pricing />, { route: "/pricing" });
    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 }).textContent).toMatch(
        /Have me on my own, or with my team's assistance/i
      );
    });
  });

  it("shows the two pricing options", async () => {
    renderWithProviders(<Pricing />, { route: "/pricing" });
    await waitFor(() => {
      expect(screen.getAllByText(/on my own/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/my team's assistance/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Every seat includes/i).length).toBeGreaterThan(0);
    });
  });

  it("renders the calculators and enterprise CTA", async () => {
    renderWithProviders(<Pricing />, { route: "/pricing" });
    await waitFor(() => {
      expect(screen.getAllByLabelText(/Documents/i).length).toBeGreaterThan(0);
      expect(screen.getAllByLabelText(/People/i).length).toBeGreaterThan(0);
    });
    // The header's Contact link shares the "Talk to me" name — the enterprise
    // CTA is the one that opens Outlook, so match by its mailto href.
    const talk = screen
      .getAllByRole("link", { name: /Talk to me/i })
      .find((el) => el.getAttribute("href")?.startsWith("mailto:"));
    expect(talk).toBeDefined();
    expect(talk).toHaveAttribute("href", "mailto:info@hobsonschoice.ai");
  });
});
