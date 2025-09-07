import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from "@/components/OptimizedImage";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Star, CheckCircle, Users, Clock, ArrowRight, FileText, Sparkles, Trophy, Target, Zap, Award, RotateCcw } from "lucide-react";
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

// Calculate angle for each segment
const segmentAngle = 360 / propertyTerms.length;

export const UseHobson3 = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [attempts, setAttempts] = useState(3);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [finalRotation, setFinalRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  const spinWheel = () => {
    if (isSpinning || gameCompleted) return;
    
    setIsSpinning(true);
    setShowResult(false);
    
    // Calculate spins and final position
    const spins = 3 + Math.random() * 5; // 3-8 full rotations
    const targetIndex = Math.random() < 0.3 ? 3 : Math.floor(Math.random() * propertyTerms.length); // 30% chance to land on "Casement" (index 3)
    const targetAngle = targetIndex * segmentAngle;
    const totalRotation = spins * 360 + targetAngle;
    
    setFinalRotation(totalRotation);
    
    if (wheelRef.current) {
      wheelRef.current.style.transform = `rotate(${totalRotation}deg)`;
    }
    
    // Stop spinning after 3 seconds
    setTimeout(() => {
      setIsSpinning(false);
      checkResult(targetIndex);
    }, 3000);
  };

  const checkResult = (landedIndex: number) => {
    const landedTerm = propertyTerms[landedIndex];
    
    if (landedTerm === "Casement") {
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
    setIsSpinning(false);
    setAttempts(3);
    setGameCompleted(false);
    setShowResult(false);
    setIsCorrect(false);
    setFinalRotation(0);
    if (wheelRef.current) {
      wheelRef.current.style.transform = 'rotate(0deg)';
    }
  };

  return (
    <>
      <Helmet>
        <title>Spin to Win Property Challenge - Hobson AI | Test Your Expertise</title>
        <meta name="description" content="Spin the wheel and test your property law knowledge! Land on the correct answer to unlock exclusive Hobson AI benefits." />
        <meta name="keywords" content="property law, wheel game, Hobson AI, property expertise, legal challenge" />
        <meta property="og:title" content="Spin to Win Property Challenge - Hobson AI" />
        <meta property="og:description" content="Spin the wheel and test your property law knowledge! Land on the correct answer to unlock exclusive benefits." />
        <link rel="canonical" href="https://hobsonschoice.ai/usehobson3" />
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
                <span>Spin to Win: Property Expert Challenge - Land on the Right Answer!</span>
                <Trophy className="w-4 h-4 text-primary" />
              </div>
            </div>
          </div>

          {/* Hero/Game Section */}
          <section className="pt-16 pb-20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <Badge variant="secondary" className="mb-6 px-4 py-2">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Spin the Wheel Challenge
                </Badge>
                
                <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
                  Spin Your Way to
                  <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent block mt-2">
                    Property Mastery
                  </span>
                </h1>
                
                <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
                  Test your luck and knowledge! Spin the wheel to find the term NOT found in property leases and unlock exclusive rewards.
                </p>

                {!gameStarted ? (
                  <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8 mb-8 border">
                    <div className="flex items-center justify-center gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <RotateCcw className="w-5 h-5 text-primary" />
                        <span className="text-lg font-semibold">Spin to Win</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-primary" />
                        <span className="text-lg font-semibold">Unlock Rewards</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Property Wheel of Fortune</h3>
                    <p className="text-muted-foreground mb-6">
                      Spin the wheel and try to land on the term that is <strong>NOT</strong> found in property leases. You have 3 spins to get it right!
                    </p>
                    <Button 
                      size="lg" 
                      onClick={() => setGameStarted(true)}
                      className="text-lg px-12 py-6 bg-primary hover:bg-primary/90"
                    >
                      Start Spinning
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                ) : (
                  <div className="bg-background rounded-2xl p-8 border shadow-lg mb-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold">Spin to find the term NOT found in property leases!</h3>
                      <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        <span className="text-sm font-semibold">Spins: {attempts}/3</span>
                      </div>
                    </div>
                    
                    {/* Spinning Wheel */}
                    <div className="relative mx-auto mb-8" style={{ width: '320px', height: '320px' }}>
                      {/* Pointer */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10">
                        <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-b-[30px] border-l-transparent border-r-transparent border-b-primary"></div>
                      </div>
                      
                      {/* Wheel */}
                      <div 
                        ref={wheelRef}
                        className={`w-80 h-80 rounded-full border-4 border-primary relative overflow-hidden ${
                          isSpinning ? 'transition-transform duration-[3000ms] ease-out' : 'transition-transform duration-500ms'
                        }`}
                        style={{
                          background: `conic-gradient(${propertyTerms.map((_, index) => 
                            `hsl(var(--primary) / ${0.1 + (index % 2) * 0.1}) ${index * segmentAngle}deg ${(index + 1) * segmentAngle}deg`
                          ).join(', ')})`
                        }}
                      >
                        {propertyTerms.map((term, index) => (
                          <div
                            key={index}
                            className="absolute flex items-center justify-center text-xs font-semibold text-foreground"
                            style={{
                              top: '50%',
                              left: '50%',
                              width: '140px',
                              height: '20px',
                              transform: `translate(-50%, -50%) rotate(${index * segmentAngle + segmentAngle/2}deg) translateX(100px)`,
                              transformOrigin: 'center'
                            }}
                          >
                            <span style={{ transform: `rotate(-${index * segmentAngle + segmentAngle/2}deg)` }}>
                              {term}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {showResult && (
                      <div className={`p-4 rounded-lg mb-4 ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                        {isCorrect ? (
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-2 text-green-700 font-semibold mb-2">
                              <Trophy className="w-5 h-5" />
                              Jackpot! You landed on the right answer!
                            </div>
                            <p className="text-green-600 text-sm">
                              "Casement" refers to a type of window, not a property lease term. Perfect spin!
                            </p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <p className="text-red-700 font-semibold mb-1">
                              {attempts > 0 ? 'Not the right spot. Spin again!' : 'Game over! The target was "Casement"'}
                            </p>
                            <p className="text-red-600 text-sm">
                              {attempts > 0 ? `You have ${attempts} spins remaining.` : '"Casement" is a type of window, not a property lease term.'}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      {!gameCompleted && (
                        <Button 
                          onClick={spinWheel}
                          disabled={isSpinning}
                          className="min-w-[150px]"
                        >
                          {isSpinning ? 'Spinning...' : 'Spin the Wheel!'}
                          <RotateCcw className={`ml-2 w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
                        </Button>
                      )}
                      {gameCompleted && (
                        <Button 
                          onClick={resetGame}
                          variant="outline"
                          className="min-w-[150px]"
                        >
                          Spin Again
                          <RotateCcw className="ml-2 w-5 h-5" />
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
                      <h3 className="text-2xl font-bold text-green-800">Jackpot Winner!</h3>
                    </div>
                    <p className="text-green-700 mb-6">
                      You spun your way to victory! Claim your exclusive rewards below:
                    </p>
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-white rounded-lg p-4 border border-green-200">
                        <div className="text-center">
                          <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
                          <h4 className="font-semibold text-green-800">2,500 Free HEUs</h4>
                          <p className="text-sm text-green-600">Winner's bonus</p>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-green-200">
                        <div className="text-center">
                          <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
                          <h4 className="font-semibold text-green-800">Wheel Master Badge</h4>
                          <p className="text-sm text-green-600">Lucky champion status</p>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-green-200">
                        <div className="text-center">
                          <FileText className="w-8 h-8 text-primary mx-auto mb-2" />
                          <h4 className="font-semibold text-green-800">VIP Support</h4>
                          <p className="text-sm text-green-600">Priority assistance</p>
                        </div>
                      </div>
                    </div>
                    <Button size="lg" className="text-lg px-12 py-6 bg-green-600 hover:bg-green-700 text-white">
                      Claim Your Jackpot Rewards
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
                  <h2 className="text-4xl font-bold mb-6">Your Spinning Journey</h2>
                  <p className="text-xl text-muted-foreground">
                    Spin your way to property AI mastery with gamified learning
                  </p>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                  <Card className={`p-6 text-center ${(gameCompleted && isCorrect) ? 'border-green-500 bg-green-50' : ''}`}>
                    <CardContent className="space-y-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
                        (gameCompleted && isCorrect) ? 'bg-green-500 text-white' : 'bg-primary/10'
                      }`}>
                        {(gameCompleted && isCorrect) ? <CheckCircle className="w-6 h-6" /> : <RotateCcw className="w-6 h-6 text-primary" />}
                      </div>
                      <h3 className="text-lg font-semibold">Level 1: Lucky Spin</h3>
                      <p className="text-sm text-muted-foreground">
                        Land on the right answer
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
                      <h3 className="text-lg font-semibold">Level 2: Document Spin</h3>
                      <p className="text-sm text-muted-foreground">
                        Upload and analyze documents
                      </p>
                      <Badge variant="outline">Locked</Badge>
                    </CardContent>
                  </Card>

                  <Card className="p-6 text-center opacity-60">
                    <CardContent className="space-y-4">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
                        <Users className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold">Level 3: AI Wheel</h3>
                      <p className="text-sm text-muted-foreground">
                        Master AI-powered insights
                      </p>
                      <Badge variant="outline">Locked</Badge>
                    </CardContent>
                  </Card>

                  <Card className="p-6 text-center opacity-60">
                    <CardContent className="space-y-4">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
                        <Trophy className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold">Level 4: Spin Master</h3>
                      <p className="text-sm text-muted-foreground">
                        Ultimate wheel champion
                      </p>
                      <Badge variant="outline">Locked</Badge>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-20 bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl font-bold mb-6">
                  Ready to Spin Into Success?
                </h2>
                <p className="text-xl text-muted-foreground mb-12">
                  Join the winning circle of property professionals using AI-powered document analysis.
                </p>
                
                <Button size="lg" className="text-lg px-12 py-6 bg-primary hover:bg-primary/90">
                  {gameCompleted && isCorrect ? 'Claim Your Jackpot Account' : 'Start Your Lucky Journey'}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>

                <p className="text-sm text-muted-foreground mt-6">
                  {gameCompleted && isCorrect 
                    ? 'Wheel Master status • 2,500 Free HEUs • VIP support included'
                    : 'Spin the wheel to unlock winner benefits'
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