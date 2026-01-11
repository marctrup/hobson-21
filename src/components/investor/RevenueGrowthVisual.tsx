import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Globe, Target, DollarSign, BarChart3, Zap } from "lucide-react";
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
  // Revenue data from the financial model
  const revenueData = [
    { year: "2026", uk: 0, global: 0, total: 0, customers: 0, mrr: 0, arpu: 0, churn: 0 },
    { year: "2027", uk: 0.708, global: 0, total: 0.708, customers: 1168, mrr: 59031, arpu: 607, churn: 5 },
    { year: "2028", uk: 1.624, global: 4.813, total: 6.436, customers: 10152, mrr: 536362, arpu: 634, churn: 7 },
    { year: "2029", uk: 3.149, global: 19.250, total: 22.400, customers: 35705, mrr: 1866644, arpu: 627, churn: 8 },
    { year: "2030", uk: 5.591, global: 42.471, total: 48.061, customers: 82936, mrr: 4005092, arpu: 579, churn: 8 },
    { year: "2031", uk: 9.100, global: 90.596, total: 99.696, customers: 166302, mrr: 8307988, arpu: 599, churn: 8 },
  ];

  const formatCurrency = (value: number): string => {
    if (value === 0) return "£0";
    if (value >= 1) return `£${value.toFixed(1)}M`;
    return `£${(value * 1000).toFixed(0)}k`;
  };

  const formatLargeCurrency = (value: number): string => {
    if (value === 0) return "£0";
    if (value >= 1000000) return `£${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `£${(value / 1000).toFixed(0)}k`;
    return `£${value.toFixed(0)}`;
  };

  return (
    <div className="space-y-8">
      {/* Executive Summary */}
      <div className="bg-gradient-to-r from-sky-50 to-amber-50 border border-sky-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-sky-800 mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Commercial Trajectory: Key Conclusions
        </h3>
        <p className="text-gray-700 leading-relaxed">
          Hobson projects <span className="font-semibold text-sky-700">£99.7M ARR by 2031</span> with 
          <span className="font-semibold text-sky-700"> 166,000+ customers</span> across UK and global markets. 
          The model is anchored on <span className="font-semibold text-amber-700">conservative penetration rates</span> (1.8% UK, 0.8% global) 
          within a vast addressable market of <span className="font-semibold text-amber-700">4.5M operators</span>. 
          Revenue growth is driven by a land-and-expand strategy with UK launch in 2027 and global expansion from 2028.
          Churn stabilises at 8% as the platform matures, supporting predictable recurring revenue.
        </p>
      </div>

      {/* Revenue Chart */}
      <Card className="border border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            Revenue Growth (2026-2031) — £M
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis 
                tick={{ fontSize: 11 }} 
                tickFormatter={(value) => `£${value}M`}
                domain={[0, 110]}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [formatCurrency(value), name]}
                labelStyle={{ fontWeight: "bold" }}
                contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
              />
              <Legend wrapperStyle={{ paddingTop: "10px" }} />
              <Bar dataKey="uk" name="UK Revenue" fill="#D97706" stackId="revenue" radius={[0, 0, 0, 0]} />
              <Bar dataKey="global" name="Global Revenue" fill="#0EA5E9" stackId="revenue" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-amber-600"></span> UK Market (launch 2027)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-sky-500"></span> Global Markets (launch 2028)
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Key Investor Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
          <DollarSign className="w-6 h-6 text-amber-600 mx-auto mb-2" />
          <div className="text-amber-600 font-semibold text-sm mb-1">2031 ARR</div>
          <div className="text-2xl font-bold text-amber-700">£99.7M</div>
          <div className="text-xs text-amber-600/80">total revenue</div>
        </div>
        <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 text-center">
          <Users className="w-6 h-6 text-sky-600 mx-auto mb-2" />
          <div className="text-sky-600 font-semibold text-sm mb-1">Customers</div>
          <div className="text-2xl font-bold text-sky-700">166k</div>
          <div className="text-xs text-sky-600/80">by 2031</div>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
          <Zap className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
          <div className="text-emerald-600 font-semibold text-sm mb-1">MRR 2031</div>
          <div className="text-2xl font-bold text-emerald-700">£8.3M</div>
          <div className="text-xs text-emerald-600/80">monthly recurring</div>
        </div>
        <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 text-center">
          <Target className="w-6 h-6 text-violet-600 mx-auto mb-2" />
          <div className="text-violet-600 font-semibold text-sm mb-1">Blended ARPU</div>
          <div className="text-2xl font-bold text-violet-700">~£600</div>
          <div className="text-xs text-violet-600/80">per customer/year</div>
        </div>
      </div>

      {/* Summary Matrix */}
      <Card className="border border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Investor Summary Matrix
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b">
                  <th className="text-left p-3 font-semibold">Metric</th>
                  <th className="text-right p-3 font-semibold">2026</th>
                  <th className="text-right p-3 font-semibold">2027</th>
                  <th className="text-right p-3 font-semibold">2028</th>
                  <th className="text-right p-3 font-semibold">2029</th>
                  <th className="text-right p-3 font-semibold">2030</th>
                  <th className="text-right p-3 font-semibold">2031</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3 font-medium text-amber-700">UK Revenue</td>
                  {revenueData.map((d, i) => (
                    <td key={i} className="text-right p-3 text-amber-700">{formatCurrency(d.uk)}</td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium text-sky-700">Global Revenue</td>
                  {revenueData.map((d, i) => (
                    <td key={i} className="text-right p-3 text-sky-700">{formatCurrency(d.global)}</td>
                  ))}
                </tr>
                <tr className="border-b bg-primary/5">
                  <td className="p-3 font-bold text-primary">Total Revenue</td>
                  {revenueData.map((d, i) => (
                    <td key={i} className="text-right p-3 font-bold text-primary">{formatCurrency(d.total)}</td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Total Customers</td>
                  {revenueData.map((d, i) => (
                    <td key={i} className="text-right p-3 text-gray-600">{d.customers.toLocaleString()}</td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">MRR</td>
                  {revenueData.map((d, i) => (
                    <td key={i} className="text-right p-3 text-gray-600">{formatLargeCurrency(d.mrr)}</td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Blended ARPU</td>
                  {revenueData.map((d, i) => (
                    <td key={i} className="text-right p-3 text-gray-600">{d.arpu ? `£${d.arpu}` : "—"}</td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Churn Rate</td>
                  {revenueData.map((d, i) => (
                    <td key={i} className="text-right p-3 text-gray-600">{d.churn ? `${d.churn}%` : "—"}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Market Assumptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-600" />
              UK Market
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-border/30">
              <span className="text-sm text-muted-foreground">Addressable operators</span>
              <span className="font-semibold">235,200</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/30">
              <span className="text-sm text-muted-foreground">Penetration by 2031</span>
              <span className="font-semibold text-amber-600">1.8%</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/30">
              <span className="text-sm text-muted-foreground">UK customers 2031</span>
              <span className="font-semibold">10,802</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground">UK revenue 2031</span>
              <span className="font-bold text-amber-600">£9.1M</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Globe className="w-4 h-4 text-sky-600" />
              Global Market
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-border/30">
              <span className="text-sm text-muted-foreground">Addressable operators</span>
              <span className="font-semibold">4,230,000</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/30">
              <span className="text-sm text-muted-foreground">Penetration by 2031</span>
              <span className="font-semibold text-sky-600">0.8%</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/30">
              <span className="text-sm text-muted-foreground">Global customers 2031</span>
              <span className="font-semibold">155,500</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground">Global revenue 2031</span>
              <span className="font-bold text-sky-600">£90.6M</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pricing & Tier Mix */}
      <Card className="border border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" />
            Pricing Model & Tier Mix
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
              <div className="text-violet-700 font-semibold mb-1">Enterprise (Large)</div>
              <div className="text-2xl font-bold text-violet-800">£1,782/yr</div>
              <div className="text-xs text-violet-600">10% of customer base</div>
            </div>
            <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
              <div className="text-sky-700 font-semibold mb-1">Enterprise Plus (Medium)</div>
              <div className="text-2xl font-bold text-sky-800">£597/yr</div>
              <div className="text-xs text-sky-600">60% of customer base</div>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <div className="text-emerald-700 font-semibold mb-1">Essential (Small)</div>
              <div className="text-2xl font-bold text-emerald-800">£234/yr</div>
              <div className="text-xs text-emerald-600">30% of customer base</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Why This Works */}
      <div className="bg-gradient-to-r from-primary/10 to-violet-100 border border-primary/20 rounded-xl p-6">
        <h4 className="font-bold text-primary mb-2">Why This Trajectory Is Achievable</h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 font-bold">✓</span>
            <span><strong>Conservative penetration:</strong> Only 1.8% UK and 0.8% global by 2031 in a market of 4.5M operators.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 font-bold">✓</span>
            <span><strong>Proven SaaS economics:</strong> Blended ARPU of ~£600 with simple, predictable pricing tiers.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 font-bold">✓</span>
            <span><strong>Manageable churn:</strong> 8% annual churn at maturity is competitive for SMB SaaS.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 font-bold">✓</span>
            <span><strong>Land and expand:</strong> UK-first strategy builds playbook before global rollout in 2028.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RevenueGrowthVisual;
