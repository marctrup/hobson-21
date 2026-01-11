import React from "react";
import { Card } from "@/components/ui/card";
import {
  Building2,
  Globe,
  Users,
  Calculator,
  TrendingUp,
  DollarSign,
  CheckCircle,
  FileText,
  Target,
  Scale,
  Banknote,
  Percent,
  Link as LinkIcon,
} from "lucide-react";

const AssumptionsVisual = () => {
  return (
    <div className="space-y-8">
      {/* Executive Summary */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground mb-2">Model Assumptions Overview</h2>
            <p className="text-muted-foreground leading-relaxed">
              All projections are grounded in published government statistics, OECD benchmarks, and validated cost models. 
              Our conservative approach uses midpoint estimates within evidence-based ranges—a methodology preferred by institutional investors.
            </p>
          </div>
        </div>
      </Card>

      {/* Key Assumptions Matrix */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          Key Assumptions Summary
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-foreground bg-muted/30">Assumption Category</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground bg-muted/30">Value</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground bg-muted/30">Source / Basis</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50 bg-white">
                <td className="py-3 px-4 font-medium">UK Addressable Operators</td>
                <td className="py-3 px-4 text-primary font-bold">235,200</td>
                <td className="py-3 px-4 text-muted-foreground">ONS Real Estate Activities</td>
              </tr>
              <tr className="border-b border-border/50 bg-muted/10">
                <td className="py-3 px-4 font-medium">Global Addressable Operators</td>
                <td className="py-3 px-4 text-primary font-bold">4.23M</td>
                <td className="py-3 px-4 text-muted-foreground">18× UK baseline (OECD markets)</td>
              </tr>
              <tr className="border-b border-border/50 bg-white">
                <td className="py-3 px-4 font-medium">UK Penetration (2031)</td>
                <td className="py-3 px-4 text-primary font-bold">1.8%</td>
                <td className="py-3 px-4 text-muted-foreground">Conservative SaaS benchmark</td>
              </tr>
              <tr className="border-b border-border/50 bg-muted/10">
                <td className="py-3 px-4 font-medium">Global Penetration (2031)</td>
                <td className="py-3 px-4 text-primary font-bold">0.8%</td>
                <td className="py-3 px-4 text-muted-foreground">Phased rollout from 2028</td>
              </tr>
              <tr className="border-b border-border/50 bg-white">
                <td className="py-3 px-4 font-medium">Churn Rate (Maturity)</td>
                <td className="py-3 px-4 text-primary font-bold">8%</td>
                <td className="py-3 px-4 text-muted-foreground">Competitive for SMB SaaS</td>
              </tr>
              <tr className="border-b border-border/50 bg-muted/10">
                <td className="py-3 px-4 font-medium">Gross Margin</td>
                <td className="py-3 px-4 text-primary font-bold">88%</td>
                <td className="py-3 px-4 text-muted-foreground">Low infra + negligible onboarding</td>
              </tr>
              <tr className="border-b border-border/50 bg-white">
                <td className="py-3 px-4 font-medium">Net Margin (at Scale)</td>
                <td className="py-3 px-4 text-primary font-bold">40–55%</td>
                <td className="py-3 px-4 text-muted-foreground">Lean cost structure</td>
              </tr>
              <tr className="bg-muted/10">
                <td className="py-3 px-4 font-medium">AI Onboarding Cost</td>
                <td className="py-3 px-4 text-primary font-bold">£0.60/unit</td>
                <td className="py-3 px-4 text-muted-foreground">Validated OpenAI 5.1 Mini</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Market Size Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* UK Market */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            UK Real Estate Market
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-primary/5 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary">5.6M</div>
              <div className="text-xs text-muted-foreground">Total UK Businesses</div>
            </div>
            <div className="bg-primary/10 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary">235,200</div>
              <div className="text-xs text-muted-foreground">Real Estate (4.2%)</div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground mb-4 flex items-center gap-1">
            <LinkIcon className="w-3 h-3" />
            Source: ONS – Real estate activities by employment size
          </div>

          {/* Business Size Breakdown */}
          <h4 className="text-sm font-semibold text-foreground mb-2">Size Breakdown</h4>
          <div className="space-y-2">
            {[
              { size: "Small (1–9)", pct: "96.0%", count: "225,792" },
              { size: "Medium (10–49)", pct: "2.7%", count: "6,350" },
              { size: "Large (50–249)", pct: "0.6%", count: "1,411" },
              { size: "Enterprise (250+)", pct: "0.1%", count: "235" },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm py-1 border-b border-border/30">
                <span className="text-muted-foreground">{item.size}</span>
                <span className="text-foreground font-medium">{item.pct}</span>
                <span className="text-primary font-bold">{item.count}</span>
              </div>
            ))}
          </div>
          <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <LinkIcon className="w-3 h-3" />
            Source: BEIS / ONS
          </div>
        </Card>

        {/* Global Market */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            Global Market Scaling
          </h3>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-foreground">10–14%</div>
                  <div className="text-xs text-muted-foreground">RE share of GDP (OECD)</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-foreground">4–5%</div>
                  <div className="text-xs text-muted-foreground">RE share of businesses</div>
                </div>
              </div>
            </div>

            <div className="bg-muted/20 rounded-lg p-4">
              <h4 className="text-sm font-semibold mb-2">Business Density (per 1,000 pop.)</h4>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-white rounded p-2">
                  <div className="font-bold text-primary">75-80</div>
                  <div className="text-muted-foreground">UK</div>
                </div>
                <div className="bg-white rounded p-2">
                  <div className="font-bold text-primary">60-70</div>
                  <div className="text-muted-foreground">EU avg</div>
                </div>
                <div className="bg-white rounded p-2">
                  <div className="font-bold text-primary">70-80</div>
                  <div className="text-muted-foreground">USA</div>
                </div>
                <div className="bg-white rounded p-2">
                  <div className="font-bold text-primary">65</div>
                  <div className="text-muted-foreground">OECD</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-primary/5 rounded-lg p-3">
                <div className="text-lg font-bold text-foreground">1.38B</div>
                <div className="text-xs text-muted-foreground">OECD Pop.</div>
              </div>
              <div className="bg-primary/5 rounded-lg p-3">
                <div className="text-lg font-bold text-foreground">67M</div>
                <div className="text-xs text-muted-foreground">UK Pop.</div>
              </div>
              <div className="bg-primary/10 rounded-lg p-3">
                <div className="text-lg font-bold text-primary">18×</div>
                <div className="text-xs text-muted-foreground">Multiplier</div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary">≈ 4.2M</div>
              <div className="text-sm text-muted-foreground">Global RE Businesses (Conservative)</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Cost Structure */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary" />
          Cost Structure Assumptions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Fixed Costs */}
          <div className="bg-muted/10 rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Fixed Team (£415k/yr)
            </h4>
            <div className="space-y-2 text-sm">
              {[
                { role: "CEO", cost: "£120k" },
                { role: "Head of Marketing", cost: "£70k" },
                { role: "Product Owner", cost: "£85k" },
                { role: "Head of Support", cost: "£55k" },
                { role: "Head of Sales", cost: "£85k" },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between text-muted-foreground">
                  <span>{item.role}</span>
                  <span className="font-medium text-foreground">{item.cost}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Variable Costs */}
          <div className="bg-muted/10 rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Percent className="w-4 h-4 text-primary" />
              Variable (32% of Rev)
            </h4>
            <div className="space-y-2 text-sm">
              {[
                { area: "Engineering", pct: "12%" },
                { area: "Digital Marketing", pct: "8%" },
                { area: "Customer Success", pct: "5%" },
                { area: "Sales/SDR Support", pct: "4%" },
                { area: "G&A", pct: "3%" },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between text-muted-foreground">
                  <span>{item.area}</span>
                  <span className="font-medium text-foreground">{item.pct}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Infrastructure */}
          <div className="bg-muted/10 rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-primary" />
              AI & Infra (12% of Rev)
            </h4>
            <div className="space-y-2 text-sm">
              {[
                { area: "Doc Storage + Vector DB", pct: "4%" },
                { area: "LLM Query API", pct: "5%" },
                { area: "K-Graph Compute", pct: "2%" },
                { area: "Monitoring", pct: "1%" },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between text-muted-foreground">
                  <span>{item.area}</span>
                  <span className="font-medium text-foreground">{item.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Onboarding Costs */}
        <div className="mt-6 border-t border-border pt-4">
          <h4 className="font-semibold text-foreground mb-3">AI Onboarding Cost Per Client (One-Off)</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-xl font-bold text-green-700">£3–4</div>
              <div className="text-xs text-green-600">Small (5 units)</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-xl font-bold text-green-700">£60</div>
              <div className="text-xs text-green-600">Medium (100 units)</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-xl font-bold text-green-700">£600</div>
              <div className="text-xs text-green-600">Large (1,000 units)</div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Ultra-low onboarding cost enables frictionless self-serve adoption from 2027
          </p>
        </div>
      </Card>

      {/* Financial & Accounting Assumptions */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Financial & Accounting Policy
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Model Parameters</h4>
            {[
              { label: "Accounting Basis", value: "Cash basis" },
              { label: "Revenue Recognition", value: "On receipt" },
              { label: "Depreciation & Amortisation", value: "£0" },
              { label: "Capital Expenditure", value: "£0 (all expensed)" },
              { label: "Working Capital Impact", value: "£0" },
              { label: "Corporation Tax Rate", value: "20%" },
              { label: "Model Horizon", value: "2026–2031" },
              { label: "Model Currency", value: "GBP" },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm border-b border-border/30 pb-2">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-medium text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Cost Classification</h4>
            {[
              { label: "Operating Costs", value: "Expensed" },
              { label: "R&D Treatment", value: "Expensed, not capitalised" },
              { label: "Infrastructure", value: "Included in COGS" },
              { label: "Sales & Marketing", value: "Operating Expenses" },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm border-b border-border/30 pb-2">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-medium text-foreground">{item.value}</span>
              </div>
            ))}

            <h4 className="font-semibold text-foreground mt-4">Model Governance</h4>
            {[
              { label: "Primary Outputs", value: "P&L, Cashflow, Balance Sheet" },
              { label: "Revenue Source", value: "Revenue sheet" },
              { label: "Cost Source", value: "Costs sheet" },
              { label: "Balance Check", value: "Assets = Liabilities + Equity" },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm border-b border-border/30 pb-2">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-medium text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Market Data References */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Supporting Market Data
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              stat: "$303B → $1.8T",
              label: "AI in RE Market (2025–2030)",
              cagr: "35–36% CAGR",
              source: "Business Research Company / Maximise Market Research",
            },
            {
              stat: "10%+",
              label: "NOI Increase with AI",
              cagr: "Efficiency & CX gains",
              source: "McKinsey & Company",
            },
            {
              stat: "49%",
              label: "RE Owners Seeing Cost Cuts",
              cagr: "Up to 20% OpEx savings",
              source: "Forbes",
            },
            {
              stat: "£6B UK / £708B Global",
              label: "Efficiency Savings TAM",
              cagr: "Based on 20% time savings",
              source: "Calculated from ONS data",
            },
          ].map((item, idx) => (
            <div key={idx} className="bg-muted/10 rounded-lg p-4">
              <div className="text-xl font-bold text-primary">{item.stat}</div>
              <div className="text-sm font-medium text-foreground">{item.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{item.cagr}</div>
              <div className="text-xs text-muted-foreground italic mt-2 flex items-center gap-1">
                <LinkIcon className="w-3 h-3" />
                {item.source}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Why Assumptions Are Credible */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100/50 border-green-200">
        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          Why These Assumptions Are Credible
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Uses published national statistics (ONS, BEIS), not guesswork",
            "Scales only across markets where Hobson can launch (OECD)",
            "Avoids inflated 'world population' errors common in startup models",
            "18× multiplier is midpoint of 15–20× feasible range",
            "Vector DB + K-Graph architecture reduces LLM calls (biggest savings)",
            "AI ingestion is done once per document → £0.60 per unit",
            "Query engine only hits LLM for precision → low token spend",
            "No integration teams, no onboarding teams required",
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-foreground">{item}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Investor Disclosure */}
      <Card className="p-4 bg-amber-50 border-amber-200">
        <h4 className="text-sm font-semibold text-amber-800 mb-2">Investor Disclosure Notes</h4>
        <ul className="text-xs text-amber-700 space-y-1">
          <li>• Model excludes working capital timing adjustments for clarity</li>
          <li>• Flat 20% tax rate applied; no NOL modelling</li>
          <li>• Cash-basis forecast with no AR/AP/deferred revenue recognition</li>
          <li>• Revenue modelled on annualised recurring basis</li>
          <li>• Churn rates reflect early-stage cohorts; expected to stabilise at 6–8%</li>
        </ul>
      </Card>
    </div>
  );
};

export default AssumptionsVisual;
