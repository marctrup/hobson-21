import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Brain, Zap, Search, Shield, Users, Globe, Building2, TrendingUp, MapPin, PenTool, CreditCard, Heart, ArrowRight, MessageCircle, FileText, Lightbulb, Target, CheckCircle, FileHeart, ChevronDown } from "lucide-react";
import { SimpleButton } from "@/components/ui/simple-button";
import { Badge } from "@/components/ui/badge";
import { SimpleCard, SimpleCardContent } from "@/components/ui/simple-card";
import { OptimizedImage } from "@/components/OptimizedImage";
import { Helmet } from "react-helmet-async";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PropertyManagementVisualization } from "@/components/homepage/PropertyManagementVisualization";
import { HomepageGeorgiaVideo } from "@/components/videos/HomepageGeorgiaVideo";
import { FeaturesSection } from "@/components/homepage/FeaturesSection";
import { PricingSection } from "@/components/homepage/PricingSection";
import { PilotApplicationForm } from "@/components/homepage/PilotApplicationForm";
import { NAVIGATION_LINKS } from "@/config/navigation";
import owlMascot from "@/assets/owl-mascot.png";
import { getOrganizationStructuredData, getHomepageStructuredData, getHomepageFAQStructuredData } from "@/utils/seo-data";
// Lazy load video only when needed

