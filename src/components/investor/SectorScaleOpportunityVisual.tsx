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
      {/* Header */}
      <div className="text-center pb-2">
        <h3 className="text-lg font-bold text-foreground mb-2">Sector Scale & Opportunity</h3>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          Real estate is one of the largest and most document-intensive industries in the UK and globally.
        </p>
      </div>

      {/* Document-Governed Activities */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border border-blue-200/50 dark:border-blue-800/30 p-5">
        <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 opacity-10 rounded-full blur-2xl" />
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <h4 className="font-semibold text-foreground">Document-Governed Industry</h4>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            Every core activity is governed by complex, long-lived documents:
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {activities.map((activity, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-white/60 dark:bg-white/5 rounded-lg px-3 py-2">
                <activity.icon className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="text-xs text-foreground">{activity.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compounding Complexity */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 border border-purple-200/50 dark:border-purple-800/30 p-5">
        <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 opacity-10 rounded-full blur-2xl" />
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <h4 className="font-semibold text-foreground">Compounding Complexity</h4>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">
            Unlike many sectors, this document burden does not shrink with digitisation. It compounds over time:
          </p>
          
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="bg-white/60 dark:bg-white/5 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-purple-600 mb-1">Portfolios</div>
              <div className="text-xs text-muted-foreground">Grow in size and complexity</div>
            </div>
            <div className="bg-white/60 dark:bg-white/5 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-purple-600 mb-1">Regulation</div>
              <div className="text-xs text-muted-foreground">Increases annually</div>
            </div>
            <div className="bg-white/60 dark:bg-white/5 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-purple-600 mb-1">Reporting</div>
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
