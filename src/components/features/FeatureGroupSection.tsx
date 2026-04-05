import React from "react";
import type { LucideIcon } from "lucide-react";
import FeatureBlock from "./FeatureBlock";

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
}

const FeatureGroupSection: React.FC<FeatureGroupSectionProps> = ({
  id,
  title,
  subtitle,
  icon: GroupIcon,
  features,
  bgClass = "bg-background",
  chapterOffset = 0,
  startOnMuted = false,
}) => (
  <section id={id} className="scroll-mt-20">
    {/* Group intro */}
    <div className={`pt-14 sm:pt-20 pb-6 sm:pb-8 ${bgClass}`}>
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <GroupIcon className="w-4.5 h-4.5 text-primary" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-primary/80">
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
            />
          </div>
        </div>
      );
    })}
  </section>
);

export default FeatureGroupSection;
