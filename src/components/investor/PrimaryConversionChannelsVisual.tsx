import React from "react";
import { Monitor, Smartphone, FileText, Users, Target, CheckCircle, ArrowRight, BarChart3, TrendingUp, Zap, Globe, Mail, Layout, Lightbulb } from "lucide-react";

export const PrimaryConversionChannelsVisual: React.FC = () => {
  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-teal-500/20 mb-4">
          <Monitor className="w-8 h-8 text-purple-600" />
        </div>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Hobson's conversion strategy centres on three primary channels: the website, the quiz, and the product itself. Each channel plays a distinct role in moving prospects from curiosity to commitment, with minimal friction and clear value at every step.
        </p>
      </div>

      {/* Overview */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Conversion Channel Overview
        </h3>
        <p className="text-purple-100 mb-4">
          The three channels work together to create a coherent journey from first awareness to active use:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "Website", desc: "Education, credibility, and entry point for deeper engagement", icon: Globe },
            { title: "Quiz", desc: "Low-friction engagement, insight gathering, and emotional connection", icon: Lightbulb },
            { title: "Product", desc: "Demonstration of value through real document interaction", icon: Layout }
          ].map((item, index) => (
            <div key={index} className="bg-white/10 rounded-lg p-4 flex items-start gap-3">
              <item.icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold mb-1">{item.title}</p>
                <p className="text-sm text-purple-100">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Channel 1: Website */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-purple-600" />
          1. Website (hobsonschoice.ai)
        </h3>
        <p className="text-gray-600 mb-4">
          The website is the primary conversion channel for prospects who want to understand what Hobson does before engaging further. It serves as the foundation for credibility, education, and action.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="border-l-4 border-purple-500 pl-4">
            <p className="font-medium text-purple-700">Role in Conversion</p>
            <ul className="text-sm text-gray-600 space-y-1 mt-2">
              <li>• Explain what Hobson does in clear, accessible terms</li>
              <li>• Build credibility through case examples and pilot stories</li>
              <li>• Provide a clear path to the quiz or pilot enquiry</li>
              <li>• Support SEO and AI search discoverability</li>
            </ul>
          </div>
          <div className="border-l-4 border-teal-500 pl-4">
            <p className="font-medium text-teal-700">Key Conversion Elements</p>
            <ul className="text-sm text-gray-600 space-y-1 mt-2">
              <li>• Clear product explanation on homepage</li>
              <li>• Role-specific pages (COO, Asset Manager, Owner-Manager)</li>
              <li>• Case summaries with measurable outcomes</li>
              <li>• Simple pilot enquiry form</li>
            </ul>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <p className="font-medium text-purple-700 mb-2">Website Conversion Targets</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { metric: "40%", desc: "Traffic increase by Q4 2027" },
              { metric: "2+ min", desc: "Average dwell time by Q4 2026" },
              { metric: "5%", desc: "Visitor-to-enquiry rate target" },
              { metric: "10", desc: "Educational pieces by Q4 2026" }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-3 text-center shadow-sm">
                <p className="text-lg font-bold text-purple-600">{item.metric}</p>
                <p className="text-xs text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Channel 2: Quiz */}
      <div className="bg-gradient-to-r from-teal-50 to-purple-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-teal-600" />
          2. The Quiz
        </h3>
        <p className="text-gray-600 mb-4">
          The quiz is designed as a low-friction entry point that introduces the problem space, gathers light insights about the prospect, and creates an early emotional connection before any product commitment.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="font-semibold text-teal-700 mb-2">Purpose</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Help prospects recognise their own pain points</li>
              <li>• Provide immediate, personalised value</li>
              <li>• Capture contact details for follow-up</li>
              <li>• Segment users by role and need</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="font-semibold text-teal-700 mb-2">Experience</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Short, engaging format (2-3 minutes)</li>
              <li>• Interactive, not passive</li>
              <li>• Clear visual results at the end</li>
              <li>• Natural path to next step</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="font-semibold text-teal-700 mb-2">Outcomes</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Lead capture with context</li>
              <li>• Qualification by role/need</li>
              <li>• Warm handoff to pilot or product</li>
              <li>• Data for content improvement</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="font-medium text-teal-700 mb-2">Quiz Conversion Targets</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { metric: "500+", desc: "Completions by Q2 2027" },
              { metric: "30%", desc: "Completion-to-lead rate" },
              { metric: "15%", desc: "Lead-to-pilot enquiry rate" }
            ].map((item, index) => (
              <div key={index} className="bg-teal-50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-teal-600">{item.metric}</p>
                <p className="text-xs text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Channel 3: Product */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Layout className="w-5 h-5 text-amber-600" />
          3. The Product (Free Entry Point)
        </h3>
        <p className="text-gray-600 mb-4">
          The product itself is a conversion channel. The free tier allows prospects to experience Hobson with their own documents, demonstrating value through real interaction rather than explanation alone.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="border-l-4 border-amber-500 pl-4">
            <p className="font-medium text-amber-700">Free Tier Conversion Logic</p>
            <ul className="text-sm text-gray-600 space-y-1 mt-2">
              <li>• Remove the barrier of commitment before value is proven</li>
              <li>• Let users experience real answers from their own documents</li>
              <li>• Build habit and trust before any payment discussion</li>
              <li>• Create natural upgrade triggers through usage limits</li>
            </ul>
          </div>
          <div className="border-l-4 border-rose-500 pl-4">
            <p className="font-medium text-rose-700">In-Product Conversion Elements</p>
            <ul className="text-sm text-gray-600 space-y-1 mt-2">
              <li>• Clear onboarding that shows value in first session</li>
              <li>• Usage prompts that guide without interrupting</li>
              <li>• Transparent referencing builds trust</li>
              <li>• Soft upgrade prompts at natural moments</li>
            </ul>
          </div>
        </div>

        <div className="bg-amber-50 rounded-lg p-4">
          <p className="font-medium text-amber-700 mb-2">Product Conversion Targets</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { metric: "60%", desc: "First-session success rate" },
              { metric: "40%", desc: "Return within 7 days" },
              { metric: "20%", desc: "Free-to-paid conversion" },
              { metric: "3", desc: "Avg queries before upgrade" }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-3 text-center shadow-sm">
                <p className="text-lg font-bold text-amber-600">{item.metric}</p>
                <p className="text-xs text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Conversion Flow */}
      <div className="bg-gradient-to-r from-purple-600 to-teal-600 rounded-xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ArrowRight className="w-5 h-5" />
          Conversion Flow Integration
        </h3>
        <p className="text-purple-100 mb-4">
          The three channels connect in a natural flow, with multiple entry points but a consistent progression toward active use:
        </p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <div className="bg-white/20 rounded-lg px-6 py-4 text-center">
            <Globe className="w-6 h-6 mx-auto mb-2" />
            <p className="font-semibold">Website</p>
            <p className="text-xs text-purple-100">Discover & Learn</p>
          </div>
          <ArrowRight className="w-6 h-6 rotate-90 md:rotate-0" />
          <div className="bg-white/20 rounded-lg px-6 py-4 text-center">
            <Lightbulb className="w-6 h-6 mx-auto mb-2" />
            <p className="font-semibold">Quiz</p>
            <p className="text-xs text-purple-100">Engage & Qualify</p>
          </div>
          <ArrowRight className="w-6 h-6 rotate-90 md:rotate-0" />
          <div className="bg-white/20 rounded-lg px-6 py-4 text-center">
            <Layout className="w-6 h-6 mx-auto mb-2" />
            <p className="font-semibold">Product</p>
            <p className="text-xs text-purple-100">Experience & Convert</p>
          </div>
        </div>

        <p className="text-center text-purple-200 text-sm mt-4">
          Prospects can enter at any point and progress naturally toward product usage
        </p>
      </div>

      {/* Optimisation Approach */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-600" />
          Continuous Optimisation
        </h3>
        <p className="text-gray-600 mb-4">
          Each channel will be refined through ongoing measurement and testing:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="font-semibold text-purple-700 mb-2">Website</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Page performance analytics</li>
              <li>• Heat mapping and scroll depth</li>
              <li>• Form completion rates</li>
              <li>• A/B testing of key pages</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="font-semibold text-teal-700 mb-2">Quiz</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Completion rates by question</li>
              <li>• Drop-off point analysis</li>
              <li>• Result-to-action conversion</li>
              <li>• Lead quality scoring</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="font-semibold text-amber-700 mb-2">Product</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• First-session behaviour</li>
              <li>• Feature adoption tracking</li>
              <li>• Upgrade trigger analysis</li>
              <li>• Churn point identification</li>
            </ul>
          </div>
        </div>
      </div>

      {/* SMART Targets Summary */}
      <div className="bg-gradient-to-r from-purple-100 to-teal-100 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-600" />
          SMART Conversion Targets (2026–2027)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { metric: "40%", desc: "Website traffic increase by Q4 2027" },
            { metric: "500+", desc: "Quiz completions by Q2 2027" },
            { metric: "5%", desc: "Website visitor-to-enquiry rate" },
            { metric: "30%", desc: "Quiz completion-to-lead rate" },
            { metric: "20%", desc: "Free-to-paid product conversion" },
            { metric: "60%", desc: "First-session success rate" }
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-lg p-3 shadow-sm text-center">
              <p className="text-xl font-bold text-purple-600">{item.metric}</p>
              <p className="text-xs text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gray-100 rounded-xl p-6 text-center">
        <p className="text-gray-700">
          These three channels—<span className="font-semibold text-purple-700">Website</span>, <span className="font-semibold text-teal-700">Quiz</span>, and <span className="font-semibold text-amber-700">Product</span>—form a connected conversion system that reduces friction, demonstrates value early, and supports a natural progression from curiosity to active use. Each channel will be optimised continuously based on user behaviour and conversion data.
        </p>
      </div>
    </div>
  );
};

export default PrimaryConversionChannelsVisual;
