import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, RotateCcw } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import owlMascotChat from '@/assets/owl-mascot-chat.png';
import owlChatBubble from '@/assets/owl-chat-bubble.png';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// FAQ questions from ALL sections in /learn/faq
// Mix questions from "How Hobson works", "Getting the best out of Hobson", and "Hobson Credits"
const FAQ_QUESTIONS = [
  // How Hobson works
  { full: "How are units, groups, portfolios, and documents arranged in Hobson?", short: "Organization?" },
  { full: "Which file types are supported?", short: "File types?" },
  { full: "What types of documents can Hobson read?", short: "Doc types?" },
  { full: "How to get documents to Hobson", short: "Upload docs?" },
  { full: "Does Hobson work on mobile?", short: "Mobile?" },
  { full: "Who owns the data and outputs?", short: "Data ownership?" },
  { full: "How does Hobson use OpenAI?", short: "OpenAI usage?" },
  { full: "Does OpenAI store my documents?", short: "Storage?" },
  { full: "Does OpenAI use my data to train their models?", short: "Training?" },
  { full: "What data does Hobson send to OpenAI?", short: "Data sent?" },
  { full: "Where are my documents actually stored?", short: "Storage?" },
  { full: "Why does Hobson need to send anything to OpenAI at all?", short: "Why OpenAI?" },
  { full: "Who can see my documents?", short: "Access?" },
  { full: "How does Hobson protect my data when using OpenAI?", short: "Protection?" },
  { full: "Does OpenAI know who I am or hold details of my property holdings?", short: "Privacy?" },
  { full: "What happens technically when a document is uploaded?", short: "Upload process?" },
  { full: "What happens when I ask a question?", short: "Question process?" },
  // Getting the best out of Hobson
  { full: "How long does Hobson take to read a document?", short: "Processing time?" },
  { full: "Can Hobson be trained on my company's information?", short: "Training?" },
  { full: "Can I add a unit manually without uploading a document?", short: "Manual units?" },
  { full: "Which level should I use when asking a question?", short: "Question levels?" },
  { full: "What should I do if I get a poor answer?", short: "Poor answers?" },
  { full: "How should I structure my prompts for the best results?", short: "Prompt tips?" },
  { full: "Can Hobson connect to our systems?", short: "Integrations?" },
  { full: "Can I control who has access?", short: "Access control?" },
  // Hobson Credits
  { full: "What is a HEU?", short: "HEU?" },
  { full: "How much do different tasks cost in HEUs?", short: "HEU costs?" },
  { full: "How can I upgrade my subscription?", short: "Upgrade?" },
  { full: "How can I downgrade my subscription?", short: "Downgrade?" },
  { full: "How can I cancel my subscription?", short: "Cancel?" },
  { full: "How can I change my billing information?", short: "Billing?" },
  { full: "How do I download my invoices?", short: "Invoices?" },
  { full: "How do I get more credits?", short: "More credits?" },
  { full: "When does my credit limit reset?", short: "Credit reset?" },
  { full: "How do I see the remaining credits in a workspace?", short: "Check credits?" },
  { full: "Can I get free credits?", short: "Free credits?" },
];

// Get 2 random FAQ questions for initial display
const getRandomQuickQuestions = () => {
  const shuffled = [...FAQ_QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 2);
};

const FOLLOW_UP_QUESTIONS = [
  // How Hobson works
  "How are units, groups, portfolios, and documents arranged in Hobson?",
  "Which file types are supported?",
  "What types of documents can Hobson read?",
  "How to get documents to Hobson",
  "Does Hobson work on mobile?",
  "Who owns the data and outputs?",
  "How does Hobson use OpenAI?",
  "Does OpenAI store my documents?",
  "Does OpenAI use my data to train their models?",
  "What data does Hobson send to OpenAI?",
  "Where are my documents actually stored?",
  "Why does Hobson need to send anything to OpenAI at all?",
  "Who can see my documents?",
  "How does Hobson protect my data when using OpenAI?",
  "Does OpenAI know who I am or hold details of my property holdings?",
  "What happens technically when a document is uploaded?",
  "What happens when I ask a question?",
  // Getting the best out of Hobson
  "How long does Hobson take to read a document?",
  "Can Hobson be trained on my company's information?",
  "Can I add a unit manually without uploading a document?",
  "Which level should I use when asking a question?",
  "What should I do if I get a poor answer?",
  "How should I structure my prompts for the best results?",
  "Can Hobson connect to our systems?",
  "Can I control who has access?",
  // Hobson Credits
  "What is a HEU?",
  "How much do different tasks cost in HEUs?",
  "How can I upgrade my subscription?",
  "How can I downgrade my subscription?",
  "How can I cancel my subscription?",
  "How can I change my billing information?",
  "How do I download my invoices?",
  "How do I get more credits?",
  "When does my credit limit reset?",
  "How do I see the remaining credits in a workspace?",
  "Can I get free credits?",
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
  const [quickQuestions, setQuickQuestions] = useState<Array<{full: string, short: string}>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

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
          content: "Hey there! What would you like to know about?",
        },
      ]);
      setQuickQuestions(getRandomQuickQuestions());
    }
  }, [isOpen]);

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
        content: "Hey there! What would you like to know about?",
      },
    ]);
    setQuickQuestions(getRandomQuickQuestions()); // Refresh questions on clear
    toast({
      title: 'Chat cleared',
      description: 'Starting fresh conversation',
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
            <ul className="list-disc list-inside space-y-1 my-2" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside space-y-1 my-2" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="text-sm" {...props} />
          ),
          // Style paragraphs
          p: ({ node, ...props }) => (
            <p className="mb-2 last:mb-0" {...props} />
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
                placeholder="Ask about Hobson AI..."
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
