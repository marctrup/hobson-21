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
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fade-in">
              <Heart className="w-4 h-4" />
              Built by Property Professionals
            </div>
            
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
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Story Cards */}
            <div className="space-y-8">
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-2xl transform group-hover:scale-105 transition-transform duration-300"></div>
                <div className="relative p-8 border border-primary/10 rounded-2xl backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-light rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">The Problem</h3>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    After years of relying on traditional systems, we saw how much time was wasted moving data between them.
                  </p>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-2xl transform group-hover:scale-105 transition-transform duration-300"></div>
                <div className="relative p-8 border border-primary/10 rounded-2xl backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-light rounded-xl flex items-center justify-center">
                      <Lightbulb className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-primary">The Breakthrough</h3>
                  </div>
                  <p className="text-xl font-medium text-primary leading-relaxed">
                    Then AI changed everything.
                  </p>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-2xl transform group-hover:scale-105 transition-transform duration-300"></div>
                <div className="relative p-8 border border-primary/10 rounded-2xl backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-light rounded-xl flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Our Mission</h3>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    That's why we built Hobson — not to replace, but to work alongside.
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Element */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-3xl blur-2xl"></div>
              <div className="relative bg-gradient-to-br from-background/90 to-background/70 backdrop-blur-sm rounded-3xl p-12 border border-primary/20">
                <div className="text-center space-y-8">
                  <div className="w-24 h-24 bg-gradient-to-r from-primary to-primary-light rounded-2xl mx-auto flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                    <Heart className="w-12 h-12 text-white" />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-foreground">Our Commitment</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      We're committed to getting this right, and we believe this technology can truly make a difference.
                    </p>
                  </div>

                  <div className="pt-8">
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