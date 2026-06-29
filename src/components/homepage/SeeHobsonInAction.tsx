import React, { memo } from "react";
import { MessageSquare, MapPin, ShieldCheck, Building2 } from "lucide-react";
import hobsonInAction from "@/assets/hobson-in-action.png.asset.json";

const features = [
  {
    icon: MessageSquare,
    title: "One conversation",
    body: "Speak naturally with Hobson instead of navigating software.",
    tone: { icon: "text-primary", bg: "bg-primary/10" },
  },
  {
    icon: MapPin,
    title: "Interactive portfolio",
    body: "Every answer is connected to the places, properties and units that matter.",
    tone: { icon: "text-accent-teal", bg: "bg-accent-teal/10" },
  },
  {
    icon: ShieldCheck,
    title: "Evidence you can trust",
    body: "Every answer is supported by the documents Hobson has used.",
    tone: { icon: "text-accent-amber", bg: "bg-accent-amber/15" },
  },
  {
    icon: Building2,
    title: "Built around property",
    body: "Purpose-built for property professionals — not adapted from a generic AI tool.",
    tone: { icon: "text-accent-rose", bg: "bg-accent-rose/10" },
  },
];

const SeeHobsonInAction = memo(() => {
  return (
    <section
      className="py-16 sm:py-20 md:py-28 bg-background overflow-hidden"
      aria-labelledby="showcase-heading"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-6 sm:mb-8">
            <h2
              id="showcase-heading"
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in"
            >
              See Hobson in{" "}
              <span className="text-primary">Action</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: "100ms", animationFillMode: "backwards" }}>
              Everything you&apos;ve seen so far comes together in one simple experience. One conversation with Hobson. One interactive portfolio. One place to find answers, understand your obligations and get work done.
            </p>
          </div>

          {/* Product showcase frame */}
          <div className="relative mx-auto max-w-5xl my-10 sm:my-14 md:my-16">
            {/* Ambient glow behind */}
            <div
              className="absolute -inset-x-10 -inset-y-8 bg-gradient-to-br from-primary/8 via-transparent to-accent-teal/8 blur-3xl rounded-full pointer-events-none"
              aria-hidden="true"
            />

            {/* Browser-style frame */}
            <div
              className="relative rounded-2xl border border-border/50 bg-card shadow-2xl shadow-primary/10 overflow-hidden animate-fade-in"
              style={{ animationDelay: "200ms", animationFillMode: "backwards" }}
            >
              {/* Subtle top bar */}
              <div className="h-8 sm:h-10 bg-muted/60 border-b border-border/40 flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-border" aria-hidden="true" />
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-border" aria-hidden="true" />
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-border" aria-hidden="true" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="h-5 sm:h-6 w-40 sm:w-56 rounded-md bg-background border border-border/50 flex items-center justify-center">
                    <span className="text-[10px] sm:text-xs text-muted-foreground font-mono">hobsonschoice.ai</span>
                  </div>
                </div>
              </div>

              {/* Screenshot */}
              <div className="overflow-hidden">
                <img
                  src={hobsonInAction.url}
                  alt="Hobson AI product interface showing a natural conversation alongside an interactive property map with document sources and evidence"
                  className="w-full h-auto block"
                  decoding="async"
                  fetchPriority="high"
                />
              </div>
            </div>
          </div>

          {/* Supporting copy */}
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16 animate-fade-in" style={{ animationDelay: "400ms", animationFillMode: "backwards" }}>
            <p className="text-lg sm:text-xl md:text-2xl text-foreground font-medium leading-relaxed mb-4">
              Property work shouldn&apos;t feel like hard work.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed space-y-3">
              <span className="block">
                Hobson brings together your conversation, documents and portfolio into one calm workspace.
              </span>
              <span className="block">
                Ask a question in plain English, see exactly where it relates within your portfolio and always understand where every answer came from.
              </span>
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-sm text-muted-foreground">
              <span>No complicated dashboards.</span>
              <span className="hidden sm:inline text-border">|</span>
              <span>No searching through multiple systems.</span>
              <span className="hidden sm:inline text-border">|</span>
              <span>Just one conversation that quietly helps you get the work done.</span>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="text-center space-y-4 p-6 rounded-xl bg-muted/30 border border-border/40 hover:border-border hover:shadow-md transition-all duration-300 animate-fade-in"
                  style={{
                    animationDelay: `${500 + i * 120}ms`,
                    animationFillMode: "backwards",
                  }}
                >
                  <div
                    className={`w-12 h-12 mx-auto rounded-xl ${f.tone.bg} flex items-center justify-center`}
                  >
                    <Icon className={`w-6 h-6 ${f.tone.icon}`} strokeWidth={1.8} />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    {f.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {f.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
});

SeeHobsonInAction.displayName = "SeeHobsonInAction";

export default SeeHobsonInAction;
