import React from 'react';
import { Search, TrendingUp, Users, Building2, FileText, AlertCircle } from 'lucide-react';

export const SituationAnalysisVisual = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500/10 via-teal-500/5 to-teal-500/10 p-6 border border-teal-200/50 dark:border-teal-800/30">
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Situation Analysis</h3>
            <p className="text-muted-foreground mt-1">Current market landscape and competitive positioning</p>
          </div>
        </div>
      </div>

      {/* Market Overview */}
      <div className="space-y-4">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-teal-600" />
          Market Overview
        </h4>
        <div className="p-5 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/30 border border-slate-200 dark:border-slate-700/50">
          <p className="text-foreground leading-relaxed">
            The UK real estate sector comprises over <span className="font-bold text-teal-600 dark:text-teal-400">235,000 businesses</span>, 
            managing millions of properties with complex document requirements. The market is ripe for AI-driven 
            transformation as traditional methods struggle to keep pace with regulatory demands.
          </p>
        </div>
      </div>

      {/* Key Segments */}
      <div className="space-y-4">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <Users className="w-5 h-5 text-teal-600" />
          Key Market Segments
        </h4>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50/80 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border border-blue-200 dark:border-blue-800/30">
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="font-semibold text-foreground">Property Managers</h5>
                <p className="text-sm text-muted-foreground mt-1">Managing portfolios of 10+ units with high document volume</p>
              </div>
            </div>
          </div>
          <div className="p-5 rounded-xl bg-gradient-to-br from-purple-50/80 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 border border-purple-200 dark:border-purple-800/30">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="font-semibold text-foreground">Letting Agents</h5>
                <p className="text-sm text-muted-foreground mt-1">Processing tenancy agreements and compliance documents daily</p>
              </div>
            </div>
          </div>
          <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-50/80 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30">
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="font-semibold text-foreground">Landlords</h5>
                <p className="text-sm text-muted-foreground mt-1">Portfolio owners seeking efficiency and compliance assurance</p>
              </div>
            </div>
          </div>
          <div className="p-5 rounded-xl bg-gradient-to-br from-amber-50/80 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20 border border-amber-200 dark:border-amber-800/30">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="font-semibold text-foreground">Asset Managers</h5>
                <p className="text-sm text-muted-foreground mt-1">Institutional portfolios requiring audit-ready documentation</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Challenges */}
      <div className="space-y-4">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-teal-600" />
          Current Market Challenges
        </h4>
        <div className="grid gap-3">
          {[
            "Document retrieval averages 15-30 minutes per query",
            "Compliance failures cost the sector millions annually",
            "Staff turnover creates knowledge gaps and operational risk",
            "Legacy systems cannot scale with portfolio growth",
          ].map((challenge, idx) => (
            <div key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-red-50/50 to-red-100/30 dark:from-red-950/20 dark:to-red-900/10 border border-red-200/50 dark:border-red-800/30">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 text-xs font-bold">
                {idx + 1}
              </div>
              <span className="text-foreground">{challenge}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Opportunity */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 p-6 border border-primary/20">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <p className="text-foreground font-medium leading-relaxed">
            This situation creates a <span className="text-primary font-bold">significant market opportunity</span> for 
            an AI-native solution that can deliver instant document intelligence, reduce operational costs, and 
            ensure compliance across the entire property lifecycle.
          </p>
        </div>
      </div>
    </div>
  );
};
