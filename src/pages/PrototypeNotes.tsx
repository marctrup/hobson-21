import { useEffect, useRef, useState } from "react";
import { ArrowRight, Lightbulb, Lock, MoreHorizontal, RotateCcw, StickyNote, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import owlDefault from "@/assets/prototype/owl-default.png";
import {
  byMostRecent,
  confirmationText,
  isListRequest,
  makeNote,
  missingQuestion,
  parseNoteRequest,
  UNIT_ADDRESS,
  UNIT_LABEL,
  type Note,
  type NoteDraft,
} from "./prototypeNotes";

// Prototype Notes: adding, seeing, editing and deleting Unit notes entirely
// within Hobson's conversation. Local demonstration state only; nothing is saved.

type Message = { id: number; role: "user" | "hobson"; text: string; choices?: string[]; noteIds?: string[] };

const SEED: Message[] = [
  { id: 0, role: "user", text: "What is the current rent?" },
  { id: 1, role: "hobson", text: "The current rent is £1,224,882 per annum.\n\nBased on the Underlease and Rent Review Memorandum." },
  { id: 2, role: "hobson", text: "If something comes to mind that no paper records — an arrangement, a promise, a detail — press + Note below and I'll keep it against this Unit." },
];

const SCENARIOS: { label: string; text: string }[] = [
  { label: "Add the car-space note", text: "Add a note that a car space has been allocated for free to Mr Mark Jones, but no paperwork has been provided." },
  { label: "Add a private note", text: "Add a private note that the roof access key is kept with the porter." },
  { label: "Add a general Unit note", text: "Add a note for the Unit generally that the window locks were replaced in March." },
  { label: "Show my notes", text: "Show my notes" },
];

function NoteCard({ note, editing, onEdit, onDelete, onSaveEdit, onCancelEdit }: {
  note: Note;
  editing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onSaveEdit: (text: string) => void;
  onCancelEdit: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [text, setText] = useState(note.content);
  useEffect(() => { if (editing) setText(note.content); }, [editing, note.content]);
  return (
    <section aria-label={`${note.category === "occupancy" ? "Occupancy" : "Unit"} note`} className="w-full max-w-lg rounded-xl border border-primary/25 bg-primary/[0.05] px-4 py-3">
      <div className="flex items-start justify-between gap-2">
        <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.1em] text-primary">
          {note.category === "occupancy" ? "Occupancy note" : "Unit note"}
          <span className="text-ink-muted">·</span>
          {note.visibility === "shared" ? <span className="text-ink-muted">Shared with all</span> : <span className="flex items-center gap-1 text-ink-muted"><Lock className="h-3 w-3" aria-hidden />Private</span>}
        </p>
        <span className="relative">
          <Button variant="ghost" size="icon" aria-label={`Actions for note: ${note.content}`} aria-expanded={menuOpen} className="h-6 w-6" onClick={() => setMenuOpen((o) => !o)}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
          {menuOpen && (
            <span role="menu" className="absolute right-0 top-7 z-10 grid w-32 overflow-hidden rounded-lg border border-bone bg-background text-left text-sm shadow-md">
              <button type="button" role="menuitem" className="px-3 py-2 hover:bg-paper" onClick={() => { setMenuOpen(false); onEdit(); }}>Edit note</button>
              <button type="button" role="menuitem" className="px-3 py-2 hover:bg-paper" onClick={() => { setMenuOpen(false); onDelete(); }}>Delete note</button>
            </span>
          )}
        </span>
      </div>
      {editing ? (
        <form className="mt-2 grid gap-2" onSubmit={(e) => { e.preventDefault(); if (text.trim()) onSaveEdit(text.trim()); }}>
          <textarea value={text} onChange={(e) => setText(e.target.value)} aria-label="Edit note" rows={3} autoFocus className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
          <span className="flex gap-2">
            <Button type="submit" size="sm">Save</Button>
            <Button type="button" size="sm" variant="ghost" onClick={onCancelEdit}>Cancel</Button>
          </span>
        </form>
      ) : (
        <p className="mt-1.5 text-sm leading-relaxed text-ink">{note.content}</p>
      )}
      <p className="mt-2 text-xs text-ink-muted">{note.created} · Added by {note.author}{note.edited ? " · Edited" : ""}</p>
    </section>
  );
}

export default function PrototypeNotes() {
  const [messages, setMessages] = useState<Message[]>(SEED);
  const [notes, setNotes] = useState<Note[]>([]);
  const [draft, setDraft] = useState<NoteDraft | null>(null);
  const [awaitingContent, setAwaitingContent] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [tryOpen, setTryOpen] = useState(false);
  const nextId = useRef(SEED.length);
  const nextNoteId = useRef(1);
  const logEnd = useRef<HTMLDivElement>(null);

  useEffect(() => { logEnd.current?.scrollIntoView?.({ block: "end" }); }, [messages, editingId]);

  const say = (role: Message["role"], text: string, choices?: string[], noteIds?: string[]) =>
    setMessages((m) => [...m.map((x) => ({ ...x, choices: undefined })), { id: nextId.current++, role, text, choices, noteIds }]);

  const listNotes = (current: Note[]) => {
    if (current.length === 0) { say("hobson", "I've no notes recorded for the 1st floor yet. Tell me something and I'll keep one."); return; }
    say("hobson", `Here ${current.length === 1 ? "is the note" : `are the ${current.length} notes`} I've recorded for the 1st floor.`, undefined, byMostRecent(current).map((n) => n.id));
  };

  const saveNote = (complete: NoteDraft) => {
    const note = makeNote(complete, `n${nextNoteId.current++}`);
    setNotes((ns) => [...ns, note]);
    setDraft(null);
    say("hobson", confirmationText(note), undefined, [note.id]);
  };

  // + Note flow: Hobson asks (1) shared or private, (2) occupant or Unit, (3) the note itself.
  const askNext = (d: NoteDraft) => {
    if (!d.visibility) say("hobson", "Would you like your note shared or kept private?", ["Shared", "Kept private"]);
    else if (!d.category) say("hobson", "Is your note related to the occupant, or the Unit they reside in?", ["The occupant", "The Unit"]);
    else if (!d.content) { setAwaitingContent(true); say("hobson", "Please provide the note, which I will keep on file for you."); }
    else saveNote(d);
  };

  const startNote = () => {
    setTryOpen(false);
    if (awaitingContent || draft) return;
    const fresh: NoteDraft = { content: "" };
    setDraft(fresh);
    askNext(fresh);
  };

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    setInput(""); setTryOpen(false);
    say("user", text);
    setTimeout(() => {
      // The + Note button was pressed and Hobson is waiting for the note itself.
      if (awaitingContent) {
        setAwaitingContent(false);
        const body = text.replace(/[.\s]+$/, "");
        const parsed: NoteDraft = { ...(draft ?? {}), content: body.charAt(0).toUpperCase() + body.slice(1) };
        askNext(parsed);
        return;
      }
      // A delete confirmation is awaiting an answer.
      if (deleting) {
        const note = notes.find((n) => n.id === deleting);
        if (/^delete/.test(text.toLowerCase())) {
          const remaining = notes.filter((n) => n.id !== deleting);
          setNotes(remaining); setDeleting(null);
          say("hobson", "Done — I've deleted that note. It won't be used in my answers.");
        } else if (/^keep/.test(text.toLowerCase())) {
          setDeleting(null);
          say("hobson", "Very well — I've kept the note as it was.");
        } else {
          say("hobson", "Would you like me to delete this note?", ["Delete note", "Keep note"], note ? [note.id] : undefined);
        }
        return;
      }
      // A draft note is awaiting an answer.
      if (draft) {
        const t = text.toLowerCase();
        let next: NoteDraft | null = null;
        if (!draft.visibility) {
          if (/private|just me/.test(t)) next = { ...draft, visibility: "private" };
          else if (/share|everyone/.test(t)) next = { ...draft, visibility: "shared" };
        } else if (!draft.category) {
          if (/occupier|occupant|tenant/.test(t)) next = { ...draft, category: "occupancy" };
          else if (/unit/.test(t)) next = { ...draft, category: "unit" };
        }
        if (!next) { askNext(draft); return; }
        setDraft(next);
        askNext(next);
        return;
      }
      // A fresh request.
      if (isListRequest(text)) { listNotes(notes); return; }
      const parsed = parseNoteRequest(text);
      if (parsed) { setDraft(parsed); askNext(parsed); return; }
      if (/rent/.test(text.toLowerCase())) { say("hobson", "The current rent is £1,224,882 per annum.\n\nBased on the Underlease and Rent Review Memorandum."); return; }
      say("hobson", "I'm afraid this demonstration only covers notes for this Unit. Do ask me to add a note, or to show you the notes I've kept.");
    }, 350);
  };

  const askDelete = (id: string) => {
    setDeleting(id); setEditingId(null);
    say("hobson", "Would you like me to delete this note?", ["Delete note", "Keep note"], [id]);
  };

  const saveEdit = (id: string, text: string) => {
    setNotes((ns) => ns.map((n) => (n.id === id ? { ...n, content: text, edited: true } : n)));
    setEditingId(null);
    say("hobson", "I've updated your note. It's kept its original date and author.");
  };

  const restart = () => {
    setNotes([]); setDraft(null); setAwaitingContent(false); setDeleting(null); setEditingId(null); setInput(""); setTryOpen(false);
    nextId.current = SEED.length; nextNoteId.current = 1; setMessages(SEED);
  };

  const noteById = (id: string) => notes.find((n) => n.id === id);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bone-wash text-ink">
      <aside className="flex w-[68px] shrink-0 flex-col items-center gap-2 border-r border-bone bg-background py-4">
        <div className="mb-2 grid h-10 w-10 place-items-center" aria-hidden><img src={owlDefault} alt="" className="h-10 w-10 object-contain" /></div>
        <button type="button" aria-current="page" className="w-12 rounded-lg bg-secondary py-2 text-center text-[10px] font-medium leading-tight text-ink">Unit</button>
        <div className="mt-auto grid h-9 w-9 place-items-center rounded-full bg-bone text-xs font-semibold text-charcoal">MT</div>
      </aside>

      <section aria-label="Chat with Hobson" className="flex min-w-0 flex-1 flex-col bg-background">
        <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-bone px-5">
          <p className="flex min-w-0 items-center gap-1.5 text-sm">
            <span className="truncate font-medium text-primary">{UNIT_ADDRESS}</span>
            <span className="text-ink-muted">›</span>
            <span className="shrink-0 font-semibold">{UNIT_LABEL}</span>
            {notes.length > 0 && (
              <button type="button" onClick={() => listNotes(notes)} aria-label={`Show ${notes.length} ${notes.length === 1 ? "note" : "notes"} for this Unit`} className="ml-1 flex shrink-0 items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground hover:opacity-90">
                <StickyNote className="h-3.5 w-3.5" aria-hidden />{notes.length}
              </button>
            )}
          </p>
          <Button variant="ghost" size="sm" aria-label="Restart demo" onClick={restart}><RotateCcw className="h-3.5 w-3.5 mr-2" /><span className="max-sm:hidden">Restart demo</span></Button>
        </header>

        <div className="shrink-0 border-b border-bone px-5 pt-3">
          <p className="text-sm font-semibold">Notes for this Unit</p>
          <div className="mt-2 flex gap-4 text-xs">
            <span className="border-b-2 border-ink pb-2 font-medium">Conversation</span>
            <span className="pb-2 text-ink-muted">Conversations</span>
          </div>
        </div>

        <div role="log" aria-label="Conversation" className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-5 py-4">
          {messages.map((m, i) => {
            const cont = i > 0 && messages[i - 1].role === "hobson" && m.role === "hobson";
            return (
              <div key={m.id} className={`flex min-w-0 flex-col gap-2 ${m.role === "user" ? "items-end" : "items-start"}`}>
                <div className="flex min-w-0 gap-2">
                  {m.role === "hobson" && (cont ? <span className="w-10 shrink-0" /> : <img src={owlDefault} alt="Hobson" className="h-10 w-10 shrink-0 object-contain" />)}
                  <div className={`min-w-0 rounded-lg px-3.5 py-2.5 ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
                    <p className="whitespace-pre-line break-words text-sm leading-relaxed">{m.text}</p>
                  </div>
                </div>
                {m.noteIds && m.noteIds.length > 0 && (
                  <div className="ml-12 grid w-full max-w-lg gap-2">
                    {m.noteIds.map((id) => {
                      const note = noteById(id);
                      return note ? (
                        <NoteCard key={id} note={note} editing={editingId === id}
                          onEdit={() => setEditingId(id)} onDelete={() => askDelete(id)}
                          onSaveEdit={(t) => saveEdit(id, t)} onCancelEdit={() => setEditingId(null)} />
                      ) : null;
                    })}
                  </div>
                )}
                {m.choices && <div className="ml-12 flex flex-wrap gap-2">{m.choices.map((c, k) => <Button key={c} size="sm" variant={k === 0 ? "outline" : "ghost"} onClick={() => send(c)}>{c}</Button>)}</div>}
              </div>
            );
          })}
          <div ref={logEnd} />
        </div>

        <div className="border-t border-faint-rule px-5 pb-4 pt-2">
          {tryOpen && (
            <div role="group" aria-label="Things you might try" className="mb-3 border-b border-bone pb-3">
              <div className="flex items-center justify-between"><span className="text-xs text-ink-muted">Things you might try</span><Button variant="ghost" size="icon" aria-label="Close suggestions" onClick={() => setTryOpen(false)}><X className="h-4 w-4" /></Button></div>
              {SCENARIOS.map((s) => <button key={s.label} type="button" onClick={() => send(s.text)} className="block w-full rounded-md px-2 py-1.5 text-left hover:bg-paper"><span className="block text-sm text-ink">{s.label}</span><span className="block truncate text-xs text-ink-muted">“{s.text}”</span></button>)}
            </div>
          )}
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-1 rounded-full border border-input bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-ring">
            <Button type="button" variant="outline" size="sm" aria-label="Add a note" onClick={startNote} className="h-8 shrink-0 gap-1 rounded-full border-primary/40 px-3 text-xs font-medium text-primary hover:bg-primary/5 hover:text-primary">
              <StickyNote className="h-3.5 w-3.5" aria-hidden />+ Note
            </Button>
            <Button type="button" variant="ghost" size="icon" aria-label="Things you might try" aria-expanded={tryOpen} onClick={() => setTryOpen((o) => !o)} className="h-9 w-9 shrink-0"><Lightbulb className="h-5 w-5" /></Button>
            <input value={input} onChange={(e) => setInput(e.target.value)} aria-label="Ask Hobson" placeholder={awaitingContent ? "Tell me the note…" : "Ask me about this unit"} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
            <Button type="submit" size="icon" variant="ghost" disabled={!input.trim()} aria-label="Send message" className="h-8 w-8 shrink-0"><ArrowRight className="h-5 w-5" /></Button>
          </form>
        </div>
      </section>
    </div>
  );
}
