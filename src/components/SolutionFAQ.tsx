const BRASS = "#B4914F";
const INK = "#2D2D2D";
const MUTED = "#6E6A62";
const LAVENDER_BORDER = "#E8E1D4";

export type FAQItem = { question: string; answer: string };

interface SolutionFAQProps {
  eyebrow?: string;
  heading?: string;
  items: FAQItem[];
}

/**
 * Question-phrased Q&A block. Written answer-first so answer engines can
 * lift a complete response from the opening sentence.
 */
export const SolutionFAQ = ({
  eyebrow = "Questions people ask",
  heading = "Straight answers, before you talk to anyone.",
  items,
}: SolutionFAQProps) => (
  <section className="mx-auto max-w-4xl px-6 py-16">
    <div className="text-center">
      <p
        className="text-[11px] font-semibold uppercase tracking-[0.24em]"
        style={{ color: BRASS }}
      >
        {eyebrow}
      </p>
      <h2
        className="mt-4 font-serif text-3xl sm:text-4xl font-normal tracking-tight"
        style={{ color: INK }}
      >
        {heading}
      </h2>
    </div>

    <div className="mt-12 space-y-5">
      {items.map((item) => (
        <div
          key={item.question}
          className="rounded-[20px] p-7 bg-white"
          style={{ border: `1px solid ${LAVENDER_BORDER}` }}
        >
          <h3
            className="font-serif text-xl sm:text-2xl font-normal tracking-tight"
            style={{ color: INK }}
          >
            {item.question}
          </h3>
          <p className="mt-3 text-[16px] leading-relaxed" style={{ color: MUTED }}>
            {item.answer}
          </p>
        </div>
      ))}
    </div>
  </section>
);
