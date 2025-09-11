import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { OptimizedImage } from "@/components/OptimizedImage";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  CheckCircle, 
  Users, 
  Clock, 
  ArrowRight, 
  FileText, 
  Sparkles, 
  Trophy, 
  Target, 
  Zap, 
  Award, 
  Mail, 
  Brain, 
  Rocket, 
  Shield,
  ChevronRight,
  Star,
  GraduationCap,
  Timer,
  Eye,
  AlertCircle
} from "lucide-react";
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

export const UseHobson4 = () => {
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
    if (selectedAnswer === "Casement") {
      setIsCorrect(true);
      setGameCompleted(true);
      setShowResult(true);
      setShowEmailForm(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#059669', '#10B981', '#34D399', '#6EE7B7']
      });
    } else {
      setShowResult(true);
      const explanation = termExplanations[selectedAnswer as keyof typeof termExplanations] || "";
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
        <title>Property Expert Assessment - Clean Quiz Interface | Hobson AI</title>
        <meta name="description" content="Test your property knowledge with our clean, professional quiz interface and unlock exclusive Hobson AI benefits." />
        <meta name="keywords" content="property assessment, legal quiz, Hobson AI, property expertise, professional quiz" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="Property Expert Assessment - Clean Quiz Interface" />
        <meta property="og:description" content="Test your property knowledge with our clean, professional quiz interface." />
        <link rel="canonical" href="https://hobsonschoice.ai/quiz3" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
        {/* Futuristic Background Effects */}
        <div className="absolute inset-0 bg-gradient-radial from-cyan-900/20 via-transparent to-purple-900/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(6, 182, 212, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)`
        }}></div>
        
        {/* Animated Grid Overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent animate-pulse"></div>
        </div>
        
        {/* Futuristic Header */}
        <header className="border-b border-cyan-400/20 bg-black/40 backdrop-blur-xl sticky top-0 z-50 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5"></div>
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between relative">
            <Link to="/" className="flex items-center gap-3 group">
              <OptimizedImage 
                src="/lovable-uploads/0fa56bb9-7c7d-4f95-a81f-36a7f584ed7a.png" 
                alt="Hobson AI Logo" 
                className="h-8 w-auto filter brightness-150 group-hover:brightness-200 transition-all duration-300" 
                priority 
              />
            </Link>
            <Badge className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 text-cyan-100 hover:from-cyan-500/30 hover:to-purple-500/30 transition-all duration-300">
              <GraduationCap className="w-4 h-4" />
              Neural Assessment
            </Badge>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12 relative z-10">
          {!gameStarted ? (
            /* Futuristic Landing Design */
            <div className="text-center space-y-8">
              {/* Cyber Hero Section */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 text-cyan-300 px-6 py-3 rounded-full text-sm font-medium border border-cyan-400/30 backdrop-blur-sm">
                  <Eye className="w-4 h-4" />
                  <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Neural Assessment Protocol</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">Property Knowledge</span>
                  <span className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">Neural Scan</span>
                </h1>
                
                <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                  Advanced AI-powered assessment system designed to evaluate your expertise in property terminology and unlock <span className="text-cyan-400 font-semibold">next-generation</span> Hobson AI features.
                </p>
              </div>

              {/* Futuristic Assessment Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <Card className="relative border border-cyan-400/30 bg-black/40 backdrop-blur-xl hover:border-cyan-400/50 transition-all duration-300 transform group-hover:scale-105">
                    <CardContent className="p-6 text-center space-y-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto border border-cyan-400/30">
                        <Timer className="w-6 h-6 text-cyan-400" />
                      </div>
                      <h3 className="font-semibold text-white">Quantum Speed</h3>
                      <p className="text-sm text-gray-400">Neural processing in 120 seconds</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <Card className="relative border border-purple-400/30 bg-black/40 backdrop-blur-xl hover:border-purple-400/50 transition-all duration-300 transform group-hover:scale-105">
                    <CardContent className="p-6 text-center space-y-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto border border-purple-400/30">
                        <Target className="w-6 h-6 text-purple-400" />
                      </div>
                      <h3 className="font-semibold text-white">AI Precision</h3>
                      <p className="text-sm text-gray-400">Advanced pattern recognition</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <Card className="relative border border-emerald-400/30 bg-black/40 backdrop-blur-xl hover:border-emerald-400/50 transition-all duration-300 transform group-hover:scale-105">
                    <CardContent className="p-6 text-center space-y-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-full flex items-center justify-center mx-auto border border-emerald-400/30">
                        <Award className="w-6 h-6 text-emerald-400" />
                      </div>
                      <h3 className="font-semibold text-white">Neural Rewards</h3>
                      <p className="text-sm text-gray-400">Unlock advanced protocols</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Cyber Challenge Brief */}
              <div className="relative max-w-2xl mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl blur-xl"></div>
                <Card className="relative border-l-4 border-l-amber-400 bg-gradient-to-r from-amber-500/5 to-orange-500/5 border border-amber-400/30 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0 border border-amber-400/30">
                        <AlertCircle className="w-5 h-5 text-amber-400" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-amber-200 mb-2">Neural Protocol Briefing</h3>
                        <p className="text-amber-100/80">
                          Identify which term is <strong className="text-amber-300">NOT</strong> commonly found in property lease documents. This neural scan tests your pattern recognition capabilities with standard property law terminology.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <Button 
                  size="lg" 
                  onClick={() => setGameStarted(true)}
                  className="relative bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white px-10 py-4 text-lg font-bold rounded-xl shadow-2xl border border-cyan-400/30 hover:border-cyan-300/50 transform hover:scale-105 transition-all duration-300 backdrop-blur-sm"
                >
                  <Zap className="mr-3 w-5 h-5" />
                  Initialize Neural Scan
                  <ChevronRight className="ml-3 w-5 h-5" />
                </Button>
              </div>
            </div>
          ) : (
            /* Futuristic Quiz Interface */
            <div className="space-y-8">
              {/* Cyber Progress Header */}
              <div className="text-center space-y-4">
                <Badge className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 text-cyan-100 backdrop-blur-sm">
                  <BookOpen className="w-4 h-4" />
                  Neural Scan Active
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Which term is <span className="text-red-400 animate-pulse">NOT</span> found in property leases?
                </h2>
                <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full w-1/3 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Futuristic Terms Selection */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl blur-xl"></div>
                <Card className="relative border border-cyan-400/30 bg-black/40 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-lg text-cyan-100 text-center flex items-center justify-center gap-2">
                      <Brain className="w-5 h-5 text-cyan-400" />
                      Select neural pattern match:
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {propertyTerms.map((term, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedAnswer(term)}
                          className={`group relative p-4 rounded-lg border-2 transition-all duration-300 text-left hover:scale-[1.02] ${
                            selectedAnswer === term
                              ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-cyan-400 text-cyan-100 shadow-lg shadow-cyan-400/20'
                              : 'bg-black/60 hover:bg-gray-900/80 border-gray-600 hover:border-cyan-400/50 text-gray-300 hover:text-cyan-100 backdrop-blur-sm'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{term}</span>
                            {selectedAnswer === term && (
                              <CheckCircle className="w-5 h-5 text-cyan-400 animate-pulse" />
                            )}
                          </div>
                          {selectedAnswer === term && (
                            <div className="absolute inset-0 border border-cyan-400 rounded-lg animate-pulse opacity-50"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Cyber Result Display */}
              {showResult && (
                <div className="relative group">
                  <div className={`absolute inset-0 rounded-xl blur-xl transition-all duration-500 ${
                    isCorrect 
                      ? 'bg-gradient-to-r from-emerald-500/30 to-teal-500/30' 
                      : 'bg-gradient-to-r from-red-500/30 to-pink-500/30'
                  }`}></div>
                  <Card className={`relative border-2 backdrop-blur-xl ${
                    isCorrect 
                      ? 'border-emerald-400/50 bg-gradient-to-br from-emerald-500/10 to-teal-500/10' 
                      : 'border-red-400/50 bg-gradient-to-br from-red-500/10 to-pink-500/10'
                  }`}>
                    <CardContent className="p-6 text-center">
                      {isCorrect ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-center gap-3">
                            <Trophy className="w-8 h-8 text-emerald-400 animate-bounce" />
                            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Neural Scan Complete!</span>
                          </div>
                          <p className="text-emerald-300 text-lg">
                            Excellence achieved! Neural patterns successfully recognized.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center justify-center gap-2 text-red-400">
                            <span className="text-xl font-semibold">Pattern mismatch detected</span>
                          </div>
                          <p className="text-red-300">
                            Neural recalibration required. Analyze lease document context patterns.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Cyber Action Buttons */}
              <div className="flex gap-4 justify-center">
                {!gameCompleted && (
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                    <Button 
                      onClick={handleAnswerSubmit}
                      disabled={!selectedAnswer}
                      className="relative bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white px-8 py-3 font-bold rounded-xl shadow-2xl border border-cyan-400/30 hover:border-cyan-300/50 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm transform hover:scale-105 transition-all duration-300"
                    >
                      Execute Neural Scan
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                )}
                {gameCompleted && (
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-500/20 to-slate-500/20 rounded-xl blur-xl"></div>
                    <Button 
                      onClick={resetGame}
                      className="relative bg-gradient-to-r from-gray-700 to-slate-800 hover:from-gray-600 hover:to-slate-700 text-white px-8 py-3 font-bold rounded-xl border border-gray-500/30 hover:border-gray-400/50 backdrop-blur-sm transform hover:scale-105 transition-all duration-300"
                    >
                      Reinitialize System
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>

        {/* Educational Popup */}
        <Dialog open={showEducationalPopup} onOpenChange={setShowEducationalPopup}>
          <DialogContent className="max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Learn More
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">"{selectedAnswer}"</h4>
                <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
                  {wrongAnswerExplanation}
                </p>
              </div>
              <Button 
                onClick={() => setShowEducationalPopup(false)} 
                className="w-full"
              >
                Continue Assessment
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Email Collection Dialog */}
        <Dialog open={showEmailForm} onOpenChange={setShowEmailForm}>
          <DialogContent className="max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                Unlock Professional Benefits
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Professional Access Unlocked
                  </h4>
                  <ul className="text-sm text-emerald-700 dark:text-emerald-300 space-y-1">
                    <li>• Advanced document analysis tools</li>
                    <li>• Priority customer support</li>
                    <li>• Exclusive property law updates</li>
                    <li>• Professional feature previews</li>
                  </ul>
                </div>
                
                <Input
                  type="email"
                  placeholder="Enter your professional email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={handleEmailSubmit}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Claim Benefits
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowEmailForm(false)}
                >
                  Skip
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Success State */}
        {rewardsUnlocked && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full bg-white dark:bg-gray-800 shadow-2xl">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto">
                  <Trophy className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Professional Benefits Unlocked!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Check your email for access details. Welcome to the professional tier!
                </p>
                <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                  <Shield className="w-4 h-4" />
                  <span>Verified Professional</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  );
};