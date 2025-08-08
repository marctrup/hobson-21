import { FileText, ArrowRight, Brain, CheckCircle, Clock, AlertTriangle } from "lucide-react";

export const PropertyFlowVisualization = () => {
  return (
    <div className="relative bg-gradient-to-br from-primary/5 to-secondary/10 rounded-2xl p-8 border border-primary/10 shadow-xl shadow-primary/15">
      {/* Question at the top */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-foreground mb-2">
          "When is my next rent review?"
        </h3>
      </div>

      {/* Three-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Column 1: Manual Process */}
        <div className="space-y-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-200 rounded-full text-red-700 text-sm font-medium mb-4">
              <Clock className="w-4 h-4" />
              Manual Process
            </div>
          </div>

          {/* Process steps */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-border shadow-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">Search through files</span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground mx-auto" />
            
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-border shadow-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">Manual extraction</span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground mx-auto" />
            
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-border shadow-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">Cross-reference data</span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground mx-auto" />
            
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-600 font-medium">Prone to errors</span>
            </div>
          </div>

          {/* Document count */}
          <div className="bg-muted/30 rounded-lg p-4 text-center">
            <div className="text-xs text-muted-foreground space-y-1">
              <div>35 documents to review</div>
              <div className="text-red-600 font-medium">2-3 hours needed</div>
            </div>
          </div>
        </div>

        {/* Column 2: Document Pile */}
        <div className="flex flex-col items-center space-y-4">
          <div className="text-center">
            <div className="text-sm font-medium text-muted-foreground mb-4">Your Documents</div>
          </div>

          {/* Stacked documents visual */}
          <div className="relative">
            {/* Background stack effect */}
            <div className="absolute inset-0 bg-white rounded-lg border border-border transform rotate-2 translate-x-1 translate-y-1 opacity-50"></div>
            <div className="absolute inset-0 bg-white rounded-lg border border-border transform -rotate-1 -translate-x-1 opacity-75"></div>
            
            {/* Main document stack */}
            <div className="relative bg-white rounded-lg border border-primary/20 p-6 w-32 h-40 shadow-lg">
              <div className="space-y-2">
                <div className="h-2 bg-primary/20 rounded w-full"></div>
                <div className="h-2 bg-primary/20 rounded w-3/4"></div>
                <div className="h-2 bg-primary/20 rounded w-1/2"></div>
                <div className="h-1 bg-transparent"></div>
                <div className="h-2 bg-primary/20 rounded w-5/6"></div>
                <div className="h-2 bg-primary/20 rounded w-2/3"></div>
                <div className="h-1 bg-transparent"></div>
                <div className="h-2 bg-primary/20 rounded w-4/5"></div>
              </div>
              
              {/* Document labels */}
              <div className="absolute -bottom-8 left-0 right-0 text-center">
                <div className="text-xs text-muted-foreground space-y-0.5">
                  <div>20 × Leases</div>
                  <div>12 × Variations</div>
                  <div>3 × Others</div>
                </div>
              </div>
            </div>
          </div>

          {/* Arrow pointing to AI */}
          <div className="flex items-center justify-center pt-4">
            <ArrowRight className="w-6 h-6 text-primary animate-pulse" />
          </div>
        </div>

        {/* Column 3: AI Solution */}
        <div className="space-y-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-full text-green-700 text-sm font-medium mb-4">
              <Brain className="w-4 h-4" />
              Hobson AI
            </div>
          </div>

          {/* AI Processing indicator */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Instant result */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200 shadow-lg">
            <div className="text-center mb-4">
              <div className="text-lg font-bold text-green-800 mb-2">
                14 September 2026
              </div>
              <div className="text-sm text-green-700">
                Next rent review date
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-2 text-xs">
                <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-green-700">Lease Agreement (Page 5, Clause 3.2)</span>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-green-700">Deed of Variation (Page 2, Clause 1.1)</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-green-200">
              <div className="text-center text-xs text-green-600 font-medium">
                ⚡ Answered in 3 seconds
              </div>
            </div>
          </div>

          {/* Bottom tagline */}
          <div className="text-center text-xs text-muted-foreground space-y-1">
            <div>Reads every document</div>
            <div>Extracts what matters</div>
            <div className="font-medium text-primary">Answers instantly</div>
          </div>
        </div>
      </div>
    </div>
  );
};