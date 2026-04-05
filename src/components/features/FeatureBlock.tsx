import React from "react";
import type { LucideIcon } from "lucide-react";

interface FeatureBlockProps {
  name: string;
  problem: string;
  does: string;
  matters: string;
  icon: LucideIcon;
  reversed?: boolean;
  extraContent?: React.ReactNode;
  chapterNumber?: number;
}

const FeatureBlock: React.FC<FeatureBlockProps> = ({
  name,
  problem,
  does,
  matters,
  icon: Icon,
  extraContent,
  chapterNumber,
}) => (
  <article className="max-w-3xl mx-auto">
    {/* Chapter number + feature name */}
    <div className="mb-8">
      {chapterNumber !== undefined && (
        <span className="text-sm font-mono tracking-widest text-primary/60 block mb-3">
          {String(chapterNumber).padStart(2, "0")}
        </span>
      )}
      <div className="flex items-center gap-3 mb-2">
        <Icon className="w-5 h-5 text-primary flex-shrink-0" />
        <h3 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
          {name}
        </h3>
      </div>
    </div>

    {/* Narrative prose — flows as a story */}
    <div className="space-y-5 text-base sm:text-lg leading-relaxed">
      <p className="text-muted-foreground">
        {problem}
      </p>

      <p className="text-foreground">
        {does}
      </p>

      {/* Pull-quote for "why it matters" */}
      <blockquote className="border-l-2 border-primary pl-5 py-1 my-6">
        <p className="text-foreground/90 font-medium italic">
          {matters}
        </p>
      </blockquote>

      {extraContent && <div>{extraContent}</div>}
    </div>
  </article>
);

export default FeatureBlock;
