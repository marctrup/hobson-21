import React from "react";
import { Brain, Building2, ShieldCheck } from "lucide-react";

const groups = [
  { id: "document-intelligence", label: "Document Intelligence", icon: Brain },
  { id: "portfolio-tools", label: "Portfolio Tools", icon: Building2 },
  { id: "trust-and-security", label: "Trust & Security", icon: ShieldCheck },
];

const FeaturesAnchorNav = () => (
  <nav className="py-6 border-b border-border/50 bg-background sticky top-0 z-30">
    <div className="container mx-auto px-4">
      <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
        {groups.map((g) => (
          <a
            key={g.id}
            href={`#${g.id}`}
            className="flex items-center gap-2 text-sm sm:text-base font-medium text-muted-foreground hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-muted/50"
          >
            <g.icon className="w-4 h-4" />
            {g.label}
          </a>
        ))}
      </div>
    </div>
  </nav>
);

export default FeaturesAnchorNav;
