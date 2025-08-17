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
          <div className="container relative mx-auto px-2 h-full flex items-center" style={{
          backgroundColor: '#ffffff',
          backgroundImage: 'none'
        }}>
             <div className="grid lg:grid-cols-2 gap-14 items-center w-full mx-auto">
                {/* Left Container - Video Screen */}
                <div className="flex justify-center lg:justify-start">
                  <div className="w-full max-w-4xl aspect-video bg-gray-100 rounded-xl overflow-hidden relative group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl" style={{
                    border: '10px solid #f0f0f0'
                  }}>
                    <div className="w-full h-full relative">
                      <img 
                        src="/lovable-uploads/e1c0b687-df4c-43fe-adfa-7a99ded5f9ac.png" 
                        alt="HEU Coin - Hobson Energy Units Explained"
                        className="w-full h-full object-cover object-center transition-all duration-300 group-hover:brightness-75"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Right Container - Content */}
                <div className="space-y-8">
                   <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                     From Energy to Outcomes —{" "}
                     <span className="bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">that's the Hobson way.</span>
                   </h1>
                  <p className="text-xl text-muted-foreground">
                    Forget per-user fees. Forget per-property fees. Forget paying extra for features. 
                    Hobson charges for the actual work our AI does — measured in{" "}
                    <span className="font-semibold text-primary">Hobson Energy Units (HEUs)</span>.
                  </p>
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
                  <div className="text-sm text-purple-600 font-medium mt-1">1 daily HUE (up to 5/month)</div>
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
                  <div className="text-3xl font-bold text-green-700 mt-2">£50</div>
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
                  <div className="text-3xl font-bold text-purple-700 mt-2">£50<span className="text-sm font-normal">/month</span></div>
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
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-purple-600 flex-shrink-0" />
                        <span className="text-xs">Priority support</span>
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
                  <div className="text-3xl font-bold text-purple-600 mt-2">£10</div>
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
                  <AccordionTrigger>What does the free plan include?</AccordionTrigger>
                  <AccordionContent>
                    On the free plan, you get 1 HEU per day, with a total limit of 5 HEUs per month. Example: If you use all 1 HEU every day for 5 days (5 HEUs total), you'll reach the monthly limit and won't be able to use any more credits until it resets at the end of the 1-month period.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>What is a HEU?</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <p>
                        HEUs are Hobson's currency. You spend them whenever Hobson works on something for you. The amount of HEUs used depends on how complex the task is — simple jobs use fewer HEUs, complex jobs use more.
                      </p>
                      
                      <p>This means you only spend what you need:</p>
                      
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Small, quick answers cost very little.</li>
                        <li>Bigger, more detailed work costs more.</li>
                      </ul>
                      
                      <div className="mt-6">
                        <h4 className="font-semibold mb-3">Here are some example tasks and their HEU cost:</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse border border-border rounded-lg">
                            <thead>
                              <tr className="bg-muted/50">
                                <th className="border border-border p-3 text-left font-medium">Example Task</th>
                                <th className="border border-border p-3 text-left font-medium">Work Done</th>
                                <th className="border border-border p-3 text-left font-medium">HEUs</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border border-border p-3">Reading a simple document (e.g. certificate)</td>
                                <td className="border border-border p-3">Scans and summarises</td>
                                <td className="border border-border p-3">
                                  <input 
                                    type="number" 
                                    step="0.1" 
                                    defaultValue="0.50" 
                                    className="w-16 px-2 py-1 border border-input rounded text-sm bg-background"
                                  />
                                </td>
                              </tr>
                              <tr className="bg-muted/20">
                                <td className="border border-border p-3">Reading a medium document (e.g. deed)</td>
                                <td className="border border-border p-3">Reviews, extracts key info</td>
                                <td className="border border-border p-3">
                                  <input 
                                    type="number" 
                                    step="0.1" 
                                    defaultValue="1.00" 
                                    className="w-16 px-2 py-1 border border-input rounded text-sm bg-background"
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td className="border border-border p-3">Reading a complex document (e.g. lease)</td>
                                <td className="border border-border p-3">Full detailed review and breakdown</td>
                                <td className="border border-border p-3">
                                  <input 
                                    type="number" 
                                    step="0.1" 
                                    defaultValue="2.00" 
                                    className="w-16 px-2 py-1 border border-input rounded text-sm bg-background"
                                  />
                                </td>
                              </tr>
                              <tr className="bg-muted/20">
                                <td className="border border-border p-3">Asking a simple query (e.g. "What is the rent?")</td>
                                <td className="border border-border p-3">Finds and returns one fact</td>
                                <td className="border border-border p-3">
                                  <input 
                                    type="number" 
                                    step="0.1" 
                                    defaultValue="0.20" 
                                    className="w-16 px-2 py-1 border border-input rounded text-sm bg-background"
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td className="border border-border p-3">Asking a medium query (e.g. "List all rents")</td>
                                <td className="border border-border p-3">Searches and compiles several data points</td>
                                <td className="border border-border p-3">
                                  <input 
                                    type="number" 
                                    step="0.1" 
                                    defaultValue="0.50" 
                                    className="w-16 px-2 py-1 border border-input rounded text-sm bg-background"
                                  />
                                </td>
                              </tr>
                              <tr className="bg-muted/20">
                                <td className="border border-border p-3">Asking a complex query (e.g. "Build a tenancy report")</td>
                                <td className="border border-border p-3">Gathers multiple details, formats a full report</td>
                                <td className="border border-border p-3">
                                  <input 
                                    type="number" 
                                    step="0.1" 
                                    defaultValue="1.50" 
                                    className="w-16 px-2 py-1 border border-input rounded text-sm bg-background"
                                  />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>What document types does Hobson understand?</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6">
                      <p className="text-muted-foreground leading-relaxed">
                        Hobson works with a wide range of property-related documents — and this list is growing every week.
                      </p>
                      
                      <div className="space-y-5">
                        <div className="border-l-4 border-primary pl-4">
                          <h4 className="font-semibold text-foreground mb-2">1. Right to Occupy (RTO) Documents</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            These are the main agreements that give someone the legal right to occupy a property.
                          </p>
                          <div className="text-sm">
                            <p className="font-medium text-foreground mb-1">Examples:</p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                              <li>Residential leases</li>
                              <li>Commercial leases</li>
                              <li>Licences to occupy</li>
                            </ul>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2 italic">
                            If there's an RTO in place, most other property documents relate back to it.
                          </p>
                        </div>

                        <div className="border-l-4 border-secondary pl-4">
                          <h4 className="font-semibold text-foreground mb-2">2. Amending Documents (AMD)</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            These are documents that change an existing RTO — either by altering its terms, the people involved, or the rules in it. You have to read them alongside the RTO to know its current form.
                          </p>
                          <div className="text-sm">
                            <p className="font-medium text-foreground mb-1">Examples:</p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                              <li>Deeds (variation, recification etc)</li>
                              <li>Addendums</li>
                              <li>Memoranda</li>
                              <li>Assignments & Novations</li>
                              
                              <li>Surrenders & Regrants</li>
                              
                              <li>Formal notices that alter rights or terms</li>
                              <li>etc</li>
                            </ul>
                          </div>
                        </div>

                        <div className="border-l-4 border-accent pl-4">
                          <h4 className="font-semibold text-foreground mb-2">3. Accompanying Documents (ACD)</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            These support or explain an RTO but don't change its terms. They're often needed for compliance or reference, not for altering the legal agreement itself.
                          </p>
                          <div className="text-sm">
                            <p className="font-medium text-foreground mb-1">Examples:</p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                              <li>Drawings</li>
                              <li>Compliance certificates</li>
                              <li>Inventory & schedule of condition</li>
                              <li>Statutory disclosures</li>
                              <li>etc</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 p-4 bg-muted rounded-lg border">
                        <p className="text-sm text-muted-foreground">
                          <strong>Not sure about a document type?</strong> Please check with us if you're unsure whether Hobson can work with a specific document format or type.
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger>What is the Starter Pack?</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <p>
                        The Starter Pack is a one-time purchase designed to help you onboard your documents and try out Hobson without committing to a monthly subscription.
                      </p>
                      
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-green-700 mb-2">Key Benefits:</h4>
                          <ul className="list-disc list-inside space-y-1 ml-4 text-sm text-muted-foreground">
                            <li><strong>1000 HEUs</strong> - Generous credits for uploading and processing your documents</li>
                            <li><strong>2-month rollover</strong> - Your unused HEUs last twice as long compared to monthly plans</li>
                            <li><strong>One-time payment</strong> - No recurring charges, pay once and use when you need</li>
                            <li><strong>Perfect for testing</strong> - Try out all features and see how Hobson works with your documents</li>
                          </ul>
                        </div>
                        
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <p className="text-sm text-green-800">
                            <strong>Perfect for:</strong> New users who want to upload their document library, test Hobson's capabilities, and decide if a monthly plan makes sense for their workflow.
                          </p>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>Can I change plans anytime?</AccordionTrigger>
                  <AccordionContent>
                    Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect at your next billing cycle, and any unused HEUs from Top-Ups will carry over to your new plan.
                  </AccordionContent>
                </AccordionItem>
                
                
                <AccordionItem value="item-6">
                  <AccordionTrigger>Daily and Monthly HEUs</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-2 text-purple-700">Daily HEUs</h4>
                        <div className="mb-4">
                          <h5 className="font-medium mb-2">Q: What are daily HEUs and how do they work?</h5>
                          <p className="mb-3">A: Daily HEUs are small, free credits you get every day — included in both free and paid plans.</p>
                          
                          <div className="mb-3">
                            <p className="font-medium text-sm mb-2">Use it or lose it:</p>
                            <p className="text-sm mb-2">They expire at the end of the day and don't roll over.</p>
                            <p className="text-sm italic">Example: If you get 5 daily HEUs and only use 3, the other 2 vanish at midnight.</p>
                          </div>

                          <div className="mb-3">
                            <p className="font-medium text-sm mb-2">Purpose:</p>
                            <ul className="list-disc list-inside space-y-1 ml-4 text-sm text-muted-foreground">
                              <li>Let you use the service each day without touching your monthly HEUs.</li>
                              <li>Give free users a way to try the service daily.</li>
                              <li>Encourage regular use by refreshing every 24 hours.</li>
                            </ul>
                          </div>

                          <p className="text-sm font-medium">Bonus, not your main allowance: Best for quick or small tasks.</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2 text-purple-700">Monthly HEUs</h4>
                        <div>
                          <h5 className="font-medium mb-2">Q: What are monthly HEUs and how do they work?</h5>
                          <p className="mb-3">A: Monthly HEUs are the main credits you get at the start of each billing month (paid plans only).</p>
                          
                          <div className="mb-3">
                            <p className="font-medium text-sm mb-2">Rollover rule:</p>
                            <p className="text-sm mb-2">If you don't use them all, leftovers move to next month — but you can't store more than your monthly amount.</p>
                            <p className="text-sm italic">Example: You get 100 HEUs/month. If you only use 80, you start next month with 120. If you only use 10, you're still capped at 200 total (100 new + 100 carry-over). In month 3, you won't carry over any credits left from month 1 — only the unused credits from month 2 will roll over.</p>
                          </div>

                          <div className="mb-3">
                            <p className="font-medium text-sm mb-2">Monthly plan:</p>
                            <p className="text-sm mb-2">Rolled-over HEUs last 1 month, then expire.</p>
                            <p className="text-sm italic">Example: Leftovers from July must be used in August, or they disappear.</p>
                          </div>

                          <div className="mb-3">
                            <p className="font-medium text-sm mb-2">Annual plan:</p>
                            <p className="text-sm mb-2">Rolled-over HEUs can stack up to 12× your monthly amount and last for 12 months.</p>
                            <p className="text-sm italic">Example: With 100/month, you can store up to 1,200, and July's credits stay usable until the next July.</p>
                          </div>

                          <div>
                            <p className="font-medium text-sm mb-2">Cancel plan:</p>
                            <p className="text-sm">Any unused HEUs vanish at the end of your billing cycle.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
              </Accordion>
            </div>
          </div>
        </section>

      </div>
    </>
};

export default Pricing;