import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import owlMascotChat from '@/assets/owl-mascot-chat.png';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const FOLLOW_UP_QUESTIONS = [
  "What can I do with Hobson?",
  "How do I get started?",
  "How do I work efficiently with Hobson?",
  "How should I structure my prompts for the best results?",
  "What should I do when I hit an error?",
  "Can Hobson connect to our systems?",
  "Can I control who has access?",
  "How can I improve answer quality?",
  "How long does onboarding take?",
  "Can I change data visibility?",
  "Can I delete documents or a workspace?",
  "What are Playbooks?",
  "Can my team collaborate?",
  "How do I share results?",
  "Can I connect Google Drive/SharePoint/Dropbox?",
  "Do you show usage analytics?",
  "Can I upload scans or images?",
  "Can I bulk import from cloud drives?",
  "Can I export my data?",
  "Can I see history/audit?",
  "Which file types are supported?",
  "Does Hobson work on mobile?",
  "How does Hobson remember context?",
  "Who owns the data and outputs?",
  "Is Hobson GDPR compliant?",
  "Where can I find Hobson's Privacy Policy and Terms of Service?",
  "What is Hobson's refund policy?",
];

const getRandomFollowUpQuestion = () => {
  return FOLLOW_UP_QUESTIONS[Math.floor(Math.random() * FOLLOW_UP_QUESTIONS.length)];
};

export const HobsonChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [followUpQuestion, setFollowUpQuestion] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message when chat opens
      setMessages([
        {
          role: 'assistant',
          content: "Hey there! What would you like me to check for you?",
        },
      ]);
    }
  }, [isOpen]);

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    // Auto-send the question
    sendMessageWithText(question);
  };

  const sendMessageWithText = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage = text.trim();
    
    // Add user message
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('hobson-chat', {
        body: { messages: newMessages },
      });

      if (error) {
        throw error;
      }

      const assistantMessage = data.choices?.[0]?.message?.content;
      
      if (assistantMessage) {
        setMessages([...newMessages, { role: 'assistant', content: assistantMessage }]);
        // Generate a new random follow-up question after the response
        setFollowUpQuestion(getRandomFollowUpQuestion());
      } else {
        throw new Error('No response from AI');
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: 'Error',
        description: 'Failed to get response. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('hobson-chat', {
        body: { messages: newMessages },
      });

      if (error) {
        throw error;
      }

      const assistantMessage = data.choices?.[0]?.message?.content;
      
      if (assistantMessage) {
        setMessages([...newMessages, { role: 'assistant', content: assistantMessage }]);
      } else {
        throw new Error('No response from AI');
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: 'Error',
        description: 'Failed to get response. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: "Hey there! What would you like me to check for you?",
      },
    ]);
    toast({
      title: 'Chat cleared',
      description: 'Starting fresh conversation',
    });
  };

  // Convert markdown-style links to HTML links
  const renderMessage = (content: string) => {
    // Convert [text](/link) to clickable links
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = content.split(linkRegex);
    
    return (
      <>
        {parts.map((part, index) => {
          // Every 3rd item starting from index 2 is a link URL
          if ((index - 2) % 3 === 0 && index > 0) {
            const text = parts[index - 1];
            const url = part;
            return (
              <a
                key={index}
                href={url}
                className="text-primary hover:underline font-medium"
                onClick={(e) => {
                  if (url.startsWith('/')) {
                    e.preventDefault();
                    window.location.href = url;
                    setIsOpen(false);
                  }
                }}
              >
                {text}
              </a>
            );
          }
          // Skip the text parts that are part of links
          if ((index - 1) % 3 === 0 && index > 0) {
            return null;
          }
          return <span key={index}>{part}</span>;
        })}
      </>
    );
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-3 sm:p-4 shadow-lg transition-all hover:scale-110 group"
            aria-label="Open chat"
          >
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-background border border-border rounded-lg shadow-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block">
              Need help? Chat with Hobson!
            </span>
          </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:bottom-6 sm:right-6 z-50 w-[95vw] sm:w-[380px] h-[85vh] sm:h-[500px] max-h-[600px] bg-background border border-border rounded-lg shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Hobson AI Help</h3>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={clearChat}
                className="h-8 w-8"
                title="Clear chat"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index}>
                <div
                  className={`flex items-start gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <img 
                      src={owlMascotChat} 
                      alt="Hobson Owl" 
                      className="w-16 h-auto object-contain flex-shrink-0"
                    />
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                        : 'bg-purple-50 dark:bg-purple-950/20 text-foreground rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {renderMessage(message.content)}
                    </p>
                  </div>
                </div>
                
                {/* Quick action buttons - only show after welcome message */}
                {message.role === 'assistant' && index === 0 && messages.length === 1 && (
                  <div className="grid grid-cols-2 gap-2 mt-4 px-2">
                    <button
                      onClick={() => handleQuickQuestion('Tell me about pricing and HEUs')}
                      disabled={isLoading}
                      className="bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-all disabled:opacity-50 shadow-sm hover:shadow"
                    >
                      Pricing & HEUs?
                    </button>
                    <button
                      onClick={() => handleQuickQuestion('How does Hobson work?')}
                      disabled={isLoading}
                      className="bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-all disabled:opacity-50 shadow-sm hover:shadow"
                    >
                      How it works?
                    </button>
                    <button
                      onClick={() => handleQuickQuestion('Tell me about security')}
                      disabled={isLoading}
                      className="bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-all disabled:opacity-50 shadow-sm hover:shadow"
                    >
                      Security?
                    </button>
                    <button
                      onClick={() => handleQuickQuestion('What document types do you support?')}
                      disabled={isLoading}
                      className="bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-all disabled:opacity-50 shadow-sm hover:shadow"
                    >
                      Document types?
                    </button>
                  </div>
                )}
                
                {/* Follow-up question - show after each answer except the welcome message */}
                {message.role === 'assistant' && index > 0 && index === messages.length - 1 && followUpQuestion && !isLoading && (
                  <div className="mt-3 px-2">
                    <button
                      onClick={() => handleQuickQuestion(followUpQuestion)}
                      disabled={isLoading}
                      className="bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-all disabled:opacity-50 shadow-sm hover:shadow w-full text-left"
                    >
                      {followUpQuestion}
                    </button>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-2 justify-start">
                <img 
                  src={owlMascotChat} 
                  alt="Hobson Owl" 
                  className="w-16 h-auto object-contain flex-shrink-0"
                />
                <div className="bg-purple-50 dark:bg-purple-950/20 text-foreground rounded-2xl rounded-bl-sm px-4 py-3">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about Hobson AI..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
