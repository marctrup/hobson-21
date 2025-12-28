import React from 'react';
import { Globe, Landmark, TrendingUp, Cpu, Scale, Leaf, CheckCircle2, Users } from 'lucide-react';

export const PESTLEAnalysisVisual = () => {
  const keyDrivers = [
    "Fast, reliable document insight",
    "Transparent, referenced answers",
    "Minimal onboarding and implementation friction",
    "Affordable, measurable efficiency gains",
    "Reduced compliance and documentation risk"
  ];

  const pestleFactors = [
    {
      letter: "P",
      title: "Political",
      subtitle: "Rising Regulation & Data Governance",
      icon: Landmark,
      color: "from-blue-500/10 to-blue-600/10",
      borderColor: "border-blue-200/50 dark:border-blue-800/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      bgCircle: "bg-blue-100 dark:bg-blue-900/30",
      intro: "The global Real Estate environment is becoming increasingly tightly regulated, with increasing documentation requirements and scrutiny. Key drivers include:",
      items: [
        "Building Safety Act: more detailed record-keeping and audit-ready evidence",
        "Renters Reform Bill: more documentation around tenancy standards and landlord responsibilities",
        "EPC and sustainability rules: evidence-heavy energy and performance reporting",
        "AML (Anti-Money Laundering): stronger KYC and documentation checks",
        "Local authority processes: structured information for planning, licensing, and building control"
      ],
      additionalNote: "At the same time, data protection rules (GDPR, ICO guidance) demand secure handling, audit trails, and clear retention policies. Hobson's AI Privacy Policy and Data Breach Protocol are designed to support these requirements.",
      implication: "More regulation means more documents, higher compliance risk, and a sharper need for fast, accurate retrieval and auditability."
    },
    {
      letter: "E",
      title: "Economic",
      subtitle: "Cost Pressure, Efficiency & Market Cycles",
      icon: TrendingUp,
      color: "from-emerald-500/10 to-emerald-600/10",
      borderColor: "border-emerald-200/50 dark:border-emerald-800/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      bgCircle: "bg-emerald-100 dark:bg-emerald-900/30",
      intro: "Real Estate organisations face persistent economic challenges:",
      items: [
        "Cost constraints limit headcount growth",
        "Market cycles increase pressure to improve asset performance",
        "Lean teams must handle growing administrative workloads",
        "High labour costs make manual document handling expensive",
        "Large platform upgrades (e.g. MRI/Yardi) are often postponed, favouring lighter tools"
      ],
      additionalNote: "Industry research shows that AI and automation can deliver 10%+ NOI improvement through operational efficiencies and up to 20% cost savings from reduced manual work.",
      implication: "Hobson's low-friction, non-disruptive AI fits organisations looking to cut admin and reduce risk without funding a complete system replacement."
    },
    {
      letter: "S",
      title: "Social",
      subtitle: "AI Comfort, Trust & Work Culture",
      icon: Users,
      color: "from-purple-500/10 to-purple-600/10",
      borderColor: "border-purple-200/50 dark:border-purple-800/30",
      iconColor: "text-purple-600 dark:text-purple-400",
      bgCircle: "bg-purple-100 dark:bg-purple-900/30",
      intro: "Attitudes toward AI are warming, but trust is still fragile:",
      items: [
        "Growing openness to AI for operations, reporting, and document workflows",
        "Very low tolerance for error; small mistakes can destroy confidence",
        "High demand for transparency and explainability, especially in risk-averse contexts",
        "Hybrid working has increased reliance on shared drives, email, and unstructured files",
        "Teams are wary of tools that require significant process change or \"rip and replace\" systems"
      ],
      implication: "Hobson's strengths — referenced answers, simple interface, zero onboarding, and coexistence with current tools — map directly onto these trust and adoption requirements."
    },
    {
      letter: "T",
      title: "Technological",
      subtitle: "Fast-Moving AI & PropTech",
      icon: Cpu,
      color: "from-amber-500/10 to-amber-600/10",
      borderColor: "border-amber-200/50 dark:border-amber-800/30",
      iconColor: "text-amber-600 dark:text-amber-400",
      bgCircle: "bg-amber-100 dark:bg-amber-900/30",
      intro: "The technology landscape is evolving quickly:",
      items: [
        "Advances in LLMs, embeddings, RAG, and knowledge graphs make document understanding far more powerful",
        "Buyers increasingly expect verifiable, not black-box, AI",
        "Legacy PropTech moves slowly, creating a gap for AI-native assistants",
        "Cybersecurity expectations grow as more sensitive contracts and documents are digitised",
        "Demand rises for \"no integration\" tools that can be deployed quickly"
      ],
      additionalNote: "Hobson's architecture, combining vector databases, knowledge graphs, and quality checks, is designed to deliver reliable, explainable document intelligence.",
      implication: "Technological trends favour tools like Hobson that provide modern AI capability without heavy integration overhead."
    },
    {
      letter: "L",
      title: "Legal",
      subtitle: "Compliance, Data & Documentation Risk",
      icon: Scale,
      color: "from-rose-500/10 to-rose-600/10",
      borderColor: "border-rose-200/50 dark:border-rose-800/30",
      iconColor: "text-rose-600 dark:text-rose-400",
      bgCircle: "bg-rose-100 dark:bg-rose-900/30",
      intro: "Legal frameworks reinforce the need for structured, accurate document handling:",
      items: [
        "GDPR demands explicit data handling, transparency, and security",
        "Audits require clear evidence of where information came from and how it was used",
        "Contractual risk rises when key details are missed or buried in unstructured content",
        "Emerging AI governance emphasises safety, explainability, and reduced hallucination"
      ],
      additionalNote: "Hobson's referenced outputs, combined with privacy and breach policies, help buyers meet these expectations and reduce legal exposure.",
      implication: "Legal pressure favours AI tools that are traceable, auditable, and designed around accuracy."
    },
    {
      letter: "E",
      title: "Environmental",
      subtitle: "ESG Reporting & Paper Reduction",
      icon: Leaf,
      color: "from-teal-500/10 to-teal-600/10",
      borderColor: "border-teal-200/50 dark:border-teal-800/30",
      iconColor: "text-teal-600 dark:text-teal-400",
      bgCircle: "bg-teal-100 dark:bg-teal-900/30",
      intro: "Environmental factors are secondary drivers, but still important:",
      items: [
        "ESG reporting adds another layer of documentation and evidence",
        "Pressure to reduce physical paperwork encourages digital document workflows",
        "Energy-performance obligations (e.g. EPCs) require structured, retrievable data for reporting"
      ],
      implication: "By making it easier to extract and reuse information from documents, Hobson supports more efficient ESG reporting and digital sustainability."
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
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">PESTLE Analysis</h3>
              <p className="text-muted-foreground mt-1">Macro-environmental factors shaping the UK PropTech landscape</p>
            </div>
          </div>
          <p className="text-sm text-foreground">
            Hobson operates in the Real Estate sector, which is highly regulated, document-heavy, and under pressure to digitise. The following PESTLE review shows why a tool that offers clarity, accuracy, and affordable AI alongside existing systems is increasingly necessary.
          </p>
        </div>
      </div>

      {/* Key Drivers Summary */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/30 p-5 border border-slate-200 dark:border-slate-700/50">
        <p className="text-sm text-foreground mb-3">
          Across all dimensions — political, economic, social, technological, legal, and environmental — the environment is shifting towards tools that provide:
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {keyDrivers.map((driver, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-muted-foreground">{driver}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-foreground mt-4 font-medium">
          Hobson's design and positioning are closely aligned with these pressures, making its solution both timely and strategically relevant.
        </p>
      </div>

      {/* PESTLE Factors */}
      <div className="space-y-4">
        {pestleFactors.map((factor, idx) => (
          <div 
            key={idx}
            className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${factor.color} p-5 border ${factor.borderColor}`}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${factor.bgCircle} ${factor.iconColor} flex-shrink-0`}>
                <factor.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-lg font-bold ${factor.iconColor}`}>{factor.letter}</span>
                  <span className="text-muted-foreground">—</span>
                  <h4 className="font-semibold text-foreground">{factor.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground">{factor.subtitle}</p>
              </div>
            </div>
            
            <p className="text-sm text-foreground mb-3">{factor.intro}</p>
            
            <ul className="space-y-1.5 mb-3">
              {factor.items.map((item, itemIdx) => (
                <li key={itemIdx} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className={`w-1.5 h-1.5 rounded-full ${factor.iconColor.replace('text-', 'bg-')} mt-1.5 flex-shrink-0`} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {factor.additionalNote && (
              <p className="text-sm text-foreground mb-3">{factor.additionalNote}</p>
            )}

            <div className="pt-3 border-t border-current/10">
              <p className="text-sm">
                <span className="font-semibold text-foreground">Implication: </span>
                <span className="text-muted-foreground">{factor.implication}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
