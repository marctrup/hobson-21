import owlMascot from "@/assets/hobson-saluting.png.asset.json";

export const TrustedConversationSection = () => (
  <section className="py-10 sm:py-14 bg-background" aria-labelledby="trusted-heading">
    <div className="container mx-auto px-4">
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-5 sm:gap-8 text-center sm:text-left">
        <img loading="lazy" decoding="async" width={105} height={105} src={owlMascot.url} alt="Hobson the owl saluting" className="w-[88px] h-[88px] sm:w-[105px] sm:h-[105px] shrink-0 object-contain" />
        <div>
          <h2 id="trusted-heading" className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            A quiet team behind me.
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            You speak only to me. My colleagues quietly help me read your papers, organise your portfolio and prepare your work.
          </p>
        </div>
      </div>
    </div>
  </section>
);
