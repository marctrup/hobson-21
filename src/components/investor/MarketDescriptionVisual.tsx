import { Card } from "@/components/ui/card";
import { Globe, Building2, Users, TrendingUp, Target, FileText } from "lucide-react";

export const MarketDescriptionVisual = () => {
  return (
    <div className="space-y-6">
      {/* Introduction */}
      <Card className="p-6 bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-purple-500/20">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
            <Globe className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Market Description</h3>
            <p className="text-slate-400 text-sm mt-1">Property Document Management Market Analysis</p>
          </div>
        </div>
        <p className="text-slate-300 leading-relaxed">
          Content for Market Description will be provided. This section will cover the market landscape, 
          size, segments, and growth dynamics for property document management solutions.
        </p>
      </Card>

      {/* Placeholder Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5 bg-slate-800/40 border-slate-700/50">
          <div className="flex items-center gap-3 mb-3">
            <Building2 className="w-5 h-5 text-blue-400" />
            <h4 className="font-semibold text-white">Market Size</h4>
          </div>
          <p className="text-sm text-slate-400">Market sizing data to be provided</p>
        </Card>

        <Card className="p-5 bg-slate-800/40 border-slate-700/50">
          <div className="flex items-center gap-3 mb-3">
            <Users className="w-5 h-5 text-green-400" />
            <h4 className="font-semibold text-white">Target Segments</h4>
          </div>
          <p className="text-sm text-slate-400">Segment breakdown to be provided</p>
        </Card>

        <Card className="p-5 bg-slate-800/40 border-slate-700/50">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <h4 className="font-semibold text-white">Growth Drivers</h4>
          </div>
          <p className="text-sm text-slate-400">Growth analysis to be provided</p>
        </Card>

        <Card className="p-5 bg-slate-800/40 border-slate-700/50">
          <div className="flex items-center gap-3 mb-3">
            <Target className="w-5 h-5 text-purple-400" />
            <h4 className="font-semibold text-white">Competitive Position</h4>
          </div>
          <p className="text-sm text-slate-400">Positioning data to be provided</p>
        </Card>
      </div>

      {/* Note */}
      <Card className="p-4 bg-amber-500/10 border-amber-500/20">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-200">
            Awaiting content for Market Description section. Please provide the detailed market analysis to populate this tab.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default MarketDescriptionVisual;
