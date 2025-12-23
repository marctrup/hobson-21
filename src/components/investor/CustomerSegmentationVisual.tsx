import React from 'react';
import { Building2, Users, User, TrendingUp, AlertTriangle, Target } from 'lucide-react';

export const CustomerSegmentationVisual = () => {
  const segments = [
    {
      title: 'Large Operators',
      employees: '50–250 employees',
      percentage: '~5–10%',
      description: 'larger and institutional operators (50+ employees)',
      icon: Building2,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20',
      borderColor: 'border-blue-200/50 dark:border-blue-800/30',
      iconBg: 'bg-blue-100 dark:bg-blue-950/50',
      iconColor: 'text-blue-600',
      pressure: 'Rising compliance and audit requirements, high document volumes driving staffing growth, and increasing exposure from missed obligations',
      adoptionDrivers: [
        'Need to control cost without adding headcount',
        'Requirement for traceable, defensible answers',
        'Pressure from LPs, lenders, and regulators',
      ],
    },
    {
      title: 'Medium Operators',
      employees: '10–49 employees',
      percentage: '~20–25%',
      description: 'small–mid firms (10–49 employees)',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20',
      borderColor: 'border-purple-200/50 dark:border-purple-800/30',
      iconBg: 'bg-purple-100 dark:bg-purple-950/50',
      iconColor: 'text-purple-600',
      pressure: 'Scaling portfolios without proportional hiring, fragmented information across inboxes and shared drives, and decision bottlenecks are slowing transactions',
      adoptionDrivers: [
        'Margin compression',
        'Speed expectations from partners and capital providers',
        'Inability to scale manual processes',
      ],
    },
    {
      title: 'Small Operators',
      employees: '1–9 employees',
      percentage: '~65–70%',
      description: 'micro firms (1–9 employees)',
      icon: User,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20',
      borderColor: 'border-emerald-200/50 dark:border-emerald-800/30',
      iconBg: 'bg-emerald-100 dark:bg-emerald-950/50',
      iconColor: 'text-emerald-600',
      pressure: 'Severe time scarcity, no tolerance for complex tools, increasing regulatory and reporting burden',
      adoptionDrivers: [
        'Survival and competitiveness',
        'Need for instant answers without overhead',
      ],
    },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="pb-2">
        <h3 className="text-lg font-bold text-foreground mb-2">Customer Segmentation</h3>
        <p className="text-sm text-muted-foreground">
          ONS size-band data shows the Real Estate sector skews heavily toward small- and mid-sized operators, but value is concentrated higher up. While smaller firms are numerous, document complexity, regulatory exposure, and spend focus grow rapidly as portfolios scale, creating a strong wedge for platforms that embed early and expand upward.
        </p>
      </div>

      {/* Segment Cards */}
      <div className="grid gap-4">
        {segments.map((segment, idx) => (
          <div
            key={idx}
            className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${segment.bgColor} border ${segment.borderColor} p-5`}
          >
            {/* Decorative gradient circle */}
            <div
              className={`absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br ${segment.color} opacity-10 rounded-full blur-2xl`}
            />

            <div className="relative">
              {/* Header row */}
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-10 h-10 rounded-xl ${segment.iconBg} flex items-center justify-center flex-shrink-0`}>
                  <segment.icon className={`w-5 h-5 ${segment.iconColor}`} />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{segment.title}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-sm font-bold ${segment.iconColor}`}>{segment.percentage}</span>
                    <span className="text-xs text-muted-foreground">{segment.description}</span>
                  </div>
                </div>
              </div>

              {/* Pressure & Adoption Drivers - icons aligned with header */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl ${segment.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <AlertTriangle className={`w-5 h-5 ${segment.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      Pressure
                    </div>
                    <p className="text-sm text-foreground leading-5">{segment.pressure}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl ${segment.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <Target className={`w-5 h-5 ${segment.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      What Forces Adoption
                    </div>
                    <ul className="text-sm text-foreground space-y-1">
                      {segment.adoptionDrivers.map((driver, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-2">
                          <span className={`${segment.iconColor} leading-5`}>•</span>
                          <span className="leading-5">{driver}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom insight */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 text-center">
        <p className="text-sm text-foreground">
          <span className="font-semibold text-primary">One platform. One intelligence layer.</span> Forced adoption across segments.
        </p>
      </div>
    </div>
  );
};
