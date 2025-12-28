import React from 'react';
import { Globe, Landmark, TrendingUp, Cpu, Scale, Leaf } from 'lucide-react';

export const PESTLEAnalysisVisual = () => {
  const pestleFactors = [
    {
      letter: "P",
      title: "Political",
      icon: Landmark,
      color: "from-blue-500/10 to-blue-600/10",
      borderColor: "border-blue-200/50 dark:border-blue-800/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      bgCircle: "bg-blue-100 dark:bg-blue-900/30",
      items: [
        "UK housing policy reforms driving digital transformation",
        "Government push for PropTech adoption in social housing",
        "Post-Brexit regulatory independence enabling innovation",
        "Building Safety Act compliance requirements"
      ]
    },
    {
      letter: "E",
      title: "Economic",
      icon: TrendingUp,
      color: "from-emerald-500/10 to-emerald-600/10",
      borderColor: "border-emerald-200/50 dark:border-emerald-800/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      bgCircle: "bg-emerald-100 dark:bg-emerald-900/30",
      items: [
        "Cost pressure driving efficiency adoption",
        "Rising operational costs favour automation",
        "Strong PropTech investment climate",
        "SME property sector seeking affordable solutions"
      ]
    },
    {
      letter: "S",
      title: "Social",
      icon: Globe,
      color: "from-purple-500/10 to-purple-600/10",
      borderColor: "border-purple-200/50 dark:border-purple-800/30",
      iconColor: "text-purple-600 dark:text-purple-400",
      bgCircle: "bg-purple-100 dark:bg-purple-900/30",
      items: [
        "Workforce expecting modern digital tools",
        "Tenant expectations for faster responses",
        "Growing acceptance of AI in professional services",
        "Remote working driving cloud adoption"
      ]
    },
    {
      letter: "T",
      title: "Technological",
      icon: Cpu,
      color: "from-amber-500/10 to-amber-600/10",
      borderColor: "border-amber-200/50 dark:border-amber-800/30",
      iconColor: "text-amber-600 dark:text-amber-400",
      bgCircle: "bg-amber-100 dark:bg-amber-900/30",
      items: [
        "LLM/AI maturity enabling document intelligence",
        "Cloud infrastructure reducing barriers to entry",
        "API ecosystem enabling rapid integrations",
        "OCR and NLP advances improving accuracy"
      ]
    },
    {
      letter: "L",
      title: "Legal",
      icon: Scale,
      color: "from-rose-500/10 to-rose-600/10",
      borderColor: "border-rose-200/50 dark:border-rose-800/30",
      iconColor: "text-rose-600 dark:text-rose-400",
      bgCircle: "bg-rose-100 dark:bg-rose-900/30",
      items: [
        "GDPR compliance requirements for data handling",
        "Leasehold reform creating document complexity",
        "Audit trail requirements favouring digital systems",
        "Right to Rent verification obligations"
      ]
    },
    {
      letter: "E",
      title: "Environmental",
      icon: Leaf,
      color: "from-teal-500/10 to-teal-600/10",
      borderColor: "border-teal-200/50 dark:border-teal-800/30",
      iconColor: "text-teal-600 dark:text-teal-400",
      bgCircle: "bg-teal-100 dark:bg-teal-900/30",
      items: [
        "EPC compliance driving documentation needs",
        "Sustainability reporting requirements emerging",
        "Paperless operations reducing carbon footprint",
        "Green building certifications requiring tracking"
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
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">PESTLE Analysis</h3>
            <p className="text-muted-foreground mt-1">Macro-environmental factors shaping the UK PropTech landscape</p>
          </div>
        </div>
      </div>

      {/* PESTLE Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pestleFactors.map((factor, idx) => (
          <div 
            key={idx}
            className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${factor.color} p-5 border ${factor.borderColor}`}
          >
            <div className="flex items-start gap-3 mb-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${factor.bgCircle} ${factor.iconColor}`}>
                <factor.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${factor.iconColor}`}>{factor.letter}</span>
                  <span className="text-sm text-muted-foreground">—</span>
                  <h4 className="font-semibold text-foreground">{factor.title}</h4>
                </div>
              </div>
            </div>
            <ul className="space-y-2">
              {factor.items.map((item, itemIdx) => (
                <li key={itemIdx} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className={`w-1.5 h-1.5 rounded-full ${factor.iconColor.replace('text-', 'bg-')} mt-1.5 flex-shrink-0`} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-500/10 via-slate-500/5 to-slate-500/10 p-6 border border-slate-200/50 dark:border-slate-700/30">
        <p className="text-foreground">
          <span className="font-semibold">Key Insight:</span> The convergence of regulatory pressure, technological maturity, and economic drivers creates an <span className="text-primary font-bold">optimal window</span> for AI-powered document intelligence in UK property management.
        </p>
      </div>
    </div>
  );
};
