import React from 'react';
import { Target, Zap, TrendingUp, Brain, Clock, Trophy, CheckCircle2, Sparkles, Globe, BarChart3 } from 'lucide-react';

export const HobsonOpportunityVisual = () => {
  const sections = [
    {
      icon: Target,
      title: 'A Specialised AI Assistant Built for Real Estate',
      color: 'blue',
      items: [
        'Designed specifically for real estate workflows, documents, and terminology',
        'Handles complex, high-volume admin with trusted accuracy',
        'No generic tooling — purpose-built for the sector\'s pain points',
      ],
    },
    {
      icon: Zap,
      title: 'Delivers Immediate, Measurable Value',
      color: 'emerald',
      items: [
        'Automates document understanding, insight extraction, and decision support',
        'Zero onboarding → value from day one',
        'Low friction + low pricing → easy adoption at scale',
        'Proven 98% model accuracy (validated with real-world partners)',
      ],
    },
    {
      icon: BarChart3,
      title: "Solving the Industry's Biggest Bottleneck",
      color: 'amber',
      items: [
        'Real estate is admin-heavy, fragmented, and cost-sensitive',
        '20% efficiency gain = £6,000 annual saving per role',
        'Aligns directly with the global trend of AI-driven operational efficiency',
      ],
    },
    {
      icon: Brain,
      title: 'Learns and Improves Over Time',
      color: 'purple',
      items: [
        'Starts as automation',
        'Evolves into a proactive assistant',
        'Becomes more accurate, personalised, and valuable with each interaction',
      ],
    },
    {
      icon: Clock,
      title: 'Perfect Timing',
      color: 'rose',
      items: [
        'UK TAM shows a £1.41B attainable early market',
        'Global AI real estate space is growing 35–36% annually',
        'AI adoption is accelerating and ROI is clear',
      ],
    },
  ];

  const colorClasses: Record<string, { bg: string; iconBg: string; icon: string; border: string }> = {
    blue: {
      bg: 'from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20',
      iconBg: 'bg-blue-100 dark:bg-blue-950/50',
      icon: 'text-blue-600',
      border: 'border-blue-200/50 dark:border-blue-800/30',
    },
    emerald: {
      bg: 'from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20',
      iconBg: 'bg-emerald-100 dark:bg-emerald-950/50',
      icon: 'text-emerald-600',
      border: 'border-emerald-200/50 dark:border-emerald-800/30',
    },
    amber: {
      bg: 'from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20',
      iconBg: 'bg-amber-100 dark:bg-amber-950/50',
      icon: 'text-amber-600',
      border: 'border-amber-200/50 dark:border-amber-800/30',
    },
    purple: {
      bg: 'from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20',
      iconBg: 'bg-purple-100 dark:bg-purple-950/50',
      icon: 'text-purple-600',
      border: 'border-purple-200/50 dark:border-purple-800/30',
    },
    rose: {
      bg: 'from-rose-50 to-rose-100/50 dark:from-rose-950/30 dark:to-rose-900/20',
      iconBg: 'bg-rose-100 dark:bg-rose-950/50',
      icon: 'text-rose-600',
      border: 'border-rose-200/50 dark:border-rose-800/30',
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-6 border border-primary/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
            <Trophy className="w-4 h-4" />
            <span>Hobson's Opportunity</span>
          </div>
          <h3 className="text-xl font-bold text-foreground">Why Hobson Wins This Market</h3>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {sections.map((section, idx) => {
          const colors = colorClasses[section.color];
          return (
            <div
              key={idx}
              className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${colors.bg} border ${colors.border} p-5`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl ${colors.iconBg} flex items-center justify-center flex-shrink-0`}>
                  <section.icon className={`w-5 h-5 ${colors.icon}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground mb-3">{section.title}</h4>
                  <div className="space-y-2">
                    {section.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex items-start gap-2">
                        <CheckCircle2 className={`w-4 h-4 ${colors.icon} mt-0.5 flex-shrink-0`} />
                        <span className="text-sm text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* The Result */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 via-primary/15 to-primary/10 border border-primary/30 p-6">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-primary" />
            <h4 className="font-bold text-foreground">The Result</h4>
          </div>
          <p className="text-foreground leading-relaxed">
            Hobson becomes the <span className="font-semibold text-primary">go-to specialised AI assistant</span> in a sector 
            that urgently needs automation, cost savings, and operational clarity.
          </p>
        </div>
      </div>
    </div>
  );
};
