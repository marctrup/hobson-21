import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, MessageSquare, Cog, CreditCard, Briefcase, Building2, TrendingUp } from "lucide-react";
import { Helmet } from "react-helmet-async";
const Pricing = () => {
  return <>
      <Helmet>
        <title>Pricing - Pay for Work, Not Seats | Hobson's Choice AI</title>
        <meta name="description" content="Revolutionary pricing that charges for actual AI work, not users or properties. Start from £18.50/month with Hobson Energy Units (HEUs)." />
        <meta name="keywords" content="AI pricing, property management pricing, per-task billing, CRM alternative" />
      </Helmet>

      <div className="min-h-screen" style={{
      backgroundColor: '#ffffff',
      backgroundImage: 'none'
    }}>
        {/* Hero Section - 2 Column */}
        <section className="relative overflow-hidden py-24 lg:py-32 min-h-[72vh]" style={{
        backgroundColor: '#ffffff',
        backgroundImage: 'none',
        background: '#ffffff'
      }}>
          <div className="container relative mx-auto px-4 h-full flex items-center" style={{
          backgroundColor: '#ffffff',
          backgroundImage: 'none'
        }}>
             <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
               {/* Left Container - Content */}
               <div className="space-y-8">
                 <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                   Only Pay for What Hobson Works On —{" "}
                   <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">Not Seats, Not Properties, Not Features
                </span>
                 </h1>
                 <p className="text-xl text-muted-foreground">
                   Forget per-user fees. Forget per-property fees. Forget paying extra for features. 
                   Hobson charges for the actual work our AI does — measured in{" "}
                   <span className="font-semibold text-primary">Hobson Energy Units (HEUs)</span>.
                 </p>
                 <Button size="lg" className="h-12 px-8 text-lg font-semibold">
                   See Plans & Compare Savings
                 </Button>
               </div>
               
               {/* Right Container - Image */}
               <div className="flex justify-center lg:justify-end">
                 <div className="w-full max-w-lg aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center shadow-lg">
                   <div className="text-center text-muted-foreground">
                     <p className="text-lg font-medium">Hero Image</p>
                     <p className="text-sm">Placeholder for visual content</p>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </section>

        {/* Modern Pricing Plans - All Purple Theme */}
        <section className="pt-4 pb-12 bg-gradient-to-br from-background to-purple-50/30">
          <div className="container mx-auto px-4 overflow-visible">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-foreground mb-4">Choose Your AI Journey</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Start free, scale seamlessly. Every plan includes unlimited users, properties, and features.
              </p>
            </div>
            
            {/* All 5 Plans in Unified Grid */}
            <div className="grid gap-6 lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 max-w-7xl mx-auto pt-16 overflow-visible items-stretch">
              
              {/* Free Plan */}
              <Card className="relative bg-gradient-to-br from-card to-purple-50/20 border border-purple-200 hover:border-purple-400 transition-all duration-300 hover:scale-105 hover:shadow-xl flex flex-col h-full">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-purple-600"></div>
                <CardHeader className="text-center pb-4 flex-shrink-0">
                  <CardTitle className="text-lg font-bold">Free</CardTitle>
                  <div className="text-3xl font-bold text-purple-600 mt-2">£0</div>
                  <div className="text-sm text-purple-600 font-medium mt-1">18 HEUs</div>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow">
                  <div className="flex-grow">
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-purple-500 flex-shrink-0" />
                        <span className="text-xs">All features</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-purple-500 flex-shrink-0" />
                        <span className="text-xs">Unlimited users</span>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-sm mt-auto">
                    Start Free
                  </Button>
                </CardContent>
              </Card>

              {/* Essential Plan */}
              <Card className="relative bg-gradient-to-br from-card to-purple-50/20 border border-purple-200 hover:border-purple-400 transition-all duration-300 hover:scale-105 hover:shadow-xl flex flex-col h-full">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-purple-600"></div>
                <CardHeader className="text-center pb-4 flex-shrink-0">
                  <CardTitle className="text-lg font-bold">Essential</CardTitle>
                  <div className="text-3xl font-bold text-purple-600 mt-2">£19.50<span className="text-sm font-normal">/month</span></div>
                  <div className="text-sm text-purple-600 font-medium mt-1">275 HEUs</div>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow">
                  <div className="flex-grow">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <span className="text-xs text-muted-foreground">Monthly</span>
                      <div className="relative">
                        <input type="checkbox" className="sr-only" />
                        <div className="w-8 h-4 bg-purple-200 rounded-full cursor-pointer"></div>
                        <div className="absolute left-0.5 top-0.5 bg-purple-500 w-3 h-3 rounded-full shadow transition-transform"></div>
                      </div>
                      <span className="text-xs font-medium">Annual</span>
                      <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">Save 20%</Badge>
                    </div>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-purple-500 flex-shrink-0" />
                        <span className="text-xs">Everything in Free</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-purple-500 flex-shrink-0" />
                        <span className="text-xs">Regular workflows</span>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-sm mt-auto">
                    Choose Essential
                  </Button>
                </CardContent>
              </Card>

               {/* Essential Plus - Most Popular */}
              <Card className="relative bg-gradient-to-br from-purple-50 to-purple-100/50 border-2 border-purple-400 shadow-2xl transform scale-105 hover:scale-110 transition-all duration-300 flex flex-col h-full">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 text-sm font-medium shadow-lg whitespace-nowrap">
                    ⭐ Most Popular
                  </Badge>
                </div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-purple-700"></div>
                <CardHeader className="text-center pb-4 pt-6 flex-shrink-0">
                  <CardTitle className="text-lg font-bold">Essential Plus</CardTitle>
                  <div className="text-3xl font-bold text-purple-700 mt-2">£50<span className="text-sm font-normal">/month</span></div>
                  <div className="text-sm text-purple-700 font-medium mt-1">700 HEUs</div>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow">
                  <div className="flex-grow">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <span className="text-xs text-muted-foreground">Monthly</span>
                      <div className="relative">
                        <input type="checkbox" className="sr-only" />
                        <div className="w-8 h-4 bg-purple-300 rounded-full cursor-pointer"></div>
                        <div className="absolute left-0.5 top-0.5 bg-purple-600 w-3 h-3 rounded-full shadow transition-transform"></div>
                      </div>
                      <span className="text-xs font-medium">Annual</span>
                      <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">Save 20%</Badge>
                    </div>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-purple-600 flex-shrink-0" />
                        <span className="text-xs">Everything in Essential</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-purple-600 flex-shrink-0" />
                        <span className="text-xs">Advanced workflows</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-purple-600 flex-shrink-0" />
                        <span className="text-xs">Priority support</span>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm mt-auto">
                    Choose Essential Plus
                  </Button>
                </CardContent>
              </Card>

              {/* Enterprise Plan */}
              <Card className="relative bg-gradient-to-br from-card to-purple-50/20 border border-purple-200 hover:border-purple-400 transition-all duration-300 hover:scale-105 hover:shadow-xl flex flex-col h-full">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-purple-600"></div>
                <CardHeader className="text-center pb-4 flex-shrink-0">
                  <CardTitle className="text-lg font-bold">Enterprise</CardTitle>
                  <div className="text-3xl font-bold text-purple-600 mt-2">£150<span className="text-sm font-normal">/month</span></div>
                  <div className="text-sm text-purple-600 font-medium mt-1">2,000 HEUs</div>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow">
                  <div className="flex-grow">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <span className="text-xs text-muted-foreground">Monthly</span>
                      <div className="relative">
                        <input type="checkbox" className="sr-only" />
                        <div className="w-8 h-4 bg-purple-200 rounded-full cursor-pointer"></div>
                        <div className="absolute left-0.5 top-0.5 bg-purple-500 w-3 h-3 rounded-full shadow transition-transform"></div>
                      </div>
                      <span className="text-xs font-medium">Annual</span>
                      <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">Save 20%</Badge>
                    </div>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-purple-500 flex-shrink-0" />
                        <span className="text-xs">Everything in Plus</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-purple-500 flex-shrink-0" />
                        <span className="text-xs">Dedicated support</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-purple-500 flex-shrink-0" />
                        <span className="text-xs">Custom integrations</span>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-sm mt-auto">
                    Contact Sales
                  </Button>
                </CardContent>
              </Card>

              {/* Top-Up Option */}
              <Card className="relative bg-gradient-to-br from-card to-purple-50/20 border border-purple-200 hover:border-purple-400 transition-all duration-300 hover:scale-105 hover:shadow-xl flex flex-col h-full">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-purple-600"></div>
                <CardHeader className="text-center pb-4 flex-shrink-0">
                  <CardTitle className="text-lg font-bold">Top-Up</CardTitle>
                  <div className="text-3xl font-bold text-purple-600 mt-2">£10</div>
                  <div className="text-sm text-purple-600 font-medium mt-1">150 HEUs</div>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow">
                  <div className="flex-grow">
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-purple-500 flex-shrink-0" />
                        <span className="text-xs">One-time purchase</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-purple-500 flex-shrink-0" />
                        <span className="text-xs">No expiration</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full border-purple-300 text-purple-600 hover:bg-purple-50 text-sm mt-auto">
                    Add Top-Up
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">How HEUs Work</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Understanding our energy-based pricing is simple. Every AI task consumes energy units based on complexity.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="text-center p-6 border-0 shadow-lg bg-card">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Simple Tasks</h3>
                <p className="text-muted-foreground mb-4">Basic queries, data retrieval, simple calculations</p>
                <div className="text-2xl font-bold text-primary">1-3 HEUs</div>
              </Card>
              
              <Card className="text-center p-6 border-0 shadow-lg bg-card">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <Cog className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Complex Analysis</h3>
                <p className="text-muted-foreground mb-4">Market research, document analysis, reporting</p>
                <div className="text-2xl font-bold text-primary">5-10 HEUs</div>
              </Card>
              
              <Card className="text-center p-6 border-0 shadow-lg bg-card">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Advanced Workflows</h3>
                <p className="text-muted-foreground mb-4">Multi-step processes, integrations, automation</p>
                <div className="text-2xl font-bold text-primary">15+ HEUs</div>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-muted-foreground">Everything you need to know about our pricing model</p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What happens if I run out of HEUs?</AccordionTrigger>
                  <AccordionContent>
                    Don't worry! When you're running low, we'll notify you. You can either upgrade to a higher plan or purchase additional HEUs as needed. Hobson won't stop working - you'll just need to top up your energy units.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>Do HEUs expire?</AccordionTrigger>
                  <AccordionContent>
                    Monthly plan HEUs reset each billing cycle. However, any Top-Up HEUs you purchase never expire - they're yours to use whenever you need them, providing ultimate flexibility for busy periods.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>Can I change plans anytime?</AccordionTrigger>
                  <AccordionContent>
                    Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect at your next billing cycle, and any unused HEUs from Top-Ups will carry over to your new plan.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger>How do you calculate HEU usage?</AccordionTrigger>
                  <AccordionContent>
                    Each AI task is measured by computational complexity, processing time, and resources required. Simple queries use fewer HEUs, while complex analysis and workflows use more. You'll always see transparent usage tracking in your dashboard.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger>Is there really no limit on users or properties?</AccordionTrigger>
                  <AccordionContent>
                    Correct! Add as many team members and manage as many properties as you need. You only pay for the actual AI work performed, not the number of seats or properties in your account. This makes Hobson incredibly cost-effective as you scale.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">Ready to Transform Your Property Management?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start with our free plan and see how Hobson can revolutionize your workflow. 
              Only pay for what you actually use.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="h-12 px-8 text-lg font-semibold">
                Start Free Today
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-8 text-lg font-semibold">
                Book a Demo
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>;
};

export default Pricing;