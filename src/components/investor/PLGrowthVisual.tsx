import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Target, Zap, PiggyBank, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";

const PLGrowthVisual = () => {
  // P/L data from the financial model
  const plData = [
    { year: "2026", revenue: 0, cogs: 0.113, opex: 1.79, ebitda: -1.9, grossProfit: -0.113 },
    { year: "2027", revenue: 0.708, cogs: 0.2, opex: 2.61, ebitda: -2.1, grossProfit: 0.508 },
    { year: "2028", revenue: 6.4, cogs: 0.66, opex: 5.08, ebitda: 0.69, grossProfit: 5.78 },
    { year: "2029", revenue: 22.4, cogs: 1.85, opex: 10.71, ebitda: 9.84, grossProfit: 20.55 },
    { year: "2030", revenue: 48.1, cogs: 3.9, opex: 21.08, ebitda: 23.1, grossProfit: 44.16 },
    { year: "2031", revenue: 99.7, cogs: 8.04, opex: 40.7, ebitda: 51.0, grossProfit: 91.66 },
  ];

  const formatCurrency = (value: number): string => {
    if (value === 0) return "£0";
    const absValue = Math.abs(value);
    if (absValue >= 1) {
      return `${value < 0 ? "-" : ""}£${absValue.toFixed(1)}M`;
    }
    return `${value < 0 ? "-" : ""}£${(absValue * 1000).toFixed(0)}k`;
  };

  return (
    <div className="space-y-8">
      {/* Executive Summary */}
      <div className="bg-gradient-to-r from-emerald-50 to-sky-50 border border-emerald-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-emerald-800 mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          P/L Growth: Key Conclusions
        </h3>
        <p className="text-gray-700 leading-relaxed">
          Hobson's financial model demonstrates <span className="font-semibold text-emerald-700">exceptional capital efficiency</span> with 
          EBITDA breakeven in Year 3 (2028) and <span className="font-semibold text-emerald-700">£51M EBITDA by 2031</span>. 
          The model combines a lean fixed cost base (£460k-£680k/year) with AI-driven automation that delivers 
          <span className="font-semibold text-emerald-700"> 92% gross margins at scale</span>. Front-loaded pre-revenue investment 
          (£5M across 2026-2028) funds product development and market entry, after which operating leverage drives rapid profitability growth.
        </p>
      </div>

      {/* P/L Chart */}
      <Card className="border border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            P/L Forecast (2026-2031) — £M
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={plData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis 
                tick={{ fontSize: 11 }} 
                tickFormatter={(value) => `£${value}M`}
                domain={[-10, 110]}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [formatCurrency(value), name]}
                labelStyle={{ fontWeight: "bold" }}
                contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
              />
              <Legend wrapperStyle={{ paddingTop: "10px" }} />
              <ReferenceLine y={0} stroke="#6b7280" strokeWidth={1} />
              <Bar dataKey="cogs" name="COGS" fill="#f59e0b" stackId="costs" radius={[0, 0, 0, 0]} />
              <Bar dataKey="opex" name="Operating Expenses" fill="#0ea5e9" stackId="costs" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ebitda" name="EBITDA" fill="#10b981" radius={[4, 4, 4, 4]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-amber-500"></span> COGS (8% of revenue)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-sky-500"></span> OpEx (declining % of revenue)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-emerald-500"></span> EBITDA (profit)
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Summary Financial Table */}
      <Card className="border border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" />
            Financial Summary (£)
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
                <tr className="border-b bg-sky-50/50">
                  <td className="p-3 font-medium text-sky-700">Total Revenue</td>
                  <td className="text-right p-3 text-sky-700">£0</td>
                  <td className="text-right p-3 text-sky-700">£708k</td>
                  <td className="text-right p-3 text-sky-700">£6.4M</td>
                  <td className="text-right p-3 text-sky-700">£22.4M</td>
                  <td className="text-right p-3 text-sky-700">£48.1M</td>
                  <td className="text-right p-3 text-sky-700 font-bold">£99.7M</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">COGS</td>
                  <td className="text-right p-3 text-gray-600">£113k</td>
                  <td className="text-right p-3 text-gray-600">£200k</td>
                  <td className="text-right p-3 text-gray-600">£658k</td>
                  <td className="text-right p-3 text-gray-600">£1.9M</td>
                  <td className="text-right p-3 text-gray-600">£3.9M</td>
                  <td className="text-right p-3 text-gray-600">£8.0M</td>
                </tr>
                <tr className="border-b bg-emerald-50/50">
                  <td className="p-3 font-medium text-emerald-700">Gross Profit</td>
                  <td className="text-right p-3 text-red-600">(£113k)</td>
                  <td className="text-right p-3 text-emerald-700">£508k</td>
                  <td className="text-right p-3 text-emerald-700">£5.8M</td>
                  <td className="text-right p-3 text-emerald-700">£20.5M</td>
                  <td className="text-right p-3 text-emerald-700">£44.2M</td>
                  <td className="text-right p-3 text-emerald-700 font-bold">£91.7M</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Gross Margin</td>
                  <td className="text-right p-3 text-gray-500">—</td>
                  <td className="text-right p-3 text-gray-600">88%</td>
                  <td className="text-right p-3 text-gray-600">92%</td>
                  <td className="text-right p-3 text-gray-600">92%</td>
                  <td className="text-right p-3 text-gray-600">92%</td>
                  <td className="text-right p-3 text-gray-600 font-semibold">92%</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Total OpEx</td>
                  <td className="text-right p-3 text-gray-600">£1.8M</td>
                  <td className="text-right p-3 text-gray-600">£2.6M</td>
                  <td className="text-right p-3 text-gray-600">£5.1M</td>
                  <td className="text-right p-3 text-gray-600">£10.7M</td>
                  <td className="text-right p-3 text-gray-600">£21.1M</td>
                  <td className="text-right p-3 text-gray-600">£40.7M</td>
                </tr>
                <tr className="bg-primary/5 border-b-2 border-primary/20">
                  <td className="p-3 font-bold text-primary">EBITDA</td>
                  <td className="text-right p-3 text-red-600 font-bold">(£1.9M)</td>
                  <td className="text-right p-3 text-red-600 font-bold">(£2.1M)</td>
                  <td className="text-right p-3 text-emerald-600 font-bold">£694k</td>
                  <td className="text-right p-3 text-emerald-600 font-bold">£9.8M</td>
                  <td className="text-right p-3 text-emerald-600 font-bold">£23.1M</td>
                  <td className="text-right p-3 text-emerald-600 font-bold">£51.0M</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
          <Target className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
          <div className="text-emerald-600 font-semibold text-sm mb-1">EBITDA Breakeven</div>
          <div className="text-2xl font-bold text-emerald-700">Year 3</div>
          <div className="text-xs text-emerald-600/80">2028 @ £694k</div>
        </div>
        <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 text-center">
          <TrendingUp className="w-6 h-6 text-sky-600 mx-auto mb-2" />
          <div className="text-sky-600 font-semibold text-sm mb-1">Gross Margin</div>
          <div className="text-2xl font-bold text-sky-700">92%</div>
          <div className="text-xs text-sky-600/80">at scale (2028+)</div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
          <PiggyBank className="w-6 h-6 text-amber-600 mx-auto mb-2" />
          <div className="text-amber-600 font-semibold text-sm mb-1">Fixed Cost Base</div>
          <div className="text-2xl font-bold text-amber-700">£680k</div>
          <div className="text-xs text-amber-600/80">annual (from 2027)</div>
        </div>
        <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 text-center">
          <Zap className="w-6 h-6 text-violet-600 mx-auto mb-2" />
          <div className="text-violet-600 font-semibold text-sm mb-1">EBITDA 2031</div>
          <div className="text-2xl font-bold text-violet-700">£51M</div>
          <div className="text-xs text-violet-600/80">51% margin</div>
        </div>
      </div>

      {/* Cost Structure Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Cost Structure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-border/30">
              <span className="text-sm text-muted-foreground">Fixed internal team</span>
              <span className="font-semibold">£460k → £680k/yr</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/30">
              <span className="text-sm text-muted-foreground">Variable outsourced costs</span>
              <span className="font-semibold">26% of revenue</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/30">
              <span className="text-sm text-muted-foreground">AI & infrastructure COGS</span>
              <span className="font-semibold">8% of revenue</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground">CAC / Sales & Marketing</span>
              <span className="font-semibold">8% of revenue</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Pre-Revenue Investment (2026-2028)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-border/30">
              <span className="text-sm text-muted-foreground">R&D</span>
              <span className="font-semibold">£2.0M</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/30">
              <span className="text-sm text-muted-foreground">Sales & Marketing</span>
              <span className="font-semibold">£1.75M</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/30">
              <span className="text-sm text-muted-foreground">G&A</span>
              <span className="font-semibold">£750k</span>
            </div>
            <div className="flex justify-between items-center py-2 bg-primary/5 rounded px-2 -mx-2">
              <span className="text-sm font-medium">Total Pre-Revenue</span>
              <span className="font-bold text-primary">£5.0M</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conclusion */}
      <div className="bg-gradient-to-r from-primary/10 to-violet-100 border border-primary/20 rounded-xl p-6">
        <h4 className="font-bold text-primary mb-2">Why This Model Works</h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 font-bold">✓</span>
            <span><strong>Low COGS (~8%):</strong> AI automation eliminates traditional labour-intensive document processing costs.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 font-bold">✓</span>
            <span><strong>Lean fixed base:</strong> Core team of 4-5 FTEs with outsourced variable functions scales efficiently.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 font-bold">✓</span>
            <span><strong>Operating leverage:</strong> OpEx drops from 250%+ of revenue (2026) to 41% by 2031.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 font-bold">✓</span>
            <span><strong>Rapid path to profit:</strong> EBITDA positive in Year 3, reaching 51% margin by 2031.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PLGrowthVisual;
