import React from "react";
import type { LucideIcon } from "lucide-react";
import FeatureBlock from "./FeatureBlock";

export type FeatureAccent = "primary" | "accent-teal" | "accent-amber";

interface Feature {
  name: string;
  problem: string;
  does: string;
  matters: string;
  icon: LucideIcon;
  extraContent?: React.ReactNode;
}

interface FeatureGroupSectionProps {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  features: Feature[];
  startReversed?: boolean;
  bgClass?: string;
  chapterOffset?: number;
  startOnMuted?: boolean;
  accent?: FeatureAccent;
}

// Tailwind-safe class maps (must be literal strings so JIT picks them up)
const ACCENT_CLASSES: Record<FeatureAccent, {
  bgSoft: string;
  text: string;
  textSoft: string;
}> = {
  "primary": {
    bgSoft: "bg-primary/10",
    text: "text-primary",
    textSoft: "text-primary/80",
  },
  "accent-teal": {
    bgSoft: "bg-accent-teal/10",
    text: "text-accent-teal",
    textSoft: "text-accent-teal/80",
  },
  "accent-amber": {
    bgSoft: "bg-accent-amber/15",
    text: "text-accent-amber",
    textSoft: "text-accent-amber/90",
  },
};

const FeatureGroupSection: React.FC<FeatureGroupSectionProps> = ({
  id,
  title,
  subtitle,
  icon: GroupIcon,
  features,
  bgClass = "bg-background",
  chapterOffset = 0,
  startOnMuted = false,
  accent = "primary",
}) => {
  const a = ACCENT_CLASSES[accent];
  return (
    <section id={id} className="scroll-mt-20">
      {/* Group intro */}
      <div className={`pt-14 sm:pt-20 pb-6 sm:pb-8 ${bgClass}`}>
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-9 h-9 rounded-lg ${a.bgSoft} flex items-center justify-center`}>
              <GroupIcon className={`w-4.5 h-4.5 ${a.text}`} />
            </div>
            <h2 className={`text-xl sm:text-2xl font-bold uppercase tracking-wide ${a.textSoft}`}>
              {title}
            </h2>
          </div>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Feature chapters with alternating backgrounds */}
      {features.map((feature, index) => {
        const isMuted = startOnMuted ? index % 2 === 0 : index % 2 === 1;
        return (
          <div key={feature.name} className={isMuted ? "bg-muted/30" : "bg-background"}>
            <div className="container mx-auto px-4 py-8 sm:py-10">
              <FeatureBlock
                {...feature}
                chapterNumber={chapterOffset + index + 1}
                accent={accent}
              />
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default FeatureGroupSection;
