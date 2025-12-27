import React from 'react';
import { Users, Building2, Briefcase, User, Target, CheckCircle2, ArrowRight } from 'lucide-react';

export const SituationAnalysisVisual = () => {
  const segments = [
    {
      id: 1,
      title: "Large Portfolio Operators with Heavy Administration",
      icon: Building2,
      color: "from-blue-500/10 to-blue-600/10",
      borderColor: "border-blue-200/50 dark:border-blue-800/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      description: "Organisations managing hundreds of assets with layered approval structures and multiple document repositories (legacy CRMs, shared drives, email archives). Their systems are complex, decentralised, and historically built.",
      hobsonValue: "Hobson behaves like a rapid information assistant. It retrieves clauses, dates, terms, and summaries from large volumes of documents in seconds.",
      useCases: [
        "Responding quickly to a person's queries",
        "Supporting internal and board reporting by querying portfolio-wide documents",
        "Helping junior staff access information without constant senior oversight",
      ],
      feedback: "It takes us too long to find even simple information.",
      targetLevel: "Primary",
      targetReason: "Highest administrative burden, clear ROI, larger teams for word-of-mouth",
    },
    {
      id: 2,
      title: "Medium-Sized Real Estate Companies with Agile Workflows",
      icon: Briefcase,
      color: "from-purple-500/10 to-purple-600/10",
      borderColor: "border-purple-200/50 dark:border-purple-800/30",
      iconColor: "text-purple-600 dark:text-purple-400",
      description: "Lean, fast-moving teams managing mid-sized portfolios. These organisations often lack centralised knowledge systems and rely on shared drives, email threads, and informal knowledge.",
      hobsonValue: "Hobson provides clarity and structure without requiring a system overhaul. It acts as an instant-access layer over existing files.",
      useCases: [
        "Asset reviews and operational audits",
        "Onboarding new staff, reducing dependency on legacy knowledge",
        "Producing internal summary reports and board updates",
      ],
      feedback: "Information is spread across inboxes, folders and individuals' knowledge.",
      targetLevel: "Secondary",
      targetReason: "Agile decision-making, low barriers, ideal for early case studies",
    },
    {
      id: 3,
      title: "Small Portfolio Owners / Owner-Managers",
      icon: User,
      color: "from-emerald-500/10 to-emerald-600/10",
      borderColor: "border-emerald-200/50 dark:border-emerald-800/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      description: "Hands-on owner-operators running small portfolios with limited administrative support and minimal technology infrastructure. They rely on manual workflows, email, paper files, and spreadsheets.",
      hobsonValue: "Hobson becomes a simple, intelligent digital assistant that finds and summarises lease terms, deadlines, and answers without requiring training.",
      useCases: [
        "Preparing renewals, notices, or legal letters",
        "Answering day-to-day operational questions",
        "Organising portfolio details and key dates",
      ],
      feedback: "I just want something simple that works and doesn't require onboarding.",
      targetLevel: "Future",
      targetReason: "High volume potential, suits long-term self-serve model",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500/10 via-teal-500/5 to-teal-500/10 p-6 border border-teal-200/50 dark:border-teal-800/30">
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Customer Segmentation & Targeting</h3>
            <p className="text-muted-foreground mt-1">Three distinct segments with shared core pain: time and risk of manual document search</p>
          </div>
        </div>
      </div>

      {/* Intro */}
      <div className="p-5 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/30 border border-slate-200 dark:border-slate-700/50">
        <p className="text-foreground leading-relaxed">
          Hobson serves Real Estate organisations that manage operational documents such as leases, agreements, and compliance files. 
          Through discovery interviews and early product testing, <span className="font-bold text-primary">three distinct segments</span> emerged. 
          Each differs in maturity, administrative load, and appetite for technology, but all share the same core pain.
        </p>
      </div>

      {/* Segments */}
      <div className="space-y-6">
        {segments.map((segment) => (
          <div key={segment.id} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${segment.color} p-6 border ${segment.borderColor}`}>
            {/* Segment Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-xl bg-background/80 ${segment.iconColor}`}>
                <segment.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h4 className="font-bold text-foreground">Segment {segment.id}:</h4>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    segment.targetLevel === "Primary" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300" :
                    segment.targetLevel === "Secondary" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300" :
                    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                  }`}>
                    {segment.targetLevel} Target
                  </span>
                </div>
                <h5 className="font-semibold text-foreground mt-1">{segment.title}</h5>
              </div>
            </div>

            {/* Description */}
            <p className="text-muted-foreground text-sm mb-4">{segment.description}</p>

            {/* Hobson Value */}
            <div className="p-4 rounded-xl bg-background/60 border border-border/50 mb-4">
              <p className="text-foreground text-sm font-medium">{segment.hobsonValue}</p>
            </div>

            {/* Use Cases */}
            <div className="space-y-2 mb-4">
              {segment.useCases.map((useCase, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${segment.iconColor}`} />
                  <span className="text-sm text-foreground">{useCase}</span>
                </div>
              ))}
            </div>

            {/* Client Feedback */}
            <div className="p-3 rounded-lg bg-background/80 border-l-4 border-primary/50">
              <p className="text-sm italic text-muted-foreground">
                <span className="font-medium text-foreground">Client feedback:</span> "{segment.feedback}"
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Targeting Strategy */}
      <div className="space-y-4">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <Target className="w-5 h-5 text-teal-600" />
          Targeting Strategy
        </h4>
        <p className="text-muted-foreground text-sm">
          While all three segments benefit from Hobson's document-native AI, the go-to-market focus is phased:
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          {segments.map((segment, idx) => (
            <React.Fragment key={segment.id}>
              <div className={`flex-1 p-4 rounded-xl bg-gradient-to-br ${segment.color} border ${segment.borderColor}`}>
                <div className={`text-xs font-bold ${segment.iconColor} mb-1`}>{segment.targetLevel} Target</div>
                <div className="font-semibold text-foreground text-sm mb-2">Segment {segment.id}</div>
                <p className="text-xs text-muted-foreground">{segment.targetReason}</p>
              </div>
              {idx < segments.length - 1 && (
                <div className="hidden sm:flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-muted-foreground/50" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 p-6 border border-primary/20">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <h4 className="font-semibold text-foreground mb-3">Summary</h4>
          <p className="text-foreground leading-relaxed">
            Across all segments, the underlying problem is consistent: <span className="font-bold text-primary">critical information resides in documents, not systems</span>, 
            which slows decision-making and increases operational risk. Hobson solves this by delivering fast, accurate, referenced answers 
            using the files teams already rely on. This makes it valuable for organisations of every size, but especially for those with 
            complex, document-heavy portfolios and high compliance pressure.
          </p>
        </div>
      </div>
    </div>
  );
};
