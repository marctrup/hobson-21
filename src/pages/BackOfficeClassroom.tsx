import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import room from "@/assets/back-office-illustrated-room.png.asset.json";
import "./BackOfficeIllustratedRoom.css";
import hobsonOwl from "@/assets/back-office/hobson.png.asset.json";
import keeperOwl from "@/assets/back-office/keeper.png.asset.json";
import brokerOwl from "@/assets/back-office/broker.png.asset.json";
import inspectorOwl from "@/assets/back-office/inspector.png.asset.json";
import professorOwl from "@/assets/back-office/professor.png.asset.json";
import architectOwl from "@/assets/back-office/architect.png.asset.json";

const OWLS: Record<string, string> = { hobson: hobsonOwl.url, keeper: keeperOwl.url, broker: brokerOwl.url, inspector: inspectorOwl.url, professor: professorOwl.url, architect: architectOwl.url };
/** Below this workspace width the illustrated room is unreadable, so a dedicated staff-room list replaces it. */
const COMPACT_WIDTH = 600;

/** Where a colleague must come before the board takes their dictation: just beneath the whiteboard. */
function readingLine(host: HTMLElement) {
  const h = host.getBoundingClientRect();
  const head = host.querySelector<HTMLElement>(".compact-head")?.getBoundingClientRect();
  return head ? Math.min(head.bottom + 80, h.bottom - 80) : h.top + h.height / 2;
}



const specialists = [
  { id: "keeper", name: "The Keeper", section: "Permissions" },
  { id: "broker", name: "The Broker", section: "Contacts" },
  { id: "inspector", name: "The Inspector", section: "Compliance" },
  { id: "professor", name: "The Professor", section: "Papers" },
  { id: "architect", name: "The Architect", section: "Units" },
] as const;

/** Hobson's standing words on the board: they stay written until a colleague takes the pen. */
const BOARD_INVITATION = "My Back Office will be opened to you soon. To introduce my team please hover over them so they can introduce themselves to you.";
/** The staff room is scrolled and tapped rather than hovered, so the invitation asks for that. */
const BOARD_INVITATION_COMPACT = "My Back Office will be opened to you soon. To introduce my team please scroll to them so they can introduce themselves to you.";

/** The board writes a colleague's own words; `titled` adds a separate name line, which Hobson's invitation needs and a colleague's greeting already carries. */
function WrittenIntroduction({ name, text, titled = true }: { name: string; text: string; titled?: boolean }) {
  const [length, setLength] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLength(text.length);
      return;
    }
    const timer = window.setInterval(() => setLength((n) => {
      if (n >= text.length) window.clearInterval(timer);
      return Math.min(n + 3, text.length);
    }), 18);
    return () => window.clearInterval(timer);
  }, [text]);
  return <>
    <span className="sr-only">{name}. {text}</span>
    <div aria-hidden="true">{titled && <strong>{name}</strong>}<p>{text.slice(0, length)}</p></div>
  </>;
}

/** Image-relative targets preserve the supplied room and existing colleague handovers. */
const ART_ASPECT = 1162 / 1374;
/** Fill the space, trimming at most a thin edge and stretching gently before falling back to centring. */
const MAX_EDGE_TRIM = 0.10;
const MAX_STRETCH = 1.35;
/** The room keeps a little air around it: everything within it — board, colleagues, targets — shrinks together. */
const ROOM_SCALE = 0.9;

function useRoomFill() {
  const ref = useRef<HTMLElement | null>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const host = ref.current;
    if (!host || typeof ResizeObserver === "undefined") return;
    const measure = () => {
      const bw = host.clientWidth, bh = host.clientHeight;
      if (!bw || !bh) return;
      setCompact(bw < COMPACT_WIDTH);
      const boxAspect = bw / bh;
      let w: number, h: number;
      if (boxAspect >= ART_ASPECT) {
        const trim = Math.min(MAX_EDGE_TRIM, Math.max(0, 1 - ART_ASPECT / boxAspect));
        h = bh / (1 - trim); w = h * ART_ASPECT;
        if (bw / w > MAX_STRETCH) { w = bw / MAX_STRETCH; h = w / ART_ASPECT; }
        if (h / bh > 1.30) { w = Math.min(bw, bh * ART_ASPECT); h = w / ART_ASPECT; }
      } else {
        const trim = Math.min(MAX_EDGE_TRIM, Math.max(0, 1 - boxAspect / ART_ASPECT));
        w = bw / (1 - trim); h = w / ART_ASPECT;
        if (bh / h > MAX_STRETCH) { h = bh / MAX_STRETCH; w = h * ART_ASPECT; }
        if (w / bw > 1.40) { w = Math.min(bw, bh * ART_ASPECT); h = w / ART_ASPECT; }
      }
      setSize({ w: w * ROOM_SCALE, h: h * ROOM_SCALE });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(host);
    return () => observer.disconnect();
  }, []);
  return { ref, size, compact };
}

