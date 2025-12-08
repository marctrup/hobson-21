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
    <div className="space-y-8">
      {/* Section 1: Revenue Model Assumptions */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-white border-purple-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">💰</span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-3">Revenue Model Assumptions</h3>
            
            <h4 className="font-semibold text-foreground mt-4 mb-2">Pricing (ARR basis)</h4>
            <ul className="space-y-2 text-muted-foreground mb-4">
              <li className="flex items-center gap-2">
                <span className="text-primary">•</span> Blended ARPU = <strong>£41.31/month → £495.72/year</strong>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">•</span> Pricing includes Essential, Essential Plus, Enterprise mix
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">•</span> No implementation fees (frictionless onboarding)
              </li>
            </ul>

            <h4 className="font-semibold text-foreground mt-4 mb-2">Customer Growth & Penetration (Aligned to GTM Timeline)</h4>
            <ul className="space-y-2 text-muted-foreground mb-4">
              <li className="flex items-center gap-2">
                <span className="text-primary">•</span> UK: <strong>1.0% → 2.0% penetration (2027–2031)</strong>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">•</span> Global (OECD markets): <strong>0.25% → 0.6% penetration (2028–2031)</strong>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">•</span> Revenue expands via subscription use + optional HEU top-ups
              </li>
            </ul>

            <h4 className="font-semibold text-foreground mt-4 mb-2">Market Size Basis</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="text-primary">•</span> UK real estate businesses: <strong>235,200</strong>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">•</span> Global comparable markets: <strong>4.23M</strong> (18× UK, OECD-adjusted)
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Section 2: Cost of Goods Sold (COGS) Assumptions */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-white border-green-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">🤖</span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-3">Cost of Goods Sold (COGS) Assumptions</h3>
            
            <h4 className="font-semibold text-foreground mt-4 mb-3">AI Processing & Onboarding Costs</h4>
            <p className="text-sm text-muted-foreground mb-3">Based on OpenAI 5.1 Mini usage:</p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Unit Composition</TableHead>
                  <TableHead className="text-right">Cost per Unit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>1 Complex</TableCell>
                  <TableCell className="text-right">$0.40</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>3 Medium</TableCell>
                  <TableCell className="text-right">$0.30</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2 Simple</TableCell>
                  <TableCell className="text-right">$0.04–$0.06</TableCell>
                </TableRow>
                <TableRow className="font-bold bg-muted/50">
                  <TableCell>Total AI Onboarding Cost/Unit</TableCell>
                  <TableCell className="text-right text-green-600">$0.74–$0.76 (£0.60)</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <h4 className="font-semibold text-foreground mt-6 mb-3">Client Onboarding COGS</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Size</TableHead>
                  <TableHead className="text-center">Units</TableHead>
                  <TableHead className="text-right">Total Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Small</TableCell>
                  <TableCell className="text-center">5</TableCell>
                  <TableCell className="text-right font-bold text-green-600">£3–£4</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Medium</TableCell>
                  <TableCell className="text-center">100</TableCell>
                  <TableCell className="text-right font-bold text-green-600">£60–£70</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Large</TableCell>
                  <TableCell className="text-center">1,000</TableCell>
                  <TableCell className="text-right font-bold text-green-600">£600–£700</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <div className="mt-4 p-3 bg-green-100/50 rounded-lg">
              <p className="text-sm font-medium text-green-800">
                Implication: AI onboarding cost per customer is trivial → <strong>Gross margin ~95–97%</strong>
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Section 3: Infrastructure Cost Assumptions */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">🏗️</span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-3">Infrastructure Cost Assumptions</h3>
            
            <h4 className="font-semibold text-foreground mt-4 mb-2">Core Architecture Components</h4>
            <p className="text-muted-foreground mb-3">Our architecture includes:</p>
            <ul className="space-y-2 text-muted-foreground mb-4">
              <li className="flex items-center gap-2">
                <span className="text-blue-600">•</span> LLM inference (OpenAI)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600">•</span> Vector DB
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600">•</span> Knowledge Graph engine
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600">•</span> MongoDB
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600">•</span> Storage (S3-equivalent)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600">•</span> Monitoring & quality checks
              </li>
            </ul>

            <h4 className="font-semibold text-foreground mt-4 mb-2">Infrastructure Assumptions</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="text-blue-600">•</span> Cost = <strong>8–12% of revenue</strong> (scales with usage)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600">•</span> Includes: cloud compute, indexing, embeddings, vector search, monitoring, backups
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span> 
                <span>Efficiency improves over time via: document deduplication, shared embeddings, caching of high-frequency queries</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Section 4: Operating Expense (OpEx) Assumptions */}
      <Card className="p-6 bg-gradient-to-br from-amber-50 to-white border-amber-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">👥</span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-3">Operating Expense (OpEx) Assumptions</h3>
            
            <h4 className="font-semibold text-foreground mt-4 mb-3">Internal Team (Lean, Senior Core)</h4>
            <p className="text-muted-foreground mb-3">We keep the team tight and high-leverage:</p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Cost Basis</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">CEO</TableCell>
                  <TableCell>Fixed salary</TableCell>
                  <TableCell className="text-sm text-muted-foreground">Strategic + investor relations</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Head of Product</TableCell>
                  <TableCell>Fixed salary</TableCell>
                  <TableCell className="text-sm text-muted-foreground">Owns roadmap, QA, user research</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Head of Marketing</TableCell>
                  <TableCell>Fixed salary</TableCell>
                  <TableCell className="text-sm text-muted-foreground">Controls outsourced execution</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Head of Sales</TableCell>
                  <TableCell>Fixed salary + light commissions</TableCell>
                  <TableCell className="text-sm text-muted-foreground">Enterprise / channel development</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Head of Customer Support</TableCell>
                  <TableCell>Fixed salary</TableCell>
                  <TableCell className="text-sm text-muted-foreground">Manages first-line team</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Internal Support Agents</TableCell>
                  <TableCell>Salaries</TableCell>
                  <TableCell className="text-sm text-muted-foreground">Scale with customers</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <p className="text-sm text-muted-foreground mt-3">
              <strong>Total Internal Team Cost:</strong> → <span className="text-primary font-bold">30–35% of revenue in early years, falling to ~20% by 2031</span>
            </p>

            <h4 className="font-semibold text-foreground mt-6 mb-3">Outsourced Functions</h4>
            <p className="text-muted-foreground mb-3">Used to minimise fixed costs:</p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Function</TableHead>
                  <TableHead>Cost Basis</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Digital marketing execution</TableCell>
                  <TableCell>Retainer + performance budget</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">External engineering</TableCell>
                  <TableCell>Project-based (new features, scaling)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Corporate services</TableCell>
                  <TableCell>Legal, compliance, accounting</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <p className="text-sm text-muted-foreground mt-3">
              <strong>Assumption:</strong> <span className="text-primary font-bold">10–15% of revenue</span>
            </p>
          </div>
        </div>
      </Card>

      {/* Section 5: Sales & Marketing Spend */}
      <Card className="p-6 bg-gradient-to-br from-pink-50 to-white border-pink-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">📣</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground mb-3">Sales & Marketing Spend</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="text-pink-600">•</span> Low due to organic channels (LinkedIn, SEO, quiz funnel)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-pink-600">•</span> Paid acquisition is selective and ROI-focused
              </li>
              <li className="flex items-center gap-2">
                <span className="text-pink-600">•</span> Channels scale gradually after 2027 launch
              </li>
              <li className="flex items-center gap-2">
                <span className="text-pink-600">•</span> Assumption: <strong className="text-primary">15–20% of revenue</strong> depending on growth phase
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Section 6: Profitability Trajectory */}
      <Card className="p-6 bg-gradient-to-br from-indigo-50 to-white border-indigo-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">📈</span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-3">Profitability Trajectory</h3>
            <h4 className="font-semibold text-foreground mb-3">High-level model assumptions:</h4>
            <ul className="space-y-2 text-muted-foreground mb-4">
              <li className="flex items-center gap-2">
                <span className="text-indigo-600">•</span> Gross margin: <strong className="text-green-600">95–97%</strong> (AI + infrastructure)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-indigo-600">•</span> EBITDA breakeven expected once ARR &gt; <strong>£5M</strong>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-1">•</span>
                <span>Profits expand as: infrastructure % falls, global market grows, onboarding becomes self-serve, engineering becomes incremental (not foundational)</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Section 7: Summary */}
      <Card className="p-6 bg-gradient-to-br from-purple-100 to-purple-50 border-purple-300">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">✨</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground mb-4">Summary</h3>
            <p className="text-muted-foreground mb-4">
              Hobson's P/L assumptions demonstrate a <strong>high-margin, scalable, predictable AI SaaS model</strong> backed by:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">1.</span>
                <span className="text-muted-foreground"><strong>Ultra-low onboarding costs</strong> (&lt; £1 per unit)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">2.</span>
                <span className="text-muted-foreground"><strong>Lean team with outsourced flexibility</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">3.</span>
                <span className="text-muted-foreground"><strong>Frictionless, low-price adoption</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">4.</span>
                <span className="text-muted-foreground"><strong>Strong ROI justification</strong> (£6,000 saved per employee)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">5.</span>
                <span className="text-muted-foreground"><strong>Massive document-driven demand</strong> across global markets</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">6.</span>
                <span className="text-muted-foreground"><strong>Architecture designed for cost efficiency at scale</strong></span>
              </li>
            </ul>
            <div className="mt-6 p-4 bg-purple-200/50 rounded-lg">
              <p className="text-sm font-semibold text-purple-900">
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
