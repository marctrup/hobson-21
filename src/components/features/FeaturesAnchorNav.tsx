import React from "react";
import { Brain, Building2, ShieldCheck } from "lucide-react";

const groups = [
  { id: "document-intelligence", label: "Document Intelligence", icon: Brain },
  { id: "portfolio-tools", label: "Portfolio Tools", icon: Building2 },
  { id: "trust-and-security", label: "Trust & Security", icon: ShieldCheck },
];

const FeaturesAnchorNav = () => (
  <nav className="py-4 border-b border-border/40 bg-background/95 backdrop-blur-sm sticky top-0 z-30" aria-label="Feature sections">
    <div className="container mx-auto px-4 max-w-3xl">
      <div className="flex flex-wrap justify-start gap-6">
        {groups.map((g) => (
          <a
            key={g.id}
            href={`#${g.id}`}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <g.icon className="w-3.5 h-3.5" />
            {g.label}
          </a>
        ))}
      </div>
    </div>
  </nav>
);

export default FeaturesAnchorNav;
