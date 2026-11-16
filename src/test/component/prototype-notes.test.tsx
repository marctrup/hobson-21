import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PrototypeNotes from "@/pages/PrototypeNotes";

const placeholder = () => (screen.getByLabelText("Ask Hobson") as HTMLInputElement).placeholder;

function startNoteFromMenu() {
  fireEvent.click(screen.getByRole("button", { name: "Chat actions" }));
  fireEvent.click(screen.getByRole("button", { name: "Add a Note" }));
  return screen.getByRole("dialog", { name: "Add a note" });
}

function choose(dialog: HTMLElement, visibility: "Shared" | "Private", category: "Unit" | "Current occupancy" | "Previous occupancy") {
  fireEvent.click(within(dialog).getByRole("radio", { name: new RegExp(`^${visibility}`) }));
  fireEvent.click(within(dialog).getByRole("radio", { name: new RegExp(`^${category}`) }));
}

function writeAndSave(dialog: HTMLElement, text: string) {
  fireEvent.change(within(dialog).getByLabelText("Your note"), { target: { value: text } });
  fireEvent.click(within(dialog).getByRole("button", { name: "Save note" }));
}

describe("Prototype Notes pop-up", () => {
  it("keeps every creation choice in one pop-up and out of the conversation", () => {
    render(<PrototypeNotes />);
    const dialog = startNoteFromMenu();

    for (const name of [/^Shared/, /^Private/, /^Unit/, /^Current occupancy/, /^Previous occupancy/]) {
      expect(within(dialog).getByRole("radio", { name })).toBeInTheDocument();
    }
    expect(within(dialog).getByLabelText("Your note")).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "Save note" })).toBeDisabled();
    expect(screen.queryByText(/Would you like your note shared/)).toBeNull();
    expect(placeholder()).toBe("Ask me about this unit");
  });

  it("saves a shared current-occupancy note and reveals it in the Notes panel", async () => {
    render(<PrototypeNotes />);
    const dialog = startNoteFromMenu();
    choose(dialog, "Shared", "Current occupancy");
    writeAndSave(dialog, "Car space allocated for free to Mr Mark Jones");

    const panel = await screen.findByRole("region", { name: "Unit notes" });
    const card = within(panel).getByRole("listitem", { name: "Occupancy note" });
    expect(card).toHaveTextContent("Car space allocated for free to Mr Mark Jones");
    expect(card).toHaveTextContent("Current Occupancy");
    expect(screen.queryByRole("dialog", { name: "Add a note" })).toBeNull();
    expect(within(screen.getByRole("log", { name: "Conversation" })).queryByText(/Car space allocated/)).toBeNull();
    expect(screen.getByRole("button", { name: /2 notes for this Unit/i })).toBeInTheDocument();
  });

  it("records a private Unit note", async () => {
    render(<PrototypeNotes />);
    const dialog = startNoteFromMenu();
    choose(dialog, "Private", "Unit");
    writeAndSave(dialog, "The window locks were replaced in March");

    const panel = await screen.findByRole("region", { name: "Unit notes" });
    const card = within(panel).getAllByRole("listitem", { name: "Unit note" })[0];
    expect(card).toHaveTextContent("Private");
    expect(card).toHaveTextContent("The window locks were replaced in March");
  });

  it("requires and records the selected previous occupancy", async () => {
    render(<PrototypeNotes />);
    const dialog = startNoteFromMenu();
    choose(dialog, "Shared", "Previous occupancy");
    fireEvent.change(within(dialog).getByLabelText("Your note"), { target: { value: "Shop fit-out left in place" } });
    expect(within(dialog).getByRole("button", { name: "Save note" })).toBeDisabled();

    fireEvent.change(within(dialog).getByLabelText("Previous occupancy"), { target: { value: "Lease · 4 March 2021 · L’Occitane Limited" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Save note" }));

    const panel = await screen.findByRole("region", { name: "Unit notes" });
    const card = within(panel).getByRole("listitem", { name: "Previous occupancy note" });
    expect(card).toHaveTextContent("L’Occitane Limited");
    expect(card).toHaveTextContent("Shop fit-out left in place");
  });

  it("discards an unfinished note when the pop-up is cancelled", () => {
    render(<PrototypeNotes />);
    const dialog = startNoteFromMenu();
    choose(dialog, "Shared", "Unit");
    fireEvent.change(within(dialog).getByLabelText("Your note"), { target: { value: "Do not keep this" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));

    expect(screen.queryByRole("dialog", { name: "Add a note" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /1 note for this Unit/i }));
    expect(screen.queryByText("Do not keep this")).toBeNull();
  });

  it("opens the pop-up for a typed note request instead of starting a chat questionnaire", async () => {
    render(<PrototypeNotes />);
    fireEvent.change(screen.getByLabelText("Ask Hobson"), { target: { value: "Add a private note that the roof key is with the porter" } });
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));

    const dialog = await screen.findByRole("dialog", { name: "Add a note" });
    expect(within(dialog).getByRole("radio", { name: /^Private/ })).toBeChecked();
    expect(within(dialog).getByLabelText("Your note")).toHaveValue("The roof key is with the porter");
    expect(screen.queryByText(/Would you like your note shared/)).toBeNull();
  });
});

describe("Prototype Notes deleting", () => {
  it("names the note in words instead of showing it again, and removes the icon with the last note", async () => {
    render(<PrototypeNotes />);
    const dialog = startNoteFromMenu();
    choose(dialog, "Shared", "Current occupancy");
    writeAndSave(dialog, "Car space allocated for free");

    const panel = await screen.findByRole("region", { name: "Unit notes" });
    fireEvent.click(within(panel).getByRole("button", { name: "Delete note: Car space allocated for free" }));
    await screen.findByText(/Would you like me to delete this note/);
    expect(screen.getByText(/"Car space allocated for free"/)).toBeInTheDocument();
    expect(within(panel).getByText("Car space allocated for free")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Delete note" }));
    await screen.findByText(/I've deleted that note/);
    expect(screen.getByRole("button", { name: /1 note for this Unit/i })).toBeInTheDocument();

    fireEvent.click(within(panel).getByRole("button", { name: /^Delete note: The porter keeps/ }));
    await screen.findByText(/"The porter keeps/);
    fireEvent.click(screen.getByRole("button", { name: "Delete note" }));
    await waitFor(() => expect(screen.queryByRole("button", { name: /note.*for this Unit/i })).toBeNull());
  });
});

describe("Prototype Notes chat actions", () => {
  it("greys out Upload papers and Record the Unit's current situation as coming soon, leaving Add a Note working", () => {
    render(<PrototypeNotes />);
    fireEvent.click(screen.getByRole("button", { name: "Chat actions" }));
    for (const action of [/Upload papers/, /Record the Unit's current situation/]) {
      const item = screen.getByRole("button", { name: action });
      expect(item).toBeDisabled();
      expect(within(item).getByText("Coming soon")).toBeInTheDocument();
    }
    fireEvent.click(screen.getByRole("button", { name: "Add a Note" }));
    expect(screen.getByRole("dialog", { name: "Add a note" })).toBeInTheDocument();
  });
});
