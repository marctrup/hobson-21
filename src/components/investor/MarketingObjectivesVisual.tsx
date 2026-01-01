import React from "react";
import { Target, TrendingUp, Users, Eye, Heart, Repeat, MessageSquare, Globe, CheckCircle, ArrowRight, BarChart3, Megaphone, Mail, Linkedin, MousePointer } from "lucide-react";

const smartObjectives = [
  {
    stage: "Awareness",
    icon: Eye,
    color: "bg-purple-100",
    textColor: "text-purple-800",
    iconColor: "text-purple-600",
    description: "Build through 2026 to scale in 2027 and expand in 2028",
    objectives: [
      "Increase visibility among UK real estate professionals ahead of and during pilot expansion (2026)",
      "Drive consistent top-of-funnel traffic using clarity-based educational content",
      "Strengthen brand recall using distinctive digital assets (owl, HUE, metaphors, clarity style)"
    ],
    metrics: "Website sessions, quiz completions, LinkedIn impressions & engagement, brand recall survey signals and awareness coefficient",
    targets: [
      { value: "500", label: "monthly website visits by Q1 2027" },
      { value: "1,000+", label: "quiz completions by Q2 2027" },
      { value: "200k+", label: "LinkedIn impressions per quarter by Q4 2027" }
    ]
  },
  {
    stage: "Consideration",
    icon: Target,
    color: "bg-teal-100",
    textColor: "text-teal-800",
    iconColor: "text-teal-600",
    description: "2026-2027",
    objectives: [
      "Turn awareness into informed interest through more precise product explanations",
      "Support evaluation with demos, walkthroughs, retargeting, and repeated exposure",
      "Build confidence in Hobson's reliability, accuracy, and referencing approach"
    ],
    metrics: "Demo requests, time on product pages, lead magnet downloads, retargeting CTR and consideration coefficient",
    targets: [
      { value: "50", label: "demo requests by Q1 2027" },
      { value: "1/month", label: "educational asset release throughout 2026-2027" },
      { value: ">3%", label: "retargeting CTR by Q4 2027" }
    ]
  },
  {
    stage: "Conversion",
    icon: TrendingUp,
    color: "bg-amber-100",
    textColor: "text-amber-800",
    iconColor: "text-amber-600",
    description: "Pilot conversion throughout 2026, extending to paid expansion in 2027",
    objectives: [
      "Convert interested organisations into active pilots during 2026",
      "Reduce activation friction (first upload → first question)",
      "Demonstrate commercial value through pilot outcomes ahead of 2027 launch"
    ],
    metrics: "New pilot sign-ups, activation rate (upload + first question), pilot-to-paid conversion, early ARR and sales coefficient",
    targets: [
      { value: "5", label: "new pilots by Q2 2026" },
      { value: "60%+", label: "activation within 14 days" },
      { value: "£50k-£100k", label: "MRR by Q4 2027" },
      { value: "≥20%", label: "conversion rate post-launch" }
    ]
  },
  {
    stage: "Retention & Advocacy",
    icon: Heart,
    color: "bg-rose-100",
    textColor: "text-rose-800",
    iconColor: "text-rose-600",
    description: "Foundational in 2026, strengthen in 2027, scale in 2028",
    objectives: [
      "Build strong user loyalty throughout the 2026 pilot phase",
      "Encourage advocacy from high-satisfaction teams",
      "Maintain clear and consistent communication across accounts as usage scales"
    ],
    metrics: "Satisfaction score (CSAT), Net Promoter Score (NPS), retention rate, weekly active usage, testimonials, case studies and liking coefficient",
    targets: [
      { value: "80%+", label: "satisfaction by Q4 2026" },
      { value: "NPS > 50", label: "by Q4 2026" },
      { value: "80%+", label: "retention by Q4 2027" },
      { value: "9+", label: "case studies by Q4 2027" }
    ]
  }
];

