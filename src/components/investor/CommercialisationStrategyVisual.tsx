import React from 'react';
import { AlertTriangle, TrendingDown, Users, Scale, ShieldAlert, CheckCircle2, Zap } from 'lucide-react';

export const CommercialisationStrategyVisual = () => {
  const operatorChallenges = [
    { icon: Scale, text: "exploding regulatory complexity," },
    { icon: TrendingDown, text: "shrinking operating margins," },
    { icon: Users, text: "acute labour shortages," },
    { icon: ShieldAlert, text: "rising compliance penalties," },
    { icon: AlertTriangle, text: "and mounting portfolio risk." },
  ];

  const problemsSolved = [
    "compliance exposure,",
    "lease complexity,",
    "maintenance volatility,",
    "and portfolio-level risk blindness.",
  ];

  return (
    <div className="space-y-8">
      {/* Header - Inflexion Point */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-warning/10 via-warning/10 to-warning/5 p-6 border border-warning-border/50 dark:border-warning/30">
        <div className="absolute top-0 right-0 w-32 h-32 bg-warning/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <h3 className="text-xl font-bold text-foreground">The Real Estate industry is at an inflexion point.</h3>
        </div>
      </div>

      {/* Section 1: Operators Are Facing */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-danger-bg dark:bg-danger-solid/50 text-danger dark:text-danger font-bold text-sm">1</div>
          <h4 className="font-semibold text-foreground">Operators are facing:</h4>
        </div>
        
        <div className="ml-11 space-y-3">
          {operatorChallenges.map((challenge, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-danger-bg/50 dark:bg-danger-solid/20 border border-danger-border dark:border-danger/30">
              <challenge.icon className="w-5 h-5 text-danger dark:text-danger flex-shrink-0" />
              <span className="text-foreground">{challenge.text}</span>
            </div>
          ))}
        </div>
        
        <div className="ml-11 mt-4 p-4 rounded-xl bg-gradient-to-r from-paper to-bone-wash dark:from-ink/50 dark:to-ink/30 border border-bone dark:border-charcoal/50">
          <p className="text-foreground font-medium">
            They cannot wait for incremental tools. They need a <span className="text-primary font-bold">structural operating upgrade</span>.
          </p>
        </div>
      </div>

      {/* Section 2: Hobson's Product */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-success-bg dark:bg-success-solid/50 text-success dark:text-success font-bold text-sm">2</div>
          <h4 className="font-semibold text-foreground">Hobson's product is already solving existential problems:</h4>
        </div>
        
        <div className="ml-11 grid sm:grid-cols-2 gap-3">
          {problemsSolved.map((problem, idx) => (
            <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-success-bg/80 to-success-bg/50 dark:from-success-solid/30 dark:to-success-solid/20 border border-success-border dark:border-success/30">
              <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
              <span className="text-foreground">{problem}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Conclusion */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/15 to-primary/10 p-6 border border-primary/30">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative space-y-4">
          <div className="flex items-start gap-3">
            <Zap className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
            <div className="space-y-3">
              <p className="text-foreground font-medium leading-relaxed">
                Commercialisation is not an experiment. It is an <span className="text-primary font-bold">inevitability</span>.
              </p>
              <p className="text-foreground font-bold text-lg">
                The only question is who captures the category.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
