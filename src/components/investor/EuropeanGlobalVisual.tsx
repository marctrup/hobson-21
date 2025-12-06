import React from 'react';
export const EuropeanGlobalVisual = () => {
  return <div className="w-full space-y-6 lg:space-y-8">
      {/* Desktop: Side by side, Mobile: Europe first, then Global */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-8">
        
        {/* Europe Column */}
        <div className="space-y-4 lg:space-y-6">
          {/* Europe Header */}
          <div className="pb-3 border-b-2 border-primary/20">
            <h3 className="text-xl lg:text-2xl font-bold text-primary mb-1">Europe</h3>
            <p className="text-xs lg:text-sm text-muted-foreground">11× UK Population</p>
          </div>

          {/* Europe TAM */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 lg:p-4 space-y-2">
            <div className="flex items-baseline justify-between">
              <h4 className="text-sm lg:text-base font-semibold text-foreground">Total Addressable Market (TAM)</h4>
              <span className="text-xl lg:text-2xl font-bold text-primary">£15.5B</span>
            </div>
            <ul className="space-y-1.5 text-xs lg:text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
                <span>Scaling the UK's £1.41B efficiency value by Europe's 11× population multiple</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
                <span>£1.41B × 11 = £15.51B, rounded to £15.5B</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
                <span>Represents the annual efficiency value across Europe for AI-driven document and information workflows in real estate</span>
              </li>
            </ul>
          </div>

          {/* Europe SAM */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 lg:p-4 space-y-2">
            <div className="flex items-baseline justify-between">
              <h4 className="text-sm lg:text-base font-semibold text-foreground">Serviceable Available Market (SAM)</h4>
              <span className="text-xl lg:text-2xl font-bold text-primary">£10.1B</span>
            </div>
            <ul className="space-y-1.5 text-xs lg:text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
                <span>The proportion of European real estate operators realistically motivated and ready to adopt AI tools</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
                <span>Uses the same 65% factor as the UK</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
                <span>£15.5B × 65% = £10.1B</span>
              </li>
            </ul>
          </div>


        </div>

        {/* Global Column */}
        <div className="space-y-4 lg:space-y-6">
          {/* Global Header */}
          <div className="pb-3 border-b-2 border-primary/20">
            <h3 className="text-xl lg:text-2xl font-bold text-primary mb-1">Global</h3>
            <p className="text-xs lg:text-sm text-muted-foreground">118× UK Population</p>
          </div>

          {/* Global TAM */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 lg:p-4 space-y-2">
            <div className="flex items-baseline justify-between">
              <h4 className="text-sm lg:text-base font-semibold text-foreground">Total Addressable Market (TAM)</h4>
              <span className="text-xl lg:text-2xl font-bold text-primary">£155.6B</span>
            </div>
            <ul className="space-y-1.5 text-xs lg:text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
                <span>Scaling the UK's £1.41B efficiency value by the global 18 × population multiple</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
                <span>£1.41B × 118 = £166.4B, rounded to £155.6B </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
                <span>Represents the worldwide opportunity for AI-driven efficiency gains in real estate document workflows</span>
              </li>
            </ul>
          </div>

          {/* Global SAM */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 lg:p-4 space-y-2">
            <div className="flex items-baseline justify-between">
              <h4 className="text-sm lg:text-base font-semibold text-foreground">Serviceable Available Market (SAM)</h4>
              <span className="text-xl lg:text-2xl font-bold text-primary">£101B</span>
            </div>
            <ul className="space-y-1.5 text-xs lg:text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
                <span>The proportion of European real estate operators realistically motivated and ready to adopt AI tools</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
                <span>Uses the same 65% factor as the UK</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
                <span>£155.6B × 65% = £101B</span>
              </li>
            </ul>
          </div>


        </div>
      </div>

      {/* Single Summary */}
      <div className="bg-muted/30 border border-border rounded-lg p-3 lg:p-4">
        <p className="text-sm lg:text-base text-muted-foreground">
          Positions Hobson as an export-ready solution capable of adapting across geographies and regulatory contexts.
        </p>
      </div>
    </div>;
};