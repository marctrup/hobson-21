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
  // Generate WebP alternative if available
  const webpSrc = src.includes('.png') || src.includes('.jpg') || src.includes('.jpeg') 
    ? src.replace(/\.(png|jpg|jpeg)$/i, '.webp') 
    : src;
  
  return (
    <picture>
      {/* Modern format fallback */}
      {webpSrc !== src && (
        <source srcSet={webpSrc} type="image/webp" />
      )}
      <img
        src={src}
        alt={alt}
        className={className}
        loading={priority ? 'eager' : (loading || 'lazy')}
        decoding="async"
        width={width}
        height={height}
        {...(fetchPriority !== 'auto' && { fetchpriority: fetchPriority })}
        sizes={sizes}
        style={{
          aspectRatio: width && height ? `${width}/${height}` : undefined,
          contentVisibility: 'auto',
          containIntrinsicSize: width && height ? `${width}px ${height}px` : '400px 300px',
          objectFit: 'cover',
          transition: 'opacity 0.2s ease'
        }}
      />
    </picture>
  );
});

OptimizedImage.displayName = 'OptimizedImage';