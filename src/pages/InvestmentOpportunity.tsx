import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { GlobalHeader } from '@/components/GlobalHeader';
import { HomepageFooter } from '@/components/homepage/HomepageFooter';
import { Lock, FileText, Download, BarChart, TrendingUp, Code } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { OptimizedImage } from '@/components/OptimizedImage';
import hobsonLogo from '/hobson-logo.png';

const InvestmentOpportunity = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between max-w-6xl mx-auto">
              <Link to="/" className="transition-opacity hover:opacity-80">
                <OptimizedImage 
                  src={hobsonLogo} 
                  alt="Hobson AI Logo" 
                  className="h-14"
                />
              </Link>
              <h1 className="text-xl font-semibold text-muted-foreground">
                Investor Resources
              </h1>
            </div>
          </div>
        </header>

        {/* Mission Statement Section */}
        <section className="py-16 border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
                  Mission Statement
                </h2>
                <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                  <p className="text-2xl md:text-3xl font-semibold text-foreground leading-relaxed">
                    To go beyond simple data access by giving property professionals instant, accurate information enriched with AI judgement, context, and connected insight.
                  </p>
                </Card>
              </div>
              <p className="text-sm text-muted-foreground italic text-center">
                Materials on this page are confidential and intended for authorised investors only
              </p>
            </div>
          </div>
        </section>

        {/* Positioning Statement Section */}
        <section className="py-12 border-b bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-sm font-semibold text-primary uppercase tracking-wider mb-6 text-center">
                Our Positioning Statement
              </h2>
              <Card className="p-8 bg-background/80 backdrop-blur border-primary/20">
                <p className="text-lg leading-relaxed text-foreground">
                  For real estate professionals drained by large, expensive systems and the manual effort of pulling information from original documents, Hobson is a <span className="font-semibold text-primary">specialised AI-powered assistant</span> that transforms source-of-truth files into instant, reliable answers. Unlike complex platforms, Hobson is <span className="font-semibold">lightweight, simple to use, and low cost</span> — saving time, ensuring accuracy, and building trust with fast, referenced responses.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Document Sections - Compact Grid Layout */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-12">
              
              {/* Business Plan */}
              <div>
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-foreground">Business Plan</h3>
                  <p className="text-sm text-muted-foreground">Strategy, market analysis, and growth roadmap</p>
                </div>
                
                {/* Full Business Plan - Featured */}
                <Card className="p-5 mb-4 border-primary/40 bg-primary/5 hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-base text-foreground">Full Business Plan</h4>
                        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">Complete</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Complete document including all sections below
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">PDF • 8.7 MB</p>
                        <Button variant="default" size="sm" className="gap-2 h-8 text-xs">
                          <Download className="w-3 h-3" />
                          Download Complete Plan
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Individual Sections */}
                <p className="text-xs text-muted-foreground mb-3 pl-1">Individual sections:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 hover:shadow-md transition-all cursor-pointer group hover:border-primary/40">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                        <FileText className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-foreground truncate">Executive Summary</h4>
                        <p className="text-xs text-muted-foreground">PDF • 2.4 MB</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full gap-2 h-8 text-xs">
                      <Download className="w-3 h-3" />
                      Download
                    </Button>
                  </Card>

                  <Card className="p-4 hover:shadow-md transition-all cursor-pointer group hover:border-primary/40">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                        <TrendingUp className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-foreground truncate">Market Analysis</h4>
                        <p className="text-xs text-muted-foreground">PDF • 3.1 MB</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full gap-2 h-8 text-xs">
                      <Download className="w-3 h-3" />
                      Download
                    </Button>
                  </Card>

                  <Card className="p-4 hover:shadow-md transition-all cursor-pointer group hover:border-primary/40">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                        <FileText className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-foreground truncate">Growth Strategy</h4>
                        <p className="text-xs text-muted-foreground">PDF • 2.8 MB</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full gap-2 h-8 text-xs">
                      <Download className="w-3 h-3" />
                      Download
                    </Button>
                  </Card>
                </div>
              </div>

              {/* Financials */}
              <div>
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-foreground">Financials</h3>
                  <p className="text-sm text-muted-foreground">Projections, metrics, and revenue models</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 hover:shadow-md transition-all cursor-pointer group hover:border-primary/40">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <BarChart className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-foreground truncate">Financial Model</h4>
                        <p className="text-xs text-muted-foreground">XLSX • 1.8 MB</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full gap-2 h-8 text-xs">
                      <Download className="w-3 h-3" />
                      Download
                    </Button>
                  </Card>

                  <Card className="p-4 hover:shadow-md transition-all cursor-pointer group hover:border-primary/40">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <TrendingUp className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-foreground truncate">Revenue Projections</h4>
                        <p className="text-xs text-muted-foreground">PDF • 1.2 MB</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full gap-2 h-8 text-xs">
                      <Download className="w-3 h-3" />
                      Download
                    </Button>
                  </Card>

                  <Card className="p-4 hover:shadow-md transition-all cursor-pointer group hover:border-primary/40">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <BarChart className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-foreground truncate">Cash Flow Analysis</h4>
                        <p className="text-xs text-muted-foreground">PDF • 2.6 MB</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full gap-2 h-8 text-xs">
                      <Download className="w-3 h-3" />
                      Download
                    </Button>
                  </Card>
                </div>
              </div>

              {/* Marketing Plan */}
              <div>
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-foreground">Marketing Plan</h3>
                  <p className="text-sm text-muted-foreground">Go-to-market strategy and customer acquisition</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 hover:shadow-md transition-all cursor-pointer group hover:border-primary/40">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-foreground truncate">Marketing Strategy</h4>
                        <p className="text-xs text-muted-foreground">PDF • 3.5 MB</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full gap-2 h-8 text-xs">
                      <Download className="w-3 h-3" />
                      Download
                    </Button>
                  </Card>

                  <Card className="p-4 hover:shadow-md transition-all cursor-pointer group hover:border-primary/40">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <TrendingUp className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-foreground truncate">Customer Acquisition</h4>
                        <p className="text-xs text-muted-foreground">PDF • 2.1 MB</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full gap-2 h-8 text-xs">
                      <Download className="w-3 h-3" />
                      Download
                    </Button>
                  </Card>

                  <Card className="p-4 hover:shadow-md transition-all cursor-pointer group hover:border-primary/40">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-foreground truncate">Brand Positioning</h4>
                        <p className="text-xs text-muted-foreground">PDF • 1.9 MB</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full gap-2 h-8 text-xs">
                      <Download className="w-3 h-3" />
                      Download
                    </Button>
                  </Card>
                </div>
              </div>

              {/* Tech Architecture */}
              <div>
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-foreground">Tech Architecture</h3>
                  <p className="text-sm text-muted-foreground">Infrastructure, AI models, and scalability</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 hover:shadow-md transition-all cursor-pointer group hover:border-primary/40">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <Code className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-foreground truncate">System Architecture</h4>
                        <p className="text-xs text-muted-foreground">PDF • 4.2 MB</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full gap-2 h-8 text-xs">
                      <Download className="w-3 h-3" />
                      Download
                    </Button>
                  </Card>

                  <Card className="p-4 hover:shadow-md transition-all cursor-pointer group hover:border-primary/40">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-foreground truncate">Technical Roadmap</h4>
                        <p className="text-xs text-muted-foreground">PDF • 1.9 MB</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full gap-2 h-8 text-xs">
                      <Download className="w-3 h-3" />
                      Download
                    </Button>
                  </Card>

                  <Card className="p-4 hover:shadow-md transition-all cursor-pointer group hover:border-primary/40">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <Code className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-foreground truncate">Security Overview</h4>
                        <p className="text-xs text-muted-foreground">PDF • 2.3 MB</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full gap-2 h-8 text-xs">
                      <Download className="w-3 h-3" />
                      Download
                    </Button>
                  </Card>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Security Notice */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="p-6 bg-muted/50 border-muted">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold">Confidential Information:</span> This page and its documents are confidential and intended only for authorised investors. Any distribution, copying, or disclosure of these materials without written consent is strictly prohibited.
                  </p>
                </div>
              </Card>
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
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default InvestmentOpportunity;
