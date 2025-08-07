import { memo, useState, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  placeholder?: string;
}

export const LazyImage = memo<LazyImageProps>(({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  sizes = '100vw',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmNmY4ZmEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNlNWU3ZWIiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOWNhM2FmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TG9hZGluZy4uLjwvdGV4dD48L3N2Zz4='
}) => {
  const [imageSrc, setImageSrc] = useState(priority ? src : placeholder);
  const [isLoaded, setIsLoaded] = useState(priority);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!priority && !isLoaded) {
      const img = new Image();
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
      };
      img.onerror = () => {
        setIsError(true);
      };
      
      // Add a small delay to prevent jarring immediate loads
      const timer = setTimeout(() => {
        img.src = src;
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [src, priority, isLoaded]);

  if (isError) {
    return (
      <div 
        className={`${className} bg-muted flex items-center justify-center`}
        style={{
          aspectRatio: width && height ? `${width}/${height}` : undefined,
          width: width || '100%',
          height: height || 200,
        }}
      >
        <span className="text-muted-foreground text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-70'} transition-all duration-500 ease-out`}
      loading={priority ? 'eager' : 'lazy'}
      {...(priority && { fetchpriority: 'high' })}
      decoding="async"
      width={width}
      height={height}
      sizes={sizes}
      style={{
        aspectRatio: width && height ? `${width}/${height}` : undefined,
        contentVisibility: 'auto',
        containIntrinsicSize: width && height ? `${width}px ${height}px` : '300px 200px',
        filter: isLoaded ? 'none' : 'blur(2px)',
        transform: isLoaded ? 'scale(1)' : 'scale(1.05)',
      }}
      onLoad={() => {
        if (priority) setIsLoaded(true);
      }}
      onError={() => setIsError(true)}
    />
  );
});

LazyImage.displayName = 'LazyImage';