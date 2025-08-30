import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Menu, X, Brain, Zap, Search, Shield, Users, Globe, ArrowRight, CheckCircle } from "lucide-react";

export const BasicHomepage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <Helmet>
        <title>AI Real Estate AI | Document Intelligence | Hobson AI</title>
        <meta name="description" content="Transform a tenancy agreement with intelligent analysis, automated insights, and instant answers. Learn with comprehensive guides and documentation." />
        <meta name="keywords" content="document intelligence, real estate ai, property management software, ai document analysis, AI learning resources, tenancy agreement" />
        <meta property="og:title" content="AI-Document Intelligence for the Property Industry | Hobson AI" />
        <meta property="og:description" content="Transform a tenancy agreement with intelligent analysis, automated insights, and instant answers. Learn with comprehensive guides and documentation." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hobsonschoice.ai" />
        <link rel="canonical" href="https://hobsonschoice.ai" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-primary">Hobson AI</h1>
              </div>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-6">
                <a href="/blog" className="text-foreground hover:text-primary transition-colors font-medium">Blog</a>
                <a href="/pricing" className="text-foreground hover:text-primary transition-colors font-medium">Pricing</a>
                <a href="/learn" className="text-foreground hover:text-primary transition-colors font-medium">Learn</a>
                <a href="/contact" className="text-foreground hover:text-primary transition-colors font-medium">Contact</a>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  Get Started
                </button>
              </nav>

              {/* Mobile Menu Button */}
              <button 
                className="md:hidden p-2 hover:bg-accent rounded-lg transition-colors"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
              <nav className="md:hidden mt-4 pb-4 border-t pt-4">
                <div className="flex flex-col space-y-4">
                  <a href="/blog" className="text-foreground hover:text-primary transition-colors font-medium">Blog</a>
                  <a href="/pricing" className="text-foreground hover:text-primary transition-colors font-medium">Pricing</a>
                  <a href="/learn" className="text-foreground hover:text-primary transition-colors font-medium">Learn</a>
                  <a href="/contact" className="text-foreground hover:text-primary transition-colors font-medium">Contact</a>
                  <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors text-left">
                    Get Started
                  </button>
                </div>
              </nav>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <main className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              AI-powered document insights
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Transform your property documents with intelligent analysis, automated insights, and instant answers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                Get Started
              </button>
              <button className="border border-border px-8 py-3 rounded-lg font-semibold hover:bg-accent transition-colors">
                Learn More
              </button>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Document Analysis</h3>
              <p className="text-muted-foreground">
                Upload any property document and get instant intelligent analysis with key insights.
              </p>
            </div>
            <div className="text-center p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Smart Insights</h3>
              <p className="text-muted-foreground">
                Get automated insights and answers to your property management questions.
              </p>
            </div>
            <div className="text-center p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Learn & Grow</h3>
              <p className="text-muted-foreground">
                Access comprehensive guides and documentation to enhance your knowledge.
              </p>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="bg-card/50 rounded-2xl p-8 mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose Hobson AI?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Transform your property management with intelligent document processing and insights.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Instant Analysis</h3>
                    <p className="text-muted-foreground">Upload documents and get immediate intelligent insights without waiting.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Secure Processing</h3>
                    <p className="text-muted-foreground">Your documents are processed securely with enterprise-grade encryption.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Expert Knowledge</h3>
                    <p className="text-muted-foreground">Built by property experts for property professionals.</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">24/7 Access</h3>
                    <p className="text-muted-foreground">Access your document insights anytime, anywhere with our web platform.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Continuous Learning</h3>
                    <p className="text-muted-foreground">Our AI continuously improves to provide better insights over time.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Expert Support</h3>
                    <p className="text-muted-foreground">Get help from our property and AI experts when you need it.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Property Management?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join property professionals who are already using AI to streamline their document analysis and gain valuable insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors inline-flex items-center gap-2">
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </button>
              <button className="border border-border px-8 py-3 rounded-lg font-semibold hover:bg-accent transition-colors">
                Schedule Demo
              </button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t bg-card/50">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="text-lg font-semibold">Hobson AI</h3>
                <p className="text-sm text-muted-foreground">AI-powered document intelligence</p>
              </div>
              <div className="flex space-x-6 text-sm">
                <a href="/privacy-policy" className="text-muted-foreground hover:text-foreground">Privacy</a>
                <a href="/data-protection" className="text-muted-foreground hover:text-foreground">Data Protection</a>
                <a href="/contact" className="text-muted-foreground hover:text-foreground">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};