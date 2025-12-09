import React from 'react';
import { Brain, TrendingUp, Target, Zap, CheckCircle2, Globe, Rocket, Coins } from 'lucide-react';

export const ExecutiveSummaryVisual = () => {
  return (
    <div className="space-y-8">
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
          <p className="text-foreground leading-relaxed">
            Turning complex documents and decisions into <span className="font-semibold text-primary">clear, reliable insight</span>. 
            Zero onboarding. Trusted accuracy from day one. Continuous learning that shifts from basic automation to 
            <span className="font-semibold text-primary"> proactive support</span>—unlocking major efficiency gains across the entire property lifecycle.
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
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium ml-7">Annual Efficiency Savings</p>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-4 rounded-xl bg-gradient-to-b from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/30">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-700 dark:text-emerald-400">£1.41B</div>
            <div className="text-xs text-muted-foreground mt-1">UK Savings</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-gradient-to-b from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/30">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-700 dark:text-emerald-400">£15.5B</div>
            <div className="text-xs text-muted-foreground mt-1">European Savings</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-gradient-to-b from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/30">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-700 dark:text-emerald-400">£155.6B</div>
            <div className="text-xs text-muted-foreground mt-1">Global Savings</div>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Real estate professionals lose 20% of admin time to document chaos. These figures represent the annual savings Hobson can unlock—and the opportunity we're built to capture.
        </p>
      </div>

      {/* Traction & Milestones */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Rocket className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold text-foreground">Traction & Milestones</h4>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
            <Target className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-foreground text-sm">MVP Launch Q1 2026</div>
              <div className="text-xs text-muted-foreground">Validated with 4 real-world partners</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
            <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-foreground text-sm">98% Model Accuracy</div>
              <div className="text-xs text-muted-foreground">Tested on real industry data</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
            <Zap className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-foreground text-sm">Multi-Document Support</div>
              <div className="text-xs text-muted-foreground">Legal, compliance, operational reports</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
            <Brain className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-foreground text-sm">Domain-Trained AI</div>
              <div className="text-xs text-muted-foreground">Built for reliability and depth</div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Model */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-amber-600" />
          <h4 className="font-semibold text-foreground">Revenue Model</h4>
        </div>
        
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50/80 to-orange-50/80 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200/50 dark:border-amber-800/30">
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <div className="space-y-1">
              <div className="font-semibold text-foreground">Usage-Based Pricing</div>
              <div className="text-sm text-muted-foreground">Pay via Hobson Energy Units (HEUs)</div>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 text-sm font-bold rounded-lg bg-teal-400 text-gray-900 shadow-md">
                No per-user fees
              </span>
              <span className="px-4 py-2 text-sm font-bold rounded-lg bg-teal-400 text-gray-900 shadow-md">
                No per-asset fees
              </span>
              <span className="px-4 py-2 text-sm font-bold rounded-lg bg-teal-400 text-gray-900 shadow-md">
                Zero onboarding
              </span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-amber-200/50 dark:border-amber-700/30">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              <span className="text-sm text-foreground font-medium">Clear, measurable ROI based on time and cost savings</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
