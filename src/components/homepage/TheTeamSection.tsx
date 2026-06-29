import professorImg from "@/assets/prototype/character-professor.png";
import architectAsset from "@/assets/prototype/character-architect.png.asset.json";
import inspectorImg from "@/assets/prototype/character-inspector.png";
import brokerImg from "@/assets/prototype/character-broker.png";
import researcherAsset from "@/assets/prototype/character-researcher.png.asset.json";
import bookkeeperAsset from "@/assets/prototype/character-bookkeeper.png.asset.json";
import communicatorAsset from "@/assets/prototype/character-communicator.png.asset.json";
import keeperImg from "@/assets/prototype/character-keeper.png";

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
    blurb: "Maintains everything I know from your documents — leases, licences, plans, reports and every other record you entrust to me." },
  { name: "The Architect", owns: "Portfolio Structure", img: architectImg, tone: "persistent",
    blurb: "Keeps the structure of your estate accurate — units, properties, hierarchies and groupings — so I always understand how everything fits together." },
  { name: "The Inspector", owns: "Compliance Position", img: inspectorImg, tone: "persistent",
    blurb: "Compares what is known against what is required, helping me understand your compliance position and identify anything that's missing." },
  { name: "The Broker", owns: "Relationships", img: brokerImg, tone: "persistent",
    blurb: "Maintains my understanding of the people and organisations connected to your portfolio, so I always know who I'm working with." },
];

const SERVICES: Specialist[] = [
  { name: "The Researcher", owns: "External Research", img: researcherImg, tone: "service",
    blurb: "Finds trusted information beyond your portfolio whenever I need it, including legislation, public records, market evidence and industry guidance." },
  { name: "The Bookkeeper", owns: "Calculations & Finance", img: bookkeeperImg, tone: "service",
    blurb: "Performs calculations, reconciliations and financial analysis whenever I need accurate figures or statements." },
  { name: "The Communicator", owns: "Systems & Integrations", img: communicatorImg, tone: "service",
    blurb: "Connects Hobson securely to the systems you already use, retrieving live information." },
  { name: "The Keeper", owns: "Access & Security", img: keeperImg, tone: "service",
    blurb: "Verifies permissions and protects confidential information. Usually invisible — always present." },
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
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900">Two kinds of specialist.</h2>
          <p className="mt-4 text-lg text-slate-600">
            Some look after what Hobson knows about your portfolio over time. Others provide an expert service
            the moment Hobson needs it. Together, they let him answer almost anything you put to him.
          </p>
        </div>

        {/* Persistent */}
        <div className="mt-14 max-w-5xl mx-auto">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Hobson&apos;s permanent memory</h3>
              <p className="text-slate-600 text-sm mt-1">These four specialists quietly maintain everything Hobson knows about your estate.</p>
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
              <h3 className="text-2xl font-bold text-slate-900">Specialist services</h3>
              <p className="text-slate-600 text-sm mt-1">Called on whenever their expertise is required.</p>
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
