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
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-foreground mb-4">Choose Your AI Journey</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Start free, scale seamlessly. Every plan includes unlimited users, properties, and features.
              </p>
            </div>
            
            {/* All 5 Plans in Unified Grid */}
            <div className="grid gap-6 lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 max-w-7xl mx-auto pt-12 mt-8">
              
              {/* Free Plan */}
              <Card className="relative overflow-hidden bg-gradient-to-br from-card to-purple-50/20 border border-purple-200 hover:border-purple-400 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-purple-600"></div>
                <CardHeader className="text-center pb-6">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                    <span className="text-lg">🌱</span>
                  </div>
                  <CardTitle className="text-lg font-bold">Free</CardTitle>
                  <div className="text-3xl font-bold text-purple-600 mt-3">£0</div>
                  <p className="text-xs text-muted-foreground mt-2">Discover Hobson</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-600 mb-1">18 HEUs</div>
                    <p className="text-xs text-muted-foreground">Free forever</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-purple-500 flex-shrink-0" />
                      <span className="text-xs">All features</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-purple-500 flex-shrink-0" />
                      <span className="text-xs">Unlimited users</span>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-sm">
                    Start Free
                  </Button>
                </CardContent>
              </Card>

              {/* Essential Plan */}
              <Card className="relative overflow-hidden bg-gradient-to-br from-card to-purple-50/20 border border-purple-200 hover:border-purple-400 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-purple-600"></div>
                <CardHeader className="text-center pb-6">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg font-bold">Essential</CardTitle>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground">Monthly</span>
                    <div className="relative">
                      <input type="checkbox" className="sr-only" />
                      <div className="w-8 h-4 bg-purple-200 rounded-full cursor-pointer"></div>
                      <div className="absolute left-0.5 top-0.5 bg-purple-500 w-3 h-3 rounded-full shadow transition-transform"></div>
                    </div>
                    <span className="text-xs font-medium">Annual</span>
                    <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">Save 20%</Badge>
                  </div>
                  <div className="text-3xl font-bold text-purple-600 mt-2">£19.50</div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-600 mb-1">275 HEUs</div>
                    <p className="text-xs text-muted-foreground">Steady support</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-purple-500 flex-shrink-0" />
                      <span className="text-xs">Everything in Free</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-purple-500 flex-shrink-0" />
                      <span className="text-xs">Regular workflows</span>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-sm">
                    Choose Essential
                  </Button>
                </CardContent>
              </Card>

               {/* Essential Plus - Most Popular */}
              <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100/50 border-2 border-purple-400 shadow-2xl transform scale-105 hover:scale-110 transition-all duration-300">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 text-sm font-medium shadow-lg whitespace-nowrap">
                    ⭐ Most Popular
                  </Badge>
                </div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-purple-700"></div>
                <CardHeader className="text-center pb-6 pt-6">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-purple-200 to-purple-300 rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-purple-700" />
                  </div>
                  <CardTitle className="text-lg font-bold">Essential Plus</CardTitle>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground">Monthly</span>
                    <div className="relative">
                      <input type="checkbox" className="sr-only" />
                      <div className="w-8 h-4 bg-purple-300 rounded-full cursor-pointer"></div>
                      <div className="absolute left-0.5 top-0.5 bg-purple-600 w-3 h-3 rounded-full shadow transition-transform"></div>
                    </div>
                    <span className="text-xs font-medium">Annual</span>
                    <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">Save 20%</Badge>
                  </div>
                  <div className="text-3xl font-bold text-purple-700 mt-2">£50</div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-700 mb-1">700 HEUs</div>
                    <p className="text-xs text-purple-600">Perfect for growth</p>
                  </div>
                  <div className="space-y-2">
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
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm">
                    Choose Essential Plus
                  </Button>
                </CardContent>
              </Card>

              {/* Enterprise Plan */}
              <Card className="relative overflow-hidden bg-gradient-to-br from-card to-purple-50/20 border border-purple-200 hover:border-purple-400 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-purple-600"></div>
                <CardHeader className="text-center pb-6">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg font-bold">Enterprise</CardTitle>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground">Monthly</span>
                    <div className="relative">
                      <input type="checkbox" className="sr-only" />
                      <div className="w-8 h-4 bg-purple-200 rounded-full cursor-pointer"></div>
                      <div className="absolute left-0.5 top-0.5 bg-purple-500 w-3 h-3 rounded-full shadow transition-transform"></div>
                    </div>
                    <span className="text-xs font-medium">Annual</span>
                    <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">Save 20%</Badge>
                  </div>
                  <div className="text-3xl font-bold text-purple-600 mt-2">£150</div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-600 mb-1">2,000 HEUs</div>
                    <p className="text-xs text-muted-foreground">High-demand ops</p>
                  </div>
                  <div className="space-y-2">
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
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-sm">
                    Contact Sales
                  </Button>
                </CardContent>
              </Card>

              {/* Top-Up Option */}
              <Card className="relative overflow-hidden bg-gradient-to-br from-card to-purple-50/20 border border-purple-200 hover:border-purple-400 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-purple-600"></div>
                <CardHeader className="text-center pb-6">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg font-bold">Top-Up</CardTitle>
                  <div className="text-3xl font-bold text-purple-600 mt-3">£10</div>
                  <p className="text-xs text-muted-foreground mt-2">Add anytime</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-600 mb-1">150 HEUs</div>
                    <p className="text-xs text-muted-foreground">Perfect for busy periods</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-purple-500 flex-shrink-0" />
                      <span className="text-xs">One-time purchase</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-purple-500 flex-shrink-0" />
                      <span className="text-xs">No expiration</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full border-purple-300 text-purple-600 hover:bg-purple-50 text-sm">
                    Add Top-Up
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Feature Highlight */}
            <div className="text-center mt-16 p-8 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-2xl border border-purple-200">
              <h3 className="text-2xl font-bold text-foreground mb-6">Every Plan Includes</h3>
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Unlimited Users</div>
                    <div className="text-sm text-muted-foreground">Add your whole team</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">All Features</div>
                    <div className="text-sm text-muted-foreground">Never pay for updates</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-purple-600" />
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