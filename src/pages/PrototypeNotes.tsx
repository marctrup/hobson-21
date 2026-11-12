import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, Building2, ChevronDown, ChevronRight, Clock, FileText, Lightbulb, Lock, Map as MapIcon, MessageSquare, Pencil, RotateCcw, StickyNote, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import owlDefault from "@/assets/prototype/owl-default.png";
import {
  byMostRecent,
  confirmationText,
  deleteQuestion,
  isListRequest,
  makeNote,
  missingQuestion,
  NOTE_CONTENT_PROMPT,
  parseNoteRequest,
  showsNotePrompt,
  UNIT_ADDRESS,
  UNIT_LABEL,
  type Note,
  type NoteDraft,
} from "./prototypeNotes";

// Prototype Notes: adding, seeing, editing and deleting Unit notes entirely
// within Hobson's conversation. Local demonstration state only; nothing is saved.

type Message = { id: number; role: "user" | "hobson"; text: string; choices?: string[]; noteIds?: string[] };

const SEED: Message[] = [
  { id: 0, role: "hobson", text: "You've selected 1st Floor at 1 Linear Park.\n\nWhat would you like to know?" },
  { id: 9, role: "user", text: "What is the current rent?" },
  { id: 1, role: "hobson", text: "The current rent is £1,224,882 per annum.\n\nBased on the Underlease and Rent Review Memorandum." },
];

const SCENARIOS: { label: string; text: string }[] = [
  { label: "Add the car-space note", text: "Add a note that a car space has been allocated for free to Mr Mark Jones, but no paperwork has been provided." },
  { label: "Add a private note", text: "Add a private note that the roof access key is kept with the porter." },
  { label: "Add a general Unit note", text: "Add a note for the Unit generally that the window locks were replaced in March." },
  { label: "Show my notes", text: "Show my notes" },
];

function NoteEntry({ note, editing, onEdit, onDelete, onSaveEdit, onCancelEdit }: {
  note: Note;
  editing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onSaveEdit: (text: string) => void;
  onCancelEdit: () => void;
}) {
  const [text, setText] = useState(note.content);
  useEffect(() => { if (editing) setText(note.content); }, [editing, note.content]);
  return (
    <li aria-label={`${note.category === "occupancy" ? "Occupancy" : "Unit"} note`} className="rounded-lg border border-primary/20 bg-background px-3.5 py-3">
      <div className="flex items-start justify-between gap-2">
        <p className="flex flex-wrap items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
          User-added note
          <span className="font-normal normal-case tracking-normal text-ink-muted">· {note.category === "occupancy" ? "Occupant" : "Unit"}</span>
          {note.visibility === "private" && <span className="flex items-center gap-1 font-normal normal-case tracking-normal text-ink-muted"><Lock className="h-3 w-3" aria-hidden />Private</span>}
        </p>
        {!editing && (
          <span className="flex shrink-0 gap-1">
            <Button variant="ghost" size="sm" aria-label={`Edit note: ${note.content}`} className="h-7 gap-1 px-2 text-xs" onClick={onEdit}><Pencil className="h-3.5 w-3.5" aria-hidden />Edit</Button>
            <Button variant="ghost" size="sm" aria-label={`Delete note: ${note.content}`} className="h-7 gap-1 px-2 text-xs text-destructive hover:text-destructive" onClick={onDelete}><Trash2 className="h-3.5 w-3.5" aria-hidden />Delete</Button>
          </span>
        )}
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
      <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-muted"><Clock className="h-3 w-3" aria-hidden />{note.created} · Added by {note.author}{note.edited ? " · Edited" : ""}</p>
    </li>
  );
}

function SavedNotes({ count, children }: { count: number; children: ReactNode }) {
  return (
    <section aria-label="Saved Unit notes" className="w-full max-w-xl rounded-xl border border-primary/15 bg-primary/[0.04] p-3">
      <p className="mb-2 flex items-center gap-2 px-1 text-sm">
        <StickyNote className="h-4 w-4 text-primary" aria-hidden />
        <span className="font-semibold">Saved Unit notes</span>
        <span className="text-xs text-ink-muted">{count} {count === 1 ? "note" : "notes"}</span>
      </p>
      <ul className="grid gap-2">{children}</ul>
    </section>
  );
}

const UNITS: { name: string; papers: number }[] = [
  { name: "1st Floor", papers: 2 }, { name: "3rd Floor", papers: 2 }, { name: "4th Floor", papers: 1 },
  { name: "5th Floor (Suite A)", papers: 2 }, { name: "5th Floor (Suite B)", papers: 3 },
  { name: "Car Park (1)", papers: 1 }, { name: "Car Park (2)", papers: 1 }, { name: "Ground Floor (Suite C)", papers: 2 },
];

