import React from "react";
import { TrendingUp, Target, Zap, Globe, DollarSign, BarChart3, Building2, Layers } from "lucide-react";

const MarketShareJustificationVisual = () => {
  const ukProjection = [
    { year: "2026", share: "-", rationale: "Pilot validation only" },
    { year: "2027", share: "0.2%", rationale: "UK commercial launch + first conversions" },
    { year: "2028", share: "0.7%", rationale: "Strong UK adoption + compounding referrals" },
    { year: "2029", share: "1.5%", rationale: "Brand leadership in UK emerges" },
    { year: "2030", share: "3-5%", rationale: "Category leader in UK" },
  ];

  const globalProjection = [
    { year: "2028", ukShare: "0.7%", globalShare: "0.3%", notes: "Launch year; initial adoption" },
    { year: "2029", ukShare: "1.5%", globalShare: "0.8%", notes: "Growing credibility + referrals" },
    { year: "2030", ukShare: "3%", globalShare: "1-2%", notes: "Mature positioning + brand leadership" },
  ];

  const justificationPoints = [
    {
      icon: Building2,
      title: "Fragmented Market Structure",
      description: "225,792 small firms, 6,350 medium, 1,411 large, 235 enterprise — lightweight AI spreads rapidly through referrals.",
    },
    {
      icon: Target,
      title: "White-Space Positioning",
      description: "First AI built solely for Document Intelligence → Retrieval → Clarity → Referenced Answers. No direct competitor.",
    },
    {
      icon: TrendingUp,
      title: "Benchmark Precedent",
      description: "Vertical AI companies (EliseAI, StanAI, Cresta) reached 1–3% penetration in 3–5 years with similar dynamics.",
    },
    {
      icon: Zap,
      title: "AI Adoption Tailwinds",
      description: "65% of organisations plan to increase AI investment (Deloitte). Up to 20% efficiency gain achievable (Forbes).",
    },
    {
      icon: DollarSign,
      title: "Favourable Unit Economics",
      description: "~£1.60–£2.00 per unit onboarding cost. High gross margin enables aggressive SMB and enterprise scaling.",
    },
    {
      icon: Globe,
      title: "Global Replicability",
      description: "Similar market structure, AI adoption rates, and universal document needs support international expansion.",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-foreground mb-2">Market Share Justification</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Why Hobson can credibly capture 1–3% of the UK market and replicate this globally by 2030
        </p>
      </div>

      {/* Justification Points Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {justificationPoints.map((point, index) => (
          <div
            key={index}
            className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 hover:border-primary/40 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <point.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-sm mb-1">{point.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{point.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* UK Market Share Projection */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h4 className="text-lg font-semibold text-foreground">UK Market Share Projection</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-primary/10">
                <th className="text-left p-3 text-sm font-semibold text-foreground border border-border">Year</th>
                <th className="text-left p-3 text-sm font-semibold text-foreground border border-border">UK Market Share</th>
                <th className="text-left p-3 text-sm font-semibold text-foreground border border-border">Rationale</th>
              </tr>
            </thead>
            <tbody>
              {ukProjection.map((row, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-muted/30" : "bg-background"}>
                  <td className="p-3 text-sm font-medium text-foreground border border-border">{row.year}</td>
                  <td className="p-3 text-sm font-semibold text-primary border border-border">{row.share}</td>
                  <td className="p-3 text-sm text-muted-foreground border border-border">{row.rationale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Global Expansion */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-primary" />
          <h4 className="text-lg font-semibold text-foreground">Global Expansion (Starting 2028)</h4>
        </div>
        
        {/* Why Global Assumption is Defensible */}
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 mb-4">
          <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">
            ✔ Same market-share percentages are defensible internationally because:
          </p>
          <ul className="text-xs text-muted-foreground space-y-1 ml-4">
            <li>• Real estate sectors in US/EU have similar fragmentation and document-heavy workflows</li>
            <li>• AI adoption rates globally mirror the UK (35–36% CAGR worldwide)</li>
            <li>• The category is globally underserved — Hobson becomes a first-mover internationally</li>
            <li>• No integration required means universally easy onboarding</li>
          </ul>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-primary/10">
                <th className="text-left p-3 text-sm font-semibold text-foreground border border-border">Year</th>
                <th className="text-left p-3 text-sm font-semibold text-foreground border border-border">UK Share</th>
                <th className="text-left p-3 text-sm font-semibold text-foreground border border-border">Global Share (New Markets)</th>
                <th className="text-left p-3 text-sm font-semibold text-foreground border border-border">Notes</th>
              </tr>
            </thead>
            <tbody>
              {globalProjection.map((row, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-muted/30" : "bg-background"}>
                  <td className="p-3 text-sm font-medium text-foreground border border-border">{row.year}</td>
                  <td className="p-3 text-sm font-semibold text-primary border border-border">{row.ukShare}</td>
                  <td className="p-3 text-sm font-semibold text-primary border border-border">{row.globalShare}</td>
                  <td className="p-3 text-sm text-muted-foreground border border-border">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Investor Thesis */}
      <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/30">
        <div className="flex items-start gap-3">
          <Layers className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-foreground mb-2">Market-Share Thesis</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              "Given the category white space, vertical AI penetration benchmarks (1–3%), strong adoption tailwinds (65% reinvesting in AI), 
              and global expansion beginning in 2028, Hobson can credibly reach <span className="font-semibold text-primary">3% UK market share</span> and{" "}
              <span className="font-semibold text-primary">1–2% in new international markets</span> by 2030 — achieving{" "}
              <span className="font-semibold text-primary">4–5% combined share</span> as the category leader in AI document intelligence."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketShareJustificationVisual;
