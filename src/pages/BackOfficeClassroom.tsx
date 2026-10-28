import { useLayoutEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import hobson from "@/assets/back-office/hobson.png.asset.json";
import keeper from "@/assets/back-office/keeper.png.asset.json";
import broker from "@/assets/back-office/broker.png.asset.json";
import inspector from "@/assets/back-office/inspector.png.asset.json";
import professor from "@/assets/back-office/professor.png.asset.json";
import architect from "@/assets/back-office/architect.png.asset.json";

const specialists = [
  { id: "keeper", name: "The Keeper", section: "Permissions", image: keeper },
  { id: "broker", name: "The Broker", section: "Contacts", image: broker },
  { id: "inspector", name: "The Inspector", section: "Compliance", image: inspector },
  { id: "professor", name: "The Professor", section: "Papers", image: professor },
  { id: "architect", name: "The Architect", section: "Units", image: architect },
] as const;

type Pointer = { x1: number; y1: number; x2: number; y2: number; angle: number; lean: number };

/** Hobson hops, turns and points to the colleague for the chosen section; nothing navigates yet. */
export default function BackOfficeClassroom() {
  const [selected, setSelected] = useState<string | null>(null);
  const [cue, setCue] = useState(0);
  const [pointer, setPointer] = useState<Pointer | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const teacher = useRef<HTMLDivElement>(null);
  const pupils = useRef<Record<string, HTMLDivElement | null>>({});

  const choose = (id: string) => { setSelected(id); setCue((n) => n + 1); };

  useLayoutEffect(() => {
    const measure = () => {
      const s = stage.current?.getBoundingClientRect();
      const t = teacher.current?.getBoundingClientRect();
      const p = selected ? pupils.current[selected]?.getBoundingClientRect() : undefined;
      if (!s || !t || !p) return setPointer(null);
      const x1 = t.left - s.left + t.width / 2, y1 = t.top - s.top + t.height * 0.3;
      const x2 = p.left - s.left + p.width / 2, y2 = p.top - s.top + p.height * 0.62;
      const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
      setPointer({ x1, y1, x2, y2, angle, lean: Math.max(-14, Math.min(14, (x2 - x1) / 25)) });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [selected]);

  return (
    <main className="back-office-classroom" aria-label="Back Office classroom">
      <header className="classroom-header">
        <nav aria-label="Back Office sections" className="classroom-navigation">
          {specialists.map((c) => (
            <Button key={c.id} variant="ghost" className="classroom-tab" aria-pressed={selected === c.id} onClick={() => choose(c.id)}>
              {c.section}
            </Button>
          ))}
        </nav>
      </header>
      <div className="classroom-environment">
        <div className="classroom-stage" ref={stage}>
          {specialists.map((c) => (
            <div key={c.id} ref={(el) => { pupils.current[c.id] = el; }} className={`classroom-pupil classroom-${c.id}`} data-selected={selected === c.id}>
              <Button key={selected === c.id ? `on-${cue}` : "off"} variant="ghost" className="classroom-character" aria-label={`${c.name} — ${c.section}`} aria-pressed={selected === c.id} onClick={() => choose(c.id)}>
                <img src={c.image.url} alt={c.name} width={768} height={768} draggable={false} />
                <span className="classroom-name" aria-hidden="true">{c.name}</span>
              </Button>
            </div>
          ))}
          <div className="classroom-teacher" ref={teacher}>
            <div
              key={`hobson-${cue}`}
              className="classroom-teacher-figure"
            >
              <img src={hobson.url} alt="Hobson, the teacher" width={768} height={768} draggable={false} />
              <span className="classroom-name" aria-hidden="true">Hobson</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
