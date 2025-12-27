import { Globe, Search, Users, MousePointer, Shield, Clock, AlertTriangle, CheckCircle2, Linkedin, MessageSquare, TrendingUp } from "lucide-react";

export const CustomerOnlineBehaviourVisual = () => {
  const researchChannels = [
    {
      persona: "Leigh",
      role: "COO, Large Portfolio Operator",
      color: "blue",
      channels: [
        "LinkedIn and trusted industry publications (EG, Property Week)",
        "Peer recommendations, case studies, and thought leadership",
        "Conferences, webinars, and PropTech panels",
        "Rarely rely on generic Google searches — credibility and trust matter more than price",
      ],
    },
    {
      persona: "James",
      role: "Head of Operations, Medium-Sized Company",
      color: "purple",
      channels: [
        "Combination of Google, LinkedIn, and PropTech community groups",
        "Compare based on clarity, demonstration of value, and ease of onboarding",
      ],
    },
    {
      persona: "Priya",
      role: "Small Portfolio Owner",
      color: "emerald",
      channels: [
        "Google for direct problem-solutions ('AI for lease summaries', 'reduce admin property tasks')",
        "PropTech community groups",
        "Facebook landlord groups, forums, SME WhatsApp groups",
        "Respond well to simple explainer videos, clear pricing, and frictionless demos",
      ],
    },
  ];

  const trustedContent = [
    { title: "Referenced Examples", description: "Showing where Hobson pulled information from the document — citations and page numbers" },
    { title: "Case Studies & Real-World Proof", description: "Time savings, reduced admin, accuracy improvements, clear before/after comparisons" },
    { title: "Product Walkthroughs & Live Demos", description: "Accuracy and ease of use must be demonstrated, not described" },
    { title: "Peer Endorsements", description: "Testimonials from other property professionals and similar organisations" },
    { title: "Checklists & Data-Driven Insights", description: "'5 Document Tasks You Can Automate Today', 'Where AI Reduces Risk'" },
  ];

  const evaluationCriteria = [
    { title: "Accuracy First", description: "They test difficult leases, scanned PDFs, or old documents. If AI gets details wrong, trust declines sharply.", icon: CheckCircle2 },
    { title: "Transparency", description: "They expect referenced answers, not guesses. 'Show our working' is essential in a risk-averse industry.", icon: Search },
    { title: "Ease of Use", description: "Solutions must 'just work' without onboarding. Key advantage of Hobson's lightweight approach.", icon: MousePointer },
    { title: "Security", description: "Where is data stored? How long is it kept? Who can access it?", icon: Shield },
    { title: "Time-to-Value", description: "They expect benefit within minutes, not weeks. Heavy integration reduces adoption likelihood.", icon: Clock },
    { title: "Workflow Impact", description: "Tools that support existing systems (our positioning) are easier to adopt than replacements.", icon: TrendingUp },
  ];

  const distrustTriggers = [
    "Unreferenced or Partially Wrong AI Outputs — even small inaccuracies create disproportionate loss of trust",
    "Complex onboarding or technical jargon — SMBs especially feel excluded or overwhelmed",
    "Silence or irregular communication from vendors — enterprise buyers expect predictability",
    "Perceived system replacement — 'Disruption Without Displacement' positioning solves this",
    "Security uncertainty — especially when sharing leases or confidential agreements",
    "Overpromising — AI vendors often exaggerate; buyers are sceptical by default",
  ];

  const channelStrategySummary = [
    { channel: "LinkedIn", insight: "Primary channel for enterprise personas. Focus on clarity, referenced examples, and operational authority." },
    { channel: "Google", insight: "Essential for SMB personas. Use long-tail keywords aligned with document intelligence." },
    { channel: "Communities", insight: "Accelerate trust. Useful for early traction and referral loops." },
    { channel: "Content", insight: "Must demonstrate accuracy, simplicity, and non-disruption. Real examples and clear outcomes." },
    { channel: "Trust", insight: "Fragile with AI. Referenced output and reliable communication are the main drivers." },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string }> = {
      blue: { bg: "from-blue-500/10 to-blue-600/10", border: "border-blue-200/50 dark:border-blue-800/30", text: "text-blue-600 dark:text-blue-400" },
      purple: { bg: "from-purple-500/10 to-purple-600/10", border: "border-purple-200/50 dark:border-purple-800/30", text: "text-purple-600 dark:text-purple-400" },
      emerald: { bg: "from-emerald-500/10 to-emerald-600/10", border: "border-emerald-200/50 dark:border-emerald-800/30", text: "text-emerald-600 dark:text-emerald-400" },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-blue-500/10 p-6 border border-blue-200/50 dark:border-blue-800/30">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
              <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Customer Online Behaviour</h3>
              <p className="text-muted-foreground text-sm mt-1">Digital Research, Evaluation & Channel Preferences</p>
            </div>
          </div>
          <p className="text-foreground leading-relaxed">
            Real estate professionals display distinct online behaviours that heavily influence how they research, evaluate, and ultimately adopt AI tools. Understanding these behaviours is essential for shaping Hobson's channel strategy, messaging, and content approach.
          </p>
        </div>
      </div>

      {/* Where Customers Research Tools */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/30 p-6 border border-slate-200 dark:border-slate-700/50">
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Where Customers Research Tools
        </h4>
        <div className="space-y-4">
          {researchChannels.map((persona, idx) => {
            const colors = getColorClasses(persona.color);
            return (
              <div key={idx} className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${colors.bg} p-4 border ${colors.border}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-8 h-8 rounded-full bg-background/60 flex items-center justify-center font-bold ${colors.text}`}>
                    {persona.persona.charAt(0)}
                  </span>
                  <div>
                    <p className="font-medium text-foreground">{persona.persona}</p>
                    <p className="text-xs text-muted-foreground">{persona.role}</p>
                  </div>
                </div>
                <ul className="space-y-1">
                  {persona.channels.map((channel, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className={`${colors.text} mt-1`}>•</span>
                      {channel}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* What Content They Trust */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-emerald-500/10 p-6 border border-emerald-200/50 dark:border-emerald-800/30">
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          What Content They Trust
        </h4>
        <p className="text-muted-foreground text-sm mb-4">
          Across all personas, the content that builds trust is:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {trustedContent.map((item, idx) => (
            <div key={idx} className="bg-background/60 rounded-xl p-3 border border-border/50">
              <p className="text-sm font-medium text-foreground mb-1">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-4 italic">
          This reflects the industry's preference for clarity, simplicity, and evidence-backed tools — reinforcing our positioning.
        </p>
      </div>

      {/* How Customers Evaluate AI Solutions */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-purple-500/10 p-6 border border-purple-200/50 dark:border-purple-800/30">
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          How Customers Evaluate AI Solutions
        </h4>
        <p className="text-muted-foreground text-sm mb-4">
          Real estate buyers follow a predictable evaluation pattern:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {evaluationCriteria.map((item, idx) => (
            <div key={idx} className="bg-background/60 rounded-xl p-4 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <item.icon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <p className="text-sm font-medium text-foreground">{item.title}</p>
              </div>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* What Triggers Distrust */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500/10 via-red-500/5 to-red-500/10 p-6 border border-red-200/50 dark:border-red-800/30">
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          What Triggers Distrust or Hesitation
        </h4>
        <p className="text-muted-foreground text-sm mb-4">
          The biggest blockers in our personas are:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {distrustTriggers.map((trigger, idx) => (
            <div key={idx} className="flex items-start gap-2 bg-background/60 rounded-lg p-3 border border-border/50">
              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">{trigger}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Search Habits */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-amber-500/10 p-6 border border-amber-200/50 dark:border-amber-800/30">
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          Search Habits (Google, LinkedIn, Communities, Influencers)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Google */}
          <div className="bg-background/60 rounded-xl p-4 border border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <Search className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <p className="font-medium text-foreground">Google</p>
            </div>
            <p className="text-xs text-muted-foreground mb-2">Used by SMBs and mid-size operators for problem-led searches:</p>
            <div className="flex flex-wrap gap-1 mb-2">
              {["AI for property documents", "Lease summary tool", "Automate real estate admin", "Reduce property workload AI"].map((term, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400">"{term}"</span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Search intent spikes during: renewals, annual reports, audits, new staff onboarding, manual bottlenecks</p>
          </div>

          {/* LinkedIn */}
          <div className="bg-background/60 rounded-xl p-4 border border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <Linkedin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <p className="font-medium text-foreground">LinkedIn</p>
            </div>
            <p className="text-xs text-muted-foreground mb-2">Primary channel for senior and enterprise buyers:</p>
            <ul className="space-y-1">
              {["Follow thought leaders", "Read company updates", "Watch product demos", "Compare vendor credibility", "Discover PropTech trends"].map((item, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                  <span className="text-blue-600 dark:text-blue-400">•</span>{item}
                </li>
              ))}
            </ul>
          </div>

          {/* Communities */}
          <div className="bg-background/60 rounded-xl p-4 border border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <p className="font-medium text-foreground">Communities</p>
            </div>
            <ul className="space-y-1">
              {["Facebook landlord groups", "UK PropTech groups", "WhatsApp groups for asset managers", "Meetup groups and local property networks"].map((item, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                  <span className="text-emerald-600 dark:text-emerald-400">•</span>{item}
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground mt-2 italic">Acts as a referral network where peers validate tools.</p>
          </div>

          {/* Influencers */}
          <div className="bg-background/60 rounded-xl p-4 border border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <p className="font-medium text-foreground">Influencers</p>
            </div>
            <p className="text-xs text-muted-foreground mb-2">Real estate professionals follow:</p>
            <ul className="space-y-1">
              {["PropTech founders", "Asset management advisors", "Industry journalists", "Operations experts", "YouTube channels"].map((item, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                  <span className="text-purple-600 dark:text-purple-400">•</span>{item}
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground mt-2 italic">Influencer commentary builds awareness, but case studies close the sale.</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 p-6 border border-primary/20">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            How These Behaviours Shape Hobson's Channel Strategy
          </h4>
          <div className="space-y-2">
            {channelStrategySummary.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-background/60 rounded-lg p-3 border border-border/50">
                <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold text-xs">{idx + 1}</span>
                </span>
                <div>
                  <span className="text-sm font-medium text-foreground">{item.channel}: </span>
                  <span className="text-sm text-muted-foreground">{item.insight}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl p-4 border border-emerald-200/50 dark:border-emerald-800/30">
            <p className="text-sm text-foreground font-medium">
              This behavioural understanding directly informs our Tactics, Channel Mix, and Brand Messaging later in the strategy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerOnlineBehaviourVisual;
