import React from 'react';
import { AlertTriangle, Target, Zap, Rocket } from 'lucide-react';

export const ExecutiveContextVisual = () => {
  const pressures = [
    "Regulatory complexity",
    "Operating cost inflation",
    "Chronic labour shortages",
    "Rising compliance exposure",
  ];

  return (
    <div className="space-y-8">
      {/* Header - Inflexion Point */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500/10 via-teal-500/5 to-teal-500/10 p-6 border border-teal-200/50 dark:border-teal-800/30">
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <h3 className="text-xl font-bold text-foreground">The Real Estate industry has entered a structural inflexion point.</h3>
        </div>
      </div>

      {/* Pressures */}
      <div className="grid sm:grid-cols-2 gap-3">
        {pressures.map((pressure, idx) => (
          <div key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-red-50/50 to-red-100/30 dark:from-red-950/20 dark:to-red-900/10 border border-red-200/50 dark:border-red-800/30">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <span className="text-foreground font-medium">{pressure}</span>
          </div>
        ))}
      </div>

      {/* Context paragraph */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/30 border border-slate-200 dark:border-slate-700/50">
        <p className="text-foreground leading-relaxed">
          Traditional property management systems can no longer scale to meet the demands placed upon them. 
          Operators are under immediate pressure to transform how they manage risk, compliance, documentation, 
          and decision-making—not as an optimisation, but as a <span className="font-bold text-primary">necessity for survival</span>.
        </p>
      </div>

      {/* Hobson positioning */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 p-6 border border-primary/20">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-start gap-4">
          <Rocket className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <p className="text-foreground font-medium leading-relaxed">
            Hobson will establish the <span className="text-primary font-bold">AI operating layer</span> for the 
            Real Estate sector before the market consolidates around a new standard.
          </p>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Mission Statement</h4>
            <p className="text-sm text-teal-600 dark:text-teal-400 font-medium">Innovation without disruption</p>
          </div>
        </div>
        <div className="ml-13 p-5 rounded-xl bg-gradient-to-br from-teal-50/80 to-teal-100/50 dark:from-teal-950/30 dark:to-teal-900/20 border border-teal-200 dark:border-teal-800/30">
          <p className="text-foreground leading-relaxed">
            To become the intelligence layer real estate runs on—ensuring every operational decision is based on 
            instant, auditable insight rather than manual search, institutional memory, or guesswork.
          </p>
        </div>
      </div>

      {/* Positioning Statement */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Positioning Statement</h4>
            <p className="text-sm text-primary font-medium">Disruption without displacement</p>
          </div>
        </div>
        <div className="ml-13 p-5 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
          <p className="text-foreground leading-relaxed">
            Hobson replaces manual document work in real estate with AI-driven reasoning, delivering instant, 
            traceable answers that reduce staffing costs, prevent costly errors, and accelerate operational 
            decision-making. It embeds directly into existing workflows, becoming the intelligence infrastructure 
            modern real estate operations require to compete.
          </p>
        </div>
      </div>

      {/* Conclusion */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-500/10 p-6 border border-amber-200/50 dark:border-amber-800/30">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <p className="text-foreground leading-relaxed">
            The following go-to-market strategy is therefore not incremental; it is designed for 
            <span className="font-bold text-amber-700 dark:text-amber-400"> rapid validation</span>, 
            <span className="font-bold text-amber-700 dark:text-amber-400"> accelerated adoption</span>, and 
            <span className="font-bold text-amber-700 dark:text-amber-400"> decisive category capture</span>—creating 
            a narrow, highly investable window in which early capital enables Hobson to define the industry's future operating model.
          </p>
        </div>
      </div>
    </div>
  );
};
