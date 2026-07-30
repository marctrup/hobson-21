import { Target, Building2, Users, Zap, TrendingUp, Search, Share2, Lightbulb } from "lucide-react";

interface Competitor {
  name: string;
  personas: string;
  seo: string;
  social: string;
  implications: string;
  color: string;
  isHobson?: boolean;
}

export const CompetitorBenchmarksVisual = () => {
  const competitors: Competitor[] = [
    {
      name: "Hobson",
      personas: "Large portfolio operators; medium property companies; SMB owner-managers with heavy document workloads",
      seo: "Competes in emerging, low-competition keyword spaces: AI for real estate documents, lease analysis AI, document intelligence. Search volume rising; difficult terms avoidable.",
      social: "Early-stage presence; opportunity to lead in \"document intelligence\" content. Best suited for expert, credible, clarity-driven tone.",
      implications: "White space category. Hobson can own the niche: AI document insight for real estate — not dominated by legacy PropTech or AI leasing tools.",
      color: "primary",
      isHobson: true,
    },
    {
      name: "EliseAI",
      personas: "Residential property managers, leasing agents, customer service teams",
      seo: "High difficulty for \"AI leasing assistant,\" \"property management automation.\" Strong search volumes but saturated by competitors.",
      social: "Strong LinkedIn presence; frequent posting; case studies and leasing automation stories dominate.",
      implications: "Avoid the \"AI leasing\" narrative — Elise owns this space. Focus on operational clarity + document accuracy instead.",
      color: "blue",
    },
    {
      name: "StanAI",
      personas: "Commercial brokers, investment teams, underwriting analysts",
      seo: "Competes for \"AI underwriting,\" \"CRE data automation.\" Moderate keyword difficulty; smaller but specialised search volume.",
      social: "Professional tone; moderate LinkedIn presence and engagement on commercial real estate analytics focused sharing insights and analytics content.",
      implications: "Clear differentiation: StanAI is deal analytics, Hobson is document intelligence. Maintain separation.",
      color: "purple",
    },
    {
      name: "Kendal AI",
      personas: "Property managers and tenant communication teams",
      seo: "Keywords around \"AI property management,\" \"tenant enquiry automation.\" Competitive landscape; high cost to rank.",
      social: "Small but active LinkedIn footprint; friendly conversational content focused on tenant communications.",
      implications: "Their focus is front-of-house. Hobson should stay in back-of-house operations + compliance intelligence.",
      color: "amber",
    },
    {
      name: "Trudi",
      personas: "SME property managers; residential leasing teams (Australia/US)",
      seo: "Regional SEO; moderate difficulty. Keywords: \"AI assistant for property management,\" \"automated leasing FAQs.\"",
      social: "LinkedIn, and casual, approachable content; testimonials and video-heavy posts.",
      implications: "Tone mismatch with Hobson. Hobson keeps a more professional operational style.",
      color: "emerald",
    },
    {
      name: "Legacy PropTech",
      personas: "Enterprise + SMBs across residential and commercial sectors (Yardi, MRI, AppFolio, RealPage, Buildium)",
      seo: "Extremely high SEO authority; impossible to challenge for broad terms (\"property management software,\" \"lease management system\"). These dominate all top rankings.",
      social: "Massive presence, heavily funded content, highly polished enterprise branding.",
      implications: "Do not compete on broad software terms. Position Hobson as the AI layer that complements legacy systems (\"Disruption Without Displacement\").",
      color: "red",
    },
  ];

  const getColorClasses = (color: string, isHobson?: boolean) => {
    if (isHobson) {
      return {
        bg: "from-primary/15 via-primary/10 to-primary/15",
        border: "border-primary/30",
        text: "text-primary",
        badge: "bg-primary/20 text-primary",
      };
    }
    const colors: Record<string, { bg: string; border: string; text: string; badge: string }> = {
      blue: {
        bg: "from-ink-faint/10 to-charcoal/10",
        border: "border-bone/50 dark:border-charcoal/30",
        text: "text-charcoal dark:text-ink-muted",
        badge: "bg-ink-faint/10 text-charcoal dark:text-ink-muted",
      },
      purple: {
        bg: "from-ink-faint/10 to-charcoal/10",
        border: "border-bone/50 dark:border-charcoal/30",
        text: "text-charcoal dark:text-ink-muted",
        badge: "bg-ink-faint/10 text-charcoal dark:text-ink-muted",
      },
      amber: {
        bg: "from-warning/10 to-warning/10",
        border: "border-warning-border/50 dark:border-warning/30",
        text: "text-warning dark:text-warning",
        badge: "bg-warning/10 text-warning dark:text-warning",
      },
      emerald: {
        bg: "from-success/10 to-success/10",
        border: "border-success-border/50 dark:border-success/30",
        text: "text-success dark:text-success",
        badge: "bg-success/10 text-success dark:text-success",
      },
      red: {
        bg: "from-danger/10 to-danger/10",
        border: "border-danger-border/50 dark:border-danger/30",
        text: "text-danger dark:text-danger",
        badge: "bg-danger/10 text-danger dark:text-danger",
      },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-ink-faint/10 via-ink-faint/5 to-ink-faint/10 p-6 border border-bone/50 dark:border-charcoal/30">
        <div className="absolute top-0 right-0 w-32 h-32 bg-ink-faint/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-ink-faint/10 flex items-center justify-center flex-shrink-0">
              <Target className="w-6 h-6 text-charcoal dark:text-ink-muted" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Competitor Benchmarks</h3>
              <p className="text-muted-foreground text-sm mt-1">Competitive Landscape Analysis</p>
            </div>
          </div>
          <p className="text-foreground leading-relaxed mb-4">
            Hobson operates within an emerging category of AI-native Real Estate tools that automate insight extraction, workflows, and communication. While traditional PropTech platforms dominate property management and CRM functions, a new class of AI-driven assistants is targeting operational efficiency.
          </p>
          <p className="text-muted-foreground text-sm">
            The comparison below evaluates key competitors across persona fit, SEO landscape, and social media presence to identify Hobson's differentiation and strategic opportunities.
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/60 border border-border/50">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Customer Personas</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/60 border border-border/50">
          <Search className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">SEO Landscape</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/60 border border-border/50">
          <Share2 className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Social Media</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/60 border border-border/50">
          <Lightbulb className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Strategic Implications</span>
        </div>
      </div>

      {/* Competitor Cards */}
      <div className="space-y-4">
        {competitors.map((competitor, idx) => {
          const colors = getColorClasses(competitor.color, competitor.isHobson);
          return (
            <div
              key={idx}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colors.bg} p-5 border ${colors.border} ${competitor.isHobson ? 'ring-2 ring-primary/20' : ''}`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${colors.badge} flex items-center justify-center font-bold`}>
                    {competitor.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{competitor.name}</h4>
                    {competitor.isHobson && (
                      <span className="text-xs font-medium text-primary">Our Position</span>
                    )}
                  </div>
                </div>
                {competitor.isHobson && (
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    White Space Leader
                  </span>
                )}
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Customer Personas */}
                <div className="bg-background/60 rounded-xl p-3 border border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className={`w-4 h-4 ${colors.text}`} />
                    <span className={`text-xs font-medium ${colors.text} uppercase`}>Customer Personas</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{competitor.personas}</p>
                </div>

                {/* SEO Landscape */}
                <div className="bg-background/60 rounded-xl p-3 border border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Search className={`w-4 h-4 ${colors.text}`} />
                    <span className={`text-xs font-medium ${colors.text} uppercase`}>SEO Landscape</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{competitor.seo}</p>
                </div>

                {/* Social Media */}
                <div className="bg-background/60 rounded-xl p-3 border border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Share2 className={`w-4 h-4 ${colors.text}`} />
                    <span className={`text-xs font-medium ${colors.text} uppercase`}>Social Media</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{competitor.social}</p>
                </div>

                {/* Strategic Implications */}
                <div className={`rounded-xl p-3 border ${competitor.isHobson ? 'bg-primary/5 border-primary/20' : 'bg-success-bg/50 dark:bg-success-solid/20 border-success-border/50 dark:border-success/30'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className={`w-4 h-4 ${competitor.isHobson ? 'text-primary' : 'text-success dark:text-success'}`} />
                    <span className={`text-xs font-medium uppercase ${competitor.isHobson ? 'text-primary' : 'text-success dark:text-success'}`}>Strategic Implications</span>
                  </div>
                  <p className={`text-sm ${competitor.isHobson ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{competitor.implications}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 p-6 border border-primary/20">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Key Strategic Takeaways
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-background/60 rounded-xl p-4 border border-border/50">
              <p className="text-sm font-medium text-foreground mb-2">Differentiation</p>
              <p className="text-sm text-muted-foreground">
                Focus on AI document insight for real estate — a category not dominated by legacy PropTech or AI leasing tools.
              </p>
            </div>
            <div className="bg-background/60 rounded-xl p-4 border border-border/50">
              <p className="text-sm font-medium text-foreground mb-2">Positioning</p>
              <p className="text-sm text-muted-foreground">
                "Disruption Without Displacement" — Hobson complements legacy systems rather than competing directly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitorBenchmarksVisual;
