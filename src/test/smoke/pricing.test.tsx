import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../utils";
import Pricing from "@/pages/Pricing";

describe("Pricing page", () => {
  it("renders the hero headline", async () => {
    renderWithProviders(<Pricing />, { route: "/pricing" });
    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 }).textContent).toMatch(
        /Choose Hobson on its own, or Hobson with helping hands/i
      );
    });
  });

  it("shows the two pricing options", async () => {
    renderWithProviders(<Pricing />, { route: "/pricing" });
    await waitFor(() => {
      expect(screen.getAllByText(/on its own/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/helping hands/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Every seat includes/i).length).toBeGreaterThan(0);
    });
  });

  it("renders the calculators and enterprise CTA", async () => {
    renderWithProviders(<Pricing />, { route: "/pricing" });
    await waitFor(() => {
      expect(screen.getAllByLabelText(/Documents/i).length).toBeGreaterThan(0);
      expect(screen.getAllByLabelText(/People/i).length).toBeGreaterThan(0);
    });
    const talk = screen.getByRole("link", { name: /Talk to me/i });
    expect(talk).toHaveAttribute("href", "mailto:info@hobsonschoice.ai");
  });
});
