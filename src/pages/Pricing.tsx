import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
        <section className="relative overflow-hidden py-8 sm:py-16 lg:py-32 min-h-[40vh] sm:min-h-[55vh] lg:min-h-[72vh]" style={{
        backgroundColor: '#ffffff',
        backgroundImage: 'none',
        background: '#ffffff'
      }}>
          <div className="container relative mx-auto px-2 h-full flex items-center" style={{
          backgroundColor: '#ffffff',
          backgroundImage: 'none'
        }}>
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
                                <td className="border border-border p-3 font-medium">0.5</td>
                              </tr>
                              <tr className="bg-muted/20">
                                <td className="border border-border p-3">Reading a medium document (e.g. deed)</td>
                                <td className="border border-border p-3">Reviews, extracts key info</td>
                                <td className="border border-border p-3 font-medium">1.4</td>
                              </tr>
                              <tr>
                                <td className="border border-border p-3">Reading a complex document (e.g. lease)</td>
                                <td className="border border-border p-3">Full detailed review and breakdown</td>
                                <td className="border border-border p-3 font-medium">16.9</td>
                              </tr>
                              <tr className="bg-muted/20">
                                <td className="border border-border p-3">Asking a simple query (e.g. "What is the rent?")</td>
                                <td className="border border-border p-3">Finds and returns one fact</td>
                                <td className="border border-border p-3 font-medium">0.05</td>
                              </tr>
                              <tr>
                                <td className="border border-border p-3">Asking a medium query (e.g. "List all rents")</td>
                                <td className="border border-border p-3">Searches and compiles several data points</td>
                                <td className="border border-border p-3 font-medium">0.26</td>
                              </tr>
                              <tr className="bg-muted/20">
                                <td className="border border-border p-3">Asking a complex query (e.g. "Build a tenancy report")</td>
                                <td className="border border-border p-3">Gathers multiple details, formats a full report</td>
                                <td className="border border-border p-3 font-medium">0.54</td>
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
                          <strong>Not sure about a document type?</strong> Please check with us if you're unsure whether Hobson can work with a specific document format or type. Hobson is continually growing its knowledge.
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger>What is the Starter Pack?</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-3">What's the Starter Pack for?</h4>
                        <p className="text-sm text-muted-foreground">
                          It's a one-time bundle to help you load your documents into the platform fast. It covers the heavy lifting: upload, extract key data, and index for search.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Why do I need this before a plan?</h4>
                        <p className="text-sm text-muted-foreground">
                          Most of the cost happens up front when we process your files. The Starter Pack gives you extra credit to finish onboarding without worrying about limits.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">What do I get?</h4>
                        <p className="text-sm text-muted-foreground">
                          1000 HEUs (Hobson Energy Units — our usage credits). You can spend HEUs on document extraction, storage, and initial Q&A.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Do Starter Pack HEUs expire?</h4>
                        <p className="text-sm text-muted-foreground">
                          Unused HEUs roll over for 2 months. (Other plan rollovers last 1 month.)
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Is it a subscription?</h4>
                        <p className="text-sm text-muted-foreground">
                          No. It's a one-time purchase made for onboarding. Pick a plan later, or right away—your Starter HEUs still apply to the same account.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">How is this different from Free/Essential?</h4>
                        <p className="text-sm text-muted-foreground">
                          Free/Essential include ongoing monthly usage. The Starter Pack front-loads generous HEUs so you can complete document onboarding quickly.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Will this unlock the full platform?</h4>
                        <p className="text-sm text-muted-foreground">
                          Yes. You can try the full platform while you import and set everything up.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">What happens when I run out of HEUs?</h4>
                        <p className="text-sm text-muted-foreground">
                          You can move to a plan or buy top-ups to finish the process.
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="bg-background border-border">
                  <AccordionTrigger className="text-foreground hover:text-primary">What is the knowledgebase?</AccordionTrigger>
                  <AccordionContent className="bg-background text-foreground">
                    <div className="space-y-6 bg-background p-4 rounded-lg">
                      <div>
                        <p className="mb-4 text-foreground">
                          A private space where Hobson learns your people, rules, and ways of working — so answers are personalised, not generic.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Why use it?</h4>
                        <p className="mb-3 text-foreground">Hobson can act like part of your team. Example:</p>
                        <div className="mb-4 p-3 bg-muted rounded-lg border">
                          <p className="text-sm italic">"Gas certificate expired — email John Higgins?"</p>
                          <p className="text-sm italic">"Guardian breach — escalate to Paul Evans?"</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">What do we provide?</h4>
                        <p className="mb-3 text-foreground">Just a one-page template:</p>
                        <ul className="list-disc list-inside space-y-1 ml-4 text-foreground">
                          <li>A short business overview</li>
                          <li>Key people & contacts</li>
                          <li>A few quick-win business rules</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">How is it used?</h4>
                        <p className="text-foreground">
                          We store this securely in MongoDB. Hobson checks it before answering, so replies are tailored to your company.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Is it secure?</h4>
                        <p className="text-foreground">Yes. Your data stays private, encrypted, and never shared.</p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Does it cost extra?</h4>
                        <p className="text-foreground">No — included with Enterprise plans only.</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger>Can I change plans anytime?</AccordionTrigger>
                  <AccordionContent>
                    Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect at your next billing cycle. Any benefits by downgrading will be lost.
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