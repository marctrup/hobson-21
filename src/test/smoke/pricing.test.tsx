import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../utils";
import Pricing from "@/pages/Pricing";

describe("Pricing page", () => {
  it("renders without crashing and shows all 4 plans", async () => {
    renderWithProviders(<Pricing />, { route: "/pricing" });
    await waitFor(() => {
      expect(screen.getByText("Foundation")).toBeInTheDocument();
      expect(screen.getByText("Starter")).toBeInTheDocument();
      expect(screen.getByText("Professional")).toBeInTheDocument();
      expect(screen.getByText("Business")).toBeInTheDocument();
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
      expect(screen.getByText(/Enterprise/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Call us/i })).toBeiBeInTheDocument();
    });
  });
});
