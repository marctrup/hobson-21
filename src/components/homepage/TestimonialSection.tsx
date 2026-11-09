import { serifStack } from "@/components/HobsonGateway";

/**
 * Only genuine remarks belong here. Nothing is invented: no names, companies,
 * photographs, ratings or statistics. Every remark is treated alike — the same
 * type size, the same rule, the same caption — because none outweighs another.
 * Add a further remark to the collection and it joins the rest on equal terms.
 *
 * A remark may be written in several paragraphs: separate them with a blank
 * line and each is set as its own paragraph, in the order it was given.
 */
type Testimonial = {
  quote: string;
  attribution: string;
};

const testimonials: Testimonial[] = [
  {
    quote: "Walking down the street, I saw our building and wanted to know the next break. I used my phone and asked Hobson. Amazing",
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
    style={{ background: "var(--paper)" }}
    aria-labelledby="testimonial-heading"
  >
    <div className="container mx-auto px-4">
      {/* Heading */}
      <div className="text-center mb-14 sm:mb-16">
        <span
          className="inline-block text-xs font-semibold tracking-[0.2em] uppercase mb-4"
          style={{ color: "var(--charcoal)" }}
        >
          In their words
        </span>
        <h2
          id="testimonial-heading"
          className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4"
        >
          Two things people have said{" "}
          <span className="text-foreground">to me.</span>
        </h2>
        <p
          className="text-base sm:text-lg leading-relaxed max-w-xl mx-auto"
          style={{ color: "var(--charcoal)" }}
        >
          I would rather show you two honest remarks than a wall of praise.
        </p>
      </div>

      {/* Two remarks, neither above the other */}
      <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-y-12 lg:gap-y-0 divide-y divide-bone-strong lg:divide-y-0 lg:divide-x">
        {testimonials.map((t) => (
          <figure
            key={t.attribution}
            className="flex flex-col pt-12 first:pt-0 lg:pt-0 lg:px-8 lg:first:pl-0 lg:last:pr-0"
          >
            <span
              aria-hidden="true"
              className="font-serif leading-none text-5xl sm:text-6xl select-none"
              style={{ ...serifStack, color: "var(--charcoal)" }}
            >
              “
            </span>
            <blockquote
              className="font-serif italic text-lg sm:text-xl leading-[1.5] text-foreground [text-wrap:balance] mt-3 space-y-4"
              style={serifStack}
            >
              {t.quote.split("\n\n").map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </blockquote>
            <figcaption
              className="mt-auto pt-6 border-t flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em]"
              style={{ borderColor: "var(--bone-strong)", color: "var(--charcoal)" }}
            >
              <span
                aria-hidden="true"
                className="inline-block h-px w-8"
                style={{ background: "var(--bone-strong)" }}
              />
              {t.attribution}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
);
