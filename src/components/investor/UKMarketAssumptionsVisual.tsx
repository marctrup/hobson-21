import React from 'react';
import { Building2, Users, Zap, ExternalLink } from 'lucide-react';

export const UKMarketAssumptionsVisual = () => {
  const businessSizeData = [
    { size: "Small (1–9 employees)", percentage: "96%", count: "225,792" },
    { size: "Medium (10–49)", percentage: "2.7%", count: "6,350" },
    { size: "Large (50–249)", percentage: "0.6%", count: "1,411" },
    { size: "Enterprise (250+)", percentage: "0.1%", count: "235" },
  ];

  return (
    <div className="w-full space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="pb-3 border-b-2 border-primary/20">
        <h3 className="text-xl lg:text-2xl font-bold text-primary mb-1">UK Market Assumptions</h3>
        <p className="text-xs lg:text-sm text-muted-foreground">Evidence-based framework for market sizing</p>
      </div>

      {/* Section 1: Market Size */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 lg:p-5">
        <div className="flex items-center gap-2 mb-3">
          <Building2 className="w-5 h-5 text-primary" />
          <h4 className="text-sm lg:text-base font-semibold text-foreground">1. Size of the UK Real Estate Business Market</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-background/50 rounded-lg p-3 border border-border/50">
            <p className="text-2xl lg:text-3xl font-bold text-primary">5.6M</p>
            <p className="text-xs lg:text-sm text-muted-foreground">Total UK businesses</p>
          </div>
          <div className="bg-background/50 rounded-lg p-3 border border-border/50">
            <p className="text-2xl lg:text-3xl font-bold text-primary">235,200</p>
            <p className="text-xs lg:text-sm text-muted-foreground">Real estate businesses (4.2%)</p>
          </div>
        </div>
        <a 
          href="https://www.ons.gov.uk" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-primary/70 hover:text-primary mt-3 transition-colors"
        >
          Source: ONS – Real estate activities by employment size
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Section 2: Distribution by Size */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 lg:p-5">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5 text-primary" />
          <h4 className="text-sm lg:text-base font-semibold text-foreground">2. Business Size Breakdown (Real Estate Only)</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-primary/20">
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Business Size</th>
                <th className="text-center py-2 px-3 text-muted-foreground font-medium">% of UK Businesses</th>
                <th className="text-right py-2 px-3 text-muted-foreground font-medium">Est. RE Businesses</th>
              </tr>
            </thead>
            <tbody>
              {businessSizeData.map((row, index) => (
                <tr key={index} className="border-b border-border/30 last:border-0">
                  <td className="py-2 px-3 font-medium text-foreground">{row.size}</td>
                  <td className="py-2 px-3 text-center text-muted-foreground">{row.percentage}</td>
                  <td className="py-2 px-3 text-right font-semibold text-primary">{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <a 
          href="https://www.gov.uk/government/collections/business-population-estimates" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-primary/70 hover:text-primary mt-3 transition-colors"
        >
          Source: Department for Business, Energy & Industrial Strategy (BEIS) / Office for National Statistics (ONS)
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Section 3: AI Investment Readiness */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 lg:p-5">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-primary" />
          <h4 className="text-sm lg:text-base font-semibold text-foreground">3. AI Investment Readiness</h4>
        </div>
        <div className="bg-background/50 rounded-lg p-4 border border-border/50">
          <p className="text-3xl lg:text-4xl font-bold text-primary">65%</p>
          <p className="text-sm text-muted-foreground mt-1">of UK businesses are primed to invest in AI</p>
        </div>
        <a 
          href="https://www2.deloitte.com/us/en/insights/focus/cognitive-technologies/state-of-ai-and-intelligent-automation-in-business-survey.html" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-primary/70 hover:text-primary mt-3 transition-colors"
        >
          Source: Deloitte – State of AI in the Enterprise (5th Edition)
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Summary */}
      <div className="bg-primary/10 border-2 border-primary/30 rounded-lg p-4 lg:p-5">
        <h4 className="text-sm lg:text-base font-semibold text-primary mb-3">Summary</h4>
        <p className="text-xs lg:text-sm text-muted-foreground mb-3">
          These assumptions establish a robust foundation for modelling Hobson's UK opportunity by defining:
        </p>
        <ul className="space-y-2 text-xs lg:text-sm text-foreground">
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0">1</span>
            <span>A large and clearly segmented market (235,200 real estate businesses)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0">2</span>
            <span>Clear segmentation by business size from micro to enterprise</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0">3</span>
            <span>65% of UK businesses primed to invest in AI</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
