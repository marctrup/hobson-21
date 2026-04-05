import { useEffect, useRef, useState } from "react";
import { FileCheck, Brain, Zap } from "lucide-react";

const stages = [
  {
    icon: FileCheck,
    title: "Read & Understand",
    copy: "Ask anything about any lease or property document. Hobson reads the full stack and returns the current legal position — sourced to the exact clause.",
    status: "Live today",
    statusClass: "bg-primary text-primary-foreground",
    active: true,
    complete: true,
  },
  {
    icon: Brain,
    title: "Know Your Business",
    copy: "Hobson learns your contractors, your policies, your preferences. Every answer it gives reflects how your business actually works.",
    status: "Launching later this year",
    statusClass: "bg-muted/40 text-muted-foreground border border-border",
    active: true,
    complete: false,
  },
  {
    icon: Zap,
    title: "Act on Your Behalf",
    copy: "phase3",
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
      className="py-16 bg-muted/30 text-foreground relative overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <p className="text-primary font-semibold tracking-wide uppercase text-sm mb-10">
              The Single Idea
            </p>

            <div className="max-w-[680px] mx-auto">
              {/* Problem statement — small, muted, above the pull-quote */}
              <p className="text-base text-muted-foreground/70 leading-relaxed font-light">
                Software gave property professionals better filing cabinets.
                <br />
                It never gave them fewer things to do.
              </p>
              <p className="text-base text-muted-foreground/70 leading-relaxed font-light mt-3 mb-10">
                A document stored is not a document understood.
                <br />
                A deadline filed is not a deadline managed.
              </p>
            </div>

            {/* Pull-quote centrepiece */}
            <div className="max-w-4xl mx-auto mb-10">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-primary">
                Property obligations should manage themselves.
              </h2>
            </div>

            <div className="max-w-[680px] mx-auto">
              {/* Connector line */}
              <div className="flex justify-center mb-8">
                <div className="w-12 h-px bg-primary/30" />
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Every phase below is a step toward that.
              </p>
            </div>
          </div>

          {/* Stages */}
          <div className="relative grid md:grid-cols-3 gap-12 md:gap-8">
            {/* Progress line — desktop (only purple filled portion) */}
            <div
              className="hidden md:block absolute top-[3.25rem] left-[16.6%] right-[16.6%] h-[3px] rounded-full"
              aria-hidden="true"
            >
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
              const opacity = "";

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
                          ? "bg-foreground/10 text-foreground border border-foreground/20"
                          : "bg-foreground/5 text-foreground/40 border border-foreground/10"
                    }`}
                  >
                    <Icon className="w-7 h-7" strokeWidth={1.8} />
                  </div>

                  <h3 className="text-xl font-bold mb-2">{stage.title}</h3>
                  <div className="text-muted-foreground text-sm leading-relaxed mb-5 max-w-[240px]">
                    {stage.copy === "phase3" ? (
                      <>
                        <p>Hobson stops answering and starts acting.</p>
                        <p>Rent reviews triggered.</p>
                        <p>Deadlines managed.</p>
                        <p>Work done — without being asked.</p>
                      </>
                    ) : (
                      <p>{stage.copy}</p>
                    )}
                  </div>

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
