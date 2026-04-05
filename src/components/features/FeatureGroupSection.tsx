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
}

const FeatureGroupSection: React.FC<FeatureGroupSectionProps> = ({
  id,
  title,
  subtitle,
  icon: GroupIcon,
  features,
  bgClass = "bg-background",
  chapterOffset = 0,
}) => (
  <section id={id} className={`scroll-mt-20 ${bgClass}`}>
    {/* Group intro — tighter spacing */}
    <div className="pt-14 sm:pt-20 pb-6 sm:pb-8">
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

    {/* Feature chapters */}
    <div className="container mx-auto px-4">
      {features.map((feature, index) => (
        <div key={feature.name}>
          <div className="py-8 sm:py-10">
            <FeatureBlock
              {...feature}
              chapterNumber={chapterOffset + index + 1}
            />
          </div>
          {index < features.length - 1 && (
            <hr className="max-w-3xl mx-auto border-border/30" />
          )}
        </div>
      ))}
    </div>
  </section>
);

export default FeatureGroupSection;
