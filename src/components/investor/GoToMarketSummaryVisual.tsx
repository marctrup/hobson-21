import React from "react";
import { Target, Users, Zap, Shield, Clock, Globe, FileText, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";

const GoToMarketSummaryVisual = () => {
  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-slate-50 to-white rounded-xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-4">
          <FileText className="w-4 h-4" />
          SOSTAC Framework
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Go-To-Market Summary</h2>
        <p className="text-slate-600 max-w-3xl mx-auto">
          Hobson — Investor Summary. A full SOSTAC-based Marketing Strategy document is available on request.
        </p>
      </div>

      {/* What We're Building */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">What We're Building</h3>
        </div>
        <p className="text-slate-700 mb-4">
          Hobson is an AI assistant for real estate teams that turns existing documents into fast, accurate, referenced answers.
        </p>
        <p className="text-slate-600 mb-4">
          Real estate organisations are overwhelmed by leases, agreements, and compliance documents spread across CRMs, shared drives, and email. Finding simple information is slow, manual, and risky.
        </p>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <p className="text-blue-800 font-medium">
            Hobson does not replace existing systems. It works with them — acting as a lightweight AI layer that reads the documents teams already rely on and delivers instant, source-backed answers.
          </p>
        </div>
        <div className="mt-4 text-center">
          <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Positioning:</span>
          <span className="ml-2 text-lg font-bold text-blue-600">Disruption Without Displacement</span>
        </div>
      </div>

      {/* The Problem */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">The Problem</h3>
        </div>
        <p className="text-slate-600 mb-4">Across real estate organisations of all sizes:</p>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            "Critical information lives inside unstructured documents",
            "Manual search wastes time and introduces errors",
            "Compliance, investor reporting, and audit pressure is increasing",
            "Teams are leaner, but expectations are higher",
          ].map((item, index) => (
            <div key={index} className="flex items-start gap-2 bg-red-50 rounded-lg p-3">
              <div className="w-2 h-2 bg-red-400 rounded-full mt-2" />
              <span className="text-slate-700">{item}</span>
            </div>
          ))}
        </div>
        <p className="text-slate-600 mt-4">
          Legacy PropTech systems are expensive, slow to change, and difficult to implement. Most AI competitors focus on leasing, CRM, or analytics — not document accuracy.
        </p>
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-amber-800 font-semibold">
            The gap: fast, trustworthy document intelligence that fits into existing workflows.
          </p>
        </div>
      </div>

      {/* The Solution */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">The Solution</h3>
        </div>
        <p className="text-slate-700 mb-4">Hobson turns documents into a usable knowledge layer.</p>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {[
            { title: "Document-native", desc: "Works directly from leases and agreements" },
            { title: "Referenced answers", desc: "Every response shows its source" },
            { title: "No system replacement", desc: "Zero integration by default" },
            { title: "Low friction", desc: "No onboarding, no process change" },
          ].map((item, index) => (
            <div key={index} className="bg-green-50 rounded-lg p-4 border border-green-100">
              <h4 className="font-semibold text-green-800 mb-1">{item.title}</h4>
              <p className="text-sm text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-slate-600 italic">
          This makes Hobson safe to adopt in a risk-averse industry where accuracy and trust matter more than novelty.
        </p>
      </div>

      {/* Who We Target */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Who We Target (Phased)</h3>
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
                  <span className="text-xs text-slate-500 uppercase">{item.label}</span>
                )}
              </div>
              <h4 className="font-semibold text-slate-800 mb-2">{item.title}</h4>
              <ul className="space-y-1">
                {item.points.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                    <ArrowRight className="w-3 h-3 mt-1 text-slate-400" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Why We Win */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Why We Win</h3>
        </div>
        <p className="text-slate-600 mb-4">Hobson is differentiated by:</p>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            "Accuracy over automation (answers you can trust)",
            "Transparency (no black-box AI)",
            "Non-disruptive adoption (works alongside MRI, Yardi, etc.)",
            "Cost efficiency (no heavy implementations)",
          ].map((item, index) => (
            <div key={index} className="flex items-start gap-2 bg-amber-50 rounded-lg p-3 border border-amber-100">
              <CheckCircle className="w-4 h-4 text-amber-600 mt-0.5" />
              <span className="text-slate-700">{item}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center font-medium text-amber-700">
          This positions Hobson as a category creator in AI document intelligence for real estate.
        </p>
      </div>

      {/* Go-to-Market Approach */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-teal-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Go-to-Market Approach</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-3 mb-4">
          {[
            "Relationship-led pilots with real operators",
            "MVP shaped directly by live document use",
            "Early proof through time saved, accuracy, and reduced risk",
            "Gradual expansion from pilots → paid adoption → scale",
          ].map((item, index) => (
            <div key={index} className="flex items-start gap-2 bg-teal-50 rounded-lg p-3 border border-teal-100">
              <ArrowRight className="w-4 h-4 text-teal-600 mt-0.5" />
              <span className="text-slate-700">{item}</span>
            </div>
          ))}
        </div>
        <p className="text-center font-semibold text-teal-700">Trust and clarity come before growth.</p>
      </div>

      {/* Timeline & Milestones */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Timeline & Milestones</h3>
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
                <span className="text-sm font-bold text-blue-600">{milestone.period}</span>
              </div>
              <div className="flex-1">
                <ul className="space-y-1">
                  {milestone.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2" />
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
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-blue-700" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Long-Term Vision</h3>
        </div>
        <p className="text-slate-600 mb-4">
          Hobson evolves from answering questions to anticipating risk and opportunity — surfacing renewals, obligations, anomalies, and portfolio patterns automatically.
        </p>
        <p className="text-slate-800 font-medium mb-4">
          The end goal is to become the trusted clarity layer for real estate organisations worldwide.
        </p>
        <div className="bg-white rounded-lg p-4 border border-blue-200">
          <p className="text-blue-800 font-semibold text-center">
            In short: Hobson solves a growing, painful problem with a simple, defensible approach — delivering immediate value today, while building toward a much larger AI-driven future.
          </p>
        </div>
      </div>

      {/* Document Request Note */}
      <div className="text-center text-sm text-slate-500 italic">
        A comprehensive Marketing Strategy document based on the SOSTAC framework is available on request.
      </div>
    </div>
  );
};

export default GoToMarketSummaryVisual;
