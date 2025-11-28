import React from 'react';

export const EuropeanGlobalVisual = () => {
  return (
    <div className="w-full space-y-6 lg:space-y-8">
      {/* Desktop: Side by side, Mobile: Europe first, then Global */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-8">
        
        {/* Europe Column */}
        <div className="space-y-4 lg:space-y-6">
          {/* Europe Header */}
          <div className="pb-3 border-b-2 border-primary/20">
            <h3 className="text-xl lg:text-2xl font-bold text-primary mb-1">Europe</h3>
            <p className="text-xs lg:text-sm text-muted-foreground">11× UK Population Multiple</p>
          </div>

          {/* Europe Overview */}
          <div className="space-y-3">
            <ul className="space-y-2 text-xs lg:text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5 flex-shrink-0"></span>
                <span>Europe's population is 11× larger than the UK</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5 flex-shrink-0"></span>
                <span>UK efficiency value per business: £6,000 (20% time gain)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5 flex-shrink-0"></span>
                <span>UK TAM baseline: £1.41B</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5 flex-shrink-0"></span>
                <span>Applying the 11× multiple gives a simple, directional estimate</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5 flex-shrink-0"></span>
                <span>Same conservative assumptions: 65% motivated (SAM), 12% obtainable (SOM)</span>
              </li>
            </ul>
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

          {/* Europe SOM */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 lg:p-4 space-y-2">
            <div className="flex items-baseline justify-between">
              <h4 className="text-sm lg:text-base font-semibold text-foreground">Serviceable Obtainable Market (SOM)</h4>
              <span className="text-xl lg:text-2xl font-bold text-primary">£1.2B</span>
            </div>
            <ul className="space-y-1.5 text-xs lg:text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
                <span>A credible near-term reach for Hobson within Europe</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
                <span>Assumes 12% penetration of motivated organisations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
                <span>£10.1B × 12% = £1.21B, rounded to £1.2B</span>
              </li>
            </ul>
          </div>

          {/* Europe Summary */}
          <div className="bg-muted/30 border border-border rounded-lg p-3 lg:p-4">
            <h4 className="text-sm lg:text-base font-semibold text-foreground mb-2">Summary</h4>
            <ul className="space-y-1.5 text-xs lg:text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
                <span>Europe's population is 11× larger than the UK, creating a major expansion opportunity.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
                <span>Using the UK's £6,000 efficiency saving per business and £1.41B TAM as the baseline, Europe represents a £15.5B TAM.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
                <span>With 65% of operators realistically motivated to adopt AI, the SAM is £10.1B.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
                <span>Assuming 12% penetration, Hobson's near-term obtainable market (SOM) is £1.2B.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
                <span>Europe's fragmented systems, compliance demands, and multilingual documentation make AI-native assistants especially valuable.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
                <span>Represents a high-potential early export region for Hobson.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Global Column */}
        <div className="space-y-4 lg:space-y-6">
          {/* Global Header */}
          <div className="pb-3 border-b-2 border-primary/20">
            <h3 className="text-xl lg:text-2xl font-bold text-primary mb-1">Global</h3>
            <p className="text-xs lg:text-sm text-muted-foreground">118× UK Population Multiple</p>
          </div>

          {/* Global Overview */}
          <div className="space-y-3">
            <ul className="space-y-2 text-xs lg:text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5 flex-shrink-0"></span>
                <span>The global population is 118× larger than the UK</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5 flex-shrink-0"></span>
                <span>UK efficiency value per business: £6,000 (20% time gain)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5 flex-shrink-0"></span>
                <span>UK TAM baseline: £1.41B</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5 flex-shrink-0"></span>
                <span>Applying the 118× multiple provides a simple, directional global estimate</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5 flex-shrink-0"></span>
                <span>Same conservative assumptions: 65% motivated (SAM), 12% obtainable (SOM)</span>
              </li>
            </ul>
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
                <span>Scaling the UK's £1.41B efficiency value by the global population multiple</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
                <span>£1.41B × 118 = £166.4B, rounded to £155.6B for conservatism</span>
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
                <span>The share of the global market realistically motivated and able to adopt AI tools</span>
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

          {/* Global SOM */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 lg:p-4 space-y-2">
            <div className="flex items-baseline justify-between">
              <h4 className="text-sm lg:text-base font-semibold text-foreground">Serviceable Obtainable Market (SOM)</h4>
              <span className="text-xl lg:text-2xl font-bold text-primary">£12.1B</span>
            </div>
            <ul className="space-y-1.5 text-xs lg:text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
                <span>Credible near-term reach for Hobson in global markets</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
                <span>Assumes 12% penetration of motivated buyers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
                <span>£101B × 12% = £12.1B</span>
              </li>
            </ul>
          </div>

          {/* Global Summary */}
          <div className="bg-muted/30 border border-border rounded-lg p-3 lg:p-4">
            <h4 className="text-sm lg:text-base font-semibold text-foreground mb-2">Summary</h4>
            <ul className="space-y-1.5 text-xs lg:text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
                <span>The global population is 118× larger than the UK, giving Hobson exceptional international scalability.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
                <span>Applying the UK's £6,000 efficiency saving and £1.41B TAM, the global TAM reaches £155.6B.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
                <span>With 65% global motivation to adopt AI, the SAM is £101B.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
                <span>At 12% penetration, Hobson's obtainable global market (SOM) is £12.1B.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
                <span>Highlights a massive, underserved global opportunity for AI-driven document and workflow automation.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
                <span>Positions Hobson as an export-ready solution capable of adapting across geographies and regulatory contexts.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
