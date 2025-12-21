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
              Founded by the team behind <span className="font-semibold text-foreground">Arthur Online</span>, built and scaled to institutional adoption and acquired by Advent International and Aareon in 2021. Hobson is an AI platform born from firsthand experience of Real Estate operations at scale.
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
        
        <div className="relative p-4 rounded-lg bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-l-4 border-primary">
          <p className="text-sm text-foreground leading-relaxed">
            <span className="font-semibold">Real estate operations are structurally inefficient.</span> Over <span className="font-semibold text-primary">20% of professional time</span> is lost to document handling, verification, and search. Hobson converts this wasted cost into <span className="font-semibold text-primary">permanent operating leverage</span>. These figures represent recurring, defensible value that AI-native operators will capture—and legacy workflows will forfeit.
          </p>
        </div>
      </div>

      {/* Traction & Execution Momentum */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Rocket className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold text-foreground">Traction & Execution Momentum</h4>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
            <Target className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-foreground text-sm">MVP Launch — Q1 2026</div>
              <div className="text-xs text-muted-foreground">On track, with scope defined by live partner workflows</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
            <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-foreground text-sm">Validated with 4 Operating Partners</div>
              <div className="text-xs text-muted-foreground">Use cases proven inside real real estate organisations</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
            <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-foreground text-sm">98% Model Accuracy</div>
              <div className="text-xs text-muted-foreground">Measured on proprietary, industry-specific datasets</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
            <Zap className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-foreground text-sm">Multi-Document Reasoning</div>
              <div className="text-xs text-muted-foreground">Legal, compliance, and operational documents, analysed together</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 sm:col-span-2">
            <Brain className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-foreground text-sm">Domain-Trained AI</div>
              <div className="text-xs text-muted-foreground">Purpose-built for real estate complexity, reliability, and auditability</div>
            </div>
          </div>
        </div>
      </div>

    </div>;
};