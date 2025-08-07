
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
        <div className="flex justify-center items-center min-h-[80vh] max-w-4xl mx-auto">
          <div className="space-y-8 text-center">
            <div className="space-y-6">
              <div className="relative">
                <Badge variant="outline" className="text-primary border-primary/20 mb-6 text-sm">
                  🚀 Now in Beta
                </Badge>
                 <h1 
                   id="hero-heading" 
                   className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] -mt-[9px]"
                 >
                    AI-Document Intelligence for the <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Property Industry</span>
                  </h1>
              </div>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Transform your property documents with intelligent analysis, 
                automated insights, and instant answers to complex property questions.
              </p>
            </div>

            {/* Expert Guide Video */}
            <div className="mt-12 flex justify-center">
              <div 
                className="relative group cursor-pointer"
                onClick={onShowExplainerVideo}
                role="button"
                tabIndex={0}
                aria-label="Play explainer video about Hobson AI property management software"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onShowExplainerVideo();
                  }
                }}
              >
                {/* Video Thumbnail */}
                <div className="relative w-[336px] h-[218px] rounded-2xl overflow-hidden shadow-xl border-4 border-white/20 group-hover:scale-105 transition-transform duration-300">
                  <OptimizedImage
                    src="/lovable-uploads/915c8f99-05e9-4948-aa5d-7704686f4175.png"
                    alt="Georgia from Hobson's Choice AI explaining property management AI software features and benefits"
                    className="w-full h-full object-cover relative z-10"
                    width={320}
                    height={208}
                    priority={true}
                    sizes="(max-width: 768px) 100vw, 320px"
                  />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform" aria-hidden="true">
                      <Play className="w-8 h-8 text-primary ml-1" aria-hidden="true" />
                    </div>
                  </div>
                </div>
                
                {/* Call to Action Text */}
                <div className="mt-4 space-y-2 text-center">
                  <h3 className="text-xl font-semibold text-foreground">
                    "Would it help if I explained a bit more?"
                  </h3>
                  <p className="text-muted-foreground">
                    Click to hear from Georgia
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
};
