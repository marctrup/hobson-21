import React from "react";
import { TrendingUp, Target, Zap, Globe, DollarSign, BarChart3, Building2, Layers } from "lucide-react";
const MarketShareJustificationVisual = () => {
  const ukProjection = [{
    year: "2026",
    share: "-",
    rationale: "Pilot validation only"
  }, {
    year: "2027",
    share: "0.4%",
    rationale: "UK commercial launch + first conversions"
  }, {
    year: "2028",
    share: "1.4%",
    rationale: "Strong UK adoption + compounding referrals"
  }, {
    year: "2029",
    share: "3%",
    rationale: "Brand leadership in UK emerges"
  }, {
    year: "2030",
    share: "6-10%",
    rationale: "Category leader in UK"
  }];
  const globalProjection = [{
    year: "2028",
    ukShare: "1.4%",
    globalShare: "0.6%",
    notes: "Launch year; initial adoption"
  }, {
    year: "2029",
    ukShare: "3%",
    globalShare: "1.6%",
    notes: "Growing credibility + referrals"
  }, {
    year: "2030",
    ukShare: "6%",
    globalShare: "2-4%",
    notes: "Mature positioning + brand leadership"
  }];
  const justificationPoints = [{
    icon: Zap,
    title: "Frictionless Adoption",
    description: "Zero onboarding, works alongside existing tools, and pricing is not a barrier — enabling 2× faster market penetration than typical SaaS."
  }, {
    icon: Building2,
    title: "Fragmented Market Structure",
    description: "225,792 small firms, 6,350 medium, 1,411 large, 235 enterprise — lightweight AI spreads rapidly through referrals."
  }, {
    icon: Target,
    title: "White-Space Positioning",
    description: "First AI built solely for Document Intelligence → Retrieval → Clarity → Referenced Answers. No direct competitor."
  }, {
    icon: TrendingUp,
    title: "Benchmark Precedent",
    description: "Vertical AI companies (EliseAI, StanAI, Cresta) reached 1–3% penetration in 3–5 years — Hobson's frictionless model doubles this."
  }, {
    icon: BarChart3,
    title: "AI Adoption Tailwinds",
    description: "65% of organisations plan to increase AI investment (Deloitte). Up to 20% efficiency gain achievable (Forbes)."
  }, {
    icon: DollarSign,
    title: "Favourable Unit Economics",
    description: "~£1.60–£2.00 per unit onboarding cost. High gross margin enables aggressive SMB and enterprise scaling."
  }, {
    icon: Globe,
    title: "Global Replicability",
    description: "Similar market structure, AI adoption rates, and universal document needs support international expansion."
  }];
  return <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Market Share Justification</h3>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          Why Hobson can credibly capture 6–10% of the UK market and replicate this globally by 2030
        </p>
      </div>

      {/* Justification Points Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {justificationPoints.map((point, index) => <div key={index} className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 hover:border-primary/40 transition-colors">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 flex-shrink-0">
                <point.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-xs sm:text-sm mb-1">{point.title}</h4>
                <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">{point.description}</p>
              </div>
            </div>
          </div>)}
      </div>

      {/* UK Market Share Projection */}
      <div className="mt-6 sm:mt-8">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          <h4 className="text-base sm:text-lg font-semibold text-foreground">UK Market Share Projection</h4>
        </div>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="min-w-[400px] px-4 sm:px-0">
            <table className="w-full border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-primary/10">
                  <th className="text-left p-2 sm:p-3 font-semibold text-foreground border border-border">Year</th>
                  <th className="text-left p-2 sm:p-3 font-semibold text-foreground border border-border">Share</th>
                  <th className="text-left p-2 sm:p-3 font-semibold text-foreground border border-border">Rationale</th>
                </tr>
              </thead>
              <tbody>
                {ukProjection.map((row, index) => <tr key={index} className={index % 2 === 0 ? "bg-muted/30" : "bg-background"}>
                    <td className="p-2 sm:p-3 font-medium text-foreground border border-border">{row.year}</td>
                    <td className="p-2 sm:p-3 font-semibold text-primary border border-border">{row.share}</td>
                    <td className="p-2 sm:p-3 text-muted-foreground border border-border">{row.rationale}</td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Global Expansion */}
      <div className="mt-6 sm:mt-8">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          <h4 className="text-base sm:text-lg font-semibold text-foreground">Global Expansion (Starting 2028)</h4>
        </div>
        
        {/* Why Global Assumption is Defensible */}
        <div className="p-3 sm:p-4 rounded-xl bg-green-500/10 border border-green-500/30 mb-4">
          <p className="text-xs sm:text-sm font-semibold text-green-700 dark:text-green-400 mb-2">
            ✔ Same market-share percentages are defensible internationally because:
          </p>
          <ul className="text-[10px] sm:text-xs text-muted-foreground space-y-1 ml-4">
            <li>• Real estate sectors in US/EU have similar fragmentation</li>
            <li>• AI adoption rates globally mirror the UK (35–36% CAGR)</li>
            <li>• The category is globally underserved</li>
            <li>• No integration required means universal onboarding</li>
          </ul>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="min-w-[450px] px-4 sm:px-0">
            <table className="w-full border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-primary/10">
                  <th className="text-left p-2 sm:p-3 font-semibold text-foreground border border-border">Year</th>
                  <th className="text-left p-2 sm:p-3 font-semibold text-foreground border border-border">UK</th>
                  <th className="text-left p-2 sm:p-3 font-semibold text-foreground border border-border">Global</th>
                  <th className="text-left p-2 sm:p-3 font-semibold text-foreground border border-border">Notes</th>
                </tr>
              </thead>
              <tbody>
                {globalProjection.map((row, index) => <tr key={index} className={index % 2 === 0 ? "bg-muted/30" : "bg-background"}>
                    <td className="p-2 sm:p-3 font-medium text-foreground border border-border">{row.year}</td>
                    <td className="p-2 sm:p-3 font-semibold text-primary border border-border">{row.ukShare}</td>
                    <td className="p-2 sm:p-3 font-semibold text-primary border border-border">{row.globalShare}</td>
                    <td className="p-2 sm:p-3 text-muted-foreground border border-border">{row.notes}</td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Investor Thesis */}
      <div className="mt-6 sm:mt-8 p-4 sm:p-6 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/30">
        <div className="flex items-start gap-2 sm:gap-3">
          <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-primary mt-0.5 sm:mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-foreground text-sm sm:text-base mb-2">Market-Share Thoughts</h4>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              "Given the category white space, frictionless adoption, strong adoption tailwinds (65% reinvesting in AI), and global expansion from 2028, Hobson can credibly reach{" "}
              <span className="font-semibold text-primary">6% UK market share</span> and{" "}
              <span className="font-semibold text-primary">2–4% in new international markets</span> by 2030 — achieving{" "}
              <span className="font-semibold text-primary">8–10% combined share</span> as category leader."
            </p>
          </div>
        </div>
      </div>
    </div>;
};
export default MarketShareJustificationVisual;