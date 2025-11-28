import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { OptimizedImage } from "@/components/OptimizedImage";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Star, CheckCircle, Users, Clock, ArrowRight, FileText, Sparkles, Trophy, Target, Zap, Award, Mail } from "lucide-react";
import confetti from 'canvas-confetti';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const propertyTerms = [
  "Fee simple",
  "Heriditament", 
  "Easement",
  "Casement", 
  "Peppercorn",
  "Alienable",
  "Yield up",
  "Section 146",
  "Lien",
  "Sui generis",
  "Class E"
];

const termExplanations = {
  "Fee simple": "You own it outright, forever. This may appear in the landlord's title documents.",
  "Heriditament": "Any property (land or rights) that can be inherited. In leases, it may be included in descriptions of what is being let.",
  "Easement": "A right to use someone else's land (like a right of way or to run pipes). Found in the 'Rights Granted' or 'Rights Reserved' section.",
  "Peppercorn": "A token rent (often just £1 a year) to make the lease legally binding. Seen in the 'Rent' clause.",
  "Alienable": "Means the lease can be transferred or assigned to someone else. Found in clauses about 'Alienation' (assignment, subletting).",
  "Yield up": "The obligation for the tenant to hand the property back at the end of the lease in a certain condition. Found near the 'End of Term' or 'Tenant's Covenants' section.",
  "Section 146": "It's the legal notice a landlord must serve before forfeiting (ending) a lease because of a breach. A forfeiture clause may reference it.",
  "Lien": "A right to keep someone's property until a debt is paid. Rare in modern leases but may appear in relation to goods left behind or the landlord's rights over fixtures.",
  "Sui generis": "Used in planning law to describe uses that don't fit into standard use classes (e.g., nightclubs, petrol stations). May be referenced in 'Permitted Use.'",
  "Class E": "A planning use class in England (covers commercial, business and service uses, like shops, offices, gyms). Found in the 'Permitted Use' section of a lease."
};

