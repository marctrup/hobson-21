import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import room from "@/assets/back-office-illustrated-room.png.asset.json";
import "./BackOfficeIllustratedRoom.css";

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
export default function BackOfficeClassroom({ onOpen, introductions = [] }: {
  onOpen?: (id: string) => void;
  introductions?: readonly { id: string; contribution: string }[];
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [details, setDetails] = useState(false);
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
  return (
    <main className="illustrated-classroom" aria-label="Back Office classroom">
      <div className="illustrated-room">
        <img className="illustrated-room-art" src={room.url} alt="Hobson at the front of his team's classroom" width={1060} height={1223} draggable={false} />
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
