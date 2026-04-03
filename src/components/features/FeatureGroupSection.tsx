import React from "react";
import type { LucideIcon } from "lucide-react";
import FeatureBlock from "./FeatureBlock";

interface Feature {
  name: string;
  problem: string;
  does: string;
  matters: string;
  icon: LucideIcon;
}

interface FeatureGroupSectionProps {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  features: Feature[];
  startReversed?: boolean;
}

const FeatureGroupSection: React.FC<FeatureGroupSectionProps> = ({
  id,
  title,
  subtitle,
  icon: GroupIcon,
  features,
  startReversed = false,
}) => (
  <section id={id} className="scroll-mt-20">
    {/* Group header */}
    <div className="py-12 sm:py-16 border-b border-border/30">
      <div className="container mx-auto px-4 max-w-5xl text-center">
        <div className="flex items-center justify-center gap-4 mb-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <GroupIcon className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
            {title}
          </h2>
        </div>
        <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
          {subtitle}
        </p>
      </div>
    </div>

    {/* Feature blocks */}
    <div className="container mx-auto px-4 max-w-5xl">
      {features.map((feature, index) => {
        const reversed = startReversed ? index % 2 === 0 : index % 2 === 1;
        return (
          <div key={feature.name}>
            <div className="py-12 sm:py-16">
              <FeatureBlock {...feature} reversed={reversed} />
            </div>
            {index < features.length - 1 && (
              <div className="border-b border-border/30" />
            )}
          </div>
        );
      })}
    </div>
  </section>
);

export default FeatureGroupSection;
