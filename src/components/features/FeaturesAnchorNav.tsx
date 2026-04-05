import React, { useEffect, useState, useRef, useCallback } from "react";
import { Brain, Building2, ShieldCheck } from "lucide-react";

const groups = [
  { id: "document-intelligence", label: "Document Intelligence", icon: Brain },
  { id: "portfolio-tools", label: "Portfolio Tools", icon: Building2 },
  { id: "trust-and-security", label: "Trust & Security", icon: ShieldCheck },
];

const FeaturesAnchorNav = () => {
  const [activeId, setActiveId] = useState(groups[0].id);
  const clickLockRef = useRef(false);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    groups.forEach((g) => {
      const el = document.getElementById(g.id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !clickLockRef.current) {
            setActiveId(g.id);
          }
        },
        { rootMargin: "-20% 0px -60% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const handleClick = useCallback((e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setActiveId(id);
    clickLockRef.current = true;

    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }

    // Release lock after scroll settles
    setTimeout(() => {
      clickLockRef.current = false;
    }, 800);
  }, []);

  return (
    <nav
      className="py-3 border-b border-border/40 bg-background/95 backdrop-blur-sm sticky top-0 z-30 shadow-sm"
      aria-label="Feature sections"
    >
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex items-center justify-center gap-1">
          {groups.map((g, i) => {
            const isActive = activeId === g.id;
            return (
              <React.Fragment key={g.id}>
                {i > 0 && (
                  <span className="text-border mx-2 select-none" aria-hidden="true">·</span>
                )}
                <a
                  href={`#${g.id}`}
                  onClick={(e) => handleClick(e, g.id)}
                  className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full transition-all duration-200 ${
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <g.icon className="w-3.5 h-3.5" />
                  {g.label}
                </a>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default FeaturesAnchorNav;
