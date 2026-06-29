import React, { useEffect, useRef, useState } from "react";
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

// Rent review orchestration beats — each specialist has progressive sub-steps
type Beat = { who: string; img: string; headline: string; steps: string[] };
const USER_INTRO = "Hobson, please prepare my rent review for 32 Hamilton Gardens.";
const HOBSON_INTRO = "Of course. I'll prepare the rent review for 32 Hamilton Gardens now — one moment while my team gathers what's needed.";

const RENT_REVIEW: Beat[] = [
  { who: "The Professor", img: professorImg, headline: "Reviewing your lease…",
    steps: ["Locating the lease for 32 Hamilton Gardens", "Identifying the rent review clause", "Extracting review date & mechanism", "Noting assumptions and disregards"] },
  { who: "The Researcher", img: researcherImg, headline: "Finding comparable evidence…",
    steps: ["Searching nearby lettings within 0.5 mi", "Filtering for similar size & use", "Capturing three strong comparables", "Saving sources for the audit trail"] },
  { who: "The Bookkeeper", img: bookkeeperImg, headline: "Preparing the rental analysis…",
    steps: ["Calculating £/sq ft from comparables", "Applying review assumptions", "Producing the proposed new rent", "Drafting the figures table"] },
  { who: "The Broker", img: brokerImg, headline: "Identifying the parties…",
    steps: ["Locating the current tenant on file", "Confirming the service address", "Checking last contact and channel"] },
  { who: "The Inspector", img: inspectorImg, headline: "Confirming statutory requirements…",
    steps: ["Checking the correct notice form", "Verifying minimum notice period", "Validating service method"] },
  { who: "The Keeper", img: keeperImg, headline: "Verifying permissions…",
    steps: ["Confirming you may issue this notice", "Logging the action to the audit trail"] },
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

const HowHobsonThinks: React.FC = () => {
  // Orchestration demo: a single ticking cursor that walks through every sub-step of every specialist,
  // then reveals Hobson's final answer. Each beat = a specialist; cursor = which sub-step is active.
  const totalSteps = RENT_REVIEW.reduce((n, b) => n + b.steps.length, 0);
  const INTRO_BEATS = 2; // user message, then Hobson reply
  const endCursor = totalSteps + INTRO_BEATS + 4;
  const [cursor, setCursor] = useState(0); // 0..endCursor (endCursor = final answer fully shown)
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const orchestrationRef = useRef<HTMLElement>(null);

  const [introPhase, setIntroPhase] = useState(0); // 0=idle,1=typing-user,2=typing-hobson,3=done
  const [introUserIdx, setIntroUserIdx] = useState(0);
  const [introHobsonIdx, setIntroHobsonIdx] = useState(0);

  // Kick off intro typing when play begins
  useEffect(() => {
    if (!playing || introPhase !== 0) return;
    setIntroPhase(1);
  }, [playing, introPhase]);

  // Type user message
  useEffect(() => {
    if (introPhase !== 1 || !playing) return;
    if (introUserIdx >= USER_INTRO.length) {
      const t = setTimeout(() => setIntroPhase(2), 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setIntroUserIdx((i) => i + 1), 30);
    return () => clearTimeout(t);
  }, [introPhase, introUserIdx, playing]);

  // Type Hobson reply
  useEffect(() => {
    if (introPhase !== 2 || !playing) return;
    if (introHobsonIdx >= HOBSON_INTRO.length) {
      const t = setTimeout(() => setIntroPhase(3), 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setIntroHobsonIdx((i) => i + 1), 30);
    return () => clearTimeout(t);
  }, [introPhase, introHobsonIdx, playing]);

  // Jump cursor to INTRO_BEATS once typing is finished so specialists begin
  useEffect(() => {
    if (introPhase === 3 && cursor < INTRO_BEATS) {
      setCursor(INTRO_BEATS);
    }
  }, [introPhase, cursor]);

  // Specialist + final progression
  useEffect(() => {
    if (!playing || finished || introPhase < 3) return;
    const id = setInterval(() => {
      setCursor((c) => {
        if (c >= endCursor) {
          setFinished(true);
          setPlaying(false);
          return endCursor;
        }
        return c + 1;
      });
    }, 700);
    return () => clearInterval(id);
  }, [playing, finished, endCursor, introPhase]);

  // Start animation when "See him at work" scrolls into view
  useEffect(() => {
    const el = orchestrationRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          setPlaying(true);
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasStarted]);

  // Map cursor to (beatIndex, stepIndex) — offset by INTRO_BEATS so specialists start after the chat intro
  let runningTotal = 0;
  const beatProgress = RENT_REVIEW.map((b) => {
    const start = runningTotal;
    runningTotal += b.steps.length;
    const end = runningTotal;
    const stepsDone = Math.max(0, Math.min(b.steps.length, cursor - INTRO_BEATS - start));
    const isActive = cursor >= INTRO_BEATS + start && cursor < INTRO_BEATS + end;
    const isDone = cursor >= INTRO_BEATS + end;
    const visible = cursor >= INTRO_BEATS + start;
    return { start, end, stepsDone, isActive, isDone, visible };
  });
  const finalShown = cursor >= totalSteps + INTRO_BEATS;


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
        <div className="container mx-auto px-6 pt-16 pb-12 lg:pt-24 lg:pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div style={{ animation: "fade-up 0.7s ease both" }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold tracking-wide uppercase">
                How Hobson thinks
              </div>
              <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
                <span className="bg-gradient-to-r from-purple-700 via-purple-600 to-teal-500 bg-clip-text text-transparent">
                  One Trusted Conversation
                </span>
              </h1>
              <p className="mt-3 text-lg text-slate-600 max-w-xl leading-relaxed">
                <span className="text-purple-700 font-medium">A quiet team behind it.</span>
              </p>
              <p className="mt-4 text-lg text-slate-600 max-w-xl leading-relaxed">
                You only ever speak to Hobson. Behind him stands a small, carefully chosen team of specialists —
                each with one job. Hobson decides who is needed, in what order, and brings their work together as a single answer.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#orchestration" onClick={() => { setHasStarted(true); setPlaying(true); }} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold transition">
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
                <span className="absolute w-56 h-56 rounded-full bg-purple-400/20" style={{ animation: "pulse-ring 2.6s ease-out infinite" }} />
                <span className="absolute w-56 h-56 rounded-full bg-purple-400/10" style={{ animation: "pulse-ring 2.6s ease-out 1.3s infinite" }} />
              </div>
              {/* Hobson */}
              <div className="absolute inset-0 grid place-items-center" style={{ animation: "float-slow 6s ease-in-out infinite" }}>
                <img src={hobsonOwl} alt="Hobson" className="w-80 lg:w-[26rem] drop-shadow-[0_30px_40px_rgba(124,58,237,0.35)]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRINCIPLE */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-purple-600 uppercase">The guiding principle</p>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
            Hobson's team grows with purpose
          </h2>
          <p className="mt-6 text-lg text-slate-600 leading-relaxed">
            New specialists are introduced only when a genuinely new area of expertise is needed. Most new capabilities come from Hobson bringing together the expertise of the specialists he already has.
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

      {/* TWO TYPES */}
      <section id="team" className="pt-20 pb-12 bg-gradient-to-b from-white to-purple-50/40">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-semibold tracking-[0.2em] text-purple-600 uppercase">The team</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900">Two kinds of specialist.</h2>
            <p className="mt-4 text-lg text-slate-600">
              Some look after what Hobson knows about your portfolio over time. Others provide an expert service
              the moment Hobson needs it. Together, they let him answer almost anything you put to him.
            </p>
          </div>

          {/* Persistent */}
          <div className="mt-14">
            <div className="flex items-end justify-between gap-4 mb-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Hobson's permanent memory</h3>
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
          <div className="mt-20">
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

      {/* ORCHESTRATION DEMO */}
      <section id="orchestration" ref={orchestrationRef} className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-semibold tracking-[0.2em] text-purple-600 uppercase">See him at work</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900">One Trusted Conversation</h2>
            <p className="mt-4 text-lg text-slate-600">
              You always speak to Hobson. When real work is needed, he quietly delegates — and shows you who is helping.
              The specialists never reply, never ask questions, never become another chat.
            </p>
          </div>

          {/* Chat surface */}
          <div className="mt-12 max-w-3xl mx-auto rounded-3xl border border-purple-100 bg-gradient-to-b from-purple-50/40 to-white p-4 sm:p-6 shadow-[0_20px_60px_-30px_rgba(124,58,237,0.4)]">

            {/* User bubble — types out character by character */}
            <div
              className={`flex justify-end transition-all duration-500 ${hasStarted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
              style={{ animation: hasStarted ? "fade-up 0.4s ease both" : undefined }}
            >
              <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-purple-700 text-white px-4 py-3 text-sm shadow">
                {USER_INTRO.slice(0, introUserIdx)}
                {introPhase === 1 && <span className="animate-pulse">|</span>}
              </div>
            </div>

            {/* Hobson opening — types out character by character after user message */}
            <div
              className={`mt-4 flex items-start gap-3 transition-all duration-500 ${introPhase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none h-0 overflow-hidden mt-0"}`}
              style={{ animation: introPhase >= 2 ? "fade-up 0.4s ease both" : undefined }}
            >
              <img src={hobsonOwl} alt="Hobson" className="w-10 h-10 rounded-full bg-purple-100 p-1 border border-purple-200" />
              <div className="rounded-2xl rounded-tl-sm bg-white border border-purple-100 px-4 py-3 text-sm text-slate-700 shadow-sm">
                {HOBSON_INTRO.slice(0, introHobsonIdx)}
                {introPhase === 2 && <span className="animate-pulse">|</span>}
              </div>
            </div>

            {/* Specialist sequence (one card per active/done beat) */}
            <div className="mt-5 space-y-3">
              {RENT_REVIEW.map((b, i) => {
                const p = beatProgress[i];
                if (!p.visible) return null;
                return (
                  <div
                    key={i}
                    className={`rounded-2xl border bg-white shadow-sm overflow-hidden transition-all duration-500 ${
                      p.isActive ? "border-purple-300 ring-1 ring-purple-200" : "border-purple-100"
                    }`}
                    style={{ animation: "fade-up 0.35s ease both" }}
                  >
                    <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-50/70 to-transparent border-b border-purple-100">
                      <div className="relative w-9 h-9 shrink-0 rounded-xl bg-white border border-purple-100 grid place-items-center overflow-hidden">
                        <img src={b.img} alt="" className="w-8 h-8 object-contain" />
                        {p.isActive && (
                          <span className="absolute inset-0 rounded-xl ring-2 ring-purple-400" style={{ animation: "pulse-ring 1.6s ease-out infinite" }} />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-semibold tracking-wide text-purple-700 uppercase">{b.who}</p>
                        <p className="text-sm text-slate-800 truncate">{b.headline}</p>
                      </div>
                      {p.isDone ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                          <Check className="w-4 h-4" /> Complete
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-purple-700 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
                          Working
                        </span>
                      )}
                    </div>
                    <ul className="px-4 py-3 space-y-1.5">
                      {b.steps.map((s, j) => {
                        const stepDone = j < p.stepsDone;
                        const stepActive = p.isActive && j === p.stepsDone;
                        return (
                          <li key={j} className={`flex items-center gap-2 text-sm transition-opacity ${stepDone || stepActive ? "opacity-100" : "opacity-40"}`}>
                            {stepDone ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : stepActive ? (
                              <span className="w-3.5 h-3.5 rounded-full border-2 border-purple-400 border-t-transparent animate-spin shrink-0" />
                            ) : (
                              <span className="w-3.5 h-3.5 rounded-full border border-slate-200 shrink-0" />
                            )}
                            <span className={stepDone ? "text-slate-500 line-through decoration-slate-300" : stepActive ? "text-slate-800" : "text-slate-400"}>{s}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* Hobson final answer */}
            <div className={`mt-5 transition-all duration-500 ${finalShown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none h-0 overflow-hidden"}`}>
              <div className="flex items-start gap-3">
                <img src={hobsonOwl} alt="Hobson" className="w-10 h-10 rounded-full bg-purple-100 p-1 border border-purple-200" />
                <div className="rounded-2xl rounded-tl-sm bg-white border border-purple-100 px-4 py-3 text-sm text-slate-700 shadow-sm max-w-[90%]">
                  <p>
                    I've finished preparing your rent review for <span className="font-semibold text-slate-900">32 Hamilton Gardens</span>.
                    Here is what I have for your approval:
                  </p>

                  <div className="mt-3 rounded-xl border border-purple-100 overflow-hidden">
                    <div className="px-3 py-2 bg-purple-50/60 text-[11px] font-semibold tracking-wide text-purple-700 uppercase">Recommendation</div>
                    <div className="px-3 py-3 grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <div className="text-[11px] text-slate-500">Passing rent</div>
                        <div className="font-semibold text-slate-900">£28,500 pa</div>
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-500">Proposed rent</div>
                        <div className="font-semibold text-purple-700">£33,750 pa</div>
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-500">Uplift</div>
                        <div className="font-semibold text-emerald-600">+18.4%</div>
                      </div>
                    </div>
                    <div className="px-3 pb-3 text-xs text-slate-600">
                      Based on 3 comparable lettings within 0.5&nbsp;mi (£44–£47 per&nbsp;sq&nbsp;ft).
                    </div>
                  </div>

                  <div className="mt-3 grid sm:grid-cols-2 gap-2">
                    {[
                      { t: "Section 13 notice", s: "Drafted, ready to sign" },
                      { t: "Covering email", s: "Addressed to the tenant on file" },
                      { t: "Comparables pack", s: "3 sources, audit-trailed" },
                      { t: "Reminder schedule", s: "Service + response windows set" },
                    ].map((x) => (
                      <div key={x.t} className="flex items-start gap-2 rounded-lg border border-purple-100 bg-white px-3 py-2">
                        <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                        <div>
                          <div className="text-sm font-semibold text-slate-900">{x.t}</div>
                          <div className="text-xs text-slate-500">{x.s}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="mt-3 text-xs text-slate-500">Nothing has been sent. Approve any item when you're ready.</p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between text-xs text-slate-500">
              <span>The user only ever speaks to Hobson.</span>
              <button
                onClick={() => {
                  if (finished) {
                    setCursor(0);
                    setFinished(false);
                    setPlaying(true);
                    setIntroPhase(0);
                    setIntroUserIdx(0);
                    setIntroHobsonIdx(0);
                    orchestrationRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                  } else {
                    setPlaying((p) => !p);
                  }
                }}
                className="px-3 py-1.5 rounded-full bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 font-semibold">
                {finished ? "Replay" : playing ? "Pause" : "Resume"}
              </button>
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
            <Link to="/pricing" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold transition">
              See pricing <ArrowRight className="w-4 h-4" />
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
