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

const specialists = [
  { id: "keeper", name: "The Keeper", section: "Permissions" },
  { id: "broker", name: "The Broker", section: "Contacts" },
  { id: "inspector", name: "The Inspector", section: "Compliance" },
  { id: "professor", name: "The Professor", section: "Papers" },
  { id: "architect", name: "The Architect", section: "Units" },
] as const;

/** Hobson speaks for the whole team: his own introduction presents the specialists beside him. */
const HOBSON_INTRODUCTION = "Good day. I am Hobson. May I present my colleagues — the Professor, the Architect, the Broker, the Keeper and the Inspector. Hover over any of them, or click, for more details.";

function WrittenIntroduction({ name, text }: { name: string; text: string }) {
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
    <div aria-hidden="true"><strong>{name}</strong><p>{text.slice(0, length)}</p></div>
  </>;
}

/** Image-relative targets preserve the supplied room and existing colleague handovers. */
const ART_ASPECT = 1162 / 1374;
/** Fill the space, trimming at most a thin edge and stretching gently before falling back to centring. */
const MAX_EDGE_TRIM = 0.10;
const MAX_STRETCH = 1.35;

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
      setSize({ w, h });
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
  const [details, setDetails] = useState(false);
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
  const writing = hovered === "hobson"
    ? { name: "Hobson", text: HOBSON_INTRODUCTION }
    : colleague ? { name: colleague.name, text: contribution } : null;
  const open = (id: string) => { setDetails(false); onOpen?.(id); };

  /** Whose turn it is to speak on the staff-room board, in the butler's own mobile wording. */
  const writtenFor = (id: string | null) => {
    const person = specialists.find((c) => c.id === id);
    if (!person) return { name: "Hobson", text: HOBSON_INTRODUCTION.replace("Hover over any of them, or click, for more details.", "Tap any of them to hear from them in person.") };
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
      return Math.abs(r.top + r.height / 2 - (h.top + h.height * READING_LINE));
    };
    const pick = () => {
      if (host.scrollTop < 4) { if (!selectedRef.current) setFocused(null); return; }
      let best = rows[0], bestScore = distance(rows[0]);
      for (const row of rows) {
        const s = distance(row);
        if (s < bestScore) { best = row; bestScore = s; }
      }
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
                  setSelected(next); setFocused(next);
                  if (next) e.currentTarget.closest("li")?.scrollIntoView({ behavior: "smooth", block: "center" });
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
        <Button variant="ghost" className="illustrated-colleague illustrated-hobson" aria-label="Hobson"
          aria-expanded={details} aria-describedby={hovered === "hobson" ? "classroom-introduction" : undefined}
          onMouseEnter={() => setHovered("hobson")} onMouseLeave={() => setHovered(null)}
          onFocus={() => setHovered("hobson")} onBlur={() => setHovered(null)}
          onClick={() => setDetails((d) => !d)}>
          <span className="sr-only">Hobson — hover or click for more details</span>
        </Button>
        {specialists.map((c) => (
          <Button key={c.id} variant="ghost" className={`illustrated-colleague illustrated-${c.id}`}
            aria-label={c.section} aria-describedby={hovered === c.id ? "classroom-introduction" : undefined}
            onMouseEnter={() => setHovered(c.id)} onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(c.id)} onBlur={() => setHovered(null)} onClick={() => open(c.id)}>
            <span className="sr-only">{c.name}</span>
          </Button>
        ))}
        {writing && <div id="classroom-introduction" role="tooltip" className={`illustrated-introduction ${hovered === "hobson" ? "illustrated-introduction-hobson" : ""}`}>
          <WrittenIntroduction key={hovered ?? "none"} name={writing.name} text={writing.text} />
        </div>}
        {details && <div className="illustrated-hobson-details" role="region" aria-label="Hobson's colleagues">
          <header className="illustrated-hobson-details-head">
            <p className="illustrated-hobson-details-title">My colleagues</p>
            <p className="illustrated-hobson-details-note">Each keeps a particular part of your portfolio in order. Hover over any colleague to hear from them in person, or select a name and I shall show you their work.</p>
            <Button variant="ghost" size="sm" className="illustrated-hobson-details-close" aria-label="Close Hobson's introduction" onClick={() => setDetails(false)}>Close</Button>
          </header>
          <ul className="illustrated-hobson-details-list">
            {specialists.map((c) => (
              <li key={c.id}>
                <Button variant="ghost" className="illustrated-hobson-details-row" onClick={() => open(c.id)}>
                  <span className="illustrated-hobson-details-name">{c.name}</span>
                  <span className="illustrated-hobson-details-area">{c.section}</span>
                </Button>
              </li>
            ))}
          </ul>
        </div>}
      </div>
    </main>
  );
}
