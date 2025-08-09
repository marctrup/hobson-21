import { SimpleButton } from "@/components/ui/simple-button";
import { Link } from "react-router-dom";
import { HomepageHeader } from "@/components/homepage/HomepageHeader";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <HomepageHeader />
      <div className="container mx-auto px-4 py-8">        
        <div className="max-w-4xl mx-auto">
          {/* Purple frame container */}
          <div className="relative">
            {/* Faded purple border frame */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-3xl border border-primary/20"></div>
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 rounded-3xl blur-sm"></div>
            
            {/* Content */}
            <div className="relative bg-background/80 backdrop-blur-sm rounded-3xl p-12 border border-primary/10">
              <h1 className="text-5xl font-bold mb-12 text-center bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                About Us
              </h1>
              
              <div className="prose prose-lg max-w-none text-foreground space-y-8">
                <p className="text-xl leading-relaxed text-center">
                  We're property professionals with a passion for technology and its potential to shape the future of our industry. After years of relying on traditional systems, we saw how much time was wasted moving data between them.
                </p>
                
                <p className="text-xl leading-relaxed text-center text-primary font-medium">
                  Then AI changed everything.
                </p>
                
                <p className="text-xl leading-relaxed text-center">
                  That's why we built Hobson — not to replace, but to work alongside.
                </p>
                
                <p className="text-xl leading-relaxed text-center">
                  We're committed to getting this right, and we believe this technology can truly make a difference.
                </p>
              </div>
              
              <div className="mt-12 text-center">
                <Link to="/contact">
                  <SimpleButton size="lg" className="text-lg px-8 py-3 bg-primary hover:bg-primary/90">
                    Contact Us
                  </SimpleButton>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;