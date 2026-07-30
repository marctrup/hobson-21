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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-ink-faint/10 via-ink-faint/5 to-ink-faint/10 p-6 border border-bone/50 dark:border-charcoal/30">
        <div className="absolute top-0 right-0 w-32 h-32 bg-ink-faint/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <h3 className="text-xl font-bold text-foreground">The Real Estate industry has entered a structural inflexion point.</h3>
        </div>
      </div>

      {/* Pressures */}
      <div className="grid sm:grid-cols-2 gap-3">
        {pressures.map((pressure, idx) => (
          <div key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-danger-bg/50 to-danger-bg/30 dark:from-danger-solid/20 dark:to-danger-solid/10 border border-danger-border/50 dark:border-danger/30">
            <AlertTriangle className="w-5 h-5 text-danger dark:text-danger flex-shrink-0" />
            <span className="text-foreground font-medium">{pressure}</span>
          </div>
        ))}
      </div>

      {/* Context paragraph */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-paper to-bone-wash dark:from-ink/50 dark:to-ink/30 border border-bone dark:border-charcoal/50">
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
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-ink-faint/10 text-charcoal dark:text-ink-muted">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Mission Statement</h4>
            <p className="text-sm text-charcoal dark:text-ink-muted font-medium">Innovation without disruption</p>
          </div>
        </div>
        <div className="ml-13 p-5 rounded-xl bg-gradient-to-br from-paper/80 to-bone-wash/50 dark:from-ink/30 dark:to-ink/20 border border-bone dark:border-charcoal/30">
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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-warning/10 via-warning/5 to-warning/10 p-6 border border-warning-border/50 dark:border-warning/30">
        <div className="absolute top-0 right-0 w-32 h-32 bg-warning/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <p className="text-foreground leading-relaxed">
            The following go-to-market strategy is therefore not incremental; it is designed for 
            <span className="font-bold text-warning dark:text-warning"> rapid validation</span>, 
            <span className="font-bold text-warning dark:text-warning"> accelerated adoption</span>, and 
            <span className="font-bold text-warning dark:text-warning"> decisive category capture</span>—creating 
            a narrow, highly investable window in which early capital enables Hobson to define the industry's future operating model.
          </p>
        </div>
      </div>
    </div>
  );
};
