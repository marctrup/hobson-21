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

        {/* Single Pricing Section - Hobson Only */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">The Pricing Model That Doesn't Punish Growth</h2>
            </div>
            
            <div className="flex justify-center max-w-3xl mx-auto">
              {/* Hobson - Full Width */}
              <Card className="bg-card border-primary/30 hover:shadow-lg transition-shadow duration-300 w-full">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold text-primary flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary text-sm font-bold">✓</span>
                    </div>
                    Hobson
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5">
                      <span className="text-primary text-lg mt-0.5">✅</span>
                      <div>
                        <div className="font-medium text-foreground">Pay per task (HEUs)</div>
                        <div className="text-sm text-muted-foreground">Only pay for actual AI work</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5">
                      <span className="text-primary text-lg mt-0.5">✅</span>
                      <div>
                        <div className="font-medium text-foreground">Unlimited users</div>
                        <div className="text-sm text-muted-foreground">Add your whole team at no extra cost</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5">
                      <span className="text-primary text-lg mt-0.5">✅</span>
                      <div>
                        <div className="font-medium text-foreground">All new features included</div>
                        <div className="text-sm text-muted-foreground">Never pay extra for updates</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>


        {/* Modern Pricing Plans */}
        <section className="py-24 bg-gradient-to-br from-background to-muted/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-bold text-foreground mb-6">Choose Your AI Journey</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Start free, scale seamlessly. Every plan includes unlimited users, properties, and features.
              </p>
            </div>
            
            {/* Pricing Grid - 3 main plans + 2 special options */}
            <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto mb-12">
              
              {/* Free Plan */}
              <Card className="relative overflow-hidden bg-gradient-to-br from-card to-card/80 border-2 border-muted hover:border-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center">
                    <span className="text-2xl">🌱</span>
                  </div>
                  <CardTitle className="text-2xl font-bold">Free</CardTitle>
                  <div className="text-5xl font-bold text-foreground mt-4">£0</div>
                  <p className="text-muted-foreground mt-2">Discover what Hobson can do</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">18 HEUs</div>
                    <p className="text-sm text-muted-foreground">Free forever • No credit card required</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">All core features</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">Unlimited users & properties</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">Document insights</span>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white">
                    Start Free
                  </Button>
                </CardContent>
              </Card>

              {/* Essential Plus - Most Popular */}
              <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary shadow-2xl scale-105 hover:scale-110 transition-all duration-300">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-light"></div>
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-primary to-primary-light text-white px-4 py-1 text-sm font-medium">
                    ⭐ Most Popular
                  </Badge>
                </div>
                <CardHeader className="text-center pb-6 pt-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-primary/30 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-bold">Essential Plus</CardTitle>
                  <div className="flex items-center justify-center gap-3 mt-4">
                    <span className="text-sm text-muted-foreground line-through">£60</span>
                    <div className="text-5xl font-bold text-primary">£50</div>
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="text-sm text-muted-foreground">Monthly</span>
                    <div className="relative">
                      <input type="checkbox" className="sr-only" />
                      <div className="w-10 h-5 bg-primary/20 rounded-full cursor-pointer"></div>
                      <div className="absolute left-1 top-0.5 bg-primary w-4 h-4 rounded-full shadow transition-transform"></div>
                    </div>
                    <span className="text-sm font-medium">Annual</span>
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">Save 20%</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">700 HEUs</div>
                    <p className="text-sm text-muted-foreground">Perfect for growing portfolios</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm">Everything in Free</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm">Advanced workflows</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm">Priority support</span>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-primary to-primary-light text-white">
                    Choose Essential Plus
                  </Button>
                </CardContent>
              </Card>

              {/* Enterprise Plan */}
              <Card className="relative overflow-hidden bg-gradient-to-br from-card to-card/80 border-2 border-muted hover:border-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-indigo-500"></div>
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold">Enterprise</CardTitle>
                  <div className="text-5xl font-bold text-foreground mt-4">£150</div>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="text-sm text-muted-foreground">Monthly</span>
                    <div className="relative">
                      <input type="checkbox" className="sr-only" />
                      <div className="w-10 h-5 bg-muted rounded-full cursor-pointer"></div>
                      <div className="absolute left-1 top-0.5 bg-white w-4 h-4 rounded-full shadow transition-transform"></div>
                    </div>
                    <span className="text-sm font-medium">Annual</span>
                    <Badge variant="secondary" className="text-xs">Save 20%</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">2,000 HEUs</div>
                    <p className="text-sm text-muted-foreground">For high-demand operations</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-purple-600 flex-shrink-0" />
                      <span className="text-sm">Everything in Essential Plus</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-purple-600 flex-shrink-0" />
                      <span className="text-sm">Dedicated support</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-purple-600 flex-shrink-0" />
                      <span className="text-sm">Custom integrations</span>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white">
                    Contact Sales
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Bottom Row - Essential & Top-Up */}
            <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
              
              {/* Essential Plan */}
              <Card className="relative overflow-hidden bg-gradient-to-br from-card to-card/80 border border-muted hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-cyan-500"></div>
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl font-bold">Essential</CardTitle>
                  <div className="text-3xl font-bold text-foreground mt-2">£19.50</div>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">Monthly</span>
                    <div className="relative">
                      <input type="checkbox" className="sr-only" />
                      <div className="w-8 h-4 bg-muted rounded-full cursor-pointer"></div>
                      <div className="absolute left-0.5 top-0.5 bg-white w-3 h-3 rounded-full shadow transition-transform"></div>
                    </div>
                    <span className="text-xs font-medium">Annual</span>
                    <Badge variant="secondary" className="text-xs">Save 20%</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">275 HEUs</div>
                    <p className="text-xs text-muted-foreground">Steady AI support</p>
                  </div>
                  <Button variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50">
                    Choose Essential
                  </Button>
                </CardContent>
              </Card>

              {/* Top-Up Option */}
              <Card className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500"></div>
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-amber-600" />
                  </div>
                  <CardTitle className="text-xl font-bold text-amber-800">Top-Up</CardTitle>
                  <div className="text-3xl font-bold text-amber-700 mt-2">£10</div>
                  <p className="text-xs text-amber-600 mt-1">Add anytime</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-700 mb-1">150 HEUs</div>
                    <p className="text-xs text-amber-600">Perfect for busy periods</p>
                  </div>
                  <Button variant="outline" className="w-full border-amber-300 text-amber-700 hover:bg-amber-100">
                    Add Top-Up
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Feature Highlight */}
            <div className="text-center mt-16 p-8 bg-gradient-to-r from-primary/5 to-primary-light/5 rounded-2xl border border-primary/10">
              <h3 className="text-2xl font-bold text-foreground mb-4">Every Plan Includes</h3>
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Unlimited Users</div>
                    <div className="text-sm text-muted-foreground">Add your whole team</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">All Features</div>
                    <div className="text-sm text-muted-foreground">Never pay for updates</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Unlimited Properties</div>
                    <div className="text-sm text-muted-foreground">Scale without limits</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Everything you need to know about Hobson's revolutionary pricing model
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible className="w-full space-y-4">
                <AccordionItem value="item-1" className="border border-border rounded-lg bg-card/50 backdrop-blur-sm">
                  <AccordionTrigger className="text-left px-6 py-4 hover:no-underline">
                    <span className="flex items-center gap-3 text-lg font-semibold">
                      ❓ What's a HUE? 🪙
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        A HUE (Hobson Energy Unit) measures AI workload. Small tasks use fractions, big jobs use more.
                      </p>
                      
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="font-medium text-foreground mb-3">📋 Examples & Typical Tasks:</p>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center justify-between p-2 bg-card/60 rounded border-l-4 border-primary/30">
                            <div className="flex items-center gap-2">
                              <span className="text-base">💬</span>
                              <span>Simple Question — "When was my last rent review?"</span>
                            </div>
                            <span className="font-mono text-primary font-medium">~ 0.0026 HUE</span>
                          </div>
                          
                          <div className="flex items-center justify-between p-2 bg-card/60 rounded border-l-4 border-primary/50">
                            <div className="flex items-center gap-2">
                              <span className="text-base">🔍</span>
                              <span>Medium Query — "Summarise this inspection report"</span>
                            </div>
                            <span className="font-mono text-primary font-medium">~ 0.01 HUE</span>
                          </div>
                          
                          <div className="flex items-center justify-between p-2 bg-card/60 rounded border-l-4 border-primary/70">
                            <div className="flex items-center gap-2">
                              <span className="text-base">🧠</span>
                              <span>Complex Query — "Find every clause in my leases about pets"</span>
                            </div>
                            <span className="font-mono text-primary font-medium">~ 0.03 HUE</span>
                          </div>
                          
                          <div className="flex items-center justify-between p-2 bg-card/60 rounded border-l-4 border-primary/40">
                            <div className="flex items-center gap-2">
                              <span className="text-base">📄</span>
                              <span>Simple Doc Extraction — 1-page letter</span>
                            </div>
                            <span className="font-mono text-primary font-medium">~ 0.025 HUE</span>
                          </div>
                          
                          <div className="flex items-center justify-between p-2 bg-card/60 rounded border-l-4 border-primary/60">
                            <div className="flex items-center gap-2">
                              <span className="text-base">📋</span>
                              <span>Medium Doc Extraction — mid-length contract</span>
                            </div>
                            <span className="font-mono text-primary font-medium">~ 0.76 HUE</span>
                          </div>
                          
                          <div className="flex items-center justify-between p-2 bg-card/60 rounded border-l-4 border-primary/80">
                            <div className="flex items-center gap-2">
                              <span className="text-base">📚</span>
                              <span>Complex Doc Extraction — large legal agreement</span>
                            </div>
                            <span className="font-mono text-primary font-medium">~ 0.92 HUE</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2" className="border border-border rounded-lg bg-card/50 backdrop-blur-sm">
                  <AccordionTrigger className="text-left px-6 py-4 hover:no-underline">
                    <span className="flex items-center gap-3 text-lg font-semibold">
                      ❓ Do I pay per user or property? 👥🏠
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <p className="text-muted-foreground">
                      No — only for the AI work you use.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3" className="border border-border rounded-lg bg-card/50 backdrop-blur-sm">
                  <AccordionTrigger className="text-left px-6 py-4 hover:no-underline">
                    <span className="flex items-center gap-3 text-lg font-semibold">
                      ❓ Are new features extra? ✨
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <p className="text-muted-foreground">
                      No — all new features are included.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4" className="border border-border rounded-lg bg-card/50 backdrop-blur-sm">
                  <AccordionTrigger className="text-left px-6 py-4 hover:no-underline">
                    <span className="flex items-center gap-3 text-lg font-semibold">
                      ❓ What if I run out of HUEs? ⚡
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <p className="text-muted-foreground">
                      Top up instantly, no plan changes needed.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5" className="border border-border rounded-lg bg-card/50 backdrop-blur-sm">
                  <AccordionTrigger className="text-left px-6 py-4 hover:no-underline">
                    <span className="flex items-center gap-3 text-lg font-semibold">
                      ❓ Can I predict monthly costs? 📊
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <p className="text-muted-foreground">
                      Yes — each task has a fixed HUE value.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-6" className="border border-border rounded-lg bg-card/50 backdrop-blur-sm">
                  <AccordionTrigger className="text-left px-6 py-4 hover:no-underline">
                    <span className="flex items-center gap-3 text-lg font-semibold">
                      ❓ Can I roll over unused HUEs? 🔄
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <p className="text-muted-foreground">We will roll over 5 unused HEUs in to your next month</p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-7" className="border border-border rounded-lg bg-card/50 backdrop-blur-sm">
                  <AccordionTrigger className="text-left px-6 py-4 hover:no-underline">
                    <span className="flex items-center gap-3 text-lg font-semibold">
                      ❓ Do you charge setup or onboarding fees? 🚀
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <p className="text-muted-foreground">
                      No — optional paid onboarding is available.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-8" className="border border-border rounded-lg bg-card/50 backdrop-blur-sm">
                  <AccordionTrigger className="text-left px-6 py-4 hover:no-underline">
                    <span className="flex items-center gap-3 text-lg font-semibold">
                      ❓ What if my team grows? 📈
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <p className="text-muted-foreground">
                      No extra cost — add as many users as you like.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-9" className="border border-border rounded-lg bg-card/50 backdrop-blur-sm">
                  <AccordionTrigger className="text-left px-6 py-4 hover:no-underline">
                    <span className="flex items-center gap-3 text-lg font-semibold">
                      ❓ Can I monitor usage? 👀
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <p className="text-muted-foreground">
                      Yes — your dashboard shows real-time HUE usage.
                    </p>
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
    </>;
};
export default Pricing;