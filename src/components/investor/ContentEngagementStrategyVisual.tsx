import React from "react";
import { FileText, Target, Eye, MessageSquare, Sparkles, Globe, CheckCircle, ArrowRight, BookOpen, Users, TrendingUp, Linkedin, Search, Monitor, BarChart3, Heart, Lightbulb, Zap, Mail, Layout } from "lucide-react";

export const ContentEngagementStrategyVisual: React.FC = () => {
  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-ink-faint/20 to-ink-faint/20 mb-4">
          <FileText className="w-8 h-8 text-charcoal" />
        </div>
        <p className="text-charcoal max-w-3xl mx-auto">
          Hobson's content and engagement strategy is built to clearly introduce the product, reduce uncertainty around AI in real estate, and support a smooth progression from initial interest to long-term use. Because the product is still in an MVP phase, the strategy prioritises clarity and credibility over volume, focusing on steady, meaningful interactions rather than broad reach.
        </p>
      </div>

      {/* Purpose of Content */}
      <div className="bg-gradient-to-r from-bone-wash to-bone rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-ink">
          <Target className="w-5 h-5" />
          Purpose of Content
        </h3>
        <p className="text-charcoal mb-4">Content exists to support three practical goals:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "Understanding", desc: "Help the market understand what Hobson does and why it matters" },
            { title: "Confidence", desc: "Build confidence by showing how the product works and handles information" },
            { title: "Support", desc: "Support users and prospects through each stage with simple, useful materials" }
          ].map((item, index) => (
            <div key={index} className="bg-white/80 rounded-lg p-4 border border-bone">
              <p className="font-semibold mb-2 text-ink">{item.title}</p>
              <p className="text-sm text-charcoal">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-charcoal text-sm mt-4 text-center italic">
          The emphasis is on being informative and practical, without overstating capability.
        </p>
      </div>

      {/* Core Content Themes */}
      <div className="bg-white rounded-xl border border-bone p-6">
        <h3 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-charcoal" />
          Core Content Themes
        </h3>
        <p className="text-charcoal mb-4">To keep communication consistent, all content focuses on four themes:</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: "Clarity", desc: "Explaining how Hobson simplifies document work", color: "border-bone-strong" },
            { title: "Trust", desc: "Showing how answers are produced and referenced", color: "border-bone-strong" },
            { title: "Ease", desc: "Emphasising simple workflows and minimal effort", color: "border-warning" },
            { title: "Practical Guidance", desc: "Offering examples reflecting day-to-day tasks", color: "border-danger" }
          ].map((theme, index) => (
            <div key={index} className={`border-l-4 ${theme.color} pl-4`}>
              <p className="font-medium text-ink">{theme.title}</p>
              <p className="text-sm text-charcoal">{theme.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-ink-muted text-sm mt-4 text-center">
          These themes shape every asset, from short posts to onboarding material.
        </p>
      </div>

      {/* Content by Journey Stage - See-Think-Do-Care */}
      <div className="bg-gradient-to-r from-paper to-paper rounded-xl p-6">
        <h3 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
          <ArrowRight className="w-5 h-5 text-charcoal" />
          Content by Journey Stage (See–Think–Do–Care)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* See */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-bone-wash flex items-center justify-center">
                <Eye className="w-4 h-4 text-charcoal" />
              </div>
              <div>
                <p className="font-semibold text-charcoal">1. See (Awareness)</p>
                <p className="text-xs text-ink-muted">Show the problem and introduce Hobson</p>
              </div>
            </div>
            <ul className="space-y-1 text-sm text-charcoal ml-10">
              <li>• Short visual examples of document pain points</li>
              <li>• Simple explanations of what Hobson does</li>
              <li>• Interactive entry points such as the quiz</li>
            </ul>
            <p className="text-xs text-charcoal mt-2 ml-10">Success: Increased visibility and early curiosity</p>
          </div>

          {/* Think */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-bone-wash flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-charcoal" />
              </div>
              <div>
                <p className="font-semibold text-charcoal">2. Think (Consideration)</p>
                <p className="text-xs text-ink-muted">Explain how Hobson works and what makes it different</p>
              </div>
            </div>
            <ul className="space-y-1 text-sm text-charcoal ml-10">
              <li>• Walkthroughs of question-and-answer outputs</li>
              <li>• Comparisons with manual workflows</li>
              <li>• Examples of referenced answers</li>
            </ul>
            <p className="text-xs text-charcoal mt-2 ml-10">Success: Longer engagement with product content</p>
          </div>

          {/* Do */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-warning-bg flex items-center justify-center">
                <Zap className="w-4 h-4 text-warning" />
              </div>
              <div>
                <p className="font-semibold text-warning">3. Do (Conversion)</p>
                <p className="text-xs text-ink-muted">Encourage pilot participation through clear pathways</p>
              </div>
            </div>
            <ul className="space-y-1 text-sm text-charcoal ml-10">
              <li>• Case summaries from early partners</li>
              <li>• Clear pages showing how to start</li>
              <li>• Invitations to limited pilot opportunities</li>
            </ul>
            <p className="text-xs text-warning mt-2 ml-10">Success: Enquiries and pilot sign-ups</p>
          </div>

          {/* Care */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-danger-bg flex items-center justify-center">
                <Heart className="w-4 h-4 text-danger" />
              </div>
              <div>
                <p className="font-semibold text-danger">4. Care (Retention & Advocacy)</p>
                <p className="text-xs text-ink-muted">Support ongoing use and create feedback loops</p>
              </div>
            </div>
            <ul className="space-y-1 text-sm text-charcoal ml-10">
              <li>• Simple onboarding materials</li>
              <li>• Short guidance tips</li>
              <li>• Updates on improvements or new features</li>
            </ul>
            <p className="text-xs text-danger mt-2 ml-10">Success: Continued usage and positive feedback</p>
          </div>
        </div>
      </div>

      {/* Engagement Methods */}
      <div className="bg-white rounded-xl border border-bone p-6">
        <h3 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-charcoal" />
          Engagement Methods
        </h3>
        <p className="text-charcoal mb-4">Engagement prioritises simplicity and direct connection:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-paper rounded-lg p-4">
            <p className="font-semibold text-charcoal mb-2">The Quiz</p>
            <p className="text-sm text-charcoal">An accessible way to introduce the problem space, gather light insights, and create an early emotional connection.</p>
          </div>
          <div className="bg-paper rounded-lg p-4">
            <p className="font-semibold text-charcoal mb-2">Simple Stories and Examples</p>
            <p className="text-sm text-charcoal">Day-to-day scenarios illustrate value more effectively than abstract claims.</p>
          </div>
          <div className="bg-warning-bg rounded-lg p-4">
            <p className="font-semibold text-warning mb-2">Direct Feedback Loops</p>
            <p className="text-sm text-charcoal">1:1 conversations, polls, and structured partner feedback provide more value than large-scale community efforts at this stage.</p>
          </div>
          <div className="bg-danger-bg rounded-lg p-4">
            <p className="font-semibold text-danger mb-2">Emerging Insight Content</p>
            <p className="text-sm text-charcoal">As the product matures, content will highlight examples of guidance, pattern spotting, or saved effort.</p>
          </div>
        </div>
      </div>

      {/* Channel Use Table */}
      <div className="bg-paper rounded-xl p-6">
        <h3 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-charcoal" />
          Channel Use
        </h3>
        <p className="text-charcoal mb-4">Each channel plays a specific role:</p>
        <div className="bg-white rounded-lg overflow-hidden border border-bone">
          <table className="w-full text-sm">
            <thead className="bg-bone-wash">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-charcoal">Channel</th>
                <th className="px-4 py-3 text-left font-semibold text-charcoal">Role</th>
                <th className="px-4 py-3 text-left font-semibold text-charcoal">Examples</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-faint-rule">
              <tr>
                <td className="px-4 py-3 font-medium text-charcoal flex items-center gap-2"><Monitor className="w-4 h-4" /> Website</td>
                <td className="px-4 py-3 text-charcoal">Education & conversion</td>
                <td className="px-4 py-3 text-ink-muted">Demos, explanations, case summaries</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-charcoal flex items-center gap-2"><Linkedin className="w-4 h-4" /> LinkedIn</td>
                <td className="px-4 py-3 text-charcoal">Awareness & credibility</td>
                <td className="px-4 py-3 text-ink-muted">Updates, commentary, product examples</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-warning flex items-center gap-2"><BookOpen className="w-4 h-4" /> Quiz</td>
                <td className="px-4 py-3 text-charcoal">Engagement & lead capture</td>
                <td className="px-4 py-3 text-ink-muted">Interactive entry point</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-charcoal flex items-center gap-2"><Mail className="w-4 h-4" /> Email (later)</td>
                <td className="px-4 py-3 text-charcoal">Nurture & retention</td>
                <td className="px-4 py-3 text-ink-muted">Onboarding steps, feature highlights</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-danger flex items-center gap-2"><Layout className="w-4 h-4" /> Product UI</td>
                <td className="px-4 py-3 text-charcoal">Ongoing engagement</td>
                <td className="px-4 py-3 text-ink-muted">Prompts, tips, clear output formatting</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-ink-muted text-sm mt-3 text-center italic">
          This division keeps each channel focused and avoids over-communication during the MVP stage.
        </p>
      </div>

      {/* SMART Targets */}
      <div className="bg-white rounded-xl border border-bone p-6">
        <h3 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-charcoal" />
          SMART Targets (2026–2027 Timeline)
        </h3>
        
        <div className="space-y-4">
          {/* Content & Education */}
          <div>
            <div className="bg-bone-wash rounded-lg p-3 mb-2">
              <h4 className="font-semibold text-ink">Content & Education (2026 Foundation)</h4>
            </div>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2 text-sm text-charcoal">
                <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                <span>Publish 10 clear, educational pieces by Q4 2026 to strengthen awareness, improve consideration, and support pilot onboarding.</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-charcoal">
                <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                <span>Deliver three short onboarding guides for common user roles (COO, Asset Manager, Owner-Manager) by Q4 2026.</span>
              </li>
            </ul>
          </div>

          {/* Engagement & Awareness */}
          <div>
            <div className="bg-bone-wash rounded-lg p-3 mb-2">
              <h4 className="font-semibold text-ink">Engagement & Awareness (2026 Performance Targets)</h4>
            </div>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2 text-sm text-charcoal">
                <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                <span>Increase LinkedIn engagement by 15% by Q4 2026, driven by consistent educational posts, thought leadership, and early pilot insights.</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-charcoal">
                <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                <span>Introduce simple feature-based email prompts by Q4 2026 to support continued use across pilots and early free-package users.</span>
              </li>
            </ul>
          </div>

          {/* Scaled Reach */}
          <div>
            <div className="bg-warning-bg rounded-lg p-3 mb-2">
              <h4 className="font-semibold text-warning">Scaled Reach for Launch (Early 2027)</h4>
            </div>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2 text-sm text-charcoal">
                <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                <span>Achieve 500+ quiz completions by Q2 2027, providing a healthy top-of-funnel audience ahead of the public commercial launch.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-4 bg-bone-wash rounded-lg p-4">
          <p className="text-sm text-charcoal text-center">
            This strategy creates a content ecosystem that explains Hobson, builds confidence gradually, and supports users at each stage with practical, low-effort materials.
          </p>
        </div>
      </div>

      {/* Digital Channel Acquisition Strategy */}
      <div className="bg-gradient-to-r from-bone-wash to-bone rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-ink">
          <TrendingUp className="w-5 h-5" />
          Digital Channel Acquisition Communication Strategy
        </h3>
        <p className="text-charcoal mb-4">
          Hobson's acquisition strategy aims to build early awareness, attract suitable prospects, and guide them into pilot participation. The approach uses steady, informative communication rather than volume-driven tactics.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Strategic Goals */}
          <div className="bg-white/80 rounded-lg p-4 border border-bone">
            <p className="font-semibold mb-2 text-ink">A. Strategic Acquisition Goals</p>
            <ul className="space-y-1 text-sm text-charcoal">
              <li>• Make Hobson visible to real estate professionals with document-heavy workflows</li>
              <li>• Bring qualified traffic to the website and quiz</li>
              <li>• Build interest in the 2026 pilot programme</li>
              <li>• Test channels and messaging for 2027 scale</li>
            </ul>
          </div>

          {/* Messaging Focus */}
          <div className="bg-white/80 rounded-lg p-4 border border-bone">
            <p className="font-semibold mb-2 text-ink">B. Acquisition Messaging Focus</p>
            <ul className="space-y-1 text-sm text-charcoal">
              <li>• <span className="text-warning font-medium">Clear outcomes:</span> fast answers from existing documents</li>
              <li>• <span className="text-warning font-medium">Reliable behaviour:</span> transparent outputs and referenced info</li>
              <li>• <span className="text-warning font-medium">Time savings:</span> reduced administrative load</li>
              <li>• <span className="text-warning font-medium">Ease of adoption:</span> minimal change to existing workflows</li>
            </ul>
          </div>
        </div>

        {/* Channel Strategy */}
        <div className="mb-4">
          <p className="font-semibold mb-3 text-ink">C. Channel Strategy</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-white/80 rounded-lg p-3 border border-bone">
              <div className="flex items-center gap-2 mb-2">
                <Linkedin className="w-4 h-4 text-charcoal" />
                <p className="font-medium text-sm text-ink">LinkedIn (Primary)</p>
              </div>
              <p className="text-xs text-charcoal">Simple explanations, examples, case summaries, quiz distribution</p>
              <p className="text-xs text-warning font-medium mt-1">Target: 1,000 followers by Q4 2027</p>
            </div>
            <div className="bg-white/80 rounded-lg p-3 border border-bone">
              <div className="flex items-center gap-2 mb-2">
                <Monitor className="w-4 h-4 text-charcoal" />
                <p className="font-medium text-sm text-ink">Website & Search</p>
              </div>
              <p className="text-xs text-charcoal">Clear landing pages, case examples, search-optimised content</p>
              <p className="text-xs text-warning font-medium mt-1">Target: 40% organic traffic increase by Q2 2027</p>
            </div>
            <div className="bg-white/80 rounded-lg p-3 border border-bone">
              <div className="flex items-center gap-2 mb-2">
                <Search className="w-4 h-4 text-danger" />
                <p className="font-medium text-sm text-ink">Paid Search (Later)</p>
              </div>
              <p className="text-xs text-charcoal">Capture high-intent users after pages are developed</p>
              <p className="text-xs text-warning font-medium mt-1">Target: 3–5% CTR by Q4 2027</p>
            </div>
            <div className="bg-white/80 rounded-lg p-3 border border-bone">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-charcoal" />
                <p className="font-medium text-sm text-ink">Retargeting (Later)</p>
              </div>
              <p className="text-xs text-charcoal">Feature clips, case snippets, testimonial extracts</p>
              <p className="text-xs text-warning font-medium mt-1">Target: 10% retargeted visitors to enquiries by Q4 2027</p>
            </div>
          </div>
        </div>
      </div>

      {/* Communications Approach Across Journey */}
      <div className="bg-white rounded-xl border border-bone p-6">
        <h3 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
          <ArrowRight className="w-5 h-5 text-charcoal" />
          Communications Approach Across the Journey
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-l-4 border-bone-strong pl-4">
            <p className="font-medium text-charcoal">Awareness</p>
            <p className="text-sm text-charcoal">Introduce the problem and show how Hobson addresses it. Short visual comparisons or simple explanations of common pain points.</p>
          </div>
          <div className="border-l-4 border-bone-strong pl-4">
            <p className="font-medium text-charcoal">Consideration</p>
            <p className="text-sm text-charcoal">More detail on how Hobson works using examples of referenced answers or simple walkthroughs. Reduce uncertainty and help assess fit.</p>
          </div>
          <div className="border-l-4 border-warning pl-4">
            <p className="font-medium text-warning">Pilot Acquisition (2026)</p>
            <p className="text-sm text-charcoal">Clarity around expectations, limited availability, and examples of value from earlier partners. Support a controlled, high-quality pilot group.</p>
          </div>
          <div className="border-l-4 border-danger pl-4">
            <p className="font-medium text-danger">International Acquisition (2028+)</p>
            <p className="text-sm text-charcoal">Adapt channels and messaging for markets with strong AI and digital tool adoption. Localisation, partnerships, and region-specific campaigns.</p>
          </div>
        </div>
      </div>

      {/* SMART Acquisition Targets */}
      <div className="bg-gradient-to-r from-bone-wash to-bone-wash rounded-xl p-6">
        <h3 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-charcoal" />
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
              <p className="text-xl font-bold text-charcoal">{item.metric}</p>
              <p className="text-xs text-charcoal">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Digital Channel Conversion Strategy */}
      <div className="bg-gradient-to-r from-bone-wash to-bone rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-ink">
          <Zap className="w-5 h-5" />
          Digital Channel Conversion Strategy
        </h3>
        <p className="text-charcoal mb-4">
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
            <div key={index} className="bg-white/80 rounded-lg p-3 flex items-start gap-2 border border-bone">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-charcoal" />
              <p className="text-sm text-charcoal">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-bone-wash rounded-xl p-6 text-center">
        <p className="text-charcoal">
          This acquisition strategy builds a <span className="font-semibold text-charcoal">patient, steady funnel</span> that supports Hobson's stage of development. By using targeted channels, clear explanations, and evidence-led communication, Hobson can grow visibility, attract suitable prospects, and prepare for broader expansion once the product is ready for public rollout.
        </p>
      </div>
    </div>
  );
};

export default ContentEngagementStrategyVisual;
