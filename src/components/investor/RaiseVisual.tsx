import React from 'react';
import { TrendingUp, CheckCircle2, Rocket, Code, Users, FileCheck } from 'lucide-react';

export const RaiseVisual = () => {
  const useOfFunds = [
    {
      text: 'To secure category leadership with a production-grade platform, QA, and security',
      icon: Code
    },
    {
      text: 'Core technical and go-to-market hiring',
      icon: Users
    },
    {
      text: 'Conversion of pilots into contracted deployments',
      icon: FileCheck
    }
  ];

  return (
    <div className="space-y-8">
      {/* Raise Amount Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-6 border border-primary/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-7 h-7 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Funding Requirement</p>
            <h3 className="text-3xl font-bold text-primary">£5M</h3>
          </div>
        </div>
      </div>

      {/* Use of Funds */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400">
            <Rocket className="w-4 h-4" />
          </div>
          <h4 className="font-semibold text-foreground">Use of Funds</h4>
        </div>
        
        <div className="ml-11 space-y-3">
          {useOfFunds.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-emerald-50/80 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30">
              <item.icon className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-foreground">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
