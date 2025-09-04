import { FileText, ArrowRight, Brain, CheckCircle, Users, FolderOpen, Search, RotateCcw, UserCheck, Plus, ArrowUp } from "lucide-react";
export const PropertyManagementVisualizationHomeowner = () => {
  return <div className="relative from-primary/5 to-secondary/10 rounded-2xl p-8 border border-primary/10 bg-gray-50">
      {/* Main Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl leading-relaxed font-bold mb-2">
          <span className="text-gray-500 font-semibold">So many docs, one key date — here's how to find it</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center relative">
        {/* Left: The Pain (Today's World) */}
        <div className="text-center lg:mt-[10px]">
          <div className="mb-4">
            <h4 className="text-lg font-black uppercase tracking-widest mb-2 relative inline-block">
              <span className="text-gray-500 drop-shadow-sm">
                Today's Process
              </span>
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gray-400 rounded-full"></div>
            </h4>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-wide opacity-80">
              Manual • Slow • Error-Prone
            </div>
          </div>
          
          {/* Circular Process */}
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36 mx-auto mb-4">
            <div className="absolute inset-0 border-2 border-dashed border-purple-300 rounded-full animate-spin" style={{
            animationDuration: '8s'
          }}></div>
            
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

          
        </div>

        {/* Center: The Challenge */}
        <div className="text-center lg:mt-[15px]">
          <div className="mb-4">
            <h4 className="text-lg font-black uppercase tracking-widest mb-2 relative inline-block">
              <span className="text-gray-500 drop-shadow-sm">
                The Challenge
              </span>
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gray-400 rounded-full"></div>
            </h4>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-wide opacity-80">
              Overwhelming • Scattered • Complex
            </div>
          </div>
          
          {/* Scattered Documents */}
          <div className="relative h-32 sm:h-40 lg:h-48 bg-gradient-to-br from-muted/10 to-muted/20 rounded-lg p-2 sm:p-3 lg:p-4 overflow-hidden">
            {/* Animated Document Scatter - representing overwhelming amount */}
            <div className="absolute bg-white border border-gray-300 rounded shadow-sm p-1" style={{
            width: '24px',
            height: '28px',
            left: '15%',
            top: '25%',
            transform: 'rotate(-8deg)',
            animation: 'float1 2.5s ease-in-out infinite'
          }}>
              <div className="space-y-0.5">
                <div className="w-full h-1 bg-gray-300 rounded"></div>
                <div className="w-3/4 h-1 bg-gray-300 rounded"></div>
                <div className="w-1/2 h-1 bg-gray-300 rounded"></div>
              </div>
            </div>
            
            <div className="absolute bg-white border border-gray-300 rounded shadow-sm p-1" style={{
            width: '24px',
            height: '28px',
            left: '65%',
            top: '15%',
            transform: 'rotate(12deg)',
            animation: 'float2 3s ease-in-out infinite 0.5s'
          }}>
              <div className="space-y-0.5">
                <div className="w-full h-1 bg-gray-300 rounded"></div>
                <div className="w-3/4 h-1 bg-gray-300 rounded"></div>
                <div className="w-1/2 h-1 bg-gray-300 rounded"></div>
              </div>
            </div>
            
            <div className="absolute bg-white border border-gray-300 rounded shadow-sm p-1" style={{
            width: '24px',
            height: '28px',
            left: '35%',
            top: '55%',
            transform: 'rotate(-15deg)',
            animation: 'float3 2.8s ease-in-out infinite 1s'
          }}>
              <div className="space-y-0.5">
                <div className="w-full h-1 bg-gray-300 rounded"></div>
                <div className="w-3/4 h-1 bg-gray-300 rounded"></div>
                <div className="w-1/2 h-1 bg-gray-300 rounded"></div>
              </div>
            </div>
            
            <div className="absolute bg-white border border-gray-300 rounded shadow-sm p-1" style={{
            width: '24px',
            height: '28px',
            left: '75%',
            top: '45%',
            transform: 'rotate(6deg)',
            animation: 'float1 2.7s ease-in-out infinite 1.5s'
          }}>
              <div className="space-y-0.5">
                <div className="w-full h-1 bg-gray-300 rounded"></div>
                <div className="w-3/4 h-1 bg-gray-300 rounded"></div>
                <div className="w-1/2 h-1 bg-gray-300 rounded"></div>
              </div>
            </div>
            
          </div>
          
          <div className="text-xs text-muted-foreground font-bold mt-3 space-y-1">
            <div className="whitespace-nowrap">20 × Lease Agreements</div>
            <div className="whitespace-nowrap">12 × Deeds of Variation</div>
            <div className="whitespace-nowrap">3 × Reversionary Leases</div>
            <div className="whitespace-nowrap mt-2 text-green-600">
              Total = 49 Review dates
            </div>
          </div>
        </div>

        {/* Right: The Future (Hobson) */}
        <div className="text-center">
          <div className="mb-3">
            <h4 className="text-lg font-black uppercase tracking-widest mb-2 relative inline-block">
              <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent drop-shadow-sm">
                Hobson AI
              </span>
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
            </h4>
            <div className="text-xs text-purple-600 font-bold uppercase tracking-wide opacity-80">
              Instant • Accurate • Intelligent
            </div>
          </div>
          
          {/* Clean Answer Card */}
          <div className="bg-gray-50 rounded-lg border border-primary/20 shadow-lg relative" style={{
          padding: 'clamp(15px, 4vw, 22px)'
        }}>
            <div className="text-sm font-normal text-muted-foreground mb-3 font-sans text-left">
              The principal rent for the property at 64-70 Camden High Street, London NW1 0LT is £135,000 per annum,
            </div>
            
            <div className="text-left space-y-2 mb-4">
              <div className="text-xs text-muted-foreground font-bold mb-2">Sources:</div>
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Lease Agreement<br />(Page 5, Clause 3.2)</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Deed of Variation 26th November 2020<br />(Page 2, Clause 1.1)</span>
              </div>
            </div>
            
            {/* Chat input area */}
            <div className="flex items-center gap-2 bg-amber-50 border border-border rounded-lg -mx-2" style={{
            padding: '10px',
            marginTop: '19px'
          }}>
              <div className="w-4 h-4 rounded-full border border-muted-foreground/40 flex items-center justify-center hover:border-muted-foreground cursor-pointer flex-shrink-0">
                <Plus className="w-2 h-2 text-muted-foreground/60 hover:text-muted-foreground" />
              </div>
              <textarea placeholder="Ask Hobson" className="flex-1 resize-none bg-transparent text-xs font-bold placeholder:text-muted-foreground border-none outline-none min-h-[24px] max-h-[100px]" style={{
              marginTop: '2px'
            }} rows={1} />
              <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center hover:bg-gray-800 cursor-pointer flex-shrink-0">
                <ArrowUp className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>;
};