import React from "react";

const FeaturesHero = () => (
  <section className="py-20 sm:py-28 border-b border-border/40 bg-muted/20">
    <div className="container mx-auto px-4 max-w-3xl">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6">
        Phase 1.{" "}
        <span className="text-primary">In depth.</span>
      </h1>
      <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl">
        The Hobson Journey starts here. Every feature below is Phase 1 — live today, no waitlist, no setup. This is what makes Phase 2 and Phase 3 possible.
      </p>
        <div className="inline-flex items-center gap-2.5 bg-primary/10 border border-primary/20 rounded-full px-5 py-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
          </span>
          <span className="text-sm sm:text-base font-semibold text-primary tracking-wide">
            Phase 1 — Live today
          </span>
        </div>
        <div className="inline-flex items-center gap-2 bg-muted border border-border rounded-full px-4 py-2">
          <span className="w-2 h-2 rounded-full bg-muted-foreground/40"></span>
          <span className="text-sm font-medium text-muted-foreground">
            Phase 2 — Year end
          </span>
        </div>
        <div className="inline-flex items-center gap-2 bg-muted border border-border rounded-full px-4 py-2">
          <span className="w-2 h-2 rounded-full bg-muted-foreground/40"></span>
          <span className="text-sm font-medium text-muted-foreground">
            Phase 3 — Year end
          </span>
        </div>
      </div>
    </div>
  </section>
);

export default FeaturesHero;
