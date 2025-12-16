import React from 'react';
import { Brain, Target, Zap, CheckCircle2, Globe, Rocket, Shield, XCircle, AlertTriangle, ArrowDown, FileText, Search, Lock, TrendingUp, Repeat } from 'lucide-react';
export const ExecutiveSummaryVisual = () => {
  return <div className="space-y-6">
      {/* The Investment Thesis */}
      <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 via-background to-primary/5 p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold text-foreground">Investment Rationale</h3>
        </div>
        <div className="space-y-2 text-foreground leading-relaxed">
          <p>This is not a feature play.</p>
          <p>It is infrastructure.</p>
          <p className="font-semibold text-primary">And in this market, trust is the constraint that defines the winner.</p>
        </div>
      </div>

      {/* Band 1: What Clients Fear */}
      <div className="rounded-xl border border-border bg-muted/30 p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-lg font-bold text-foreground">What Clients Fear About AI</h3>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Fear 1: Replacement */}
          <div className="p-4 rounded-lg bg-background border border-border">
            <div className="flex items-center gap-2 mb-3">
              <XCircle className="w-5 h-5 text-amber-500" />
              <span className="font-bold text-foreground text-sm">"They'll make us replace everything"</span>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500/60" />
                Systems too embedded to rip out
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500/60" />
                Risk of disruption too high
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500/60" />
                Cost of failure unacceptable
              </li>
            </ul>
          </div>
          
          {/* Fear 2: Accuracy */}
          <div className="p-4 rounded-lg bg-background border border-border">
            <div className="flex items-center gap-2 mb-3">
              <XCircle className="w-5 h-5 text-amber-500" />
              <span className="font-bold text-foreground text-sm">"It won't be accurate enough"</span>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500/60" />
                No source transparency
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500/60" />
                No audit trail
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500/60" />
                Accuracy {">"} speed in regulated decisions
              </li>
            </ul>
          </div>
        </div>
        
        <p className="mt-4 text-sm font-semibold text-foreground text-center">
          These fears are <span className="underline text-primary">valid</span>. We built for them.
        </p>
      </div>

      {/* Band 2: The Hobson Approach */}
      <div className="relative overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-br from-primary/5 via-background to-primary/5 p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold text-foreground">The Hobson Approach</h3>
        </div>
        
        <div className="space-y-4 text-foreground leading-relaxed">
          <p className="font-medium">
            Hobson is built for how this market actually adopts technology.
          </p>
          <p>
            We embed into existing workflows, start at the document layer—the source of truth—and deliver auditable, traceable reasoning. Our architecture and pricing are designed to prove value first, earn trust, then expand. Replacement only happens when it is safe and inevitable.
          </p>
          <p className="font-semibold text-primary">Trust is not a feature. It is the gateway to £155B of savings.</p>
        </div>
      </div>

      {/* Hobson Defensible Moat */}
      <div className="rounded-xl border border-primary/20 bg-muted/30 p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold text-foreground">Hobson Defensible Moat</h3>
        </div>
        <div className="space-y-3 text-foreground leading-relaxed">
          <p className="font-semibold">Our moat is built under real-world constraints</p>
          <p className="text-sm text-muted-foreground">
            Hobson has been shaped by live client data, repeated architectural pivots, and firsthand exposure to operator scepticism, regulatory pressure, and real-world failure modes. This know-how—how to build, deploy, and earn trust in real estate—compounds faster than competitors can copy.
          </p>
          <p className="font-semibold text-primary">Hard to copy. Impossible to shortcut.</p>
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