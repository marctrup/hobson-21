import { useState } from "react";
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

/** Phase 1A: inspect the classroom arrangement without starting work or navigation. */
export default function BackOfficeClassroom() {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <main className="back-office-classroom" aria-label="Back Office classroom">
      <header className="classroom-header">
        <nav aria-label="Back Office sections" className="classroom-navigation">
          {specialists.map((colleague) => (
            <Button key={colleague.id} variant="ghost" className="classroom-tab" aria-pressed={selected === colleague.id} onClick={() => setSelected(colleague.id)}>
              {colleague.section}
            </Button>
          ))}
        </nav>
      </header>
      <div className="classroom-environment">
        <div className="classroom-stage">
          {specialists.map((colleague) => (
            <div key={colleague.id} className={`classroom-pupil classroom-${colleague.id}`} data-selected={selected === colleague.id}>
              <Button variant="ghost" className="classroom-character" aria-label={`${colleague.name} — ${colleague.section}`} aria-pressed={selected === colleague.id} onClick={() => setSelected(colleague.id)} title={colleague.section}>
                <img src={colleague.image.url} alt={colleague.name} width={768} height={768} draggable={false} />
              </Button>
            </div>
          ))}
          <div className="classroom-teacher">
            <img src={hobson.url} alt="Hobson, the teacher" width={768} height={768} draggable={false} />
          </div>
        </div>
      </div>
    </main>
  );
}