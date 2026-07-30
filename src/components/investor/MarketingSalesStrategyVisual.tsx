import React from 'react';
import { Target, Users, Megaphone, TrendingUp, Handshake, Globe, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

export const MarketingSalesStrategyVisual = () => {
  const channels = [
    { 
      icon: Users, 
      title: "Direct Sales", 
      description: "Targeted outreach to property management companies and landlords",
      color: "from-ink-faint/10 to-charcoal/10",
      borderColor: "border-bone/50 dark:border-charcoal/30",
      iconColor: "text-charcoal dark:text-ink-muted"
    },
    { 
      icon: Handshake, 
      title: "Strategic Partnerships", 
      description: "Integrations with property management platforms and estate agents",
      color: "from-ink-faint/10 to-charcoal/10",
      borderColor: "border-bone/50 dark:border-charcoal/30",
      iconColor: "text-charcoal dark:text-ink-muted"
    },
    { 
      icon: Globe, 
      title: "Digital Marketing", 
      description: "SEO, content marketing, and targeted campaigns for real estate professionals",
      color: "from-success/10 to-success/10",
      borderColor: "border-success-border/50 dark:border-success/30",
      iconColor: "text-success dark:text-success"
    },
    { 
      icon: Megaphone, 
      title: "Industry Events", 
      description: "PropTech conferences, trade shows, and networking events",
      color: "from-warning/10 to-warning/10",
      borderColor: "border-warning-border/50 dark:border-warning/30",
      iconColor: "text-warning dark:text-warning"
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
              <div className="flex-1 p-4 rounded-xl bg-gradient-to-br from-paper to-bone-wash dark:from-ink/50 dark:to-ink/30 border border-bone dark:border-charcoal/50">
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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-success/10 via-success/5 to-success/10 p-6 border border-success-border/50 dark:border-success/30">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="text-foreground font-medium">
              Our strategy combines <span className="text-success dark:text-success font-bold">low-touch self-service</span> for smaller operators with <span className="text-success dark:text-success font-bold">high-touch enterprise sales</span> for larger portfolios.
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
