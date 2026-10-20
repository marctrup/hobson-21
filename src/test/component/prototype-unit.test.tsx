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
    expect(conversation.children).toHaveLength(1); // Only the scroll anchor, no prepared transcript.
    await user.click(screen.getByRole("button", { name: "Add a Unit or Unit Group" }));
    expect(within(conversation).getAllByRole("button")).toHaveLength(3);
    await user.click(within(conversation).getByRole("button", { name: choice }));
    expect(within(conversation).queryAllByRole("button")).toHaveLength(0);
    expect(conversation.children).toHaveLength(4); // Prompt, user selection, acknowledgement, anchor.
    expect(screen.queryAllByRole("textbox")).toHaveLength(1); // Existing chat only, no address forms.
    expect(within(screen.getByRole("main")).queryAllByRole("listitem")).toHaveLength(0);
  });

  it("restarts with one fresh choice set and clears setup on a new conversation", async () => {
    const user = userEvent.setup();
    render(<PrototypeUnit />);
    const start = screen.getByRole("button", { name: "Add a Unit or Unit Group" });
    await user.click(start);
    await user.click(screen.getByRole("button", { name: "A standalone Unit" }));
    await user.click(start);
    const conversation = screen.getByRole("log", { name: "Conversation" });
    expect(within(conversation).getAllByRole("button")).toHaveLength(3);
    await user.click(screen.getByRole("button", { name: "A Unit Group with several Units" }));
    expect(conversation.children).toHaveLength(7);
    await user.click(screen.getByRole("button", { name: "A new conversation" }));
    expect(conversation.children).toHaveLength(1);
    expect(within(conversation).queryAllByRole("button")).toHaveLength(0);
  });
});