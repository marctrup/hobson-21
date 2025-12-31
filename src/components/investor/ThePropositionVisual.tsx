import React from 'react';
import { Target, Lightbulb, CheckCircle2, Zap, Users, Shield, TrendingUp, ArrowRight, FileText, Clock, DollarSign, Globe, MessageSquare, Megaphone, UserCheck, Settings, Eye, Calendar } from 'lucide-react';

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
              Hobson's core proposition is to provide Real Estate professionals with a calm, intelligent assistant that transforms dense, document-heavy workflows into instant, accurate, and referenced answers. The tool works alongside existing systems rather than replacing them, offering clarity without disruption.
            </p>
          </div>
        </div>
      </div>

      {/* Core Proposition Statement */}
      <div className="rounded-lg bg-accent/50 border border-accent p-5">
        <p className="text-sm text-muted-foreground text-center mb-3">
          The proposition combines emotional reassurance (calm, clarity, trust) with functional strength (speed, accuracy, transparency). In simple terms:
        </p>
        <p className="text-lg font-semibold text-primary text-center italic">
          "Hobson turns document chaos into clarity — fast, accurate answers drawn directly from the files you already rely on."
        </p>
      </div>

      {/* Product Strategy */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <Target className="w-3 h-3 text-primary" />
          </div>
          Product Strategy
        </h3>
        <p className="text-xs text-muted-foreground">Hobson is an AI-native assistant explicitly built for real estate.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Core Value */}
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
            <h4 className="font-semibold text-sm text-primary mb-2">1. Core Value</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                <span>Instant answers from source documents (leases, contracts, financials, technical reports)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                <span>Transparent citations so users can verify every answer</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                <span>A simple, lightweight interface requiring no onboarding</span>
              </li>
            </ul>
          </div>

          {/* Brand Experience */}
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
            <h4 className="font-semibold text-sm text-primary mb-2">2. Brand Experience</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                <span>Sage-inspired identity: calm, wise, trustworthy</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                <span>Purple colour palette signalling insight and clarity</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                <span>Owl mascot reinforces guidance and intelligence</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                <span>HUE coin to encourage engagement and reward usage</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                <span>Branded quiz ("Hobson Choice") for awareness and emotional connection</span>
              </li>
            </ul>
          </div>

          {/* Future Evolution */}
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
            <h4 className="font-semibold text-sm text-primary mb-2">3. Future Evolution</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <ArrowRight className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                <span>Move from information retrieval → proactive insight and suggestions</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                <span>Cross-document intelligence identifying patterns, risks, or anomalies</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                <span>Integrations with property CRMs, storage systems, and transaction tools</span>
              </li>
            </ul>
            <p className="text-[10px] text-primary mt-3 italic">This positions Hobson as the clarity layer across the entire real estate document ecosystem.</p>
          </div>
        </div>
      </div>

      {/* Price Strategy */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <DollarSign className="w-3 h-3 text-primary" />
          </div>
          Price Strategy (2026–2028)
        </h3>
        <p className="text-xs text-muted-foreground">Pricing supports Hobson's position as a lightweight, low-friction alternative to bulky enterprise systems.</p>

        <div className="space-y-2">
          {/* Phase 1 */}
          <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-[9px] font-bold text-white">1</span>
              </div>
              <h4 className="font-semibold text-sm text-blue-700 dark:text-blue-400">MVP & Validation (Q1 2026)</h4>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-300 mb-2">Objective: Remove all barriers to adoption while validating usefulness</p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• Fully free access for selected non-paying pilot partners</li>
              <li>• No credit card, no setup costs — enables frictionless testing</li>
            </ul>
          </div>

          {/* Phase 2 */}
          <div className="rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                <span className="text-[9px] font-bold text-white">2</span>
              </div>
              <h4 className="font-semibold text-sm text-purple-700 dark:text-purple-400">Pilot Expansion & Proof (Q2–Q4 2026)</h4>
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-300 mb-2">Objective: Build evidence, refine features, and test willingness to pay</p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• Continue free access for approved pilots to maximise engagement</li>
              <li>• Introduce usage-based pricing prototypes by Q4 2026</li>
              <li>• Begin shaping tiered pricing: Owner-Managers | Medium Firms | Large Operators</li>
            </ul>
          </div>

          {/* Phase 3 */}
          <div className="rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-[9px] font-bold text-white">3</span>
              </div>
              <h4 className="font-semibold text-sm text-green-700 dark:text-green-400">Commercial Launch (2027)</h4>
            </div>
            <p className="text-xs text-green-600 dark:text-green-300 mb-2">Objective: Convert validated pilots to paying customers</p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• Formal launch of usage-based pricing with clear value metrics</li>
              <li>• Roll out three-tier model (Starter → Professional → Enterprise)</li>
              <li>• Add optional add-ons (multi-team onboarding, enhanced document packs)</li>
            </ul>
          </div>

          {/* Phase 4 */}
          <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                <span className="text-[9px] font-bold text-white">4</span>
              </div>
              <h4 className="font-semibold text-sm text-amber-700 dark:text-amber-400">Global Expansion (2028+)</h4>
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-300 mb-2">Objective: Support multi-region scale and cross-market adoption</p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• Introduce localised pricing for EU and international markets</li>
              <li>• Offer enterprise bundles for multi-jurisdiction portfolio groups</li>
              <li>• Maintain affordability and simplicity as core differentiators globally</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Place (Channel Strategy) */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <Globe className="w-3 h-3 text-primary" />
          </div>
          Place (Channel Strategy)
        </h3>
        <p className="text-xs text-muted-foreground">Hobson's distribution approach evolves with product maturity.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-lg bg-muted/50 border-l-4 border-blue-500 p-4">
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">2026: MVP & Pilot</p>
            <p className="text-[10px] text-muted-foreground mb-2">Depth, validation, and trust-building</p>
            <ul className="space-y-1 text-[10px] text-muted-foreground">
              <li>• Relationship-led onboarding with pilot partners</li>
              <li>• Direct outreach through founder networks</li>
              <li>• Closed-platform access for controlled testing</li>
              <li>• Early education through LinkedIn</li>
            </ul>
          </div>

          <div className="rounded-lg bg-muted/50 border-l-4 border-green-500 p-4">
            <p className="text-xs font-bold text-green-600 dark:text-green-400 mb-1">2027: UK Commercial Launch</p>
            <p className="text-[10px] text-muted-foreground mb-2">Scalable UK acquisition through digital channels</p>
            <ul className="space-y-1 text-[10px] text-muted-foreground">
              <li>• Public website with self-serve sign-up</li>
              <li>• LinkedIn Ads targeting UK operators</li>
              <li>• Webinars, live demos, educational events</li>
              <li>• Industry communities and forums</li>
            </ul>
          </div>

          <div className="rounded-lg bg-muted/50 border-l-4 border-amber-500 p-4">
            <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-1">2028+: Global Expansion</p>
            <p className="text-[10px] text-muted-foreground mb-2">International reach supported by partners</p>
            <ul className="space-y-1 text-[10px] text-muted-foreground">
              <li>• Localised websites for EU and US</li>
              <li>• Regional partners and CRE networks</li>
              <li>• International digital acquisition</li>
              <li>• Evidence-led expansion (35–36% CAGR)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Promotion Strategy */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <Megaphone className="w-3 h-3 text-primary" />
          </div>
          Promotion Strategy
        </h3>
        <p className="text-xs text-muted-foreground">All activity reflects Hobson's brand identity: calm, clear, intelligent, and trustworthy.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-3">
            <p className="text-xs font-bold text-blue-700 dark:text-blue-400 mb-2">2026: Validation & Education</p>
            <ul className="space-y-1 text-[10px] text-muted-foreground">
              <li>• Educational content on AI in real estate</li>
              <li>• Hobson Choice Quiz for awareness</li>
              <li>• Pilot case studies</li>
              <li>• Metaphors ("Document GPS," "Master Key")</li>
              <li>• Founder-led LinkedIn thought leadership</li>
              <li>• Short explainer videos</li>
            </ul>
          </div>

          <div className="rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-3">
            <p className="text-xs font-bold text-green-700 dark:text-green-400 mb-2">2027: Commercial Launch</p>
            <ul className="space-y-1 text-[10px] text-muted-foreground">
              <li>• Full-funnel LinkedIn campaigns</li>
              <li>• PR announcements and testimonials</li>
              <li>• Educational webinars</li>
              <li>• Automated email nurture sequences</li>
            </ul>
          </div>

          <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3">
            <p className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-2">2028+: International</p>
            <ul className="space-y-1 text-[10px] text-muted-foreground">
              <li>• Localised content and landing pages</li>
              <li>• Region-specific webinars</li>
              <li>• Industry association partnerships</li>
            </ul>
          </div>
        </div>

        {/* SMART Promotional Targets */}
        <div className="rounded-lg bg-muted/50 border border-border p-4">
          <p className="text-xs font-semibold text-foreground mb-3">SMART Promotional Targets</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="text-center p-2 bg-background rounded-lg">
              <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 mb-1">By Q4 2026</p>
              <ul className="text-[9px] text-muted-foreground space-y-1">
                <li>20% awareness lift</li>
                <li>500+ qualified contacts</li>
                <li>15% demo → pilot conversion</li>
              </ul>
            </div>
            <div className="text-center p-2 bg-background rounded-lg">
              <p className="text-[10px] font-bold text-green-600 dark:text-green-400 mb-1">By 2027</p>
              <ul className="text-[9px] text-muted-foreground space-y-1">
                <li>Predictable acquisition funnel</li>
                <li>10+ educational assets</li>
                <li>5–10% sign-up intent uplift</li>
              </ul>
            </div>
            <div className="text-center p-2 bg-background rounded-lg">
              <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 mb-1">By 2028</p>
              <ul className="text-[9px] text-muted-foreground space-y-1">
                <li>Localised content (2 markets)</li>
                <li>2-3 regional partnerships</li>
                <li>Global awareness benchmarks</li>
              </ul>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground italic">
          Communication voice: calm, wise, factual, and reassuring — consistent with Hobson's Sage archetype.
        </p>
      </div>

      {/* People, Process, Physical Evidence */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-foreground">Supporting Strategies</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* People Strategy */}
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-primary" />
              <h4 className="font-semibold text-sm text-primary">People Strategy</h4>
            </div>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                <span>Knowledgeable founder-led interaction during pilots</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                <span>Supportive and helpful tone in all communication</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                <span>Future customer success function reflecting Sage qualities: calm, clear, supportive, reliable</span>
              </li>
            </ul>
          </div>

          {/* Process Strategy */}
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Settings className="w-4 h-4 text-primary" />
              <h4 className="font-semibold text-sm text-primary">Process Strategy</h4>
            </div>
            <p className="text-[10px] text-muted-foreground mb-2">A smooth process delivers the promised simplicity:</p>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                <span>Minimal steps from document upload → answer</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                <span>Transparent citations reduce uncertainty</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                <span>Clear feedback loops with pilot clients</span>
              </li>
            </ul>
          </div>

          {/* Physical Evidence */}
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-primary" />
              <h4 className="font-semibold text-sm text-primary">Physical Evidence</h4>
            </div>
            <p className="text-[10px] text-muted-foreground mb-2">Digital cues that reinforce trust:</p>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                <span>Consistent purple colour palette</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                <span>Owl mascot as symbol of wisdom</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                <span>HUE coin as distinctive proof of engagement</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                <span>Professional, minimal UI with citation-focused answer panels</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-lg bg-primary/10 border border-primary/30 p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <CheckCircle2 className="w-3 h-3 text-primary" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-foreground mb-1">Strategic Summary</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Build trust first during 2026, momentum and commercial traction during 2027, and international reach from 2028 onward. This supports Hobson's long-term goal of becoming the recognised global category leader in AI-powered document intelligence for Real Estate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
