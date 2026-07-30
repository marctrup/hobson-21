import React from "react";
import { Target, Users, Zap, Shield, Clock, Globe, FileText, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";

const GoToMarketSummaryVisual = () => {
  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-paper to-white rounded-xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-bone-wash text-charcoal rounded-full text-sm font-medium mb-4">
          <FileText className="w-4 h-4" />
          SOSTAC Framework
        </div>
        <p className="text-charcoal max-w-3xl mx-auto">
          Hobson — Investor Summary. A full SOSTAC-based Marketing Strategy document is available on request.
        </p>
      </div>

      {/* What We're Building */}
      <div className="bg-white rounded-xl border border-bone p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-bone-wash rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-charcoal" />
          </div>
          <h3 className="text-xl font-bold text-ink">What We're Building</h3>
        </div>
        <p className="text-charcoal mb-4">
          Hobson is an AI assistant for real estate teams that turns existing documents into fast, accurate, referenced answers.
        </p>
        <p className="text-charcoal mb-4">
          Real estate organisations are overwhelmed by leases, agreements, and compliance documents spread across CRMs, shared drives, and email. Finding simple information is slow, manual, and risky.
        </p>
        <div className="bg-paper border border-faint-rule rounded-lg p-4">
          <p className="text-ink font-medium">
            Hobson does not replace existing systems. It works with them — acting as a lightweight AI layer that reads the documents teams already rely on and delivers instant, source-backed answers.
          </p>
        </div>
        <div className="mt-4 text-center">
          <span className="text-sm font-semibold text-ink-muted uppercase tracking-wider">Positioning:</span>
          <span className="ml-2 text-lg font-bold text-charcoal">Disruption Without Displacement</span>
        </div>
      </div>

      {/* The Problem */}
      <div className="bg-white rounded-xl border border-bone p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-danger-bg rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-danger" />
          </div>
          <h3 className="text-xl font-bold text-ink">The Problem</h3>
        </div>
        <p className="text-charcoal mb-4">Across real estate organisations of all sizes:</p>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            "Critical information lives inside unstructured documents",
            "Manual search wastes time and introduces errors",
            "Compliance, investor reporting, and audit pressure is increasing",
            "Teams are leaner, but expectations are higher",
          ].map((item, index) => (
            <div key={index} className="flex items-start gap-2 bg-danger-bg rounded-lg p-3">
              <div className="w-2 h-2 bg-danger-border rounded-full mt-2" />
              <span className="text-charcoal">{item}</span>
            </div>
          ))}
        </div>
        <p className="text-charcoal mt-4">
          Legacy PropTech systems are expensive, slow to change, and difficult to implement. Most AI competitors focus on leasing, CRM, or analytics — not document accuracy.
        </p>
        <div className="mt-4 bg-warning-bg border border-warning-border rounded-lg p-4">
          <p className="text-warning font-semibold">
            The gap: fast, trustworthy document intelligence that fits into existing workflows.
          </p>
        </div>
      </div>

      {/* The Solution */}
      <div className="bg-white rounded-xl border border-bone p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-success-bg rounded-lg flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-success" />
          </div>
          <h3 className="text-xl font-bold text-ink">The Solution</h3>
        </div>
        <p className="text-charcoal mb-4">Hobson turns documents into a usable knowledge layer.</p>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {[
            { title: "Document-native", desc: "Works directly from leases and agreements" },
            { title: "Referenced answers", desc: "Every response shows its source" },
            { title: "No system replacement", desc: "Zero integration by default" },
            { title: "Low friction", desc: "No onboarding, no process change" },
          ].map((item, index) => (
            <div key={index} className="bg-success-bg rounded-lg p-4 border border-success-border">
              <h4 className="font-semibold text-success mb-1">{item.title}</h4>
              <p className="text-sm text-charcoal">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-charcoal italic">
          This makes Hobson safe to adopt in a risk-averse industry where accuracy and trust matter more than novelty.
        </p>
      </div>

      {/* Who We Target */}
      <div className="bg-white rounded-xl border border-bone p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-bone-wash rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-charcoal" />
          </div>
          <h3 className="text-xl font-bold text-ink">Who We Target (Phased)</h3>
        </div>
        <div className="space-y-4">
          {[
            {
              phase: "Phase 1",
              label: "Primary",
              title: "Large Portfolio Operators",
              points: [
                "Highest admin burden and compliance risk",
                "Clear, measurable ROI from time saved and errors reduced",
                "Strong early adopters for MVP validation",
              ],
              color: "purple",
            },
            {
              phase: "Phase 2",
              title: "Medium-Sized Property Companies",
              points: [
                "Agile teams, fragmented information",
                "Low friction adoption, strong case-study potential",
              ],
              color: "indigo",
            },
            {
              phase: "Phase 3",
              label: "Future",
              title: "Small Portfolio Owners",
              points: [
                "Large volume opportunity",
                "Self-serve, low-cost model once product matures",
              ],
              color: "slate",
            },
          ].map((item, index) => (
            <div key={index} className={`bg-${item.color}-50 rounded-lg p-4 border border-${item.color}-100`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 bg-${item.color}-200 text-${item.color}-800 text-xs font-bold rounded`}>
                  {item.phase}
                </span>
                {item.label && (
                  <span className="text-xs text-ink-muted uppercase">{item.label}</span>
                )}
              </div>
              <h4 className="font-semibold text-ink mb-2">{item.title}</h4>
              <ul className="space-y-1">
                {item.points.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-charcoal">
                    <ArrowRight className="w-3 h-3 mt-1 text-ink-muted" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Why We Win */}
      <div className="bg-white rounded-xl border border-bone p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-warning-bg rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-warning" />
          </div>
          <h3 className="text-xl font-bold text-ink">Why We Win</h3>
        </div>
        <p className="text-charcoal mb-4">Hobson is differentiated by:</p>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            "Accuracy over automation (answers you can trust)",
            "Transparency (no black-box AI)",
            "Non-disruptive adoption (works alongside MRI, Yardi, etc.)",
            "Cost efficiency (no heavy implementations)",
          ].map((item, index) => (
            <div key={index} className="flex items-start gap-2 bg-warning-bg rounded-lg p-3 border border-warning-border">
              <CheckCircle className="w-4 h-4 text-warning mt-0.5" />
              <span className="text-charcoal">{item}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center font-medium text-warning">
          This positions Hobson as a category creator in AI document intelligence for real estate.
        </p>
      </div>

      {/* Go-to-Market Approach */}
      <div className="bg-white rounded-xl border border-bone p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-bone-wash rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-charcoal" />
          </div>
          <h3 className="text-xl font-bold text-ink">Go-to-Market Approach</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-3 mb-4">
          {[
            "Relationship-led pilots with real operators",
            "MVP shaped directly by live document use",
            "Early proof through time saved, accuracy, and reduced risk",
            "Gradual expansion from pilots → paid adoption → scale",
          ].map((item, index) => (
            <div key={index} className="flex items-start gap-2 bg-paper rounded-lg p-3 border border-faint-rule">
              <ArrowRight className="w-4 h-4 text-charcoal mt-0.5" />
              <span className="text-charcoal">{item}</span>
            </div>
          ))}
        </div>
        <p className="text-center font-semibold text-charcoal">Trust and clarity come before growth.</p>
      </div>

      {/* Timeline & Milestones */}
      <div className="bg-white rounded-xl border border-bone p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-bone-wash rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-charcoal" />
          </div>
          <h3 className="text-xl font-bold text-ink">Timeline & Milestones</h3>
        </div>
        <div className="space-y-4">
          {[
            {
              period: "2025 – Q1 2026",
              items: [
                "MVP completion",
                "Expand to ~5 pilot organisations",
                "Validate accuracy, speed, and workflows",
              ],
            },
            {
              period: "2026",
              items: [
                "Convert 3–5 pilots to paid customers",
                "Publish first case studies",
                "Strengthen product reliability and support",
                "Reach early recurring revenue",
              ],
            },
            {
              period: "2027",
              items: [
                "Public commercial launch (UK)",
                "Scalable onboarding and acquisition",
                "Build ARR foundation",
              ],
            },
            {
              period: "2028+",
              items: [
                "European expansion",
                "Global markets (US / APAC)",
                "Move from retrieval → proactive insight",
              ],
            },
          ].map((milestone, index) => (
            <div key={index} className="flex gap-4">
              <div className="w-32 flex-shrink-0">
                <span className="text-sm font-bold text-charcoal">{milestone.period}</span>
              </div>
              <div className="flex-1">
                <ul className="space-y-1">
                  {milestone.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-charcoal">
                      <div className="w-1.5 h-1.5 bg-ink-faint rounded-full mt-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Long-Term Vision */}
      <div className="bg-gradient-to-r from-paper to-bone-wash rounded-xl p-6 border border-bone">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-bone rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-charcoal" />
          </div>
          <h3 className="text-xl font-bold text-ink">Long-Term Vision</h3>
        </div>
        <p className="text-charcoal mb-4">
          Hobson evolves from answering questions to anticipating risk and opportunity — surfacing renewals, obligations, anomalies, and portfolio patterns automatically.
        </p>
        <p className="text-ink font-medium mb-4">
          The end goal is to become the trusted clarity layer for real estate organisations worldwide.
        </p>
        <div className="bg-white rounded-lg p-4 border border-bone">
          <p className="text-ink font-semibold text-center">
            In short: Hobson solves a growing, painful problem with a simple, defensible approach — delivering immediate value today, while building toward a much larger AI-driven future.
          </p>
        </div>
      </div>

      {/* Document Request Note */}
      <div className="text-center text-sm text-ink-muted italic">
        A comprehensive Marketing Strategy document based on the SOSTAC framework is available on request.
      </div>
    </div>
  );
};

export default GoToMarketSummaryVisual;
