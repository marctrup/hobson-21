import { Button } from "@/components/ui/button";
import hobsonBase from "@/assets/back-office/hobson-base.png";
import hobsonStick from "@/assets/back-office/hobson-stick.png";
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
          <div className="classroom-whiteboard" aria-label="Today's work">
            <p className="classroom-wb-title">Today's work — 28 Oct</p>
            <ul>
              <li>Professor — read papers for 1115 Finchley Road</li>
              <li>Inspector — check compliance, gas &amp; fire certs</li>
              <li>Architect — tidy Unit list, Paragon Centre</li>
              <li>Broker — confirm new electrician contact</li>
              <li>Keeper — review access for new starter</li>
            </ul>
            <span className="classroom-wb-tray" aria-hidden="true" />
          </div>
          {specialists.map((c) => (
            <div key={c.id} className={`classroom-pupil classroom-${c.id}`}>
              <Button variant="ghost" className="classroom-character" aria-label={c.section} title="" onClick={() => onOpen?.(c.id)}>
                <img src={c.image.url} alt={c.name} width={768} height={768} draggable={false} />
                <span className="classroom-desk" aria-hidden="true" />
                <span className="classroom-spotlight" aria-hidden="true" />
                <span className="classroom-lamp" aria-hidden="true">
                  <span className="classroom-lamp-cord" />
                  <span className="classroom-lamp-shade" />
                  <span className="classroom-lamp-bulb" />
                </span>
                <span className="classroom-name" aria-hidden="true">{c.name}</span>
                <span className="classroom-section">{c.section}</span>
              </Button>
            </div>
          ))}
          <div className="classroom-teacher">
            <div className="classroom-teacher-figure">
              <img src={hobsonBase} alt="Hobson" width={768} height={768} draggable={false} />
              <img src={hobsonStick} alt="" aria-hidden="true" width={768} height={768} draggable={false} className="classroom-hobson-stick" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
