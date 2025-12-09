import React from 'react';
import { Building2, Users, User, Zap, Search, Clock, Database, Mail, Sparkles } from 'lucide-react';
export const CustomerSegmentationVisual = () => {
  const segments = [{
    title: 'Large Operators',
    employees: '50–250 employees',
    icon: Building2,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20',
    borderColor: 'border-blue-200/50 dark:border-blue-800/30',
    iconBg: 'bg-blue-100 dark:bg-blue-950/50',
    iconColor: 'text-blue-600',
    pain: 'High-admin organisations struggling with scattered data and slow information retrieval',
    need: 'Automation and accuracy at scale',
    painIcon: Database,
    needIcon: Zap
  }, {
    title: 'Medium Operators',
    employees: '10–49 employees',
    icon: Users,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20',
    borderColor: 'border-purple-200/50 dark:border-purple-800/30',
    iconBg: 'bg-purple-100 dark:bg-purple-950/50',
    iconColor: 'text-purple-600',
    pain: 'Agile teams overwhelmed by inboxes and shared drives',
    need: 'Efficient, low-overhead tools that eliminate manual searching',
    painIcon: Mail,
    needIcon: Search
  }, {
    title: 'Small Operators',
    employees: '1–9 employees',
    icon: User,
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20',
    borderColor: 'border-emerald-200/50 dark:border-emerald-800/30',
    iconBg: 'bg-emerald-100 dark:bg-emerald-950/50',
    iconColor: 'text-emerald-600',
    pain: 'Time-poor owner-operators with no time for complex tools',
    need: 'Simple, low-cost assistant that works instantly without onboarding',
    painIcon: Clock,
    needIcon: Sparkles
  }];
  return <div className="space-y-6">
      {/* Header */}
      <div className="text-center pb-2">
        <h3 className="text-lg font-bold text-foreground mb-2">Who We Serve</h3>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">Hobson is designed to meet the needs of real estate professionals across all operator sizes—each with distinct challenges, but a shared need for clarity.</p>
      </div>

      {/* Segment Cards */}
      <div className="grid gap-4">
        {segments.map((segment, idx) => <div key={idx} className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${segment.bgColor} border ${segment.borderColor} p-5`}>
            {/* Decorative gradient circle */}
            <div className={`absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br ${segment.color} opacity-10 rounded-full blur-2xl`} />
            
            <div className="relative">
              {/* Header row */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl ${segment.iconBg} flex items-center justify-center`}>
                  <segment.icon className={`w-5 h-5 ${segment.iconColor}`} />
                </div>
                <div className="flex items-baseline gap-2">
                  <h4 className="font-semibold text-foreground">{segment.title}</h4>
                  <span className="text-xs text-muted-foreground">({segment.employees})</span>
                </div>
              </div>

              {/* Pain & Need */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <div className={`w-6 h-6 rounded-md ${segment.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <segment.painIcon className={`w-3.5 h-3.5 ${segment.iconColor}`} />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">Challenge</div>
                    <p className="text-sm text-foreground">{segment.pain}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className={`w-6 h-6 rounded-md ${segment.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <segment.needIcon className={`w-3.5 h-3.5 ${segment.iconColor}`} />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">What They Need</div>
                    <p className="text-sm text-foreground">{segment.need}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>)}
      </div>

      {/* Bottom insight */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 text-center">
        <p className="text-sm text-foreground">
          <span className="font-semibold text-primary">One platform, three experiences</span> — Hobson adapts to the complexity and scale of each operator type.
        </p>
      </div>
    </div>;
};