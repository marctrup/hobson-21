import React from 'react';
import { Target, Users, Rocket, TrendingUp, Building2, Zap } from 'lucide-react';

export const CommercialisationStrategyVisual = () => {
  const phases = [
    {
      phase: "Phase 1",
      title: "Foundation",
      timeline: "Q1-Q2 2025",
      icon: Target,
      color: "blue",
      items: [
        "Complete pilot programme with early adopters",
        "Validate product-market fit across segments",
        "Refine pricing and packaging based on feedback",
        "Build case studies and testimonials"
      ]
    },
    {
      phase: "Phase 2", 
      title: "Launch",
      timeline: "Q3-Q4 2025",
      icon: Rocket,
      color: "emerald",
      items: [
        "Public launch with refined positioning",
        "Activate inbound marketing engine",
        "Scale sales team and processes",
        "Establish partner channel foundations"
      ]
    },
    {
      phase: "Phase 3",
      title: "Scale",
      timeline: "2026+",
      icon: TrendingUp,
      color: "purple",
      items: [
        "Expand into enterprise segment",
        "Launch strategic partnerships",
        "International market entry",
        "Platform ecosystem development"
      ]
    }
  ];

  const gtmChannels = [
    { icon: Users, title: "Direct Sales", desc: "Founder-led sales transitioning to dedicated team" },
    { icon: Building2, title: "Partnerships", desc: "Property management software integrations" },
    { icon: Zap, title: "Product-Led", desc: "Self-serve onboarding with usage-based growth" }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string; light: string }> = {
      blue: { bg: "bg-blue-100 dark:bg-blue-950/50", border: "border-blue-200 dark:border-blue-800/50", text: "text-blue-600 dark:text-blue-400", light: "bg-blue-50 dark:bg-blue-950/30" },
      emerald: { bg: "bg-emerald-100 dark:bg-emerald-950/50", border: "border-emerald-200 dark:border-emerald-800/50", text: "text-emerald-600 dark:text-emerald-400", light: "bg-emerald-50 dark:bg-emerald-950/30" },
      purple: { bg: "bg-purple-100 dark:bg-purple-950/50", border: "border-purple-200 dark:border-purple-800/50", text: "text-purple-600 dark:text-purple-400", light: "bg-purple-50 dark:bg-purple-950/30" }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-amber-500/5 p-6 border border-amber-200/50 dark:border-amber-800/30">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <h3 className="text-xl font-bold text-foreground mb-2">Go-to-Market Strategy</h3>
          <p className="text-muted-foreground">
            A phased approach to market entry, combining founder-led sales with scalable growth channels.
          </p>
        </div>
      </div>

      {/* Phases Timeline */}
      <div className="space-y-4">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Commercialisation Roadmap
        </h4>
        
        <div className="grid md:grid-cols-3 gap-4">
          {phases.map((phase, idx) => {
            const colors = getColorClasses(phase.color);
            return (
              <div 
                key={idx} 
                className={`rounded-xl border ${colors.border} ${colors.light} p-5 transition-all hover:shadow-md`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center`}>
                    <phase.icon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <div>
                    <span className={`text-xs font-medium ${colors.text}`}>{phase.phase}</span>
                    <h5 className="font-semibold text-foreground">{phase.title}</h5>
                  </div>
                </div>
                
                <div className={`text-xs font-medium ${colors.text} mb-3 px-2 py-1 rounded-full ${colors.bg} inline-block`}>
                  {phase.timeline}
                </div>
                
                <ul className="space-y-2">
                  {phase.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <div className={`w-1.5 h-1.5 rounded-full ${colors.text.replace('text-', 'bg-')} mt-1.5 flex-shrink-0`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* GTM Channels */}
      <div className="space-y-4">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <Rocket className="w-5 h-5 text-primary" />
          Go-to-Market Channels
        </h4>
        
        <div className="grid md:grid-cols-3 gap-4">
          {gtmChannels.map((channel, idx) => (
            <div 
              key={idx}
              className="rounded-xl bg-card border border-border/50 p-5 hover:border-primary/30 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <channel.icon className="w-5 h-5 text-primary" />
              </div>
              <h5 className="font-semibold text-foreground mb-1">{channel.title}</h5>
              <p className="text-sm text-muted-foreground">{channel.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
