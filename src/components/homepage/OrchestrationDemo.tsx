import React, { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";

import hobsonOwl from "@/assets/hobson-owl-hero.png";
import professorImg from "@/assets/prototype/character-professor.png";
import inspectorImg from "@/assets/prototype/character-inspector.png";
import brokerImg from "@/assets/prototype/character-broker.png";
import keeperImg from "@/assets/prototype/character-keeper.png";

import researcherAsset from "@/assets/prototype/character-researcher.png.asset.json";
import bookkeeperAsset from "@/assets/prototype/character-bookkeeper.png.asset.json";

const researcherImg = researcherAsset.url;
const bookkeeperImg = bookkeeperAsset.url;

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

export const OrchestrationDemo: React.FC = () => {
  const totalSteps = RENT_REVIEW.reduce((n, b) => n + b.steps.length, 0);
  const INTRO_BEATS = 2;
  const endCursor = totalSteps + INTRO_BEATS + 4;
  const [cursor, setCursor] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const orchestrationRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const stickToBottomRef = useRef(true);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    stickToBottomRef.current = distanceFromBottom < 48;
  };

  const [introPhase, setIntroPhase] = useState(0);
  const [introUserIdx, setIntroUserIdx] = useState(0);
  const [introHobsonIdx, setIntroHobsonIdx] = useState(0);

  useEffect(() => {
    if (!playing || introPhase !== 0) return;
    setIntroPhase(1);
  }, [playing, introPhase]);

  useEffect(() => {
    if (introPhase !== 1 || !playing) return;
    if (introUserIdx >= USER_INTRO.length) {
      const t = setTimeout(() => setIntroPhase(2), 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setIntroUserIdx((i) => i + 1), 30);
    return () => clearTimeout(t);
  }, [introPhase, introUserIdx, playing]);

  useEffect(() => {
    if (introPhase !== 2 || !playing) return;
    if (introHobsonIdx >= HOBSON_INTRO.length) {
      const t = setTimeout(() => setIntroPhase(3), 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setIntroHobsonIdx((i) => i + 1), 30);
    return () => clearTimeout(t);
  }, [introPhase, introHobsonIdx, playing]);

  useEffect(() => {
    if (introPhase === 3 && cursor < INTRO_BEATS) {
      setCursor(INTRO_BEATS);
    }
  }, [introPhase, cursor]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !stickToBottomRef.current) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [cursor, introUserIdx, introHobsonIdx, introPhase, finished]);

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
    <div ref={orchestrationRef}>
      <style>{`
        @keyframes fade-up { from { opacity: 0; transform: translateY(16px);} to { opacity: 1; transform: none;} }
        @keyframes pulse-ring { 0% { transform: scale(0.9); opacity:0.7;} 100% { transform: scale(1.6); opacity:0;} }
      `}</style>

      <div className="rounded-3xl border border-purple-100 bg-gradient-to-b from-purple-50/40 to-white p-4 sm:p-6 shadow-[0_20px_60px_-30px_rgba(124,58,237,0.4)]">
        {/* User bubble */}
        <div
          className={`flex justify-start transition-all duration-500 ${hasStarted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
          style={{ animation: hasStarted ? "fade-up 0.4s ease both" : undefined }}
        >
          <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-purple-700 text-white px-4 py-3 text-sm shadow">
            {USER_INTRO.slice(0, introUserIdx)}
            {introPhase === 1 && <span className="animate-pulse">|</span>}
          </div>
        </div>

        {/* Hobson opening */}
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

        {/* Specialist sequence */}
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
            className="px-3 py-1.5 rounded-full bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 font-semibold"
          >
            {finished ? "Replay" : playing ? "Pause" : "Resume"}
          </button>
        </div>
      </div>
    </div>
  );
};
