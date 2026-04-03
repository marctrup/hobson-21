import React from "react";
import type { LucideIcon } from "lucide-react";

interface FeatureBlockProps {
  name: string;
  problem: string;
  does: string;
  matters: string;
  icon: LucideIcon;
  reversed?: boolean;
}

const FeatureBlock: React.FC<FeatureBlockProps> = ({
  name,
  problem,
  does,
  matters,
  icon: Icon,
  reversed = false,
}) => (
  <div
    className={`flex flex-col ${reversed ? "lg:flex-row-reverse" : "lg:flex-row"} gap-8 lg:gap-14 items-start`}
  >
    {/* Icon + Feature Name column */}
    <div className="lg:w-2/5 flex-shrink-0">
      <div className="flex items-start gap-4 mb-4 lg:sticky lg:top-28">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-foreground pt-2">
          {name}
        </h3>
      </div>
    </div>

    {/* Content column */}
    <div className="lg:w-3/5 space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-primary/70 mb-2">
          The problem it solves
        </p>
        <p className="text-base text-muted-foreground leading-relaxed">
          {problem}
        </p>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-primary/70 mb-2">
          What Hobson does
        </p>
        <p className="text-base text-foreground leading-relaxed">
          {does}
        </p>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-primary/70 mb-2">
          Why it matters
        </p>
        <p className="text-base text-muted-foreground leading-relaxed italic">
          {matters}
        </p>
      </div>
    </div>
  </div>
);

export default FeatureBlock;
