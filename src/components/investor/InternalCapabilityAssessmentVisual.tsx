import React from 'react';
import { Settings, Users, Code, Shield, TrendingUp, CheckCircle2, AlertTriangle, Target, Lightbulb, Building, Cpu, Eye, Handshake, Zap } from 'lucide-react';

export const InternalCapabilityAssessmentVisual = () => {
  const strengths = [
    {
      title: "Team Skills Across Real Estate, Software, and AI",
      icon: Users,
      color: "from-blue-500/10 to-blue-600/10",
      borderColor: "border-blue-200/50 dark:border-blue-800/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      bgCircle: "bg-blue-100 dark:bg-blue-900/30",
      subsections: [
        {
          subtitle: "Real Estate Expertise",
          intro: "The founding team has over 30 years of experience in asset management, operations, and portfolio governance, giving Hobson a grounded understanding of:",
          items: ["Client workflows", "Compliance and reporting pressures", "Document types and structures", "The practical pain points Hobson is solving"]
        },
        {
          subtitle: "Software & Product Experience",
          intro: "The team has previously built, scaled, and exited a leading UK Real Estate software platform, bringing skills in:",
          items: ["Product design and UX", "MVP development and iteration", "Go-to-market strategy"]
        },
        {
          subtitle: "AI & Technical Skills",
          intro: "Hobson's technical team includes specialists in:",
          items: ["Large Language Models (LLMs)", "RAG (retrieval-augmented generation)", "Knowledge graphs", "Vector databases", "Prompt design and quality control"]
        }
      ],
      note: "These capabilities are essential to building an AI product that is accurate, referenceable, and safe for a risk-aware sector."
    },
    {
      title: "Technical Capabilities",
      icon: Cpu,
      color: "from-purple-500/10 to-purple-600/10",
      borderColor: "border-purple-200/50 dark:border-purple-800/30",
      iconColor: "text-purple-600 dark:text-purple-400",
      bgCircle: "bg-purple-100 dark:bg-purple-900/30",
      subsections: [
        {
          subtitle: "Document-First Architecture",
          intro: "Hobson is designed to work directly from client documents, using:",
          items: ["Structured data extraction", "A hybrid RAG + knowledge-graph pipeline", "Quality-checking layers", "Transparent, reference-based outputs"]
        },
        {
          subtitle: "Lightweight Deployment",
          intro: "The platform is:",
          items: ["Zero-integration by default", "Quick to start using", "Designed to avoid workflow disruption"]
        }
      ],
      note: "This supports the promise of 'Disruption Without Displacement' — Hobson enhances existing systems rather than replacing them."
    },
    {
      title: "Brand Maturity and Positioning Strength",
      icon: Eye,
      color: "from-emerald-500/10 to-emerald-600/10",
      borderColor: "border-emerald-200/50 dark:border-emerald-800/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      bgCircle: "bg-emerald-100 dark:bg-emerald-900/30",
      intro: "Despite being early-stage, Hobson's brand is already clear and distinctive:",
      items: [
        "The owl signals wisdom, clarity, and trusted guidance",
        "Messaging focuses on clarity, simplicity, affordability, and non-disruption",
        "Early client conversations confirm strong resonance with this narrative"
      ],
      note: "Hobson is deliberately positioned as the 'calm AI assistant' — a partner in clarity, not another complex platform."
    },
    {
      title: "Access to Customers",
      icon: Handshake,
      color: "from-amber-500/10 to-amber-600/10",
      borderColor: "border-amber-200/50 dark:border-amber-800/30",
      iconColor: "text-amber-600 dark:text-amber-400",
      bgCircle: "bg-amber-100 dark:bg-amber-900/30",
      intro: "Hobson benefits from:",
      items: [
        "Direct relationships with large portfolio operators",
        "The founding team's established reputation",
        "Warm introductions through industry networks",
        "Early adopters willing to co-shape the MVP"
      ],
      note: "This gives a strong foundation for feedback, iteration, and early proof points."
    },
    {
      title: "Clear Differentiators",
      icon: Zap,
      color: "from-rose-500/10 to-rose-600/10",
      borderColor: "border-rose-200/50 dark:border-rose-800/30",
      iconColor: "text-rose-600 dark:text-rose-400",
      bgCircle: "bg-rose-100 dark:bg-rose-900/30",
      intro: "Hobson stands out through:",
      items: [
        "Document-Native AI: Focused on extracting clarity from documents themselves, rather than primarily automating communication or CRM workflows",
        "Referenced Answers: Every answer is tied back to its source, which is crucial in a risk-averse environment",
        "'No Replacement' Positioning: Works alongside existing systems, lowering both political and operational friction",
        "Accessibility and Affordability: Makes advanced AI available to SMB landlords and mid-sized operators, not just large enterprises",
        "Speed & Simplicity: Tackles document overload without training, heavy rollout, or organisational resistance"
      ]
    }
  ];

  const gaps = [
    {
      title: "Brand Visibility and Reach",
      items: ["Limited social media presence on LinkedIn, events, and forums", "Low awareness in a noisy PropTech and AI space"],
      need: "Thought leadership, case studies, and systematic visibility"
    },
    {
      title: "Technical Scaling",
      items: ["Hybrid RAG + knowledge-graph pipeline is powerful but still maturing", "Performance must be robust across diverse document sets"],
      need: "Ongoing fine-tuning and expanded testing"
    },
    {
      title: "Product Breadth",
      items: ["Current focus is on retrieval and extraction", "Competitors also offer analytics, automation, or communication tools"],
      need: "Gradual expansion into proactive insight and workflow support"
    },
    {
      title: "Customer Support Infrastructure",
      items: ["Documentation and onboarding flows are still light", "Processes for resolution and customer success are emerging"],
      need: "Structured customer success and support frameworks"
    },
    {
      title: "Resource Constraints",
      items: ["As a startup, Hobson must prioritise where to invest time and capital", "Scaling marketing, support, and development will require funding"],
      need: "Investment to support systematic growth"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 p-6 border border-primary/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-start gap-4 mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Internal Capability Assessment</h3>
              <p className="text-muted-foreground mt-1">Evaluating organisational strengths and development areas</p>
            </div>
          </div>
          <p className="text-sm text-foreground">
            Hobson combines deep domain knowledge, strong technical design, and a differentiated brand aligned with an honest and urgent market need. Hobson is a young company with deep experience in Real Estate operations, software, and AI. Its mission, "Innovation Without Disruption," is reflected in how the product is built, how it behaves, and how the team works with early clients.
          </p>
        </div>
      </div>

      {/* Key Message */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/30 p-5 border border-slate-200 dark:border-slate-700/50">
        <p className="text-sm text-foreground font-medium">
          Hobson is well-placed to deliver innovation without disruption in a sector that urgently needs clarity and efficiency in document management.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          This assessment covers the main internal strengths and the gaps that must be addressed to scale effectively.
        </p>
      </div>

      {/* Strengths Section */}
      <div className="space-y-4">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          Strengths
        </h4>
        
        {strengths.map((strength, idx) => (
          <div 
            key={idx}
            className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${strength.color} p-5 border ${strength.borderColor}`}
          >
            <div className="flex items-start gap-3 mb-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${strength.bgCircle} ${strength.iconColor} flex-shrink-0`}>
                <strength.icon className="w-5 h-5" />
              </div>
              <h5 className="font-semibold text-foreground pt-2">{idx + 1}. {strength.title}</h5>
            </div>

            {strength.subsections ? (
              <div className="space-y-4">
                {strength.subsections.map((sub, subIdx) => (
                  <div key={subIdx}>
                    <p className="text-sm font-medium text-foreground mb-1">{sub.subtitle}</p>
                    <p className="text-sm text-muted-foreground mb-2">{sub.intro}</p>
                    <ul className="space-y-1 ml-4">
                      {sub.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className={`w-1.5 h-1.5 rounded-full ${strength.iconColor.replace('text-', 'bg-')} mt-1.5 flex-shrink-0`} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {strength.intro && <p className="text-sm text-muted-foreground mb-2">{strength.intro}</p>}
                <ul className="space-y-1">
                  {strength.items?.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className={`w-1.5 h-1.5 rounded-full ${strength.iconColor.replace('text-', 'bg-')} mt-1.5 flex-shrink-0`} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {strength.note && (
              <p className="text-sm text-foreground mt-3 italic">{strength.note}</p>
            )}
          </div>
        ))}
      </div>

      {/* Gaps Section */}
      <div className="space-y-4">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          Limitations & Gaps
        </h4>
        <p className="text-sm text-muted-foreground">Despite strong foundations, several gaps must be addressed:</p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gaps.map((gap, idx) => (
            <div 
              key={idx}
              className="relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/10 p-4 border border-amber-200/50 dark:border-amber-800/30"
            >
              <h5 className="font-semibold text-foreground text-sm mb-2">{gap.title}</h5>
              <ul className="space-y-1 mb-3">
                {gap.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2 border-t border-amber-200/50 dark:border-amber-700/30">
                <p className="text-xs">
                  <span className="font-medium text-foreground">Need: </span>
                  <span className="text-muted-foreground">{gap.need}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
