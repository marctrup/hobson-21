import { describe, expect, it } from "vitest";
import {
  byMostRecent,
  confirmationText,
  isListRequest,
  isNoteRequest,
  makeNote,
  missingQuestion,
  NOTE_CONTENT_PROMPT,
  noteContent,
  parseNoteRequest,
  showsNotePrompt,
  statedCategory,
  statedVisibility,
} from "./prototypeNotes";

const CAR_SPACE = "Add a note that a car space has been allocated for free to Mr Mark Jones, but no paperwork has been provided.";

describe("prototypeNotes", () => {
  it("recognises a note request and extracts its substance", () => {
    const draft = parseNoteRequest(CAR_SPACE);
    expect(draft).not.toBeNull();
    expect(draft!.content).toBe("A car space has been allocated for free to Mr Mark Jones, but no paperwork has been provided");
  });

  it("ignores messages that are not note requests", () => {
    expect(parseNoteRequest("What is the current rent?")).toBeNull();
    expect(isNoteRequest("Show my notes")).toBe(false);
  });

  it("recognises a request to list notes", () => {
    expect(isListRequest("Show my notes")).toBe(true);
    expect(isListRequest("What notes do you have?")).toBe(true);
    expect(isListRequest("Add a note that the lift is out")).toBe(false);
  });

  it("asks the category question first, then visibility, then nothing", () => {
    const draft = parseNoteRequest(CAR_SPACE)!;
    expect(missingQuestion(draft)).toBe("category");
    expect(missingQuestion({ ...draft, category: "occupancy" })).toBe("visibility");
    expect(missingQuestion({ ...draft, category: "occupancy", visibility: "shared" })).toBeNull();
  });

  it("takes the category from the message when stated", () => {
    expect(statedCategory("Add a note about the current occupier: the fridge is theirs")).toBe("occupancy");
    expect(statedCategory("Add a note for the Unit generally that the window locks were replaced")).toBe("unit");
  });

  it("takes the visibility from the message when stated", () => {
    expect(statedVisibility("Add a private note that the roof key is with the porter")).toBe("private");
    expect(statedVisibility("Add a note to share with everyone that the lift is out")).toBe("shared");
  });

  it("skips questions the user has already answered", () => {
    const draft = parseNoteRequest("Add a private note about the occupier: the fridge is theirs")!;
    expect(missingQuestion(draft)).toBeNull();
  });

  it("saves a note with author, date, category and visibility", () => {
    const note = makeNote({ content: "Car space allocated for free to Mr Mark Jones", category: "occupancy", visibility: "shared" }, "n1");
    expect(note).toMatchObject({ id: "n1", category: "occupancy", visibility: "shared", author: "Marc T", created: "12 November 2026" });
    expect(note.edited).toBeUndefined();
  });

  it("confirms shared and private notes differently", () => {
    const shared = makeNote({ content: "x", category: "occupancy", visibility: "shared" }, "n1");
    const priv = makeNote({ content: "x", category: "unit", visibility: "private" }, "n2");
    expect(confirmationText(shared)).toContain("current occupancy");
    expect(confirmationText(shared)).toContain("shared with everyone");
    expect(confirmationText(priv)).toContain("the Unit");
    expect(confirmationText(priv)).toContain("private");
  });

  it("lists notes most recent first", () => {
    const a = makeNote({ content: "a" }, "n1");
    const b = makeNote({ content: "b" }, "n2");
    expect(byMostRecent([a, b]).map((n) => n.id)).toEqual(["n2", "n1"]);
  });

  it("keeps the note body intact when no 'that' phrasing is used", () => {
    expect(noteContent("Note: the lift is out of order.")).toBe("The lift is out of order");
  });

  it("invites the note only after Hobson has asked for it", () => {
    const asked = { role: "hobson" as const, text: NOTE_CONTENT_PROMPT };
    expect(showsNotePrompt(asked, true)).toBe(true);
    expect(showsNotePrompt({ role: "hobson", text: "Would you like your note shared or kept private?" }, true)).toBe(false);
    expect(showsNotePrompt({ role: "hobson", text: "Is your note related to the occupant, or the Unit they reside in?" }, true)).toBe(false);
    expect(showsNotePrompt({ role: "user", text: "The occupant" }, true)).toBe(false);
    expect(showsNotePrompt(asked, false)).toBe(false);
    expect(showsNotePrompt(undefined, true)).toBe(false);
  });
});