export const UseHobson2 = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [rewardsUnlocked, setRewardsUnlocked] = useState(false);
  const [showEducationalPopup, setShowEducationalPopup] = useState(false);
  const [wrongAnswerExplanation, setWrongAnswerExplanation] = useState("");
  const { toast } = useToast();

  const handleAnswerSubmit = () => {
    console.log("handleAnswerSubmit called with:", selectedAnswer);
    if (selectedAnswer === "Casement") {
      setIsCorrect(true);
      setGameCompleted(true);
      setShowResult(true);
      setShowEmailForm(true);
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#A855F7', '#C084FC', '#DDD6FE']
      });
    } else {
      setShowResult(true);
      // Show educational popup for wrong answers
      const explanation = termExplanations[selectedAnswer as keyof typeof termExplanations] || "";
      console.log("Selected answer:", selectedAnswer);
      console.log("Explanation found:", explanation);
      console.log("Setting popup to show");
      setWrongAnswerExplanation(explanation);
      setShowEducationalPopup(true);
    }
  };

  const handleEmailSubmit = async () => {
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Store the email in the rewards database
      const { data, error } = await supabase.functions.invoke('store-reward-email', {
        body: {
          email,
          challengeType: 'property_quiz'
        }
      });

      if (error) {
        console.error('Error storing reward email:', error);
        toast({
          title: "Error",
          description: "Failed to register for rewards. Please try again.",
          variant: "destructive"
        });
        return;
      }

      console.log('Successfully stored reward email:', data);
      
      // Check if email already claimed the prize
      if (data?.alreadyExists) {
        toast({
          title: "Already Claimed",
          description: "This email has already claimed the expert rewards for this challenge.",
          variant: "destructive"
        });
        return;
      }
      
      setRewardsUnlocked(true);
      setShowEmailForm(false);
      toast({
        title: "Success!",
        description: "Your expert rewards have been unlocked and email registered!",
      });
      
      // Refresh the page to return to landing state after a brief delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error in handleEmailSubmit:', error);
      toast({
        title: "Error",
        description: "Failed to register for rewards. Please try again.",
        variant: "destructive"
      });
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setSelectedAnswer("");
    setGameCompleted(false);
    setShowResult(false);
    setIsCorrect(false);
    setShowEmailForm(false);
    setEmail("");
    setRewardsUnlocked(false);
    setShowEducationalPopup(false);
    setWrongAnswerExplanation("");
  };

  return (
    <>
      <Helmet>
        {/* Initialize dataLayer before GTM */}
        <script>
          {`window.dataLayer = window.dataLayer || [];`}
        </script>
        
        {/* Google Tag Manager */}
        <script>
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-M7JNNWVM');`}
        </script>
        
        <title>Unlock Property Expertise - Hobson AI Challenge | Test Your Knowledge</title>
        <meta name="description" content="Test your property law knowledge and unlock exclusive Hobson AI benefits. Play our expert challenge and discover how AI can enhance your practice." />
        <meta name="keywords" content="property law, legal challenge, Hobson AI, property expertise, legal AI assistant" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="Unlock Property Expertise - Hobson AI Challenge" />
        <meta property="og:description" content="Test your property law knowledge and unlock exclusive Hobson AI benefits. Play our expert challenge." />
        <link rel="canonical" href="https://hobsonschoice.ai/usehobson2" />
        
        {/* GTM noscript fallback */}
        <noscript>
          {`<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-M7JNNWVM" height="0" width="0" style="display:none;visibility:hidden"></iframe>`}
        </noscript>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3 sm:py-4">
            <div className="flex justify-between items-center">
              <Link to="/">
                <OptimizedImage 
                  src="/hobson-logo.png" 
                  alt="Hobson AI Logo"
                  className="h-10 sm:h-12 w-auto" 
                  priority 
                />
              </Link>
            </div>
          </div>
        </header>

        <main>
          {/* Achievement Banner */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-3 border-b">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-center">
                <Trophy className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="hidden sm:inline">Property Expert Challenge: Test Your Knowledge & Unlock Exclusive Benefits</span>
                <span className="sm:hidden">Expert Challenge: Test & Unlock Benefits</span>
                <Trophy className="w-4 h-4 text-primary flex-shrink-0" />
              </div>
            </div>
          </div>

          {/* Hero/Game Section */}
          <section className="pt-8 sm:pt-16 pb-12 sm:pb-20 px-4">
            <div className="container mx-auto">
              <div className="max-w-4xl mx-auto text-center">
                <Badge variant="secondary" className="mb-4 sm:mb-6 px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm">
                  <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Property Professional Challenge
                </Badge>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 leading-tight">
                  Prove Your Property
                  <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent block mt-1 sm:mt-2">
                    Expertise
                  </span>
                </h1>
                
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
                  Complete our property law challenge to unlock exclusive Hobson AI benefits and see how AI can enhance your property business.
                </p>

                {!gameStarted ? (
                  <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-4 sm:p-8 mb-8 border mx-4 sm:mx-0">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                        <span className="text-sm sm:text-lg font-semibold">Quick Challenge</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                        <span className="text-sm sm:text-lg font-semibold">Unlock Rewards</span>
                      </div>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-4">Property Terminology Challenge</h3>
                    <p className="text-muted-foreground mb-6 text-sm sm:text-base px-2 sm:px-0">
                      Find the term that is <strong>NOT</strong> found in property leases. Good Luck!
                    </p>
                    <Button 
                      size="lg" 
                      onClick={() => setGameStarted(true)}
                      className="text-base sm:text-lg px-6 sm:px-12 py-4 sm:py-6 bg-primary hover:bg-primary/90 w-full sm:w-auto"
                    >
                      Start Challenge
                      <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>
                  </div>
                ) : (
                  <div className="bg-background rounded-2xl p-4 sm:p-8 border shadow-lg mb-8 mx-4 sm:mx-0">
                    <div className="mb-6">
                      <h3 className="text-lg sm:text-xl font-bold text-center px-2 sm:px-0">Which term is NOT found in property leases?</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mb-6">
                      {propertyTerms.map((term, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedAnswer(term)}
                          className={`p-3 sm:p-4 text-sm sm:text-base font-medium rounded-md border transition-all touch-manipulation ${
                            selectedAnswer === term
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-background hover:bg-muted border-border active:bg-muted'
                          }`}
                        >
                          {term}
                        </button>
                      ))}
                    </div>

                    {showResult && (
                      <div className={`p-4 rounded-lg mb-4 ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                        {isCorrect ? (
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-2 text-green-700 font-semibold mb-2">
                              <Trophy className="w-5 h-5" />
                              Congratulations! You're a property expert!
                            </div>
                            <p className="text-green-600 text-sm leading-relaxed">
                              Congratulations! You got the right answer.
                            </p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <p className="text-red-700 font-semibold mb-1">
                              Not quite right. Try again!
                            </p>
                            <p className="text-red-600 text-sm">
                              Keep trying - you'll get it!
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      {!gameCompleted && (
                        <Button 
                          onClick={handleAnswerSubmit}
                          disabled={!selectedAnswer}
                          className="min-w-[120px] sm:min-w-[150px] w-full sm:w-auto"
                        >
                          Submit Answer
                        </Button>
                      )}
                      {gameCompleted && (
                        <Button 
                          onClick={resetGame}
                          variant="outline"
                          className="min-w-[120px] sm:min-w-[150px] w-full sm:w-auto"
                        >
                          Try Again
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Educational Popup for Wrong Answers */}
                <Dialog open={showEducationalPopup} onOpenChange={setShowEducationalPopup}>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="flex items-center justify-center gap-2 text-xl">
                        <FileText className="w-5 h-5 text-primary" />
                        Why "{selectedAnswer}" is Found in Property Leases
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-blue-800 font-medium mb-2">What it refers to in leases:</p>
                        <p className="text-blue-700 text-sm leading-relaxed">
                          {wrongAnswerExplanation}
                        </p>
                      </div>
                      <p className="text-muted-foreground text-center text-sm">
                        Remember: We're looking for the term that is <strong>NOT</strong> found in property leases.
                      </p>
                      <Button 
                        onClick={() => setShowEducationalPopup(false)}
                        className="w-full"
                      >
                        Got it! Try Again
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Email Collection Dialog */}
                <Dialog open={showEmailForm && !rewardsUnlocked} onOpenChange={(open) => !open && setShowEmailForm(false)}>
                  <DialogContent className="sm:max-w-md mx-4 max-w-[calc(100vw-2rem)] w-full">
                    <DialogHeader className="text-center">
                      <DialogTitle className="flex items-center justify-center gap-2 text-xl sm:text-2xl">
                        <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                        Unlock Your Expert Rewards
                      </DialogTitle>
                    </DialogHeader>
                     <div className="space-y-4 py-4">
                       <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4">
                         <p className="text-blue-800 font-medium mb-2 text-sm sm:text-base">Correct Answer!</p>
                         <p className="text-blue-700 text-xs sm:text-sm leading-relaxed">
                           <strong>"Casement"</strong> refers to a type of window, not a property lease term. A casement is a type of window that is attached to its frame by side hinges. It swings open like a door, usually outwards.
                         </p>
                       </div>
                       <p className="text-muted-foreground text-center text-sm sm:text-base px-2 sm:px-0">
                         You've proven your property expertise! Enter your email to unlock your exclusive rewards:
                       </p>
                      <div className="space-y-4">
                        <Input
                          type="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="text-center text-sm sm:text-base"
                        />
                        <Button 
                          size="lg" 
                          onClick={handleEmailSubmit}
                          disabled={!email}
                          className="w-full text-base sm:text-lg py-4 sm:py-6"
                        >
                          Unlock My Expert Rewards
                          <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>
                        <p className="text-xs text-muted-foreground text-center">
                          We'll send your rewards and expert status confirmation to this email
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

              </div>
            </div>
          </section>

          {/* Why Property Professionals Choose Hobson */}
          <section className="py-12 sm:py-20 bg-muted/20">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12 sm:mb-16">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                    Why Property Professionals Choose Hobson
                  </h2>
                  <p className="text-lg sm:text-xl text-muted-foreground px-4 sm:px-0">
                    Transform how you work with property documents
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                  <div className="text-center px-4 sm:px-0">
                    <div className="bg-primary/10 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                      <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Save Hours Daily</h3>
                    <p className="text-muted-foreground text-sm sm:text-base">
                      Get instant answers instead of spending hours searching through documents
                    </p>
                  </div>

                  <div className="text-center px-4 sm:px-0">
                    <div className="bg-primary/10 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                      <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">All Document Types</h3>
                     <p className="text-muted-foreground text-sm sm:text-base">
                       Trained on 100's of property document types
                     </p>
                  </div>

                  <div className="text-center px-4 sm:px-0">
                    <div className="bg-primary/10 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                      <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Trusted Accuracy</h3>
                     <p className="text-muted-foreground text-sm sm:text-base">
                       Hobson is achieving 98% accuracy
                     </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-12 sm:py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12 sm:mb-16">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                    Trusted by Property Professionals
                  </h2>
                  <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 sm:w-6 sm:h-6 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-lg sm:text-xl text-muted-foreground">4.9/5 from 200+ users</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                  <Card className="p-4 sm:p-6">
                    <CardContent className="p-0">
                      <div className="mb-3 sm:mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-primary text-primary inline mr-1" />
                        ))}
                      </div>
                      <p className="text-muted-foreground mb-3 sm:mb-4 italic text-sm sm:text-base">
                        "Hobson has revolutionized how we handle tenancy agreements. What used to take hours now takes minutes."
                      </p>
                      <div>
                        <p className="font-semibold text-sm sm:text-base">Sarah Johnson</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Property Manager, ABC Estates</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="p-4 sm:p-6">
                    <CardContent className="p-0">
                      <div className="mb-3 sm:mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-primary text-primary inline mr-1" />
                        ))}
                      </div>
                      <p className="text-muted-foreground mb-3 sm:mb-4 italic text-sm sm:text-base">
                        "The accuracy is incredible. Hobson understands complex lease terms better than most humans."
                      </p>
                      <div>
                        <p className="font-semibold text-sm sm:text-base">Michael Chen</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Legal Advisor, Property Solutions</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="p-4 sm:p-6">
                    <CardContent className="p-0">
                      <div className="mb-3 sm:mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-primary text-primary inline mr-1" />
                        ))}
                      </div>
                      <p className="text-muted-foreground mb-3 sm:mb-4 italic text-sm sm:text-base">
                        "Game-changing for our team. We can now provide instant responses to client queries."
                      </p>
                      <div>
                        <p className="font-semibold text-sm sm:text-base">Emma Thompson</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Director, Urban Properties</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* Ready to Transform Section */}
          <section className="py-12 sm:py-20 bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 px-4 sm:px-0">
                  Ready to Transform Your Property Business?
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-12 px-4 sm:px-0">
                  Fed up with bloated, complex and expensive systems?
                </p>
                
                <Button size="lg" className="text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-6 bg-primary hover:bg-primary/90 w-full sm:w-auto max-w-xs sm:max-w-none mx-auto">
                  Start today for Free
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Button>

                <p className="text-xs sm:text-sm text-muted-foreground mt-4 sm:mt-6 px-4 sm:px-0">
                  No credit card required • 18 free HEUs • Setup in under 2 minutes
                </p>
              </div>
            </div>
          </section>

        </main>

        {/* Simple Footer */}
        <footer className="py-12 border-t bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <OptimizedImage 
                src="/hobson-logo.png" 
                alt="Hobson AI Logo"
                className="h-8 w-auto" 
              />
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <Link to="/data-protection" className="hover:text-foreground transition-colors">
                  AI Privacy & Data Protection Policy
                </Link>
                <Link to="/contact" className="hover:text-foreground transition-colors">
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};