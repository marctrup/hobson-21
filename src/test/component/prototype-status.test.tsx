import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import PrototypeStatus from "@/pages/PrototypeStatus";

vi.mock("leaflet", () => {
  const layerGroup = { addTo: () => layerGroup, clearLayers: vi.fn() };
  const map = { fitBounds: () => map, setView: () => map, getSize: () => ({ x: 800, y: 600 }), invalidateSize: vi.fn(), remove: vi.fn(), flyTo: vi.fn(), flyToBounds: vi.fn(), getZoom: () => 6, on: vi.fn(), off: vi.fn(), project: (c: number[]) => ({ x: c[1] * 100, y: c[0] * 100, distanceTo() { return 999; }, add() { return this; }, divideBy() { return this; } }), unproject: () => [0, 0], getBounds: () => ({ contains: () => true }) };
  return { default: {
    map: () => map,
    tileLayer: () => ({ addTo: () => ({}) }),
    control: { zoom: () => ({ addTo: () => ({}) }) },
    layerGroup: () => layerGroup,
    divIcon: vi.fn(),
    marker: () => { const mk: any = { bindTooltip: () => mk, on: () => mk, addTo: () => ({}) }; return mk; },
    point: () => ({ add() { return this; }, divideBy() { return this; } }),
  } };
});
vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });

const ask = (text: string) => {
  fireEvent.change(screen.getByRole("textbox", { name: "Ask Hobson" }), { target: { value: text } });
  fireEvent.click(screen.getByRole("button", { name: "Send message" }));
};

describe("Prototype Status: dynamic portfolio signals", () => {
  it("offers no way to record or update a situation from +", () => {
    render(<PrototypeStatus />);
    fireEvent.click(screen.getByRole("button", { name: "Chat actions" }));
    const menu = screen.getByRole("dialog");
    expect(within(menu).getByRole("button", { name: "Add a Note" })).toBeEnabled();
    expect(within(menu).queryByRole("button", { name: /situation|tenancy|available/i })).toBeNull();
  });

  it("shows all four independent signals with counts", () => {
    render(<PrototypeStatus />);
    fireEvent.click(screen.getByRole("button", { name: "Map filters" }));
    const panel = screen.getByRole("group", { name: "Map signals" });
    expect(within(panel).getByRole("button", { name: /All signals\s*20/ })).toBeInTheDocument();
    expect(within(panel).getByRole("button", { name: /^No papers\s*10/ })).toBeInTheDocument();
    expect(within(panel).getByRole("button", { name: /^Tenancy ending\s*2/ })).toBeInTheDocument();
    expect(within(panel).getByRole("button", { name: /^No new occupancy\s*7/ })).toBeInTheDocument();
    expect(within(panel).getByRole("button", { name: /^Available to let\s*4/ })).toBeInTheDocument();
  });

  it("answers which Units are available without calling them empty", () => {
    render(<PrototypeStatus />);
    ask("Which Units are available to let?");
    expect(screen.getByText(/4 Units are available to let/)).toBeInTheDocument();
    expect(screen.getByText(/does not mean the Unit is necessarily empty/)).toBeInTheDocument();
  });

  it("does not record a tenancy ending from contractual term expiry alone", () => {
    render(<PrototypeStatus />);
    ask("The tenancy on the 1st Floor at The Exchange ends on 30 September 2027.");
    fireEvent.click(screen.getByRole("button", { name: "Only the contractual term end date" }));
    expect(screen.getByText(/term end date alone does not confirm/)).toBeInTheDocument();
    expect(screen.queryByText(/Done — the 1st Floor at The Exchange/)).toBeNull();
  });

  it("confirms a tenancy ending in chat and reveals its place card", () => {
    render(<PrototypeStatus />);
    ask("The tenancy on the 1st Floor at The Exchange ends on 30 September 2027.");
    fireEvent.click(screen.getByRole("button", { name: "Confirmed tenancy ending" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm tenancy ending" }));
    expect(screen.getByText(/Done — the 1st Floor at The Exchange now carries a confirmed tenancy ending/)).toBeInTheDocument();
    const card = screen.getByRole("region", { name: "The Exchange Unit signals" });
    const row = within(card).getByText("1st Floor").closest("li")!;
    expect(within(row).getByText("Tenancy ending")).toBeInTheDocument();
    expect(within(row).getByText(/No physical departure inferred/)).toBeInTheDocument();
  });

  it("adds availability without changing tenancy or occupancy facts", () => {
    render(<PrototypeStatus />);
    ask("Mark the 2nd Floor at 1 Linear Park as available to let.");
    fireEvent.click(screen.getByRole("button", { name: "Confirm available to let" }));
    expect(screen.getByText(/now carries a purple TO LET badge/)).toBeInTheDocument();
    const card = screen.getByRole("region", { name: "1 Linear Park Unit signals" });
    const row = within(card).getByText("2nd Floor").closest("li")!;
    expect(within(row).getByText("Available to let")).toBeInTheDocument();
    expect(within(row).queryByText("No new occupancy")).toBeNull();
  });

  it("saves a note from the + menu", () => {
    render(<PrototypeStatus />);
    fireEvent.click(screen.getByRole("button", { name: "Chat actions" }));
    fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Add a Note" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Your note" }), { target: { value: "Keys with the porter" } });
    fireEvent.click(screen.getByRole("button", { name: "Save note" }));
    expect(screen.getByText(/I've kept that on file for the 1st Floor/)).toBeInTheDocument();
  });
});
