import React from 'react';
import { Building2, Users, Banknote, Zap, CheckCircle, ExternalLink, PoundSterling } from 'lucide-react';

/**
 * UK Assumptions component specifically for the Financials > Forecasts & Assumptions section.
 * This is a separate component from UKMarketAssumptionsVisual (used in Customers & Market)
 * so that changes to one do not affect the other.
 */
export const UKAssumptionsFinancialsVisual = () => {
  const businessSizeData = [
    { size: "Small (1–9 employees)", percentage: "96%", count: "225,792" },
    { size: "Medium (10–49)", percentage: "2.7%", count: "6,350" },
    { size: "Large (50–249)", percentage: "0.6%", count: "1,411" },
    { size: "Enterprise (250+)", percentage: "0.1%", count: "235" },
  ];

  const financialImpactBenefits = [
    "Reduced manual retrieval time",
    "Fewer errors and compliance issues",
    "Less duplicated effort",
    "Faster decision-making",
    "Ability to scale portfolios without expanding headcount",
  ];

  return (
    <div className="w-full space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="pb-3 border-b-2 border-primary/20">
        <h3 className="text-xl lg:text-2xl font-bold text-primary mb-1">UK Assumptions</h3>
        <p className="text-xs lg:text-sm text-muted-foreground">Financial modelling foundation for UK market</p>
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

      {/* Section 4: Labour Cost */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 lg:p-5">
        <div className="flex items-center gap-2 mb-3">
          <Banknote className="w-5 h-5 text-primary" />
          <h4 className="text-sm lg:text-base font-semibold text-foreground">4. Labour Cost Baseline</h4>
        </div>
        <div className="bg-background/50 rounded-lg p-4 border border-border/50">
          <p className="text-3xl lg:text-4xl font-bold text-primary">£30,000</p>
          <p className="text-sm text-muted-foreground mt-1">Average junior real estate salary</p>
        </div>
        <a 
          href="https://report.macdonaldandcompany.com/report/2023-2024/uk/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-primary/70 hover:text-primary mt-3 transition-colors"
        >
          Source: Macdonald & Company – UK Salary Report 2023/24
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Section 5: AI Efficiency Gain */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 rounded-lg p-4 lg:p-5">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-primary" />
          <h4 className="text-sm lg:text-base font-semibold text-foreground">5. AI Efficiency Gain Assumption — 20%</h4>
        </div>

        {/* Evidence Base */}
        <div className="space-y-3">
          <h5 className="text-sm font-semibold text-foreground">Evidence Base</h5>
          <div className="space-y-3 text-xs lg:text-sm text-muted-foreground">
            <div className="flex items-start gap-2 bg-background/50 rounded-lg p-3 border border-border/50">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></span>
              <div>
                <span className="font-medium text-foreground">AI delivers 10–20% efficiency gains</span> in real estate operations
                <a href="https://www.forbes.com/councils/forbestechcouncil/2024/10/30/how-artificial-intelligence-is-changing-the-real-estate-market/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-primary/70 hover:text-primary ml-1">
                  (Forbes Tech Council, 2024) <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
            <div className="flex items-start gap-2 bg-background/50 rounded-lg p-3 border border-border/50">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></span>
              <div>
                <span className="font-medium text-foreground">Up to 37% of real estate tasks</span> are automatable
                <a href="https://www.morganstanley.com/insights/articles/ai-in-real-estate-2025" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-primary/70 hover:text-primary ml-1">
                  (Morgan Stanley, 2025) <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
            <div className="flex items-start gap-2 bg-background/50 rounded-lg p-3 border border-border/50">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></span>
              <div>
                AI improves <span className="font-medium text-foreground">document-heavy tasks</span> (reviews, compliance, asset lifecycle)
                <a href="https://drooms.com/blog/artificial-intelligence/ai-in-real-estate-how-ai-driven-solutions-transform-asset-lifecycle-management/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-primary/70 hover:text-primary ml-1">
                  (Drooms – AI in Real Estate) <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 6: Financial Impact */}
      <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4 lg:p-5">
        <div className="flex items-center gap-2 mb-3">
          <PoundSterling className="w-5 h-5 text-green-600" />
          <h4 className="text-sm lg:text-base font-semibold text-foreground">6. Financial Impact of Efficiency Gains</h4>
        </div>
        
        <p className="text-xs lg:text-sm text-muted-foreground mb-3">
          Using an average junior salary of <span className="font-semibold text-foreground">£30,000</span>:
        </p>

        <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-lg p-4 border border-green-500/30 mb-4">
          <p className="text-lg lg:text-xl font-bold text-green-700 text-center">
            20% efficiency gain = <span className="text-2xl lg:text-3xl">£6,000</span> annual saving
          </p>
          <p className="text-xs lg:text-sm text-green-600/80 text-center mt-1">per admin/document-handling role</p>
        </div>

        <p className="text-xs lg:text-sm text-muted-foreground mb-3">This reflects:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {financialImpactBenefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2 text-xs lg:text-sm text-foreground">
              <CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-green-500/20">
          <p className="text-xs lg:text-sm text-muted-foreground italic">
            ➡️ This assumption is used throughout financial modelling for Hobson's ROI.
          </p>
        </div>
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
            <span>A large and clearly segmented market</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0">2</span>
            <span>65% of UK businesses primed to invest in AI</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0">3</span>
            <span>Labour cost baselines</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0">4</span>
            <span>A conservative but evidence-backed efficiency gain (20%) equal to <span className="font-semibold text-primary">£6k per role per year</span></span>
          </li>
        </ul>
      </div>
    </div>
  );
};
