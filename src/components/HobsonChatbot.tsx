import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, RotateCcw } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage, useContent } from '@/contexts/LanguageContext';
import owlMascotChat from '@/assets/owl-mascot-chat.png';
import owlChatBubble from '@/assets/owl-chat-bubble.png';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

type QuickQuestion = { full: string; short: string };

// Get 2 random FAQ questions for initial display
const getRandomQuickQuestions = (questions: readonly QuickQuestion[]) => {
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 2);
};

const getRandomFollowUpQuestion = (questions: readonly QuickQuestion[]) => {
  return questions[Math.floor(Math.random() * questions.length)].full;
};

export const HobsonChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [followUpQuestion, setFollowUpQuestion] = useState<string>('');
  const [quickQuestions, setQuickQuestions] = useState<Array<{full: string, short: string}>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const content = useContent();
  
  const isGerman = language === 'de';
  const chatbotContent = content.chatbot;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message and randomize quick questions when chat opens
      setMessages([
        {
          role: 'assistant',
          content: chatbotContent.welcomeMessage,
        },
      ]);
      setQuickQuestions(getRandomQuickQuestions(chatbotContent.quickQuestions));
    }
  }, [isOpen, chatbotContent.welcomeMessage, chatbotContent.quickQuestions]);

  // Prevent body scroll when chat is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  const handleQuickQuestion = (question: string) => {
    // Auto-send the question without setting input
    sendMessageWithText(question);
  };

  const sendMessageWithText = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage = text.trim();
    setInput(''); // Clear input field
    
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
        setFollowUpQuestion(getRandomFollowUpQuestion(chatbotContent.quickQuestions));
      } else {
        throw new Error('No response from AI');
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: chatbotContent.error,
        description: chatbotContent.errorDescription,
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
        title: chatbotContent.error,
        description: chatbotContent.errorDescription,
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
        content: chatbotContent.welcomeMessage,
      },
    ]);
    setQuickQuestions(getRandomQuickQuestions(chatbotContent.quickQuestions));
    toast({
      title: chatbotContent.clearChat,
      description: chatbotContent.clearChatDescription,
    });
  };

  // Render markdown with custom link handling
  const renderMessage = (content: string) => {
    return (
      <ReactMarkdown
        components={{
          // Custom link renderer for internal navigation
          a: ({ node, href, children, ...props }) => {
            if (href?.startsWith('/')) {
              // Internal link
              return (
                <button
                  className="text-primary hover:underline font-medium cursor-pointer inline"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(false);
                    
                    // Use navigate for React Router navigation
                    navigate(href);
                    
                    // Manually trigger hashchange event for pages that listen to it
                    setTimeout(() => {
                      window.dispatchEvent(new HashChangeEvent('hashchange'));
                    }, 50);
                  }}
                >
                  {children}
                </button>
              );
            }
            // External link
            return (
              <a
                href={href}
                className="text-primary hover:underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              >
                {children}
              </a>
            );
          },
          // Style lists
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside space-y-0.5 my-1" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside space-y-0.5 my-1" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="text-sm" {...props} />
          ),
          // Style paragraphs
          p: ({ node, ...props }) => (
            <p className="mb-1 last:mb-0" {...props} />
          ),
          // Style strong/bold
          strong: ({ node, ...props }) => (
            <strong className="font-semibold" {...props} />
          ),
          // Style emphasis/italic
          em: ({ node, ...props }) => (
            <em className="italic" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-transparent hover:scale-110 transition-all group p-0"
            aria-label="Open chat"
          >
            <img 
              src={owlChatBubble} 
              alt="Chat with Hobson" 
              className="w-[81px] h-[81px] sm:w-[101px] sm:h-[101px] drop-shadow-lg"
            />
            <span className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-background border border-border rounded-lg shadow-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block">
              {chatbotContent.tooltip}
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
              <h3 className="font-semibold text-foreground">{chatbotContent.title}</h3>
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
          <div className="flex-1 overflow-y-auto p-4 space-y-4 overscroll-contain touch-pan-y">
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
                {message.role === 'assistant' && index === 0 && messages.length === 1 && quickQuestions.length > 0 && (
                  <div className="flex flex-col gap-2 mt-4 px-2">
                    {quickQuestions.map((question, qIndex) => (
                      <button
                        key={qIndex}
                        onClick={() => handleQuickQuestion(question.full)}
                        disabled={isLoading}
                        className="bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-all disabled:opacity-50 shadow-sm hover:shadow text-left"
                      >
                        {question.full}
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Follow-up question - show after each answer except the welcome message */}
                {message.role === 'assistant' && index > 0 && index === messages.length - 1 && followUpQuestion && !isLoading && (
                  <div className="mt-3 px-2">
                    <button
                      onClick={() => handleQuickQuestion(followUpQuestion)}
                      disabled={isLoading}
                      className="bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-all disabled:opacity-50 shadow-sm hover:shadow w-full text-left"
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
                placeholder={chatbotContent.placeholder}
                disabled={isLoading}
                className="flex-1 text-base"
                style={{ fontSize: '16px' }}
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
