import { FileText, ArrowRight, Brain, CheckCircle, Users, FolderOpen, Search, RotateCcw, UserCheck } from "lucide-react";

export const PropertyManagementVisualization = () => {
  return (
    <div className="relative bg-gradient-to-br from-primary/5 to-secondary/10 rounded-2xl p-8 border border-primary/10 shadow-xl shadow-primary/15">
      {/* Question Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-normal text-foreground mb-2">When is the next rent review?</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center relative">
        {/* Left: The Pain (Today's World) */}
        <div className="text-center">
          <h4 className="text-sm font-bold text-muted-foreground mb-4 uppercase tracking-wide">Today's Process</h4>
          
          {/* Circular Process */}
          <div className="relative w-36 h-36 mx-auto mb-4">
            <div className="absolute inset-0 border-2 border-dashed border-purple-300 rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>
            
            {/* Process Icons */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
              <div className="bg-background border border-border rounded-full p-2">
                <UserCheck className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            
            <div className="absolute right-0 top-1/2 transform translate-x-2 -translate-y-1/2">
              <div className="bg-background border border-border rounded-full p-2">
                <FolderOpen className="w-4 h-4 text-orange-600" />
              </div>
            </div>
            
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2">
              <div className="bg-background border border-border rounded-full p-2">
                <Search className="w-4 h-4 text-green-600" />
              </div>
            </div>
            
            <div className="absolute left-0 top-1/2 transform -translate-x-2 -translate-y-1/2">
              <div className="bg-background border border-border rounded-full p-2">
                <RotateCcw className="w-4 h-4 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center justify-center gap-1">
              <span className="font-bold">Manual extraction</span>
              <ArrowRight className="w-3 h-3" />
              <span className="font-bold">Store in system</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <span className="font-bold">Search</span>
              <ArrowRight className="w-3 h-3" />
              <span className="font-bold">Repeat</span>
            </div>
          </div>
          
          <p className="text-xs text-purple-600 font-bold mt-3">
            Time-consuming, error-prone, out-of-date
          </p>
        </div>

        {/* Center: The Challenge */}
        <div className="text-center" style={{ marginTop: '-18px' }}>
          <h4 className="text-sm font-bold text-muted-foreground mb-4 uppercase tracking-wide">The Challenge</h4>
          
          {/* Scattered Documents */}
          <div className="relative h-48 bg-gradient-to-br from-muted/10 to-muted/20 rounded-lg p-4 overflow-hidden">
            {/* Document Scatter - representing overwhelming amount */}
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className="absolute bg-white border border-border rounded shadow-sm animate-pulse"
                style={{
                  width: '20px',
                  height: '24px',
                  left: `${Math.random() * 80 + 5}%`,
                  top: `${Math.random() * 70 + 10}%`,
                  transform: `rotate(${Math.random() * 40 - 20}deg)`,
                  zIndex: Math.floor(Math.random() * 3),
                  animation: `float-${i % 4 + 1} ${3 + Math.random() * 4}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              >
                <div className="p-1">
                  <div className="w-full h-1 bg-primary/20 rounded mb-0.5"></div>
                  <div className="w-3/4 h-1 bg-primary/20 rounded mb-0.5"></div>
                  <div className="w-1/2 h-1 bg-primary/20 rounded"></div>
                </div>
              </div>
            ))}
            
            {/* Highlighted documents - different types with different colors */}
            <div className="absolute bottom-2 left-2 bg-purple-100 border border-purple-300 rounded shadow-sm p-1" style={{ width: '24px', height: '28px' }}>
              <div className="space-y-0.5">
                <div className="w-full h-1 bg-purple-400 rounded"></div>
                <div className="w-3/4 h-1 bg-purple-400 rounded"></div>
                <div className="w-1/2 h-1 bg-purple-400 rounded"></div>
              </div>
            </div>
            
            <div className="absolute top-4 right-4 bg-purple-100 border border-purple-300 rounded shadow-sm p-1" style={{ width: '24px', height: '28px' }}>
              <div className="space-y-0.5">
                <div className="w-full h-1 bg-purple-400 rounded"></div>
                <div className="w-3/4 h-1 bg-purple-400 rounded"></div>
                <div className="w-1/2 h-1 bg-purple-400 rounded"></div>
              </div>
            </div>

            {/* Additional document types with different colors */}
            <div className="absolute top-8 left-8 bg-blue-100 border border-blue-300 rounded shadow-sm p-1" style={{ width: '24px', height: '28px' }}>
              <div className="space-y-0.5">
                <div className="w-full h-1 bg-blue-400 rounded"></div>
                <div className="w-3/4 h-1 bg-blue-400 rounded"></div>
                <div className="w-1/2 h-1 bg-blue-400 rounded"></div>
              </div>
            </div>

            <div className="absolute bottom-8 right-8 bg-green-100 border border-green-300 rounded shadow-sm p-1" style={{ width: '24px', height: '28px' }}>
              <div className="space-y-0.5">
                <div className="w-full h-1 bg-green-400 rounded"></div>
                <div className="w-3/4 h-1 bg-green-400 rounded"></div>
                <div className="w-1/2 h-1 bg-green-400 rounded"></div>
              </div>
            </div>

            <div className="absolute top-16 right-12 bg-orange-100 border border-orange-300 rounded shadow-sm p-1" style={{ width: '24px', height: '28px' }}>
              <div className="space-y-0.5">
                <div className="w-full h-1 bg-orange-400 rounded"></div>
                <div className="w-3/4 h-1 bg-orange-400 rounded"></div>
                <div className="w-1/2 h-1 bg-orange-400 rounded"></div>
              </div>
            </div>

            <div className="absolute bottom-16 left-8 bg-red-100 border border-red-300 rounded shadow-sm p-1" style={{ width: '24px', height: '28px' }}>
              <div className="space-y-0.5">
                <div className="w-full h-1 bg-red-400 rounded"></div>
                <div className="w-3/4 h-1 bg-red-400 rounded"></div>
                <div className="w-1/2 h-1 bg-red-400 rounded"></div>
              </div>
            </div>

            {/* More colored document types */}
            <div className="absolute top-6 left-16 bg-yellow-100 border border-yellow-300 rounded shadow-sm p-1" style={{ width: '24px', height: '28px' }}>
              <div className="space-y-0.5">
                <div className="w-full h-1 bg-yellow-400 rounded"></div>
                <div className="w-3/4 h-1 bg-yellow-400 rounded"></div>
                <div className="w-1/2 h-1 bg-yellow-400 rounded"></div>
              </div>
            </div>

            <div className="absolute bottom-12 right-16 bg-indigo-100 border border-indigo-300 rounded shadow-sm p-1" style={{ width: '24px', height: '28px' }}>
              <div className="space-y-0.5">
                <div className="w-full h-1 bg-indigo-400 rounded"></div>
                <div className="w-3/4 h-1 bg-indigo-400 rounded"></div>
                <div className="w-1/2 h-1 bg-indigo-400 rounded"></div>
              </div>
            </div>

            <div className="absolute top-12 left-12 bg-pink-100 border border-pink-300 rounded shadow-sm p-1" style={{ width: '24px', height: '28px' }}>
              <div className="space-y-0.5">
                <div className="w-full h-1 bg-pink-400 rounded"></div>
                <div className="w-3/4 h-1 bg-pink-400 rounded"></div>
                <div className="w-1/2 h-1 bg-pink-400 rounded"></div>
              </div>
            </div>

            <div className="absolute bottom-6 left-20 bg-teal-100 border border-teal-300 rounded shadow-sm p-1" style={{ width: '24px', height: '28px' }}>
              <div className="space-y-0.5">
                <div className="w-full h-1 bg-teal-400 rounded"></div>
                <div className="w-3/4 h-1 bg-teal-400 rounded"></div>
                <div className="w-1/2 h-1 bg-teal-400 rounded"></div>
              </div>
            </div>

            <div className="absolute top-20 right-6 bg-rose-100 border border-rose-300 rounded shadow-sm p-1" style={{ width: '24px', height: '28px' }}>
              <div className="space-y-0.5">
                <div className="w-full h-1 bg-rose-400 rounded"></div>
                <div className="w-3/4 h-1 bg-rose-400 rounded"></div>
                <div className="w-1/2 h-1 bg-rose-400 rounded"></div>
              </div>
            </div>

            <div className="absolute bottom-4 left-1/2 bg-cyan-100 border border-cyan-300 rounded shadow-sm p-1" style={{ width: '24px', height: '28px' }}>
              <div className="space-y-0.5">
                <div className="w-full h-1 bg-cyan-400 rounded"></div>
                <div className="w-3/4 h-1 bg-cyan-400 rounded"></div>
                <div className="w-1/2 h-1 bg-cyan-400 rounded"></div>
              </div>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground font-bold mt-3 space-y-1">
            <div>20 × Lease Agreements</div>
            <div>12 × Deeds of Variation</div>
            <div>3 × Reversionary Leases</div>
            <div className="text-purple-600 mt-2">Total = 55 available review dates</div>
          </div>
        </div>

        {/* Right: The Future (Hobson) */}
        <div className="text-center">
          <h4 className="text-sm font-bold text-purple-600 mb-3 uppercase tracking-wide">Hobson AI</h4>
          
          {/* Clean Answer Card */}
          <div className="bg-white rounded-lg p-4 border border-primary/20 shadow-lg">
            <div className="text-sm font-semibold text-foreground mb-3">
              Next rent review:
            </div>
            <div className="text-sm font-normal text-foreground mb-3">
              Is on the 14/09/26 for<br />
              Knight Frank of<br />
              23 Hampstead High Street NW3
            </div>
            
            <div className="text-left space-y-2">
              <div className="text-xs text-muted-foreground font-bold mb-2">Sources:</div>
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Lease Agreement<br />(Page 5, Clause 3.2)</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Deed of Variation<br />(Page 2, Clause 1.1)</span>
              </div>
            </div>
          </div>
          
          <div className="text-xs text-center text-muted-foreground mt-4 space-y-1">
            <div className="font-bold">Reads every document.</div>
            <div className="font-bold">Extracts what matters.</div>
            <div className="font-bold text-primary">Answers instantly and with citations.</div>
          </div>
        </div>
      </div>
    </div>
  );
};