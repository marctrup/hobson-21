import React from 'react';

export const EuropeanGlobalVisual = () => {
  return (
    <div className="w-full space-y-6">
      {/* Headers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <div className="pb-3 border-b-2 border-primary/20">
          <h3 className="text-2xl font-bold text-primary mb-1">Europe</h3>
          <p className="text-sm text-muted-foreground">11× UK Population Multiple</p>
        </div>
        <div className="pb-3 border-b-2 border-primary/20">
          <h3 className="text-2xl font-bold text-primary mb-1">Global</h3>
          <p className="text-sm text-muted-foreground">118× UK Population Multiple</p>
        </div>
      </div>

      {/* Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <div className="space-y-3">
          <ul className="space-y-2 text-sm text-muted-foreground">
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
        <div className="space-y-3">
          <ul className="space-y-2 text-sm text-muted-foreground">
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
      </div>

      {/* TAM Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
          <div className="flex items-baseline justify-between">
            <h4 className="text-base font-semibold text-foreground">Total Addressable Market (TAM)</h4>
            <span className="text-2xl font-bold text-primary">£15.5B</span>
          </div>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
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
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
          <div className="flex items-baseline justify-between">
            <h4 className="text-base font-semibold text-foreground">Total Addressable Market (TAM)</h4>
            <span className="text-2xl font-bold text-primary">£155.6B</span>
          </div>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
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
      </div>

      {/* SAM Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
          <div className="flex items-baseline justify-between">
            <h4 className="text-base font-semibold text-foreground">Serviceable Available Market (SAM)</h4>
            <span className="text-2xl font-bold text-primary">£10.1B</span>
          </div>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
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
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
          <div className="flex items-baseline justify-between">
            <h4 className="text-base font-semibold text-foreground">Serviceable Available Market (SAM)</h4>
            <span className="text-2xl font-bold text-primary">£101B</span>
          </div>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
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
      </div>

      {/* SOM Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
          <div className="flex items-baseline justify-between">
            <h4 className="text-base font-semibold text-foreground">Serviceable Obtainable Market (SOM)</h4>
            <span className="text-2xl font-bold text-primary">£1.2B</span>
          </div>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
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
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
          <div className="flex items-baseline justify-between">
            <h4 className="text-base font-semibold text-foreground">Serviceable Obtainable Market (SOM)</h4>
            <span className="text-2xl font-bold text-primary">£12.1B</span>
          </div>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
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
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <div className="bg-muted/30 border border-border rounded-lg p-4">
          <h4 className="text-base font-semibold text-foreground mb-2">Summary</h4>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
              <span>With Europe's population 11× larger than the UK, Hobson's efficiency gains scale into a substantial export opportunity</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
              <span>A conservative model shows a £15.5B TAM</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
              <span>£1.2B obtainable opportunity makes Europe a high-value early expansion region</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
              <span>Strong potential for AI-driven real estate tools in European markets</span>
            </li>
          </ul>
        </div>
        <div className="bg-muted/30 border border-border rounded-lg p-4">
          <h4 className="text-base font-semibold text-foreground mb-2">Summary</h4>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
              <span>With the world's population 118× larger than the UK, Hobson's efficiency impact scales dramatically</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
              <span>A simple, conservative extrapolation shows a £155B global TAM</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
              <span>£101B motivated market and £12B obtainable opportunity</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0"></span>
              <span>Strong potential for AI-driven real estate tools in Global markets</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