const channelMetricsTable = [
  { area: "Acquisition", channels: "LinkedIn, Website", metrics: "Impressions, Sessions", benefit: "Builds visibility; ensures Hobson is known before launch" },
  { area: "Lead Generation", channels: "Website, Quiz, Retargeting", metrics: "Demo requests, Quiz sign-ups", benefit: "Creates a pipeline for pilot onboarding" },
  { area: "Engagement", channels: "Quiz, LinkedIn content", metrics: "Engagement rate, Dwell time", benefit: "Strengthens \"Liking\" and brand connection" },
  { area: "Conversion", channels: "Retargeting, Email", metrics: "CTR, Demo completions, Activation rate", benefit: "Turns interest into pilots and future paying customers" },
  { area: "Development", channels: "Email onboarding, Support", metrics: "CSAT, activation metrics", benefit: "Improves early experience and builds trust" },
  { area: "Growth", channels: "Advocacy, Testimonials", metrics: "NPS, case studies", benefit: "Builds long-term brand equity and lowers acquisition cost" }
];

const broadGoals = [
  "Build early awareness and credibility among UK real estate professionals",
  "Move prospects through key attitude stages: Awareness → Consideration → Liking → Conversion",
  "Generate a predictable pipeline for pilot onboarding and later commercial conversion",
  "Strengthen brand trust through repeated exposure, thought leadership, and proof-based storytelling",
  "Ensure users experience Hobson's value quickly so they become long-term advocates"
];

