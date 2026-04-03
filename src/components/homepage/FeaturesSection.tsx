import { Badge } from "@/components/ui/badge";
import { MessageCircle, Map, FileText, TrendingUp, CheckCircle } from "lucide-react";
import FeatureShowcase from "@/components/features/FeatureShowcase";
import { CONTENT } from "@/config/content";

const iconMap = {
  0: MessageCircle,
  1: Map,
  2: FileText,
  3: TrendingUp,
};

export const FeaturesSection = () => {
  const content = CONTENT;
  const cards = content.features.cards;

  return (
    <section className="pt-8 pb-0 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Angled Feature Showcase with Grid Map */}
          <FeatureShowcase />
        </div>
      </div>
    </section>
  );
};
