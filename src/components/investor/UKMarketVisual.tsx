import React from 'react';

export const UKMarketVisual = () => {
  return (
    <div className="w-full space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="pb-3 border-b-2 border-primary/20">
        <h3 className="text-xl lg:text-2xl font-bold text-primary mb-1">Market Opportunity</h3>
        <p className="text-xs lg:text-sm text-muted-foreground">Built Directly From Verified Assumptions</p>
      </div>

      {/* TAM Box */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 lg:p-4 space-y-2">
        <div className="flex items-baseline justify-between">
          <h4 className="text-sm lg:text-base font-semibold text-foreground">Total Addressable Market (TAM)</h4>
          <span className="text-xl lg:text-2xl font-bold text-primary">£1.41B</span>
        </div>
        <p className="text-xs lg:text-sm text-muted-foreground mb-2">Based on verified ONS business counts and salary benchmarks.</p>
        <ul className="space-y-1.5 text-xs lg:text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
            <span>235,200 UK real estate businesses (from 5.6M total UK businesses × 4.2% real estate share)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
            <span>£6,000 annual saving per business (20% efficiency gain on £30,000 junior salary)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
            <span>→ TAM = 235,200 × £6,000 = £1.41B</span>
          </li>
        </ul>
      </div>

      {/* SAM Box */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 lg:p-4 space-y-2">
        <div className="flex items-baseline justify-between">
          <h4 className="text-sm lg:text-base font-semibold text-foreground">Serviceable Available Market (SAM)</h4>
          <span className="text-xl lg:text-2xl font-bold text-primary">£917M</span>
        </div>
        <p className="text-xs lg:text-sm text-muted-foreground mb-2">Reflects businesses motivated and able to adopt AI (supported by external adoption studies).</p>
        <ul className="space-y-1.5 text-xs lg:text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
            <span>65% adoption readiness (consistent with PropTech and operational AI adoption rates in traditional sectors)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
            <span>235,200 × 65% = 152,880 motivated businesses</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
            <span>152,880 × £6,000 = £917M</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
            <span>→ SAM aligns with verified adoption behaviour from Deloitte, PwC, McKinsey</span>
          </li>
        </ul>
      </div>

      {/* SOM Box */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 lg:p-4 space-y-2">
        <div className="flex items-baseline justify-between">
          <h4 className="text-sm lg:text-base font-semibold text-foreground">Serviceable Obtainable Market (SOM)</h4>
          <span className="text-xl lg:text-2xl font-bold text-primary">£110M</span>
        </div>
        <p className="text-xs lg:text-sm text-muted-foreground mb-2">Built using the evidence-backed 12% early penetration assumption.</p>
        <ul className="space-y-1.5 text-xs lg:text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
            <span>12% penetration sits within the independently verified 8–20% early-stage adoption range (McKinsey, PwC, Deloitte, BVP, Gartner, Forbes)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
            <span>152,880 motivated businesses × 12% = 18,345 early adopters</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
            <span>18,345 × £6,000 = £110M</span>
          </li>
        </ul>
      </div>

      {/* Summary */}
      <div className="bg-muted/30 border border-border rounded-lg p-3 lg:p-4">
        <p className="text-sm lg:text-base text-muted-foreground">
          → SOM is intentionally conservative and supported by industry-verified adoption behaviour.
        </p>
      </div>
    </div>
  );
};
