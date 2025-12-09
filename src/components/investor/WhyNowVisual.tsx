import React from "react";
import { Clock, TrendingUp, Target, Shield, DollarSign } from "lucide-react";

const WhyNowVisual: React.FC = () => {
  const reasons = [
    {
      icon: TrendingUp,
      title: "Technology Inflection Point",
      items: [
        "Large Language Models have reached production-grade reliability",
        "Document understanding AI now achieves 95%+ accuracy",
        "Infrastructure costs have dropped 10× in 3 years",
        "Real-time AI inference is now cost-effective at scale",
      ],
    },
    {
      icon: Target,
      title: "Market Readiness",
      items: [
        "65% of businesses are primed to invest in AI (Deloitte)",
        "COVID accelerated digital transformation in real estate",
        "Remote work normalized digital-first document workflows",
        "Talent shortages forcing automation adoption",
      ],
    },
    {
      icon: Clock,
      title: "Competitive Window",
      items: [
        "No dominant AI-native player in real estate document intelligence",
        "Legacy PropTech vendors slow to adopt AI",
        "12-18 month window to establish category leadership",
        "First-mover advantage in trust and data accumulation",
      ],
    },
    {
      icon: Shield,
      title: "Regulatory Tailwinds",
      items: [
        "Increasing compliance requirements favour automated tracking",
        "ESG reporting demands creating document complexity",
        "Data residency requirements favour UK/EU-based solutions",
      ],
    },
    {
      icon: DollarSign,
      title: "Economic Pressure",
      items: [
        "Rising operational costs driving efficiency focus",
        "Margin compression in property management",
        "Labour cost inflation making automation ROI compelling",
        "£6,000 annual saving per role is immediately attractive",
      ],
    },
  ];

  return (
    <div className="bg-white rounded-lg p-6 space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Why Now?
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          The Perfect Storm for AI in Real Estate
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reasons.map((reason, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-xl p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <reason.icon className="w-5 h-5 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900">{reason.title}</h4>
            </div>
            <ul className="space-y-2">
              {reason.items.map((item, itemIndex) => (
                <li
                  key={itemIndex}
                  className="text-sm text-gray-600 flex items-start gap-2"
                >
                  <span className="text-purple-500 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-purple-50 rounded-lg border border-purple-100">
        <p className="text-sm text-gray-700 text-center font-medium">
          The convergence of technology maturity, market readiness, competitive white space, 
          regulatory tailwinds, and economic pressure creates an unprecedented window for 
          Hobson to establish category leadership.
        </p>
      </div>
    </div>
  );
};

export default WhyNowVisual;