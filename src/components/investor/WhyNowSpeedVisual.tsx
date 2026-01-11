import React from 'react';
import { Clock, Zap, DollarSign, FileText, Target, Shield, Workflow, Building2, AlertTriangle } from 'lucide-react';

export const WhyNowSpeedVisual = () => {
  const convergingForces = [
    {
      icon: Zap,
      title: "Technology is finally viable",
      description: "AI can now deliver production-grade accuracy, auditability, and multi-document reasoning at scale — capabilities that did not exist even three years ago."
    },
    {
      icon: DollarSign,
      title: "Economics leave no slack",
      description: "Labour inflation, margin compression, and headcount constraints make manual document work structurally unaffordable."
    },
    {
      icon: FileText,
      title: "Regulation is locking complexity in",
      description: "Audit trails, ESG reporting, and risk obligations permanently increase document volume and scrutiny."
    }
  ];

  const hobsonAdvantages = [
    { icon: Building2, text: "Purpose-built AI for real estate complexity" },
    { icon: Shield, text: "Auditable, source-linked reasoning" },
    { icon: Workflow, text: "Zero workflow disruption" },
    { icon: Target, text: "Designed for institutional trust" }
  ];

  return (
    <div className="w-full space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="p-4 lg:p-5 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100/80 dark:from-slate-900/50 dark:to-slate-800/30 border border-slate-200/50 dark:border-slate-700/30">
        <h3 className="text-sm lg:text-base font-semibold text-primary text-left">
          The Real Estate industry is now choosing its intelligence layer
        </h3>
      </div>

      {/* Three Converging Forces */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 lg:p-5">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-primary" />
          <h4 className="text-sm lg:text-base font-semibold text-foreground">Three forces are converging</h4>
        </div>
        <div className="grid gap-4">
          {convergingForces.map((force, index) => (
            <div key={index} className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <force.icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm lg:text-base font-semibold text-foreground">{force.title}</p>
                <p className="text-xs lg:text-sm text-muted-foreground">{force.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Reset */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 lg:p-5">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <h4 className="text-sm lg:text-base font-semibold text-foreground">When forces converge, markets reset</h4>
        </div>
        <div className="space-y-2 text-xs lg:text-sm text-muted-foreground">
          <p>The first trusted system becomes embedded. Standards form quickly. Switching costs rise. Late entrants struggle to displace incumbents.</p>
          <p className="font-semibold text-foreground">This creates a narrow 12–36-month window to define the default system of record for AI in Real Estate.</p>
          <p className="text-primary font-bold">Hobson is positioned to win that window.</p>
        </div>
      </div>

      {/* Hobson's Advantage */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 lg:p-5">
        <h4 className="text-sm lg:text-base font-semibold text-foreground mb-4">Hobson's Advantage</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {hobsonAdvantages.map((advantage, index) => (
            <div key={index} className="flex items-center gap-2">
              <advantage.icon className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-xs lg:text-sm text-muted-foreground">{advantage.text}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs lg:text-sm text-primary font-semibold">
          Once adopted, Hobson becomes operational infrastructure, not a tool.
        </p>
      </div>

      {/* Closing Statement */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/30 rounded-lg p-4 lg:p-5 text-center">
        <p className="text-sm lg:text-base font-bold text-foreground mb-2">This is a category-creation moment.</p>
        <p className="text-xs lg:text-sm text-muted-foreground mb-2">The market is significant, and the pressure is real. The window is closing.</p>
        <p className="text-sm lg:text-base font-bold text-primary">Hobson is building the system of record for AI-driven real estate operations.</p>
      </div>
    </div>
  );
};
