import React from "react";

const FeaturesHero = () => (
  <section className="py-16 sm:py-20 md:py-24 border-b border-border/40 bg-muted/20">
    <div className="container mx-auto px-4 text-center max-w-4xl">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
        What Hobson does. How it works. <span className="text-primary">Why it matters.</span>
      </h1>
      <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
        Every feature below is live in Phase 1 today. No waitlist. No setup. No technical knowledge required. Just add your first document and start asking questions.
      </p>
    </div>
  </section>
);

export default FeaturesHero;
