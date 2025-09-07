import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { OptimizedImage } from "@/components/OptimizedImage";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Star, CheckCircle, Users, Clock, ArrowRight, FileText, Sparkles, Trophy, Target, Zap, Award, Mail, Brain, Rocket, Shield } from "lucide-react";
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
        <title>Property Expert Challenge - Interactive Quiz | Hobson AI</title>
        <meta name="description" content="Test your property expertise in our interactive quiz and unlock exclusive Hobson AI benefits. Fun, engaging challenge for property professionals." />
        <meta name="keywords" content="property quiz, legal challenge, Hobson AI, property expertise, interactive quiz" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="Property Expert Challenge - Interactive Quiz" />
        <meta property="og:description" content="Test your property expertise in our interactive quiz and unlock exclusive Hobson AI benefits." />
        <link rel="canonical" href="https://hobsonschoice.ai/quiz2" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
        {/* Floating Header */}
        <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-full px-6 py-3 shadow-xl border border-white/20">
          <Link to="/">
            <OptimizedImage 
              src="/lovable-uploads/0fa56bb9-7c7d-4f95-a81f-36a7f584ed7a.png" 
              alt="Hobson AI Logo" 
              className="h-8 w-auto" 
              priority 
            />
          </Link>
        </header>

        <main className="pt-20">
          {/* Hero Section - Game Arena Style */}
          <section className="min-h-screen flex items-center justify-center px-4 py-8">
            <div className="max-w-4xl mx-auto text-center">
              
              {!gameStarted ? (
                /* Landing Game Card */
                <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30 animate-scale-in">
                  <div className="mb-8">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                      <Brain className="w-4 h-4" />
                      Expert Challenge Arena
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
                      Property Quiz
                      <span className="block text-2xl md:text-4xl mt-2 font-bold text-gray-700 dark:text-gray-300">
                        Master Challenge
                      </span>
                    </h1>
                    
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                      Step into the arena and prove your property expertise! Complete our interactive challenge to unlock exclusive Hobson AI benefits.
                    </p>
                  </div>

                  {/* Game Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 rounded-2xl p-4">
                      <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">1</div>
                      <div className="text-sm text-purple-600 dark:text-purple-400">Question</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 rounded-2xl p-4">
                      <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">2</div>
                      <div className="text-sm text-blue-600 dark:text-blue-400">Minutes</div>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/50 dark:to-indigo-800/50 rounded-2xl p-4">
                      <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">🏆</div>
                      <div className="text-sm text-indigo-600 dark:text-indigo-400">Rewards</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-2xl p-6 mb-8 border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Trophy className="w-5 h-5 text-yellow-600" />
                      <span className="font-bold text-yellow-800 dark:text-yellow-200">Challenge Mission</span>
                    </div>
                    <p className="text-yellow-700 dark:text-yellow-300 font-medium">
                      Find the term that is <strong>NOT</strong> found in property leases
                    </p>
                  </div>
                  
                  <Button 
                    size="lg" 
                    onClick={() => setGameStarted(true)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-6 text-xl font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    <Rocket className="mr-3 w-6 h-6" />
                    Launch Challenge
                  </Button>
                </div>
              ) : (
                /* Active Quiz Interface */
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30 animate-fade-in">
                  <div className="mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Challenge Active
                      </div>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
                      Which term is <span className="text-red-500">NOT</span> found in property leases?
                    </h2>
                  </div>
                  
                  {/* Interactive Terms Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
                    {propertyTerms.map((term, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedAnswer(term)}
                        className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                          selectedAnswer === term
                            ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white border-purple-400 shadow-lg scale-105'
                            : 'bg-white/50 dark:bg-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-600/80 border-gray-200 dark:border-gray-600 hover:border-purple-300 hover:shadow-md'
                        }`}
                      >
                        <div className="font-medium text-sm">{term}</div>
                        {selectedAnswer === term && (
                          <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                            ✓
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  {showResult && (
                    <div className={`p-6 rounded-2xl mb-6 animate-fade-in ${
                      isCorrect 
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-2 border-green-200 dark:border-green-800' 
                        : 'bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-900/30 border-2 border-red-200 dark:border-red-800'
                    }`}>
                      {isCorrect ? (
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-3 text-green-700 dark:text-green-300 font-bold text-xl mb-3">
                            <Trophy className="w-8 h-8" />
                            <span>🎉 Challenge Complete!</span>
                            <Trophy className="w-8 h-8" />
                          </div>
                          <p className="text-green-600 dark:text-green-400 text-lg">
                            Outstanding! You've proven your property expertise!
                          </p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 text-red-700 dark:text-red-300 font-bold text-lg mb-2">
                            <span>🤔 Not quite right!</span>
                          </div>
                          <p className="text-red-600 dark:text-red-400">
                            Give it another shot - you've got this! 💪
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-4 justify-center">
                    {!gameCompleted && (
                      <Button 
                        onClick={handleAnswerSubmit}
                        disabled={!selectedAnswer}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-bold rounded-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Submit Answer
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    )}
                    {gameCompleted && (
                      <Button 
                        onClick={resetGame}
                        variant="outline"
                        className="px-8 py-4 text-lg font-bold rounded-2xl border-2"
                      >
                        Play Again
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Educational Popup */}
              <Dialog open={showEducationalPopup} onOpenChange={setShowEducationalPopup}>
                <DialogContent className="sm:max-w-lg bg-white/95 backdrop-blur-xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center justify-center gap-2 text-xl">
                      <FileText className="w-5 h-5 text-blue-600" />
                      Learning Moment: "{selectedAnswer}"
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4">
                      <p className="text-blue-800 font-medium mb-2">Found in property leases:</p>
                      <p className="text-blue-700 text-sm leading-relaxed">
                        {wrongAnswerExplanation}
                      </p>
                    </div>
                    <p className="text-gray-600 text-center text-sm">
                      Remember: We're looking for the term that is <strong>NOT</strong> found in property leases.
                    </p>
                    <Button 
                      onClick={() => setShowEducationalPopup(false)}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      <Brain className="mr-2 w-4 h-4" />
                      Got it! Let me try again
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Email Collection Dialog */}
              <Dialog open={showEmailForm && !rewardsUnlocked} onOpenChange={(open) => !open && setShowEmailForm(false)}>
                <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl">
                  <DialogHeader className="text-center">
                    <DialogTitle className="flex items-center justify-center gap-2 text-2xl">
                      <Award className="w-6 h-6 text-purple-600" />
                      Unlock Expert Rewards
                    </DialogTitle>
                  </DialogHeader>
                   <div className="space-y-4 py-4">
                     <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 mb-4">
                       <p className="text-green-800 font-medium mb-2">Correct Answer! 🎯</p>
                       <p className="text-green-700 text-sm leading-relaxed">
                         <strong>"Casement"</strong> refers to a type of window, not a property lease term. A casement is a type of window that is attached to its frame by side hinges. It swings open like a door, usually outwards.
                       </p>
                     </div>
                     <p className="text-gray-600 text-center">
                       You've mastered the challenge! Enter your email to unlock exclusive rewards:
                     </p>
                    <div className="space-y-4">
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="text-center rounded-2xl border-2 py-3"
                      />
                      <Button 
                        size="lg" 
                        onClick={handleEmailSubmit}
                        disabled={!email}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-4 rounded-2xl text-lg font-bold"
                      >
                        <Trophy className="mr-2 w-5 h-5" />
                        Claim My Expert Status
                      </Button>
                      <p className="text-xs text-gray-500 text-center">
                        We'll send your expert rewards and status confirmation
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

            </div>
          </section>

          {/* Why Professionals Choose Hobson - Modern Card Design */}
          <section className="py-20 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Why Property Pros Love Hobson
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300">
                    Join thousands transforming their workflow
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-3xl overflow-hidden">
                    <CardContent className="p-8 text-center">
                      <div className="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                        <Clock className="w-10 h-10 text-purple-600" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Save Hours Daily</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Get instant answers instead of spending hours searching through documents
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-3xl overflow-hidden">
                    <CardContent className="p-8 text-center">
                      <div className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                        <FileText className="w-10 h-10 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">All Document Types</h3>
                       <p className="text-gray-600 dark:text-gray-300">
                         Trained on 100's of property document types
                       </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-3xl overflow-hidden">
                    <CardContent className="p-8 text-center">
                      <div className="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                        <Shield className="w-10 h-10 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Trusted Accuracy</h3>
                       <p className="text-gray-600 dark:text-gray-300">
                         Hobson is achieving 98% accuracy
                       </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials - Sleek Design */}
          <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-purple-900/20">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-800 dark:text-gray-200">
                    Trusted by Experts
                  </h2>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-xl text-gray-600 dark:text-gray-300">4.9/5 from 200+ property professionals</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-xl rounded-3xl overflow-hidden">
                    <CardContent className="p-8">
                      <div className="mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400 inline mr-1" />
                        ))}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 italic text-lg leading-relaxed">
                        "Hobson has revolutionized how we handle tenancy agreements. What used to take hours now takes minutes."
                      </p>
                      <div>
                        <p className="font-bold text-gray-800 dark:text-gray-200">Sarah Johnson</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Property Manager, ABC Estates</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-xl rounded-3xl overflow-hidden">
                    <CardContent className="p-8">
                      <div className="mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400 inline mr-1" />
                        ))}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 italic text-lg leading-relaxed">
                        "The accuracy is incredible. Hobson understands complex lease terms better than most humans."
                      </p>
                      <div>
                        <p className="font-bold text-gray-800 dark:text-gray-200">Michael Chen</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Legal Advisor, Property Solutions</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-xl rounded-3xl overflow-hidden">
                    <CardContent className="p-8">
                      <div className="mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400 inline mr-1" />
                        ))}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 italic text-lg leading-relaxed">
                        "Game-changing for our team. We can now provide instant responses to client queries."
                      </p>
                      <div>
                        <p className="font-bold text-gray-800 dark:text-gray-200">Emma Thompson</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Director, Urban Properties</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section - Dynamic Design */}
          <section className="py-20 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl md:text-6xl font-black mb-6">
                  Ready to Transform Your Property Business?
                </h2>
                <p className="text-xl mb-12 text-purple-100">
                  Fed up with bloated, complex and expensive systems?
                </p>
                
                <Button 
                  size="lg" 
                  className="bg-white text-purple-600 hover:bg-gray-100 px-12 py-6 text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
                >
                  <Sparkles className="mr-3 w-6 h-6" />
                  Start Today for Free
                </Button>

                <p className="text-sm text-purple-200 mt-6">
                  No credit card required • 18 free HEUs • Setup in under 2 minutes
                </p>
              </div>
            </div>
          </section>

        </main>

        {/* Floating Footer */}
        <footer className="py-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <OptimizedImage 
                src="/lovable-uploads/0fa56bb9-7c7d-4f95-a81f-36a7f584ed7a.png" 
                alt="Hobson AI Logo" 
                className="h-8 w-auto" 
              />
              <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                <Link to="/data-protection" className="hover:text-purple-600 transition-colors">
                  AI Privacy & Data Protection Policy
                </Link>
                <Link to="/contact" className="hover:text-purple-600 transition-colors">
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