export const BlogHero = () => {
  return (
    <section
      className="blog-hero relative overflow-hidden py-2 md:py-8 pb-4 md:pb-16"
      style={{ background: '#FCFAF7' }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 40%, rgba(180,145,79,0.10) 0%, transparent 60%)',
        }}
      />
      <div className="container mx-auto px-4 text-center relative">
        <div className="mb-4 md:mb-6">
          <h1 className="text-3xl md:text-6xl font-bold text-foreground">
            Industry{" "}
            <span style={{ color: '#B4914F' }}>Insights</span>
          </h1>
        </div>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 md:mb-8">
          Expert perspectives on AI-powered property management, industry trends,
          and best practices for property operators, occupiers and owners.
        </p>
      </div>
    </section>
  );
};
