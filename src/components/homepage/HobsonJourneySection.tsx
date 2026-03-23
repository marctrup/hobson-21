import { useEffect, useRef, useState } from "react";
import { FileCheck, Brain, Zap } from "lucide-react";

const stages = [
  {
    icon: FileCheck,
    title: "Read & Understand",
    copy: "Ask anything about any lease. Instantly.",
    status: "Live today",
    statusClass: "bg-primary text-primary-foreground",
    active: true,
    complete: true,
  },
  {
    icon: Brain,
    title: "Know Your Business",
    copy: "Hobson learns how you work, not just what your leases say.",
    status: "Building now",
    statusClass: "bg-amber-500/90 text-white",
    active: true,
    complete: false,
  },
  {
    icon: Zap,
    title: "Act Autonomously",
    copy: "Your portfolio managed. Before you even ask.",
    status: "Coming soon",
    statusClass: "bg-muted/40 text-muted-foreground border border-border",
    active: false,
    complete: false,
  },
];

export const HobsonJourneySection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-[hsl(220,20%,8%)] text-white relative overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <p className="text-primary font-semibold tracking-wide uppercase text-sm mb-3">
              The Hobson Journey
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Where we are. Where we're going.
            </h2>
            <p className="text-lg text-white/60 max-w-xl mx-auto">
              A product roadmap told as a story — not a feature list.
            </p>
          </div>

          {/* Stages */}
          <div className="relative grid md:grid-cols-3 gap-12 md:gap-8">
            {/* Progress line — desktop */}
            <div
              className="hidden md:block absolute top-[3.25rem] left-[16.6%] right-[16.6%] h-[3px] bg-white/10 rounded-full"
              aria-hidden="true"
            >
              {/* Filled portion — stops at ~42% (through stage 1, partially into stage 2) */}
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-primary"
                style={{
                  width: visible ? "42%" : "0%",
                  transition: "width 1.4s cubic-bezier(0.22, 1, 0.36, 1) 0.4s",
                }}
              />
            </div>

            {stages.map((stage, i) => {
              const Icon = stage.icon;
              const opacity = stage.active ? "opacity-100" : "opacity-50";

              return (
                <div
                  key={i}
                  className={`relative text-center flex flex-col items-center ${opacity}`}
                  style={{
                    opacity: visible ? undefined : 0,
                    animation: visible
                      ? `fade-in 0.6s ease-out ${0.3 + i * 0.2}s both`
                      : "none",
                  }}
                >
                  {/* Icon circle */}
                  <div
                    className={`w-[4.5rem] h-[4.5rem] rounded-full flex items-center justify-center mb-6 relative z-10 ${
                      stage.complete
                        ? "bg-primary text-primary-foreground shadow-[0_0_30px_hsl(var(--primary)/0.35)]"
                        : stage.active
                          ? "bg-white/10 text-white border border-white/20"
                          : "bg-white/5 text-white/40 border border-white/10"
                    }`}
                  >
                    <Icon className="w-7 h-7" strokeWidth={1.8} />
                  </div>

                  <h3 className="text-xl font-bold mb-2">{stage.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-5 max-w-[240px]">
                    {stage.copy}
                  </p>

                  {/* Status pill */}
                  <span
                    className={`inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide ${stage.statusClass}`}
                  >
                    {stage.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
