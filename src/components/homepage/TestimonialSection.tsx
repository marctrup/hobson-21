import { serifStack } from "@/components/HobsonGateway";

/**
 * Only genuine remarks belong here. Nothing is invented: no names, companies,
 * photographs, ratings or statistics. Every remark is treated alike — the same
 * type size, the same rule, the same caption — because none outweighs another.
 * Add a further remark to the collection and it joins the pair on equal terms.
 */
type Testimonial = {
  quote: string;
  attribution: string;
};

const testimonials: Testimonial[] = [
  {
    quote: "I was very impressed by where you have got to.",
    attribution: "CEO of a large central London commercial agent",
  },
  {
    quote:
      "Just used Hobson for the first time as I was updating a tenancy schedule and it was brilliant. Just a simple inquiry, but it means I don’t have to reopen the lease. It saves time.",
    attribution: "CEO of a Family Office",
  },
];

export const TestimonialSection = () => (
  <section
    className="py-20 sm:py-24 md:py-28 border-y border-bone"
    style={{ background: "#F1EBDE" }}
    aria-labelledby="testimonial-heading"
  >
    <div className="container mx-auto px-4">
      {/* Heading */}
      <div className="text-center mb-14 sm:mb-16">
        <span
          className="inline-block text-xs font-semibold tracking-[0.2em] uppercase mb-4"
          style={{ color: "#7A5C22" }}
        >
          In their words
        </span>
        <h2
          id="testimonial-heading"
          className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4"
        >
          Two things people have said{" "}
          <span style={{ color: "#B4914F" }}>to me.</span>
        </h2>
        <p
          className="text-base sm:text-lg leading-relaxed max-w-xl mx-auto"
          style={{ color: "#56514A" }}
        >
          I would rather show you two honest remarks than a wall of praise.
        </p>
      </div>

      {/* Two remarks, neither above the other */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 md:divide-x md:divide-[#D8CDB6] gap-12 md:gap-0">
        {testimonials.map((t) => (
          <figure
            key={t.quote}
            className="px-0 md:px-10 lg:px-14 flex flex-col"
          >
            <span
              aria-hidden="true"
              className="font-serif leading-none text-5xl sm:text-6xl select-none"
              style={{ ...serifStack, color: "#B4914F" }}
            >
              “
            </span>
            <blockquote
              className="font-serif italic text-xl sm:text-2xl leading-[1.5] text-foreground [text-wrap:balance] mt-3"
              style={serifStack}
            >
              {t.quote}
            </blockquote>
            <figcaption
              className="mt-auto pt-6 border-t flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em]"
              style={{ borderColor: "#D8CDB6", color: "#7A5C22" }}
            >
              <span
                aria-hidden="true"
                className="inline-block h-px w-8"
                style={{ background: "#B4914F" }}
              />
              {t.attribution}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
);
