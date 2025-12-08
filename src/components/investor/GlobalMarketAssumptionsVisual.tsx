import React from 'react';
import { TrendingUp, DollarSign, Zap, BarChart3, CheckCircle, ExternalLink, Globe } from 'lucide-react';

export const GlobalMarketAssumptionsVisual = () => {
  const whyMattersPoints = [
    "AI efficiency gains are a global norm, reinforcing UK opportunity",
    "20% efficiency uplift is validated by global real estate data",
    "Your UK £1.41B → £917M → £110M path sits inside a multi-trillion-dollar, fast-growing global market",
    "Hobson enters a sector where adoption is rising and ROI is demonstrable",
  ];

  return (
    <div className="w-full space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="pb-3 border-b-2 border-primary/20">
        <h3 className="text-xl lg:text-2xl font-bold text-primary mb-1">Global Market Assumptions</h3>
        <p className="text-xs lg:text-sm text-muted-foreground">Explosive Global Growth (Verified by Independent Reports)</p>
      </div>

      {/* Section 1: AI in Real Estate Market Growth */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 lg:p-5">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h4 className="text-sm lg:text-base font-semibold text-foreground">1. AI in Real Estate Market Growth (Business Research Company)</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-background/50 rounded-lg p-3 border border-border/50">
            <p className="text-lg lg:text-xl font-bold text-primary">$222.65B → $303.06B</p>
            <p className="text-xs lg:text-sm text-muted-foreground">Market growth 2024 to 2025</p>
          </div>
          <div className="bg-background/50 rounded-lg p-3 border border-border/50">
            <p className="text-2xl lg:text-3xl font-bold text-primary">36.1%</p>
            <p className="text-xs lg:text-sm text-muted-foreground">CAGR</p>
          </div>
        </div>
        <a 
          href="https://www.thebusinessresearchcompany.com/report/ai-in-real-estate-global-market-report" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-primary/70 hover:text-primary mt-3 transition-colors"
        >
          Source: Business Research Company — AI in Real Estate Global Market Report 2025
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Section 2: Long-Term Forecast to 2030 */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 lg:p-5">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h4 className="text-sm lg:text-base font-semibold text-foreground">2. Long-Term Forecast to 2030 (Maximize Market Research)</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-background/50 rounded-lg p-3 border border-border/50">
            <p className="text-2xl lg:text-3xl font-bold text-primary">$1.8T</p>
            <p className="text-xs lg:text-sm text-muted-foreground">Global market projected by 2030</p>
          </div>
          <div className="bg-background/50 rounded-lg p-3 border border-border/50">
            <p className="text-2xl lg:text-3xl font-bold text-primary">35%</p>
            <p className="text-xs lg:text-sm text-muted-foreground">Sustained CAGR</p>
          </div>
        </div>
        <a 
          href="https://www.maximizemarketresearch.com/market-report/artificial-intelligence-ai-in-real-estate-market/211825/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-primary/70 hover:text-primary mt-3 transition-colors"
        >
          Source: Maximize Market Research — AI in Real Estate Market Forecast 2023–2030
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Section 3: Proven Efficiency & Cost Gains */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 lg:p-5">
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="w-5 h-5 text-primary" />
          <h4 className="text-sm lg:text-base font-semibold text-foreground">3. Proven Efficiency & Cost Gains (McKinsey)</h4>
        </div>
        <div className="bg-background/50 rounded-lg p-4 border border-border/50 mb-3">
          <p className="text-2xl lg:text-3xl font-bold text-primary">10%+</p>
          <p className="text-sm text-muted-foreground mt-1">Increase in net operating income (NOI) achieved through AI</p>
        </div>
        <p className="text-xs lg:text-sm text-muted-foreground">
          Driven by automation and more efficient operating models
        </p>
        <a 
          href="https://www.mckinsey.com/industries/real-estate/our-insights/the-power-of-generative-ai-in-real-estate" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-primary/70 hover:text-primary mt-3 transition-colors"
        >
          Source: McKinsey — The Power of Generative AI in Real Estate
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Section 4: Real-World Adoption & Savings */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 rounded-lg p-4 lg:p-5">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-primary" />
          <h4 className="text-sm lg:text-base font-semibold text-foreground">4. Real-World Adoption & Savings (Forbes)</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-background/50 rounded-lg p-4 border border-border/50">
            <p className="text-2xl lg:text-3xl font-bold text-primary">49%</p>
            <p className="text-sm text-muted-foreground mt-1">of real estate business owners report clear cost reductions from AI adoption</p>
          </div>
          <div className="bg-background/50 rounded-lg p-4 border border-border/50">
            <p className="text-2xl lg:text-3xl font-bold text-primary">Up to 20%</p>
            <p className="text-sm text-muted-foreground mt-1">Operational savings achievable</p>
          </div>
        </div>
        <a 
          href="https://www.forbes.com/councils/forbestechcouncil/2024/10/30/how-artificial-intelligence-is-changing-the-real-estate-market/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-primary/70 hover:text-primary mt-3 transition-colors"
        >
          Source: Forbes — How Artificial Intelligence Is Changing the Real Estate Market
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Why This Matters for Hobson */}
      <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4 lg:p-5">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-5 h-5 text-green-600" />
          <h4 className="text-sm lg:text-base font-semibold text-foreground">Why This Matters for Hobson</h4>
        </div>
        <div className="space-y-2">
          {whyMattersPoints.map((point, index) => (
            <div key={index} className="flex items-start gap-2 text-xs lg:text-sm text-foreground">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>{point}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-primary/10 border-2 border-primary/30 rounded-lg p-4 lg:p-5">
        <h4 className="text-sm lg:text-base font-semibold text-primary mb-3">Summary</h4>
        <p className="text-xs lg:text-sm text-muted-foreground mb-3">
          Global market data validates Hobson's opportunity:
        </p>
        <ul className="space-y-2 text-xs lg:text-sm text-foreground">
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0">1</span>
            <span>AI in real estate is a fast-growing multi-trillion dollar market</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0">2</span>
            <span>35%+ CAGR through 2030</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0">3</span>
            <span>Proven 10-20% efficiency gains across the industry</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0">4</span>
            <span>Nearly half of real estate businesses already seeing cost reductions from AI</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
