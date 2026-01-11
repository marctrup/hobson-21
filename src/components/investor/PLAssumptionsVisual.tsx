import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PLAssumptionsVisual = () => {
  return (
    <div className="space-y-6 lg:space-y-8 w-full max-w-full overflow-hidden">
      {/* Section 1: Revenue Model Assumptions */}
      <Card className="p-4 lg:p-6 bg-gradient-to-br from-purple-50 to-white border-purple-200">
        <div className="flex flex-col sm:flex-row items-start gap-3 lg:gap-4">
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xl lg:text-2xl">💰</span>
          </div>
          <div className="flex-1 w-full min-w-0">
            <h3 className="text-lg lg:text-xl font-bold text-foreground mb-2 lg:mb-3">Revenue Model Assumptions</h3>
            
            <h4 className="font-semibold text-foreground mt-3 lg:mt-4 mb-2 text-sm lg:text-base">Pricing (ARR basis)</h4>
            <ul className="space-y-2 text-sm lg:text-base text-muted-foreground mb-3 lg:mb-4">
              <li className="flex items-start gap-2">
                <span className="text-primary flex-shrink-0">•</span> 
                <span>Blended ARPU = <strong>£50.58/month → £607/year</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary flex-shrink-0">•</span> 
                <span>Pricing includes Essential, Essential Plus, Enterprise mix</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary flex-shrink-0">•</span> 
                <span>No implementation fees (frictionless onboarding)</span>
              </li>
            </ul>

            <h4 className="font-semibold text-foreground mt-3 lg:mt-4 mb-2 text-sm lg:text-base">Customer Growth & Penetration (Aligned to GTM Timeline)</h4>
            <ul className="space-y-2 text-sm lg:text-base text-muted-foreground mb-3 lg:mb-4">
              <li className="flex items-start gap-2">
                <span className="text-primary flex-shrink-0">•</span> 
                <span>UK: <strong>0.5% → 1.8% penetration (2027–2031)</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary flex-shrink-0">•</span> 
                <span>Global (OECD markets): <strong>0.25% → 0.6% penetration (2028–2031)</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary flex-shrink-0">•</span> 
                <span>Revenue expands via subscription use + optional HEU top-ups</span>
              </li>
            </ul>

            <h4 className="font-semibold text-foreground mt-3 lg:mt-4 mb-2 text-sm lg:text-base">Market Size Basis</h4>
            <ul className="space-y-2 text-sm lg:text-base text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary flex-shrink-0">•</span> 
                <span>UK real estate businesses: <strong>235,200</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary flex-shrink-0">•</span> 
                <span>Global comparable markets: <strong>4.23M</strong> (18× UK, OECD-adjusted)</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Section 2: Cost of Goods Sold (COGS) Assumptions */}
      <Card className="p-4 lg:p-6 bg-gradient-to-br from-green-50 to-white border-green-200">
        <div className="flex flex-col sm:flex-row items-start gap-3 lg:gap-4">
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xl lg:text-2xl">🤖</span>
          </div>
          <div className="flex-1 w-full min-w-0">
            <h3 className="text-lg lg:text-xl font-bold text-foreground mb-2 lg:mb-3">Cost of Goods Sold (COGS) Assumptions</h3>
            
            <h4 className="font-semibold text-foreground mt-3 lg:mt-4 mb-2 lg:mb-3 text-sm lg:text-base">AI Processing & Onboarding Costs</h4>
            <p className="text-xs lg:text-sm text-muted-foreground mb-2 lg:mb-3">Based on OpenAI 5.1 Mini usage:</p>
            <div className="overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0">
              <Table className="min-w-[280px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs lg:text-sm">Unit Composition</TableHead>
                    <TableHead className="text-right text-xs lg:text-sm">Cost per Unit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="text-xs lg:text-sm">1 Complex</TableCell>
                    <TableCell className="text-right text-xs lg:text-sm">$0.40</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-xs lg:text-sm">3 Medium</TableCell>
                    <TableCell className="text-right text-xs lg:text-sm">$0.30</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-xs lg:text-sm">2 Simple</TableCell>
                    <TableCell className="text-right text-xs lg:text-sm">$0.04–$0.06</TableCell>
                  </TableRow>
                  <TableRow className="font-bold bg-muted/50">
                    <TableCell className="text-xs lg:text-sm">Total AI Onboarding Cost/Unit</TableCell>
                    <TableCell className="text-right text-green-600 text-xs lg:text-sm">$0.74–$0.76 (£0.60)</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <h4 className="font-semibold text-foreground mt-4 lg:mt-6 mb-2 lg:mb-3 text-sm lg:text-base">Client Onboarding COGS</h4>
            <div className="overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0">
              <Table className="min-w-[280px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs lg:text-sm">Client Size</TableHead>
                    <TableHead className="text-center text-xs lg:text-sm">Units</TableHead>
                    <TableHead className="text-right text-xs lg:text-sm">Total Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="text-xs lg:text-sm">Small</TableCell>
                    <TableCell className="text-center text-xs lg:text-sm">5</TableCell>
                    <TableCell className="text-right font-bold text-green-600 text-xs lg:text-sm">£3–£4</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-xs lg:text-sm">Medium</TableCell>
                    <TableCell className="text-center text-xs lg:text-sm">100</TableCell>
                    <TableCell className="text-right font-bold text-green-600 text-xs lg:text-sm">£60–£70</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-xs lg:text-sm">Large</TableCell>
                    <TableCell className="text-center text-xs lg:text-sm">1,000</TableCell>
                    <TableCell className="text-right font-bold text-green-600 text-xs lg:text-sm">£600–£700</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="mt-3 lg:mt-4 p-2 lg:p-3 bg-green-100/50 rounded-lg">
              <p className="text-xs lg:text-sm font-medium text-green-800">
                Implication: AI onboarding cost per customer is trivial → <strong>Gross margin ~95–97%</strong>
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Section 3: Infrastructure Cost Assumptions */}
      <Card className="p-4 lg:p-6 bg-gradient-to-br from-blue-50 to-white border-blue-200">
        <div className="flex flex-col sm:flex-row items-start gap-3 lg:gap-4">
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xl lg:text-2xl">🏗️</span>
          </div>
          <div className="flex-1 w-full min-w-0">
            <h3 className="text-lg lg:text-xl font-bold text-foreground mb-2 lg:mb-3">Infrastructure Cost Assumptions</h3>
            
            <h4 className="font-semibold text-foreground mt-3 lg:mt-4 mb-2 text-sm lg:text-base">Core Architecture Components</h4>
            <p className="text-sm lg:text-base text-muted-foreground mb-2 lg:mb-3">Our architecture includes:</p>
            <ul className="space-y-2 text-sm lg:text-base text-muted-foreground mb-3 lg:mb-4">
              <li className="flex items-center gap-2">
                <span className="text-blue-600 flex-shrink-0">•</span> LLM inference (OpenAI)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600 flex-shrink-0">•</span> Vector DB
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600 flex-shrink-0">•</span> Knowledge Graph engine
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600 flex-shrink-0">•</span> MongoDB
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600 flex-shrink-0">•</span> Storage (S3-equivalent)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600 flex-shrink-0">•</span> Monitoring & quality checks
              </li>
            </ul>

            <h4 className="font-semibold text-foreground mt-3 lg:mt-4 mb-2 text-sm lg:text-base">Infrastructure Assumptions</h4>
            <ul className="space-y-2 text-sm lg:text-base text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 flex-shrink-0">•</span> 
                <span>Cost = <strong>8–12% of revenue</strong> (scales with usage)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 flex-shrink-0">•</span> 
                <span>Includes: cloud compute, indexing, embeddings, vector search, monitoring, backups</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 flex-shrink-0">•</span> 
                <span>Efficiency improves over time via: document deduplication, shared embeddings, caching of high-frequency queries</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Section 4: Operating Expense (OpEx) Assumptions */}
      <Card className="p-4 lg:p-6 bg-gradient-to-br from-amber-50 to-white border-amber-200">
        <div className="flex flex-col sm:flex-row items-start gap-3 lg:gap-4">
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xl lg:text-2xl">👥</span>
          </div>
          <div className="flex-1 w-full min-w-0">
            <h3 className="text-lg lg:text-xl font-bold text-foreground mb-2 lg:mb-3">Operating Expense (OpEx) Assumptions</h3>
            
            <h4 className="font-semibold text-foreground mt-3 lg:mt-4 mb-2 lg:mb-3 text-sm lg:text-base">Internal Team (Lean, Senior Core)</h4>
            <p className="text-sm lg:text-base text-muted-foreground mb-2 lg:mb-3">We keep the team tight and high-leverage:</p>
            <div className="overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0">
              <Table className="min-w-[400px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs lg:text-sm">Role</TableHead>
                    <TableHead className="text-xs lg:text-sm">Cost Basis</TableHead>
                    <TableHead className="text-xs lg:text-sm hidden sm:table-cell">Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium text-xs lg:text-sm">CEO</TableCell>
                    <TableCell className="text-xs lg:text-sm">Fixed salary</TableCell>
                    <TableCell className="text-xs text-muted-foreground hidden sm:table-cell">Strategic + investor relations</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-xs lg:text-sm">Head of Product</TableCell>
                    <TableCell className="text-xs lg:text-sm">Fixed salary</TableCell>
                    <TableCell className="text-xs text-muted-foreground hidden sm:table-cell">Owns roadmap, QA, user research</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-xs lg:text-sm">Head of Marketing</TableCell>
                    <TableCell className="text-xs lg:text-sm">Fixed salary</TableCell>
                    <TableCell className="text-xs text-muted-foreground hidden sm:table-cell">Controls outsourced execution</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-xs lg:text-sm">Head of Sales</TableCell>
                    <TableCell className="text-xs lg:text-sm">Fixed + light commissions</TableCell>
                    <TableCell className="text-xs text-muted-foreground hidden sm:table-cell">Enterprise / channel development</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-xs lg:text-sm">Head of Customer Support</TableCell>
                    <TableCell className="text-xs lg:text-sm">Fixed salary</TableCell>
                    <TableCell className="text-xs text-muted-foreground hidden sm:table-cell">Manages first-line team</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-xs lg:text-sm">Internal Support Agents</TableCell>
                    <TableCell className="text-xs lg:text-sm">Salaries</TableCell>
                    <TableCell className="text-xs text-muted-foreground hidden sm:table-cell">Scale with customers</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <p className="text-xs lg:text-sm text-muted-foreground mt-2 lg:mt-3">
              <strong>Total Internal Team Cost:</strong> → <span className="text-primary font-bold">30–35% of revenue in early years, falling to ~20% by 2031</span>
            </p>

            <h4 className="font-semibold text-foreground mt-4 lg:mt-6 mb-2 lg:mb-3 text-sm lg:text-base">Outsourced Functions</h4>
            <p className="text-sm lg:text-base text-muted-foreground mb-2 lg:mb-3">Used to minimise fixed costs:</p>
            <div className="overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0">
              <Table className="min-w-[300px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs lg:text-sm">Function</TableHead>
                    <TableHead className="text-xs lg:text-sm">Cost Basis</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium text-xs lg:text-sm">Digital marketing execution</TableCell>
                    <TableCell className="text-xs lg:text-sm">Retainer + performance budget</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-xs lg:text-sm">External engineering</TableCell>
                    <TableCell className="text-xs lg:text-sm">Project-based (new features, scaling)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-xs lg:text-sm">Corporate services</TableCell>
                    <TableCell className="text-xs lg:text-sm">Legal, compliance, accounting</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <p className="text-xs lg:text-sm text-muted-foreground mt-2 lg:mt-3">
              <strong>Assumption:</strong> <span className="text-primary font-bold">10–15% of revenue</span>
            </p>
          </div>
        </div>
      </Card>

      {/* Section 5: Sales & Marketing Spend */}
      <Card className="p-4 lg:p-6 bg-gradient-to-br from-pink-50 to-white border-pink-200">
        <div className="flex flex-col sm:flex-row items-start gap-3 lg:gap-4">
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xl lg:text-2xl">📣</span>
          </div>
          <div className="w-full">
            <h3 className="text-lg lg:text-xl font-bold text-foreground mb-2 lg:mb-3">Sales & Marketing Spend</h3>
            <ul className="space-y-2 text-sm lg:text-base text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-pink-600 flex-shrink-0">•</span> 
                <span>Low due to organic channels (LinkedIn, SEO, quiz funnel)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-600 flex-shrink-0">•</span> 
                <span>Paid acquisition is selective and ROI-focused</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-600 flex-shrink-0">•</span> 
                <span>Channels scale gradually after 2027 launch</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-600 flex-shrink-0">•</span> 
                <span>Assumption: <strong className="text-primary">15–20% of revenue</strong> depending on growth phase</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Section 6: Profitability Trajectory */}
      <Card className="p-4 lg:p-6 bg-gradient-to-br from-indigo-50 to-white border-indigo-200">
        <div className="flex flex-col sm:flex-row items-start gap-3 lg:gap-4">
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xl lg:text-2xl">📈</span>
          </div>
          <div className="flex-1 w-full min-w-0">
            <h3 className="text-lg lg:text-xl font-bold text-foreground mb-2 lg:mb-3">Profitability Trajectory</h3>
            <h4 className="font-semibold text-foreground mb-2 lg:mb-3 text-sm lg:text-base">High-level model assumptions:</h4>
            <ul className="space-y-2 text-sm lg:text-base text-muted-foreground mb-3 lg:mb-4">
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 flex-shrink-0">•</span> 
                <span>Gross margin: <strong className="text-green-600">95–97%</strong> (AI + infrastructure)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 flex-shrink-0">•</span> 
                <span>EBITDA breakeven expected once ARR &gt; <strong>£5M</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 flex-shrink-0">•</span>
                <span>Profits expand as: infrastructure % falls, global market grows, onboarding becomes self-serve, engineering becomes incremental (not foundational)</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Section 7: Summary */}
      <Card className="p-4 lg:p-6 bg-gradient-to-br from-purple-100 to-purple-50 border-purple-300">
        <div className="flex flex-col sm:flex-row items-start gap-3 lg:gap-4">
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-purple-200 flex items-center justify-center flex-shrink-0">
            <span className="text-xl lg:text-2xl">✨</span>
          </div>
          <div className="w-full">
            <h3 className="text-lg lg:text-xl font-bold text-foreground mb-3 lg:mb-4">Summary</h3>
            <p className="text-sm lg:text-base text-muted-foreground mb-3 lg:mb-4">
              Hobson's P/L assumptions demonstrate a <strong>high-margin, scalable, predictable AI SaaS model</strong> backed by:
            </p>
            <ul className="space-y-2 lg:space-y-3">
              <li className="flex items-start gap-2 lg:gap-3">
                <span className="text-green-600 font-bold flex-shrink-0 text-sm lg:text-base">1.</span>
                <span className="text-xs lg:text-sm text-muted-foreground"><strong>Ultra-low onboarding costs</strong> (&lt; £1 per unit)</span>
              </li>
              <li className="flex items-start gap-2 lg:gap-3">
                <span className="text-green-600 font-bold flex-shrink-0 text-sm lg:text-base">2.</span>
                <span className="text-xs lg:text-sm text-muted-foreground"><strong>Lean team with outsourced flexibility</strong></span>
              </li>
              <li className="flex items-start gap-2 lg:gap-3">
                <span className="text-green-600 font-bold flex-shrink-0 text-sm lg:text-base">3.</span>
                <span className="text-xs lg:text-sm text-muted-foreground"><strong>Frictionless, low-price adoption</strong></span>
              </li>
              <li className="flex items-start gap-2 lg:gap-3">
                <span className="text-green-600 font-bold flex-shrink-0 text-sm lg:text-base">4.</span>
                <span className="text-xs lg:text-sm text-muted-foreground"><strong>Strong ROI justification</strong> (£6,000 saved per employee)</span>
              </li>
              <li className="flex items-start gap-2 lg:gap-3">
                <span className="text-green-600 font-bold flex-shrink-0 text-sm lg:text-base">5.</span>
                <span className="text-xs lg:text-sm text-muted-foreground"><strong>Massive document-driven demand</strong> across global markets</span>
              </li>
              <li className="flex items-start gap-2 lg:gap-3">
                <span className="text-green-600 font-bold flex-shrink-0 text-sm lg:text-base">6.</span>
                <span className="text-xs lg:text-sm text-muted-foreground"><strong>Architecture designed for cost efficiency at scale</strong></span>
              </li>
            </ul>
            <div className="mt-4 lg:mt-6 p-3 lg:p-4 bg-purple-200/50 rounded-lg">
              <p className="text-xs lg:text-sm font-semibold text-purple-900">
                ➡ This supports a path to very high margins, attractive capital efficiency, and global scalability.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PLAssumptionsVisual;