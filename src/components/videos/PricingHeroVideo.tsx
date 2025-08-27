import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X, ChevronRight } from "lucide-react";

export const PricingHeroVideo = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(true);
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVideoVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full max-w-[1051px] md:max-w-[800px] sm:max-w-[600px] h-auto aspect-video">
      <div className="flex justify-center">
        <Dialog 
          open={videoDialogOpen} 
          onOpenChange={setVideoDialogOpen}
        >
          <DialogTrigger asChild>
            <div
              ref={videoRef}
              className={`cursor-pointer relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-lg transition-all duration-700 transform ${
                isHovered ? 'scale-105 shadow-2xl' : 'scale-100 opacity-100'
              }`}
              style={{ border: '10px solid #f0f0f0' }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              id="pricing-hero-video-container"
            >
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <img
                  src="/lovable-uploads/9ce85eaf-86cd-42aa-be7f-9fa1494b7af9.png"
                  alt="HEU Coin - Hobson Energy Units"
                  className="coin-animation"
                  style={{
                    width: '50%',
                    height: 'auto'
                  }}
                />
              </div>
              <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center play-text-container" style={{ bottom: '8px' }}>
                <div className="flex items-center gap-1 text-purple-800 font-semibold" style={{ transform: 'scale(2.2815)' }}>
                  <span className="text-xs">Play Video</span>
                  <ChevronRight className="h-3 w-3" />
                </div>
              </div>
              <style dangerouslySetInnerHTML={{
                __html: `
                  .coin-animation {
                    animation: spinY 12s linear infinite;
                  }
                
                  @keyframes spinY {
                    0% { transform: scale(2.376) rotateY(0deg); }
                    25% { transform: scale(2.376) rotateY(90deg); }
                    50% { transform: scale(2.376) rotateY(180deg); }
                    75% { transform: scale(2.376) rotateY(270deg); }
                    100% { transform: scale(2.376) rotateY(360deg); }
                  }
                  
                  @media (max-width: 640px) {
                    @keyframes spinY {
                      0% { transform: scale(1.98) rotateY(0deg); }
                      25% { transform: scale(1.98) rotateY(90deg); }
                      50% { transform: scale(1.98) rotateY(180deg); }
                      75% { transform: scale(1.98) rotateY(270deg); }
                      100% { transform: scale(1.98) rotateY(360deg); }
                    }
                  }
                `
              }} />
            </div>
          </DialogTrigger>
          <DialogContent 
            className="!p-0 !max-w-none !w-auto !h-auto !border-0 !bg-transparent !shadow-none !duration-0 !animate-none" 
            style={{ 
              zIndex: 50,
              maxWidth: '90vw',
              maxHeight: '90vh',
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
            id="pricing-hero-video-dialog"
          >
            <button 
              onClick={() => setVideoDialogOpen(false)}
              className="absolute right-4 top-4 z-[60] rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-background border border-border p-1"
              aria-label="Close video"
            >
              <X className="h-4 w-4" />
            </button>
            <DialogTitle className="sr-only">HEU Coin - Hobson Energy Units Explained</DialogTitle>
            <DialogDescription className="sr-only">
              Learn about Hobson Energy Units and our revolutionary pricing model
            </DialogDescription>
            {videoDialogOpen && (
              <iframe
                className="rounded-lg w-full h-full min-w-[320px] min-h-[180px] sm:min-w-[800px] sm:min-h-[450px]"
                src="https://player.vimeo.com/video/1113596009?autoplay=1&muted=0&byline=0&portrait=0&responsive=1"
                title="HEU Coin - Hobson Energy Units Explained"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                id="pricing-hero-video-iframe"
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};