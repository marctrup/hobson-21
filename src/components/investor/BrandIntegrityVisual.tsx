import { Award, Target, Shield, Eye, Sparkles, Heart, Brain, CheckCircle2, Lightbulb, Users, Compass, TrendingUp } from "lucide-react";

export const BrandIntegrityVisual = () => {
  const brandMetaphors = [
    { metaphor: "GPS for documents", description: "Takes you straight to the answer" },
    { metaphor: "Master key", description: "Unlocks information hidden in dense files" },
    { metaphor: "Compass in a document jungle", description: "Navigates complexity safely" },
    { metaphor: "Desk lamp", description: "Quietly illuminates the truth whenever needed" },
  ];

  const brandStrengths = [
    "Simplifies document retrieval and reduces cognitive load",
    "Saves meaningful time on routine information search",
    "Provides transparent, referenced answers that build trust",
    "Calm, clear, and jargon-free tone matching the Sage archetype",
    "Consistent, modern, and recognisable visual assets",
    "Interactive tools like the quiz reinforce Hobson as knowledgeable yet friendly",
  ];

  const brandWeaknesses = [
    "Emotionally, the brand is not yet fully expressed — users understand what Hobson does but fewer cues about deeper human-level impact",
    "Seen as reliable and helpful, but not yet as a source of ongoing strategic insight or proactive guidance",
    "Still building resolution and support structures that mature brands rely on",
  ];

  const nextPhase = [
    "Scaling emotional storytelling",
    "Building structured support and resolution processes",
    "Demonstrating the move from retrieval to proactive insight and strategic clarity",
  ];

  const internalUseCases = [
    "Automate testing and quality checks",
    "Refine content and documentation",
    "Support parts of customer communication",
  ];

  return (
    <div className="space-y-6">
      {/* Brand Summary */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 p-6 border border-primary/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Brand Summary</h3>
              <p className="text-muted-foreground text-sm mt-1">Clear, Coherent, and Authentic Brand Foundation</p>
            </div>
          </div>
          <p className="text-foreground leading-relaxed mb-4">
            Hobson has a clear, coherent, and authentic brand foundation. Its voice, visual identity, archetypes, and interactive elements all convey calm intelligence and dependable guidance.
          </p>
          <div className="bg-background/60 rounded-xl p-4 border border-border/50">
            <p className="text-sm font-medium text-foreground mb-3">The Next Phase:</p>
            <div className="space-y-2">
              {nextPhase.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4 italic">
            With these in place, Hobson can move from promising to preferred in the emerging category of AI document intelligence for Real Estate.
          </p>
        </div>
      </div>

      {/* Brand Background */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-purple-500/10 p-6 border border-purple-200/50 dark:border-purple-800/30">
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          Brand Background
        </h4>
        <div className="space-y-3">
          <p className="text-muted-foreground text-sm">
            Hobson is a calm, intelligent, and dependable AI assistant built for Real Estate professionals who work with complex, document-heavy workflows. The brand stands for <span className="font-medium text-foreground">clarity, trust, and simplicity</span>, turning source-of-truth documents into fast, accurate, fully referenced answers.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-background/60 rounded-xl p-3 border border-border/50">
              <p className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase mb-1">Primary Archetype</p>
              <p className="text-sm font-medium text-foreground">Sage</p>
              <p className="text-xs text-muted-foreground">Wisdom, guidance, truth</p>
            </div>
            <div className="bg-background/60 rounded-xl p-3 border border-border/50">
              <p className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase mb-1">Supporting Trait</p>
              <p className="text-sm font-medium text-foreground">Ruler</p>
              <p className="text-xs text-muted-foreground">Order, reliability</p>
            </div>
            <div className="bg-background/60 rounded-xl p-3 border border-border/50">
              <p className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase mb-1">Supporting Trait</p>
              <p className="text-sm font-medium text-foreground">Creator</p>
              <p className="text-xs text-muted-foreground">Innovation</p>
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            The <span className="font-medium text-foreground">purple palette</span> signals insight and clear thinking rather than noisy disruption. The <span className="font-medium text-foreground">owl mascot</span> embodies Hobson's role as a quiet, observant guide. The <span className="font-medium text-foreground">Hobson Energy Unit (HUE)</span> adds a coin-based "energy" layer for engagement, rewards, or recognition.
          </p>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-emerald-500/10 p-5 border border-emerald-200/50 dark:border-emerald-800/30">
          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Brand Strengths
          </h4>
          <ul className="space-y-2">
            {brandStrengths.map((strength, idx) => (
              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 mt-1">•</span>
                {strength}
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-amber-500/10 p-5 border border-amber-200/50 dark:border-amber-800/30">
          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            Brand Weaknesses (Opportunities)
          </h4>
          <ul className="space-y-2">
            {brandWeaknesses.map((weakness, idx) => (
              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-amber-600 dark:text-amber-400 mt-1">•</span>
                {weakness}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Emotional & Cognitive Appeal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Emotional */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500/10 via-pink-500/5 to-pink-500/10 p-5 border border-pink-200/50 dark:border-pink-800/30">
          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            Emotional (Heart) Appeal
          </h4>
          <p className="text-sm text-muted-foreground mb-3">
            Hobson's emotional promise is <span className="font-medium text-foreground">reassurance</span>. It reduces stress by making hard-to-find information easy to access, giving professionals a sense of control in high-pressure, chaotic environments.
          </p>
          <p className="text-xs text-muted-foreground mb-2">Can be deepened by:</p>
          <ul className="space-y-1">
            <li className="text-xs text-muted-foreground flex items-start gap-1">
              <span className="text-pink-600 dark:text-pink-400">•</span>
              Before/after stories showing real relief and time saved
            </li>
            <li className="text-xs text-muted-foreground flex items-start gap-1">
              <span className="text-pink-600 dark:text-pink-400">•</span>
              User narratives highlighting confidence and reduced risk
            </li>
            <li className="text-xs text-muted-foreground flex items-start gap-1">
              <span className="text-pink-600 dark:text-pink-400">•</span>
              Visuals showing Hobson as calm presence in hectic workflows
            </li>
          </ul>
        </div>

        {/* Cognitive */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-blue-500/10 p-5 border border-blue-200/50 dark:border-blue-800/30">
          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Cognitive (Head) Appeal
          </h4>
          <p className="text-sm text-muted-foreground mb-3">
            The logical argument for Hobson is equally strong. Its architecture is designed for:
          </p>
          <ul className="space-y-2">
            <li className="text-sm text-muted-foreground flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <span><span className="font-medium text-foreground">Measurable outcomes:</span> time saved, fewer errors, quicker decisions</span>
            </li>
            <li className="text-sm text-muted-foreground flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <span><span className="font-medium text-foreground">Transparent referencing:</span> every answer traced back to its source</span>
            </li>
          </ul>
          <p className="text-xs text-muted-foreground mt-3 italic">
            "Practice what we preach" — Hobson uses AI internally for testing, content refinement, and support tasks.
          </p>
        </div>
      </div>

      {/* Authenticity */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-emerald-500/10 p-5 border border-emerald-200/50 dark:border-emerald-800/30">
        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          Authenticity Assessment
        </h4>
        <p className="text-sm text-muted-foreground mb-3">
          Authenticity is one of Hobson's core strengths. The brand avoids hype, is open about its limitations, and is built around <span className="font-medium text-foreground">clarity, not mystery</span>. Showing sources for every answer is a direct expression of that principle.
        </p>
        <div className="bg-background/60 rounded-xl p-3 border border-border/50">
          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase mb-2">Planned Enhancements</p>
          <p className="text-sm text-muted-foreground">
            Confidence scores, incomplete-data alerts, and clearer "how this answer was generated" views will deepen honesty. Case studies, short trials, and measurable results will provide external proof.
          </p>
        </div>
      </div>

      {/* Brand Metaphors */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-amber-500/10 p-5 border border-amber-200/50 dark:border-amber-800/30">
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Compass className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          Brand Metaphors
        </h4>
        <p className="text-sm text-muted-foreground mb-4">
          Hobson's value can be communicated simply through a small set of metaphors:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {brandMetaphors.map((item, idx) => (
            <div key={idx} className="bg-background/60 rounded-xl p-3 border border-border/50 text-center">
              <p className="text-sm font-medium text-foreground mb-1">{item.metaphor}</p>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3 italic">
          These metaphors make Hobson understandable and memorable even for non-technical audiences.
        </p>
      </div>

      {/* Internal Brand Function */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-blue-500/10 p-5 border border-blue-200/50 dark:border-blue-800/30">
        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Internal Brand Function
        </h4>
        <p className="text-sm text-muted-foreground mb-3">
          Hobson is not only a product but also a way of operating internally. The team uses AI to:
        </p>
        <div className="flex flex-wrap gap-2">
          {internalUseCases.map((item, idx) => (
            <span key={idx} className="px-3 py-1.5 rounded-lg bg-background/60 border border-border/50 text-sm text-muted-foreground">
              {item}
            </span>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3 italic">
          This alignment between what Hobson does for clients and how Hobson works internally strengthens authenticity and improves operational efficiency.
        </p>
      </div>

      {/* Current Marketing Position */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/30 p-6 border border-slate-200 dark:border-slate-700/50">
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Current Marketing Position
        </h4>
        <p className="text-muted-foreground mb-4">
          Today, Hobson's market presence is <span className="font-medium text-foreground">selective and relationship-led</span>. The focus is on deep MVP partnerships rather than broad public awareness. The brand is visually strong, the story is coherent, and the touchpoints — site, quiz, mascot, and interface — are consistent.
        </p>
        <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
          <p className="text-sm font-medium text-foreground mb-2">Main Opportunity</p>
          <p className="text-sm text-muted-foreground">
            Shift from being a quiet, validating presence into a <span className="font-medium text-foreground">confident, educational voice</span> that helps shape expectations for AI-native assistants in real estate: what "good" looks like, what transparency means, and how document intelligence should behave.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BrandIntegrityVisual;
