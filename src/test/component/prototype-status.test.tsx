import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import PrototypeStatus from "@/pages/PrototypeStatus";

vi.mock("leaflet", () => {
  const layerGroup = { addTo: () => layerGroup, clearLayers: vi.fn() };
  const map = { fitBounds: () => map, invalidateSize: vi.fn(), remove: vi.fn(), flyTo: vi.fn(), flyToBounds: vi.fn(), getZoom: () => 6, on: vi.fn(), off: vi.fn(), project: (c: number[]) => ({ x: c[1] * 100, y: c[0] * 100, distanceTo() { return 999; }, add() { return this; }, divideBy() { return this; } }), unproject: () => [0, 0], getBounds: () => ({ contains: () => true }) };
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

const field = () => screen.getByRole("group", { name: "How the Unit stands today" });

function openRecordForm() {
  fireEvent.click(screen.getByRole("button", { name: "Chat actions" }));
  // the menu item shares its words with Hobson's offered answer, so click it inside the menu
  fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Record the Unit's current situation" }));
}

describe("Prototype Status at unit level", () => {
  it("opens with a few Units already showing situations, combinations included", () => {
    render(<PrototypeStatus />);
    expect(screen.getByText(/The map already shows how a few of your other Units stand/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Current situation filters" })).toBeInTheDocument();
  });

  it("opens the situation form straight away, listing neither places nor Units", () => {
    render(<PrototypeStatus />);
    openRecordForm();
    expect(screen.getByText(/What is the current situation with the 1st Floor\?/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Colmore Gate" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Ground Floor Shop" })).toBeNull();
    expect(field()).toBeInTheDocument();
  });

  it("records the Unit we are standing at and puts it on the map", () => {
    render(<PrototypeStatus />);
    openRecordForm();
    fireEvent.click(within(field()).getByRole("button", { name: "Unoccupied" }));
    fireEvent.click(within(field()).getByRole("button", { name: "Available" }));
    fireEvent.click(within(field()).getByRole("button", { name: "Put it on the map" }));
    expect(screen.getByText(/The 1st Floor is unoccupied and available — recorded by you today/)).toBeInTheDocument();
    // the filters stay folded behind a small round button until touched
    expect(screen.queryByRole("group", { name: "Current situation" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Current situation filters" }));
    expect(screen.getByRole("group", { name: "Current situation" })).toBeInTheDocument();
  });

  it("reads the record back with who made it and when, separate from papers", () => {
    render(<PrototypeStatus />);
    openRecordForm();
    fireEvent.click(within(field()).getByRole("button", { name: "Being refurbished" }));
    fireEvent.click(within(field()).getByRole("button", { name: "Put it on the map" }));
    fireEvent.change(screen.getByLabelText("Ask Hobson"), { target: { value: "What's the situation here?" } });
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));
    const log = within(screen.getByRole("log", { name: "Conversation" }));
    expect(log.getByText(/Recorded by Marc T on 13 November 2026/)).toBeInTheDocument();
    expect(log.getByText(/not something read from papers/)).toBeInTheDocument();
  });

  it("offers no situation pills after recording — the map marker carries that", () => {
    render(<PrototypeStatus />);
    openRecordForm();
    fireEvent.click(within(field()).getByRole("button", { name: "Unoccupied" }));
    fireEvent.click(within(field()).getByRole("button", { name: "Put it on the map" }));
    expect(screen.queryByRole("button", { name: "What's the situation here?" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Show me everything vacant" })).toBeNull();
  });

  it("opens one combined card for a place — every Unit with its situation inline, nothing in chat", () => {
    render(<PrototypeStatus />);
    const before = within(screen.getByRole("log", { name: "Conversation" })).getAllByText(/./).length;
    fireEvent.click(screen.getByRole("button", { name: "Search your places" }));
    fireEvent.click(screen.getByRole("button", { name: /St Pauls House/ }));
    const card = screen.getByRole("region", { name: "St Pauls House situations" });
    expect(within(card).getByText("Here is what I have here.")).toBeInTheDocument();
    // every Unit of the place is listed, recorded or not
    for (const unit of ["5th Floor", "4th Floor", "Part 2nd Floor", "Car Park"]) {
      expect(within(card).getByText(unit)).toBeInTheDocument();
    }
    // the 5th Floor carries all three situations inline, with who and when
    expect(within(card).getByText("Unoccupied")).toBeInTheDocument();
    expect(within(card).getByText("Available")).toBeInTheDocument();
    expect(within(card).getByText("Being refurbished")).toBeInTheDocument();
    expect(within(card).getByText(/Recorded by Marc T on 13 November 2026/)).toBeInTheDocument();
    // unrecorded Units say so, muted — and the chat gained no summary
    expect(within(card).getAllByText("not recorded").length).toBeGreaterThan(0);
    expect(within(screen.getByRole("log", { name: "Conversation" })).getAllByText(/./).length).toBe(before);
  });

  it("clears the record when every situation is unticked", () => {
    render(<PrototypeStatus />);
    openRecordForm();
    fireEvent.click(within(field()).getByRole("button", { name: "Unoccupied" }));
    fireEvent.click(within(field()).getByRole("button", { name: "Put it on the map" }));
    openRecordForm();
    fireEvent.click(within(field()).getByRole("button", { name: "Unoccupied" }));
    fireEvent.click(within(field()).getByRole("button", { name: "Clear situation" }));
    expect(screen.getByText(/I've cleared the recorded situation for the 1st Floor/)).toBeInTheDocument();
  });

  it("removes a label only from the chat header's situation pop-up", () => {
    render(<PrototypeStatus />);
    expect(screen.queryByRole("button", { name: "How the 1st Floor stands" })).toBeNull();
    openRecordForm();
    fireEvent.click(within(field()).getByRole("button", { name: "Unoccupied" }));
    fireEvent.click(within(field()).getByRole("button", { name: "Available" }));
    fireEvent.click(within(field()).getByRole("button", { name: "Put it on the map" }));
    fireEvent.click(screen.getByRole("button", { name: "How the 1st Floor stands" }));
    fireEvent.click(screen.getByRole("button", { name: "Remove Unoccupied" }));
    expect(screen.queryByRole("button", { name: "Remove Unoccupied" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Remove Available" }));
    expect(screen.queryByRole("button", { name: "How the 1st Floor stands" })).toBeNull();
  });
});
