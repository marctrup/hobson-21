import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X } from "lucide-react";

export const HomepagePilotVideoHomeowner = () => {
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
    <div className="container mx-auto px-4 mb-5" style={{ marginTop: '-40px' }}>
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
              style={{ border: '10px solid #f0f0f0', maxWidth: '640px' }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              id="homepage-pilot-video-container-homeowner"
            >
              <img
                src="/lovable-uploads/a1a372bb-1649-43e9-ad51-c41d6fc762a1.png"
                alt="Hobson AI Pilot Program"
                className="w-full h-full object-cover"
                loading="lazy"
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
            id="homepage-pilot-video-dialog-homeowner"
          >
            <button 
              onClick={() => setVideoDialogOpen(false)}
              className="absolute right-4 top-4 z-[60] rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-background border border-border p-1"
              aria-label="Close video"
            >
              <X className="h-4 w-4" />
            </button>
            <DialogTitle className="sr-only">Hobson AI Pilot Program</DialogTitle>
            <DialogDescription className="sr-only">
              Learn more about our pilot program
            </DialogDescription>
            {videoDialogOpen && (
              <iframe
                className="rounded-lg"
                src="https://player.vimeo.com/video/1108176938?autoplay=1&muted=1&byline=0&portrait=0&responsive=1"
                title="Hobson AI Pilot Program"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                style={{
                  width: '100%',
                  height: '100%',
                  minWidth: '640px',
                  minHeight: '360px'
                }}
                id="homepage-pilot-video-iframe-homeowner"
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="text-center mt-4">
        <p className="text-lg text-muted-foreground">Want to know more about the pilot?</p>
      </div>
    </div>
  );
};