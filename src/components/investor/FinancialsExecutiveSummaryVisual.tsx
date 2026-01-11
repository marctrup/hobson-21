import React from "react";
import { TrendingUp, Target, BarChart3, DollarSign, Zap } from "lucide-react";

export const FinancialsExecutiveSummaryVisual: React.FC = () => {
  const metrics = [
    { label: "Revenue growth from £0.708M in 2027 to £100M by 2031", icon: TrendingUp },
    { label: "~90% five-year CAGR", icon: BarChart3 },
    { label: "90%+ gross margins with net margins expanding toward 40–55% at scale", icon: Target },
    { label: "EBITDA breakeven above £5M ARR, reached early in the forecast period", icon: DollarSign },
    { label: "Infrastructure-grade unit economics with rapid CAC payback", icon: Zap },
  ];

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <div className="bg-card rounded-lg p-6 border border-border space-y-4">
        <p className="text-foreground leading-relaxed">
          Hobson's financial profile reflects the creation of a new infrastructure layer for Real Estate operations.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          This is not a conventional SaaS growth story. It is the monetisation of unavoidable structural change in one of the world's largest, most document-intensive industries, driven by regulatory escalation, labour scarcity, margin compression, and compounding operational complexity.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          The business converts existing, locked-in operating costs into high-margin, recurring revenue, producing a growth model that is both aggressive in trajectory and unusually low in commercial risk.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          With a £5M seed round, Hobson funds the full 2026 build year and enters 2027 fully staffed, production-ready, and positioned for rapid commercial expansion. From close to launch, the company becomes cash flow positive quickly, with operating leverage increasing each year as adoption compounds and automation deepens.
        </p>
      </div>

      {/* Five-Year Financial Model */}
      <div className="bg-primary/5 rounded-lg p-6 border border-primary/20">
        <h3 className="text-lg font-semibold text-foreground mb-4">Five-Year Financial Model Delivers</h3>
        <div className="space-y-3">
          {metrics.map((metric, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <metric.icon className="w-4 h-4 text-primary" />
              </div>
              <p className="text-muted-foreground">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Structural Performance */}
      <div className="bg-muted/50 rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-3">Structural Performance</h3>
        <p className="text-muted-foreground leading-relaxed">
          This performance is driven by structural market forces, not discretionary software demand. Hobson's usage-based model scales automatically with customer complexity, regulatory burden, and portfolio growth, creating built-in net revenue expansion and durable long-term defensibility.
        </p>
      </div>
    </div>
  );
};

export default FinancialsExecutiveSummaryVisual;
