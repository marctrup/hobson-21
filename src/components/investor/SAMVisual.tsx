import React from "react";
import { Globe, MapPin, TrendingUp } from "lucide-react";

export const SAMVisual = () => {
  return (
    <div className="w-full py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* UK SAM Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-8">
          <div className="absolute top-4 right-4 opacity-10">
            <MapPin className="w-24 h-24 text-primary" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">UK Market</p>
                <p className="text-xs text-muted-foreground">Serviceable Available Market</p>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                £917M
              </p>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• 65% of TAM motivated to adopt AI</p>
              <p>• 152,880 ready-to-adopt businesses</p>
              <p>• £6,000 annual efficiency saving each</p>
            </div>
          </div>
        </div>

        {/* Global SAM Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 p-8">
          <div className="absolute top-4 right-4 opacity-10">
            <Globe className="w-24 h-24 text-amber-500" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Globe className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Global Market</p>
                <p className="text-xs text-muted-foreground">Serviceable Available Market</p>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
                £101B
              </p>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• 65% global adoption readiness</p>
              <p>• Consistent with PropTech adoption rates</p>
              <p>• Traditional sectors AI readiness</p>
            </div>
          </div>
        </div>
      </div>

      {/* Source and methodology */}
      <div className="mt-8 p-4 rounded-xl bg-muted/50 border">
        <p className="text-center text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">65% Adoption Rate Source:</span>{" "}
          <a 
            href="https://www.gov.uk/government/collections/business-population-estimates" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Department for Business, Energy & Industrial Strategy (BEIS) / ONS
          </a>
          {" "}— consistent with PropTech and operational AI adoption rates in traditional sectors (Deloitte, PwC, McKinsey).
        </p>
      </div>
    </div>
  );
};

export default SAMVisual;
