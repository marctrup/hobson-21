
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play } from "lucide-react";
import { OptimizedImage } from "@/components/OptimizedImage";
import documentAiIcon from "/lovable-uploads/4351fb54-1d77-416e-9474-3c80e483a83c.png";

interface HeroSectionProps {
  onShowExplainerVideo: () => void;
}

export const HeroSection = ({ onShowExplainerVideo }: HeroSectionProps) => {
  return (
    <section className="relative py-16 overflow-hidden" aria-labelledby="hero-heading">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" aria-hidden="true"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh] max-w-7xl mx-auto">
          <div className="space-y-8 text-center lg:text-left lg:pl-8">
            <div className="space-y-6">
              <div className="relative">
                <Badge variant="outline" className="text-primary border-primary/20 absolute -top-12 left-0 text-sm">
                  🚀 Now in Beta
                </Badge>
                 <h1 
                   id="hero-heading" 
                   className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1]"
                 >
                    AI-Document Intelligence for the <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Property Industry</span>
                  </h1>
              </div>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
                Transform your property documents with intelligent analysis, 
                automated insights, and instant answers to complex property questions.
              </p>
            </div>

            {/* Expert Guide Video */}
            <div className="mt-8 flex justify-center lg:justify-start">
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
                <div className="relative w-80 h-52 rounded-2xl overflow-hidden shadow-xl border-4 border-white/20 group-hover:scale-105 transition-transform duration-300">
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
                <div className="mt-6 space-y-2 text-center lg:text-left">
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

          <div className="relative flex justify-center lg:justify-end lg:pr-8">
            {/* Document AI Visualization - Enhanced 3D Effect */}
            <div className="relative group perspective-1000">
              {/* 3D Document Stack with Enhanced Shadows */}
              <div className="relative transform-gpu">
                {/* Background shadow layer */}
                <div className="absolute top-6 left-6 w-full h-full bg-gradient-to-br from-gray-400/30 to-gray-600/30 rounded-xl blur-xl transform rotate-2"></div>
                <div className="absolute top-4 left-4 w-full h-full bg-gradient-to-br from-gray-300/40 to-gray-500/40 rounded-xl blur-lg transform rotate-1"></div>
                <div className="absolute top-2 left-2 w-full h-full bg-gradient-to-br from-muted/60 to-muted/80 rounded-xl shadow-xl transform rotate-0.5"></div>
                
                {/* Main document with enhanced styling */}
                <div className="relative z-10 aspect-[4/5] overflow-hidden rounded-xl bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25),0_0_0_1px_rgba(255,255,255,0.5)] max-w-md mx-auto transform hover:scale-105 transition-all duration-300 hover:shadow-[0_35px_60px_-12px_rgba(0,0,0,0.3)]">
                  <OptimizedImage
                    src={documentAiIcon} 
                    alt="Intelligent tenancy document processing with automated insights and answers" 
                    className="w-full h-full object-cover"
                    width={320}
                    height={400}
                    priority={true}
                    fetchPriority="high"
                    sizes="320px"
                  />
                  {/* Subtle inner shadow for depth */}
                  <div className="absolute inset-0 shadow-inner rounded-xl"></div>
                </div>
              </div>
              
              {/* Text under document */}
              <div className="mt-8 text-center space-y-2">
                <h3 className="text-xl font-bold text-muted-foreground leading-relaxed">
                  Your Documents now have a voice
                </h3>
                <p className="text-xl font-bold text-primary">
                  Are you ready to listen?
                </p>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
};
