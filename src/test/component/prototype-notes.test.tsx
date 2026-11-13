import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PrototypeNotes from "@/pages/PrototypeNotes";

const placeholder = () => (screen.getByLabelText("Ask Hobson") as HTMLInputElement).placeholder;

function startNoteFromMenu() {
  fireEvent.click(screen.getByRole("button", { name: "Chat actions" }));
  fireEvent.click(screen.getByRole("button", { name: "Add a Note" }));
}

/** Choose Add a Note and answer both questions, so Hobson is now asking for the note itself. */
async function openNoteToTheContentRequest() {
  startNoteFromMenu();
  expect(placeholder()).toBe("Ask me about this unit");

  fireEvent.click(screen.getByRole("button", { name: "Shared" }));
  await screen.findByRole("button", { name: "Current Occupancy" });
  expect(placeholder()).toBe("Ask me about this unit");

  fireEvent.click(screen.getByRole("button", { name: "Current Occupancy" }));
  await screen.findByLabelText("Your note");
  expect(placeholder()).toBe("Ask me about this unit");
}

/** Give the note through the dedicated field and wait until Hobson has kept it. */
async function giveNote(text: string) {
  fireEvent.change(screen.getByLabelText("Your note"), { target: { value: text } });
  fireEvent.click(screen.getByRole("button", { name: "Save note" }));
  await screen.findByText(/I've added your note/);
  expect(screen.queryByLabelText("Your note")).toBeNull();
}

describe("Prototype Notes composer", () => {
  it("asks for the note only after the last question", async () => {
    render(<PrototypeNotes />);
    expect(placeholder()).toBe("Ask me about this unit");
    await openNoteToTheContentRequest();
    expect(screen.getByText(/tap the microphone on your phone.s keyboard/)).toBeInTheDocument();
  });

  it("stops asking for the note once it has been given", async () => {
    render(<PrototypeNotes />);
    await openNoteToTheContentRequest();
    await giveNote("Car space allocated for free to Mr Mark Jones - no paper work provided");
    const cards = screen.getAllByRole("listitem", { name: /Occupancy note/i });
    expect(cards[0]).toHaveTextContent("Car space allocated for free to Mr Mark Jones - no paper work provided");
  });

  it("saves the note when Enter is pressed in the note field, as a phone keyboard sends it", async () => {
    render(<PrototypeNotes />);
    await openNoteToTheContentRequest();
    fireEvent.change(screen.getByLabelText("Your note"), { target: { value: "Spoken into the phone keyboard" } });
    fireEvent.keyDown(screen.getByLabelText("Your note"), { key: "Enter" });
    await screen.findByText(/I've added your note/);
    expect(screen.queryByLabelText("Your note")).toBeNull();
    expect(screen.getByRole("listitem", { name: /Occupancy note/i })).toHaveTextContent("Spoken into the phone keyboard");
  });

  it("stops asking for the note when the conversation moves on elsewhere", async () => {
    render(<PrototypeNotes />);
    await openNoteToTheContentRequest();
    await giveNote("Car space allocated for free to Mr Mark Jones - no paper work provided");

    // A second note is underway and Hobson has asked for it...
    await openNoteToTheContentRequest();

    // ...but the user presses the header note icon instead: the pending note is dropped.
    fireEvent.click(screen.getByRole("button", { name: /note.*for this Unit/i }));
    await waitFor(() => expect(screen.queryByLabelText("Your note")).toBeNull());
  });
});

describe("Prototype Notes stay in the chat", () => {
  it("keeps notes out of the Papers panel, which holds only read papers", async () => {
    render(<PrototypeNotes />);
    await openNoteToTheContentRequest();
    await giveNote("Car space allocated for free to Mr Mark Jones");

    const papers = screen.getByRole("region", { name: "Papers" });
    expect(within(papers).queryAllByRole("region", { name: "Saved Unit notes" })).toHaveLength(0);
    expect(within(papers).queryByText(/Car space allocated/)).toBeNull();
    expect(within(papers).queryAllByRole("button", { name: /^Delete note/ })).toHaveLength(0);

    // The note itself is still held in the conversation.
    expect(screen.getAllByRole("region", { name: "Saved Unit notes" }).length).toBeGreaterThan(0);
  });
});

describe("Prototype Notes deleting", () => {
  it("names the note in words instead of showing it again, and removes the icon with the last note", async () => {
    render(<PrototypeNotes />);
    expect(screen.queryByRole("button", { name: /note.*for this Unit/i })).toBeNull();

    await openNoteToTheContentRequest();
    await giveNote("Car space allocated for free");

    expect(screen.getByRole("button", { name: /note.*for this Unit/i })).toHaveTextContent("1");
    const cardsBefore = screen.getAllByRole("region", { name: "Saved Unit notes" }).length;

    fireEvent.click(screen.getAllByRole("button", { name: "Delete note: Car space allocated for free" })[0]);
    await screen.findByText(/Would you like me to delete this note/);
    expect(screen.getByText(/"Car space allocated for free"/)).toBeInTheDocument();
    expect(screen.getAllByRole("region", { name: "Saved Unit notes" })).toHaveLength(cardsBefore);

    fireEvent.click(screen.getByRole("button", { name: "Delete note" }));
    await screen.findByText(/I've deleted that note/);
    expect(screen.queryByRole("button", { name: /note.*for this Unit/i })).toBeNull();
    expect(screen.queryAllByRole("region", { name: "Saved Unit notes" })).toHaveLength(0);
  });
});

describe("Prototype Notes previous occupancy", () => {
  it("asks which previous occupancy and records it on the note", async () => {
    render(<PrototypeNotes />);
    startNoteFromMenu();
    fireEvent.click(screen.getByRole("button", { name: "Shared" }));
    fireEvent.click(await screen.findByRole("button", { name: "Previous Occupancies" }));
    const lease = await screen.findByRole("button", { name: "Lease · 4 March 2021 · L’Occitane Limited" });
    expect(screen.getByRole("button", { name: "Lease · 21 May 2012 · Abbey Cross Trading Limited" })).toBeInTheDocument();
    fireEvent.click(lease);
    await screen.findByLabelText("Your note");
    await giveNote("Shop fit-out left in place");
    const card = screen.getByRole("listitem", { name: "Previous occupancy note" });
    expect(within(card).getByText(/L’Occitane Limited/)).toBeInTheDocument();
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
    expect(screen.getByRole("button", { name: "Shared" })).toBeInTheDocument();
  });
});
