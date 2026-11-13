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

describe("Prototype Status: Unoccupied read from papers", () => {
  it("offers no way to record or update a situation from +", () => {
    render(<PrototypeStatus />);
    fireEvent.click(screen.getByRole("button", { name: "Chat actions" }));
    const menu = screen.getByRole("dialog");
    expect(within(menu).getByRole("button", { name: "Add a Note" })).toBeEnabled();
    expect(within(menu).queryByRole("button", { name: /situation/i })).toBeNull();
  });

  it("filters show both reasons with counts and no Available", () => {
    render(<PrototypeStatus />);
    fireEvent.click(screen.getByRole("button", { name: "Unoccupied filters" }));
    const panel = screen.getByRole("group", { name: "Unoccupied" });
    expect(within(panel).getByRole("button", { name: /All unoccupied\s*17/ })).toBeInTheDocument();
    expect(within(panel).getByRole("button", { name: /^No papers\s*10/ })).toBeInTheDocument();
    expect(within(panel).getByRole("button", { name: /^Chain ended\s*7/ })).toBeInTheDocument();
    expect(within(panel).queryByText("Available")).toBeNull();
  });

  it("answers which Units have no papers", () => {
    render(<PrototypeStatus />);
    fireEvent.change(screen.getByRole("textbox", { name: "Ask Hobson" }), { target: { value: "Which Units have no papers?" } });
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));
    expect(screen.getByText(/10 Units have no papers assigned to them/)).toBeInTheDocument();
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
