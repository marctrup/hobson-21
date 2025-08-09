import { useState, useEffect, useRef } from 'react';
import { ScrollVideoPlayer } from "@/components/ScrollVideoPlayer";

interface LazyScrollVideoProps {
  videoId: string;
  title: string;
  description: string;
  className?: string;
  style?: React.CSSProperties;
}

export const LazyScrollVideo = ({ 
  videoId, 
  title, 
  description, 
  className = "",
  style = {}
}: LazyScrollVideoProps) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px', // Start loading 100px before element comes into view
        threshold: 0.1
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={className} style={style}>
      {shouldLoad ? (
        <ScrollVideoPlayer 
          videoId={videoId} 
          title={title} 
          description={description} 
        />
      ) : (
        <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-0 h-0 border-l-[8px] border-l-primary border-y-[6px] border-y-transparent ml-1"></div>
            </div>
            <p className="text-muted-foreground">Video will load when you scroll down</p>
          </div>
        </div>
      )}
    </div>
  );
};