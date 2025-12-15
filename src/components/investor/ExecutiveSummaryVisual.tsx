import React from 'react';
import { Brain, Target, Zap, CheckCircle2, Globe, Rocket, Shield, XCircle, AlertTriangle, ArrowDown, FileText, Search, Lock, TrendingUp, Repeat } from 'lucide-react';

export const ExecutiveSummaryVisual = () => {
  return (
    <div className="space-y-6">
      {/* Band 1: Market Reality - Why AI Fails */}
      <div className="rounded-xl border border-border bg-muted/30 p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-lg font-bold text-foreground">Why AI Fails in Real Estate</h3>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-4">
          {/* System Replacement Block */}
          <div className="p-4 rounded-lg bg-background border border-border">
            <div className="flex items-center gap-2 mb-3">
              <XCircle className="w-5 h-5 text-destructive" />
              <span className="font-bold text-foreground text-sm">System Replacement → "NOOOOO"</span>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive/60" />
                Systems too embedded
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive/60" />
                Risk too high
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive/60" />
                Cost of failure unacceptable
              </li>
            </ul>
          </div>
          
          {/* Speed Without Truth Block */}
          <div className="p-4 rounded-lg bg-background border border-border">
            <div className="flex items-center gap-2 mb-3">
              <XCircle className="w-5 h-5 text-destructive" />
              <span className="font-bold text-foreground text-sm">Speed Without Truth → Rejected</span>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive/60" />
                No source transparency
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive/60" />
                No audit trail
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive/60" />
                Accuracy {">"} speed in regulated decisions
              </li>
            </ul>
          </div>
        </div>
        
        <p className="mt-4 text-sm font-semibold text-foreground text-center">
          This market says <span className="underline text-destructive">no</span> by default.
        </p>
      </div>

      {/* Band 2: Hobson's Strategy - The Only Viable Path */}
      <div className="relative overflow-hidden rounded-xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Shield className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold text-primary">The Only Viable Path</h3>
          </div>
          
          {/* Vertical Flow */}
          <div className="flex flex-col items-center gap-2">
            <div className="px-6 py-3 rounded-lg bg-primary/15 border border-primary/30">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">Document Layer</span>
              </div>
              <p className="text-xs text-primary mt-1">Source of Truth</p>
            </div>
            
            <ArrowDown className="w-5 h-5 text-primary/60" />
            
            <div className="px-6 py-3 rounded-lg bg-primary/12 border border-primary/25">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">Auditable, Traceable Reasoning</span>
              </div>
            </div>
            
            <ArrowDown className="w-5 h-5 text-primary/60" />
            
            <div className="px-6 py-3 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">Trust Earned</span>
              </div>
            </div>
            
            <ArrowDown className="w-5 h-5 text-primary/60" />
            
            <div className="px-6 py-3 rounded-lg bg-primary/8 border border-primary/15">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">Adoption Expands</span>
              </div>
            </div>
            
            <ArrowDown className="w-5 h-5 text-primary/60" />
            
            <div className="px-6 py-3 rounded-lg bg-emerald-100/80 dark:bg-emerald-950/30 border border-emerald-300/50 dark:border-emerald-700/30">
              <div className="flex items-center gap-2">
                <Repeat className="w-5 h-5 text-emerald-600" />
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">Replacement Becomes Inevitable</span>
              </div>
            </div>
          </div>
          
          {/* Caption */}
          <p className="mt-6 text-sm font-medium text-muted-foreground">
            <span className="text-primary font-semibold">Embed first.</span> Prove accuracy. Earn trust. <span className="text-primary font-semibold">Expand safely.</span>
          </p>
          
          {/* Moat Statement */}
          <div className="mt-6 pt-5 border-t border-primary/20">
            <p className="text-sm text-foreground">
              <span className="font-bold text-primary">Our moat is earned, not claimed.</span> Through repeated architectural pivots and live operator use, Hobson has learned how to earn trust inside real estate workflows. That execution knowledge compounds faster than competitors can copy.
            </p>
          </div>
        </div>
      </div>

      {/* Addressable Market */}
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-600" />
            <h4 className="font-semibold text-foreground">Addressable Market</h4>
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium ml-7">Annual Efficiency Value Unlocked</p>
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

    </div>
  );
};
