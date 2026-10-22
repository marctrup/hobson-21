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
    // The person page carries facts and controls only — no can/cannot narrative.
    expect(screen.queryByText("James can currently")).toBeNull();
    expect(screen.queryByText("James cannot")).toBeNull();
    expect(screen.queryByText("What James can access")).toBeNull();
    // Full Access reads as one clear line, with the details folded away.
    expect(screen.getByText("All locations · All papers")).toBeTruthy();
    expect(screen.queryByText("Flat 8")).toBeNull();
    // Areas of Hobson is admin-only: a Full Access person is about places and papers.
    expect(screen.queryByText("Areas of Hobson")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /Places/ }));
    expect(screen.getByText("Places")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Flat 8" }));
    expect(screen.getByText("Here is what will change")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /View access as James/ }));
    expect(screen.getByText("Hobson as James sees it")).toBeTruthy();
  });

  it("shows a Superuser without a locked-access note", () => {
    render(<PrototypeSecurity />);
    fireEvent.click(screen.getByRole("button", { name: "Open Sarah Mitchell's access" }));
    expect(screen.queryByText(/can't be narrowed here/)).toBeNull();
    expect(screen.queryByText(/Superusers always/)).toBeNull();
  });
});
