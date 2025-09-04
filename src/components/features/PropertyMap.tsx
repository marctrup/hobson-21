import { Badge } from "@/components/ui/badge";
import { Map } from "lucide-react";
import React, { memo } from "react";

const PropertyMap = memo(() => {
  return (
    <div className="w-full lg:w-1/2 relative bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900/50 dark:to-blue-900/20 overflow-hidden">
      {/* Map Header */}
      <div className="absolute top-4 left-4 right-4 z-20">
        <div className="flex items-center justify-between bg-background/95 backdrop-blur-sm rounded-lg p-3 border border-primary/10 shadow-lg">
          <div className="flex items-center gap-2">
            <Map className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Home Map</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">London</Badge>
            <div className="flex gap-1">
              <button className="w-6 h-6 bg-background rounded border text-xs">+</button>
              <button className="w-6 h-6 bg-background rounded border text-xs">-</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Street-Level London Map with Dense Grid */}
      <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800">
        {/* Dense Grid - Horizontal lines every 5% */}
        {Array.from({ length: 21 }, (_, i) => i * 5).map((top) => (
          <div 
            key={`h-${top}`} 
            className="absolute left-0 w-full h-0.5 bg-gray-300 dark:bg-gray-600"
            style={{ top: `${top}%` }}
          ></div>
        ))}
        
        {/* Dense Grid - Vertical lines every 5% */}
        {Array.from({ length: 21 }, (_, i) => i * 5).map((left) => (
          <div 
            key={`v-${left}`} 
            className="absolute top-0 h-full w-0.5 bg-gray-300 dark:bg-gray-600"
            style={{ left: `${left}%` }}
          ></div>
        ))}
        
        {/* Major Streets - Thicker lines */}
        {[20, 35, 50, 65, 80].map((top) => (
          <div 
            key={`major-h-${top}`} 
            className="absolute left-0 w-full h-1 bg-white dark:bg-gray-500"
            style={{ top: `${top}%` }}
          ></div>
        ))}
        {[15, 30, 45, 60, 75].map((left) => (
          <div 
            key={`major-v-${left}`} 
            className="absolute top-0 h-full w-1 bg-white dark:bg-gray-500"
            style={{ left: `${left}%` }}
          ></div>
        ))}
        
        {/* Parks and Green Spaces */}
        <div className="absolute bg-green-300 dark:bg-green-700 rounded-sm" style={{ top: '15%', left: '18%', width: '15%', height: '12%' }}>
          <span className="text-xs p-1 text-green-800 dark:text-green-200">Hyde Park</span>
        </div>
        <div className="absolute bg-green-300 dark:bg-green-700 rounded-full" style={{ top: '10%', left: '38%', width: '12%', height: '10%' }}>
          <span className="text-xs p-1 text-green-800 dark:text-green-200">Regent's Park</span>
        </div>
        
        {/* Building Blocks */}
        {[
          { top: 22, left: 22, w: 6, h: 4 },
          { top: 26, left: 28, w: 8, h: 6 },
          { top: 32, left: 32, w: 5, h: 8 },
          { top: 38, left: 42, w: 10, h: 5 },
          { top: 42, left: 58, w: 7, h: 7 },
          { top: 62, left: 35, w: 6, h: 6 },
          { top: 66, left: 48, w: 8, h: 4 },
          { top: 72, left: 25, w: 5, h: 5 }
        ].map((block, i) => (
          <div 
            key={i} 
            className={`absolute bg-gray-300 dark:bg-gray-600 border border-gray-400`}
            style={{
              top: `${block.top}%`,
              left: `${block.left}%`,
              width: `${block.w * 4}px`,
              height: `${block.h * 4}px`
            }}
          ></div>
        ))}
        
        {/* Street Names */}
        <div className="absolute text-xs text-gray-700 dark:text-gray-300 bg-white/80 dark:bg-gray-800/80 px-1 rounded transform -rotate-90" style={{ top: '28%', left: '5%' }}>Oxford St</div>
        <div className="absolute text-xs text-gray-700 dark:text-gray-300 bg-white/80 dark:bg-gray-800/80 px-1 rounded transform -rotate-90" style={{ top: '43%', left: '5%' }}>Strand</div>
        <div className="absolute text-xs text-gray-700 dark:text-gray-300 bg-white/80 dark:bg-gray-800/80 px-1 rounded" style={{ top: '8%', left: '23%' }}>Regent St</div>
        <div className="absolute text-xs text-gray-700 dark:text-gray-300 bg-white/80 dark:bg-gray-800/80 px-1 rounded" style={{ top: '8%', left: '38%' }}>TCR</div>
        <div className="absolute text-xs text-gray-700 dark:text-gray-300 bg-blue-200/80 dark:bg-blue-800/80 px-1 rounded" style={{ top: '48%', left: '85%' }}>Thames</div>
        
        {/* Underground Stations */}
        {[
          { top: 30, left: 27, name: "Oxford Circus" },
          { top: 45, left: 42, name: "Covent Garden" },
          { top: 35, left: 58, name: "Holborn" }
        ].map((station, i) => (
          <div key={i} className="absolute w-2 h-2 bg-red-500 rounded-full border border-white" style={{ top: `${station.top}%`, left: `${station.left}%` }}>
            <div className="text-xs absolute -bottom-4 -left-6 text-gray-700 dark:text-gray-300 bg-white/80 dark:bg-gray-800/80 px-1 rounded text-center">{station.name}</div>
          </div>
        ))}
        
        {/* Property Markers */}
        {[
          { top: 48, left: 60, name: "Home", delay: 300 },
          { top: 68, left: 45, name: "Southwark Units", delay: 1000 }
        ].map((marker, i) => (
          <div key={i} className="absolute flex flex-col items-center z-20" style={{ top: `${marker.top}%`, left: `${marker.left}%` }}>
            <div 
              className="w-4 h-4 bg-primary rounded-full animate-pulse shadow-lg border-2 border-white"
              style={{ animationDelay: `${marker.delay}ms` }}
            ></div>
            <span className="text-xs bg-background/95 px-2 py-1 rounded mt-1 shadow-lg font-medium">{marker.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

PropertyMap.displayName = 'PropertyMap';

export default PropertyMap;