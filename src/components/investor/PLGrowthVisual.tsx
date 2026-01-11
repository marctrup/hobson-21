import { Info, DollarSign, Settings, TrendingUp, Users } from "lucide-react";
import plForecastChart from "@/assets/pl-forecast-chart.png";

const PLGrowthVisual = () => {
  const variableCosts = [
    { category: "Engineering & Design", percentage: "10–14%" },
    { category: "Marketing Execution", percentage: "5–8%" },
    { category: "Customer Success", percentage: "3–5%" },
    { category: "Sales Commissions", percentage: "3–5%" },
    { category: "G&A", percentage: "2–3%" },
  ];

  const processingCosts = [
    { type: "Complex (Leases)", cost: "~$0.40" },
    { type: "Medium (Deeds)", cost: "~$0.10" },
    { type: "Simple (Notices)", cost: "~$0.02–0.03" },
  ];

  const onboardingCosts = [
    { size: "Small", cost: "£3–£4" },
    { size: "Medium", cost: "£74–£76" },
    { size: "Large", cost: "£600–£700" },
  ];

  return (
    <div className="space-y-6">
      {/* Cost Structure & Unit Economics Header */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Cost Structure & Unit Economics</h3>
        </div>
      </div>

      {/* Fixed Operating Base */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-primary" />
          <h4 className="text-lg font-semibold text-foreground">Fixed Operating Base</h4>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
            <span className="text-sm text-muted-foreground">Fixed internal team</span>
            <span className="text-sm font-semibold text-foreground">£415k / year</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
            <span className="text-sm text-muted-foreground">Variable outsourced costs</span>
            <span className="text-sm font-semibold text-foreground">32% of revenue</span>
          </div>
          
          <div className="pl-4 space-y-2 border-l-2 border-primary/30">
            {variableCosts.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{item.category}</span>
                <span className="text-sm font-medium text-foreground">{item.percentage}</span>
              </div>
            ))}
          </div>
          
          <div className="pt-4 border-t border-border space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">AI & infrastructure COGS</span>
              <span className="text-sm font-semibold text-foreground">~12% of revenue</span>
            </div>
            <div className="flex justify-between items-center bg-primary/5 p-3 rounded-lg">
              <span className="text-sm font-medium text-foreground">Expected gross margin</span>
              <span className="text-sm font-bold text-primary">90%+</span>
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding and AI Economics */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h4 className="text-lg font-semibold text-foreground mb-4">Onboarding and AI Economics</h4>
        
        {/* Processing Cost by Document */}
        <div className="mb-6">
          <h5 className="text-sm font-medium text-foreground mb-3">Processing Cost by Document</h5>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 text-xs font-semibold text-foreground">Type</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-foreground">Cost</th>
                </tr>
              </thead>
              <tbody>
                {processingCosts.map((item, index) => (
                  <tr key={index} className="border-b border-border/50">
                    <td className="py-2 px-3 text-sm text-muted-foreground">{item.type}</td>
                    <td className="py-2 px-3 text-sm font-medium text-foreground text-right">{item.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Size / Onboarding Cost */}
        <div className="mb-4">
          <h5 className="text-sm font-medium text-foreground mb-3">Onboarding Cost by Customer Size</h5>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 text-xs font-semibold text-foreground">Customer Size</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-foreground">Onboarding Cost</th>
                </tr>
              </thead>
              <tbody>
                {onboardingCosts.map((item, index) => (
                  <tr key={index} className="border-b border-border/50">
                    <td className="py-2 px-3 text-sm text-muted-foreground">{item.size}</td>
                    <td className="py-2 px-3 text-sm font-medium text-foreground text-right">{item.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-center">
          <p className="text-sm font-medium text-foreground">Ultra-low onboarding costs enable frictionless scaling.</p>
        </div>
      </div>

      {/* P/L & Profitability Profile */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h4 className="text-lg font-semibold text-foreground">P/L & Profitability Profile</h4>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-2">
            <span className="text-sm text-muted-foreground">Infrastructure / COGS</span>
            <span className="text-sm font-medium text-foreground">5–10% of revenue</span>
          </div>
          <div className="flex justify-between items-center p-2">
            <span className="text-sm text-muted-foreground">Operating costs</span>
            <span className="text-sm font-medium text-foreground">30–35% early → ~20% by 2031</span>
          </div>
          <div className="flex justify-between items-center p-2">
            <span className="text-sm text-muted-foreground">Net profit by 2031</span>
            <span className="text-sm font-semibold text-primary">~£4.5M</span>
          </div>
          <div className="flex justify-between items-center p-2">
            <span className="text-sm text-muted-foreground">EBITDA breakeven</span>
            <span className="text-sm font-medium text-foreground">ARR &gt; £5M</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-primary/5 rounded-lg">
            <span className="text-sm font-medium text-foreground">Net margins at scale</span>
            <span className="text-sm font-bold text-primary">40–55%</span>
          </div>
        </div>
      </div>

      {/* Customer Acquisition Economics */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-primary" />
          <h4 className="text-lg font-semibold text-foreground">Customer Acquisition Economics</h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">CAC Spend</p>
            <p className="text-lg font-bold text-foreground">12%</p>
            <p className="text-xs text-muted-foreground">of revenue</p>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">5-Year LTV</p>
            <p className="text-lg font-bold text-primary">£2,478.60</p>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">LTV : CAC</p>
            <p className="text-lg font-bold text-foreground">7× to 41×</p>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">CAC Payback</p>
            <p className="text-lg font-bold text-foreground">1.5–9 mo</p>
          </div>
        </div>
      </div>

      {/* Explainer Box */}
      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-3">
        <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm text-foreground font-medium mb-1">
            The following tabs explain how this growth is achievable
          </p>
          <p className="text-xs text-muted-foreground">
            Review the Revenue Assumptions and Cost Assumptions tabs for detailed methodology and supporting data.
          </p>
        </div>
      </div>

      {/* P/L Forecast Chart */}
      <div className="bg-white rounded-lg border border-border/50 p-4">
        <img
          src={plForecastChart}
          alt="Hobson P/L Forecast 2027-2031 showing Infrastructure/COGS, Operating Costs, and Net Profit growth"
          className="w-full h-auto rounded-lg"
        />
      </div>

      {/* Key metrics summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
          <div className="text-amber-600 font-semibold text-sm mb-1">Infrastructure / COGS</div>
          <div className="text-2xl font-bold text-amber-700">5-10%</div>
          <div className="text-xs text-amber-600/80">of revenue</div>
        </div>
        <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 text-center">
          <div className="text-sky-600 font-semibold text-sm mb-1">Operating Costs</div>
          <div className="text-2xl font-bold text-sky-700">30-35%</div>
          <div className="text-xs text-sky-600/80">of revenue (early years)</div>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
          <div className="text-emerald-600 font-semibold text-sm mb-1">Net Profit</div>
          <div className="text-2xl font-bold text-emerald-700">£4.5M</div>
          <div className="text-xs text-emerald-600/80">by 2031</div>
        </div>
      </div>
    </div>
  );
};

export default PLGrowthVisual;
