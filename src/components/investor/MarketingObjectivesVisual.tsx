import React from "react";
import { Target, TrendingUp, Users, Megaphone, Award, CheckCircle, ArrowRight } from "lucide-react";

const objectives = [
  {
    category: "Awareness Objectives",
    icon: Megaphone,
    color: "bg-purple-500",
    items: [
      {
        objective: "Establish Hobson as the trusted AI assistant for UK real estate professionals",
        metric: "Brand awareness among target audience",
        target: "30% aided awareness by Q4 2027",
        timeline: "2026-2027"
      },
      {
        objective: "Build thought leadership position in AI-powered property intelligence",
        metric: "LinkedIn followers & engagement rate",
        target: "5,000 followers, 5% engagement rate",
        timeline: "Q4 2026"
      },
      {
        objective: "Generate qualified awareness through educational content",
        metric: "Content downloads & webinar attendees",
        target: "500+ qualified contacts by Q4 2026",
        timeline: "2026"
      }
    ]
  },
  {
    category: "Acquisition Objectives",
    icon: Users,
    color: "bg-teal-500",
    items: [
      {
        objective: "Convert pilot partners to paying customers",
        metric: "Pilot-to-paid conversion rate",
        target: "60% conversion rate",
        timeline: "Q1-Q2 2027"
      },
      {
        objective: "Establish predictable customer acquisition funnel",
        metric: "Marketing Qualified Leads (MQLs)",
        target: "100 MQLs per month by Q4 2027",
        timeline: "2027"
      },
      {
        objective: "Reduce Customer Acquisition Cost through organic channels",
        metric: "CAC ratio (paid vs organic)",
        target: "40% organic acquisition",
        timeline: "2027"
      }
    ]
  },
  {
    category: "Engagement Objectives",
    icon: TrendingUp,
    color: "bg-amber-500",
    items: [
      {
        objective: "Drive consistent platform usage among active users",
        metric: "Weekly Active Users (WAU)",
        target: "70% WAU among paying customers",
        timeline: "2027"
      },
      {
        objective: "Build community engagement through Hobson Choice quiz",
        metric: "Quiz completions & shares",
        target: "1,000 quiz completions by Q4 2026",
        timeline: "2026"
      },
      {
        objective: "Increase user advocacy and referrals",
        metric: "Net Promoter Score (NPS)",
        target: "NPS of 50+",
        timeline: "Q4 2027"
      }
    ]
  },
  {
    category: "Revenue Objectives",
    icon: Award,
    color: "bg-emerald-500",
    items: [
      {
        objective: "Achieve first commercial revenue milestone",
        metric: "Monthly Recurring Revenue (MRR)",
        target: "£50K MRR by Q4 2027",
        timeline: "2027"
      },
      {
        objective: "Establish enterprise tier adoption",
        metric: "Enterprise customer count",
        target: "5+ enterprise customers",
        timeline: "Q4 2027"
      },
      {
        objective: "Build foundation for international expansion",
        metric: "UK market penetration",
        target: "1% of addressable UK market",
        timeline: "2027"
      }
    ]
  }
];

const smartFramework = [
  { letter: "S", word: "Specific", description: "Clear, unambiguous targets tied to business outcomes" },
  { letter: "M", word: "Measurable", description: "Quantifiable metrics with defined tracking methods" },
  { letter: "A", word: "Achievable", description: "Realistic given resources, market conditions, and timeline" },
  { letter: "R", word: "Relevant", description: "Aligned with overall business strategy and growth phase" },
  { letter: "T", word: "Time-bound", description: "Specific deadlines linked to product and commercial milestones" }
];

export const MarketingObjectivesVisual: React.FC = () => {
  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-teal-500/20 mb-4">
          <Target className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Marketing Objectives</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          SMART objectives aligned to Hobson's phased growth strategy, supporting the journey from 
          pilot validation through commercial launch and international expansion.
        </p>
      </div>

      {/* SMART Framework */}
      <div className="bg-gradient-to-r from-purple-50 to-teal-50 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">SMART Framework</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {smartFramework.map((item, index) => (
            <div key={index} className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-sm">
              <span className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-sm">
                {item.letter}
              </span>
              <div>
                <span className="font-semibold text-gray-900">{item.word}</span>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Objectives Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {objectives.map((category, catIndex) => {
          const IconComponent = category.icon;
          return (
            <div key={catIndex} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              {/* Category Header */}
              <div className={`${category.color} px-4 py-3 flex items-center gap-3`}>
                <IconComponent className="w-5 h-5 text-white" />
                <h3 className="font-semibold text-white">{category.category}</h3>
              </div>
              
              {/* Objectives List */}
              <div className="p-4 space-y-4">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="border-l-3 border-gray-200 pl-4 hover:border-purple-400 transition-colors">
                    <div className="flex items-start gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm font-medium text-gray-900">{item.objective}</p>
                    </div>
                    <div className="ml-6 space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-500">Metric:</span>
                        <span className="text-gray-700">{item.metric}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-500">Target:</span>
                        <span className="font-semibold text-purple-600">{item.target}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-500">Timeline:</span>
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">{item.timeline}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Timeline Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Objective Timeline Summary</h3>
        <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2">
          <div className="flex-1 min-w-[200px] text-center">
            <div className="bg-amber-100 rounded-lg p-4 mb-2">
              <p className="font-semibold text-amber-700">2026</p>
              <p className="text-xs text-amber-600">Validation Phase</p>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Brand awareness foundation</li>
              <li>• 500+ qualified contacts</li>
              <li>• Quiz engagement launch</li>
            </ul>
          </div>
          <ArrowRight className="w-6 h-6 text-gray-300 flex-shrink-0" />
          <div className="flex-1 min-w-[200px] text-center">
            <div className="bg-teal-100 rounded-lg p-4 mb-2">
              <p className="font-semibold text-teal-700">2027</p>
              <p className="text-xs text-teal-600">Commercial Launch</p>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• 60% pilot conversion</li>
              <li>• £50K MRR target</li>
              <li>• NPS 50+ achieved</li>
            </ul>
          </div>
          <ArrowRight className="w-6 h-6 text-gray-300 flex-shrink-0" />
          <div className="flex-1 min-w-[200px] text-center">
            <div className="bg-purple-100 rounded-lg p-4 mb-2">
              <p className="font-semibold text-purple-700">2028+</p>
              <p className="text-xs text-purple-600">Global Expansion</p>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• International presence</li>
              <li>• Category leadership</li>
              <li>• Scaled acquisition</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Key Success Factors */}
      <div className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Success Factors</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-3">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-1">Consistent Messaging</h4>
            <p className="text-xs text-gray-600">Maintain Sage brand voice across all touchpoints</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5 text-teal-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-1">Data-Driven Iteration</h4>
            <p className="text-xs text-gray-600">Weekly review of metrics with rapid optimisation cycles</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mb-3">
              <Users className="w-5 h-5 text-amber-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-1">Customer-Centric Focus</h4>
            <p className="text-xs text-gray-600">All objectives tied to solving real user pain points</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingObjectivesVisual;
