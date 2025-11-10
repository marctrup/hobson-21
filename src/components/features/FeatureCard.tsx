import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, LucideIcon } from "lucide-react";
import React, { memo } from "react";

interface FeatureCardProps {
  feature: {
    icon: LucideIcon;
    title: string;
    description: string;
    highlight: string;
    benefits: string[];
  };
  index: number;
}

const FeatureCard = memo(({ feature, index }: FeatureCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-primary/10 hover:border-primary/20">
      <CardContent className="p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/70 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <feature.icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
              {index < 3 ? (
                <Badge variant="outline" className="text-green-600 border-green-600/20 bg-green-50 dark:bg-green-950/20">
                  Beta
                </Badge>
              ) : (
                <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">
                  On our wish list
                </Badge>
              )}
            </div>
            <Badge variant="outline" className="text-primary border-primary/20 mb-3">
              {feature.highlight}
            </Badge>
          </div>
        </div>
        
        <p className="text-muted-foreground mb-6 leading-relaxed">
          {feature.description}
        </p>
        
        <div className="space-y-2">
          {feature.benefits.map((benefit, benefitIndex) => (
            <div key={benefitIndex} className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">{benefit}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

FeatureCard.displayName = 'FeatureCard';

export default FeatureCard;