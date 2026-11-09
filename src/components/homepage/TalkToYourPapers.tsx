import { useEffect, useState } from "react";
import {
  BookOpen,
  GitCommitVertical,
  MessageCircle,
  FileText,
  Send,
  Map as MapIcon,
  Search,
  Plus,
  Minus,
} from "lucide-react";
import hobsonOwl from "@/assets/owl-mascot.png";
import professorImg from "@/assets/prototype/character-professor-transparent.png";
import { MAP_VIEWBOX, MAP_LAND, MAP_CLUSTERS, MAP_PLACE } from "./portfolioMapGeometry";

/* Talk to your papers — your places on a map, your papers read and ordered, then asked about on the go. */

const STEPS = [
  {
    icon: MapIcon,
    kicker: "To start",
    title: "Your places, all in one view.",
    body: "Every unit group and unit you look after sits on one map, counted and grouped — so you see at once where your papers are read, and where they are still waiting to be.",
  },
  {
    icon: BookOpen,
    kicker: "Then, we read",
    title: "My team reads every paper you give me.",
    body: "Leases, deeds, licences, side letters, wayleaves — my colleague the Professor reads each one properly, so you never have to open a folder to find out what it says.",
  },
  {
    icon: GitCommitVertical,
    kicker: "Then, we organise",
    title: "Everything set out in order, with a summary.",
    body: "Each paper takes its place on a timeline for the unit it concerns — what's current, what came before — with a short plain-English summary of what it does.",
  },
  {
    icon: MessageCircle,
    kicker: "Now, you ask",
    title: "Talk to your papers, wherever you are.",
    body: "On your phone between viewings, or at your desk on a Friday afternoon: ask me a question and I'll answer from the papers themselves, showing you the source.",
  },
];

const WHO = [
  "Asset managers who inherit decades of papers with every acquisition",
  "Operators who need the lease terms before a landlord meeting, not after",
  "Family offices whose deeds sit in three different filing cabinets",
  "Agents asked a question on site, with the file back at the office",
];

const TIMELINE = [
  { type: "Deed of release", title: "Release of guarantor", date: "7 Aug 2025", summary: "Releases the former guarantor from all future obligations under the current lease." },
  { type: "Deed of surrender", title: "Surrender of earlier lease", date: "20 Mar 2023", summary: "Records the surrender of the 2021 lease to the landlord, with the management company consenting." },
  { type: "Business lease", title: "Lease of Units 1 & 2", date: "20 Mar 2023", summary: "Ten-year lease from 20 March 2023. Rent review at year five; tenant break at year five on six months' notice." },
  { type: "Wayleave agreement", title: "Telecoms wayleave", date: "1 Mar 2023", summary: "Permits a broadband provider to install and keep equipment in the riser." },
];

const HEADS = [
  { title: "Every place you look after", sub: "36 places · 214 papers read" },
  { title: "What I have for 1 The Avenue", sub: "37 papers · being read" },
  { title: "What I have for 1 The Avenue", sub: "37 papers · read and in order" },
  { title: "What I have for 1 The Avenue", sub: "37 papers · read and in order" },
];

/* The portfolio map: a stylised drawing, not a live one — counts stand in for your own places. */
const PortfolioMap = () => (
  <svg viewBox={MAP_VIEWBOX} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden focusable="false">
    <rect x="-20" y="-20" width="200" height="300" fill="hsl(var(--map-water))" />
    {MAP_LAND.map((d, i) => (
      <path key={i} d={d} fill="#FFFFFF" stroke="var(--bone-strong)" strokeWidth={0.35} strokeLinejoin="round" />
    ))}
    {MAP_CLUSTERS.map((c) => (
      <g key={c.name}>
        <circle cx={c.x} cy={c.y} r={7} fill="#8B5CF6" opacity={0.12} />
        <circle cx={c.x} cy={c.y} r={4.6} fill="#8B5CF6" opacity={0.2} />
        <circle cx={c.x} cy={c.y} r={3.3} fill="#7C3AED" />
        <text x={c.x} y={c.y} fontSize={3.1} textAnchor="middle" dominantBaseline="central" fill="#FFFFFF" fontWeight={700} style={{ fontFamily: "system-ui, sans-serif" }}>
          {c.count}
        </text>
      </g>
    ))}
    <g>
      <circle cx={MAP_PLACE.x} cy={MAP_PLACE.y} r={2.2} fill="var(--ink)" stroke="#FFFFFF" strokeWidth={0.6} />
      <rect x={MAP_PLACE.x - 9.5} y={MAP_PLACE.y + 3.4} width={19} height={4.6} rx={2.3} fill="var(--ink)" />
      <text x={MAP_PLACE.x} y={MAP_PLACE.y + 5.7} fontSize={2.8} textAnchor="middle" dominantBaseline="central" fill="var(--paper)" fontWeight={600} style={{ fontFamily: "system-ui, sans-serif" }}>
        {MAP_PLACE.name}
      </text>
    </g>
  </svg>
);

