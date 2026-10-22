import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PrototypeSecurity from "@/pages/PrototypeSecurity";

describe("prototype security page", () => {
  it("renders the overview and opens a person with a live summary", () => {
    render(<PrototypeSecurity />);
    expect(screen.getByText("People with access")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Open James Carter's access" }));
    expect(screen.getByText("James can currently")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Flat 8" }));
    expect(screen.getByText("Here is what will change")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /View access as James/ }));
    expect(screen.getByText("Hobson as James sees it")).toBeTruthy();
  });
});
