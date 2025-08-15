import { SimpleButton } from "@/components/ui/simple-button";
import { Link } from "react-router-dom";
import { HomepageHeader } from "@/components/homepage/HomepageHeader";
import { Users, Lightbulb, Target, Heart } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <HomepageHeader />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-l from-primary/15 to-transparent rounded-full blur-2xl animate-pulse delay-1000"></div>
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            
            <h1 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-primary via-primary-light to-primary bg-clip-text text-transparent animate-fade-in">
              About Us
            </h1>
            
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in">
              We're property professionals with a passion for technology and its potential to shape the future of our industry.
            </p>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">Our Story</h2>
            <p className="text-xl text-muted-foreground">How we went from problem to solution</p>
          </div>

          {/* Timeline Layout */}
          <div className="space-y-16">
            {/* Step 1 */}
            <div className="relative group">
              <div className="absolute left-8 top-0 w-0.5 h-full bg-gradient-to-b from-primary/50 to-transparent"></div>
              <div className="flex items-start gap-8">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary-light rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300 relative z-10">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-2xl font-bold text-foreground mb-4">The Problem We Faced</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                    After years of working in property management, we experienced firsthand how much time was wasted moving data between traditional systems. The inefficiency was frustrating and costly.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="absolute left-8 top-0 w-0.5 h-full bg-gradient-to-b from-primary/50 to-transparent"></div>
              <div className="flex items-start gap-8">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary-light rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300 relative z-10">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-2xl font-bold text-primary mb-4">The AI Breakthrough</h3>
                  <p className="text-xl font-semibold text-primary leading-relaxed max-w-2xl">
                    Then artificial intelligence changed everything. We realized we could build something that would actually understand property documents and work seamlessly with existing systems.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="flex items-start gap-8">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary-light rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300 relative z-10">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-2xl font-bold text-foreground mb-4">Our Mission Today</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                    That's why we built Hobson — not to replace your existing systems, but to work alongside them, making your property management workflow more efficient and intelligent.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Commitment Section */}
          <div className="mt-20 text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-3xl blur-xl"></div>
              <div className="relative bg-gradient-to-br from-background/95 to-background/90 backdrop-blur-sm rounded-3xl p-12 border border-primary/20">
                <div className="w-20 h-20 bg-gradient-to-r from-primary to-primary-light rounded-2xl mx-auto flex items-center justify-center mb-8 transform hover:scale-110 transition-transform duration-300">
                  <Heart className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-3xl font-bold text-foreground mb-6">Our Commitment</h3>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
                  We're committed to getting this right, and we believe this technology can truly make a difference in the property industry.
                </p>

                <Link to="/contact">
                  <SimpleButton size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-primary to-primary-light hover:from-primary/90 hover:to-primary-light/90 text-white transform hover:scale-105 transition-all duration-300">
                    Get in Touch
                  </SimpleButton>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="container mx-auto px-4 py-20 border-t border-border/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Built on Trust & Innovation
          </h2>
          <p className="text-lg text-muted-foreground mb-16 max-w-2xl mx-auto">
            Every decision we make is guided by our commitment to the property industry and the professionals who drive it forward.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Industry Focus",
                description: "Deep understanding of property management challenges"
              },
              {
                title: "Practical Solutions",
                description: "Technology that works in the real world"
              },
              {
                title: "Continuous Growth",
                description: "Always evolving to meet your needs"
              }
            ].map((value, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-xl transform group-hover:scale-105 transition-transform duration-300"></div>
                <div className="relative p-6 border border-primary/10 rounded-xl backdrop-blur-sm">
                  <h3 className="text-lg font-semibold text-foreground mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;