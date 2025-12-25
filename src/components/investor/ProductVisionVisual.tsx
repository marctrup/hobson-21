import React from "react";
import { Target, Layers, Zap, Users, FileText, Brain, Shield, TrendingUp, ArrowRight } from "lucide-react";

const ProductVisionVisual: React.FC = () => {
  const visionPillars = [
    {
      icon: Brain,
      title: "AI-Native Intelligence",
      description: "Purpose-built AI that understands real estate documents with domain expertise",
      color: "from-purple-500/20 to-purple-600/20",
      iconColor: "text-purple-600",
      borderColor: "border-purple-300",
    },
    {
      icon: FileText,
      title: "Document Understanding",
      description: "Deep comprehension of leases, contracts, and property documentation",
      color: "from-blue-500/20 to-blue-600/20",
      iconColor: "text-blue-600",
      borderColor: "border-blue-300",
    },
    {
      icon: Users,
      title: "Workflow Integration",
      description: "Seamless integration into existing real estate operations and workflows",
      color: "from-green-500/20 to-green-600/20",
      iconColor: "text-green-600",
      borderColor: "border-green-300",
    },
    {
      icon: Shield,
      title: "Trust & Accuracy",
      description: "Auditable, referenced answers that professionals can rely on",
      color: "from-amber-500/20 to-amber-600/20",
      iconColor: "text-amber-600",
      borderColor: "border-amber-300",
    },
  ];

  const productGoals = [
    {
      phase: "Phase 1",
      title: "Information Retrieval",
      items: ["Document Q&A", "Search across portfolios", "Referenced answers"],
    },
    {
      phase: "Phase 2",
      title: "Workflow Automation",
      items: ["Automated summaries", "Key date extraction", "Compliance alerts"],
    },
    {
      phase: "Phase 3",
      title: "Proactive Intelligence",
      items: ["Risk identification", "Opportunity detection", "Strategic insights"],
    },
  ];

  return (
    <div className="bg-white rounded-lg p-6 space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Product Vision</h3>
        <p className="text-lg text-primary font-medium">
          Building the Intelligence Layer for Real Estate
        </p>
      </div>

      {/* Vision Statement */}
      <div className="bg-gradient-to-r from-primary/10 to-purple-100 rounded-xl p-6 border border-primary/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-lg shadow-sm">
            <Target className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Our Product Mission</h4>
            <p className="text-gray-700 leading-relaxed">
              To become the <span className="font-semibold text-primary">default intelligence layer</span> for 
              real estate professionals—transforming how they access, understand, and act on 
              property documentation through AI-native technology.
            </p>
          </div>
        </div>
      </div>

      {/* Core Pillars */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary" />
          Core Product Pillars
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visionPillars.map((pillar, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${pillar.color} ${pillar.borderColor} border rounded-lg p-4 hover:shadow-md transition-all`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <pillar.icon className={`w-5 h-5 ${pillar.iconColor}`} />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 mb-1">{pillar.title}</h5>
                  <p className="text-sm text-gray-600">{pillar.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Roadmap Goals */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Product Evolution
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {productGoals.map((goal, index) => (
            <div key={index} className="relative">
              <div className="bg-white border border-gray-200 rounded-lg p-4 h-full shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-primary text-white text-xs font-bold rounded">
                    {goal.phase}
                  </span>
                </div>
                <h5 className="font-semibold text-gray-900 mb-3">{goal.title}</h5>
                <ul className="space-y-2">
                  {goal.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center gap-2 text-sm text-gray-600">
                      <Zap className="w-3 h-3 text-primary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              {index < productGoals.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-5 h-5 text-gray-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Value Proposition */}
      <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
        <h4 className="text-md font-semibold text-gray-900 mb-3">Why This Matters</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary mb-1">20%</div>
            <div className="text-sm text-gray-600">Time savings on document tasks</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary mb-1">100%</div>
            <div className="text-sm text-gray-600">Referenced, auditable answers</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary mb-1">24/7</div>
            <div className="text-sm text-gray-600">Always-available intelligence</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductVisionVisual;
