import React from 'react';
import { CheckCircle2, Users } from 'lucide-react';

export const TeamCredibilityVisual = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-6 border border-primary/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold text-foreground">Team Credibility</h3>
          </div>
          <p className="text-muted-foreground">
            Proven experience building and scaling real estate technology.
          </p>
        </div>
      </div>

      {/* Content placeholder - to be populated with actual team information */}
      <div className="p-6 rounded-xl bg-muted/30 border border-border/50">
        <p className="text-sm text-muted-foreground text-center">
          Team credibility content to be added.
        </p>
      </div>
    </div>
  );
};
