import React from 'react';
import { Target, Compass, Eye, Users, TrendingUp, Lightbulb, CheckCircle2, Building2, Briefcase, Home, Brain, ArrowRight } from 'lucide-react';

export const StrategicContextPositioningVisual = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 p-6 border border-primary/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary flex-shrink-0">
            <Compass className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-2">Strategic Context & Positioning</h3>
            <p className="text-muted-foreground leading-relaxed">
              Hobson's targeting and segmentation strategy guides the organisation from early MVP validation in the UK to scalable commercial expansion and global market entry.
            </p>
          </div>
        </div>
      </div>

      {/* Strategy Foundation */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <Target className="w-3 h-3 text-primary" />
          </div>
          Strategy Foundation
        </h3>
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm text-foreground mb-3">The strategy is grounded in:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex items-center gap-2 p-2 rounded bg-background/50">
              <Eye className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-sm text-muted-foreground">Real discovery work</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded bg-background/50">
              <Users className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-sm text-muted-foreground">Observed behavioural patterns</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded bg-background/50">
              <TrendingUp className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-sm text-muted-foreground">Industry adoption dynamics</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded bg-background/50">
              <Lightbulb className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-sm text-muted-foreground">Calm, intelligent guide positioning</span>
            </div>
          </div>
        </div>
      </div>

      {/* High-Level Positioning */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <Compass className="w-3 h-3 text-primary" />
          </div>
          High-Level Positioning
        </h3>
        <div className="rounded-lg bg-primary/10 border border-primary/30 p-4">
          <p className="text-sm text-foreground leading-relaxed">
            Hobson is positioned as <span className="text-primary font-semibold">the clarity engine for Real Estate</span> - simple, intelligent, and trustworthy.
          </p>
        </div>
      </div>

      {/* Marketing Mix */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-foreground">Marketing Mix Reinforcement</h3>
        <p className="text-sm text-muted-foreground">The marketing mix reinforces this positioning at every layer:</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="rounded-lg bg-muted/30 border-l-4 border-primary p-3">
            <p className="text-xs font-bold text-primary mb-0.5">Brand Identity</p>
            <p className="text-xs text-muted-foreground leading-relaxed">Calm presence</p>
          </div>
          <div className="rounded-lg bg-muted/30 border-l-4 border-primary p-3">
            <p className="text-xs font-bold text-primary mb-0.5">Product Design</p>
            <p className="text-xs text-muted-foreground leading-relaxed">Lightweight</p>
          </div>
          <div className="rounded-lg bg-muted/30 border-l-4 border-primary p-3">
            <p className="text-xs font-bold text-primary mb-0.5">Pricing</p>
            <p className="text-xs text-muted-foreground leading-relaxed">Accessible</p>
          </div>
          <div className="rounded-lg bg-muted/30 border-l-4 border-primary p-3">
            <p className="text-xs font-bold text-primary mb-0.5">Promotion</p>
            <p className="text-xs text-muted-foreground leading-relaxed">Educational</p>
          </div>
        </div>
      </div>

      {/* Commercial Pathway */}
      <div className="rounded-lg bg-accent/50 border border-accent p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <CheckCircle2 className="w-3 h-3 text-primary" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-foreground mb-1">Commercial Pathway</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Together, these elements create a coherent commercial pathway from early UK validation to international expansion by 2028-2030.
            </p>
          </div>
        </div>
      </div>

      {/* Segmentation Strategy Section */}
      <div className="space-y-3 pt-4 border-t border-border">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <Users className="w-3 h-3 text-primary" />
          </div>
          Segmentation Strategy (UK, 2024–2027)
        </h3>
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm text-foreground mb-3">Segmentation is based on four core drivers:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="flex items-center gap-2 p-2 rounded bg-background/50">
              <span className="text-sm text-muted-foreground">Document volume</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded bg-background/50">
              <span className="text-sm text-muted-foreground">Workflow complexity</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded bg-background/50">
              <span className="text-sm text-muted-foreground">Decision-making structure</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded bg-background/50">
              <span className="text-sm text-muted-foreground">Psychographic orientation (VALS)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Three Customer Segments */}
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">Hobson serves three actionable customer groups, validated through MVP discovery:</p>
        <div className="grid grid-cols-1 gap-4">
          {/* Segment 1 */}
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-5 h-5 text-primary" />
              <h4 className="font-semibold text-sm text-primary">Segment 1: Large Portfolio Operators</h4>
            </div>
            <div className="space-y-2">
              <div className="rounded bg-background/50 p-2">
                <p className="text-xs font-medium text-foreground mb-1">Characteristics</p>
                <p className="text-xs text-muted-foreground">High administrative load, multiple systems, compliance risk, slow information retrieval.</p>
              </div>
              <div className="rounded bg-background/50 p-2">
                <p className="text-xs font-medium text-foreground mb-1">VALS Profile</p>
                <p className="text-xs text-muted-foreground">Achievers, Thinkers who value reliability, accuracy, and professional competence.</p>
              </div>
              <div className="rounded bg-primary/10 p-2">
                <p className="text-xs font-medium text-primary mb-1">Why Segment Matters</p>
                <p className="text-xs text-muted-foreground">High-value accounts with strong long-term retention potential.</p>
              </div>
            </div>
          </div>

          {/* Segment 2 */}
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="w-5 h-5 text-primary" />
              <h4 className="font-semibold text-sm text-primary">Segment 2: Medium Real Estate Companies</h4>
            </div>
            <div className="space-y-2">
              <div className="rounded bg-background/50 p-2">
                <p className="text-xs font-medium text-foreground mb-1">Characteristics</p>
                <p className="text-xs text-muted-foreground">Fast-paced, agile, scaling portfolios; information scattered across drives and emails.</p>
              </div>
              <div className="rounded bg-background/50 p-2">
                <p className="text-xs font-medium text-foreground mb-1">VALS Profile</p>
                <p className="text-xs text-muted-foreground">Strivers, Innovators who value simplicity, speed, and practical tools.</p>
              </div>
              <div className="rounded bg-primary/10 p-2">
                <p className="text-xs font-medium text-primary mb-1">Why Segment Matters</p>
                <p className="text-xs text-muted-foreground">Quick adopters of lightweight AI tools with minimal friction.</p>
              </div>
            </div>
          </div>

          {/* Segment 3 */}
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Home className="w-5 h-5 text-primary" />
              <h4 className="font-semibold text-sm text-primary">Segment 3: Small Firms & Owner-Managers</h4>
            </div>
            <div className="space-y-2">
              <div className="rounded bg-background/50 p-2">
                <p className="text-xs font-medium text-foreground mb-1">Characteristics</p>
                <p className="text-xs text-muted-foreground">Limited time, minimal tech stack, fragmented document handling.</p>
              </div>
              <div className="rounded bg-background/50 p-2">
                <p className="text-xs font-medium text-foreground mb-1">VALS Profile</p>
                <p className="text-xs text-muted-foreground">Makers, Survivors that value timesaving, stress reduction, clarity.</p>
              </div>
              <div className="rounded bg-primary/10 p-2">
                <p className="text-xs font-medium text-primary mb-1">Why Segment Matters</p>
                <p className="text-xs text-muted-foreground">Large volume of potential customers and the lowest barriers to use.</p>
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground italic">
          This segmentation reflects our MVP findings: the core pain, "information is too hard to find," is universal, but the intensity and business value differ by segment.
        </p>
      </div>

      {/* Core Insight */}
      <div className="rounded-lg bg-primary/10 border border-primary/30 p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Lightbulb className="w-3 h-3 text-primary" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-primary mb-1">Core Insight</h4>
            <p className="text-sm text-foreground leading-relaxed">
              Across all segments, the underlying pain is identical – <span className="font-semibold">"Information is too hard to find"</span>
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              What varies is the intensity of pain and the commercial value of resolving it, which determines prioritisation and revenue weighting.
            </p>
          </div>
        </div>
      </div>

      {/* Mindset-Based Targeting */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <Brain className="w-3 h-3 text-primary" />
          </div>
          Mindset-Based Targeting
        </h3>
        <p className="text-sm text-muted-foreground">Strategic targeting aligns with our consumer attitude model, where customers progress through:</p>
        
        {/* Funnel stages */}
        <div className="flex flex-wrap items-center justify-center gap-2 py-3">
          <div className="px-3 py-1.5 rounded-full bg-primary/20 text-primary text-xs font-medium">Awareness</div>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          <div className="px-3 py-1.5 rounded-full bg-primary/30 text-primary text-xs font-medium">Consideration</div>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          <div className="px-3 py-1.5 rounded-full bg-primary/40 text-primary text-xs font-medium">Liking</div>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          <div className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium">Conversion</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-lg bg-muted/50 border-l-4 border-primary p-3">
            <p className="text-xs font-bold text-primary mb-1">Awareness</p>
            <p className="text-xs text-muted-foreground">Learning that Hobson exists</p>
            <p className="text-xs text-foreground mt-1 font-medium">→ LinkedIn + thought leadership</p>
          </div>
          <div className="rounded-lg bg-muted/50 border-l-4 border-primary p-3">
            <p className="text-xs font-bold text-primary mb-1">Consideration</p>
            <p className="text-xs text-muted-foreground">Understanding what Hobson does</p>
            <p className="text-xs text-foreground mt-1 font-medium">→ Website clarity, demos, video explainers</p>
          </div>
          <div className="rounded-lg bg-muted/50 border-l-4 border-primary p-3">
            <p className="text-xs font-bold text-primary mb-1">Liking</p>
            <p className="text-xs text-muted-foreground">Emotional trust & brand connection</p>
            <p className="text-xs text-foreground mt-1 font-medium">→ Hobson quiz, brand storytelling, case studies</p>
          </div>
          <div className="rounded-lg bg-muted/50 border-l-4 border-primary p-3">
            <p className="text-xs font-bold text-primary mb-1">Conversion</p>
            <p className="text-xs text-muted-foreground">Requesting a demo or pilot</p>
            <p className="text-xs text-foreground mt-1 font-medium">→ Retargeting, email, onboarding flows</p>
          </div>
        </div>
      </div>

      {/* Trust-First Approach */}
      <div className="rounded-lg bg-accent/50 border border-accent p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <CheckCircle2 className="w-3 h-3 text-primary" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-foreground mb-1">Trust-First Approach</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This mindset-first approach ensures that Hobson builds trust before asking for adoption, which is essential in risk-sensitive sectors such as real estate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};