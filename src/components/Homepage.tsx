import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ArrowRight, ChevronDown } from "lucide-react";
import { SimpleButton } from "@/components/ui/simple-button";
import { OptimizedImage } from "@/components/OptimizedImage";
import { Helmet } from "react-helmet-async";
import { PropertyManagementVisualization } from "@/components/homepage/PropertyManagementVisualization";
import { HomepageGeorgiaVideo } from "@/components/videos/HomepageGeorgiaVideo";
import { FeaturesSection } from "@/components/homepage/FeaturesSection";
import { PricingSection } from "@/components/homepage/PricingSection";
import { PilotApplicationForm } from "@/components/homepage/PilotApplicationForm";

import owlMascot from "@/assets/owl-mascot.png";
import { getOrganizationStructuredData, getHomepageStructuredData, getHomepageFAQStructuredData } from "@/utils/seo-data";
import { useLanguage, useContent } from "@/contexts/LanguageContext";

export const Homepage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPilotForm, setShowPilotForm] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  
  const { language, setLanguage } = useLanguage();
  const content = useContent();
  const isGerman = language === 'de';
  const isUAE = language === 'ae';
  const isFrench = language === 'fr';
  const isSG = language === 'sg';
  const isAU = language === 'au';
  const isNZ = language === 'nz';
  const hideExtraNavItems = isGerman || isUAE || isFrench || isSG || isAU || isNZ;
  
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
    { code: 'de' as const, name: 'Deutsch', flag: (
      <svg className="w-5 h-auto rounded-sm" viewBox="0 0 60 36" xmlns="http://www.w3.org/2000/svg">
        <rect width="60" height="12" fill="#000"/>
        <rect y="12" width="60" height="12" fill="#DD0000"/>
        <rect y="24" width="60" height="12" fill="#FFCE00"/>
      </svg>
    )},
    { code: 'ae' as const, name: 'UAE', flag: (
      <svg className="w-5 h-auto rounded-sm" viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
        <rect width="60" height="10" fill="#00732F"/>
        <rect y="10" width="60" height="10" fill="#FFFFFF"/>
        <rect y="20" width="60" height="10" fill="#000000"/>
        <rect width="15" height="30" fill="#FF0000"/>
      </svg>
    )},
    { code: 'fr' as const, name: 'Français', flag: (
      <svg className="w-5 h-auto rounded-sm" viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
        <rect width="20" height="40" fill="#002395"/>
        <rect x="20" width="20" height="40" fill="#FFFFFF"/>
        <rect x="40" width="20" height="40" fill="#ED2939"/>
      </svg>
    )},
    { code: 'sg' as const, name: 'Singapore', flag: (
      <svg className="w-5 h-auto rounded-sm" viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
        <rect width="60" height="20" fill="#ED2939"/>
        <rect y="20" width="60" height="20" fill="#FFFFFF"/>
        <path d="M12,10 a6,6 0 1,1 0.01,0" fill="#FFFFFF"/>
        <path d="M14,10 a4,4 0 1,0 0.01,0" fill="#ED2939"/>
        <g fill="#FFFFFF" transform="translate(18,6)">
          <polygon points="0,3 1,0 2,3 -1,1.2 3,1.2" transform="scale(0.8)"/>
          <polygon points="0,3 1,0 2,3 -1,1.2 3,1.2" transform="translate(4,0) scale(0.8)"/>
          <polygon points="0,3 1,0 2,3 -1,1.2 3,1.2" transform="translate(6,2) scale(0.8)"/>
          <polygon points="0,3 1,0 2,3 -1,1.2 3,1.2" transform="translate(4,4) scale(0.8)"/>
          <polygon points="0,3 1,0 2,3 -1,1.2 3,1.2" transform="translate(0,4) scale(0.8)"/>
        </g>
      </svg>
    )},
    { code: 'au' as const, name: 'Australia', flag: (
      <svg className="w-5 h-auto rounded-sm" viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
        <rect width="60" height="30" fill="#00008B"/>
        <g transform="scale(0.5)">
          <clipPath id="au-s"><path d="M0,0 v30 h60 v-30 z"/></clipPath>
          <clipPath id="au-t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath>
          <g clipPath="url(#au-s)">
            <path d="M0,0 v30 h60 v-30 z" fill="#00008B"/>
            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
            <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#au-t)" stroke="#C8102E" strokeWidth="4"/>
            <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
            <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
          </g>
        </g>
        <g fill="#FFFFFF">
          <polygon points="45,22 46,19 47,22 44,20 48,20" transform="scale(0.7)"/>
          <polygon points="52,10 53,7 54,10 51,8 55,8" transform="scale(0.7)"/>
          <polygon points="56,16 57,13 58,16 55,14 59,14" transform="scale(0.7)"/>
          <polygon points="52,24 53,21 54,24 51,22 55,22" transform="scale(0.7)"/>
          <polygon points="48,18 49,15 50,18 47,16 51,16" transform="scale(0.7)"/>
        </g>
      </svg>
    )},
    { code: 'nz' as const, name: 'New Zealand', flag: (
      <svg className="w-5 h-auto rounded-sm" viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
        <rect width="60" height="30" fill="#00247D"/>
        <g transform="scale(0.5)">
          <clipPath id="nz-s"><path d="M0,0 v30 h60 v-30 z"/></clipPath>
          <clipPath id="nz-t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath>
          <g clipPath="url(#nz-s)">
            <path d="M0,0 v30 h60 v-30 z" fill="#00247D"/>
            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
            <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#nz-t)" stroke="#C8102E" strokeWidth="4"/>
            <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
            <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
          </g>
        </g>
        <g fill="#C8102E" stroke="#FFFFFF" strokeWidth="0.5">
          <polygon points="42,8 43,5 44,8 41,6 45,6"/>
          <polygon points="50,12 51,9 52,12 49,10 53,10"/>
          <polygon points="48,20 49,17 50,20 47,18 51,18"/>
          <polygon points="42,16 43,13 44,16 41,14 45,14"/>
        </g>
      </svg>
    )},
  ];
  
  const currentLanguage = languages.find(l => l.code === language) || languages[0];
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return <>
      <Helmet>
        <title>AI Property Management Software | Document Intelligence | Hobson AI</title>
        <meta name="description" content={content.seo.description} />
        <meta name="keywords" content="AI property management, tenancy agreement analysis, property AI, document automation, real estate AI, property technology, AI document analysis" />
        
        {/* OpenAI/ChatGPT specific meta tags */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        
        {/* Open Graph */}
        <meta property="og:title" content="AI Document Intelligence for Property Management | Hobson AI" />
        <meta property="og:description" content={content.seo.description} />
        <meta property="og:image" content="https://hobsonschoice.ai/hobson-owl-social.png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hobsonschoice.ai/" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@HobsonAI" />
        <meta name="twitter:title" content="AI Document Intelligence for Property Management" />
        <meta name="twitter:description" content={content.seo.description} />
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
                  <OptimizedImage src="/hobson-logo.png" alt={content.header.logoAlt} className="h-[59px] w-auto" priority />
                </Link>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-6" role="navigation" aria-label="Main navigation">
                {!hideExtraNavItems && (
                  <Link to="/blog" className="text-base text-muted-foreground hover:text-foreground transition-colors">
                    {content.header.nav.blog}
                  </Link>
                )}
                <Link to="/contact" className="text-base text-muted-foreground hover:text-foreground transition-colors">
                  {content.header.nav.contact}
                </Link>
                {!hideExtraNavItems && (
                  <Link to="/learn" className="text-base text-muted-foreground hover:text-foreground transition-colors">
                    {content.header.nav.learn}
                  </Link>
                )}
                
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
                              setLanguage(lang.code);
                              setIsLanguageOpen(false);
                            }}
                            className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors ${
                              language === lang.code ? 'bg-muted/50 text-foreground' : 'text-muted-foreground'
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
                  {!hideExtraNavItems && (
                    <Link to="/blog" className="text-base text-muted-foreground hover:text-foreground transition-colors py-2" onClick={closeMobileMenu}>
                      {content.header.nav.blog}
                    </Link>
                  )}
                  <Link to="/contact" className="text-base text-muted-foreground hover:text-foreground transition-colors py-2" onClick={closeMobileMenu}>
                    {content.header.nav.contact}
                  </Link>
                  {!hideExtraNavItems && (
                    <Link to="/learn" className="text-base text-muted-foreground hover:text-foreground transition-colors py-2" onClick={closeMobileMenu}>
                      {content.header.nav.learn}
                    </Link>
                  )}
                  
                  {/* Mobile Language Selector */}
                  <div className="border-t pt-4 mt-2">
                    <p className="text-sm text-muted-foreground mb-3">Region / Language</p>
                    <div className="grid grid-cols-2 gap-2">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code);
                            closeMobileMenu();
                          }}
                          className={`flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg border transition-colors ${
                            language === lang.code 
                              ? 'bg-primary/10 border-primary text-foreground font-medium' 
                              : 'border-border text-muted-foreground hover:bg-muted'
                          }`}
                        >
                          {lang.flag}
                          <span className="text-xs truncate">{lang.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
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
                  <h1 id="hero-heading" className={`font-bold leading-tight ${isGerman ? 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl' : 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl'}`} lang={language} style={isGerman ? { hyphens: 'auto', wordBreak: 'break-word' } : {}}>
                    <span className="text-foreground">{content.hero.title} </span>
                    <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">{content.hero.titleHighlight}</span>
                  </h1>
                  <p className={`text-muted-foreground leading-relaxed ${isGerman ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'}`} lang={language} style={isGerman ? { hyphens: 'auto' } : {}}>{content.hero.subtitle}
                  </p>
                  
                  <a href="#pricing-section" className="bg-purple-50 border border-purple-200 rounded-xl px-6 py-3 inline-block hover:bg-purple-100 hover:border-purple-300 hover:scale-105 hover:shadow-lg transition-all duration-200 group" id="homepage-hero-pricing-cta">
                    <div className="inline-flex items-center gap-3 text-purple-600 hover:text-purple-700 font-medium text-base">
                      {content.hero.ctaButton}
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
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-foreground">{content.howItWorks.title}</h2>
                      <p className="text-lg sm:text-xl text-muted-foreground">{content.howItWorks.subtitle}</p>
                    </div>
                  </div>
                  <div className="space-y-6 sm:space-y-8">
                    {content.howItWorks.steps.map((step, index) => (
                      <div key={index} className="flex items-start gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-base sm:text-lg font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground">{step.title}</h3>
                          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
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
                  {content.cta.title}
                </h2>
              </div>
              <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
                {content.cta.subtitle}
              </p>
              <SimpleButton onClick={() => setShowPilotForm(true)} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 h-auto">
                {content.cta.button}
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
                  <OptimizedImage src="/hobson-logo.png" alt={content.header.logoAlt} className="h-[59px] w-auto" />
                </div>
                
                {/* Product Column */}
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-foreground">{content.footer.product.title}</h4>
                  <div className="space-y-3">
                    <Link to="/pilot" className="block text-muted-foreground hover:text-foreground transition-colors">
                      {content.footer.product.pilotLink}
                    </Link>
                  </div>
                </div>
                
                {/* Company Column */}
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-foreground">{content.footer.company.title}</h4>
                  <div className="space-y-3">
                    {content.navigation.links
                      .filter(link => {
                        if (hideExtraNavItems && (link.to === '/blog' || link.to === '/learn')) return false;
                        return true;
                      })
                      .map(link => (
                        <Link
                          key={link.to}
                          to={link.to}
                          className="block text-muted-foreground hover:text-foreground transition-colors"
                          title={link.title}
                        >
                          {link.label}
                        </Link>
                      ))}
                    <Link to="/investment-opportunity" className="block text-muted-foreground hover:text-foreground transition-colors" title={content.footer.company.investmentOpportunity}>
                      {content.footer.company.investmentOpportunity}
                    </Link>
                    <Link to="/data-protection" className="block text-muted-foreground hover:text-foreground transition-colors">
                      {content.footer.company.dataProtection}
                    </Link>
                    <Link to="/breach-protocol" className="block text-muted-foreground hover:text-foreground transition-colors">
                      {content.footer.company.breachProtocol}
                    </Link>
                    <Link to="/refund-policy" className="block text-muted-foreground hover:text-foreground transition-colors">
                      {content.footer.company.refundPolicy}
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
