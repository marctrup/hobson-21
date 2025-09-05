import React from 'react';

interface SmilingDocumentProps {
  className?: string;
}

export const SmilingDocument: React.FC<SmilingDocumentProps> = ({ className = "" }) => {
  return (
    <div className={`relative inline-block ${className}`}>
      {/* Document shape */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full"
      >
        {/* Document outline */}
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14,2 14,8 20,8" />
        
        {/* Eyes */}
        <circle cx="9" cy="12" r="0.5" fill="currentColor" />
        <circle cx="15" cy="12" r="0.5" fill="currentColor" />
        
        {/* Smile */}
        <path d="M8.5 16c1 1 3 1 7 0" strokeWidth="1.5" fill="none" />
      </svg>
    </div>
  );
};