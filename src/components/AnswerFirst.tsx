interface AnswerFirstProps {
  /** One self-contained answer, 40-60 words, readable out of context. */
  children: React.ReactNode;
  className?: string;
}

/**
 * Answer-first summary block. Sits directly beneath the page hero so that an
 * answer engine can lift a complete, quotable answer from the first lines of
 * the page without stitching sentences together.
 */
export const AnswerFirst = ({ children, className = "" }: AnswerFirstProps) => (
  <div
    className={`mx-auto mt-8 max-w-2xl rounded-2xl px-6 py-5 text-left ${className}`}
    style={{
      backgroundColor: "#FFFFFF",
      border: "1px solid #E8E1D4",
    }}
  >
    <p
      className="text-[11px] font-semibold uppercase tracking-[0.24em]"
      style={{ color: "#B4914F" }}
    >
      In short
    </p>
    <p
      className="mt-3 text-[15px] sm:text-base leading-relaxed"
      style={{ color: "#2D2D2D" }}
    >
      {children}
    </p>
  </div>
);
