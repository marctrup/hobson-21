import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Brain, Zap, Search, Shield, Users, Globe, Building2, TrendingUp, MapPin, PenTool, CreditCard, Heart, ArrowRight, MessageCircle } from "lucide-react";
import { SimpleButton } from "@/components/ui/simple-button";
import { Badge } from "@/components/ui/badge";
import { SimpleCard, SimpleCardContent } from "@/components/ui/simple-card";
import { OptimizedImage } from "@/components/OptimizedImage";
import { Helmet } from "react-helmet-async";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PropertyManagementVisualization } from "@/components/homepage/PropertyManagementVisualization";
import { LazyVideoDialog } from "@/components/LazyVideoDialog";
import { LazyScrollVideo } from "@/components/LazyScrollVideo";
import { FeaturesSection } from "@/components/homepage/FeaturesSection";
// Lazy load video only when needed

export const Homepage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  return <>
      <Helmet>
        <title>AI Property Management Software | Document Intelligence | Hobson AI</title>
        <meta name="description" content="Transform a tenancy document with intelligent analysis, automated insights, and instant answers to complex questions." />
        <meta name="keywords" content="AI property management, document intelligence, property AI software, real estate automation, property document analysis" />
        <meta property="og:title" content="AI-Document Intelligence for the Property Industry | Hobson AI" />
        <meta property="og:description" content="Transform a tenancy document with intelligent analysis, automated insights, and instant answers to complex questions." />
        <meta property="og:image" content="https://hobsonschoice.ai/lovable-uploads/915c8f99-05e9-4948-aa5d-7704686f4175.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@HobsonAI" />
        <meta name="twitter:title" content="AI-Document Intelligence for the Property Industry" />
        <meta name="twitter:description" content="Transform a tenancy document with intelligent analysis, automated insights, and instant answers to complex questions." />
        <meta name="twitter:image" content="https://hobsonschoice.ai/lovable-uploads/915c8f99-05e9-4948-aa5d-7704686f4175.png" />
        <link rel="canonical" href="https://hobsonschoice.ai/" />
        
        {/* Preload critical assets */}
        <link rel="preload" href="/lovable-uploads/0fa56bb9-7c7d-4f95-a81f-36a7f584ed7a.png" as="image" />
        <link rel="preload" href="/lovable-uploads/2cabb871-e6fa-4afe-80ea-21ccf0053048.png" as="image" />
        <link rel="preload" href="/lovable-uploads/b21f796e-20aa-4a56-ad42-9d8e9c3189ba.png" as="image" />
      </Helmet>

      <div className="min-h-screen bg-background overflow-x-hidden">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50" role="banner">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              {/* Logo */}
              <div className="relative">
                <Link to="/" onClick={closeMobileMenu}>
                  <OptimizedImage src="/lovable-uploads/0fa56bb9-7c7d-4f95-a81f-36a7f584ed7a.png" alt="Hobson AI - AI-powered property management software company logo" className="h-12 md:h-16 w-auto" priority />
                </Link>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-6" role="navigation" aria-label="Main navigation">
                <Link to="/blog" className="text-base text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
                <Link to="/about" className="text-base text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
                <Link to="/contact" className="text-base text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </nav>

              {/* Mobile Menu Button */}
              <SimpleButton variant="ghost" size="icon" className="md:hidden bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-md" onClick={toggleMobileMenu} aria-label="Toggle mobile menu">
                {isMobileMenuOpen ? <X className="h-6 w-6 text-purple-500" strokeWidth={1.5} /> : <Menu className="h-6 w-6 text-purple-500" strokeWidth={1.5} />}
              </SimpleButton>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && <nav className="md:hidden mt-4 pb-4 border-t pt-4" role="navigation" aria-label="Mobile navigation">
                <div className="flex flex-col gap-4">
                  <Link to="/blog" className="text-base text-muted-foreground hover:text-foreground transition-colors py-2" onClick={closeMobileMenu}>
                    Blog
                  </Link>
                  <Link to="/about" className="text-base text-muted-foreground hover:text-foreground transition-colors py-2" onClick={closeMobileMenu}>
                    About
                  </Link>
                  <Link to="/contact" className="text-base text-muted-foreground hover:text-foreground transition-colors py-2" onClick={closeMobileMenu}>
                    Contact
                  </Link>
                </div>
              </nav>}
          </div>
        </header>

        <main id="main-content" className="min-h-screen bg-background" role="main">
          {/* Hero Section - Two Column Layout */}
          <section className="pt-16 pb-4" aria-labelledby="hero-heading">
            <div className="container mx-auto px-4 -mt-[10px]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center py-4 lg:py-12 -mt-[5px]">
                {/* Left Container - H1 and Strap Line */}
                <div className="space-y-6 -mt-[20px]">
                  <h1 id="hero-heading" className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                    <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">AI-powered property insights, </span>
                    <span className="text-foreground">backed by your own documents.</span>
                  </h1>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    A 24/7 assistant that answers property questions with citations from your documents — delivering accuracy and insights you can trust.
                  </p>
                  
                  <a 
                    href="#pilot-section" 
                    className="bg-purple-50 border border-purple-200 rounded-lg p-4 inline-block hover:bg-purple-100 hover:border-purple-300 hover:scale-105 hover:shadow-sm transition-all duration-200 group"
                  >
                    <div className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium text-lg">
                      Your Free AI Property Assistant
                      <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                  </a>
                  
                </div>

                {/* Right Container - Document to Insights Visualization */}
                <div className="relative mt-[5px] font-space transition-transform duration-300 border-[3px] border-gray-500 rounded-lg" style={{
                  transform: 'perspective(1000px) rotateY(-10deg)',
                  transformStyle: 'preserve-3d',
                  boxShadow: '20px 20px 40px rgba(0, 0, 0, 0.15), 10px 10px 20px rgba(0, 0, 0, 0.1)',
                  filter: 'drop-shadow(8px 8px 16px rgba(0, 0, 0, 0.1))'
                }}>
                  <PropertyManagementVisualization />
                </div>

              </div>
            </div>
          </section>

          {/* How It Works & Video Section - Separated Headers and Content */}
          <section className="py-8 md:py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              {/* Content Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                
                {/* Left Content - How It Works Steps */}
                <div>
                  <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">How It Works</h2>
                    <p className="text-xl text-muted-foreground">Gaining insight and information couldn't be easier</p>
                  </div>
                  <div className="space-y-8">
                    {/* Step 1 */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
                        1
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-foreground">Upload & Connect</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Upload your documents or connect your existing systems. Our AI instantly begins processing and indexing your content.
                        </p>
                      </div>
                    </div>
                    
                    {/* Step 2 */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
                        2
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-foreground">Ask Questions</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Ask natural language questions about your properties, leases, contracts, or any document content.
                        </p>
                      </div>
                    </div>
                    
                    {/* Step 3 */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
                        3
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-foreground">Get Insights</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Receive instant, accurate answers with full source citations and actionable recommendations.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Content - Georgia Video */}
                <div>
                  <div className="aspect-[3/2] bg-gray-100 rounded-xl overflow-hidden relative" style={{
                    border: '10px solid #f0f0f0'
                  }}>
                    <LazyVideoDialog
                      thumbnailSrc="/lovable-uploads/b21f796e-20aa-4a56-ad42-9d8e9c3189ba.png"
                      thumbnailAlt="Georgia - Hobson AI Assistant"
                      videoId="1108183128"
                      title="Meet Georgia - Property AI Assistant"
                      description="Need more information? Meet Georgia"
                    />
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* Features Section */}
          <FeaturesSection />

          {/* CTA Section - Clean layout without card */}
          <section id="pilot-section" className="py-8 md:py-24">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-4xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground leading-tight">
                  Ready to think about AI in your property business but unsure how?
                </h2>
                <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
                  Join our exclusive pilot program and be among the first to experience the future of property intelligence.
                </p>
                <div className="mb-8">
                  <SimpleButton size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-medium" asChild>
                    <Link to="/pilot_form">Apply to join our Pilot →</Link>
                  </SimpleButton>
                </div>
              </div>
            </div>
          </section>

          {/* Scroll Video */}
          <LazyScrollVideo 
            videoId="1108176938" 
            title="Hobson AI Pilot Program" 
            description="Learn more about our pilot program"
            className="container mx-auto px-4 mb-5"
            style={{ marginTop: '-40px' }}
          />
          <div className="container mx-auto px-4">
            <div className="text-center mt-4">
              <p className="text-lg text-muted-foreground">Want to know more about the pilot?</p>
            </div>
          </div>

          {/* Security Badges */}
          <section className="py-4 md:py-12">
            <div className="container mx-auto px-4">
              <div className="flex justify-center items-center gap-16 max-w-2xl mx-auto">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-muted-foreground">Enterprise-grade security</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-muted-foreground">Trusted by industry leaders</span>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-5 md:py-16 border-t bg-muted/20">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-3 gap-6 md:gap-12">
                {/* Logo */}
                <div>
                  <OptimizedImage src="/lovable-uploads/0fa56bb9-7c7d-4f95-a81f-36a7f584ed7a.png" alt="Hobson's AI logo" className="h-12 w-auto" />
                </div>
                
                {/* Product Column */}
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-foreground">Product</h4>
                  <div className="space-y-3">
                    <Link to="/contact" className="block text-muted-foreground hover:text-foreground transition-colors">
                      Join our pilot programme
                    </Link>
                  </div>
                </div>
                
                {/* Company Column */}
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-foreground">Company</h4>
                  <div className="space-y-3">
                    <Link to="/blog" className="block text-muted-foreground hover:text-foreground transition-colors">
                      Blog
                    </Link>
                    <Link to="/about" className="block text-muted-foreground hover:text-foreground transition-colors">
                      About
                    </Link>
                    <Link to="/contact" className="block text-muted-foreground hover:text-foreground transition-colors">
                      Contact
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </>;
};