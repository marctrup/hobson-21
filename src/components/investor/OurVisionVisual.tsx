import React from "react";
import { MessageSquare, FileText, ClipboardCheck, CheckCircle, Zap, BarChart3, Shield, Activity, ArrowRight } from "lucide-react";

const OurVisionVisual: React.FC = () => {
  const stages = [
    {
      label: "Reactive Agent",
      timeframe: "Today",
      description: "AI retrieves when asked with accuracy",
      color: "from-bone-wash to-bone",
      borderColor: "border-bone",
      accentColor: "bg-bone",
      textColor: "text-charcoal",
      icons: [
        { Icon: MessageSquare, label: "Prompts" },
        { Icon: FileText, label: "Retrieves" },
      ],
      visualNote: "Human-led, AI responds",
    },
    {
      label: "Proactive Agent",
      timeframe: "~1 Year",
      description: "AI suggests & prepares, humans approve",
      color: "from-paper/70 to-paper",
      borderColor: "border-bone",
      accentColor: "bg-bone",
      textColor: "text-charcoal",
      icons: [
        { Icon: ClipboardCheck, label: "Drafts" },
        { Icon: CheckCircle, label: "Approvals" },
      ],
      visualNote: "AI prepares, human confirms",
    },
    {
      label: "Autonomous Agent",
      timeframe: "3–5 Years",
      description: "AI executes & reports outcomes",
      color: "from-primary/20 to-bone",
      borderColor: "border-primary/40",
      accentColor: "bg-bone",
      textColor: "text-primary",
      icons: [
        { Icon: Zap, label: "Executes" },
        { Icon: BarChart3, label: "Reports" },
        { Icon: Shield, label: "Audits" },
      ],
      visualNote: "AI operates, human monitors",
    },
  ];

  return (
    <div className="bg-white rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-ink mb-2">Our Vision</h3>
        <p className="text-lg text-charcoal font-medium">
          The Evolution of Hobson AI
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Stages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 items-stretch">
          {stages.map((stage, index) => (
            <div key={index} className="flex flex-col items-center h-full">
              {/* Card */}
              <div className={`w-full h-full bg-gradient-to-br ${stage.color} ${stage.borderColor} border-2 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col`}>
                {/* Timeframe Badge */}
                <div className="flex justify-center mb-3">
                  <span className={`${stage.accentColor} ${stage.textColor} text-xs font-bold px-3 py-1 rounded-full`}>
                    {stage.timeframe}
                  </span>
                </div>

                {/* Stage Label */}
                <h4 className={`text-lg font-bold ${stage.textColor} text-center mb-3`}>
                  {stage.label}
                </h4>

                {/* Icons Row */}
                <div className="flex justify-center gap-3 mb-4">
                  {stage.icons.map((item, iconIndex) => (
                    <div key={iconIndex} className="flex flex-col items-center gap-1">
                      <div className={`p-2 bg-white/80 rounded-lg shadow-sm`}>
                        <item.Icon className={`w-5 h-5 ${stage.textColor}`} />
                      </div>
                      <span className="text-xs text-ink-muted">{item.label}</span>
                    </div>
                  ))}
                </div>

                {/* Description */}
                <p className="text-sm text-charcoal text-center font-medium">
                  {stage.description}
                </p>

                {/* Visual Note */}
                <div className="mt-3 pt-3 border-t border-bone/50">
                  <p className="text-xs text-ink-muted text-center italic flex items-center justify-center gap-1">
                    <Activity className="w-3 h-3" />
                    {stage.visualNote}
                  </p>
                </div>
              </div>

              {/* Arrow (mobile) */}
              {index < stages.length - 1 && (
                <div className="md:hidden my-3">
                  <ArrowRight className="w-6 h-6 text-ink-muted rotate-90" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Progression Indicators */}
      <div className="mt-8 pt-6 border-t border-faint-rule">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs text-ink-muted uppercase tracking-wide mb-1">Automation</div>
            <div className="flex justify-center gap-1">
              <div className="w-2 h-2 rounded-full bg-bone-strong" />
              <div className="w-2 h-2 rounded-full bg-ink-faint" />
              <div className="w-2 h-2 rounded-full bg-primary" />
            </div>
            <div className="text-xs text-ink-muted mt-1">Increasing</div>
          </div>
          <div>
            <div className="text-xs text-ink-muted uppercase tracking-wide mb-1">Human Effort</div>
            <div className="flex justify-center gap-1">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <div className="w-2 h-2 rounded-full bg-ink-faint" />
              <div className="w-2 h-2 rounded-full bg-bone-strong" />
            </div>
            <div className="text-xs text-ink-muted mt-1">Decreasing</div>
          </div>
          <div>
            <div className="text-xs text-ink-muted uppercase tracking-wide mb-1">Scale</div>
            <div className="flex justify-center gap-1">
              <div className="w-2 h-2 rounded-full bg-bone-strong" />
              <div className="w-2 h-2 rounded-full bg-ink-faint" />
              <div className="w-2 h-2 rounded-full bg-primary" />
            </div>
            <div className="text-xs text-ink-muted mt-1">Expanding</div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default OurVisionVisual;
