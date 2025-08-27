import { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { OptimizedImage } from "@/components/OptimizedImage";

export const HomepageGeorgiaVideo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const handleThumbnailClick = () => {
    setIsOpen(true);
    if (!videoLoaded) {
      setVideoLoaded(true);
    }
  };

  return (
    <>
      <div 
        className="cursor-pointer transition-transform duration-300 hover:scale-105"
        onClick={handleThumbnailClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleThumbnailClick();
          }
        }}
      >
        <OptimizedImage 
          src="/lovable-uploads/b21f796e-20aa-4a56-ad42-9d8e9c3189ba.png" 
          alt="Georgia - Hobson AI Assistant"
          className="w-full h-full object-cover object-center transition-opacity duration-300 hover:opacity-90" 
          width={506} 
          height={338}
          loading="eager"
          fetchPriority="high"
        />
      </div>
      
      <p className="text-center text-lg text-muted-foreground mt-4">Need more information? Meet Georgia</p>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl p-0 border-0" id="homepage-georgia-video-dialog">
          <div className="aspect-video">
            {videoLoaded ? (
              <iframe 
                className="w-full h-full rounded-lg" 
                src="https://player.vimeo.com/video/1108183128?autoplay=1&muted=1"
                title="Meet Georgia - Property AI Assistant"
                frameBorder="0" 
                allow="autoplay; fullscreen; picture-in-picture" 
                allowFullScreen 
                loading="lazy"
                id="homepage-georgia-video-iframe"
              />
            ) : (
              <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                <div className="text-muted-foreground">Loading video...</div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};