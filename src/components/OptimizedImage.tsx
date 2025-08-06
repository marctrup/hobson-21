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
      loading={priority ? 'eager' : (loading || 'lazy')}
      decoding="async"
      width={width}
      height={height}
      fetchPriority={fetchPriority}
      sizes={sizes}
      style={{
        aspectRatio: width && height ? `${width}/${height}` : undefined,
        contentVisibility: 'auto',
        containIntrinsicSize: width && height ? `${width}px ${height}px` : '400px 300px'
      }}
    />
  );
});

OptimizedImage.displayName = 'OptimizedImage';