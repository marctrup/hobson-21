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
        className={`relative w-80 h-52 bg-black rounded-lg overflow-hidden shadow-lg border-[14px] border-white transition-all duration-500 ${
          isInView ? 'animate-scale-in' : ''
        }`}
      >
        <img
          src="/lovable-uploads/a813c202-a3e2-4e51-9f8d-c2731329b446.png"
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};