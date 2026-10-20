import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import PrototypeUnit from "@/pages/PrototypeUnit";

vi.mock("@/components/prototype/PrototypeGate", () => ({
  PrototypeGate: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("leaflet", () => ({ default: {
  map: () => ({ invalidateSize: vi.fn(), remove: vi.fn(), flyTo: vi.fn(), on: vi.fn(), latLngToContainerPoint: () => ({ x: 200, y: 200 }) }),
  tileLayer: () => ({ addTo: vi.fn() }),
  divIcon: vi.fn(),
  marker: () => ({ addTo() { return this; }, setIcon: vi.fn(), setLatLng: vi.fn(), remove: vi.fn() }),
} }));
vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
vi.stubGlobal("matchMedia", () => ({ matches: false }));

describe("Prototype Unit opening setup", () => {
  it.each([
    "A standalone Unit",
    "A Unit Group with several Units",
    "I'm not sure — help me work it out",
  ])("finishes the opening interaction for %s without creating records", async (choice) => {
    const user = userEvent.setup();
    render(<PrototypeUnit />);
    const conversation = screen.getByRole("log", { name: "Conversation" });
    expect(within(conversation).queryAllByRole("button")).toHaveLength(1);
    await user.click(within(conversation).getByRole("button", { name: "Set up a place →" }));
    expect(within(conversation).getAllByRole("button")).toHaveLength(3);
    await user.click(within(conversation).getByRole("button", { name: choice }));
    expect(within(conversation).queryAllByRole("button")).toHaveLength(0);
    expect(screen.queryAllByRole("textbox")).toHaveLength(1); // Existing chat only, no address forms.
    expect(within(screen.getByRole("main")).queryAllByRole("listitem")).toHaveLength(0);
  });

  it("restarts the invitation and clears the previous setup on a new conversation", async () => {
    const user = userEvent.setup();
    render(<PrototypeUnit />);
    await user.click(screen.getByRole("button", { name: "Set up a place →" }));
    await user.click(screen.getByRole("button", { name: "A standalone Unit" }));
    await user.click(screen.getByRole("button", { name: "A new conversation" }));
    await user.click(screen.getByRole("button", { name: "Set up a place →" }));
    const conversation = screen.getByRole("log", { name: "Conversation" });
    expect(within(conversation).getAllByRole("button")).toHaveLength(3);
    await user.click(screen.getByRole("button", { name: "A Unit Group with several Units" }));
    await user.click(screen.getByRole("button", { name: "A new conversation" }));
    expect(within(conversation).queryAllByRole("button")).toHaveLength(1);
  });

  it("accepts a typed setup reply and selection through the existing composer", async () => {
    const user = userEvent.setup();
    render(<PrototypeUnit />);
    const composer = screen.getByRole("textbox", { name: "Ask Hobson" });
    await user.type(composer, "Set up a place{Enter}");
    const conversation = screen.getByRole("log", { name: "Conversation" });
    expect(within(conversation).getAllByRole("button")).toHaveLength(3);
    await user.type(composer, "A standalone Unit{Enter}");
    expect(within(conversation).queryAllByRole("button")).toHaveLength(0);
    expect(composer).toHaveValue("");
    expect(within(conversation).getAllByText("A standalone Unit")).toHaveLength(1);
    expect(within(screen.getByRole("main")).queryAllByRole("listitem")).toHaveLength(0);
  });

  it("shows Hobson's owl beside every one of his turns, never on user messages", async () => {
    const user = userEvent.setup();
    const { container } = render(<PrototypeUnit />);
    const conversation = screen.getByRole("log", { name: "Conversation" });
    // His opening message carries the owl.
    expect(container.querySelector('[role="log"] img')).not.toBeNull();
    expect(within(conversation).getAllByText("Hobson", { exact: true }).length).toBeGreaterThan(0);

    await user.click(within(conversation).getByRole("button", { name: "Set up a place →" }));
    // Opening message + Hobson's reply to the setup request: two of his turns, two owls.
    expect(container.querySelectorAll('[role="log"] img')).toHaveLength(2);

    await user.click(within(conversation).getByRole("button", { name: "A standalone Unit" }));
    // A third Hobson turn acknowledges the choice — the owl returns with it.
    expect(container.querySelectorAll('[role="log"] img')).toHaveLength(3);

    // The user's own messages never carry the owl.
    const userTurns = container.querySelectorAll('[role="log"] .self-end');
    expect(userTurns.length).toBeGreaterThan(0);
    userTurns.forEach((turn) => expect(turn.querySelector("img")).toBeNull());
  });
});

describe("Prototype Unit location confirmation", () => {
  const address = "Stanley House, 14 Bedford Square, London, WC1B 3JA";
  async function startGroup() {
    const user = userEvent.setup();
    render(<PrototypeUnit />);
    await user.click(screen.getByRole("button", { name: "Set up a place →" }));
    await user.click(screen.getByRole("button", { name: "A Unit Group with several Units" }));
    return user;
  }

  it("keeps identification proposed until explicit confirmation, retains it and stops without creating records", async () => {
    const user = await startGroup();
    expect(screen.queryByRole("status", { name: "Location status" })).toBeNull();
    await user.type(screen.getByRole("textbox"), `${address}{Enter}`);
    expect(within(screen.getByRole("status", { name: "Location status" })).getByText("Awaiting confirmation")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Yes, that's the place" }));
    expect(within(screen.getByRole("status", { name: "Location status" })).getByText("Location confirmed")).toBeInTheDocument();
    expect(within(screen.getByRole("status", { name: "Location status" })).getByText("14 Bedford Square, London, WC1B 3JA")).toBeInTheDocument();
    expect(within(screen.getByRole("log")).queryAllByRole("button")).toHaveLength(0);
    expect(within(screen.getByRole("main")).queryAllByRole("listitem")).toHaveLength(0);
    await user.type(screen.getByRole("textbox"), "Thank you{Enter}");
    expect(within(screen.getByRole("status", { name: "Location status" })).getByText("Location confirmed")).toBeInTheDocument();
  });

  it("clears the proposal on correction, never matches an alternative and allows return to Stanley House", async () => {
    const user = await startGroup();
    const input = screen.getByRole("textbox");
    await user.type(input, `${address}{Enter}`);
    await user.click(screen.getByRole("button", { name: "No, let's check again" }));
    expect(screen.queryByRole("status", { name: "Location status" })).toBeNull();
    await user.type(input, "22 Example Road, Manchester{Enter}");
    expect(within(screen.getByRole("status", { name: "Location status" })).getByText("Location needs verification")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Yes, that's the place" })).toBeNull();
    await user.type(input, `${address}{Enter}`);
    await user.type(input, "Yes, that's the place{Enter}");
    expect(within(screen.getByRole("status", { name: "Location status" })).getByText("Location confirmed")).toBeInTheDocument();
  });

  it("clears retained location when starting a new conversation", async () => {
    const user = await startGroup();
    await user.type(screen.getByRole("textbox"), `${address}{Enter}`);
    await user.click(screen.getByRole("button", { name: "Yes, that's the place" }));
    await user.click(screen.getByRole("button", { name: "A new conversation" }));
    expect(screen.queryByRole("status", { name: "Location status" })).toBeNull();
    expect(screen.getByLabelText("Location map")).toBeInTheDocument();
  });

  it("proposes a full address directly but still requires explicit confirmation", async () => {
    const user = await startGroup();
    await user.type(screen.getByRole("textbox"), "Stanley House 1115 Finchley Road NW11 0QD{Enter}");
    expect(screen.getByRole("button", { name: "Yes, that's the place" })).toBeInTheDocument();
    expect(within(screen.getByRole("status", { name: "Location status" })).getByText("Awaiting confirmation")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Yes, that's the place" }));
    expect(within(screen.getByRole("status", { name: "Location status" })).getByText("Location confirmed")).toBeInTheDocument();
    expect(within(screen.getByRole("main")).getByText("1115 Finchley Road, London, NW11 0QD")).toBeInTheDocument();
    expect(within(screen.getByRole("log")).queryAllByRole("button").filter(b => b.textContent !== "Continue →")).toHaveLength(0);
  });

  it("keeps partial details for a postcode reply and allows rejection of every candidate", async () => {
    const user = await startGroup();
    await user.type(screen.getByRole("textbox"), "Stanley House Finchley Road{Enter}");
    expect(screen.queryByRole("button", { name: "Yes, that's the place" })).toBeNull();
    await user.type(screen.getByRole("textbox"), "NW11 0QD{Enter}");
    await user.click(screen.getByRole("button", { name: "None of these" }));
    expect(screen.queryByRole("status", { name: "Location status" })).toBeNull();
    await user.type(screen.getByRole("textbox"), "Stanley House, 1115 Finchley Road, London, NW11 0QD{Enter}");
    expect(screen.getByRole("button", { name: "Yes, that's the place" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "None of these" })).toBeNull();
  });

  it("offers four postcode matches initially and lets either extra address be proposed", async () => {
    const user = await startGroup();
    await user.type(screen.getByRole("textbox"), "NW11 0QD{Enter}");
    for (const name of ["Stanley House", "Flat 1, Stanley House", "Flat 2, Stanley House", "Flat 3, Stanley House"]) {
      expect(screen.getByRole("button", { name: `${name} 1115 Finchley Road, London, NW11 0QD` })).toBeInTheDocument();
    }
    expect(screen.queryByRole("button", { name: "1113 Finchley Road London, NW11 0QD" })).toBeNull();
    expect(screen.queryByRole("button", { name: "1117 Finchley Road London, NW11 0QD" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Yes, that's the place" })).toBeNull();
    await user.click(screen.getByRole("button", { name: "Show more addresses" }));
    await user.click(screen.getByRole("button", { name: "1113 Finchley Road London, NW11 0QD" }));
    expect(within(screen.getByRole("status", { name: "Location status" })).getByText("Awaiting confirmation")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "No, let's check again" }));
    await user.type(screen.getByRole("textbox"), "NW11 0QD{Enter}");
    expect(screen.getByRole("button", { name: "Show more addresses" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Show more addresses" }));
    await user.click(screen.getByRole("button", { name: "1117 Finchley Road London, NW11 0QD" }));
    await user.click(screen.getByRole("button", { name: "Yes, that's the place" }));
    expect(within(screen.getByRole("status", { name: "Location status" })).getByText("1117 Finchley Road")).toBeInTheDocument();
    expect(within(screen.getByRole("status", { name: "Location status" })).getByText("Location confirmed")).toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Proposed building structure" })).toBeNull();
  });

  it.each([true, false])("resolves the Flat 2 intention before confirming the location (whole building: %s)", async whole => {
    const user = await startGroup();
    await user.type(screen.getByRole("textbox"), "NW11 0QD{Enter}");
    await user.click(screen.getByRole("button", { name: "Flat 2, Stanley House 1115 Finchley Road, London, NW11 0QD" }));
    expect(screen.queryByRole("button", { name: "Yes, that's the place" })).toBeNull();
    expect(within(screen.getByRole("status", { name: "Location status" })).queryByText("Location confirmed")).toBeNull();
    await user.click(screen.getByRole("button", { name: whole ? "The whole of Stanley House" : "Just Flat 2" }));
    expect(within(screen.getByRole("status", { name: "Location status" })).getByText(whole ? "Stanley House" : "Flat 2, Stanley House")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Yes, that's the place" }));
    expect(within(screen.getByRole("status", { name: "Location status" })).getByText("Location confirmed")).toBeInTheDocument();
    await user.type(screen.getByRole("textbox"), "4 offices{Enter}");
    expect(Boolean(screen.queryByRole("region", { name: "Proposed building structure" }))).toBe(whole);
  });

  it("requires the same intention decision for a typed Flat 2 address and preserves a missing-postcode continuation", async () => {
    const user = await startGroup();
    await user.type(screen.getByRole("textbox"), "Flat 2 Stanley House NW11 0QD{Enter}");
    expect(screen.getByRole("button", { name: "Just Flat 2" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Yes, that's the place" })).toBeNull();
    await user.type(screen.getByRole("textbox"), "The whole of Stanley House{Enter}");
    await user.click(screen.getByRole("button", { name: "No, let's check again" }));
    await user.type(screen.getByRole("textbox"), "Stanley House Finchley Road{Enter}");
    await user.type(screen.getByRole("textbox"), "NW11 0QD{Enter}");
    expect(screen.queryByRole("button", { name: "Show more addresses" })).toBeNull();
    expect(screen.getByRole("button", { name: "Flat 3, Stanley House 1115 Finchley Road, London, NW11 0QD" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "None of these" }));
    expect(screen.queryByRole("status", { name: "Location status" })).toBeNull();
  });
});

describe("Prototype Unit proposed building", () => {
  async function confirmedStanley() {
    const user = userEvent.setup();
    render(<PrototypeUnit />);
    await user.click(screen.getByRole("button", { name: "Set up a place →" }));
    await user.click(screen.getByRole("button", { name: "A Unit Group with several Units" }));
    await user.type(screen.getByRole("textbox"), "Stanley House, 1115 Finchley Road, London, NW11 0QD{Enter}");
    await user.click(screen.getByRole("button", { name: "Yes, that's the place" }));
    return user;
  }

  it("proposes twelve typed Units from a short answer, keeping the map and explicit confirmation", async () => {
    const user = await confirmedStanley();
    const map = screen.getByLabelText("Location map");
    await user.type(screen.getByRole("textbox"), "11 flats and a shop{Enter}");
    const proposal = screen.getByRole("region", { name: "Proposed building structure" });
    expect(within(proposal).getAllByRole("listitem")).toHaveLength(12);
    expect(within(proposal).getAllByText(/^Residential/)).toHaveLength(11);
    expect(within(proposal).getByText(/^Commercial/)).toBeInTheDocument();
    expect(screen.getByLabelText("Location map")).toBe(map);
    expect(within(screen.getByRole("status", { name: "Location status" })).getByText("Location confirmed")).toBeInTheDocument();
    expect(within(screen.getByRole("main")).queryAllByRole("button", { name: /create/i })).toHaveLength(0);
    expect(within(proposal).getByText("12 Units · 11 Residential · 1 Commercial")).toBeInTheDocument();
    expect(screen.getByText(/I've called them Flat 1 to Flat 11 and Shop for now/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Just number them" }));
    expect(within(proposal).getByText("11")).toBeInTheDocument();
    expect(within(proposal).getByText("Shop")).toBeInTheDocument();
    await user.type(screen.getByRole("textbox"), "Call them Apartments 1 to 11. Call the shop Ground Floor Shop.{Enter}");
    expect(within(proposal).getByText("Apartment 11")).toBeInTheDocument();
    expect(within(proposal).getByText("Ground Floor Shop")).toBeInTheDocument();
    expect(within(proposal).getByText("Nothing created yet")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "A new conversation" }));
    expect(screen.queryByRole("region", { name: "Proposed building structure" })).toBeNull();
    expect(screen.queryByRole("status", { name: "Location status" })).toBeNull();
    expect(screen.getByLabelText("Location map")).toBe(map);
  });

  it("retains the twelve-unit total through a kinds follow-up without individual questions", async () => {
    const user = await confirmedStanley();
    await user.type(screen.getByRole("textbox"), "12 units{Enter}");
    expect(within(screen.getByRole("main")).queryAllByRole("listitem")).toHaveLength(0);
    await user.click(screen.getByRole("button", { name: "A mixture" }));
    expect(within(screen.getByRole("main")).queryAllByRole("listitem")).toHaveLength(0);
    await user.type(screen.getByRole("textbox"), "9 residential and 3 commercial{Enter}");
    expect(screen.getByText(/9 residential flats and 3 commercial units/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Let me describe them" }));
    await user.type(screen.getByRole("textbox"), "The flats are numbered 101 to 109{Enter}");
    expect(screen.getByText("Flat 109")).toBeInTheDocument();
  });

  it("accepts a typed kinds answer after a bare total", async () => {
    const user = await confirmedStanley();
    await user.type(screen.getByRole("textbox"), "12 units{Enter}");
    await user.type(screen.getByRole("textbox"), "All offices{Enter}");
    const proposal = screen.getByRole("region", { name: "Proposed building structure" });
    expect(within(proposal).getAllByRole("listitem")).toHaveLength(12);
    expect(within(proposal).getByText("Office 12")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Yes, those names are fine" }));
    expect(within(proposal).getByText("Proposed structure")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "This structure is right" }));
    expect(screen.getByText("Stanley House is ready. I've got the location and all 12 Units. Shall I add it to your portfolio?")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Ready to create" })).toBeInTheDocument();
  });

  it("does not assume floors are Units and retains floor context through two short clarifications", async () => {
    const user = await confirmedStanley();
    await user.type(screen.getByRole("textbox"), "ground floor and three upper floors{Enter}");
    const proposal = screen.getByRole("region", { name: "Proposed building structure" });
    expect(within(proposal).queryAllByRole("listitem")).toHaveLength(0);
    await user.type(screen.getByRole("textbox"), "One separate space on each floor{Enter}");
    expect(within(proposal).queryAllByRole("listitem")).toHaveLength(0);
    await user.type(screen.getByRole("textbox"), "Offices{Enter}");
    expect(within(proposal).getAllByRole("listitem")).toHaveLength(4);
    expect(within(proposal).getByText("Commercial · Ground Floor")).toBeInTheDocument();
    expect(within(proposal).getByText("Commercial · Third Floor")).toBeInTheDocument();
  });

  it("proposes names for mixed uses and preserves useful locations without requiring repetition", async () => {
    const user = await confirmedStanley();
    await user.type(screen.getByRole("textbox"), "There are two shops on the ground floor and three flats above.{Enter}");
    const proposal = screen.getByRole("region", { name: "Proposed building structure" });
    expect(within(proposal).getAllByRole("listitem")).toHaveLength(5);
    expect(within(proposal).getAllByText("Commercial · Ground Floor")).toHaveLength(2);
    expect(within(proposal).getAllByText("Residential · Above ground floor")).toHaveLength(3);
    await user.type(screen.getByRole("textbox"), "4 offices{Enter}");
    expect(within(proposal).getAllByRole("listitem")).toHaveLength(4);
    expect(within(proposal).getByText("Office 4")).toBeInTheDocument();
    expect(within(proposal).queryByText("Proposed structure · names chosen")).toBeNull();
  });

  it("keeps chat and pencil edits on one proposal, with undo and live totals", async () => {
    const user = await confirmedStanley();
    await user.type(screen.getByRole("textbox"), "11 flats and a shop{Enter}");
    await user.click(screen.getByRole("button", { name: "Yes, those names are fine" }));
    const proposal = screen.getByRole("region", { name: "Proposed building structure" });
    await user.type(screen.getByRole("textbox"), "Rename Flat 1 to Garden Flat{Enter}");
    expect(screen.getByText(/Done\. I've renamed Flat 1 to Garden Flat\./)).toBeInTheDocument();
    await user.click(within(proposal).getByRole("button", { name: "Edit Flat 2" }));
    const name = within(proposal).getByLabelText("Name");
    await user.clear(name); await user.type(name, "Studio");
    await user.click(within(proposal).getByRole("button", { name: "Commercial" }));
    await user.click(within(proposal).getByRole("button", { name: "Save" }));
    expect(within(proposal).getByText("Garden Flat")).toBeInTheDocument();
    expect(within(proposal).getByText("12 Units · 10 Residential · 2 Commercial")).toBeInTheDocument();
    await user.type(screen.getByRole("textbox"), "Add another shop{Enter}");
    expect(within(proposal).getByText("13 Units · 10 Residential · 3 Commercial")).toBeInTheDocument();
    await user.type(screen.getByRole("textbox"), "Remove Flat 11{Enter}");
    expect(within(proposal).queryByText("Flat 11")).toBeNull();
    await user.click(within(proposal).getByRole("button", { name: "Undo" }));
    expect(within(proposal).getByText("Flat 11")).toBeInTheDocument();
    expect(within(proposal).getByText("Studio")).toBeInTheDocument();
    await user.type(screen.getByRole("textbox"), "Remove the flat{Enter}");
    expect(screen.getByText(/Which one should I remove/)).toBeInTheDocument();
    expect(within(proposal).getByText("13 Units · 10 Residential · 3 Commercial")).toBeInTheDocument();
  });

  it("adds, edits and removes Units manually without chat narration, and Hobson sees manual additions", async () => {
    const user = await confirmedStanley();
    await user.type(screen.getByRole("textbox"), "11 flats and a shop{Enter}");
    await user.click(screen.getByRole("button", { name: "Yes, those names are fine" }));
    const proposal = screen.getByRole("region", { name: "Proposed building structure" });
    const log = screen.getByRole("log");
    const before = within(log).getAllByText("Hobson").length;
    await user.click(within(proposal).getByRole("button", { name: "Add another Unit" }));
    expect(within(proposal).getByLabelText("New Unit name")).toHaveValue("Shop 2");
    await user.click(within(proposal).getByRole("button", { name: "Save" }));
    expect(within(proposal).getByText("13 Units · 11 Residential · 2 Commercial")).toBeInTheDocument();
    await user.click(within(proposal).getByRole("button", { name: "More for Flat 3" }));
    await user.click(await screen.findByRole("menuitem", { name: "Remove" }));
    expect(within(proposal).queryByText("Flat 3")).toBeNull();
    expect(within(proposal).getByText("Flat 4")).toBeInTheDocument();
    expect(within(proposal).getByText("12 Units · 10 Residential · 2 Commercial")).toBeInTheDocument();
    await user.click(within(proposal).getByRole("button", { name: "Undo" }));
    expect(within(proposal).getByText("Flat 3")).toBeInTheDocument();
    expect(within(log).getAllByText("Hobson")).toHaveLength(before);
    await user.type(screen.getByRole("textbox"), "Rename the two shops Ground Floor East and Ground Floor West.{Enter}");
    expect(within(proposal).getByText("Ground Floor East")).toBeInTheDocument();
    expect(within(proposal).getByText("Ground Floor West")).toBeInTheDocument();
    expect(within(proposal).getByText("13 Units · 11 Residential · 2 Commercial")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "This structure is right" })).toBeInTheDocument();
  });

  it("moves Units up and down through the menu, keeping identity, totals and order through Hobson's edits", async () => {
    const user = await confirmedStanley();
    await user.type(screen.getByRole("textbox"), "11 flats and a shop{Enter}");
    await user.click(screen.getByRole("button", { name: "Yes, those names are fine" }));
    const proposal = screen.getByRole("region", { name: "Proposed building structure" });
    const names = () => within(proposal).getAllByRole("listitem").map(li => li.querySelector("p")?.textContent);
    await user.click(within(proposal).getByRole("button", { name: "More for Flat 1" }));
    expect(await screen.findByRole("menuitem", { name: "Move up" })).toHaveAttribute("data-disabled");
    await user.keyboard("{Escape}");
    for (let i = 0; i < 11; i++) {
      await user.click(within(proposal).getByRole("button", { name: "More for Shop" }));
      await user.click(await screen.findByRole("menuitem", { name: "Move up" }));
    }
    expect(names().slice(0, 2)).toEqual(["Shop", "Flat 1"]);
    expect(within(proposal).getByText("12 Units · 11 Residential · 1 Commercial")).toBeInTheDocument();
    await user.type(screen.getByRole("textbox"), "Rename Flat 1 to Garden Flat{Enter}");
    expect(names().slice(0, 2)).toEqual(["Shop", "Garden Flat"]);
  });

  it("keeps edits through another change, creates once on authority and retains the group across a new setup", async () => {
    const user = await confirmedStanley();
    await user.type(screen.getByRole("textbox"), "11 flats and a shop{Enter}");
    await user.click(screen.getByRole("button", { name: "Yes, those names are fine" }));
    await user.type(screen.getByRole("textbox"), "Add another shop{Enter}");
    await user.click(screen.getByRole("button", { name: "This structure is right" }));
    expect(screen.getByText(/all 13 Units\. Shall I add it/)).toBeInTheDocument();
    const ready = screen.getByRole("region", { name: "Ready to create" });
    expect(within(ready).getByText("13 Units · 11 Residential · 2 Commercial")).toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Stanley House Unit Group" })).toBeNull();
    await user.click(screen.getByRole("button", { name: "Make another change" }));
    await user.type(screen.getByRole("textbox"), "Rename Flat 1 to Garden Flat{Enter}");
    expect(screen.getByRole("region", { name: "Proposed building structure" })).toBeInTheDocument();
    expect(screen.getByText("Shop 2")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "This structure is right" }));
    await user.click(screen.getByRole("button", { name: "Create this structure" }));
    expect(screen.getByText("Done. Stanley House is now in your portfolio with 13 Units. Here it is on the map — select the marker whenever you'd like to step back inside.")).toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Stanley House Unit Group" })).toBeNull();
    expect(screen.getByRole("button", { name: "Open Stanley House" })).toBeInTheDocument();
    expect(screen.queryByText(/Proposed structure/)).toBeNull();
    expect(screen.queryByRole("button", { name: "Create this structure" })).toBeNull();
    expect(screen.queryByRole("button", { name: "View on map" })).toBeNull();
    await user.click(screen.getByRole("button", { name: "Set up another place" }));
    expect(screen.getByRole("button", { name: "A Unit Group with several Units" })).toBeInTheDocument();
    expect(screen.getAllByRole("region", { name: "Stanley House Unit Group" })).toHaveLength(1);
  });

  it("asks for two counts, never treating blank as zero, and lays out Units ready for editing", async () => {
    const user = await confirmedStanley();
    expect(screen.getByText("How many Units are there at Stanley House?")).toBeInTheDocument();
    const cont = screen.getByRole("button", { name: "Continue →" });
    await user.type(screen.getByLabelText("Residential Units"), "11");
    expect(cont).toBeDisabled();
    await user.type(screen.getByLabelText("Commercial Units"), "1");
    expect(screen.getByText("12 Units in total")).toBeInTheDocument();
    await user.click(cont);
    expect(screen.getByText("I've laid out 12 Units — 11 residential and one commercial. I've suggested names for them. Have a look on the right.")).toBeInTheDocument();
    const proposal = screen.getByRole("region", { name: "Proposed building structure" });
    expect(within(proposal).getByText("Flat 11")).toBeInTheDocument();
    expect(within(proposal).getByText("Shop")).toBeInTheDocument();
    expect(screen.queryByLabelText("Residential Units")).toBeNull();
    expect(screen.getByRole("button", { name: "This structure is right" })).toBeInTheDocument();
  });

  it("rejects zero overall and accepts counts typed in conversation", async () => {
    const user = await confirmedStanley();
    await user.type(screen.getByLabelText("Residential Units"), "0");
    await user.type(screen.getByLabelText("Commercial Units"), "0");
    expect(screen.getByRole("button", { name: "Continue →" })).toBeDisabled();
    await user.type(screen.getByRole("textbox", { name: "Ask Hobson" }), "4 residential and 2 commercial{Enter}");
    const proposal = screen.getByRole("region", { name: "Proposed building structure" });
    expect(within(proposal).getByText("6 Units · 4 Residential · 2 Commercial")).toBeInTheDocument();
  });

  it("returns to the full map on creation and opens the group beneath the map from the marker", async () => {
    const user = await confirmedStanley();
    await user.type(screen.getByLabelText("Residential Units"), "11");
    await user.type(screen.getByLabelText("Commercial Units"), "1");
    await user.click(screen.getByRole("button", { name: "Continue →" }));
    await user.click(screen.getByRole("button", { name: "This structure is right" }));
    await user.click(screen.getByRole("button", { name: "Create this structure" }));
    expect(screen.queryByRole("region", { name: "Stanley House Unit Group" })).toBeNull();
    expect(screen.getByLabelText("Location map")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Open Stanley House" }));
    const group = screen.getByRole("region", { name: "Stanley House Unit Group" });
    expect(within(group).getAllByRole("listitem")).toHaveLength(12);
    expect(screen.getByLabelText("Location map")).toBeInTheDocument();
    await user.click(within(group).getByRole("button", { name: "Back to map" }));
    expect(screen.queryByRole("region", { name: "Stanley House Unit Group" })).toBeNull();
    expect(screen.getByRole("button", { name: "Open Stanley House" })).toBeInTheDocument();
  });
});
