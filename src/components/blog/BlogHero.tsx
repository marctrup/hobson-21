export const BlogHero = () => {
  return (
    <section
      className="blog-hero relative overflow-hidden pt-10 sm:pt-12 pb-8 sm:pb-10"
      style={{
        backgroundColor: '#F1EBDE',
        borderBottom: '1px solid rgba(180,145,79,0.2)',
      }}
    >
      <div className="mx-auto max-w-3xl px-6 text-center relative">
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.24em] mb-4"
          style={{ color: '#B4914F' }}
        >
          Blog
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-foreground leading-tight">
          Industry <span style={{ color: '#B4914F' }}>Insights</span>
        </h1>
        <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Expert perspectives on AI-powered property management, industry trends,
          and best practices for property operators, occupiers and owners.
        </p>
        <div className="mx-auto mt-10 h-px w-24" style={{ backgroundColor: '#F7EDDC' }} />
      </div>
    </section>
  );
};
