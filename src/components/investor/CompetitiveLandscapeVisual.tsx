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
    <div className="w-full bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-slate-200">
      {/* Header - Discreet boxed style */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-10">
        <h2 className="text-lg md:text-xl font-semibold text-slate-800 mb-2">
          The Next Winners in Real Estate Tech Will Be AI-Native
        </h2>
        <p className="text-sm text-slate-600">
          Traditional cloud systems cannot deliver reasoning, accuracy, or instant answers — AI-native tools can.
        </p>
      </div>

      {/* Main Comparison - Desktop */}
      <div className="hidden md:block relative">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Traditional Cloud Solutions */}
          <div className="relative">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-700 mb-2">Traditional Cloud Solutions</h3>
              <p className="text-sm text-slate-500">The Overcrowded "Before"</p>
            </div>

            {/* Dense logo cluster - faded and crowded */}
            <div className="relative bg-slate-50 rounded-xl p-6 border border-slate-200 min-h-[400px] overflow-hidden">
              <div className="grid grid-cols-4 gap-2">
                {traditionalCompanies.slice(0, 48).map((company, idx) => {
                  const row = Math.floor(idx / 4);
                  const opacity = Math.max(0.15, 1 - (row * 0.08));
                  return (
                    <div 
                      key={idx}
                      className="bg-slate-200 rounded px-2 py-1.5 text-[10px] text-slate-600 text-center truncate border border-slate-300"
                      style={{ opacity }}
                    >
                      {company}
                    </div>
                  );
                })}
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-100/60 pointer-events-none"></div>
            </div>

            {/* Key Issues */}
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></span>
                <span>Overcrowded market</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></span>
                <span>High cost, slow innovation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></span>
                <span>Still reliant on manual information retrieval</span>
              </li>
            </ul>
          </div>

          {/* Center Divider */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3 z-10">
            <div className="flex flex-col items-center gap-2 bg-white px-4 py-3 rounded-full border-2 border-emerald-600 shadow-lg">
              <ArrowRight className="w-6 h-6 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700 whitespace-nowrap">Industry Transition</span>
            </div>
          </div>

          {/* Right Side - AI-Native Solutions */}
          <div className="relative">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-emerald-700 mb-2 flex items-center gap-2">
                Next-Generation AI Solutions
                <Sparkles className="w-5 h-5 text-emerald-600" />
              </h3>
              <p className="text-sm text-slate-600">The Emerging "After"</p>
            </div>

            {/* Clean, spacious AI-native logos */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-8 border-2 border-emerald-300 min-h-[400px] flex flex-col justify-center gap-6 shadow-lg">
              {aiNativeCompanies.map((company, idx) => (
                <div 
                  key={idx}
                  className={`
                    ${company.leader 
                      ? 'bg-gradient-to-r from-emerald-100 to-emerald-200 border-2 border-emerald-600 shadow-md' 
                      : 'bg-white border border-slate-300'
                    }
                    rounded-lg px-6 py-4 flex items-center justify-between transition-all hover:scale-[1.02]
                  `}
                >
                  <span className={`
                    ${company.leader ? 'text-emerald-900 text-xl font-bold' : 'text-slate-700 text-lg font-medium'}
                  `}>
                    {company.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Key Benefits */}
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 flex-shrink-0"></span>
                <span>Instant, referenced answers from source documents</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 flex-shrink-0"></span>
                <span>Simple, lightweight, and low cost</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 flex-shrink-0"></span>
                <span>Designed for accuracy and automation</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile Layout - Stacked */}
      <div className="md:hidden space-y-6">
        {/* Traditional Cloud Solutions */}
        <div className="relative">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-700 mb-1">Traditional Cloud Solutions</h3>
            <p className="text-xs text-slate-500">The Overcrowded "Before"</p>
          </div>

          {/* Dense logo cluster - faded and crowded */}
          <div className="relative bg-slate-50 rounded-xl p-4 border border-slate-200 min-h-[300px] overflow-hidden">
            <div className="grid grid-cols-3 gap-1.5">
              {traditionalCompanies.slice(0, 36).map((company, idx) => {
                const row = Math.floor(idx / 3);
                const opacity = Math.max(0.15, 1 - (row * 0.08));
                return (
                  <div 
                    key={idx}
                    className="bg-slate-200 rounded px-1.5 py-1 text-[9px] text-slate-600 text-center truncate border border-slate-300"
                    style={{ opacity }}
                  >
                    {company}
                  </div>
                );
              })}
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-100/60 pointer-events-none"></div>
          </div>

          {/* Key Issues */}
          <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 flex-shrink-0"></span>
              <span>Overcrowded market</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 flex-shrink-0"></span>
              <span>High cost, slow innovation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 flex-shrink-0"></span>
              <span>Still reliant on manual information retrieval</span>
            </li>
          </ul>
        </div>

        {/* Mobile Transition Arrow */}
        <div className="flex justify-center py-2">
          <div className="flex flex-col items-center gap-2 bg-white px-6 py-3 rounded-full border-2 border-emerald-600 shadow-lg">
            <ArrowRight className="w-6 h-6 text-emerald-600 rotate-90" />
            <span className="text-xs font-semibold text-emerald-700">Industry Transition</span>
          </div>
        </div>

        {/* AI-Native Solutions */}
        <div className="relative">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-emerald-700 mb-1 flex items-center gap-2">
              Next-Generation AI Solutions
              <Sparkles className="w-4 h-4 text-emerald-600" />
            </h3>
            <p className="text-xs text-slate-600">The Emerging "After"</p>
          </div>

          {/* Clean, spacious AI-native logos */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-5 border-2 border-emerald-300 min-h-[300px] flex flex-col justify-center gap-4 shadow-lg">
            {aiNativeCompanies.map((company, idx) => (
              <div 
                key={idx}
                className={`
                  ${company.leader 
                    ? 'bg-gradient-to-r from-emerald-100 to-emerald-200 border-2 border-emerald-600 shadow-md' 
                    : 'bg-white border border-slate-300'
                  }
                  rounded-lg px-4 py-3 flex items-center justify-between transition-all
                `}
              >
                <span className={`
                  ${company.leader ? 'text-emerald-900 text-base font-bold' : 'text-slate-700 text-sm font-medium'}
                `}>
                  {company.name}
                </span>
              </div>
            ))}
          </div>

          {/* Key Benefits */}
          <ul className="mt-3 space-y-1.5 text-xs text-slate-700">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1 flex-shrink-0"></span>
              <span>Instant, referenced answers from source documents</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1 flex-shrink-0"></span>
              <span>Simple, lightweight, and low cost</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1 flex-shrink-0"></span>
              <span>Designed for accuracy and automation</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
