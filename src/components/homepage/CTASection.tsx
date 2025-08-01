import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Users } from "lucide-react";
import { Link } from "react-router-dom";

export const CTASection = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground leading-[1.1]">
            Ready to think about AI in your property business but unsure how?
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Join our exclusive pilot program and be among the first to experience the future of property intelligence.
          </p>
          
          <div className="flex flex-col items-center gap-4">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              asChild
            >
              <Link 
                to="/contact"
                title="Get in touch to start your real estate ai journey"
              >
                Contact Us
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>

          <div className="mt-16 pt-16 border-t">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-center justify-center gap-3">
                <CheckCircle className="w-6 h-6 text-primary" />
                <span className="text-muted-foreground">Enterprise-grade security</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Users className="w-6 h-6 text-primary" />
                <span className="text-muted-foreground">Trusted by industry leaders</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};