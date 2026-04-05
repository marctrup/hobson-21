import { useEffect, useRef, useState } from "react";
import { FileCheck, Brain, Zap } from "lucide-react";

const stages = [
  {
    icon: FileCheck,
    title: "Read & Understand",
    copy: "Ask anything about any lease, compliance document or property contract in plain English. Hobson reads the full document stack — including deeds of variation, rent memorandums and supplemental agreements — and returns the current legal position with every answer sourced to the exact clause.",
    status: "Live today",
    statusClass: "bg-primary text-primary-foreground",
    active: true,
    complete: true,
  },
  {
    icon: Brain,
    title: "Know Your Business",
    copy: "Hobson learns how your business operates. Your contractors, contacts, policies and preferences — stored permanently and applied to every answer. Every response reflects how your business works, not just what your documents say.",
    status: "Launching later this year",
    statusClass: "bg-muted/40 text-muted-foreground border border-border",
    active: true,
    complete: false,
  },
  {
    icon: Zap,
    title: "Act on Your Behalf",
    copy: "Hobson stops answering and starts acting. Rent reviews triggered. Compliance deadlines managed. Lease events handled end-to-end without a human in the loop until a decision is required.",
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
            <p className="text-primary font-semibold tracking-wide uppercase text-sm mb-3">
              The Single Idea
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Property obligations should manage themselves.
            </h2>

            <div className="max-w-[680px] mx-auto">
              {/* Part 1 — Problem statement */}
              <div className="mb-6">
                <p className="text-lg text-muted-foreground/80 leading-relaxed font-light">
                  Software gave property professionals better filing cabinets.
                  <br />
                  It never gave them fewer things to do.
                </p>
                <p className="text-lg text-muted-foreground/80 leading-relaxed font-light mt-4">
                  A document stored is not a document understood.
                  <br />
                  A deadline filed is not a deadline managed.
                </p>
              </div>

              {/* Separator */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-px bg-border" />
              </div>

              {/* Part 2 — The single idea */}
              <div>
                <p className="text-xl text-foreground leading-relaxed font-medium mb-3">
                  The single idea behind Hobson is straightforward:
                  <br />
                  <span className="text-primary">property obligations should manage themselves.</span>
                </p>
                <p className="text-lg text-muted-foreground/80 leading-relaxed font-light">
                  Every phase below is a step toward that.
                </p>
              </div>
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
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5 max-w-[240px]">
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
