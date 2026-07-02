import professorAsset from "@/assets/prototype/character-professor.png.asset.json";
const professorImg = professorAsset.url;
import architectAsset from "@/assets/prototype/character-architect.png.asset.json";
import inspectorAsset from "@/assets/prototype/character-inspector.png.asset.json";
const inspectorImg = inspectorAsset.url;
import brokerAsset from "@/assets/prototype/character-broker.png.asset.json";
const brokerImg = brokerAsset.url;
import researcherAsset from "@/assets/prototype/character-researcher.png.asset.json";
import bookkeeperAsset from "@/assets/prototype/character-bookkeeper.png.asset.json";
import communicatorAsset from "@/assets/prototype/character-communicator.png.asset.json";
import keeperAsset from "@/assets/prototype/character-keeper.png.asset.json";
const keeperImg = keeperAsset.url;

const architectImg = architectAsset.url;
const researcherImg = researcherAsset.url;
const bookkeeperImg = bookkeeperAsset.url;
const communicatorImg = communicatorAsset.url;

type Specialist = {
  name: string;
  owns: string;
  img: string;
  blurb: string;
  tone: "persistent" | "service";
};

const PERSISTENT: Specialist[] = [
  { name: "The Professor", owns: "Portfolio Knowledge", img: professorImg, tone: "persistent",
    blurb: "I maintain everything Hobson knows from your documents — leases, licences, plans, reports and every other record you entrust to him." },
  { name: "The Architect", owns: "Portfolio Structure", img: architectImg, tone: "persistent",
    blurb: "I keep the structure of your estate accurate — units, properties, hierarchies and groupings — so Hobson always understands how everything fits together." },
  { name: "The Inspector", owns: "Compliance Position", img: inspectorImg, tone: "persistent",
    blurb: "I compare what is known against what is required, helping Hobson understand your compliance position and quietly identifying anything that's missing." },
  { name: "The Broker", owns: "Relationships", img: brokerImg, tone: "persistent",
    blurb: "I maintain Hobson's understanding of the people and organisations connected to your portfolio, so he always knows who he's working with." },
];

const SERVICES: Specialist[] = [
  { name: "The Researcher", owns: "External Research", img: researcherImg, tone: "service",
    blurb: "I find trusted information beyond your portfolio, including legislation, public records, market evidence and industry guidance." },
  { name: "The Bookkeeper", owns: "Calculations & Finance", img: bookkeeperImg, tone: "service",
    blurb: "I perform calculations, reconciliations and financial analysis whenever Hobson needs accurate figures or statements." },
  { name: "The Communicator", owns: "Systems & Integrations", img: communicatorImg, tone: "service",
    blurb: "I connect securely to your existing systems, retrieving authorised information whenever Hobson needs live data." },
  { name: "The Keeper", owns: "Access & Security", img: keeperImg, tone: "service",
    blurb: "I protect your information by verifying permissions before Hobson accesses, shares or carries out sensitive work on your behalf." },
];

const SpecialistCard: React.FC<{ s: Specialist; index: number }> = ({ s, index }) => (
  <article
    className="group relative rounded-3xl bg-white border border-purple-100 p-6 shadow-[0_8px_30px_-12px_rgba(124,58,237,0.18)] hover:shadow-[0_20px_50px_-15px_rgba(124,58,237,0.35)] hover:-translate-y-1 transition-all duration-500"
    style={{ animation: `fade-up 0.6s ease ${index * 80}ms both` }}
  >
    <div className="absolute -top-3 left-6 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider"
      style={s.tone === "persistent"
        ? { background: "linear-gradient(135deg,#7c3aed,#a78bfa)", color: "white" }
        : { background: "#f5f3ff", color: "#6d28d9", border: "1px solid #ddd6fe" }}>
      {s.tone === "persistent" ? "Maintains" : "Provides"}
    </div>
    <div className="flex items-start gap-4">
      <div className="w-24 h-24 shrink-0 rounded-2xl bg-gradient-to-br from-purple-50 to-white border border-purple-100 grid place-items-center overflow-hidden">
        <img src={s.img} alt={s.name} className="w-20 h-20 object-contain group-hover:scale-110 transition-transform duration-500" />
      </div>
      <div className="min-w-0">
        <h3 className="text-lg font-bold text-slate-900">{s.name}</h3>
        <p className="text-sm font-medium text-purple-700">{s.owns}</p>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">{s.blurb}</p>
      </div>
    </div>
  </article>
);

export const TheTeamSection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white to-purple-50/40">
      <style>{`
        @keyframes fade-up { from { opacity: 0; transform: translateY(16px);} to { opacity: 1; transform: none;} }
      `}</style>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-purple-600 uppercase">The team</p>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight">Two kinds of specialist.</h2>
          <p className="mt-4 text-lg text-slate-600">
            Some of my agents quietly maintain my understanding of your portfolio over time. Others provide expert services whenever I need them. Together, they help me understand your business, complete work on your behalf and give you one clear answer.
          </p>
        </div>

        {/* Persistent */}
        <div className="mt-14 max-w-5xl mx-auto">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h3 className="text-2xl font-bold text-foreground">Hobson's Permanent Memory</h3>
              <p className="text-slate-600 text-sm mt-1">These four agents quietly maintain everything I know about your portfolio.</p>
            </div>
            <span className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-700 bg-white border border-purple-200 rounded-full px-3 py-1.5">
              Always on
            </span>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {PERSISTENT.map((s, i) => <SpecialistCard key={s.name} s={s} index={i} />)}
          </div>
        </div>

        {/* Services */}
        <div className="mt-20 max-w-5xl mx-auto">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h3 className="text-2xl font-bold text-foreground">Specialist Services</h3>
              <p className="text-slate-600 text-sm mt-1">Whenever Hobson needs specialist expertise, these are the agents he calls upon.</p>
            </div>
            <span className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-700 bg-white border border-purple-200 rounded-full px-3 py-1.5">
              On demand
            </span>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {SERVICES.map((s, i) => <SpecialistCard key={s.name} s={s} index={i} />)}
          </div>
        </div>
      </div>
    </section>
  );
};
