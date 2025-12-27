import React from 'react';
import { User, Building2, Briefcase, UserCircle, Target, Clock, AlertTriangle, Lightbulb } from 'lucide-react';

interface Persona {
  id: number;
  name: string;
  role: string;
  segment: string;
  icon: React.ElementType;
  color: string;
  borderColor: string;
  iconColor: string;
  profile: string;
  painPoints: string[];
  goals: string[];
  hobsonValue: string;
}

export const CustomerPersonasVisual = () => {
  const personas: Persona[] = [
    {
      id: 1,
      name: "Sarah",
      role: "Operations Director",
      segment: "Large Portfolio Operator",
      icon: Building2,
      color: "from-blue-500/10 to-blue-600/10",
      borderColor: "border-blue-200/50 dark:border-blue-800/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      profile: "Oversees a team of 15 managing 500+ residential and commercial units. Spends significant time chasing information across legacy systems.",
      painPoints: [
        "Hours lost searching fragmented document repositories",
        "Board reports require manual data gathering from multiple sources",
        "Junior staff constantly need senior oversight for simple queries",
      ],
      goals: [
        "Reduce time-to-answer for operational queries",
        "Enable team self-sufficiency without adding headcount",
        "Improve accuracy and speed of compliance reporting",
      ],
      hobsonValue: "Instant access to portfolio-wide document intelligence, reducing dependency on power users.",
    },
    {
      id: 2,
      name: "James",
      role: "Property Manager",
      segment: "Medium-Sized Company",
      icon: Briefcase,
      color: "from-purple-500/10 to-purple-600/10",
      borderColor: "border-purple-200/50 dark:border-purple-800/30",
      iconColor: "text-purple-600 dark:text-purple-400",
      profile: "Manages 80 units across a growing portfolio. Works in a lean team where knowledge is often in people's heads rather than systems.",
      painPoints: [
        "Information scattered across emails, folders, and colleagues",
        "Onboarding new staff takes months due to tribal knowledge",
        "No time to implement heavy software solutions",
      ],
      goals: [
        "Centralise access to key documents without system overhaul",
        "Speed up asset reviews and audit preparation",
        "Reduce reliance on informal knowledge sharing",
      ],
      hobsonValue: "An instant-access layer over existing files, providing structure without disruption.",
    },
    {
      id: 3,
      name: "David",
      role: "Owner-Manager",
      segment: "Small Portfolio Owner",
      icon: User,
      color: "from-emerald-500/10 to-emerald-600/10",
      borderColor: "border-emerald-200/50 dark:border-emerald-800/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      profile: "Runs a 12-unit residential portfolio alongside other business interests. Handles everything from tenant queries to renewals personally.",
      painPoints: [
        "No admin support and limited time for document management",
        "Relies on paper files, email, and spreadsheets",
        "Dreads complex lease questions or legal preparation",
      ],
      goals: [
        "Quick answers without learning new software",
        "Simple organisation of key dates and deadlines",
        "Confidence when preparing notices or renewals",
      ],
      hobsonValue: "A simple digital assistant that just works—no training required.",
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
            <p className="text-muted-foreground mt-1">Representative profiles from each target segment</p>
          </div>
        </div>
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

            {/* Profile */}
            <p className="text-foreground text-sm mb-5 leading-relaxed">{persona.profile}</p>

            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              {/* Pain Points */}
              <div className="p-4 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-800/30">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <span className="font-semibold text-sm text-foreground">Pain Points</span>
                </div>
                <ul className="space-y-2">
                  {persona.painPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3 mt-1 flex-shrink-0 text-red-500" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Goals */}
              <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-semibold text-sm text-foreground">Goals</span>
                </div>
                <ul className="space-y-2">
                  {persona.goals.map((goal, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Lightbulb className="w-3 h-3 mt-1 flex-shrink-0 text-emerald-500" />
                      <span>{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Hobson Value */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex-shrink-0">
                  H
                </div>
                <p className="text-sm text-foreground font-medium">{persona.hobsonValue}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 p-6 border border-primary/20">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <p className="text-foreground leading-relaxed">
            These personas represent the <span className="font-bold text-primary">real users</span> validated through discovery interviews. 
            Each persona shares the same fundamental need: fast, reliable access to document-based answers without 
            changing their existing workflows or learning complex new tools.
          </p>
        </div>
      </div>
    </div>
  );
};
