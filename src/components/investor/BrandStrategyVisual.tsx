import React from "react";
import { Palette, Target, Eye, MessageSquare, Sparkles, Globe, CheckCircle, ArrowRight, Layers, Users, TrendingUp, Calendar, Linkedin, Search, Monitor, BarChart3 } from "lucide-react";

export const BrandStrategyVisual: React.FC = () => {
  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-teal-500/20 mb-4">
          <Palette className="w-8 h-8 text-purple-600" />
        </div>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Hobson's branding strategy focuses on presenting the product as a dependable, easy-to-use source of document clarity for real estate teams. The aim is to build early trust, maintain a consistent identity as the product matures, and support long-term commercial adoption through a transparent and stable brand framework.
        </p>
      </div>

      {/* Brand Essence */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Brand Essence
        </h3>
        <p className="text-purple-100 mb-4">
          Hobson's brand centres on one idea: <span className="font-semibold text-white">making information easier to work with</span>. All brand decisions—visual, verbal, and experiential—reinforce this idea by emphasising ease, reliability, and straightforward communication.
        </p>
      </div>

      {/* Visual Direction */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5 text-purple-600" />
          Visual Direction
        </h3>
        <p className="text-gray-600 mb-4">The visual identity is designed to make the product immediately understandable and easy to use.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-l-4 border-purple-500 pl-4">
            <p className="font-medium text-purple-700">Colour System</p>
            <p className="text-sm text-gray-600">A simple palette is used to ensure clarity, reduce visual noise, and create consistent recognition across channels.</p>
          </div>
          <div className="border-l-4 border-purple-400 pl-4">
            <p className="font-medium text-purple-700">Illustrated Elements (Owl Iconography)</p>
            <p className="text-sm text-gray-600">Illustration supports a friendly and recognisable identity without adding complexity. These elements appear lightly across product and marketing surfaces to provide continuity.</p>
          </div>
          <div className="border-l-4 border-amber-400 pl-4">
            <p className="font-medium text-amber-700">HUE Coin System</p>
            <p className="text-sm text-gray-600">Create a distinct brand asset that can scale into loyalty or rewards in future.</p>
          </div>
          <div className="border-l-4 border-teal-400 pl-4">
            <p className="font-medium text-teal-700">Interface Approach</p>
            <p className="text-sm text-gray-600">The product UI favours simplicity: minimal actions, clear outputs, and unobtrusive signposting. This reinforces Hobson's commitment to removing friction from document work.</p>
          </div>
        </div>
      </div>

      {/* Verbal Direction */}
      <div className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-teal-600" />
          Verbal Direction
        </h3>
        <p className="text-gray-600 mb-4">Hobson's voice emphasises clarity, straightforwardness, and helpfulness.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            "Be concise",
            "Explain technical concepts plainly",
            "Avoid exaggeration",
            "Focus on what the user gains in practical terms"
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-lg p-3 shadow-sm text-center">
              <CheckCircle className="w-4 h-4 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-gray-700">{item}</p>
            </div>
          ))}
        </div>
        <p className="text-gray-600 mt-4">
          The brand's messaging framework is organised around showing value through clarity, trust, ease, and usefulness. These themes inform all external communication, from the website to demos.
        </p>
      </div>

      {/* Experience & Interaction Approach */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          Experience & Interaction Approach
        </h3>
        <p className="text-gray-600 mb-4">Brand experience extends beyond visuals and language into how users interact with the product and marketing.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="font-semibold text-purple-700 mb-2">Lightweight Engagement Tools</p>
            <p className="text-sm text-gray-600">The quiz and similar assets create a soft entry point into the brand, helping users understand Hobson's value without heavy explanation.</p>
          </div>
          <div className="bg-teal-50 rounded-lg p-4">
            <p className="font-semibold text-teal-700 mb-2">Progression From First Use to Trust</p>
            <p className="text-sm text-gray-600">The experience aims to give users quick wins, followed by dependable performance, building confidence over repeated use.</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-4">
            <p className="font-semibold text-amber-700 mb-2">Trust Signals</p>
            <p className="text-sm text-gray-600">Clear referencing, transparent behaviour, and consistent communication form part of the brand experience, helping reduce hesitation around AI tools.</p>
          </div>
        </div>
      </div>

      {/* Internal Brand Alignment */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-purple-600" />
          Internal Brand Alignment
        </h3>
        <p className="text-gray-600 mb-4">Internally, the brand acts as a guide for decision-making. It encourages:</p>
        <div className="flex flex-wrap gap-3">
          {[
            "Simple solutions over complex ones",
            "Transparency in communication",
            "Prioritising user effort reduction"
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-lg px-4 py-2 shadow-sm">
              <p className="text-sm text-gray-700">{item}</p>
            </div>
          ))}
        </div>
        <p className="text-gray-600 mt-4">This internal consistency ensures the brand remains coherent as the organisation grows.</p>
      </div>

      {/* Long-Term Branding Direction */}
      <div className="bg-gradient-to-r from-purple-600 to-teal-600 rounded-xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Long-Term Branding Direction (2028–2030)
        </h3>
        <p className="text-purple-100 mb-4">
          As Hobson enters more markets and the product evolves beyond retrieval, the brand will shift from being seen as a helpful assistant to a broader intelligence layer for real estate operations.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            "Developing a stronger narrative through real user stories",
            "Expanding the HUE concept into a wider engagement system",
            "Building a more visible presence across industry communities",
            "Maturing support and documentation to match enterprise expectations"
          ].map((item, index) => (
            <div key={index} className="bg-white/10 rounded-lg p-3 flex items-start gap-2">
              <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{item}</p>
            </div>
          ))}
        </div>
        <p className="text-white font-semibold mt-4 text-center">
          The goal is for Hobson to become a recognised standard for document intelligence.
        </p>
      </div>

      {/* SMART Branding Objectives */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-600" />
          SMART Branding Objectives (2026–2028 Timeline)
        </h3>
        
        {/* Phase 1 */}
        <div className="mb-6">
          <div className="bg-purple-100 rounded-lg p-3 mb-3">
            <h4 className="font-semibold text-purple-800">1. Strengthen Brand Foundations During the Pilot Phase (By Q4 2026)</h4>
          </div>
          <ul className="space-y-2 ml-4">
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Achieve consistent use of all core brand assets across every channel by Q4 2026, including tone, colour system, metaphors, messaging blocks, and visual identity.</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Publish at least three UK-based pilot case studies and two thought-leadership pieces by Q4 2026, establishing credibility ahead of the 2027 commercial launch.</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Record measurable improvements in positive brand associations—clarity, reliability, and ease of use—through structured user feedback by mid-2026.</span>
            </li>
          </ul>
        </div>

        {/* Phase 2 */}
        <div className="mb-6">
          <div className="bg-teal-100 rounded-lg p-3 mb-3">
            <h4 className="font-semibold text-teal-800">2. Scale Brand Awareness for the Commercial Launch (By Q4 2027)</h4>
          </div>
          <ul className="space-y-2 ml-4">
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Improve brand awareness among UK property professionals by 60% by Q4 2027, using LinkedIn analytics, branded search volume, website sessions, and quiz completions as indicators.</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Strengthen recognition of Hobson's brand archetype (Sage: calm, intelligent, trustworthy) through consistent messaging across product, website, and social channels.</span>
            </li>
          </ul>
        </div>

        {/* Phase 3 */}
        <div>
          <div className="bg-amber-100 rounded-lg p-3 mb-3">
            <h4 className="font-semibold text-amber-800">3. International Brand Readiness (2028+)</h4>
          </div>
          <ul className="space-y-2 ml-4">
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Prepare brand assets and messaging frameworks for localisation in Hobson's first two international markets (EU/US) beginning in 2028.</span>
            </li>
          </ul>
        </div>

        <div className="mt-6 bg-gray-100 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-700 font-medium">
            These objectives ensure Hobson's brand develops in three straightforward steps: <span className="text-purple-700">Foundation in 2026</span>, <span className="text-teal-700">Awareness and authority in 2027</span>, and <span className="text-amber-700">international consistency from 2028 onward</span>.
          </p>
        </div>
      </div>

      {/* Online Presence Section */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Online Presence
        </h3>
        <p className="text-teal-100 mb-6">
          Hobson's online presence is intentionally limited at this stage. The focus is on credibility, controlled exposure, and preparing the foundations for a scalable digital footprint once the product is ready for broader adoption.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Website */}
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Monitor className="w-5 h-5 text-purple-200" />
              <p className="font-semibold">A. Website (hobsonschoice.ai)</p>
            </div>
            <p className="text-sm text-teal-100 mb-3">The website operates as the central source of information about Hobson. It provides a simple explanation of the product, a consistent visual identity, and an initial base for search visibility.</p>
            <ul className="space-y-1 text-sm text-teal-200">
              <li>• Introducing Hobson's purpose</li>
              <li>• Directing users to early materials such as the quiz</li>
              <li>• Supporting SEO indexing for future content</li>
              <li>• Serving as a reference point for partners and investors</li>
            </ul>
          </div>

          {/* Product Presence */}
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-5 h-5 text-amber-200" />
              <p className="font-semibold">B. Product Presence (MVP Access Only)</p>
            </div>
            <p className="text-sm text-teal-100">Hobson is currently available only to selected pilot users. The online product environment reflects this controlled stage: a minimalist interface, steady iteration, and limited external visibility.</p>
            <p className="text-sm text-teal-200 mt-2">This approach allows the team to refine accuracy, gather feedback, and validate workflows without broad market exposure.</p>
          </div>

          {/* Social Presence */}
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Linkedin className="w-5 h-5 text-blue-200" />
              <p className="font-semibold">C. Social Presence (LinkedIn)</p>
            </div>
            <p className="text-sm text-teal-100">LinkedIn is currently Hobson's primary public channel, used for sharing updates, simple insights, and early brand signalling. Engagement is modest but aligned with the validation phase.</p>
            <p className="text-sm text-teal-200 mt-2">The platform will gradually grow into a consistent stream of educational and trust-building content as the product becomes more widely available.</p>
          </div>

          {/* Search Presence */}
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Search className="w-5 h-5 text-rose-200" />
              <p className="font-semibold">D. Search Presence (SEO and AI Discovery)</p>
            </div>
            <p className="text-sm text-teal-100">The current site is optimised for indexing, clear metadata, and structured copy so that both search engines and AI crawlers can interpret content effectively. This positions Hobson for visibility as natural-language search becomes more common.</p>
          </div>
        </div>

        {/* Non-Presence */}
        <div className="mt-4 bg-white/10 rounded-lg p-4">
          <p className="font-semibold text-white mb-2">E. Deliberate Non-Presence in Other Channels</p>
          <p className="text-sm text-teal-200">At this stage there are no newsletters, communities, paid campaigns, or additional social channels. This is intentional—to avoid premature scaling, manage expectations, and keep focus on validating product performance before increasing reach.</p>
        </div>

        {/* Consistency */}
        <div className="mt-4 bg-white/10 rounded-lg p-4">
          <p className="font-semibold text-white mb-2">F. Consistency Across Touchpoints</p>
          <p className="text-sm text-teal-200">All existing digital touchpoints show a unified look and feel, ensuring early recognition. As the ecosystem expands, this consistency will support clearer user journeys and smoother conversion paths.</p>
        </div>
      </div>

      {/* SMART Objectives for Online Presence */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-600" />
          G. SMART Objectives for Online Presence (2026–2028 Timeline)
        </h3>
        
        {/* Phase 1 */}
        <div className="mb-6">
          <div className="bg-purple-100 rounded-lg p-3 mb-3">
            <h4 className="font-semibold text-purple-800">1. Build a Strong and Credible Online Foundation (By Q4 2026)</h4>
          </div>
          <ul className="space-y-2 ml-4">
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Increase website traffic by 40% by Q4 2026 through expanded educational content, LinkedIn distribution, and targeted SEO.</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Achieve an average dwell time of 2+ minutes by Q4 2026, reflecting improved clarity, better product explanation, and role-specific pages.</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Publish 10 high-quality educational pieces by Q4 2026 (guides, explainers, demos), strengthening authority and improving organic discovery ahead of the 2027 launch.</span>
            </li>
          </ul>
        </div>

        {/* Phase 2 */}
        <div className="mb-6">
          <div className="bg-teal-100 rounded-lg p-3 mb-3">
            <h4 className="font-semibold text-teal-800">2. Expand Digital Reach for the Commercial Launch (Q1–Q2 2027)</h4>
          </div>
          <ul className="space-y-2 ml-4">
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Launch at least two new online channels by Q1 2027 (newsletter, YouTube demo series, or a resource community) to support scaled communication.</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Grow Hobson's LinkedIn audience to 1,000 followers by Q1 2027, ensuring a warm and engaged audience for launch announcements.</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Prepare the full public-facing online presence by Q2 2027, including: feature pages, pricing pages, sign-up flows, and onboarding content. This aligns directly with the commercial rollout.</span>
            </li>
          </ul>
        </div>

        {/* Phase 3 */}
        <div>
          <div className="bg-amber-100 rounded-lg p-3 mb-3">
            <h4 className="font-semibold text-amber-800">3. Online Presence Expansion for Global Scale (2028+)</h4>
          </div>
          <ul className="space-y-2 ml-4">
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Localise web content, educational assets, and messaging for the first two international markets as Hobson expands globally from 2028 onwards.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Timeline Summary */}
      <div className="bg-gradient-to-r from-purple-600 via-teal-600 to-amber-600 rounded-xl p-6 text-white text-center">
        <h3 className="text-lg font-semibold mb-4">Brand Development Timeline</h3>
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <div className="bg-white/20 rounded-lg px-6 py-3">
            <p className="text-2xl font-bold">2026</p>
            <p className="text-sm text-white/80">Builds the Foundation</p>
          </div>
          <ArrowRight className="w-6 h-6 hidden md:block" />
          <div className="bg-white/20 rounded-lg px-6 py-3">
            <p className="text-2xl font-bold">2027</p>
            <p className="text-sm text-white/80">Scales Visibility + Conversion</p>
          </div>
          <ArrowRight className="w-6 h-6 hidden md:block" />
          <div className="bg-white/20 rounded-lg px-6 py-3">
            <p className="text-2xl font-bold">2028</p>
            <p className="text-sm text-white/80">Prepares Global Readiness</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandStrategyVisual;
