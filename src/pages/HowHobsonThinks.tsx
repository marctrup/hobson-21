import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { HomepageHeader } from "@/components/homepage/HomepageHeader";
import { HomepageFooter } from "@/components/homepage/HomepageFooter";
import { ArrowRight, Check } from "lucide-react";

import hobsonOwl from "@/assets/hobson-owl-hero.png";
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
    blurb: "Reads every lease, licence, report and certificate you entrust to Hobson — and remembers." },
  { name: "The Architect", owns: "Portfolio Structure", img: architectImg, tone: "persistent",
    blurb: "Keeps the shape of your estate accurate — units, properties, hierarchies and groupings." },
  { name: "The Inspector", owns: "Compliance Position", img: inspectorImg, tone: "persistent",
    blurb: "Compares what's held against what's required, and quietly surfaces what's missing." },
  { name: "The Broker", owns: "Relationships", img: brokerImg, tone: "persistent",
    blurb: "Holds the web of people and organisations — landlords, tenants, agents, contractors." },
];

const SERVICES: Specialist[] = [
  { name: "The Researcher", owns: "External Research", img: researcherImg, tone: "service",
    blurb: "Fetches trusted information from beyond your portfolio — legislation, Land Registry, EPCs, comparables." },
  { name: "The Bookkeeper", owns: "Calculations & Finance", img: bookkeeperImg, tone: "service",
    blurb: "Performs every figure Hobson needs — rent, service charges, reconciliations, statements." },
  { name: "The Communicator", owns: "Systems & Integrations", img: communicatorImg, tone: "service",
    blurb: "Connects Hobson securely to the systems you already use, retrieving live information." },
  { name: "The Keeper", owns: "Access & Security", img: keeperImg, tone: "service",
    blurb: "Verifies permissions and protects confidential information. Usually invisible — always present." },
];

// Rent review orchestration beats
const RENT_REVIEW: { who: string; img: string; line: string }[] = [
  { who: "The Professor", img: professorImg, line: "Reviewing your lease and rent review provisions…" },
  { who: "The Researcher", img: researcherImg, line: "Finding comparable evidence in the market…" },
  { who: "The Bookkeeper", img: bookkeeperImg, line: "Preparing the rental analysis…" },
  { who: "The Broker", img: brokerImg, line: "Identifying the relevant parties for the notice…" },
  { who: "The Inspector", img: inspectorImg, line: "Confirming statutory requirements…" },
  { who: "The Keeper", img: keeperImg, line: "Verifying permissions to send the notice…" },
];

