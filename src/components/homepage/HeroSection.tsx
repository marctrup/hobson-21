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
                   className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1]"
                 >
                    AI-Document Intelligence for the <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Property Industry</span>
                  </h1>
              </div>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Transform your property documents with intelligent analysis, 
                automated insights, and instant answers to complex property questions.
              </p>
            </div>

            {/* Expert Guide Video - Direct Container */}
            <div className="mt-12 flex flex-col items-center space-y-6">
              <div 
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
                style={{ 
                  width: '320px', 
                  height: '208px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '4px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <img
                  src="/lovable-uploads/915c8f99-05e9-4948-aa5d-7704686f4175.png"
                  alt="Georgia from Hobson's Choice AI explaining property management AI software features and benefits"
                  style={{ 
                    width: '320px', 
                    height: '208px', 
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  width="320"
                  height="208"
                />
                
                {/* Play Button */}
                <div style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  right: '0',
                  bottom: '0',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}>
                    <Play className="w-8 h-8 text-primary ml-1" />
                  </div>
                </div>
              </div>
              
              {/* Call to Action Text */}
              <div className="space-y-2 text-center">
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
    </section>
  );
};