import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface ScrollVideoPlayerProps {
  videoId: string;
  title?: string;
  description?: string;
}

export const ScrollVideoPlayer = ({ videoId, title = "Video", description = "Watch video" }: ScrollVideoPlayerProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);

  return (
    <div className="flex justify-center">
      <Dialog 
        open={videoDialogOpen} 
        onOpenChange={setVideoDialogOpen}
      >
        <DialogTrigger asChild>
          <div
            className={`cursor-pointer relative w-80 h-52 bg-black rounded-lg overflow-hidden shadow-lg transition-all duration-700 transform ${
              isHovered ? 'scale-110 shadow-2xl' : 'scale-100 opacity-100'
            }`}
            style={{ border: '5px solid white' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <img
              src="/lovable-uploads/771865ab-9a5c-4d60-b7bf-f3e3be574261.png"
              alt={title}
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
        >
          <button 
            onClick={() => setVideoDialogOpen(false)}
            className="absolute right-4 top-4 z-[60] rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-background border border-border p-1"
            aria-label="Close video"
          >
            <X className="h-4 w-4" />
          </button>
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <DialogDescription className="sr-only">
            {description}
          </DialogDescription>
          {videoDialogOpen && (
            <iframe
              className="rounded-lg"
              src={`https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&byline=0&portrait=0`}
              title={title}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              width="480"
              height="640"
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh'
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};