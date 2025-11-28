import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { GlobalHeader } from '@/components/GlobalHeader';
import { HomepageFooter } from '@/components/homepage/HomepageFooter';
import { Lock, FileText, Download, BarChart, TrendingUp, Code, Users, Target, Map, DollarSign, PieChart, Briefcase, BookOpen, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { OptimizedImage } from '@/components/OptimizedImage';
import hobsonLogo from '/hobson-logo.png';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

// Section data with content
const sections = [
  {
    id: 'strategy',
    title: 'Strategy & Positioning',
    subtitle: 'Executive Summary, Positioning Statement & Approach',
    icon: Target,
    color: 'from-blue-500/10 to-blue-600/10',
    iconColor: 'text-blue-600',
    content: {
      overview: 'Hobson is an AI-native assistant tailored for the property industry. It automates insight extraction, decision support, and document understanding—built for trust, accuracy, and zero onboarding. Hobson becomes smarter over time, evolving into a proactive operations co-pilot.',
      sections: [
        {
          title: 'Market Opportunity',
          items: [
            '£6B UK efficiency savings potential',
            '£66B in Europe, £708B globally',
            '134K+ UK real estate firms; 96% are small operators',
            'PropTech is rapidly evolving from passive tools to intelligent assistants — Hobson leads this next wave'
          ]
        },
        {
          title: 'Traction & Milestones',
          items: [
            'MVP live, validated with 4 real-world partners',
            'Partners include EPAM Asset Management, Live-in Guardians, and Landhold Investments',
            'Document types: leases, deeds, floorplans, certificates',
            'Phase 2 planned for Oct 2025: mobile, API, deeper AI'
          ]
        },
        {
          title: 'Revenue Model',
          items: [
            'Usage-based via Hobson Energy Units (HEUs)',
            'No per-user or license fees',
            'Plans: Free, Monthly (£20+VAT), Onboarding, Top-up',
            'Typical cost: £0.54 for full lease extraction; ~£0.001 for simple queries'
          ]
        },
        {
          title: 'Funding requirement – Seeking £750,000',
          items: [
            'Complete Phase 2 build',
            'Hire sales & AI team',
            'Expand data connectors, alerts, and automation'
          ]
        }
      ]
    }
  },
  {
    id: 'market',
    title: 'Market & Customers',
    subtitle: 'Customer Segmentation, Market Size & Competitive Landscape',
    icon: Users,
    color: 'from-purple-500/10 to-purple-600/10',
    iconColor: 'text-purple-600',
    content: {
      overview: 'Deep analysis of target customer segments, total addressable market, and competitive positioning.',
      sections: []
    }
  },
  {
    id: 'roadmap',
    title: 'Roadmap & Product',
    subtitle: 'Timeline, Milestones, Partnership Programme & Development Philosophy',
    icon: Map,
    color: 'from-green-500/10 to-green-600/10',
    iconColor: 'text-green-600',
    content: {
      overview: 'Product development timeline, feature roadmap, and strategic partnerships.',
      sections: []
    }
  },
  {
    id: 'commercials',
    title: 'Commercials',
    subtitle: 'Pricing Philosophy, HEU Model & Sample Scenarios',
    icon: DollarSign,
    color: 'from-amber-500/10 to-amber-600/10',
    iconColor: 'text-amber-600',
    content: {
      overview: 'Detailed pricing strategy, Hobson Energy Units model, and revenue projections.',
      sections: []
    }
  },
  {
    id: 'financials',
    title: 'Financials',
    subtitle: 'Forecast & Assumptions, OPEX, COP & Staffing',
    icon: PieChart,
    color: 'from-red-500/10 to-red-600/10',
    iconColor: 'text-red-600',
    content: {
      overview: 'Financial projections, operating expenses, cost of product, and staffing plans.',
      sections: []
    }
  },
  {
    id: 'team',
    title: 'Team',
    subtitle: 'Leadership & Key Personnel',
    icon: Briefcase,
    color: 'from-indigo-500/10 to-indigo-600/10',
    iconColor: 'text-indigo-600',
    content: {
      overview: 'Meet the team behind Hobson AI and our strategic advisors.',
      sections: []
    }
  },
  {
    id: 'appendices',
    title: 'Appendices',
    subtitle: 'Detailed Personas, Efficiency Savings & Source Data',
    icon: BookOpen,
    color: 'from-teal-500/10 to-teal-600/10',
    iconColor: 'text-teal-600',
    content: {
      overview: 'Supporting documentation, detailed personas, market data, and technical breakdowns.',
      sections: []
    }
  }
];

const InvestmentOpportunity = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSection, setSelectedSection] = useState<typeof sections[0] | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user has already authenticated in this session
  useEffect(() => {
    const authenticated = sessionStorage.getItem('investment_authenticated');
    if (authenticated === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call edge function to verify password
      const { data, error } = await supabase.functions.invoke('verify-investment-password', {
        body: { password },
      });

      if (error) throw error;

      if (data.valid) {
        sessionStorage.setItem('investment_authenticated', 'true');
        setIsAuthenticated(true);
        toast({
          title: 'Access Granted',
          description: 'Welcome to the Investment Opportunity page',
        });
      } else {
        toast({
          title: 'Access Denied',
          description: 'Incorrect password',
          variant: 'destructive',
        });
        setPassword('');
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      toast({
        title: 'Error',
        description: 'Failed to verify password. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <GlobalHeader />
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
          <Card className="w-full max-w-md p-8">
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-center mb-2">
                Investment Opportunity
              </h1>
              <p className="text-muted-foreground text-center text-sm">
                This page is password protected
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="text-sm font-medium mb-2 block">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  disabled={isLoading}
                  className="w-full"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Access Page'}
              </Button>
            </form>
          </Card>
        </div>
        <HomepageFooter />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <Link to="/" className="transition-opacity hover:opacity-80">
                <OptimizedImage 
                  src={hobsonLogo} 
                  alt="Hobson AI Logo" 
                  className="h-12"
                />
              </Link>
              <h1 className="text-xl font-semibold text-foreground">
                Investment Opportunity
              </h1>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-16 border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Discover the Hobson Opportunity
              </h2>
              <p className="text-xl text-muted-foreground mb-4 max-w-3xl mx-auto">
                Explore our comprehensive business plan, market analysis, product roadmap, and financial projections.
              </p>
              <p className="text-sm text-muted-foreground italic">
                Materials on this page are confidential and intended for authorised investors only
              </p>
            </div>
          </div>
        </section>

        {/* Section Cards Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sections.map((section) => (
                  <Card
                    key={section.id}
                    onClick={() => setSelectedSection(section)}
                    className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden border-2 hover:border-primary/50"
                  >
                    <div className={`h-2 bg-gradient-to-r ${section.color}`}></div>
                    <div className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                          <section.icon className={`w-7 h-7 ${section.iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                            {section.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {section.subtitle}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-primary font-medium group-hover:translate-x-1 transition-transform">
                        View Details
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Funding CTA Section */}
        <section className="py-16 border-t bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                <TrendingUp className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Seeking £750,000
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                To complete Phase 2 build, hire sales & AI team, and expand data connectors, alerts, and automation
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gap-2">
                  <Download className="w-5 h-5" />
                  Download Full Deck
                </Button>
                <Button size="lg" variant="outline">
                  Schedule Meeting
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t bg-background py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Link to="/" className="inline-block transition-opacity hover:opacity-80">
                <OptimizedImage 
                  src={hobsonLogo} 
                  alt="Hobson AI Logo" 
                  className="h-12 mx-auto mb-4"
                />
              </Link>
              <p className="text-sm text-muted-foreground mb-2">
                © 2024 Hobson's Choice AI. All rights reserved.
              </p>
              <p className="text-sm text-muted-foreground">
                Investor Relations: <a href="mailto:investors@hobsonschoice.ai" className="text-primary hover:underline">investors@hobsonschoice.ai</a>
              </p>
              <p className="text-xs text-muted-foreground mt-4 italic">
                Confidential and proprietary. Not for distribution.
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* Modal Dialog */}
      <Dialog open={!!selectedSection} onOpenChange={() => setSelectedSection(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          {selectedSection && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4 mb-2">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedSection.color} flex items-center justify-center flex-shrink-0`}>
                    <selectedSection.icon className={`w-6 h-6 ${selectedSection.iconColor}`} />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl">{selectedSection.title}</DialogTitle>
                    <DialogDescription className="text-base mt-1">
                      {selectedSection.subtitle}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="mt-6 space-y-8">
                {/* Overview */}
                <div className="prose prose-sm max-w-none">
                  <p className="text-lg text-foreground leading-relaxed">
                    {selectedSection.content.overview}
                  </p>
                </div>

                {/* Content Sections */}
                {selectedSection.content.sections.map((contentSection, idx) => (
                  <div key={idx} className="space-y-4">
                    <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                      <span className="w-1 h-6 bg-primary rounded-full"></span>
                      {contentSection.title}
                    </h3>
                    <ul className="space-y-3 pl-4">
                      {contentSection.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-start gap-3 text-foreground">
                          <span className="w-2 h-2 rounded-full bg-primary/60 mt-2 flex-shrink-0"></span>
                          <span className="text-base leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {/* Download Section */}
                <div className="pt-6 border-t">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="flex-1 gap-2">
                      <Download className="w-4 h-4" />
                      Download Section PDF
                    </Button>
                    <Button variant="outline" className="flex-1">
                      View Related Documents
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InvestmentOpportunity;
