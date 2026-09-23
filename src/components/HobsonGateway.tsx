import React from "react";

const APP_URL = "https://app.hobsonschoice.ai";

const serifStack = { fontFamily: 'Georgia, "Times New Roman", ui-serif, serif' };

/**
 * HobsonGateway — the quiet invitation that replaces a "Login" button.
 * Hobson alone speaks: calm, prepared, no CRM clichés.
 */
export const HobsonGateway = ({ className = "" }: { className?: string }) => (
  <a
    href={APP_URL}
    aria-label="Hobson is expecting you — enter Hobson"
    className={`group flex flex-col items-end leading-tight outline-none focus-visible:ring-2 focus-visible:ring-brass/60 ${className}`}
  >
    <span className="text-[9px] uppercase tracking-[0.3em] text-brass-text font-montserrat leading-none opacity-80 group-hover:opacity-100 transition-opacity duration-500">
      Entry
    </span>
    <span
      className="relative pb-1.5 mt-1 text-lg text-ink italic font-normal leading-none tracking-tight"
      style={serifStack}
    >
      Hobson is expecting you
      <span
        aria-hidden="true"
        className="absolute bottom-0 right-0 h-px w-8 bg-brass transition-all duration-500 group-hover:w-full"
      />
    </span>
    <span
      className="text-[11px] text-ink-muted italic tracking-wide leading-none mt-0.5"
      style={serifStack}
    >
      Everything is in hand
    </span>
  </a>
);

export const HobsonGatewayMobile = ({ onClick }: { onClick?: () => void }) => (
  <a
    href={APP_URL}
    aria-label="Hobson is expecting you — enter Hobson"
    onClick={onClick}
    className="group flex flex-col items-start py-2 leading-tight outline-none focus-visible:ring-2 focus-visible:ring-brass/60"
  >
    <span className="text-[9px] uppercase tracking-[0.3em] text-brass-text font-montserrat leading-none opacity-80 group-hover:opacity-100 transition-opacity duration-500">
      Entry
    </span>
    <span
      className="relative pb-1.5 mt-1 text-xl text-ink italic font-normal leading-none tracking-tight"
      style={serifStack}
    >
      Hobson is expecting you
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-px w-8 bg-brass transition-all duration-500 group-hover:w-full"
      />
    </span>
    <span
      className="text-[11px] text-ink-muted italic tracking-wide leading-none mt-0.5"
      style={serifStack}
    >
      Everything is in hand
    </span>
  </a>
);
