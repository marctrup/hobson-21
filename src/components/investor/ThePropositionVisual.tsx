import React from 'react';
import { Target, Lightbulb, CheckCircle2, Zap, Users, Shield, TrendingUp, ArrowRight, FileText, Clock, DollarSign } from 'lucide-react';

export const ThePropositionVisual = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 p-6 border border-primary/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary flex-shrink-0">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-2">The Proposition</h3>
            <p className="text-muted-foreground leading-relaxed">
              Hobson's value proposition is built on a simple, powerful promise: instant clarity from your property documents without changing how you work.
            </p>
          </div>
        </div>
      </div>

      {/* Core Value Proposition */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <Target className="w-3 h-3 text-primary" />
          </div>
          Core Value Proposition
        </h3>
        <div className="rounded-lg bg-accent/50 border border-accent p-5">
          <p className="text-lg font-semibold text-primary text-center mb-4">
            "Ask questions. Get answers. With full source references."
          </p>
          <p className="text-sm text-muted-foreground text-center leading-relaxed">
            Hobson transforms scattered property documents into an intelligent, searchable knowledge base that delivers accurate answers in seconds, not hours.
          </p>
        </div>
      </div>

      {/* What Hobson Delivers */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-foreground">What Hobson Delivers</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <h4 className="font-semibold text-sm text-primary">Time Savings</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-2">
              Reduce document search time from hours to seconds
            </p>
            <p className="text-lg font-bold text-primary">90%+ faster</p>
          </div>
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <h4 className="font-semibold text-sm text-primary">Accuracy</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-2">
              Every answer includes source references for verification
            </p>
            <p className="text-lg font-bold text-primary">100% traceable</p>
          </div>
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary" />
              </div>
              <h4 className="font-semibold text-sm text-primary">Simplicity</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-2">
              No training required, works with existing workflows
            </p>
            <p className="text-lg font-bold text-primary">Zero friction</p>
          </div>
        </div>
      </div>

      {/* The Problem We Solve */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-foreground">The Problem We Solve</h3>
        <div className="rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-rose-700 dark:text-rose-400 mb-2">Current Reality</p>
              <ul className="space-y-2">
                {[
                  "Documents scattered across drives, emails, and systems",
                  "Hours spent searching for specific clauses or dates",
                  "Risk of missing critical compliance deadlines",
                  "Knowledge locked in the heads of key staff",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-rose-600 dark:text-rose-300">
                    <span className="text-rose-500">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-2">With Hobson</p>
              <ul className="space-y-2">
                {[
                  "All documents unified in one intelligent system",
                  "Instant answers with exact source references",
                  "Proactive alerts for upcoming obligations",
                  "Institutional memory accessible to everyone",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-green-600 dark:text-green-300">
                    <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Who Benefits */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <Users className="w-3 h-3 text-primary" />
          </div>
          Who Benefits
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { role: "Property Managers", benefit: "Faster tenant queries" },
            { role: "Asset Managers", benefit: "Instant lease insights" },
            { role: "Compliance Teams", benefit: "Deadline visibility" },
            { role: "Operations Staff", benefit: "Self-service answers" },
          ].map((item, idx) => (
            <div key={idx} className="rounded-lg bg-muted/50 border border-border p-3 text-center">
              <p className="text-xs font-bold text-primary mb-1">{item.role}</p>
              <p className="text-[10px] text-muted-foreground">{item.benefit}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Commercial Model */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <DollarSign className="w-3 h-3 text-primary" />
          </div>
          Commercial Model
        </h3>
        <div className="rounded-lg bg-muted/50 border border-border p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xs font-semibold text-foreground mb-1">Pricing Structure</p>
              <p className="text-sm font-bold text-primary">Usage-Based</p>
              <p className="text-[10px] text-muted-foreground mt-1">Pay for what you use, scale as you grow</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-foreground mb-1">Entry Point</p>
              <p className="text-sm font-bold text-primary">Free Tier</p>
              <p className="text-[10px] text-muted-foreground mt-1">Try before you commit, no risk adoption</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-foreground mb-1">Value Alignment</p>
              <p className="text-sm font-bold text-primary">Scales with ROI</p>
              <p className="text-[10px] text-muted-foreground mt-1">Cost grows only as value delivered increases</p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Now */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <TrendingUp className="w-3 h-3 text-primary" />
          </div>
          Why Now
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { driver: "Regulatory Pressure", detail: "Increasing compliance requirements demand better document management" },
            { driver: "AI Maturity", detail: "Large language models now accurate enough for professional use" },
            { driver: "Labour Costs", detail: "Rising wages make manual document review economically unviable" },
            { driver: "Market Readiness", detail: "PropTech adoption accelerating across all segments" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 rounded-lg bg-muted/30 border border-border p-3">
              <ArrowRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-foreground">{item.driver}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* The Promise */}
      <div className="rounded-lg bg-primary/10 border border-primary/30 p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <CheckCircle2 className="w-3 h-3 text-primary" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-foreground mb-1">The Promise</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Hobson delivers clarity without complexity. We help Real Estate professionals find the information they need, when they need it, with the confidence that every answer is grounded in their actual documents.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