export const MarketingObjectivesVisual: React.FC = () => {
  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-teal-500/20 mb-4">
          <Target className="w-8 h-8 text-purple-600" />
        </div>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Aligned with the 2026-2028 timeline, Hobson's marketing objectives define the outcomes needed to progress 
          from MVP validation to a scalable commercial presence. They focus on measurable growth across awareness, 
          consideration, conversion, retention, and advocacy, fully synchronised with the product and business timelines.
        </p>
      </div>

      {/* Top-Level Marketing Goals */}
      <div className="bg-gradient-to-r from-purple-50 to-teal-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-purple-600" />
          Top-Level Marketing Goals
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-700">Increase visibility across the UK real estate sector as the MVP moves into pilot expansion during 2026</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-700">Build credibility through evidence, pilot success stories, and trustworthy product education</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-700">Establish a predictable acquisition and activation funnel in preparation for the 2027 public launch</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-700">Support long-term adoption with consistent engagement and communication across all customer segments</p>
          </div>
        </div>
      </div>

      {/* Mid- to Long-Term Direction Timeline */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-teal-600" />
          Mid- to Long-Term Direction
        </h3>
        <div className="flex items-stretch justify-between gap-4 overflow-x-auto pb-2">
          <div className="flex-1 min-w-[220px]">
            <div className="bg-amber-100 rounded-lg p-4 h-full">
              <p className="font-semibold text-amber-700 mb-2">By Q4 2026</p>
              <p className="text-sm text-amber-800">Marketing should show strong early awareness, predictable interest in pilots, and growing engagement with educational content.</p>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 text-gray-300 flex-shrink-0 self-center" />
          <div className="flex-1 min-w-[220px]">
            <div className="bg-teal-100 rounded-lg p-4 h-full">
              <p className="font-semibold text-teal-700 mb-2">By Q4 2027</p>
              <p className="text-sm text-teal-800">Hobson should operate a scalable acquisition engine with mature digital channels, predictable lead flow, and clear conversion pathways following the public launch.</p>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 text-gray-300 flex-shrink-0 self-center" />
          <div className="flex-1 min-w-[220px]">
            <div className="bg-purple-100 rounded-lg p-4 h-full">
              <p className="font-semibold text-purple-700 mb-2">By 2028</p>
              <p className="text-sm text-purple-800">Marketing expands into two international regions and supports globalised demand, localisation, and partnerships.</p>
            </div>
          </div>
        </div>
      </div>

      {/* SMART Marketing Objectives by Journey Stage */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-600" />
          SMART Marketing Objectives (By Journey Stage)
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {smartObjectives.map((stage, index) => {
            const IconComponent = stage.icon;
            return (
              <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className={`${stage.color} px-4 py-3 flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <IconComponent className={`w-5 h-5 ${stage.iconColor}`} />
                    <h4 className={`font-semibold ${stage.textColor}`}>{stage.stage}</h4>
                  </div>
                  <span className={`text-xs ${stage.textColor} bg-white/50 px-2 py-1 rounded`}>{stage.description}</span>
                </div>
                
                <div className="p-4 space-y-4">
                  {/* Objectives */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-2">Objectives</p>
                    <ul className="space-y-2">
                      {stage.objectives.map((obj, objIndex) => (
                        <li key={objIndex} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Key Metrics */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Key Metrics</p>
                    <p className="text-sm text-gray-600">{stage.metrics}</p>
                  </div>

                  {/* Target Values */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-2">Target Values</p>
                    <div className="flex flex-wrap gap-2">
                      {stage.targets.map((target, targetIndex) => (
                        <div key={targetIndex} className="bg-purple-50 border border-purple-100 rounded-lg px-3 py-2">
                          <span className="font-bold text-purple-700">{target.value}</span>
                          <span className="text-xs text-purple-600 ml-1">{target.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* How This Framework Supports Strategy */}
      <div className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">How This Objective Framework Supports the Strategy</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            "Builds early visibility before the 2027 launch",
            "Guides prospects into precise, structured evaluation",
            "Supports conversion and commercial validation throughout 2026",
            "Strengthens long-term retention and advocacy as Hobson scales",
            "Creates a predictable funnel ready for UK expansion in 2027",
            "Enables international expansion from 2028 onward"
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-2 bg-white rounded-lg p-3 shadow-sm">
              <ArrowRight className="w-4 h-4 text-purple-500 flex-shrink-0" />
              <span className="text-sm text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Channel and Metric Justification */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <MousePointer className="w-5 h-5 text-teal-600" />
          Channel and Metric Justification
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Hobson's channel strategy has been selected to support both immediate MVP needs and long-term commercial ambitions. 
          Each channel contributes to Hobson's broad goals of building trust, increasing visibility, validating demand, 
          and creating a scalable acquisition engine.
        </p>

        {/* Broad Goals */}
        <div className="bg-teal-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-teal-800 mb-3">Top-Level Broad Goals Supported by Channel Strategy</h4>
          <ul className="space-y-2">
            {broadGoals.map((goal, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-teal-700">
                <CheckCircle className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                <span>{goal}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Channel Evolution */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Mid- to Long-Term Vision Supported by Channel Strategy</h4>
          <div className="space-y-3">
            <div className="border-l-4 border-amber-400 pl-4">
              <p className="font-medium text-amber-700">2026 MVP Validation & Pilot Growth</p>
              <p className="text-sm text-gray-600">Channels focus on education, clarity, and trust-building. Content-led channels (LinkedIn, website, knowledge hub, email) support pilot acquisition and early engagement.</p>
            </div>
            <div className="border-l-4 border-teal-400 pl-4">
              <p className="font-medium text-teal-700">2026-2027 Commercial Readiness</p>
              <p className="text-sm text-gray-600">Channels shift toward a predictable digital acquisition funnel. SEO, targeted LinkedIn activity, retargeting flows, email nurture, and structured content work together to build demand.</p>
            </div>
            <div className="border-l-4 border-purple-400 pl-4">
              <p className="font-medium text-purple-700">2027 and Beyond – Scale</p>
              <p className="text-sm text-gray-600">Channels evolve to support broader market reach and international expansion using YouTube, partnerships, regionalised content, and paid acquisition.</p>
            </div>
          </div>
        </div>

        {/* Channel Metrics Table */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">How Channels & Metrics Support Key Digital Strategy Areas</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left px-4 py-2 font-medium text-gray-700">Digital Strategy Area</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-700">Supporting Channels</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-700">Supporting Metrics</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-700">How It Benefits Hobson</th>
                </tr>
              </thead>
              <tbody>
                {channelMetricsTable.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-3 font-medium text-purple-700">{row.area}</td>
                    <td className="px-4 py-3 text-gray-600">{row.channels}</td>
                    <td className="px-4 py-3 text-gray-600">{row.metrics}</td>
                    <td className="px-4 py-3 text-gray-600">{row.benefit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Alignment Summary */}
      <div className="bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 text-purple-800">Channel & Metric Alignment</h3>
        <p className="text-purple-700 mb-4">Hobson's channel and metric choices are tightly aligned to:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            "Organisational goals",
            "Long-term vision",
            "Mindset-first marketing approach",
            "Commercial objectives for 2026-2027"
          ].map((item, index) => (
            <div key={index} className="bg-white/80 rounded-lg p-3 text-center border border-purple-200">
              <p className="text-sm text-gray-700">{item}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-purple-600 mt-4 text-center">
          Each channel has been selected because it directly contributes to measurable progress across acquisition, 
          consideration, conversion, retention, and advocacy — ensuring Hobson builds both short-term traction and long-term competitive advantage.
        </p>
      </div>
    </div>
  );
};

export default MarketingObjectivesVisual;
