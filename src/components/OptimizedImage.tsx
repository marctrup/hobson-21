import { memo } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  fetchPriority?: 'high' | 'low' | 'auto';
  loading?: 'eager' | 'lazy';
}

export const OptimizedImage = memo<OptimizedImageProps>(({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  sizes = '100vw',
  fetchPriority = 'auto',
  loading
}) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading || (priority ? 'eager' : 'lazy')}
      {...(fetchPriority !== 'auto' && { fetchpriority: fetchPriority })}
      decoding="async"
      width={width}
      height={height}
      sizes={sizes}
      style={{
        aspectRatio: width && height ? `${width}/${height}` : undefined,
      }}
    />
  );
});

OptimizedImage.displayName = 'OptimizedImage';