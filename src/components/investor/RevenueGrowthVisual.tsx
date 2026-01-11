import React from "react";
import { TrendingUp, Info, Target, Globe, DollarSign, Users } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const RevenueGrowthVisual = () => {
  // Detailed revenue breakdown by tier
  const revenueBreakdown = {
    years: ["2026", "2027", "2028", "2029", "2030", "2031"],
    ukEnterprise: [0, 208096, 832385, 1872866, 3537636, 5930743],
    ukEnterprisePlus: [0, 418294, 627442, 976020, 1533746, 2335478],
    ukEssential: [0, 81977, 163955, 300583, 519190, 833436],
    ukTotal: [0, 708368, 1623781, 3149470, 5590573, 9099657],
    globalEnterprise: [0, 0, 1413780, 5655122, 8482683, 22620488],
    globalEnterprisePlus: [0, 0, 2841842, 11367366, 28418416, 56836832],
    globalEssential: [0, 0, 556944, 2227775, 5569438, 11138877],
    globalTotal: [0, 0, 4812566, 19250264, 42470537, 90596196],
    total: [0, 708368, 6436347, 22399734, 48061110, 99695853],
  };

  // Chart data for bar chart
  const chartData = revenueBreakdown.years.map((year, i) => ({
    year,
    ukRevenue: revenueBreakdown.ukTotal[i],
    globalRevenue: revenueBreakdown.globalTotal[i],
    total: revenueBreakdown.total[i],
  }));

  const formatCurrency = (value: number) => {
    if (value === 0) return "£0";
    if (value >= 1000000) return `£${(value / 1000000).toFixed(1)}M`;
    return `£${value.toLocaleString()}`;
  };

  const phases = [
    { phase: "2026", focus: "Platform build, pilots, validation" },
    { phase: "2027", focus: "UK commercial launch" },
    { phase: "2028+", focus: "UK scale and global expansion" },
  ];

  const ukPenetration = [
    { year: "2027", share: "0.5%" },
    { year: "2028", share: "1.5%" },
    { year: "2029", share: "3.0%" },
    { year: "2030", share: "4.5%" },
    { year: "2031", share: "5.5%" },
  ];

  const globalPenetration = [
    { year: "2028", share: "0.25%" },
    { year: "2029", share: "1.0%" },
    { year: "2030", share: "2.0%" },
    { year: "2031", share: "3.0%" },
  ];

  return (
    <div className="space-y-6">
      {/* Phase Timeline */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h4 className="text-lg font-semibold text-foreground mb-4">Commercial Phases</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-4 text-sm font-semibold text-foreground">Phase</th>
                <th className="text-left py-2 px-4 text-sm font-semibold text-foreground">Focus</th>
              </tr>
            </thead>
            <tbody>
              {phases.map((item, index) => (
                <tr key={index} className="border-b border-border/50">
                  <td className="py-3 px-4 text-sm font-semibold text-primary">{item.phase}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{item.focus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revenue Breakdown Table */}
      <div className="bg-card rounded-xl p-6 border border-border/30">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h4 className="text-lg font-semibold text-foreground">Revenue</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-700 text-white">
                <th className="text-left py-2 px-3 font-semibold"></th>
                {revenueBreakdown.years.map((year) => (
                  <th key={year} className="text-right py-2 px-3 font-semibold">{year}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* UK Revenue Section */}
              <tr className="border-b border-border/30">
                <td className="py-2 px-3 text-muted-foreground">UK revenue: Enterprise</td>
                {revenueBreakdown.ukEnterprise.map((val, i) => (
                  <td key={i} className="py-2 px-3 text-right text-muted-foreground">{formatCurrency(val)}</td>
                ))}
              </tr>
              <tr className="border-b border-border/30">
                <td className="py-2 px-3 text-muted-foreground">UK revenue: Enterprise Plus</td>
                {revenueBreakdown.ukEnterprisePlus.map((val, i) => (
                  <td key={i} className="py-2 px-3 text-right text-muted-foreground">{formatCurrency(val)}</td>
                ))}
              </tr>
              <tr className="border-b border-border/30">
                <td className="py-2 px-3 text-muted-foreground">UK revenue: Essential</td>
                {revenueBreakdown.ukEssential.map((val, i) => (
                  <td key={i} className="py-2 px-3 text-right text-muted-foreground">{formatCurrency(val)}</td>
                ))}
              </tr>
              <tr className="border-b border-border bg-muted/30">
                <td className="py-2 px-3 font-semibold text-foreground">UK Total revenue</td>
                {revenueBreakdown.ukTotal.map((val, i) => (
                  <td key={i} className="py-2 px-3 text-right font-semibold text-foreground">{formatCurrency(val)}</td>
                ))}
              </tr>

              {/* Spacer row */}
              <tr><td colSpan={7} className="py-1"></td></tr>

              {/* Global Revenue Section */}
              <tr className="border-b border-border/30">
                <td className="py-2 px-3 text-muted-foreground">Global revenue: Enterprise</td>
                {revenueBreakdown.globalEnterprise.map((val, i) => (
                  <td key={i} className="py-2 px-3 text-right text-muted-foreground">{formatCurrency(val)}</td>
                ))}
              </tr>
              <tr className="border-b border-border/30">
                <td className="py-2 px-3 text-muted-foreground">Global revenue: Enterprise Plus</td>
                {revenueBreakdown.globalEnterprisePlus.map((val, i) => (
                  <td key={i} className="py-2 px-3 text-right text-muted-foreground">{formatCurrency(val)}</td>
                ))}
              </tr>
              <tr className="border-b border-border/30">
                <td className="py-2 px-3 text-muted-foreground">Global revenue: Essential</td>
                {revenueBreakdown.globalEssential.map((val, i) => (
                  <td key={i} className="py-2 px-3 text-right text-muted-foreground">{formatCurrency(val)}</td>
                ))}
              </tr>
              <tr className="border-b border-border bg-muted/30">
                <td className="py-2 px-3 font-semibold text-foreground">Global Total revenue</td>
                {revenueBreakdown.globalTotal.map((val, i) => (
                  <td key={i} className="py-2 px-3 text-right font-semibold text-foreground">{formatCurrency(val)}</td>
                ))}
              </tr>

              {/* Spacer row */}
              <tr><td colSpan={7} className="py-1"></td></tr>

              {/* Total Revenue */}
              <tr className="bg-fuchsia-100 dark:bg-fuchsia-900/30">
                <td className="py-2 px-3 font-bold text-foreground">Total revenue</td>
                {revenueBreakdown.total.map((val, i) => (
                  <td key={i} className="py-2 px-3 text-right font-bold text-foreground">{formatCurrency(val)}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Market & Revenue Assumptions */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* UK Market */}
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-amber-600" />
            <h5 className="font-semibold text-foreground">UK Market</h5>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">235,200 real estate businesses</p>
            <p className="text-muted-foreground">Annual efficiency saving: £6,000 per role</p>
            <p className="text-muted-foreground">65% of businesses primed for AI investment</p>
            <div className="pt-2 border-t border-border mt-3">
              <p className="text-foreground font-medium">UK TAM: £1.41B</p>
              <p className="text-foreground font-medium">UK SAM: £917M</p>
            </div>
          </div>
        </div>

        {/* Global Market */}
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-5 h-5 text-sky-600" />
            <h5 className="font-semibold text-foreground">Global Market</h5>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">4.23M comparable businesses</p>
            <div className="pt-2 border-t border-border mt-3">
              <p className="text-foreground font-medium">Global TAM: £155.6B</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Model */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-5 border border-primary/20">
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="w-5 h-5 text-primary" />
          <h5 className="font-semibold text-foreground">Pricing Model</h5>
        </div>
        <div className="space-y-2 text-sm">
          <p className="text-muted-foreground">Blended ARPU: <span className="text-foreground font-semibold">£495.72 per year</span></p>
          <p className="text-muted-foreground">Tier mix: <span className="text-foreground font-semibold">Essential (60%), Plus (30%), Enterprise (10%)</span></p>
          <p className="text-muted-foreground">No per-user or per-asset fees</p>
        </div>
      </div>

      {/* Market Penetration */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-primary" />
          <h4 className="text-lg font-semibold text-foreground">Market Penetration</h4>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {/* UK Penetration */}
          <div>
            <h5 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-600" />
              UK Penetration
            </h5>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 text-sm font-semibold text-foreground">Year</th>
                    <th className="text-left py-2 px-3 text-sm font-semibold text-foreground">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {ukPenetration.map((item, index) => (
                    <tr key={index} className="border-b border-border/50">
                      <td className="py-2 px-3 text-sm font-semibold text-foreground">{item.year}</td>
                      <td className="py-2 px-3 text-sm text-amber-600 font-medium">{item.share}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Global Penetration */}
          <div>
            <h5 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-sky-600" />
              Global Penetration
            </h5>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 text-sm font-semibold text-foreground">Year</th>
                    <th className="text-left py-2 px-3 text-sm font-semibold text-foreground">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {globalPenetration.map((item, index) => (
                    <tr key={index} className="border-b border-border/50">
                      <td className="py-2 px-3 text-sm font-semibold text-foreground">{item.year}</td>
                      <td className="py-2 px-3 text-sm text-sky-600 font-medium">{item.share}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Model Summary */}
      <div className="bg-muted/30 rounded-xl p-6 border border-border">
        <h4 className="text-lg font-semibold text-foreground mb-4">Revenue Model</h4>
        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
            <p className="text-sm text-muted-foreground">Blended ARPU: £495.72 / year</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
            <p className="text-sm text-muted-foreground">Tier mix: Essential 60% | Plus 30% | Enterprise 10%</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
            <p className="text-sm text-muted-foreground">No per-user or per-asset fees.</p>
          </div>
        </div>

        {/* Revenue table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-xs font-semibold text-foreground">Year</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-foreground">UK Revenue</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-foreground">Global</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-foreground">Total</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((item, index) => (
                <tr key={index} className="border-b border-border/50">
                  <td className="py-2 px-3 text-xs font-medium text-foreground">{item.year}</td>
                  <td className="py-2 px-3 text-xs text-muted-foreground text-right">{formatCurrency(item.ukRevenue)}</td>
                  <td className="py-2 px-3 text-xs text-muted-foreground text-right">{item.globalRevenue > 0 ? formatCurrency(item.globalRevenue) : "—"}</td>
                  <td className="py-2 px-3 text-xs font-semibold text-primary text-right">{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer ROI */}
      <div className="bg-primary/10 rounded-xl p-5 border border-primary/20 text-center">
        <p className="text-foreground font-semibold">Customer ROI: ~12× (£6,000 saving vs £495.72)</p>
      </div>

      {/* Explainer Box */}
      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-3">
        <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm text-foreground font-medium mb-1">
            The following tabs explain how this growth is achievable
          </p>
          <p className="text-xs text-muted-foreground">
            Review the UK Assumptions, Global Assumptions, Market Penetration, and Revenue Model tabs for detailed methodology and supporting data.
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6 rounded-xl bg-background border border-border">
        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Hobson Revenue Growth (2026–2031)
        </h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="year" 
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                label={{ 
                  value: 'Revenue (£M)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fontSize: 12, fill: 'hsl(var(--muted-foreground))' }
                }}
              />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), ""]}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar 
                dataKey="ukRevenue" 
                stackId="a" 
                fill="#D97706" 
                name="UK Revenue"
                radius={[0, 0, 0, 0]}
              />
              <Bar 
                dataKey="globalRevenue" 
                stackId="a" 
                fill="#0EA5E9" 
                name="Global Revenue"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 text-center">
          <p className="text-xs text-muted-foreground mb-1">2027 (UK Launch)</p>
          <p className="text-xl font-bold text-amber-600 dark:text-amber-400">£708,368</p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-sky-500/10 to-sky-500/5 border border-sky-500/20 text-center">
          <p className="text-xs text-muted-foreground mb-1">2028 (Global Start)</p>
          <p className="text-xl font-bold text-sky-600 dark:text-sky-400">£7.8M</p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 text-center">
          <p className="text-xs text-muted-foreground mb-1">2031 (Year 6)</p>
          <p className="text-xl font-bold text-primary">£80.0M</p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 text-center">
          <p className="text-xs text-muted-foreground mb-1">5-Year CAGR</p>
          <p className="text-xl font-bold text-green-600 dark:text-green-400">~160%</p>
        </div>
      </div>

      {/* Key Milestones */}
      <div className="p-4 rounded-xl bg-muted/30 border border-border">
        <h5 className="font-semibold text-foreground text-sm mb-3">Key Revenue Milestones</h5>
        <div className="grid md:grid-cols-3 gap-3 text-sm">
          <div className="flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></span>
            <p className="text-muted-foreground"><span className="font-medium text-foreground">2027:</span> UK commercial launch, first paying customers</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-500 mt-1.5 flex-shrink-0"></span>
            <p className="text-muted-foreground"><span className="font-medium text-foreground">2028:</span> Global expansion begins, revenue accelerates</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0"></span>
            <p className="text-muted-foreground"><span className="font-medium text-foreground">2031:</span> ~30,000 customers, category leadership</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueGrowthVisual;
