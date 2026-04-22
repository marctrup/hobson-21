import React from "react";
import type { LucideIcon } from "lucide-react";
import type { FeatureAccent } from "./FeatureGroupSection";

interface FeatureBlockProps {
  name: string;
  problem: string;
  does: string;
  matters: string;
  icon: LucideIcon;
  reversed?: boolean;
  extraContent?: React.ReactNode;
  chapterNumber?: number;
  accent?: FeatureAccent;
}

const ACCENT: Record<FeatureAccent, {
  bgSoft: string;
  text: string;
  border: string;
}> = {
  "primary": {
    bgSoft: "bg-primary/10",
    text: "text-primary",
    border: "border-primary",
  },
  "accent-teal": {
    bgSoft: "bg-accent-teal/10",
    text: "text-accent-teal",
    border: "border-accent-teal",
  },
  "accent-amber": {
    bgSoft: "bg-accent-amber/15",
    text: "text-accent-amber",
    border: "border-accent-amber",
  },
};

const FeatureBlock: React.FC<FeatureBlockProps> = ({
  name,
  problem,
  does,
  matters,
  icon: Icon,
  extraContent,
  chapterNumber,
  accent = "primary",
}) => {
  const a = ACCENT[accent];
  return (
    <article className="max-w-3xl mx-auto">
      {/* Chapter number + feature name */}
      <div className="flex items-start gap-4 mb-5">
        {chapterNumber !== undefined && (
          <div className={`flex-shrink-0 w-10 h-10 rounded-full ${a.bgSoft} flex items-center justify-center`}>
            <span className={`text-sm font-bold ${a.text}`}>
              {String(chapterNumber).padStart(2, "0")}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2.5 pt-1.5">
          <Icon className={`w-5 h-5 ${a.text} flex-shrink-0`} />
          <h3 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
            {name}
          </h3>
        </div>
      </div>

      {/* Narrative prose */}
      <div className="space-y-5 text-base sm:text-lg leading-relaxed pl-14">
        <p className="text-muted-foreground">
          {problem}
        </p>

        <p className="text-foreground">
          {does}
        </p>

        <blockquote className={`border-l-2 ${a.border} pl-5 py-1 my-6`}>
          <p className="text-foreground/90 font-medium italic">
            {matters}
          </p>
        </blockquote>

        {extraContent && <div>{extraContent}</div>}
      </div>
    </article>
  );
};

export default FeatureBlock;
