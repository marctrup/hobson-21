import React from 'react';
import { Info, TrendingDown, Calendar, DollarSign, AlertTriangle } from 'lucide-react';

const BurnRateAssumptionsVisual = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-foreground mb-2">Burn Rate Assumptions</h3>
        <p className="text-sm text-muted-foreground">Monthly cash consumption analysis and runway projections</p>
      </div>

      {/* Explainer */}
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Burn rate represents monthly cash consumption before revenue offsets operating costs. 
            These projections assume full deployment of the £1M funding round across product development, 
            go-to-market activities, and operational scaling.
          </p>
        </div>
      </div>

      {/* Monthly Burn Rate Breakdown */}
      <div className="bg-card border border-border rounded-lg p-5">
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-red-500" />
          Monthly Burn Rate Breakdown
        </h4>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Core Team (Fixed)</span>
            <span className="font-medium text-foreground">£34,600/month</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Outsourced Engineering</span>
            <span className="font-medium text-foreground">£8,000-£15,000/month</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Digital Marketing</span>
            <span className="font-medium text-foreground">£5,000-£10,000/month</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Infrastructure & AI Costs</span>
            <span className="font-medium text-foreground">£2,000-£5,000/month</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Operational Overhead</span>
            <span className="font-medium text-foreground">£3,000-£5,000/month</span>
          </div>
          <div className="flex justify-between items-center py-3 bg-muted/50 rounded px-2 mt-2">
            <span className="font-semibold text-foreground">Total Monthly Burn</span>
            <span className="font-bold text-red-600 dark:text-red-400">£52,600-£69,600/month</span>
          </div>
        </div>
      </div>

      {/* Phased Burn Rate */}
      <div className="bg-card border border-border rounded-lg p-5">
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Phased Burn Rate by Stage
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <h5 className="font-semibold text-amber-800 dark:text-amber-200 text-sm mb-2">Year 1: Build</h5>
            <p className="text-2xl font-bold text-amber-700 dark:text-amber-300 mb-1">£55,000/mo</p>
            <p className="text-xs text-amber-600 dark:text-amber-400">Focus: MVP completion, pilot onboarding, minimal marketing</p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <h5 className="font-semibold text-orange-800 dark:text-orange-200 text-sm mb-2">Year 2: Launch</h5>
            <p className="text-2xl font-bold text-orange-700 dark:text-orange-300 mb-1">£65,000/mo</p>
            <p className="text-xs text-orange-600 dark:text-orange-400">Focus: Market entry, customer acquisition, team scaling</p>
          </div>
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h5 className="font-semibold text-green-800 dark:text-green-200 text-sm mb-2">Year 3: Scale</h5>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300 mb-1">Revenue Offset</p>
            <p className="text-xs text-green-600 dark:text-green-400">Focus: Revenue growth reduces net burn, path to breakeven</p>
          </div>
        </div>
      </div>

      {/* Runway Analysis */}
      <div className="bg-card border border-border rounded-lg p-5">
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          Runway Analysis (£1M Funding)
        </h4>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/30 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">Conservative Runway</p>
              <p className="text-3xl font-bold text-foreground">14-16</p>
              <p className="text-sm text-muted-foreground">months</p>
              <p className="text-xs text-muted-foreground mt-2">At £65k/month average burn</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">Optimistic Runway</p>
              <p className="text-3xl font-bold text-primary">18-20</p>
              <p className="text-sm text-muted-foreground">months</p>
              <p className="text-xs text-muted-foreground mt-2">At £55k/month with early revenue</p>
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3">
            <p className="text-sm text-green-800 dark:text-green-200">
              <strong>Key Insight:</strong> Revenue generation begins in Year 2 (2027), progressively offsetting burn rate. 
              With projected £1.17M ARR by end of 2027, the business approaches cash-flow breakeven significantly ahead of runway exhaustion.
            </p>
          </div>
        </div>
      </div>

      {/* Key Assumptions */}
      <div className="bg-card border border-border rounded-lg p-5">
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Key Assumptions
        </h4>
        
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">•</span>
            <span>Core team salaries fixed at £415k annually (CEO, Marketing, Product, Support, Sales)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">•</span>
            <span>Variable costs (engineering, marketing execution) scale with revenue from Year 2</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">•</span>
            <span>Infrastructure costs remain low due to efficient AI architecture (£2-5k/month)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">•</span>
            <span>No physical office costs – fully remote team structure</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">•</span>
            <span>Marketing spend ramps in Year 2 aligned with public launch</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">•</span>
            <span>Contingency buffer of ~10% built into estimates</span>
          </li>
        </ul>
      </div>

      {/* Summary */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <p className="text-sm text-foreground">
          <strong className="text-primary">Summary:</strong> With disciplined spending and a lean operating model, 
          the £1M funding provides 14-20 months of runway – sufficient to reach revenue generation and demonstrate 
          path to profitability before requiring additional capital.
        </p>
      </div>
    </div>
  );
};

export default BurnRateAssumptionsVisual;
