import { memo } from 'react';

interface WebPImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  loading?: 'eager' | 'lazy';
}

export const WebPImage = memo<WebPImageProps>(({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  sizes = '100vw',
  loading
}) => {
  // Create WebP version of the image URL if it's a PNG/JPG
  const webpSrc = src.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  
  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading || (priority ? 'eager' : 'lazy')}
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
    </picture>
  );
});

WebPImage.displayName = 'WebPImage';