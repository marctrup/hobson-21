import React from 'react';
import { Target, TrendingUp, CheckCircle2, Layers, Globe, Calendar, Users, MessageSquare, ArrowRight, Shield, Zap, Building2, LineChart, FileText, Search, BarChart3, UserCheck } from 'lucide-react';

export const SegmentationStrategyVisual = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 p-6 border border-primary/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary flex-shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-2">Organisational Positioning</h3>
            <p className="text-muted-foreground leading-relaxed">
              Hobson's long-term positioning centres on supporting Real Estate professionals with an intelligence layer that enhances the systems they already use. The goal is to be recognised for delivering reliable document insight without requiring significant operational change.
            </p>
          </div>
        </div>
      </div>

      {/* Strategic Positioning Vision */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <Target className="w-3 h-3 text-primary" />
          </div>
          Strategic Positioning Vision
        </h3>
        <div className="rounded-lg bg-muted/50 border border-border p-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Hobson will be positioned as a practical, document-focused AI assistant that helps teams work faster and make decisions with clearer information. The emphasis is on complementing, not replacing, existing workflows. As the product matures, positioning will expand from retrieval to broader insight and guidance, giving Hobson a defined role across daily operations.
          </p>
        </div>
      </div>

      {/* Positioning Principles */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-foreground">Positioning Principles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Search className="w-4 h-4 text-primary" />
              <h4 className="font-semibold text-sm text-primary">Direct Clarity</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Answers that reduce effort and uncertainty
            </p>
          </div>
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-primary" />
              <h4 className="font-semibold text-sm text-primary">Reliability</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Outputs that users can treat as dependable inputs to their work
            </p>
          </div>
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-primary" />
              <h4 className="font-semibold text-sm text-primary">Low Friction</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              A tool that is simple to adopt and easy to maintain
            </p>
          </div>
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-primary" />
              <h4 className="font-semibold text-sm text-primary">Supportive Role</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              An assistant that fits around current systems and processes
            </p>
          </div>
        </div>
      </div>

      {/* How Users Should Understand Hobson */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-foreground">How Users Should Understand Hobson</h3>
        <div className="rounded-lg bg-muted/50 border-l-4 border-primary p-4">
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">Across user groups, Hobson should be understood as a tool that:</p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-xs text-muted-foreground">Helps them locate information quickly</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-xs text-muted-foreground">Reduces the effort required in manual document review</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-xs text-muted-foreground">Provides outputs that support confident decision-making</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Positioning Across Customer Journey */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-foreground">Positioning Across the Customer Journey</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-3 text-center">
            <p className="text-xs font-bold text-blue-700 dark:text-blue-400 mb-1">Awareness</p>
            <p className="text-[10px] text-blue-600 dark:text-blue-300">A practical AI option built for property operations</p>
          </div>
          <div className="rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 p-3 text-center">
            <p className="text-xs font-bold text-purple-700 dark:text-purple-400 mb-1">Consideration</p>
            <p className="text-[10px] text-purple-600 dark:text-purple-300">A simple way to access document insight quickly</p>
          </div>
          <div className="rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-3 text-center">
            <p className="text-xs font-bold text-green-700 dark:text-green-400 mb-1">Conversion</p>
            <p className="text-[10px] text-green-600 dark:text-green-300">A low-effort tool suitable for pilot use</p>
          </div>
          <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 text-center">
            <p className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-1">Retention</p>
            <p className="text-[10px] text-amber-600 dark:text-amber-300">A dependable part of recurring workflows</p>
          </div>
        </div>
      </div>

      {/* Strategic Advantages */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-foreground">Strategic Advantages of the Positioning</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-lg bg-muted/50 border-l-4 border-primary p-4">
            <p className="text-xs font-bold text-primary mb-1">1. Clear Category Definition</p>
            <p className="text-xs text-muted-foreground leading-relaxed">Focus on document intelligence avoids overlap with leasing automation or full-stack platforms</p>
          </div>
          <div className="rounded-lg bg-muted/50 border-l-4 border-primary p-4">
            <p className="text-xs font-bold text-primary mb-1">2. Low-Resistance Adoption</p>
            <p className="text-xs text-muted-foreground leading-relaxed">Enhancing existing tools reduces the organisational barriers often seen with new systems</p>
          </div>
          <div className="rounded-lg bg-muted/50 border-l-4 border-primary p-4">
            <p className="text-xs font-bold text-primary mb-1">3. Scalable Narrative</p>
            <p className="text-xs text-muted-foreground leading-relaxed">As the product evolves from retrieval to insight, the positioning can expand naturally without contradiction</p>
          </div>
        </div>
      </div>

      {/* Global Positioning Direction */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <Globe className="w-3 h-3 text-primary" />
          </div>
          Global Positioning Direction (2028–2030)
        </h3>
        <div className="rounded-lg bg-accent/50 border border-accent p-4">
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            As Hobson enters additional markets, the positioning will scale to a universal, simple description:
          </p>
          <p className="text-sm font-semibold text-primary italic">
            "Hobson is a reliable AI assistant for Real Estate infrastructure management."
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed mt-2">
            This creates a consistent global identity that can adapt to local regulations and workflows.
          </p>
        </div>
      </div>

      {/* SMART Positioning Objectives */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-foreground">SMART Positioning Objectives (2025–2030)</h3>
        <div className="space-y-2">
          {[
            { year: "2025", title: "Positioning Framework", desc: "Publish a complete, scalable positioning framework by Q4 2025, ready to support the Q1 2026 MVP and pilot expansion." },
            { year: "2026", title: "Brand Recognition", desc: "Improve brand recall by 20% by Q4 2026, driven by consistent messaging, educational content, and pilot storytelling." },
            { year: "2027", title: "Industry Credibility", desc: "Appear in two respected industry reports by Q4 2027 as a leading AI solution for document intelligence in real estate." },
            { year: "2028", title: "Category Definition", desc: "Establish 'document intelligence assistant' as a recognised category term in UK real estate by Q4 2028." },
            { year: "2029", title: "Global Consistency", desc: "Achieve consistent brand positioning across the UK, EU, and US markets by Q4 2029." },
          ].map((objective, idx) => (
            <div key={idx} className="flex items-start gap-3 rounded-lg bg-muted/30 p-3">
              <div className="flex-shrink-0 w-12 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-[10px] font-bold text-primary">{objective.year}</span>
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-foreground">{objective.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{objective.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Positioning Vision Summary */}
      <div className="rounded-lg bg-primary/10 border border-primary/30 p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <CheckCircle2 className="w-3 h-3 text-primary" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-foreground mb-1">Positioning Vision Summary</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Hobson is the accessible intelligence layer for Real Estate teams. It creates room for product evolution, supports commercial adoption, and offers a stable message for the UK and future international markets.
            </p>
          </div>
        </div>
      </div>

      {/* UK Targeting Strategy */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <Calendar className="w-3 h-3 text-primary" />
          </div>
          UK Targeting Strategy (2025–2027)
        </h3>
        
        {/* Phase 1 */}
        <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-blue-200 border border-blue-400 flex items-center justify-center">
              <span className="text-[10px] font-bold text-blue-800">1</span>
            </div>
            <h4 className="font-semibold text-sm text-blue-700 dark:text-blue-400">Validation & MVP Readiness (Q1 2026)</h4>
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-300 mb-2">Target: Existing partners and up to 5 new non-paying pilot organisations</p>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li className="flex items-start gap-2">
              <ArrowRight className="w-3 h-3 text-blue-500 flex-shrink-0 mt-0.5" />
              <span>Finalise the MVP for Q1 2026</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="w-3 h-3 text-blue-500 flex-shrink-0 mt-0.5" />
              <span>Build trust through early testing</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="w-3 h-3 text-blue-500 flex-shrink-0 mt-0.5" />
              <span>Validate accuracy, referencing, and core workflows</span>
            </li>
          </ul>
          <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-2 italic">Brand Role: Hobson acts as the Sage, a calm, intelligent guide helping teams see through document complexity.</p>
        </div>

        {/* Phase 2 */}
        <div className="rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-purple-200 border border-purple-400 flex items-center justify-center">
              <span className="text-[10px] font-bold text-purple-800">2</span>
            </div>
            <h4 className="font-semibold text-sm text-purple-700 dark:text-purple-400">Pilot Expansion & Evidence Building (Q2-Q3 2026)</h4>
          </div>
          <p className="text-xs text-purple-600 dark:text-purple-300 mb-2">Target: Medium-sized Real Estate firms, small professional portfolios, selective large operators</p>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li className="flex items-start gap-2">
              <ArrowRight className="w-3 h-3 text-purple-500 flex-shrink-0 mt-0.5" />
              <span>Reach 10 active pilot organisations</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="w-3 h-3 text-purple-500 flex-shrink-0 mt-0.5" />
              <span>Produce segment-specific proof points and case studies</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="w-3 h-3 text-purple-500 flex-shrink-0 mt-0.5" />
              <span>Convert 3–5 pilots to paid accounts</span>
            </li>
          </ul>
          <p className="text-[10px] text-purple-600 dark:text-purple-400 mt-2 italic">Brand Role: A trusted, lightweight companion that delivers clarity without requiring system change.</p>
        </div>

        {/* Phase 3 */}
        <div className="rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-green-200 border border-green-400 flex items-center justify-center">
              <span className="text-[10px] font-bold text-green-800">3</span>
            </div>
            <h4 className="font-semibold text-sm text-green-700 dark:text-green-400">Commercialisation & UK Market Entry (2027)</h4>
          </div>
          <p className="text-xs text-green-600 dark:text-green-300 mb-2">Target: Pilot-to-paid conversions and new inbound paying customers</p>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li className="flex items-start gap-2">
              <ArrowRight className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Launch public website and onboarding flows in Q1 2027</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Establish predictable acquisition → activation → retention funnels</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Build the ARR foundation for scale</span>
            </li>
          </ul>
          <p className="text-[10px] text-green-600 dark:text-green-400 mt-2 italic">Brand Role: A dependable, intelligent assistant that enhances existing systems.</p>
        </div>
      </div>

      {/* Global Expansion Strategy */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <Globe className="w-3 h-3 text-primary" />
          </div>
          Global Expansion Strategy (2028–2030)
        </h3>
        
        <div className="rounded-lg bg-muted/50 border border-border p-4">
          <p className="text-xs font-semibold text-foreground mb-2">Grounded in verified market growth data:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            <div className="text-center p-2 bg-background rounded-lg">
              <p className="text-sm font-bold text-primary">36.1%</p>
              <p className="text-[10px] text-muted-foreground">CAGR AI in Real Estate</p>
            </div>
            <div className="text-center p-2 bg-background rounded-lg">
              <p className="text-sm font-bold text-primary">$1.8T</p>
              <p className="text-[10px] text-muted-foreground">Market by 2030</p>
            </div>
            <div className="text-center p-2 bg-background rounded-lg">
              <p className="text-sm font-bold text-primary">10%+</p>
              <p className="text-[10px] text-muted-foreground">NOI improvements (McKinsey)</p>
            </div>
            <div className="text-center p-2 bg-background rounded-lg">
              <p className="text-sm font-bold text-primary">49%</p>
              <p className="text-[10px] text-muted-foreground">Firms saving costs (Forbes)</p>
            </div>
          </div>
          
          <p className="text-xs font-semibold text-foreground mb-2">Global Targeting Priorities:</p>
          <ul className="space-y-1 text-xs text-muted-foreground mb-3">
            <li>• US & Canada — most mature Proptech ecosystems</li>
            <li>• EU (Germany, Netherlands, Nordics) — strong regulatory burden → high document complexity</li>
            <li>• UAE & Singapore — fast adopters of digital-first property innovation</li>
          </ul>

          <p className="text-xs font-semibold text-foreground mb-2">Global SMART Objectives (2028–2030):</p>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li>• Enter two international markets by 2028</li>
            <li>• Secure 10 global pilot clients by mid-2029</li>
            <li>• Generate £250k–£400k global ARR by 2030</li>
            <li>• Publish 5 international case studies by 2030</li>
          </ul>
        </div>
      </div>

      {/* SMART Objectives for UK Targeting */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-foreground">SMART Objectives for UK Targeting (2025–2027)</h3>
        <div className="space-y-2">
          {[
            { stage: "Validation", period: "2025-Q1 2026", objective: "Secure five additional non-paying pilots by end of Q1 2026" },
            { stage: "User Satisfaction", period: "Q1-Q2 2026", objective: "Achieve 80%+ satisfaction by Q2 2026, measured through clarity, speed, and ease of use" },
            { stage: "Segment Representation", period: "Q2-Q3 2026", objective: "Activate at least one pilot in each core segment by Q3 2026" },
            { stage: "Messaging Frameworks", period: "Q3-Q4 2026", objective: "Develop fully segment-specific messaging by Q4 2026" },
            { stage: "Commercial Validation", period: "2027", objective: "Convert 3–5 pilot organisations into paying clients by Q3 2027" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 rounded-lg bg-muted/30 border border-border p-3">
              <div className="flex-shrink-0">
                <p className="text-[10px] font-bold text-primary">{item.stage}</p>
                <p className="text-[9px] text-muted-foreground">{item.period}</p>
              </div>
              <div className="flex-1 border-l border-border pl-3">
                <p className="text-xs text-muted-foreground leading-relaxed">{item.objective}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How This Targeting Strategy Supports Hobson's Goals */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-foreground">How This Targeting Strategy Supports Hobson's Goals</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
            <h4 className="font-semibold text-sm text-primary mb-2">Top-Level Organisational Benefits</h4>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                <span>Reduced market risk through staged validation</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                <span>Strong proof-of-value before scaling</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                <span>Clear roadmap from MVP → Pilot → Paid → Global</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                <span>Supports ARR, retention, and brand trust targets</span>
              </li>
            </ul>
          </div>
          
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
            <h4 className="font-semibold text-sm text-primary mb-2">Mid- to Long-Term Vision Alignment</h4>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                <span>UK foundation → scalable international model</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                <span>Clear positioning as "AI that brings clarity without disruption"</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                <span>Alignment with global adoption curves and ROI trends</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Supports Digital Strategy Areas */}
        <div className="rounded-lg bg-muted/50 border border-border p-4">
          <h4 className="font-semibold text-sm text-foreground mb-3">Supports Digital Strategy Areas</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {[
              { area: "Acquisition", desc: "Prioritises segments with highest pain and readiness" },
              { area: "Engagement", desc: "Persona-driven messaging + quiz + Sage brand identity" },
              { area: "Lead Gen", desc: "Clear segment funnels feeding demos & pilots" },
              { area: "Conversion", desc: "Phased targeting reduces friction to trial" },
              { area: "Growth", desc: "Creates base for long-term global expansion" },
            ].map((item, idx) => (
              <div key={idx} className="text-center p-2 bg-background rounded-lg">
                <p className="text-xs font-bold text-primary mb-1">{item.area}</p>
                <p className="text-[9px] text-muted-foreground leading-tight">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
