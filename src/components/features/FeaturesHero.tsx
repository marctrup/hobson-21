import React from "react";

const FeaturesHero = () => (
  <section className="py-20 sm:py-28 border-b border-border/40 bg-muted/20">
    <div className="container mx-auto px-4 max-w-3xl">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6">
        Nine features. One story.{" "}
        <span className="text-primary">Why Hobson exists.</span>
      </h1>
      <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-6">
        Every capability below is live. No waitlist. No setup. No technical knowledge required.
        This page explains what each feature does, the problem it solves, and why it matters
        for anyone who manages property documents — told as a single, connected narrative.
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
    </div>
  </section>
);

export default FeaturesHero;