export const Homepage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPilotForm, setShowPilotForm] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'fr' | 'de'>('en');
  
  const languages = [
    { code: 'en' as const, name: 'English', flag: (
      <svg className="w-5 h-auto rounded-sm" viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
        <clipPath id="uk-s"><path d="M0,0 v30 h60 v-30 z"/></clipPath>
        <clipPath id="uk-t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath>
        <g clipPath="url(#uk-s)">
          <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
          <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#uk-t)" stroke="#C8102E" strokeWidth="4"/>
          <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
          <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
        </g>
      </svg>
    )},
    { code: 'fr' as const, name: 'Français', flag: (
      <svg className="w-5 h-auto rounded-sm" viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
        <rect width="20" height="40" fill="#002395"/>
        <rect x="20" width="20" height="40" fill="#fff"/>
        <rect x="40" width="20" height="40" fill="#ED2939"/>
      </svg>
    )},
    { code: 'de' as const, name: 'Deutsch', flag: (
      <svg className="w-5 h-auto rounded-sm" viewBox="0 0 60 36" xmlns="http://www.w3.org/2000/svg">
        <rect width="60" height="12" fill="#000"/>
        <rect y="12" width="60" height="12" fill="#DD0000"/>
        <rect y="24" width="60" height="12" fill="#FFCE00"/>
      </svg>
    )},
  ];
  
  const currentLanguage = languages.find(l => l.code === selectedLanguage) || languages[0];
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  return <>
      <Helmet>
        <title>AI Property Management Software | Document Intelligence | Hobson AI</title>
        <meta name="description" content="Transform tenancy agreements with intelligent AI analysis, automated insights, and instant answers. Property document intelligence for modern property management." />
        <meta name="keywords" content="AI property management, tenancy agreement analysis, property AI, document automation, real estate AI, property technology, AI document analysis" />
        
        {/* OpenAI/ChatGPT specific meta tags */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        
        {/* Open Graph */}
        <meta property="og:title" content="AI Document Intelligence for Property Management | Hobson AI" />
        <meta property="og:description" content="Transform tenancy agreements with intelligent AI analysis, automated insights, and instant answers to complex property questions." />
        <meta property="og:image" content="https://hobsonschoice.ai/hobson-owl-social.png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hobsonschoice.ai/" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@HobsonAI" />
        <meta name="twitter:title" content="AI Document Intelligence for Property Management" />
        <meta name="twitter:description" content="Transform tenancy agreements with intelligent AI analysis and automated insights." />
        <meta name="twitter:image" content="https://hobsonschoice.ai/hobson-owl-social.png" />
        
        <link rel="canonical" href="https://hobsonschoice.ai/" />
        
        {/* Preload critical assets */}
        <link rel="preload" href="/hobson-logo.png" as="image" />
        <link rel="preload" href={owlMascot} as="image" />
        
        {/* Structured Data for AI Crawlers */}
        <script type="application/ld+json">
          {JSON.stringify(getOrganizationStructuredData())}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(getHomepageStructuredData())}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(getHomepageFAQStructuredData())}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background overflow-x-hidden">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50" role="banner">
          <div className="container mx-auto px-4 py-1">
            <div className="flex justify-between items-center">
              {/* Logo */}
              <div className="relative">
                <Link to="/" onClick={closeMobileMenu}>
                  <OptimizedImage src="/hobson-logo.png" alt="Hobson AI - AI-powered property management software company logo" className="h-[59px] w-auto" priority />
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
                
                {/* Language dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted"
                    title="Select language"
                  >
                    {currentLanguage.flag}
                    <span className="hidden lg:inline">{currentLanguage.code.toUpperCase()}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${isLanguageOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isLanguageOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsLanguageOpen(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 bg-background border border-border rounded-lg shadow-lg py-1 z-50 min-w-[140px]">
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              setSelectedLanguage(lang.code);
                              setIsLanguageOpen(false);
                            }}
                            className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors ${
                              selectedLanguage === lang.code ? 'bg-muted/50 text-foreground' : 'text-muted-foreground'
                            }`}
                          >
                            {lang.flag}
                            <span>{lang.name}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
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
          <section className="pt-12 sm:pt-16 pb-4" aria-labelledby="hero-heading">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center py-6 sm:py-8 lg:py-12">
                {/* Left Container - H1 and Strap Line */}
                <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
                  <h1 id="hero-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                    <span className="text-foreground">Move toward clarity, simplicity, and affordable AI, </span>
                    <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">without replacing the tools you rely on.</span>
                  </h1>
                  <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">Your documents. Your truth. -  Hobson is a specialised AI assistant trained on real estate documents that delivers quick, clear, and trusted answers every time.
                  </p>
                  
                  <a href="#pricing-section" className="bg-purple-50 border border-purple-200 rounded-xl px-6 py-3 inline-block hover:bg-purple-100 hover:border-purple-300 hover:scale-105 hover:shadow-lg transition-all duration-200 group" id="homepage-hero-pricing-cta">
                    <div className="inline-flex items-center gap-3 text-purple-600 hover:text-purple-700 font-medium text-base">
                      See pricing
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                  </a>
                  
                </div>

                {/* Right Container - Document to Insights Visualization */}
                <div className="relative mt-8 lg:mt-[5px] font-space transition-transform duration-300 border-[2px] sm:border-[3px] border-gray-500 rounded-lg" style={{
                transform: 'perspective(1000px) rotateY(-10deg)',
                transformStyle: 'preserve-3d',
                boxShadow: '15px 15px 40px rgba(0, 0, 0, 0.06), 8px 8px 25px rgba(0, 0, 0, 0.04), 0 -5px 20px rgba(0, 0, 0, 0.03), 0 10px 30px rgba(0, 0, 0, 0.05)',
                filter: 'drop-shadow(5px 5px 20px rgba(0, 0, 0, 0.04))'
              }}>
                  <PropertyManagementVisualization />
                </div>

              </div>
            </div>
          </section>

          {/* How It Works & Video Section - Separated Headers and Content */}
          <section className="py-6 sm:py-8 md:py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              {/* Content Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start">
                
                {/* Left Content - How It Works Steps */}
                <div>
                  <div className="mb-6 sm:mb-8 flex items-center gap-4">
                    <OptimizedImage src={owlMascot} alt="Hobson AI Owl Mascot" className="w-16 h-16 sm:w-20 sm:h-20 object-contain" width={80} height={80} priority={true} fetchPriority="high" />
                    <div>
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-foreground">How It Works</h2>
                      <p className="text-lg sm:text-xl text-muted-foreground">Gaining insight and information couldn't be easier</p>
                    </div>
                  </div>
                  <div className="space-y-6 sm:space-y-8">
                    {/* Step 1 */}
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-base sm:text-lg font-bold flex-shrink-0">
                        1
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground">Upload & Connect</h3>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                          Upload your documents or connect your existing systems. Our AI instantly begins processing and indexing your content.
                        </p>
                      </div>
                    </div>
                    
                    {/* Step 2 */}
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-base sm:text-lg font-bold flex-shrink-0">
                        2
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground">Ask Questions</h3>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                          Ask natural language questions about your properties, leases, contracts, or any document content.
                        </p>
                      </div>
                    </div>
                    
                    {/* Step 3 */}
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-base sm:text-lg font-bold flex-shrink-0">
                        3
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground">Get Insights</h3>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                          Receive instant, accurate answers with full source citations and actionable recommendations.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Content - Georgia Video */}
                <div className="mt-6 lg:mt-0">
                  <div className="aspect-[3/2] bg-gray-100 rounded-xl overflow-hidden relative" style={{
                  border: '6px solid #f0f0f0'
                }}>
                     <HomepageGeorgiaVideo />
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* Features Section */}
          <FeaturesSection />

          {/* Pricing Section */}
          <PricingSection />

          {/* CTA Section */}
          <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="container mx-auto px-4 text-center">
              <div className="flex items-center justify-center gap-4 mb-4 sm:mb-6">
                <OptimizedImage src={owlMascot} alt="Hobson AI Owl Mascot" className="w-16 h-16 sm:w-20 sm:h-20 object-contain" width={80} height={80} />
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                  Ready to introduce AI into your business?
                </h2>
              </div>
              <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
                Join our free pilot program and experience the power of AI-driven property intelligence
              </p>
              <SimpleButton onClick={() => setShowPilotForm(true)} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 h-auto">
                Join our free pilot
              </SimpleButton>
            </div>
          </section>

          <PilotApplicationForm showForm={showPilotForm} setShowForm={setShowPilotForm} />

          {/* Footer */}
          <footer className="py-5 md:py-16 border-t bg-white">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-3 gap-6 md:gap-12">
                {/* Logo */}
                <div>
                  <OptimizedImage src="/hobson-logo.png" alt="Hobson's AI logo" className="h-[59px] w-auto" />
                </div>
                
                {/* Product Column */}
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-foreground">Product</h4>
                  <div className="space-y-3">
                    <Link to="/pilot" className="block text-muted-foreground hover:text-foreground transition-colors">
                      Join our pilot programme
                    </Link>
                  </div>
                </div>
                
                {/* Company Column */}
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-foreground">Company</h4>
                  <div className="space-y-3">
                    {NAVIGATION_LINKS.map(link => <Link key={link.to} to={link.to} className="block text-muted-foreground hover:text-foreground transition-colors" title={link.title}>
                        {link.label}
                      </Link>)}
                    <Link to="/investment-opportunity" className="block text-muted-foreground hover:text-foreground transition-colors" title="Investment Opportunity">
                      Investment Opportunity
                    </Link>
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