export default function BackOfficeClassroom({ onOpen, introductions = [] }: {
  onOpen?: (id: string) => void;
  introductions?: readonly { id: string; contribution: string }[];
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  /** Staff-room state: the board follows whichever colleague the list is resting on. */
  const [focused, setFocused] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const { ref, size, compact } = useRoomFill();
  useEffect(() => {
    if (document.querySelector('[data-classroom-handwriting]')) return;
    const font = document.createElement("link");
    font.rel = "stylesheet";
    font.href = "https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&display=swap";
    font.dataset.classroomHandwriting = "true";
    document.head.append(font);
  }, []);
  const colleague = specialists.find((c) => c.id === hovered);
  const contribution = introductions.find((c) => c.id === hovered)?.contribution ?? "";
  /** Hobson himself is never a target: the board carries his invitation until a colleague is reached. */
  const writing = colleague ? { name: colleague.name, text: contribution } : { name: "Hobson", text: BOARD_INVITATION };
  const open = (id: string) => { onOpen?.(id); };

  /** Whose turn it is to speak on the staff-room board, in the butler's own mobile wording. */
  const writtenFor = (id: string | null) => {
    const person = specialists.find((c) => c.id === id);
    if (!person) return { name: "Hobson", text: BOARD_INVITATION_COMPACT };
    return { name: person.name, text: introductions.find((c) => c.id === id)?.contribution ?? "" };
  };

  /** The board writes whichever colleague the list is resting on, so the room reads as you scroll. */
  const selectedRef = useRef<string | null>(null);
  useEffect(() => {
    if (!compact) return;
    const host = ref.current, list = listRef.current;
    if (!host || !list || typeof ResizeObserver === "undefined") return;
    const rows = Array.from(list.querySelectorAll<HTMLElement>("li[data-colleague]"));
    if (!rows.length) return;
    const distance = (el: HTMLElement) => {
      const r = el.getBoundingClientRect(), h = host.getBoundingClientRect();
      if (Math.min(r.bottom, h.bottom) - Math.max(r.top, h.top) <= 0) return Number.POSITIVE_INFINITY;
      return Math.abs(r.top + r.height / 2 - readingLine(host));
    };
    const pick = () => {
      if (host.scrollTop < 4) { if (!selectedRef.current) setFocused(null); return; }
      let best = rows[0], bestScore = distance(rows[0]);
      for (const row of rows) {
        const s = distance(row);
        if (s < bestScore) { best = row; bestScore = s; }
      }
      if (bestScore > 90) return;
      const id = best.dataset.colleague ?? null;
      setFocused((current) => {
        const resting = rows.find((r) => r.dataset.colleague === current);
        return resting && distance(resting) <= bestScore + 24 ? current : id;
      });
    };

    host.addEventListener("scroll", pick, { passive: true });
    list.addEventListener("mouseleave", pick);
    const observer = new ResizeObserver(pick);
    observer.observe(list);
    pick();
    return () => {
      host.removeEventListener("scroll", pick);
      list.removeEventListener("mouseleave", pick);
      observer.disconnect();
    };
  }, [compact]);


  if (compact) {
    const written = focused ?? selected;
    const board = writtenFor(written);
    return (
      <main ref={ref} className="illustrated-classroom compact-classroom" aria-label="Back Office classroom">
        <div className="compact-head">
          <section className="compact-board" aria-live="polite">
            <img src={OWLS[written ?? "hobson"]} alt="" className="compact-board-owl" />
            <div className="compact-board-text">
              <WrittenIntroduction key={written ?? "hobson"} name={board.name} text={board.text} />
            </div>
          </section>
          <p className="compact-today">Today's work · 28 Oct</p>
        </div>
        <ul className="compact-team" ref={listRef}>

          {specialists.map((c) => {
            const active = written === c.id;
            return <li key={c.id} data-colleague={c.id} className={active ? "is-active" : ""}>
              <button type="button" className="compact-member" aria-expanded={selected === c.id} aria-label={c.section}
                onMouseEnter={() => setFocused(c.id)}
                onClick={(e) => {
                  const next = selected === c.id ? null : c.id;
                  selectedRef.current = next;
                  setSelected(next); setFocused(next);
                  const host = ref.current, row = e.currentTarget.closest("li");
                  if (next && host && row) {
                    const r = row.getBoundingClientRect(), h = host.getBoundingClientRect();
                    host.scrollTo({ top: host.scrollTop + (r.top + r.height / 2) - readingLine(host), behavior: "smooth" });
                  }
                }}>

                <img src={OWLS[c.id]} alt="" />
                <span><strong>{c.name}</strong><small>{c.section}</small></span>
              </button>
              {selected === c.id && <Button size="sm" className="compact-open" onClick={() => open(c.id)}>Open {c.section.toLowerCase()}</Button>}
            </li>;
          })}
        </ul>
        <p className="compact-signoff">
          <img src={OWLS.hobson} alt="" />
          <span>That is the team. Shall I show you anyone's work?</span>
          <Button variant="ghost" size="sm" className="compact-top" onClick={() => ref.current?.scrollTo({ top: 0, behavior: "smooth" })}>Back to the top</Button>
        </p>

      </main>
    );
  }


  return (
    <main ref={ref} className="illustrated-classroom" aria-label="Back Office classroom">
      <div className="illustrated-room" style={size ? {
        width: size.w, height: size.h, position: "absolute",
        left: "50%", top: "50%", transform: "translate(-50%, -50%)",
      } : undefined}>
        <img className="illustrated-room-art" src={room.url} alt="Hobson at the front of his team's classroom" width={1162} height={1374} draggable={false} />

        {specialists.map((c) => (
          <Button key={c.id} variant="ghost" className={`illustrated-colleague illustrated-${c.id}`}
            aria-label={c.section} aria-describedby={hovered === c.id ? "classroom-introduction" : undefined}
            onMouseEnter={() => setHovered(c.id)} onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(c.id)} onBlur={() => setHovered(null)} onClick={() => open(c.id)}>
            <span className="sr-only">{c.name}</span>
          </Button>
        ))}
        <div id="classroom-introduction" role="region" aria-label="Hobson's whiteboard" aria-live="polite"
          className="illustrated-introduction">
          <WrittenIntroduction key={hovered ?? "invitation"} name={writing.name} text={writing.text} titled={hovered === null} />
        </div>
      </div>
    </main>
  );
}
