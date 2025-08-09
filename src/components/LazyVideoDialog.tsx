import { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { OptimizedImage } from "@/components/OptimizedImage";

interface LazyVideoDialogProps {
  thumbnailSrc: string;
  thumbnailAlt: string;
  videoId: string;
  title: string;
  description?: string;
  className?: string;
}

export const LazyVideoDialog = ({ 
  thumbnailSrc, 
  thumbnailAlt, 
  videoId, 
  title, 
  description,
  className = ""
}: LazyVideoDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const handleThumbnailClick = () => {
    setIsOpen(true);
    // Only load video when dialog opens
    if (!videoLoaded) {
      setVideoLoaded(true);
    }
  };

  return (
    <>
      <div 
        className={`cursor-pointer transition-transform duration-300 hover:scale-105 ${className}`}
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
          src={thumbnailSrc} 
          alt={thumbnailAlt}
          className="w-full h-full object-cover object-center transition-opacity duration-300 hover:opacity-90" 
          width={506} 
          height={338}
          loading="lazy"
          fetchPriority="low"
        />
      </div>
      
      {description && (
        <p className="text-center text-lg text-muted-foreground mt-4">{description}</p>
      )}
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl p-0 border-0">
          <div className="aspect-video">
            {videoLoaded ? (
              <iframe 
                className="w-full h-full rounded-lg" 
                src={`https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1`}
                title={title}
                frameBorder="0" 
                allow="autoplay; fullscreen; picture-in-picture" 
                allowFullScreen 
                loading="lazy"
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