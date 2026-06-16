import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../utils";
import Pricing from "@/pages/Pricing";

describe("Pricing page", () => {
  it("renders without crashing and shows all 4 tiers", async () => {
    renderWithProviders(<Pricing />, { route: "/pricing" });
    await waitFor(() => {
      expect(screen.getAllByText(/Tier 1/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Tier 2/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Tier 3/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Tier 4/i).length).toBeGreaterThan(0);
    });
  });


  it("shows 'Join the waitlist' CTA on every tier", async () => {
    renderWithProviders(<Pricing />, { route: "/pricing" });
    await waitFor(() => {
      const ctas = screen.getAllByRole("button", { name: /Join the waitlist/i });
      expect(ctas.length).toBeGreaterThanOrEqual(4);
    });
  });

  it("does NOT show the 'no card required' CTA copy on Tier 1 card", async () => {
    renderWithProviders(<Pricing />, { route: "/pricing" });
    await waitFor(() => {
      expect(screen.queryByText(/Free 3-day trial.*no card required/i)).not.toBeInTheDocument();
    });
  });
});
