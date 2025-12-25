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
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Product Vision</h3>
        <p className="text-lg text-primary font-medium">
          The AI Operating Layer for Real Estate
        </p>
      </div>

      {/* Industry Context */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          The global Real Estate industry is primed for change
        </h4>
        <p className="text-gray-700 mb-4">Operators are drowning in:</p>
        <ul className="space-y-2 mb-6">
          {industryPains.map((pain, index) => (
            <li key={index} className="flex items-center gap-3 text-gray-700">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>{pain}</span>
            </li>
          ))}
        </ul>
        <p className="text-gray-700 italic border-l-4 border-amber-400 pl-4">
          Yet residential and commercial operators still run on manual workflows, spreadsheets, 
          inboxes, and calendar reminders despite managing billions in regulated assets.
        </p>
      </div>

      {/* Hobson Vision Statement */}
      <div className="bg-gradient-to-r from-primary/10 to-purple-100 rounded-xl p-6 border border-primary/20 text-center">
        <h4 className="text-xl font-bold text-primary">
          Hobson is building the AI operating layer for the Real Estate industry.
        </h4>
      </div>

      {/* Market Gap */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          The Market Gap Hobson Fills
        </h4>
        <blockquote className="bg-white rounded-lg p-4 border-l-4 border-primary mb-6 italic text-gray-600">
          "Most core operational workflows are identical across residential and commercial 
          property management… AI is uniquely effective at normalising these differences 
          into a single system."
          <span className="block mt-2 text-sm text-gray-500 not-italic">
            — From operational workflows analysis
          </span>
        </blockquote>
        
        <p className="text-gray-700 font-medium mb-3">Today, no platform:</p>
        <ul className="space-y-2 mb-4">
          {marketGaps.map((gap, index) => (
            <li key={index} className="flex items-center gap-3 text-gray-600">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
              <span>{gap}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Hobson Solution */}
      <div className="bg-gradient-to-br from-primary/5 to-purple-50 rounded-xl p-6 border border-primary/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary rounded-lg">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900">
            Hobson becomes the intelligence layer above every PMS
          </h4>
        </div>
        
        <p className="text-gray-700 mb-4 font-medium">One Core Engine that delivers:</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {coreCapabilities.map((capability, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-3 border border-gray-200 flex items-center gap-2 shadow-sm"
            >
              <capability.icon className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-sm text-gray-700">{capability.label}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg p-4 border border-primary/30">
          <div className="flex items-center gap-2 mb-2">
            <ArrowRight className="w-4 h-4 text-primary" />
            <span className="font-medium text-gray-900">AI as the Translation Layer</span>
          </div>
          <p className="text-gray-600 text-sm">
            AI acts as the translation layer between residential ASTs and commercial FRI leases.
          </p>
        </div>
      </div>

      {/* Conclusion */}
      <div className="bg-primary text-white rounded-xl p-6 text-center">
        <p className="text-lg font-semibold">
          This makes Hobson the only platform capable of running a single operating model 
          across residential and commercial portfolios.
        </p>
      </div>
    </div>
  );
};

export default ProductVisionVisual;
