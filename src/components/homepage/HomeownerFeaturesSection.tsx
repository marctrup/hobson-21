// Homeowner-specific features section
import HomeownerFeatureShowcase from "@/components/features/HomeownerFeatureShowcase";

export const HomeownerFeaturesSection = () => {
  return (
    <section className="py-8 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Angled Feature Showcase with Grid Map */}
          <HomeownerFeatureShowcase />
        </div>
      </div>
    </section>
  );
};