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
    <div className="space-y-8">
      {/* Section 1: Cost Structure Overview */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-white border-purple-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">💡</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground mb-3">Cost Structure Overview</h3>
            <p className="text-muted-foreground mb-4">
              Hobson operates with an ultra-lean cost base due to its architecture:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> No office costs
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> No integration or field-support costs
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Minimal onboarding costs (AI-token based)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Core team = 5 roles
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Engineering and marketing execution outsourced
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Section 2: Core Team Cost */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">👥</span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-3">Core Team Cost (Fixed Cost Layer)</h3>
            <p className="text-muted-foreground mb-4">Internal headcount (UK-based realistic salaries):</p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Annual Cost (Est.)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>CEO</TableCell>
                  <TableCell className="text-right">£120,000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Head of Marketing</TableCell>
                  <TableCell className="text-right">£70,000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Product Owner</TableCell>
                  <TableCell className="text-right">£85,000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Head of Customer Support</TableCell>
                  <TableCell className="text-right">£55,000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Head of Sales</TableCell>
                  <TableCell className="text-right">£85,000</TableCell>
                </TableRow>
                <TableRow className="font-bold bg-muted/50">
                  <TableCell>Total Fixed Payroll</TableCell>
                  <TableCell className="text-right">£415,000 / year</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <p className="text-sm text-muted-foreground mt-4 italic">
              Only these roles are internal. Engineering, design, and marketing execution are outsourced — converting heavy fixed cost into scalable variable cost.
            </p>
          </div>
        </div>
      </Card>

      {/* Section 3: Outsourced Costs */}
      <Card className="p-6 bg-gradient-to-br from-amber-50 to-white border-amber-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">📊</span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-3">Outsourced Costs (% of Revenue Layer)</h3>
            <p className="text-muted-foreground mb-4">Used to scale efficiently, predictable for investors.</p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cost Area</TableHead>
                  <TableHead className="text-center">% of Revenue</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Engineering (outsourced)</TableCell>
                  <TableCell className="text-center font-bold text-primary">12%</TableCell>
                  <TableCell className="text-sm text-muted-foreground">Model tuning, RAG improvements, K-Graph pipelines, UI updates</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Digital Marketing (outsourced)</TableCell>
                  <TableCell className="text-center font-bold text-primary">8%</TableCell>
                  <TableCell className="text-sm text-muted-foreground">Paid campaigns, SEO, content ops</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Customer Success</TableCell>
                  <TableCell className="text-center font-bold text-primary">5%</TableCell>
                  <TableCell className="text-sm text-muted-foreground">Training, support tickets, role-based guidance flows</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Sales / SDR Support</TableCell>
                  <TableCell className="text-center font-bold text-primary">4%</TableCell>
                  <TableCell className="text-sm text-muted-foreground">Commission + outsourced pipeline research</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">General & Admin</TableCell>
                  <TableCell className="text-center font-bold text-primary">3%</TableCell>
                  <TableCell className="text-sm text-muted-foreground">Legal, accounting, compliance, insurance</TableCell>
                </TableRow>
                <TableRow className="font-bold bg-muted/50">
                  <TableCell>Total Variable Cost Load</TableCell>
                  <TableCell className="text-center text-primary">32%</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>

      {/* Section 4: AI & Infrastructure Costs */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-white border-green-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">🤖</span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-3">AI & Infrastructure Costs (Direct COGS Layer)</h3>
            <p className="text-muted-foreground mb-4">
              Based on actual architectural workflow (LLM ingestion → MongoDB → Vector DB → K-Graph → query engine → RAG fallback).
            </p>
            
            <h4 className="font-semibold text-foreground mt-6 mb-3">AI Onboarding Cost Per Client (One-Off)</h4>
            <p className="text-sm text-muted-foreground mb-3">From validated benchmarks:</p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Type</TableHead>
                  <TableHead className="text-center">Units</TableHead>
                  <TableHead className="text-right">Total AI Onboarding Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Small</TableCell>
                  <TableCell className="text-center">5 units</TableCell>
                  <TableCell className="text-right font-bold text-green-600">$3.70–$3.80</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Medium</TableCell>
                  <TableCell className="text-center">100 units</TableCell>
                  <TableCell className="text-right font-bold text-green-600">$74–$76</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Large</TableCell>
                  <TableCell className="text-center">1,000 units</TableCell>
                  <TableCell className="text-right font-bold text-green-600">$740–$760</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <p className="text-sm text-muted-foreground mt-3">
              → Converted to pounds: <strong>£0.59–£0.61 per unit</strong>
            </p>
            <div className="mt-4 p-3 bg-green-100/50 rounded-lg">
              <p className="text-sm font-medium text-green-800">
                Core insight: Onboarding cost rounds to ~£1 per small client, ~£60 per medium, ~£600 per large. This gives Hobson extremely high gross margins.
              </p>
            </div>

            <h4 className="font-semibold text-foreground mt-6 mb-3">Infrastructure Costs (% of revenue)</h4>
            <p className="text-sm text-muted-foreground mb-3">Covers: MongoDB Atlas storage, Vector DB, LLM query resolution, K-Graph compute, Quality-check subsystem, RAG fallback queries</p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Infrastructure Type</TableHead>
                  <TableHead className="text-right">% of Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Document Storage + Vector DB</TableCell>
                  <TableCell className="text-right font-bold text-primary">4%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>LLM Query API (OpenAI Mini)</TableCell>
                  <TableCell className="text-right font-bold text-primary">5%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Knowledge Graph Compute + Retrieval</TableCell>
                  <TableCell className="text-right font-bold text-primary">2%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Monitoring + Logging (Datadog etc.)</TableCell>
                  <TableCell className="text-right font-bold text-primary">1%</TableCell>
                </TableRow>
                <TableRow className="font-bold bg-muted/50">
                  <TableCell>Total Infra Cost</TableCell>
                  <TableCell className="text-right text-primary">12%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>

      {/* Section 5: Full Cost Structure Summary */}
      <Card className="p-6 bg-gradient-to-br from-indigo-50 to-white border-indigo-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">📋</span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-3">Full Cost Structure Summary</h3>
            <p className="text-muted-foreground mb-4">Combining fixed team costs, variable outsourced costs, and direct infrastructure COGS:</p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cost Type</TableHead>
                  <TableHead className="text-right">Annual Cost Model</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Fixed Headcount</TableCell>
                  <TableCell className="text-right">£415,000 / year</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Variable Ops (outsourced)</TableCell>
                  <TableCell className="text-right">32% of revenue</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">AI + Infra COGS</TableCell>
                  <TableCell className="text-right">12% of revenue</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Onboarding AI Cost</TableCell>
                  <TableCell className="text-right">£1–£600 per client (tiny)</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <div className="mt-6 p-4 bg-indigo-100/50 rounded-lg">
              <h4 className="font-semibold text-foreground mb-2">Overall Gross Margin Expectation</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Because onboarding is negligible, and infra is 12%:
              </p>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div className="text-center p-3 bg-white rounded-lg">
                  <p className="text-2xl font-bold text-primary">88%</p>
                  <p className="text-xs text-muted-foreground">Expected Gross Margin</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <p className="text-2xl font-bold text-primary">40–55%</p>
                  <p className="text-xs text-muted-foreground">Net Margin at Scale</p>
                </div>
              </div>
              <p className="text-sm text-green-700 font-medium mt-3">
                This is excellent for a SaaS model and very investor friendly.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Section 6: Why This Cost Model Is Defensible */}
      <Card className="p-6 bg-gradient-to-br from-purple-100 to-purple-50 border-purple-300">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">🛡️</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground mb-4">Why This Cost Model Works</h3>
            <p className="text-muted-foreground mb-4">Our architecture makes variable cost extremely low:</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✔</span>
                <span className="text-muted-foreground"><strong>Vector DB + K-Graph reduces LLM calls</strong> (biggest savings driver)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✔</span>
                <span className="text-muted-foreground"><strong>AI ingestion is done once per document</strong> → cost is £0.60 per unit</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✔</span>
                <span className="text-muted-foreground"><strong>Query engine only hits LLM for precision</strong> → low token spend per user</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✔</span>
                <span className="text-muted-foreground"><strong>No integration teams, no onboarding teams</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✔</span>
                <span className="text-muted-foreground"><strong>Scalability is horizontal</strong> — costs grow slower than revenue</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CostAssumptionsVisual;
