export const BlogHero = () => {
  return (
    <section
      className="blog-hero relative overflow-hidden pt-16 sm:pt-20 pb-12 sm:pb-14"
      style={{
        backgroundColor: '#F1EBDE',
        borderBottom: '1px solid rgba(180,145,79,0.2)',
      }}
    >
      <div className="container mx-auto px-4 text-center relative max-w-3xl">
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.24em] mb-4"
          style={{ color: '#B4914F' }}
        >
          Blog
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight">
          Industry <span style={{ color: '#B4914F' }}>Insights</span>
        </h1>
        <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Expert perspectives on AI-powered property management, industry trends,
          and best practices for property operators, occupiers and owners.
        </p>
        <div className="mx-auto mt-10 h-px w-24" style={{ backgroundColor: '#EDE7DA' }} />
      </div>
    </section>
  );
};
