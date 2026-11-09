export const BlogHero = () => {
  return (
    <section
      className="blog-hero relative overflow-hidden pt-10 sm:pt-12 pb-8 sm:pb-10"
      style={{
        backgroundColor: 'var(--bone-wash)',
        borderBottom: '1px solid hsl(var(--highlight-colour) / 0.2)',
      }}
    >
      <div className="mx-auto max-w-3xl px-6 text-center relative">
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.24em] mb-4"
          style={{ color: 'var(--brass)' }}
        >
          My journal
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-foreground leading-tight">
          Notes from <span style={{ color: 'var(--brass)' }}>my desk</span>
        </h1>
        <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          What we have learned from working with our clients, operators,
          occupiers and owners.
        </p>
        <div className="mx-auto mt-10 h-px w-24" style={{ backgroundColor: 'var(--bone-wash)' }} />
      </div>
    </section>
  );
};
