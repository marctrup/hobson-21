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

        {/* Real-Life Savings */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="mb-4 mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Briefcase className="w-8 h-8 text-primary" />
                </div>
                <div className="text-2xl font-bold text-primary mb-2">Save £1,452/year</div>
                <p className="text-muted-foreground">Business (1-9 employees, 50 units)</p>
              </div>
              
              <div className="text-center">
                <div className="mb-4 mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-primary" />
                </div>
                <div className="text-2xl font-bold text-primary mb-2">Save £5,676/year</div>
                <p className="text-muted-foreground">Business (10-49 employees, 200 units)</p>
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

        {/* Old CRM vs Hobson - Redesigned */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">The Pricing Model That Doesn't Punish Growth</h2>
              <p className="text-muted-foreground text-lg">Where the Savings Come From</p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
              {/* Old CRM - Left Side */}
              <Card className="bg-muted/60 border-destructive/30 hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold text-destructive flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center">
                      <span className="text-destructive text-sm font-bold">×</span>
                    </div>
                    Current CRM Model
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/5">
                      <span className="text-destructive text-lg mt-0.5">❌</span>
                      <div>
                        <div className="font-medium text-foreground">Per user and or per property</div>
                        <div className="text-sm text-muted-foreground">Pay for every person and property</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/5">
                      <span className="text-destructive text-lg mt-0.5">❌</span>
                      <div>
                        <div className="font-medium text-foreground">Still billed for inactive properties</div>
                        <div className="text-sm text-muted-foreground">Empty properties cost money</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/5">
                      <span className="text-destructive text-lg mt-0.5">❌</span>
                      <div>
                        <div className="font-medium text-foreground">Pay extra for new features</div>
                        <div className="text-sm text-muted-foreground">Feature add-ons increase costs</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-destructive/20 pt-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Business (1-9 employees, 50 units)</span>
                      <span className="font-bold text-destructive text-lg">£140/month</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Business (10-49 employees, 200 units)</span>
                      <span className="font-bold text-destructive text-lg">£500/month</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Hobson - Right Side */}
              <Card className="bg-card border-primary/30 hover:shadow-lg transition-shadow duration-300">
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
                  
                  <div className="border-t border-primary/20 pt-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Business (1-9 employees, 50 units)</span>
                      <span className="font-bold text-primary text-lg">£18.50/month</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Business (10-49 employees, 200 units)</span>
                      <span className="font-bold text-primary text-lg">£28.50/month</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>


        {/* Pricing Plans - Cards */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">Choose Your Plan</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Start with our Free plan or choose a monthly HEU bundle that fits your workload
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
              {/* Free Plan */}
              <Card className="bg-card border border-border rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg font-semibold">Free</CardTitle>
                  <div className="text-3xl font-bold text-primary">£0</div>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="text-2xl font-semibold text-foreground">5 HEUs</div>
                  <p className="text-sm text-muted-foreground">Try Hobson on a few documents </p>
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
                  <p className="text-sm text-muted-foreground"> steady workload</p>
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
                  <p className="text-sm text-muted-foreground">Frequent use, larger team</p>
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
                    <p className="text-muted-foreground">
                      No — they reset monthly.
                    </p>
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