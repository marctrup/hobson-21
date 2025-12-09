import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CostAssumptionsVisual = () => {
  return (
    <div className="space-y-6 lg:space-y-8 w-full max-w-full overflow-hidden">
      {/* Section 1: Cost Structure Overview */}
      <Card className="p-4 lg:p-6 bg-gradient-to-br from-purple-50 to-white border-purple-200">
        <div className="flex flex-col sm:flex-row items-start gap-3 lg:gap-4">
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xl lg:text-2xl">💡</span>
          </div>
          <div className="w-full">
            <h3 className="text-lg lg:text-xl font-bold text-foreground mb-2 lg:mb-3">Cost Structure Overview</h3>
            <p className="text-sm lg:text-base text-muted-foreground mb-3 lg:mb-4">
              Hobson operates with an ultra-lean cost base due to its architecture:
            </p>
            <ul className="space-y-2 text-sm lg:text-base text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="text-green-600 flex-shrink-0">✓</span> No office costs
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600 flex-shrink-0">✓</span> No integration or field-support costs
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600 flex-shrink-0">✓</span> Minimal onboarding costs (AI-token based)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600 flex-shrink-0">✓</span> Core team = 5 roles
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600 flex-shrink-0">✓</span> Engineering and marketing execution outsourced
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Section 2: Core Team Cost */}
      <Card className="p-4 lg:p-6 bg-gradient-to-br from-blue-50 to-white border-blue-200">
        <div className="flex flex-col sm:flex-row items-start gap-3 lg:gap-4">
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xl lg:text-2xl">👥</span>
          </div>
          <div className="flex-1 w-full min-w-0">
            <h3 className="text-lg lg:text-xl font-bold text-foreground mb-2 lg:mb-3">Core Team Cost (Fixed Cost Layer)</h3>
            <p className="text-sm lg:text-base text-muted-foreground mb-3 lg:mb-4">Internal headcount (UK-based realistic salaries):</p>
            <div className="overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0">
              <Table className="min-w-[300px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs lg:text-sm">Role</TableHead>
                    <TableHead className="text-right text-xs lg:text-sm">Annual Cost (Est.)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="text-xs lg:text-sm">CEO</TableCell>
                    <TableCell className="text-right text-xs lg:text-sm">£120,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-xs lg:text-sm">Head of Marketing</TableCell>
                    <TableCell className="text-right text-xs lg:text-sm">£70,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-xs lg:text-sm">Product Owner</TableCell>
                    <TableCell className="text-right text-xs lg:text-sm">£85,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-xs lg:text-sm">Head of Customer Support</TableCell>
                    <TableCell className="text-right text-xs lg:text-sm">£55,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-xs lg:text-sm">Head of Sales</TableCell>
                    <TableCell className="text-right text-xs lg:text-sm">£85,000</TableCell>
                  </TableRow>
                  <TableRow className="font-bold bg-muted/50">
                    <TableCell className="text-xs lg:text-sm">Total Fixed Payroll</TableCell>
                    <TableCell className="text-right text-xs lg:text-sm">£415,000 / year</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <p className="text-xs lg:text-sm text-muted-foreground mt-3 lg:mt-4 italic">
              Only these roles are internal. Engineering, design, and marketing execution are outsourced — converting heavy fixed cost into scalable variable cost.
            </p>
          </div>
        </div>
      </Card>

      {/* Section 3: Outsourced Costs */}
      <Card className="p-4 lg:p-6 bg-gradient-to-br from-amber-50 to-white border-amber-200">
        <div className="flex flex-col sm:flex-row items-start gap-3 lg:gap-4">
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xl lg:text-2xl">📊</span>
          </div>
          <div className="flex-1 w-full min-w-0">
            <h3 className="text-lg lg:text-xl font-bold text-foreground mb-2 lg:mb-3">Outsourced Costs (% of Revenue Layer)</h3>
            <p className="text-sm lg:text-base text-muted-foreground mb-3 lg:mb-4">Used to scale efficiently, predictable for investors.</p>
            <div className="overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0">
              <Table className="min-w-[400px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs lg:text-sm">Cost Area</TableHead>
                    <TableHead className="text-center text-xs lg:text-sm">% of Revenue</TableHead>
                    <TableHead className="text-xs lg:text-sm hidden sm:table-cell">Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium text-xs lg:text-sm">Engineering (outsourced)</TableCell>
                    <TableCell className="text-center font-bold text-primary text-xs lg:text-sm">12%</TableCell>
                    <TableCell className="text-xs text-muted-foreground hidden sm:table-cell">Model tuning, RAG improvements, K-Graph pipelines, UI updates</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-xs lg:text-sm">Digital Marketing (outsourced)</TableCell>
                    <TableCell className="text-center font-bold text-primary text-xs lg:text-sm">8%</TableCell>
                    <TableCell className="text-xs text-muted-foreground hidden sm:table-cell">Paid campaigns, SEO, content ops</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-xs lg:text-sm">Customer Success</TableCell>
                    <TableCell className="text-center font-bold text-primary text-xs lg:text-sm">5%</TableCell>
                    <TableCell className="text-xs text-muted-foreground hidden sm:table-cell">Training, support tickets, role-based guidance flows</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-xs lg:text-sm">Sales / SDR Support</TableCell>
                    <TableCell className="text-center font-bold text-primary text-xs lg:text-sm">4%</TableCell>
                    <TableCell className="text-xs text-muted-foreground hidden sm:table-cell">Commission + outsourced pipeline research</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-xs lg:text-sm">General & Admin</TableCell>
                    <TableCell className="text-center font-bold text-primary text-xs lg:text-sm">3%</TableCell>
                    <TableCell className="text-xs text-muted-foreground hidden sm:table-cell">Legal, accounting, compliance, insurance</TableCell>
                  </TableRow>
                  <TableRow className="font-bold bg-muted/50">
                    <TableCell className="text-xs lg:text-sm">Total Variable Cost Load</TableCell>
                    <TableCell className="text-center text-primary text-xs lg:text-sm">32%</TableCell>
                    <TableCell className="hidden sm:table-cell"></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </Card>

      {/* Section 4: AI & Infrastructure Costs */}
      <Card className="p-4 lg:p-6 bg-gradient-to-br from-green-50 to-white border-green-200">
        <div className="flex flex-col sm:flex-row items-start gap-3 lg:gap-4">
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xl lg:text-2xl">🤖</span>
          </div>
          <div className="flex-1 w-full min-w-0">
            <h3 className="text-lg lg:text-xl font-bold text-foreground mb-2 lg:mb-3">AI & Infrastructure Costs (Direct COGS Layer)</h3>
            <p className="text-sm lg:text-base text-muted-foreground mb-3 lg:mb-4">
              Based on actual architectural workflow (LLM ingestion → MongoDB → Vector DB → K-Graph → query engine → RAG fallback).
            </p>
            
            <h4 className="font-semibold text-foreground mt-4 lg:mt-6 mb-2 lg:mb-3 text-sm lg:text-base">AI Onboarding Cost Per Client (One-Off)</h4>
            <p className="text-xs lg:text-sm text-muted-foreground mb-2 lg:mb-3">From validated benchmarks:</p>
            <div className="overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0">
              <Table className="min-w-[300px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs lg:text-sm">Client Type</TableHead>
                    <TableHead className="text-center text-xs lg:text-sm">Units</TableHead>
                    <TableHead className="text-right text-xs lg:text-sm">Total AI Onboarding Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="text-xs lg:text-sm">Small</TableCell>
                    <TableCell className="text-center text-xs lg:text-sm">5 units</TableCell>
                    <TableCell className="text-right font-bold text-green-600 text-xs lg:text-sm">$3.70–$3.80</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-xs lg:text-sm">Medium</TableCell>
                    <TableCell className="text-center text-xs lg:text-sm">100 units</TableCell>
                    <TableCell className="text-right font-bold text-green-600 text-xs lg:text-sm">$74–$76</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-xs lg:text-sm">Large</TableCell>
                    <TableCell className="text-center text-xs lg:text-sm">1,000 units</TableCell>
                    <TableCell className="text-right font-bold text-green-600 text-xs lg:text-sm">$740–$760</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <p className="text-xs lg:text-sm text-muted-foreground mt-2 lg:mt-3">
              → Converted to pounds: <strong>£0.59–£0.61 per unit</strong>
            </p>
            <div className="mt-3 lg:mt-4 p-2 lg:p-3 bg-green-100/50 rounded-lg">
              <p className="text-xs lg:text-sm font-medium text-green-800">
                Core insight: Onboarding cost rounds to ~£1 per small client, ~£60 per medium, ~£600 per large. This gives Hobson extremely high gross margins.
              </p>
            </div>

            <h4 className="font-semibold text-foreground mt-4 lg:mt-6 mb-2 lg:mb-3 text-sm lg:text-base">Infrastructure Costs (% of revenue)</h4>
            <p className="text-xs lg:text-sm text-muted-foreground mb-2 lg:mb-3">Covers: MongoDB Atlas storage, Vector DB, LLM query resolution, K-Graph compute, Quality-check subsystem, RAG fallback queries</p>
            <div className="overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0">
              <Table className="min-w-[300px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs lg:text-sm">Infrastructure Type</TableHead>
                    <TableHead className="text-right text-xs lg:text-sm">% of Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="text-xs lg:text-sm">Document Storage + Vector DB</TableCell>
                    <TableCell className="text-right font-bold text-primary text-xs lg:text-sm">4%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-xs lg:text-sm">LLM Query API (OpenAI Mini)</TableCell>
                    <TableCell className="text-right font-bold text-primary text-xs lg:text-sm">5%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-xs lg:text-sm">Knowledge Graph Compute + Retrieval</TableCell>
                    <TableCell className="text-right font-bold text-primary text-xs lg:text-sm">2%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-xs lg:text-sm">Monitoring + Logging (Datadog etc.)</TableCell>
                    <TableCell className="text-right font-bold text-primary text-xs lg:text-sm">1%</TableCell>
                  </TableRow>
                  <TableRow className="font-bold bg-muted/50">
                    <TableCell className="text-xs lg:text-sm">Total Infra Cost</TableCell>
                    <TableCell className="text-right text-primary text-xs lg:text-sm">12%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </Card>

      {/* Section 5: Full Cost Structure Summary */}
      <Card className="p-4 lg:p-6 bg-gradient-to-br from-indigo-50 to-white border-indigo-200">
        <div className="flex flex-col sm:flex-row items-start gap-3 lg:gap-4">
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xl lg:text-2xl">📋</span>
          </div>
          <div className="flex-1 w-full min-w-0">
            <h3 className="text-lg lg:text-xl font-bold text-foreground mb-2 lg:mb-3">Full Cost Structure Summary</h3>
            <p className="text-sm lg:text-base text-muted-foreground mb-3 lg:mb-4">Combining fixed team costs, variable outsourced costs, and direct infrastructure COGS:</p>
            <div className="overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0">
              <Table className="min-w-[300px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs lg:text-sm">Cost Type</TableHead>
                    <TableHead className="text-right text-xs lg:text-sm">Annual Cost Model</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium text-xs lg:text-sm">Fixed Headcount</TableCell>
                    <TableCell className="text-right text-xs lg:text-sm">£415,000 / year</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-xs lg:text-sm">Variable Ops (outsourced)</TableCell>
                    <TableCell className="text-right text-xs lg:text-sm">32% of revenue</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-xs lg:text-sm">AI + Infra COGS</TableCell>
                    <TableCell className="text-right text-xs lg:text-sm">12% of revenue</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-xs lg:text-sm">Onboarding AI Cost</TableCell>
                    <TableCell className="text-right text-xs lg:text-sm">£1–£600 per client (tiny)</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 lg:mt-6 p-3 lg:p-4 bg-indigo-100/50 rounded-lg">
              <h4 className="font-semibold text-foreground mb-2 text-sm lg:text-base">Overall Gross Margin Expectation</h4>
              <p className="text-xs lg:text-sm text-muted-foreground mb-2">
                Because onboarding is negligible, and infra is 12%:
              </p>
              <div className="grid grid-cols-2 gap-2 lg:gap-4 mt-2 lg:mt-3">
                <div className="text-center p-2 lg:p-3 bg-white rounded-lg">
                  <p className="text-xl lg:text-2xl font-bold text-primary">88%</p>
                  <p className="text-[10px] lg:text-xs text-muted-foreground">Expected Gross Margin</p>
                </div>
                <div className="text-center p-2 lg:p-3 bg-white rounded-lg">
                  <p className="text-xl lg:text-2xl font-bold text-primary">40–55%</p>
                  <p className="text-[10px] lg:text-xs text-muted-foreground">Net Margin at Scale</p>
                </div>
              </div>
              <p className="text-xs lg:text-sm text-green-700 font-medium mt-2 lg:mt-3">
                This is excellent for a SaaS model and very investor friendly.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Section 6: Why This Cost Model Is Defensible */}
      <Card className="p-4 lg:p-6 bg-gradient-to-br from-purple-100 to-purple-50 border-purple-300">
        <div className="flex flex-col sm:flex-row items-start gap-3 lg:gap-4">
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-purple-200 flex items-center justify-center flex-shrink-0">
            <span className="text-xl lg:text-2xl">🛡️</span>
          </div>
          <div className="w-full">
            <h3 className="text-lg lg:text-xl font-bold text-foreground mb-3 lg:mb-4">Why This Cost Model Works</h3>
            <p className="text-sm lg:text-base text-muted-foreground mb-3 lg:mb-4">Our architecture makes variable cost extremely low:</p>
            <ul className="space-y-2 lg:space-y-3">
              <li className="flex items-start gap-2 lg:gap-3">
                <span className="text-green-600 font-bold flex-shrink-0">✔</span>
                <span className="text-xs lg:text-sm text-muted-foreground"><strong>Vector DB + K-Graph reduces LLM calls</strong> (biggest savings driver)</span>
              </li>
              <li className="flex items-start gap-2 lg:gap-3">
                <span className="text-green-600 font-bold flex-shrink-0">✔</span>
                <span className="text-xs lg:text-sm text-muted-foreground"><strong>AI ingestion is done once per document</strong> → cost is £0.60 per unit</span>
              </li>
              <li className="flex items-start gap-2 lg:gap-3">
                <span className="text-green-600 font-bold flex-shrink-0">✔</span>
                <span className="text-xs lg:text-sm text-muted-foreground"><strong>Query engine only hits LLM for precision</strong> → low token spend per user</span>
              </li>
              <li className="flex items-start gap-2 lg:gap-3">
                <span className="text-green-600 font-bold flex-shrink-0">✔</span>
                <span className="text-xs lg:text-sm text-muted-foreground"><strong>No integration teams, no onboarding teams</strong></span>
              </li>
              <li className="flex items-start gap-2 lg:gap-3">
                <span className="text-green-600 font-bold flex-shrink-0">✔</span>
                <span className="text-xs lg:text-sm text-muted-foreground"><strong>Scalability is horizontal</strong> — costs grow slower than revenue</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CostAssumptionsVisual;
