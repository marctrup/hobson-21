import React from 'react';
import { Zap, TrendingUp, Scale, Target, CheckCircle2 } from 'lucide-react';

export const HEUPricingVisual = () => {
  const monetises = [
    "operator dependency",
    "portfolio scale",
    "regulatory complexity",
    "decision intensity",
  ];

  const plans = [
    { plan: "Free", price: "£0", heus: "18", intent: "Frictionless market entry" },
    { plan: "Essential", price: "£19.50", heus: "275", intent: "Hook small operators" },
    { plan: "Essential Plus", price: "£49.75", heus: "700", intent: "Convert growing teams" },
    { plan: "Enterprise", price: "£148.50", heus: "2,000", intent: "Lock in serious operators" },
    { plan: "HEU Top-Up", price: "£15", heus: "150", intent: "Expand ARPU naturally" },
  ];

  return (
    <div className="space-y-8">
      {/* Header - The HEU Model */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-6 border border-primary/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <Zap className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold text-foreground">The HEU Model</h3>
          </div>
          <p className="text-foreground leading-relaxed">
            Hobson's pricing model is a <span className="font-semibold text-primary">usage-based infrastructure monetisation model</span>.
          </p>
        </div>
      </div>

      {/* Section 1: What HEUs Measure */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 font-bold text-sm">1</div>
          <h4 className="font-semibold text-foreground">Hobson Energy Units (HEUs) measure AI effort:</h4>
        </div>
        
        <div className="ml-11 p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
          <p className="text-foreground leading-relaxed">
            Every document read, lease abstracted, compliance workflow executed, risk model run, or report built consumes HEUs.
          </p>
        </div>
      </div>

      {/* Section 2: What Hobson Monetises */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-bold text-sm">2</div>
          <h4 className="font-semibold text-foreground">This means Hobson monetises:</h4>
        </div>
        
        <div className="ml-11 grid sm:grid-cols-2 gap-3">
          {monetises.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span className="text-foreground font-medium">{item}</span>
            </div>
          ))}
        </div>
        
        <div className="ml-11 p-3 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
          <p className="text-muted-foreground text-sm">
            <span className="font-semibold text-foreground">not</span> headcount or asset count
          </p>
        </div>
      </div>

      {/* Key Insight */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800/30 p-5">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-foreground leading-relaxed">
            Traditional property software caps revenue. <span className="font-semibold text-primary">Hobson's model scales automatically with operational stress.</span> The more complex the operator's world becomes, the more valuable and profitable Hobson becomes.
          </p>
        </div>
      </div>

      {/* Section 3: Pricing Table */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Scale className="w-5 h-5 text-primary" />
          <h4 className="font-semibold text-foreground">Pricing That Forces Adoption</h4>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-primary/10">
                <th className="text-left p-3 text-sm font-semibold text-foreground border border-border/50 rounded-tl-lg">Plan</th>
                <th className="text-left p-3 text-sm font-semibold text-foreground border border-border/50">Monthly Price</th>
                <th className="text-left p-3 text-sm font-semibold text-foreground border border-border/50">HEUs</th>
                <th className="text-left p-3 text-sm font-semibold text-foreground border border-border/50 rounded-tr-lg">Strategic Intent</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-card' : 'bg-muted/30'}>
                  <td className="p-3 text-sm font-medium text-foreground border border-border/50">{row.plan}</td>
                  <td className="p-3 text-sm text-foreground border border-border/50">{row.price}</td>
                  <td className="p-3 text-sm font-semibold text-primary border border-border/50">{row.heus}</td>
                  <td className="p-3 text-sm text-muted-foreground border border-border/50">{row.intent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer - No Fees */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10 p-5 border border-green-200 dark:border-green-800/30">
        <div className="flex items-center justify-center gap-2">
          <Target className="w-5 h-5 text-green-600" />
          <p className="text-foreground font-bold text-lg">
            No per-user fees. No per-asset fees. Unlimited scale.
          </p>
        </div>
      </div>
    </div>
  );
};
