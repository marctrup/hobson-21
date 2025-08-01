export const HowItWorksSection = () => {
  const steps = [
    {
      step: 1,
      title: "Upload & Connect",
      description: "Upload your documents or connect your existing systems. Our AI instantly begins processing and indexing your content."
    },
    {
      step: 2,
      title: "Ask Questions",
      description: "Ask natural language questions about your properties, leases, contracts, or any document content."
    },
    {
      step: 3,
      title: "Get Insights",
      description: "Receive instant, accurate answers with full source citations and actionable recommendations."
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">How It Works</h2>
            <p className="text-xl text-muted-foreground">Get started in three simple steps</p>
          </div>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20"></div>
            
            <div className="grid md:grid-cols-3 gap-12">
              {steps.map((item, index) => (
                <div key={index} className="relative group text-center">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};