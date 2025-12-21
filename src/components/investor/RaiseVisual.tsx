import React from 'react';
import { TrendingUp } from 'lucide-react';

export const RaiseVisual = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-6 border border-primary/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold text-foreground">Raise</h3>
          </div>
          <p className="text-muted-foreground">
            Funding strategy and capital allocation.
          </p>
        </div>
      </div>

      {/* Content placeholder */}
      <div className="p-6 rounded-xl bg-muted/30 border border-border/50">
        <p className="text-sm text-muted-foreground text-center">
          Raise content to be added.
        </p>
      </div>
    </div>
  );
};
