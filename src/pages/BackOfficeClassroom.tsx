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

/** Team stands behind Hobson; each owl is permanently labelled by its area and opens that colleague's page. */
export default function BackOfficeClassroom({ onOpen }: { onOpen?: (id: string) => void }) {
  return (
    <main className="back-office-classroom" aria-label="Back Office classroom">
      <div className="classroom-environment">
        <div className="classroom-stage">
          {specialists.map((c) => (
            <div key={c.id} className={`classroom-pupil classroom-${c.id}`}>
              <Button variant="ghost" className="classroom-character" aria-label={c.section} title="" onClick={() => onOpen?.(c.id)}>
                <img src={c.image.url} alt={c.name} width={768} height={768} draggable={false} />
                <span className="classroom-desk" aria-hidden="true" />
                <span className="classroom-name" aria-hidden="true">{c.name}</span>
                <span className="classroom-section">{c.section}</span>
              </Button>
            </div>
          ))}
          <div className="classroom-teacher">
            <div className="classroom-teacher-figure">
              <img src={hobson.url} alt="Hobson" width={768} height={768} draggable={false} />
              <span className="classroom-name" aria-hidden="true">Hobson</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
