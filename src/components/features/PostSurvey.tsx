import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface PostSurveyProps {
  postId: string;
}

interface SurveyResponse {
  importance: number;
  timing: number;
  frequency: number;
}

const importanceOptions = [
  { value: 1, emoji: '😬', label: 'Not important' },
  { value: 2, emoji: '🥱', label: 'Nice to have' },
  { value: 3, emoji: '😃', label: 'Important' },
  { value: 4, emoji: '🤩', label: 'Essential' }
];

const timingOptions = [
  { value: 1, emoji: '😬', label: 'Never' },
  { value: 2, emoji: '🥱', label: 'Later' },
  { value: 3, emoji: '😃', label: 'Sooner' },
  { value: 4, emoji: '🤩', label: 'Right now' }
];

const frequencyOptions = [
  { value: 1, emoji: '😬', label: 'Never' },
  { value: 2, emoji: '🙂', label: 'Occasionally' },
  { value: 3, emoji: '😃', label: 'Regularly' },
  { value: 4, emoji: '🤩', label: 'Daily' }
];

export function PostSurvey({ postId }: PostSurveyProps) {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [responses, setResponses] = useState<Partial<SurveyResponse>>({});
  const [existingResponse, setExistingResponse] = useState<SurveyResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user && postId) {
      checkExistingResponse();
    }
  }, [user, postId]);

  const checkExistingResponse = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('feature_request_surveys')
        .select('importance, timing, frequency')
        .eq('feature_request_id', postId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setExistingResponse(data);
        setHasSubmitted(true);
      }
    } catch (error: any) {
      console.error('Error checking existing response:', error);
    }
  };

  const handleAnswer = (value: number) => {
    const newResponses = { ...responses };
    
    if (currentQuestion === 1) {
      newResponses.importance = value;
    } else if (currentQuestion === 2) {
      newResponses.timing = value;
    } else if (currentQuestion === 3) {
      newResponses.frequency = value;
    }
    
    setResponses(newResponses);

    if (currentQuestion < 3) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitSurvey({ ...newResponses, frequency: value } as SurveyResponse);
    }
  };

  const submitSurvey = async (finalResponses: SurveyResponse) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit your response.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('feature_request_surveys')
        .insert({
          feature_request_id: postId,
          user_id: user.id,
          importance: finalResponses.importance,
          timing: finalResponses.timing,
          frequency: finalResponses.frequency
        });

      if (error) throw error;

      setExistingResponse(finalResponses);
      setHasSubmitted(true);

      toast({
        title: "Thank you!",
        description: "Your feedback has been recorded.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit survey",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetSurvey = () => {
    setCurrentQuestion(1);
    setResponses({});
    setHasSubmitted(false);
  };

  if (!user) {
    return (
      <Card className="p-6 border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Help us prioritize this feature!</h3>
          <p className="text-muted-foreground">Sign in to share your feedback</p>
        </div>
      </Card>
    );
  }

  if (hasSubmitted && existingResponse) {
    return (
      <Card className="p-6 border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Your feedback</h3>
            <Button variant="ghost" size="sm" onClick={resetSurvey}>
              View questions again
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Importance</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">{importanceOptions[existingResponse.importance - 1].emoji}</span>
                <span className="font-medium">{importanceOptions[existingResponse.importance - 1].label}</span>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Timing</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">{timingOptions[existingResponse.timing - 1].emoji}</span>
                <span className="font-medium">{timingOptions[existingResponse.timing - 1].label}</span>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Frequency</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">{frequencyOptions[existingResponse.frequency - 1].emoji}</span>
                <span className="font-medium">{frequencyOptions[existingResponse.frequency - 1].label}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  const getCurrentQuestion = () => {
    switch (currentQuestion) {
      case 1:
        return {
          title: "How important is this to you?",
          options: importanceOptions
        };
      case 2:
        return {
          title: "When do you need this?",
          options: timingOptions
        };
      case 3:
        return {
          title: "How often would you use this?",
          options: frequencyOptions
        };
      default:
        return null;
    }
  };

  const question = getCurrentQuestion();
  if (!question) return null;

  return (
    <Card className="p-6 border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="space-y-6">
        <div className="text-center">
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step < currentQuestion
                    ? 'bg-primary text-primary-foreground'
                    : step === currentQuestion
                    ? 'bg-primary/20 text-primary border-2 border-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step < currentQuestion ? '✓' : step}
              </div>
            ))}
          </div>
          
          <h3 className="text-xl font-bold mb-2">{question.title}</h3>
          <p className="text-sm text-muted-foreground">Question {currentQuestion} of 3</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {question.options.map((option) => (
            <Button
              key={option.value}
              variant="outline"
              size="lg"
              onClick={() => handleAnswer(option.value)}
              disabled={isLoading}
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-primary/10 hover:border-primary transition-all duration-200"
            >
              <span className="text-3xl">{option.emoji}</span>
              <span className="text-sm font-medium">{option.label}</span>
            </Button>
          ))}
        </div>
        
        {currentQuestion > 1 && (
          <div className="flex justify-center">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
              disabled={isLoading}
            >
              ← Back
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}