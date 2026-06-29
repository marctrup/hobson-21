import React from "react";
import { PERSISTENT_SPECIALISTS, SERVICE_SPECIALISTS, type Specialist } from "./specialists";

const Card: React.FC<{ s: Specialist; index: number }> = ({ s, index }) => (
  <article
    className="group relative rounded-3xl bg-white border border-purple-100 p-5 shadow-[0_8px_30px_-12px_rgba(124,58,237,0.18)] hover:shadow-[0_20px_50px_-15px_rgba(124,58,237,0.35)] hover:-translate-y-1 transition-all duration-500"
    style={{ animation: `mh-fade-up 0.6s ease ${index * 60}ms both` }}
  >
    <div
      className="absolute -top-3 left-5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider"
      style={
        s.tone === "persistent"
          ? { background: "linear-gradient(135deg,#7c3aed,#a78bfa)", color: "white" }
          : { background: "#f5f3ff", color: "#6d28d9", border: "1px solid #ddd6fe" }
      }
    >
      {s.tone === "persistent" ? "Maintains" : "Provides"}
    </div>
    <div className="flex items-start gap-4">
      <div className="w-20 h-20 shrink-0 rounded-2xl bg-gradient-to-br from-purple-50 to-white border border-purple-100 grid place-items-center overflow-hidden">
        <img src={s.img} alt={s.name} className="w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-500" />
      </div>
      <div className="min-w-0">
        <h3 className="text-base font-bold text-slate-900">{s.name}</h3>
        <p className="text-xs font-medium text-purple-700">{s.owns}</p>
        <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{s.blurb}</p>
      </div>
    </div>
  </article>
);

export const MeetHobsonSection: React.FC = () => {
  return (
    <section id="meet-hobson" className="py-16 sm:py-20 bg-gradient-to-b from-white to-purple-50/40">
      <style>{`@keyframes mh-fade-up { from { opacity: 0; transform: translateY(16px);} to { opacity: 1; transform: none;} }`}</style>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-xs font-semibold tracking-[0.2em] text-purple-600 uppercase">Meet Hobson</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900">
            One conversation. A quiet team behind it.
          </h2>
          <div className="mt-6 space-y-3 text-base sm:text-lg text-slate-600 leading-relaxed">
            <p>You only ever speak to Hobson.</p>
            <p>
              Behind him is a carefully chosen team of specialists, each responsible for one area of expertise.
              Some maintain Hobson's understanding of your portfolio. Others provide specialist services whenever he needs them.
            </p>
            <p>
              Hobson decides who to involve, quietly coordinates their work and brings everything together into one clear answer.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <h3 className="text-sm font-semibold tracking-wider text-purple-700 uppercase mb-4">Hobson's permanent memory</h3>
          <div className="grid sm:grid-cols-2 gap-5 mb-12">
            {PERSISTENT_SPECIALISTS.map((s, i) => <Card key={s.name} s={s} index={i} />)}
          </div>

          <h3 className="text-sm font-semibold tracking-wider text-purple-700 uppercase mb-4">Specialist services</h3>
          <div className="grid sm:grid-cols-2 gap-5">
            {SERVICE_SPECIALISTS.map((s, i) => <Card key={s.name} s={s} index={i} />)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MeetHobsonSection;
