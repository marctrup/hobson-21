// Updated features section without badge and Meet Hobson text
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Map, FileText, TrendingUp, CheckCircle } from "lucide-react";
import FeatureShowcase from "@/components/features/FeatureShowcase";

export const FeaturesSection = () => {
  return (
    <section className="py-8 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Angled Feature Showcase with Grid Map */}
          <FeatureShowcase />

        </div>
      </div>
    </section>
  );
};