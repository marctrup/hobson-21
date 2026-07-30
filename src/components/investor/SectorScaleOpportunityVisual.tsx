import React from 'react';
import { Building2, FileText, TrendingUp, Scale, Briefcase, Shield, Leaf, FolderOpen, ArrowUpRight } from 'lucide-react';

export const SectorScaleOpportunityVisual = () => {
  const activities = [
    { label: 'Operations', icon: Briefcase },
    { label: 'Planning Applications', icon: FileText },
    { label: 'Funding & Refinancing', icon: TrendingUp },
    { label: 'Acquisitions & Disposals', icon: ArrowUpRight },
    { label: 'Leasing', icon: FolderOpen },
    { label: 'Compliance', icon: Shield },
    { label: 'ESG Reporting', icon: Leaf },
    { label: 'Asset Management', icon: Building2 },
  ];

  return (
    <div className="space-y-6">
      {/* Strapline */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-paper to-bone-wash/80 dark:from-ink/50 dark:to-ink/30 border border-bone/50 dark:border-charcoal/30">
        <p className="text-base lg:text-lg font-semibold text-charcoal dark:text-ink-muted leading-relaxed">
          Real estate is one of the largest and most document-intensive industries in the UK and globally.
        </p>
      </div>

      {/* Document-Governed Activities */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-paper to-bone-wash/50 dark:from-ink/30 dark:to-ink/20 border border-bone/50 dark:border-charcoal/30 p-5">
        <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-ink-faint to-charcoal opacity-10 rounded-full blur-2xl" />
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-bone-wash dark:bg-ink/50 flex items-center justify-center">
              <FileText className="w-5 h-5 text-charcoal" />
            </div>
            <h4 className="font-semibold text-foreground">Document-Governed Industry</h4>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            Every core activity is governed by complex, long-lived documents:
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {activities.map((activity, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-white/60 dark:bg-white/5 rounded-lg px-3 py-2">
                <activity.icon className="w-4 h-4 text-charcoal flex-shrink-0" />
                <span className="text-xs text-foreground">{activity.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compounding Complexity */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-paper to-bone-wash/50 dark:from-ink/30 dark:to-ink/20 border border-bone/50 dark:border-charcoal/30 p-5">
        <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-ink-faint to-charcoal opacity-10 rounded-full blur-2xl" />
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-bone-wash dark:bg-ink/50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-charcoal" />
            </div>
            <h4 className="font-semibold text-foreground">Compounding Complexity</h4>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">
            Unlike many sectors, this document burden does not shrink with digitisation. It compounds over time:
          </p>
          
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="bg-white/60 dark:bg-white/5 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-charcoal mb-1">Portfolios</div>
              <div className="text-xs text-muted-foreground">Grow in size and complexity</div>
            </div>
            <div className="bg-white/60 dark:bg-white/5 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-charcoal mb-1">Regulation</div>
              <div className="text-xs text-muted-foreground">Increases annually</div>
            </div>
            <div className="bg-white/60 dark:bg-white/5 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-charcoal mb-1">Reporting</div>
              <div className="text-xs text-muted-foreground">Standards tighten continuously</div>
            </div>
          </div>
        </div>
      </div>

      {/* Structural Demand */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Scale className="w-5 h-5 text-primary" />
          </div>
          <h4 className="font-semibold text-foreground">Structural Demand</h4>
        </div>
        
        <p className="text-sm text-foreground">
          Real Estate represents <span className="font-semibold text-primary">structurally persistent demand</span> for document intelligence — not a cyclical or discretionary software market.
        </p>
      </div>
    </div>
  );
};

export default SectorScaleOpportunityVisual;
