import React from 'react';
import { Building2, Users, User, Layers, Monitor, Handshake } from 'lucide-react';

export const PilotClientsVisual = () => {
  const pilots = [
    {
      size: 'Large Operator',
      icon: Building2,
      color: 'blue',
      clients: [
        {
          name: 'EPAM Asset Management',
          description: 'Commercial management that operate team across multiple systems',
          systems: 'Multiple systems',
        },
      ],
    },
    {
      size: 'Medium Operator',
      icon: Users,
      color: 'purple',
      clients: [
        {
          name: 'Live-in Guardians',
          description: 'Guardian company that operate teams using single system',
          systems: 'Single system',
        },
      ],
    },
    {
      size: 'Small Operators',
      icon: User,
      color: 'emerald',
      clients: [
        {
          name: 'Landhold',
          description: 'Development, sales, and investment company',
          systems: 'Microsoft suites',
        },
        {
          name: 'Saxon Investments',
          description: 'Development, sales, and investment company',
          systems: 'Microsoft suite',
        },
      ],
    },
  ];

  const colorClasses: Record<string, { bg: string; iconBg: string; icon: string; border: string; badge: string }> = {
    blue: {
      bg: 'from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20',
      iconBg: 'bg-blue-100 dark:bg-blue-950/50',
      icon: 'text-blue-600',
      border: 'border-blue-200/50 dark:border-blue-800/30',
      badge: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300',
    },
    purple: {
      bg: 'from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20',
      iconBg: 'bg-purple-100 dark:bg-purple-950/50',
      icon: 'text-purple-600',
      border: 'border-purple-200/50 dark:border-purple-800/30',
      badge: 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300',
    },
    emerald: {
      bg: 'from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20',
      iconBg: 'bg-emerald-100 dark:bg-emerald-950/50',
      icon: 'text-emerald-600',
      border: 'border-emerald-200/50 dark:border-emerald-800/30',
      badge: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300',
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-6 border border-primary/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Handshake className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">2025 Validation</span>
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">Pilot Clients</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Strategic partnerships and pilot validation across different operator sizes and system environments.
          </p>
        </div>
      </div>

      {/* Pilot Cards */}
      <div className="space-y-4">
        {pilots.map((pilot, idx) => {
          const colors = colorClasses[pilot.color];
          return (
            <div
              key={idx}
              className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${colors.bg} border ${colors.border} p-5`}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl ${colors.iconBg} flex items-center justify-center`}>
                  <pilot.icon className={`w-5 h-5 ${colors.icon}`} />
                </div>
                <h4 className="font-semibold text-foreground">{pilot.size}</h4>
              </div>

              {/* Clients */}
              <div className="space-y-3">
                {pilot.clients.map((client, clientIdx) => (
                  <div
                    key={clientIdx}
                    className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 rounded-lg bg-white/50 dark:bg-white/5 border border-white/20 dark:border-white/10"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground">{client.name}</div>
                      <div className="text-sm text-muted-foreground">{client.description}</div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <Layers className={`w-3.5 h-3.5 ${colors.icon}`} />
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${colors.badge}`}>
                        {client.systems}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-4 rounded-xl bg-muted/50 border border-border">
          <div className="text-2xl font-bold text-primary">4</div>
          <div className="text-xs text-muted-foreground">Active Pilots</div>
        </div>
        <div className="text-center p-4 rounded-xl bg-muted/50 border border-border">
          <div className="text-2xl font-bold text-primary">3</div>
          <div className="text-xs text-muted-foreground">Operator Sizes</div>
        </div>
        <div className="text-center p-4 rounded-xl bg-muted/50 border border-border">
          <div className="text-2xl font-bold text-primary">2+</div>
          <div className="text-xs text-muted-foreground">System Types</div>
        </div>
      </div>
    </div>
  );
};
