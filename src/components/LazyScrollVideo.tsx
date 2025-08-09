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
  // Load immediately instead of lazy loading
  const shouldLoad = true;

  return (
    <div className={className} style={style}>
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