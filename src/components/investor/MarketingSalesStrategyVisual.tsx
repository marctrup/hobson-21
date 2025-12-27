import React from 'react';
import { Target, Users, Megaphone, TrendingUp, Handshake, Globe, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

export const MarketingSalesStrategyVisual = () => {
  const channels = [
    { 
      icon: Users, 
      title: "Direct Sales", 
      description: "Targeted outreach to property management companies and landlords",
      color: "from-blue-500/10 to-blue-600/10",
      borderColor: "border-blue-200/50 dark:border-blue-800/30",
      iconColor: "text-blue-600 dark:text-blue-400"
    },
    { 
      icon: Handshake, 
      title: "Strategic Partnerships", 
      description: "Integrations with property management platforms and estate agents",
      color: "from-purple-500/10 to-purple-600/10",
      borderColor: "border-purple-200/50 dark:border-purple-800/30",
      iconColor: "text-purple-600 dark:text-purple-400"
    },
    { 
      icon: Globe, 
      title: "Digital Marketing", 
      description: "SEO, content marketing, and targeted campaigns for real estate professionals",
      color: "from-emerald-500/10 to-emerald-600/10",
      borderColor: "border-emerald-200/50 dark:border-emerald-800/30",
      iconColor: "text-emerald-600 dark:text-emerald-400"
    },
    { 
      icon: Megaphone, 
      title: "Industry Events", 
      description: "PropTech conferences, trade shows, and networking events",
      color: "from-amber-500/10 to-amber-600/10",
      borderColor: "border-amber-200/50 dark:border-amber-800/30",
      iconColor: "text-amber-600 dark:text-amber-400"
    },
  ];

  const salesProcess = [
    { step: "Discovery", description: "Identify pain points and document challenges" },
    { step: "Demo", description: "Personalised demonstration with client documents" },
    { step: "Trial", description: "Free pilot period to prove value" },
    { step: "Onboard", description: "Seamless setup and training" },
  ];

  const keyMetrics = [
    { label: "Target CAC", value: "£500", subtitle: "Customer acquisition cost" },
    { label: "LTV:CAC Ratio", value: "10:1", subtitle: "Target lifetime value ratio" },
    { label: "Sales Cycle", value: "30 days", subtitle: "Average time to close" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 p-6 border border-primary/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Go-to-Market Strategy</h3>
            <p className="text-muted-foreground mt-1">Multi-channel approach targeting UK property professionals</p>
          </div>
        </div>
      </div>

      {/* Sales Channels */}
      <div className="space-y-4">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-primary" />
          Sales Channels
        </h4>
        <div className="grid sm:grid-cols-2 gap-4">
          {channels.map((channel, idx) => (
            <div 
              key={idx} 
              className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${channel.color} p-5 border ${channel.borderColor}`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg bg-background/80 ${channel.iconColor}`}>
                  <channel.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold text-foreground">{channel.title}</h5>
                  <p className="text-sm text-muted-foreground mt-1">{channel.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sales Process */}
      <div className="space-y-4">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Sales Process
        </h4>
        <div className="flex flex-col sm:flex-row gap-3">
          {salesProcess.map((item, idx) => (
            <React.Fragment key={idx}>
              <div className="flex-1 p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/30 border border-slate-200 dark:border-slate-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                    {idx + 1}
                  </div>
                  <span className="font-semibold text-foreground">{item.step}</span>
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              {idx < salesProcess.length - 1 && (
                <div className="hidden sm:flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-muted-foreground/50" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="space-y-4">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Target Metrics
        </h4>
        <div className="grid grid-cols-3 gap-4">
          {keyMetrics.map((metric, idx) => (
            <div 
              key={idx} 
              className="text-center p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20"
            >
              <p className="text-2xl font-bold text-primary">{metric.value}</p>
              <p className="text-sm font-medium text-foreground mt-1">{metric.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{metric.subtitle}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Conclusion */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-emerald-500/10 p-6 border border-emerald-200/50 dark:border-emerald-800/30">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="text-foreground font-medium">
              Our strategy combines <span className="text-emerald-600 dark:text-emerald-400 font-bold">low-touch self-service</span> for smaller operators with <span className="text-emerald-600 dark:text-emerald-400 font-bold">high-touch enterprise sales</span> for larger portfolios.
            </p>
            <p className="text-muted-foreground text-sm">
              This dual approach maximises market coverage while optimising customer acquisition costs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
