import React from 'react';
import { Users, Briefcase, Globe, Building2, Shield, Sparkles } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  description?: string;
  isTBC?: boolean;
}

const coreTeam: TeamMember[] = [
  {
    name: "Max Worth",
    role: "CEO",
    isTBC: true,
  },
  {
    name: "Marc Trup",
    role: "Commercial Lead",
    description: "Driving enterprise sales, go-to-market execution, and customer growth",
  },
  {
    name: "Rochelle Trup",
    role: "Commercial Lead",
    description: "Leading commercial strategy, partnerships, and market expansion",
  },
  {
    name: "Julia Szaltoni",
    role: "Product Lead",
    description: "Driving product strategy, design, and customer outcomes with deep domain understanding of property operations and user behaviour",
  },
  {
    name: "Denis Kosenkov",
    role: "Senior AI Developer",
    description: "Architecting Hobson's AI systems and execution pipelines",
  },
  {
    name: "Kumar Ankit",
    role: "AI & Technical Lead",
    description: "Leading the core AI architecture and platform development",
  },
  {
    name: "Harriet Taylor",
    role: "Marketing Lead",
    isTBC: true,
  },
  {
    name: "Max Grey",
    role: "Sales Lead",
    isTBC: true,
  },
  {
    name: "Saul Trup",
    role: "Client Success Lead",
    isTBC: true,
  },
];

const advisors: TeamMember[] = [
  {
    name: "Nick Doffman",
    role: "Commercial Advisor",
    description: "Bringing deep commercial and industry experience to guide strategic growth",
  },
];

const upcomingAdvisoryAreas = [
  { icon: Globe, text: "International expansion" },
  { icon: Building2, text: "Enterprise partnerships" },
  { icon: Shield, text: "Regulatory strategy" },
];

const TeamMemberCard: React.FC<{ member: TeamMember; isAdvisor?: boolean }> = ({ member, isAdvisor = false }) => {
  const initials = member.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className={`group relative bg-card rounded-xl border border-border/50 p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 ${member.isTBC ? 'opacity-75' : ''}`}>
      {/* TBC Badge */}
      {member.isTBC && (
        <div className="absolute top-3 right-3 px-2 py-0.5 bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 text-xs font-medium rounded-full">
          TBC
        </div>
      )}
      
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-lg font-semibold transition-colors duration-300 ${
          isAdvisor 
            ? 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-slate-600 dark:text-slate-300 group-hover:from-primary/10 group-hover:to-primary/20'
            : 'bg-gradient-to-br from-primary/10 to-primary/20 text-primary group-hover:from-primary/20 group-hover:to-primary/30'
        }`}>
          {initials}
        </div>
        
        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
            {member.name}
          </h4>
          <p className={`text-sm font-medium ${isAdvisor ? 'text-slate-500 dark:text-slate-400' : 'text-primary/80'}`}>
            {member.role}
          </p>
          {member.description && (
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {member.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export const TeamVisual: React.FC = () => {
  return (
    <div className="space-y-10">
      {/* Section 1: Core Operational Team */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Core Operational Team</h3>
            <p className="text-sm text-muted-foreground">The team driving Hobson's growth and innovation</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coreTeam.map((member, idx) => (
            <TeamMemberCard key={idx} member={member} />
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/50"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-4 text-xs text-muted-foreground uppercase tracking-wider">
            Strategic Guidance
          </span>
        </div>
      </div>

      {/* Section 2: Advisory Board */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Advisory Board</h3>
            <p className="text-sm text-muted-foreground">Experienced advisors providing strategic guidance</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {advisors.map((advisor, idx) => (
            <TeamMemberCard key={idx} member={advisor} isAdvisor />
          ))}
        </div>

        {/* Upcoming Advisors */}
        <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-900/50 dark:to-slate-800/30 border border-slate-200/50 dark:border-slate-700/50 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <h4 className="font-medium text-foreground">Additional advisors currently in formation to support:</h4>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {upcomingAdvisoryAreas.map((area, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-3 p-3 rounded-lg bg-white/60 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/30"
              >
                <area.icon className="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{area.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
