import React, { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";

import hobsonOwl from "@/assets/hobson-owl-hero.png";
import professorAsset from "@/assets/prototype/character-professor.png.asset.json";
const professorImg = professorAsset.url;
import inspectorAsset from "@/assets/prototype/character-inspector.png.asset.json";
const inspectorImg = inspectorAsset.url;
import brokerAsset from "@/assets/prototype/character-broker.png.asset.json";
const brokerImg = brokerAsset.url;
import keeperAsset from "@/assets/prototype/character-keeper.png.asset.json";
const keeperImg = keeperAsset.url;

import researcherAsset from "@/assets/prototype/character-researcher.png.asset.json";
import bookkeeperAsset from "@/assets/prototype/character-bookkeeper.png.asset.json";

const researcherImg = researcherAsset.url;
const bookkeeperImg = bookkeeperAsset.url;

type Beat = { who: string; img: string; headline: string; steps: string[] };

const HOBSON_PROACTIVE = "You have a rent review in 60 days at 32 Hamilton Gardens, NW8. Would you like me to prepare this for you?";
const USER_YES = "Yes";
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
  const [introProactiveIdx, setIntroProactiveIdx] = useState(0);
  const [introUserIdx, setIntroUserIdx] = useState(0);
  const [introHobsonIdx, setIntroHobsonIdx] = useState(0);

  // Phase 0 -> 1: start Hobson proactive
  useEffect(() => {
    if (!playing || introPhase !== 0) return;
    setIntroPhase(1);
  }, [playing, introPhase]);

  // Phase 1: type Hobson proactive message
  useEffect(() => {
    if (introPhase !== 1 || !playing) return;
    if (introProactiveIdx >= HOBSON_PROACTIVE.length) {
      const t = setTimeout(() => setIntroPhase(2), 700);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setIntroProactiveIdx((i) => i + 1), 30);
    return () => clearTimeout(t);
  }, [introPhase, introProactiveIdx, playing]);

  // Phase 2: show Yes button, auto-confirm after brief pause (skips straight to Hobson intro)
  useEffect(() => {
    if (introPhase !== 2 || !playing) return;
    const t = setTimeout(() => setIntroPhase(4), 1400);
    return () => clearTimeout(t);
  }, [introPhase, playing]);


  // Phase 4: type Hobson intro
  useEffect(() => {
    if (introPhase !== 4 || !playing) return;
    if (introHobsonIdx >= HOBSON_INTRO.length) {
      const t = setTimeout(() => setIntroPhase(5), 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setIntroHobsonIdx((i) => i + 1), 30);
    return () => clearTimeout(t);
  }, [introPhase, introHobsonIdx, playing]);

  useEffect(() => {
    if (introPhase === 5 && cursor < INTRO_BEATS) {
      setCursor(INTRO_BEATS);
    }
  }, [introPhase, cursor]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !stickToBottomRef.current) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [cursor, introUserIdx, introHobsonIdx, introProactiveIdx, introPhase, finished]);

  useEffect(() => {
    if (!playing || finished || introPhase < 5) return;
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

      <div className="rounded-3xl flex flex-col h-[600px] max-h-[80vh] overflow-hidden" style={{ border: '1px solid var(--bone)', background: 'var(--paper)', boxShadow: '0 24px 60px -24px rgba(45,45,45,0.18)' }}>
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="hobson-scroll flex-1 overflow-y-auto p-4 sm:p-6"
        >
        {/* Hobson proactive opener */}
        <div
          className={`flex items-start gap-3 transition-all duration-500 ${hasStarted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
          style={{ animation: hasStarted ? "fade-up 0.4s ease both" : undefined }}
        >
          <img src={hobsonOwl} alt="Hobson" className="w-10 h-10 rounded-full p-1" style={{ background: 'var(--bone-wash)' }} />
          <div className="rounded-2xl rounded-tl-sm px-4 py-3 text-sm max-w-[85%]" style={{ background: 'var(--bone-wash)', color: 'var(--ink)', border: '1px solid #E4DAC6' }}>
            {HOBSON_PROACTIVE.slice(0, introProactiveIdx)}
            {introPhase === 1 && <span className="animate-pulse">|</span>}
          </div>
        </div>


        {/* User "Yes" confirmation */}
        <div
          className={`mt-4 flex justify-end transition-all duration-500 ${introPhase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none h-0 overflow-hidden mt-0"}`}
          style={{ animation: introPhase >= 2 ? "fade-up 0.4s ease both" : undefined }}
        >
          {introPhase === 2 ? (
            <button
              type="button"
              onClick={() => setIntroPhase(4)}
              className="rounded-full px-5 py-2 text-sm font-semibold transition-colors"
              style={{ background: 'var(--charcoal)', color: 'var(--paper)' }}
            >
              Yes
            </button>
          ) : (
            <div className="max-w-[85%] rounded-2xl rounded-tr-sm px-4 py-2 text-sm" style={{ background: 'var(--charcoal)', color: 'var(--paper)' }}>
              {USER_YES}
            </div>
          )}
        </div>


        {/* Hobson opening */}
        <div
          className={`mt-4 flex items-start gap-3 transition-all duration-500 ${introPhase >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none h-0 overflow-hidden mt-0"}`}
          style={{ animation: introPhase >= 4 ? "fade-up 0.4s ease both" : undefined }}
        >
          <img src={hobsonOwl} alt="Hobson" className="w-10 h-10 rounded-full p-1" style={{ background: 'var(--bone-wash)' }} />
          <div className="rounded-2xl rounded-tl-sm px-4 py-3 text-sm" style={{ background: 'var(--bone-wash)', color: 'var(--ink)', border: '1px solid #E4DAC6' }}>

            {HOBSON_INTRO.slice(0, introHobsonIdx)}
            {introPhase === 4 && <span className="animate-pulse">|</span>}
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
                className="rounded-2xl overflow-hidden transition-all duration-500"
                style={{ animation: "fade-up 0.35s ease both", background: 'var(--paper)', border: `1px solid ${p.isActive ? 'var(--brass)' : 'var(--bone)'}` }}
              >
                <div className="flex items-center gap-3 px-4 py-3" style={{ background: 'var(--bone-wash)', borderBottom: '1px solid var(--bone)' }}>
                  <div className="relative w-9 h-9 shrink-0 rounded-xl grid place-items-center overflow-hidden" style={{ background: 'var(--paper)', border: '1px solid var(--bone)' }}>
                    <img src={b.img} alt="" className="w-8 h-8 object-contain" />
                    {p.isActive && (
                      <span className="absolute inset-0 rounded-xl ring-2 ring-[#B4914F]" style={{ animation: "pulse-ring 1.6s ease-out infinite" }} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold tracking-wide uppercase" style={{ color: 'var(--brass)' }}>{b.who}</p>
                    <p className="text-sm truncate" style={{ color: 'var(--ink)' }}>{b.headline}</p>
                  </div>
                  {p.isDone ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: 'var(--ink-muted)' }}>
                      <Check className="w-4 h-4" style={{ color: 'var(--brass)' }} /> Complete
                    </span>
                  ) : (
                    <span className="text-xs font-semibold flex items-center gap-1" style={{ color: 'var(--ink-muted)' }}>
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--brass)' }} />
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
                          <Check className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--brass)' }} />
                        ) : stepActive ? (
                          <span className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent animate-spin shrink-0" style={{ borderColor: 'var(--brass)', borderTopColor: 'transparent' }} />
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ border: '1px solid var(--bone)' }} />
                        )}
                        <span style={{ color: 'var(--ink-muted)', textDecoration: stepDone ? 'line-through' : undefined, textDecorationColor: stepDone ? 'var(--bone-strong)' : undefined }}>{s}</span>
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
            <img src={hobsonOwl} alt="Hobson" className="w-10 h-10 rounded-full p-1" style={{ background: 'var(--bone-wash)' }} />
            <div className="rounded-2xl rounded-tl-sm px-4 py-3 text-sm max-w-[90%]" style={{ background: 'var(--bone-wash)', color: 'var(--ink)', border: '1px solid #E4DAC6' }}>
              <p>
                I've finished preparing your rent review for <span className="font-semibold" style={{ color: 'var(--ink)' }}>32 Hamilton Gardens</span>.
                Here is what I have for your approval:
              </p>

              <div className="mt-3 rounded-xl overflow-hidden" style={{ background: 'var(--paper)', border: '1px solid var(--bone)' }}>
                <div className="px-3 py-2 text-[11px] font-semibold tracking-wide uppercase" style={{ color: 'var(--brass)', borderBottom: '1px solid var(--bone)' }}>Recommendation</div>
                <div className="px-3 py-3 grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <div className="text-[11px]" style={{ color: 'var(--ink-muted)' }}>Passing rent</div>
                    <div className="font-semibold" style={{ color: 'var(--ink)' }}>£28,500 pa</div>
                  </div>
                  <div>
                    <div className="text-[11px]" style={{ color: 'var(--ink-muted)' }}>Proposed rent</div>
                    <div className="font-semibold" style={{ color: 'var(--ink)' }}>£33,750 pa</div>
                  </div>
                  <div>
                    <div className="text-[11px]" style={{ color: 'var(--ink-muted)' }}>Uplift</div>
                    <div className="font-semibold" style={{ color: 'var(--ink)' }}>+18.4%</div>
                  </div>
                </div>
                <div className="px-3 pb-3 text-xs" style={{ color: 'var(--ink-muted)' }}>
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
                  <div key={x.t} className="flex items-start gap-2 rounded-lg px-3 py-2" style={{ background: 'var(--paper)', border: '1px solid var(--bone)' }}>
                    <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--brass)' }} />
                    <div>
                      <div className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>{x.t}</div>
                      <div className="text-xs" style={{ color: 'var(--ink-muted)' }}>{x.s}</div>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-3 text-xs" style={{ color: 'var(--ink-muted)' }}>Nothing has been sent. Approve any item when you're ready.</p>

            </div>
          </div>
        </div>
        </div>

        <div className="px-4 sm:px-6 py-3 flex items-center justify-between text-xs" style={{ borderTop: '1px solid var(--bone)', background: 'var(--paper)', color: 'var(--ink-muted)' }}>
          <span>The user only ever speaks to Hobson.</span>
          <button
            onClick={() => {
              if (finished) {
                setCursor(0);
                setFinished(false);
                setPlaying(true);
                setIntroPhase(0);
                setIntroProactiveIdx(0);
                setIntroUserIdx(0);
                setIntroHobsonIdx(0);
                orchestrationRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              } else {
                setPlaying((p) => !p);
              }
            }}
            className="px-3 py-1.5 rounded-full font-semibold transition-colors"
            style={{ background: 'var(--paper)', border: '1px solid var(--bone)', color: 'var(--brass-text)' }}

          >
            {finished ? "Replay" : playing ? "Pause" : "Resume"}
          </button>
        </div>
      </div>
    </div>
  );
};
