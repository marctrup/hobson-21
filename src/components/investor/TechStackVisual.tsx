import React from 'react';
import { Brain, Cloud, Zap, Database, Search, Mail, Shield } from 'lucide-react';

export const TechStackVisual = () => {
  const categories = [
    {
      title: 'AI & Intelligence',
      icon: Brain,
      color: 'purple',
      items: [
        { name: 'OpenAI', desc: 'Powers natural language understanding and AI-driven responses' },
      ],
    },
    {
      title: 'Cloud Infrastructure',
      icon: Cloud,
      color: 'blue',
      items: [
        { name: 'OVH Cloud', desc: 'Stores your uploaded files and documents (secure UK/EU-based cloud storage)' },
        { name: 'Vercel', desc: 'Runs the Hobson web app (fast, stable interface)' },
      ],
    },
    {
      title: 'Data & Storage',
      icon: Database,
      color: 'emerald',
      items: [
        { name: 'MongoDB', desc: 'Handles structured data such as units, portfolios, users, and document metadata' },
        { name: 'Neo4j', desc: 'Used for knowledge-graph structures to understand relationships' },
        { name: 'Pinecone', desc: 'Stores vector embeddings for quick document search' },
      ],
    },
    {
      title: 'Communication & Admin',
      icon: Mail,
      color: 'amber',
      items: [
        { name: 'Google Workspace', desc: 'Supports email delivery, team communication, and secure internal admin' },
      ],
    },
  ];

  const colorClasses: Record<string, { bg: string; iconBg: string; icon: string; border: string; itemBg: string }> = {
    purple: {
      bg: 'from-paper to-bone-wash/50 dark:from-ink/30 dark:to-ink/20',
      iconBg: 'bg-bone-wash dark:bg-ink/50',
      icon: 'text-charcoal',
      border: 'border-bone/50 dark:border-charcoal/30',
      itemBg: 'bg-paper/50 dark:bg-ink/30',
    },
    blue: {
      bg: 'from-paper to-bone-wash/50 dark:from-ink/30 dark:to-ink/20',
      iconBg: 'bg-bone-wash dark:bg-ink/50',
      icon: 'text-charcoal',
      border: 'border-bone/50 dark:border-charcoal/30',
      itemBg: 'bg-paper/50 dark:bg-ink/30',
    },
    emerald: {
      bg: 'from-success-bg to-success-bg/50 dark:from-success-solid/30 dark:to-success-solid/20',
      iconBg: 'bg-success-bg dark:bg-success-solid/50',
      icon: 'text-success',
      border: 'border-success-border/50 dark:border-success/30',
      itemBg: 'bg-success-bg/50 dark:bg-success-solid/30',
    },
    amber: {
      bg: 'from-warning-bg to-warning-bg/50 dark:from-warning-solid/30 dark:to-warning-solid/20',
      iconBg: 'bg-warning-bg dark:bg-warning-solid/50',
      icon: 'text-warning',
      border: 'border-warning-border/50 dark:border-warning/30',
      itemBg: 'bg-warning-bg/50 dark:bg-warning-solid/30',
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-6 border border-primary/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Enterprise-Grade Infrastructure</span>
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">Tech Stack</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Hobson runs on trusted, industry-standard platforms designed for security, performance, and scalability.
          </p>
        </div>
      </div>

      {/* Category Cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {categories.map((category, idx) => {
          const colors = colorClasses[category.color];
          return (
            <div
              key={idx}
              className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${colors.bg} border ${colors.border} p-5`}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl ${colors.iconBg} flex items-center justify-center`}>
                  <category.icon className={`w-5 h-5 ${colors.icon}`} />
                </div>
                <h4 className="font-semibold text-foreground">{category.title}</h4>
              </div>

              {/* Items */}
              <div className="space-y-2">
                {category.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className={`p-3 rounded-lg ${colors.itemBg} border border-white/20 dark:border-white/10`}
                  >
                    <div className="font-medium text-foreground text-sm">{item.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer badges */}
      <div className="flex flex-wrap justify-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-muted/50 text-foreground border border-border">
          <Shield className="w-3.5 h-3.5 text-primary" />
          UK/EU Data Residency
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-muted/50 text-foreground border border-border">
          <Zap className="w-3.5 h-3.5 text-primary" />
          High Availability
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-muted/50 text-foreground border border-border">
          <Search className="w-3.5 h-3.5 text-primary" />
          Vector Search
        </span>
      </div>
    </div>
  );
};
