import { SimpleButton } from "@/components/ui/simple-button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Header } from "@/components/homepage/Header";
import { Helmet } from "react-helmet-async";
import { MessageCircle, Map, FileText, TrendingUp, Search, Calendar, BarChart, Shield, Zap, CheckCircle } from "lucide-react";
import FeatureShowcase from "@/components/features/FeatureShowcase";

const Features = () => {
  return (
    <>
      <Helmet>
        <title>AI Property Management Features | Meet Hobson | Real Estate AI</title>
        <meta name="description" content="Meet Hobson - your intelligent property management assistant. Chat interface, portfolio mapping, document analysis and predictive analytics for real estate professionals." />
        <meta name="keywords" content="property management features, AI chat interface, property mapping, document analysis, predictive analytics, real estate AI tools" />
        <meta property="og:title" content="AI Property Management Features | Meet Hobson" />
        <meta property="og:description" content="Meet Hobson - your intelligent property management assistant with chat interface and portfolio mapping." />
        <meta property="og:image" content="https://hobsonschoice.ai/lovable-uploads/0fa56bb9-7c7d-4f95-a81f-36a7f584ed7a.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@HobsonAI" />
        <meta name="twitter:title" content="AI Property Management Features | Meet Hobson" />
        <meta name="twitter:description" content="Meet Hobson - your intelligent property management assistant." />
        <meta name="twitter:image" content="https://hobsonschoice.ai/lovable-uploads/0fa56bb9-7c7d-4f95-a81f-36a7f584ed7a.png" />
        <link rel="canonical" href="https://hobsonschoice.ai/features/real_estate_ai" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          {/* Skip to main content anchor */}
          <div id="main-content"></div>
          
          {/* Beta Badge */}
          <div className="text-center mb-8">
            <Badge variant="outline" className="text-primary border-primary/20">
              🚀 AI-Powered Features
            </Badge>
          </div>

          {/* Hero Section - Exact match to public site */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Meet Hobson
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12">
              Your intelligent property management assistant that understands context, learns from your data, 
              and delivers insights that transform how you work.
            </p>
          </div>


          {/* Angled Feature Showcase with Grid Map */}
          <FeatureShowcase />

          {/* Powerful Features Section - Exact match with proper boxing */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features, Simple Interface</h2>
              <p className="text-xl text-muted-foreground">
                Everything you need to manage your property portfolio efficiently, powered by cutting-edge AI technology.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {/* Intelligent Chat Interface */}
              <div className="bg-card rounded-lg border p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">Intelligent Chat Interface</h3>
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
                      <h3 className="text-xl font-semibold">Interactive Property Mapping</h3>
                      <Badge variant="secondary" className="text-xs">Beta</Badge>
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
                      <h3 className="text-xl font-semibold">Smart Document Analysis</h3>
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
                      <h3 className="text-xl font-semibold">Predictive Analytics</h3>
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
          </section>

          {/* Core Capabilities Section - Exact match with proper icons */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Core Capabilities</h2>
              <p className="text-xl text-muted-foreground">
                Built on a foundation of reliability and performance that property professionals demand.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex items-center gap-4 p-6 bg-card rounded-lg border">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <Search className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="font-medium">Instant property search and filtering</span>
              </div>
              
              <div className="flex items-center gap-4 p-6 bg-card rounded-lg border">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="font-medium">Automated calendar management</span>
              </div>
              
              <div className="flex items-center gap-4 p-6 bg-card rounded-lg border">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <BarChart className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="font-medium">Real-time performance analytics</span>
              </div>
              
              <div className="flex items-center gap-4 p-6 bg-card rounded-lg border">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="font-medium">Enterprise-grade security</span>
              </div>
              
              <div className="flex items-center gap-4 p-6 bg-card rounded-lg border">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="font-medium">Lightning-fast response times</span>
              </div>
              
              <div className="flex items-center gap-4 p-6 bg-card rounded-lg border">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="font-medium">99.9% uptime guarantee</span>
              </div>
            </div>
          </section>

          {/* Contact CTA - Exact match */}
          <div className="text-center py-16">
            <SimpleButton size="lg" asChild>
              <Link to="/contact">Contact us</Link>
            </SimpleButton>
          </div>
        </main>
      </div>
    </>
  );
};

export default Features;