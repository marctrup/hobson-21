import { MessageCircle, Map, FileText, Brain } from "lucide-react";
import FeatureCard from "./FeatureCard";
import React, { memo } from "react";

const FeatureGrid = memo(() => {
  const mainFeatures = [
    {
      icon: MessageCircle,
      title: "Intelligent Chat Interface",
      description: "Ask Hobson anything about your properties. Get instant answers to complex questions with our conversational AI assistant.",
      highlight: "Natural language queries",
      benefits: [
        "24/7 availability",
        "Context-aware responses",
        "Multi-property insights"
      ]
    },
    {
      icon: Map,
      title: "Interactive Property Mapping",
      description: "Visualize your entire portfolio on an interactive map. See property locations, market data, and geographical insights at a glance.",
      highlight: "Geospatial intelligence",
      benefits: [
        "Location-based analytics",
        "Market trend visualization",
        "Portfolio distribution insights"
      ]
    },
    {
      icon: FileText,
      title: "Smart Document Analysis",
      description: "Upload lease agreements, surveys, and contracts. Hobson extracts key information and identifies important dates automatically.",
      highlight: "AI-powered extraction",
      benefits: [
        "Automated data entry",
        "Key date identification",
        "Document summarization"
      ]
    },
    {
      icon: Brain,
      title: "Predictive Analytics",
      description: "Get ahead of market changes and lease renewals with AI-driven predictions and recommendations.",
      highlight: "Future-focused insights",
      benefits: [
        "Management forecasting",
        "Market trend analysis",
        "Revenue optimization"
      ]
    }
  ];

  return (
    <div className="mb-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-foreground mb-4">
          Powerful Features, Simple Interface
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Everything you need to manage your property portfolio efficiently, powered by cutting-edge AI technology.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        {mainFeatures.map((feature, index) => (
          <FeatureCard key={index} feature={feature} index={index} />
        ))}
      </div>
    </div>
  );
});

FeatureGrid.displayName = 'FeatureGrid';

export default FeatureGrid;