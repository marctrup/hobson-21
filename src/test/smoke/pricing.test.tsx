import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../utils";
import Pricing from "@/pages/Pricing";

describe("Pricing page", () => {
  it("renders the hero headline", async () => {
    renderWithProviders(<Pricing />, { route: "/pricing" });
    await waitFor(() => {
      expect(screen.getByText(/No plans\./i)).toBeInTheDocument();
      expect(screen.getByText(/No credits\./i)).toBeInTheDocument();
      expect(screen.getByText(/Nothing counted\./i)).toBeInTheDocument();
    });
  });

  it("shows the two-costs section", async () => {
    renderWithProviders(<Pricing />, { route: "/pricing" });
    await waitFor(() => {
      expect(screen.getAllByText(/A seat for each person/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Learning your documents/i).length).toBeGreaterThan(0);
    });
  });

  it("renders the calculators and closing CTA", async () => {
    renderWithProviders(<Pricing />, { route: "/pricing" });
    await waitFor(() => {
      expect(screen.getByLabelText(/People/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Documents/i)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Work out your price/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Meet the team/i })).toBeInTheDocument();
    });
  });
});
