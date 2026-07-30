import { TrendingUp, FileText, Zap, Clock, AlertTriangle, CheckCircle2, Target } from "lucide-react";

export const MarketDescriptionVisual = () => {
  const marketStats = [
    { label: "AI in Real Estate CAGR", value: "36.1%", source: "Business Research Company" },
    { label: "Forecasted Market by 2030", value: "$1.8T", source: "Maximize Market Research" },
    { label: "NOI Increase from Automation", value: "10%+", source: "McKinsey" },
    { label: "Firms Reporting Cost Reductions", value: "49%", source: "Forbes" },
  ];

  const actionableInsights = [
    {
      title: "Data-Intensive Operations",
      insight: "Real Estate teams now need tools that turn static documents into usable, queryable information.",
      icon: FileText,
      color: "blue",
    },
    {
      title: "Strategic Automation",
      insight: "Automation is now a strategic priority, not a future aspiration.",
      icon: Zap,
      color: "purple",
    },
    {
      title: "Document Overload",
      insight: "AI-driven document interpretation is the only scalable solution to unstructured portfolio data.",
      icon: AlertTriangle,
      color: "amber",
    },
    {
      title: "Speed & Compliance",
      insight: "Speed is no longer a competitive advantage — it is a compliance and credibility requirement.",
      icon: Clock,
      color: "emerald",
    },
  ];

  const convergencePressures = [
    "Data volume has exploded",
    "Manual workflows cannot keep up",
    "Teams are smaller but expectations are higher",
    "Compliance rules demand accuracy and traceability",
    "Global evidence proves that AI generates measurable efficiency gains",
  ];

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-ink-faint/10 via-ink-faint/5 to-ink-faint/10 p-6 border border-bone/50 dark:border-charcoal/30">
        <div className="absolute top-0 right-0 w-32 h-32 bg-ink-faint/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <h3 className="text-xl font-bold text-foreground mb-4">Market Description</h3>
          <p className="text-foreground leading-relaxed">
            Hobson operates in a real estate sector undergoing profound operational and technological change. Real estate teams are responsible for managing increasing volumes of unstructured and structured data while facing growing pressure to deliver accurate, compliant, and timely information. Several structural trends have converged to create an environment where traditional workflows are no longer sustainable — making AI-driven document intelligence not just beneficial, but necessary.
          </p>
        </div>
      </div>

      {/* Key Actionable Trends */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-paper to-bone-wash dark:from-ink/50 dark:to-ink/30 p-6 border border-bone dark:border-charcoal/50">
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-charcoal dark:text-ink-muted" />
          Key Actionable Trends in Real Estate Data Use
        </h4>
        <p className="text-muted-foreground mb-4">
          The Real Estate industry has become significantly more data-intensive in the past decade. Operators are now required to handle:
        </p>
        <ul className="space-y-2 mb-4">
          {[
            "Complex lease documents, often 10-30 pages each",
            "Hundreds of supporting documents in even modest portfolios",
            "Multiple sources of truth across email, shared drives, property management systems, and legacy databases",
            "Growing investor reporting requirements with deeper data granularity",
            "Greater expectations for real-time insight, especially during portfolio reviews or negotiations",
          ].map((item, idx) => (
            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
              <span className="text-charcoal dark:text-ink-muted mt-1">•</span>
              {item}
            </li>
          ))}
        </ul>
        <p className="text-muted-foreground text-sm italic">
          These trends have stretched the traditional "manual search and summarise" model beyond its limits.
        </p>
      </div>

      {/* Market Statistics */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-ink-faint/10 via-ink-faint/5 to-ink-faint/10 p-6 border border-bone/50 dark:border-charcoal/30">
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-charcoal dark:text-ink-muted" />
          Growing Demand for Automation
        </h4>
        <p className="text-muted-foreground mb-4">
          Automation is no longer optional in property operations. Global research consistently shows that companies adopting AI and automation are outperforming those that do not:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {marketStats.map((stat, idx) => (
            <div key={idx} className="bg-background/60 rounded-xl p-4 border border-border/50 text-center">
              <p className="text-2xl font-bold text-charcoal dark:text-ink-muted">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Ref: {stat.source}</p>
            </div>
          ))}
        </div>
        <p className="text-muted-foreground text-sm">
          Operators increasingly recognise that manual administrative work is not scalable, especially in a market with leaner teams, higher data demands, and greater expectation for operational transparency.
        </p>
      </div>

      {/* Document Overload */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-warning/10 via-warning/5 to-warning/10 p-6 border border-warning-border/50 dark:border-warning/30">
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-warning dark:text-warning" />
          Document Overload in Transactions and Portfolio Management
        </h4>
        <p className="text-muted-foreground mb-4">
          Across organisations of all sizes, document overload has become one of the most expensive and time-consuming operational challenges:
        </p>
        <ul className="space-y-2 mb-4">
          {[
            "Asset managers, analysts, and COOs spend hours every week searching through PDFs, emails, and scanned files",
            "Transactions involve hundreds of unstructured documents with inconsistent formats",
            "Critical information is often lost inside appendices, addendums, and correspondence chains",
            "Portfolio reviews require extraction of dates, obligations, and clauses across dozens or hundreds of leases",
            "Staff shortages amplify the impact — fewer people must do more work, faster",
          ].map((item, idx) => (
            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
              <span className="text-warning dark:text-warning mt-1">•</span>
              {item}
            </li>
          ))}
        </ul>
        <p className="text-muted-foreground text-sm italic">
          This overload doesn't just slow teams down — it introduces inconsistent reporting, contractual risk, and operational bottlenecks.
        </p>
      </div>

      {/* Speed, Compliance, Accuracy */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-success/10 via-success/5 to-success/10 p-6 border border-success-border/50 dark:border-success/30">
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-success dark:text-success" />
          Pressure for Speed, Compliance, and Accuracy
        </h4>
        <p className="text-muted-foreground mb-4">
          The regulatory, investor, and operational environment is becoming more demanding every year:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Regulatory & Investor Demands:</p>
            <ul className="space-y-1">
              {[
                "RICS and audit requirements demand accuracy, traceability, and referenced data",
                "ESG and sustainability reporting require consistent interpretation of clauses and contracts",
                "Service charge transparency rules add scrutiny to operational documentation",
                "Investors expect rapid, evidence-backed answers in meetings and board reviews",
              ].map((item, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-success dark:text-success mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Organisations Must Deliver:</p>
            <ul className="space-y-1">
              {[
                "Faster answers",
                "Clearer documentation",
                "Referenced insights",
                "Reduced risk of human error",
              ].map((item, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success dark:text-success mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="text-muted-foreground text-sm italic">
          Reporting errors or delays undermine trust, confidence, and credibility.
        </p>
      </div>

      {/* Actionable Insights Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actionableInsights.map((item, idx) => {
          const colorClasses = {
            blue: "from-ink-faint/10 to-charcoal/10 border-bone/50 dark:border-charcoal/30 text-charcoal dark:text-ink-muted",
            purple: "from-ink-faint/10 to-charcoal/10 border-bone/50 dark:border-charcoal/30 text-charcoal dark:text-ink-muted",
            amber: "from-warning/10 to-warning/10 border-warning-border/50 dark:border-warning/30 text-warning dark:text-warning",
            emerald: "from-success/10 to-success/10 border-success-border/50 dark:border-success/30 text-success dark:text-success",
          }[item.color];
          const iconColor = {
            blue: "text-charcoal dark:text-ink-muted",
            purple: "text-charcoal dark:text-ink-muted",
            amber: "text-warning dark:text-warning",
            emerald: "text-success dark:text-success",
          }[item.color];
          return (
            <div key={idx} className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${colorClasses} p-4 border`}>
              <div className="flex items-start gap-3">
                <item.icon className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Actionable Insight</p>
                  <p className="text-sm font-medium text-foreground">{item.insight}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Why Now */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-danger/10 via-danger/5 to-danger/10 p-6 border border-danger-border/50 dark:border-danger/30">
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-danger dark:text-danger" />
          Why the Problem Matters Now
        </h4>
        <p className="text-muted-foreground mb-4">
          The operational landscape shows a clear convergence of pressures:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          {convergencePressures.map((pressure, idx) => (
            <div key={idx} className="bg-background/60 rounded-lg p-3 border border-border/50">
              <p className="text-sm text-foreground flex items-start gap-2">
                <span className="text-danger dark:text-danger font-bold">{idx + 1}.</span>
                {pressure}
              </p>
            </div>
          ))}
        </div>
        <p className="text-muted-foreground">
          Real estate operators urgently need tools that deliver clarity from complexity, without requiring system overhauls or disruptive implementation.
        </p>
      </div>

      {/* Hobson Positioning */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 p-6 border border-primary/20">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <h4 className="font-semibold text-foreground mb-4">Hobson's Strategic Position</h4>
          <p className="text-foreground leading-relaxed mb-4">
            Hobson is positioned precisely at this intersection — enabling Real Estate teams to retrieve accurate, referenced answers instantly, using the documents they already rely on. Its lightweight, low-friction design makes it uniquely suited to a market that needs automation without disruption.
          </p>
          <div className="bg-success-bg/50 dark:bg-success-solid/20 rounded-xl p-4 border border-success-border/50 dark:border-success/30">
            <p className="text-foreground font-medium">
              Hobson's solution is not just relevant — it is timely, strategically aligned, and driven by immediate market need.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketDescriptionVisual;
