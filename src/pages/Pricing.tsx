import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle2, MessageSquare, Cog, CreditCard, Briefcase, Building2, TrendingUp } from "lucide-react";
import { Helmet } from "react-helmet-async";

const Pricing = () => {
  return (
    <>
      <Helmet>
        <title>Pricing - Pay for Work, Not Seats | Hobson's Choice AI</title>
        <meta name="description" content="Revolutionary pricing that charges for actual AI work, not users or properties. Start from £18.50/month with Hobson Energy Units (HEUs)." />
        <meta name="keywords" content="AI pricing, property management pricing, per-task billing, CRM alternative" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section - 2 Column */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-24 lg:py-32">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.1)_50%,transparent_75%,transparent_100%)] bg-[length:60px_60px]" />
          <div className="container relative mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Content */}
              <div>
                <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  Only Pay for What Hobson Works On —{" "}
                  <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                    Not Seats, Not Properties
                  </span>
                </h1>
                <p className="mb-8 text-xl text-muted-foreground">
                  Forget per-user fees. Forget per-property fees. Forget paying extra for features. 
                  Hobson charges for the actual work our AI does — measured in{" "}
                  <span className="font-semibold text-primary">Hobson Energy Units (HEUs)</span>.
                </p>
                <Button size="lg" className="h-12 px-8 text-lg font-semibold">
                  See Plans & Compare Savings
                </Button>
              </div>
              
              {/* Right Column - HEU Coin Animation */}
              <div className="flex items-center justify-center">
                <div className="w-full max-w-md h-80 flex items-center justify-center">
                  <img 
                    src="/lovable-uploads/38e872ff-ad6a-490a-9166-a5ab809c890a.png" 
                    alt="Hobson Energy Unit (HEU) coin representing pay-per-task pricing model"
                    className="w-64 h-64 object-contain drop-shadow-2xl animate-pulse"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                How Hobson Pricing Works
              </h2>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              <div className="text-center group">
                <div className="mb-6 mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <MessageSquare className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">Ask</h3>
                <p className="text-muted-foreground">
                  You ask Hobson — a question, a document check, or a report request.
                </p>
              </div>
              
              <div className="text-center group">
                <div className="mb-6 mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Cog className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">Process</h3>
                <p className="text-muted-foreground">
                  Hobson works — each task uses a small number of HEUs.
                </p>
              </div>
              
              <div className="text-center group">
                <div className="mb-6 mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <CreditCard className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">Pay</h3>
                <p className="text-muted-foreground">
                  You only pay for what's used — no hidden fees, no wasted spend.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Plans - Cards */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
              {/* Free Plan */}
              <Card className="bg-card border border-border rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg font-semibold">Free</CardTitle>
                  <div className="text-3xl font-bold text-primary">£0</div>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="text-2xl font-semibold text-foreground">5 HEUs</div>
                  <p className="text-sm text-muted-foreground">Try Hobson on a few documents & queries</p>
                  <Button variant="outline" className="w-full">Get Started</Button>
                </CardContent>
              </Card>

              {/* Standard Plan */}
              <Card className="bg-card border border-border rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg font-semibold">Standard</CardTitle>
                  <div className="text-3xl font-bold text-primary">£18.50 <span className="text-sm text-muted-foreground">+ VAT</span></div>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="text-2xl font-semibold text-foreground">31 HEUs</div>
                  <p className="text-sm text-muted-foreground">Small portfolios, steady workload</p>
                  <Button className="w-full">Choose Plan</Button>
                </CardContent>
              </Card>

              {/* Pro Plan - Most Popular */}
              <Card className="bg-card border-2 border-primary rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">⭐ Most Popular</Badge>
                </div>
                <CardHeader className="text-center pt-6">
                  <CardTitle className="text-lg font-semibold">Pro</CardTitle>
                  <div className="text-3xl font-bold text-primary">£28.50 <span className="text-sm text-muted-foreground">+ VAT</span></div>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="text-2xl font-semibold text-foreground">50 HEUs</div>
                  <p className="text-sm text-muted-foreground">Growing portfolios, frequent use</p>
                  <Button className="w-full">Choose Plan</Button>
                </CardContent>
              </Card>

              {/* Top-Up */}
              <Card className="bg-card border border-border rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg font-semibold">Top-Up</CardTitle>
                  <div className="text-3xl font-bold text-primary">From £10</div>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="text-2xl font-semibold text-foreground">20 HEUs</div>
                  <p className="text-sm text-muted-foreground">For busy months or large projects</p>
                  <Button variant="outline" className="w-full">Add Top-Up</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Old CRM vs Hobson - 2 Column Text + Image */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Old CRM vs Hobson
              </h2>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 max-w-6xl mx-auto">
              {/* Old CRM - Left Side */}
              <div className="bg-muted/60 p-8 rounded-lg">
                <div className="mb-6">
                  <div className="w-full h-48 bg-gradient-to-b from-muted to-muted/40 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center mb-4">
                    <div className="text-center text-muted-foreground">
                      <div className="text-4xl mb-2 transform rotate-180">🏢</div>
                      <p className="text-sm">Upside-down desk scene<br />Image placeholder</p>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-destructive mb-4">Old CRM Model</h3>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-destructive">❌</span>
                    Per user + per property
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-destructive">❌</span>
                    Still billed for inactive properties
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-destructive">❌</span>
                    Pay extra for new features
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Small agency</span>
                    <span className="font-bold text-destructive">£140/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Larger portfolio</span>
                    <span className="font-bold text-destructive">£500/month</span>
                  </div>
                </div>
              </div>

              {/* Hobson - Right Side */}
              <div className="bg-card p-8 rounded-lg border border-primary/20">
                <div className="mb-6">
                  <div className="w-full h-48 bg-gradient-to-b from-primary/10 to-primary/5 rounded-lg border-2 border-dashed border-primary/30 flex items-center justify-center mb-4">
                    <div className="text-center text-muted-foreground">
                      <div className="text-4xl mb-2">🏢💰</div>
                      <p className="text-sm">Tidy desk + HEU coins<br />Image placeholder</p>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-4">Hobson</h3>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-primary">✅</span>
                    Pay per task (HEUs)
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-primary">✅</span>
                    Unlimited users
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-primary">✅</span>
                    All new features included
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Small agency</span>
                    <span className="font-bold text-primary">£18.50/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Larger portfolio</span>
                    <span className="font-bold text-primary">£28.50/month</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Real-Life Savings */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="mb-4 mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Briefcase className="w-8 h-8 text-primary" />
                </div>
                <div className="text-2xl font-bold text-primary mb-2">Save £1,452/year</div>
                <p className="text-muted-foreground">Small agency</p>
              </div>
              
              <div className="text-center">
                <div className="mb-4 mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-primary" />
                </div>
                <div className="text-2xl font-bold text-primary mb-2">Save £5,676/year</div>
                <p className="text-muted-foreground">Medium landlord</p>
              </div>
              
              <div className="text-center">
                <div className="mb-4 mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <div className="text-2xl font-bold text-primary mb-2">No price jump</div>
                <p className="text-muted-foreground">When you add people or properties</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left">What's an HEU?</AccordionTrigger>
                  <AccordionContent>
                    A Hobson Energy Unit measures the AI work used. Small queries use less; big document analysis uses more.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left">Do I pay per user or per property?</AccordionTrigger>
                  <AccordionContent>
                    No. Unlimited users and properties. You only pay for the AI work done.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left">Are new features extra?</AccordionTrigger>
                  <AccordionContent>
                    Never. As Hobson grows, you get everything included.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left">What happens if I run out of HEUs?</AccordionTrigger>
                  <AccordionContent>
                    You can top up anytime. No penalties, no lock-ins.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-left">Can I predict monthly costs?</AccordionTrigger>
                  <AccordionContent>
                    Yes. Pick a plan sized to your usual workload, then top up only in busy periods.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-6">
                  <AccordionTrigger className="text-left">Can I roll over unused HEUs?</AccordionTrigger>
                  <AccordionContent>
                    (Adjust policy if needed).
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-7">
                  <AccordionTrigger className="text-left">Do you charge setup or onboarding fees?</AccordionTrigger>
                  <AccordionContent>
                    Onboarding is optional; no hidden fees.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-8">
                  <AccordionTrigger className="text-left">What if my team grows?</AccordionTrigger>
                  <AccordionContent>
                    Invite everyone. No extra cost unless workload increases.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6 max-w-3xl mx-auto">
              Stop Paying for Seats and Empty Properties.{" "}
              <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                Start Paying for Results.
              </span>
            </h2>
            <Button size="lg" className="h-12 px-8 text-lg font-semibold mb-4">
              Choose Your Plan
            </Button>
            <p className="text-muted-foreground">
              No per-seat fees. No per-property fees. No feature add-ons.
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default Pricing;