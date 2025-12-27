import { Award, Target, Shield, Eye, Sparkles, FileText } from "lucide-react";

export const BrandIntegrityVisual = () => {
  return (
    <div className="space-y-6">
      {/* Introduction */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-purple-500/10 p-6 border border-purple-200/50 dark:border-purple-800/30">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Brand Integrity, Perception & Positioning</h3>
              <p className="text-muted-foreground text-sm mt-1">Building Trust Through Consistent Brand Experience</p>
            </div>
          </div>
          <p className="text-foreground leading-relaxed">
            Content for Brand Integrity, Perception & Positioning will be provided. This section will cover 
            how Hobson builds and maintains brand trust, market perception, and strategic positioning.
          </p>
        </div>
      </div>

      {/* Placeholder Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 p-5 border border-blue-200/50 dark:border-blue-800/30">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h4 className="font-semibold text-foreground">Brand Integrity</h4>
          </div>
          <p className="text-sm text-muted-foreground">Brand integrity principles to be provided</p>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 p-5 border border-emerald-200/50 dark:border-emerald-800/30">
          <div className="flex items-center gap-3 mb-3">
            <Eye className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h4 className="font-semibold text-foreground">Market Perception</h4>
          </div>
          <p className="text-sm text-muted-foreground">Perception strategy to be provided</p>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/10 p-5 border border-amber-200/50 dark:border-amber-800/30">
          <div className="flex items-center gap-3 mb-3">
            <Target className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h4 className="font-semibold text-foreground">Strategic Positioning</h4>
          </div>
          <p className="text-sm text-muted-foreground">Positioning framework to be provided</p>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-red-500/10 to-red-600/10 p-5 border border-red-200/50 dark:border-red-800/30">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="w-5 h-5 text-red-600 dark:text-red-400" />
            <h4 className="font-semibold text-foreground">Differentiation</h4>
          </div>
          <p className="text-sm text-muted-foreground">Differentiation strategy to be provided</p>
        </div>
      </div>

      {/* Note */}
      <div className="bg-amber-50/50 dark:bg-amber-950/20 rounded-xl p-4 border border-amber-200/50 dark:border-amber-800/30">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-foreground">
            Awaiting content for Brand Integrity, Perception & Positioning section. Please provide the detailed brand strategy to populate this tab.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BrandIntegrityVisual;
