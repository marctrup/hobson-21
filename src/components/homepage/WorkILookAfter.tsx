import React from "react";
import {
  Calendar,
  DoorOpen,
  FileClock,
  Leaf,
  ShieldCheck,
  Receipt,
  Home,
  MessageSquare,
  BellRing,
  ClipboardCheck,
  Hammer,
  FileSignature,
  Sparkles,
} from "lucide-react";

type Responsibility = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tint: string;
  iconColor: string;
};

const RESPONSIBILITIES: Responsibility[] = [
  { label: "Rent Reviews", icon: FileClock, tint: "bg-sky-50", iconColor: "text-sky-600" },
  { label: "Break Clauses", icon: DoorOpen, tint: "bg-emerald-50", iconColor: "text-emerald-600" },
  { label: "Lease Expiry Monitoring", icon: Calendar, tint: "bg-amber-50", iconColor: "text-amber-600" },
  { label: "EPC Compliance", icon: Leaf, tint: "bg-lime-50", iconColor: "text-lime-600" },
  { label: "Insurance Renewals", icon: ShieldCheck, tint: "bg-rose-50", iconColor: "text-rose-600" },
  { label: "Service Charge Monitoring", icon: Receipt, tint: "bg-violet-50", iconColor: "text-violet-600" },
  { label: "Vacant Unit Monitoring", icon: Home, tint: "bg-cyan-50", iconColor: "text-cyan-600" },
  { label: "Tenant Communications", icon: MessageSquare, tint: "bg-orange-50", iconColor: "text-orange-600" },
  { label: "Key Date Monitoring", icon: BellRing, tint: "bg-indigo-50", iconColor: "text-indigo-600" },
  { label: "Compliance Monitoring", icon: ClipboardCheck, tint: "bg-teal-50", iconColor: "text-teal-600" },
  { label: "Dilapidations", icon: Hammer, tint: "bg-fuchsia-50", iconColor: "text-fuchsia-600" },
  { label: "Licence Renewals", icon: FileSignature, tint: "bg-blue-50", iconColor: "text-blue-600" },
];

export const WorkILookAfter = () => {
    <section
      className="py-16 sm:py-20 md:py-28 bg-gradient-to-b from-background via-muted/20 to-background overflow-hidden"
      aria-labelledby="work-heading"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-14 md:mb-20">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] text-primary uppercase mb-4">
              The work I look after
            </span>
            <h2
              id="work-heading"
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-5 tracking-tight"
            >
              Real work.{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Quietly taken care of.
              </span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              A responsibility is an area of your property work I continuously manage on your behalf. Here are some of the areas I already look after — and a closer look at how my team handles a rent review.
            </p>
          </div>

          {/* Responsibilities grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-16 md:mb-24">
            {RESPONSIBILITIES.map(({ label, icon: Icon, tint, iconColor }) => (
              <div
                key={label}
                className="group flex items-center gap-3 rounded-xl border border-border/60 bg-background p-4 transition-all hover:border-primary/30 hover:shadow-sm"
              >
                <div className={`shrink-0 w-10 h-10 rounded-lg ${tint} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <span className="text-sm font-medium text-foreground leading-tight">{label}</span>
              </div>
            ))}
            <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-primary/30 bg-primary/[0.03] p-4 text-sm font-medium text-muted-foreground col-span-2 sm:col-span-3 lg:col-span-4">
              <Sparkles className="w-4 h-4 text-primary" />
              …and many more. Tell me what your business needs.
            </div>
          </div>

          {/* Rent review walkthrough */}
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 md:mb-14">
              <span className="inline-block text-xs font-semibold tracking-[0.2em] text-primary uppercase mb-3">
                A closer look
              </span>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                How my team handles a{" "}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  rent review
                </span>
              </h3>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                One responsibility. Five specialists. All coordinated quietly in the background so you only see the finished work.
              </p>
            </div>

            <div className="relative rounded-2xl border border-border/60 bg-background shadow-[0_20px_60px_-30px_hsl(var(--primary)/0.25)] p-6 sm:p-8 md:p-10">
              {/* Step selector */}
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
                {RENT_REVIEW_STEPS.map((step, i) => (
                  <button
                    key={step.agent}
                    onClick={() => setActiveStep(i)}
                    className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs sm:text-sm font-medium transition-all ${
                      activeStep === i
                        ? "border-primary/40 bg-primary/10 text-foreground shadow-sm"
                        : "border-border/60 bg-background text-muted-foreground hover:border-primary/20 hover:text-foreground"
                    }`}
                    aria-pressed={activeStep === i}
                  >
                    <span
                      className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-semibold ${
                        activeStep === i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                    </span>
                    {step.agent}
                  </button>
                ))}
              </div>

              {/* Active step detail */}
              <div className="grid grid-cols-1 sm:grid-cols-[auto,1fr] gap-6 sm:gap-8 items-center">
                <div className="mx-auto sm:mx-0 relative">
                  <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-primary/20 to-transparent blur-xl" />
                  <img
                    src={RENT_REVIEW_STEPS[activeStep].avatar}
                    alt={RENT_REVIEW_STEPS[activeStep].agent}
                    className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-primary/20 bg-background"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-xs font-semibold tracking-[0.2em] text-primary uppercase mb-2">
                    Step {activeStep + 1} of {RENT_REVIEW_STEPS.length}
                  </div>
                  <div className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                    {RENT_REVIEW_STEPS[activeStep].agent}
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {RENT_REVIEW_STEPS[activeStep].action}
                  </p>
                </div>
              </div>

              {/* Flow strip */}
              <div className="mt-10 pt-8 border-t border-border/50">
                <div className="flex items-center justify-between gap-2 overflow-x-auto">
                  {RENT_REVIEW_STEPS.map((step, i) => (
                    <React.Fragment key={step.agent}>
                      <button
                        onClick={() => setActiveStep(i)}
                        className="shrink-0 flex flex-col items-center gap-1.5 group"
                        aria-label={`Go to step ${i + 1}: ${step.agent}`}
                      >
                        <img
                          src={step.avatar}
                          alt=""
                          className={`w-10 h-10 rounded-full object-cover border-2 transition-all ${
                            activeStep === i
                              ? "border-primary scale-110"
                              : "border-border/60 opacity-60 group-hover:opacity-100"
                          }`}
                        />
                        <span
                          className={`text-[10px] font-medium transition-colors ${
                            activeStep === i ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {step.agent.replace("The ", "")}
                        </span>
                      </button>
                      {i < RENT_REVIEW_STEPS.length - 1 && (
                        <ArrowRight className="shrink-0 w-4 h-4 text-muted-foreground/40" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
