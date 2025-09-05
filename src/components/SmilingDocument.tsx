import React from 'react';

interface SmilingDocumentProps {
  className?: string;
}

export const SmilingDocument: React.FC<SmilingDocumentProps> = ({ className = "h-12 w-12" }) => {
  return (
    <svg
      viewBox="0 0 100 120"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Document body */}
      <path
        d="M20 10 C20 5 25 0 30 0 L70 0 C75 0 80 5 80 10 L80 110 C80 115 75 120 70 120 L30 120 C25 120 20 115 20 110 Z"
        fill="hsl(var(--primary))"
        opacity="0.9"
      />
      
      {/* Document lines */}
      <rect x="30" y="25" width="40" height="3" rx="1.5" fill="hsl(var(--primary-foreground))" opacity="0.7" />
      <rect x="30" y="35" width="35" height="2" rx="1" fill="hsl(var(--primary-foreground))" opacity="0.5" />
      <rect x="30" y="85" width="40" height="2" rx="1" fill="hsl(var(--primary-foreground))" opacity="0.5" />
      <rect x="30" y="95" width="30" height="2" rx="1" fill="hsl(var(--primary-foreground))" opacity="0.5" />
      
      {/* Eyes */}
      <circle cx="40" cy="50" r="4" fill="hsl(var(--primary-foreground))" />
      <circle cx="60" cy="50" r="4" fill="hsl(var(--primary-foreground))" />
      <circle cx="41" cy="49" r="1.5" fill="hsl(var(--primary))" />
      <circle cx="61" cy="49" r="1.5" fill="hsl(var(--primary))" />
      
      {/* Mouth */}
      <path
        d="M40 65 Q50 75 60 65"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Tongue (playful element) */}
      <ellipse cx="50" cy="72" rx="3" ry="2" fill="#ef4444" opacity="0.8" />
      
      {/* Cheek blush */}
      <ellipse cx="32" cy="55" rx="3" ry="2" fill="hsl(var(--primary-foreground))" opacity="0.3" />
      <ellipse cx="68" cy="55" rx="3" ry="2" fill="hsl(var(--primary-foreground))" opacity="0.3" />
    </svg>
  );
};