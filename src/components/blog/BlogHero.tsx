export const BlogHero = () => {
  return (
    <section className="blog-hero bg-gradient-to-br from-primary/5 via-background to-accent-teal/5 py-2 md:py-8 pb-4 md:pb-16">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-4 md:mb-6">
          <h1 className="text-3xl md:text-6xl font-bold text-foreground">
            Industry{" "}
            <span className="bg-gradient-to-r from-primary via-accent-teal via-accent-amber to-accent-rose bg-clip-text text-transparent">
              Insights
            </span>
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
