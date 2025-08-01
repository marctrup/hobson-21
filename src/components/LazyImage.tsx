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
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+'
}) => {
  const [imageSrc, setImageSrc] = useState(priority ? src : placeholder);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!priority) {
      const img = new Image();
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
      };
      img.src = src;
    }
  }, [src, priority]);

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={`${className} ${isLoaded || priority ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      width={width}
      height={height}
      sizes={sizes}
      style={{
        aspectRatio: width && height ? `${width}/${height}` : undefined,
        contentVisibility: 'auto',
        containIntrinsicSize: width && height ? `${width}px ${height}px` : '300px 200px'
      }}
    />
  );
});

LazyImage.displayName = 'LazyImage';