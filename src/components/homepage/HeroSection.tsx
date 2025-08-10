import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play } from "lucide-react";
import { OptimizedImage } from "@/components/OptimizedImage";

interface HeroSectionProps {
  onShowExplainerVideo: () => void;
}

export const HeroSection = ({ onShowExplainerVideo }: HeroSectionProps) => {
  return (
    <section className="relative py-16 overflow-hidden" aria-labelledby="hero-heading">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" aria-hidden="true"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh] max-w-6xl mx-auto">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="relative">
                <Badge variant="outline" className="text-primary border-primary/20 mb-6 text-sm">
                  🚀 Now in Beta
                </Badge>
                 <h1 
                   id="hero-heading" 
                   className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1]"
                 >
                    The bleeding obvious in property — trapped in documents, <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">freed by Hobson</span>
                  </h1>
              </div>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Transform your property documents with intelligent analysis, 
                automated insights, and instant answers to complex property questions.
              </p>
            </div>
          </div>
          
          <div className="border-[5px] border-muted rounded-lg p-6 bg-white/5 backdrop-blur-sm">
            <div className="space-y-4">
              <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <p className="text-lg font-medium">Demo Content</p>
                  <p className="text-sm">Visual representation area</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
};