export const BlogHero = () => {
  return (
    <section
      className="blog-hero relative overflow-hidden pt-6 sm:pt-8 pb-5 sm:pb-6"
      style={{
        backgroundColor: '#F1EBDE',
        borderBottom: '1px solid rgba(180,145,79,0.2)',
      }}
    >
      <div className="container mx-auto px-4 text-center relative max-w-3xl">
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.24em] mb-2"
          style={{ color: '#B4914F' }}
        >
          Blog
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-foreground">
          Industry <span style={{ color: '#B4914F' }}>Insights</span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Expert perspectives on AI-powered property management, industry trends,
          and best practices for property operators, occupiers and owners.
        </p>
      </div>
    </section>
  );
};

