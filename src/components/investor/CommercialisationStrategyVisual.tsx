import React from 'react';
import { AlertTriangle, TrendingDown, Users, Scale, ShieldAlert, Target, CheckCircle2, Zap } from 'lucide-react';

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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-amber-500/5 p-6 border border-amber-200/50 dark:border-amber-800/30">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <h3 className="text-xl font-bold text-foreground">The Real Estate industry is at an inflexion point.</h3>
        </div>
      </div>

      {/* Section 1: Operators Are Facing */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 font-bold text-sm">1</div>
          <h4 className="font-semibold text-foreground">Operators are facing:</h4>
        </div>
        
        <div className="ml-11 space-y-3">
          {operatorChallenges.map((challenge, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
              <challenge.icon className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <span className="text-foreground">{challenge.text}</span>
            </div>
          ))}
        </div>
        
        <div className="ml-11 mt-4 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/30 border border-slate-200 dark:border-slate-700/50">
          <p className="text-foreground font-medium">
            They cannot wait for incremental tools. They need a <span className="text-primary font-bold">structural operating upgrade</span>.
          </p>
        </div>
      </div>

      {/* Section 2: Hobson's Product */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-bold text-sm">2</div>
          <h4 className="font-semibold text-foreground">Hobson's product is already solving existential problems:</h4>
        </div>
        
        <div className="ml-11 grid sm:grid-cols-2 gap-3">
          {problemsSolved.map((problem, idx) => (
            <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-emerald-50/80 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
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
