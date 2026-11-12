// Prototype Notes: pure logic for the conversation-led Unit notes demonstration.
// Local illustrative state only — nothing is saved anywhere, and notes stay
// clearly marked as user-added, never confused with knowledge from papers.

export type NoteCategory = "unit" | "occupancy" | "previous";

/** Previous occupancies, matching the papers marked "No longer current". */
export const PREVIOUS_OCCUPANCIES = [
  "Lease · 4 March 2021 · L’Occitane Limited",
  "Lease · 21 May 2012 · Abbey Cross Trading Limited",
];
export type NoteVisibility = "shared" | "private";

export type Note = {
  id: string;
  category: NoteCategory;
  visibility: NoteVisibility;
  content: string;
  occupancy?: string;
  /** A spoken note keeps its original recording beside the written version (recording withdrawn from the composer; phone dictation is suggested instead). */
  voice?: VoiceClip;
  author: string;
  created: string;
  edited?: boolean;
};

export type VoiceClip = { url: string; seconds: number };

export type NoteDraft = {
  content: string;
  voice?: VoiceClip;
  category?: NoteCategory;
  visibility?: NoteVisibility;
  occupancy?: string;
};

export const NOTE_AUTHOR = "Marc T";
export const NOTE_DATE = "12 November 2026";
export const UNIT_LABEL = "1st Floor";
export const UNIT_ADDRESS = "1 Linear Park";

/** True when the message is asking Hobson to keep a note. */
export const isNoteRequest = (text: string) => /\bnote\b/i.test(text) && !/show|list|what|which|read|see/i.test(text);

/** True when the message asks to see the saved notes. */
export const isListRequest = (text: string) => /\bnotes?\b/i.test(text) && /show|list|what|which|read|see|have/i.test(text);

/** Pull the note's substance out of a natural request. */
export function noteContent(text: string): string {
  const t = text.trim();
  const m = t.match(/note(?:\s+for\s+the\s+unit\s+generally)?(?:\s+that|\s*[:-])\s+(.*)$/i);
  const body = (m ? m[1] : t).trim().replace(/[.\s]+$/, "");
  return body.charAt(0).toUpperCase() + body.slice(1);
}

/** A category stated in the message itself, if any. */
export function statedCategory(text: string): NoteCategory | undefined {
  if (/occupier|occupant|tenant|occupancy/i.test(text)) return "occupancy";
  if (/unit\s+generally|general\s+unit|unit\s+itself|generally/i.test(text)) return "unit";
  return undefined;
}

/** A visibility stated in the message itself, if any. */
export function statedVisibility(text: string): NoteVisibility | undefined {
  if (/private|just\s+(for\s+)?me|keep\s+(it\s+)?(to\s+)?(myself|private)/i.test(text)) return "private";
  if (/share|everyone|with\s+all/i.test(text)) return "shared";
  return undefined;
}

export function parseNoteRequest(text: string): NoteDraft | null {
  if (!isNoteRequest(text)) return null;
  return { content: noteContent(text), category: statedCategory(text), visibility: statedVisibility(text) };
}

/** The next question Hobson still needs answered, if any. */
export function missingQuestion(draft: NoteDraft): "category" | "visibility" | null {
  if (!draft.category) return "category";
  if (!draft.visibility) return "visibility";
  return null;
}

export function makeNote(draft: NoteDraft, id: string): Note {
  return {
    id,
    category: draft.category ?? "unit",
    visibility: draft.visibility ?? "shared",
    content: draft.content,
    ...(draft.occupancy ? { occupancy: draft.occupancy } : {}),
    ...(draft.voice ? { voice: draft.voice } : {}),
    author: NOTE_AUTHOR,
    created: NOTE_DATE,
  };
}

/** Hobson's confirmation once a note is saved. */
export function confirmationText(note: Note): string {
  const where = note.category === "occupancy" ? "the current occupancy" : note.category === "previous" ? `the previous occupancy (${note.occupancy})` : "the Unit";
  const who =
    note.visibility === "shared"
      ? "It's shared with everyone who has access to this Unit."
      : "It's private — only you can see it, and I'll only use it in answers to you.";
  return `I've added your note to ${where}. ${who}`;
}

/** Notes most recent first, as the header icon lists them. */
export const byMostRecent = (notes: Note[]) => [...notes].reverse();

/**
 * Hobson's delete check. He names the note in words rather than re-showing its
 * card, so pressing Delete never looks like the note has been added again.
 */
export function deleteQuestion(note: Note | undefined): string {
  return note
    ? `Would you like me to delete this note?\n\n"${note.content}"`
    : "Would you like me to delete this note?";
}

/** Hobson's final question: the note itself. */
export const NOTE_CONTENT_PROMPT = "Please provide the note, which I will keep on file for you. Type it, or tap the microphone on your phone's keyboard and simply speak — your phone will write it out for you.";

/**
 * The composer only invites the note once Hobson has actually asked for it:
 * his request must be the last thing said and a note must still be in progress.
 */
export function showsNotePrompt(
  lastMessage: { role: "user" | "hobson"; text: string } | undefined,
  hasDraft: boolean,
): boolean {
  return hasDraft && lastMessage?.role === "hobson" && lastMessage.text === NOTE_CONTENT_PROMPT;
}

/** Clock-style length of a voice note, e.g. 0:18. */
export const clipLength = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.round(seconds) % 60).padStart(2, "0")}`;

/** Hobson's check after hearing a voice note: the voice is never kept unseen. */
export const voiceCheckText = (transcript: string) =>
  `Thank you — I've written out what you said. Shall I keep it as it stands?\n\n"${transcript}"`;
export const VOICE_CHOICES = ["Keep note", "Edit wording", "Record again"];
