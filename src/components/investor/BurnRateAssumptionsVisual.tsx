import React from 'react';
import { Info, TrendingUp, Users, Server, Target, Calculator, BarChart3, Lightbulb, PoundSterling } from 'lucide-react';

const BurnRateAssumptionsVisual = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-foreground mb-2">Burn Rate Assumptions (2027–2031)</h3>
        <p className="text-sm text-muted-foreground">A clear and defensible financial model for monthly burn, profitability timing, and fundraise needs</p>
      </div>

      {/* Funding Requirement - HERO SECTION */}
      <div className="bg-gradient-to-r from-primary/10 to-purple-600/10 border-2 border-primary/30 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-primary/20 rounded-full">
            <PoundSterling className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-foreground">Recommended Seed Raise</h4>
            <p className="text-sm text-muted-foreground">What you actually need</p>
          </div>
        </div>
        
        <div className="text-center mb-4">
          <p className="text-4xl font-bold text-primary">£1.5M – £2.2M</p>
          <p className="text-sm text-muted-foreground mt-1">Covers 18–24 months and early commercialisation</p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-4">
          <div className="bg-background/60 rounded-lg p-2 sm:p-3 text-center">
            <p className="text-sm sm:text-lg font-bold text-foreground">£500k–£700k</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Pre-2027 engineering</p>
          </div>
          <div className="bg-background/60 rounded-lg p-2 sm:p-3 text-center">
            <p className="text-sm sm:text-lg font-bold text-foreground">£750k</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Team hiring & runway</p>
          </div>
          <div className="bg-background/60 rounded-lg p-2 sm:p-3 text-center">
            <p className="text-sm sm:text-lg font-bold text-foreground">£150k</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Initial marketing</p>
          </div>
          <div className="bg-background/60 rounded-lg p-2 sm:p-3 text-center">
            <p className="text-sm sm:text-lg font-bold text-foreground">£300k</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Buffer</p>
          </div>
        </div>

        <div className="bg-green-100 dark:bg-green-950/40 border border-green-300 dark:border-green-800 rounded-lg p-3 mt-4">
          <p className="text-sm text-green-800 dark:text-green-200 text-center">
            <strong>Key:</strong> You avoid unnecessary dilution because the operating model is profitable from Year 1.
          </p>
        </div>
      </div>

      {/* Explainer */}
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Your <strong>operating</strong> model does not require capital. Your <strong>build</strong> and <strong>go-to-market acceleration</strong> do. 
            The model below shows how the business becomes cashflow-positive almost immediately once revenue begins in 2027.
          </p>
        </div>
      </div>

      {/* Section 1: Core Operating Model */}
      <div className="bg-card border border-border rounded-lg p-5">
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          1. Core Operating Model Assumptions
        </h4>

        {/* Fixed Internal Team */}
        <div className="mb-4">
          <h5 className="text-sm font-semibold text-muted-foreground mb-3">Fixed Internal Team (Payroll + Employer Costs)</h5>
          <div className="bg-muted/30 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-medium text-foreground">Role</th>
                  <th className="text-right p-3 font-medium text-foreground">Annual Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50"><td className="p-3 text-muted-foreground">CEO</td><td className="p-3 text-right text-foreground">£120,000</td></tr>
                <tr className="border-b border-border/50"><td className="p-3 text-muted-foreground">Head of Marketing</td><td className="p-3 text-right text-foreground">£80,000</td></tr>
                <tr className="border-b border-border/50"><td className="p-3 text-muted-foreground">Product Owner</td><td className="p-3 text-right text-foreground">£90,000</td></tr>
                <tr className="border-b border-border/50"><td className="p-3 text-muted-foreground">Head of Customer Support</td><td className="p-3 text-right text-foreground">£70,000</td></tr>
                <tr className="border-b border-border/50"><td className="p-3 text-muted-foreground">Head of Sales</td><td className="p-3 text-right text-foreground">£90,000</td></tr>
                <tr><td className="p-3 text-muted-foreground">Customer Support Officer</td><td className="p-3 text-right text-foreground">£40,000</td></tr>
              </tbody>
            </table>
          </div>
          <div className="bg-primary/10 rounded-lg p-3 mt-2">
            <p className="text-sm font-semibold text-foreground">Total Fixed Payroll = £490,000/year → £40,800/month</p>
          </div>
        </div>

        {/* Outsourced Fixed Costs */}
        <div>
          <h5 className="text-sm font-semibold text-muted-foreground mb-3">Outsourced Fixed Costs</h5>
          <div className="bg-muted/30 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-medium text-foreground">Outsourced Function</th>
                  <th className="text-right p-3 font-medium text-foreground">Annual Spend</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50"><td className="p-3 text-muted-foreground">Engineering (outsourced)</td><td className="p-3 text-right text-foreground">£300,000</td></tr>
                <tr className="border-b border-border/50"><td className="p-3 text-muted-foreground">Legal, compliance, finance</td><td className="p-3 text-right text-foreground">£40,000</td></tr>
                <tr><td className="p-3 text-muted-foreground">Contractors / overflow</td><td className="p-3 text-right text-foreground">£20,000</td></tr>
              </tbody>
            </table>
          </div>
          <div className="bg-primary/10 rounded-lg p-3 mt-2">
            <p className="text-sm font-semibold text-foreground">Total Outsourced Fixed = £360,000/year → £30,000/month</p>
          </div>
        </div>

        {/* Total Fixed */}
        <div className="bg-muted border border-border rounded-lg p-4 mt-4">
          <p className="text-center">
            <span className="text-sm text-muted-foreground">Total Fixed Operating Cost</span><br />
            <span className="text-2xl font-bold text-foreground">£850,000/year → £70,800/month</span>
          </p>
        </div>
      </div>

      {/* Section 2: COGS */}
      <div className="bg-card border border-border rounded-lg p-5">
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Server className="h-5 w-5 text-orange-500" />
          2. COGS (Infrastructure) Assumptions
        </h4>
        
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3">
          <div className="bg-amber-50 dark:bg-amber-900/40 border border-amber-300 dark:border-amber-700 rounded-lg p-2 sm:p-3 text-center">
            <p className="text-base sm:text-lg font-bold text-amber-800 dark:text-amber-200">6%</p>
            <p className="text-[10px] sm:text-xs text-amber-700 dark:text-amber-300">AI inference</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/40 border border-amber-300 dark:border-amber-700 rounded-lg p-2 sm:p-3 text-center">
            <p className="text-base sm:text-lg font-bold text-amber-800 dark:text-amber-200">1.5%</p>
            <p className="text-[10px] sm:text-xs text-amber-700 dark:text-amber-300">Vector DB</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/40 border border-amber-300 dark:border-amber-700 rounded-lg p-2 sm:p-3 text-center">
            <p className="text-base sm:text-lg font-bold text-amber-800 dark:text-amber-200">2%</p>
            <p className="text-[10px] sm:text-xs text-amber-700 dark:text-amber-300">Cloud compute</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/40 border border-amber-300 dark:border-amber-700 rounded-lg p-2 sm:p-3 text-center">
            <p className="text-base sm:text-lg font-bold text-amber-800 dark:text-amber-200">0.5%</p>
            <p className="text-[10px] sm:text-xs text-amber-700 dark:text-amber-300">Storage</p>
          </div>
        </div>
        <div className="bg-amber-100 dark:bg-amber-900/50 rounded-lg p-3">
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 text-center">Total COGS = 10% of revenue</p>
        </div>
      </div>

      {/* Section 3: CAC Spend */}
      <div className="bg-card border border-border rounded-lg p-5">
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-500" />
          3. Customer Acquisition Spend
        </h4>
        
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">8%</p>
            <p className="text-sm text-blue-600 dark:text-blue-400">Digital Marketing (execution)</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">4%</p>
            <p className="text-sm text-blue-600 dark:text-blue-400">SDR / Sales variable comp</p>
          </div>
        </div>
        <div className="bg-blue-100 dark:bg-blue-950/50 rounded-lg p-3">
          <p className="text-sm font-semibold text-blue-800 dark:text-blue-200 text-center">Total CAC Spend = 12% of revenue</p>
        </div>
      </div>

      {/* Section 4: Total Variable */}
      <div className="bg-card border border-border rounded-lg p-5">
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Calculator className="h-5 w-5 text-purple-500" />
          4. Total Variable Cost Load
        </h4>
        
        <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
          <div className="bg-amber-100 dark:bg-amber-900/40 rounded-lg px-3 sm:px-4 py-2">
            <span className="font-semibold text-amber-800 dark:text-amber-200 text-sm sm:text-base">COGS 10%</span>
          </div>
          <span className="text-xl sm:text-2xl font-bold text-muted-foreground">+</span>
          <div className="bg-blue-100 dark:bg-blue-900/40 rounded-lg px-3 sm:px-4 py-2">
            <span className="font-semibold text-blue-800 dark:text-blue-200 text-sm sm:text-base">CAC 12%</span>
          </div>
          <span className="text-xl sm:text-2xl font-bold text-muted-foreground">=</span>
          <div className="bg-primary/20 rounded-lg px-4 sm:px-6 py-2">
            <span className="text-lg sm:text-xl font-bold text-primary">22% of revenue</span>
          </div>
        </div>
      </div>

      {/* Section 5: Burn Formula */}
      <div className="bg-muted/50 border border-border rounded-lg p-5">
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Calculator className="h-5 w-5 text-foreground" />
          5. Burn Formula
        </h4>
        
        <div className="bg-background rounded-lg p-4 text-center mb-4">
          <p className="text-sm sm:text-base md:text-lg font-semibold text-foreground">
            Monthly Burn = Fixed Costs + Variable Costs – Monthly Revenue
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-card border border-border rounded-lg p-3 text-center">
            <p className="text-sm text-muted-foreground">Fixed Costs</p>
            <p className="text-lg font-bold text-foreground">£70,800/month</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-3 text-center">
            <p className="text-sm text-muted-foreground">Variable Costs</p>
            <p className="text-lg font-bold text-foreground">22% of revenue</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-3 text-center">
            <p className="text-sm text-muted-foreground">Monthly Revenue</p>
            <p className="text-lg font-bold text-foreground">Annual ÷ 12</p>
          </div>
        </div>
      </div>

      {/* Section 6: Burn Rate by Year */}
      <div className="bg-card border border-border rounded-lg p-5">
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-green-500" />
          6. Burn Rate by Year (Based on Revenue Model)
        </h4>

        <div className="space-y-4">
          {/* 2027 */}
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
              <h5 className="font-bold text-green-800 dark:text-green-200">2027</h5>
              <span className="bg-green-600 text-white text-[10px] sm:text-xs px-2 py-1 rounded-full self-start">Profitable Year 1</span>
            </div>
            <div className="grid grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm">
              <div><span className="text-muted-foreground">Revenue:</span> <span className="font-medium text-foreground block sm:inline">£1.17M</span></div>
              <div><span className="text-muted-foreground">Variable:</span> <span className="font-medium text-foreground block sm:inline">£21,450</span></div>
              <div><span className="text-muted-foreground">Costs:</span> <span className="font-medium text-foreground block sm:inline">£92,250</span></div>
              <div><span className="text-muted-foreground">Surplus:</span> <span className="font-bold text-green-600 dark:text-green-400 block sm:inline">£5,250</span></div>
            </div>
          </div>

          {/* 2028 */}
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
              <h5 className="font-bold text-green-800 dark:text-green-200">2028</h5>
              <span className="bg-green-600 text-white text-[10px] sm:text-xs px-2 py-1 rounded-full self-start">High profitability</span>
            </div>
            <div className="grid grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm">
              <div><span className="text-muted-foreground">Revenue:</span> <span className="font-medium text-foreground block sm:inline">£6.71M</span></div>
              <div><span className="text-muted-foreground">Variable:</span> <span className="font-medium text-foreground block sm:inline">£123,000</span></div>
              <div><span className="text-muted-foreground">Costs:</span> <span className="font-medium text-foreground block sm:inline">£193,800</span></div>
              <div><span className="text-muted-foreground">Surplus:</span> <span className="font-bold text-green-600 dark:text-green-400 block sm:inline">£365,200</span></div>
            </div>
          </div>

          {/* 2029 */}
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3 sm:p-4">
            <div className="flex justify-between items-start mb-2">
              <h5 className="font-bold text-green-800 dark:text-green-200">2029</h5>
            </div>
            <div className="grid grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm">
              <div><span className="text-muted-foreground">Revenue:</span> <span className="font-medium text-foreground block sm:inline">£9.10M</span></div>
              <div><span className="text-muted-foreground">Variable:</span> <span className="font-medium text-foreground block sm:inline">£166,833</span></div>
              <div><span className="text-muted-foreground">Costs:</span> <span className="font-medium text-foreground block sm:inline">£237,633</span></div>
              <div><span className="text-muted-foreground">Surplus:</span> <span className="font-bold text-green-600 dark:text-green-400 block sm:inline">£520,700</span></div>
            </div>
          </div>

          {/* 2030 */}
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3 sm:p-4">
            <div className="flex justify-between items-start mb-2">
              <h5 className="font-bold text-green-800 dark:text-green-200">2030</h5>
            </div>
            <div className="grid grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm">
              <div><span className="text-muted-foreground">Revenue:</span> <span className="font-medium text-foreground block sm:inline">£12.53M</span></div>
              <div><span className="text-muted-foreground">Variable:</span> <span className="font-medium text-foreground block sm:inline">£229,680</span></div>
              <div><span className="text-muted-foreground">Costs:</span> <span className="font-medium text-foreground block sm:inline">£300,480</span></div>
              <div><span className="text-muted-foreground">Surplus:</span> <span className="font-bold text-green-600 dark:text-green-400 block sm:inline">£743,520</span></div>
            </div>
          </div>

          {/* 2031 */}
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3 sm:p-4">
            <div className="flex justify-between items-start mb-2">
              <h5 className="font-bold text-green-800 dark:text-green-200">2031</h5>
            </div>
            <div className="grid grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm">
              <div><span className="text-muted-foreground">Revenue:</span> <span className="font-medium text-foreground block sm:inline">£14.92M</span></div>
              <div><span className="text-muted-foreground">Variable:</span> <span className="font-medium text-foreground block sm:inline">£273,460</span></div>
              <div><span className="text-muted-foreground">Costs:</span> <span className="font-medium text-foreground block sm:inline">£344,260</span></div>
              <div><span className="text-muted-foreground">Surplus:</span> <span className="font-bold text-green-600 dark:text-green-400 block sm:inline">£898,740</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 7: Key Investor Insights */}
      <div className="bg-card border border-border rounded-lg p-5">
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          7. Key Investor Insights
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <h5 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">1. Cashflow-positive almost immediately</h5>
            <p className="text-sm text-amber-700 dark:text-amber-300">Minimal burn in early 2027, then accelerating profitability.</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <h5 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">2. Extremely capital-efficient</h5>
            <p className="text-sm text-amber-700 dark:text-amber-300">Even modest 2027 revenue covers full team, engineering, infrastructure, and CAC.</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <h5 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">3. Gross margin {'>'}78% by 2030</h5>
            <p className="text-sm text-amber-700 dark:text-amber-300">Classic SaaS signature margin profile.</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <h5 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">4. Capital only for pre-revenue build</h5>
            <p className="text-sm text-amber-700 dark:text-amber-300">2025–2026 build phase requires funding; operating model is profitable.</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <p className="text-sm text-foreground">
          <strong className="text-primary">Summary:</strong> The £1.5M–£2.2M seed raise covers 18–24 months of pre-revenue build and early commercialisation. 
          Once revenue begins in 2027, the lean operating model becomes cashflow-positive almost immediately, 
          avoiding unnecessary dilution and demonstrating exceptional capital efficiency.
        </p>
      </div>
    </div>
  );
};

export default BurnRateAssumptionsVisual;
