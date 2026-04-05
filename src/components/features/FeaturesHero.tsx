import React from "react";

const FeaturesHero = () => (
  <section className="py-20 sm:py-28 border-b border-border/40 bg-muted/20">
    <div className="container mx-auto px-4 max-w-3xl">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6">
        Nine features. One story.{" "}
        <span className="text-primary">Why Hobson exists.</span>
      </h1>
      <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-6">
        Software gave property professionals better filing cabinets. It never gave them fewer things to do.
        A document stored is not a document understood. A deadline filed is not a deadline managed.
        Hobson exists because reading the lease is not the hard part — doing what it says is.
        Every feature below is built around that single idea.
      </p>
      <div className="flex flex-wrap items-center gap-3">
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
