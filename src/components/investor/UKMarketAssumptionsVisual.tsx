import React from 'react';
import { Building2, Users, Banknote, Zap, CheckCircle, ExternalLink } from 'lucide-react';

export const UKMarketAssumptionsVisual = () => {
  const businessSizeData = [
    { size: "Small (1–9 employees)", percentage: "96%", count: "225,792" },
    { size: "Medium (10–49)", percentage: "2.7%", count: "6,350" },
    { size: "Large (50–249)", percentage: "0.6%", count: "1,411" },
    { size: "Enterprise (250+)", percentage: "0.1%", count: "235" },
  ];

  const efficiencyImprovements = [
    "Document processing",
    "Compliance workflows",
    "Asset lifecycle management",
  ];

  const efficiencyGainBenefits = [
    "Faster document retrieval",
    "Reduced administrative time",
    "Fewer errors & compliance risks",
    "Increased decision-making speed",
    "Ability to scale without hiring proportionately",
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
          <h4 className="text-sm lg:text-base font-semibold text-foreground">2. Distribution by Business Size (Real Estate Segment)</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-primary/20">
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Business Size</th>
                <th className="text-center py-2 px-3 text-muted-foreground font-medium">% of All UK</th>
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
      </div>

      {/* Section 3: Labour Cost */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 lg:p-5">
        <div className="flex items-center gap-2 mb-3">
          <Banknote className="w-5 h-5 text-primary" />
          <h4 className="text-sm lg:text-base font-semibold text-foreground">3. Labour Cost Baseline</h4>
        </div>
        <div className="bg-background/50 rounded-lg p-4 border border-border/50">
          <p className="text-3xl lg:text-4xl font-bold text-primary">£30,000</p>
          <p className="text-sm text-muted-foreground mt-1">Average junior salary in UK real estate</p>
        </div>
        <a 
          href="https://report.macdonaldandcompany.com/report/2023-2024/uk/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-primary/70 hover:text-primary mt-3 transition-colors"
        >
          Source: Macdonald & Company Salary Report 2023/24
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Section 4: AI Efficiency Gain */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 rounded-lg p-4 lg:p-5">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-primary" />
          <h4 className="text-sm lg:text-base font-semibold text-foreground">4. AI Efficiency Gain Assumption</h4>
        </div>
        
        <div className="bg-background/70 rounded-lg p-4 border border-primary/20 mb-4">
          <p className="text-4xl lg:text-5xl font-bold text-primary text-center">20%</p>
          <p className="text-sm text-center text-muted-foreground mt-1">Efficiency gain per business adopting AI</p>
        </div>

        {/* Rationale */}
        <div className="space-y-3 mb-4">
          <h5 className="text-sm font-semibold text-foreground">Rationale</h5>
          <div className="space-y-2 text-xs lg:text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></span>
              <div>
                <span className="font-medium text-foreground">10–20% efficiency gains</span> expected in real estate operations
                <a href="https://www.forbes.com/councils/forbestechcouncil/2024/10/30/how-artificial-intelligence-is-changing-the-real-estate-market/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-primary/70 hover:text-primary ml-1">
                  (Forbes Tech Council, 2024) <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></span>
              <div>
                <span className="font-medium text-foreground">Up to 37% of tasks</span> are automatable inside real estate companies
                <a href="https://www.morganstanley.com/insights/articles/ai-in-real-estate-2025" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-primary/70 hover:text-primary ml-1">
                  (Morgan Stanley, 2025) <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></span>
              <div>
                AI is already improving: {efficiencyImprovements.join(", ")}
                <a href="https://drooms.com/blog/artificial-intelligence/ai-in-real-estate-how-ai-driven-solutions-transform-asset-lifecycle-management/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-primary/70 hover:text-primary ml-1">
                  (Drooms) <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-background/50 rounded-lg p-3 border border-border/50">
          <h5 className="text-xs font-semibold text-muted-foreground mb-2">This gain reflects:</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {efficiencyGainBenefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-xs lg:text-sm text-foreground">
                <CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 5: Why Conservative */}
      <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4 lg:p-5">
        <h4 className="text-sm lg:text-base font-semibold text-foreground mb-3">5. Why These Assumptions Are Conservative but Credible</h4>
        <ul className="space-y-2 text-xs lg:text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Industry research shows <span className="font-medium text-foreground">higher upper-bounds (20%–37%)</span>, so 20% is prudent.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Real estate is <span className="font-medium text-foreground">document-heavy</span> and therefore highly impacted by retrieval automation.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Efficiency gains apply to <span className="font-medium text-foreground">all segments</span> (small → enterprise), making the TAM and impact scalable.</span>
          </li>
        </ul>
      </div>

      {/* Summary */}
      <div className="bg-primary/10 border-2 border-primary/30 rounded-lg p-4 lg:p-5">
        <h4 className="text-sm lg:text-base font-semibold text-primary mb-3">Summary</h4>
        <p className="text-xs lg:text-sm text-muted-foreground mb-3">This UK market assumption framework establishes:</p>
        <ol className="space-y-2 text-xs lg:text-sm text-foreground">
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0">1</span>
            <span>A clear, evidence-based definition of the accessible market.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0">2</span>
            <span>A salary and labour baseline relevant to modelling time savings.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0">3</span>
            <span>A defensible <span className="font-semibold text-primary">20% efficiency gain assumption</span> that directly supports revenue modelling for Hobson.</span>
          </li>
        </ol>
      </div>
    </div>
  );
};
