import React from "react";
import { Palette, Target, Users, MessageSquare, Sparkles, Shield, Heart, Zap, Globe, CheckCircle, ArrowRight, Eye } from "lucide-react";

const brandPillars = [
  {
    title: "Clarity",
    icon: Eye,
    color: "bg-purple-500",
    description: "Every interaction should reduce confusion and deliver instant understanding",
    elements: [
      "Referenced answers that can be verified",
      "Simple, jargon-free language",
      "Transparent pricing and processes"
    ]
  },
  {
    title: "Trust",
    icon: Shield,
    color: "bg-teal-500",
    description: "Build confidence through honesty, accuracy, and reliability",
    elements: [
      "Never overstate capabilities",
      "Acknowledge limitations openly",
      "Consistent delivery on promises"
    ]
  },
  {
    title: "Simplicity",
    icon: Zap,
    color: "bg-amber-500",
    description: "Remove friction at every touchpoint - innovation without disruption",
    elements: [
      "Zero-onboarding experience",
      "Works alongside existing tools",
      "Intuitive, clean interface"
    ]
  },
  {
    title: "Accessibility",
    icon: Users,
    color: "bg-rose-500",
    description: "AI intelligence available to every real estate operator, regardless of size",
    elements: [
      "Affordable pricing tiers",
      "No technical expertise required",
      "Scales with business needs"
    ]
  }
];

const brandPersonality = [
  { trait: "Calm", description: "Quiet confidence, never pushy or aggressive" },
  { trait: "Knowledgeable", description: "Deep expertise delivered with humility" },
  { trait: "Helpful", description: "Genuinely focused on solving problems" },
  { trait: "Honest", description: "Transparent about what we can and cannot do" },
  { trait: "Friendly", description: "Approachable and easy to work with" }
];

const visualIdentity = {
  owl: "The owl mascot embodies wisdom, observation, and guidance - watching over your documents to deliver clarity",
  purple: "Purple signifies insight, innovation, and clear thinking - setting Hobson apart from traditional PropTech",
  hue: "Hobson Energy Units (HUEs) create transparency in usage and provide a gamified engagement layer"
};

const brandVoice = [
  { principle: "Explain, Don't Sell", example: "We help you find answers in your documents -> not 'revolutionary AI transforms your business'" },
  { principle: "Be Specific", example: "Answers include page references -> not 'smart document analysis'" },
  { principle: "Stay Humble", example: "We're still learning -> not 'the ultimate solution'" },
  { principle: "Focus on Outcomes", example: "Save 2 hours per week on document search -> not 'cutting-edge technology'" }
];

const positioning = {
  tagline: "Innovation Without Disruption",
  archetype: "The Sage",
  promise: "Instant, referenced answers from your property documents",
  differentiation: "The only AI built specifically for real estate document intelligence"
};

export const BrandStrategyVisual: React.FC = () => {
  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-teal-500/20 mb-4">
          <Palette className="w-8 h-8 text-purple-600" />
        </div>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Hobson's brand strategy is built on authenticity, clarity, and trust. Every touchpoint reinforces 
          our position as the calm, intelligent guide that brings clarity to document chaos - without 
          disruption, hype, or complexity.
        </p>
      </div>

      {/* Brand Positioning */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Brand Positioning
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-purple-200 text-xs uppercase mb-1">Tagline</p>
            <p className="font-semibold">{positioning.tagline}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-purple-200 text-xs uppercase mb-1">Archetype</p>
            <p className="font-semibold">{positioning.archetype}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 md:col-span-2">
            <p className="text-purple-200 text-xs uppercase mb-1">Brand Promise</p>
            <p className="font-semibold">{positioning.promise}</p>
          </div>
        </div>
        <div className="mt-4 bg-white/10 rounded-lg p-4">
          <p className="text-purple-200 text-xs uppercase mb-1">Key Differentiation</p>
          <p className="font-semibold">{positioning.differentiation}</p>
        </div>
      </div>

      {/* Brand Pillars */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          Brand Pillars
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {brandPillars.map((pillar, index) => {
            const IconComponent = pillar.icon;
            return (
              <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className={`${pillar.color} px-4 py-3 flex items-center gap-3`}>
                  <IconComponent className="w-5 h-5 text-white" />
                  <h4 className="font-semibold text-white">{pillar.title}</h4>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-3">{pillar.description}</p>
                  <ul className="space-y-2">
                    {pillar.elements.map((element, elemIndex) => (
                      <li key={elemIndex} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{element}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Brand Personality */}
      <div className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500" />
          Brand Personality
        </h3>
        <div className="flex flex-wrap gap-3">
          {brandPersonality.map((item, index) => (
            <div key={index} className="bg-white rounded-lg p-4 shadow-sm flex-1 min-w-[180px]">
              <p className="font-semibold text-purple-700 mb-1">{item.trait}</p>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Identity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5 text-purple-600" />
          Visual Identity Elements
        </h3>
        <div className="space-y-4">
          <div className="border-l-4 border-purple-500 pl-4">
            <p className="font-medium text-purple-700">The Owl Mascot</p>
            <p className="text-sm text-gray-600">{visualIdentity.owl}</p>
          </div>
          <div className="border-l-4 border-purple-400 pl-4">
            <p className="font-medium text-purple-700">Purple Palette</p>
            <p className="text-sm text-gray-600">{visualIdentity.purple}</p>
          </div>
          <div className="border-l-4 border-amber-400 pl-4">
            <p className="font-medium text-amber-700">HUE System</p>
            <p className="text-sm text-gray-600">{visualIdentity.hue}</p>
          </div>
        </div>
      </div>

      {/* Brand Voice */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-teal-600" />
          Brand Voice Principles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {brandVoice.map((item, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <p className="font-semibold text-gray-900 mb-2">{item.principle}</p>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-green-600 font-medium">Do:</span>
                <span className="text-gray-600">{item.example.split(' -> ')[0]}</span>
              </div>
              <div className="flex items-center gap-2 text-sm mt-1">
                <span className="text-red-500 font-medium">Avoid:</span>
                <span className="text-gray-400">{item.example.split(' -> ')[1]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Brand Metaphors */}
      <div className="bg-teal-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Core Brand Metaphors</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="font-semibold text-teal-700 mb-2">GPS for Documents</p>
            <p className="text-sm text-gray-600">Hobson guides you directly to the information you need, just like GPS guides you to your destination.</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="font-semibold text-teal-700 mb-2">Desk Lamp of Truth</p>
            <p className="text-sm text-gray-600">Hobson illuminates what's in your documents, shining light on hidden details and forgotten clauses.</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="font-semibold text-teal-700 mb-2">Wise Owl Advisor</p>
            <p className="text-sm text-gray-600">Like an owl watching over your portfolio, Hobson observes, understands, and offers guidance when needed.</p>
          </div>
        </div>
      </div>

      {/* Strategic Application */}
      <div className="bg-purple-600 rounded-xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Strategic Application
        </h3>
        <p className="text-purple-100 mb-4">
          Every brand touchpoint should reinforce Hobson's core positioning as the calm, trustworthy AI that brings clarity without disruption:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            "Website messaging",
            "Product interface",
            "Sales conversations",
            "Customer support"
          ].map((item, index) => (
            <div key={index} className="bg-white/10 rounded-lg p-3 text-center">
              <p className="text-sm text-white">{item}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-purple-200 mt-4 text-center">
          Consistency across all channels builds the trust and recognition that drives long-term brand equity.
        </p>
      </div>
    </div>
  );
};

export default BrandStrategyVisual;
