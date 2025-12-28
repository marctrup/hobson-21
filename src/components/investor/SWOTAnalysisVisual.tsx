import React from 'react';
import { TrendingUp, AlertTriangle, CheckCircle2, XCircle, Zap, Lightbulb, Target } from 'lucide-react';

export const SWOTAnalysisVisual = () => {
  const pillarsData = [
    { pillar: "Personalization", rating: 4, explanation: "We work closely with each client, understanding their needs and adapting Hobson to their specific workflows. Every partner has undergone individual discovery and follow-up, but the process is still conducted manually rather than automated." },
    { pillar: "Resolution", rating: 2, explanation: "Because we're an early-stage company, we've had a few breakdowns, but we also lack formal processes to recover from them. Resolution is our most enormous future gap." },
    { pillar: "Integrity", rating: 4, explanation: "Transparency is at the core of how we communicate. We're clear about what Hobson can and can't do, and our pricing model reflects that honesty." },
    { pillar: "Time & Effort", rating: 5, explanation: "Hobson is built to reduce friction and effort by making every interaction intuitive and efficient." },
    { pillar: "Expectations", rating: 4, explanation: "We're focused on the MVP and what it can do today as defined. But as trust grows, we must shift from 'it was expected' to 'beating expectations'." },
    { pillar: "Empathy", rating: 4, explanation: "We've shaped the MVP around real client pain. Our early interactions — especially discovery and feedback — show we listen closely." }
  ];

  const strengths = {
    productTechnical: [
      "AI-native architecture built specifically for real estate documents",
      "Fast, reference-backed answers that increase trust and reduce risk",
      "Lightweight, low-friction user experience requiring little to no onboarding",
      "Strong Time & Effort performance",
      "Architecture designed to evolve from retrieval to insight to proactive assistance"
    ],
    brandPositioning: [
      "Clear brand centred on clarity, trust, and simplicity",
      "Sage archetype, reinforced by the owl, positions Hobson as a calm, dependable advisor",
      "Consistent visual identity, metaphors, and tone ('GPS for documents', 'desk lamp illuminating truth')",
      "HUE coin adds potential for engagement, onboarding incentives, and loyalty mechanics",
      "Transparent, non-hyped messaging enhances perceived integrity"
    ],
    customerAlignment: [
      "Product shaped directly by real customer pain (document overload, fragmented systems, admin bottlenecks)",
      "High empathy and personalisation in MVP development (Six Pillars: 4/5)",
      "Early partners value reliability, clarity, and guidance—matching Hobson's intended personality"
    ],
    marketFitTiming: [
      "Strong fit with growing demand for AI-driven document analysis, automation, and accuracy",
      "Real estate AI market showing sustained high growth rates",
      "Regulatory tightening and compliance pressure increase demand for source-backed retrieval"
    ]
  };

  const weaknesses = {
    product: [
      "MVP focused on retrieval; deeper analytics and insight are still in development",
      "Output quality depends on document quality and coverage",
      "Resolution processes are not yet formalised",
      "Onboarding automation is limited; much support is currently manual"
    ],
    brandCommunication: [
      "Emotional storytelling is still light; the functional story is stronger than the human story",
      "Users often see Hobson as 'helpful' instead of 'strategic' or 'insightful'",
      "Few public ambassadors, testimonials, or spokespersons",
      "Low visibility because of the focus on quiet MVP partnerships"
    ],
    commercial: [
      "Limited long-term performance data or proven case studies",
      "Small team means constrained bandwidth across product, marketing, and support",
      "Heavy reliance on a small number of partner clients for early feedback"
    ]
  };

  const opportunities = {
    marketIndustry: [
      "Real estate is moving towards automation, compliance, and faster decision-making",
      "Document overload is increasing, making document-native AI more valuable",
      "Regulatory changes (e.g. renters' reforms, building safety, ESG) drive demand for accurate, referenced information",
      "Early AI adoption rates (10–20%) make a 12% penetration target realistic"
    ],
    brandExpansion: [
      "Develop richer emotional narratives and transformation stories",
      "Build a network of ambassadors and early champions from respected firms",
      "Extend metaphors and messaging to emphasise deeper intelligence and foresight"
    ],
    productCapability: [
      "Add confidence scores, data completeness indicators, and 'show our working' views",
      "Build proactive features: renewal alerts, anomaly detection, risk flags, portfolio summaries",
      "Package templates and industry-specific workflows (e.g. commercial leases, ASTs, service charge packs)"
    ],
    marketingGrowth: [
      "Use the Hobson Choice Quiz and HUE as gamified acquisition and engagement tools",
      "Increase presence on LinkedIn, podcasts, events, and professional forums",
      "Create referral mechanisms and guided onboarding programmes"
    ]
  };

  const threats = {
    competitive: [
      "Fast-moving AI competitors (EliseAI, Trudi, StanAI, Kendal AI)",
      "Legacy systems (Yardi, MRI, Reapit, AppFolio) may add AI layers to close the gap",
      "Low switching costs make client loyalty fragile"
    ],
    marketTechnology: [
      "Sector-wide scepticism if AI tools elsewhere fail visibly or hallucinate",
      "New AI and data privacy regulations may increase compliance burden",
      "Economic pressure might delay software purchases",
      "'AI fatigue' if clients feel overloaded with tools and promises"
    ],
    brandTrust: [
      "A major error in a sensitive document could damage trust early",
      "Inconsistent support or slow resolution could undermine confidence",
      "Competitors with stronger emotional storytelling could capture mindshare"
    ]
  };

  const recommendations = [
    {
      title: "Strengthen Trust & Authenticity",
      items: [
        "Implement confidence scores and data completeness warnings",
        "Create a clear support and resolution process with visible follow-up",
        "Publish early case studies and small 'micro-proofs' from MVP clients"
      ]
    },
    {
      title: "Expand Brand Storytelling",
      items: [
        "Add human testimonials, behind-the-scenes content, and 'day in the life with Hobson' stories",
        "Reuse metaphors (GPS, lamp, compass) consistently",
        "Position Hobson as a long-term clarity partner, not just a tool"
      ]
    },
    {
      title: "Accelerate Market Visibility",
      items: [
        "Increase rhythm and quality of LinkedIn and community engagement",
        "Use the quiz and HUE as recognisable, branded entry points",
        "Develop thought-leadership content aligned with the Sage voice"
      ]
    },
    {
      title: "Enhance Product Differentiation",
      items: [
        "Move deliberately along the path from retrieval to insight to foresight",
        "Create low-touch workflows that allow personalisation at scale",
        "Develop 'Hobson Blueprints' for everyday tasks: lease reviews, renewals, compliance checks"
      ]
    },
    {
      title: "Protect Early Advantage",
      items: [
        "Maintain the 'lightweight, low-cost, no disruption' stance against heavier legacy platforms",
        "Turn MVP clients into long-term advocates through close support and co-creation",
        "Standardise internal processes so the organisation can scale without losing quality"
      ]
    }
  ];

  const renderRating = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${i <= rating ? 'bg-primary' : 'bg-muted'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 p-6 border border-primary/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-start gap-4 mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">SWOT Analysis</h3>
              <p className="text-muted-foreground mt-1">Strategic assessment of Hobson's position in the market</p>
            </div>
          </div>
          <p className="text-sm text-foreground">
            Hobson enters the market with substantial structural advantages: a focused product, a clear brand, and a solution that matches real, urgent needs. The key to moving from promising to category-defining will be making trust explicit and measurable, turning early successes into stories and proof, and building scalable processes beneath the brand and product.
          </p>
        </div>
      </div>

      {/* Vision Statement */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 p-5 border border-primary/20">
        <p className="text-sm text-foreground italic">
          "Hobson will become the intelligence layer real estate runs on, ensuring every operational decision is based on instant, auditable insight rather than manual search, institutional memory, or guesswork."
        </p>
      </div>

      {/* Strengths */}
      <div className="space-y-4">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          Strengths
        </h4>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 p-4 border border-emerald-200/50 dark:border-emerald-800/30">
            <h5 className="font-medium text-foreground text-sm mb-2">Product & Technical</h5>
            <ul className="space-y-1">
              {strengths.productTechnical.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 p-4 border border-emerald-200/50 dark:border-emerald-800/30">
            <h5 className="font-medium text-foreground text-sm mb-2">Brand & Positioning</h5>
            <ul className="space-y-1">
              {strengths.brandPositioning.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 p-4 border border-emerald-200/50 dark:border-emerald-800/30">
            <h5 className="font-medium text-foreground text-sm mb-2">Customer Alignment</h5>
            <ul className="space-y-1">
              {strengths.customerAlignment.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 p-4 border border-emerald-200/50 dark:border-emerald-800/30">
            <h5 className="font-medium text-foreground text-sm mb-2">Market Fit & Timing</h5>
            <ul className="space-y-1">
              {strengths.marketFitTiming.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Pillars Evaluation Matrix */}
      <div className="space-y-3">
        <h5 className="font-medium text-foreground text-sm">Pillars Evaluation Matrix</h5>
        <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/30 p-4 border border-slate-200 dark:border-slate-700/50 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-2 font-medium text-foreground">Pillar</th>
                <th className="text-left py-2 font-medium text-foreground">Rating</th>
                <th className="text-left py-2 font-medium text-foreground">Explanation</th>
              </tr>
            </thead>
            <tbody>
              {pillarsData.map((row, idx) => (
                <tr key={idx} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <td className="py-2 font-medium text-foreground">{row.pillar}</td>
                  <td className="py-2">
                    <div className="flex items-center gap-2">
                      {renderRating(row.rating)}
                      <span className="text-muted-foreground">{row.rating}/5</span>
                    </div>
                  </td>
                  <td className="py-2 text-muted-foreground">{row.explanation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Weaknesses */}
      <div className="space-y-4">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <XCircle className="w-5 h-5 text-rose-600" />
          Weaknesses
        </h4>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="rounded-xl bg-gradient-to-br from-rose-500/10 to-rose-600/10 p-4 border border-rose-200/50 dark:border-rose-800/30">
            <h5 className="font-medium text-foreground text-sm mb-2">Product</h5>
            <ul className="space-y-1">
              {weaknesses.product.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-rose-500/10 to-rose-600/10 p-4 border border-rose-200/50 dark:border-rose-800/30">
            <h5 className="font-medium text-foreground text-sm mb-2">Brand & Communication</h5>
            <ul className="space-y-1">
              {weaknesses.brandCommunication.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-rose-500/10 to-rose-600/10 p-4 border border-rose-200/50 dark:border-rose-800/30">
            <h5 className="font-medium text-foreground text-sm mb-2">Commercial</h5>
            <ul className="space-y-1">
              {weaknesses.commercial.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Opportunities */}
      <div className="space-y-4">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Opportunities
        </h4>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 p-4 border border-blue-200/50 dark:border-blue-800/30">
            <h5 className="font-medium text-foreground text-sm mb-2">Market & Industry</h5>
            <ul className="space-y-1">
              {opportunities.marketIndustry.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 p-4 border border-blue-200/50 dark:border-blue-800/30">
            <h5 className="font-medium text-foreground text-sm mb-2">Brand Expansion</h5>
            <ul className="space-y-1">
              {opportunities.brandExpansion.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 p-4 border border-blue-200/50 dark:border-blue-800/30">
            <h5 className="font-medium text-foreground text-sm mb-2">Product & Capability</h5>
            <ul className="space-y-1">
              {opportunities.productCapability.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 p-4 border border-blue-200/50 dark:border-blue-800/30">
            <h5 className="font-medium text-foreground text-sm mb-2">Marketing & Growth</h5>
            <ul className="space-y-1">
              {opportunities.marketingGrowth.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Threats */}
      <div className="space-y-4">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          Threats
        </h4>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/10 p-4 border border-amber-200/50 dark:border-amber-800/30">
            <h5 className="font-medium text-foreground text-sm mb-2">Competitive</h5>
            <ul className="space-y-1">
              {threats.competitive.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/10 p-4 border border-amber-200/50 dark:border-amber-800/30">
            <h5 className="font-medium text-foreground text-sm mb-2">Market & Technology</h5>
            <ul className="space-y-1">
              {threats.marketTechnology.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/10 p-4 border border-amber-200/50 dark:border-amber-800/30">
            <h5 className="font-medium text-foreground text-sm mb-2">Brand & Trust</h5>
            <ul className="space-y-1">
              {threats.brandTrust.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-4">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          Recommendations
        </h4>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((rec, idx) => (
            <div key={idx} className="rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 p-4 border border-primary/20">
              <h5 className="font-medium text-foreground text-sm mb-2">{idx + 1}. {rec.title}</h5>
              <ul className="space-y-1">
                {rec.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
