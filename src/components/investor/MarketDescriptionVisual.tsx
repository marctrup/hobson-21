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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-blue-500/10 p-6 border border-blue-200/50 dark:border-blue-800/30">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <h3 className="text-xl font-bold text-foreground mb-4">Market Description</h3>
          <p className="text-foreground leading-relaxed">
            Hobson operates in a real estate sector undergoing profound operational and technological change. Real estate teams are responsible for managing increasing volumes of unstructured and structured data while facing growing pressure to deliver accurate, compliant, and timely information. Several structural trends have converged to create an environment where traditional workflows are no longer sustainable — making AI-driven document intelligence not just beneficial, but necessary.
          </p>
        </div>
      </div>

      {/* Key Actionable Trends */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/30 p-6 border border-slate-200 dark:border-slate-700/50">
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
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
              <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
              {item}
            </li>
          ))}
        </ul>
        <p className="text-muted-foreground text-sm italic">
          These trends have stretched the traditional "manual search and summarise" model beyond its limits.
        </p>
      </div>

      {/* Market Statistics */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-purple-500/10 p-6 border border-purple-200/50 dark:border-purple-800/30">
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          Growing Demand for Automation
        </h4>
        <p className="text-muted-foreground mb-4">
          Automation is no longer optional in property operations. Global research consistently shows that companies adopting AI and automation are outperforming those that do not:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {marketStats.map((stat, idx) => (
            <div key={idx} className="bg-background/60 rounded-xl p-4 border border-border/50 text-center">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stat.value}</p>
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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-amber-500/10 p-6 border border-amber-200/50 dark:border-amber-800/30">
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
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
              <span className="text-amber-600 dark:text-amber-400 mt-1">•</span>
              {item}
            </li>
          ))}
        </ul>
        <p className="text-muted-foreground text-sm italic">
          This overload doesn't just slow teams down — it introduces inconsistent reporting, contractual risk, and operational bottlenecks.
        </p>
      </div>

      {/* Speed, Compliance, Accuracy */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-emerald-500/10 p-6 border border-emerald-200/50 dark:border-emerald-800/30">
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
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
                  <span className="text-emerald-600 dark:text-emerald-400 mt-1">•</span>
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
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
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
            blue: "from-blue-500/10 to-blue-600/10 border-blue-200/50 dark:border-blue-800/30 text-blue-600 dark:text-blue-400",
            purple: "from-purple-500/10 to-purple-600/10 border-purple-200/50 dark:border-purple-800/30 text-purple-600 dark:text-purple-400",
            amber: "from-amber-500/10 to-amber-600/10 border-amber-200/50 dark:border-amber-800/30 text-amber-600 dark:text-amber-400",
            emerald: "from-emerald-500/10 to-emerald-600/10 border-emerald-200/50 dark:border-emerald-800/30 text-emerald-600 dark:text-emerald-400",
          }[item.color];
          const iconColor = {
            blue: "text-blue-600 dark:text-blue-400",
            purple: "text-purple-600 dark:text-purple-400",
            amber: "text-amber-600 dark:text-amber-400",
            emerald: "text-emerald-600 dark:text-emerald-400",
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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500/10 via-red-500/5 to-red-500/10 p-6 border border-red-200/50 dark:border-red-800/30">
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-red-600 dark:text-red-400" />
          Why the Problem Matters Now
        </h4>
        <p className="text-muted-foreground mb-4">
          The operational landscape shows a clear convergence of pressures:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          {convergencePressures.map((pressure, idx) => (
            <div key={idx} className="bg-background/60 rounded-lg p-3 border border-border/50">
              <p className="text-sm text-foreground flex items-start gap-2">
                <span className="text-red-600 dark:text-red-400 font-bold">{idx + 1}.</span>
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
          <div className="bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl p-4 border border-emerald-200/50 dark:border-emerald-800/30">
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
