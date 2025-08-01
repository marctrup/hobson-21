import { FC } from 'react';

interface LoadingSkeletonProps {
  className?: string;
  height?: string;
  rows?: number;
}

export const LoadingSkeleton: FC<LoadingSkeletonProps> = ({ 
  className = '', 
  height = 'h-4',
  rows = 1 
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: rows }).map((_, index) => (
        <div 
          key={index}
          className={`bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] animate-[shimmer_1.5s_infinite] ${height} rounded mb-2`}
        />
      ))}
    </div>
  );
};

export const SectionSkeleton: FC = () => (
  <div className="container mx-auto px-4 py-16">
    <div className="text-center mb-12">
      <LoadingSkeleton height="h-8" className="w-1/2 mx-auto mb-4" />
      <LoadingSkeleton height="h-4" rows={2} className="w-3/4 mx-auto" />
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="space-y-4">
          <LoadingSkeleton height="h-48" />
          <LoadingSkeleton height="h-6" />
          <LoadingSkeleton height="h-4" rows={3} />
        </div>
      ))}
    </div>
  </div>
);