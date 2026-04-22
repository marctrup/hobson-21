import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const FeaturesCTA = () => (
  <section
    className="py-16 sm:py-20"
    style={{
      background:
        "linear-gradient(135deg, hsl(var(--accent-amber) / 0.08), hsl(var(--accent-teal) / 0.08))",
    }}
  >
    <div className="container mx-auto px-4 text-center max-w-3xl">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
        Phase 1 is live. Try it on your documents today.
      </h2>
      <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
        No card required. No technical setup. No integration work. Add your first document and ask your first question in minutes.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild size="lg" className="text-base px-8 py-4 h-auto">
          <Link to="/pricing">
            Start free — no card required
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="text-base px-8 py-4 h-auto">
          <Link to="/in-practice">
            See it in practice
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </Button>
      </div>
    </div>
  </section>
);

export default FeaturesCTA;
