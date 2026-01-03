import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Brain, Zap, Search, Shield, Users, Globe, Building2, TrendingUp, MapPin, PenTool, CreditCard, Heart, ArrowRight, MessageCircle, FileText, Lightbulb, Target, CheckCircle } from "lucide-react";
import { SimpleButton } from "@/components/ui/simple-button";
import { Badge } from "@/components/ui/badge";
import { SimpleCard, SimpleCardContent } from "@/components/ui/simple-card";
import { OptimizedImage } from "@/components/OptimizedImage";
import { Helmet } from "react-helmet-async";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PropertyManagementVisualizationHomeowner } from "@/components/homepage/PropertyManagementVisualizationHomeowner";
import { HomepageGeorgiaVideoHomeowner } from "@/components/videos/HomepageGeorgiaVideoHomeowner";
import { HomepagePilotVideoHomeowner } from "@/components/videos/HomepagePilotVideoHomeowner";
import { FeaturesSectionHomeowner } from "@/components/homepage/FeaturesSectionHomeowner";
import { useContent } from "@/contexts/LanguageContext";

export const HomepageHomeowner = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const content = useContent();
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  return <>
      <Helmet>
        <title>AI Property Management Software | Document Intelligence | Hobson AI</title>
        <meta name="description" content="Transform a tenancy agreement with intelligent analysis, automated insights, and instant answers. ." />
        <meta name="keywords" content="Real Estate AI, tenancy agreement analysis, property AI, automation, " />
        <meta property="og:title" content="AI-Document Intelligence for the Property Industry | Hobson AI" />
        <meta property="og:description" content="Transform a tenancy agreement with intelligent analysis, automated insights, and instant answers. ." />
        <meta property="og:image" content="https://hobsonschoice.ai/hobson-owl-social.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@HobsonAI" />
        <meta name="twitter:title" content="AI-Document Intelligence for the Property Industry" />
        <meta name="twitter:description" content="Transform a tenancy agreement with intelligent analysis, automated insights, and instant answers. ." />
        <meta name="twitter:image" content="https://hobsonschoice.ai/hobson-owl-social.png" />
        <link rel="canonical" href="https://hobsonschoice.ai/homeowner" />
        
        {/* Preload critical assets - only above-the-fold logo */}
        <link rel="preload" href="/hobson-logo.png" as="image" />
      </Helmet>

      <div className="min-h-screen bg-background overflow-x-hidden">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50" role="banner">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              {/* Logo */}
              <div className="relative">
                <Link to="/homeowner" onClick={closeMobileMenu}>
                  <OptimizedImage src="/hobson-logo.png" alt="Hobson AI - AI-powered property management software company logo" className="h-12 md:h-16 w-auto" priority />
                </Link>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-6" role="navigation" aria-label="Main navigation">
                <Link to="/blog" className="text-base text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
                <Link to="/contact" className="text-base text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
                <Link to="/learn" className="text-base text-muted-foreground hover:text-foreground transition-colors">
                  Learn
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
                  <Link to="/contact" className="text-base text-muted-foreground hover:text-foreground transition-colors py-2" onClick={closeMobileMenu}>
                    Contact
                  </Link>
                  <Link to="/learn" className="text-base text-muted-foreground hover:text-foreground transition-colors py-2" onClick={closeMobileMenu}>
                    Learn
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
                    <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Say goodbye to digging through drawers </span>
                    <span className="text-foreground">or looking through folders</span>
                  </h1>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    Your personal AI assistant for home documents
                  </p>
                  
                  <a href="#pilot-section" className="bg-purple-50 border border-purple-200 rounded-lg p-4 inline-block hover:bg-purple-100 hover:border-purple-300 hover:scale-105 hover:shadow-sm transition-all duration-200 group" id="homepage-hero-assistant-cta">
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
                boxShadow: '25px 25px 60px rgba(0, 0, 0, 0.08), 15px 15px 40px rgba(0, 0, 0, 0.05), 8px 8px 25px rgba(0, 0, 0, 0.04), 0 -10px 30px rgba(0, 0, 0, 0.04), 0 20px 40px rgba(0, 0, 0, 0.06)',
                filter: 'drop-shadow(10px 10px 30px rgba(0, 0, 0, 0.06))'
              }}>
                  <PropertyManagementVisualizationHomeowner />
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
                     <HomepageGeorgiaVideoHomeowner />
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* Features Section */}
          <FeaturesSectionHomeowner />

          {/* Current Focus Section */}
          <section className="pt-8 pb-16 md:pt-12 md:pb-24 bg-muted/30">
            <div className="container mx-auto px-4">
              {/* Section Header */}
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                  Our Current Focus
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Starting strong, expanding further.
                </p>
              </div>

              <div className="max-w-6xl mx-auto">
                {/* Main Content Text */}
                <div className="text-center mb-16">
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-4xl mx-auto">
                    <span className="text-primary font-semibold">Right Now</span>, Hobson is already trained to understand a wide range of property documents — from tenancy agreements and commercial leases to licences, deeds, and addendums — and we're continually broadening its horizon.
                  </p>
                </div>

                {/* Our Approach - Full Width Card */}
                <div className="max-w-4xl mx-auto mb-16">
                  <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-6 md:p-8 border border-primary/20">
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-center">
                      Hobson recognises that documents don't exist in isolation — they often need to be read together to get the full picture.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* CTA Section - Clean layout without card */}
          <section id="pilot-section" className="py-8 md:py-24">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-4xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground leading-tight">
                  Ready to integrate AI into your business?
                </h2>
                <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
                  Join our exclusive pilot program and be among the first to experience the future of property intelligence.
                </p>
                <div className="mb-8">
                  <SimpleButton size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-medium" asChild>
                    <Link to="/pilot_form" id="homepage-pilot-apply-cta">Apply to join our Pilot →</Link>
                  </SimpleButton>
                </div>
              </div>
            </div>
          </section>

          {/* Scroll Video */}
          <HomepagePilotVideoHomeowner />


          {/* Footer */}
          <footer className="py-5 md:py-16 border-t bg-muted/20">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-3 gap-6 md:gap-12">
                {/* Logo */}
                <div>
                  <OptimizedImage src="/hobson-logo.png" alt="Hobson's AI logo" className="h-12 w-auto" />
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
                    {content.navigation.links.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className="block text-muted-foreground hover:text-foreground transition-colors"
                        title={link.title}
                      >
                        {link.label}
                      </Link>
                    ))}
                    <Link to="/data-protection" className="block text-muted-foreground hover:text-foreground transition-colors">
                      AI Privacy & Data Protection Policy
                    </Link>
                    <Link to="/breach-protocol" className="block text-muted-foreground hover:text-foreground transition-colors">
                      Data Breach Protocol
                    </Link>
                    <Link to="/refund-policy" className="block text-muted-foreground hover:text-foreground transition-colors">
                      Refund Policy
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