import { Suspense, ReactNode } from 'react';

interface LazyComponentProps {
  children: ReactNode;
  fallback?: ReactNode;
  threshold?: number;
}

const LazyComponent = ({ 
  children, 
  fallback = <div className="animate-pulse bg-muted h-32 rounded-lg" />,
  threshold = 0.1 
}: LazyComponentProps) => {
  return (
    <Suspense fallback={fallback}>
      <div style={{ contentVisibility: 'auto', containIntrinsicSize: '300px' }}>
        {children}
      </div>
    </Suspense>
  );
};

export { LazyComponent };