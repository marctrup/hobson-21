import React from 'react';
import { CheckCircle2, Award, Building2, TrendingUp, Shield, Target } from 'lucide-react';

export const FoundingLeadershipVisual = () => {
  const foundingExperience = [
    "built businesses throughout the 1990s, 2000s, and 2010s,",
    "scaled enterprise software platforms in regulated industries,",
    "and executed successful exits."
  ];

  const aareonExperience = [
    "led complex platform implementations,",
    "managed large enterprise clients,",
    "and executed additional acquisitions, including Fixflo and Tilt Property Software."
  ];

  const teamNavigated = [
    "product-market fit,",
    "hypergrowth,",
    "enterprise implementation,",
    "cross-border expansion,",
    "post-acquisition integration,",
    "and strategic M&A execution."
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-6 border border-primary/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <Award className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold text-foreground">Proven Operators. Repeat Exits. Category Builders</h3>
          </div>
          <p className="text-foreground leading-relaxed">
            Hobson is led by a team that has built, scaled, and exited technology companies across three decades through multiple economic cycles and technology shifts. This is not a first venture.
          </p>
          <p className="text-foreground leading-relaxed mt-3 font-semibold text-primary">
            Hobson is the next evolution of a proven execution engine.
          </p>
        </div>
      </div>

      {/* Founding Leadership Experience */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-bone-wash dark:bg-ink/50 text-charcoal dark:text-ink-muted font-bold text-sm">1</div>
          <h4 className="font-semibold text-foreground">The founding leadership has:</h4>
        </div>
        
        <div className="ml-11 space-y-2">
          {foundingExperience.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-charcoal mt-0.5 flex-shrink-0" />
              <span className="text-sm text-foreground">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Arthur & Aareon Experience */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-success-bg dark:bg-success-solid/50 text-success dark:text-success font-bold text-sm">2</div>
          <h4 className="font-semibold text-foreground">Arthur & Aareon Experience</h4>
        </div>
        
        <div className="ml-11 p-4 rounded-xl bg-success-bg/50 dark:bg-success-solid/20 border border-success-border dark:border-success/30">
          <p className="text-sm text-foreground leading-relaxed mb-3">
            Most notably, the team previously founded and scaled <span className="font-semibold text-primary">Arthur</span>, a category-leading property management platform that <span className="font-semibold text-primary">Advent International and Aareon ultimately acquired in 2021</span>.
          </p>
          <p className="text-sm text-foreground leading-relaxed mb-3">
            Following that acquisition, the leadership remained deeply involved in enterprise growth and strategic expansion inside Aareon's global organisation, where they:
          </p>
          <div className="space-y-2">
            {aareonExperience.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <Building2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                <span className="text-sm text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Insight */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-warning-bg dark:bg-warning-solid/50 text-warning dark:text-warning font-bold text-sm">3</div>
          <h4 className="font-semibold text-foreground">This experience gives Hobson something few startups ever possess:</h4>
        </div>
        
        <div className="ml-11 p-4 rounded-xl bg-gradient-to-r from-warning-bg to-warning-bg dark:from-warning-solid/30 dark:to-warning-solid/30 border border-warning-border dark:border-warning/30">
          <p className="text-foreground font-medium">
            Direct, operational knowledge of how to build, scale, integrate, and exit Real Estate technology businesses.
          </p>
        </div>
      </div>

      {/* What Team Has Navigated */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-bone-wash dark:bg-ink/50 text-charcoal dark:text-ink-muted font-bold text-sm">4</div>
          <h4 className="font-semibold text-foreground">Hobson's team has already navigated:</h4>
        </div>
        
        <div className="ml-11 grid sm:grid-cols-2 gap-2">
          {teamNavigated.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 p-3 rounded-lg bg-paper/50 dark:bg-ink/20 border border-faint-rule dark:border-charcoal/30">
              <TrendingUp className="w-4 h-4 text-charcoal mt-0.5 flex-shrink-0" />
              <span className="text-sm text-foreground">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Conclusion */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-success/10 via-success/10 to-ink-faint/10 p-6 border border-success-border dark:border-success/30">
        <div className="flex items-start gap-3">
          <Shield className="w-6 h-6 text-success flex-shrink-0 mt-0.5" />
          <p className="text-foreground leading-relaxed font-medium">
            Hobson enters the market with <span className="text-primary font-bold">dramatically reduced execution risk</span> and a clear blueprint for both scale and exit.
          </p>
        </div>
      </div>
    </div>
  );
};
