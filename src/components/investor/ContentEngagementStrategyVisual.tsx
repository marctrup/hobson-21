import React from "react";
import { FileText, Video, Users, MessageSquare, Calendar, Target, TrendingUp, CheckCircle, ArrowRight, BookOpen, Mic, Award, BarChart3, Sparkles } from "lucide-react";

export const ContentEngagementStrategyVisual: React.FC = () => {
  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-teal-500/20 mb-4">
          <FileText className="w-8 h-8 text-purple-600" />
        </div>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Hobson's content and engagement strategy is designed to build awareness, educate the market, and generate trust through consistent, high-value communication across carefully selected channels.
        </p>
      </div>

      {/* Content Pillars */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Content Pillars
        </h3>
        <p className="text-purple-100 mb-4">
          All content is organised around four core themes that reinforce Hobson's brand positioning and address key audience needs:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Education", desc: "Demystifying AI and document intelligence for property professionals" },
            { title: "Proof", desc: "Case studies, testimonials, and measurable results from pilot users" },
            { title: "Thought Leadership", desc: "Industry insights and forward-looking perspectives on PropTech" },
            { title: "Product Value", desc: "Clear demonstrations of how Hobson solves real problems" }
          ].map((pillar, index) => (
            <div key={index} className="bg-white/10 rounded-lg p-4">
              <p className="font-semibold mb-2">{pillar.title}</p>
              <p className="text-sm text-purple-100">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Content Types */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-600" />
          Content Types & Formats
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border-l-4 border-purple-500 pl-4">
            <p className="font-medium text-purple-700 mb-2">Written Content</p>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Blog articles and guides</li>
              <li>• Case studies</li>
              <li>• White papers</li>
              <li>• LinkedIn posts</li>
            </ul>
          </div>
          <div className="border-l-4 border-teal-500 pl-4">
            <p className="font-medium text-teal-700 mb-2">Video Content</p>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Product demos</li>
              <li>• Explainer videos</li>
              <li>• User testimonials</li>
              <li>• Tutorial walkthroughs</li>
            </ul>
          </div>
          <div className="border-l-4 border-amber-500 pl-4">
            <p className="font-medium text-amber-700 mb-2">Interactive Content</p>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Document chaos quiz</li>
              <li>• ROI calculators</li>
              <li>• Webinars</li>
              <li>• Live Q&A sessions</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Engagement Channels */}
      <div className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-teal-600" />
          Engagement Channels
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="font-semibold text-purple-700 mb-2">Primary Channels (Active Now)</p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>LinkedIn - thought leadership and updates</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Website - central content hub</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Direct outreach - pilot engagement</span>
              </li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="font-semibold text-teal-700 mb-2">Planned Channels (2027)</p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <span>Email newsletter</span>
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <span>YouTube demo series</span>
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <span>Resource community or forum</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Content Calendar Approach */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-600" />
          Content Calendar Approach
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="font-semibold text-purple-700 mb-2">Weekly</p>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• 2-3 LinkedIn posts</li>
              <li>• Community engagement</li>
              <li>• Pilot user check-ins</li>
            </ul>
          </div>
          <div className="bg-teal-50 rounded-lg p-4">
            <p className="font-semibold text-teal-700 mb-2">Monthly</p>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• 1-2 blog articles</li>
              <li>• Product update announcements</li>
              <li>• Case study development</li>
            </ul>
          </div>
          <div className="bg-amber-50 rounded-lg p-4">
            <p className="font-semibold text-amber-700 mb-2">Quarterly</p>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• White paper or guide</li>
              <li>• Webinar or live event</li>
              <li>• Performance review</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Engagement Tactics */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          Engagement Tactics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-amber-500" />
              <p className="font-semibold text-gray-800">The Document Chaos Quiz</p>
            </div>
            <p className="text-sm text-gray-600">Soft entry point that educates prospects about their document challenges while qualifying leads and building email lists.</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Video className="w-5 h-5 text-purple-500" />
              <p className="font-semibold text-gray-800">Demo-Led Engagement</p>
            </div>
            <p className="text-sm text-gray-600">Short, focused product demonstrations that show Hobson solving real problems in under 3 minutes.</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-teal-500" />
              <p className="font-semibold text-gray-800">Pilot Community Building</p>
            </div>
            <p className="text-sm text-gray-600">Creating advocates from early users through exceptional support, feedback loops, and co-creation opportunities.</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Mic className="w-5 h-5 text-rose-500" />
              <p className="font-semibold text-gray-800">Industry Event Presence</p>
            </div>
            <p className="text-sm text-gray-600">Targeted participation in PropTech events, panels, and speaking opportunities to build credibility.</p>
          </div>
        </div>
      </div>

      {/* SMART Objectives */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-600" />
          SMART Content & Engagement Objectives (2026-2028)
        </h3>
        
        {/* Phase 1 */}
        <div className="mb-6">
          <div className="bg-purple-100 rounded-lg p-3 mb-3">
            <h4 className="font-semibold text-purple-800">1. Establish Content Foundation (By Q4 2026)</h4>
          </div>
          <ul className="space-y-2 ml-4">
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Publish 10 high-quality educational pieces (guides, explainers, case studies)</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Achieve 500+ LinkedIn followers with 3%+ engagement rate</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Complete 3 UK pilot case studies with measurable results</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Generate 200+ quiz completions as qualified leads</span>
            </li>
          </ul>
        </div>

        {/* Phase 2 */}
        <div className="mb-6">
          <div className="bg-teal-100 rounded-lg p-3 mb-3">
            <h4 className="font-semibold text-teal-800">2. Scale Content Reach (By Q4 2027)</h4>
          </div>
          <ul className="space-y-2 ml-4">
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Grow LinkedIn audience to 1,000+ engaged followers</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Launch email newsletter with 500+ subscribers</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Host 4 webinars with average 50+ attendees each</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Achieve 40% website traffic increase through content marketing</span>
            </li>
          </ul>
        </div>

        {/* Phase 3 */}
        <div>
          <div className="bg-amber-100 rounded-lg p-3 mb-3">
            <h4 className="font-semibold text-amber-800">3. International Content Expansion (2028+)</h4>
          </div>
          <ul className="space-y-2 ml-4">
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Localise core content assets for EU and US markets</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Establish thought leadership presence in international PropTech communities</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Develop region-specific case studies and testimonials</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Measurement Framework */}
      <div className="bg-gradient-to-r from-purple-600 via-teal-600 to-amber-600 rounded-xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Measurement Framework
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold">Reach</p>
            <p className="text-sm text-white/80">Followers, impressions, website traffic</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold">Engagement</p>
            <p className="text-sm text-white/80">Likes, comments, shares, dwell time</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold">Conversion</p>
            <p className="text-sm text-white/80">Quiz completions, demo requests, sign-ups</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold">Advocacy</p>
            <p className="text-sm text-white/80">Referrals, testimonials, NPS scores</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentEngagementStrategyVisual;
