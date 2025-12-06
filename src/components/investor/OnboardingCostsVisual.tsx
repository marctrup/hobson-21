import React from "react";
import { FileText, Layers, Building2, TrendingUp, CheckCircle } from "lucide-react";

const OnboardingCostsVisual = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          AI Onboarding Cost Per Client
        </h2>
        <p className="text-muted-foreground text-sm">
          OpenAI 5.1 Mini – Internal Cost Model
        </p>
      </div>

      {/* Section 1: Document Processing Cost Benchmarks */}
      <div className="bg-muted/30 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            1. Document Processing Cost Benchmarks
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-foreground">Document Type</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Avg. Processing Cost</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Avg. Tokens Used</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Processing Time</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 font-medium text-foreground">Complex (Lease)</td>
                <td className="py-3 px-4 text-primary font-semibold">$0.40</td>
                <td className="py-3 px-4 text-muted-foreground">~600k</td>
                <td className="py-3 px-4 text-muted-foreground">8–9 minutes</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 font-medium text-foreground">Medium (Deed)</td>
                <td className="py-3 px-4 text-primary font-semibold">$0.10</td>
                <td className="py-3 px-4 text-muted-foreground">~300k</td>
                <td className="py-3 px-4 text-muted-foreground">2–3 minutes</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-foreground">Simple (Notice)</td>
                <td className="py-3 px-4 text-primary font-semibold">$0.02–$0.03</td>
                <td className="py-3 px-4 text-muted-foreground">~50k</td>
                <td className="py-3 px-4 text-muted-foreground">30–60 seconds</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Cost Per Unit */}
      <div className="bg-muted/30 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            2. Cost Per Unit (Space / Asset)
          </h3>
        </div>
        <p className="text-muted-foreground mb-4">
          Each unit typically contains <span className="font-semibold text-foreground">5 onboarding documents</span>:
        </p>
        <div className="flex flex-wrap gap-3 mb-6">
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">1 Complex</span>
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">3 Medium</span>
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">2 Simple</span>
        </div>
        
        <h4 className="font-semibold text-foreground mb-3">Unit-Level AI Cost</h4>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-foreground">Component</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Qty</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Cost</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 text-foreground">Complex</td>
                <td className="py-3 px-4 text-muted-foreground">1</td>
                <td className="py-3 px-4 text-muted-foreground">$0.40</td>
                <td className="py-3 px-4 font-semibold text-foreground">$0.40</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 text-foreground">Medium</td>
                <td className="py-3 px-4 text-muted-foreground">3</td>
                <td className="py-3 px-4 text-muted-foreground">$0.10</td>
                <td className="py-3 px-4 font-semibold text-foreground">$0.30</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-foreground">Simple</td>
                <td className="py-3 px-4 text-muted-foreground">2</td>
                <td className="py-3 px-4 text-muted-foreground">$0.02–$0.03</td>
                <td className="py-3 px-4 font-semibold text-foreground">$0.04–$0.06</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">Total Onboarding Cost per Unit</p>
          <p className="text-2xl font-bold text-primary">$0.74 – $0.76 per unit</p>
        </div>
      </div>

      {/* Section 3: Client Onboarding Cost Scenarios */}
      <div className="bg-muted/30 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            3. Client Onboarding Cost Scenarios
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-foreground">Portfolio Size</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Total Units</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Est. Onboarding Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 text-foreground">Small</td>
                <td className="py-3 px-4 text-muted-foreground">100 units</td>
                <td className="py-3 px-4 font-semibold text-primary">~$74</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 text-foreground">Medium</td>
                <td className="py-3 px-4 text-muted-foreground">1,000 units</td>
                <td className="py-3 px-4 font-semibold text-primary">~$740</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-foreground">Large</td>
                <td className="py-3 px-4 text-muted-foreground">10,000 units</td>
                <td className="py-3 px-4 font-semibold text-primary">~$7,400</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 4: Strategic Implication */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            4. Strategic Implication
          </h3>
        </div>
        <h4 className="font-semibold text-primary mb-4">
          Hobson Onboarding = Ultra-Low Cost, High Margin
        </h4>
        <ul className="space-y-3 mb-6">
          {[
            "AI ingestion is the only meaningful onboarding cost.",
            "Cost remains well under $1 per unit, even for complex portfolios.",
            "Enables exceptionally high gross margins at scale.",
            "Supports frictionless self-serve onboarding from 2027 onwards.",
          ].map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-foreground">{item}</span>
            </li>
          ))}
        </ul>
        
        <div className="space-y-3 pt-4 border-t border-primary/20">
          <p className="text-foreground font-semibold flex items-center gap-2">
            <span className="text-primary">➡</span>
            Hobson can acquire and activate clients at extremely low operational cost.
          </p>
          <p className="text-foreground font-semibold flex items-center gap-2">
            <span className="text-primary">➡</span>
            Margins expand further as volume increases.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingCostsVisual;