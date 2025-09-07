import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from "@/components/OptimizedImage";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Star, CheckCircle, Users, Clock, ArrowRight, FileText, Sparkles, Trophy, Target, Zap, Award } from "lucide-react";
import confetti from 'canvas-confetti';

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

export const UseHobson2 = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [attempts, setAttempts] = useState(3);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleAnswerSubmit = () => {
    if (selectedAnswer === "Casement") {
      setIsCorrect(true);
      setGameCompleted(true);
      setShowResult(true);
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#A855F7', '#C084FC', '#DDD6FE']
      });
    } else {
      setAttempts(prev => prev - 1);
      setShowResult(true);
      if (attempts <= 1) {
        setGameCompleted(true);
      }
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setSelectedAnswer("");
    setAttempts(3);
    setGameCompleted(false);
    setShowResult(false);
    setIsCorrect(false);
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
              <nav className="hidden md:flex items-center gap-6">
                <Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </nav>
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
                      Find the term that is <strong>NOT</strong> found in property leases. You have 3 attempts to get it right!
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
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold">Which term is NOT found in property leases?</h3>
                      <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        <span className="text-sm font-semibold">Attempts: {attempts}/3</span>
                      </div>
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
                            <p className="text-green-600 text-sm">
                              "Casement" refers to a type of window, not a property lease term. Well done!
                            </p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <p className="text-red-700 font-semibold mb-1">
                              {attempts > 0 ? 'Not quite right. Try again!' : 'Challenge complete! The answer was "Casement"'}
                            </p>
                            <p className="text-red-600 text-sm">
                              {attempts > 0 ? `You have ${attempts} attempts remaining.` : '"Casement" is a type of window, not a property lease term.'}
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

                {/* Reward Section */}
                {(gameCompleted && isCorrect) && (
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

          {/* Progress Tracking */}
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold mb-6">Your Property AI Journey</h2>
                  <p className="text-xl text-muted-foreground">
                    Level up your practice with AI-powered property document analysis
                  </p>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                  <Card className={`p-6 text-center ${(gameCompleted && isCorrect) ? 'border-green-500 bg-green-50' : ''}`}>
                    <CardContent className="space-y-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
                        (gameCompleted && isCorrect) ? 'bg-green-500 text-white' : 'bg-primary/10'
                      }`}>
                        {(gameCompleted && isCorrect) ? <CheckCircle className="w-6 h-6" /> : <Target className="w-6 h-6 text-primary" />}
                      </div>
                      <h3 className="text-lg font-semibold">Level 1: Expert Test</h3>
                      <p className="text-sm text-muted-foreground">
                        Prove your property knowledge
                      </p>
                      <Badge variant={gameCompleted && isCorrect ? "default" : "secondary"}>
                        {gameCompleted && isCorrect ? "Complete" : "Current"}
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card className="p-6 text-center opacity-60">
                    <CardContent className="space-y-4">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
                        <FileText className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold">Level 2: First Upload</h3>
                      <p className="text-sm text-muted-foreground">
                        Upload your first document
                      </p>
                      <Badge variant="outline">Locked</Badge>
                    </CardContent>
                  </Card>

                  <Card className="p-6 text-center opacity-60">
                    <CardContent className="space-y-4">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
                        <Users className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold">Level 3: AI Insights</h3>
                      <p className="text-sm text-muted-foreground">
                        Get 10 AI-powered answers
                      </p>
                      <Badge variant="outline">Locked</Badge>
                    </CardContent>
                  </Card>

                  <Card className="p-6 text-center opacity-60">
                    <CardContent className="space-y-4">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
                        <Trophy className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold">Level 4: Power User</h3>
                      <p className="text-sm text-muted-foreground">
                        Master all features
                      </p>
                      <Badge variant="outline">Locked</Badge>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* Leaderboard Teaser */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold mb-6">Property Professional Rankings</h2>
                  <p className="text-xl text-muted-foreground">
                    See how you compare with other property experts
                  </p>
                </div>

                <Card className="p-8">
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between py-3 border-b">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                          <div>
                            <p className="font-semibold">Sarah M.</p>
                            <p className="text-sm text-muted-foreground">Commercial Property Specialist</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">15,420 HEUs</p>
                          <p className="text-sm text-muted-foreground">Level 12</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between py-3 border-b">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                          <div>
                            <p className="font-semibold">James K.</p>
                            <p className="text-sm text-muted-foreground">Residential Property Manager</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">12,180 HEUs</p>
                          <p className="text-sm text-muted-foreground">Level 10</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between py-3 border-b">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                          <div>
                            <p className="font-semibold">Emma L.</p>
                            <p className="text-sm text-muted-foreground">Property Solicitor</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">9,850 HEUs</p>
                          <p className="text-sm text-muted-foreground">Level 8</p>
                        </div>
                      </div>

                      {(gameCompleted && isCorrect) && (
                        <div className="flex items-center justify-between py-3 bg-primary/5 rounded-lg px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">?</div>
                            <div>
                              <p className="font-semibold">You (New Expert!)</p>
                              <p className="text-sm text-muted-foreground">Property Professional</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">2,000 HEUs</p>
                            <p className="text-sm text-muted-foreground">Level 1</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-20 bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl font-bold mb-6">
                  Ready to Dominate Property Document Analysis?
                </h2>
                <p className="text-xl text-muted-foreground mb-12">
                  Join the elite group of property professionals using AI to accelerate their practice.
                </p>
                
                <Button size="lg" className="text-lg px-12 py-6 bg-primary hover:bg-primary/90">
                  {gameCompleted && isCorrect ? 'Claim Your Expert Account' : 'Start Your Journey'}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>

                <p className="text-sm text-muted-foreground mt-6">
                  {gameCompleted && isCorrect 
                    ? 'Expert status • 2,000 Free HEUs • Priority support included'
                    : 'Complete the challenge to unlock expert benefits'
                  }
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