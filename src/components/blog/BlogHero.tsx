export const BlogHero = () => {
  return (
    <section className="blog-hero bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 md:py-20 pb-4 md:pb-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-6xl font-bold text-foreground mb-4 md:mb-6">
          Industry Insights
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 md:mb-8">
          Expert perspectives on AI-powered property management, industry trends, 
          and best practices for modern real estate professionals.
        </p>
      </div>
    </section>
  );
};