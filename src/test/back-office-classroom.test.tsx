import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import BackOfficeClassroom from "@/pages/BackOfficeClassroom";

afterEach(cleanup);

it("Phase 1A selections remain local and never navigate to operational work", () => {
  const initialAddress = window.location.href;
  render(<BackOfficeClassroom />);
  for (const section of ["Permissions", "Contacts", "Compliance", "Papers", "Units"]) {
    fireEvent.click(screen.getByRole("button", { name: section }));
    expect(window.location.href).toBe(initialAddress);
    expect(screen.getByRole("button", { name: section }).getAttribute("aria-pressed")).toBe("true");
  }
  fireEvent.click(screen.getByRole("button", { name: "The Keeper — Permissions" }));
  expect(screen.getByRole("button", { name: "Permissions" }).getAttribute("aria-pressed")).toBe("true");
  expect(screen.getByRole("button", { name: "Units" }).getAttribute("aria-pressed")).toBe("false");
  expect(window.location.href).toBe(initialAddress);
});