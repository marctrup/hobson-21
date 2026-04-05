import React from "react";

const FeaturesHero = () => (
  <section className="py-20 sm:py-28 border-b border-border/40 bg-muted/20">
    <div className="container mx-auto px-4 max-w-3xl">
      <p className="text-sm font-mono tracking-widest text-primary/60 mb-6 uppercase">
        Phase 1 — Live today
      </p>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6">
        Nine features. One story.{" "}
        <span className="text-primary">Why Hobson exists.</span>
      </h1>
      <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
        Every capability below is live. No waitlist. No setup. No technical knowledge required.
        This page explains what each feature does, the problem it solves, and why it matters
        for anyone who manages property documents — told as a single, connected narrative.
      </p>
    </div>
  </section>
);

export default FeaturesHero;
