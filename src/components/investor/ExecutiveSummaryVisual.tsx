import React from 'react';
import { Brain, Target, Zap, CheckCircle2, Globe, Rocket, Shield } from 'lucide-react';

export const ExecutiveSummaryVisual = () => {
  return (
    <div className="space-y-6">
      {/* Hero Statement */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-6 sm:p-8 border border-primary/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Hobson AI</h3>
              <p className="text-sm text-muted-foreground">Specialised AI for Real Estate</p>
            </div>
          </div>
          <div className="space-y-4 text-foreground leading-relaxed">
            <p>
              Hobson is the <span className="font-semibold text-primary">trusted intelligence layer</span> real estate operations must adopt to remain competitive. As portfolios grow and regulation tightens, manual document work has become a <span className="font-semibold text-primary">structural bottleneck</span>—driving cost, hidden risk, and slow decision-making.
            </p>
            <p>
              Most AI platforms fail in this market for two reasons. First, they demand system replacement—and real estate operators respond with "nooooo." The risk is too high, systems are too embedded, and the cost of failure is unacceptable. Second, they prioritise speed over truth. AI that cannot prove where its answers come from is not trusted. In this market, <span className="font-semibold text-primary">speed without accuracy is a liability</span>.
            </p>
            <p>
              Hobson is built around these realities. Our architecture embeds into existing workflows, starts at the document layer—the source of truth—and delivers auditable, traceable reasoning. Our pricing and deployment reflect how customers actually adopt technology: prove value first, earn trust, then expand. Replacement only happens when it is safe and inevitable.
            </p>
            <p>
              <span className="font-semibold text-primary">Trust is the gate to the £155B opportunity.</span> Hobson starts at the document layer to earn it—then expands into higher-order intelligence as customers allow deeper adoption, unlocking increasing layers of value.
            </p>
          </div>
        </div>
      </div>

      {/* Proprietary Advantage */}
      <div className="relative overflow-hidden rounded-xl border-2 border-primary/30 bg-gradient-to-r from-primary/5 via-background to-primary/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="relative p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-bold text-foreground">Proprietary Advantage</h4>
              <p className="text-xs text-primary font-semibold">The Real Moat</p>
            </div>
          </div>
          <p className="text-base sm:text-lg font-medium text-foreground leading-relaxed">
            <span className="text-primary font-bold">Hobson's moat is execution-led.</span> In real estate AI, intelligence is easy to build—<span className="text-primary font-bold">permission to deploy is not</span>. Our proprietary advantage is knowing how to earn trust, fit into real workflows, and compound domain learning faster than competitors can copy.
          </p>
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
