import React from 'react';
import { Settings, Users, Code, Shield, TrendingUp, CheckCircle2, AlertTriangle, Target } from 'lucide-react';

export const InternalCapabilityAssessmentVisual = () => {
  const capabilities = [
    {
      title: "Technical Infrastructure",
      icon: Code,
      color: "from-blue-500/10 to-blue-600/10",
      borderColor: "border-blue-200/50 dark:border-blue-800/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      bgCircle: "bg-blue-100 dark:bg-blue-900/30",
      strengths: [
        "Modern cloud-native architecture (Supabase, Vercel)",
        "Scalable vector database and RAG pipeline",
        "Secure document processing infrastructure",
        "API-first design enabling future integrations"
      ],
      gaps: [
        "Limited redundancy in AI provider dependencies",
        "Documentation and knowledge transfer processes"
      ]
    },
    {
      title: "Product & Development",
      icon: Settings,
      color: "from-purple-500/10 to-purple-600/10",
      borderColor: "border-purple-200/50 dark:border-purple-800/30",
      iconColor: "text-purple-600 dark:text-purple-400",
      bgCircle: "bg-purple-100 dark:bg-purple-900/30",
      strengths: [
        "Rapid iteration capability with modern stack",
        "User-centric design philosophy",
        "Referenced answers differentiator built-in",
        "Zero-onboarding experience validated"
      ],
      gaps: [
        "Limited automated testing coverage",
        "Feature prioritisation framework needed"
      ]
    },
    {
      title: "Team & Leadership",
      icon: Users,
      color: "from-emerald-500/10 to-emerald-600/10",
      borderColor: "border-emerald-200/50 dark:border-emerald-800/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      bgCircle: "bg-emerald-100 dark:bg-emerald-900/30",
      strengths: [
        "Deep Real Estate domain expertise",
        "Technical AI/ML capabilities in-house",
        "Lean, agile decision-making structure",
        "Strong founder-market fit"
      ],
      gaps: [
        "Sales and marketing capacity constraints",
        "Customer success function to be built"
      ]
    },
    {
      title: "Security & Compliance",
      icon: Shield,
      color: "from-amber-500/10 to-amber-600/10",
      borderColor: "border-amber-200/50 dark:border-amber-800/30",
      iconColor: "text-amber-600 dark:text-amber-400",
      bgCircle: "bg-amber-100 dark:bg-amber-900/30",
      strengths: [
        "GDPR-compliant data handling practices",
        "AI Privacy Policy and Data Breach Protocol",
        "Secure cloud infrastructure (SOC2 providers)",
        "Audit trail capabilities built-in"
      ],
      gaps: [
        "Formal ISO 27001 certification pending",
        "Penetration testing schedule to be formalised"
      ]
    },
    {
      title: "Go-to-Market",
      icon: TrendingUp,
      color: "from-rose-500/10 to-rose-600/10",
      borderColor: "border-rose-200/50 dark:border-rose-800/30",
      iconColor: "text-rose-600 dark:text-rose-400",
      bgCircle: "bg-rose-100 dark:bg-rose-900/30",
      strengths: [
        "Pilot programme with real customers",
        "Clear value proposition messaging",
        "Low-friction trial-to-paid pathway",
        "Industry network and relationships"
      ],
      gaps: [
        "Scalable lead generation processes",
        "Marketing automation infrastructure"
      ]
    },
    {
      title: "Operations & Support",
      icon: Target,
      color: "from-teal-500/10 to-teal-600/10",
      borderColor: "border-teal-200/50 dark:border-teal-800/30",
      iconColor: "text-teal-600 dark:text-teal-400",
      bgCircle: "bg-teal-100 dark:bg-teal-900/30",
      strengths: [
        "Lightweight support model validated",
        "Self-service documentation approach",
        "Usage monitoring and analytics",
        "Customer feedback loops established"
      ],
      gaps: [
        "Ticketing and SLA management system",
        "Onboarding playbooks for enterprise"
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 p-6 border border-primary/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Internal Capability Assessment</h3>
            <p className="text-muted-foreground mt-1">Evaluating organisational strengths and development areas</p>
          </div>
        </div>
      </div>

      {/* Capabilities Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {capabilities.map((capability, idx) => (
          <div 
            key={idx}
            className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${capability.color} p-5 border ${capability.borderColor}`}
          >
            <div className="flex items-start gap-3 mb-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${capability.bgCircle} ${capability.iconColor} flex-shrink-0`}>
                <capability.icon className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-foreground pt-2">{capability.title}</h4>
            </div>
            
            {/* Strengths */}
            <div className="mb-3">
              <p className="text-xs font-medium text-foreground mb-2 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Strengths
              </p>
              <ul className="space-y-1">
                {capability.strengths.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Gaps */}
            <div>
              <p className="text-xs font-medium text-foreground mb-2 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Development Areas
              </p>
              <ul className="space-y-1">
                {capability.gaps.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-emerald-500/10 p-6 border border-emerald-200/50 dark:border-emerald-800/30">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="text-foreground font-medium">
              Hobson has strong foundations in <span className="text-emerald-600 dark:text-emerald-400 font-bold">technical infrastructure</span>, <span className="text-emerald-600 dark:text-emerald-400 font-bold">product development</span>, and <span className="text-emerald-600 dark:text-emerald-400 font-bold">domain expertise</span>.
            </p>
            <p className="text-muted-foreground text-sm">
              Key investment priorities include scaling go-to-market capabilities, formalising security certifications, and building customer success infrastructure to support growth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
