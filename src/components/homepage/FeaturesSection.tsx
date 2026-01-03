import { Badge } from "@/components/ui/badge";
import { MessageCircle, Map, FileText, TrendingUp, CheckCircle } from "lucide-react";
import FeatureShowcase from "@/components/features/FeatureShowcase";
import { useContent } from "@/contexts/LanguageContext";

const iconMap = {
  0: MessageCircle,
  1: Map,
  2: FileText,
  3: TrendingUp,
};

export const FeaturesSection = () => {
  const content = useContent();
  const cards = content.features.cards;

  return (
    <section className="pt-8 pb-0 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Angled Feature Showcase with Grid Map */}
          <FeatureShowcase />

          {/* Features Grid */}
          <div className="mb-16">
            <div className="grid md:grid-cols-2 gap-8">
              {cards.map((card, index) => {
                const Icon = iconMap[index as keyof typeof iconMap] || MessageCircle;
                
                return (
                  <div key={index} className="bg-card rounded-lg border p-8">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-xl font-semibold">{card.title}</h4>
                          <Badge 
                            variant={card.badgeType === "outline" ? "outline" : "secondary"} 
                            className={`text-xs ${card.badgeType === "outline" ? "border-primary text-primary" : ""}`}
                          >
                            {card.badge}
                          </Badge>
                        </div>
                        <p className="text-primary font-medium mb-3">{card.subtitle}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4">{card.description}</p>
                    <div className="space-y-2">
                      {card.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-primary" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
