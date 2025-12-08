import React from "react";
import { TrendingUp, Info } from "lucide-react";
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
  const revenueData = [
    { year: "2027", ukRevenue: 1.17, globalRevenue: 0, total: 1.17 },
    { year: "2028", ukRevenue: 1.46, globalRevenue: 5.25, total: 6.71 },
    { year: "2029", ukRevenue: 1.75, globalRevenue: 7.35, total: 9.10 },
    { year: "2030", ukRevenue: 2.04, globalRevenue: 10.49, total: 12.53 },
    { year: "2031", ukRevenue: 2.33, globalRevenue: 12.59, total: 14.92 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-foreground mb-2">Revenue Growth (2027–2031)</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          5-year revenue projection from UK launch through global expansion
        </p>
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
          Hobson Revenue Growth (2027–2031)
        </h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={revenueData}
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
                formatter={(value: number) => [`£${value.toFixed(2)}M`, '']}
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
          <p className="text-xl font-bold text-amber-600 dark:text-amber-400">£1.17M</p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-sky-500/10 to-sky-500/5 border border-sky-500/20 text-center">
          <p className="text-xs text-muted-foreground mb-1">2028 (Global Start)</p>
          <p className="text-xl font-bold text-sky-600 dark:text-sky-400">£6.71M</p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 text-center">
          <p className="text-xs text-muted-foreground mb-1">2031 (Year 5)</p>
          <p className="text-xl font-bold text-primary">£14.92M</p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 text-center">
          <p className="text-xs text-muted-foreground mb-1">5-Year CAGR</p>
          <p className="text-xl font-bold text-green-600 dark:text-green-400">~90%</p>
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
