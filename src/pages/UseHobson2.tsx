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

  const handleEmailSubmit = () => {
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }
    
    setRewardsUnlocked(true);
    setShowEmailForm(false);
    toast({
      title: "Success!",
      description: "Your expert rewards have been unlocked!",
    });
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
        <title>Unlock Property Expertise - Hobson AI Challenge | Test Your Knowledge</title>
        <meta name="description" content="Test your property law knowledge and unlock exclusive Hobson AI benefits. Play our expert challenge and discover how AI can enhance your practice." />
        <meta name="keywords" content="property law, legal challenge, Hobson AI, property expertise, legal AI assistant" />
        <meta property="og:title" content="Unlock Property Expertise - Hobson AI Challenge" />
        <meta property="og:description" content="Test your property law knowledge and unlock exclusive Hobson AI benefits. Play our expert challenge." />
        <link rel="canonical" href="https://hobsonschoice.ai/usehobson2" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <Link to="/">
                <OptimizedImage 
                  src="/lovable-uploads/0fa56bb9-7c7d-4f95-a81f-36a7f584ed7a.png" 
                  alt="Hobson AI Logo" 
                  className="h-12 w-auto" 
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
              <div className="flex items-center justify-center gap-2 text-sm font-medium">
                <Trophy className="w-4 h-4 text-primary" />
                <span>Property Expert Challenge: Test Your Knowledge & Unlock Exclusive Benefits</span>
                <Trophy className="w-4 h-4 text-primary" />
              </div>
            </div>
          </div>

          {/* Hero/Game Section */}
          <section className="pt-16 pb-20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <Badge variant="secondary" className="mb-6 px-4 py-2">
                  <Target className="w-4 h-4 mr-2" />
                  Property Professional Challenge
                </Badge>
                
                <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
                  Prove Your Property
                  <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent block mt-2">
                    Expertise
                  </span>
                </h1>
                
                <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
                  Complete our property law challenge to unlock exclusive Hobson AI benefits and see how AI can enhance your professional practice.
                </p>

                {!gameStarted ? (
                  <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8 mb-8 border">
                    <div className="flex items-center justify-center gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-primary" />
                        <span className="text-lg font-semibold">Quick Challenge</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-primary" />
                        <span className="text-lg font-semibold">Unlock Rewards</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Property Terminology Challenge</h3>
                    <p className="text-muted-foreground mb-6">
                      Find the term that is <strong>NOT</strong> found in property leases. Good Luck!
                    </p>
                    <Button 
                      size="lg" 
                      onClick={() => setGameStarted(true)}
                      className="text-lg px-12 py-6 bg-primary hover:bg-primary/90"
                    >
                      Start Challenge
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                ) : (
                  <div className="bg-background rounded-2xl p-8 border shadow-lg mb-8">
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-center">Which term is NOT found in property leases?</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                      {propertyTerms.map((term, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedAnswer(term)}
                          className={`p-3 text-sm font-medium rounded-md border transition-all ${
                            selectedAnswer === term
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-background hover:bg-muted border-border'
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
                              <strong>"Casement"</strong> refers to a type of window, not a property lease term.<br />
                              A casement is a type of window that is attached to its frame by side hinges. It swings open like a door, usually outwards.<br />
                              <span className="text-green-700 font-medium">Well done!</span>
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
                          className="min-w-[150px]"
                        >
                          Submit Answer
                        </Button>
                      )}
                      {gameCompleted && (
                        <Button 
                          onClick={resetGame}
                          variant="outline"
                          className="min-w-[150px]"
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
                        <p className="text-blue-800 font-medium mb-2">What it refers to when used in leases:</p>
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
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center justify-center gap-2 text-2xl">
                        <Mail className="w-6 h-6 text-primary" />
                        Unlock Your Expert Rewards
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <p className="text-muted-foreground text-center">
                        You've proven your property expertise! Enter your email to unlock your exclusive rewards:
                      </p>
                      <div className="space-y-4">
                        <Input
                          type="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="text-center"
                        />
                        <Button 
                          size="lg" 
                          onClick={handleEmailSubmit}
                          disabled={!email}
                          className="w-full text-lg py-6"
                        >
                          Unlock My Expert Rewards
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                        <p className="text-xs text-muted-foreground text-center">
                          We'll send your rewards and expert status confirmation to this email
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Reward Section */}
                {(gameCompleted && isCorrect && rewardsUnlocked) && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Award className="w-6 h-6 text-green-600" />
                      <h3 className="text-2xl font-bold text-green-800">Challenge Completed!</h3>
                    </div>
                    <p className="text-green-700 mb-6">
                      You've proven your property expertise! Claim your exclusive rewards below:
                    </p>
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-white rounded-lg p-4 border border-green-200">
                        <div className="text-center">
                          <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
                          <h4 className="font-semibold text-green-800">2,000 Free HEUs</h4>
                          <p className="text-sm text-green-600">Double the standard offer</p>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-green-200">
                        <div className="text-center">
                          <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
                          <h4 className="font-semibold text-green-800">Expert Badge</h4>
                          <p className="text-sm text-green-600">Property Professional status</p>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-green-200">
                        <div className="text-center">
                          <FileText className="w-8 h-8 text-primary mx-auto mb-2" />
                          <h4 className="font-semibold text-green-800">Priority Support</h4>
                          <p className="text-sm text-green-600">Expert assistance</p>
                        </div>
                      </div>
                    </div>
                    <Button size="lg" className="text-lg px-12 py-6 bg-green-600 hover:bg-green-700 text-white">
                      Claim Your Expert Rewards
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Why Property Professionals Choose Hobson */}
          <section className="py-20 bg-muted/20">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-bold mb-6">
                    Why Property Professionals Choose Hobson
                  </h2>
                  <p className="text-xl text-muted-foreground">
                    Transform how you work with property documents
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                      <Clock className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Save Hours Daily</h3>
                    <p className="text-muted-foreground">
                      Get instant answers instead of spending hours searching through documents
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                      <FileText className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">All Document Types</h3>
                    <p className="text-muted-foreground">
                      Works with tenancy agreements, leases, contracts, and all property documents
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Trusted Accuracy</h3>
                    <p className="text-muted-foreground">
                      AI trained specifically on property documents for reliable, accurate answers
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-bold mb-6">
                    Trusted by Property Professionals
                  </h2>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-xl text-muted-foreground">4.9/5 from 200+ users</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  <Card className="p-6">
                    <CardContent className="p-0">
                      <div className="mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-primary text-primary inline mr-1" />
                        ))}
                      </div>
                      <p className="text-muted-foreground mb-4 italic">
                        "Hobson has revolutionized how we handle tenancy agreements. What used to take hours now takes minutes."
                      </p>
                      <div>
                        <p className="font-semibold">Sarah Johnson</p>
                        <p className="text-sm text-muted-foreground">Property Manager, ABC Estates</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="p-6">
                    <CardContent className="p-0">
                      <div className="mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-primary text-primary inline mr-1" />
                        ))}
                      </div>
                      <p className="text-muted-foreground mb-4 italic">
                        "The accuracy is incredible. Hobson understands complex lease terms better than most humans."
                      </p>
                      <div>
                        <p className="font-semibold">Michael Chen</p>
                        <p className="text-sm text-muted-foreground">Legal Advisor, Property Solutions</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="p-6">
                    <CardContent className="p-0">
                      <div className="mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-primary text-primary inline mr-1" />
                        ))}
                      </div>
                      <p className="text-muted-foreground mb-4 italic">
                        "Game-changing for our team. We can now provide instant responses to client queries."
                      </p>
                      <div>
                        <p className="font-semibold">Emma Thompson</p>
                        <p className="text-sm text-muted-foreground">Director, Urban Properties</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* Ready to Transform Section */}
          <section className="py-20 bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Ready to Transform Your Property Business?
                </h2>
                <p className="text-xl text-muted-foreground mb-12">
                  Join hundreds of property professionals who are already saving time with Hobson AI.
                </p>
                
                <Button size="lg" className="text-lg px-12 py-6 bg-primary hover:bg-primary/90">
                  Start Your Free Trial Today
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>

                <p className="text-sm text-muted-foreground mt-6">
                  No credit card required • 2,000 free HEUs • Setup in under 2 minutes
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
                src="/lovable-uploads/0fa56bb9-7c7d-4f95-a81f-36a7f584ed7a.png" 
                alt="Hobson AI Logo" 
                className="h-8 w-auto" 
              />
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <Link to="/privacy-policy" className="hover:text-foreground transition-colors">
                  Privacy Policy
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