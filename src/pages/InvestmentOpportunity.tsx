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

// Section data with pages
const sections = [
  {
    id: 'strategy',
    title: 'Strategy & Positioning',
    subtitle: 'Executive Summary & Approach',
    icon: Target,
    color: 'from-blue-500/10 to-blue-600/10',
    iconColor: 'text-blue-600',
    pages: [
      {
        title: 'Executive Summary',
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
            }
          ]
        }
      },
      {
        title: 'Approach',
        content: {
          overview: 'Our strategic approach combines AI innovation with deep property industry expertise to deliver unprecedented value through three key focus areas.',
          sections: [
            {
              title: 'Brand Focus',
              items: [
                'Personalisation – Deliver relevant, context-aware experiences',
                'Integrity – Be transparent and set clear expectations',
                'Expectations – Meet essentials first, then exceed over time',
                'Resolution – Act on feedback and data to improve fast',
                'Time & Effort – Make every interaction simple and efficient',
                'Empathy – Design for real-world client challenges'
              ]
            },
            {
              title: 'Product Focus',
              items: [
                'Helps users retrieve and unify information they already have, even if scattered across documents or systems',
                'Simple interface with no learning curve',
                'Works alongside existing tools, with a gentle adoption curve',
                'Designed to be a trust-building assistant, becoming more proactive and helpful over time',
                'Future vision: anticipates user needs, takes initiative, supports workflows'
              ]
            },
            {
              title: 'Business Focus',
              items: [
                'No license, per-user, or per-asset pricing',
                'Users pay based on usage, measured in Hobson\'s Energy Units',
                'Transparent way to account for effort put into tasks (answering questions, reading documents, building reports)',
                'Flexible billing that matches real usage',
                'Low base cost to grab market share'
              ]
            }
          ]
        }
      }
    ]
  },
  {
    id: 'market',
    title: 'Market & Customers',
    subtitle: 'Customer Segmentation, Market Size & Competitive Landscape',
    icon: Users,
    color: 'from-purple-500/10 to-purple-600/10',
    iconColor: 'text-purple-600',
    pages: [
      {
        title: 'Customer Segmentation',
        content: {
          overview: 'Our target market spans three distinct customer segments with unique needs and pain points.',
          sections: []
        }
      },
      {
        title: 'Market Size & Opportunity',
        content: {
          overview: 'The global property management market presents significant opportunities for AI-powered solutions.',
          sections: []
        }
      },
      {
        title: 'Competitive Landscape',
        content: {
          overview: 'Analysis of current market players and our competitive positioning.',
          sections: []
        }
      }
    ]
  },
  {
    id: 'roadmap',
    title: 'Roadmap & Product',
    subtitle: 'Timeline, Milestones, Partnership Programme & Development Philosophy',
    icon: Map,
    color: 'from-green-500/10 to-green-600/10',
    iconColor: 'text-green-600',
    pages: [
      {
        title: 'Timeline & Milestones',
        content: {
          overview: 'Strategic product development timeline from MVP to Phase 2 and beyond.',
          sections: []
        }
      },
      {
        title: 'Partnership Programme',
        content: {
          overview: 'Our approach to building strategic partnerships and pilot validation.',
          sections: []
        }
      },
      {
        title: 'Development Philosophy',
        content: {
          overview: 'Core principles guiding our product development and AI architecture.',
          sections: []
        }
      }
    ]
  },
  {
    id: 'commercials',
    title: 'Commercials',
    subtitle: 'Pricing Philosophy, HEU Model & Sample Scenarios',
    icon: DollarSign,
    color: 'from-amber-500/10 to-amber-600/10',
    iconColor: 'text-amber-600',
    pages: [
      {
        title: 'Pricing Philosophy',
        content: {
          overview: 'Usage-based pricing model designed to eliminate barriers to adoption.',
          sections: []
        }
      },
      {
        title: 'HEU Model',
        content: {
          overview: 'How Hobson Energy Units work and their cost structure.',
          sections: []
        }
      },
      {
        title: 'Sample Scenarios',
        content: {
          overview: 'Real-world pricing examples and cost projections.',
          sections: []
        }
      }
    ]
  },
  {
    id: 'financials',
    title: 'Financials',
    subtitle: 'Forecast & Assumptions, OPEX, COP & Staffing',
    icon: PieChart,
    color: 'from-red-500/10 to-red-600/10',
    iconColor: 'text-red-600',
    pages: [
      {
        title: 'Financial Forecast',
        content: {
          overview: 'Revenue projections and growth assumptions.',
          sections: []
        }
      },
      {
        title: 'Operating Expenses',
        content: {
          overview: 'Detailed breakdown of operational costs.',
          sections: []
        }
      },
      {
        title: 'Cost of Product',
        content: {
          overview: 'Infrastructure and AI cost analysis.',
          sections: []
        }
      },
      {
        title: 'Staffing',
        content: {
          overview: 'Team growth plan and hiring roadmap.',
          sections: []
        }
      }
    ]
  },
  {
    id: 'team',
    title: 'Team',
    subtitle: 'Leadership & Key Personnel',
    icon: Briefcase,
    color: 'from-indigo-500/10 to-indigo-600/10',
    iconColor: 'text-indigo-600',
    pages: [
      {
        title: 'Leadership Team',
        content: {
          overview: 'Meet the founders and executive team behind Hobson AI.',
          sections: []
        }
      }
    ]
  },
  {
    id: 'appendices',
    title: 'Appendices',
    subtitle: 'Detailed Personas, Efficiency Savings & Source Data',
    icon: BookOpen,
    color: 'from-teal-500/10 to-teal-600/10',
    iconColor: 'text-teal-600',
    pages: [
      {
        title: 'Detailed Personas',
        content: {
          overview: 'In-depth profiles of target customer segments.',
          sections: []
        }
      },
      {
        title: 'Efficiency Savings',
        content: {
          overview: 'Market size calculations and efficiency gain projections.',
          sections: []
        }
      },
      {
        title: 'Source Data',
        content: {
          overview: 'References and market research sources.',
          sections: []
        }
      }
    ]
  }
];

