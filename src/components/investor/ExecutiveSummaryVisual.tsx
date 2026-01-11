import React from 'react';
import { Brain, Target, Zap, CheckCircle2, Globe, Rocket, Shield, XCircle, AlertTriangle, ArrowDown, FileText, Search, Lock, TrendingUp, Repeat } from 'lucide-react';
export const ExecutiveSummaryVisual = () => {
  return <div className="space-y-8">
      {/* Opening Statement */}
      <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 via-background to-primary/5 p-6 sm:p-8 mb-6">
        <p className="text-lg leading-loose text-foreground">
          Hobson is building the <span className="text-primary font-semibold">intelligence infrastructure</span> that Real Estate operations now require to function safely, efficiently, and at scale.
        </p>
      </div>

      {/* Investment Rationale */}
      <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 via-background to-primary/5 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-bold text-foreground">Investment Rationale</h3>
        </div>
        
        <div className="space-y-6 text-foreground">
          <p className="text-sm leading-relaxed">
            Hobson delivers <span className="font-semibold">AI-driven reasoning directly from source documents</span>, with full traceability and auditability, inside existing workflows. Every obligation, exposure, valuation input, and compliance requirement is buried inside leases, titles, reports, and contracts. By replacing manual document handling, the hidden backbone of all operations, planning applications, funding due diligence, investment committee papers, and asset management, Hobson removes a growing source of structural cost, decision delay, and operational risk across Real Estate.
          </p>
          
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Founded by the team behind <span className="text-primary">Arthur Online</span>, built and scaled to institutional adoption and acquired by Advent International and Aareon in 2021. Hobson is an AI platform born from firsthand experience of Real Estate operations at scale.
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-primary/10 border-l-4 border-primary">
            <p className="font-semibold text-primary text-sm">This is not a productivity enhancement. It is the removal of a core operational bottleneck.</p>
          </div>
          
          <p className="font-semibold text-base">Hobson enables:</p>
          
          <div className="space-y-3 pl-4">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm leading-relaxed">
                <span className="font-semibold">Permanent reduction</span> in document-driven staffing costs
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Zap className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm leading-relaxed">
                <span className="font-semibold">Faster, defensible decisions</span> across operations, acquisitions and asset management
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm leading-relaxed">
                <span className="font-semibold">Material reduction</span> in errors and compliance exposure through traceable, source-linked outputs
              </p>
            </div>
          </div>
          
          <p className="text-sm leading-relaxed pt-2">
            Once document intelligence is trusted, it becomes <span className="font-semibold">infrastructure</span>. What begins as reasoning becomes decision control, then automation, then a system-level advantage across the Real Estate stack.
          </p>
          
          <p className="font-semibold text-base pt-2">
            Hobson is the entry point for AI becoming a <span className="text-primary">system of record</span> for the Real Estate industry.
          </p>
        </div>
      </div>

      {/* Market Opportunity */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          <h4 className="font-semibold text-foreground">Market Opportunity</h4>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-4 rounded-xl bg-gradient-to-b from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/30">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-700 dark:text-emerald-400">£1.41B</div>
            <div className="text-xs text-muted-foreground mt-1">UK</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-gradient-to-b from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/30">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-700 dark:text-emerald-400">£15.5B</div>
            <div className="text-xs text-muted-foreground mt-1">Europe</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-gradient-to-b from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/30">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-700 dark:text-emerald-400">£155.6B</div>
            <div className="text-xs text-muted-foreground mt-1">Global</div>
          </div>
        </div>
        
        <div className="relative p-4 rounded-lg bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-l-4 border-primary space-y-3">
          <p className="text-sm text-foreground leading-relaxed font-semibold">
            Real Estate operations are structurally constrained by manual document work.
          </p>
          <p className="text-sm text-foreground leading-relaxed">
            Over <span className="font-semibold text-primary">20% of professional time</span> is spent locating, validating, and cross-checking information across fragmented documents and systems.
          </p>
          <p className="text-sm text-foreground leading-relaxed">
            This is recurring operational spend already being paid for in payroll, consultants, delays, and error remediation. Hobson converts this existing cost into <span className="font-semibold text-primary">permanent operating leverage</span> that compounds as portfolios scale.
          </p>
        </div>
      </div>

      {/* Traction & Execution Momentum */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Rocket className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold text-foreground">Traction & Execution Momentum</h4>
        </div>
        
        <p className="text-sm text-foreground leading-relaxed">
          Hobson demonstrates <span className="font-semibold">production-grade capability</span> against Real Estate operational workflows.
        </p>
        
        <div className="space-y-2 pl-4">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-foreground">Validated across <span className="font-semibold">Real Estate operating use cases</span></p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-foreground"><span className="font-semibold">98% model accuracy</span> measured on proprietary, industry-specific datasets</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-foreground"><span className="font-semibold">Multi-document reasoning</span> across legal, compliance, and operational sources</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-foreground"><span className="font-semibold">Domain-trained AI</span> purpose-built for auditability and regulatory scrutiny</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-foreground"><span className="font-semibold">MVP launch Q1 2026</span>, with scope defined by partner workflows rather than theoretical use cases</p>
          </div>
        </div>
      </div>

    </div>;
};