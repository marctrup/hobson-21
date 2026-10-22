import { serifStack } from "@/components/HobsonGateway";

/**
 * Only genuine remarks belong here. Nothing is invented: no names, companies,
 * photographs, ratings or statistics. When a further remark is approved, add it
 * to this collection with the weight it deserves — "primary" for remarks that
 * carry a practical benefit, "secondary" for quieter encouragement. The layout
 * below reads straight from the collection, so no other change is required.
 */
type Testimonial = {
  quote: string;
  attribution: string;
  weight: "primary" | "secondary";
};

const testimonials: Testimonial[] = [
  {
    quote:
      "Just used Hobson for the first time as I was updating a tenancy schedule and it was brilliant. Just a simple inquiry, but it means I don’t have to reopen the lease. It saves time.",
    attribution: "Early customer feedback",
    weight: "primary",
  },
  {
    quote: "I was very impressed by where you have got to.",
    attribution: "CEO",
    weight: "secondary",
  },
];

const primary = testimonials.filter((t) => t.weight === "primary");
const secondary = testimonials.filter((t) => t.weight === "secondary");

export const TestimonialSection = () => (
  <section
    className="py-20 sm:py-24 md:py-28 border-y border-bone"
    style={{ background: "#F1EBDE" }}
    aria-labelledby="testimonial-heading"
  >
    <div className="container mx-auto px-4">
      <div className="max-w-3xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-14 sm:mb-18">
          <span
            className="inline-block text-xs font-semibold tracking-[0.2em] uppercase mb-4"
            style={{ color: "#8E7133" }}
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

        {/* The remarks, in one quiet measure */}
        <div className="space-y-12 sm:space-y-16">
          {/* The remark that carries a practical benefit */}
          {primary.map((t) => (
            <figure
              key={t.quote}
              className="border-l-2 pl-6 sm:pl-9"
              style={{ borderColor: "#B4914F" }}
            >
              <blockquote
                className="font-serif italic text-xl sm:text-2xl lg:text-[1.75rem] leading-[1.5] text-foreground [text-wrap:balance]"
                style={serifStack}
              >
                “{t.quote}”
              </blockquote>
              <figcaption
                className="mt-6 sm:mt-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em]"
                style={{ color: "#8E7133" }}
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

          {/* Quieter encouragement */}
          {secondary.map((t) => (
            <figure
              key={t.quote}
              className="border-t pt-10 sm:pt-12"
              style={{ borderColor: "#D8CDB6" }}
            >
              <blockquote
                className="font-serif italic text-lg sm:text-xl leading-relaxed [text-wrap:balance]"
                style={{ ...serifStack, color: "#56514A" }}
              >
                “{t.quote}”
              </blockquote>
              <figcaption
                className="mt-4 text-xs font-semibold uppercase tracking-[0.18em]"
                style={{ color: "#6E6A62" }}
              >
                {t.attribution}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  </section>
);
