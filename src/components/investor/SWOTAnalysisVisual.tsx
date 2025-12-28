import React from 'react';
import { TrendingUp, TrendingDown, Zap, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

export const SWOTAnalysisVisual = () => {
  const swotData = [
    {
      title: "Strengths",
      icon: CheckCircle2,
      color: "from-emerald-500/10 to-emerald-600/10",
      borderColor: "border-emerald-200/50 dark:border-emerald-800/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      bgCircle: "bg-emerald-100 dark:bg-emerald-900/30",
      items: [
        "Deep Real Estate domain expertise (30+ years)",
        "Proven software track record (built, scaled, exited)",
        "AI/ML technical capabilities in-house",
        "Document-first, referenced-answer architecture",
        "Zero-integration, low-friction deployment",
        "Clear brand positioning and messaging",
        "Direct access to target customers",
        "Strong founder-market fit"
      ]
    },
    {
      title: "Weaknesses",
      icon: XCircle,
      color: "from-rose-500/10 to-rose-600/10",
      borderColor: "border-rose-200/50 dark:border-rose-800/30",
      iconColor: "text-rose-600 dark:text-rose-400",
      bgCircle: "bg-rose-100 dark:bg-rose-900/30",
      items: [
        "Limited brand visibility and market awareness",
        "Early-stage product still maturing",
        "Small team with resource constraints",
        "Customer support infrastructure emerging",
        "Narrow product focus (retrieval/extraction)",
        "Dependency on AI provider infrastructure",
        "Limited marketing automation",
        "No formal security certifications yet"
      ]
    },
    {
      title: "Opportunities",
      icon: TrendingUp,
      color: "from-blue-500/10 to-blue-600/10",
      borderColor: "border-blue-200/50 dark:border-blue-800/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      bgCircle: "bg-blue-100 dark:bg-blue-900/30",
      items: [
        "Growing regulatory burden driving demand",
        "Underserved SMB property market segment",
        "Legacy PropTech slow to adopt AI",
        "Rising trust in AI for document workflows",
        "Cost pressures favouring automation",
        "Expansion into adjacent property sectors",
        "Partnership opportunities with platforms",
        "International market expansion potential"
      ]
    },
    {
      title: "Threats",
      icon: AlertTriangle,
      color: "from-amber-500/10 to-amber-600/10",
      borderColor: "border-amber-200/50 dark:border-amber-800/30",
      iconColor: "text-amber-600 dark:text-amber-400",
      bgCircle: "bg-amber-100 dark:bg-amber-900/30",
      items: [
        "Large PropTech platforms adding AI features",
        "Well-funded AI document startups entering market",
        "AI hallucination risks damaging trust",
        "Economic downturn reducing tech spend",
        "Rapid AI technology changes",
        "Data privacy regulation tightening",
        "Customer resistance to AI adoption",
        "Competitor price undercutting"
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 p-6 border border-primary/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">SWOT Analysis</h3>
            <p className="text-muted-foreground mt-1">Strategic assessment of Hobson's position in the market</p>
          </div>
        </div>
      </div>

      {/* SWOT Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {swotData.map((quadrant, idx) => (
          <div 
            key={idx}
            className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${quadrant.color} p-5 border ${quadrant.borderColor}`}
          >
            <div className="flex items-start gap-3 mb-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${quadrant.bgCircle} ${quadrant.iconColor} flex-shrink-0`}>
                <quadrant.icon className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-foreground pt-2">{quadrant.title}</h4>
            </div>
            
            <ul className="space-y-1.5">
              {quadrant.items.map((item, itemIdx) => (
                <li key={itemIdx} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className={`w-1.5 h-1.5 rounded-full ${quadrant.iconColor.replace('text-', 'bg-')} mt-1.5 flex-shrink-0`} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Strategic Summary */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-500/10 via-slate-500/5 to-slate-500/10 p-6 border border-slate-200/50 dark:border-slate-700/30">
        <p className="text-foreground">
          <span className="font-semibold">Strategic Insight:</span> Hobson's core strengths in domain expertise, technical capability, and market positioning align well with significant market opportunities. The key strategic priorities are to <span className="text-primary font-bold">increase visibility</span>, <span className="text-primary font-bold">mature the product</span>, and <span className="text-primary font-bold">build scalable infrastructure</span> before larger competitors can capture the AI document intelligence space.
        </p>
      </div>
    </div>
  );
};
