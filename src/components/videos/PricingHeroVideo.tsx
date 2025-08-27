import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X } from "lucide-react";

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
    <div className="w-full max-w-[507px] h-auto aspect-video">
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
              <img
                src="/lovable-uploads/05bec858-f1cc-43ad-9d2c-08d06c0abf8c.png"
                alt="HEU Coin - Hobson Energy Units Explained"
                className="w-full h-full object-cover"
              />
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
                className="rounded-lg"
                src="https://player.vimeo.com/video/1113482209?autoplay=1&muted=1&byline=0&portrait=0&responsive=1"
                title="HEU Coin - Hobson Energy Units Explained"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                style={{
                  width: '100%',
                  height: '100%',
                  minWidth: '800px',
                  minHeight: '450px'
                }}
                id="pricing-hero-video-iframe"
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};