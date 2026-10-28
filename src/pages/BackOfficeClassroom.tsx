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
  useEffect(() => {
    if (document.querySelector('[data-classroom-handwriting]')) return;
    const font = document.createElement("link");
    font.rel = "stylesheet";
    font.href = "https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&display=swap";
    font.dataset.classroomHandwriting = "true";
    document.head.append(font);
  }, []);
  const colleague = specialists.find((c) => c.id === hovered);
  const introduction = introductions.find((c) => c.id === hovered);
  return (
    <main className="illustrated-classroom" aria-label="Back Office classroom">
      <div className="illustrated-room">
        <img className="illustrated-room-art" src={room.url} alt="Hobson at the front of his team's classroom" width={768} height={888} draggable={false} />
        {specialists.map((c) => (
          <Button key={c.id} variant="ghost" className={`illustrated-colleague illustrated-${c.id}`}
            aria-label={c.section} aria-describedby={hovered === c.id ? "classroom-introduction" : undefined}
            onMouseEnter={() => setHovered(c.id)} onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(c.id)} onBlur={() => setHovered(null)} onClick={() => onOpen?.(c.id)}>
            <span className="sr-only">{c.name}</span>
          </Button>
        ))}
        {colleague && <div id="classroom-introduction" role="tooltip" className="illustrated-introduction">
          <WrittenIntroduction key={colleague.id} name={colleague.name} text={introduction?.contribution ?? ""} />
        </div>}
      </div>
    </main>
  );
}
