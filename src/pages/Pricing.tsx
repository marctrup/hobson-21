import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, MessageSquare, Cog, CreditCard, Briefcase, Building2, TrendingUp } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { PricingHeroVideo } from "@/components/videos/PricingHeroVideo";
import { GlobalHeader } from "@/components/GlobalHeader";
const Pricing = () => {
  return <>
      <Helmet>
        <title>Pricing - Pay for Work, Not Seats | Hobson's Choice AI</title>
        <meta name="description" content="Revolutionary pricing that charges for actual AI work, not users or properties. Start from £18.50/month with Hobson Energy Units (HEUs)." />
        <meta name="keywords" content="AI pricing, property management pricing, per-task billing, CRM alternative" />
      </Helmet>

      <GlobalHeader />
      
      <div className="min-h-screen" style={{
      backgroundColor: '#ffffff',
      backgroundImage: 'none'
    }}>
        {/* Hero Section - 2 Column */}
        <section className="relative overflow-hidden py-24 lg:py-32 pb-8 md:pb-24 min-h-[72vh]">
          <div className="container relative mx-auto px-2 h-full flex items-center">
             <div className="grid lg:grid-cols-[1fr,1.5fr] gap-4 lg:gap-8 items-center w-full mx-auto">
                {/* Left Container - Content */}
                <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
                   <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground lg:text-5xl xl:text-6xl">
                     From Energy to Outcomes —{" "}
                     <span className="bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">that's the Hobson way.</span>
                   </h1>
                  <p className="text-lg sm:text-xl text-muted-foreground">
                    Forget per-user fees. Forget per-property fees. Forget paying extra for features. 
                    Hobson charges for the actual work our AI does — measured in a currency called a{" "}
                    <span className="font-semibold text-primary">Hobson Energy Unit (HEU)</span>.
                  </p>
                </div>
                
                {/* Right Container - Video Screen */}
                <div className="flex justify-center scale-120">
                  <PricingHeroVideo />
                </div>
             </div>
          </div>
        </section>

        {/* Modern Pricing Plans - All Purple Theme */}
        <section className="pt-4 pb-12 -mt-[102px] md:mt-0 bg-gradient-to-br from-background to-purple-50/30">
          <div className="container mx-auto px-4 overflow-visible">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-foreground mb-4">Choose Your AI Journey</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Scale seamlessly. Every plan includes unlimited users, properties, and features.
              </p>
            </div>
            
            {/* All 6 Plans in Unified Grid */}
            <div className="grid gap-4 lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 max-w-8xl mx-auto pt-16 overflow-visible items-stretch">
              
              {/* Free Plan */}
              <Card className="relative bg-gradient-to-br from-card to-purple-50/20 border border-purple-200 hover:border-purple-400 transition-all duration-300 hover:scale-105 hover:shadow-xl flex flex-col h-full">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-purple-600"></div>
                <CardHeader className="text-center pb-4 flex-shrink-0">
                  <CardTitle className="text-lg font-bold">Free</CardTitle>
                  <div className="text-3xl font-bold text-purple-600 mt-2">£0</div>
                  <div className="text-sm text-purple-600 font-medium mt-1">18HEUs</div>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow">
                  <div className="flex-grow">
                    <p className="text-xs text-muted-foreground mb-4">
                      For light, occasional tasks.
                    </p>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-purple-500 flex-shrink-0" />
                        <span className="text-xs">All features</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-purple-500 flex-shrink-0" />
                        <span className="text-xs">Unlimited users</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-purple-500 flex-shrink-0" />
                        <span className="text-xs">Unlimited documents</span>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-sm mt-auto">
                    Start Free
                  </Button>
                </CardContent>
              </Card>

              {/* Starter Pack - Onboarding Option */}
              <Card className="relative bg-gradient-to-br from-green-50 to-green-100/50 border-2 border-green-400 hover:border-green-500 transition-all duration-300 hover:scale-105 hover:shadow-xl flex flex-col h-full">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 text-xs font-medium shadow-lg whitespace-nowrap">
                    🚀 Perfect Start
                  </Badge>
                </div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
                <CardHeader className="text-center pb-4 pt-6 flex-shrink-0">
                  <CardTitle className="text-lg font-bold">Starter Pack</CardTitle>
                  <div className="text-3xl font-bold text-green-700 mt-2">£54.50</div>
                  <div className="text-sm text-green-700 font-medium mt-1">1000 HEUs (one-time)</div>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow">
                  <div className="flex-grow">
                    <p className="text-xs text-muted-foreground mb-4">
                      Perfect for onboarding your documents and getting started.
                    </p>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-xs">Load up fast with the Starter Pack</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-xs">Get 1000 HEUs to power your documents</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-xs">Keep credits longer with 2-month rollover</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-xs">Unlock everything from the start</span>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm mt-auto">
                    Get Started
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
                    <p className="text-xs text-muted-foreground mb-4">
                      For steady monthly workloads.
                    </p>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-purple-500 flex-shrink-0" />
                        <span className="text-xs">Everything in Free</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-purple-500 flex-shrink-0" />
                        <span className="text-xs">Priority support</span>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-xs text-muted-foreground">Monthly</span>
                        <div className="relative">
                          <input type="checkbox" className="sr-only" />
                          <div className="w-8 h-4 bg-purple-200 rounded-full cursor-pointer"></div>
                          <div className="absolute left-0.5 top-0.5 bg-purple-500 w-3 h-3 rounded-full shadow transition-transform"></div>
                        </div>
                        <span className="text-xs font-medium">Annual</span>
                      </div>
                      <div className="flex justify-center">
                        <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">Save 20%</Badge>
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
                  <div className="text-3xl font-bold text-purple-700 mt-2">£49.75<span className="text-sm font-normal">/month</span></div>
                  <div className="text-sm text-purple-700 font-medium mt-1">700 HEUs</div>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow">
                  <div className="flex-grow">
                    <p className="text-xs text-muted-foreground mb-4">
                      For heavy, frequent use.
                    </p>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-purple-600 flex-shrink-0" />
                        <span className="text-xs">Everything in Essential</span>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-xs text-muted-foreground">Monthly</span>
                        <div className="relative">
                          <input type="checkbox" className="sr-only" />
                          <div className="w-8 h-4 bg-purple-300 rounded-full cursor-pointer"></div>
                          <div className="absolute left-0.5 top-0.5 bg-purple-600 w-3 h-3 rounded-full shadow transition-transform"></div>
                        </div>
                        <span className="text-xs font-medium">Annual</span>
                      </div>
                      <div className="flex justify-center">
                        <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">Save 20%</Badge>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm mt-auto">
                    Choose Essential +
                  </Button>
                </CardContent>
              </Card>

              {/* Enterprise Plan */}
              <Card className="relative bg-gradient-to-br from-card to-purple-50/20 border border-purple-200 hover:border-purple-400 transition-all duration-300 hover:scale-105 hover:shadow-xl flex flex-col h-full">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-purple-600"></div>
                <CardHeader className="text-center pb-4 flex-shrink-0">
                  <CardTitle className="text-lg font-bold">Enterprise</CardTitle>
                  <div className="text-3xl font-bold text-purple-600 mt-2">£148.50<span className="text-sm font-normal">/month</span></div>
                  <div className="text-sm text-purple-600 font-medium mt-1">2,000 HEUs</div>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow">
                  <div className="flex-grow">
                    <p className="text-xs text-muted-foreground mb-4">
                      For high-volume, daily demands.
                    </p>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-purple-500 flex-shrink-0" />
                        <span className="text-xs">Everything in Plus</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-purple-500 flex-shrink-0" />
                        <span className="text-xs">Build a knowledge base (call us)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-purple-500 flex-shrink-0" />
                        <span className="text-xs">Dedicated support</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-purple-500 flex-shrink-0" />
                        <span className="text-xs">Custom integrations (call us)</span>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-xs text-muted-foreground">Monthly</span>
                        <div className="relative">
                          <input type="checkbox" className="sr-only" />
                          <div className="w-8 h-4 bg-purple-200 rounded-full cursor-pointer"></div>
                          <div className="absolute left-0.5 top-0.5 bg-purple-500 w-3 h-3 rounded-full shadow transition-transform"></div>
                        </div>
                        <span className="text-xs font-medium">Annual</span>
                      </div>
                      <div className="flex justify-center">
                        <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">Save 20%</Badge>
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
                  <div className="text-3xl font-bold text-purple-600 mt-2">£15</div>
                  <div className="text-sm text-purple-600 font-medium mt-1">150 HEUs</div>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow">
                  <div className="flex-grow">
                    <p className="text-xs text-muted-foreground mb-4">
                      Extra capacity, anytime.
                    </p>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-purple-500 flex-shrink-0" />
                        <span className="text-xs">One-time purchase</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-purple-500 flex-shrink-0" />
                        <span className="text-xs">Add more whenever you need</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-purple-500 flex-shrink-0" />
                        <span className="text-xs">Activates instantly and works with any paid plan</span>
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


        {/* FAQ Section - TEMPORARILY DISABLED FOR DEBUGGING */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-muted-foreground">Everything you need to know about our pricing model</p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <div className="space-y-4">
                <div className="p-6 bg-card rounded-lg border">
                  <h3 className="font-semibold mb-2">What does the free plan include?</h3>
                  <p className="text-sm text-muted-foreground">
                    On the free plan, you get 1 HEU per day, with a total limit of 5 HEUs per month.
                  </p>
                </div>
                <div className="p-6 bg-card rounded-lg border">
                  <h3 className="font-semibold mb-2">What is a HEU?</h3>
                  <p className="text-sm text-muted-foreground">
                    HEUs are Hobson's currency. You spend them whenever Hobson works on something for you.
                  </p>
                </div>
                <div className="p-6 bg-card rounded-lg border">
                  <h3 className="font-semibold mb-2">FAQ temporarily simplified</h3>
                  <p className="text-sm text-muted-foreground">
                    Testing React context fix - full FAQ will be restored after debugging.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
};

export default Pricing;