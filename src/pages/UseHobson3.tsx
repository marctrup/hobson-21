import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { OptimizedImage } from "@/components/OptimizedImage";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Star, Clock, ArrowRight, FileText, Sparkles, Trophy, Target, Award, Brain, Rocket, Shield } from "lucide-react";
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

export const UseHobson3 = () => {
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
        colors: ['#8B5CF6', '#8A8478', '#8A8478', '#E8E1D4']
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
        
        <title>Property Expert Quiz | Hobson AI — AI assistance to operators, occupiers and owners of real estate</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="Test your property expertise in our interactive quiz and unlock exclusive Hobson AI benefits. Fun, engaging challenge for property professionals." />
        <meta name="keywords" content="property quiz, legal challenge, Hobson AI, property expertise, interactive quiz" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="Property Expert Challenge - Interactive Quiz" />
        <meta property="og:description" content="Test your property expertise in our interactive quiz and unlock exclusive Hobson AI benefits." />
        <meta name="robots" content="noindex, nofollow" />
        
        {/* GTM noscript fallback */}
        <noscript>
          {`<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-M7JNNWVM" height="0" width="0" style="display:none;visibility:hidden"></iframe>`}
        </noscript>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-paper via-paper to-bone-wash dark:from-ink dark:via-ink/20 dark:to-ink/20">
        {/* Mobile-Optimized Header */}
        <header className="fixed top-2 left-1/2 transform -translate-x-1/2 z-50 bg-white/90 dark:bg-ink/90 backdrop-blur-lg rounded-full px-4 sm:px-6 py-2 sm:py-3 shadow-xl border border-white/20 w-auto max-w-[calc(100vw-1rem)]">
          <Link to="/">
            <OptimizedImage 
              src="/hobson-logo.png" 
              alt="Hobson AI Logo"
              className="h-6 sm:h-8 w-auto" 
              priority 
            />
          </Link>
        </header>

        <main className="pt-16 sm:pt-20">
          {/* Hero Section - Mobile-Optimized Game Arena */}
          <section className="min-h-screen flex items-center justify-center px-3 sm:px-4 py-6 sm:py-8">
            <div className="max-w-4xl mx-auto text-center w-full">
              
              {!gameStarted ? (
                /* Mobile-Friendly Landing Game Card */
                <div className="bg-white/80 dark:bg-ink/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-white/30 animate-scale-in mx-2 sm:mx-0">
                  <div className="mb-6 sm:mb-8">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-charcoal to-charcoal text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                      <Brain className="w-3 h-3 sm:w-4 sm:h-4" />
                      Expert Challenge Arena
                    </div>
                    
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-charcoal via-charcoal to-charcoal bg-clip-text text-transparent leading-tight">
                      Property Quiz
                      <span className="block text-xl sm:text-2xl md:text-4xl mt-1 sm:mt-2 font-bold text-charcoal dark:text-ink-faint">
                        Master Challenge
                      </span>
                    </h1>
                    
                    <p className="text-base sm:text-lg text-charcoal dark:text-ink-faint mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
                      Step into the arena and prove your property expertise! Complete our interactive challenge to unlock exclusive Hobson AI benefits.
                    </p>
                  </div>

                  {/* Mobile-Optimized Game Stats */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
                    <div className="bg-gradient-to-br from-bone-wash to-bone dark:from-ink/50 dark:to-ink/50 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                      <div className="text-xl sm:text-2xl font-bold text-charcoal dark:text-ink-faint">1</div>
                      <div className="text-xs sm:text-sm text-charcoal dark:text-ink-muted">Question</div>
                    </div>
                    <div className="bg-gradient-to-br from-bone-wash to-bone dark:from-ink/50 dark:to-ink/50 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                      <div className="text-xl sm:text-2xl font-bold text-charcoal dark:text-ink-faint">2</div>
                      <div className="text-xs sm:text-sm text-charcoal dark:text-ink-muted">Minutes</div>
                    </div>
                    <div className="bg-gradient-to-br from-bone-wash to-bone dark:from-ink/50 dark:to-ink/50 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                      <div className="text-lg sm:text-2xl font-bold text-charcoal dark:text-ink-faint">🏆</div>
                      <div className="text-xs sm:text-sm text-charcoal dark:text-ink-muted">Rewards</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-warning-bg to-warning-bg dark:from-warning-solid/30 dark:to-warning-solid/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-warning-border dark:border-warning mx-2 sm:mx-0">
                    <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
                      <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-warning flex-shrink-0" />
                      <span className="font-bold text-warning dark:text-warning text-sm sm:text-base">Challenge Mission</span>
                    </div>
                    <p className="text-warning dark:text-warning font-medium text-sm sm:text-base">
                      Find the term that is <strong>NOT</strong> found in property leases
                    </p>
                  </div>
                  
                  <Button 
                    size="lg" 
                    onClick={() => setGameStarted(true)}
                    className="bg-gradient-to-r from-charcoal to-charcoal hover:from-charcoal hover:to-charcoal text-white px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl font-bold rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 w-full sm:w-auto touch-manipulation"
                  >
                    <Rocket className="mr-2 sm:mr-3 w-5 h-5 sm:w-6 sm:h-6" />
                    Launch Challenge
                  </Button>
                </div>
              ) : (
                /* Mobile-Optimized Active Quiz Interface */
                <div className="bg-white/90 dark:bg-ink/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-white/30 animate-fade-in mx-2 sm:mx-0">
                  <div className="mb-6 sm:mb-8">
                    <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
                      <div className="bg-gradient-to-r from-charcoal to-charcoal text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium flex items-center gap-2">
                        <Target className="w-3 h-3 sm:w-4 sm:h-4" />
                        Challenge Active
                      </div>
                    </div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-ink dark:text-ink-faint mb-4 sm:mb-6 px-2 sm:px-0">
                      Which term is <span className="text-danger">NOT</span> found in property leases?
                    </h2>
                  </div>
                  
                  {/* Mobile-Optimized Interactive Terms Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8">
                    {propertyTerms.map((term, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedAnswer(term)}
                        className={`group relative p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 active:scale-95 touch-manipulation text-sm sm:text-base min-h-[60px] sm:min-h-[80px] flex items-center justify-center ${
                          selectedAnswer === term
                            ? 'bg-gradient-to-br from-ink-faint to-ink-faint text-white border-bone-strong shadow-lg scale-105'
                            : 'bg-white/60 dark:bg-charcoal/60 hover:bg-white/90 dark:hover:bg-charcoal/90 border-bone dark:border-charcoal hover:border-bone hover:shadow-md active:bg-white/70'
                        }`}
                      >
                        <div className="font-medium text-center leading-tight">{term}</div>
                        {selectedAnswer === term && (
                          <div className="absolute -top-1 -right-1 bg-success text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs">
                            ✓
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  {showResult && (
                    <div className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 animate-fade-in mx-2 sm:mx-0 ${
                      isCorrect 
                        ? 'bg-gradient-to-r from-success-bg to-success-bg dark:from-success-solid/30 dark:to-success-solid/30 border-2 border-success-border dark:border-success' 
                        : 'bg-gradient-to-r from-danger-bg to-danger-bg dark:from-danger-solid/30 dark:to-danger-solid/30 border-2 border-danger-border dark:border-danger'
                    }`}>
                      {isCorrect ? (
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 sm:gap-3 text-success dark:text-success font-bold text-lg sm:text-xl mb-2 sm:mb-3">
                            <Trophy className="w-6 h-6 sm:w-8 sm:h-8" />
                            <span>🎉 Challenge Complete!</span>
                            <Trophy className="w-6 h-6 sm:w-8 sm:h-8" />
                          </div>
                          <p className="text-success dark:text-success text-base sm:text-lg">
                            Outstanding! You've proven your property expertise!
                          </p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 text-danger dark:text-danger font-bold text-base sm:text-lg mb-2">
                            <span>🤔 Not quite right!</span>
                          </div>
                          <p className="text-danger dark:text-danger text-sm sm:text-base">
                            Give it another shot - you've got this! 💪
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-3 sm:gap-4 justify-center px-2 sm:px-0">
                    {!gameCompleted && (
                      <Button 
                        onClick={handleAnswerSubmit}
                        disabled={!selectedAnswer}
                        className="bg-gradient-to-r from-charcoal to-charcoal hover:from-charcoal hover:to-charcoal text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto touch-manipulation"
                      >
                        Submit Answer
                        <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                      </Button>
                    )}
                    {gameCompleted && (
                      <Button 
                        onClick={resetGame}
                        variant="outline"
                        className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl border-2 w-full sm:w-auto touch-manipulation"
                      >
                        Play Again
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Mobile-Optimized Educational Popup */}
              <Dialog open={showEducationalPopup} onOpenChange={setShowEducationalPopup}>
                <DialogContent className="sm:max-w-lg bg-white/95 backdrop-blur-xl mx-3 max-w-[calc(100vw-1.5rem)] rounded-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center justify-center gap-2 text-lg sm:text-xl px-2">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-charcoal" />
                      Learning Moment: "{selectedAnswer}"
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="bg-gradient-to-r from-paper to-paper border border-bone rounded-xl sm:rounded-2xl p-3 sm:p-4">
                      <p className="text-ink font-medium mb-2 text-sm sm:text-base">Found in property leases:</p>
                      <p className="text-charcoal text-xs sm:text-sm leading-relaxed">
                        {wrongAnswerExplanation}
                      </p>
                    </div>
                    <p className="text-charcoal text-center text-xs sm:text-sm px-2">
                      Remember: We're looking for the term that is <strong>NOT</strong> found in property leases.
                    </p>
                    <Button 
                      onClick={() => setShowEducationalPopup(false)}
                      className="w-full bg-gradient-to-r from-charcoal to-charcoal hover:from-charcoal hover:to-charcoal py-3 sm:py-4 text-sm sm:text-base rounded-xl touch-manipulation"
                    >
                      <Brain className="mr-2 w-4 h-4" />
                      Got it! Let me try again
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Mobile-Optimized Email Collection Dialog */}
              <Dialog open={showEmailForm && !rewardsUnlocked} onOpenChange={(open) => !open && setShowEmailForm(false)}>
                <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl mx-3 max-w-[calc(100vw-1.5rem)] rounded-2xl">
                  <DialogHeader className="text-center">
                    <DialogTitle className="flex items-center justify-center gap-2 text-lg sm:text-2xl px-2">
                      <Award className="w-5 h-5 sm:w-6 sm:h-6 text-charcoal" />
                      Unlock Expert Rewards
                    </DialogTitle>
                  </DialogHeader>
                   <div className="space-y-3 sm:space-y-4 py-4">
                     <div className="bg-gradient-to-r from-success-bg to-success-bg border border-success-border rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-3 sm:mb-4">
                       <p className="text-success font-medium mb-2 text-sm sm:text-base">Correct Answer! 🎯</p>
                       <p className="text-success text-xs sm:text-sm leading-relaxed">
                         <strong>"Casement"</strong> refers to a type of window, not a property lease term. A casement is a type of window that is attached to its frame by side hinges. It swings open like a door, usually outwards.
                       </p>
                     </div>
                     <p className="text-charcoal text-center text-sm sm:text-base px-2">
                       You've mastered the challenge! Enter your email to unlock exclusive rewards:
                     </p>
                    <div className="space-y-3 sm:space-y-4">
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="text-center rounded-xl sm:rounded-2xl border-2 py-3 sm:py-3 text-sm sm:text-base"
                      />
                      <Button 
                        size="lg" 
                        onClick={handleEmailSubmit}
                        disabled={!email}
                        className="w-full bg-gradient-to-r from-charcoal to-charcoal hover:from-charcoal hover:to-charcoal py-3 sm:py-4 rounded-xl sm:rounded-2xl text-base sm:text-lg font-bold touch-manipulation"
                      >
                        <Trophy className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                        Claim My Expert Status
                      </Button>
                      <p className="text-xs text-ink-muted text-center px-2">
                        We'll send your expert rewards and status confirmation
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

            </div>
          </section>

          {/* Mobile-Optimized Why Professionals Choose Hobson */}
          <section className="py-12 sm:py-16 md:py-20 bg-white/30 dark:bg-ink/30 backdrop-blur-sm">
            <div className="container mx-auto px-3 sm:px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12 sm:mb-16">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-charcoal to-charcoal bg-clip-text text-transparent px-2">
                    Why Property Pros Love Hobson
                  </h2>
                  <p className="text-lg sm:text-xl text-charcoal dark:text-ink-faint px-2">
                    Join thousands transforming their workflow
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                  <Card className="bg-white/80 dark:bg-ink/80 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-2xl sm:rounded-3xl overflow-hidden mx-2 sm:mx-0">
                    <CardContent className="p-6 sm:p-8 text-center">
                      <div className="bg-gradient-to-br from-bone-wash to-bone dark:from-ink/50 dark:to-ink/50 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                        <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-charcoal" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-ink dark:text-ink-faint">Save Hours Daily</h3>
                      <p className="text-charcoal dark:text-ink-faint text-sm sm:text-base">
                        Get instant answers instead of spending hours searching through documents
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 dark:bg-ink/80 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-2xl sm:rounded-3xl overflow-hidden mx-2 sm:mx-0">
                    <CardContent className="p-6 sm:p-8 text-center">
                      <div className="bg-gradient-to-br from-bone-wash to-bone dark:from-ink/50 dark:to-ink/50 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                        <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-charcoal" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-ink dark:text-ink-faint">All Document Types</h3>
                       <p className="text-charcoal dark:text-ink-faint text-sm sm:text-base">
                         Trained on 100's of property document types
                       </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 dark:bg-ink/80 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-2xl sm:rounded-3xl overflow-hidden mx-2 sm:mx-0 sm:col-span-2 lg:col-span-1">
                    <CardContent className="p-6 sm:p-8 text-center">
                      <div className="bg-gradient-to-br from-success-bg to-success-bg dark:from-success-solid/50 dark:to-success-solid/50 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                        <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-success" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-ink dark:text-ink-faint">Trusted Accuracy</h3>
                       <p className="text-charcoal dark:text-ink-faint text-sm sm:text-base">
                         Hobson is achieving 98% accuracy
                       </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* Mobile-Optimized Testimonials */}
          <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-paper to-paper dark:from-ink dark:to-ink/20">
            <div className="container mx-auto px-3 sm:px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12 sm:mb-16">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6 text-ink dark:text-ink-faint px-2">
                    Trusted by Experts
                  </h2>
                  <div className="flex items-center justify-center gap-1 sm:gap-2 mb-3 sm:mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 sm:w-8 sm:h-8 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-lg sm:text-xl text-charcoal dark:text-ink-faint px-2">4.9/5 from 200+ property professionals</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                  <Card className="bg-white/90 dark:bg-ink/90 backdrop-blur-xl border-0 shadow-xl rounded-2xl sm:rounded-3xl overflow-hidden mx-2 sm:mx-0">
                    <CardContent className="p-5 sm:p-6 md:p-8">
                      <div className="mb-3 sm:mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-warning text-warning inline mr-1" />
                        ))}
                      </div>
                      <p className="text-charcoal dark:text-ink-faint mb-4 sm:mb-6 italic text-base sm:text-lg leading-relaxed">
                        "Hobson has revolutionized how we handle tenancy agreements. What used to take hours now takes minutes."
                      </p>
                      <div>
                        <p className="font-bold text-ink dark:text-ink-faint text-sm sm:text-base">Sarah Johnson</p>
                        <p className="text-xs sm:text-sm text-ink-muted dark:text-ink-muted">Property Manager, ABC Estates</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/90 dark:bg-ink/90 backdrop-blur-xl border-0 shadow-xl rounded-2xl sm:rounded-3xl overflow-hidden mx-2 sm:mx-0">
                    <CardContent className="p-5 sm:p-6 md:p-8">
                      <div className="mb-3 sm:mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-warning text-warning inline mr-1" />
                        ))}
                      </div>
                      <p className="text-charcoal dark:text-ink-faint mb-4 sm:mb-6 italic text-base sm:text-lg leading-relaxed">
                        "The accuracy is incredible. Hobson understands complex lease terms better than most humans."
                      </p>
                      <div>
                        <p className="font-bold text-ink dark:text-ink-faint text-sm sm:text-base">Michael Chen</p>
                        <p className="text-xs sm:text-sm text-ink-muted dark:text-ink-muted">Legal Advisor, Property Solutions</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/90 dark:bg-ink/90 backdrop-blur-xl border-0 shadow-xl rounded-2xl sm:rounded-3xl overflow-hidden mx-2 sm:mx-0 sm:col-span-2 lg:col-span-1">
                    <CardContent className="p-5 sm:p-6 md:p-8">
                      <div className="mb-3 sm:mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-warning text-warning inline mr-1" />
                        ))}
                      </div>
                      <p className="text-charcoal dark:text-ink-faint mb-4 sm:mb-6 italic text-base sm:text-lg leading-relaxed">
                        "Game-changing for our team. We can now provide instant responses to client queries."
                      </p>
                      <div>
                        <p className="font-bold text-ink dark:text-ink-faint text-sm sm:text-base">Emma Thompson</p>
                        <p className="text-xs sm:text-sm text-ink-muted dark:text-ink-muted">Director, Urban Properties</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* Mobile-Optimized CTA Section */}
          <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-charcoal via-charcoal to-charcoal text-white">
            <div className="container mx-auto px-3 sm:px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-4 sm:mb-6 px-2">
                  Ready to Transform Your Property Business?
                </h2>
                <p className="text-lg sm:text-xl mb-8 sm:mb-12 text-ink-faint px-2">
                  Fed up with bloated, complex and expensive systems?
                </p>
                
                <Button 
                  size="lg" 
                  className="bg-white text-charcoal hover:bg-bone-wash px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl font-bold rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 w-full sm:w-auto max-w-sm sm:max-w-none mx-auto touch-manipulation"
                >
                  <Sparkles className="mr-2 sm:mr-3 w-5 h-5 sm:w-6 sm:h-6" />
                  Start Today for Free
                </Button>

                <p className="text-xs sm:text-sm text-ink-faint mt-4 sm:mt-6 px-2">
                  No credit card required • 18 free HEUs • Setup in under 2 minutes
                </p>
              </div>
            </div>
          </section>

        </main>

        {/* Mobile-Optimized Footer */}
        <footer className="py-8 sm:py-12 bg-white/90 dark:bg-ink/90 backdrop-blur-xl">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <OptimizedImage 
                src="/hobson-logo.png" 
                alt="Hobson AI Logo"
                className="h-6 sm:h-8 w-auto" 
              />
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-xs sm:text-sm text-charcoal dark:text-ink-muted text-center">
                <Link to="/data-protection" className="hover:text-charcoal transition-colors touch-manipulation px-2">
                  AI Privacy & Data Protection Policy
                </Link>
                <Link to="/contact" className="hover:text-charcoal transition-colors touch-manipulation px-2">
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