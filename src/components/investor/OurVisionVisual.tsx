import React from "react";
import { Eye, Target, Lightbulb, Rocket, Globe } from "lucide-react";

const OurVisionVisual: React.FC = () => {
  const visionPoints = [
    {
      icon: Eye,
      title: "Clarity from Complexity",
      description: "Transform overwhelming property documentation into instant, actionable intelligence.",
    },
    {
      icon: Target,
      title: "Industry Standard",
      description: "Become the default AI-powered document intelligence platform for Real Estate professionals.",
    },
    {
      icon: Lightbulb,
      title: "Human-Centred AI",
      description: "Augment professional expertise rather than replace it—delivering answers that empower decisions.",
    },
    {
      icon: Rocket,
      title: "Scalable Impact",
      description: "Build technology that scales from individual landlords to enterprise portfolios without complexity.",
    },
    {
      icon: Globe,
      title: "Global Ambition",
      description: "Start with UK leadership, expand to serve property professionals worldwide.",
    },
  ];

  return (
    <div className="bg-white rounded-lg p-6 space-y-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Our Vision</h3>
        <p className="text-lg text-purple-600 font-medium">
          Redefining How Real Estate Professionals Access Information
        </p>
      </div>

      {/* Vision Statement */}
      <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-xl p-6 mb-8">
        <p className="text-xl text-gray-800 text-center font-medium leading-relaxed">
          We envision a world where every property professional has instant access to the answers locked within their documents—freeing them to focus on what matters: <span className="text-purple-600 font-semibold">decisions, relationships, and growth</span>.
        </p>
      </div>

      {/* Vision Points */}
      <div className="grid gap-4">
        {visionPoints.map((point, index) => (
          <div
            key={index}
            className="flex items-start gap-4 bg-gradient-to-r from-purple-50/50 to-transparent border border-purple-100/50 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="p-2 bg-purple-100 rounded-lg shrink-0">
              <point.icon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-1">
                {point.title}
              </h4>
              <p className="text-gray-600">{point.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Mission Statement */}
      <div className="mt-8 bg-gradient-to-br from-primary via-primary/90 to-violet-600 rounded-xl p-6 sm:p-8 border border-primary/30">
        <h4 className="text-lg sm:text-xl font-bold text-white text-center mb-4">
          Our Mission
        </h4>
        <p className="text-white/90 text-center text-base sm:text-lg leading-relaxed">
          To eliminate the friction between property professionals and the information they need—delivering AI-powered clarity that transforms how the industry operates.
        </p>
      </div>
    </div>
  );
};

export default OurVisionVisual;