const HowHobsonThinks: React.FC = () => {
  // Orchestration demo state
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setStep((s) => (s + 1) % (RENT_REVIEW.length + 2));
    }, 1800);
    return () => clearInterval(id);
  }, [playing]);

  const finalShown = step >= RENT_REVIEW.length + 1;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Helmet>
        <title>How Hobson Thinks — One Butler, A Quiet Team of Specialists</title>
        <meta name="description" content="The architecture behind Hobson AI: one conversation, one orchestrator, eight specialists, and unlimited capabilities for property professionals." />
        <link rel="canonical" href="https://hobsonschoice.ai/how-hobson-thinks" />
      </Helmet>

      <style>{`
        @keyframes fade-up { from { opacity: 0; transform: translateY(16px);} to { opacity: 1; transform: none;} }
        @keyframes float-slow { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-10px);} }
        @keyframes pulse-ring { 0% { transform: scale(0.9); opacity:0.7;} 100% { transform: scale(1.6); opacity:0;} }
        @keyframes draw-line { from { stroke-dashoffset: 400;} to { stroke-dashoffset: 0;} }
        .hh-grid-bg {
          background-image:
            radial-gradient(circle at 20% 10%, rgba(167,139,250,0.18), transparent 40%),
            radial-gradient(circle at 80% 30%, rgba(124,58,237,0.12), transparent 45%),
            linear-gradient(to bottom, #faf8ff, #ffffff);
        }
      `}</style>

      <HomepageHeader />

      {/* HERO */}
      <section className="relative overflow-hidden hh-grid-bg">
        <div className="container mx-auto px-6 pt-16 pb-24 lg:pt-24 lg:pb-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold tracking-wide uppercase">
                How Hobson thinks
              </div>
              <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-slate-900">
                One conversation.<br/>
                <span className="bg-gradient-to-r from-purple-700 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                  A quiet team behind it.
                </span>
              </h1>
              <p className="mt-6 text-lg text-slate-600 max-w-xl leading-relaxed">
                You only ever speak to Hobson. Behind him stands a small, carefully chosen team of specialists —
                each with one job. Hobson decides who is needed, in what order, and brings their work together as a single answer.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#orchestration" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold transition">
                  See him at work <ArrowRight className="w-4 h-4" />
                </a>
                <a href="#team" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-purple-200 text-purple-800 hover:bg-purple-50 font-semibold transition">
                  Meet the team
                </a>
              </div>
            </div>

            <div className="relative h-[420px] lg:h-[520px]">
              {/* Orbit rings */}
              <div className="absolute inset-0 grid place-items-center">
                <div className="absolute w-72 h-72 rounded-full border border-purple-200/70" />
                <div className="absolute w-[22rem] h-[22rem] rounded-full border border-purple-100" />
                <div className="absolute w-[28rem] h-[28rem] rounded-full border border-purple-100/70" />
              </div>
              {/* Pulse */}
              <div className="absolute inset-0 grid place-items-center pointer-events-none">
                <span className="absolute w-56 h-56 rounded-full bg-purple-400/20" />
                <span className="absolute w-56 h-56 rounded-full bg-purple-400/10" />
              </div>
              {/* Hobson */}
              <div className="absolute inset-0 grid place-items-center">
                <img src={hobsonOwl} alt="Hobson" className="w-80 lg:w-[26rem] drop-shadow-[0_30px_40px_rgba(124,58,237,0.35)]" />
              </div>
              {/* Mini specialist orbs */}
              {[professorImg, researcherImg, bookkeeperImg, brokerImg, inspectorImg, keeperImg].map((src, i, arr) => {
                const angle = (i / arr.length) * Math.PI * 2 - Math.PI / 2;
                const r = 220;
                const x = Math.cos(angle) * r;
                const y = Math.sin(angle) * r;
                return (
                  <div key={i}
                    className="absolute left-1/2 top-1/2 w-16 h-16 -ml-8 -mt-8 rounded-2xl bg-white border border-purple-100 grid place-items-center shadow-lg"
                    style={{ transform: `translate(${x}px, ${y}px)`, animation: `fade-up 0.6s ease ${300 + i * 100}ms both` }}>
                    <img src={src} alt="" className="w-12 h-12 object-contain" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* PRINCIPLE */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-purple-600 uppercase">The guiding principle</p>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
            Never another specialist for every new job.
          </h2>
          <p className="mt-6 text-lg text-slate-600 leading-relaxed">
            Most AI products grow by adding more bots. Hobson grows differently. New capabilities arrive by
            <span className="text-purple-700 font-semibold"> orchestrating the same eight specialists in new ways</span> —
            so the product stays calm, understandable and trustworthy as it expands.
          </p>
          <div className="mt-10 grid sm:grid-cols-3 gap-4 text-left">
            {[
              { k: "One conversation", v: "Always with Hobson. You never choose which AI to ask." },
              { k: "One orchestrator", v: "Hobson decides who is needed and in what order." },
              { k: "Eight specialists", v: "Four maintain his memory. Four bring expertise on demand." },
            ].map((c, i) => (
              <div key={i} className="rounded-2xl border border-purple-100 bg-purple-50/40 p-5">
                <p className="text-xs uppercase tracking-wider text-purple-700 font-semibold">{c.k}</p>
                <p className="mt-2 text-slate-700 text-sm leading-relaxed">{c.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM — Hobson introduces his specialists in chat */}
      <section id="team" className="py-20 bg-gradient-to-b from-white to-purple-50/40">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.2em] text-purple-600 uppercase">The team</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900">Meet the specialists.</h2>
          </div>

          <div className="space-y-4">
            {/* User asks */}
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-purple-700 text-white px-4 py-3 text-sm shadow">
                Hobson — tell me about the team behind you.
              </div>
            </div>

            {/* Hobson opens */}
            <div className="flex items-start gap-3">
              <img src={hobsonOwl} alt="Hobson" className="w-10 h-10 rounded-full bg-purple-100 p-1 border border-purple-200 shrink-0" />
              <div className="rounded-2xl rounded-tl-sm bg-white border border-purple-100 px-4 py-3 text-sm text-slate-700 shadow-sm max-w-[85%]">
                I work with eight specialists. Four maintain what I know about your estate — always working in the background. Four more I call on whenever a particular expertise is needed.
              </div>
            </div>

            {/* Persistent specialists */}
            <div className="pl-14 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-purple-600 mb-1">Persistent portfolio domains — always on</p>
              <div className="grid sm:grid-cols-2 gap-2">
                {PERSISTENT.map((s, i) => (
                  <div key={s.name} className="flex items-start gap-2.5 rounded-xl border border-purple-100 bg-white px-3 py-2.5 shadow-sm" style={{ animation: `fade-up 0.4s ease ${0.35 + i * 0.08}s both` }}>
                    <div className="w-10 h-10 shrink-0 rounded-lg bg-purple-50 border border-purple-100 grid place-items-center">
                      <img src={s.img} alt={s.name} className="w-8 h-8 object-contain" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs font-bold text-slate-900">{s.name}</h4>
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-white" style={{ background: "linear-gradient(135deg,#7c3aed,#a78bfa)" }}>Maintains</span>
                      </div>
                      <p className="text-[11px] font-medium text-purple-700">{s.owns}</p>
                      <p className="text-[11px] text-slate-600 leading-snug">{s.blurb}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hobson transitions */}
            <div className="flex items-start gap-3">
              <img src={hobsonOwl} alt="Hobson" className="w-10 h-10 rounded-full bg-purple-100 p-1 border border-purple-200 shrink-0" />
              <div className="rounded-2xl rounded-tl-sm bg-white border border-purple-100 px-4 py-3 text-sm text-slate-700 shadow-sm max-w-[85%]">
                And these four I call upon when their particular skill is required.
              </div>
            </div>

            {/* Service specialists */}
            <div className="pl-14 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-purple-600 mb-1">Specialist services — on demand</p>
              <div className="grid sm:grid-cols-2 gap-2">
                {SERVICES.map((s, i) => (
                  <div key={s.name} className="flex items-start gap-2.5 rounded-xl border border-purple-100 bg-white px-3 py-2.5 shadow-sm" style={{ animation: `fade-up 0.4s ease ${0.9 + i * 0.08}s both` }}>
                    <div className="w-10 h-10 shrink-0 rounded-lg bg-purple-50 border border-purple-100 grid place-items-center">
                      <img src={s.img} alt={s.name} className="w-8 h-8 object-contain" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs font-bold text-slate-900">{s.name}</h4>
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-200">Provides</span>
                      </div>
                      <p className="text-[11px] font-medium text-purple-700">{s.owns}</p>
                      <p className="text-[11px] text-slate-600 leading-snug">{s.blurb}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hobson closes */}
            <div className="flex items-start gap-3">
              <img src={hobsonOwl} alt="Hobson" className="w-10 h-10 rounded-full bg-purple-100 p-1 border border-purple-200 shrink-0" />
              <div className="rounded-2xl rounded-tl-sm bg-white border border-purple-100 px-4 py-3 text-sm text-slate-700 shadow-sm max-w-[85%]">
                Together they let me answer almost anything you put to me — while you only ever speak to one person.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ORCHESTRATION DEMO */}
      <section id="orchestration" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-semibold tracking-[0.2em] text-purple-600 uppercase">Hobson at work</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900">A single request. Six specialists. One answer.</h2>
            <p className="mt-4 text-lg text-slate-600">
              You ask Hobson to prepare a rent review. Watch how the work unfolds behind the scenes —
              without ever leaving your conversation with him.
            </p>
          </div>

          <div className="mt-12 max-w-3xl mx-auto rounded-3xl border border-purple-100 bg-gradient-to-b from-purple-50/40 to-white p-6 sm:p-8 shadow-[0_20px_60px_-30px_rgba(124,58,237,0.4)]">
            {/* User bubble */}
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-purple-700 text-white px-4 py-3 text-sm shadow">
                Hobson, please prepare my rent review.
              </div>
            </div>

            {/* Hobson opening */}
            <div className="mt-4 flex items-start gap-3">
              <img src={hobsonOwl} alt="Hobson" className="w-10 h-10 rounded-full bg-purple-100 p-1 border border-purple-200" />
              <div className="rounded-2xl rounded-tl-sm bg-white border border-purple-100 px-4 py-3 text-sm text-slate-700 shadow-sm">
                Of course. Allow me a moment to gather what's needed.
              </div>
            </div>

            {/* Specialist sequence */}
            <ol className="mt-6 space-y-3">
              {RENT_REVIEW.map((b, i) => {
                const active = step === i;
                const done = step > i;
                const visible = step >= i;
                return (
                  <li key={i}
                    className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-500 ${
                      visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                    } ${active ? "bg-purple-50 border-purple-300 shadow-sm" : done ? "bg-white border-purple-100" : "bg-white border-purple-100"}`}>
                    <div className="relative w-10 h-10 shrink-0 rounded-xl bg-white border border-purple-100 grid place-items-center overflow-hidden">
                      <img src={b.img} alt="" className="w-9 h-9 object-contain" />
                      {active && (
                        <span className="absolute inset-0 rounded-xl ring-2 ring-purple-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-purple-700">{b.who}</p>
                      <p className="text-sm text-slate-700 truncate">{b.line}</p>
                    </div>
                    {done ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                        <Check className="w-4 h-4" /> Complete
                      </span>
                    ) : active ? (
                      <span className="text-xs font-semibold text-purple-700 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
                        Working
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">Waiting</span>
                    )}
                  </li>
                );
              })}
            </ol>

            {/* Hobson final */}
            <div className={`mt-6 flex items-start gap-3 transition-all duration-500 ${finalShown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
              <img src={hobsonOwl} alt="Hobson" className="w-10 h-10 rounded-full bg-purple-100 p-1 border border-purple-200" />
              <div className="rounded-2xl rounded-tl-sm bg-white border border-purple-100 px-4 py-3 text-sm text-slate-700 shadow-sm max-w-[85%]">
                I've prepared your rent review. A recommendation, the covering email, the notice and the reminder schedule
                are ready for your approval whenever you wish.
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between text-xs text-slate-500">
              <span>Six specialists, one calm answer.</span>
              <button
                onClick={() => { setPlaying((p) => !p); setStep(0); }}
                className="px-3 py-1.5 rounded-full bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 font-semibold">
                {playing ? "Pause" : "Replay"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* OUTPUTS BELONG TO HOBSON */}
      <section className="py-20 bg-gradient-to-b from-purple-50/40 to-white">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-purple-600 uppercase">Who owns the answer</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900">Every output belongs to Hobson.</h2>
            <p className="mt-4 text-lg text-slate-600 leading-relaxed">
              Specialists contribute expertise. They never speak to you, and they never sign their work.
              The answer, the workflow, the report, the email, the notice — all of it comes from Hobson, with his name on it.
            </p>
            <p className="mt-4 text-slate-600 leading-relaxed">
              That's the part property professionals tell us feels different.
              One trusted face. One accountable colleague. No tab-switching, no choosing which assistant to ask.
            </p>
          </div>
          <div className="relative rounded-3xl bg-white border border-purple-100 p-6 shadow-[0_20px_60px_-30px_rgba(124,58,237,0.4)]">
            <div className="grid grid-cols-2 gap-3">
              {["Answers","Recommendations","Reports","Emails","Notices","Statements","Workflows","Assessments"].map((o, i) => (
                <div key={o} className="rounded-xl border border-purple-100 bg-purple-50/40 px-4 py-3 text-sm text-slate-700 font-medium flex items-center gap-2"
                  style={{ animation: `fade-up 0.6s ease ${i * 60}ms both` }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" /> {o}
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-purple-700 to-violet-600 text-white px-4 py-3">
              <img src={hobsonOwl} alt="" className="w-10 h-10 rounded-full bg-white/20 p-1" />
              <p className="text-sm font-semibold">All produced by Hobson — once the specialists have done their part.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CLOSING */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
            One conversation. One orchestrator.<br/>
            <span className="bg-gradient-to-r from-purple-700 to-fuchsia-600 bg-clip-text text-transparent">Unlimited capabilities.</span>
          </h2>
          <p className="mt-6 text-lg text-slate-600">
            That's how Hobson thinks. Quietly, methodically, and always on your behalf.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/features" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold transition">
              See what Hobson can do <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-purple-200 text-purple-800 hover:bg-purple-50 font-semibold transition">
              Talk to us
            </Link>
          </div>
        </div>
      </section>

      <HomepageFooter />
    </div>
  );
};

export default HowHobsonThinks;
