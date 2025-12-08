import React from "react";
import { TrendingUp, Users, Building2, Repeat, CreditCard, Target } from "lucide-react";

const RevenueModelVisual = () => {
  const revenueStreams = [
    {
      icon: CreditCard,
      title: "Subscription Revenue",
      description: "Monthly recurring revenue from Essential (£19.50), Essential Plus (£49.75), and Enterprise (£148.50) tiers.",
      highlight: "Primary revenue driver",
    },
    {
      icon: Repeat,
      title: "Usage-Based Revenue",
      description: "Additional HEU top-up purchases (£15 for 150 HEUs) when users exceed their monthly allocation.",
      highlight: "High-margin upsell",
    },
    {
      icon: Users,
      title: "Enterprise Contracts",
      description: "Custom pricing for large property management firms with high-volume document processing needs.",
      highlight: "Higher ARPU segment",
    },
  ];

  const unitEconomics = [
    { metric: "Average Revenue Per User (ARPU)", value: "£35-50/month", note: "Blended across tiers" },
    { metric: "Gross Margin", value: "75-85%", note: "Low AI processing costs" },
    { metric: "Customer Acquisition Cost (CAC)", value: "£50-100", note: "Frictionless onboarding" },
    { metric: "LTV:CAC Ratio", value: "10:1+", note: "Target for SaaS health" },
    { metric: "Payback Period", value: "1-2 months", note: "Rapid break-even" },
  ];

  const growthDrivers = [
    {
      icon: Building2,
      title: "Land & Expand",
      description: "Start with one department, expand across entire property portfolios as value is demonstrated.",
    },
    {
      icon: Target,
      title: "Viral Referrals",
      description: "Fragmented market structure enables rapid word-of-mouth growth among property professionals.",
    },
    {
      icon: TrendingUp,
      title: "Usage Growth",
      description: "As users process more documents and ask more questions, HEU consumption naturally increases.",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-foreground mb-2">Revenue Model</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Subscription + usage-based pricing with high gross margins and rapid payback
        </p>
      </div>

      {/* Revenue Streams */}
      <div>
        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary" />
          Revenue Streams
        </h4>
        <div className="grid md:grid-cols-3 gap-4">
          {revenueStreams.map((stream, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <stream.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold text-foreground text-sm mb-1">{stream.title}</h5>
                  <p className="text-xs text-muted-foreground mb-2">{stream.description}</p>
                  <span className="inline-block px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full font-medium">
                    {stream.highlight}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Unit Economics */}
      <div>
        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Unit Economics
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-primary/10">
                <th className="text-left p-3 text-sm font-semibold text-foreground border border-border">Metric</th>
                <th className="text-left p-3 text-sm font-semibold text-foreground border border-border">Value</th>
                <th className="text-left p-3 text-sm font-semibold text-foreground border border-border">Note</th>
              </tr>
            </thead>
            <tbody>
              {unitEconomics.map((row, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-muted/30" : "bg-background"}>
                  <td className="p-3 text-sm font-medium text-foreground border border-border">{row.metric}</td>
                  <td className="p-3 text-sm font-semibold text-primary border border-border">{row.value}</td>
                  <td className="p-3 text-sm text-muted-foreground border border-border">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Growth Drivers */}
      <div>
        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Growth Drivers
        </h4>
        <div className="grid md:grid-cols-3 gap-4">
          {growthDrivers.map((driver, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-gradient-to-br from-green-500/5 to-green-500/10 border border-green-500/20"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <driver.icon className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h5 className="font-semibold text-foreground text-sm mb-1">{driver.title}</h5>
                  <p className="text-xs text-muted-foreground">{driver.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Formula */}
      <div className="p-6 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/30">
        <h4 className="font-semibold text-foreground mb-3">Revenue Formula</h4>
        <div className="text-center py-4">
          <p className="text-lg font-mono text-foreground">
            <span className="text-primary font-semibold">MRR</span> = (Subscribers × Tier Price) + (Top-up Purchases) + (Enterprise Contracts)
          </p>
        </div>
        <p className="text-sm text-muted-foreground text-center mt-2">
          Predictable recurring revenue with usage upside and enterprise expansion potential
        </p>
      </div>
    </div>
  );
};

export default RevenueModelVisual;