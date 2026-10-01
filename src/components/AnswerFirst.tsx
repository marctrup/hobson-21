interface AnswerFirstProps {
  /** One self-contained answer, 40-60 words, readable out of context. */
  children: React.ReactNode;
  className?: string;
  /**
   * "manuscript" renders the editorial-manuscript layout: a small brass label
   * with a hairline rule, then the answer set larger in italic serif inside a
   * square-cornered stationery card. The default keeps the original compact
   * rounded card used across the other pages.
   */
  variant?: "default" | "manuscript";
}

/**
 * Answer-first summary block. Sits directly beneath the page hero so that an
 * answer engine can lift a complete, quotable answer from the first lines of
 * the page without stitching sentences together.
 */
export const AnswerFirst = ({
  children,
  className = "",
  variant = "default",
}: AnswerFirstProps) => {
  if (variant === "manuscript") {
    return (
      <div className={className}>
        <header className="mb-6 flex items-center gap-4">
          <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brass-text">
            In short
          </span>
          <div className="h-px flex-grow bg-bone" aria-hidden="true" />
        </header>
        <div className="border border-bone bg-document-white px-7 py-8 shadow-[0_4px_20px_-12px_rgba(45,45,45,0.12)] sm:px-10 sm:py-10">
          <p className="font-serif text-xl italic leading-relaxed text-ink sm:text-2xl">
            {children}
          </p>
        </div>
      </div>
    );
  }

  return (
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
};
