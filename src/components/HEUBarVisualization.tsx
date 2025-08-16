import React from 'react';

interface HEUBarVisualizationProps {
  totalHEUs?: number;
  usedHEUs?: number;
  className?: string;
}

export const HEUBarVisualization: React.FC<HEUBarVisualizationProps> = ({
  totalHEUs = 700,
  usedHEUs = 420,
  className = ""
}) => {
  const remainingHEUs = totalHEUs - usedHEUs;
  const usedPercentage = (usedHEUs / totalHEUs) * 100;
  const remainingPercentage = (remainingHEUs / totalHEUs) * 100;

  return (
    <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">HEU Usage This Period</span>
          <span className="font-medium text-foreground">
            {usedHEUs} / {totalHEUs} HEUs used
          </span>
        </div>
        
        {/* HEU Bar */}
        <div className="relative h-8 bg-muted rounded-full overflow-hidden">
          {/* Used HEUs (Grey) */}
          <div 
            className="absolute left-0 top-0 h-full bg-gray-400 transition-all duration-300 ease-out"
            style={{ width: `${usedPercentage}%` }}
          />
          
          {/* Remaining HEUs (Blue) */}
          <div 
            className="absolute right-0 top-0 h-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${remainingPercentage}%` }}
          />
          
          {/* Labels inside the bar */}
          <div className="absolute inset-0 flex items-center justify-between px-3 text-xs font-medium text-white">
            {usedPercentage > 15 && (
              <span className="text-white">Used: {usedHEUs}</span>
            )}
            {remainingPercentage > 15 && (
              <span className="text-white">Remaining: {remainingHEUs}</span>
            )}
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded-sm"></div>
            <span className="text-muted-foreground">Used HEUs</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
            <span className="text-muted-foreground">Remaining HEUs</span>
          </div>
        </div>
        
        {/* Additional Info */}
        <div className="pt-2 border-t border-border">
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="font-medium text-foreground">{usedHEUs}</div>
              <div className="text-muted-foreground">Used</div>
            </div>
            <div>
              <div className="font-medium text-foreground">{remainingHEUs}</div>
              <div className="text-muted-foreground">Remaining</div>
            </div>
            <div>
              <div className="font-medium text-foreground">{totalHEUs}</div>
              <div className="text-muted-foreground">Total Monthly</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};