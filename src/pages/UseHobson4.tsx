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

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-800">
        {/* Clean Header */}
        <header className="border-b border-slate-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <OptimizedImage 
                src="/lovable-uploads/0fa56bb9-7c7d-4f95-a81f-36a7f584ed7a.png" 
                alt="Hobson AI Logo" 
                className="h-8 w-auto" 
                priority 
              />
            </Link>
            <Badge variant="secondary" className="hidden sm:flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Expert Assessment
            </Badge>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
          {!gameStarted ? (
            /* Clean Landing Design */
            <div className="text-center space-y-8">
              {/* Hero Section */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-medium border border-emerald-200 dark:border-emerald-800">
                  <Eye className="w-4 h-4" />
                  Professional Assessment
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                  Property Knowledge
                  <span className="block text-emerald-600 dark:text-emerald-400">Assessment</span>
                </h1>
                
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                  Demonstrate your expertise in property terminology and unlock access to advanced Hobson AI features designed for professionals.
                </p>
              </div>

              {/* Assessment Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <Card className="border border-slate-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center space-y-3">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
                      <Timer className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Quick Assessment</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Complete in under 2 minutes</p>
                  </CardContent>
                </Card>

                <Card className="border border-slate-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center space-y-3">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto">
                      <Target className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Expert Level</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Professional terminology focus</p>
                  </CardContent>
                </Card>

                <Card className="border border-slate-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center space-y-3">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto">
                      <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Unlock Benefits</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Access professional features</p>
                  </CardContent>
                </Card>
              </div>

              {/* Challenge Brief */}
              <Card className="max-w-2xl mx-auto border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-amber-900 dark:text-amber-200 mb-2">Assessment Task</h3>
                      <p className="text-amber-800 dark:text-amber-300">
                        Identify which term is <strong>NOT</strong> commonly found in property lease documents. This assessment tests your familiarity with standard property law terminology.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Button 
                size="lg" 
                onClick={() => setGameStarted(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Begin Assessment
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          ) : (
            /* Clean Quiz Interface */
            <div className="space-y-8">
              {/* Progress Header */}
              <div className="text-center space-y-4">
                <Badge variant="outline" className="inline-flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Assessment in Progress
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Which term is <span className="text-red-500">NOT</span> found in property leases?
                </h2>
              </div>

              {/* Terms Selection Grid */}
              <Card className="border border-slate-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-800 dark:text-gray-200 text-center">
                    Select your answer from the terms below:
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {propertyTerms.map((term, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedAnswer(term)}
                        className={`group p-4 rounded-lg border-2 transition-all duration-200 text-left hover:scale-[1.02] ${
                          selectedAnswer === term
                            ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                            : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{term}</span>
                          {selectedAnswer === term && (
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Result Display */}
              {showResult && (
                <Card className={`border-2 ${
                  isCorrect 
                    ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20' 
                    : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
                }`}>
                  <CardContent className="p-6 text-center">
                    {isCorrect ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-center gap-3 text-emerald-700 dark:text-emerald-300">
                          <Trophy className="w-8 h-8" />
                          <span className="text-2xl font-bold">Assessment Complete!</span>
                        </div>
                        <p className="text-emerald-600 dark:text-emerald-400 text-lg">
                          Excellent! You've demonstrated professional-level property knowledge.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-center gap-2 text-red-700 dark:text-red-300">
                          <span className="text-xl font-semibold">Not quite right</span>
                        </div>
                        <p className="text-red-600 dark:text-red-400">
                          Please review and try again. Consider the context of lease documents.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                {!gameCompleted && (
                  <Button 
                    onClick={handleAnswerSubmit}
                    disabled={!selectedAnswer}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 font-semibold rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Assessment
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                )}
                {gameCompleted && (
                  <Button 
                    onClick={resetGame}
                    variant="outline"
                    className="px-8 py-3 font-semibold rounded-lg border-2"
                  >
                    Retake Assessment
                  </Button>
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