import React from "react";
import { MessageSquare, FileText, ClipboardCheck, CheckCircle, Zap, BarChart3, Shield, Activity, ArrowRight } from "lucide-react";

const OurVisionVisual: React.FC = () => {
  const stages = [
    {
      label: "Reactive Assistant",
      timeframe: "Today",
      description: "AI helps when asked with accuracy",
      color: "from-slate-100 to-slate-200",
      borderColor: "border-slate-300",
      accentColor: "bg-slate-500",
      textColor: "text-slate-700",
      icons: [
        { Icon: MessageSquare, label: "Prompts" },
        { Icon: FileText, label: "Documents" },
      ],
      visualNote: "Human-led, AI responds",
    },
    {
      label: "Proactive Assistant",
      timeframe: "~1 Year",
      description: "AI suggests & prepares, humans approve",
      color: "from-purple-100 to-purple-200",
      borderColor: "border-purple-300",
      accentColor: "bg-purple-500",
      textColor: "text-purple-700",
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
      color: "from-primary/20 to-violet-200",
      borderColor: "border-primary/40",
      accentColor: "bg-primary",
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
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Our Vision</h3>
        <p className="text-lg text-purple-600 font-medium">
          The Evolution of Real Estate AI
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Stages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {stages.map((stage, index) => (
            <div key={index} className="flex flex-col items-center">
              {/* Card */}
              <div className={`w-full bg-gradient-to-br ${stage.color} ${stage.borderColor} border-2 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300`}>
                {/* Timeframe Badge */}
                <div className="flex justify-center mb-3">
                  <span className={`${stage.accentColor} text-white text-xs font-bold px-3 py-1 rounded-full`}>
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
                      <span className="text-xs text-gray-500">{item.label}</span>
                    </div>
                  ))}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 text-center font-medium">
                  {stage.description}
                </p>

                {/* Visual Note */}
                <div className="mt-3 pt-3 border-t border-gray-200/50">
                  <p className="text-xs text-gray-500 text-center italic flex items-center justify-center gap-1">
                    <Activity className="w-3 h-3" />
                    {stage.visualNote}
                  </p>
                </div>
              </div>

              {/* Connector dot */}
              <div className={`hidden md:block w-4 h-4 ${stage.accentColor} rounded-full mt-4 shadow-md border-2 border-white z-20 relative`} />

              {/* Arrow (mobile) */}
              {index < stages.length - 1 && (
                <div className="md:hidden my-3">
                  <ArrowRight className="w-6 h-6 text-purple-400 rotate-90" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Progress Line - positioned to align with dot centers */}
        <div className="hidden md:block absolute bottom-[8px] left-[calc(16.67%-8px)] right-[calc(16.67%-8px)] h-1 bg-gradient-to-r from-slate-400 via-purple-400 to-primary z-10" />
      </div>

      {/* Progression Indicators */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Automation</div>
            <div className="flex justify-center gap-1">
              <div className="w-2 h-2 rounded-full bg-slate-300" />
              <div className="w-2 h-2 rounded-full bg-purple-400" />
              <div className="w-2 h-2 rounded-full bg-primary" />
            </div>
            <div className="text-xs text-gray-500 mt-1">Increasing</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Human Effort</div>
            <div className="flex justify-center gap-1">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <div className="w-2 h-2 rounded-full bg-purple-400" />
              <div className="w-2 h-2 rounded-full bg-slate-300" />
            </div>
            <div className="text-xs text-gray-500 mt-1">Decreasing</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Scale</div>
            <div className="flex justify-center gap-1">
              <div className="w-2 h-2 rounded-full bg-slate-300" />
              <div className="w-2 h-2 rounded-full bg-purple-400" />
              <div className="w-2 h-2 rounded-full bg-primary" />
            </div>
            <div className="text-xs text-gray-500 mt-1">Expanding</div>
          </div>
        </div>
      </div>

      {/* Summary Footer */}
      <div className="mt-6 bg-gradient-to-r from-slate-50 via-purple-50 to-primary/10 rounded-xl p-4 border border-gray-100">
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 text-sm">
          <span className="font-medium text-slate-600">Today: Responds</span>
          <ArrowRight className="w-4 h-4 text-purple-400 hidden sm:block" />
          <span className="font-medium text-purple-600">1 Year: Anticipates</span>
          <ArrowRight className="w-4 h-4 text-primary hidden sm:block" />
          <span className="font-semibold text-primary">3–5 Years: Executes</span>
        </div>
      </div>
    </div>
  );
};

export default OurVisionVisual;
