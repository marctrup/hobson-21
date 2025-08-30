import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { HomepageHeader } from "@/components/homepage/HomepageHeader";
import { HomepageFooter } from "@/components/homepage/HomepageFooter";
import { PricingHeroVideo } from "@/components/videos/PricingHeroVideo";
import { HEUBarVisualization } from "@/components/HEUBarVisualization";

const Pricing = () => {
  return (
    <>
      <Helmet>
        <title>Pricing - Pay for Work, Not Seats | Hobson's Choice AI</title>
        <meta name="description" content="Revolutionary pricing that charges for actual AI work, not users or properties. Start from £18.50/month with Hobson Energy Units (HEUs)." />
        <meta name="keywords" content="AI pricing, property management pricing, per-task billing, CRM alternative, HEU pricing model" />
        <meta property="og:title" content="AI Pricing Revolution - Pay for Work, Not Seats | Hobson AI" />
        <meta property="og:description" content="Revolutionary pricing that charges for actual AI work, not users or properties. Start from £18.50/month with HEUs." />
        <meta property="og:image" content="https://hobsonschoice.ai/lovable-uploads/0fa56bb9-7c7d-4f95-a81f-36a7f584ed7a.png" />
        <link rel="canonical" href="https://hobsonschoice.ai/pricing" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <HomepageHeader />

        {/* Hero Section */}
        <section className="pt-16 pb-8 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Revolutionary Pricing
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                Pay for actual AI work, not seats or properties. Introducing HEUs - Hobson Energy Units that scale with your usage.
              </p>
            </div>
            
            {/* Hero Video */}
            <div className="flex justify-center mb-16">
              <PricingHeroVideo />
            </div>
          </div>
        </section>

        {/* HEU Explanation Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                What are HEUs?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Hobson Energy Units (HEUs) are our way of measuring AI work. Different tasks use different amounts of HEUs based on their complexity.
              </p>
              
              {/* HEU Visualization */}
              <div className="mb-12">
                <HEUBarVisualization totalHEUs={500} usedHEUs={280} />
              </div>
              
              {/* HEU Examples */}
              <div className="grid gap-4 md:grid-cols-3 max-w-3xl mx-auto">
                <div className="bg-card rounded-lg p-6 border">
                  <div className="text-2xl mb-2">📄</div>
                  <h4 className="font-semibold text-foreground mb-2">Document Scan</h4>
                  <p className="text-sm text-muted-foreground">1-3 HEUs</p>
                </div>
                <div className="bg-card rounded-lg p-6 border">
                  <div className="text-2xl mb-2">❓</div>
                  <h4 className="font-semibold text-foreground mb-2">Simple Question</h4>
                  <p className="text-sm text-muted-foreground">2-5 HEUs</p>
                </div>
                <div className="bg-card rounded-lg p-6 border">
                  <div className="text-2xl mb-2">📊</div>
                  <h4 className="font-semibold text-foreground mb-2">Complex Analysis</h4>
                  <p className="text-sm text-muted-foreground">5-15 HEUs</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Cards Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                  Choose Your Plan
                </h2>
                <p className="text-xl text-muted-foreground">
                  Simple, transparent pricing that grows with your business
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {/* Starter Plan */}
                <div className="bg-card rounded-2xl border border-border p-8 relative">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-2 text-foreground">Starter</h3>
                    <div className="text-4xl font-bold mb-2 text-foreground">£18.50</div>
                    <div className="text-muted-foreground mb-4">per month</div>
                    <div className="inline-block bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium mb-6">
                      100 HEUs included
                    </div>
                  </div>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <span className="text-primary text-lg">✓</span>
                      <span className="text-foreground">100 HEU credits monthly</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary text-lg">✓</span>
                      <span className="text-foreground">Basic document processing</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary text-lg">✓</span>
                      <span className="text-foreground">Email support</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary text-lg">✓</span>
                      <span className="text-foreground">Web dashboard access</span>
                    </li>
                  </ul>
                  <button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground h-12 px-4 py-2 rounded-lg font-medium transition-colors">
                    Get Started
                  </button>
                </div>

                {/* Professional Plan */}
                <div className="bg-card rounded-2xl border-2 border-primary p-8 relative transform scale-105">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-2 text-foreground">Professional</h3>
                    <div className="text-4xl font-bold mb-2 text-foreground">£75</div>
                    <div className="text-muted-foreground mb-4">per month</div>
                    <div className="inline-block bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium mb-6">
                      500 HEUs included
                    </div>
                  </div>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <span className="text-primary text-lg">✓</span>
                      <span className="text-foreground">500 HEU credits monthly</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary text-lg">✓</span>
                      <span className="text-foreground">Advanced AI features</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary text-lg">✓</span>
                      <span className="text-foreground">Priority support</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary text-lg">✓</span>
                      <span className="text-foreground">Custom integrations</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary text-lg">✓</span>
                      <span className="text-foreground">API access</span>
                    </li>
                  </ul>
                  <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-4 py-2 rounded-lg font-medium transition-colors">
                    Start Free Trial
                  </button>
                </div>

                {/* Enterprise Plan */}
                <div className="bg-card rounded-2xl border border-border p-8 relative">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-2 text-foreground">Enterprise</h3>
                    <div className="text-4xl font-bold mb-2 text-foreground">Custom</div>
                    <div className="text-muted-foreground mb-4">pricing</div>
                    <div className="inline-block bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium mb-6">
                      Unlimited HEUs
                    </div>
                  </div>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <span className="text-primary text-lg">✓</span>
                      <span className="text-foreground">Unlimited HEU credits</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary text-lg">✓</span>
                      <span className="text-foreground">Dedicated support</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary text-lg">✓</span>
                      <span className="text-foreground">On-premise deployment</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary text-lg">✓</span>
                      <span className="text-foreground">SLA guarantees</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary text-lg">✓</span>
                      <span className="text-foreground">Custom training</span>
                    </li>
                  </ul>
                  <Link 
                    to="/contact" 
                    className="w-full inline-flex items-center justify-center bg-secondary hover:bg-secondary/90 text-secondary-foreground h-12 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Contact Sales
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                  Frequently Asked Questions
                </h2>
              </div>
              
              <div className="grid gap-8 md:grid-cols-2">
                <div className="bg-card rounded-lg p-6 border">
                  <h3 className="text-xl font-semibold mb-3 text-foreground">What happens if I run out of HEUs?</h3>
                  <p className="text-muted-foreground">
                    You can purchase additional HEU credits or upgrade your plan. We'll notify you before you run out.
                  </p>
                </div>
                
                <div className="bg-card rounded-lg p-6 border">
                  <h3 className="text-xl font-semibold mb-3 text-foreground">Do HEUs roll over?</h3>
                  <p className="text-muted-foreground">
                    Unused HEUs roll over for up to 3 months, so you never lose what you've paid for.
                  </p>
                </div>
                
                <div className="bg-card rounded-lg p-6 border">
                  <h3 className="text-xl font-semibold mb-3 text-foreground">Can I change plans anytime?</h3>
                  <p className="text-muted-foreground">
                    Yes! You can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.
                  </p>
                </div>
                
                <div className="bg-card rounded-lg p-6 border">
                  <h3 className="text-xl font-semibold mb-3 text-foreground">Is there a free trial?</h3>
                  <p className="text-muted-foreground">
                    Professional and Enterprise plans include a 14-day free trial with full access to all features.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of property professionals already using Hobson AI
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8 py-2 rounded-lg font-medium transition-colors">
                  Start Free Trial
                </button>
                <Link 
                  to="/contact"
                  className="inline-flex items-center justify-center border border-input bg-background hover:bg-accent hover:text-accent-foreground h-12 px-8 py-2 rounded-lg font-medium transition-colors"
                >
                  Talk to Sales
                </Link>
              </div>
            </div>
          </div>
        </section>

        <HomepageFooter />
      </div>
    </>
  );
};

export default Pricing;