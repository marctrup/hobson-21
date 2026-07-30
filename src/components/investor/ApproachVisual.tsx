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
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-bone-wash dark:bg-ink/50 text-charcoal dark:text-ink-muted font-bold text-sm">1</div>
          <div>
            <h4 className="font-semibold text-foreground">Product</h4>
            <p className="text-sm text-muted-foreground">Hobson has been built to replace document-driven human reasoning without disrupting existing workflows</p>
          </div>
        </div>
        
        <div className="space-y-2 pl-11">
          {productItems.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-charcoal mt-0.5 flex-shrink-0" />
              <span className="text-foreground">{item}</span>
            </div>
          ))}
        </div>
        
        <div className="ml-11 p-3 rounded-lg bg-paper/50 dark:bg-ink/20 border border-faint-rule dark:border-charcoal/30">
          <p className="text-sm text-foreground">
            Trust is earned first. Expansion into proactive guidance and automation will follow.
          </p>
        </div>
      </div>

      {/* 2. Brand */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-danger-bg dark:bg-danger-solid/50 text-danger dark:text-danger font-bold text-sm">2</div>
          <div>
            <h4 className="font-semibold text-foreground">Brand</h4>
            <p className="text-sm text-muted-foreground">Hobson has been designed for high-stakes operational environments where accuracy, traceability, and defensibility are non-negotiable</p>
          </div>
        </div>
        
        <div className="space-y-2 pl-11">
          {brandItems.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-danger mt-0.5 flex-shrink-0" />
              <span className="text-foreground">{item}</span>
            </div>
          ))}
        </div>
        
        <div className="ml-11 p-3 rounded-lg bg-danger-bg/50 dark:bg-danger-solid/20 border border-danger-border dark:border-danger/30">
          <p className="text-sm text-foreground">
            The brand signals reliability under pressure.
          </p>
        </div>
      </div>

      {/* 3. Business Model */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-warning-bg dark:bg-warning-solid/50 text-warning dark:text-warning font-bold text-sm">3</div>
          <div>
            <h4 className="font-semibold text-foreground">Business Model</h4>
            <p className="text-sm text-muted-foreground">Hobson has been designed to become the default intelligence layer</p>
          </div>
        </div>
        
        <div className="space-y-2 pl-11">
          {businessItems.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
              <span className="text-foreground">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
