import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import PrototypeStatus from "@/pages/PrototypeStatus";

vi.mock("leaflet", () => {
  const layerGroup = { addTo: () => layerGroup, clearLayers: vi.fn() };
  const map = { fitBounds: () => map, invalidateSize: vi.fn(), remove: vi.fn(), flyTo: vi.fn(), flyToBounds: vi.fn() };
  return { default: {
    map: () => map,
    tileLayer: () => ({ addTo: () => ({}) }),
    control: { zoom: () => ({ addTo: () => ({}) }) },
    layerGroup: () => layerGroup,
    divIcon: vi.fn(),
    marker: () => ({ on: () => ({ addTo: () => ({}) }) }),
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
    fireEvent.click(within(field()).getByRole("button", { name: "Vacant" }));
    fireEvent.click(within(field()).getByRole("button", { name: "Available to let" }));
    fireEvent.click(within(field()).getByRole("button", { name: "Put it on the map" }));
    expect(screen.getByText(/The 1st Floor is vacant and available to let — recorded by you today/)).toBeInTheDocument();
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
    expect(screen.getByText(/Recorded by Marc T on 13 November 2026/)).toBeInTheDocument();
    expect(screen.getByText(/not something read from papers/)).toBeInTheDocument();
  });

  it("offers no situation pills after recording — the map marker carries that", () => {
    render(<PrototypeStatus />);
    openRecordForm();
    fireEvent.click(within(field()).getByRole("button", { name: "Vacant" }));
    fireEvent.click(within(field()).getByRole("button", { name: "Put it on the map" }));
    expect(screen.queryByRole("button", { name: "What's the situation here?" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Show me everything vacant" })).toBeNull();
  });

  it("clears the record when every situation is unticked", () => {
    render(<PrototypeStatus />);
    openRecordForm();
    fireEvent.click(within(field()).getByRole("button", { name: "Vacant" }));
    fireEvent.click(within(field()).getByRole("button", { name: "Put it on the map" }));
    openRecordForm();
    fireEvent.click(within(field()).getByRole("button", { name: "Vacant" }));
    fireEvent.click(within(field()).getByRole("button", { name: "Clear situation" }));
    expect(screen.getByText(/I've cleared the recorded situation for the 1st Floor/)).toBeInTheDocument();
  });
});
