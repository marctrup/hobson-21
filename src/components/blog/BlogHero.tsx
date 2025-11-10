import owlMascot from "@/assets/owl-mascot.png";

export const BlogHero = () => {
  return (
    <section className="blog-hero bg-gradient-to-br from-primary/5 via-background to-accent/5 py-2 md:py-8 pb-4 md:pb-16">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-4 mb-4 md:mb-6">
          <img src={owlMascot} alt="Hobson AI Owl Mascot" className="w-16 h-16 sm:w-20 sm:h-20 object-contain" />
          <h1 className="text-3xl md:text-6xl font-bold text-foreground">
            Industry Insights
          </h1>
        </div>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 md:mb-8">
          Expert perspectives on AI-powered property management, industry trends, 
          and best practices for modern real estate professionals.
        </p>
      </div>
    </section>
  );
};