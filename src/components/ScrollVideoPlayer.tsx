import { useState, useRef, useEffect } from 'react';

interface ScrollVideoPlayerProps {
  videoId: string;
  title?: string;
  description?: string;
}

export const ScrollVideoPlayer = ({ videoId, title = "Video", description = "Watch video" }: ScrollVideoPlayerProps) => {
  const [isInView, setIsInView] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          } else {
            setIsInView(false);
          }
        });
      },
      {
        threshold: 0.4, // Trigger when 40% of the video is visible
        rootMargin: '-50px 0px -50px 0px'
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
  }, []);

  return (
    <div className="flex justify-center">
      <a 
        href="https://vimeo.com/1108110494?share=copy#t=0"
        target="_blank"
        rel="noopener noreferrer"
        className="cursor-pointer"
      >
        <div
          ref={videoRef}
          className={`relative w-80 h-52 bg-black rounded-lg overflow-hidden shadow-lg border-[14px] border-white transition-all duration-700 transform ${
            isInView ? 'scale-110 shadow-2xl' : 'scale-95 opacity-70'
          }`}
        >
          <img
            src="/lovable-uploads/a813c202-a3e2-4e51-9f8d-c2731329b446.png"
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      </a>
    </div>
  );
};