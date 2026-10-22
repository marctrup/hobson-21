import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PrototypeSecurity from "@/pages/PrototypeSecurity";

describe("prototype security page", () => {
  it("renders the overview and opens a person with a live summary", () => {
    render(<PrototypeSecurity />);
    expect(screen.getByRole("heading", { name: "People with access" })).toBeTruthy();
    // Cards carry the name only: the rights groups above them say who has what.
    expect(screen.getByText("James Carter")).toBeTruthy();
    expect(screen.queryByText("Accounting papers")).toBeNull();
    expect(screen.queryByText("All 4 Units")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Open James Carter's access" }));
    expect(screen.getByText("James can currently")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Flat 8" }));
    expect(screen.getByText("Here is what will change")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /View access as James/ }));
    expect(screen.getByText("Hobson as James sees it")).toBeTruthy();
  });
});
