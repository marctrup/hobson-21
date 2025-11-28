import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { GlobalHeader } from '@/components/GlobalHeader';
import { HomepageFooter } from '@/components/homepage/HomepageFooter';
import { Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
      <GlobalHeader />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-6">
              Investment Opportunity
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground mb-6">
                Welcome to our exclusive investment opportunity page. Here you can find detailed
                information about investment possibilities with Hobson AI.
              </p>

              <Card className="p-8 mb-6">
                <h2 className="text-2xl font-bold mb-4">Why Invest in Hobson AI?</h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Cutting-edge AI technology for the property industry</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Proven market demand and early customer adoption</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Experienced leadership team with property industry expertise</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Clear path to profitability and scalable business model</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-8 mb-6">
                <h2 className="text-2xl font-bold mb-4">Investment Details</h2>
                <p className="mb-4">
                  For detailed investment information, financial projections, and to discuss
                  partnership opportunities, please contact our investment relations team.
                </p>
                <Button onClick={() => navigate('/contact')} size="lg">
                  Contact Investment Team
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <HomepageFooter />
    </>
  );
};

export default InvestmentOpportunity;