export default function PrototypeNotes() {
  const [messages, setMessages] = useState<Message[]>(SEED);
  const [notes, setNotes] = useState<Note[]>([]);
  const [draft, setDraft] = useState<NoteDraft | null>(null);
  const [awaitingContent, setAwaitingContent] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [tryOpen, setTryOpen] = useState(false);
  const nextId = useRef(100);
  const nextNoteId = useRef(1);
  const logEnd = useRef<HTMLDivElement>(null);

  useEffect(() => { logEnd.current?.scrollIntoView?.({ block: "end" }); }, [messages, editingId]);

  const say = (role: Message["role"], text: string, choices?: string[], noteIds?: string[]) =>
    setMessages((m) => [...m.map((x) => ({ ...x, choices: undefined })), { id: nextId.current++, role, text, choices, noteIds }]);

  const listNotes = (current: Note[]) => {
    setDraft(null); setAwaitingContent(false);
    if (current.length === 0) { say("hobson", "I've no notes recorded for the 1st Floor yet. Tell me something and I'll keep one."); return; }
    say("hobson", `Here ${current.length === 1 ? "is the note" : `are the ${current.length} notes`} I've kept for the 1st Floor.`, undefined, byMostRecent(current).map((n) => n.id));
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
    else if (!d.content) { setAwaitingContent(true); say("hobson", NOTE_CONTENT_PROMPT); }
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
          say("hobson", deleteQuestion(note), ["Delete note", "Keep note"]);
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
    setDeleting(id); setEditingId(null); setDraft(null); setAwaitingContent(false);
    say("hobson", deleteQuestion(notes.find((n) => n.id === id)), ["Delete note", "Keep note"]);
  };

  const saveEdit = (id: string, text: string) => {
    setNotes((ns) => ns.map((n) => (n.id === id ? { ...n, content: text, edited: true } : n)));
    setEditingId(null);
    say("hobson", "I've updated your note. It's kept its original date and author.");
  };

  const restart = () => {
    setNotes([]); setDraft(null); setAwaitingContent(false); setDeleting(null); setEditingId(null); setInput(""); setTryOpen(false);
    nextId.current = 100; nextNoteId.current = 1; setMessages(SEED);
  };

  const noteById = (id: string) => notes.find((n) => n.id === id);

  const [openUnit, setOpenUnit] = useState("1st Floor");
  const entry = (where: string) => (n: Note) => (
    <NoteEntry key={n.id} note={n} editing={editingId === `${where}:${n.id}`}
      onEdit={() => setEditingId(`${where}:${n.id}`)} onDelete={() => askDelete(n.id)}
      onSaveEdit={(t) => saveEdit(n.id, t)} onCancelEdit={() => setEditingId(null)} />
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-ink">
      <aside className="flex w-[150px] shrink-0 flex-col gap-1 border-r border-bone bg-background px-3 py-4 max-md:hidden">
        <img src={owlDefault} alt="" aria-hidden className="mb-4 h-9 w-9 object-contain" />
        <span className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-ink-muted"><Building2 className="h-4 w-4" aria-hidden />Portfolio</span>
        <span className="flex items-center gap-2 rounded-md bg-secondary px-2 py-1.5 text-sm font-medium"><FileText className="h-4 w-4" aria-hidden />Papers</span>
        <span className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-ink-muted"><MessageSquare className="h-4 w-4" aria-hidden />Conversations</span>
        <div className="mt-auto grid h-9 w-9 place-items-center rounded-full bg-bone text-xs font-semibold text-charcoal">MT</div>
      </aside>

      <section aria-label="Chat with Hobson" className="flex w-[460px] min-w-0 shrink-0 flex-col border-r border-bone bg-background max-lg:flex-1">
        <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-bone px-5">
          <p className="flex min-w-0 items-center gap-1.5 text-sm">
            <span className="truncate font-medium text-primary">{UNIT_ADDRESS}</span>
            <span className="text-ink-muted">›</span>
            <span className="shrink-0 font-semibold">{UNIT_LABEL}</span>
            {notes.length > 0 && (
              <button type="button" onClick={() => listNotes(notes)} aria-label={`Show ${notes.length} ${notes.length === 1 ? "note" : "notes"} for this Unit`} className="ml-1 flex shrink-0 items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary hover:bg-primary/15">
                <StickyNote className="h-3.5 w-3.5" aria-hidden />{notes.length}
              </button>
            )}
          </p>
          <Button variant="ghost" size="sm" aria-label="Restart demo" onClick={restart}><RotateCcw className="h-3.5 w-3.5 sm:mr-2" /><span className="max-sm:hidden">Restart</span></Button>
        </header>

        <div role="log" aria-label="Conversation" className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-5 py-4">
          {messages.map((m) => {
            const shown = (m.noteIds ?? []).map(noteById).filter((n): n is Note => !!n);
            return (
              <div key={m.id} className={`flex min-w-0 flex-col gap-2 ${m.role === "user" ? "items-end" : "items-start"}`}>
                <div className="flex min-w-0 gap-2">
                  {m.role === "hobson" && <img src={owlDefault} alt="Hobson" className="h-9 w-9 shrink-0 object-contain" />}
                  <div className={`min-w-0 rounded-lg px-3.5 py-2.5 ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
                    <p className="whitespace-pre-line break-words text-sm leading-relaxed">{m.text}</p>
                  </div>
                </div>
                {shown.length > 0 && <div className="w-full pl-11"><SavedNotes count={shown.length}>{shown.map(entry(`m${m.id}`))}</SavedNotes></div>}
                {m.choices && (
                  <div role="group" aria-label="Choose an answer" className="ml-11 grid gap-1.5">
                    {m.choices.map((c) => (
                      <button key={c} type="button" onClick={() => send(c)} className="group flex w-fit items-center gap-2.5 rounded-full border border-primary/25 bg-background px-3.5 py-2 text-left text-sm text-ink transition-colors hover:border-primary hover:bg-primary/5">
                        <span className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-primary/50 transition-colors group-hover:border-primary group-hover:bg-primary" aria-hidden />
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <div ref={logEnd} />
        </div>

        <div className="border-t border-faint-rule px-4 pb-4 pt-2">
          {tryOpen && (
            <div role="group" aria-label="Things you might try" className="mb-3 border-b border-bone pb-3">
              <div className="flex items-center justify-between"><span className="text-xs text-ink-muted">Things you might try</span><Button variant="ghost" size="icon" aria-label="Close suggestions" onClick={() => setTryOpen(false)}><X className="h-4 w-4" /></Button></div>
              {SCENARIOS.map((s) => <button key={s.label} type="button" onClick={() => send(s.text)} className="block w-full rounded-md px-2 py-1.5 text-left hover:bg-paper"><span className="block text-sm text-ink">{s.label}</span><span className="block truncate text-xs text-ink-muted">“{s.text}”</span></button>)}
            </div>
          )}
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-1 rounded-full border border-input bg-background px-2 py-1.5 focus-within:ring-2 focus-within:ring-ring">
            <Button type="button" variant="outline" size="sm" aria-label="Add a note" onClick={startNote} className="h-8 shrink-0 gap-1 rounded-full border-primary/40 px-3 text-xs font-medium text-primary hover:bg-primary/5 hover:text-primary">
              <StickyNote className="h-3.5 w-3.5" aria-hidden />+ Note
            </Button>
            <Button type="button" variant="ghost" size="icon" aria-label="Things you might try" aria-expanded={tryOpen} onClick={() => setTryOpen((o) => !o)} className="h-8 w-8 shrink-0"><Lightbulb className="h-4 w-4" /></Button>
            <input value={input} onChange={(e) => setInput(e.target.value)} aria-label="Ask Hobson" placeholder={showsNotePrompt(messages[messages.length - 1], !!draft) ? "Tell me the note…" : "Ask me about this unit"} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
            <Button type="submit" size="icon" variant="ghost" disabled={!input.trim()} aria-label="Send message" className="h-8 w-8 shrink-0"><ArrowRight className="h-5 w-5" /></Button>
          </form>
        </div>
      </section>

      <section aria-label="Papers" className="flex min-w-0 flex-1 flex-col bg-primary/[0.02] max-lg:hidden">
        <div className="flex h-14 shrink-0 items-center gap-4 border-b border-bone px-6 text-sm">
          <span className="flex items-center gap-1.5 border-b-2 border-ink py-4 font-medium"><FileText className="h-4 w-4" aria-hidden />Papers</span>
          <span className="flex items-center gap-1.5 text-ink-muted"><MapIcon className="h-4 w-4" aria-hidden />Map</span>
          <span className="ml-auto text-xs text-ink-muted">14 papers, 8 units</span>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
          <p className="text-sm font-semibold">{UNIT_ADDRESS} <span className="font-normal text-ink-muted">· 14 papers</span></p>
          <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">Units · 8</p>
          <ul className="mt-2 grid gap-1.5">
            {UNITS.map((u) => {
              const open = openUnit === u.name;
              return (
                <li key={u.name} className="rounded-lg border border-bone bg-background">
                  <button type="button" aria-expanded={open} onClick={() => setOpenUnit(open ? "" : u.name)} className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm">
                    <Building2 className="h-4 w-4 text-ink-muted" aria-hidden />
                    <span className="font-medium">{u.name}</span>
                    <span className="text-xs text-ink-muted">{u.papers} {u.papers === 1 ? "paper" : "papers"}</span>
                    {open ? <ChevronDown className="ml-auto h-4 w-4 text-ink-muted" /> : <ChevronRight className="ml-auto h-4 w-4 text-ink-muted" />}
                  </button>
                  {open && (
                    <div className="grid gap-2 border-t border-bone px-3 py-3">
                      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">Occupation history</p>
                      <p className="flex items-center gap-2 text-sm"><FileText className="h-4 w-4 text-ink-muted" aria-hidden />Renewal Lease <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide">Current</span></p>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
