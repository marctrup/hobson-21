import React from 'react';
import { Target, TrendingUp, Users, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

export const ExecutiveContextVisual = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500/10 via-teal-500/5 to-teal-500/10 p-6 border border-teal-200/50 dark:border-teal-800/30">
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Executive Context</h3>
            <p className="text-muted-foreground mt-1">Strategic positioning for market entry and growth</p>
          </div>
        </div>
      </div>

      {/* Market Context */}
      <div className="space-y-4">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-teal-600" />
          Market Context
        </h4>
        <div className="grid gap-4">
          <div className="p-5 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/30 border border-slate-200 dark:border-slate-700/50">
            <p className="text-foreground leading-relaxed">
              The UK real estate sector faces unprecedented pressure from regulatory complexity, 
              operational inefficiencies, and document overload. Property professionals spend up to 
              <span className="font-bold text-teal-600 dark:text-teal-400"> 40% of their time </span> 
              searching for and processing document-based information.
            </p>
          </div>
        </div>
      </div>

      {/* Strategic Opportunity */}
      <div className="space-y-4">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <Zap className="w-5 h-5 text-teal-600" />
          Strategic Opportunity
        </h4>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-gradient-to-br from-teal-50/80 to-teal-100/50 dark:from-teal-950/30 dark:to-teal-900/20 border border-teal-200 dark:border-teal-800/30">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="font-semibold text-foreground">First-Mover Advantage</h5>
                <p className="text-sm text-muted-foreground mt-1">No established AI-native document intelligence solution exists for UK property</p>
              </div>
            </div>
          </div>
          <div className="p-5 rounded-xl bg-gradient-to-br from-teal-50/80 to-teal-100/50 dark:from-teal-950/30 dark:to-teal-900/20 border border-teal-200 dark:border-teal-800/30">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="font-semibold text-foreground">Regulatory Tailwinds</h5>
                <p className="text-sm text-muted-foreground mt-1">Increasing compliance requirements drive demand for automated solutions</p>
              </div>
            </div>
          </div>
          <div className="p-5 rounded-xl bg-gradient-to-br from-teal-50/80 to-teal-100/50 dark:from-teal-950/30 dark:to-teal-900/20 border border-teal-200 dark:border-teal-800/30">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="font-semibold text-foreground">Technology Readiness</h5>
                <p className="text-sm text-muted-foreground mt-1">AI capabilities have matured to deliver reliable document understanding</p>
              </div>
            </div>
          </div>
          <div className="p-5 rounded-xl bg-gradient-to-br from-teal-50/80 to-teal-100/50 dark:from-teal-950/30 dark:to-teal-900/20 border border-teal-200 dark:border-teal-800/30">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="font-semibold text-foreground">Market Appetite</h5>
                <p className="text-sm text-muted-foreground mt-1">65% of UK businesses are primed to invest in AI solutions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Target Audience */}
      <div className="space-y-4">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <Users className="w-5 h-5 text-teal-600" />
          Target Audience
        </h4>
        <div className="flex flex-col sm:flex-row gap-3">
          {[
            { segment: "Property Managers", desc: "Managing 10+ units" },
            { segment: "Letting Agents", desc: "High document volume" },
            { segment: "Landlords", desc: "Portfolio owners" },
            { segment: "Asset Managers", desc: "Institutional portfolios" },
          ].map((item, idx) => (
            <React.Fragment key={idx}>
              <div className="flex-1 p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/30 border border-slate-200 dark:border-slate-700/50 text-center">
                <span className="font-semibold text-foreground block">{item.segment}</span>
                <span className="text-sm text-muted-foreground">{item.desc}</span>
              </div>
              {idx < 3 && (
                <div className="hidden sm:flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-muted-foreground/50" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Conclusion */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 p-6 border border-primary/20">
        <div className="flex items-start gap-3">
          <Zap className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="text-foreground font-medium">
              Hobson is positioned to capture a <span className="text-primary font-bold">category-defining opportunity</span> in 
              AI-powered property document intelligence.
            </p>
            <p className="text-muted-foreground text-sm">
              The convergence of market need, technology readiness, and regulatory pressure creates 
              the perfect conditions for rapid adoption and growth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
