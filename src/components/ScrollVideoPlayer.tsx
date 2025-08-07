import { useState, useRef, useEffect } from 'react';

interface ScrollVideoPlayerProps {
  videoId: string;
  title?: string;
  description?: string;
}

export const ScrollVideoPlayer = ({ videoId, title = "Video", description = "Watch video" }: ScrollVideoPlayerProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex justify-center">
      <a 
        href="https://vimeo.com/1108110494?share=copy#t=0"
        target="_blank"
        rel="noopener noreferrer"
        className="cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`relative w-80 h-52 bg-black rounded-lg overflow-hidden shadow-lg border-[14px] border-white transition-all duration-700 transform ${
            isHovered ? 'scale-110 shadow-2xl' : 'scale-100 opacity-100'
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