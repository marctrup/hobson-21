import React from "react";
import { Monitor, Globe, Target, CheckCircle, ArrowRight, BarChart3, TrendingUp, Zap, Mail, MousePointer, RefreshCw, Eye, FileText, Users } from "lucide-react";

export const PrimaryConversionChannelsVisual: React.FC = () => {
  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-ink-faint/20 to-ink-faint/20 mb-4">
          <Monitor className="w-8 h-8 text-charcoal" />
        </div>
        <p className="text-charcoal max-w-3xl mx-auto">
          The goal of the conversion strategy is to make it as easy as possible for prospects to try Hobson, see value quickly, and progress toward deeper engagement. Through clear entry points, behavioural insight, and ongoing optimisation, Hobson builds a conversion engine suited for early-stage pilots today and scalable commercial activity in the coming years.
        </p>
      </div>

      {/* Channel 1: Website */}
      <div className="bg-gradient-to-r from-bone-wash to-bone rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-ink">
          <Globe className="w-5 h-5" />
          1. Website
        </h3>
        <p className="text-charcoal mb-4">
          The website acts as the main route into trials and enquiries. Conversion paths include:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[
            "Starting the free package",
            "Requesting a demo",
            "Submitting pilot enquiries",
            "Moving from the quiz into a guided trial"
          ].map((item, index) => (
            <div key={index} className="bg-white/80 rounded-lg p-3 text-center border border-bone">
              <p className="text-sm text-charcoal">{item}</p>
            </div>
          ))}
        </div>
        <p className="text-charcoal text-sm italic">
          Pages will be optimised around clear calls to action, simple explanations, and trust signals.
        </p>
      </div>

      {/* Channel 2: LinkedIn */}
      <div className="bg-white rounded-xl border border-bone p-6">
        <h3 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-charcoal" />
          2. LinkedIn
        </h3>
        <p className="text-charcoal mb-4">
          LinkedIn brings warm, relevant traffic to the website. Its role in conversion is to:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { text: "Explain what the free experience involves" },
            { text: "Show quick, concrete examples of value" },
            { text: "Direct users to try the product without commitment" }
          ].map((item, index) => (
            <div key={index} className="border-l-4 border-bone-strong pl-4">
              <p className="text-sm text-charcoal">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Channel 3: Retargeting */}
      <div className="bg-gradient-to-r from-paper to-paper rounded-xl p-6">
        <h3 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-charcoal" />
          3. Retargeting (Later Phase)
        </h3>
        <p className="text-charcoal mb-4">
          Retargeting will support users who need several exposures before acting. These campaigns will highlight:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            "What users can do immediately in the free package",
            "Small examples of outcomes",
            "Invitations to try the workflow for themselves"
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
              <CheckCircle className="w-4 h-4 text-ink-muted mb-2" />
              <p className="text-sm text-charcoal">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Channel 4: Email */}
      <div className="bg-white rounded-xl border border-bone p-6">
        <h3 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
          <Mail className="w-5 h-5 text-warning" />
          4. Email (For Users Already Engaged)
        </h3>
        <p className="text-charcoal mb-4">
          Email will help users understand the product once they have expressed interest. It supports conversion by:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "Guidance", desc: "Guiding them through first steps" },
            { title: "Prompts", desc: "Giving prompts based on typical tasks" },
            { title: "Reassurance", desc: "Reducing hesitation around accuracy or data handling" }
          ].map((item, index) => (
            <div key={index} className="bg-warning-bg rounded-lg p-4">
              <p className="font-semibold text-warning mb-1">{item.title}</p>
              <p className="text-sm text-charcoal">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Key Conversion Tactics */}
      <div className="bg-gradient-to-r from-bone-wash to-bone-wash rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-ink">
          <Zap className="w-5 h-5" />
          Key Conversion Tactics
        </h3>
        
        <div className="space-y-4">
          {/* Tactic 1 */}
          <div className="bg-white/80 rounded-lg p-4 border border-bone">
            <p className="font-semibold mb-2 text-ink">1. Free Package as Entry Point</p>
            <p className="text-sm text-charcoal">
              A no-cost option removes the most significant practical and psychological barriers. It shifts the decision from "should we commit?" to "should we try this now?" The focus is on letting users experience the core value with minimal effort.
            </p>
          </div>

          {/* Tactic 2 */}
          <div className="bg-white/80 rounded-lg p-4 border border-bone">
            <p className="font-semibold mb-2 text-ink">2. Optimising Calls to Action</p>
            <p className="text-sm text-charcoal mb-2">
              Conversion performance will be improved by testing:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {["Wording", "Placement (especially above the fold)", "Number of CTAs per page", "Clarity of next steps"].map((item, idx) => (
                <div key={idx} className="bg-paper rounded px-2 py-1 text-xs text-center text-charcoal">{item}</div>
              ))}
            </div>
            <p className="text-xs text-charcoal mt-2">Small changes here often produce meaningful gains.</p>
          </div>

          {/* Tactic 3 */}
          <div className="bg-white/80 rounded-lg p-4 border border-bone">
            <p className="font-semibold mb-2 text-ink">3. Improving Search-Driven Conversion</p>
            <p className="text-sm text-charcoal mb-2">
              As search visibility grows, ensure visitors find clear, relevant information and a direct route to trial:
            </p>
            <ul className="text-xs text-charcoal space-y-1 ml-4">
              <li>- Refining headings and page structure</li>
              <li>- Ensuring pages match search intent</li>
              <li>- Creating content aligned with typical tasks</li>
            </ul>
            <p className="text-xs text-ink-muted mt-2 italic">Better-matched traffic increases conversion efficiency.</p>
          </div>
        </div>
      </div>

      {/* More Tactics */}
      <div className="bg-white rounded-xl border border-bone p-6">
        <div className="space-y-4">
          {/* Tactic 4 */}
          <div className="border-l-4 border-bone-strong pl-4">
            <p className="font-semibold text-charcoal mb-2">4. Behaviour-Driven Improvements</p>
            <p className="text-sm text-charcoal mb-2">
              Heatmaps, scroll depth, and path analysis will be used to identify where users hesitate or leave. Findings inform:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {["CTA placement", "Copy revisions", "Example positioning", "Layout simplification"].map((item, idx) => (
                <div key={idx} className="bg-paper rounded px-3 py-2 text-xs text-charcoal text-center">{item}</div>
              ))}
            </div>
            <p className="text-xs text-ink-muted mt-2 italic">The aim is to make the journey feel effortless.</p>
          </div>

          {/* Tactic 5 */}
          <div className="border-l-4 border-bone-strong pl-4">
            <p className="font-semibold text-charcoal mb-2">5. Content Supporting Conversion</p>
            <p className="text-sm text-charcoal mb-2">
              Short demos, simple examples, and case summaries help prospects understand what Hobson does in practice. Content is used to close the gap between interest and action by showing:
            </p>
            <ul className="text-sm text-charcoal space-y-1 ml-4">
              <li>- How the product behaves</li>
              <li>- What users can achieve in a first session</li>
              <li>- Real cases that reflect day-to-day tasks</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="bg-paper rounded-xl p-6">
        <h3 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-charcoal" />
          6. Key Metrics
        </h3>
        <p className="text-charcoal mb-4">A concise set of metrics guides optimisation:</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            "Homepage click-through rate",
            "Free-package sign-ups",
            "Dwell time on core product pages",
            "Bounce rate",
            "Retargeting conversions",
            "Demo requests",
            "Conversion from high-intent organic traffic"
          ].map((metric, index) => (
            <div key={index} className="bg-white rounded-lg p-3 shadow-sm text-center">
              <Eye className="w-4 h-4 text-ink-muted mx-auto mb-2" />
              <p className="text-xs text-charcoal">{metric}</p>
            </div>
          ))}
        </div>
        <p className="text-ink-muted text-sm mt-4 text-center italic">
          These measures show where to refine the journey.
        </p>
      </div>

      {/* SMART Conversion Objectives */}
      <div className="bg-gradient-to-r from-bone-wash to-bone-wash rounded-xl p-6">
        <h3 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-charcoal" />
          SMART Conversion Objectives
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { target: "20-30%", desc: "Increase CTA click-through rates by Q2 2026" },
            { target: "10%", desc: "Conversion from high-intent visitors into free package by Q4 2026" },
            { target: "5", desc: "New pilot participants by Q1 2026" },
            { target: "2+ min", desc: "Product-page dwell time by Q2 2026" },
            { target: "<40%", desc: "Reduce bounce rates by Q3 2026" },
            { target: "10%", desc: "Convert retargeting audiences into enquiries by Q4 2026" },
            { target: "5%", desc: "Demo-request rate by Q4 2026" }
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-lg p-4 shadow-sm flex items-center gap-4">
              <div className="bg-bone-wash rounded-full w-14 h-14 flex items-center justify-center flex-shrink-0">
                <span className="text-charcoal font-bold text-xs text-center leading-tight">{item.target}</span>
              </div>
              <p className="text-sm text-charcoal">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-bone-wash rounded-xl p-6 text-center">
        <p className="text-charcoal">
          Through clear entry points, behavioural insight, and ongoing optimisation, Hobson builds a <span className="font-semibold text-charcoal">conversion engine</span> suited for early-stage pilots today and <span className="font-semibold text-charcoal">scalable commercial activity</span> in the coming years.
        </p>
      </div>
    </div>
  );
};

export default PrimaryConversionChannelsVisual;
