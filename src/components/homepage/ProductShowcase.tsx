import React, { memo } from "react";
import { Check } from "lucide-react";
import hobsonUnitInterface from "@/assets/hobson-unit-interface.png";
import mobileChatImg from "@/assets/hobson-mobile-chat.png";

const highlights = [
  {
    title: "One conversation",
    body: "Speak naturally with Hobson.",
  },
  {
    title: "Interactive portfolio",
    body: "See your properties come alive on the map.",
  },
  {
    title: "Available everywhere",
    body: "Move seamlessly between desktop and mobile.",
  },
];

const ProductShowcase = memo(() => {
  return (
    <section
      className="py-10 sm:py-14 bg-background"
      aria-labelledby="product-showcase-heading"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-8 sm:mb-10">
            <h2
              id="product-showcase-heading"
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in"
            >
              One conversation.{" "}
              <span className="text-primary">Everywhere you work.</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Whether you're at your desk or on site, Hobson keeps your
              conversation, documents and portfolio together in one simple
              experience.
            </p>
          </div>

          {/* Composite device showcase */}
          <div className="relative mx-auto max-w-4xl px-2 sm:px-6 pb-10 sm:pb-14">
            {/* Soft ambient glow */}
            <div
              className="absolute -inset-x-8 -inset-y-6 bg-gradient-to-br from-primary/10 via-transparent to-accent-teal/10 blur-3xl rounded-full pointer-events-none"
              aria-hidden="true"
            />

            {/* Desktop frame */}
            <div
              className="relative rounded-2xl border border-border/60 shadow-2xl shadow-primary/15 overflow-hidden bg-card animate-fade-in"
              style={{ animationDelay: "100ms", animationFillMode: "backwards" }}
            >
              {/* Crop the leftmost nav rail (~6%) so chat + map are the focus */}
              <div className="overflow-hidden">
                <img
                  src={hobsonUnitInterface}
                  alt="Hobson AI desktop — conversational chat alongside an interactive property map"
                  className="w-[107%] h-auto block -ml-[6%]"
                  decoding="async"
                  fetchPriority="high"
                />
              </div>
            </div>

            {/* Phone overlapping the lower-right corner of the desktop, hanging off the edge */}
            <div
              className="absolute right-[-1%] sm:right-[2%] bottom-0 w-[26%] sm:w-[24%] max-w-[210px] min-w-[120px] animate-slide-up"
              style={{ animationDelay: "350ms", animationFillMode: "backwards" }}
            >
              <div className="relative rounded-[1.2rem] sm:rounded-[1.6rem] border-[3px] sm:border-[5px] border-foreground/90 bg-foreground/90 shadow-2xl shadow-primary/30 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[38%] h-2.5 sm:h-3 bg-foreground/90 rounded-b-xl z-20" />
                <div className="relative w-full aspect-[9/19.5] overflow-hidden rounded-[0.95rem] sm:rounded-[1.25rem] bg-background">
                  <img
                    src={mobileChatImg}
                    alt="Hobson AI mobile chat"
                    className="absolute inset-0 w-full h-full object-cover object-top"
                    decoding="async"
                  />
                </div>
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[35%] h-[2px] bg-white/40 rounded-full z-20" />
              </div>
            </div>
          </div>

          {/* Feature highlights — captions under the product */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-8 mt-2">
            {highlights.map((h, i) => (
              <div
                key={h.title}
                className="flex items-start gap-3 animate-fade-in"
                style={{
                  animationDelay: `${600 + i * 120}ms`,
                  animationFillMode: "backwards",
                }}
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                  <Check
                    className="w-3.5 h-3.5 text-primary"
                    strokeWidth={2.5}
                  />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm sm:text-base">
                    {h.title}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">
                    {h.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.7s ease-out;
        }
      `}</style>
    </section>
  );
});

ProductShowcase.displayName = "ProductShowcase";

export default ProductShowcase;
