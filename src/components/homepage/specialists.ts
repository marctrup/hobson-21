import professorImg from "@/assets/prototype/character-professor.png";
import architectAsset from "@/assets/prototype/character-architect.png.asset.json";
import inspectorImg from "@/assets/prototype/character-inspector.png";
import brokerImg from "@/assets/prototype/character-broker.png";
import researcherAsset from "@/assets/prototype/character-researcher.png.asset.json";
import bookkeeperAsset from "@/assets/prototype/character-bookkeeper.png.asset.json";
import communicatorAsset from "@/assets/prototype/character-communicator.png.asset.json";
import keeperImg from "@/assets/prototype/character-keeper.png";

export const architectImg = architectAsset.url;
export const researcherImg = researcherAsset.url;
export const bookkeeperImg = bookkeeperAsset.url;
export const communicatorImg = communicatorAsset.url;
export { professorImg, inspectorImg, brokerImg, keeperImg };

export type Specialist = {
  name: string;
  owns: string;
  img: string;
  blurb: string;
  tone: "persistent" | "service";
};

export const PERSISTENT_SPECIALISTS: Specialist[] = [
  { name: "The Professor", owns: "Portfolio Knowledge", img: professorImg, tone: "persistent",
    blurb: "Reads every lease, licence, report and certificate you entrust to Hobson — and remembers." },
  { name: "The Architect", owns: "Portfolio Structure", img: architectImg, tone: "persistent",
    blurb: "Keeps the shape of your estate accurate — units, properties, hierarchies and groupings." },
  { name: "The Inspector", owns: "Compliance Position", img: inspectorImg, tone: "persistent",
    blurb: "Compares what's held against what's required, and quietly surfaces what's missing." },
  { name: "The Broker", owns: "Relationships", img: brokerImg, tone: "persistent",
    blurb: "Holds the web of people and organisations — landlords, tenants, agents, contractors." },
];

export const SERVICE_SPECIALISTS: Specialist[] = [
  { name: "The Researcher", owns: "External Research", img: researcherImg, tone: "service",
    blurb: "Fetches trusted information from beyond your portfolio — legislation, Land Registry, EPCs, comparables." },
  { name: "The Bookkeeper", owns: "Calculations & Finance", img: bookkeeperImg, tone: "service",
    blurb: "Performs every figure Hobson needs — rent, service charges, reconciliations, statements." },
  { name: "The Communicator", owns: "Systems & Integrations", img: communicatorImg, tone: "service",
    blurb: "Connects Hobson securely to the systems you already use, retrieving live information." },
  { name: "The Keeper", owns: "Access & Security", img: keeperImg, tone: "service",
    blurb: "Verifies permissions and protects confidential information. Usually invisible — always present." },
];
