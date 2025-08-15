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

          {/* Features Grid */}
          <div className="mb-16">

            <div className="grid md:grid-cols-2 gap-8">
              {/* Intelligent Chat Interface */}
              <div className="bg-card rounded-lg border p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-xl font-semibold">Intelligent Chat Interface</h4>
                      <Badge variant="secondary" className="text-xs">Beta</Badge>
                    </div>
                    <p className="text-primary font-medium mb-3">Natural language queries</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  Ask Hobson anything about your properties. Get instant answers to complex questions with our conversational AI assistant.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>24/7 availability</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>Context-aware responses</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>Multi-property insights</span>
                  </div>
                </div>
              </div>

              {/* Interactive Property Mapping */}
              <div className="bg-card rounded-lg border p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <Map className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-xl font-semibold">Interactive Property Mapping</h4>
                      <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
                    </div>
                    <p className="text-primary font-medium mb-3">Geospatial intelligence</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  Visualize your entire portfolio on an interactive map. See property locations, market data, and geographical insights at a glance.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>Location-based analytics</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>Market trend visualization</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>Portfolio distribution insights</span>
                  </div>
                </div>
              </div>

              {/* Smart Document Analysis */}
              <div className="bg-card rounded-lg border p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-xl font-semibold">Smart Document Analysis</h4>
                      <Badge variant="secondary" className="text-xs">Beta</Badge>
                    </div>
                    <p className="text-primary font-medium mb-3">AI-powered extraction</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  Upload lease agreements, surveys, and contracts. Hobson extracts key information and identifies important dates automatically.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>Automated data entry</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>Key date identification</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>Document summarization</span>
                  </div>
                </div>
              </div>

              {/* Predictive Analytics */}
              <div className="bg-card rounded-lg border p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-xl font-semibold">Predictive Analytics</h4>
                      <Badge variant="outline" className="text-xs border-orange-500 text-orange-600">Coming</Badge>
                    </div>
                    <p className="text-primary font-medium mb-3">Future-focused insights</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  Get ahead of market changes and lease renewals with AI-driven predictions and recommendations.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>Management forecasting</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>Market trend analysis</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>Revenue optimization</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};