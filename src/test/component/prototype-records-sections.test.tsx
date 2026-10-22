import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import PrototypeLegal from "@/pages/PrototypeLegal";
import PrototypeContacts from "@/pages/PrototypeContacts";

vi.mock("leaflet", () => ({
  default: {
    map: () => ({ invalidateSize: vi.fn(), panTo: vi.fn(), remove: vi.fn() }),
    tileLayer: () => ({ addTo: vi.fn() }),
    divIcon: vi.fn(),
    marker: () => ({ addTo() { return this; }, on: vi.fn() }),
  },
}));
vi.stubGlobal("ResizeObserver", class {
  observe() {}
  disconnect() {}
});

async function openGroup() {
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: /3 Reading Lane/ }));
  return user;
}

describe("record sections offered by each records prototype", () => {
  it("omits About from the legal prototype while keeping its two record sections", async () => {
    render(<PrototypeLegal />);
    await openGroup();
    expect(screen.queryByRole("button", { name: /About/ })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Legal responsibilities/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Preferred contractors/ })).toBeInTheDocument();
  });

  it("still offers About in the contractors prototype", async () => {
    render(<PrototypeContacts />);
    await openGroup();
    expect(screen.getByRole("button", { name: /About/ })).toBeInTheDocument();
  });
});
