import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CACAssumptionsVisual = () => {
  return (
    <div className="space-y-6 lg:space-y-8 w-full max-w-full overflow-hidden">
      {/* Section 1: Core Inputs */}
      <Card className="p-4 lg:p-6 bg-gradient-to-br from-purple-50 to-white border-purple-200">
        <div className="flex flex-col sm:flex-row items-start gap-3 lg:gap-4">
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xl lg:text-2xl">📊</span>
          </div>
          <div className="flex-1 w-full min-w-0">
            <h3 className="text-lg lg:text-xl font-bold text-foreground mb-2 lg:mb-3">Core Inputs</h3>
            
            <h4 className="font-semibold text-foreground mt-3 lg:mt-4 mb-2 lg:mb-3 text-sm lg:text-base">Revenue (ARR)</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-4 lg:mb-6">
              {[
                { year: "2027", value: "£0.708M" },
                { year: "2028", value: "£6.71M" },
                { year: "2029", value: "£9.10M" },
                { year: "2030", value: "£12.53M" },
                { year: "2031", value: "£14.92M" },
              ].map((item) => (
                <div key={item.year} className="text-center p-2 bg-purple-100/50 rounded-lg">
                  <div className="text-[10px] lg:text-sm text-muted-foreground">{item.year}</div>
                  <div className="text-xs lg:text-base font-bold text-primary">{item.value}</div>
                </div>
              ))}
            </div>

            <h4 className="font-semibold text-foreground mt-3 lg:mt-4 mb-2 lg:mb-3 text-sm lg:text-base">New Customers Added per Year</h4>
            
            <div className="grid md:grid-cols-2 gap-3 lg:gap-4 mb-3 lg:mb-4">
              {/* UK Table */}
              <div className="overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0">
                <Table className="min-w-[240px]">
                  <TableHeader>
                    <TableRow className="bg-purple-100/70 hover:bg-purple-100/70">
                      <TableHead colSpan={3} className="text-center">
                        <span className="text-sm lg:text-lg font-bold text-purple-700">UK</span>
                      </TableHead>
                    </TableRow>
                    <TableRow>
                      <TableHead className="text-xs lg:text-sm">Year</TableHead>
                      <TableHead className="text-right text-xs lg:text-sm">Customers</TableHead>
                      <TableHead className="text-right text-xs lg:text-sm">New</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { year: "2027", customers: "2,352", new: "2,352" },
                      { year: "2028", customers: "2,940", new: "588" },
                      { year: "2029", customers: "3,528", new: "588" },
                      { year: "2030", customers: "4,116", new: "588" },
                      { year: "2031", customers: "4,704", new: "588" },
                    ].map((row) => (
                      <TableRow key={row.year}>
                        <TableCell className="text-xs lg:text-sm">{row.year}</TableCell>
                        <TableCell className="text-right text-xs lg:text-sm">{row.customers}</TableCell>
                        <TableCell className="text-right font-medium text-primary text-xs lg:text-sm">{row.new}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Global Table */}
              <div className="overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0">
                <Table className="min-w-[240px]">
                  <TableHeader>
                    <TableRow className="bg-indigo-100/70 hover:bg-indigo-100/70">
                      <TableHead colSpan={3} className="text-center">
                        <span className="text-sm lg:text-lg font-bold text-indigo-700">Global</span>
                      </TableHead>
                    </TableRow>
                    <TableRow>
                      <TableHead className="text-xs lg:text-sm">Year</TableHead>
                      <TableHead className="text-right text-xs lg:text-sm">Customers</TableHead>
                      <TableHead className="text-right text-xs lg:text-sm">New</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { year: "2028", customers: "10,584", new: "10,584" },
                      { year: "2029", customers: "14,818", new: "4,234" },
                      { year: "2030", customers: "21,168", new: "6,350" },
                      { year: "2031", customers: "25,402", new: "4,234" },
                    ].map((row) => (
                      <TableRow key={row.year}>
                        <TableCell className="text-xs lg:text-sm">{row.year}</TableCell>
                        <TableCell className="text-right text-xs lg:text-sm">{row.customers}</TableCell>
                        <TableCell className="text-right font-medium text-primary text-xs lg:text-sm">{row.new}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Total New Customers per Year */}
            <h5 className="text-xs lg:text-sm font-semibold text-muted-foreground mb-2 mt-3 lg:mt-4">Total number of new customers gained in that year</h5>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {[
                { year: "2027", value: "2,352" },
                { year: "2028", value: "11,172" },
                { year: "2029", value: "4,822" },
                { year: "2030", value: "6,938" },
                { year: "2031", value: "4,822" },
              ].map((item) => (
                <div key={item.year} className="text-center p-2 bg-purple-100/50 rounded-lg">
                  <div className="text-[10px] lg:text-sm text-muted-foreground">{item.year}</div>
                  <div className="text-xs lg:text-base font-bold text-foreground">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Section 2: Acquisition Spend */}
      <Card className="p-4 lg:p-6 bg-gradient-to-br from-blue-50 to-white border-blue-200">
        <div className="flex flex-col sm:flex-row items-start gap-3 lg:gap-4">
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xl lg:text-2xl">💸</span>
          </div>
          <div className="flex-1 w-full min-w-0">
            <h3 className="text-lg lg:text-xl font-bold text-foreground mb-2 lg:mb-3">Acquisition Spend (% of Revenue)</h3>
            <p className="text-sm lg:text-base text-muted-foreground mb-3 lg:mb-4">
              Only 2 cost areas directly contribute to customer acquisition:
            </p>
            <div className="grid grid-cols-2 gap-2 lg:gap-4 mb-3 lg:mb-4">
              <div className="p-2 lg:p-4 bg-blue-100/50 rounded-lg">
                <div className="text-sm lg:text-lg font-bold text-blue-700">Digital Marketing</div>
                <div className="text-xl lg:text-2xl font-bold text-foreground">8%</div>
                <div className="text-xs lg:text-sm text-muted-foreground">of revenue</div>
              </div>
              <div className="p-2 lg:p-4 bg-blue-100/50 rounded-lg">
                <div className="text-sm lg:text-lg font-bold text-blue-700">Sales/SDR</div>
                <div className="text-xl lg:text-2xl font-bold text-foreground">4%</div>
                <div className="text-xs lg:text-sm text-muted-foreground">of revenue</div>
              </div>
            </div>
            <div className="p-2 lg:p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="text-center">
                <span className="text-xs lg:text-sm text-muted-foreground">Total CAC Spend = </span>
                <span className="text-lg lg:text-2xl font-bold text-primary">12% of Annual Revenue</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Section 3: CAC Calculation */}
      <Card className="p-4 lg:p-6 bg-gradient-to-br from-green-50 to-white border-green-200">
        <div className="flex flex-col sm:flex-row items-start gap-3 lg:gap-4">
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xl lg:text-2xl">🧮</span>
          </div>
          <div className="flex-1 w-full min-w-0">
            <h3 className="text-lg lg:text-xl font-bold text-foreground mb-2 lg:mb-3">CAC Table (2027–2031)</h3>
            <div className="p-2 lg:p-3 bg-green-100/50 rounded-lg mb-3 lg:mb-4">
              <p className="text-xs lg:text-sm font-medium text-green-800">
                <strong>Formula:</strong> CAC = (Revenue × 12%) ÷ New Customers
              </p>
            </div>
            <div className="overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0">
              <Table className="min-w-[400px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs lg:text-sm">Year</TableHead>
                    <TableHead className="text-right text-xs lg:text-sm">Revenue</TableHead>
                    <TableHead className="text-right text-xs lg:text-sm">Acq. Spend</TableHead>
                    <TableHead className="text-right text-xs lg:text-sm">New Cust.</TableHead>
                    <TableHead className="text-right text-xs lg:text-sm">CAC</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { year: "2027", revenue: "£0.708M", spend: "£140k", customers: "2,352", cac: "£60" },
                    { year: "2028", revenue: "£6.71M", spend: "£805k", customers: "11,172", cac: "£72" },
                    { year: "2029", revenue: "£9.10M", spend: "£1.09M", customers: "4,822", cac: "£226" },
                    { year: "2030", revenue: "£12.53M", spend: "£1.50M", customers: "6,938", cac: "£217" },
                    { year: "2031", revenue: "£14.92M", spend: "£1.79M", customers: "4,822", cac: "£371" },
                  ].map((row) => (
                    <TableRow key={row.year}>
                      <TableCell className="font-medium text-xs lg:text-sm">{row.year}</TableCell>
                      <TableCell className="text-right text-xs lg:text-sm">{row.revenue}</TableCell>
                      <TableCell className="text-right text-xs lg:text-sm">{row.spend}</TableCell>
                      <TableCell className="text-right text-xs lg:text-sm">{row.customers}</TableCell>
                      <TableCell className="text-right font-bold text-green-600 text-xs lg:text-sm">{row.cac}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </Card>

      {/* Section 4: CAC Trend Interpretation */}
      <Card className="p-4 lg:p-6 bg-gradient-to-br from-amber-50 to-white border-amber-200">
        <div className="flex flex-col sm:flex-row items-start gap-3 lg:gap-4">
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xl lg:text-2xl">📈</span>
          </div>
          <div className="flex-1 w-full min-w-0">
            <h3 className="text-lg lg:text-xl font-bold text-foreground mb-3 lg:mb-4">Interpreting the CAC Trend</h3>
            
            <div className="space-y-3 lg:space-y-4">
              <div className="p-3 lg:p-4 bg-green-100/50 rounded-lg border-l-4 border-green-500">
                <h4 className="font-semibold text-green-800 mb-1 lg:mb-2 text-sm lg:text-base">Early Years (2027–2028): Low CAC</h4>
                <ul className="space-y-1 text-xs lg:text-sm text-green-700">
                  <li>• UK-only launch with low marketing intensity</li>
                  <li>• High volume of early global customers when global market opens in 2028</li>
                </ul>
              </div>

              <div className="p-3 lg:p-4 bg-amber-100/50 rounded-lg border-l-4 border-amber-500">
                <h4 className="font-semibold text-amber-800 mb-1 lg:mb-2 text-sm lg:text-base">Middle Years (2029–2030): Modest Rise</h4>
                <ul className="space-y-1 text-xs lg:text-sm text-amber-700">
                  <li>• CAC rises modestly as marketing becomes more competitive globally</li>
                </ul>
              </div>

              <div className="p-3 lg:p-4 bg-orange-100/50 rounded-lg border-l-4 border-orange-500">
                <h4 className="font-semibold text-orange-800 mb-1 lg:mb-2 text-sm lg:text-base">2031 Spike: Normal for Maturing SaaS</h4>
                <ul className="space-y-1 text-xs lg:text-sm text-orange-700">
                  <li>• Penetration slows → fewer incremental customers</li>
                  <li>• Same 12% spend spread across fewer new accounts</li>
                  <li>• This is normal for SaaS models approaching market saturation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Section 5: LTV:CAC Ratio */}
      <Card className="p-4 lg:p-6 bg-gradient-to-br from-indigo-50 to-white border-indigo-200">
        <div className="flex flex-col sm:flex-row items-start gap-3 lg:gap-4">
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xl lg:text-2xl">💎</span>
          </div>
          <div className="flex-1 w-full min-w-0">
            <h3 className="text-lg lg:text-xl font-bold text-foreground mb-2 lg:mb-3">CAC vs ARPU (LTV Comparison)</h3>
            
            <div className="grid grid-cols-2 gap-2 lg:gap-4 mb-3 lg:mb-4">
              <div className="p-2 lg:p-4 bg-indigo-100/50 rounded-lg">
                <div className="text-xs lg:text-sm text-muted-foreground">ARPU</div>
                <div className="text-base lg:text-xl font-bold text-foreground">£495.72 / year</div>
              </div>
              <div className="p-2 lg:p-4 bg-indigo-100/50 rounded-lg">
                <div className="text-xs lg:text-sm text-muted-foreground">LTV (5-year lifetime)</div>
                <div className="text-base lg:text-xl font-bold text-foreground">£2,478.60</div>
              </div>
            </div>

            <div className="overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0">
              <Table className="min-w-[320px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs lg:text-sm">Year</TableHead>
                    <TableHead className="text-right text-xs lg:text-sm">CAC</TableHead>
                    <TableHead className="text-right text-xs lg:text-sm">LTV</TableHead>
                    <TableHead className="text-right text-xs lg:text-sm">LTV:CAC</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { year: "2027", cac: "£60", ltv: "£2,478.60", ratio: "41×" },
                    { year: "2028", cac: "£72", ltv: "£2,478.60", ratio: "34×" },
                    { year: "2029", cac: "£226", ltv: "£2,478.60", ratio: "11×" },
                    { year: "2030", cac: "£217", ltv: "£2,478.60", ratio: "11×" },
                    { year: "2031", cac: "£371", ltv: "£2,478.60", ratio: "7×" },
                  ].map((row) => (
                    <TableRow key={row.year}>
                      <TableCell className="font-medium text-xs lg:text-sm">{row.year}</TableCell>
                      <TableCell className="text-right text-xs lg:text-sm">{row.cac}</TableCell>
                      <TableCell className="text-right text-xs lg:text-sm">{row.ltv}</TableCell>
                      <TableCell className="text-right font-bold text-indigo-600 text-xs lg:text-sm">{row.ratio}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-3 lg:mt-4 p-2 lg:p-3 bg-green-100/50 rounded-lg">
              <p className="text-xs lg:text-sm font-medium text-green-800">
                VC-attractive threshold is <strong>3×</strong>. Your model is <strong>far above this</strong> at 7×–41×.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Section 6: CAC Payback Period */}
      <Card className="p-4 lg:p-6 bg-gradient-to-br from-pink-50 to-white border-pink-200">
        <div className="flex flex-col sm:flex-row items-start gap-3 lg:gap-4">
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xl lg:text-2xl">⏱️</span>
          </div>
          <div className="flex-1 w-full min-w-0">
            <h3 className="text-lg lg:text-xl font-bold text-foreground mb-2 lg:mb-3">CAC Payback Period</h3>
            
            <div className="p-2 lg:p-3 bg-pink-100/50 rounded-lg mb-3 lg:mb-4">
              <p className="text-xs lg:text-sm font-medium text-pink-800">
                <strong>Formula:</strong> Payback = CAC ÷ Monthly ARPU (£41.31)
              </p>
            </div>

            <div className="overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0">
              <Table className="min-w-[280px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs lg:text-sm">Year</TableHead>
                    <TableHead className="text-right text-xs lg:text-sm">CAC</TableHead>
                    <TableHead className="text-right text-xs lg:text-sm">Payback (months)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { year: "2027", cac: "£60", payback: "1.5 months" },
                    { year: "2028", cac: "£72", payback: "1.7 months" },
                    { year: "2029", cac: "£226", payback: "5.5 months" },
                    { year: "2030", cac: "£217", payback: "5.2 months" },
                    { year: "2031", cac: "£371", payback: "9.0 months" },
                  ].map((row) => (
                    <TableRow key={row.year}>
                      <TableCell className="font-medium text-xs lg:text-sm">{row.year}</TableCell>
                      <TableCell className="text-right text-xs lg:text-sm">{row.cac}</TableCell>
                      <TableCell className="text-right font-bold text-pink-600 text-xs lg:text-sm">{row.payback}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-3 lg:mt-4 p-2 lg:p-3 bg-green-100/50 rounded-lg">
              <p className="text-xs lg:text-sm font-medium text-green-800">
                All payback periods are <strong>well under 12 months</strong>, which is excellent for SaaS.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Section 7: Summary */}
      <Card className="p-4 lg:p-6 bg-gradient-to-br from-purple-100 to-purple-50 border-purple-300">
        <div className="flex flex-col sm:flex-row items-start gap-3 lg:gap-4">
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-purple-200 flex items-center justify-center flex-shrink-0">
            <span className="text-xl lg:text-2xl">✨</span>
          </div>
          <div className="flex-1 w-full min-w-0">
            <h3 className="text-lg lg:text-xl font-bold text-foreground mb-3 lg:mb-4">CAC Assumption Summary</h3>
            
            <div className="space-y-3 lg:space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2 text-sm lg:text-base">Acquisition Spend Drivers</h4>
                <ul className="space-y-1 text-muted-foreground text-xs lg:text-sm">
                  <li>• Digital Marketing = 8% of revenue</li>
                  <li>• Sales/SDR Support = 4% of revenue</li>
                  <li>• <strong>Total CAC Spend = 12% of revenue</strong></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2 text-sm lg:text-base">Calculated CAC</h4>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {[
                    { year: "2027", value: "£60" },
                    { year: "2028", value: "£72" },
                    { year: "2029", value: "£226" },
                    { year: "2030", value: "£217" },
                    { year: "2031", value: "£371" },
                  ].map((item) => (
                    <div key={item.year} className="text-center p-2 bg-purple-200/50 rounded-lg">
                      <div className="text-[10px] lg:text-xs text-muted-foreground">{item.year}</div>
                      <div className="text-xs lg:text-sm font-bold text-primary">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-4 mt-3 lg:mt-4">
                <div className="p-3 lg:p-4 bg-green-100/50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-1 lg:mb-2 text-sm lg:text-base">CAC Payback</h4>
                  <ul className="text-xs lg:text-sm text-green-700 space-y-1">
                    <li>• Monthly ARPU = £41.31</li>
                    <li>• Payback period = 1.5 → 9 months</li>
                    <li>• <strong>All under 12 months</strong></li>
                  </ul>
                </div>
                <div className="p-3 lg:p-4 bg-indigo-100/50 rounded-lg">
                  <h4 className="font-semibold text-indigo-800 mb-1 lg:mb-2 text-sm lg:text-base">LTV:CAC</h4>
                  <ul className="text-xs lg:text-sm text-indigo-700 space-y-1">
                    <li>• LTV (5-year life): £2,478.60</li>
                    <li>• LTV:CAC = <strong>7×–41×</strong></li>
                    <li>• VC threshold: 3× (far exceeded)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CACAssumptionsVisual;