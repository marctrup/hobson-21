import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import PrototypeUnit from "@/pages/PrototypeUnit";

vi.mock("@/components/prototype/PrototypeGate", () => ({ PrototypeGate: ({ children }: { children: React.ReactNode }) => children }));
vi.mock("leaflet", () => ({ default: {
  map: () => ({ invalidateSize: vi.fn(), remove: vi.fn(), flyTo: vi.fn(), on: vi.fn(), latLngToContainerPoint: () => ({ x: 200, y: 200 }) }),
  tileLayer: () => ({ addTo: vi.fn() }), divIcon: vi.fn(),
  marker: () => ({ addTo() { return this; }, setIcon: vi.fn(), setLatLng: vi.fn(), remove: vi.fn() }),
} }));
vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
vi.stubGlobal("matchMedia", () => ({ matches: false }));

const open = async () => { const user = userEvent.setup(); render(<PrototypeUnit />); await user.click(screen.getByRole("button", { name: "Open The Paragon Centre" })); return user; };

describe("The Paragon Centre in place", () => {
  it("lists two Units with the summary 2 Units · 1 Residential · 1 Commercial", async () => {
    await open();
    expect(screen.getByText("2 Units · 1 Residential · 1 Commercial")).toBeInTheDocument();
    expect(screen.getByText("Commercial · Current tenancy recorded")).toBeInTheDocument();
    expect(screen.getByText("Residential · No tenancy recorded")).toBeInTheDocument();
  });

  it("shows the gym's recorded parties and Not recorded for rent and break, separately from its description", async () => {
    const user = await open();
    await user.click(screen.getByRole("button", { name: "What Hobson knows about First Floor Gym" }));
    const occ = screen.getByRole("region", { name: "The occupation" });
    expect(within(occ).getByText("Handhs Limited")).toBeInTheDocument();
    expect(within(occ).getByText("Rotch Property Group Limited")).toBeInTheDocument();
    expect(within(occ).getByText("1 December 2005")).toBeInTheDocument();
    expect(within(occ).getAllByText("Not recorded")).toHaveLength(2);
    expect(within(screen.getByRole("region", { name: "The Unit" })).getByText(/arranged for gym use/)).toBeInTheDocument();
  });

  it("invents no tenant for the Second Floor Flat", async () => {
    const user = await open();
    await user.click(screen.getByRole("button", { name: "What Hobson knows about Second Floor Flat" }));
    const occ = screen.getByRole("region", { name: "The occupation" });
    expect(within(occ).getByText("No tenancy recorded")).toBeInTheDocument();
    expect(within(occ).queryByText("Occupant")).toBeNull();
  });

  it("opens the commercial editor beneath the row without residential fields, and saves into the hover panel", async () => {
    const user = await open();
    await user.click(screen.getByRole("button", { name: "Open First Floor Gym" }));
    expect(screen.getByRole("button", { name: "Back to map" })).toBeInTheDocument();
    expect(screen.queryByRole("group", { name: "Shared facilities" })).toBeNull();
    const d = screen.getByLabelText("Description");
    await user.clear(d); await user.type(d, "Open-plan gym floor.");
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(screen.getByText("Changes saved.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "What Hobson knows about First Floor Gym" }));
    expect(within(screen.getByRole("region", { name: "The Unit" })).getByText("Open-plan gym floor.")).toBeInTheDocument();
  });

  it("opens the residential editor with its illustrative answers and updates Hobson's place", async () => {
    const user = await open();
    await user.click(screen.getByRole("button", { name: "Open Second Floor Flat" }));
    expect(within(screen.getByRole("group", { name: "Shared facilities" })).getByRole("button", { name: "Yes" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByLabelText("Hobson's current place")).toHaveTextContent("The Paragon Centre › Second Floor Flat");
  });
});
