import React from 'react';
import { Route, Search, Upload, MessageSquare, FileCheck, TrendingUp, Clock, CheckCircle2, ArrowRight, ArrowDown } from 'lucide-react';

interface JourneyStage {
  stage: string;
  description: string;
  icon: React.ElementType;
}

interface Journey {
  persona: string;
  role: string;
  color: string;
  borderColor: string;
  iconColor: string;
  trigger: string;
  stages: JourneyStage[];
  outcome: string;
}

export const CustomerUserJourneysVisual = () => {
  const journeys: Journey[] = [
    {
      persona: "Leigh",
      role: "COO, Large Portfolio Operator",
      color: "from-blue-500/10 to-blue-600/10",
      borderColor: "border-blue-200/50 dark:border-blue-800/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      trigger: "Board meeting in 48 hours requires a compliance summary across 200+ leases",
      stages: [
        { stage: "Discovery", description: "Learns about Hobson through industry peer or conference", icon: Search },
        { stage: "Evaluation", description: "Requests demo with own documents to test real-world performance", icon: Upload },
        { stage: "Trial", description: "Team runs parallel queries: Hobson vs manual search", icon: Clock },
        { stage: "Adoption", description: "Rolls out to operations team with defined use cases", icon: CheckCircle2 },
        { stage: "Expansion", description: "Extends to compliance, legal, and investor reporting", icon: TrendingUp },
      ],
      outcome: "Board pack delivered in hours instead of days. Junior staff empowered to answer queries independently.",
    },
    {
      persona: "James",
      role: "Head of Asset Management, Medium Company",
      color: "from-purple-500/10 to-purple-600/10",
      borderColor: "border-purple-200/50 dark:border-purple-800/30",
      iconColor: "text-purple-600 dark:text-purple-400",
      trigger: "New hire needs access to historical lease information scattered across shared drives",
      stages: [
        { stage: "Awareness", description: "Sees LinkedIn post or case study about time savings", icon: Search },
        { stage: "Interest", description: "Signs up for free trial to test with existing files", icon: Upload },
        { stage: "Testing", description: "Uses Hobson for asset review and onboarding pack", icon: MessageSquare },
        { stage: "Decision", description: "Presents ROI case to leadership based on trial results", icon: FileCheck },
        { stage: "Integration", description: "Embeds into daily workflow for asset management", icon: CheckCircle2 },
      ],
      outcome: "New hire productive in days instead of months. Asset reviews completed 60% faster.",
    },
    {
      persona: "Priya",
      role: "Owner-Manager, Small Portfolio",
      color: "from-emerald-500/10 to-emerald-600/10",
      borderColor: "border-emerald-200/50 dark:border-emerald-800/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      trigger: "Tenant dispute requires finding specific clause in a 5-year-old lease agreement",
      stages: [
        { stage: "Problem", description: "Spends 2 hours searching email and paper files", icon: Clock },
        { stage: "Discovery", description: "Finds Hobson through Google search or referral", icon: Search },
        { stage: "Sign-up", description: "Creates account and uploads key documents in minutes", icon: Upload },
        { stage: "First Query", description: "Asks natural language question, gets instant answer", icon: MessageSquare },
        { stage: "Regular Use", description: "Uses Hobson for renewals, notices, and quick lookups", icon: CheckCircle2 },
      ],
      outcome: "Clause found in 30 seconds. Dispute resolved same day. Hobson becomes go-to tool.",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500/10 via-teal-500/5 to-teal-500/10 p-6 border border-teal-200/50 dark:border-teal-800/30">
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <Route className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Customer User Journeys</h3>
            <p className="text-muted-foreground mt-1">From trigger event to successful adoption for each persona</p>
          </div>
        </div>
      </div>

      {/* Intro */}
      <div className="p-5 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/30 border border-slate-200 dark:border-slate-700/50">
        <p className="text-foreground leading-relaxed">
          Each persona follows a distinct path from <span className="font-bold text-primary">initial trigger</span> to 
          <span className="font-bold text-primary"> successful adoption</span>. Understanding these journeys informs 
          messaging, channel strategy, and product experience at every touchpoint.
        </p>
      </div>

      {/* Journeys */}
      <div className="space-y-6">
        {journeys.map((journey, journeyIdx) => (
          <div key={journeyIdx} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${journey.color} p-6 border ${journey.borderColor}`}>
            {/* Journey Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-background/80 ${journey.iconColor} font-bold`}>
                {journey.persona.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-foreground">{journey.persona}</h4>
                <p className="text-sm text-muted-foreground">{journey.role}</p>
              </div>
            </div>

            {/* Trigger */}
            <div className="p-3 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30 mb-4">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase">Trigger Event</span>
                  <p className="text-sm text-foreground mt-0.5">{journey.trigger}</p>
                </div>
              </div>
            </div>

            {/* Stages */}
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              {journey.stages.map((stage, idx) => (
                <React.Fragment key={idx}>
                  <div className="flex-1 p-3 rounded-xl bg-background/60 border border-border/50">
                    <div className="flex items-center gap-2 mb-1">
                      <stage.icon className={`w-4 h-4 ${journey.iconColor}`} />
                      <span className="text-xs font-semibold text-foreground">{stage.stage}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{stage.description}</p>
                  </div>
                  {idx < journey.stages.length - 1 && (
                    <>
                      <div className="hidden sm:flex items-center justify-center">
                        <ArrowRight className="w-4 h-4 text-muted-foreground/50" />
                      </div>
                      <div className="flex sm:hidden items-center justify-center py-1">
                        <ArrowDown className="w-4 h-4 text-muted-foreground/50" />
                      </div>
                    </>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Outcome */}
            <div className="p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase">Outcome</span>
                  <p className="text-sm text-foreground mt-0.5">{journey.outcome}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 p-6 border border-primary/20">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <h4 className="font-semibold text-foreground mb-3">Journey Insights</h4>
          <p className="text-foreground leading-relaxed text-sm">
            All three journeys share a common pattern: a <span className="font-bold text-primary">document-related trigger</span> creates 
            urgency, followed by rapid evaluation where Hobson proves its value through <span className="font-bold text-primary">immediate, 
            tangible results</span>. The key to conversion is demonstrating time savings with the customer's own documents.
          </p>
        </div>
      </div>
    </div>
  );
};
