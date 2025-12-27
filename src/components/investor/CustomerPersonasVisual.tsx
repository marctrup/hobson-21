import React from 'react';
import { User, Building2, Briefcase, UserCircle, Target, AlertTriangle, CheckCircle2, Brain, Zap } from 'lucide-react';

interface Persona {
  id: number;
  name: string;
  role: string;
  segment: string;
  icon: React.ElementType;
  color: string;
  borderColor: string;
  iconColor: string;
  description: string;
  goals: string[];
  frustrations: string[];
  workflows: string[];
  psychographics: {
    type: string;
    description: string;
  };
  decisionPower: string[];
  objections?: string[];
  success: string[];
}

export const CustomerPersonasVisual = () => {
  const personas: Persona[] = [
    {
      id: 1,
      name: "Leigh",
      role: "COO, Large Portfolio Operator",
      segment: "Primary Target",
      icon: Building2,
      color: "from-blue-500/10 to-blue-600/10",
      borderColor: "border-blue-200/50 dark:border-blue-800/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      description: "Responsible for operational efficiency, compliance, and reporting across an extensive, complex property portfolio to streamline information access across the organisation.",
      goals: [
        "Increase team efficiency without adding complexity or headcount",
        "Reduce operational risk caused by manual work and missed details",
        "Support junior staff with tools that enhance independence and confidence",
      ],
      frustrations: [
        "Fragmented systems and inconsistent storage of documents across CRMs, drives, and inboxes",
        "High-pressure response demands from internal stakeholders and investors",
        "Too much time wasted retrieving basic information from leases and service agreements",
        "Risk of errors in analysis, summaries, and reporting due to manual workflows",
      ],
      workflows: [
        "Reviewing and approving internal and board-level reports",
        "Responding to compliance, audit, and investor questions",
        "Overseeing operational processes and cross-team communication",
        "Ensuring data accuracy across multiple systems and document repositories",
      ],
      psychographics: {
        type: "Achiever",
        description: "Goal-oriented, professional, values stability, efficiency, and credibility. Prefers reliable tools that reduce risk and reinforce professional reputation.",
      },
      decisionPower: [
        "Final approval for operational tools and workflow changes",
        "Controls budgets for technology adoption in operations",
        "Drives decisions around compliance, reporting infrastructure, and process change",
      ],
      success: [
        "Information retrieved instantly in high-pressure moments",
        "Fewer reporting errors and audit queries",
        "Faster responses to stakeholders and board members",
        "Teams feeling confident, supported, and less dependent on 'super users'",
        "Technology that improves clarity without disrupting established workflows",
      ],
    },
    {
      id: 2,
      name: "James",
      role: "Head of Asset Management, Medium-Sized Company",
      segment: "Secondary Target",
      icon: Briefcase,
      color: "from-purple-500/10 to-purple-600/10",
      borderColor: "border-purple-200/50 dark:border-purple-800/30",
      iconColor: "text-purple-600 dark:text-purple-400",
      description: "Head of Asset Management at a mid-sized, agile property company, managing a growing portfolio with a lean team.",
      goals: [
        "Enable lean growth without proportional increases in headcount",
        "Free up time for strategic asset decisions instead of manual document searching",
        "Improve visibility and confidence across documents and shared drives",
      ],
      frustrations: [
        "Limited team capacity and bandwidth",
        "Excessive time spent digging through shared drives, emails, and old folders",
        "Pressure to scale operations efficiently with existing resources",
        "Strain caused by the lack of a centralised, 'single view' of information",
      ],
      workflows: [
        "Reviewing asset performance and preparing summary packs",
        "Producing internal updates and board-ready reports",
        "Coordinating with property managers, finance, and analysts",
        "Onboarding new staff into scattered, informal data systems",
      ],
      psychographics: {
        type: "Thinker",
        description: "Analytical, informed, and value-driven. Makes decisions based on evidence, quality, and long-term stability. Prefers tools with clear logic and structured outcomes.",
      },
      decisionPower: [
        "Strong influence over tool selection for operational and asset workflows",
        "Responsible for evaluating demos and reporting effectiveness to senior leadership",
        "Recommends tools that make the team more effective without creating complexity",
      ],
      objections: [
        "Budget concerns and pressure to justify new subscriptions",
        "Desire to avoid 'yet another tool to manage'",
        "Belief that current workload, while painful, is still manageable",
      ],
      success: [
        "A lean team that operates efficiently, even as the portfolio grows",
        "Reduced time spent on repetitive information retrieval tasks",
        "Confidence that reports are based on accurate, accessible data",
        "Technology that scales with the business instead of becoming a bottleneck",
      ],
    },
    {
      id: 3,
      name: "Priya",
      role: "Owner-Manager, Small Portfolio",
      segment: "Future Target",
      icon: User,
      color: "from-emerald-500/10 to-emerald-600/10",
      borderColor: "border-emerald-200/50 dark:border-emerald-800/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      description: "Owner-Manager responsible for every operational, legal, and financial aspect of a small property portfolio.",
      goals: [
        "Stay organised with minimal effort and minimal tools",
        "Save time by avoiding manual searches through email and paper files",
        "Present a more professional operation without adopting complex systems",
      ],
      frustrations: [
        "Juggling multiple roles simultaneously (operations, finance, compliance, relationships)",
        "No structured or centralised process for storing documents",
        "Wasting time trying to find tenant, lease, or date information when issues arise",
        "Feeling overwhelmed by admin tasks on top of core responsibilities",
      ],
      workflows: [
        "Managing renewals, rent reviews, and tenant issues",
        "Preparing documents for solicitors, lenders, or agents",
        "Locating key lease terms for everyday decision-making",
        "Running operations largely from email threads, folders, and spreadsheets",
      ],
      psychographics: {
        type: "Striver",
        description: "Motivated by achievement but constrained by limited resources. Aspirational and brand-conscious, responds strongly to solutions that feel simple, modern, and empowering.",
      },
      decisionPower: [
        "Sole decision-maker for budget, technology, and process choices",
        "Highly influenced by ease of onboarding, simplicity, and clear pricing",
      ],
      objections: [
        "Fear of complexity, hidden costs, or 'being locked in'",
        "Concern about technical jargon or a steep learning curve",
        "Belief that AI tools are primarily for larger companies or enterprises",
      ],
      success: [
        "Running operations more professionally with very little extra effort",
        "Finding information instantly without digging through old email chains",
        "A simple, affordable tool that feels built specifically for small operators",
        "More time freed up for higher-value activities and personal life",
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500/10 via-teal-500/5 to-teal-500/10 p-6 border border-teal-200/50 dark:border-teal-800/30">
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <UserCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Customer Personas</h3>
            <p className="text-muted-foreground mt-1">Individual decision-makers based on discovery conversations and early product feedback</p>
          </div>
        </div>
      </div>

      {/* Intro */}
      <div className="p-5 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/30 border border-slate-200 dark:border-slate-700/50">
        <p className="text-foreground leading-relaxed">
          Building on the three segments defined, the following personas translate those organisational types into 
          <span className="font-bold text-primary"> individual decision-makers and users</span>. Each persona is based on 
          honest discovery conversations and early product feedback, reflecting distinct motivations, behaviours, and buying considerations.
        </p>
      </div>

      {/* Personas */}
      <div className="space-y-6">
        {personas.map((persona) => (
          <div key={persona.id} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${persona.color} p-6 border ${persona.borderColor}`}>
            {/* Persona Header */}
            <div className="flex items-start gap-4 mb-5">
              <div className={`flex items-center justify-center w-14 h-14 rounded-full bg-background/80 ${persona.iconColor}`}>
                <persona.icon className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h4 className="font-bold text-lg text-foreground">{persona.name}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-background/80 ${persona.iconColor}`}>
                    {persona.segment}
                  </span>
                </div>
                <p className="text-muted-foreground font-medium">{persona.role}</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-foreground text-sm mb-5 leading-relaxed">{persona.description}</p>

            {/* Goals */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className={`w-4 h-4 ${persona.iconColor}`} />
                <span className="font-semibold text-sm text-foreground">Goals</span>
              </div>
              <ul className="space-y-1 ml-6">
                {persona.goals.map((goal, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground list-disc">{goal}</li>
                ))}
              </ul>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              {/* Frustrations */}
              <div className="p-4 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-800/30">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <span className="font-semibold text-sm text-foreground">Frustrations</span>
                </div>
                <ul className="space-y-1">
                  {persona.frustrations.map((item, idx) => (
                    <li key={idx} className="text-xs text-muted-foreground list-disc ml-4">{item}</li>
                  ))}
                </ul>
              </div>

              {/* Workflows */}
              <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-800/30">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className={`w-4 h-4 ${persona.iconColor}`} />
                  <span className="font-semibold text-sm text-foreground">Typical Workflows</span>
                </div>
                <ul className="space-y-1">
                  {persona.workflows.map((item, idx) => (
                    <li key={idx} className="text-xs text-muted-foreground list-disc ml-4">{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Psychographics */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-primary" />
                <span className="font-semibold text-sm text-foreground">Psychographics (VALS: {persona.psychographics.type})</span>
              </div>
              <p className="text-xs text-muted-foreground">{persona.psychographics.description}</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              {/* Decision Power */}
              <div className="p-4 rounded-xl bg-background/60 border border-border/50">
                <span className="font-semibold text-sm text-foreground block mb-2">Decision-Making Power</span>
                <ul className="space-y-1">
                  {persona.decisionPower.map((item, idx) => (
                    <li key={idx} className="text-xs text-muted-foreground list-disc ml-4">{item}</li>
                  ))}
                </ul>
              </div>

              {/* Objections (if any) */}
              {persona.objections && (
                <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30">
                  <span className="font-semibold text-sm text-foreground block mb-2">Objections</span>
                  <ul className="space-y-1">
                    {persona.objections.map((item, idx) => (
                      <li key={idx} className="text-xs text-muted-foreground list-disc ml-4">{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Success */}
            <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="font-semibold text-sm text-foreground">What "Success" Looks Like</span>
              </div>
              <ul className="space-y-1">
                {persona.success.map((item, idx) => (
                  <li key={idx} className="text-xs text-muted-foreground list-disc ml-4">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 p-6 border border-primary/20">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative space-y-4">
          <h4 className="font-semibold text-foreground">Summary of Persona Insights</h4>
          <p className="text-foreground leading-relaxed text-sm">
            Across Leigh, James, and Priya, the shared underlying issue is the <span className="font-bold text-primary">time and risk 
            involved in searching unstructured documents</span>.
          </p>
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground"><span className="font-medium text-foreground">Leigh (Large Operator):</span> Wants efficiency, accuracy, and risk reduction at scale.</p>
            <p className="text-muted-foreground"><span className="font-medium text-foreground">James (Medium Operator):</span> Wants scalability and clarity without extra headcount or complexity.</p>
            <p className="text-muted-foreground"><span className="font-medium text-foreground">Priya (Small Owner-Manager):</span> Wants simplicity, organisation, and professionalism with no setup burden.</p>
          </div>
          <p className="text-foreground leading-relaxed text-sm font-medium">
            Hobson personas, linked directly to the segments for targeting, product roadmap, messaging, and go-to-market focus: 
            <span className="text-primary"> enterprise first</span> for high-value validation, then <span className="text-primary">agile mid-market</span>, 
            and ultimately <span className="text-primary">scalable self-serve</span> for long-tail owner-managers.
          </p>
        </div>
      </div>
    </div>
  );
};
