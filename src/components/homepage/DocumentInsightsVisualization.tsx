import { FileText, ArrowRight, Brain, CheckCircle } from "lucide-react";

export const DocumentInsightsVisualization = () => {
  return (
    <div className="relative bg-gradient-to-br from-primary/5 to-secondary/10 rounded-2xl p-8 border border-primary/10">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">From Documents to Instant Insights</h3>
        <p className="text-sm text-muted-foreground">Watch how Hobson transforms your property data</p>
      </div>

      {/* Document Sources */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/80 rounded-lg p-4 border border-primary/20 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Lease Agreement</span>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="h-2 bg-primary/20 rounded w-full"></div>
            <div className="h-2 bg-primary/20 rounded w-3/4"></div>
            <div className="h-2 bg-primary/20 rounded w-1/2"></div>
          </div>
        </div>

        <div className="bg-white/80 rounded-lg p-4 border border-primary/20 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Deed of Variation</span>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="h-2 bg-primary/20 rounded w-full"></div>
            <div className="h-2 bg-primary/20 rounded w-2/3"></div>
            <div className="h-2 bg-primary/20 rounded w-4/5"></div>
          </div>
        </div>

        <div className="bg-white/80 rounded-lg p-4 border border-primary/20 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Market Analysis</span>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="h-2 bg-primary/20 rounded w-5/6"></div>
            <div className="h-2 bg-primary/20 rounded w-full"></div>
            <div className="h-2 bg-primary/20 rounded w-3/5"></div>
          </div>
        </div>

        <div className="bg-white/80 rounded-lg p-4 border border-primary/20 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Financial Data</span>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="h-2 bg-primary/20 rounded w-3/4"></div>
            <div className="h-2 bg-primary/20 rounded w-full"></div>
            <div className="h-2 bg-primary/20 rounded w-2/5"></div>
          </div>
        </div>
      </div>

      {/* Processing Flow */}
      <div className="flex items-center justify-center mb-6">
        <ArrowRight className="w-6 h-6 text-primary animate-pulse" />
        <Brain className="w-8 h-8 text-primary mx-4" />
        <ArrowRight className="w-6 h-6 text-primary animate-pulse" />
      </div>

      {/* AI Analysis Output */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 border border-primary/20">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground mb-2">Your Question: "What's the rental yield for Building A?"</p>
            <div className="bg-white/80 rounded-lg p-4 border border-primary/20">
              <p className="text-sm text-foreground mb-3">
                <strong>Building A has a rental yield of 6.2%</strong> based on annual rental income of £48,000 and property value of £775,000.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>Source: Lease Agreement (Page 3, Section 2.1)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>Source: Property Valuation Report (Page 1)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>Source: Financial Statement (Q3 2024)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};