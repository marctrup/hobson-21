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
    expect(screen.queryByRole("status")).toBeNull();
    await user.type(screen.getByRole("textbox"), `${address}{Enter}`);
    expect(within(screen.getByRole("status")).getByText("Awaiting confirmation")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Yes, that's the place" }));
    expect(within(screen.getByRole("status")).getByText("Location confirmed")).toBeInTheDocument();
    expect(within(screen.getByRole("status")).getByText("14 Bedford Square, London, WC1B 3JA")).toBeInTheDocument();
    expect(within(screen.getByRole("log")).queryAllByRole("button")).toHaveLength(0);
    expect(within(screen.getByRole("main")).queryAllByRole("listitem")).toHaveLength(0);
    await user.type(screen.getByRole("textbox"), "Thank you{Enter}");
    expect(within(screen.getByRole("status")).getByText("Location confirmed")).toBeInTheDocument();
  });

  it("clears the proposal on correction, never matches an alternative and allows return to Stanley House", async () => {
    const user = await startGroup();
    const input = screen.getByRole("textbox");
    await user.type(input, `${address}{Enter}`);
    await user.click(screen.getByRole("button", { name: "No, let's check again" }));
    expect(screen.queryByRole("status")).toBeNull();
    await user.type(input, "22 Example Road, Manchester{Enter}");
    expect(within(screen.getByRole("status")).getByText("Location needs verification")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Yes, that's the place" })).toBeNull();
    await user.type(input, `${address}{Enter}`);
    await user.type(input, "Yes, that's the place{Enter}");
    expect(within(screen.getByRole("status")).getByText("Location confirmed")).toBeInTheDocument();
  });

  it("clears retained location when starting a new conversation", async () => {
    const user = await startGroup();
    await user.type(screen.getByRole("textbox"), `${address}{Enter}`);
    await user.click(screen.getByRole("button", { name: "Yes, that's the place" }));
    await user.click(screen.getByRole("button", { name: "A new conversation" }));
    expect(screen.queryByRole("status")).toBeNull();
    expect(screen.getByLabelText("Location map")).toBeInTheDocument();
  });

  it("requires a candidate selection then explicit confirmation for the natural Finchley address", async () => {
    const user = await startGroup();
    await user.type(screen.getByRole("textbox"), "Stanley House 1115 Finchley Road NW11 0QD{Enter}");
    expect(screen.queryByRole("button", { name: "Yes, that's the place" })).toBeNull();
    await user.click(screen.getByRole("button", { name: "Stanley House 1115 Finchley Road, London, NW11 0QD" }));
    expect(within(screen.getByRole("status")).getByText("Awaiting confirmation")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Yes, that's the place" }));
    expect(within(screen.getByRole("status")).getByText("Location confirmed")).toBeInTheDocument();
    expect(within(screen.getByRole("main")).getByText("1115 Finchley Road, London, NW11 0QD")).toBeInTheDocument();
    expect(within(screen.getByRole("log")).queryAllByRole("button")).toHaveLength(0);
  });

  it("keeps partial details for a postcode reply and allows rejection of every candidate", async () => {
    const user = await startGroup();
    await user.type(screen.getByRole("textbox"), "Stanley House Finchley Road{Enter}");
    expect(screen.queryByRole("button", { name: "Yes, that's the place" })).toBeNull();
    await user.type(screen.getByRole("textbox"), "NW11 0QD{Enter}");
    await user.click(screen.getByRole("button", { name: "None of these is right" }));
    expect(screen.queryByRole("status")).toBeNull();
    await user.type(screen.getByRole("textbox"), "Stanley House, 1115 Finchley Road, London, NW11 0QD{Enter}");
    expect(screen.getByRole("button", { name: "Yes, that's the place" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "None of these is right" })).toBeNull();
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

  it("keeps the confirmed location while proposing four Units, then clears both on restart", async () => {
    const user = await confirmedStanley();
    const map = screen.getByLabelText("Location map");
    await user.type(screen.getByRole("textbox"), "Ground, First, Second and Third Floors.{Enter}");
    const proposal = screen.getByRole("region", { name: "Proposed building structure" });
    expect(within(proposal).getAllByRole("listitem").map(item => item.textContent)).toEqual(["Third Floor", "Second Floor", "First Floor", "Ground Floor"]);
    expect(screen.getByLabelText("Location map")).toBe(map);
    expect(within(screen.getByRole("status")).getByText("1115 Finchley Road, London, NW11 0QD")).toBeInTheDocument();
    expect(within(screen.getByRole("main")).queryAllByRole("button")).toHaveLength(0);
    await user.type(screen.getByRole("textbox"), "Create them{Enter}");
    expect(within(proposal).getAllByRole("listitem")).toHaveLength(4);
    await user.click(screen.getByRole("button", { name: "A new conversation" }));
    expect(screen.queryByRole("region", { name: "Proposed building structure" })).toBeNull();
    expect(screen.queryByRole("status")).toBeNull();
    expect(screen.getByLabelText("Location map")).toBe(map);
  });

  it("does not invent five individual Units for mixed shops and flats and permits clarification", async () => {
    const user = await confirmedStanley();
    await user.type(screen.getByRole("textbox"), "There are two shops on the ground floor and three flats above.{Enter}");
    const proposal = screen.getByRole("region", { name: "Proposed building structure" });
    expect(within(proposal).queryAllByRole("listitem")).toHaveLength(0);
    expect(within(proposal).getByText("2 shops · Ground Floor")).toBeInTheDocument();
    expect(within(proposal).getByText("3 flats above")).toBeInTheDocument();
    await user.type(screen.getByRole("textbox"), "An unusual building{Enter}");
    expect(within(proposal).queryAllByRole("listitem")).toHaveLength(0);
    await user.type(screen.getByRole("textbox"), "There is a basement, ground floor and two upper floors.{Enter}");
    expect(within(proposal).getAllByRole("listitem").map(item => item.textContent)).toEqual(["Second Floor", "First Floor", "Ground Floor", "Basement"]);
  });
});