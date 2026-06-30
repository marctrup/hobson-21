import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../utils";
import Pricing from "@/pages/Pricing";

describe("Pricing page", () => {
  it("renders without crashing and shows all 4 plans", async () => {
    renderWithProviders(<Pricing />, { route: "/pricing" });
    await waitFor(() => {
      expect(screen.getAllByText("Foundation").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("Starter").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("Professional").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("Business").length).toBeGreaterThanOrEqual(1);
    });
  });

  it("shows plan CTA buttons", async () => {
    renderWithProviders(<Pricing />, { route: "/pricing" });
    await waitFor(() => {
      const ctas = screen.getAllByRole("button", { name: /Choose /i });
      expect(ctas.length).toBeGreaterThanOrEqual(4);
    });
  });

  it("shows the Enterprise call-us section", async () => {
    renderWithProviders(<Pricing />, { route: "/pricing" });
    await waitFor(() => {
      expect(screen.getAllByText(/Enterprise/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByRole("button", { name: /Call us/i })).toBeInTheDocument();
    });
  });
});
