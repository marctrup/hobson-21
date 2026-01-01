import React from "react";
import { FileText, Target, Eye, MessageSquare, Sparkles, Globe, CheckCircle, ArrowRight, BookOpen, Users, TrendingUp, Calendar, Linkedin, Search, Monitor, BarChart3, Heart, Lightbulb, Zap, Mail, Layout } from "lucide-react";

export const ContentEngagementStrategyVisual: React.FC = () => {
  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-teal-500/20 mb-4">
          <FileText className="w-8 h-8 text-purple-600" />
        </div>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Hobson's content and engagement strategy is built to clearly introduce the product, reduce uncertainty around AI in real estate, and support a smooth progression from initial interest to long-term use. Because the product is still in an MVP phase, the strategy prioritises clarity and credibility over volume, focusing on steady, meaningful interactions rather than broad reach.
        </p>
      </div>

      {/* Purpose of Content */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Purpose of Content
        </h3>
        <p className="text-purple-100 mb-4">Content exists to support three practical goals:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "Understanding", desc: "Help the market understand what Hobson does and why it matters" },
            { title: "Confidence", desc: "Build confidence by showing how the product works and handles information" },
            { title: "Support", desc: "Support users and prospects through each stage with simple, useful materials" }
          ].map((item, index) => (
            <div key={index} className="bg-white/10 rounded-lg p-4">
              <p className="font-semibold mb-2">{item.title}</p>
              <p className="text-sm text-purple-100">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-purple-200 text-sm mt-4 text-center italic">
          The emphasis is on being informative and practical, without overstating capability.
        </p>
      </div>

      {/* Core Content Themes */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          Core Content Themes
        </h3>
        <p className="text-gray-600 mb-4">To keep communication consistent, all content focuses on four themes:</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: "Clarity", desc: "Explaining how Hobson simplifies document work", color: "border-purple-500" },
            { title: "Trust", desc: "Showing how answers are produced and referenced", color: "border-teal-500" },
            { title: "Ease", desc: "Emphasising simple workflows and minimal effort", color: "border-amber-500" },
            { title: "Practical Guidance", desc: "Offering examples reflecting day-to-day tasks", color: "border-rose-500" }
          ].map((theme, index) => (
            <div key={index} className={`border-l-4 ${theme.color} pl-4`}>
              <p className="font-medium text-gray-800">{theme.title}</p>
              <p className="text-sm text-gray-600">{theme.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-gray-500 text-sm mt-4 text-center">
          These themes shape every asset, from short posts to onboarding material.
        </p>
      </div>

      {/* Content by Journey Stage - See-Think-Do-Care */}
      <div className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ArrowRight className="w-5 h-5 text-purple-600" />
          Content by Journey Stage (See–Think–Do–Care)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* See */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Eye className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-purple-700">1. See (Awareness)</p>
                <p className="text-xs text-gray-500">Show the problem and introduce Hobson</p>
              </div>
            </div>
            <ul className="space-y-1 text-sm text-gray-600 ml-10">
              <li>• Short visual examples of document pain points</li>
              <li>• Simple explanations of what Hobson does</li>
              <li>• Interactive entry points such as the quiz</li>
            </ul>
            <p className="text-xs text-purple-600 mt-2 ml-10">Success: Increased visibility and early curiosity</p>
          </div>

          {/* Think */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-teal-600" />
              </div>
              <div>
                <p className="font-semibold text-teal-700">2. Think (Consideration)</p>
                <p className="text-xs text-gray-500">Explain how Hobson works and what makes it different</p>
              </div>
            </div>
            <ul className="space-y-1 text-sm text-gray-600 ml-10">
              <li>• Walkthroughs of question-and-answer outputs</li>
              <li>• Comparisons with manual workflows</li>
              <li>• Examples of referenced answers</li>
            </ul>
            <p className="text-xs text-teal-600 mt-2 ml-10">Success: Longer engagement with product content</p>
          </div>

          {/* Do */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                <Zap className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-amber-700">3. Do (Conversion)</p>
                <p className="text-xs text-gray-500">Encourage pilot participation through clear pathways</p>
              </div>
            </div>
            <ul className="space-y-1 text-sm text-gray-600 ml-10">
              <li>• Case summaries from early partners</li>
              <li>• Clear pages showing how to start</li>
              <li>• Invitations to limited pilot opportunities</li>
            </ul>
            <p className="text-xs text-amber-600 mt-2 ml-10">Success: Enquiries and pilot sign-ups</p>
          </div>

          {/* Care */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                <Heart className="w-4 h-4 text-rose-600" />
              </div>
              <div>
                <p className="font-semibold text-rose-700">4. Care (Retention & Advocacy)</p>
                <p className="text-xs text-gray-500">Support ongoing use and create feedback loops</p>
              </div>
            </div>
            <ul className="space-y-1 text-sm text-gray-600 ml-10">
              <li>• Simple onboarding materials</li>
              <li>• Short guidance tips</li>
              <li>• Updates on improvements or new features</li>
            </ul>
            <p className="text-xs text-rose-600 mt-2 ml-10">Success: Continued usage and positive feedback</p>
          </div>
        </div>
      </div>

      {/* Engagement Methods */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-teal-600" />
          Engagement Methods
        </h3>
        <p className="text-gray-600 mb-4">Engagement prioritises simplicity and direct connection:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="font-semibold text-purple-700 mb-2">The Quiz</p>
            <p className="text-sm text-gray-600">An accessible way to introduce the problem space, gather light insights, and create an early emotional connection.</p>
          </div>
          <div className="bg-teal-50 rounded-lg p-4">
            <p className="font-semibold text-teal-700 mb-2">Simple Stories and Examples</p>
            <p className="text-sm text-gray-600">Day-to-day scenarios illustrate value more effectively than abstract claims.</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-4">
            <p className="font-semibold text-amber-700 mb-2">Direct Feedback Loops</p>
            <p className="text-sm text-gray-600">1:1 conversations, polls, and structured partner feedback provide more value than large-scale community efforts at this stage.</p>
          </div>
          <div className="bg-rose-50 rounded-lg p-4">
            <p className="font-semibold text-rose-700 mb-2">Emerging Insight Content</p>
            <p className="text-sm text-gray-600">As the product matures, content will highlight examples of guidance, pattern spotting, or saved effort.</p>
          </div>
        </div>
      </div>

      {/* Channel Use Table */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-purple-600" />
          Channel Use
        </h3>
        <p className="text-gray-600 mb-4">Each channel plays a specific role:</p>
        <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Channel</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Role</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Examples</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="px-4 py-3 font-medium text-purple-700 flex items-center gap-2"><Monitor className="w-4 h-4" /> Website</td>
                <td className="px-4 py-3 text-gray-600">Education & conversion</td>
                <td className="px-4 py-3 text-gray-500">Demos, explanations, case summaries</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-blue-700 flex items-center gap-2"><Linkedin className="w-4 h-4" /> LinkedIn</td>
                <td className="px-4 py-3 text-gray-600">Awareness & credibility</td>
                <td className="px-4 py-3 text-gray-500">Updates, commentary, product examples</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-amber-700 flex items-center gap-2"><BookOpen className="w-4 h-4" /> Quiz</td>
                <td className="px-4 py-3 text-gray-600">Engagement & lead capture</td>
                <td className="px-4 py-3 text-gray-500">Interactive entry point</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-teal-700 flex items-center gap-2"><Mail className="w-4 h-4" /> Email (later)</td>
                <td className="px-4 py-3 text-gray-600">Nurture & retention</td>
                <td className="px-4 py-3 text-gray-500">Onboarding steps, feature highlights</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-rose-700 flex items-center gap-2"><Layout className="w-4 h-4" /> Product UI</td>
                <td className="px-4 py-3 text-gray-600">Ongoing engagement</td>
                <td className="px-4 py-3 text-gray-500">Prompts, tips, clear output formatting</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-gray-500 text-sm mt-3 text-center italic">
          This division keeps each channel focused and avoids over-communication during the MVP stage.
        </p>
      </div>

      {/* SMART Targets */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-600" />
          SMART Targets (2026–2027 Timeline)
        </h3>
        
        <div className="space-y-4">
          {/* Content & Education */}
          <div>
            <div className="bg-purple-100 rounded-lg p-3 mb-2">
              <h4 className="font-semibold text-purple-800">Content & Education (2026 Foundation)</h4>
            </div>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Publish 10 clear, educational pieces by Q4 2026 to strengthen awareness, improve consideration, and support pilot onboarding.</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Deliver three short onboarding guides for common user roles (COO, Asset Manager, Owner-Manager) by Q4 2026.</span>
              </li>
            </ul>
          </div>

          {/* Engagement & Awareness */}
          <div>
            <div className="bg-teal-100 rounded-lg p-3 mb-2">
              <h4 className="font-semibold text-teal-800">Engagement & Awareness (2026 Performance Targets)</h4>
            </div>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Increase LinkedIn engagement by 15% by Q4 2026, driven by consistent educational posts, thought leadership, and early pilot insights.</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Introduce simple feature-based email prompts by Q4 2026 to support continued use across pilots and early free-package users.</span>
              </li>
            </ul>
          </div>

          {/* Scaled Reach */}
          <div>
            <div className="bg-amber-100 rounded-lg p-3 mb-2">
              <h4 className="font-semibold text-amber-800">Scaled Reach for Launch (Early 2027)</h4>
            </div>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Achieve 500+ quiz completions by Q2 2027, providing a healthy top-of-funnel audience ahead of the public commercial launch.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-4 bg-gray-100 rounded-lg p-4">
          <p className="text-sm text-gray-700 text-center">
            This strategy creates a content ecosystem that explains Hobson, builds confidence gradually, and supports users at each stage with practical, low-effort materials.
          </p>
        </div>
      </div>

      {/* Digital Channel Acquisition Strategy */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Digital Channel Acquisition Communication Strategy
        </h3>
        <p className="text-purple-100 mb-4">
          Hobson's acquisition strategy aims to build early awareness, attract suitable prospects, and guide them into pilot participation. The approach uses steady, informative communication rather than volume-driven tactics.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Strategic Goals */}
          <div className="bg-white/10 rounded-lg p-4">
            <p className="font-semibold mb-2">A. Strategic Acquisition Goals</p>
            <ul className="space-y-1 text-sm text-purple-100">
              <li>• Make Hobson visible to real estate professionals with document-heavy workflows</li>
              <li>• Bring qualified traffic to the website and quiz</li>
              <li>• Build interest in the 2026 pilot programme</li>
              <li>• Test channels and messaging for 2027 scale</li>
            </ul>
          </div>

          {/* Messaging Focus */}
          <div className="bg-white/10 rounded-lg p-4">
            <p className="font-semibold mb-2">B. Acquisition Messaging Focus</p>
            <ul className="space-y-1 text-sm text-purple-100">
              <li>• <span className="text-amber-200">Clear outcomes:</span> fast answers from existing documents</li>
              <li>• <span className="text-amber-200">Reliable behaviour:</span> transparent outputs and referenced info</li>
              <li>• <span className="text-amber-200">Time savings:</span> reduced administrative load</li>
              <li>• <span className="text-amber-200">Ease of adoption:</span> minimal change to existing workflows</li>
            </ul>
          </div>
        </div>

        {/* Channel Strategy */}
        <div className="mb-4">
          <p className="font-semibold mb-3">C. Channel Strategy</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Linkedin className="w-4 h-4 text-blue-200" />
                <p className="font-medium text-sm">LinkedIn (Primary)</p>
              </div>
              <p className="text-xs text-purple-200">Simple explanations, examples, case summaries, quiz distribution</p>
              <p className="text-xs text-amber-200 mt-1">Target: 1,000 followers by Q4 2027</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Monitor className="w-4 h-4 text-teal-200" />
                <p className="font-medium text-sm">Website & Search</p>
              </div>
              <p className="text-xs text-purple-200">Clear landing pages, case examples, search-optimised content</p>
              <p className="text-xs text-amber-200 mt-1">Target: 40% organic traffic increase by Q2 2027</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Search className="w-4 h-4 text-rose-200" />
                <p className="font-medium text-sm">Paid Search (Later)</p>
              </div>
              <p className="text-xs text-purple-200">Capture high-intent users after pages are developed</p>
              <p className="text-xs text-amber-200 mt-1">Target: 3–5% CTR by Q4 2027</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-teal-200" />
                <p className="font-medium text-sm">Retargeting (Later)</p>
              </div>
              <p className="text-xs text-purple-200">Feature clips, case snippets, testimonial extracts</p>
              <p className="text-xs text-amber-200 mt-1">Target: 10% retargeted visitors to enquiries by Q4 2027</p>
            </div>
          </div>
        </div>
      </div>

      {/* Communications Approach Across Journey */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ArrowRight className="w-5 h-5 text-purple-600" />
          Communications Approach Across the Journey
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-l-4 border-purple-500 pl-4">
            <p className="font-medium text-purple-700">Awareness</p>
            <p className="text-sm text-gray-600">Introduce the problem and show how Hobson addresses it. Short visual comparisons or simple explanations of common pain points.</p>
          </div>
          <div className="border-l-4 border-teal-500 pl-4">
            <p className="font-medium text-teal-700">Consideration</p>
            <p className="text-sm text-gray-600">More detail on how Hobson works using examples of referenced answers or simple walkthroughs. Reduce uncertainty and help assess fit.</p>
          </div>
          <div className="border-l-4 border-amber-500 pl-4">
            <p className="font-medium text-amber-700">Pilot Acquisition (2026)</p>
            <p className="text-sm text-gray-600">Clarity around expectations, limited availability, and examples of value from earlier partners. Support a controlled, high-quality pilot group.</p>
          </div>
          <div className="border-l-4 border-rose-500 pl-4">
            <p className="font-medium text-rose-700">International Acquisition (2028+)</p>
            <p className="text-sm text-gray-600">Adapt channels and messaging for markets with strong AI and digital tool adoption. Localisation, partnerships, and region-specific campaigns.</p>
          </div>
        </div>
      </div>

      {/* SMART Acquisition Targets */}
      <div className="bg-gradient-to-r from-purple-100 to-teal-100 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-600" />
          SMART Acquisition Targets
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { metric: "500+", desc: "Quiz completions by Q2 2027" },
            { metric: "40%", desc: "Website traffic increase by Q4 2027" },
            { metric: "1,000", desc: "LinkedIn followers by Q4 2027" },
            { metric: "5+", desc: "Additional pilot participants by Q4 2026" },
            { metric: "10%", desc: "Retargeted visitors converting by Q4 2027" },
            { metric: "Q1 2028", desc: "International acquisition readiness" }
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-lg p-3 shadow-sm text-center">
              <p className="text-xl font-bold text-purple-600">{item.metric}</p>
              <p className="text-xs text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Digital Channel Conversion Strategy */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Digital Channel Conversion Strategy
        </h3>
        <p className="text-teal-100 mb-4">
          Hobson's conversion strategy focuses on turning qualified interest into practical use by keeping the journey simple, lowering barriers to trial, and showing value quickly.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            "Give prospective users a straightforward path from curiosity to hands-on experience",
            "Reduce perceived risk through a free entry point",
            "Demonstrate value early through real interactions with uploaded documents",
            "Improve conversion performance through continual measurement",
            "Build a funnel that can support future paid tiers"
          ].map((item, index) => (
            <div key={index} className="bg-white/10 rounded-lg p-3 flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-teal-300" />
              <p className="text-sm">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gray-100 rounded-xl p-6 text-center">
        <p className="text-gray-700">
          This acquisition strategy builds a <span className="font-semibold text-purple-700">patient, steady funnel</span> that supports Hobson's stage of development. By using targeted channels, clear explanations, and evidence-led communication, Hobson can grow visibility, attract suitable prospects, and prepare for broader expansion once the product is ready for public rollout.
        </p>
      </div>
    </div>
  );
};

export default ContentEngagementStrategyVisual;
