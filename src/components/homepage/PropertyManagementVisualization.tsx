import { FileText, ArrowRight, Brain, CheckCircle, Users, FolderOpen, Search, RotateCcw, UserCheck, Plus, ArrowUp } from "lucide-react";
import { useContent, useLanguage } from "@/contexts/LanguageContext";

export const PropertyManagementVisualization = () => {
  const content = useContent();
  const { language } = useLanguage();
  const viz = content.heroVisualization;
  const isGerman = language === 'de';

  // Hyphenation style for German text
  const hyphenStyle = isGerman ? { hyphens: 'auto' as const, wordBreak: 'break-word' as const } : {};

  return <div className="relative from-primary/5 to-secondary/10 rounded-2xl p-8 border border-primary/10 bg-gray-50">
      {/* Main Header */}
      <div className="text-center mb-8">
        <h1 className={`leading-relaxed font-bold mb-2 ${isGerman ? 'text-lg sm:text-xl' : 'text-2xl'}`} lang={language} style={hyphenStyle}>
          <span className="text-gray-500 font-semibold">{viz.mainHeading}</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center relative">
        {/* Left: The Pain (Today's World) */}
        <div className="text-center lg:mt-[10px]">
          <div className="mb-4">
            <h4 className={`font-black uppercase tracking-widest mb-2 relative inline-block ${isGerman ? 'text-sm sm:text-base' : 'text-lg'}`}>
              <span className="text-gray-500 drop-shadow-sm">
                {viz.todaysProcess.title}
              </span>
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gray-400 rounded-full"></div>
            </h4>
            <div className={`text-gray-500 font-bold uppercase tracking-wide opacity-80 ${isGerman ? 'text-[10px]' : 'text-xs'}`} lang={language} style={hyphenStyle}>
              {viz.todaysProcess.subtitle}
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
            <h4 className={`font-black uppercase tracking-widest mb-2 relative inline-block ${isGerman ? 'text-sm sm:text-base' : 'text-lg'}`}>
              <span className="text-gray-500 drop-shadow-sm">
                {viz.theChallenge.title}
              </span>
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gray-400 rounded-full"></div>
            </h4>
            <div className={`text-gray-500 font-bold uppercase tracking-wide opacity-80 ${isGerman ? 'text-[10px]' : 'text-xs'}`} lang={language} style={hyphenStyle}>
              {viz.theChallenge.subtitle}
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
            
            <div className="absolute bg-white border border-gray-300 rounded shadow-sm p-1" style={{
            width: '24px',
            height: '28px',
            left: '25%',
            top: '35%',
            transform: 'rotate(-5deg)',
            animation: 'float2 2.4s ease-in-out infinite 0.8s'
          }}>
              <div className="space-y-0.5">
                <div className="w-full h-1 bg-blue-200 rounded"></div>
                <div className="w-3/4 h-1 bg-blue-200 rounded"></div>
                <div className="w-1/2 h-1 bg-blue-200 rounded"></div>
              </div>
            </div>
            
            <div className="absolute bg-white border border-gray-300 rounded shadow-sm p-1" style={{
            width: '24px',
            height: '28px',
            left: '55%',
            top: '65%',
            transform: 'rotate(18deg)',
            animation: 'float3 2.6s ease-in-out infinite 1.8s'
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
            left: '45%',
            top: '20%',
            transform: 'rotate(-12deg)',
            animation: 'float1 3.2s ease-in-out infinite 0.3s'
          }}>
              <div className="space-y-0.5">
                <div className="w-full h-1 bg-blue-300 rounded"></div>
                <div className="w-3/4 h-1 bg-blue-300 rounded"></div>
                <div className="w-1/2 h-1 bg-blue-300 rounded"></div>
              </div>
            </div>
            
            <div className="absolute bg-white border border-gray-300 rounded shadow-sm p-1" style={{
            width: '24px',
            height: '28px',
            left: '80%',
            top: '25%',
            transform: 'rotate(9deg)',
            animation: 'float2 2.9s ease-in-out infinite 1.2s'
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
            left: '20%',
            top: '60%',
            transform: 'rotate(-7deg)',
            animation: 'float3 2.3s ease-in-out infinite 0.6s'
          }}>
              <div className="space-y-0.5">
                <div className="w-full h-1 bg-blue-200 rounded"></div>
                <div className="w-3/4 h-1 bg-blue-200 rounded"></div>
                <div className="w-1/2 h-1 bg-blue-200 rounded"></div>
              </div>
            </div>
            
            <div className="absolute bg-white border border-gray-300 rounded shadow-sm p-1" style={{
            width: '24px',
            height: '28px',
            left: '70%',
            top: '70%',
            transform: 'rotate(14deg)',
            animation: 'float1 2.5s ease-in-out infinite 2s'
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
            left: '50%',
            top: '40%',
            transform: 'rotate(-3deg)',
            animation: 'float2 3.5s ease-in-out infinite 0.2s'
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
            left: '12%',
            top: '45%',
            transform: 'rotate(11deg)',
            animation: 'float3 2.7s ease-in-out infinite 1.5s'
          }}>
              <div className="space-y-0.5">
                <div className="w-full h-1 bg-blue-300 rounded"></div>
                <div className="w-3/4 h-1 bg-blue-300 rounded"></div>
                <div className="w-1/2 h-1 bg-blue-300 rounded"></div>
              </div>
            </div>
            
            <div className="absolute bg-white border border-gray-300 rounded shadow-sm p-1" style={{
            width: '24px',
            height: '28px',
            left: '85%',
            top: '55%',
            transform: 'rotate(-10deg)',
            animation: 'float1 2.8s ease-in-out infinite 0.9s'
          }}>
              <div className="space-y-0.5">
                <div className="w-full h-1 bg-gray-300 rounded"></div>
                <div className="w-3/4 h-1 bg-gray-300 rounded"></div>
                <div className="w-1/2 h-1 bg-gray-300 rounded"></div>
              </div>
            </div>
            
            {/* Additional documents for more chaos */}
            <div className="absolute bg-white border border-gray-300 rounded shadow-sm p-1" style={{
            width: '24px',
            height: '28px',
            left: '5%',
            top: '15%',
            transform: 'rotate(22deg)',
            animation: 'float2 2.4s ease-in-out infinite 1.6s'
          }}>
              <div className="space-y-0.5">
                <div className="w-full h-1 bg-gray-400 rounded"></div>
                <div className="w-3/4 h-1 bg-gray-400 rounded"></div>
                <div className="w-1/2 h-1 bg-gray-400 rounded"></div>
              </div>
            </div>
            
            <div className="absolute bg-white border border-gray-300 rounded shadow-sm p-1" style={{
            width: '24px',
            height: '28px',
            left: '90%',
            top: '75%',
            transform: 'rotate(-18deg)',
            animation: 'float3 2.6s ease-in-out infinite 0.4s'
          }}>
              <div className="space-y-0.5">
                <div className="w-full h-1 bg-blue-200 rounded"></div>
                <div className="w-3/4 h-1 bg-blue-200 rounded"></div>
                <div className="w-1/2 h-1 bg-blue-200 rounded"></div>
              </div>
            </div>
            
            <div className="absolute bg-white border border-gray-300 rounded shadow-sm p-1" style={{
            width: '24px',
            height: '28px',
            left: '30%',
            top: '75%',
            transform: 'rotate(15deg)',
            animation: 'float1 2.3s ease-in-out infinite 1.1s'
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
            left: '8%',
            top: '72%',
            transform: 'rotate(-25deg)',
            animation: 'float2 2.9s ease-in-out infinite 2.1s'
          }}>
              <div className="space-y-0.5">
                <div className="w-full h-1 bg-blue-300 rounded"></div>
                <div className="w-3/4 h-1 bg-blue-300 rounded"></div>
                <div className="w-1/2 h-1 bg-blue-300 rounded"></div>
              </div>
            </div>
            
            <div className="absolute bg-white border border-gray-300 rounded shadow-sm p-1" style={{
            width: '24px',
            height: '28px',
            left: '92%',
            top: '8%',
            transform: 'rotate(20deg)',
            animation: 'float3 2.5s ease-in-out infinite 0.7s'
          }}>
              <div className="space-y-0.5">
                <div className="w-full h-1 bg-gray-400 rounded"></div>
                <div className="w-3/4 h-1 bg-gray-400 rounded"></div>
                <div className="w-1/2 h-1 bg-gray-400 rounded"></div>
              </div>
            </div>
            
            <div className="absolute bg-white border border-gray-300 rounded shadow-sm p-1" style={{
            width: '24px',
            height: '28px',
            left: '40%',
            top: '8%',
            transform: 'rotate(-22deg)',
            animation: 'float1 3s ease-in-out infinite 2.2s'
          }}>
              <div className="space-y-0.5">
                <div className="w-full h-1 bg-blue-200 rounded"></div>
                <div className="w-3/4 h-1 bg-blue-200 rounded"></div>
                <div className="w-1/2 h-1 bg-blue-200 rounded"></div>
              </div>
            </div>
            
            <div className="absolute bg-white border border-gray-300 rounded shadow-sm p-1" style={{
            width: '24px',
            height: '28px',
            left: '58%',
            top: '82%',
            transform: 'rotate(8deg)',
            animation: 'float2 2.7s ease-in-out infinite 0.9s'
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
            left: '18%',
            top: '8%',
            transform: 'rotate(-12deg)',
            animation: 'float3 2.4s ease-in-out infinite 1.7s'
          }}>
              <div className="space-y-0.5">
                <div className="w-full h-1 bg-blue-300 rounded"></div>
                <div className="w-3/4 h-1 bg-blue-300 rounded"></div>
                <div className="w-1/2 h-1 bg-blue-300 rounded"></div>
              </div>
            </div>
            
            <div className="absolute bg-white border border-gray-300 rounded shadow-sm p-1" style={{
            width: '24px',
            height: '28px',
            left: '88%',
            top: '35%',
            transform: 'rotate(25deg)',
            animation: 'float1 2.6s ease-in-out infinite 0.5s'
          }}>
              <div className="space-y-0.5">
                <div className="w-full h-1 bg-gray-400 rounded"></div>
                <div className="w-3/4 h-1 bg-gray-400 rounded"></div>
                <div className="w-1/2 h-1 bg-gray-400 rounded"></div>
              </div>
            </div>
            
            <div className="absolute bg-white border border-gray-300 rounded shadow-sm p-1" style={{
            width: '24px',
            height: '28px',
            left: '2%',
            top: '50%',
            transform: 'rotate(-8deg)',
            animation: 'float2 2.8s ease-in-out infinite 1.4s'
          }}>
              <div className="space-y-0.5">
                <div className="w-full h-1 bg-blue-200 rounded"></div>
                <div className="w-3/4 h-1 bg-blue-200 rounded"></div>
                <div className="w-1/2 h-1 bg-blue-200 rounded"></div>
              </div>
            </div>
            
            <div className="absolute bg-white border border-gray-300 rounded shadow-sm p-1" style={{
            width: '24px',
            height: '28px',
            left: '78%',
            top: '8%',
            transform: 'rotate(17deg)',
            animation: 'float3 2.3s ease-in-out infinite 1s'
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
            left: '62%',
            top: '30%',
            transform: 'rotate(-14deg)',
            animation: 'float1 3.1s ease-in-out infinite 1.9s'
          }}>
              <div className="space-y-0.5">
                <div className="w-full h-1 bg-blue-300 rounded"></div>
                <div className="w-3/4 h-1 bg-blue-300 rounded"></div>
                <div className="w-1/2 h-1 bg-blue-300 rounded"></div>
              </div>
            </div>
            
            {/* Highlighted documents - different types with different colored content */}
            <div className="absolute bottom-2 left-2 bg-white border border-gray-300 rounded shadow-sm p-1" style={{
            width: '24px',
            height: '28px'
          }}>
              <div className="space-y-0.5">
                <div className="w-full h-1 bg-gray-400 rounded"></div>
                <div className="w-3/4 h-1 bg-gray-400 rounded"></div>
                <div className="w-1/2 h-1 bg-gray-400 rounded"></div>
              </div>
            </div>
            
            <div className="absolute top-4 right-4 bg-white border border-gray-300 rounded shadow-sm p-1" style={{
            width: '24px',
            height: '28px'
          }}>
              <div className="space-y-0.5">
                <div className="w-full h-1 bg-blue-300 rounded"></div>
                <div className="w-3/4 h-1 bg-blue-300 rounded"></div>
                <div className="w-1/2 h-1 bg-blue-300 rounded"></div>
              </div>
            </div>

            {/* Additional document types with different colored content */}
            <div className="absolute top-8 left-8 bg-white border border-gray-300 rounded shadow-sm p-1" style={{
            width: '24px',
            height: '28px'
          }}>
              <div className="space-y-0.5">
                <div className="w-full h-1 bg-gray-400 rounded"></div>
                <div className="w-3/4 h-1 bg-gray-400 rounded"></div>
                <div className="w-1/2 h-1 bg-gray-400 rounded"></div>
              </div>
            </div>

            <div className="absolute bottom-8 right-8 bg-white border border-gray-300 rounded shadow-sm p-1" style={{
            width: '24px',
            height: '28px'
          }}>
              <div className="space-y-0.5">
                <div className="w-full h-1 bg-blue-200 rounded"></div>
                <div className="w-3/4 h-1 bg-blue-200 rounded"></div>
                <div className="w-1/2 h-1 bg-blue-200 rounded"></div>
              </div>
            </div>

            <div className="absolute top-16 right-12 bg-white border border-gray-300 rounded shadow-sm p-1" style={{
            width: '24px',
            height: '28px'
          }}>
              <div className="space-y-0.5">
                <div className="w-full h-1 bg-gray-400 rounded"></div>
                <div className="w-3/4 h-1 bg-gray-400 rounded"></div>
                <div className="w-1/2 h-1 bg-gray-400 rounded"></div>
              </div>
            </div>

            <div className="absolute bottom-16 left-8 bg-white border border-gray-300 rounded shadow-sm p-1" style={{
            width: '24px',
            height: '28px'
          }}>
              <div className="space-y-0.5">
                <div className="w-full h-1 bg-blue-300 rounded"></div>
                <div className="w-3/4 h-1 bg-blue-300 rounded"></div>
                <div className="w-1/2 h-1 bg-blue-300 rounded"></div>
              </div>
            </div>

            {/* More colored document content types */}
            <div className="absolute top-6 left-16 bg-white border border-gray-300 rounded shadow-sm p-1" style={{
            width: '24px',
            height: '28px'
          }}>
              <div className="space-y-0.5">
                <div className="w-full h-1 bg-gray-400 rounded"></div>
                <div className="w-3/4 h-1 bg-gray-400 rounded"></div>
                <div className="w-1/2 h-1 bg-gray-400 rounded"></div>
              </div>
            </div>

            <div className="absolute bottom-12 right-16 bg-white border border-gray-300 rounded shadow-sm p-1" style={{
            width: '24px',
            height: '28px'
          }}>
              <div className="space-y-0.5">
                <div className="w-full h-1 bg-blue-400 rounded"></div>
                <div className="w-3/4 h-1 bg-blue-400 rounded"></div>
                <div className="w-1/2 h-1 bg-blue-400 rounded"></div>
              </div>
            </div>

            <div className="absolute top-12 left-12 bg-white border border-gray-300 rounded shadow-sm p-1" style={{
            width: '24px',
            height: '28px'
          }}>
              <div className="space-y-0.5">
                <div className="w-full h-1 bg-gray-400 rounded"></div>
                <div className="w-3/4 h-1 bg-gray-400 rounded"></div>
                <div className="w-1/2 h-1 bg-gray-400 rounded"></div>
              </div>
            </div>

            <div className="absolute bottom-6 left-20 bg-white border border-gray-300 rounded shadow-sm p-1" style={{
            width: '24px',
            height: '28px'
          }}>
              <div className="space-y-0.5">
                <div className="w-full h-1 bg-blue-200 rounded"></div>
                <div className="w-3/4 h-1 bg-blue-200 rounded"></div>
                <div className="w-1/2 h-1 bg-blue-200 rounded"></div>
              </div>
            </div>

            <div className="absolute top-20 right-6 bg-white border border-gray-300 rounded shadow-sm p-1" style={{
            width: '24px',
            height: '28px'
          }}>
              <div className="space-y-0.5">
                <div className="w-full h-1 bg-gray-300 rounded"></div>
                <div className="w-3/4 h-1 bg-gray-300 rounded"></div>
                <div className="w-1/2 h-1 bg-gray-300 rounded"></div>
              </div>
            </div>

            <div className="absolute bottom-4 left-1/2 bg-white border border-gray-300 rounded shadow-sm p-1" style={{
            width: '24px',
            height: '28px'
          }}>
              <div className="space-y-0.5">
                <div className="w-full h-1 bg-blue-300 rounded"></div>
                <div className="w-3/4 h-1 bg-blue-300 rounded"></div>
                <div className="w-1/2 h-1 bg-blue-300 rounded"></div>
              </div>
            </div>
          </div>
          
          <div className={`text-muted-foreground font-bold mt-3 space-y-1 ${isGerman ? 'text-[10px]' : 'text-xs'}`} lang={language} style={hyphenStyle}>
            <div>{viz.theChallenge.documents.leaseAgreements}</div>
            <div>{viz.theChallenge.documents.deedsOfVariation}</div>
            <div>{viz.theChallenge.documents.reversionaryLeases}</div>
            <div className="mt-2 text-green-600">
              {viz.theChallenge.documents.differentDates}
            </div>
          </div>
        </div>

        {/* Right: The Future (Hobson) */}
        <div className="text-center">
          <div className="mb-3">
            <h4 className={`font-black uppercase tracking-widest mb-2 relative inline-block ${isGerman ? 'text-sm sm:text-base' : 'text-lg'}`}>
              <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent drop-shadow-sm">
                {viz.hobsonAI.title}
              </span>
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
            </h4>
            <div className={`text-purple-600 font-bold uppercase tracking-wide opacity-80 ${isGerman ? 'text-[10px]' : 'text-xs'}`}>
              {viz.hobsonAI.subtitle}
            </div>
          </div>
          
          {/* Clean Answer Card */}
          <div className="bg-gray-50 rounded-lg border border-primary/20 shadow-lg relative" style={{
          padding: 'clamp(15px, 4vw, 22px)'
        }}>
            <div className={`font-normal text-muted-foreground mb-3 font-sans text-left ${isGerman ? 'text-xs' : 'text-sm'}`} lang={language} style={hyphenStyle}>
              {viz.hobsonAI.answer}
            </div>
            
            <div className="text-left space-y-2 mb-4">
              <div className={`text-muted-foreground font-bold mb-2 ${isGerman ? 'text-[10px]' : 'text-xs'}`}>{viz.hobsonAI.sources}</div>
              <div className={`flex items-start gap-2 text-muted-foreground ${isGerman ? 'text-[10px]' : 'text-xs'}`}>
                <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                <span lang={language} style={hyphenStyle}>{viz.hobsonAI.leaseAgreement}<br />{viz.hobsonAI.leaseAgreementRef}</span>
              </div>
              <div className={`flex items-start gap-2 text-muted-foreground ${isGerman ? 'text-[10px]' : 'text-xs'}`}>
                <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                <span lang={language} style={hyphenStyle}>{viz.hobsonAI.deedOfVariation}<br />{viz.hobsonAI.deedOfVariationRef}</span>
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
              <textarea placeholder={viz.hobsonAI.askPlaceholder} className="flex-1 resize-none bg-transparent text-xs font-bold placeholder:text-muted-foreground border-none outline-none min-h-[24px] max-h-[100px]" style={{
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