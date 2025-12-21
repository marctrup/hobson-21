import React from 'react';
import { CheckCircle2, Users, Building2, Shield, Handshake, FileCheck } from 'lucide-react';

export const TeamCredibilityVisual = () => {
  const teamBrings = [
    {
      text: 'Proven experience building and scaling enterprise Real Estate software',
      icon: Building2
    },
    {
      text: 'Deep understanding of document-heavy, regulated environments',
      icon: FileCheck
    },
    {
      text: 'Credibility with institutional buyers and partners',
      icon: Handshake
    },
    {
      text: 'Prior experience navigating governance, security, and M&A processes',
      icon: Shield
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-6 border border-primary/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <Users className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold text-foreground">Founded by the Team Behind Arthur Online</h3>
          </div>
          <p className="text-foreground leading-relaxed">
            Hobson was founded by the team behind <span className="font-semibold text-primary">Arthur Online</span>, a Real Estate operations platform built and scaled for institutional adoption, which was <span className="font-semibold text-primary">acquired by Advent and Aareon in 2021</span>.
          </p>
        </div>
      </div>

      {/* Experience Context */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 font-bold text-sm">1</div>
          <h4 className="font-semibold text-foreground">Direct Market Experience</h4>
        </div>
        
        <div className="ml-11 p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
          <p className="text-sm text-foreground leading-relaxed">
            That experience provides direct insight into how Real Estate platforms are bought, deployed, and relied upon at scale — and where they break under document complexity, compliance pressure, and operational load.
          </p>
        </div>
      </div>

      {/* What the Team Brings */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-bold text-sm">2</div>
          <h4 className="font-semibold text-foreground">The Team Brings</h4>
        </div>
        
        <div className="ml-11 grid sm:grid-cols-2 gap-3">
          {teamBrings.map((item, idx) => (
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