const InvestmentOpportunity = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSection, setSelectedSection] = useState<typeof sections[0] | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
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
        <section className="py-12 border-b bg-gradient-to-b from-background to-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              {/* Mission Statement */}
              <div className="mb-8">
                <h2 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3 text-center">
                  Mission Statement
                </h2>
                <p className="text-lg md:text-xl text-foreground leading-relaxed text-center max-w-4xl mx-auto">
                  To go beyond simple data access by giving property professionals instant, accurate information enriched with AI judgement, context, and connected insight.
                </p>
              </div>

              {/* Positioning Statement */}
              <div className="mb-8 pb-8 border-b">
                <h2 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3 text-center">
                  Positioning Statement
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed text-center max-w-4xl mx-auto">
                  For real estate professionals drained by large, expensive systems and the manual effort of pulling information from original documents, Hobson is a <span className="font-semibold text-foreground">specialised AI-powered assistant</span> that transforms source-of-truth files into instant, reliable answers. Unlike complex platforms, Hobson is <span className="font-semibold text-foreground">lightweight, simple to use, and low cost</span> — saving time, ensuring accuracy, and building trust with fast, referenced responses.
                </p>
              </div>

              {/* Funding & Download Section */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-primary/5 border border-primary/20 rounded-lg p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Funding Requirement</p>
                    <p className="text-2xl font-bold text-foreground">£750,000</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button size="lg" className="gap-2">
                    <Download className="w-4 h-4" />
                    Download Full Business Plan
                  </Button>
                  <Button size="lg" variant="outline" className="gap-2">
                    <FileText className="w-4 h-4" />
                    View Summary
                  </Button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground italic text-center mt-6">
                Materials on this page are confidential and intended for authorised investors only
              </p>
            </div>
          </div>
        </section>

        {/* Section Cards Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
                Explore Detailed Sections
              </h2>
              <p className="text-muted-foreground mb-8 text-center">
                Click any section below to view detailed information or download individual documents
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sections.map((section) => (
                  <Card
                    key={section.id}
                    className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-2 hover:border-primary/50"
                  >
                    <div className={`h-2 bg-gradient-to-r ${section.color}`}></div>
                    <div className="p-6">
                      <div className="flex items-start gap-4 mb-6">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                          <section.icon className={`w-7 h-7 ${section.iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-foreground mb-1">
                            {section.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {section.subtitle}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSection(section);
                          }}
                          variant="default"
                          size="sm"
                          className="flex-1 gap-2 h-9"
                        >
                          <FileText className="w-4 h-4" />
                          View
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Download functionality would go here
                            toast({
                              title: 'Download Started',
                              description: `Downloading ${section.title}...`,
                            });
                          }}
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-2 h-9"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
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
      <Dialog open={!!selectedSection} onOpenChange={() => {
        setSelectedSection(null);
        setCurrentPageIndex(0);
      }}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-hidden flex flex-col">
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

              {/* Page Navigation Tabs */}
              {selectedSection.pages.length > 1 && (
                <div className="border-b">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {selectedSection.pages.map((page, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentPageIndex(idx)}
                        className={`px-4 py-2 text-sm font-medium rounded-t-lg whitespace-nowrap transition-colors ${
                          currentPageIndex === idx
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                      >
                        {page.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Page Content */}
              <div className="flex-1 overflow-y-auto mt-6 space-y-8">
                {selectedSection.pages[currentPageIndex] && (
                  <>
                    {/* Overview */}
                    <div className="prose prose-sm max-w-none">
                      <p className="text-lg text-foreground leading-relaxed">
                        {selectedSection.pages[currentPageIndex].content.overview}
                      </p>
                    </div>

                    {/* Content Sections */}
                    {selectedSection.pages[currentPageIndex].content.sections.map((contentSection, idx) => (
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
                          Download {selectedSection.pages[currentPageIndex].title}
                        </Button>
                        <Button variant="outline" className="flex-1">
                          View Related Documents
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Page Navigation Arrows */}
              {selectedSection.pages.length > 1 && (
                <div className="flex items-center justify-between pt-4 border-t mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPageIndex(Math.max(0, currentPageIndex - 1))}
                    disabled={currentPageIndex === 0}
                    className="gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </Button>
                  
                  <span className="text-sm text-muted-foreground">
                    Page {currentPageIndex + 1} of {selectedSection.pages.length}
                  </span>
                  
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPageIndex(Math.min(selectedSection.pages.length - 1, currentPageIndex + 1))}
                    disabled={currentPageIndex === selectedSection.pages.length - 1}
                    className="gap-2"
                  >
                    Next
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InvestmentOpportunity;
