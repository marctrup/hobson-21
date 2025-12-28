import React from 'react';
import { Target, TrendingUp, Users, Rocket, Shield, Globe, Zap, Award, CheckCircle2, BarChart3, Calendar, Building2, Megaphone, Settings, DollarSign, ArrowRight } from 'lucide-react';

const BusinessObjectivesVisual = () => {
  return (
    <div className="space-y-8">
      {/* Intro */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl p-6 border border-primary/20">
        <p className="text-muted-foreground leading-relaxed">
          The next 12 months are focused on completing the MVP for early 2026, validating Hobson in real operational settings, and building the foundations needed for commercial rollout and long-term scale. These objectives define the outcomes required across product, commercial, operational, and brand areas so Hobson can move from MVP to paid adoption onto UK scale and global expansion.
        </p>
      </div>

      {/* Top-Level Organisational Goals */}
      <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/20 rounded-2xl p-6 border border-emerald-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-emerald-500/20 rounded-xl">
            <Target className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-foreground">Top-Level Organisational Goals</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4 italic">How the Organisation Benefits</p>
        <div className="space-y-3">
          {[
            "Validate Hobson's usefulness and reliability across a broader range of Real Estate operators beyond the initial partner cohort.",
            "Establish a stable, predictable MVP that supports ongoing refinement, insight generation, and future automation.",
            "Build scalable internal systems support, onboarding, and data operations ready for increased usage from 2026 onward.",
            "Create a commercial foundation capable of driving paid adoption during 2026–2027."
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 bg-background/50 rounded-lg p-3 border border-emerald-500/10">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span className="text-foreground text-sm">{item}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20">
          <p className="text-foreground text-sm">
            Position Hobson as the intelligence layer in the UK that Real Estate runs on, ensuring every operational decision is based on instant, auditable insight rather than manual search, institutional memory, or guesswork. <span className="text-emerald-600 font-semibold">Hobson will be ready for European and global expansion from 2028.</span>
          </p>
        </div>
      </div>

      {/* Mid- to Long-Term Vision */}
      <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/20 rounded-2xl p-6 border border-blue-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-500/20 rounded-xl">
            <Rocket className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-foreground">Mid- to Long-Term Vision (2-3+ Years)</h3>
        </div>
        <p className="text-muted-foreground mb-4 text-sm">
          Hobson will evolve from a retrieval-focused MVP (2026) into a proactive AI assistant replacing manual document work in Real Estate with AI-driven reasoning, delivering instant, traceable answers that reduce staffing costs, prevent costly errors, and accelerate operational decision-making. It will embed directly into existing workflows, becoming the intelligence infrastructure modern Real Estate operations require to compete.
        </p>
        <h4 className="font-semibold text-foreground mb-3">Strategic Direction:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            "Achieve UK leadership in AI document intelligence by end of 2026.",
            "Build a scalable paying client base in the UK by end of 2027.",
            "Expand into Europe and globally from mid-2027, targeting £15.5B TAM, £10.1B SAM for Europe.",
            "From 2028, expect rapidly rising adoption.",
            "Position Hobson as an \"export-ready\" clarity platform adaptable to regional regulation.",
            "Build a roadmap from retrieval to suggestions, on to proactive action and predictive clarity."
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 bg-background/50 rounded-lg p-3 border border-blue-500/10">
              <ArrowRight className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <span className="text-foreground text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Market Validation */}
      <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/20 rounded-2xl p-6 border border-amber-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-amber-500/20 rounded-xl">
            <TrendingUp className="w-6 h-6 text-amber-600" />
          </div>
          <h3 className="text-xl font-bold text-foreground">Market Validation Shows Strong Tailwinds</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-background/50 rounded-xl p-4 border border-amber-500/10 text-center">
            <p className="text-2xl font-bold text-amber-600">36.1%</p>
            <p className="text-sm text-foreground">CAGR growth in AI for Real Estate</p>
            <p className="text-xs text-muted-foreground mt-1">Ref: Business Research Company</p>
          </div>
          <div className="bg-background/50 rounded-xl p-4 border border-amber-500/10 text-center">
            <p className="text-2xl font-bold text-amber-600">$1.8T</p>
            <p className="text-sm text-foreground">Global AI Real Estate market by 2030</p>
            <p className="text-xs text-muted-foreground mt-1">Ref: Market Research</p>
          </div>
          <div className="bg-background/50 rounded-xl p-4 border border-amber-500/10 text-center">
            <p className="text-2xl font-bold text-amber-600">10–20%</p>
            <p className="text-sm text-foreground">Efficiency gains with AI adoption</p>
            <p className="text-xs text-muted-foreground mt-1">Ref: Forbes</p>
          </div>
        </div>
        <p className="text-center text-muted-foreground mt-4 text-sm">
          {"Hobson's focus on clarity, accuracy, and low friction fits tightly with these macro trends."}
        </p>
      </div>

      {/* SMART Objectives */}
      <div className="space-y-4">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-foreground">SMART Objectives (2025–2027 Timeline)</h3>
          <p className="text-muted-foreground text-sm">Specific, Measurable, Achievable, Relevant, Time-bound</p>
        </div>

        {/* Product & Market Validation */}
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/20 rounded-2xl p-6 border border-purple-500/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <h4 className="text-lg font-bold text-foreground">Product & Market Validation (2026)</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "Add five new non-paying pilot customers by end of Q1 2026.",
              "Achieve 80%+ satisfaction across pilot users by Q3 2026.",
              "Reduce average retrieval friction by 30% by Q4 2026.",
              "Demonstrate willingness to pay by Q4 2026."
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 bg-background/50 rounded-lg p-3 border border-purple-500/10">
                <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                <span className="text-foreground text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Commercial & Revenue */}
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/20 rounded-2xl p-6 border border-green-500/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <h4 className="text-lg font-bold text-foreground">Commercial & Revenue (2026–2027)</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "Convert 3–5 pilot organisations into paying accounts by Q4 2026.",
              "Reach £50k–£100k MRR by Q4 2027 through structured onboarding.",
              "Maintain 70%+ retention across early paid users by Q4 2027.",
              "Validate ROI across small, medium, and large operators by Q4 2026."
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 bg-background/50 rounded-lg p-3 border border-green-500/10">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-foreground text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Brand & Market Presence */}
        <div className="bg-gradient-to-br from-pink-500/10 to-pink-600/20 rounded-2xl p-6 border border-pink-500/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-pink-500/20 rounded-lg">
              <Megaphone className="w-5 h-5 text-pink-600" />
            </div>
            <h4 className="text-lg font-bold text-foreground">Brand & Market Presence (2026)</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "Increase brand awareness by 25% by Q4 2026.",
              "Publish three case studies by Q3 2026.",
              "Introduce confidence indicators by Q4 2026."
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 bg-background/50 rounded-lg p-3 border border-pink-500/10">
                <CheckCircle2 className="w-4 h-4 text-pink-600 flex-shrink-0 mt-0.5" />
                <span className="text-foreground text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Operational & Internal */}
        <div className="bg-gradient-to-br from-slate-500/10 to-slate-600/20 rounded-2xl p-6 border border-slate-500/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-slate-500/20 rounded-lg">
              <Settings className="w-5 h-5 text-slate-600" />
            </div>
            <h4 className="text-lg font-bold text-foreground">Operational & Internal Development (2026–2027)</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "Establish a lightweight support framework by Q4 2026.",
              "Automate 30% of internal testing and support workflows by Q1 2027.",
              "Deliver Phase 2 development by Q4 2026."
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 bg-background/50 rounded-lg p-3 border border-slate-500/10">
                <CheckCircle2 className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                <span className="text-foreground text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sales and Acquisition Strategy */}
      <div className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/20 rounded-2xl p-6 border border-indigo-500/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-500/20 rounded-xl">
            <Users className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-foreground">Sales and Acquisition Strategy (2026-2027)</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Customer Acquisition */}
          <div className="bg-background/50 rounded-xl p-4 border border-indigo-500/10">
            <h5 className="font-semibold text-foreground mb-3">Customer Acquisition</h5>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Add up to 5 new pilot partners by Q1 2026</li>
              <li>• Build early awareness via LinkedIn, SEO, and value-led comms</li>
            </ul>
          </div>

          {/* Conversion */}
          <div className="bg-background/50 rounded-xl p-4 border border-indigo-500/10">
            <h5 className="font-semibold text-foreground mb-3">Conversion</h5>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Convert 3 pilots into paying clients by Q4 2026</li>
              <li>• Finalise scalable pricing model</li>
              <li>• Improve website CTAs and messaging</li>
            </ul>
          </div>

          {/* Engagement */}
          <div className="bg-background/50 rounded-xl p-4 border border-indigo-500/10">
            <h5 className="font-semibold text-foreground mb-3">Engagement</h5>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Maintain 60% weekly engagement from pilots by Q4 2026</li>
              <li>• Add clarity indicators and in-product guidance</li>
            </ul>
          </div>

          {/* Lead Generation */}
          <div className="bg-background/50 rounded-xl p-4 border border-indigo-500/10">
            <h5 className="font-semibold text-foreground mb-3">Lead Generation</h5>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Generate 50 MQLs by Q1 2027</li>
              <li>• Develop Knowledge Hub for real-world AI applications</li>
            </ul>
          </div>

          {/* Development & Growth */}
          <div className="bg-background/50 rounded-xl p-4 border border-indigo-500/10">
            <h5 className="font-semibold text-foreground mb-3">Development & Growth</h5>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Complete Phase 2 features by Q4 2026</li>
              <li>• Prepare public-facing onboarding journey by Q4 2026</li>
            </ul>
          </div>

          {/* Global Expansion */}
          <div className="bg-background/50 rounded-xl p-4 border border-indigo-500/10">
            <h5 className="font-semibold text-foreground mb-3">Global Expansion</h5>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Begin European pilot expansion Q1 2028</li>
              <li>• Enter US and APAC by Q4 2029</li>
              <li>• Achieve £1M ARR internationally by 2030</li>
            </ul>
          </div>
        </div>

        {/* Market Rationale */}
        <div className="mt-4 bg-indigo-500/10 rounded-xl p-4 border border-indigo-500/20">
          <h5 className="font-semibold text-foreground mb-2">Market Rationale:</h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div>
              <p className="text-lg font-bold text-indigo-600">£1.41B</p>
              <p className="text-xs text-muted-foreground">UK Opportunity</p>
            </div>
            <div>
              <p className="text-lg font-bold text-indigo-600">£15.5B</p>
              <p className="text-xs text-muted-foreground">Europe TAM</p>
            </div>
            <div>
              <p className="text-lg font-bold text-indigo-600">£155.6B</p>
              <p className="text-xs text-muted-foreground">Global TAM</p>
            </div>
            <div>
              <p className="text-lg font-bold text-indigo-600">10–20%</p>
              <p className="text-xs text-muted-foreground">Efficiency Gains</p>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Progression */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl p-6 border border-primary/20">
        <h3 className="text-xl font-bold text-foreground mb-6 text-center">Business Objectives Create a Clean Progression</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-background/50 rounded-xl p-4 border border-primary/10 text-center">
            <div className="text-2xl font-bold text-primary mb-2">2026</div>
            <p className="text-sm text-foreground">Deliver MVP + expand pilots, strengthen product, validate market, convert early users</p>
          </div>
          <div className="bg-background/50 rounded-xl p-4 border border-primary/10 text-center">
            <div className="text-2xl font-bold text-primary mb-2">2027</div>
            <p className="text-sm text-foreground">Public launch, commercial expansion, readiness for international scaling</p>
          </div>
          <div className="bg-background/50 rounded-xl p-4 border border-primary/10 text-center">
            <div className="text-2xl font-bold text-primary mb-2">2028+</div>
            <p className="text-sm text-foreground">Enter Europe and global markets with a clarity-first AI platform</p>
          </div>
        </div>

        {/* Final Flow */}
        <div className="flex flex-wrap justify-center items-center gap-2 text-sm">
          <span className="bg-primary/20 text-primary font-semibold px-3 py-1 rounded-full">Prove</span>
          <ArrowRight className="w-4 h-4 text-primary" />
          <span className="bg-primary/20 text-primary font-semibold px-3 py-1 rounded-full">Refine</span>
          <ArrowRight className="w-4 h-4 text-primary" />
          <span className="bg-primary/20 text-primary font-semibold px-3 py-1 rounded-full">Scale</span>
          <ArrowRight className="w-4 h-4 text-primary" />
          <span className="bg-primary/20 text-primary font-semibold px-3 py-1 rounded-full">Commercialise</span>
          <ArrowRight className="w-4 h-4 text-primary" />
          <span className="bg-primary/20 text-primary font-semibold px-3 py-1 rounded-full">Expand Globally</span>
        </div>
      </div>
    </div>
  );
};

export default BusinessObjectivesVisual;
