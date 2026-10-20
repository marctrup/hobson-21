import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import PrototypeUnit from "@/pages/PrototypeUnit";

vi.mock("@/components/prototype/PrototypeGate", () => ({
  PrototypeGate: ({ children }: { children: React.ReactNode }) => children,
}));

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

  it("shows Hobson's owl beside his opening message only, never on user messages", async () => {
    const user = userEvent.setup();
    const { container } = render(<PrototypeUnit />);
    const conversation = screen.getByRole("log", { name: "Conversation" });
    const openingOwl = container.querySelector('[role="log"] img');
    expect(openingOwl).not.toBeNull();
    expect(within(conversation).getAllByText("Hobson", { exact: true }).length).toBeGreaterThan(0);

    await user.click(within(conversation).getByRole("button", { name: "Set up a place →" }));
    await user.click(within(conversation).getByRole("button", { name: "A standalone Unit" }));

    // Only the conversation's opening message carries the owl; user messages never do.
    const owls = container.querySelectorAll('[role="log"] img');
    expect(owls).toHaveLength(1);
    const userTurns = container.querySelectorAll('[role="log"] .self-end');
    expect(userTurns.length).toBeGreaterThan(0);
    userTurns.forEach((turn) => expect(turn.querySelector("img")).toBeNull());
  });
});