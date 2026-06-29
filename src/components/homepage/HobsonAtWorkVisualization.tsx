import React, { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import owlMascot from "@/assets/owl-mascot.png";
import {
  professorImg,
  researcherImg,
  bookkeeperImg,
  inspectorImg,
} from "./specialists";

type Beat = { who: string; img: string; headline: string };

const BEATS: Beat[] = [
  { who: "The Professor", img: professorImg, headline: "Reviewing lease…" },
  { who: "The Researcher", img: researcherImg, headline: "Finding comparable evidence…" },
  { who: "The Bookkeeper", img: bookkeeperImg, headline: "Preparing rental analysis…" },
  { who: "The Inspector", img: inspectorImg, headline: "Checking statutory requirements…" },
];

const USER_PROMPT = "Prepare my rent review.";

export const HobsonAtWorkVisualization: React.FC = () => {
  const [cursor, setCursor] = useState(0); // 0..BEATS.length+1 (last = final)
  const [typed, setTyped] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  // Start when in view
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) setStarted(true);
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [started]);

  // Type user prompt
  useEffect(() => {
    if (!started) return;
    if (typed >= USER_PROMPT.length) return;
    const t = setTimeout(() => setTyped((n) => n + 1), 45);
    return () => clearTimeout(t);
  }, [started, typed]);

  // Progress specialists then final
  useEffect(() => {
    if (!started || typed < USER_PROMPT.length) return;
    if (cursor >= BEATS.length + 1) {
      // restart after pause
      const t = setTimeout(() => {
        setCursor(0);
        setTyped(0);
      }, 4500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCursor((c) => c + 1), 1100);
    return () => clearTimeout(t);
  }, [started, typed, cursor]);

  const finalShown = cursor > BEATS.length;

  return (
    <div ref={rootRef} className="relative bg-white rounded-2xl p-5 sm:p-6 border border-purple-100 shadow-[0_20px_60px_-30px_rgba(124,58,237,0.4)] overflow-hidden">
      <style>{`
        @keyframes haw-fade-up { from { opacity: 0; transform: translateY(8px);} to { opacity: 1; transform: none;} }
        @keyframes haw-pulse { 0%,100% { opacity: 1;} 50% { opacity: 0.4;} }
      `}</style>

      {/* Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <img src={owlMascot} alt="" className="w-7 h-7" />
        <div className="flex-1">
          <p className="text-[11px] font-semibold tracking-wider text-purple-700 uppercase">Hobson</p>
          <p className="text-[11px] text-slate-500">Working on your behalf</p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Live
        </span>
      </div>

      {/* User prompt bubble */}
      <div className="mt-4 flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-purple-700 text-white px-3.5 py-2 text-sm shadow-sm">
          {USER_PROMPT.slice(0, typed)}
          {started && typed < USER_PROMPT.length && <span className="animate-pulse">|</span>}
        </div>
      </div>

      {/* Specialist progress */}
      <div className="mt-4 space-y-2">
        {BEATS.map((b, i) => {
          const visible = cursor > i || (cursor === i && typed >= USER_PROMPT.length);
          const active = cursor === i && typed >= USER_PROMPT.length;
          const done = cursor > i;
          if (!visible) return null;
          return (
            <div
              key={i}
              className={`flex items-center gap-3 rounded-xl border px-3 py-2 transition-colors ${
                active ? "border-purple-300 bg-purple-50/50" : "border-slate-100 bg-white"
              }`}
              style={{ animation: "haw-fade-up 0.35s ease both" }}
            >
              <div className="w-9 h-9 shrink-0 rounded-lg bg-gradient-to-br from-purple-50 to-white border border-purple-100 grid place-items-center overflow-hidden">
                <img src={b.img} alt="" className="w-7 h-7 object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold tracking-wider text-purple-700 uppercase truncate">{b.who}</p>
                <p className="text-xs sm:text-sm text-slate-700 truncate">{b.headline}</p>
              </div>
              {done ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                  <Check className="w-3.5 h-3.5" /> Complete
                </span>
              ) : (
                <span className="w-3.5 h-3.5 rounded-full border-2 border-purple-400 border-t-transparent animate-spin" />
              )}
            </div>
          );
        })}
      </div>

      {/* Final answer */}
      {finalShown && (
        <div
          className="mt-4 rounded-xl border border-purple-100 bg-gradient-to-b from-purple-50/40 to-white p-3.5"
          style={{ animation: "haw-fade-up 0.4s ease both" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <img src={owlMascot} alt="" className="w-6 h-6" />
            <p className="text-[11px] font-semibold tracking-wider text-purple-700 uppercase">Hobson</p>
          </div>
          <ul className="space-y-1.5">
            {[
              "Recommendation prepared",
              "Draft notice ready",
              "Covering email prepared",
              "Reminder scheduled",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2 text-xs sm:text-sm text-slate-700">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2.5 text-[11px] text-slate-500 italic">Ready for your approval.</p>
        </div>
      )}
    </div>
  );
};

export default HobsonAtWorkVisualization;
