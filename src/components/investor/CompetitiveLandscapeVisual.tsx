import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export const CompetitiveLandscapeVisual = () => {
  // Traditional PropTech companies (representing overcrowded market)
  const traditionalCompanies = [
    'AppFolio', 'Yardi', 'RealPage', 'Entrata', 'MRI Software',
    'Propertyware', 'Buildium', 'Rent Manager', 'TenantCloud', 'Cozy',
    'Avail', 'Rentec Direct', 'SimplifyEm', 'DoorLoop', 'Innago',
    'TurboTenant', 'Landlord Studio', 'Hemlane', 'Rentler', 'Zumper',
    'Apartments.com', 'Zillow Rental', 'HotPads', 'PadMapper', 'Trulia Rentals',
    'ManageCasa', 'Property Matrix', 'ResMan', 'OneSite', 'Knock CRM',
    'LionDesk', 'Follow Up Boss', 'Contactually', 'Wise Agent', 'kvCORE',
    'BoomTown', 'Chime', 'Zurple', 'Structurely', 'Rex Software',
    'Apto', 'VTS', 'Juniper Square', 'Ascendix', 'CommercialEdge',
    'LoopNet', 'CoStar', 'Reonomy', 'PropertyShark', 'CompStak',
    'CREXi', 'Raise Commercial', 'Dealpath', 'Altus Group', 'Argus'
  ];

  // AI-native solutions
  const aiNativeCompanies = [
    { name: 'Hobson', leader: true },
    { name: 'EliseAI', leader: false },
    { name: 'Trudi', leader: false },
    { name: 'StanAI', leader: false },
    { name: 'Kendal AI', leader: false }
  ];

  return (
    <div className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 md:p-12 shadow-2xl border border-slate-700">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          The Next Winners in Real Estate Tech Will Be AI-Native
        </h2>
        <p className="text-lg text-slate-300 max-w-3xl mx-auto">
          Traditional cloud systems cannot deliver reasoning, accuracy, or instant answers — AI-native tools can.
        </p>
      </div>

      {/* Main Comparison */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Traditional Cloud Solutions */}
        <div className="relative">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-300 mb-2">Traditional Cloud Solutions</h3>
            <p className="text-sm text-slate-400">The Overcrowded "Before"</p>
          </div>

          {/* Dense logo cluster - faded and crowded */}
          <div className="relative bg-slate-800/40 rounded-xl p-6 border border-slate-700/50 backdrop-blur-sm min-h-[400px] overflow-hidden">
            <div className="grid grid-cols-4 gap-2 opacity-40">
              {traditionalCompanies.slice(0, 48).map((company, idx) => (
                <div 
                  key={idx}
                  className="bg-slate-700/50 rounded px-2 py-1.5 text-[9px] text-slate-400 text-center truncate border border-slate-600/30"
                >
                  {company}
                </div>
              ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-800/20 to-slate-800/60 pointer-events-none"></div>
          </div>

          {/* Key Issues */}
          <ul className="mt-4 space-y-2 text-sm text-slate-400">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0"></span>
              <span>Overcrowded market</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0"></span>
              <span>High cost, slow innovation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0"></span>
              <span>Still reliant on manual information retrieval</span>
            </li>
          </ul>
        </div>

        {/* Center Divider */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3 z-10">
          <div className="flex flex-col items-center gap-2 bg-slate-800 px-4 py-3 rounded-full border-2 border-emerald-500/50 shadow-lg shadow-emerald-500/20">
            <ArrowRight className="w-6 h-6 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400 whitespace-nowrap">Industry Transition</span>
          </div>
        </div>

        {/* Right Side - AI-Native Solutions */}
        <div className="relative">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-emerald-400 mb-2 flex items-center gap-2">
              Next-Generation AI Solutions
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </h3>
            <p className="text-sm text-slate-300">The Emerging "After"</p>
          </div>

          {/* Clean, spacious AI-native logos */}
          <div className="bg-gradient-to-br from-emerald-950/40 to-slate-800/40 rounded-xl p-8 border-2 border-emerald-500/30 backdrop-blur-sm min-h-[400px] flex flex-col justify-center gap-6 shadow-xl shadow-emerald-500/10">
            {aiNativeCompanies.map((company, idx) => (
              <div 
                key={idx}
                className={`
                  ${company.leader 
                    ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border-2 border-emerald-400 shadow-lg shadow-emerald-500/20' 
                    : 'bg-slate-700/50 border border-slate-600'
                  }
                  rounded-lg px-6 py-4 flex items-center justify-between transition-all hover:scale-[1.02]
                `}
              >
                <span className={`
                  ${company.leader ? 'text-emerald-300 text-xl font-bold' : 'text-slate-300 text-lg font-medium'}
                `}>
                  {company.name}
                </span>
                {company.leader && (
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-400/50">
                    Category Leader
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Key Benefits */}
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
              <span>Instant, referenced answers from source documents</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
              <span>Simple, lightweight, and low cost</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
              <span>Designed for accuracy and automation</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Mobile Transition Arrow */}
      <div className="md:hidden flex justify-center my-8">
        <div className="flex flex-col items-center gap-2 bg-slate-800 px-6 py-3 rounded-full border-2 border-emerald-500/50 shadow-lg shadow-emerald-500/20">
          <ArrowRight className="w-6 h-6 text-emerald-400 rotate-90" />
          <span className="text-xs font-semibold text-emerald-400">Industry Transition</span>
        </div>
      </div>
    </div>
  );
};
