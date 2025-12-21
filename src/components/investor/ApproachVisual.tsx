import React from 'react';
import { FileText, Shield, Coins, CheckCircle2 } from 'lucide-react';

export const ApproachVisual = () => {
  const productItems = [
    'Operates inside current systems',
    'Zero onboarding or behavioural change',
    'Unifies reasoning across documents, emails, and platforms',
    'Transparent citations and verifiable outputs'
  ];

  const brandItems = [
    'Predictable behaviour',
    'Transparent sources',
    'Clear expectations',
    'Fast feedback loops'
  ];

  const businessItems = [
    'Usage-based pricing aligned to value delivered (HEU)',
    'No licence, per-user, or per-asset fees',
    'Low base cost enabling broad adoption',
    'Full transparency into AI actions'
  ];

  return (
    <div className="space-y-8">
      {/* 1. Product */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 font-bold text-sm">1</div>
          <div>
            <h4 className="font-semibold text-foreground">Product</h4>
            <p className="text-sm text-muted-foreground">Hobson has been built to replace document-driven human reasoning without disrupting existing workflows</p>
          </div>
        </div>
        
        <div className="space-y-2 pl-11">
          {productItems.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span className="text-foreground">{item}</span>
            </div>
          ))}
        </div>
        
        <div className="ml-11 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
          <p className="text-sm text-foreground">
            Trust is earned first. Expansion into proactive guidance and automation will follow.
          </p>
        </div>
      </div>

      {/* 2. Brand */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 font-bold text-sm">2</div>
          <div>
            <h4 className="font-semibold text-foreground">Brand</h4>
            <p className="text-sm text-muted-foreground">Hobson has been designed for high-stakes operational environments where accuracy, traceability, and defensibility are non-negotiable</p>
          </div>
        </div>
        
        <div className="space-y-2 pl-11">
          {brandItems.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
              <span className="text-foreground">{item}</span>
            </div>
          ))}
        </div>
        
        <div className="ml-11 p-3 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
          <p className="text-sm text-foreground">
            The brand signals reliability under pressure.
          </p>
        </div>
      </div>

      {/* 3. Business Model */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 font-bold text-sm">3</div>
          <div>
            <h4 className="font-semibold text-foreground">Business Model</h4>
            <p className="text-sm text-muted-foreground">Hobson has been designed to become the default intelligence layer</p>
          </div>
        </div>
        
        <div className="space-y-2 pl-11">
          {businessItems.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <span className="text-foreground">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
