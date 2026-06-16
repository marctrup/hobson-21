import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../utils";
import ContactUs from "@/pages/ContactUs";

describe("ContactUs page", () => {
  it("renders the contact form with required fields", async () => {
    renderWithProviders(<ContactUs />, { route: "/contact" });
    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getAllByLabelText(/email/i).length).toBeGreaterThanOrEqual(1);
    });
  });
});
