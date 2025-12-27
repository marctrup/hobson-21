import React from 'react';
import { TrendingUp, BarChart3, FileText, Shield, Zap, Building2, Scale, FileCheck, ClipboardList } from 'lucide-react';

const expansionDrivers = [
  { icon: Building2, text: "grow portfolios" },
  { icon: Scale, text: "expand into new jurisdictions" },
  { icon: Shield, text: "face more compliance" },
  { icon: FileCheck, text: "manage more complex leases" },
  { icon: ClipboardList, text: "increase reporting demands" },
];

const transparencyFeatures = [
  { icon: BarChart3, text: "real-time HEU usage bars" },
  { icon: Zap, text: "per-message cost breakdowns" },
  { icon: FileText, text: "full audit trails of AI effort" },
];

const CommercialsVisual = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <p className="text-lg text-muted-foreground italic">
          This is designed to kill procurement friction and accelerate viral adoption inside organisations.
        </p>
      </div>

      {/* Revenue Expansion Engine */}
      <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 rounded-2xl p-8 border border-emerald-500/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-emerald-500/20 rounded-xl">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">Built-In Revenue Expansion Engine</h3>
        </div>
        
        <p className="text-muted-foreground mb-6">
          Hobson has something most startups do not: <span className="text-emerald-600 font-semibold">automatic net revenue retention growth</span>.
        </p>
        
        <p className="text-foreground font-medium mb-4">As operators:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {expansionDrivers.map((driver, index) => (
            <div key={index} className="flex items-center gap-3 bg-background/50 rounded-lg p-3 border border-emerald-500/10">
              <driver.icon className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span className="text-foreground">{driver.text}</span>
            </div>
          ))}
        </div>
        
        <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20">
          <p className="text-foreground text-center font-medium">
            Their HEU consumption rises <span className="text-emerald-600">without a single sales conversation</span>.
          </p>
        </div>
      </div>

      {/* Transparency Section */}
      <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-2xl p-8 border border-blue-500/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-500/20 rounded-xl">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">Unmatched Transparency = Enterprise Trust</h3>
        </div>
        
        <p className="text-foreground font-medium mb-4">Hobson provides:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {transparencyFeatures.map((feature, index) => (
            <div key={index} className="flex items-center gap-3 bg-background/50 rounded-lg p-4 border border-blue-500/10">
              <feature.icon className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <span className="text-foreground">{feature.text}</span>
            </div>
          ))}
        </div>
        
        <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20 space-y-2">
          <p className="text-foreground text-center">
            This gives finance teams <span className="text-blue-600 font-semibold">absolute certainty on cost control</span>.
          </p>
          <p className="text-foreground text-center">
            It removes the biggest objection enterprises have to AI: <span className="text-blue-600 font-semibold">unpredictable cost</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommercialsVisual;
