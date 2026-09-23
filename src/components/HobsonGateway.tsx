import React from "react";

const APP_URL = "https://app.hobsonschoice.ai";

export const serifStack = { fontFamily: 'Georgia, "Times New Roman", ui-serif, serif' };

/**
 * HobsonGateway — the invitation that replaces a "Login" button.
 * Hobson alone speaks, in the first person: calm, prepared, no CRM clichés.
 * Reads unmistakably as a button: framed, filled on hover, arrow that answers.
 */
export const HobsonGateway = ({ className = "" }: { className?: string }) => (
  <a
    href={APP_URL}
    aria-label="This way, please — enter Hobson"
    className={`group inline-flex items-center gap-3 rounded-none border border-ink/25 bg-paper px-4 py-2 leading-tight shadow-[0_1px_0_rgba(45,45,45,0.06)] outline-none transition-all duration-500 hover:border-brass hover:bg-bone-wash hover:shadow-[0_2px_8px_rgba(45,45,45,0.10)] focus-visible:ring-2 focus-visible:ring-brass/60 ${className}`}
  >
    <span className="relative text-[15px] text-ink italic font-bold leading-none tracking-tight" style={serifStack}>
      This way, please
      <span
        aria-hidden="true"
        className="absolute -bottom-1.5 left-0 h-px w-6 bg-brass/60 transition-all duration-500 group-hover:w-full group-hover:bg-brass"
      />
    </span>
    <span
      aria-hidden="true"
      className="text-brass transition-transform duration-500 group-hover:translate-x-1"
    >
      →
    </span>
  </a>
);

export const HobsonGatewayMobile = ({ onClick }: { onClick?: () => void }) => (
  <a
    href={APP_URL}
    aria-label="This way, please — enter Hobson"
    onClick={onClick}
    className="group inline-flex w-full max-w-xs items-center justify-between gap-3 rounded-none border border-ink/25 bg-paper px-4 py-3 leading-tight shadow-[0_1px_0_rgba(45,45,45,0.06)] outline-none transition-all duration-500 hover:border-brass hover:bg-bone-wash hover:shadow-[0_2px_8px_rgba(45,45,45,0.10)] focus-visible:ring-2 focus-visible:ring-brass/60"
  >
    <span className="relative text-[17px] text-ink italic font-bold leading-none tracking-tight" style={serifStack}>
      This way, please
      <span
        aria-hidden="true"
        className="absolute -bottom-1.5 left-0 h-px w-6 bg-brass/60 transition-all duration-500 group-hover:w-full group-hover:bg-brass"
      />
    </span>
    <span
      aria-hidden="true"
      className="text-brass transition-transform duration-500 group-hover:translate-x-1"
    >
      →
    </span>
  </a>
);
