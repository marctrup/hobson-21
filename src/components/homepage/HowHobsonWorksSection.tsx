import React, { useEffect, useRef, useState } from "react";
import { Check, ArrowDown } from "lucide-react";
import owlMascot from "@/assets/owl-mascot.png";
import {
  professorImg,
  researcherImg,
  bookkeeperImg,
  inspectorImg,
} from "./specialists";

const STEPS = [
  { who: "The Professor", img: professorImg, task: "Reviews your lease" },
  { who: "The Researcher", img: researcherImg, task: "Finds comparable evidence" },
  { who: "The Bookkeeper", img: bookkeeperImg, task: "Prepares the rental analysis" },
  { who: "The Inspector", img: inspectorImg, task: "Confirms statutory requirements" },
];

export const HowHobsonWorksSection: React.FC = () => {
  const [active, setActive] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let started = false;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) {
        started = true;
        setActive(0);
      }
    }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (active < 0) return;
    if (active >= STEPS.length + 1) {
      const t = setTimeout(() => setActive(0), 4000);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setActive((a) => a + 1), 900);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <section id="how-hobson-works" className="py-16 sm:py-20 bg-white">
      <style>{`@keyframes hhw-fade-up { from { opacity: 0; transform: translateY(10px);} to { opacity: 1; transform: none;} }`}</style>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-xs font-semibold tracking-[0.2em] text-purple-600 uppercase">How Hobson works</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900">
            How I Take Care of the Work
          </h2>
          <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed">
            Whenever you ask me to do something, I quietly bring together the right specialists for the task.
            Once their work is complete, I combine everything into one clear answer, recommendation or piece of completed work.
          </p>
        </div>

        <div ref={ref} className="max-w-md mx-auto">
          {/* User prompt */}
          <div
            className="rounded-2xl rounded-br-sm bg-purple-700 text-white px-4 py-3 text-sm shadow ml-auto max-w-[85%] text-right"
            style={{ animation: "hhw-fade-up 0.4s ease both" }}
          >
            Prepare my rent review.
          </div>

          <div className="flex justify-center my-3">
            <ArrowDown className="w-5 h-5 text-purple-300" />
          </div>

          {/* Specialists */}
          <div className="space-y-3">
            {STEPS.map((s, i) => {
              const isActive = active === i;
              const isDone = active > i;
              const visible = active >= i;
              return (
                <React.Fragment key={s.who}>
                  <div
                    className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-500 ${
                      visible ? "opacity-100" : "opacity-30"
                    } ${isActive ? "border-purple-300 bg-purple-50/60 shadow-sm" : "border-purple-100 bg-white"}`}
                  >
                    <div className="w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br from-purple-50 to-white border border-purple-100 grid place-items-center overflow-hidden">
                      <img src={s.img} alt="" className="w-9 h-9 object-contain" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold tracking-wider text-purple-700 uppercase">{s.who}</p>
                      <p className="text-sm text-slate-700">{s.task}</p>
                    </div>
                    {isDone ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : isActive ? (
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-purple-400 border-t-transparent animate-spin" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-200" />
                    )}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="flex justify-center">
                      <ArrowDown className={`w-4 h-4 transition-colors ${active > i ? "text-purple-500" : "text-slate-200"}`} />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <div className="flex justify-center my-3">
            <ArrowDown className={`w-5 h-5 transition-colors ${active >= STEPS.length ? "text-purple-500" : "text-slate-200"}`} />
          </div>

          {/* Hobson combines */}
          <div
            className={`rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-white px-4 py-3 flex items-center gap-3 transition-all duration-500 ${
              active >= STEPS.length ? "opacity-100" : "opacity-30"
            }`}
          >
            <img src={owlMascot} alt="Hobson" className="w-10 h-10" />
            <div>
              <p className="text-[11px] font-semibold tracking-wider text-purple-700 uppercase">Hobson</p>
              <p className="text-sm text-slate-700">Brings everything together</p>
            </div>
          </div>

          <div className="flex justify-center my-3">
            <ArrowDown className={`w-5 h-5 transition-colors ${active > STEPS.length ? "text-emerald-500" : "text-slate-200"}`} />
          </div>

          {/* Completed */}
          <div
            className={`rounded-2xl border border-emerald-200 bg-emerald-50/60 px-4 py-3 transition-all duration-500 ${
              active > STEPS.length ? "opacity-100" : "opacity-30"
            }`}
          >
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <p className="text-sm font-semibold text-slate-900">Completed work, ready for your approval</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowHobsonWorksSection;
