import React from "react";
import { AlertTriangle, Layers, Building2, FileText, Shield, Calendar, DollarSign, Wrench, MessageSquare, ArrowRight } from "lucide-react";

const ProductVisionVisual: React.FC = () => {
  const industryPains = [
    "Escalating regulatory complexity",
    "Fragmented systems",
    "Chronic labour shortages",
    "Rising operating costs",
    "Increasingly sophisticated landlord and tenant expectations",
  ];

  const coreCapabilities = [
    { icon: Building2, label: "Property master data" },
    { icon: FileText, label: "Lease abstraction" },
    { icon: Calendar, label: "Compliance calendars" },
    { icon: DollarSign, label: "Financial intelligence" },
    { icon: Wrench, label: "Maintenance orchestration" },
    { icon: MessageSquare, label: "Communications automation" },
  ];

  const marketGaps = [
    "Understands leases at scale",
    "Enforces compliance continuously",
    "Orchestrates maintenance and finance",
    "Predicts risk across entire portfolios",
  ];

  return (
    <div className="bg-white rounded-lg p-6 space-y-8">

      {/* Industry Context */}
      <div className="bg-gradient-to-r from-warning-bg to-warning-bg rounded-xl p-6 border border-warning-border">
        <h4 className="text-lg font-semibold text-ink mb-4">
          The global Real Estate industry is primed for change
        </h4>
        <p className="text-charcoal mb-4">Operators are drowning in:</p>
        <ul className="space-y-2 mb-6">
          {industryPains.map((pain, index) => (
            <li key={index} className="flex items-center gap-3 text-charcoal">
              <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0" />
              <span>{pain}</span>
            </li>
          ))}
        </ul>
        <p className="text-charcoal italic border-l-4 border-warning-border pl-4">
          Yet residential and commercial operators still run on manual workflows, spreadsheets, 
          inboxes, and calendar reminders despite managing billions in regulated assets.
        </p>
      </div>

      {/* Hobson Vision Statement */}
      <div className="bg-gradient-to-r from-primary/10 to-bone-wash rounded-xl p-6 border border-primary/20 text-center">
        <h4 className="text-xl font-bold text-primary">
          Hobson is building the AI operating layer for the Real Estate industry.
        </h4>
      </div>

      {/* Market Gap */}
      <div className="bg-paper rounded-xl p-6 border border-bone">
        <h4 className="text-lg font-semibold text-ink mb-4">
          The Market Gap Hobson Fills
        </h4>
        <blockquote className="bg-white rounded-lg p-4 border-l-4 border-primary mb-6 italic text-charcoal">
          "Most core operational workflows are identical across residential and commercial 
          property management… AI is uniquely effective at normalising these differences 
          into a single system."
          <span className="block mt-2 text-sm text-ink-muted not-italic">
            — From operational workflows analysis
          </span>
        </blockquote>
        
        <p className="text-charcoal font-medium mb-3">Today, no platform:</p>
        <ul className="space-y-2 mb-4">
          {marketGaps.map((gap, index) => (
            <li key={index} className="flex items-center gap-3 text-charcoal">
              <span className="w-1.5 h-1.5 rounded-full bg-danger flex-shrink-0" />
              <span>{gap}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Hobson Solution */}
      <div className="bg-gradient-to-br from-primary/5 to-paper rounded-xl p-6 border border-primary/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Layers className="w-6 h-6 text-primary" />
          </div>
          <h4 className="text-lg font-semibold text-ink">
            Hobson becomes the intelligence layer above every PMS
          </h4>
        </div>
        
        <p className="text-charcoal mb-4 font-medium">One Core Engine that delivers:</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {coreCapabilities.map((capability, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-3 border border-bone flex items-center gap-2 shadow-sm"
            >
              <capability.icon className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-sm text-charcoal">{capability.label}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg p-4 border border-primary/30">
          <div className="flex items-center gap-2 mb-2">
            <ArrowRight className="w-4 h-4 text-primary" />
            <span className="font-medium text-ink">AI as the Translation Layer</span>
          </div>
          <p className="text-charcoal text-sm">
            AI acts as the translation layer between residential ASTs and commercial FRI leases.
          </p>
        </div>
      </div>

      {/* Conclusion */}
      <div className="bg-gradient-to-r from-primary/10 to-bone-wash border border-primary/20 rounded-xl p-6 text-center">
        <p className="text-lg font-semibold text-primary">
          This makes Hobson the only platform capable of running a single operating model 
          across residential and commercial portfolios.
        </p>
      </div>
    </div>
  );
};

export default ProductVisionVisual;
