import { useState, useRef, useEffect } from 'react';

interface ScrollVideoPlayerProps {
  videoId: string;
  title?: string;
  description?: string;
}

export const ScrollVideoPlayer = ({ videoId, title = "Video", description = "Watch video" }: ScrollVideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isPlaying) {
            setIsInView(true);
            setIsPlaying(true);
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of the video is visible
        rootMargin: '0px'
      }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <div className="flex justify-center">
      <div
        ref={videoRef}
        className={`relative w-80 h-52 bg-black rounded-lg overflow-hidden shadow-lg transition-all duration-500 ${
          isInView ? 'animate-scale-in' : ''
        }`}
      >
        {isPlaying ? (
          <iframe
            className="w-full h-full"
            src={`https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&byline=0&portrait=0&responsive=0&background=1`}
            title={title}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-12 h-12 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm">{description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};