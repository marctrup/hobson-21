import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

const FeaturesComingSoon = () => (
  <section className="py-12 sm:py-16 bg-muted/40 border-y border-border/30">
    <div className="container mx-auto px-4 max-w-5xl">
      <Badge variant="outline" className="mb-6 text-xs tracking-widest">
        COMING LATER THIS YEAR
      </Badge>

      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
        The journey continues
      </h2>
      <p className="text-lg text-muted-foreground mb-10 max-w-3xl">
        Phase 1 is the foundation. Here is what it enables.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-border bg-background p-6 space-y-4">
          <Badge className="w-fit bg-accent-teal/10 text-accent-teal border-0">Phase 2</Badge>
          <h3 className="text-xl font-bold text-foreground">The Knowledge Base</h3>
          <p className="text-muted-foreground leading-relaxed">
            Hobson learns how your business operates. Your contractors, contacts, policies, approval thresholds and communication preferences — stored permanently and applied to every answer. Every feature above becomes more powerful when Hobson knows your business, not just your documents.
          </p>
          <Link
            to="/pricing"
            className="inline-flex items-center gap-1 text-accent-teal font-medium hover:underline"
          >
            Join the waitlist <ArrowRight className="w-4 h-4" />
          </Link>
        </Card>

        <Card className="border-border bg-background p-6 space-y-4">
          <Badge className="w-fit bg-accent-amber/15 text-accent-amber border-0">Phase 3</Badge>
          <h3 className="text-xl font-bold text-foreground">The Application Layer</h3>
          <p className="text-muted-foreground leading-relaxed">
            Built on the accuracy of Phase 1 and the business context of Phase 2, Hobson executes workflows autonomously. Rent reviews triggered. Compliance deadlines actioned. Lease events managed end-to-end. The work gets done.
          </p>
          <Link
            to="/pricing"
            className="inline-flex items-center gap-1 text-accent-amber font-medium hover:underline"
          >
            Join the waitlist <ArrowRight className="w-4 h-4" />
          </Link>
        </Card>
      </div>
    </div>
  </section>
);

export default FeaturesComingSoon;
