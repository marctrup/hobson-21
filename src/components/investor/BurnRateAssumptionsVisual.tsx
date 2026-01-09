import React from 'react';
import { Info, TrendingUp, Users, Server, Target, Calculator, BarChart3, Lightbulb, PoundSterling } from 'lucide-react';
const BurnRateAssumptionsVisual = () => {
  return <div className="space-y-6">
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
            <p className="text-sm text-muted-foreground">What is actually need</p>
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

        <div className="bg-amber-50 dark:bg-amber-100 border border-amber-200 rounded-lg p-3 mt-4">
          <p className="text-sm text-black text-center">
            <strong>Key:</strong> You avoid unnecessary dilution because the operating model is profitable from Year 1.
          </p>
        </div>
      </div>

      {/* Explainer */}
      <div className="bg-sky-50 dark:bg-sky-100 border border-sky-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-black mt-0.5 shrink-0" />
          <p className="text-sm text-black">
            Our <strong>operating</strong> model does not require capital. Our <strong>build</strong> and <strong>go-to-market acceleration</strong> do. The model below shows how the business becomes cashflow-positive almost immediately once revenue begins in 2027.
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
        <div className="bg-muted border border-border rounded-lg p-3 sm:p-4 mt-4">
          <p className="text-center">
            <span className="text-xs sm:text-sm text-muted-foreground">Total Fixed Operating Cost</span><br />
            <span className="text-base sm:text-lg font-medium text-foreground">£850,000/year → £70,800/month</span>
          </p>
        </div>
      </div>

      {/* Section 2: COGS */}
      <div className="bg-card border border-border rounded-lg p-4 sm:p-5">
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Server className="h-5 w-5 text-primary" />
          2. COGS (Infrastructure) Assumptions
        </h4>
        
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3">
          <div className="bg-muted border border-border rounded-lg p-3 sm:p-4 text-center">
            <p className="text-lg sm:text-xl font-bold text-primary">6%</p>
            <p className="text-xs sm:text-sm text-muted-foreground">AI inference</p>
          </div>
          <div className="bg-muted border border-border rounded-lg p-3 sm:p-4 text-center">
            <p className="text-lg sm:text-xl font-bold text-primary">1.5%</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Vector DB</p>
          </div>
          <div className="bg-muted border border-border rounded-lg p-3 sm:p-4 text-center">
            <p className="text-lg sm:text-xl font-bold text-primary">2%</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Cloud compute</p>
          </div>
          <div className="bg-muted border border-border rounded-lg p-3 sm:p-4 text-center">
            <p className="text-lg sm:text-xl font-bold text-primary">0.5%</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Storage</p>
          </div>
        </div>
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
          <p className="text-sm font-semibold text-foreground text-center">Total COGS = 10% of revenue</p>
        </div>
      </div>

      {/* Section 3: CAC Spend */}
      <div className="bg-card border border-border rounded-lg p-4 sm:p-5">
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          3. Customer Acquisition Spend
        </h4>
        
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3">
          <div className="bg-muted border border-border rounded-lg p-3 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold text-primary">8%</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Digital Marketing</p>
          </div>
          <div className="bg-muted border border-border rounded-lg p-3 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold text-primary">4%</p>
            <p className="text-xs sm:text-sm text-muted-foreground">SDR / Sales comp</p>
          </div>
        </div>
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
          <p className="text-sm font-semibold text-foreground text-center">Total CAC Spend = 12% of revenue</p>
        </div>
      </div>

      {/* Section 4: Total Variable */}
      <div className="bg-card border border-border rounded-lg p-4 sm:p-5">
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          4. Total Variable Cost Load
        </h4>
        
        <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
          <div className="bg-muted border border-border rounded-lg px-3 sm:px-4 py-2">
            <span className="font-semibold text-foreground text-sm sm:text-base">COGS 10%</span>
          </div>
          <span className="text-lg sm:text-2xl font-bold text-muted-foreground">+</span>
          <div className="bg-muted border border-border rounded-lg px-3 sm:px-4 py-2">
            <span className="font-semibold text-foreground text-sm sm:text-base">CAC 12%</span>
          </div>
          <span className="text-lg sm:text-2xl font-bold text-muted-foreground">=</span>
          <div className="bg-primary/20 border border-primary/30 rounded-lg px-3 sm:px-6 py-2">
            <span className="text-base sm:text-xl font-bold text-primary">22%</span>
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
      <div className="bg-card border border-border rounded-lg p-4 sm:p-5">
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          6. Burn Rate by Year (Based on Revenue Model)
        </h4>

        <div className="space-y-3">
          {/* 2027 */}
          <div className="bg-muted/50 border border-border rounded-lg p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
              <h5 className="font-bold text-foreground text-base">2027</h5>
              <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full w-fit">Profitable Year 1</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-background rounded p-2"><span className="text-muted-foreground text-xs block">Revenue</span><span className="font-semibold text-foreground">£0.708M</span></div>
              <div className="bg-background rounded p-2"><span className="text-muted-foreground text-xs block">Variable</span><span className="font-semibold text-foreground">£21,450</span></div>
              <div className="bg-background rounded p-2"><span className="text-muted-foreground text-xs block">Costs</span><span className="font-semibold text-foreground">£92,250</span></div>
              <div className="bg-primary/10 rounded p-2"><span className="text-muted-foreground text-xs block">Surplus</span><span className="font-bold text-primary">£5,250</span></div>
            </div>
          </div>

          {/* 2028 */}
          <div className="bg-muted/50 border border-border rounded-lg p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
              <h5 className="font-bold text-foreground text-base">2028</h5>
              <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full w-fit">High profitability</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-background rounded p-2"><span className="text-muted-foreground text-xs block">Revenue</span><span className="font-semibold text-foreground">£6.71M</span></div>
              <div className="bg-background rounded p-2"><span className="text-muted-foreground text-xs block">Variable</span><span className="font-semibold text-foreground">£123,000</span></div>
              <div className="bg-background rounded p-2"><span className="text-muted-foreground text-xs block">Costs</span><span className="font-semibold text-foreground">£193,800</span></div>
              <div className="bg-primary/10 rounded p-2"><span className="text-muted-foreground text-xs block">Surplus</span><span className="font-bold text-primary">£365,200</span></div>
            </div>
          </div>

          {/* 2029 */}
          <div className="bg-muted/50 border border-border rounded-lg p-3 sm:p-4">
            <div className="mb-3">
              <h5 className="font-bold text-foreground text-base">2029</h5>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-background rounded p-2"><span className="text-muted-foreground text-xs block">Revenue</span><span className="font-semibold text-foreground">£9.10M</span></div>
              <div className="bg-background rounded p-2"><span className="text-muted-foreground text-xs block">Variable</span><span className="font-semibold text-foreground">£166,833</span></div>
              <div className="bg-background rounded p-2"><span className="text-muted-foreground text-xs block">Costs</span><span className="font-semibold text-foreground">£237,633</span></div>
              <div className="bg-primary/10 rounded p-2"><span className="text-muted-foreground text-xs block">Surplus</span><span className="font-bold text-primary">£520,700</span></div>
            </div>
          </div>

          {/* 2030 */}
          <div className="bg-muted/50 border border-border rounded-lg p-3 sm:p-4">
            <div className="mb-3">
              <h5 className="font-bold text-foreground text-base">2030</h5>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-background rounded p-2"><span className="text-muted-foreground text-xs block">Revenue</span><span className="font-semibold text-foreground">£12.53M</span></div>
              <div className="bg-background rounded p-2"><span className="text-muted-foreground text-xs block">Variable</span><span className="font-semibold text-foreground">£229,680</span></div>
              <div className="bg-background rounded p-2"><span className="text-muted-foreground text-xs block">Costs</span><span className="font-semibold text-foreground">£300,480</span></div>
              <div className="bg-primary/10 rounded p-2"><span className="text-muted-foreground text-xs block">Surplus</span><span className="font-bold text-primary">£743,520</span></div>
            </div>
          </div>

          {/* 2031 */}
          <div className="bg-muted/50 border border-border rounded-lg p-3 sm:p-4">
            <div className="mb-3">
              <h5 className="font-bold text-foreground text-base">2031</h5>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-background rounded p-2"><span className="text-muted-foreground text-xs block">Revenue</span><span className="font-semibold text-foreground">£14.92M</span></div>
              <div className="bg-background rounded p-2"><span className="text-muted-foreground text-xs block">Variable</span><span className="font-semibold text-foreground">£273,460</span></div>
              <div className="bg-background rounded p-2"><span className="text-muted-foreground text-xs block">Costs</span><span className="font-semibold text-foreground">£344,260</span></div>
              <div className="bg-primary/10 rounded p-2"><span className="text-muted-foreground text-xs block">Surplus</span><span className="font-bold text-primary">£898,740</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 7: Key Investor Insights */}
      <div className="bg-card border border-border rounded-lg p-4 sm:p-5">
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          7. Key Investor Insights
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-muted border border-border rounded-lg p-3 sm:p-4">
            <h5 className="font-semibold text-foreground text-sm sm:text-base mb-2">1. Cashflow-positive immediately</h5>
            <p className="text-xs sm:text-sm text-muted-foreground">Minimal burn in early 2027, then accelerating profitability.</p>
          </div>
          <div className="bg-muted border border-border rounded-lg p-3 sm:p-4">
            <h5 className="font-semibold text-foreground text-sm sm:text-base mb-2">2. Extremely capital-efficient</h5>
            <p className="text-xs sm:text-sm text-muted-foreground">Even modest 2027 revenue covers full team, engineering, infrastructure, and CAC.</p>
          </div>
          <div className="bg-muted border border-border rounded-lg p-3 sm:p-4">
            <h5 className="font-semibold text-foreground text-sm sm:text-base mb-2">3. Gross margin {'>'}78% by 2030</h5>
            <p className="text-xs sm:text-sm text-muted-foreground">Classic SaaS signature margin profile.</p>
          </div>
          <div className="bg-muted border border-border rounded-lg p-3 sm:p-4">
            <h5 className="font-semibold text-foreground text-sm sm:text-base mb-2">4. Capital only for pre-revenue build</h5>
            <p className="text-xs sm:text-sm text-muted-foreground">2025–2026 build phase requires funding; operating model is profitable.</p>
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
    </div>;
};
export default BurnRateAssumptionsVisual;