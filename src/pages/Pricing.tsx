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
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-24 lg:py-32">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.1)_50%,transparent_75%,transparent_100%)] bg-[length:60px_60px]" />
          <div className="container relative mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Only Pay for What Hobson Works On —{" "}
                <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                  Not Seats, Not Properties
                </span>
              </h1>
              <p className="mb-8 text-xl text-muted-foreground sm:text-2xl">
                Forget per-user fees. Forget per-property fees. Forget paying extra for features. 
                Hobson charges for the actual work our AI does — measured in{" "}
                <span className="font-semibold text-primary">Hobson Energy Units (HEUs)</span>.
              </p>
              <Button size="lg" className="h-12 px-8 text-lg font-semibold">
                See Plans & Compare Savings
              </Button>
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

        {/* Plans Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="overflow-x-auto">
              <table className="w-full max-w-4xl mx-auto border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Plan</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Monthly Cost</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">HEUs Included</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Who It's For</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border hover:bg-muted/50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Free</span>
                        <Badge variant="secondary">Try it</Badge>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-primary">£0</td>
                    <td className="py-4 px-6">5 HEUs</td>
                    <td className="py-4 px-6 text-muted-foreground">Try Hobson on a few documents & queries</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-muted/50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Standard</span>
                        <Badge>Popular</Badge>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-primary">£18.50 + VAT</td>
                    <td className="py-4 px-6">31 HEUs</td>
                    <td className="py-4 px-6 text-muted-foreground">Small portfolios, steady workload</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-muted/50">
                    <td className="py-4 px-6">
                      <span className="font-semibold">Pro</span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-primary">£28.50 + VAT</td>
                    <td className="py-4 px-6">50 HEUs</td>
                    <td className="py-4 px-6 text-muted-foreground">Growing portfolios, more frequent use</td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="py-4 px-6">
                      <span className="font-semibold">Top-Up</span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-primary">From £10</td>
                    <td className="py-4 px-6">20 extra HEUs</td>
                    <td className="py-4 px-6 text-muted-foreground">For busy months or big projects</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Why Old CRM Pricing Costs More
              </h2>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
              {/* Old CRM Model */}
              <Card className="border-destructive/20">
                <CardHeader>
                  <CardTitle className="text-destructive">Old CRM Model</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-2 h-2 bg-destructive rounded-full" />
                      Per user + per property
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-2 h-2 bg-destructive rounded-full" />
                      Still billed for inactive properties
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-2 h-2 bg-destructive rounded-full" />
                      Pay more for extra users
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-2 h-2 bg-destructive rounded-full" />
                      Pay extra for new features
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <div className="text-sm text-muted-foreground mb-1">Small agency</div>
                    <div className="text-2xl font-bold text-destructive">£140/month</div>
                  </div>
                  <div className="pt-2">
                    <div className="text-sm text-muted-foreground mb-1">Larger portfolio</div>
                    <div className="text-2xl font-bold text-destructive">£500/month</div>
                  </div>
                </CardContent>
              </Card>

              {/* Hobson */}
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-primary">Hobson</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      Pay per task (HEUs)
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      No charge for inactive properties
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      Unlimited users
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      All new features included
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <div className="text-sm text-muted-foreground mb-1">Small agency</div>
                    <div className="text-2xl font-bold text-primary">£18.50/month</div>
                  </div>
                  <div className="pt-2">
                    <div className="text-sm text-muted-foreground mb-1">Larger portfolio</div>
                    <div className="text-2xl font-bold text-primary">£28.50/month</div>
                  </div>
                </CardContent>
              </Card>
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
                    A Hobson Energy Unit measures the AI work used. Small queries = small usage, big document analysis = more.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left">Do I pay for people who don't log in?</AccordionTrigger>
                  <AccordionContent>
                    No. Unlimited users.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left">Do I pay for empty properties?</AccordionTrigger>
                  <AccordionContent>
                    No. Only active AI work is billed.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left">Do I pay extra for new features?</AccordionTrigger>
                  <AccordionContent>
                    Never. All new features are included.
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
            <Button size="lg" className="h-12 px-8 text-lg font-semibold">
              Choose Your Plan
            </Button>
          </div>
        </section>
      </div>
    </>
  );
};

export default Pricing;