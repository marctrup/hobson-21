import React from 'react';
import { Brain, Target, Zap, CheckCircle2, Globe, Rocket, Shield, XCircle, AlertTriangle, ArrowDown, FileText, Search, Lock, TrendingUp, Repeat } from 'lucide-react';
export const ExecutiveSummaryVisual = () => {
  return <div className="space-y-8">
      {/* Investment Rationale */}
      <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 via-background to-primary/5 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-bold text-foreground">Investment Rationale</h3>
        </div>
        
        <div className="space-y-6 text-foreground">
          <p className="text-lg leading-loose">Hobson is building the cornerstone of accurate document intelligence for the real estate industry.<span className="text-primary font-semibold">cornerstone of accurate document intelligence</span> for commercial real estate.
          </p>
          
          <p className="text-sm leading-relaxed">
            We deliver <span className="font-semibold">AI-driven reasoning directly from source documents</span>, with full traceability and auditability, inside the workflows operators already use. This unlocks:
          </p>
          
          <div className="flex flex-wrap gap-3 pl-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Zap className="w-3.5 h-3.5" />
              Faster decisions
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              Lower staffing costs
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Shield className="w-3.5 h-3.5" />
              Fewer errors
            </span>
          </div>
          
          <div className="p-4 rounded-lg bg-primary/10 border-l-4 border-primary">
            <p className="font-semibold text-primary text-sm">This capability compounds.</p>
          </div>
          
          <p className="text-sm leading-relaxed">
            Once document intelligence is trusted, it becomes the <span className="font-semibold">foundation for automation, optimisation, and entirely new AI-led products</span> across the real estate stack. Hobson is the entry point to that expansion.
          </p>
          
          <p className="font-semibold text-base pt-2">
            What starts as document reasoning becomes <span className="text-primary">decision infrastructure</span>.
          </p>
          
          <div className="mt-4 p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground italic leading-relaxed">
              This is a rare chance to back a platform that begins with <span className="font-semibold text-foreground">accuracy and trust</span>—and grows into a <span className="font-semibold text-foreground">system of record for AI in real assets</span>.
            </p>
          </div>
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