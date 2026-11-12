import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PrototypeNotes from "@/pages/PrototypeNotes";

const placeholder = () => (screen.getByLabelText("Ask Hobson") as HTMLInputElement).placeholder;

/** Press + Note and answer both questions, so Hobson is now asking for the note itself. */
async function openNoteToTheContentRequest() {
  fireEvent.click(screen.getByRole("button", { name: "Add a note" }));
  expect(placeholder()).toBe("Ask me about this unit");

  fireEvent.click(screen.getByRole("button", { name: "Shared" }));
  await screen.findByRole("button", { name: "Current Occupancy" });
  expect(placeholder()).toBe("Ask me about this unit");

  fireEvent.click(screen.getByRole("button", { name: "Current Occupancy" }));
  await waitFor(() => expect(placeholder()).toBe("Tell me the note…"));
}

/** Give the note and wait until Hobson has actually kept it. */
async function giveNote(text: string) {
  fireEvent.change(screen.getByLabelText("Ask Hobson"), { target: { value: text } });
  fireEvent.click(screen.getByRole("button", { name: "Send message" }));
  await screen.findByText(/I've added your note/);
  await waitFor(() => expect(placeholder()).toBe("Ask me about this unit"));
}

describe("Prototype Notes composer", () => {
  it("asks for the note only after the last question", async () => {
    render(<PrototypeNotes />);
    expect(placeholder()).toBe("Ask me about this unit");
    await openNoteToTheContentRequest();
    expect(screen.getByText("Please provide the note, which I will keep on file for you.")).toBeInTheDocument();
  });

  it("stops asking for the note once it has been given", async () => {
    render(<PrototypeNotes />);
    await openNoteToTheContentRequest();
    await giveNote("Car space allocated for free to Mr Mark Jones - no paper work provided");
    const cards = screen.getAllByRole("listitem", { name: /Occupancy note/i });
    expect(cards[0]).toHaveTextContent("Car space allocated for free to Mr Mark Jones - no paper work provided");
  });

  it("stops asking for the note when the conversation moves on elsewhere", async () => {
    render(<PrototypeNotes />);
    await openNoteToTheContentRequest();
    await giveNote("Car space allocated for free to Mr Mark Jones - no paper work provided");

    // A second note is underway and Hobson has asked for it...
    await openNoteToTheContentRequest();

    // ...but the user presses the header note icon instead: the pending note is dropped.
    fireEvent.click(screen.getByRole("button", { name: /note.*for this Unit/i }));
    await waitFor(() => expect(placeholder()).toBe("Ask me about this unit"));
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
    fireEvent.click(screen.getByRole("button", { name: "Add a note" }));
    fireEvent.click(screen.getByRole("button", { name: "Shared" }));
    fireEvent.click(await screen.findByRole("button", { name: "Previous Occupancies" }));
    const lease = await screen.findByRole("button", { name: "Lease · 4 March 2021 · L’Occitane Limited" });
    expect(screen.getByRole("button", { name: "Lease · 21 May 2012 · Abbey Cross Trading Limited" })).toBeInTheDocument();
    fireEvent.click(lease);
    await waitFor(() => expect(placeholder()).toBe("Tell me the note…"));
    await giveNote("Shop fit-out left in place");
    const card = screen.getByRole("listitem", { name: "Previous occupancy note" });
    expect(within(card).getByText(/L’Occitane Limited/)).toBeInTheDocument();
  });
});