const PhoneScreen = ({ stage }: { stage: number }) => {
  const head = HEADS[stage] ?? HEADS[0];
  const tabOn = (tab: "map" | "papers" | "chat") =>
    tab === "map" ? stage === 0 : tab === "papers" ? stage === 1 || stage === 2 : stage === 3;

  const tab = (label: string, icon: typeof MapIcon, key: "map" | "papers" | "chat") => {
    const Icon = icon;
    const on = tabOn(key);
    return (
      <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-colors ${on ? "font-semibold" : "text-muted-foreground"}`} style={on ? { background: "var(--bone-wash)", color: "var(--brass-text)" } : undefined}>
        <Icon className="w-3 h-3" />
        {label}
      </span>
    );
  };

  return (
    <div className="relative mx-auto w-[300px] sm:w-[320px]">
      <div className="absolute -inset-10 rounded-[3rem] blur-3xl opacity-70" style={{ background: "radial-gradient(circle at 50% 40%, hsl(var(--shadow-colour) / 0.06), transparent 70%)" }} aria-hidden />
      <div className="relative rounded-[2.75rem] p-2.5 shadow-[0_40px_90px_-25px_hsl(var(--shadow-colour)_/_0.45)]" style={{ background: "var(--ink)" }}>
        <div className="relative rounded-[2.2rem] overflow-hidden h-[600px] flex flex-col" style={{ background: "#FFFFFF" }}>
          {/* Notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 rounded-full z-20" style={{ background: "var(--ink)" }} aria-hidden />

          {/* Top bar */}
          <div className="pt-11 px-4 pb-3 flex justify-center">
            <div className="flex items-center gap-1 rounded-full p-1 text-[11px] border" style={{ borderColor: "var(--bone-wash)" }}>
              {tab("Map", MapIcon, "map")}
              {tab("Papers", FileText, "papers")}
              {tab("Chat", MessageCircle, "chat")}
            </div>
          </div>

          {/* Header */}
          <div className="px-4 py-3 flex gap-3 items-start border-y" style={{ borderColor: "var(--bone-wash)", background: "var(--paper)" }}>
            <img src={hobsonOwl} alt="" className="w-10 h-10 object-contain shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-bold" style={{ color: "var(--ink)" }}>{head.title}</p>
              <p className="text-[11px] text-muted-foreground">{head.sub}</p>
            </div>
          </div>

          <div className="flex-1 relative overflow-hidden">
            {/* Stage 0 — your places on the map */}
            <div className={`absolute inset-0 transition-all duration-700 ${stage === 0 ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
              <PortfolioMap />
              <span className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-md" style={{ background: "#FFFFFF" }} aria-hidden>
                <Search className="w-4 h-4" style={{ color: "#7C3AED" }} />
              </span>
              <span className="absolute bottom-16 right-3 flex flex-col rounded-lg overflow-hidden shadow-md" style={{ background: "#FFFFFF" }} aria-hidden>
                <span className="w-7 h-7 flex items-center justify-center border-b" style={{ borderColor: "hsl(var(--map-water))" }}><Plus className="w-3.5 h-3.5" style={{ color: "var(--ink)" }} /></span>
                <span className="w-7 h-7 flex items-center justify-center"><Minus className="w-3.5 h-3.5" style={{ color: "var(--ink)" }} /></span>
              </span>
              <span className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] shadow-md" style={{ background: "#FFFFFF" }} aria-hidden>
                <span className="font-semibold" style={{ color: "var(--ink)" }}>Map</span>
                <span className="text-muted-foreground">Satellite</span>
              </span>
            </div>

            {/* Stage 1 — reading */}
            <div className={`absolute inset-0 px-4 py-5 transition-all duration-700 ${stage === 1 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3 pointer-events-none"}`}>
              <div className="flex items-center gap-3 mb-4">
                <img src={professorImg} alt="" className="w-14 h-14 object-contain" />
                <p className="text-xs leading-snug" style={{ color: "var(--charcoal)" }}><span className="font-semibold" style={{ color: "var(--ink)" }}>My colleague the Professor</span> is reading your papers, so you needn't.</p>
              </div>
              <ul className="space-y-2.5">
                {["Lease — Units 1 & 2.pdf", "Deed of surrender.pdf", "Licence to alter.pdf", "Wayleave — signed.pdf", "Release of guarantor.pdf"].map((f, i) => (
                  <li key={f} className="flex items-center gap-2.5 rounded-lg px-3 py-2 border text-xs" style={{ borderColor: "var(--bone-wash)" }}>
                    <FileText className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--brass)" }} />
                    <span className="flex-1 truncate" style={{ color: "var(--ink)" }}>{f}</span>
                    <span className="text-[10px] font-medium" style={{ color: i < 3 ? "#3F7A52" : "var(--brass)" }}>{i < 3 ? "Read" : "Reading…"}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bone-wash)" }}>
                <div className="h-full rounded-full" style={{ width: "64%", background: "var(--brass)" }} />
              </div>
            </div>

            {/* Stage 2 — timeline with summary */}
            <div className={`absolute inset-0 px-4 py-4 transition-all duration-700 ${stage === 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"}`}>
              <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-2">Occupation history</p>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-semibold" style={{ color: "var(--ink)" }}>Business lease</span>
                <span className="text-[10px] font-semibold rounded-full px-2 py-0.5 border" style={{ color: "#3F7A52", borderColor: "#BFD9C7", background: "#F1F8F3" }}>● Current</span>
              </div>
              <ol className="relative pl-5 space-y-3 before:absolute before:left-[5px] before:top-1 before:bottom-1 before:w-px before:bg-border">
                {TIMELINE.map((t, i) => (
                  <li key={t.title} className="relative">
                    <span className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full" style={{ background: "#3F7A52" }} />
                    <span className="inline-block text-[9px] font-semibold uppercase tracking-wider rounded px-1.5 py-0.5 mb-1" style={{ background: "var(--bone-wash)", color: "var(--brass-text)" }}>{t.type}</span>
                    <p className="text-xs font-semibold" style={{ color: "var(--ink)" }}>{t.title}</p>
                    <p className="text-[10px] text-muted-foreground">{t.date}</p>
                    {i === 2 && (
                      <div className="mt-1.5 rounded-lg p-2.5 text-[11px] leading-snug shadow-md border" style={{ background: "#FFFFFF", borderColor: "var(--bone)", color: "var(--charcoal)" }}>
                        <span className="font-semibold" style={{ color: "var(--ink)" }}>In brief: </span>{t.summary}
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            </div>

            {/* Stage 3 — talk */}
            <div className={`absolute inset-0 px-4 py-4 flex flex-col gap-3 transition-all duration-700 ${stage === 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"}`}>
              <div className="self-end max-w-[85%] rounded-2xl rounded-br-sm px-3 py-2 text-xs" style={{ background: "var(--ink)", color: "var(--paper)" }}>
                When can the tenant at Units 1 & 2 break?
              </div>
              <div className="flex gap-2 items-start">
                <img src={hobsonOwl} alt="" className="w-7 h-7 object-contain shrink-0" />
                <div className="rounded-2xl rounded-tl-sm px-3 py-2 text-xs leading-relaxed border" style={{ background: "var(--paper)", borderColor: "var(--bone-wash)", color: "var(--ink)" }}>
                  On 20 March 2028, giving at least six months' notice — so by 20 September 2027.
                  <div className="mt-2 flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] border" style={{ borderColor: "var(--bone)", color: "var(--brass-text)", background: "#FFFFFF" }}>
                    <FileText className="w-3 h-3" />Lease of Units 1 & 2 · clause 9.1
                  </div>
                </div>
              </div>
              <div className="self-end max-w-[85%] rounded-2xl rounded-br-sm px-3 py-2 text-xs" style={{ background: "var(--ink)", color: "var(--paper)" }}>
                And who released the guarantor?
              </div>
              <div className="flex gap-1 pl-9" aria-hidden>
                {[0, 1, 2].map((d) => (
                  <span key={d} className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--brass)", animationDelay: `${d * 200}ms` }} />
                ))}
              </div>
            </div>
          </div>

          {/* Composer — the map asks nothing of you */}
          {stage === 0 ? null : (
            <div className="px-3 pb-5 pt-2">
              <div className="flex items-center gap-2 rounded-full border px-3 py-2" style={{ borderColor: "var(--bone)" }}>
                <span className="flex-1 text-[11px] text-muted-foreground">Ask me about your papers…</span>
                <span className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "var(--brass)" }}><Send className="w-3 h-3" style={{ color: "#FFFFFF" }} /></span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const TalkToYourPapers = () => {
  const [stage, setStage] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setStage((s) => (s + 1) % STEPS.length), 4500);
    return () => window.clearInterval(t);
  }, [paused]);

  return (
    <section className="py-16 sm:py-20 md:py-28 overflow-hidden" aria-labelledby="talk-papers-heading" style={{ background: "#FFFFFF" }}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "var(--brass)" }}>
              Talk to your papers
            </span>
            <h2 id="talk-papers-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-5 tracking-tight">
              Your own assistant,{" "}
              <span className="text-foreground">who has read every paper.</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              My team and I take the time to read your papers, put them in order on a timeline and write you a short summary of each — so whether you're looking at your whole portfolio or one clause, you simply ask.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
              <ol className="space-y-3">
                {STEPS.map((s, i) => {
                  const Icon = s.icon;
                  const active = i === stage;
                  return (
                    <li key={s.kicker}>
                      <button
                        type="button"
                        onClick={() => setStage(i)}
                        onFocus={() => { setStage(i); setPaused(true); }}
                        onBlur={() => setPaused(false)}
                        aria-pressed={active}
                        className="w-full text-left rounded-2xl p-5 border transition-all duration-500"
                        style={active
                          ? { background: "var(--paper)", borderColor: "var(--bone)", boxShadow: "0 18px 40px -20px hsl(var(--shadow-colour) / 0.18)" }
                          : { background: "transparent", borderColor: "transparent" }}
                      >
                        <div className="flex gap-4">
                          <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors" style={active ? { background: "var(--brass)" } : { background: "var(--bone-wash)" }}>
                            <Icon className="w-5 h-5" style={{ color: active ? "#FFFFFF" : "var(--brass-text)" }} />
                          </span>
                          <div>
                            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase" style={{ color: "var(--brass)" }}>{s.kicker}</p>
                            <p className="text-lg font-bold mt-0.5" style={{ color: "var(--ink)" }}>{s.title}</p>
                            <p className={`text-sm leading-relaxed text-muted-foreground transition-all duration-500 overflow-hidden ${active ? "max-h-40 mt-2 opacity-100" : "max-h-0 opacity-0"}`}>{s.body}</p>
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2">
              <PhoneScreen stage={stage} />
            </div>
          </div>

          {/* Who it's for */}
          <div className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: "var(--ink)" }}>Who would like their papers read for them?</h3>
              <p className="mt-3 text-base text-muted-foreground leading-relaxed">Anyone who has ever hunted through a folder for one clause.</p>
            </div>
            <ul className="space-y-3">
              {WHO.map((w) => (
                <li key={w} className="flex gap-3 text-base" style={{ color: "var(--charcoal)" }}>
                  <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--brass)" }} />
                  {w}
                </li>
              ))}
            </ul>
          </div>

          {/* Foundation */}
          <div className="mt-14 rounded-3xl p-8 sm:p-10 text-center" style={{ background: "var(--ink)" }}>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "var(--bone)" }}>The start, not the end</p>
            <p className="text-2xl sm:text-3xl font-bold tracking-tight max-w-3xl mx-auto" style={{ color: "var(--paper)" }}>
              Well-read, well-ordered papers are the foundation for everything I do next.
            </p>
            <p className="mt-4 text-base max-w-2xl mx-auto leading-relaxed" style={{ color: "hsl(var(--inverse-muted))" }}>
              Once I truly know what your papers say, I can watch your dates, prepare your renewals and keep your compliance in hand — always from the source.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
